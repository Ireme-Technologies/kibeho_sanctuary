import { useEffect, useState } from 'react'
import { ChevronDown, X } from 'lucide-react'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { displayCapsLabel } from '@i18n/typography'
import { LocalizedNavLink } from '@components/LocalizedLink'
import styles from './MobileDrawer.module.css'

function DrawerItem({ item, onClose }) {
  const [open, setOpen] = useState(false)
  const hasChildren = item.children?.length > 0

  if (!hasChildren) {
    return (
      <LocalizedNavLink
        to={item.path}
        end={item.path === '/'}
        onClick={onClose}
        className={({ isActive }) => `${styles.navLink} ${isActive ? styles.activeLink : ''}`}
      >
        {item.label}
      </LocalizedNavLink>
    )
  }

  return (
    <div className={styles.group}>
      <div className={styles.groupRow}>
        <LocalizedNavLink
          to={item.path}
          end
          onClick={onClose}
          className={({ isActive }) =>
            `${styles.groupLink} ${isActive ? styles.activeLink : ''}`
          }
        >
          {item.label}
        </LocalizedNavLink>
        <button
          type="button"
          className={styles.groupToggle}
          aria-label={`${item.label} submenu`}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <ChevronDown size={18} className={open ? styles.chevOpen : undefined} />
        </button>
      </div>
      {open && (
        <div className={styles.subnav}>
          {item.children.map((child) => (
            <LocalizedNavLink
              key={child.path + child.label}
              to={child.path}
              onClick={onClose}
              className={styles.subLink}
            >
              {child.label}
            </LocalizedNavLink>
          ))}
        </div>
      )}
    </div>
  )
}

export default function MobileDrawer({ isOpen, onClose }) {
  const { primaryNav, navCTA } = useContent()
  const { locale } = useLocale()

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.overlayOpen : ''}`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <aside
        className={`${styles.drawer} ${isOpen ? styles.drawerOpen : ''}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close menu">
          <X size={26} />
        </button>

        <nav className={styles.nav} aria-label="Mobile primary">
          {(primaryNav || []).map((item) => (
            <DrawerItem key={item.path + item.label} item={item} onClose={onClose} />
          ))}
          <LocalizedNavLink to={navCTA.path} onClick={onClose} className={styles.ctaBtn}>
            {displayCapsLabel(navCTA.label, locale)}
          </LocalizedNavLink>
        </nav>
      </aside>
    </div>
  )
}
