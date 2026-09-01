import { useEffect, useMemo, useState } from 'react'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchMassSchedules } from '@api/cms'
import { formatMassTime, formatRecurrence } from '@utils/eventTime'
import RichText from '@components/ui/RichText'
import { resolveSectionContent } from '@data/pages/mergePageContent'
import styles from './CatalogPage.module.css'

const stripHtml = (html) =>
  String(html || '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim()

export default function ShrineSchedulePage() {
  const { section, resolveHeaderImage } = useContent()
  const { locale } = useLocale()
  const hero = resolveSectionContent(section, 'shrine.schedule', ['shrine.mass-schedule'])
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchMassSchedules({ locale })
      .then(setRows)
      .catch((err) => setError(err.message))
  }, [locale])

  const grouped = useMemo(() => {
    const map = new Map()
    ;(rows || []).forEach((row) => {
      const key = row.dayLabel || 'Schedule'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(row)
    })
    return Array.from(map.entries())
  }, [rows])

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
          <h1>{hero.title || 'Mass Schedule'}</h1>
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}

        {error ? <p className={styles.empty}>{error}</p> : null}

        {!error && !rows.length ? (
          <p className={styles.empty}>Mass times will be published here soon.</p>
        ) : null}

        <div className={styles.schedule}>
          {grouped.map(([day, dayRows]) => (
            <section key={day}>
              {grouped.length > 1 && day !== 'Schedule' ? (
                <h2 className={styles.day}>{day}</h2>
              ) : null}
              {dayRows.map((row) => {
                const timeLabel = formatMassTime(row)
                const recurrence = formatRecurrence(row)
                const meta = [recurrence, row.language, row.location].filter(Boolean).join(' · ')

                return (
                  <div key={row.id} className={styles.scheduleRow}>
                    <p className={styles.day}>{row.dayLabel || day}</p>
                    <div>
                      <p className={styles.title}>{row.title}</p>
                      {meta ? <p className={styles.meta}>{meta}</p> : null}
                      {row.notes ? (
                        <p className={styles.notes}>{stripHtml(row.notes)}</p>
                      ) : null}
                    </div>
                    {timeLabel ? <p className={styles.time}>{timeLabel}</p> : null}
                  </div>
                )
              })}
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
