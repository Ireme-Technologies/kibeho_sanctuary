import { primaryNav as staticPrimaryNav } from '@data/navigation'

/** CMS keys for per-pillar default footer explore band (`explore.shrine`, etc.). */
export const PILLAR_EXPLORE_KEYS = {
  shrine: 'explore.shrine',
  pilgrimage: 'explore.pilgrimage',
  spirituality: 'explore.spirituality',
  news: 'explore.news',
  broadcast: 'explore.broadcast',
  support: 'explore.support',
}

export const PILLAR_ROUTES = [
  { pillarId: 'shrine', hubPath: '/shrine', prefix: '/shrine' },
  { pillarId: 'pilgrimage', hubPath: '/pilgrimage', prefix: '/pilgrimage' },
  { pillarId: 'spirituality', hubPath: '/spirituality', prefix: '/spirituality' },
  { pillarId: 'news', hubPath: '/news', prefix: '/news' },
  { pillarId: 'broadcast', hubPath: '/broadcast', prefix: '/broadcast' },
  { pillarId: 'support', hubPath: '/support', prefix: '/support' },
]

/** Gallery sits under News in the menu but uses its own path. */
const EXTRA_PILLAR_PATHS = {
  '/gallery': 'news',
  '/pilgrimages': 'pilgrimage',
  '/hotels': 'pilgrimage',
}

export const PILLAR_EXPLORE_FALLBACKS = {
  [PILLAR_EXPLORE_KEYS.shrine]: {
    eyebrow: 'The Shrine',
    heading: 'Explore the Shrine',
    intro:
      'Walk through history, apparition sites, the schedule, communities, and the places pilgrims come to pray.',
    footerImage: '/images/sanctuary/home-reference.png',
    footerImageAlt: 'Plan of the Shrine of Our Lady of Kibeho',
  },
  [PILLAR_EXPLORE_KEYS.pilgrimage]: {
    eyebrow: 'Pilgrimage',
    heading: 'Plan your pilgrimage',
    intro: 'Why Kibeho, practical guidance, celebrations, accommodation, and how to get here.',
    footerImage: '/images/sanctuary/hills.jpg',
    footerImageAlt: 'Hills around the Shrine of Our Lady of Kibeho',
  },
  [PILLAR_EXPLORE_KEYS.spirituality]: {
    eyebrow: 'Spirituality',
    heading: 'Prayer and devotion',
    intro: 'Mass requests, candles, novenas, official prayers, and the spiritual life of the Shrine.',
    footerImage: '/images/sanctuary/mary.jpg',
    footerImageAlt: 'Our Lady of Kibeho',
  },
  [PILLAR_EXPLORE_KEYS.news]: {
    eyebrow: 'News',
    heading: 'News & stories',
    intro: 'Chronicles, celebrations, articles, announcements, and the photo gallery.',
    footerImage: '/images/sanctuary/church-wide.jpg',
    footerImageAlt: 'Shrine of Our Lady of Kibeho',
  },
  [PILLAR_EXPLORE_KEYS.broadcast]: {
    eyebrow: 'Broadcast',
    heading: 'Watch & listen',
    intro: 'Audio, video, documentaries, and our official channels.',
    footerImage: '/images/sanctuary/crest.jpg',
    footerImageAlt: 'Shrine of Our Lady of Kibeho',
  },
  [PILLAR_EXPLORE_KEYS.support]: {
    eyebrow: 'Support the Shrine',
    heading: 'Support the mission',
    intro: 'Vision, projects, transparency, and ways to give to the Shrine.',
    footerImage: '/images/sanctuary/hills.jpg',
    footerImageAlt: 'Landscape near Kibeho',
  },
}

const EXCLUDED_LINK_PATHS = new Set(['/shrine/map'])

function normalizePath(pathname) {
  const value = String(pathname || '').trim()
  if (!value) return '/'
  const trimmed = value.replace(/\/+$/, '')
  return trimmed || '/'
}

function pathBase(rawPath) {
  return normalizePath(String(rawPath || '').split('?')[0])
}

function pathMatches(current, rawPath) {
  const path = pathBase(rawPath)
  if (!path || path === '/') return false
  return current === path || current.startsWith(`${path}/`)
}

function hubPathFor(item) {
  if (item.path === '/' || !item.path) return '/shrine'
  return pathBase(item.path)
}

function pillarIdForHub(hubPath) {
  const route = PILLAR_ROUTES.find((entry) => entry.hubPath === hubPath)
  return route?.pillarId || null
}

function navItemForPillar(primaryNav, pillarId) {
  const route = PILLAR_ROUTES.find((entry) => entry.pillarId === pillarId)
  if (!route) return null
  const items = Array.isArray(primaryNav) && primaryNav.length ? primaryNav : staticPrimaryNav
  return items.find((item) => hubPathFor(item) === route.hubPath) || null
}

function buildLinksFromItem(item) {
  const children = (Array.isArray(item?.children) ? item.children : []).filter((child) => child?.path)
  const links = []
  const seen = new Set()
  children.forEach((child) => {
    const path = String(child.path || '').trim()
    const base = pathBase(path)
    if (!base || EXCLUDED_LINK_PATHS.has(base) || seen.has(base)) return
    seen.add(base)
    links.push({ label: child.label || base, path })
  })
  return links
}

/** Merge CMS submenu with static defaults so every pillar link stays visible. */
function mergeLinksWithDefaults(links, pillarId) {
  const defaults = defaultPillarExploreLinks(pillarId)
  if (!defaults.length) return links
  if (!links.length) return defaults

  const seen = new Set(links.map((link) => pathBase(link.path)))
  const merged = [...links]
  defaults.forEach((link) => {
    const base = pathBase(link.path)
    if (!base || seen.has(base)) return
    seen.add(base)
    merged.push(link)
  })
  return merged
}

function resolvePillarId(current) {
  if (EXTRA_PILLAR_PATHS[current]) return EXTRA_PILLAR_PATHS[current]
  if (current.startsWith('/pilgrimages/')) return 'pilgrimage'

  const route = PILLAR_ROUTES.find(
    (entry) => current === entry.hubPath || current.startsWith(`${entry.prefix}/`),
  )
  return route?.pillarId || null
}

/**
 * Returns pillar context + submenu links when the visitor is anywhere under a main menu pillar.
 */
export function getPillarExploreNav(pathname, primaryNav = []) {
  const current = normalizePath(pathname)
  if (!current || current === '/') return null

  const items = Array.isArray(primaryNav) && primaryNav.length ? primaryNav : staticPrimaryNav

  for (const item of items) {
    const children = (Array.isArray(item.children) ? item.children : []).filter((child) => child?.path)
    if (!children.length) continue

    const hubPath = hubPathFor(item)
    const onSection =
      current === hubPath || children.some((child) => pathMatches(current, child.path))
    if (!onSection) continue

    const pillarId = pillarIdForHub(hubPath)
    if (!pillarId) continue

    const links = mergeLinksWithDefaults(buildLinksFromItem(item), pillarId)
    if (!links.length) continue

    return {
      pillarId,
      pillarLabel: item.label || '',
      hubPath,
      exploreKey: PILLAR_EXPLORE_KEYS[pillarId],
      current,
      links,
    }
  }

  const pillarId = resolvePillarId(current)
  if (!pillarId) return null

  const item = navItemForPillar(items, pillarId)
  const route = PILLAR_ROUTES.find((entry) => entry.pillarId === pillarId)
  const links = mergeLinksWithDefaults(buildLinksFromItem(item), pillarId)
  if (!links.length) return null

  return {
    pillarId,
    pillarLabel: item?.label || pillarId,
    hubPath: route?.hubPath || `/${pillarId}`,
    exploreKey: PILLAR_EXPLORE_KEYS[pillarId],
    current,
    links,
  }
}

export function pillarExploreLinkIsActive(currentPath, linkPath) {
  const current = normalizePath(currentPath)
  const link = pathBase(linkPath)
  if (!current || !link) return false
  return current === link || current.startsWith(`${link}/`)
}

/** Default submenu links for a pillar (from static nav). */
export function defaultPillarExploreLinks(pillarId) {
  const item = navItemForPillar(staticPrimaryNav, pillarId)
  return buildLinksFromItem(item)
}

export function isPillarExploreKey(key) {
  return String(key || '').startsWith('explore.')
}
