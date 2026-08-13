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
