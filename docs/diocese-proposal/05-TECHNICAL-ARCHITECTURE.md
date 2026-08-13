# 5. Technical architecture

## 5.1 Overview

```
┌─────────────────────────────────────────────┐
│  Visitors & editors (browser)               │
│  Public site + /admin panel (React SPA)     │
└───────────────────┬─────────────────────────┘
                    │ HTTPS
┌───────────────────▼─────────────────────────┐
│  Web server (Nginx or Apache)               │
│  Serves built frontend from Laravel public/ │
│  Routes /api & /sanctum to Laravel          │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│  Laravel API (PHP 8.1+)                     │
│  Auth (Sanctum), CMS, media, mail, i18n     │
└───────────────────┬─────────────────────────┘
                    │
┌───────────────────▼─────────────────────────┐
│  MySQL database                             │
│  + file storage (images, PDFs)              │
└─────────────────────────────────────────────┘
```

Single deployable application: frontend is built into the Laravel `public` folder for production (one hosting account, one domain).

---

## 5.2 Frameworks and languages

| Component | Technology | Why it fits |
|-----------|------------|-------------|
| Public UI & admin UI | **React 18** + Vite | Interactive pilgrim and staff experience; updates page sections without full reloads → better perceived **loading speed** on mobile; public site and admin share one modern UI stack |
| Backend API | **Laravel 10** (PHP) | Mature CMS APIs, auth, mail, migrations—and an **API layer ready to connect external services** (payment gateways, members management, CRM, mailing tools) without rebuilding the website |
| Database | **MySQL** | Standard on shared and dedicated hosting |
| Auth | **Laravel Sanctum** (cookie/session for SPA) | Secure admin login without a separate WordPress user stack |
| Rich text | TipTap editor | Word-processor-like editing for news and long pages |

### Why React.js (interactive users & speed)

- After the first load, React changes only what the user needs (language, menus, news, forms)—not the entire page.
- Smooth interactivity for language switcher, galleries, calendars, enquiry forms, and the CMS.
- Optimised production builds keep the site lean for international visitors.

### Why a Laravel API (integrations)

Modern shrine and Diocese websites increasingly need to connect beyond “pages and posts.” Laravel provides a stable API so future work can include:

- **Payment gateways** (card / mobile money donations)
- **Members / friends of the Shrine** or related management systems
- Email, WhatsApp, maps, video, and other services already in this pattern
- Optional later mobile apps or partner portals reusing the same API

**Note for IT reviewers:** This is **not** WordPress/PHP themes/plugins. It is a modern PHP API + JavaScript front end, still runnable on conventional PHP/MySQL hosting.

---

## 5.3 Hosting requirements

| Requirement | Minimum |
|-------------|---------|
| Account ownership | **In the name of the Diocese / Shrine** |
| Runtime | PHP 8.1+ with typical extensions (OpenSSL, Mbstring, Tokenizer, XML, Ctype, JSON, BCMath, Fileinfo) |
| Database | MySQL 5.7+ / 8.x (or MariaDB equivalent) |
| Web server | Nginx or Apache with HTTPS (Let’s Encrypt / host SSL) |
| Disk | Enough for application + media library (plan growth for photos/PDFs) |
| Deploy | **Git** and SSH *or* an agreed upload/CI process; Composer + Node build on CI or staging then upload artefacts |
| Cron (recommended) | Laravel scheduler for queues/reminders if enabled |
| Outbound email | SMTP or API (e.g. Resend) for enquiry notifications |

Works on **shared hosting** or **dedicated/VPS** when the host allows the above. If a given shared plan cannot run Composer/SSH, we use a build-then-upload workflow still pointing at the same client-owned account.

---

## 5.4 Third-party components

| Component | Purpose | Licence / cost note |
|-----------|---------|---------------------|
| TipTap | Rich text in admin | Open-source core |
| Lucide icons | UI icons | Open source |
| Resend (or host SMTP) | Transactional email | [FILL — plan / free tier] |
| WhatsApp `wa.me` links | Prefill chat for pilgrims | Free (Meta WhatsApp) |
| YouTube embeds | Videos | Free embeds |
| Google Maps embed | Shrine map | Google account / API policy as configured |
| SSL certificate | HTTPS | Let’s Encrypt or host-included |

No mandatory proprietary CMS licence (unlike some commercial page builders). Ongoing costs are hosting, domain, email provider, and optional support contract.

---

## 5.5 Security concept

| Measure | Implementation |
|---------|----------------|
| HTTPS | Required in production |
| Admin authentication | Sanctum session + CSRF cookie |
| Authorised writes | Content changes require logged-in admin |
| CORS / stateful domains | Locked to the official site URL(s) |
| Passwords | Hashed by Laravel; strong password policy on handover |
| Environment secrets | `.env` on server only—not in the public repository |
| Uploads | Authenticated media upload; stored outside casual web misuse patterns |
| Roles | Admin / editor / client distinctions in user model |
| Updates | Framework and dependency updates under maintenance agreement |
| Access | Hosting & domain credentials held by Diocese; developer access by invitation |

---

## 5.6 Backup and recovery

Use **all three** layers. DigitalOcean snapshots alone are not enough if that account or region is unavailable, or if you move host.

### A. Hosting provider backup (DigitalOcean)
- Enable droplet backups or weekly snapshots in the DigitalOcean panel.
- These restore the whole server quickly **only while DigitalOcean still holds them**.
- Retention is limited (often a few weeks). They are not a copy you can take to another company.

### B. Admin export (independent of the host)
Administrators can download a ZIP from **Admin → Backup & restore**. It includes:
- Live CMS data (pages, menus, translations, news, schedules, directories, enquiries, users)
- Uploaded media (`storage/app/public`)
- Site images (`public/images`, including replaced logo/hero files)

Store that ZIP **off the web server** (Diocese computer, Google Drive, encrypted USB). Recommended: weekly, and after large content updates. Keep at least two copies.

Restore the ZIP on the same or a new server from the same admin page (two-step confirmation). If the file is larger than PHP upload limits, copy it to the server and run:

```bash
php artisan site:backup
php artisan site:restore /path/to/kibeho-backup.zip --force
```

The ZIP does **not** include `.env` secrets. On a new host, recreate `.env` (new `APP_KEY` is fine), run `composer install`, `php artisan migrate` (not `migrate:fresh`), then restore the ZIP, then `php artisan storage:link`.

### C. Application code
- Git is the source of truth for the frontend and backend code.
- A git clone without a content backup restores the **empty/seeded** demo, not live Diocese content.

### D. Domain
- The domain registrar (where DNS is paid) is independent of DigitalOcean. Point A/CNAME records at the new host when moving.

---

## 5.7 Development and deployment flow

1. Development in Git repository (access transferred to Diocese on handover).
2. Staging site for Diocese review (recommended).
3. Production deploy via `deploy/deploy.sh` or host-specific Git pull + build.
4. Content entry continues in production admin without redeploying code for normal edits.
