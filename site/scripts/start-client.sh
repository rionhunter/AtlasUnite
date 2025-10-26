#!/usr/bin/env bash
# start-client.sh - start only the Vite dev server for the client
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT/client"
# Start vite for the client standalone
npx vite --host
