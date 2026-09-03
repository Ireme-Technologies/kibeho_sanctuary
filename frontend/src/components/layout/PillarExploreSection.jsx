import { useMemo, useState } from 'react'
import { ChevronRight, ZoomIn } from 'lucide-react'
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

  const links = nav.links

  // Prefer an explicit explore/footer image; otherwise use this page's header/hero.
  const pageHeaderImage =
    pageContent.heroImage || pageContent.backgroundImage || pageContent.image || ''
  const exploreImageSource =
    pageContent.footerImage ||
    pageContent.map?.image ||
    pageContent.mapImage ||
    pageHeaderImage ||
    pillarMeta.footerImage

  const footerImage = resolveHeaderImage(
    exploreImageSource,
    pillarMeta.footerImage || '/images/sanctuary/hero.jpg',
  )

  const activeLink =
    links.find((link) => pillarExploreLinkIsActive(pathOnly, link.path)) || null
  const isHub = pathOnly === nav.hubPath

  // Prefer this page's menu label / CMS title so each submenu page is distinct.
  // Shared explore.* copy is only the hub fallback (e.g. /pilgrimage).
  const pageTitle =
    activeLink?.label ||
    pageContent.title ||
    pageContent.heading ||
    ''
  const pageSubtitle = String(pageContent.subtitle || '').trim()

  const footerAlt =
    pageContent.footerImageAlt ||
    pageContent.map?.alt ||
    pageContent.mapAlt ||
    (pageHeaderImage
      ? pageTitle || pillarMeta.heading || nav.pillarLabel
      : null) ||
    pillarMeta.footerImageAlt ||
    pageTitle ||
    pillarMeta.heading ||
    nav.pillarLabel

  const eyebrow = pillarMeta.eyebrow || nav.pillarLabel
  const heading =
    pageTitle ||
    (isHub ? pillarMeta.heading || pillarMeta.title : '') ||
    `Explore ${nav.pillarLabel}`
  const intro = pageSubtitle || (isHub ? pillarMeta.intro || '' : '')

  return (
    <section className={styles.section} id="pillar-explore" aria-labelledby="pillar-explore-heading">
      <div className="container">
        <div className={styles.panel}>
          <div className={styles.layout}>
            <div className={styles.imageCol}>
              <button
                type="button"
                className={styles.imageBtn}
                onClick={() => setLightboxOpen(true)}
                aria-label={footerAlt ? `View full size: ${footerAlt}` : 'View full size image'}
              >
                <img src={footerImage} alt={footerAlt} className={styles.image} loading="lazy" />
                <span className={styles.imageOverlay} aria-hidden="true">
                  <span className={styles.zoomBadge}>
                    <ZoomIn size={18} />
                    View image
                  </span>
                </span>
              </button>
            </div>

            <div className={styles.navCol}>
              {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
              <h2 id="pillar-explore-heading" className={styles.heading}>
                {heading}
              </h2>
              {intro ? <p className={styles.intro}>{intro}</p> : null}
              <span className={styles.rule} aria-hidden="true" />

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
                      <span className={styles.linkLabel}>{link.label}</span>
                      <ChevronRight size={17} aria-hidden="true" className={styles.linkIcon} />
                    </LocalizedLink>
                  )
                })}
              </nav>
            </div>
          </div>
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
