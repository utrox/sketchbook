#!/bin/bash
# Exit on error
set -o errexit

# Save the current directory
original_path=$(pwd)
echo "PATH IS: "
echo $(pwd)

echo "🚀 Starting the build process..."

# Run the backend build script
echo "🔧 Running ./build_backend.sh..."
./build_backend.sh

# Run the frontend build script
echo "🎨 Running ./build_and_move_frontend..."
./build_and_move_frontend.sh

# Return to the original directory
cd "$original_path"

echo "✅ Build process completed successfully! 🎉"
