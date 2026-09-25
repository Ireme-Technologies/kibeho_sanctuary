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
} from 'lucide-react'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchMassSchedules } from '@api/cms'
import { catalogErrorMessage } from '@api/client'
import { formatMassTime, formatRecurrence } from '@utils/eventTime'
import RichText from '@components/ui/RichText'
import { resolveSectionContent } from '@data/pages/mergePageContent'
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
  const { section, resolveHeaderImage } = useContent()
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
          <h1 id="page-title">{hero.title || 'Weekly programs'}</h1>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}
        {error ? <p className={styles.empty}>{error}</p> : null}

        <section className={styles.section} aria-labelledby="page-title">
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
                <h2 id="annual-heading">Annual Celebrations</h2>
              </div>
              <Link to="/pilgrimage/annual-celebrations" className={styles.calendarLink}>
                Open the year
                <ChevronRight size={16} aria-hidden="true" />
              </Link>
            </div>
            <p className={styles.annualIntro}>
              Feast days and pilgrimages each have their own page, with registration and the photos, articles, and reports of that celebration.
            </p>
          </div>
        </section>

        <section className={styles.guidelines} aria-labelledby="guidelines-heading">
          <div className={styles.guidelinesHead}>
            <h2 id="guidelines-heading">{hero.guidelinesTitle || 'Guidelines of the Shrine'}</h2>
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
            <Link to="/pilgrimage/annual-celebrations" className={styles.btnGhost}>
              Annual Celebrations
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
