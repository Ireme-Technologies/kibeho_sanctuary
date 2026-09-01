/**
 * SITE NAVIGATION — Shrine of Our Lady of Kibeho
 * Five-pillar IA. Mirrored in backend/database/data/sanctuary_navigation.json.
 */

export const primaryNav = [
  {
    label: 'The Shrine',
    path: '/shrine',
    children: [
      { label: 'Welcome', path: '/shrine/welcome' },
      { label: 'History', path: '/shrine/history' },
      { label: 'Apparition Sites', path: '/shrine/apparition-sites' },
      { label: 'Visionaries', path: '/shrine/visionaries' },
      { label: 'The Messages', path: '/shrine/messages' },
      { label: 'Main Places', path: '/shrine/places' },
      { label: 'Schedule', path: '/shrine/schedule' },
      { label: 'Communities', path: '/shrine/communities' },
      { label: 'Pastoral Team', path: '/shrine/pastoral-team' },
      { label: 'FAQ', path: '/shrine/faq' },
    ],
  },
  {
    label: 'Pilgrimage',
    path: '/pilgrimage',
    children: [
      { label: 'Why Kibeho?', path: '/pilgrimage/why-kibeho' },
      { label: 'Plan Your Pilgrimage', path: '/pilgrimage/plan' },
      { label: 'Practical Guidelines', path: '/pilgrimage/practical-guidelines' },
      { label: 'Annual Celebrations', path: '/pilgrimage/annual-celebrations' },
      { label: 'Accommodation', path: '/pilgrimage/accommodation' },
      { label: 'How to Get Here', path: '/pilgrimage/how-to-get-here' },
    ],
  },
  {
    label: 'Spirituality',
    path: '/spirituality',
    children: [
      { label: 'Prayer Intentions', path: '/spirituality/prayer-intentions' },
      { label: 'Mass Request', path: '/spirituality/mass-request' },
      { label: 'Light a Candle', path: '/spirituality/light-a-candle' },
      { label: 'Novena', path: '/spirituality/novena' },
      { label: 'Share Your Testimony', path: '/spirituality/share-testimony' },
      { label: 'Processions', path: '/spirituality/processions' },
      { label: 'Official Prayers', path: '/spirituality/official-prayers' },
      { label: 'Meditations', path: '/spirituality/meditations' },
      { label: 'Adoration & Worship', path: '/spirituality/adoration-worship' },
      { label: 'Confessions', path: '/spirituality/confessions' },
      { label: 'Blessings', path: '/spirituality/blessings' },
      { label: 'Books', path: '/spirituality/books' },
    ],
  },
  {
    label: 'News',
    path: '/news',
    children: [
      { label: 'Chronicles', path: '/news?category=Chronicles' },
      { label: 'Annual Celebrations', path: '/news?category=Annual+Celebrations' },
      { label: 'Articles', path: '/news?category=Articles' },
      { label: 'Announcements', path: '/news?category=Announcements' },
      { label: 'Gallery', path: '/gallery' },
      { label: 'Broadcast', path: '/news/broadcast' },
      { label: 'Audio', path: '/news/audio' },
      { label: 'Video', path: '/news/videos' },
      { label: 'Documentaries', path: '/news/documentaries' },
      { label: 'Our Channels', path: '/news/our-channels' },
    ],
  },
  {
    label: 'Support the Shrine',
    path: '/support',
    children: [
      { label: 'Vision', path: '/support/vision' },
      { label: 'Projects', path: '/support/projects' },
      { label: 'Donate', path: '/support/donations' },
    ],
  },
]

export const utilityNav = [
  { label: 'Mass Schedule', path: '/shrine/schedule' },
  { label: 'Plan Your Pilgrimage', path: '/pilgrimage/plan' },
  { label: 'Support the Shrine', path: '/support' },
]

export const footerLinks = [
  { label: 'The Shrine', path: '/shrine' },
  { label: 'Pilgrimage', path: '/pilgrimage' },
  { label: 'Spirituality', path: '/spirituality' },
  { label: 'News', path: '/news' },
  { label: 'Support the Shrine', path: '/support' },
  { label: 'Contact', path: '/contact' },
]

export const footerServiceLinks = [
  { label: 'Plan Your Pilgrimage', path: '/pilgrimage/plan' },
  { label: 'Mass Schedule', path: '/shrine/schedule' },
  { label: 'Accommodation', path: '/pilgrimage/accommodation' },
  { label: 'Light a Candle', path: '/spirituality/light-a-candle' },
  { label: 'International Pilgrimage', path: '/pilgrimage/why-kibeho' },
  { label: 'Donate', path: '/support/donations' },
]

export const languages = [
  { code: 'rw', label: 'Kinyarwanda', flag: '🇷🇼' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
]

function navPath(item) {
  return String(item?.path || '').replace(/\/+$/, '') || '/'
}

/** Home is the portal; the first pillar opens the shrine hub. */
export function ensureOurLadyNavPath(items) {
  if (!Array.isArray(items)) return items
  return items.map((item) => {
    const path = navPath(item)
    const label = String(item.label || '').toLowerCase()
    const isShrineRoot = path === '/' || path === '/shrine' || label.includes('shrine')
    if (!isShrineRoot) return item
    return { ...item, path: '/shrine' }
  })
}

/** Parent News already lists the feed — do not repeat it as the first child. */
export function ensureNewsNavChildren(items) {
  if (!Array.isArray(items)) return items
  return items.map((item) => {
    const path = navPath(item)
    const label = String(item.label || '').toLowerCase()
    const isNews = path === '/news' || label === 'news'
    if (!isNews || !Array.isArray(item.children)) return item
    const children = item.children.filter((child) => navPath(child) !== '/news')
    return { ...item, children: children.length ? children : item.children }
  })
}

export function ensureOurLadyNavChildren(items) {
  if (!Array.isArray(items)) return items
  const extras = [
    { label: 'Pastoral Team', path: '/shrine/pastoral-team' },
    { label: 'Communities', path: '/shrine/communities' },
  ]
  return items.map((item) => {
    const path = navPath(item)
    const label = String(item.label || '').toLowerCase()
    const isShrine = path === '/' || path === '/shrine' || label.includes('shrine')
    if (!isShrine) return item
    const children = Array.isArray(item.children) ? [...item.children] : []
    const missing = extras.filter((extra) => !children.some((child) => navPath(child) === extra.path))
    if (!missing.length) return { ...item, children }
    const faqIndex = children.findIndex((child) => {
      const childPath = navPath(child)
      return childPath === '/shrine/faq' || childPath === '/faq' || String(child.label || '').toLowerCase() === 'faq'
    })
    const inserts = missing.map((extra) => ({ ...extra }))
    if (faqIndex >= 0) children.splice(faqIndex, 0, ...inserts)
    else children.push(...inserts)
    return { ...item, children }
  })
}

export const navCTA = { label: 'Donate', path: '/support/donations' }
