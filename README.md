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

## Production build (build locally, pull on the server)

The live server does **not** need Node. Build the React app on your laptop, commit the output, then `git pull` on the droplet.

### 1. On your machine

```bash
./deploy/build-local.sh
```

That runs Vite and writes the SPA into `backend/public/` (`index.html`, `assets/`, copied `images/`) **without** wiping Laravel’s `index.php`.

Then commit and push the built JS/CSS (images are copied from `frontend/public` on deploy, so you do not need to commit `backend/public/images`):

```bash
git add -f backend/public/index.html backend/public/assets
git status   # confirm index.php is not deleted
git commit -m "Build frontend for production"
git push
```

### 2. On the server

```bash
./deploy/deploy.sh
```

This pulls, runs Composer/migrations, and **skips npm**. To force a server-side Node build (slow): `BUILD_FRONTEND=1 ./deploy/deploy.sh`.

Point Nginx `root` at `backend/public` (see [`deploy/nginx.conf.example`](deploy/nginx.conf.example)).

### Deploy script notes

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

### Backups (content, not just the droplet)

DigitalOcean snapshots stay on DigitalOcean. Administrators should also download a ZIP from **Admin → Backup & restore** and keep it off the server (Drive / Diocese PC). CLI:

```bash
cd backend
php artisan site:backup
php artisan site:restore /path/to/kibeho-backup.zip
```

On a new host: clone the repo, configure `.env`, `composer install`, `php artisan migrate` (do **not** `migrate:fresh`), restore the ZIP, then `php artisan storage:link`. Raise PHP `upload_max_filesize` / `post_max_size` (see `backend/public/.user.ini`) and Nginx `client_max_body_size` if restoring through the admin UI.

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
