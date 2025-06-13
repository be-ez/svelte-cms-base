#!/bin/sh

# Cloudflare cache purging script
# This script is executed by Coolify after successful deployment

echo "🌩️  Starting Cloudflare cache purge..."

# Check if required environment variables are set
if [ -z "$CLOUDFLARE_TOKEN" ]; then
    echo "❌ Error: CLOUDFLARE_TOKEN environment variable is not set"
    exit 1
fi

if [ -z "$CLOUDFLARE_ZONE_ID" ]; then
    echo "❌ Error: CLOUDFLARE_ZONE_ID environment variable is not set"
    exit 1
fi

# Purge entire cache for the zone
echo "🔄 Purging cache for zone: $CLOUDFLARE_ZONE_ID"

response=$(curl -s -w "%{http_code}" -X POST \
    "https://api.cloudflare.com/client/v4/zones/$CLOUDFLARE_ZONE_ID/purge_cache" \
    -H "Authorization: Bearer $CLOUDFLARE_TOKEN" \
    -H "Content-Type: application/json" \
    --data '{"purge_everything":true}')

# Extract HTTP status code (last 3 characters)
http_code=$(echo "$response" | tail -c 4)
# Extract response body (everything except last 3 characters)
response_body=$(echo "$response" | sed 's/...$//')

echo "📡 HTTP Status: $http_code"

if [ "$http_code" = "200" ]; then
    echo "✅ Cache purged successfully!"
    echo "🎉 Deployment complete with fresh cache"
else
    echo "❌ Cache purge failed with status: $http_code"
    echo "📋 Response: $response_body"
    exit 1
fi