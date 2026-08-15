import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import Navbar from './Navbar'
import Footer from './Footer'
import styles from './Layout.module.css'

/**
 * hasHero: passed down from the router (see src/router/index.jsx).
 * true only for the routes rendered inside the "/" Layout branch (Home),
 * so the navbar knows whether it should start transparent.
 */
export default function Layout({ hasHero = false }) {
  const { pathname } = useLocation()
  const { company } = useContent()
  const { t } = useLocale()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  useEffect(() => {
    document.title = company?.name || t('brand.name')
  }, [company?.name, t, pathname])

  return (
    <div className={styles.page}>
      <Navbar hasHero={hasHero} />
      <main className={`${styles.main} ${!hasHero ? styles.withOffset : ''}`}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
