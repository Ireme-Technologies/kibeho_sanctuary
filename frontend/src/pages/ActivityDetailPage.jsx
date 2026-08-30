import { Link, useParams } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import RichText from '@components/ui/RichText'
import NotFoundPage from './NotFoundPage'
import styles from './CmsPage.module.css'

export default function ActivityDetailPage() {
  const { slug } = useParams()
  const { activities, section, resolveHeaderImage } = useContent()
  const activity = (activities || []).find((item) => item.slug === slug)
  const index = section('activities.index', {})
  const heroImage = resolveHeaderImage(activity?.image)

  if (!activity) return <NotFoundPage />

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18,40,71,.88), rgba(26,54,93,.5)), url(${heroImage})`,
        }}
      >
        <div className="container">
          <p className={styles.eyebrow}>Activities</p>
          <h1>{activity.title}</h1>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        <ContentLocaleNotice translations={activity.translations} />
        {activity.description ? (
          <RichText html={activity.description} className={styles.intro} />
        ) : null}

        <div className={styles.ctaRow}>
          <Link to="/activities" className={styles.btnGhost}>
            {index.title ? `All ${index.title}` : 'All activities'}
          </Link>
          <Link to="/pilgrimage/join" className={styles.btn}>
            Plan your pilgrimage
          </Link>
        </div>
      </div>
    </div>
  )
}
