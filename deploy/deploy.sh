#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/backend"
FRONTEND_DIR="$ROOT_DIR/frontend"

cd "$ROOT_DIR"
git pull

cd "$BACKEND_DIR"
composer install --no-dev --optimize-autoloader --no-interaction
php artisan migrate --force
php artisan storage:link || true
php artisan config:cache
php artisan route:cache
php artisan view:cache || true

# Static files (images, docs) live in frontend/public and are already in git.
# Copy them next to the locally built SPA — no Node required.
if [[ -d "$FRONTEND_DIR/public" ]]; then
  cp -R "$FRONTEND_DIR/public/." "$BACKEND_DIR/public/"
fi

# Frontend JS/CSS is built on a local machine and committed as
# backend/public/index.html + backend/public/assets/.
# Only build on the server if you explicitly ask: BUILD_FRONTEND=1 ./deploy/deploy.sh
if [[ "${BUILD_FRONTEND:-0}" == "1" ]]; then
  cd "$FRONTEND_DIR"
  npm ci
  rm -rf "$BACKEND_DIR/public/assets" "$BACKEND_DIR/public/.vite"
  npm run build
  cd "$BACKEND_DIR"
else
  echo "Skipping frontend build (using committed backend/public SPA)."
  echo "To build on the server anyway: BUILD_FRONTEND=1 $0"
fi

# Media library "Remove" must survive git pull + the copy above.
cd "$BACKEND_DIR"
if [[ -d "$BACKEND_DIR/public/images" ]]; then
  chmod -R u+rwX,g+rwX "$BACKEND_DIR/public/images" || true
  WEB_USER="${WEB_USER:-www-data}"
  if id "$WEB_USER" >/dev/null 2>&1; then
    chgrp -R "$WEB_USER" "$BACKEND_DIR/public/images" || true
  fi
fi
php artisan site:prune-removed-assets || true

if [[ ! -f "$BACKEND_DIR/public/index.html" ]]; then
  echo "ERROR: backend/public/index.html is missing."
  echo "Build locally with ./deploy/build-local.sh, commit, and pull."
  exit 1
fi

echo "Deploy complete."
