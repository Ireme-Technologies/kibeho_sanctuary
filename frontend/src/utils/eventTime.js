/**
 * Shared date/time/recurrence formatting for masses and calendar events.
 */

export const RECURRENCE_OPTIONS = [
  { value: '', label: 'Does not repeat' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'annual', label: 'Annual' },
]

const RECURRENCE_LABELS = {
  weekly: 'Weekly',
  monthly: 'Monthly',
  annual: 'Annual',
}

/**
 * Format calendar event dates/times for public display.
 */
export function formatEventWhen(item = {}) {
  const parts = []
  const datePart = formatDateRange(item.startsOn, item.endsOn, Boolean(item.isRecurring || item.recurrenceType))
  if (datePart) parts.push(datePart)

  const timePart = formatTimeRange(item.startsAtTime, item.endsAtTime)
  if (timePart) parts.push(timePart)

  return parts.join(' · ')
}

export function formatDateRange(startsOn, endsOn, isRecurring = false) {
  if (!startsOn && !endsOn) return null

  const start = parseDate(startsOn)
  const end = parseDate(endsOn)

  if (isRecurring && start) {
    const weekday = start.toLocaleDateString('en-GB', { weekday: 'long' })
    return `${weekday}, ${fmtFull(start)}`
  }

  if (start && end && startsOn !== endsOn) {
    if (start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()) {
      return `${start.getDate()} – ${end.getDate()} ${start.toLocaleDateString('en-GB', {
        month: 'long',
        year: 'numeric',
      })}`
    }
    if (start.getFullYear() === end.getFullYear()) {
      return `${start.toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })} – ${end.toLocaleDateString(
        'en-GB',
        { day: 'numeric', month: 'long', year: 'numeric' }
      )}`
    }
    return `${fmtFull(start)} – ${fmtFull(end)}`
  }

  const only = start || end
  if (!only) return startsOn || endsOn
  const weekday = only.toLocaleDateString('en-GB', { weekday: 'long' })
  return `${weekday}, ${fmtFull(only)}`
}

export function formatTimeRange(startsAtTime, endsAtTime) {
  const start = formatClock(startsAtTime)
  const end = formatClock(endsAtTime)
  if (start && end) return `${start} – ${end}`
  return start || end || null
}

/** Prefer structured times; fall back to free-text timeLabel for older mass rows. */
export function formatMassTime(item = {}) {
  return formatTimeRange(item.startsAtTime, item.endsAtTime) || item.timeLabel || null
}

/**
 * Returns "Weekly" | "Monthly" | "Annual" | null.
 * Falls back to "Annual" when isRecurring is true but type is missing (legacy data).
 */
export function formatRecurrence(item = {}) {
  const type = normalizeRecurrenceType(item.recurrenceType || item.recurrence_type)
  if (type) return RECURRENCE_LABELS[type] || null
  if (item.isRecurring) return RECURRENCE_LABELS.annual
  return null
}

export function normalizeRecurrenceType(value) {
  const raw = String(value || '').trim().toLowerCase()
  if (raw === 'weekly' || raw === 'monthly' || raw === 'annual') return raw
  return ''
}

function parseDate(value) {
  if (!value) return null
  const match = String(value).match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match) {
    return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]))
  }
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function fmtFull(date) {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

function formatClock(value) {
  if (!value) return null
  const raw = String(value).trim()
  const match = raw.match(/^(\d{1,2}):(\d{2})(?::\d{2})?$/)
  if (!match) return raw
  let hours = Number(match[1])
  const minutes = match[2]
  const suffix = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${hours}:${minutes} ${suffix}`
}
