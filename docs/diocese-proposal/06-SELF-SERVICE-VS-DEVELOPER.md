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
| Schedules | Mass times; pilgrim calendar events |
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
