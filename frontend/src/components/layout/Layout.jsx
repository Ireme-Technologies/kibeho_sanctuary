import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { getPageFallback } from '@data/pages/content'
import { mergePageContent } from '@data/pages/mergePageContent'
import { sectionKeyForPath } from '@data/pages/registry'
import { applyPageSeo, DEFAULT_SEO, stripHtml } from '@utils/seo'
import Navbar from './Navbar'
import Footer from './Footer'
import styles from './Layout.module.css'

const PUBLIC_SEO = {
  '/news': {
    title: 'News',
    description: 'News, events, Rector and Bishop messages, and press from the Shrine of Our Lady of Kibeho.',
  },
  '/gallery': {
    title: 'Photos',
    description: 'Photo gallery of the Shrine of Our Lady of Kibeho.',
  },
  '/contact': {
    title: 'Contact',
    description: 'Contact the Pilgrimage Office of the Shrine of Our Lady of Kibeho.',
  },
  '/support/projects': {
    title: 'Current projects',
    description: 'Development projects of the Shrine of Our Lady of Kibeho — need, solution, and how to take part.',
  },
}

/**
 * hasHero: passed down from the router (see src/router/index.jsx).
 * true only for the routes rendered inside the "/" Layout branch (Home),
 * so the navbar knows whether it should start transparent.
 */
export default function Layout({ hasHero = false }) {
  const { pathname } = useLocation()
  const { company, section } = useContent()
  const { t } = useLocale()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [pathname])

  useEffect(() => {
    if (pathname === '/') {
      applyPageSeo({
        title: DEFAULT_SEO.title,
        description: DEFAULT_SEO.description,
        path: '/',
      })
      return
    }
    const key = sectionKeyForPath(pathname)
    if (!key) {
      const extra = PUBLIC_SEO[pathname]
      applyPageSeo({
        title: extra?.title || company?.name || t('brand.name'),
        description: extra?.description || DEFAULT_SEO.description,
        path: pathname,
      })
      return
    }
    const data = mergePageContent(getPageFallback(key) || {}, section(key, {}))
    applyPageSeo({
      title: data.title || company?.name || t('brand.name'),
      description: data.seoDescription || stripHtml(data.intro) || data.subtitle,
      image: data.heroImage,
      path: pathname,
    })
  }, [pathname, company?.name, section, t])

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
