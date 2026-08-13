# Proposed solution — Shrine of Our Lady of Kibeho

Prepared by Ireme Tech for Diocese of Gikongoro evaluation.
Online version: https://demo.iremetech.com/docs/proposed-solution
Companion: https://demo.iremetech.com/docs/sitemap-and-admin-guide
Live demo: https://demo.iremetech.com/
Admin: https://demo.iremetech.com/admin/login

---

## Demo access & content note

- **Login URL:** `/admin/login` (e.g. https://demo.iremetech.com/admin/login)
- **Email:** `admin@kibeho.org`
- **Password:** `KibehoAdmin@202!`

Sample text and images on the demo will be updated as official content and photographs become available from the Diocese / Shrine.

---

# Cover letter — Response to the request for detailed website documentation

**To:** Diocese of Gikongoro / Shrine of Our Lady of Kibeho  
**From:** [FILL — Ireme Tech legal name]  
**Date:** [FILL]  
**Re:** Detailed description of the proposed system (flexibility in practice)

Dear [FILL — title / name],

Thank you for your clear request. We agree that “flexibility” must be defined in practice: who can change what, what is included now, what comes later, what it costs over five years, and who owns the result.

This pack answers each point you listed. It is based on the system already under construction for the Shrine of Our Lady of Kibeho, aligned with the Diocese Terms of Reference (six content pillars).

## Why we propose a dedicated platform rather than WordPress

WordPress is familiar and works well for many parish sites. For this project we recommend a **dedicated React + Laravel CMS** because:

1. **The information architecture is fixed by the ToR** (Our Lady, Shrine, Pilgrimage, Spirituality, News, Support). A custom admin mirrors those pillars (mass schedules, pilgrimage events, churches, apparition sites, accommodations, development projects, translations, pilgrim enquiries) instead of forcing them into generic “posts and pages.”
2. **React.js for interactive users and loading speed** — after the first load, the site updates language, menus, lists, and admin forms without full page reloads, which feels faster on mobile networks and supports a modern pilgrim experience.
3. **Laravel API for future connections** — a proper API is how websites today connect to **payment gateways**, **members / friends management**, CRM, mailing tools, and other Diocese systems without rebuilding the front end.
4. **Multilingual is designed in from the start** (Kinyarwanda, French, English, German), with UI labels and long-form content managed separately, and room for additional languages later.
5. **Ownership and portability** — hosting and domains are registered **under the Diocese/Shrine name**; the full source code and database belong to you; you are not locked to a proprietary theme marketplace or a single plugin vendor.
6. **Hosting on your existing infrastructure** — the application runs on standard PHP + MySQL hosting (shared or dedicated) when Git/SSH (or an agreed deploy process) is available.
7. **Backup resilience** — server-side backups **plus** a documented manual export of the full database (and media) so the site can be restored or moved even if automated backup fails.
8. **Handover** — source code repository, administrator accounts, and a written admin user guide are part of delivery—not an afterthought.

**Flexibility in practice** means: shrine staff publish and update content in the admin panel without a developer; structure, new languages, new modules (including payments and membership via the API), and security updates are planned as scoped work with clear costs.

We remain available for a live demonstration with non-technical staff and for any clarification before you confirm the approach.

Respectfully,  
[FILL — name, title, contact]

---

# Why React.js and a Laravel API

## React.js — interactive experience and loading speed

The public website and administration panel use **React.js** so pilgrims and staff get a responsive modern interface:

- **Faster perceived loading:** after the first load, React updates only the parts that change (language, menus, news, admin forms) instead of reloading the whole site—important on mobile networks.
- **Smooth interactivity:** language switcher, galleries, calendars, enquiry forms, and CMS editing without full page refreshes.
- **Shared UI stack:** visitors and editors use the same modern foundation.
- **Optimised builds:** Vite produces compressed assets for international visitors.

## Laravel API — ready for external services

Content and business logic run through a **Laravel API** (PHP). A clean API is what organisations need when the website must connect to other systems—not only display pages:

- **Payment gateways** (card, mobile money) can be added later without rebuilding the public site.
- **Members / friends of the Shrine management**, CRM, or mailing tools can integrate via the same API pattern.
- Email, WhatsApp, maps, and YouTube already follow this model.
- Future mobile apps or partner portals can reuse the API.

**Summary:** React serves interactive users quickly; Laravel exposes a durable API so the Shrine can grow into payments, membership, and other external services when the Diocese is ready—without WordPress plugin lock-in.

---

# 1. Functional requirements — current project vs later phase

Legend: **Included (Phase 1)** = in the current build / agreed delivery. **Later phase** = optional or deferred unless added to the quotation.

---

## 1.1 Public website (Phase 1)

| Function | Status | Notes |
|----------|--------|-------|
| Six-pillar information architecture (ToR) | Included | Our Lady, Shrine, Pilgrimage, Spirituality, News, Support |
| Responsive public pages (desktop & mobile) | Included | |
| Home page with hero, welcome, news, activities, accommodation teaser, etc. | Included | Sections editable via CMS |
| Static/informational CMS pages under each pillar | Included | Editable blocks (text, images, lists) |
| News / articles with categories (News, Events, Rector, Bishop, Press) | Included | |
| Photo gallery | Included | Media library flag “show in gallery” |
| Video listing (YouTube) | Included | |
| Mass schedule | Included | Dedicated admin + public page |
| Pilgrimage calendar / upcoming pilgrimages | Included | Dates, recurrence (weekly/monthly/annual) |
| Churches & apparition sites directories | Included | |
| Accommodation / lodging directory | Included | |
| Support / fundraising projects | Included | |
| Testimonials | Included | |
| Contact form | Included | Email notification |
| Pilgrim enquiry workflow (public submit + admin reply) | Included | Email + WhatsApp deep link |
| Language switcher (RW, FR, EN, DE) | Included | |
| Google Maps embed (settings) | Included | |
| Legacy URL redirects to new IA | Included | Protects old bookmarks |

## 1.2 Administration panel (Phase 1)

| Function | Status |
|----------|--------|
| Secure login (session / Sanctum) | Included |
| Dashboard (enquiry overview) | Included |
| Create / edit / publish CMS pages (sections & blocks) | Included |
| Create / edit / publish news articles | Included |
| Manage menus (primary, utility, footer) via Settings | Included |
| Upload / replace images & documents (media library) | Included |
| Manage translations (UI dictionary + per-content language tabs) | Included |
| Mass schedules CRUD | Included |
| Pilgrimage events CRUD | Included |
| Churches & apparition sites CRUD | Included |
| Accommodations CRUD | Included |
| Pilgrimage services / shrine experiences | Included |
| Development projects & testimonials | Included |
| Videos (YouTube) | Included |
| Home hero editor | Included |
| Theme / branding settings (logo, colours where configured) | Included |
| Pilgrim enquiries inbox & replies | Included |
| Create users (where permitted) | Included — role model exists; fine-grained permissions can be extended |
| My account / password change | Included |

## 1.3 Multilingual (Phase 1)

| Function | Status |
|----------|--------|
| Four languages: Kinyarwanda, French, English, German | Included |
| Configurable default language | Included |
| UI chrome translations (buttons, short labels) | Included |
| Per-record content translations (news, pages, schedules, etc.) | Included |
| Fallback when a translation is empty | Included | Default language → English |

## 1.4 Hosting, ownership, backup (Phase 1 delivery commitments)

| Function | Status |
|----------|--------|
| Hosting account under Diocese/Shrine name | Included (setup/assistance) |
| Domain configuration under client ownership | Included |
| Deploy to existing shared or dedicated hosting with Git/SSH | Included (subject to host capabilities) |
| Source code repository handover | Included |
| Admin user guide on handover | Included |
| Server backup configuration (DigitalOcean snapshots, by the developer) | Included (documented + assisted) |
| Admin Backup & restore ZIP (staff download, stored off the server) | Included |
| Media files included in the admin ZIP | Included |

## 1.5 Later phase / optional (not assumed in Phase 1 unless quoted)

| Function | Why deferred / optional |
|----------|-------------------------|
| Full pilgrim self-service portal (track own enquiries online) | API partially prepared; public UI not in Phase 1 router |
| Fine-grained permission matrix (editor vs admin per module) | Roles exist; both currently access full CMS |
| Contact-messages admin screen in sidebar | API exists; UI can be wired in a short follow-up |
| Online donations payment gateway (card/mobile money) | Support pages + info; payment integration is optional |
| Advanced search / full-text site search | Not in Phase 1 |
| Newsletter mailing list integration | Optional |
| Live chat widget | Optional |
| Mobile native apps | Out of scope |
| Automatic machine translation | Human-managed translations preferred for liturgical accuracy |
| Additional languages beyond RW/FR/EN/DE | Supported by architecture; content + UI keys added when needed |
| Automated off-site backup to Diocese cloud drive | Optional enhancement on top of hosting + manual export |
| Commenting on news articles | Placeholder only — not live |
| Accessibility audit certification (WCAG formal) | Can be a dedicated work package |
| Training workshops beyond handover guide + demo | Optional paid training days |

## 1.6 Explicit exclusions (unless added by change request)

- Rewriting third-party systems (Diocese email, accounting, parish management software)
- Content writing / professional translation of all pages (client or appointed translators provide text; we structure and train)
- Ongoing 24/7 on-call without a support contract
- Unlimited redesigns after final acceptance

---

# 4. Multilingual concept

Languages in scope for Phase 1: **Kinyarwanda (rw)**, **Français (fr)**, **English (en)**, **Deutsch (de)**.  
Additional languages can be enabled later without changing the core architecture.

---

## 4.1 Principles

1. **One content record, multiple languages** — each page, article, or schedule has a base record plus a translations pack; staff do not duplicate entire databases per language.
2. **Two translation layers** — short UI chrome vs long editorial content (see below).
3. **Human-managed translations** — liturgical and pastoral accuracy takes priority over automatic machine translation.
4. **Graceful fallback** — if a string or field is empty in the visitor’s language, the site shows the **default language**, then **English**, rather than a blank page.
5. **Visitor choice is remembered** — language preference is stored in the browser for return visits.

---

## 4.2 Layer A — UI dictionary (chrome)

**What:** Buttons, short labels, form hints, recurring phrases (“Donate”, “Contact”, “All rights reserved”, etc.).

**Where managed:** Admin → **Translations**  
- Tabs per language  
- Search by key or text  
- Add / delete keys  
- **Save translations** publishes the dictionary  

**Who:** Communications staff or a designated translator.

---

## 4.3 Layer B — Editorial / CMS content

**What:** Page titles and bodies, news articles, mass schedule notes, church descriptions, pilgrimage texts, testimonials, etc.

**Where managed:** On each content form via **language tabs** (same record).  
Example: edit a news article → Français tab → paste French body → Save.

**Who:** Content editors with translator support as needed.

---

## 4.4 Layer C — Menus

Menus are stored in **Settings**. Labels can be:

- Kept in one working language and mapped to dictionary keys for major items, and/or  
- Updated per campaign in Settings with translator coordination.

Recommendation for Phase 1: maintain menu structure in Settings; translate major pillar labels via the Translations dictionary; translate long page titles via CMS language tabs.

---

## 4.5 Technical flow (summary)

```
Visitor selects language
        ↓
Public site requests API with ?locale=fr (example)
        ↓
Laravel resolves each field:
  requested locale → base field → default locale pack → English pack
        ↓
UI chrome resolved from i18n dictionary with the same fallback chain
```

Default language is configurable in **Translations** (e.g. Kinyarwanda or French as primary for first-time visitors).

---

## 4.6 Adding a future language (e.g. Italian, Spanish, Latin)

| Step | Owner |
|------|--------|
| Enable locale code in configuration / Translations | Developer (short task) + admin |
| Translate UI dictionary keys | Diocese translators |
| Fill language tabs on priority pages & news | Content team |
| QA pass on navigation and key journeys | Diocese + developer support |

No full rebuild is required—only configuration, content entry, and testing.

---

## 4.7 Responsibilities

| Task | Diocese / Shrine | Developer |
|------|------------------|-----------|
| Provide accurate translations | Yes | Assists with tooling only |
| Enter UI strings in Translations admin | Yes | Training |
| Enter page/news translations in language tabs | Yes | Training |
| Enable a new language code | Rarely needed alone | Yes |
| Fix display bugs in a specific locale | Report | Yes |

---

## 4.8 Quality note for the Diocese

Official prayers, messages of the Blessed Virgin, and episcopal texts should be entered from **approved sources**. The CMS stores and displays them; it does not authorise theological content.

---

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

### A. DigitalOcean server backup (web developer)
- Enable droplet backups or weekly snapshots in the DigitalOcean panel. Ireme Tech configures and checks this.
- These restore the whole server quickly **only while DigitalOcean still holds them**.
- Retention is limited (often a few weeks). They are not a copy you can take to another company.

### B. Admin export ZIP (sanctuary staff)
Administrators download a ZIP from **Admin → Backup & restore**. It includes live CMS data, uploaded media, and site images. Store it **off the web server**. Restore from the same page (two-step confirmation), or `php artisan site:restore` if the file is large.

Full staff steps: administrator user guide → Backups.

### C. Application code and GitHub
- Git is the source of truth for the frontend and backend code. The developer can share GitHub access with Diocese IT.
- A git clone without a content backup restores the empty/seeded demo, not live Diocese content.
- Node.js is used to *build* the React app; the live server does not need Node if compiled files are deployed.
- Ireme Tech is available to help with migrating, backups, and restores.

### D. Domain
- The domain registrar is independent of DigitalOcean. Point DNS at the new host when moving.

---

## 5.7 Development and deployment flow

1. Development in Git repository (access transferred to Diocese on handover).
2. Staging site for Diocese review (recommended).
3. Production deploy via `deploy/deploy.sh` or host-specific Git pull + build.
4. Content entry continues in production admin without redeploying code for normal edits.

---

# 6. What the Diocese can do alone vs what needs a developer

Clarity here is the practical meaning of “flexibility.”

---

## 6.1 Diocese / Shrine staff — independent (no developer)

After training, staff can:

| Area | Examples |
|------|----------|
| Pages | Create/edit text, headings, lists, embed images on existing page templates |
| News | Publish, edit, unpublish articles; set categories; add featured images |
| Menus | Change labels and links in Settings (within existing structure) |
| Media | Upload/replace photos and PDFs; manage gallery |
| Translations | Update UI strings; fill language tabs on content |
| Schedules | Mass times; pilgrimage events events |
| Directories | Churches, apparition sites, accommodations, projects, testimonials, videos |
| Home hero | Update slides, titles, CTAs |
| Enquiries | Read pilgrim messages; reply; attach documents |
| Contact details | Phone, email, address, WhatsApp, social links in Settings |
| Users | Create additional editors (authorised managers) |
| Passwords | Change own password |

**Rule of thumb:** If it is text, an image, a PDF, a date, a menu link, or a translation of existing fields → staff can do it in `/admin`.

---

## 6.2 Needs developer assistance

| Change type | Examples |
|-------------|----------|
| New page **types** or modules | e.g. online shop, booking engine, live streaming module |
| New **sections** with custom layout/behaviour beyond existing blocks | Bespoke interactive maps, calculators, donation checkout |
| Design system overhaul | New global visual identity, typography, major redesign |
| New language **code** wiring | Adding Italian/Spanish to the platform list (then staff translate) |
| Hosting / DNS / SSL incidents | Server down, DNS move, PHP version upgrade on host |
| Security patches & framework upgrades | Laravel/React dependency updates |
| Payment gateway integration | Card / MoMo donations |
| Fine-grained permissions matrix | Per-module ACL beyond Admin/Editor |
| Data migration from another CMS | Import from WordPress/old site in bulk |
| Performance / SEO engineering beyond basics | Advanced CDN, complex schema campaigns |
| Bug fixes in application code | Display errors, API failures |

These are quoted as **change requests** or covered by a **maintenance retainer**.

---

## 6.3 Grey area (short developer help, then staff-owned)

| Task | Pattern |
|------|---------|
| Add a new informational page in an existing pillar | Developer may register the page key once; staff fill all languages thereafter |
| New news category label | Often staff-only; if filters need code, small ticket |
| Menu restructuring (new pillar) | Joint: IA approval + small nav/registry update + staff content |

---

## 6.4 Recommended operating model

1. **Day-to-day publishing** — Shrine communications team.  
2. **Monthly check-in** (optional retainer) — developer reviews updates, backups, security.  
3. **Change request board** — Diocese lists enhancements; estimated and approved before work.

---

# 7. Project scope, schedule, and acceptance

## 7.1 Included services (Phase 1)

| Service | Description |
|---------|-------------|
| Discovery & IA alignment | Confirm six-pillar ToR structure |
| UI design implementation | Public site + admin panel matching agreed visual direction |
| CMS development | Modules listed in functional requirements |
| Multilingual foundation | RW, FR, EN, DE |
| Hosting setup assistance | On **client-owned** hosting (shared or dedicated) |
| Domain / SSL assistance | Under Diocese/Shrine ownership |
| Content templates & seed structure | Empty or starter pages ready for Diocese content |
| Staging + production deploy | |
| Admin training / demo | Live walkthrough of key tasks |
| Administrator user guide | Written handover document |
| Source code repository handover | Git access / archive |
| Backup procedures | Server backup enablement + manual DB/media export documentation |
| Warranty period | [FILL — e.g. 30–90 days] bug fixes on delivered scope |

## 7.2 Exclusions

- Full professional copywriting and official translations of all pages  
- Photography / video production  
- Paid advertising  
- Third-party licence fees outside those listed in the quotation  
- Work outside the agreed sitemap unless change-requested  
- Unlimited post-acceptance redesigns  

## 7.3 Optional services (quoted separately)

| Option | Notes |
|--------|-------|
| Extra training days | On-site or remote |
| Content entry assistance | We type Diocese-provided text into CMS |
| Professional translation coordination | Project management only, or translation vendor |
| Payment gateway | Donations |
| Pilgrim self-service portal completion | |
| Extended maintenance retainer | See financial document |
| Formal accessibility audit | |
| Extra languages | After Phase 1 go-live |
| Automated off-site backup scripting | |

---

## 7.4 Proposed schedule (fill real dates)

| Milestone | Target | Deliverable | Approval |
|-----------|--------|-------------|----------|
| M0 — Kick-off | Week 0 | Scope signed; access to hosting/domain | Diocese + Ireme Tech |
| M1 — Architecture & sitemap freeze | Week [FILL] | Docs in this pack confirmed | Written approval |
| M2 — Design / UI review | Week [FILL] | Key templates (home, pillar, news, admin) | Written approval |
| M3 — CMS alpha | Week [FILL] | Admin usable on staging; sample content | Demo sign-off |
| M4 — Content & translation workshop | Week [FILL] | Staff enter priority pages in ≥2 languages | Attendance |
| M5 — Feature complete (UAT) | Week [FILL] | Full Phase 1 on staging | UAT checklist |
| M6 — Soft launch | Week [FILL] | Production URL live; DNS/SSL | Go-live approval |
| M7 — Final acceptance & handover | Week [FILL] | Code, accounts, backups, user guide | Acceptance certificate |

Total calendar duration: **[FILL — e.g. 8–14 weeks]** depending on content readiness and feedback speed.

**Critical path dependency:** Diocese content and translations. Development can finish while content is incomplete; **final acceptance of content completeness** is a Diocese responsibility unless content-entry is purchased.

---

## 7.5 Testing

| Type | Who |
|------|-----|
| Functional testing of admin tasks | Ireme Tech + Diocese staff |
| Multilingual spot-checks | Diocese translators |
| Mobile / desktop visual check | Both |
| Form & email delivery test | Both |
| Backup restore drill (sample) | Ireme Tech with Diocese IT witness |

---

## 7.6 Acceptance criteria (website considered complete)

The Phase 1 website is **accepted** when all of the following are true:

1. **Sitemap:** All Phase 1 pages in the agreed sitemap resolve (CMS or entity pages) without critical errors.  
2. **CMS:** A non-technical staff member can complete the demo checklist (create/edit page, news, menu, image, document, translations, users) on production or agreed staging.  
3. **Languages:** Language switcher offers RW, FR, EN, DE; fallback works; priority pages exist in the default language (full translation of every page may be ongoing and tracked separately).  
4. **Hosting:** Site runs on the **client-owned** hosting account with HTTPS.  
5. **Ownership:** Domain, hosting panel, admin users, Git repository access, and database export sample are in Diocese control or dual-controlled as agreed.  
6. **Documentation:** Administrator guide + backup procedure delivered.  
7. **Defects:** No open **critical** or **high** bugs from the UAT list (definitions below).  
8. **Training:** Agreed demo/training session completed (or waived in writing).

### Defect severity (for UAT)

| Level | Meaning |
|-------|---------|
| Critical | Site down, data loss, security breach, admin unusable |
| High | Major feature broken with no workaround |
| Medium | Feature impaired with workaround |
| Low | Cosmetic / minor text |

Only Critical/High block acceptance unless otherwise agreed.

---

## 7.7 Acceptance certificate (template)

> We, the Diocese of Gikongoro / Shrine of Our Lady of Kibeho, confirm that Phase 1 of the official website meets the acceptance criteria dated [FILL], and that ownership items listed in the handover checklist have been received.  
> Remaining content translation work is tracked in [FILL] and does not block technical acceptance.  
> Signed: _____________ Date: _____________

---

# 9. Ownership and handover

## 9.1 Principle

**The Diocese / Shrine owns the digital assets.** Ireme Tech builds and transfers; we do not retain the domain, hosting account, or source code as product lock-in.

---

## 9.2 Ownership checklist

| Asset | Owner | At handover |
|-------|-------|-------------|
| Domain name(s) | Diocese / Shrine | Registrar account in client name; credentials transferred |
| Hosting account | Diocese / Shrine | Panel access in client name (shared or dedicated) |
| SSL certificate | Diocese / Shrine | Issued on client hosting |
| Source code | Diocese / Shrine | Git repository access or full archive + licence to use/modify |
| Database | Diocese / Shrine | Live DB on client host + sample full export delivered |
| Media files (images, PDFs) | Diocese / Shrine | On client storage + export guidance |
| Administrator accounts | Diocese / Shrine | Master accounts on Diocese emails; developer access removed or limited by agreement |
| Documentation | Diocese / Shrine | Admin user guide + architecture/backup notes |
| Third-party API keys | Diocese / Shrine | Created under client accounts where possible (email, maps) |

---

## 9.3 Source-code repository

- Full application: `frontend/` (React) + `backend/` (Laravel) + `deploy/`.  
- Delivered via GitHub/GitLab/Bitbucket **organisation owned by the Diocese**, or export ZIP + documented structure.  
- README covers local run, deploy, and environment variables (without production secrets in Git).

---

## 9.4 Administrator accounts

1. Create Diocese-owned super admin (e.g. `communications@[shrine-domain]`).  
2. Optional editor accounts for staff.  
3. Rotate any temporary developer passwords.  
4. Document password reset via agreed email.  
5. Confirm **Users** management policy (who may create accounts).

---

## 9.5 Backup handover package

Delivered at M7:

- [ ] Hosting backup feature enabled and documented  
- [ ] One successful **full database export** file provided to Diocese  
- [ ] Media backup instructions (and optional archive)  
- [ ] Restore test note (date, who witnessed)  
- [ ] Contacts for hosting support  

---

## 9.6 Handover meeting agenda

1. Live admin walkthrough (demo checklist)  
2. Credential transfer (domain, host, Git, admin, email API)  
3. Backup drill  
4. Support / warranty window reminder  
5. Sign acceptance certificate  

---

## 9.7 Post-handover access

Any ongoing developer access is **by Diocese invitation** under a support agreement, not by silent retention of ownership.
