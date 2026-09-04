import { useMemo, useState } from 'react'
import { ChevronRight, ExternalLink, ZoomIn } from 'lucide-react'
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
  const { primaryNav, section, pages, resolveFooterImage, defaultFooterImageAlt, contactMap } = useContent()
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

  // Prefer an explicit page or menu footer image; otherwise the site default.
  const exploreImageSource =
    pageContent.footerImage ||
    pageContent.map?.image ||
    pageContent.mapImage ||
    pillarMeta.footerImage ||
    ''

  const footerImage = resolveFooterImage(exploreImageSource)

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
    pillarMeta.footerImageAlt ||
    defaultFooterImageAlt ||
    pageTitle ||
    pillarMeta.heading ||
    nav.pillarLabel

  const eyebrow = pillarMeta.eyebrow || nav.pillarLabel
  const heading =
    pageTitle ||
    (isHub ? pillarMeta.heading || pillarMeta.title : '') ||
    `Explore ${nav.pillarLabel}`
  const intro = pageSubtitle || (isHub ? pillarMeta.intro || '' : '')
  const mapEmbedSrc =
    pageKey === 'pilgrimage.how-to-get-here'
      ? pageContent.mapEmbedSrc || pageContent.map?.embedSrc || contactMap?.embedSrc || ''
      : ''
  const mapDirectionsLink =
    pageContent.mapDirectionsLink || pageContent.map?.directionsLink || contactMap?.directionsLink || ''
  const showMap = Boolean(mapEmbedSrc)

  return (
    <section className={styles.section} id="pillar-explore" aria-labelledby="pillar-explore-heading">
      <div className="container">
        <div className={styles.panel}>
          <div className={styles.layout}>
            <div className={styles.imageCol}>
              {showMap ? (
                <div className={styles.mapWrap}>
                  <iframe
                    className={styles.map}
                    title={contactMap?.label || 'Map of the Shrine of Our Lady of Kibeho'}
                    src={mapEmbedSrc}
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  {mapDirectionsLink ? (
                    <a
                      href={mapDirectionsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.mapDirections}
                    >
                      {contactMap?.directionsLabel || 'Get directions'}
                      <ExternalLink size={14} aria-hidden="true" />
                    </a>
                  ) : null}
                </div>
              ) : (
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
              )}
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

      {showMap ? null : (
      <ImageLightbox
        open={lightboxOpen}
        images={[{ src: footerImage, alt: footerAlt }]}
        index={0}
        onClose={() => setLightboxOpen(false)}
      />
      )}
    </section>
  )
}
