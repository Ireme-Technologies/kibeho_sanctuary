import { Link, NavLink } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { localizeHref } from '@i18n/localizedPath'

/** Drop-in Link that prefixes the active locale and rewrites CMS paths. */
export default function LocalizedLink({ to, children, ...props }) {
  const { locale, defaultLocale } = useLocale()
  const { pages } = useContent()
  const href = typeof to === 'string' ? localizeHref(to, locale, pages, defaultLocale) : to
  return (
    <Link to={href} {...props}>
      {children}
    </Link>
  )
}

export function LocalizedNavLink({ to, children, ...props }) {
  const { locale, defaultLocale } = useLocale()
  const { pages } = useContent()
  const href = typeof to === 'string' ? localizeHref(to, locale, pages, defaultLocale) : to
  return (
    <NavLink to={href} {...props}>
      {children}
    </NavLink>
  )
}
