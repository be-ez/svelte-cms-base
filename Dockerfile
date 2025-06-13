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

# Copy only the image processing related files
COPY src/lib/directus.ts ./src/lib/
COPY src/lib/image-config.ts ./src/lib/
COPY src/lib/image-pipeline.ts ./src/lib/

# Create a standalone script to run image processing
RUN echo '#!/usr/bin/env node\n\
import { buildImagePipeline } from "./src/lib/image-pipeline.js";\n\
\n\
const DIRECTUS_API_URL = process.env.DIRECTUS_API_URL;\n\
const DIRECTUS_TOKEN = process.env.DIRECTUS_TOKEN;\n\
\n\
if (!DIRECTUS_API_URL || !DIRECTUS_TOKEN) {\n\
  console.error("Missing DIRECTUS_API_URL or DIRECTUS_TOKEN");\n\
  process.exit(1);\n\
}\n\
\n\
console.log("🖼️  Processing images from Directus...");\n\
buildImagePipeline(DIRECTUS_API_URL, DIRECTUS_TOKEN)\n\
  .then(() => {\n\
    console.log("✅ Image processing complete!");\n\
  })\n\
  .catch(error => {\n\
    console.error("❌ Image processing failed:", error);\n\
    process.exit(1);\n\
  });' > process-images.mjs

# Create static directory structure and run image processing
RUN mkdir -p static/images/processed && \
    node process-images.mjs

# Stage 2: Build the application
FROM node:22-alpine AS build
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

# Copy processed images from the previous stage
COPY --from=image-processor /app/static ./static

# Copy the rest of the application code
COPY . .

# Skip image processing during build since we already have the images
ENV SKIP_IMAGE_PROCESSING=true

# Build the application (using build:only to skip image processing)
RUN pnpm run build:only && node scripts/copy-static-assets.js

# Stage 3: Production
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the nginx configuration
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]