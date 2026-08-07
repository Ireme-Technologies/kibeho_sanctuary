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

cd "$FRONTEND_DIR"
npm ci
npm run build

# Ensure SPA index exists alongside Laravel index.php
if [[ ! -f "$BACKEND_DIR/public/index.html" ]]; then
  echo "WARNING: frontend build did not produce backend/public/index.html"
fi

echo "Deploy complete."
