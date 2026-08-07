/**
 * Maps public routes → CMS page_sections keys (ToR IA).
 * Content is editable in Admin → Page sections.
 */

export const pageRegistry = {
  /* Our Lady of Kibeho */
  '/our-lady': 'our-lady.index',
  '/our-lady/apparitions': 'our-lady.apparitions',
  '/our-lady/visionaries': 'our-lady.visionaries',
  '/our-lady/messages': 'our-lady.messages',
  '/our-lady/church-recognition': 'our-lady.church-recognition',
  '/our-lady/history': 'our-lady.history',
  '/our-lady/faq': 'our-lady.faq',

  /* The Shrine */
  '/shrine': 'shrine.index',
  '/shrine/welcome': 'shrine.welcome',
  '/shrine/churches': 'shrine.churches',
  '/shrine/apparition-sites': 'shrine.apparition-sites',
  '/shrine/holy-spring': 'shrine.holy-spring',
  '/shrine/way-of-the-cross': 'shrine.way-of-the-cross',
  '/shrine/eucharistic-adorations': 'shrine.eucharistic-adorations',
  '/shrine/mass-schedule': 'shrine.mass-schedule',
  '/shrine/map': 'shrine.map',

  /* Pilgrimage */
  '/pilgrimage': 'pilgrimage.index',
  '/pilgrimage/why-kibeho': 'pilgrimage.why-kibeho',
  '/pilgrimage/plan': 'pilgrimage.plan',
  '/pilgrimage/accommodation': 'pilgrimage.accommodation',
  '/pilgrimage/transportation': 'pilgrimage.transportation',
  '/pilgrimage/office': 'pilgrimage.office',
  '/pilgrimage/calendar': 'pilgrimage.calendar',
  '/pilgrimage/practical-information': 'pilgrimage.practical-information',

  /* Spirituality */
  '/spirituality': 'spirituality.index',
  '/spirituality/prayer-intentions': 'spirituality.prayer-intentions',
  '/spirituality/request-a-mass': 'spirituality.request-a-mass',
  '/spirituality/rosary': 'spirituality.rosary',
  '/spirituality/seven-sorrows-rosary': 'spirituality.seven-sorrows-rosary',
  '/spirituality/novena': 'spirituality.novena',
  '/spirituality/official-prayers': 'spirituality.official-prayers',
  '/spirituality/meditations': 'spirituality.meditations',
  '/spirituality/testimonies': 'spirituality.testimonies',

  /* News hubs */
  '/news/videos': 'news.videos',

  /* Support the Shrine */
  '/support': 'support.index',
  '/support/vision': 'support.vision',
  '/support/master-plan': 'support.master-plan',
  '/support/projects': 'support.projects',
  '/support/donations': 'support.donations',
  '/support/annual-reports': 'support.annual-reports',
  '/support/transparency': 'support.transparency',
  '/support/partners': 'support.partners',

  /* Shared */
  '/hotels': 'hotels.index',
  '/faq': 'faq.index',

  /* Legacy paths (still resolve if bookmarked / CMS keys remain) */
  '/about': 'our-lady.index',
  '/about/kibeho-sanctuary': 'shrine.welcome',
  '/about/historical-insights': 'our-lady.history',
  '/about/mass-times': 'shrine.mass-schedule',
  '/about/water': 'shrine.holy-spring',
  '/about/accommodations': 'pilgrimage.accommodation',
  '/about/projects': 'support.projects',
  '/pilgrimage/what-is-a-pilgrimage': 'pilgrimage.why-kibeho',
  '/pilgrimage/join': 'pilgrimage.plan',
  '/pilgrimage/organise': 'pilgrimage.plan',
  '/visit': 'pilgrimage.practical-information',
  '/visit/getting-here': 'pilgrimage.transportation',
  '/visit/guidelines': 'pilgrimage.practical-information',
  '/support/why-donate': 'support.donations',
  '/support/offerings': 'support.donations',
  '/support/volunteer': 'support.partners',
  '/support/friends': 'support.partners',
  '/activities/rosary': 'spirituality.rosary',
  '/activities/rosary-7-sorrows': 'spirituality.seven-sorrows-rosary',
  '/activities/road-to-the-cross': 'shrine.way-of-the-cross',
  '/activities/water': 'shrine.holy-spring',
}

export function sectionKeyForPath(pathname) {
  return pageRegistry[pathname] || null
}
