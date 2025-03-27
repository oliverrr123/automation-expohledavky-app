#!/bin/bash

# Export Unsplash API key from .env.local
if [ -f .env.local ]; then
  export UNSPLASH_ACCESS_KEY=$(grep UNSPLASH_ACCESS_KEY .env.local | cut -d '=' -f2)
fi

# Verify API key is set
if [ -z "$UNSPLASH_ACCESS_KEY" ]; then
  echo "⚠️  Error: UNSPLASH_ACCESS_KEY environment variable is not set"
  echo "Please ensure .env.local contains a valid Unsplash API key"
  exit 1
fi

# Check if node-fetch is installed
if ! npm list node-fetch > /dev/null 2>&1; then
  echo "Installing node-fetch..."
  npm install node-fetch@2
fi

# Check if gray-matter is installed
if ! npm list gray-matter > /dev/null 2>&1; then
  echo "Installing gray-matter..."
  npm install gray-matter
fi

# Check if dotenv is installed
if ! npm list dotenv > /dev/null 2>&1; then
  echo "Installing dotenv..."
  npm install dotenv
fi

# Make the update script executable
chmod +x scripts/update-article-images.js

echo "Starting article image update process..."
echo "Using Unsplash API key: ${UNSPLASH_ACCESS_KEY:0:8}..."
node scripts/update-article-images.js 