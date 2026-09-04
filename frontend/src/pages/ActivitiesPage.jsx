import { Link } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import RichText from '@components/ui/RichText'
import { cardExcerpt } from '@utils/text'
import { heroBackgroundStyle } from '@utils/heroBackground'
import styles from './CmsPage.module.css'

export default function ActivitiesPage() {
  const { activities, section, resolveHeaderImage, defaultHeaderImage } = useContent()
  const data = section('activities.index', {
    title: 'Activities',
    subtitle: 'Pray with the Church at Kibeho',
    intro:
      'Participate in the Eucharist, pray the Rosary, walk the Road to the Cross, and grow in worship and meditation.',
  })
  const heroImage = resolveHeaderImage(data.heroImage)

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={heroBackgroundStyle(
          heroImage,
          'linear-gradient(120deg, rgba(18,40,71,.88), rgba(26,54,93,.5))',
        )}
      >
        <div className="container">
          <h1>{data.title || 'Activities'}</h1>
          {data.subtitle ? <p className={styles.subtitle}>{data.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {data.intro ? <RichText html={data.intro} className={styles.intro} /> : null}

        <div className={styles.cards}>
          {(activities || []).map((item) => {
            const summary = cardExcerpt(item)
            return (
            <Link key={item.id || item.slug} to={item.path || `/activities/${item.slug}`} className={styles.card}>
              <img
                src={item.image || defaultHeaderImage}
                alt=""
                style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6, marginBottom: 12 }}
              />
              <h3>{item.title}</h3>
              {summary ? <p>{summary}</p> : null}
            </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
