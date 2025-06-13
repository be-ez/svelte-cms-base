# Stage 1: Complete build (x86 only) - handles image processing and static site generation
FROM node:22-alpine AS complete-build
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

# Copy all application code
COPY . .

# Build everything - process images and generate static site
RUN pnpm run build && node scripts/copy-static-assets.js

# Verify final build output
RUN echo "📊 Complete build generated:" && ls -la build/ | wc -l
RUN echo "📊 Build images:" && ls -la build/images/processed/ | wc -l

# Stage 2: Production
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

# Copy the complete build from the x86 complete-build context (registry or local stage)
COPY --from=complete-build /app/build /usr/share/nginx/html

# Copy the nginx configuration
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]