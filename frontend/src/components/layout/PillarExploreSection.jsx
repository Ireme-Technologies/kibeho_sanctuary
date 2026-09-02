import { useMemo, useState } from 'react'
import { ChevronRight } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { cmsKeyForPath, stripLocale } from '@i18n/localizedPath'
import { sectionKeyForPath } from '@data/pages/registry'
import { mergePageContent } from '@data/pages/mergePageContent'
import { getPageFallback } from '@data/pages/content'
import {
  getPillarExploreNav,
  pillarExploreLinkIsActive,
  PILLAR_EXPLORE_FALLBACKS,
} from '@data/pillarExplore'
import ImageLightbox from '@components/ui/ImageLightbox'
import LocalizedLink from '@components/LocalizedLink'
import styles from './PillarExploreSection.module.css'

const SKIP_PATHS = new Set(['/', '/contact'])

export default function PillarExploreSection() {
  const { pathname } = useLocation()
  const pathOnly = stripLocale(pathname)
  const { primaryNav, section, pages, resolveHeaderImage } = useContent()
  const { locale, defaultLocale } = useLocale()
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const nav = useMemo(() => getPillarExploreNav(pathOnly, primaryNav), [pathOnly, primaryNav])

  const pageKey =
    cmsKeyForPath(pathOnly, locale, pages, defaultLocale) || sectionKeyForPath(pathOnly) || null

  const pageContent = useMemo(() => {
    if (!pageKey) return {}
    return mergePageContent(getPageFallback(pageKey) || {}, section(pageKey, {}))
  }, [pageKey, section])

  const pillarMeta = useMemo(() => {
    if (!nav?.exploreKey) return {}
    const fallback = PILLAR_EXPLORE_FALLBACKS[nav.exploreKey] || {}
    return mergePageContent(fallback, section(nav.exploreKey, {}))
  }, [nav?.exploreKey, section])

  if (!nav || SKIP_PATHS.has(pathOnly)) return null

  const customLinks = Array.isArray(pageContent.exploreLinks) ? pageContent.exploreLinks : []
  const links =
    customLinks.filter((item) => item?.label && item?.path).length > 0
      ? customLinks.filter((item) => item?.label && item?.path)
      : nav.links

  const footerImage = resolveHeaderImage(
    pageContent.footerImage ||
      pageContent.map?.image ||
      pageContent.mapImage ||
      pillarMeta.footerImage,
    pillarMeta.footerImage || '/images/sanctuary/hero.jpg',
  )

  const footerAlt =
    pageContent.footerImageAlt ||
    pageContent.map?.alt ||
    pageContent.mapAlt ||
    pillarMeta.footerImageAlt ||
    pillarMeta.heading ||
    nav.pillarLabel

  const eyebrow = pillarMeta.eyebrow || nav.pillarLabel
  const heading = pillarMeta.heading || pillarMeta.title || `Explore ${nav.pillarLabel}`
  const intro = pillarMeta.intro || ''

  return (
    <section className={styles.section} id="pillar-explore" aria-labelledby="pillar-explore-heading">
      <div className="container">
        <div className={styles.head}>
          {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
          <h2 id="pillar-explore-heading">{heading}</h2>
          {intro ? <p className={styles.intro}>{intro}</p> : null}
        </div>

        <div className={styles.layout}>
          <button
            type="button"
            className={styles.imageBtn}
            onClick={() => setLightboxOpen(true)}
            aria-label={footerAlt ? `View ${footerAlt}` : 'View section image'}
          >
            <img src={footerImage} alt={footerAlt} className={styles.image} loading="lazy" />
            <span className={styles.imageHint}>Click to enlarge</span>
          </button>

          <nav className={styles.nav} aria-label={`${nav.pillarLabel} pages`}>
            {links.map((link) => {
              const active = pillarExploreLinkIsActive(pathOnly, link.path)
              return (
                <LocalizedLink
                  key={link.path}
                  to={link.path}
                  className={`${styles.link} ${active ? styles.linkActive : ''}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {link.label}
                  <ChevronRight size={18} aria-hidden="true" />
                </LocalizedLink>
              )
            })}
          </nav>
        </div>
      </div>

      <ImageLightbox
        open={lightboxOpen}
        images={[{ src: footerImage, alt: footerAlt }]}
        index={0}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  )
}
