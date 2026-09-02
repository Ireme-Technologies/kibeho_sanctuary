/**
 * Maps public routes → CMS page_sections keys (5-pillar IA).
 * Content is editable in Admin → Page sections.
 */

export const pageRegistry = {
  /* The Shrine */
  '/shrine': 'shrine.index',
  '/shrine/welcome': 'shrine.welcome',
  '/shrine/history': 'shrine.history',
  '/shrine/apparition-sites': 'shrine.apparition-sites',
  '/shrine/visionaries': 'shrine.visionaries',
  '/shrine/messages': 'shrine.messages',
  '/shrine/places': 'shrine.places',
  '/shrine/map': 'shrine.map',
  '/shrine/schedule': 'shrine.schedule',
  '/shrine/communities': 'shrine.communities',
  '/shrine/pastoral-team': 'shrine.pastoral-team',
  '/shrine/faq': 'shrine.faq',

  /* Pilgrimage */
  '/pilgrimage': 'pilgrimage.index',
  '/pilgrimage/why-kibeho': 'pilgrimage.why-kibeho',
  '/pilgrimage/plan': 'pilgrimage.plan',
  '/pilgrimage/practical-guidelines': 'pilgrimage.practical-guidelines',
  '/pilgrimage/annual-celebrations': 'pilgrimage.annual-celebrations',
  '/pilgrimage/accommodation': 'pilgrimage.accommodation',
  '/pilgrimage/how-to-get-here': 'pilgrimage.how-to-get-here',

  /* Spirituality */
  '/spirituality': 'spirituality.index',
  '/spirituality/prayer-intentions': 'spirituality.prayer-intentions',
  '/spirituality/mass-request': 'spirituality.mass-request',
  '/spirituality/light-a-candle': 'spirituality.light-a-candle',
  '/spirituality/novena': 'spirituality.novena',
  '/spirituality/share-testimony': 'spirituality.share-testimony',
  '/spirituality/processions': 'spirituality.processions',
  '/spirituality/official-prayers': 'spirituality.official-prayers',
  '/spirituality/meditations': 'spirituality.meditations',
  '/spirituality/adoration-worship': 'spirituality.adoration-worship',
  '/spirituality/confessions': 'spirituality.confessions',
  '/spirituality/blessings': 'spirituality.blessings',
  '/spirituality/books': 'spirituality.books',

  /* News & Broadcast */
  '/news/audio': 'news.audio',
  '/news/documentaries': 'news.documentaries',
  '/news/broadcast': 'news.broadcast',
  '/broadcast': 'news.broadcast',
  '/news/our-channels': 'news.our-channels',
  '/news/videos': 'news.videos',

  /* Support the Shrine */
  '/support': 'support.index',
  '/support/vision': 'support.vision',
  '/support/projects': 'support.projects',
  '/support/get-involved': 'support.donations',
  '/support/master-plan': 'support.master-plan',
  '/support/annual-reports': 'support.annual-reports',
  '/support/transparency': 'support.transparency',
  '/support/partners': 'support.partners',

  /* Shared */
  '/hotels': 'hotels.index',
  '/faq': 'faq.index',

  /* Legacy — Our Lady pillar → Shrine */
  '/our-lady': 'shrine.index',
  '/our-lady/apparitions': 'shrine.apparition-sites',
  '/our-lady/visionaries': 'shrine.visionaries',
  '/our-lady/messages': 'shrine.messages',
  '/our-lady/church-recognition': 'shrine.history',
  '/our-lady/history': 'shrine.history',
  '/our-lady/pastoral-team': 'shrine.pastoral-team',
  '/our-lady/communities': 'shrine.communities',
  '/our-lady/faq': 'shrine.faq',

  /* Legacy — Shrine paths */
  '/shrine/churches': 'shrine.places',
  '/shrine/mass-schedule': 'shrine.schedule',
  '/shrine/map': 'shrine.map',
  '/shrine/holy-spring': 'shrine.places',
  '/shrine/way-of-the-cross': 'shrine.places',
  '/shrine/eucharistic-adorations': 'spirituality.adoration-worship',

  /* Legacy — Pilgrimage paths */
  '/pilgrimage/transportation': 'pilgrimage.how-to-get-here',
  '/pilgrimage/practical-information': 'pilgrimage.practical-guidelines',
  '/pilgrimage/what-is-a-pilgrimage': 'pilgrimage.why-kibeho',
  '/pilgrimage/join': 'pilgrimage.plan',
  '/pilgrimage/organise': 'pilgrimage.plan',
  '/pilgrimage/office': 'pilgrimage.plan',
  '/pilgrimage/calendar': 'pilgrimage.annual-celebrations',

  /* Legacy — Spirituality paths */
  '/spirituality/request-a-mass': 'spirituality.mass-request',
  '/spirituality/rosary': 'spirituality.index',
  '/spirituality/seven-sorrows-rosary': 'spirituality.index',
  '/spirituality/testimonies': 'spirituality.share-testimony',

  /* Legacy — Support paths */
  '/support/donations': 'support.donations',
  '/support/why-donate': 'support.donations',
  '/support/offerings': 'support.donations',
  '/support/volunteer': 'support.index',
  '/support/friends': 'support.index',

  /* Legacy — About / visit */
  '/about': 'shrine.index',
  '/about/kibeho-sanctuary': 'shrine.welcome',
  '/about/historical-insights': 'shrine.history',
  '/about/mass-times': 'shrine.schedule',
  '/about/water': 'shrine.places',
  '/about/accommodations': 'pilgrimage.accommodation',
  '/about/projects': 'support.projects',
  '/about/pastoral-team': 'shrine.pastoral-team',
  '/about/communities': 'shrine.communities',
  '/visit': 'pilgrimage.practical-guidelines',
  '/visit/getting-here': 'pilgrimage.how-to-get-here',
  '/visit/guidelines': 'pilgrimage.practical-guidelines',

  /* Legacy — Activities */
  '/activities/rosary': 'spirituality.index',
  '/activities/rosary-7-sorrows': 'spirituality.index',
  '/activities/road-to-the-cross': 'shrine.places',
  '/activities/water': 'shrine.places',
}

export function sectionKeyForPath(pathname) {
  return pageRegistry[pathname] || null
}

export function pathForSectionKey(key) {
  const match = Object.entries(pageRegistry).find(([, sectionKey]) => sectionKey === key)
  return match?.[0] || `/${String(key || '').replace(/\./g, '/')}`
}
