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
| Pilgrimage Calendar | `/pilgrimage/calendar` | Upcoming pilgrimage events |
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
| Current Projects | `/support/projects` | Shrine project entities |
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
| Events (calendar) | Upcoming pilgrimages | Pilgrim calendar |
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
| Dashboard | Overview of pilgrim enquiries |
| Mass schedules | Weekly / recurring Mass times |
| Pilgrim calendar | Upcoming pilgrimages & events |
| Churches | Church directory |
| Apparition sites | Apparition site directory |
| Accommodations | Lodging / hotels |
| Support projects | Fundraising & development projects |
| Testimonials | Pilgrim / spiritual testimonies |
| News & clergy messages | Articles (categories, rich text, images) |
| Pilgrimage Services | Structured pilgrimage programs |
| Shrine Experiences | Activities / experiences |
| Videos (YouTube) | Video catalogue |
| Home hero | Homepage hero slides / media / CTAs |
| Pages | All CMS informational pages (blocks) |
| Translations | UI labels per language |
| Gallery / Media | Upload images & documents; gallery flag |
| Pilgrim Enquiries | Inbox, replies, documents |
| Users | Create staff accounts (authorised managers) |
| Settings & menus | Organisation details, contact, navigation, theme |

## 3.4 Live demonstration — tasks for a non-technical staff member

Provide a **staging URL** and a **demo admin account** (Diocese-owned email preferred). Walk through:

### A. Create and edit a page
1. Open **Pages**.
2. Select the page key (e.g. Shrine → Welcome).
3. Switch language tab if needed (FR / EN / …).
4. Edit title, intro, and content blocks; add or replace an image.
5. Click **Save**.
6. Open the public URL and confirm the change.

### B. Publish a news article
1. Open **News & clergy messages**.
2. Create article: title, category (News / Events / Rector / Bishop / Press), body (rich text), featured image.
3. Fill other language tabs as available.
4. Save / publish.
5. Verify on `/news` and the article URL.

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

### F. Manage translations
1. Open **Translations**.
2. Choose language tab (e.g. Français).
3. Edit a key (e.g. a button label).
4. Click **Save translations** (sticky bar appears when there are unsaved changes).
5. For long page/news text: open that item and use **language tabs** on the form—not only the Translations grid.

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
4. Always click **Save** or **Save translations** after edits. Unsaved translation edits show an amber sticky bar.

## Pages (informational CMS)
1. Open **Pages**.
2. Select the page key matching the sitemap (example: Shrine → Welcome).
3. Choose the language tab (RW / FR / EN / DE).
4. Edit title, introduction, and blocks; attach images from the media library.
5. Save and verify the public URL.

## News & clergy messages
1. Open **News & clergy messages**.
2. Create/edit title, category (News, Events, Rector, Bishop, Press), body (rich text), featured image, status.
3. Fill other language tabs as translations are ready.
4. Save; check `/news` and the article slug page.

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

## Translations
### UI dictionary
1. Open **Translations**.
2. Select language tab; search or edit keys.
3. Click **Save translations**.

### Long editorial content
Use language tabs on the specific content form (Pages, News, Churches, etc.), then Save that record.

## Mass schedules
Add day, title, time, language, notes, and recurrence where needed. Verify `/shrine/mass-schedule`.

## Pilgrim calendar
Create events with dates/times, recurrence (weekly/monthly/annual), registration flag, multilingual text. Verify `/pilgrimage/calendar`.

## Churches & apparition sites
Create/edit directory entries with media and language tabs. Slugs auto-generate from titles.

## Accommodations, support projects, testimonials, pilgrimage services, shrine experiences, videos
Same pattern: form → language tabs → media/YouTube → Save → check public list/detail.

## Home hero
Update homepage slides, headline, support line, and CTAs. Keep the first viewport focused.

## Pilgrim Enquiries
Open threads from Dashboard or **Pilgrim Enquiries**, reply, attach documents, use WhatsApp link when helpful, update status.

## Users
Authorised managers open **Users**, create Admin/Editor accounts, share credentials securely, require password change. Phase 1: both roles use the CMS; finer ACL is a future upgrade.

## Settings & branding
Maintain organisation name, contact details, WhatsApp, social links, map embed, logo/theme options.

## Non-technical evaluation checklist
1. Create/edit a page
2. Publish a news article
3. Update a menu
4. Replace an image
5. Upload a document
6. Manage translations (UI + content tab)
7. Create a user (if authorised)

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
