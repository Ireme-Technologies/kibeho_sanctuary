import { useEffect, useRef, useState } from 'react'
import { ChevronDown, ChevronRight, Menu } from 'lucide-react'
import { useScrolled } from '@hooks/useScrolled'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { displayCapsLabel } from '@i18n/typography'
import LocalizedLink, { LocalizedNavLink } from '@components/LocalizedLink'
import { useSwitchLocale } from '@router/LocaleRoute'
import { formatEventWhen } from '@utils/eventTime'
import { pickHeaderOccasion, statusLabel } from '@utils/occasion'
import MobileDrawer from './MobileDrawer'
import styles from './Navbar.module.css'

function NavItem({ item }) {
  const { locale } = useLocale()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const closeTimer = useRef(null)
  const hasChildren = item.children?.length > 0

  const clearCloseTimer = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }

  const openMenu = () => {
    clearCloseTimer()
    setOpen(true)
  }

  const scheduleClose = () => {
    clearCloseTimer()
    closeTimer.current = setTimeout(() => setOpen(false), 120)
  }

  useEffect(() => () => clearCloseTimer(), [])

  useEffect(() => {
    if (!open) return undefined
    const onDown = (e) => {
      if (!ref.current?.contains(e.target)) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  if (!hasChildren) {
    return (
      <LocalizedNavLink
        to={item.path}
        end={item.path === '/'}
        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
      >
        {displayCapsLabel(item.label, locale)}
      </LocalizedNavLink>
    )
  }

  return (
    <div
      className={`${styles.navItem} ${open ? styles.navItemOpen : ''}`}
      ref={ref}
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
    >
      <div className={`${styles.navLink} ${styles.navParent}`}>
        {/* Label → section root (e.g. /our-lady); chevron only toggles submenu */}
        <LocalizedNavLink
          to={item.path}
          end
          className={({ isActive }) =>
            `${styles.navParentLink} ${isActive ? styles.activeLink : ''}`
          }
          onClick={() => setOpen(false)}
        >
          {displayCapsLabel(item.label, locale)}
        </LocalizedNavLink>
        <button
          type="button"
          className={styles.caretBtn}
          aria-label={`${item.label} submenu`}
          aria-expanded={open}
          aria-haspopup="true"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            setOpen((v) => !v)
          }}
        >
          <ChevronDown size={14} />
        </button>
      </div>
      {open && (
        <ul className={styles.dropdown} role="menu">
          {item.children.map((child) => (
            <li key={child.path + child.label} role="none">
              <LocalizedNavLink
                to={child.path}
                className={styles.dropdownLink}
                role="menuitem"
                onClick={() => setOpen(false)}
              >
                {child.label}
              </LocalizedNavLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default function Navbar({ hasHero = false }) {
  const { primaryNav, utilityNav, navCTA, company, upcomingPilgrimages } = useContent()
  const { locale, locales, current, t } = useLocale()
  const switchLocale = useSwitchLocale()
  const scrolled = useScrolled(60)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)

  const headerOccasion = pickHeaderOccasion(upcomingPilgrimages)
  const occasionBadge = headerOccasion ? statusLabel(headerOccasion.status) : null
  const occasionTitle = headerOccasion?.item?.title || ''
  const occasionWhen = headerOccasion ? formatEventWhen(headerOccasion.item) : ''
  const occasionPath =
    headerOccasion?.item?.path ||
    (headerOccasion?.item?.slug ? `/pilgrimages/${headerOccasion.item.slug}` : null)

  const isTransparent = hasHero && !scrolled

  useEffect(() => {
    if (!langOpen) return undefined
    const onDown = (e) => {
      if (!langRef.current?.contains(e.target)) setLangOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [langOpen])

  const brandName = company.name || 'Shrine of Our Lady of Kibeho'

  return (
    <>
      <div className={styles.topBar}>
        <div className={`container ${styles.topInner}`}>
          {headerOccasion && occasionPath ? (
            <LocalizedLink
              to={occasionPath}
              className={styles.occasionLink}
              aria-label={`${occasionBadge ? `${occasionBadge}: ` : ''}${occasionTitle}${occasionWhen ? `, ${occasionWhen}` : ''}`}
            >
              {occasionBadge ? (
                <span
                  className={`${styles.occasionBadge} ${headerOccasion.status === 'live' ? styles.occasionBadgeLive : ''}`}
                >
                  {occasionBadge}
                </span>
              ) : null}
              <span className={styles.occasionText}>
                <span className={styles.occasionTitle}>{occasionTitle}</span>
                {occasionWhen ? <span className={styles.occasionWhen}>{occasionWhen}</span> : null}
              </span>
              <ChevronRight size={15} className={styles.occasionArrow} aria-hidden="true" />
            </LocalizedLink>
          ) : (
            <p className={styles.welcome}>{t('welcomeBar')}</p>
          )}
          <div className={styles.topLinks}>
            {(utilityNav || []).map((item) => (
              <LocalizedLink key={item.path + item.label} to={item.path} className={styles.topLink}>
                {item.label}
              </LocalizedLink>
            ))}
            <LocalizedLink to={navCTA.path} className={styles.donateBtn}>
              {displayCapsLabel(navCTA.label || t('donate'), locale)}
            </LocalizedLink>
          </div>
        </div>
      </div>

      <header
        className={`${styles.navbar} ${isTransparent ? styles.transparent : styles.solid}`}
      >
        <div className={`container ${styles.inner}`}>
          <LocalizedNavLink to="/" className={styles.logo} aria-label={brandName}>
            <img
              src={company.logo || '/images/logo/logo-transparent.png'}
              alt=""
              className={styles.logoImg}
            />
            <span className={styles.brandText}>
              <span className={styles.brandName}>{brandName}</span>
              <span className={styles.brandTag}>{t('brand.diocese')}</span>
            </span>
          </LocalizedNavLink>

          <nav className={styles.desktopNav} aria-label="Primary">
            {(primaryNav || []).map((item) => (
              <NavItem key={item.path + item.label} item={item} />
            ))}
          </nav>

          <div className={styles.rightTools}>
            <div className={styles.langWrap} ref={langRef}>
              <button
                type="button"
                className={styles.langBtn}
                onClick={() => setLangOpen((o) => !o)}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                aria-label={t('language')}
              >
                <span>{current.flag}</span>
                <span>{locale.toUpperCase()}</span>
                <ChevronDown size={14} />
              </button>
              {langOpen && (
                <ul className={styles.langMenu} role="listbox">
                  {locales.map((item) => (
                    <li key={item.code}>
                      <button
                        type="button"
                        className={styles.langOption}
                        onClick={() => {
                          switchLocale(item.code)
                          setLangOpen(false)
                        }}
                      >
                        <span>{item.flag}</span>
                        <span>{item.label}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button
              className={styles.menuToggle}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      <MobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  )
}
