#!/usr/bin/env bash
# Exit on error
set -o errexit

original_path=$(pwd)
cd ../backend

echo "📦 Installing Python dependencies from requirements.txt..."
pip install -r ./backend/requirements.txt

# Convert static asset files
echo "📋 Colleting static files..."
python ./backend/manage.py collectstatic --no-input

# Apply any outstanding database migrations
echo "⚙️ Applying database migrations..."
python ./backend/manage.py migrate

echo "✅ Backend built successfully! 🎉"

# Return to the original directory
cd "$original_path"
