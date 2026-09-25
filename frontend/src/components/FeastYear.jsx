import { Link } from 'react-router-dom'
import { classifyEvent, parseIsoDate } from '@utils/occasion'
import styles from './FeastYear.module.css'

const MONTHS = {
  january: 0,
  february: 1,
  march: 2,
  april: 3,
  may: 4,
  june: 5,
  july: 6,
  august: 7,
  september: 8,
  october: 9,
  november: 10,
  december: 11,
}

const KNOWN_SLUGS = {
  '0-1': 'mother-of-god',
  '0-12': 'apparition-nathalie-mukamazimpaka',
  '2-2': 'apparition-marie-claire-mukangango',
  '2-25': 'annunciation',
  '4-31': 'inauguration-of-kibeho-shrine',
  '5-29': 'recognition-of-the-kibeho-apparitions',
  '7-15': 'feast-of-the-assumption',
  '8-15': 'our-lady-of-sorrows',
  '9-7': 'our-lady-of-the-rosary',
  '10-28': 'our-lady-of-kibeho',
}

function monthDay(item) {
  const date = parseIsoDate(item?.startsOn || item?.starts_on)
  if (!date) return null
  return { month: date.getMonth(), day: date.getDate(), date }
}

function isUmbrella(item) {
  return /main feasts celebrated/i.test(item?.title || '')
}

function nextKey(rows) {
  const ranked = rows
    .map((row) => ({ row, ...classifyEvent(row.item || { startsOn: row.startsOn, recurrenceType: 'annual', isRecurring: true }) }))
    .filter((entry) => entry.status === 'live' || entry.status === 'upcoming' || entry.status === 'later')
    .sort((a, b) => {
      if (a.status === 'live') return -1
      if (b.status === 'live') return 1
      return (a.daysUntil ?? 9999) - (b.daysUntil ?? 9999)
    })
  return ranked[0]?.row?.key || null
}

function matchEvent(line, events) {
  return (
    events.find((item) => {
      const when = monthDay(item)
      return when && when.month === line.month && when.day === line.day && !isUmbrella(item)
    }) ||
    events.find((item) => {
      const title = String(item.title || '').toLowerCase().replace(/[^\w]+/g, ' ').trim()
      const lineTitle = line.title.toLowerCase().replace(/[^\w]+/g, ' ').trim()
      return title && lineTitle && (title === lineTitle || title.includes(lineTitle) || lineTitle.includes(title)) && !isUmbrella(item)
    }) ||
    null
  )
}

export function parseDateList(html) {
  const text = String(html || '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
  const pattern = /(January|February|March|April|May|June|July|August|September|October|November|December)\s*,?\s*(\d{1,2})\s*:\s*([^\n]+)/gi
  const lines = []
  let match = pattern.exec(text)
  while (match) {
    const title = match[3].replace(/\s+/g, ' ').replace(/\.\s*$/, '').trim()
    const month = MONTHS[match[1].toLowerCase()]
    const day = Number(match[2])
    if (title && month !== undefined && day) lines.push({ month, day, title })
    match = pattern.exec(text)
  }
  return lines
}

export function isDateList(html) {
  return parseDateList(html).length >= 4
}

function cardFromLine(line, events) {
  const item = matchEvent(line, events)
  const key = `${line.month}-${line.day}`
  const slug = item?.slug || KNOWN_SLUGS[key]
  const startsOn = item?.startsOn || item?.starts_on || `2026-${String(line.month + 1).padStart(2, '0')}-${String(line.day).padStart(2, '0')}`
  return {
    key: item?.id || slug || key,
    title: item?.title || line.title,
    month: line.month,
    day: line.day,
    path: item?.path || (slug ? `/pilgrimages/${slug}` : ''),
    item: item || { startsOn, recurrenceType: 'annual', isRecurring: true, title: line.title, slug },
  }
}

function cardFromEvent(item) {
  const when = monthDay(item)
  if (!when || isUmbrella(item)) return null
  const recurrence = String(item.recurrenceType || item.recurrence_type || '').toLowerCase()
  if (recurrence === 'weekly') return null
  return {
    key: item.id || item.slug,
    title: item.title,
    month: when.month,
    day: when.day,
    path: item.path || (item.slug ? `/pilgrimages/${item.slug}` : ''),
    item,
  }
}

export default function FeastYear({ events = [], lines = [] }) {
  const fromLines = lines.map((line) => cardFromLine(line, events))
  const covered = new Set(fromLines.map((row) => `${row.month}-${row.day}`))
  const extras = events
    .map(cardFromEvent)
    .filter((row) => row && !covered.has(`${row.month}-${row.day}`))
  const feasts = [...fromLines, ...extras].sort((a, b) => a.month - b.month || a.day - b.day)

  if (!feasts.length) return null

  const next = nextKey(feasts)

  return (
    <div className={styles.grid}>
      {feasts.map((row) => {
        const isNext = row.key === next
        const state = classifyEvent(row.item)
        const date = new Date(2026, row.month, row.day)
        const month = date.toLocaleDateString('en-GB', { month: 'short' })
        const whenLabel = state.window?.start
          ? state.window.start.toLocaleDateString('en-GB', {
              weekday: 'long',
              day: 'numeric',
              month: 'long',
            })
          : ''
        const body = (
          <>
            <span className={styles.date}>
              <span className={styles.month}>{month}</span>
              <span className={styles.day}>{row.day}</span>
            </span>
            <span className={styles.body}>
              {isNext ? <span className={styles.badge}>{state.status === 'live' ? 'Today' : 'Next'}</span> : null}
              <span className={styles.title}>{row.title}</span>
              {isNext && whenLabel ? <span className={styles.when}>{whenLabel}</span> : null}
            </span>
          </>
        )
        if (!row.path) {
          return (
            <article key={row.key} className={styles.card}>
              {body}
            </article>
          )
        }
        return (
          <Link key={row.key} to={row.path} className={`${styles.card} ${isNext ? styles.next : ''}`}>
            {body}
          </Link>
        )
      })}
    </div>
  )
}
