# Kibeho Sanctuary — React + Laravel CMS

One repository with:

- `frontend/` — Vite + React public site and `/admin` dashboard
- `backend/` — Laravel 11 API (Sanctum auth, CMS content, media uploads)
- `deploy/` — Nginx example + DigitalOcean deploy script

## Local development

### 1. Backend

```bash
cd backend
cp .env.example .env   # if needed
composer install
php artisan key:generate
php artisan migrate:fresh --seed
php artisan storage:link
php artisan serve
```

Default super admin (from seeder / `.env`):

- Email: `admin@kibehosanctuary.org`
- Password: `ChangeMeNow!123`

Change `ADMIN_PASSWORD` in `backend/.env` before production.

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Vite proxies `/api`, `/sanctum`, and `/storage` to `http://127.0.0.1:8000`.

Open the URL Vite prints (usually `http://localhost:5173`).

- Public site: `/`
- Admin: `/admin/login`

## What the admin can manage

- Pilgrimage programs, sanctuary facilities, news & events (TipTap rich text for long descriptions/body)
- Page sections (home/about/programs/facilities/news keyed JSON)
- Company/contact/navigation settings
- Contact form messages
- Media uploads (`POST /api/media`)

Public pages load content from the API, with the original static `src/data/*` files as offline fallback.

## Production build (single droplet)

```bash
cd frontend
npm ci
npm run build
```

Vite writes the SPA into `backend/public/` (`index.html` + assets) **without** wiping Laravel's `index.php`.

Then point Nginx `root` at `backend/public` (see [`deploy/nginx.conf.example`](deploy/nginx.conf.example)).

### Deploy script

On the droplet (after cloning the repo and configuring `backend/.env` with MySQL):

```bash
./deploy/deploy.sh
```

Typical production `.env` notes:

- `APP_URL=https://your-domain.com`
- `FRONTEND_URL=https://your-domain.com`
- `SANCTUM_STATEFUL_DOMAINS=your-domain.com,www.your-domain.com`
- `SESSION_DOMAIN=.your-domain.com` (or `null` for exact host)
- `DB_CONNECTION=mysql` + credentials
- Strong `ADMIN_PASSWORD` before first `php artisan migrate --seed`

SSL: Certbot on the Nginx vhost.

## Repo layout

```
kibehosanctuary/
  frontend/          React public + admin
  backend/           Laravel API
  deploy/
    nginx.conf.example
    deploy.sh
```
