import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLocale } from '@context/LocaleContext'
import { fetchPastoralTeamMember } from '@api/cms'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import LocalizedLink from '@components/LocalizedLink'
import RichText from '@components/ui/RichText'
import NotFoundPage from './NotFoundPage'
import styles from './PastoralTeamDetailPage.module.css'

export default function PastoralTeamDetailPage() {
  const { locale, t } = useLocale()
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
      <div className={`container ${styles.profile}`}>
        <p>{t('loading')}</p>
      </div>
    )
  }

  if (notFound || !item) return <NotFoundPage />

  const photo = item.photo || item.coverImage || ''
  const bio = item.bio || item.description || ''

  return (
    <article className={styles.profile}>
      <div className={`container ${styles.layout} ${photo ? '' : styles.layoutText}`}>
        {photo ? (
          <figure className={styles.portrait}>
            <img src={photo} alt="" />
          </figure>
        ) : null}

        <div className={styles.copy}>
          <ContentLocaleNotice translations={item.translations} />
          {item.role ? <p className={styles.role}>{item.role}</p> : null}
          <h1 className={styles.name}>{item.name}</h1>
          {bio ? <RichText html={bio} className={styles.bio} /> : null}
          <LocalizedLink to="/shrine/pastoral-team" className={styles.back}>
            {t('allPastoralTeam')}
          </LocalizedLink>
        </div>
      </div>
    </article>
  )
}
