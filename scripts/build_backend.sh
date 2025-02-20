#!/usr/bin/env bash
# Exit on error
set -o errexit

original_path=$(pwd)
cd ../backend

echo "📦 Installing Python dependencies from requirements.txt..."
pip install -r ./requirements.txt

# Convert static asset files
echo "📋 Colleting static files..."
python ./manage.py collectstatic --no-input

# Apply any outstanding database migrations
echo "⚙️ Applying database migrations..."
python ./manage.py migrate

# Creating default superuser if it doesn't exist
echo "👤 Creating default superuser, if doesnt exist..."
python ./manage.py create_default_superuser

# Run command to fill the database with some dummy data
echo "📝 Filling the database with dummy data..."
python ./manage.py populate_db

echo "✅ Backend built successfully! 🎉"

# Return to the original directory
cd "$original_path"
