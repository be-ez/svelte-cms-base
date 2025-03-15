# Build stage
FROM node:22-alpine AS build
# set the argument default
ARG DIRECTUS_API_URL
ARG DIRECTUS_API_TOKEN
ENV DIRECTUS_API_URL=${DIRECTUS_API_URL}
ENV DIRECTUS_API_TOKEN=${DIRECTUS_API_TOKEN}

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY pnpm-lock.yaml ./

# Install dependencies
RUN npm install -g pnpm
RUN pnpm install

# Copy the rest of the application
COPY . .

# Build the application
RUN pnpm run build

# Production stage
FROM nginx:alpine

# Copy the built files from the build stage
COPY --from=build /app/build /usr/share/nginx/html

# Copy the nginx configuration
COPY config/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
