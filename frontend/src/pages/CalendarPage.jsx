import { Link, useSearchParams } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { formatItemDates, formatRecurrence, formatTimeRange } from '@utils/eventTime'
import { classifyEvent, occurrenceWindow, statusLabel } from '@utils/occasion'
import RichText from '@components/ui/RichText'
import { cardExcerpt } from '@utils/text'
import { PAGE_SIZE, paginate } from '@utils/paginate'
import Pagination from '@components/Pagination'
import { heroBackgroundStyle } from '@utils/heroBackground'
import styles from './CatalogPage.module.css'
import cms from './CmsPage.module.css'

function formatEventType(eventType) {
  if (!eventType) return null
  return eventType.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function CalendarPage() {
  const { upcomingPilgrimages, section, resolveHeaderImage } = useContent()
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || 1)
  const hero = section('pilgrimage.calendar', {})

  const sorted = [...(upcomingPilgrimages || [])].sort((a, b) => {
    const aStart = occurrenceWindow(a)?.start
    const bStart = occurrenceWindow(b)?.start
    if (aStart && bStart) return bStart - aStart
    return (b.id || 0) - (a.id || 0)
  })
  const paged = paginate(sorted, page, PAGE_SIZE)

  const heroImage = resolveHeaderImage(hero.heroImage)

  return (
    <div className={styles.page}>
      <header className={styles.hero} style={heroBackgroundStyle(heroImage)}>
        <div className="container">
          <h1>{hero.title || 'Pilgrimage events'}</h1>
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}

        {(hero.blocks || []).map((block, index) => {
          if (block.type === 'heading') {
            return (
              <h2 key={`h-${index}`} className={cms.blockHeading}>
                {block.text}
              </h2>
            )
          }
          if (block.type === 'paragraph') {
            return <RichText key={`p-${index}`} html={block.text} className={cms.paragraph} />
          }
          if (block.type === 'note') {
            return <RichText key={`n-${index}`} html={block.text} as="aside" className={cms.note} />
          }
          if (block.type === 'cards') {
            return (
              <div key={`c-${index}`} className={cms.cards}>
                {(block.items || []).map((item) => (
                  <article key={item.title} className={cms.card}>
                    <h3>{item.title}</h3>
                    <RichText html={item.text} />
                  </article>
                ))}
              </div>
            )
          }
          return null
        })}

        {!sorted.length ? (
          <p className={styles.empty}>Pilgrimage events will appear here once published.</p>
        ) : null}

        <div className={styles.schedule}>
          {paged.items.map((item) => {
            const dateLabel = formatItemDates(item)
            const timeLabel = formatTimeRange(item.startsAtTime, item.endsAtTime)
            const eventTypeLabel = formatEventType(item.eventType)
            const recurrence = formatRecurrence(item)
            const state = classifyEvent(item)
            const badge = statusLabel(state.status)

            return (
              <article
                key={item.id || item.slug}
                className={`${styles.scheduleRow} ${state.status === 'live' ? styles.scheduleLive : ''}`}
              >
                <div>
                  {badge ? <p className={styles.badge}>{badge}</p> : null}
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
                  {cardExcerpt(item) ? (
                    <p className={styles.notes}>{cardExcerpt(item)}</p>
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
        <Pagination
          page={paged.page}
          pageCount={paged.pageCount}
          total={paged.total}
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  )
}
