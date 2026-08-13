#!/usr/bin/env bash
# Build the React SPA on your laptop into backend/public/ so production
# only needs git pull — no Node/npm on the server.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
FRONTEND_DIR="$ROOT_DIR/frontend"
PUBLIC_DIR="$ROOT_DIR/backend/public"

cd "$FRONTEND_DIR"

if [[ ! -d node_modules ]]; then
  npm ci
fi

# Drop stale hashed chunks from previous builds (Vite emptyOutDir is false
# so Laravel's index.php is never wiped).
rm -rf "$PUBLIC_DIR/assets" "$PUBLIC_DIR/.vite"

npm run build

if [[ ! -f "$PUBLIC_DIR/index.html" ]]; then
  echo "ERROR: build did not write backend/public/index.html" >&2
  exit 1
fi

echo
echo "SPA built into backend/public/"
echo "Next (commit the built JS/CSS — images are copied from frontend/public on deploy):"
echo "  git add -f backend/public/index.html backend/public/assets"
echo "  git commit -m \"Build frontend for production\""
echo "  git push"
echo "On the server: ./deploy/deploy.sh   # git pull, no npm"
