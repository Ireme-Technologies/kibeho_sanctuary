import { useLocation } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import LocalizedLink from '@components/LocalizedLink'
import { stripLocale } from '@i18n/localizedPath'
import { parseIsoDate } from '@utils/occasion'
import styles from './OtherCelebrations.module.css'

function eventCard(item) {
  const date = parseIsoDate(item?.startsOn || item?.starts_on)
  if (!date) return null
  if (/main feasts celebrated/i.test(item?.title || '')) return null
  const recurrence = String(item.recurrenceType || item.recurrence_type || '').toLowerCase()
  if (recurrence === 'weekly') return null
  return {
    key: item.id || item.slug,
    title: item.title,
    month: date.getMonth(),
    day: date.getDate(),
    path: item.path || (item.slug ? `/pilgrimages/${item.slug}` : ''),
  }
}

export default function OtherCelebrations() {
  const { pathname } = useLocation()
  const { upcomingPilgrimages } = useContent()
  const slug = stripLocale(pathname).split('/').filter(Boolean).pop()
  const events = (upcomingPilgrimages || [])
    .filter((item) => item.slug && item.slug !== slug)
    .map(eventCard)
    .filter((row) => row?.path)
    .sort((a, b) => a.month - b.month || a.day - b.day)

  if (!events.length) return null

  return (
    <section className={styles.section} aria-labelledby="other-celebrations">
      <div className="container">
        <h2 id="other-celebrations" className={styles.heading}>
          Other celebrations
        </h2>
        <div className={styles.grid}>
          {events.map((row) => {
            const label = new Date(2026, row.month, row.day).toLocaleDateString('en-GB', { month: 'short' })
            return (
              <LocalizedLink key={row.key} to={row.path} className={styles.card}>
                <span className={styles.date}>
                  <span className={styles.month}>{label}</span>
                  <span className={styles.day}>{row.day}</span>
                </span>
                <span className={styles.title}>{row.title}</span>
              </LocalizedLink>
            )
          })}
        </div>
      </div>
    </section>
  )
}
