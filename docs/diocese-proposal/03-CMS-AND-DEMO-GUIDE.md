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
