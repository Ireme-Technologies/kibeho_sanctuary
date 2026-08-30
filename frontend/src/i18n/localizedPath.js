import { LOCALES, DEFAULT_LOCALE } from '@i18n/locales'
import { pageRegistry, pathForSectionKey, sectionKeyForPath } from '@data/pages/registry'

/**
 * Default translated public paths for CMS pages (without locale prefix).
 * Editors can override per page in Admin → Page sections → path field per language.
 * Keys are stable section keys; values are pathnames starting with /.
 */
export const DEFAULT_CMS_PATHS = {
  fr: {
    'our-lady.index': '/notre-dame',
    'our-lady.apparitions': '/notre-dame/apparitions',
    'our-lady.visionaries': '/notre-dame/voyantes',
    'our-lady.messages': '/notre-dame/messages',
    'our-lady.church-recognition': '/notre-dame/reconnaissance-de-leglise',
    'our-lady.history': '/notre-dame/histoire',
    'our-lady.faq': '/notre-dame/faq',
    'shrine.index': '/sanctuaire',
    'shrine.welcome': '/sanctuaire/accueil',
    'shrine.holy-spring': '/sanctuaire/source-sainte',
    'shrine.way-of-the-cross': '/sanctuaire/chemin-de-croix',
    'shrine.eucharistic-adorations': '/sanctuaire/adorations-eucharistiques',
    'shrine.map': '/sanctuaire/plan',
    'pilgrimage.index': '/pelerinage',
    'pilgrimage.why-kibeho': '/pelerinage/pourquoi-kibeho',
    'pilgrimage.plan': '/pelerinage/preparer',
    'pilgrimage.transportation': '/pelerinage/transport',
    'pilgrimage.office': '/pelerinage/bureau',
    'pilgrimage.practical-information': '/pelerinage/informations-pratiques',
    'spirituality.index': '/spiritualite',
    'spirituality.prayer-intentions': '/spiritualite/intentions-de-priere',
    'spirituality.request-a-mass': '/spiritualite/demander-une-messe',
    'spirituality.rosary': '/spiritualite/rosaire',
    'spirituality.seven-sorrows-rosary': '/spiritualite/rosaire-des-sept-douleurs',
    'spirituality.novena': '/spiritualite/neuvaine',
    'spirituality.official-prayers': '/spiritualite/prieres-officielles',
    'spirituality.meditations': '/spiritualite/meditations',
    'support.index': '/soutenir',
    'support.vision': '/soutenir/vision',
    'support.master-plan': '/soutenir/plan-directeur',
    'support.donations': '/soutenir/dons',
    'support.annual-reports': '/soutenir/rapports-annuels',
    'support.transparency': '/soutenir/transparence',
    'support.partners': '/soutenir/partenaires',
  },
  de: {
    'our-lady.index': '/unsere-liebe-frau',
    'our-lady.apparitions': '/unsere-liebe-frau/erscheinungen',
    'our-lady.visionaries': '/unsere-liebe-frau/seherinnen',
    'our-lady.messages': '/unsere-liebe-frau/botschaften',
    'our-lady.church-recognition': '/unsere-liebe-frau/kirchliche-anerkennung',
    'our-lady.history': '/unsere-liebe-frau/geschichte',
    'our-lady.faq': '/unsere-liebe-frau/faq',
    'shrine.index': '/heiligtum',
    'shrine.welcome': '/heiligtum/willkommen',
    'shrine.holy-spring': '/heiligtum/heilige-quelle',
    'shrine.way-of-the-cross': '/heiligtum/kreuzweg',
    'shrine.eucharistic-adorations': '/heiligtum/eucharistische-anbetung',
    'shrine.map': '/heiligtum/lageplan',
    'pilgrimage.index': '/wallfahrt',
    'pilgrimage.why-kibeho': '/wallfahrt/warum-kibeho',
    'pilgrimage.plan': '/wallfahrt/vorbereiten',
    'pilgrimage.transportation': '/wallfahrt/anreise',
    'pilgrimage.office': '/wallfahrt/buero',
    'pilgrimage.practical-information': '/wallfahrt/praktische-informationen',
    'spirituality.index': '/spiritualitaet',
    'spirituality.prayer-intentions': '/spiritualitaet/gebetsanliegen',
    'spirituality.request-a-mass': '/spiritualitaet/messe-bestellen',
    'spirituality.rosary': '/spiritualitaet/rosenkranz',
    'spirituality.seven-sorrows-rosary': '/spiritualitaet/sieben-schmerzen-rosenkranz',
    'spirituality.novena': '/spiritualitaet/novene',
    'spirituality.official-prayers': '/spiritualitaet/offizielle-gebete',
    'spirituality.meditations': '/spiritualitaet/meditationen',
    'support.index': '/unterstuetzen',
    'support.vision': '/unterstuetzen/vision',
    'support.master-plan': '/unterstuetzen/masterplan',
    'support.donations': '/unterstuetzen/spenden',
    'support.annual-reports': '/unterstuetzen/jahresberichte',
    'support.transparency': '/unterstuetzen/transparenz',
    'support.partners': '/unterstuetzen/partner',
  },
  rw: {
    'our-lady.index': '/nyina-wacu',
    'our-lady.apparitions': '/nyina-wacu/ibigaragara',
    'our-lady.visionaries': '/nyina-wacu/ababonye',
    'our-lady.messages': '/nyina-wacu/ubutumwa',
    'our-lady.church-recognition': '/nyina-wacu/kwemererwa-na-kiliziya',
    'our-lady.history': '/nyina-wacu/amateka',
    'our-lady.faq': '/nyina-wacu/ibibazo',
    'shrine.index': '/umwibutso',
    'shrine.welcome': '/umwibutso/kwakira',
    'shrine.holy-spring': '/umwibutso/isoko-nera',
    'shrine.way-of-the-cross': '/umwibutso/inzira-y-umusalaba',
    'shrine.eucharistic-adorations': '/umwibutso/gusenga-eukaristiya',
    'shrine.map': '/umwibutso/ikarita',
    'pilgrimage.index': '/urugendo',
    'pilgrimage.why-kibeho': '/urugendo/kuki-kibeho',
    'pilgrimage.plan': '/urugendo/gutegura',
    'pilgrimage.transportation': '/urugendo/gutwara',
    'pilgrimage.office': '/urugendo/ibiro',
    'pilgrimage.practical-information': '/urugendo/amakuru-akenewe',
    'spirituality.index': '/ubwiyunge',
    'spirituality.prayer-intentions': '/ubwiyunge/ibyifuzo-byo-gusenga',
    'spirituality.request-a-mass': '/ubwiyunge/gusaba-imisa',
    'spirituality.rosary': '/ubwiyunge/rozari',
    'spirituality.seven-sorrows-rosary': '/ubwiyunge/rozari-y-imibabaro-7',
    'spirituality.novena': '/ubwiyunge/novena',
    'spirituality.official-prayers': '/ubwiyunge/amasengesho-yemewe',
    'spirituality.meditations': '/ubwiyunge/kwiyumamo',
    'support.index': '/gushyigikira',
    'support.vision': '/gushyigikira/icyerekezo',
    'support.master-plan': '/gushyigikira/gahunda-nkuru',
    'support.donations': '/gushyigikira/impano',
    'support.annual-reports': '/gushyigikira/raporo-z-umwaka',
    'support.transparency': '/gushyigikira/gufungura',
    'support.partners': '/gushyigikira/abafatanyabikorwa',
  },
}

const LOCALE_CODES = new Set(LOCALES.map((item) => item.code))

export function normalizePath(path) {
  if (!path || path === '/') return '/'
  const withSlash = path.startsWith('/') ? path : `/${path}`
  return withSlash.replace(/\/+$/, '') || '/'
}

export function isLocaleCode(code) {
  return Boolean(code && LOCALE_CODES.has(String(code).toLowerCase()))
}

/**
 * Split /fr/pelerinage/pourquoi-kibeho → { locale: 'fr', path: '/pelerinage/pourquoi-kibeho' }
 * Split /pilgrimage/why-kibeho → { locale: null, path: '/pilgrimage/why-kibeho' }
 */
export function parseLocalizedPathname(pathname) {
  const clean = normalizePath(pathname)
  const parts = clean.split('/').filter(Boolean)
  if (!parts.length) return { locale: null, path: '/' }
  const maybeLocale = parts[0].toLowerCase()
  if (isLocaleCode(maybeLocale)) {
    const rest = parts.slice(1)
    return {
      locale: maybeLocale,
      path: rest.length ? `/${rest.join('/')}` : '/',
    }
  }
  return { locale: null, path: clean }
}

export function withLocale(path, locale) {
  const code = String(locale || DEFAULT_LOCALE).toLowerCase()
  const clean = normalizePath(path)
  if (clean === '/') return `/${code}`
  return `/${code}${clean}`
}

/** Strip a leading locale segment if present. */
export function stripLocale(pathname) {
  return parseLocalizedPathname(pathname).path
}

function cmsOverridePath(pages, key, locale) {
  const pack = pages?.[key]?.translations?.[locale]
  const raw = pack?.path || pack?.slug
  if (!raw) return null
  return normalizePath(String(raw))
}

/**
 * Public path for a CMS section key in a given locale (no locale prefix).
 */
export function pathForCmsKey(key, locale, pages = {}, defaultLocale = DEFAULT_LOCALE) {
  if (!key) return '/'
  const code = String(locale || defaultLocale).toLowerCase()
  const fromCms = cmsOverridePath(pages, key, code)
  if (fromCms) return fromCms
  if (code !== defaultLocale) {
    const seeded = DEFAULT_CMS_PATHS[code]?.[key]
    if (seeded) return normalizePath(seeded)
  }
  return normalizePath(pathForSectionKey(key))
}

/**
 * Resolve a public path (no locale prefix) to a stable CMS section key.
 */
export function cmsKeyForPath(path, locale, pages = {}, defaultLocale = DEFAULT_LOCALE) {
  const clean = normalizePath(path)
  const code = String(locale || defaultLocale).toLowerCase()

  // 1. Explicit CMS override for this locale
  if (pages && typeof pages === 'object') {
    for (const [key, record] of Object.entries(pages)) {
      const override = cmsOverridePath({ [key]: record }, key, code)
      if (override === clean) return key
    }
  }

  // 2. Seeded translations for this locale
  const seeded = DEFAULT_CMS_PATHS[code] || {}
  for (const [key, seededPath] of Object.entries(seeded)) {
    if (normalizePath(seededPath) === clean) return key
  }

  // 3. Default English registry (so /fr/pilgrimage/why-kibeho still works)
  const fromRegistry = sectionKeyForPath(clean)
  if (fromRegistry) return fromRegistry

  // 4. Search all seeded locales (visitor used FR path while locale is still EN, etc.)
  for (const map of Object.values(DEFAULT_CMS_PATHS)) {
    for (const [key, seededPath] of Object.entries(map)) {
      if (normalizePath(seededPath) === clean) return key
    }
  }

  // 5. CMS overrides in any language
  if (pages && typeof pages === 'object') {
    for (const [key, record] of Object.entries(pages)) {
      const bag = record?.translations || {}
      for (const pack of Object.values(bag)) {
        const raw = pack?.path || pack?.slug
        if (raw && normalizePath(String(raw)) === clean) return key
      }
    }
  }

  return null
}

/**
 * Localize an internal href for the current locale.
 * CMS information pages use translated paths when available;
 * other routes keep their structural path under /:locale/...
 */
export function localizeHref(href, locale, pages = {}, defaultLocale = DEFAULT_LOCALE) {
  if (!href || typeof href !== 'string') return href
  if (/^(https?:|mailto:|tel:|#)/i.test(href)) return href

  const { path } = parseLocalizedPathname(href)
  const code = String(locale || defaultLocale).toLowerCase()

  if (path === '/') return withLocale('/', code)

  const key = cmsKeyForPath(path, code, pages, defaultLocale)
  if (key) {
    return withLocale(pathForCmsKey(key, code, pages, defaultLocale), code)
  }

  return withLocale(path, code)
}

/**
 * When switching language, map the current URL to the equivalent path in the new locale.
 */
export function remapPathForLocale(pathname, nextLocale, pages = {}, defaultLocale = DEFAULT_LOCALE) {
  const { path } = parseLocalizedPathname(pathname)
  if (path === '/') return withLocale('/', nextLocale)

  const key = cmsKeyForPath(path, parseLocalizedPathname(pathname).locale || defaultLocale, pages, defaultLocale)
  if (key) {
    return withLocale(pathForCmsKey(key, nextLocale, pages, defaultLocale), nextLocale)
  }

  return withLocale(path, nextLocale)
}
