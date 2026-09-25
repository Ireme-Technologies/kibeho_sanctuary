import { useParams } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import ItemProfile, { itemProfileStyles as profile } from '@components/ItemProfile'
import LocalizedLink from '@components/LocalizedLink'
import RichText from '@components/ui/RichText'
import NotFoundPage from './NotFoundPage'

export default function ActivityDetailPage() {
  const { slug } = useParams()
  const { activities, section } = useContent()
  const activity = (activities || []).find((item) => item.slug === slug)
  const index = section('activities.index', {})

  if (!activity) return <NotFoundPage />

  return (
    <ItemProfile
      image={activity.image || ''}
      title={activity.title}
      footer={
        <>
          <LocalizedLink to="/activities" className={profile.back}>
            {index.title ? `All ${index.title}` : 'All activities'}
          </LocalizedLink>
          <LocalizedLink to="/pilgrimage/calendar" className={profile.back}>
            View Calendar
          </LocalizedLink>
          <LocalizedLink to="/pilgrimage/plan" className={profile.primary}>
            Plan Your Pilgrimage
          </LocalizedLink>
          <LocalizedLink to="/support/get-involved" className={profile.back}>
            Get involved
          </LocalizedLink>
        </>
      }
    >
      <ContentLocaleNotice translations={activity.translations} />
      {activity.description ? <RichText html={activity.description} /> : null}
    </ItemProfile>
  )
}
