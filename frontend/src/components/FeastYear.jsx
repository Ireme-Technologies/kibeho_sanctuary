import { Link } from 'react-router-dom'
import { classifyEvent, parseIsoDate } from '@utils/occasion'
import styles from './FeastYear.module.css'

function monthDay(item) {
  const date = parseIsoDate(item.startsOn || item.starts_on)
  if (!date) return null
  return { month: date.getMonth(), day: date.getDate(), date }
}

function nextFeastId(events) {
  const ranked = events
    .map((item) => ({ item, ...classifyEvent(item) }))
    .filter((row) => row.status === 'live' || row.status === 'upcoming' || row.status === 'later')
    .sort((a, b) => {
      if (a.status === 'live') return -1
      if (b.status === 'live') return 1
      return (a.daysUntil ?? 9999) - (b.daysUntil ?? 9999)
    })
  return ranked[0]?.item?.id || ranked[0]?.item?.slug || null
}

export default function FeastYear({ events = [] }) {
  const feasts = events
    .map((item) => ({ item, when: monthDay(item) }))
    .filter((row) => row.when && (row.item.eventType || row.item.event_type) === 'feast')
    .sort((a, b) => a.when.month - b.when.month || a.when.day - b.when.day)

  if (!feasts.length) return null

  const nextId = nextFeastId(feasts.map((row) => row.item))

  return (
    <div className={styles.grid}>
      {feasts.map(({ item, when }) => {
        const isNext = (item.id || item.slug) === nextId
        const state = classifyEvent(item)
        const month = when.date.toLocaleDateString('en-GB', { month: 'short' })
        const whenLabel = state.window?.start
          ? state.window.start.toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })
          : ''
        return (
          <Link
            key={item.id || item.slug}
            to={item.path || `/pilgrimages/${item.slug}`}
            className={`${styles.card} ${isNext ? styles.next : ''}`}
          >
            <span className={styles.date}>
              <span className={styles.month}>{month}</span>
              <span className={styles.day}>{when.day}</span>
            </span>
            <span className={styles.body}>
              {isNext ? <span className={styles.badge}>{state.status === 'live' ? 'Today' : 'Next'}</span> : null}
              <span className={styles.title}>{item.title}</span>
              {isNext && whenLabel ? <span className={styles.when}>{whenLabel}</span> : null}
            </span>
          </Link>
        )
      })}
    </div>
  )
}

export function isDateList(html) {
  const text = String(html || '').replace(/<[^>]+>/g, ' ')
  const months = text.match(
    /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b/gi,
  )
  return Boolean(months && months.length >= 4)
}
