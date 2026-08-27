# Server requirements & deployment access

Prepared by Ireme Tech for Diocese of Gikongoro / Shrine of Our Lady of Kibeho  
Online version: https://demo.iremetech.com/docs/server-requirements  
Documentation hub: https://demo.iremetech.com/docs

---

## 1. Summary

The website is a modern **React** application (public site and administration panel), built and maintained with **Node.js**. Content is stored in **MySQL**. We deploy and update the site with **Git over SSH**.

**Please do not send FTP credentials.** FTP cannot install or update this application safely. We need SSH access (preferably with a public key), Git, Node.js, and a MySQL database on a vhost or VPS owned by the Diocese / Shrine.

---

## 2. Application stack (client-facing)

| Layer | Technology |
|-------|------------|
| Public website | React (Vite) — interactive pages, language switcher, forms |
| Administration panel | Same React application (`/admin`) |
| Build & tooling | Node.js (LTS) and npm |
| Database | MySQL 5.7+ / 8.x (or MariaDB equivalent) |
| Source control & deploy | Git repository + SSH on the server |
| HTTPS | SSL certificate (Let’s Encrypt or host-provided) |

Production is one site on one domain. Day-to-day publishing stays in the admin panel and does not require Git.

---

## 3. Why we use Git / SSH — not FTP

This is not a classic set of HTML files that can be uploaded with an FTP client. Installation and updates involve:

- Pulling the approved source from Git
- Installing dependencies and building the React application with Node.js
- Applying database updates and linking uploaded media
- Keeping secrets (database password, mail keys) in a server environment file — never in the public web folder

FTP cannot run those steps. Uploading the whole project into a public folder would also risk exposing configuration and source files. **Git over SSH** is the correct, safer method for this stack, and it is what we use for every update after go-live.

---

## 4. Server requirements

| Requirement | Minimum / note |
|-------------|----------------|
| Account ownership | Hosting and domain registered in the name of the Diocese / Shrine |
| Operating system | Linux (or equivalent Unix) vhost / VPS |
| Remote access | **SSH** (key-based preferred). FTP alone is not accepted. |
| Git | Git available on the server so we can clone and pull |
| Node.js | Node.js **LTS** (18.x or 20.x recommended) and npm — required to build the React site; used in our standard deploy workflow |
| Database | MySQL 5.7+ / 8.x or MariaDB; one empty database + user we can configure |
| Web server | Nginx or Apache with HTTPS; document root / reverse proxy must serve the application’s public web folder (not the full project tree) |
| Disk | Enough for the application plus media (photos, PDFs); plan for growth |
| Upload limits | Allow large media and backup ZIPs (at least 64 MB; 256 MB preferred) |
| Writable storage | Application can write uploads and cache under its data directories |
| Cron (recommended) | One scheduled task for background jobs / reminders if enabled |
| Outbound email | SMTP or transactional API (e.g. Resend) for enquiry notifications |

---

## 5. Does shared hosting work?

**Only if** the shared plan (or vhost) provides everything in the table above — especially **SSH**, **Git**, **Node.js**, **MySQL**, and the ability to point the site document root at the application’s public folder.

**Typical cheap shared hosting with FTP only** (no SSH, no Git, no Node, fixed `public_html`) is **not suitable**. That model works for simple static sites or older CMS uploads; it does not support a modern React + Node.js deploy.

A Diocese **vhost** or small **VPS** with SSH usually meets the needs. If your provider already confirmed “good vhost capacity,” please confirm the checklist below before issuing logins.

---

## 6. Access we need from Diocese IT

Instead of FTP, please provide:

1. **SSH** — host, port, username (we can send our public SSH key)
2. Confirmation that **Git** and **Node.js (LTS)** work over SSH
3. **MySQL** — database name, user, password (or permission to create one)
4. Confirmation that the **document root** (or reverse proxy) can target the app’s public web folder
5. Production **domain** (and whether `www` should redirect)
6. Current **Node.js** version on the server (if already installed)

Domain DNS and SSL remain under Diocese control. After install, content editors use `/admin` only; they do not need SSH.

---

## 7. Quick checklist for the hosting contact

- [ ] Hosting account in Diocese / Shrine name
- [ ] SSH enabled (not FTP-only)
- [ ] Git available
- [ ] Node.js LTS + npm available
- [ ] MySQL (or MariaDB) database ready
- [ ] HTTPS / SSL possible on the production domain
- [ ] Document root can be set to the application public folder
- [ ] Disk and upload size adequate for photos and backups

---

## Related documents

- Administrator user guide: https://demo.iremetech.com/docs/sitemap-and-admin-guide
- Proposed solution: https://demo.iremetech.com/docs/proposed-solution
- Documentation hub: https://demo.iremetech.com/docs
