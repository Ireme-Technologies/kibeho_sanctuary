# Sitemap & administrator user guide

Prepared by Ireme Tech for Diocese of Gikongoro evaluation.
Online version: https://demo.iremetech.com/docs/sitemap-and-admin-guide
Proposed solution: https://demo.iremetech.com/docs/proposed-solution
Documentation hub: https://demo.iremetech.com/docs
Live demo: https://demo.iremetech.com/
Admin: https://demo.iremetech.com/admin/login

---

## Demo access & content note

- **Login URL:** `/admin/login` (e.g. https://demo.iremetech.com/admin/login)
- **Email:** `admin@kibeho.org`
- **Password:** `KibehoAdmin@202!`

Sample text and images on the demo will be updated as official content and photographs become available from the Diocese / Shrine.

---

# 2. Complete sitemap

Primary structure follows the Diocese Terms of Reference (six pillars). Paths are the live public URLs.

---

## 2.1 Utility / quick links

| Label | Path |
|-------|------|
| Mass Schedule | `/shrine/mass-schedule` |
| Plan Your Pilgrimage | `/pilgrimage/plan` |
| Support | `/support` |
| Donate (CTA) | `/support/donations` |
| Contact | `/contact` |
| Language | RW · FR · EN · DE |

---

## 2.2 Main menu

### A. Our Lady of Kibeho

| Page | Path | Content type |
|------|------|--------------|
| Hub (home also serves as entry) | `/` and `/our-lady` | CMS page / home composition |
| The Apparitions | `/our-lady/apparitions` | CMS page |
| The Visionaries | `/our-lady/visionaries` | CMS page |
| The Messages | `/our-lady/messages` | CMS page |
| Church Recognition | `/our-lady/church-recognition` | CMS page |
| History | `/our-lady/history` | CMS page |
| FAQ | `/our-lady/faq` | CMS page |

### B. The Shrine

| Page | Path | Content type |
|------|------|--------------|
| The Shrine (hub) | `/shrine` | CMS page |
| Welcome | `/shrine/welcome` | CMS page |
| Churches | `/shrine/churches` | Directory (Sacred places · church) |
| Church detail | `/shrine/churches/:slug` | Entity detail |
| Apparition Sites | `/shrine/apparition-sites` | Directory (Sacred places · apparition_site) |
| Apparition site detail | `/shrine/apparition-sites/:slug` | Entity detail |
| Holy Spring | `/shrine/holy-spring` | CMS page |
| Way of the Cross | `/shrine/way-of-the-cross` | CMS page |
| Eucharistic Adorations | `/shrine/eucharistic-adorations` | CMS page |
| Mass Schedule | `/shrine/mass-schedule` | Schedule entities + page |
| Shrine Map | `/shrine/map` | CMS page (map embed) |

### C. Pilgrimage

| Page | Path | Content type |
|------|------|--------------|
| Pilgrimage (hub) | `/pilgrimage` | CMS page |
| Why Kibeho? | `/pilgrimage/why-kibeho` | CMS page |
| Plan your Pilgrimage | `/pilgrimage/plan` | CMS page |
| Accommodation | `/pilgrimage/accommodation` | Facility directory |
| Hotel / lodging detail | `/hotels/:slug` | Facility detail |
| Transportation | `/pilgrimage/transportation` | CMS page |
| Pilgrimage Office | `/pilgrimage/office` | CMS page |
| Calendar | `/pilgrimage/calendar` | Pilgrimage events |
| Practical Information | `/pilgrimage/practical-information` | CMS page |
| Pilgrimage programs (list) | `/pilgrimages` | Pilgrimage service entities |
| Program detail | `/pilgrimages/:slug` | Entity detail |

### D. Spirituality

| Page | Path | Content type |
|------|------|--------------|
| Spirituality (hub) | `/spirituality` | CMS page |
| Prayer Intentions | `/spirituality/prayer-intentions` | CMS page (+ form where configured) |
| Request a Mass | `/spirituality/request-a-mass` | CMS page / enquiry |
| Rosary | `/spirituality/rosary` | CMS page |
| Seven Sorrows Rosary | `/spirituality/seven-sorrows-rosary` | CMS page |
| Novena | `/spirituality/novena` | CMS page |
| Official Prayers | `/spirituality/official-prayers` | CMS page |
| Meditations | `/spirituality/meditations` | CMS page |
| Testimonies | `/spirituality/testimonies` | Testimonial entities |

### E. News

| Page | Path | Content type |
|------|------|--------------|
| News (all) | `/news` | News posts |
| Article detail | `/news/:slug` | News post |
| Events | `/news?category=Events` | Filtered news |
| Rector’s Messages | `/news?category=Rector` | Filtered news |
| Bishop’s Messages | `/news?category=Bishop` | Filtered news |
| Press | `/news?category=Press` | Filtered news |
| Photos | `/gallery` | Media gallery |
| Videos | `/news/videos` | Video entities |

### F. Support the Shrine

| Page | Path | Content type |
|------|------|--------------|
| Support (hub) | `/support` | CMS page |
| Vision | `/support/vision` | CMS page |
| Master Plan | `/support/master-plan` | CMS page |
| Projects | `/support/projects` | Development project entities |
| Project detail | `/support/projects/:slug` | Entity detail |
| Donations | `/support/donations` | CMS page |
| Annual Reports | `/support/annual-reports` | CMS page (+ downloadable PDFs via media) |
| Transparency | `/support/transparency` | CMS page |
| Partners | `/support/partners` | CMS page |

---

## 2.3 Other public surfaces

| Page | Path | Content type |
|------|------|--------------|
| Home | `/` | Composed sections |
| Activities / shrine experiences | `/activities`, `/activities/:slug` | Activity entities |
| Contact | `/contact` | Form → contact / pilgrim enquiry |
| Admin login | `/admin/login` | Auth (not public content) |

---

## 2.4 Content types (summary)

| Type | Examples | Managed in admin |
|------|----------|------------------|
| CMS pages | Pillar hubs & subpages | Pages (sections / blocks) |
| News articles | News, Events, Rector, Bishop, Press | News & clergy messages |
| Pilgrimage events | Pilgrimages, feast days, retreats | Pilgrimage events |
| Schedules | Mass times | Mass schedules |
| Directories | Churches, sites, hotels, projects | Dedicated modules |
| Media | Photos, PDFs | Gallery / Media |
| Videos | YouTube | Videos |
| Forms | Contact, pilgrim enquiry, mass request (as configured) | Enquiries + public forms |
| Downloads | Reports, leaflets | Media attached to pages or library |
| Menus | Primary, utility, footer | Settings & menus |
| UI strings | Buttons, short labels | Translations |

Menus and page structure can grow by adding CMS page keys and menu entries without rebuilding the whole site—subject to agreed IA changes.

---

# 3. Content Management System (administration panel)

## 3.1 What the CMS is

The administration panel is part of the same website, available at:

**`https://[domain]/admin`**

It is a **custom CMS** built for the Shrine—not WordPress—but it is designed for **non-technical staff**: forms, language tabs, media upload, and Save buttons. No coding is required for day-to-day publishing.

Technology underneath (for IT readers): React admin UI + Laravel API + MySQL. Staff only see the admin screens.

## 3.2 Who can sign in

| Role | Typical use |
|------|-------------|
| Admin / Super admin | Full content management |
| Editor | Content editing (same CMS access in Phase 1; finer permissions optional later) |
| Master admin | Designated technical owner email (configuration) |

User creation for additional Diocese staff is available from **Users** (where the managing account is authorised). Passwords can be changed from **My account**.

## 3.3 Admin modules (menu)

| Menu item | Purpose |
|-----------|---------|
| Dashboard | Overview of pilgrim enquiries, plus cards for languages and page layout |
| Mass schedules | Weekly / recurring Mass times |
| Pilgrimage events | Pilgrimages, feast days, retreats & calendar events |
| Churches | Church directory |
| Apparition sites | Apparition site directory |
| Accommodations | Lodging / hotels for pilgrims |
| Development projects | Fundraising & infrastructure projects at the Shrine |
| Testimonials | Pilgrim / spiritual testimonies |
| News & clergy messages | Articles (categories, rich text, images) |
| Pilgrimage Services | Structured pilgrimage programs |
| Shrine Experiences | Activities / experiences |
| Videos (YouTube) | Video catalogue |
| Home hero | Homepage hero slides / media / CTAs |
| Pages | Informational pages: header, intro, and layout blocks (per language) |
| Translations | Short UI labels only (Donate, Contact) — not page articles |
| Gallery / Media | Upload images & documents; gallery flag |
| Pilgrim Enquiries | Inbox, replies, documents |
| Users | Create staff accounts (authorised managers) |
| Settings & menus | Organisation details, contact, navigation, theme |

## 3.4 Live demonstration — tasks for a non-technical staff member

Provide a **staging URL** and a **demo admin account** (Diocese-owned email preferred). Walk through:

### A. Create and edit a page
1. Open **Pages**.
2. Select the page (e.g. Shrine → Welcome).
3. On the blue **Content language** bar, choose the language (finish the default language first).
4. Edit title, intro, and layout blocks (heading, rich text, gallery, YouTube, cards, schedule, …).
5. For another language: switch tab → **Copy from default** → translate in place.
6. Click **Save page**.
7. Open the public URL, switch the site language, and confirm.

### B. Publish a news article
1. Open **News & clergy messages**.
2. Click **Add post** or **Edit** (language tabs are on the form, not the list).
3. Create article: title, category (News / Events / Rector / Bishop / Press), body (rich text), featured image.
4. Fill other language tabs (Copy from default if helpful).
5. Save / publish.
6. Verify on `/news` in each language you filled.

### C. Update a menu
1. Open **Settings & menus**.
2. Edit navigation JSON / menu editor for primary or utility links (labels and paths).
3. Save.
4. Refresh the public site header/footer.

### D. Replace images
1. Open **Gallery / Media** (or image field on a page/article).
2. Upload a new file.
3. Select it on the page or mark **show in gallery**.
4. Save and check the public page.

### E. Upload documents
1. Upload PDF (e.g. annual report) via **Gallery / Media**.
2. Link it from the relevant **Pages** block or Support → Annual Reports content.
3. Test download on the public site.

### F. Manage languages (best way)
**Long content and page layout** live on each item, not on the Translations grid.

1. Open **Pages** (or Edit on News / Mass / a directory item).
2. Finish the **default language** tab first.
3. Switch to Français / Ikinyarwanda / Deutsch. A green dot means that language already has text.
4. Click **Copy from default**, translate the copied text and blocks, then **Save**.
5. Check the public language switcher.

**Short buttons only** (Donate, Contact):
1. Open **Translations**.
2. Choose a language tab (source column stays visible).
3. Edit the label.
4. Click **Save translations** (sticky bar appears when there are unsaved changes).

### G. Create users and assign permissions
1. Open **Users** (authorised account).
2. Create user with name, email, role (Admin / Editor).
3. Share credentials securely; user changes password on first login.
4. Phase 1 note: Editor and Admin both use the CMS; a finer permission matrix can be a later enhancement if the Diocese requires module-level restrictions.

## 3.5 Training & handover guide

On final acceptance we provide:

- Written **Administrator User Guide** (PDF) covering the tasks above with screenshots from the live Shrine admin.
- Optional on-site or online training session(s) [FILL — number of hours included].
- Credentials transfer checklist (see Ownership & handover document).

---

# Extended administrator procedures (all modules)

## Sign in and safety
1. Open `/admin/login`.
2. Use the credentials issued to the Diocese (prefer Diocese email addresses).
3. Change password under profile → My account after first login.
4. Always click **Save** on the content form you edited. Click **Save translations** only after changing short button labels. Unsaved translation edits show an amber sticky bar.

## Best way to manage languages
The site has four public languages. Staff do **not** create four copies of a page. Each item is one record with a blue **Content language** bar (Ikinyarwanda / Français / English / Deutsch).

**Use the right screen**
- Page titles, articles, Mass notes, and **body layout** → that item’s form (Pages, News, …), then **Save**.
- Short chrome (Donate, Contact, Read more) → **Translations**, then **Save translations**.

**Recommended workflow**
1. Sign in. Dashboard cards **Manage languages** and **Flexible page layout** summarise this process.
2. Finish the **default language** first (marked on the tab). Visitors see this when a translation is empty.
3. Open the item (**Pages**, or **Edit** on a list). Language tabs appear on the form, not on the list.
4. Choose a language. A **green dot** means it has text; an empty ring still falls back.
5. Click **Copy from default**, translate in place, then **Save**.
6. Switch the public header language to verify. Empty fields fall back to the default language, then English — that is expected until the tab is filled.

**Page layout per language**
On **Pages**, add blocks with the type buttons (heading, rich text, note, list, gallery, YouTube, cards, steps, schedule). Each language can have its own body. The formatting toolbar inside text blocks covers headings, lists, links, images, tables, and YouTube.

## Pages (informational CMS)
1. Open **Pages**.
2. Select the page matching the sitemap (example: Shrine → Welcome).
3. Choose the language tab (finish default first).
4. Edit title, introduction, and layout blocks; attach images from the media library.
5. For another language: **Copy from default**, then translate the copied blocks.
6. Save page and verify the public URL in that language.

## News & clergy messages
1. Open **News & clergy messages**.
2. Click Add post or Edit — language tabs are on the form.
3. Create/edit title, category (News, Events, Rector, Bishop, Press), body (rich text), featured image, status.
4. Fill other language tabs (Copy from default if helpful).
5. Save; check `/news` in each language you filled.

## Menus
1. Open **Settings & menus**.
2. Edit primary, utility, and footer navigation labels/paths.
3. Keep paths aligned with the sitemap.
4. Save and refresh the public header/footer.

## Gallery / Media (images & PDFs)
1. Open **Gallery / Media**.
2. Upload images or PDF documents.
3. Optionally flag images for `/gallery`.
4. Select uploads inside page/news/directory forms, or link PDFs from Support → Annual Reports content.
5. Prefer compressed web-sized images for mobile visitors.

## Translations (short UI labels only)
This screen does **not** edit page articles or layout.

1. Open **Translations**.
2. Select a language tab; the default-language column stays visible as the source.
3. Search or edit keys (Donate, Contact, form hints).
4. Optionally set **Default language** for first-time visitors.
5. Click **Save translations**.

For long editorial content, use language tabs on Pages, News, Churches, etc., then Save that record.

## Mass schedules
Add day, title, time, language, notes, and recurrence where needed. Verify `/shrine/mass-schedule`.

## Pilgrimage events
Create pilgrimage events with dates/times, recurrence (weekly/monthly/annual), registration flag, multilingual text. Verify `/pilgrimage/calendar` and `/pilgrimages/:slug`.

## Churches & apparition sites
Create/edit directory entries with media and language tabs. Slugs auto-generate from titles.

## Accommodations, development projects, testimonials, pilgrimage services, shrine experiences, videos
Same pattern: Edit → language tabs (Copy from default if helpful) → media/YouTube → Save → check public list/detail.

## Home hero
Update homepage slides, headline, support line, and CTAs. Use language tabs for heading, caption, and button labels. Keep the first viewport focused.

## Pilgrim Enquiries
Open threads from Dashboard or **Pilgrim Enquiries**, reply, attach documents, use WhatsApp link when helpful, update status.

## Users
Authorised managers open **Users**, create Admin/Editor accounts, share credentials securely, require password change. Phase 1: both roles use the CMS; finer ACL is a future upgrade.

## Settings & branding
Maintain organisation name, contact details, WhatsApp, social links, map embed, logo/theme options. Full backup steps are in the next section.

## Backups — DigitalOcean and the admin ZIP

There are **two backup options**. They complement each other. DigitalOcean copies stay on DigitalOcean. The admin ZIP is a file the Diocese can keep and take to another host.

### Option 1 — DigitalOcean server backup (web developer)

The hosting droplet can be snapshotted in the DigitalOcean panel. That restores the whole server quickly if the droplet fails, *while the account and region still exist*.

- This is configured and checked by the **web developer** (Ireme Tech), not by daily CMS staff.
- Retention is limited (often a few weeks). It is not a file you can download and take to another company.
- Ask the developer to confirm that droplet backups or weekly snapshots are switched on.

### Option 2 — Admin backup ZIP (sanctuary staff)

Administrators can download a full copy of *live content* without SSH. Open **Admin → Backup & restore** (bottom of the sidebar).

1. Sign in as an administrator (editors cannot use this page).
2. Click **Download full backup**. A ZIP is saved to your computer.
3. Store that file **off the web server** — a Diocese computer, Google Drive / OneDrive, or an encrypted USB. Keep at least the last two copies.
4. Do this **weekly**, and again after a large content update (new translations, many photos, a campaign).

The ZIP includes pages, menus, translations, news, schedules, directories, enquiries, admin users, the media library, and site images (logo, hero, and other photos). It does **not** include server secrets (database password, mail keys). Those stay in the server `.env` file, which the developer sets on each host.

### Restore from the admin ZIP

1. Download a backup of the *current* site first, in case you need to undo.
2. On **Backup & restore**, choose the ZIP, tick the confirmation box, then confirm twice.
3. Restore replaces all current content with the file. After a move to a new server, sign in with an administrator account that existed in that backup.

If the ZIP is too large for the browser, the developer can restore it on the server with `php artisan site:restore`.

Ireme Tech can help with a scheduled backup, a restore test, or a move to new hosting.

## New server, source code, and developer support

Moving host or rebuilding after a total crash is a **developer task**, with sanctuary staff providing the latest admin ZIP. The GitHub repository holds the website code (design and application). Live news, translations, and uploaded photos live in the database and the backup ZIP — a git clone alone is not a content backup.

### What the new server needs

| Requirement | Minimum / note |
|-------------|----------------|
| Account ownership | Hosting and domain in the name of the Diocese / Shrine |
| PHP | 8.1 or newer, with zip, GD (images), OpenSSL, Mbstring, JSON, Fileinfo |
| Database | MySQL 5.7+ / 8.x or MariaDB |
| Web server | Nginx or Apache with HTTPS (Let’s Encrypt or host SSL) |
| Composer | Required on the server to install the Laravel (PHP) application |
| Node.js & npm | Needed to *build* the React public site and admin. The live server does **not** need Node if the developer builds on a laptop and deploys the compiled files (the usual production method). Node is required on a machine that runs `npm run build` or `./deploy/build-local.sh`. |
| Git / GitHub | SSH or Git to pull the source. The developer can grant repository access. |
| Email | SMTP or an API (e.g. Resend) so enquiry notifications can send |
| Disk | Room for the application plus the media library (photos and PDFs grow over time) |

### Artisan commands the developer uses

Laravel is driven from the `backend/` folder with `php artisan …`. Staff do not need these day to day; they matter on a new server or a restore.

| Command | When it is used |
|---------|-----------------|
| `php artisan key:generate` | First setup of a new server (creates `APP_KEY` in `.env`) |
| `php artisan migrate` | Create or update database tables. Do **not** run `migrate:fresh --seed` on a live restore — that wipes content. |
| `php artisan storage:link` | Makes uploaded photos and PDFs visible at `/storage/…` |
| `php artisan site:backup` | Writes a full ZIP on the server (same contents as Admin → Backup & restore) |
| `php artisan site:restore /path/to/backup.zip` | Restores that ZIP when the file is too large to upload in the browser |
| `./deploy/deploy.sh` | On the droplet: git pull, Composer, migrate, copy public images (no Node required) |

Typical move: clone the GitHub repository → configure `.env` → Composer → migrate → restore the admin ZIP → `storage:link` → point the domain DNS at the new host. The domain registrar is independent of DigitalOcean.

### GitHub source code and help from Ireme Tech

- The developer can **share access to the source code on GitHub** with Diocese IT (organisation or invited accounts), so the Shrine is not locked to one laptop.
- Ireme Tech remains **available to help with migrating, backups, restores, and DigitalOcean snapshots** — including turning on droplet backups, testing a restore, or moving to another host.
- Day-to-day publishing (pages, news, photos, languages) stays in `/admin` and does not require GitHub.

Contact: https://iremetech.com

## Non-technical evaluation checklist
1. Create/edit a page (including a layout block)
2. Copy a page into another language with **Copy from default**, then Save
3. Switch the public language switcher and confirm the translation
4. Publish a news article with at least two language tabs
5. Update a menu
6. Replace an image
7. Upload a document
8. Change a short UI label in **Translations** and Save translations
9. Create a user (if authorised)
10. Download a backup from Admin → Backup & restore (store it off the server)

---

# Future upgrades — recommendations

Prioritise after Phase 1 go-live (each quoted separately):

1. Complete remaining translations for all pillar pages
2. Photography / media pack refresh
3. Scheduled off-site backup automation (complements host backup + manual export)
4. Donation payment gateway (card / mobile money)
5. Fine-grained staff permissions per module
6. Pilgrim self-service enquiry portal
7. Newsletter / mailing list integration
8. Additional languages (architecture ready)
9. Advanced search & formal accessibility certification
10. Design refresh / seasonal campaign templates
11. Light maintenance retainer for security updates and backup verification

**Not upgrades:** adding ordinary pages in existing pillars, publishing news, updating schedules, and translating existing fields—these are normal staff operations after training.
