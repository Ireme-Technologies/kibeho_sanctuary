import { useLocale } from '@context/LocaleContext'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchSacredPlace } from '@api/cms'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import ItemProfile, { itemProfileStyles as profile } from '@components/ItemProfile'
import LocalizedLink from '@components/LocalizedLink'
import RichText from '@components/ui/RichText'
import NotFoundPage from './NotFoundPage'

export default function SacredPlaceDetailPage() {
  const { locale, t } = useLocale()
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
      <div className={`container ${profile.profile}`}>
        <p>{t('loading')}</p>
      </div>
    )
  }

  if (notFound || !item) return <NotFoundPage />

  const backPath = item.type === 'apparition_site' ? '/shrine/apparition-sites' : '/shrine/places'
  const backLabel = item.type === 'apparition_site' ? t('allApparitionSites') : 'Main places'
  const photo = item.coverImage || ''
  const gallery = (item.gallery || []).filter((src) => src && src !== photo)

  return (
    <ItemProfile
      image={photo}
      kicker={item.location}
      title={item.name || item.title}
      footer={
        <LocalizedLink to={backPath} className={profile.back}>
          {backLabel}
        </LocalizedLink>
      }
      extra={
        gallery.length ? (
          <div className={profile.gallery}>
            {gallery.map((src) => (
              <img key={src} src={src} alt="" />
            ))}
          </div>
        ) : null
      }
    >
      <ContentLocaleNotice translations={item.translations} />
      {item.description ? <RichText html={item.description} /> : null}
    </ItemProfile>
  )
}
