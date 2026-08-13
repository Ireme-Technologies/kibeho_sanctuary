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
| Server backup configuration (provider tools) | Included (documented + assisted) |
| Manual full database export procedure | Included (documented; optional scheduled export script) |
| Media files backup guidance | Included |

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
