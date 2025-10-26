#!/usr/bin/env bash
# start-server.sh - start only the Node server (server + vite middleware)
set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

cd "$ROOT"
# Using the project npm dev script which sets NODE_ENV=development for the server
npm run dev
