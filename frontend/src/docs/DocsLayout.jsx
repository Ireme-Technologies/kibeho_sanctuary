import { NavLink, Outlet, Link, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import styles from './DocsLayout.module.css'

const NAV = [
  { to: '/docs', label: 'Documentation hub', end: true },
  { to: '/docs/sitemap-and-admin-guide', label: 'Administrator guide' },
  { to: '/docs/proposed-solution', label: 'Proposed solution' },
]

export default function DocsLayout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  useEffect(() => {
    document.documentElement.setAttribute('data-docs-print', 'true')
    document.body.setAttribute('data-docs-print', 'true')
    return () => {
      document.documentElement.removeAttribute('data-docs-print')
      document.body.removeAttribute('data-docs-print')
    }
  }, [])

  return (
    <div className={styles.shell} data-docs-shell="true">
      <header className={`${styles.header} ${styles.noPrint}`}>
        <div className={styles.headerInner}>
          <Link to="/docs" className={styles.brand}>
            <span className={styles.brandEyebrow}>Ireme Tech · Client evaluation</span>
            <span className={styles.brandTitle}>Shrine of Our Lady of Kibeho</span>
            <span className={styles.brandSub}>System documentation & live demo</span>
          </Link>
          <div className={styles.headerActions}>
            <a className={styles.btnGhost} href="/" target="_blank" rel="noreferrer">
              Open public demo
            </a>
            <a className={styles.btnPrimary} href="/admin/login" target="_blank" rel="noreferrer">
              Open admin panel
            </a>
          </div>
        </div>
        <nav className={styles.nav} aria-label="Documentation">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => (isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink)}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className={styles.main} data-docs-main="true">
        <Outlet />
      </main>
      <footer className={`${styles.footer} ${styles.noPrint}`}>
        <p>
          Prepared for the Diocese of Gikongoro evaluation. Documents may be viewed online, downloaded, or
          printed to PDF. Demo text and images will be updated as official content is provided. For
          questions: <a href="mailto:info@iremetech.com">info@iremetech.com</a>
        </p>
        <div className={styles.footerLinks}>
          <Link to="/docs">Hub</Link>
          <Link to="/docs/sitemap-and-admin-guide">Administrator guide</Link>
          <Link to="/docs/proposed-solution">Proposed solution</Link>
          <a href="/" target="_blank" rel="noreferrer">
            Live demo
          </a>
          <a href="/admin/login" target="_blank" rel="noreferrer">
            Admin
          </a>
        </div>
      </footer>
    </div>
  )
}
