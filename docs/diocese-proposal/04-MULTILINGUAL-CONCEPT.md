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

**Where managed:** On each content form via the blue **Content language** bar (same record).  
Example: edit a news article → Français tab → **Copy from default** → translate the body → Save.

**Page layout:** On **Pages**, each language can have its own blocks (heading, rich text, gallery, YouTube, cards, schedule). Until a language has saved blocks, the public site shows the default-language layout.

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

## 4.9 Best way for staff to work (daily)

1. Sign in at `/admin`. Dashboard cards point to languages and page layout.
2. Finish the **default language** on the item first.
3. Click **Edit** (or open **Pages**). Language tabs are on the form, not the list.
4. Choose Ikinyarwanda / Français / English / Deutsch. A **green dot** means that language has text.
5. Click **Copy from default**, translate in place, then **Save** that record.
6. Use **Translations** only for short buttons (Donate, Contact). Click **Save translations** there.
7. Check the public language switcher. Empty fields fall back to the default language, then English — that is expected until the tab is filled.

Do not look only at the Translations grid for page articles. That screen will not show the rich-text editor or page blocks.
