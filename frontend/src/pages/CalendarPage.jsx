import { Link } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { formatDateRange, formatRecurrence, formatTimeRange } from '@utils/eventTime'
import RichText from '@components/ui/RichText'
import styles from './CatalogPage.module.css'

const stripHtml = (html) =>
  String(html || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

function formatEventType(eventType) {
  if (!eventType) return null
  return eventType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function CalendarPage() {
  const { upcomingPilgrimages, section, resolveHeaderImage } = useContent()
  const hero = section('pilgrimage.calendar', {})

  const sorted = [...(upcomingPilgrimages || [])].sort((a, b) => {
    const aDate = a.startsOn || ''
    const bDate = b.startsOn || ''
    if (aDate && bDate) return aDate.localeCompare(bDate)
    return (a.sortOrder || 0) - (b.sortOrder || 0)
  })

  const heroImage = resolveHeaderImage(hero.heroImage, '/images/sanctuary/hero.jpg')

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18, 40, 71, 0.9), rgba(26, 54, 93, 0.55)), url(${heroImage})`,
        }}
      >
        <div className="container">
          <h1>{hero.title || 'Pilgrimage Calendar'}</h1>
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}

        {!sorted.length ? (
          <p className={styles.empty}>Upcoming events will appear here once published.</p>
        ) : null}

        <div className={styles.schedule}>
          {sorted.map((item) => {
            const dateLabel = formatDateRange(item.startsOn, item.endsOn, Boolean(item.isRecurring || item.recurrenceType))
            const timeLabel = formatTimeRange(item.startsAtTime, item.endsAtTime)
            const eventTypeLabel = formatEventType(item.eventType)
            const recurrence = formatRecurrence(item)

            return (
              <article key={item.id || item.slug} className={styles.scheduleRow}>
                <div>
                  {dateLabel ? <p className={styles.day}>{dateLabel}</p> : null}
                  {!dateLabel && item.meta ? <p className={styles.day}>{item.meta}</p> : null}
                </div>
                <div>
                  <h2 className={styles.title}>{item.title}</h2>
                  {[eventTypeLabel, recurrence].filter(Boolean).length ? (
                    <p className={styles.meta}>
                      {[eventTypeLabel, recurrence].filter(Boolean).join(' · ')}
                    </p>
                  ) : null}
                  {item.shortDescription ? (
                    <p className={styles.notes}>{stripHtml(item.shortDescription)}</p>
                  ) : null}
                  {item.location ? <p className={styles.notes}>{item.location}</p> : null}
                  <Link to={item.path || `/pilgrimages/${item.slug}`} className={styles.cta}>
                    View details →
                  </Link>
                </div>
                <div>
                  {timeLabel ? <p className={styles.time}>{timeLabel}</p> : null}
                  {!timeLabel && item.meta && dateLabel ? (
                    <p className={styles.time}>{item.meta}</p>
                  ) : null}
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
