# Exit on error
set -o errexit

echo "👀 Starting Gunicorn server..."
cd backend
python -m gunicorn core.asgi:application -k uvicorn.workers.UvicornWorker
echo "🎉 Server is running!"
