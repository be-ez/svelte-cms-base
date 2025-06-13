# Stage 1: Image processor - processes images from Directus
FROM node:22-alpine AS image-processor
ARG DIRECTUS_API_URL
ARG DIRECTUS_TOKEN
ENV DIRECTUS_API_URL=${DIRECTUS_API_URL}
ENV DIRECTUS_TOKEN=${DIRECTUS_TOKEN}

WORKDIR /app

# Install pnpm first
RUN npm install -g pnpm

# Copy only what's needed for image processing
COPY package*.json pnpm-lock.yaml ./
COPY .pnpmfile.cjs ./

# Install dependencies (this layer will be cached if package.json doesn't change)
RUN pnpm install --frozen-lockfile

# Copy the standalone image processing script
COPY scripts/process-images-standalone.cjs ./scripts/

# Create static directory structure first
RUN mkdir -p static/images/processed

# Run the image processing (this will be cached if Directus content hasn't changed)
RUN node scripts/process-images-standalone.cjs

# Verify the images were created
RUN ls -la static/images/processed/ | head -5

# Stage 2: Build the application
FROM node:22-alpine AS build
ARG PROCESSED_IMAGES_TAG
ARG DIRECTUS_API_URL
ARG DIRECTUS_TOKEN
ENV DIRECTUS_API_URL=${DIRECTUS_API_URL}
ENV DIRECTUS_TOKEN=${DIRECTUS_TOKEN}

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files and install dependencies
COPY package*.json pnpm-lock.yaml ./
COPY .pnpmfile.cjs ./
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code first
COPY . .

# Copy processed images from the registry-cached image processor
COPY --from=image-processor /app/static ./static

# Verify images were copied
RUN echo "📊 Images copied from stage 1:" && ls -la static/images/processed/ | wc -l

# Skip image processing during build since we already have the images
ENV SKIP_IMAGE_PROCESSING=true

# Build the application (using build:only to skip image processing)
RUN pnpm run build:only && node scripts/copy-static-assets.js

# Verify final build has images
RUN echo "📊 Final build images:" && ls -la build/images/processed/ | wc -l

# Stage 3: Production
FROM nginx:alpine

# Accept Cloudflare environment variables for cache purging
ARG CLOUDFLARE_TOKEN
ARG CLOUDFLARE_ZONE_ID
ENV CLOUDFLARE_TOKEN=${CLOUDFLARE_TOKEN}
ENV CLOUDFLARE_ZONE_ID=${CLOUDFLARE_ZONE_ID}

# Install curl for Cloudflare cache purging
RUN apk add --no-cache curl

# Copy the cache purge script
COPY scripts/purge-cloudflare-cache.sh /usr/local/bin/purge-cache
RUN chmod +x /usr/local/bin/purge-cache

# Copy the built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the nginx configuration
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]