import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  AlertTriangle,
  Clock,
  Info,
  MapPin,
  Shirt,
  Users,
  VolumeX,
  ChevronRight,
  CalendarDays,
} from 'lucide-react'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchMassSchedules } from '@api/cms'
import { catalogErrorMessage } from '@api/client'
import { formatMassTime, formatRecurrence, formatItemDates } from '@utils/eventTime'
import { classifyEvent, occurrenceWindow, statusLabel } from '@utils/occasion'
import RichText from '@components/ui/RichText'
import { resolveSectionContent } from '@data/pages/mergePageContent'
import { cardExcerpt } from '@utils/text'
import { heroBackgroundStyle } from '@utils/heroBackground'
import styles from './ShrineSchedulePage.module.css'

const stripHtml = (html) =>
  String(html || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

const GUIDELINE_ICONS = {
  alert: AlertTriangle,
  info: Info,
  clock: Clock,
  shirt: Shirt,
  volume: VolumeX,
  users: Users,
  map: MapPin,
}

const FALLBACK_GUIDELINES = [
  {
    title: 'Dress modestly',
    text: 'Dress modestly for church and outdoor prayer throughout the Shrine grounds.',
    tone: 'caution',
    icon: 'shirt',
  },
  {
    title: 'Arrive early on feast days',
    text: 'Principal Masses draw large pilgrim crowds — arrive early and follow steward directions.',
    tone: 'alert',
    icon: 'clock',
  },
  {
    title: 'Respect silence',
    text: 'Keep silence at apparition sites and during prayer in the compound.',
    tone: 'caution',
    icon: 'volume',
  },
  {
    title: 'Follow shrine stewards',
    text: 'Stewards guide processions, seating, and crowd flow for safety and prayer.',
    tone: 'info',
    icon: 'users',
  },
]

const THURSDAY_PROCESSION = {
  id: 'thursday-procession',
  dayLabel: 'Thursday',
  title: 'Processions',
  startsAtTime: '17:30',
  endsAtTime: '',
  recurrenceType: 'weekly',
  isRecurring: true,
  language: '',
  location: 'Shrine compound',
  notes: 'Weekly Marian procession — a living part of devotion at Kibeho.',
  sortOrder: 15,
}

function isAnnualRow(row) {
  const recurrence = String(row.recurrenceType || row.recurrence_type || '').toLowerCase()
  const day = String(row.dayLabel || row.day_label || '').toLowerCase()
  return recurrence === 'annual' || day.includes('feast')
}

function isSundayRow(row) {
  return /sunday/i.test(String(row.dayLabel || ''))
}

function isThursdayRow(row) {
  return /thursday/i.test(String(row.dayLabel || '')) || /procession/i.test(String(row.title || ''))
}

function highlightKind(row) {
  if (isSundayRow(row)) return 'sunday'
  if (isThursdayRow(row)) return 'thursday'
  return ''
}

function normalizeGuidelines(raw) {
  if (!Array.isArray(raw) || !raw.length) return FALLBACK_GUIDELINES
  return raw
    .map((item) => {
      if (typeof item === 'string') {
        return { title: item, text: '', tone: 'caution', icon: 'alert', image: '' }
      }
      return {
        title: item.title || item.label || '',
        text: item.text || item.description || '',
        tone: item.tone || 'caution',
        icon: item.icon || 'alert',
        image: item.image || '',
      }
    })
    .filter((item) => item.title || item.text)
}

function ensureThursdayProcession(weeklyRows) {
  const hasThursday = weeklyRows.some(isThursdayRow)
  if (hasThursday) return weeklyRows
  return [...weeklyRows, THURSDAY_PROCESSION]
}

function sortWeekly(rows) {
  const rank = (row) => {
    if (isSundayRow(row)) return 0
    if (isThursdayRow(row)) return 1
    return 2
  }
  return [...rows].sort((a, b) => {
    const byRank = rank(a) - rank(b)
    if (byRank) return byRank
    return (a.sortOrder ?? 0) - (b.sortOrder ?? 0)
  })
}

export default function ShrineSchedulePage() {
  const { section, resolveHeaderImage, upcomingPilgrimages, defaultHeaderImage } = useContent()
  const { locale } = useLocale()
  const hero = resolveSectionContent(section, 'shrine.schedule', ['shrine.mass-schedule'])
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMassSchedules({ locale })
      .then(setRows)
      .catch((err) => setError(catalogErrorMessage(err)))
  }, [locale])

  const weeklyRows = useMemo(() => {
    const weekly = (rows || []).filter((row) => !isAnnualRow(row))
    return sortWeekly(ensureThursdayProcession(weekly))
  }, [rows])

  const annualFromSchedule = useMemo(() => (rows || []).filter(isAnnualRow), [rows])

  const annualEvents = useMemo(() => {
    const fromPilgrimages = [...(upcomingPilgrimages || [])]
      .map((item) => ({ item, ...classifyEvent(item) }))
      .filter((entry) => entry.status !== 'none')
      .sort((a, b) => {
        const aStart = occurrenceWindow(a.item)?.start
        const bStart = occurrenceWindow(b.item)?.start
        if (aStart && bStart) return aStart - bStart
        return 0
      })
      .slice(0, 6)
    return fromPilgrimages
  }, [upcomingPilgrimages])

  const guidelines = useMemo(() => normalizeGuidelines(hero.guidelines), [hero.guidelines])
  const heroImage = resolveHeaderImage(hero.heroImage)

  const weeklyGrouped = useMemo(() => {
    const map = new Map()
    weeklyRows.forEach((row) => {
      const key = row.dayLabel || 'Weekly'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(row)
    })
    return Array.from(map.entries())
  }, [weeklyRows])

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={heroBackgroundStyle(
          heroImage,
          'linear-gradient(120deg, rgba(18, 40, 71, 0.92), rgba(26, 54, 93, 0.58))',
        )}
      >
        <div className="container">
          <p className={styles.eyebrow}>The Shrine</p>
          <h1>{hero.title || 'Schedule of the Shrine'}</h1>
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}
        {error ? <p className={styles.empty}>{error}</p> : null}

        <section className={styles.section} aria-labelledby="weekly-heading">
          <div className={styles.sectionHead}>
            <div>
              <p className={styles.sectionEyebrow}>Weekly programmes</p>
              <h2 id="weekly-heading">Mass, prayer & processions</h2>
            </div>
          </div>
          {hero.weeklyIntro ? <RichText html={hero.weeklyIntro} className={styles.sectionIntro} /> : null}

          {!error && !weeklyRows.length ? (
            <p className={styles.empty}>Weekly times will be published here soon.</p>
          ) : null}

          <div className={styles.weeklyGrid}>
            {weeklyGrouped.map(([day, dayRows]) => {
              const featured = dayRows.some((row) => highlightKind(row))
              return (
                <div
                  key={day}
                  className={`${styles.dayCard} ${featured ? styles.dayCardFeatured : ''}`}
                >
                  <div className={styles.dayHead}>
                    <h3>{day}</h3>
                    {/sunday/i.test(day) ? <span className={styles.pill}>Highlight</span> : null}
                    {/thursday/i.test(day) ? <span className={styles.pillAlt}>Procession</span> : null}
                  </div>
                  <div className={styles.dayRows}>
                    {dayRows.map((row) => {
                      const kind = highlightKind(row)
                      const timeLabel = formatMassTime(row)
                      const recurrence = formatRecurrence(row)
                      const meta = [recurrence, row.language, row.location].filter(Boolean)
                      return (
                        <article
                          key={row.id}
                          className={`${styles.slot} ${
                            kind === 'sunday'
                              ? styles.slot_sunday
                              : kind === 'thursday'
                                ? styles.slot_thursday
                                : ''
                          }`}
                        >
                          <div className={styles.slotMain}>
                            <p className={styles.slotTitle}>{row.title}</p>
                            {meta.length ? (
                              <p className={styles.slotMeta}>{meta.join(' · ')}</p>
                            ) : null}
                            {row.notes ? (
                              <p className={styles.slotNotes}>{stripHtml(row.notes)}</p>
                            ) : null}
                          </div>
                          {timeLabel ? <p className={styles.slotTime}>{timeLabel}</p> : null}
                        </article>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        <section className={styles.annualSection} aria-labelledby="annual-heading">
          <div className={styles.annualInner}>
            <div className={styles.sectionHead}>
              <div>
                <p className={styles.sectionEyebrowLight}>Annual celebrations</p>
                <h2 id="annual-heading">Pilgrimage feasts & gatherings</h2>
              </div>
              <Link to="/pilgrimage/calendar" className={styles.calendarLink}>
                Full calendar
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </div>
            {hero.annualIntro ? (
              <RichText html={hero.annualIntro} className={styles.annualIntro} />
            ) : null}

            {annualEvents.length ? (
              <div className={styles.annualGrid}>
                {annualEvents.map(({ item, status }) => {
                  const window = occurrenceWindow(item)
                  const image = resolveHeaderImage(item.image || item.coverImage, defaultHeaderImage)
                  const path = item.path || (item.slug ? `/pilgrimages/${item.slug}` : '/pilgrimage/calendar')
                  return (
                    <Link key={item.id || item.slug} to={path} className={styles.annualCard}>
                      <div
                        className={styles.annualMedia}
                        style={{ backgroundImage: `url(${image})` }}
                        aria-hidden="true"
                      />
                      <div className={styles.annualBody}>
                        {statusLabel(status) ? (
                          <span className={styles.annualBadge}>{statusLabel(status)}</span>
                        ) : (
                          <span className={styles.annualBadgeMuted}>
                            <CalendarDays size={13} aria-hidden="true" />
                            Annual
                          </span>
                        )}
                        <h3>{item.title}</h3>
                        <p className={styles.annualWhen}>
                          {formatItemDates(item) ||
                            (window?.start
                              ? window.start.toLocaleDateString('en-GB', {
                                  day: 'numeric',
                                  month: 'long',
                                  year: 'numeric',
                                })
                              : '')}
                        </p>
                        {cardExcerpt(item) ? (
                          <p className={styles.annualText}>{cardExcerpt(item)}</p>
                        ) : null}
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : annualFromSchedule.length ? (
              <div className={styles.weeklyGrid}>
                {annualFromSchedule.map((row) => (
                  <article key={row.id} className={`${styles.dayCard} ${styles.dayCardFeatured}`}>
                    <div className={styles.dayHead}>
                      <h3>{row.dayLabel || 'Feast Days'}</h3>
                      <span className={styles.pill}>Annual</span>
                    </div>
                    <div className={styles.dayRows}>
                      <div className={`${styles.slot} ${styles.slot_sunday}`}>
                        <div className={styles.slotMain}>
                          <p className={styles.slotTitle}>{row.title}</p>
                          <p className={styles.slotMeta}>
                            {[formatRecurrence(row), row.language, row.location]
                              .filter(Boolean)
                              .join(' · ')}
                          </p>
                          {row.notes ? (
                            <p className={styles.slotNotes}>{stripHtml(row.notes)}</p>
                          ) : null}
                        </div>
                        {formatMassTime(row) ? (
                          <p className={styles.slotTime}>{formatMassTime(row)}</p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <p className={styles.emptyLight}>
                Annual celebrations will appear here as pilgrimage events are published.
              </p>
            )}
          </div>
        </section>

        <section className={styles.guidelines} aria-labelledby="guidelines-heading">
          <div className={styles.guidelinesHead}>
            <p className={styles.sectionEyebrow}>Before you visit</p>
            <h2 id="guidelines-heading">{hero.guidelinesTitle || 'Guidelines of the Shrine'}</h2>
            <p className={styles.guidelinesLead}>
              Please take note of these points so your pilgrimage remains prayerful, safe, and welcoming for
              all.
            </p>
          </div>

          <div className={styles.guidelinesGrid}>
            {guidelines.map((item, index) => {
              const Icon = GUIDELINE_ICONS[item.icon] || AlertTriangle
              return (
                <article
                  key={`${item.title}-${index}`}
                  className={`${styles.guideCard} ${
                    item.tone === 'alert'
                      ? styles.tone_alert
                      : item.tone === 'info'
                        ? styles.tone_info
                        : styles.tone_caution
                  }`}
                >
                  {item.image ? (
                    <img src={item.image} alt="" className={styles.guideImage} />
                  ) : (
                    <span className={styles.guideIcon} aria-hidden="true">
                      <Icon size={22} strokeWidth={1.85} />
                    </span>
                  )}
                  <div>
                    <h3>{item.title}</h3>
                    {item.text ? <p>{item.text}</p> : null}
                  </div>
                </article>
              )
            })}
          </div>

          <div className={styles.guideActions}>
            <Link to="/pilgrimage/calendar" className={styles.btnGhost}>
              View Calendar
            </Link>
            <Link to="/pilgrimage/plan" className={styles.btnPrimary}>
              Plan Your Pilgrimage
            </Link>
            <Link to="/support/get-involved" className={styles.btnGhost}>
              Get involved
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
