import { useLocale } from '@context/LocaleContext'
import { useContent } from '@context/ContentContext'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchSacredPlace } from '@api/cms'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import RichText from '@components/ui/RichText'
import { heroBackgroundStyle } from '@utils/heroBackground'
import NotFoundPage from './NotFoundPage'
import styles from './CatalogPage.module.css'

export default function SacredPlaceDetailPage() {
  const { locale, t } = useLocale()
  const { resolveHeaderImage } = useContent()
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetchSacredPlace(slug, { locale })
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

  const backPath =
    item.type === 'apparition_site' ? '/shrine/apparition-sites' : '/shrine/places'
  const backLabel =
    item.type === 'apparition_site'
      ? (t('allApparitionSites') !== 'allApparitionSites' ? t('allApparitionSites') : 'Apparition sites')
      : 'Main places'

  const heroImage = resolveHeaderImage(item.coverImage)

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={heroBackgroundStyle(heroImage)}
      >
        <div className="container">
          {item.location ? <p className={styles.subtitle}>{item.location}</p> : null}
          <h1>{item.name || item.title}</h1>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        <div className={styles.detailLayout}>
          <ContentLocaleNotice translations={item.translations} />
          {item.coverImage ? <img src={item.coverImage} alt="" className={styles.detailCover} /> : null}

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
            <Link to={backPath} className={styles.btnGhost}>
              {backLabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
