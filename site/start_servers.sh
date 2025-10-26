#!/bin/bash

echo "Starting Atlas Unite servers..."

# Kill any existing Django processes
pkill -f "django runserver" 2>/dev/null || true

# Start Django in background
cd backend
export DJANGO_SETTINGS_MODULE=atlas_unite.settings  
echo "Starting Django server on port 8000..."
python -m django runserver 0.0.0.0:8000 &
DJANGO_PID=$!

# Wait a moment for Django to start
sleep 3

# Test if Django is responding
if curl -s http://localhost:8000/api/volunteers/ > /dev/null; then
    echo "✓ Django server is running and responding"
else
    echo "✗ Django server failed to start properly"
    exit 1
fi

echo "Django PID: $DJANGO_PID"
echo "Both servers are running!"
echo "Django API: http://localhost:8000"
echo "Frontend: http://localhost:5000 (already running via workflow)"

# Keep script running to maintain Django process
wait $DJANGO_PID