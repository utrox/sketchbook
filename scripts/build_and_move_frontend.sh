#!/bin/bash
# Exit on error
set -o errexit

# Save the current directory
original_path=$(pwd)
dist_folder="dist"
destination="../backend/client"

echo "🖼️ Starting build process for React application..."
cd ../frontend

npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully."
else
    echo "❌ Build failed. Exiting..."
    cd "$original_path"
    exit 1
fi

echo "📦 Moving build files to backend client folder..."
mkdir -p "$destination"
rm -rf "$destination" # Clean destination folder
mv "$dist_folder"/* "$destination/"

echo "🔥 Frontend build files moved successfully."

# Return to the original directory
cd "$original_path"
