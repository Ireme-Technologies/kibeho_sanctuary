import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ChevronDown, ExternalLink, LogOut, UserRound } from 'lucide-react'
import { useAuth } from '@context/AuthContext'
import { useContent } from '@context/ContentContext'
import styles from './admin.module.css'

function getInitials(name = '', email = '') {
  const source = (name || email || 'A').trim()
  const parts = source.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return source.slice(0, 2).toUpperCase()
}

function roleLabel(user) {
  if (!user) return 'Admin'
  if (user.is_master_admin) return 'Master Admin'
  if (user.role === 'editor') return 'Editor'
  if (user.role === 'super_admin') return 'Admin'
  return 'Admin'
}

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const { company } = useContent()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)
  const logoSrc = company?.logo || '/images/logo/logo-transparent.png'

  const links = [
    { to: '/admin', label: 'Dashboard', end: true },
    { to: '/admin/mass-schedules', label: 'Mass schedules' },
    { to: '/admin/upcoming-pilgrimages', label: 'Pilgrim calendar' },
    { to: '/admin/churches', label: 'Churches' },
    { to: '/admin/apparition-sites', label: 'Apparition sites' },
    { to: '/admin/projects', label: 'Accommodations' },
    { to: '/admin/shrine-projects', label: 'Support projects' },
    { to: '/admin/testimonials', label: 'Testimonials' },
    { to: '/admin/blog', label: 'News & clergy messages' },
    { to: '/admin/services', label: 'Pilgrimage Services' },
    { to: '/admin/activities', label: 'Shrine Experiences' },
    { to: '/admin/videos', label: 'Videos (YouTube)' },
    { to: '/admin/home-hero', label: 'Home hero' },
    { to: '/admin/sections', label: 'Pages' },
    { to: '/admin/translations', label: 'Translations' },
    { to: '/admin/gallery', label: 'Media library' },
    { to: '/admin/enquiries', label: 'Pilgrim Enquiries' },
    ...(user?.can_manage_users ? [{ to: '/admin/users', label: 'Users' }] : []),
    { to: '/admin/settings', label: 'Settings & menus' },
  ]

  useEffect(() => {
    if (!menuOpen) return undefined
    const onPointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) setMenuOpen(false)
    }
    const onKey = (event) => {
      if (event.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen])

  const handleLogout = async () => {
    setMenuOpen(false)
    await logout()
    navigate('/admin/login')
  }

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <NavLink to="/admin" className={styles.brand}>
          <img
            src={logoSrc}
            alt={company?.name || 'Shrine of Our Lady of Kibeho'}
            className={styles.brandLogo}
          />
          <span className={styles.brandText}>
            <span className={styles.brandName}>{company?.name || 'Shrine of Our Lady of Kibeho'}</span>
            <span className={styles.brandRole}>{roleLabel(user)}</span>
          </span>
        </NavLink>

        <nav className={styles.nav} aria-label="Admin">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => (isActive ? 'active' : undefined)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className={styles.content}>
        <header className={styles.appHeader}>
          <div className={styles.appHeaderLeft}>
            <p className={styles.appHeaderEyebrow}>Admin dashboard</p>
            <p className={styles.appHeaderHint}>Manage site content and settings</p>
          </div>

          <div className={styles.appHeaderRight}>
            <Link to="/" className={styles.viewSiteLink} target="_blank" rel="noreferrer">
              View site
              <ExternalLink size={14} aria-hidden="true" />
            </Link>

            <div className={styles.profileWrap} ref={menuRef}>
              <button
                type="button"
                className={styles.profileCard}
                onClick={() => setMenuOpen((open) => !open)}
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <span className={styles.avatar} aria-hidden="true">
                  {getInitials(user?.name, user?.email)}
                </span>
                <span className={styles.profileMeta}>
                  <span className={styles.profileName}>{user?.name || 'Admin'}</span>
                  <span className={styles.profileEmail}>{user?.email}</span>
                </span>
                <ChevronDown
                  size={16}
                  className={`${styles.profileChevron} ${menuOpen ? styles.profileChevronOpen : ''}`}
                  aria-hidden="true"
                />
              </button>

              {menuOpen && (
                <div className={styles.profileMenu} role="menu">
                  <div className={styles.profileMenuHeader}>
                    <p className={styles.profileMenuName}>{user?.name || 'Admin'}</p>
                    <p className={styles.profileMenuRole}>{roleLabel(user)}</p>
                  </div>
                  <NavLink
                    to="/admin/account"
                    role="menuitem"
                    className={styles.profileMenuItem}
                    onClick={() => setMenuOpen(false)}
                  >
                    <UserRound size={16} aria-hidden="true" />
                    My account
                  </NavLink>
                  <button
                    type="button"
                    role="menuitem"
                    className={`${styles.profileMenuItem} ${styles.profileMenuDanger}`}
                    onClick={handleLogout}
                  >
                    <LogOut size={16} aria-hidden="true" />
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className={styles.main}>
          <Outlet />
        </main>

        <footer className={styles.appFooter}>
          <p>
            Developed by{' '}
            <a href="https://iremetech.com" target="_blank" rel="noreferrer">
              Ireme Tech
            </a>
          </p>
        </footer>
      </div>
    </div>
  )
}
