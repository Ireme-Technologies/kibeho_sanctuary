import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLocale } from '@context/LocaleContext'
import { fetchPastoralTeamMember } from '@api/cms'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import ItemProfile, { itemProfileStyles as profile } from '@components/ItemProfile'
import LocalizedLink from '@components/LocalizedLink'
import RichText from '@components/ui/RichText'
import NotFoundPage from './NotFoundPage'

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
      <div className={`container ${profile.profile}`}>
        <p>{t('loading')}</p>
      </div>
    )
  }

  if (notFound || !item) return <NotFoundPage />

  const photo = item.photo || item.coverImage || ''
  const bio = item.bio || item.description || ''

  return (
    <ItemProfile
      image={photo}
      kicker={item.role}
      title={item.name}
      footer={
        <LocalizedLink to="/shrine/pastoral-team" className={profile.back}>
          {t('allPastoralTeam')}
        </LocalizedLink>
      }
    >
      <ContentLocaleNotice translations={item.translations} />
      {bio ? <RichText html={bio} /> : null}
    </ItemProfile>
  )
}
