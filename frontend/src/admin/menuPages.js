import { DEFAULT_LOCALE, t as uiTranslate } from '@i18n/locales'
import { NAV_PATH_KEYS, navKeyForPath } from '@i18n/navKeys'

export const CUSTOM_PAGE = '__custom__'

const EXTRA_PAGES = [
  { path: '/pilgrimages', en: 'Upcoming pilgrimages' },
  { path: '/hotels', en: 'Hotels & accommodation' },
  { path: '/faq', en: 'FAQ' },
  { path: '/activities', en: 'Activities' },
]

const GROUP_ORDER = [
  'Our Lady of Kibeho',
  'The Shrine',
  'Pilgrimage',
  'Spirituality',
  'News',
  'Support the Shrine',
  'Other pages',
]

export function slugFromLabel(label) {
  return String(label || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function suggestPathFromLabel(label) {
  const slug = slugFromLabel(label)
  return slug ? `/${slug}` : ''
}

export function pageLabel(path, locale = DEFAULT_LOCALE) {
  const key = navKeyForPath(path)
  if (key) {
    const translated = uiTranslate(locale, key)
    if (translated && translated !== key) return translated
  }
  const extra = EXTRA_PAGES.find((item) => item.path === path)
  return extra?.en || ''
}

export function isKnownMenuPath(path) {
  if (!path) return false
  if (NAV_PATH_KEYS[path]) return true
  return EXTRA_PAGES.some((item) => item.path === path)
}

function groupForPath(path) {
  if (path === '/' || path.startsWith('/our-lady')) return 'Our Lady of Kibeho'
  if (path.startsWith('/shrine')) return 'The Shrine'
  if (path.startsWith('/pilgrimage') || path === '/pilgrimages' || path === '/hotels') return 'Pilgrimage'
  if (path.startsWith('/spirituality') || path === '/activities') return 'Spirituality'
  if (path.startsWith('/news') || path === '/gallery') return 'News'
  if (path.startsWith('/support')) return 'Support the Shrine'
  return 'Other pages'
}

export function groupedMenuPages() {
  const seen = new Set()
  const pages = []
  for (const path of Object.keys(NAV_PATH_KEYS)) {
    if (seen.has(path)) continue
    seen.add(path)
    pages.push({ path, group: groupForPath(path) })
  }
  for (const extra of EXTRA_PAGES) {
    if (seen.has(extra.path)) continue
    seen.add(extra.path)
    pages.push({ path: extra.path, group: groupForPath(extra.path) })
  }
  pages.sort((a, b) => {
    const groupDiff = GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group)
    if (groupDiff !== 0) return groupDiff
    return a.path.localeCompare(b.path)
  })
  const groups = []
  for (const page of pages) {
    const last = groups[groups.length - 1]
    if (!last || last.label !== page.group) groups.push({ label: page.group, pages: [page] })
    else last.pages.push(page)
  }
  return groups
}

export function pathPatchForPage(item, nextPath, defaultLocale = DEFAULT_LOCALE) {
  const prevAuto = pageLabel(item.path, defaultLocale)
  const nextAuto = pageLabel(nextPath, defaultLocale)
  const patch = { path: nextPath }
  if (!String(item.label || '').trim() || item.label === prevAuto) {
    if (nextAuto) patch.label = nextAuto
  }
  return patch
}
