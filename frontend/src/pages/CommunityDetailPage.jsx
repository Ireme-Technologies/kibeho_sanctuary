import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLocale } from '@context/LocaleContext'
import { fetchCommunity } from '@api/cms'
import RichText from '@components/ui/RichText'
import NotFoundPage from './NotFoundPage'
import styles from './CatalogPage.module.css'

export default function CommunityDetailPage() {
  const { locale } = useLocale()
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetchCommunity(slug, { locale })
      .then(setItem)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug, locale])

  if (loading) {
    return (
      <div className={`container ${styles.body}`}>
        <p className={styles.empty}>Loading…</p>
      </div>
    )
  }

  if (notFound || !item) return <NotFoundPage />

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={
          item.coverImage
            ? {
                backgroundImage: `linear-gradient(120deg, rgba(18, 40, 71, 0.9), rgba(26, 54, 93, 0.55)), url(${item.coverImage})`,
              }
            : undefined
        }
      >
        <div className="container">
          {item.location ? <p className={styles.subtitle}>{item.location}</p> : null}
          <h1>{item.name || item.title}</h1>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        <div className={styles.detailLayout}>
          {item.coverImage ? <img src={item.coverImage} alt="" className={styles.detailCover} /> : null}
          {item.description ? <RichText html={item.description} className={styles.intro} /> : null}
          {item.gallery?.length ? (
            <div className={styles.gallery}>
              {item.gallery.map((src) => (
                <img key={src} src={src} alt="" />
              ))}
            </div>
          ) : null}
          <div className={styles.actions}>
            <Link to="/our-lady/communities" className={styles.btnGhost}>
              All communities
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
