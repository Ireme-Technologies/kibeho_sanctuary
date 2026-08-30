import { useEffect } from 'react'
import { Navigate, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useLocale } from '@context/LocaleContext'
import { useContent } from '@context/ContentContext'
import {
  isLocaleCode,
  parseLocalizedPathname,
  remapPathForLocale,
  withLocale,
} from '@i18n/localizedPath'

/**
 * Reads /:locale from the URL, syncs LocaleContext, and renders public pages.
 */
export default function LocaleRoute({ hasHero = false, Layout }) {
  const { locale: paramLocale } = useParams()
  const { locale, setLocale, publicLocales, defaultLocale, ready } = useLocale()
  const location = useLocation()

  const allowed = (publicLocales || []).map((item) => item.code)
  const code = String(paramLocale || '').toLowerCase()

  useEffect(() => {
    if (!ready) return
    if (isLocaleCode(code) && allowed.includes(code) && code !== locale) {
      setLocale(code, { navigate: false })
    }
  }, [ready, code, allowed, locale, setLocale])

  if (!ready) return null

  if (!isLocaleCode(code) || (allowed.length && !allowed.includes(code))) {
    const fallback = allowed.includes(defaultLocale) ? defaultLocale : allowed[0] || defaultLocale
    const { path } = parseLocalizedPathname(location.pathname)
    return <Navigate to={withLocale(path === '/' && !paramLocale ? location.pathname : path, fallback)} replace />
  }

  return <Layout hasHero={hasHero} />
}

/**
 * Redirect /pilgrimage/... → /{locale}/pilgrimage/...
 * so old bookmarks and shared links keep working.
 */
export function RedirectToLocalized() {
  const location = useLocation()
  const { locale, defaultLocale, ready, publicLocales } = useLocale()
  if (!ready) return null
  const allowed = (publicLocales || []).map((item) => item.code)
  const code = allowed.includes(locale) ? locale : defaultLocale
  const target = `${withLocale(location.pathname, code)}${location.search}${location.hash}`
  return <Navigate to={target} replace />
}

/**
 * Language switch helper used by the navbar.
 */
export function useSwitchLocale() {
  const navigate = useNavigate()
  const location = useLocation()
  const { setLocale, defaultLocale } = useLocale()
  const { pages } = useContent()

  return (nextLocale) => {
    setLocale(nextLocale, { navigate: false })
    const nextPath = remapPathForLocale(location.pathname, nextLocale, pages, defaultLocale)
    navigate(`${nextPath}${location.search}${location.hash}`)
  }
}

export function LocaleOutlet() {
  return <Outlet />
}
