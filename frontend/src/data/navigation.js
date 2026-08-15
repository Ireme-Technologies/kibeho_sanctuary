/**
 * SITE NAVIGATION — Shrine of Our Lady of Kibeho
 * Aligns with Diocese of Gikongoro Terms of Reference (six pillars).
 * Mirrored in backend/database/data/sanctuary_navigation.json (Settings seeder).
 */

export const primaryNav = [
  {
    label: 'Our Lady of Kibeho',
    path: '/',
    children: [
      { label: 'The Apparitions', path: '/our-lady/apparitions' },
      { label: 'The Visionaries', path: '/our-lady/visionaries' },
      { label: 'The Messages', path: '/our-lady/messages' },
      { label: 'Church Recognition', path: '/our-lady/church-recognition' },
      { label: 'History', path: '/our-lady/history' },
      { label: 'Pastoral Team', path: '/our-lady/pastoral-team' },
      { label: 'Communities', path: '/our-lady/communities' },
      { label: 'FAQ', path: '/our-lady/faq' },
    ],
  },
  {
    label: 'The Shrine',
    path: '/shrine',
    children: [
      { label: 'Welcome', path: '/shrine/welcome' },
      { label: 'Churches', path: '/shrine/churches' },
      { label: 'Apparition Sites', path: '/shrine/apparition-sites' },
      { label: 'Holy Spring', path: '/shrine/holy-spring' },
      { label: 'Way of the Cross', path: '/shrine/way-of-the-cross' },
      { label: 'Eucharistic Adoration', path: '/shrine/eucharistic-adorations' },
      { label: 'Mass Schedule', path: '/shrine/mass-schedule' },
      { label: 'Shrine Map', path: '/shrine/map' },
    ],
  },
  {
    label: 'Pilgrimage',
    path: '/pilgrimage',
    children: [
      { label: 'Why Kibeho?', path: '/pilgrimage/why-kibeho' },
      { label: 'Plan your Pilgrimage', path: '/pilgrimage/plan' },
      { label: 'Accommodation', path: '/pilgrimage/accommodation' },
      { label: 'Transportation', path: '/pilgrimage/transportation' },
      { label: 'Pilgrimage Office', path: '/pilgrimage/office' },
      { label: 'Calendar', path: '/pilgrimage/calendar' },
      { label: 'Practical Information', path: '/pilgrimage/practical-information' },
    ],
  },
  {
    label: 'Spirituality',
    path: '/spirituality',
    children: [
      { label: 'Prayer Intentions', path: '/spirituality/prayer-intentions' },
      { label: 'Request a Mass', path: '/spirituality/request-a-mass' },
      { label: 'Rosary', path: '/spirituality/rosary' },
      { label: 'Seven Sorrows Rosary', path: '/spirituality/seven-sorrows-rosary' },
      { label: 'Novena', path: '/spirituality/novena' },
      { label: 'Official Prayers', path: '/spirituality/official-prayers' },
      { label: 'Meditations', path: '/spirituality/meditations' },
      { label: 'Testimonies', path: '/spirituality/testimonies' },
    ],
  },
  {
    label: 'News',
    path: '/news',
    children: [
      { label: 'News', path: '/news' },
      { label: 'Events', path: '/news?category=Events' },
      { label: 'Photos', path: '/gallery' },
      { label: 'Videos', path: '/news/videos' },
      { label: "Rector's Messages", path: '/news?category=Rector' },
      { label: "Bishop's Messages", path: '/news?category=Bishop' },
      { label: 'Press', path: '/news?category=Press' },
    ],
  },
  {
    label: 'Support the Shrine',
    path: '/support',
    children: [
      { label: 'Vision', path: '/support/vision' },
      { label: 'Master Plan', path: '/support/master-plan' },
      { label: 'Projects', path: '/support/projects' },
      { label: 'Donations', path: '/support/donations' },
      { label: 'Annual Reports', path: '/support/annual-reports' },
      { label: 'Transparency', path: '/support/transparency' },
      { label: 'Partners', path: '/support/partners' },
    ],
  },
]

export const utilityNav = [
  { label: 'Mass Schedule', path: '/shrine/mass-schedule' },
  { label: 'Plan Your Pilgrimage', path: '/pilgrimage/plan' },
  { label: 'Support the Shrine', path: '/support' },
]

export const footerLinks = [
  { label: 'Our Lady of Kibeho', path: '/our-lady' },
  { label: 'The Shrine', path: '/shrine' },
  { label: 'Pilgrimage', path: '/pilgrimage' },
  { label: 'Spirituality', path: '/spirituality' },
  { label: 'News', path: '/news' },
  { label: 'Support the Shrine', path: '/support' },
  { label: 'Contact', path: '/contact' },
]

/** High-traffic ToR destinations (not a duplicate of the Pilgrimage pillar alone) */
export const footerServiceLinks = [
  { label: 'The Apparitions', path: '/our-lady/apparitions' },
  { label: 'Mass Schedule', path: '/shrine/mass-schedule' },
  { label: 'Plan your Pilgrimage', path: '/pilgrimage/plan' },
  { label: 'Seven Sorrows Rosary', path: '/spirituality/seven-sorrows-rosary' },
  { label: 'Master Plan', path: '/support/master-plan' },
  { label: 'Donations', path: '/support/donations' },
]

/** ToR initial languages: Kinyarwanda, French, English, German */
export const languages = [
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
]

function navPath(item) {
  return String(item?.path || '').replace(/\/+$/, '') || '/'
}

export function ensureOurLadyNavChildren(items) {
  if (!Array.isArray(items)) return items
  const extras = [
    { label: 'Pastoral Team', path: '/our-lady/pastoral-team' },
    { label: 'Communities', path: '/our-lady/communities' },
  ]
  return items.map((item) => {
    const path = navPath(item)
    const label = String(item.label || '').toLowerCase()
    const isOurLady = path === '/' || path === '/our-lady' || label.includes('our lady')
    if (!isOurLady) return item
    const children = Array.isArray(item.children) ? [...item.children] : []
    const missing = extras.filter((extra) => !children.some((child) => navPath(child) === extra.path))
    if (!missing.length) return { ...item, children }
    const faqIndex = children.findIndex((child) => {
      const childPath = navPath(child)
      return childPath === '/our-lady/faq' || childPath === '/faq' || String(child.label || '').toLowerCase() === 'faq'
    })
    const inserts = missing.map((extra) => ({ ...extra }))
    if (faqIndex >= 0) children.splice(faqIndex, 0, ...inserts)
    else children.push(...inserts)
    return { ...item, children }
  })
}

export const navCTA = { label: 'Donate', path: '/support/donations' }
