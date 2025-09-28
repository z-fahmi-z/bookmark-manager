#!/bin/bash

# Build script for Bookmark Folder Manager Chrome Extension

echo "🔨 Building Bookmark Folder Manager Extension..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/
rm .tsbuildinfo

# Create dist directory
mkdir -p dist

# Check if node_modules exists, if not install dependencies
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Compile TypeScript
echo "⚡ Compiling TypeScript..."
tsc

# Check if compilation was successful
if [ $? -eq 0 ]; then
    echo "✅ TypeScript compilation successful!"
    
    # Create simple icon files (you should replace these with actual icons)
    echo "🎨 Creating placeholder icons..."
    mkdir -p dist/icons
    
    # Create placeholder icons using base64 encoded 1x1 transparent PNG
    cp bookmark.png dist/icons/icon16.png
    cp bookmark.png dist/icons/icon32.png
    cp bookmark.png dist/icons/icon48.png
    cp bookmark.png dist/icons/icon128.png

    # echo "${ICON_BASE64}" | base64 -d > dist/icons/icon16.png 2>/dev/null || true
    # echo "${ICON_BASE64}" | base64 -d > dist/icons/icon32.png 2>/dev/null || true
    # echo "${ICON_BASE64}" | base64 -d > dist/icons/icon48.png 2>/dev/null || true
    # echo "${ICON_BASE64}" | base64 -d > dist/icons/icon128.png 2>/dev/null || true
    
    echo "🏗️  Extension built successfully!"
    echo ""
    echo "📋 To install the extension:"
    echo "1. Open Chrome and go to chrome://extensions/"
    echo "2. Enable 'Developer mode' (toggle in top right)"
    echo "3. Click 'Load unpacked'"
    echo "4. Select this project folder"
    echo ""
    echo "🚀 Your extension is ready to test!"
else
    echo "❌ TypeScript compilation failed!"
    exit 1
fi