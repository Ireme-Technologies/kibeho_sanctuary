import { useLocale } from '@context/LocaleContext'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchShrineProject } from '@api/cms'
import RichText from '@components/ui/RichText'
import NotFoundPage from './NotFoundPage'
import styles from './CatalogPage.module.css'

export default function SupportProjectDetailPage() {
  const { locale } = useLocale()
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetchShrineProject(slug, { locale })
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

  const hasFunding = item.fundingGoal || item.fundingRaised

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
          {item.status ? <p className={styles.subtitle}>{item.status}</p> : null}
          <h1>{item.title}</h1>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        <div className={styles.detailLayout}>
          {item.coverImage ? <img src={item.coverImage} alt="" className={styles.detailCover} /> : null}

          {item.phase ? <p className={styles.meta}>{item.phase}</p> : null}

          {item.description ? (
            <RichText html={item.description} className={styles.intro} />
          ) : null}

          {hasFunding ? (
            <div className={styles.intro}>
              {item.fundingRaised ? <p><strong>Raised:</strong> {item.fundingRaised}</p> : null}
              {item.fundingGoal ? <p><strong>Goal:</strong> {item.fundingGoal}</p> : null}
            </div>
          ) : null}

          {item.gallery?.length ? (
            <div className={styles.gallery}>
              {item.gallery.map((src) => (
                <img key={src} src={src} alt="" />
              ))}
            </div>
          ) : null}

          <div className={styles.actions}>
            <Link to="/support/projects" className={styles.btnGhost}>
              All projects
            </Link>
            <Link to="/support/donations" className={styles.btn}>
              Support the Shrine
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
