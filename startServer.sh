echo "Starting Gunicorn server..."
cd backend
python -m gunicorn core.asgi:application -k uvicorn.workers.UvicornWorker
