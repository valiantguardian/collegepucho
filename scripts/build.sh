#!/bin/bash

# Build script for Amplify deployment
echo "Starting build process..."

# Set default environment variables if not present
export NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-"https://api.collegepucho.com"}
export NEXT_PUBLIC_UI_URL=${NEXT_PUBLIC_UI_URL:-"https://www.collegepucho.com"}
export NEXT_PUBLIC_GA_ID=${NEXT_PUBLIC_GA_ID:-"G-5CMGT07LVZ"}
export NEXT_PUBLIC_CACHE_TTL=${NEXT_PUBLIC_CACHE_TTL:-"3600"}

echo "Environment variables set:"
echo "API URL: $NEXT_PUBLIC_API_URL"
echo "UI URL: $NEXT_PUBLIC_UI_URL"
echo "GA ID: $NEXT_PUBLIC_GA_ID"

# Run the build
npm run build

echo "Build completed!"
