import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useLocale } from '@context/LocaleContext'
import { useContent } from '@context/ContentContext'
import { fetchPastoralTeamMember } from '@api/cms'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import RichText from '@components/ui/RichText'
import { heroBackgroundStyle } from '@utils/heroBackground'
import NotFoundPage from './NotFoundPage'
import styles from './CatalogPage.module.css'

export default function PastoralTeamDetailPage() {
  const { locale, t } = useLocale()
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
        <p className={styles.empty}>{t('loading')}</p>
      </div>
    )
  }

  if (notFound || !item) return <NotFoundPage />

  const heroImage = resolveHeaderImage(item.photo || item.coverImage)

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={heroBackgroundStyle(heroImage)}
      >
        <div className="container">
          {item.role ? <p className={styles.subtitle}>{item.role}</p> : null}
          <h1>{item.name}</h1>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        <div className={styles.detailLayout}>
          <ContentLocaleNotice translations={item.translations} />
          {item.photo || item.coverImage ? (
            <img src={item.photo || item.coverImage} alt="" className={styles.detailCover} />
          ) : null}
          {item.bio || item.description ? (
            <RichText html={item.bio || item.description} className={styles.intro} />
          ) : null}
          <div className={styles.actions}>
            <Link to="/shrine/pastoral-team" className={styles.btnGhost}>
              {t('allPastoralTeam')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
