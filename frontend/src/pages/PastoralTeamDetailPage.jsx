import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLocale } from '@context/LocaleContext'
import { useContent } from '@context/ContentContext'
import { fetchPastoralTeamMember } from '@api/cms'
import RichText from '@components/ui/RichText'
import NotFoundPage from './NotFoundPage'
import styles from './CatalogPage.module.css'

export default function PastoralTeamDetailPage() {
  const { locale } = useLocale()
  const { resolveHeaderImage } = useContent()
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetchPastoralTeamMember(slug, { locale })
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

  const heroImage = resolveHeaderImage(item.photo || item.coverImage)

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18, 40, 71, 0.9), rgba(26, 54, 93, 0.55)), url(${heroImage})`,
        }}
      >
        <div className="container">
          {item.role ? <p className={styles.subtitle}>{item.role}</p> : null}
          <h1>{item.name}</h1>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        <div className={styles.detailLayout}>
          {item.photo || item.coverImage ? (
            <img src={item.photo || item.coverImage} alt="" className={styles.detailCover} />
          ) : null}
          {item.bio || item.description ? (
            <RichText html={item.bio || item.description} className={styles.intro} />
          ) : null}
          <div className={styles.actions}>
            <Link to="/our-lady/pastoral-team" className={styles.btnGhost}>
              All pastoral team
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
