#!/usr/bin/env bash
# start-all.sh - start Django and Node dev server (node serves client with vite middleware)
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

echo "Project root: $ROOT"

# Start Django in background
echo "Starting Django (backend) on port 8000..."
(
  cd "$ROOT/backend"
  DJANGO_SETTINGS_MODULE=atlas_unite.settings python -m django runserver 0.0.0.0:8000
) &
DJANGO_PID=$!

# Give it a moment and test
sleep 2
if curl -s http://localhost:8000/api/volunteers/ > /dev/null; then
  echo "✓ Django server is responding"
else
  echo "⚠ Django may not be ready yet or the endpoint /api/volunteers/ returned non-200"
fi

# Start Node dev server (server + vite middleware)
echo "Starting Node dev server (server + vite middleware)"
cd "$ROOT"
npm run dev

# Wait for Django to exit if Node stops
wait $DJANGO_PID
