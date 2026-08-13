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
| Directories | Churches, sites, accommodations, development projects | Dedicated modules |
| Media | Photos, PDFs | Gallery / Media |
| Videos | YouTube | Videos |
| Forms | Contact, pilgrim enquiry, mass request (as configured) | Enquiries + public forms |
| Downloads | Reports, leaflets | Media attached to pages or library |
| Menus | Primary, utility, footer | Settings & menus |
| UI strings | Buttons, short labels | Translations |

Menus and page structure can grow by adding CMS page keys and menu entries without rebuilding the whole site—subject to agreed IA changes.
