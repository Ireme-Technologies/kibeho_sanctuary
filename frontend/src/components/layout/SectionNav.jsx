import { NavLink, useLocation } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { getSectionNav, sectionLinkIsActive } from '@utils/sectionNav'
import { displayCapsLabel } from '@i18n/typography'
import styles from './SectionNav.module.css'

export default function SectionNav() {
  const { pathname } = useLocation()
  const { primaryNav } = useContent()
  const { locale } = useLocale()
  const nav = getSectionNav(pathname, primaryNav)

  if (!nav) return null

  return (
    <nav className={styles.bar} aria-label={nav.label || 'In this section'}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.kicker}>{displayCapsLabel(nav.label, locale)}</p>
        <ul className={styles.list}>
          {nav.links.map((link) => (
            <li key={link.path}>
              <NavLink
                to={link.path}
                className={() =>
                  `${styles.link} ${sectionLinkIsActive(pathname, link.path, nav.hubPath) ? styles.active : ''}`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
