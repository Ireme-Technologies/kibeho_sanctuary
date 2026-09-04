import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchVisionaries, fetchVisionary } from '@api/cms'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import RichText from '@components/ui/RichText'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { visionaryFromFallbacks, VISIONARY_FALLBACKS } from '@data/directories'
import { applyPageSeo } from '@utils/seo'
import NotFoundPage from './NotFoundPage'
import styles from './VisionaryDetailPage.module.css'

export default function VisionaryDetailPage() {
  const { locale, t } = useLocale()
  const { resolveHeaderImage } = useContent()
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [siblings, setSiblings] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setNotFound(false)

    Promise.allSettled([fetchVisionary(slug, { locale }), fetchVisionaries({ locale })]).then(
      ([detailResult, listResult]) => {
        if (cancelled) return

        const fallbackList = VISIONARY_FALLBACKS.map((row) =>
          visionaryFromFallbacks(row.slug, locale),
        ).filter(Boolean)
        const apiList =
          listResult.status === 'fulfilled' && Array.isArray(listResult.value) ? listResult.value : []
        const siblings = apiList.length ? apiList : fallbackList

        const detail =
          (detailResult.status === 'fulfilled' && detailResult.value) ||
          visionaryFromFallbacks(slug, locale) ||
          siblings.find((row) => row.slug === slug) ||
          null

        if (!detail) {
          setNotFound(true)
          setItem(null)
          setSiblings([])
        } else {
          setItem(detail)
          setSiblings(siblings)
        }
        setLoading(false)
      },
    )

    return () => {
      cancelled = true
    }
  }, [slug, locale])

  const nav = useMemo(() => {
    if (!item || !siblings.length) return { prev: null, next: null }
    const index = siblings.findIndex((row) => row.slug === item.slug)
    if (index < 0) return { prev: null, next: null }
    return {
      prev: index > 0 ? siblings[index - 1] : null,
      next: index < siblings.length - 1 ? siblings[index + 1] : null,
    }
  }, [item, siblings])

  useEffect(() => {
    if (!item) return
    applyPageSeo({
      title: item.name,
      description: item.summary || item.description,
      image: item.photo || item.coverImage,
      path: item.path || `/shrine/visionaries/${item.slug}`,
    })
  }, [item])

  if (loading) {
    return (
      <div className={`container ${styles.body}`}>
        <p className={styles.empty}>{t('loading')}</p>
      </div>
    )
  }

  if (notFound || !item) return <NotFoundPage />

  const heroImage = resolveHeaderImage(item.photo || item.coverImage)
  const portrait = item.photo || item.coverImage

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18, 40, 71, 0.92), rgba(26, 54, 93, 0.6)), url(${heroImage})`,
        }}
      >
        <div className="container">
          {item.periodLabel ? <p className={styles.subtitle}>{item.periodLabel}</p> : null}
          <h1>{item.name}</h1>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        <ContentLocaleNotice translations={item.translations} />

        <div className={styles.split}>
          <div className={styles.imageCol}>
            {portrait ? (
              <img src={portrait} alt={item.name} className={styles.portrait} />
            ) : (
              <img src={heroImage} alt="" className={styles.portrait} />
            )}
          </div>

          <div className={styles.contentCol}>
            <p className={styles.eyebrow}>Historical insights</p>
            {item.isApproved === false ? (
              <p className={styles.approvalNote}>Not approved by the Church</p>
            ) : null}
            {item.description ? (
              <RichText html={item.description} className={styles.insights} />
            ) : item.summary ? (
              <p className={styles.insights}>{item.summary}</p>
            ) : (
              <p className={styles.empty}>Historical details will be added soon.</p>
            )}
          </div>
        </div>

        <nav className={styles.nav} aria-label="Other visionaries">
          {nav.prev ? (
            <Link to={nav.prev.path || `/shrine/visionaries/${nav.prev.slug}`} className={styles.navLink}>
              <span className={styles.navKicker}>Previous</span>
              <span>{nav.prev.name}</span>
            </Link>
          ) : (
            <span />
          )}
          {nav.next ? (
            <Link
              to={nav.next.path || `/shrine/visionaries/${nav.next.slug}`}
              className={styles.navLink}
              style={{ textAlign: 'right', alignItems: 'flex-end' }}
            >
              <span className={styles.navKicker}>Next</span>
              <span>{nav.next.name}</span>
            </Link>
          ) : null}
        </nav>

        <Link to="/shrine/visionaries" className={styles.backLink}>
          ← All visionaries
        </Link>
      </div>
    </div>
  )
}
