# Technical details — handoff & system guide · v1.0

Prepared by Ireme Tech for Diocese of Gikongoro / Shrine of Our Lady of Kibeho  
Online version: https://demo.iremetech.com/docs/server-requirements  
Documentation hub: https://demo.iremetech.com/docs

One topic per page on the demo (Back / Next). Live passwords and API keys are not printed here.

**For the Diocese IT contact:** this application is **React + Laravel + MySQL** — not WordPress files uploaded by FTP. We need **SSH and Git**, not an FTP login. If the current plan is FTP-only `public_html`, use the recommended hosting below (~$7/month droplet, Diocese-owned account).

---

## 1. Overview

Technical handoff for the Shrine website — for the Diocese evaluation committee and the hosting partner.

### Inventory

| Module | What the client / host must know |
|--------|----------------------------------|
| Hosting & domain | Recommended DigitalOcean droplet (~$7/month) or a Diocese vhost with SSH — not FTP-only |
| Server access | SSH (key preferred), Git, PHP 8.1+, Composer. FTP is not used. |
| Database | MySQL credentials and the location of the latest content backup |
| Email | Resend (or SMTP) account and API key ownership |
| Messaging | WhatsApp number — staff change it in Admin → Settings |
| Admin access | Top-level administrator accounts. Day-to-day content stays in the CMS. |
| Backups | DigitalOcean snapshots plus the admin ZIP stored off the server |
| Hosting checklist | What to confirm before issuing logins |

### Application stack

| Layer | Technology |
|-------|------------|
| Public website & admin UI | React (Vite) — pages, language switcher, forms |
| API & CMS backend | Laravel 10 (PHP 8.1+) — content, auth, mail, media, multilingual API |
| Database | MySQL 5.7+ / 8.x or MariaDB |
| Build tooling | Node.js LTS + npm (build machine; optional on live server) |
| Source & deploy | Git repository + SSH + Composer on the server |
| HTTPS | SSL (Let’s Encrypt or host-provided) |

Production is one deployable application on one domain (built React files served from Laravel’s `public` folder). After go-live, editors publish in `/admin` and do not use Git or FTP.

---

## 2. Hosting & domain

**Recommended:** a Diocese-owned **DigitalOcean Basic droplet** (about **$6–7 USD per month** at current pricing). That is what this demo runs on. Optional weekly backups (~20% of droplet cost) are advised.

### If the Diocese already has vhost capacity

We can deploy on an existing Diocese vhost **when it meets the checklist** — especially SSH, PHP 8.1+, Composer, MySQL, and a document root that points at Laravel’s `public` folder.

Many shared-hosting plans offer only **FTP upload to `public_html`**. That is **not enough**: install needs `git pull`, `composer install`, and `php artisan migrate`. Uploading by FTP would also risk exposing the `.env` file. Please send **SSH access** (key preferred), not FTP credentials.

| Item | What to prepare | Owner |
|------|-----------------|-------|
| Recommended host | DigitalOcean Basic droplet (~$6–7/month) — same as this demo | Diocese / Shrine |
| Hosting account | Panel login for the droplet or vhost (SSH enabled) | Diocese / Shrine |
| Domain name | Production hostname (and whether `www` redirects) | Diocese / Shrine |
| DNS registrar | Where the domain is paid and A / CNAME records are edited | Diocese / Shrine |
| SSL certificate | Let’s Encrypt (free on DigitalOcean and most VPS hosts) | Diocese / Shrine |

The host must allow: Linux vhost or VPS with SSH; PHP 8.1+ with Laravel extensions; Composer; MySQL; Nginx or Apache with HTTPS; document root at Laravel `public/`; Git over SSH; disk for photos and PDFs; upload limits of at least 64 MB (256 MB preferred); writable `storage/` and `bootstrap/cache/`.

A typical FTP-only shared-hosting plan does **not** meet these requirements.

**Staff change:** public site name, contact address, and map embed in Admin → Settings.  
**Host / developer change:** hosting panel, DNS, SSL, droplet size, and document root.

---

## 3. Server access (Git / SSH)

**Please do not send FTP credentials.**

This is a **React + Laravel** application. Install and updates need Git, Composer, and PHP on the server:

- `git pull` — approved source from the Diocese Git repository
- `composer install` — Laravel / PHP dependencies
- `php artisan migrate` — database updates
- `php artisan storage:link` — uploaded media
- Built React files are already in the repository — the live server does **not** require Node.js unless you rebuild the frontend there
- Secrets stay in a server `.env` file — never in the public web folder or Git

Access the hosting partner should send:

1. SSH — host, port, username (we can send our public SSH key)
2. Confirmation that Git and Composer work over SSH
3. PHP 8.1+ — version and Laravel extensions
4. MySQL — database name, user, password (or permission to create one)
5. Confirmation that the document root targets Laravel’s `public` folder
6. Production domain and whether `www` should redirect

After install, content editors use `/admin` only.

---

## 4. Database

| Item | Requirement |
|------|-------------|
| Engine | MySQL 5.7+ / 8.x or MariaDB |
| What to create | One empty database + user with full rights on that database |
| Where credentials live | Server `.env` file (not Git, not the public website) |
| Latest content backup | Admin ZIP from **Admin → Backup & restore**, stored off the server |

A Git clone without that ZIP restores the empty / demo site, not live Diocese content.

---

## 5. Email

Enquiry notifications use Resend (preferred) or host SMTP. Create the account under a Diocese email.

| Item | Note |
|------|------|
| Provider | Resend or host SMTP |
| What it sends | New pilgrim enquiries and admin alerts |
| API key / SMTP password | Server `.env` file only |
| From address | A Diocese-owned mailbox the provider has verified |
| Inbox that receives alerts | Admin → Settings → notification email (staff can change this) |

---

## 6. Messaging

This Shrine site does **not** use a paid SMS gateway. Pilgrims open an official `wa.me` link.

| Item | Where it lives |
|------|----------------|
| WhatsApp number | Admin → Settings (staff can change it) |
| Maps | Google Maps embed and directions in Admin → Settings |
| Video | YouTube URLs on video / page forms in the CMS |

---

## 7. Admin access

| Item | Practice |
|------|----------|
| Master admin | Create on a Diocese mailbox |
| Editors | Optional staff accounts for news and pages |
| Developer access | By invitation only; remove or limit after acceptance |
| Demo evaluation login | `admin@kibeho.org` — change on production handover |

**Staff change in the CMS (no developer):** pages, news, menus, images, translations, schedules, directories, Settings (name, phones, email, WhatsApp, map, logo), offerings (candle/Mass amounts, MoMo Pay, bank accounts), users, and the backup ZIP.

---

## 8. Backups & recovery

1. **DigitalOcean snapshot (developer):** droplet backups or weekly snapshots in the hosting panel.
2. **Admin ZIP (staff):** download from **Admin → Backup & restore**, store off the server, weekly and after large updates. Keep at least two copies.

The ZIP does **not** include the `.env` file. Recovery: re-provision hosting, clone Git, import the latest ZIP, reconnect SSL and DNS.

---

## 9. Hosting partner checklist

- [ ] Hosting and domain in the Diocese / Shrine name
- [ ] SSH enabled (**not FTP-only**)
- [ ] Git available
- [ ] PHP 8.1+ with Laravel extensions
- [ ] Composer available over SSH
- [ ] MySQL (or MariaDB) database ready
- [ ] HTTPS / SSL possible on the production domain
- [ ] Document root can target Laravel `public/`
- [ ] Disk and upload size adequate for photos and backups
- [ ] Resend or SMTP account owned by the Diocese
- [ ] **Recommended if unsure:** DigitalOcean Basic droplet ~$6–7/month — same as this demo
- [ ] Do not send FTP passwords

**Reply template for Diocese IT:** “Thank you for the vhost capacity. This site is React + Laravel and needs SSH + Git + PHP 8.1 + MySQL — not FTP. Please confirm the checklist above, or create a Diocese-owned DigitalOcean droplet (~$7/month) and send SSH access.”

---

## Related documents

- Technical details (online): https://demo.iremetech.com/docs/server-requirements
- Administrator user guide: https://demo.iremetech.com/docs/sitemap-and-admin-guide
- Proposed solution: https://demo.iremetech.com/docs/proposed-solution
- Documentation hub: https://demo.iremetech.com/docs
