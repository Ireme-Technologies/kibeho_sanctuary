/**
 * Liturgical / pilgrimage "occasion" — what the shrine is living right now.
 *
 * Priority for the site-wide ribbon:
 *   1. Happening today (or still in progress)
 *   2. Recently concluded (within RECENT_DAYS)
 *   3. Coming up (within UPCOMING_DAYS)
 *
 * Annual events roll to the current year so a feast dated 2026-08-15
 * still reads as "today" every 15 August.
 */

export const UPCOMING_DAYS = 21
export const RECENT_DAYS = 7
const MS_DAY = 24 * 60 * 60 * 1000

export function startOfDay(value = new Date()) {
  const date = value instanceof Date ? value : new Date(value)
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function parseIsoDate(value) {
  if (!value) return null
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : startOfDay(date)
}

function daysBetween(from, to) {
  return Math.round((startOfDay(to) - startOfDay(from)) / MS_DAY)
}

function recurrenceType(item = {}) {
  const raw = String(item.recurrenceType || item.recurrence_type || '').toLowerCase()
  if (raw === 'weekly' || raw === 'monthly' || raw === 'annual') return raw
  if (item.isRecurring || item.is_recurring) return 'annual'
  return ''
}

function spanDays(startsOn, endsOn) {
  const start = parseIsoDate(startsOn)
  const end = parseIsoDate(endsOn) || start
  if (!start) return 0
  return Math.max(0, daysBetween(start, end))
}

function windowFromStart(start, durationDays) {
  const end = new Date(start)
  end.setDate(end.getDate() + durationDays)
  return { start, end }
}

/**
 * The occurrence window that matters for `today`:
 * live / recent this year, otherwise the next future window.
 */
export function occurrenceWindow(item, today = new Date()) {
  const type = recurrenceType(item)
  const startsOn = item.startsOn || item.starts_on
  const endsOn = item.endsOn || item.ends_on
  const duration = spanDays(startsOn, endsOn)
  const todayDay = startOfDay(today)
  const storedStart = parseIsoDate(startsOn)
  if (!storedStart) return null

  if (type === 'annual') {
    const make = (year) => {
      const start = new Date(year, storedStart.getMonth(), storedStart.getDate())
      return windowFromStart(start, duration)
    }
    const thisYear = make(todayDay.getFullYear())
    if (todayDay >= thisYear.start && todayDay <= thisYear.end) return thisYear
    const daysAfter = daysBetween(thisYear.end, todayDay)
    if (daysAfter >= 1 && daysAfter <= RECENT_DAYS) return thisYear
    if (todayDay < thisYear.start) return thisYear
    return make(todayDay.getFullYear() + 1)
  }

  if (type === 'weekly') {
    const start = new Date(todayDay)
    const target = storedStart.getDay()
    const ahead = (target - start.getDay() + 7) % 7
    start.setDate(start.getDate() + ahead)
    const window = windowFromStart(start, duration)
    if (todayDay < window.start) {
      const prev = new Date(window.start)
      prev.setDate(prev.getDate() - 7)
      const recent = windowFromStart(prev, duration)
      if (todayDay >= recent.start && daysBetween(recent.end, todayDay) <= RECENT_DAYS) {
        return recent
      }
    }
    return window
  }

  if (type === 'monthly') {
    const make = (year, month) => {
      const last = new Date(year, month + 1, 0).getDate()
      const day = Math.min(storedStart.getDate(), last)
      return windowFromStart(new Date(year, month, day), duration)
    }
    const thisMonth = make(todayDay.getFullYear(), todayDay.getMonth())
    if (todayDay >= thisMonth.start && todayDay <= thisMonth.end) return thisMonth
    const daysAfter = daysBetween(thisMonth.end, todayDay)
    if (daysAfter >= 1 && daysAfter <= RECENT_DAYS) return thisMonth
    if (todayDay < thisMonth.start) return thisMonth
    const nextMonth = todayDay.getMonth() + 1
    return make(todayDay.getFullYear() + Math.floor(nextMonth / 12), nextMonth % 12)
  }

  return windowFromStart(storedStart, duration)
}

export function classifyEvent(item, today = new Date()) {
  const window = occurrenceWindow(item, today)
  if (!window) return { status: 'none', window: null, daysUntil: null, daysSince: null }

  const todayDay = startOfDay(today)
  if (todayDay >= window.start && todayDay <= window.end) {
    return { status: 'live', window, daysUntil: 0, daysSince: 0 }
  }
  if (todayDay > window.end) {
    const daysSince = daysBetween(window.end, todayDay)
    if (daysSince <= RECENT_DAYS) {
      return { status: 'recent', window, daysUntil: null, daysSince }
    }
    return { status: 'past', window, daysUntil: null, daysSince }
  }
  const daysUntil = daysBetween(todayDay, window.start)
  if (daysUntil <= UPCOMING_DAYS) {
    return { status: 'upcoming', window, daysUntil, daysSince: null }
  }
  return { status: 'later', window, daysUntil, daysSince: null }
}

function rank(status) {
  if (status === 'live') return 0
  if (status === 'recent') return 1
  if (status === 'upcoming') return 2
  return 9
}

/**
 * The single occasion the whole site should know about, or null.
 */
export function pickSiteOccasion(events = [], today = new Date()) {
  const scored = (events || [])
    .map((item) => ({ item, ...classifyEvent(item, today) }))
    .filter((row) => row.status === 'live' || row.status === 'recent' || row.status === 'upcoming')
    .sort((a, b) => {
      const byStatus = rank(a.status) - rank(b.status)
      if (byStatus) return byStatus
      if (a.status === 'upcoming') return (a.daysUntil || 0) - (b.daysUntil || 0)
      if (a.status === 'recent') return (a.daysSince || 0) - (b.daysSince || 0)
      return 0
    })

  return scored[0] || null
}

/**
 * For the site header: live / near-term occasion first, otherwise the next future event.
 */
export function pickHeaderOccasion(events = [], today = new Date()) {
  const primary = pickSiteOccasion(events, today)
  if (primary) return primary

  const later = (events || [])
    .map((item) => ({ item, ...classifyEvent(item, today) }))
    .filter((row) => row.status === 'later' && row.window)
    .sort((a, b) => (a.daysUntil ?? Infinity) - (b.daysUntil ?? Infinity))

  return later[0] || null
}

export function formatOccurrenceRange(window) {
  if (!window?.start) return ''
  const start = window.start
  const end = window.end || window.start
  const sameDay = start.getTime() === end.getTime()
  const opts = { day: 'numeric', month: 'long' }
  if (sameDay) {
    return start.toLocaleDateString('en-GB', { weekday: 'long', ...opts })
  }
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} – ${end.getDate()} ${start.toLocaleDateString('en-GB', { month: 'long' })}`
  }
  return `${start.toLocaleDateString('en-GB', opts)} – ${end.toLocaleDateString('en-GB', opts)}`
}

export function occasionCopy(occasion) {
  if (!occasion?.item) return null
  const title = occasion.item.title || 'this gathering'
  const when = formatOccurrenceRange(occasion.window)
  const path = occasion.item.path || (occasion.item.slug ? `/pilgrimages/${occasion.item.slug}` : '/pilgrimage/calendar')

  if (occasion.status === 'live') {
    return {
      kicker: 'Today at the Shrine',
      message: `${title} is being celebrated today${when ? ` · ${when}` : ''}`,
      cta: 'Join us',
      path,
    }
  }
  if (occasion.status === 'recent') {
    const ago = occasion.daysSince === 1 ? 'yesterday' : `${occasion.daysSince} days ago`
    return {
      kicker: 'This week at Kibeho',
      message: `The shrine recently celebrated ${title} (${ago})`,
      cta: 'See the feast',
      path,
    }
  }
  if (occasion.status === 'upcoming') {
    const inLabel =
      occasion.daysUntil === 0
        ? 'today'
        : occasion.daysUntil === 1
          ? 'tomorrow'
          : `in ${occasion.daysUntil} days`
    return {
      kicker: 'Coming up',
      message: `${title} ${inLabel}${when ? ` · ${when}` : ''}`,
      cta: 'View event',
      path,
    }
  }
  return null
}

export function statusLabel(status) {
  if (status === 'live') return 'Today'
  if (status === 'recent') return 'This week'
  if (status === 'upcoming' || status === 'later') return 'Coming up'
  return null
}

export function relatedToEvent(entry, event) {
  if (!entry || !event?.slug) return false
  const slug = String(event.slug).toLowerCase()
  const linked = String(entry.relatedEventSlug || entry.related_event_slug || '').toLowerCase()
  if (linked && linked === slug) return true
  const tags = Array.isArray(entry.tags) ? entry.tags : []
  return tags.some((tag) => String(tag).toLowerCase().replace(/\s+/g, '-') === slug)
}

export function normalizeArchives(raw) {
  const list = Array.isArray(raw) ? raw : []
  return list
    .map((row) => {
      const type = row?.type === 'news' ? 'news' : 'gallery'
      const year = Number(row?.year) || null
      const caption = row?.caption || ''
      if (type === 'news') {
        const slug = String(row?.slug || '').trim()
        if (!slug) return null
        return { type, year, caption, slug, images: [] }
      }
      const images = (Array.isArray(row?.images) ? row.images : [])
        .map((img) => (typeof img === 'string' ? img : img?.url || img?.src || ''))
        .filter(Boolean)
      if (!images.length) return null
      return { type, year, caption, slug: '', images }
    })
    .filter(Boolean)
}

export function archiveGalleries(raw) {
  return normalizeArchives(raw)
    .filter((row) => row.type === 'gallery')
    .sort((a, b) => (b.year || 0) - (a.year || 0))
}

export function archiveNewsSlugs(raw) {
  return normalizeArchives(raw)
    .filter((row) => row.type === 'news' && row.slug)
    .map((row) => row.slug)
}
