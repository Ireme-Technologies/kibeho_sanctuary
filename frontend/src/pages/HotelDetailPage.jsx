import { useLocale } from '@context/LocaleContext'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProject } from '@api/cms'
import RichText from '@components/ui/RichText'
import NotFoundPage from './NotFoundPage'
import styles from './CatalogPage.module.css'

function renderStars(rating) {
  const n = Math.round(Number(rating) || 0)
  if (!n) return null
  return '★'.repeat(Math.min(n, 5))
}

function isExternal(url) {
  return /^https?:\/\//i.test(url || '')
}

export default function HotelDetailPage() {
  const { locale } = useLocale()
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetchProject(slug, { locale })
      .then(setItem)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className={`container ${styles.body}`}>
        <p className={styles.empty}>Loading…</p>
      </div>
    )
  }

  if (notFound || !item) return <NotFoundPage />

  const cover = item.coverImage || item.featuredImage

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={
          cover
            ? {
                backgroundImage: `linear-gradient(120deg, rgba(18, 40, 71, 0.9), rgba(26, 54, 93, 0.55)), url(${cover})`,
              }
            : undefined
        }
      >
        <div className="container">
          {item.category ? <p className={styles.subtitle}>{item.category}</p> : null}
          <h1>{item.title}</h1>
          {item.rating ? (
            <p className={styles.stars} aria-label={`${item.rating} out of 5 stars`}>
              {renderStars(item.rating)}
            </p>
          ) : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        <div className={styles.detailLayout}>
          {cover ? <img src={cover} alt="" className={styles.detailCover} /> : null}

          {item.description ? (
            <RichText html={item.description} className={styles.intro} />
          ) : null}

          {item.gallery?.length ? (
            <div className={styles.gallery}>
              {item.gallery.map((src) => (
                <img key={src} src={src} alt="" />
              ))}
            </div>
          ) : null}

          <div className={styles.actions}>
            <Link to="/hotels" className={styles.btnGhost}>
              All accommodation
            </Link>
            {item.bookingUrl ? (
              isExternal(item.bookingUrl) ? (
                <a
                  href={item.bookingUrl}
                  className={styles.btn}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Book now
                </a>
              ) : (
                <Link to={item.bookingUrl} className={styles.btn}>
                  Book now
                </Link>
              )
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
