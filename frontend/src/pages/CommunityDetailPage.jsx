import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useLocale } from '@context/LocaleContext'
import { fetchCommunity } from '@api/cms'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import ItemProfile, { itemProfileStyles as profile } from '@components/ItemProfile'
import LocalizedLink from '@components/LocalizedLink'
import RichText from '@components/ui/RichText'
import { latestImages } from '@utils/latestImages'
import NotFoundPage from './NotFoundPage'

export default function CommunityDetailPage() {
  const { locale, t } = useLocale()
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
      <div className={`container ${profile.profile}`}>
        <p>{t('loading')}</p>
      </div>
    )
  }

  if (notFound || !item) return <NotFoundPage />

  const photo = item.coverImage || ''
  const gallery = latestImages(item.gallery, { exclude: photo })

  return (
    <ItemProfile
      image={photo}
      kicker={item.location}
      title={item.name || item.title}
      footer={
        <LocalizedLink to="/shrine/communities" className={profile.back}>
          {t('allCommunities')}
        </LocalizedLink>
      }
      gallery={gallery}
    >
      <ContentLocaleNotice translations={item.translations} />
      {item.description ? <RichText html={item.description} /> : null}
    </ItemProfile>
  )
}
