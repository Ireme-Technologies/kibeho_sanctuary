import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, BookOpen, BadgeCheck, Church, Users, Star } from 'lucide-react'
import { whyVisit } from '@data/home/sanctuaryHome'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { useInView } from '@hooks/useInView'
import { formatEventWhen, formatRecurrence } from '@utils/eventTime'
import styles from './HomePilgrimStrip.module.css'

const whyIcons = {
  message: BookOpen,
  recognised: BadgeCheck,
  liturgy: Church,
  pilgrimage: Users,
}

const ACCOMMODATION_CATEGORIES = ['Hotel', 'Guest House', 'Apartment']

function Stars({ rating }) {
  if (rating == null || Number.isNaN(Number(rating))) return null
  const value = Math.max(0, Math.min(5, Number(rating)))
  const full = Math.floor(value)
  const hasHalf = value - full >= 0.25 && value - full < 0.75
  const roundedUp = value - full >= 0.75

  return (
    <div className={styles.stars} aria-label={`${value} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < full || (i === full && roundedUp) || (i === full && hasHalf)
        return (
          <Star
            key={i}
            size={15}
            className={filled ? styles.starFilled : styles.starEmpty}
            fill={i < full || (i === full && roundedUp) ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        )
      })}
      <span className={styles.ratingValue}>{value.toFixed(1)}</span>
    </div>
  )
}

export default function HomePilgrimStrip() {
  const { section, upcomingPilgrimages, projects } = useContent()
  const { t } = useLocale()
  const pilgrimages = (upcomingPilgrimages || []).slice(0, 4)
  const reasons = section('home.whyVisit', {}).items || whyVisit
  const [ref, inView] = useInView(0.12)
  const [active, setActive] = useState(0)

  const accommodations = useMemo(
    () =>
      (projects || []).filter((item) =>
        ACCOMMODATION_CATEGORIES.some(
          (cat) => String(item.category || '').toLowerCase() === cat.toLowerCase()
        )
      ),
    [projects]
  )

  useEffect(() => {
    setActive(0)
  }, [accommodations.length])

  const goTo = (index) => {
    if (!accommodations.length) return
    const next = (index + accommodations.length) % accommodations.length
    setActive(next)
  }

  const current = accommodations[active]

  return (
    <>
      <section className={styles.section} ref={ref}>
        <div className="container">
          <div className={styles.head}>
            <div>
              <p className={styles.eyebrow}>{t('pilgrimageCalendar')}</p>
              <h2>{t('upcomingPilgrimages')}</h2>
            </div>
            <Link to="/pilgrimage/calendar" className={styles.more}>
              {t('viewCalendar')} →
            </Link>
          </div>
          <div className={`${styles.pilgrimGrid} ${inView ? styles.visible : ''}`}>
            {pilgrimages.map((item, index) => (
              <article
                key={item.id || item.slug}
                className={styles.pill}
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <span className={styles.meta}>
                  {[formatEventWhen(item), formatRecurrence(item), item.meta]
                    .filter(Boolean)
                    .join(' · ') || 'Upcoming'}
                </span>
                <h3>{item.title}</h3>
                <p>
                  {String(item.shortDescription || item.text || '')
                    .replace(/<[^>]+>/g, '')
                    .trim()}
                </p>
                <Link
                  to={item.path || `/pilgrimages/${item.slug}`}
                  className={styles.viewMore}
                >
                  {t('viewMore')}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={styles.visitSection}>
        <div className={`container ${styles.visitLayout}`}>
          <div className={styles.whyPanel}>
            <p className={styles.eyebrow}>Why Kibeho?</p>
            <h2>Why make a pilgrimage here?</h2>
            <div className={styles.whyGrid}>
              {reasons.map((item) => {
                const Icon = whyIcons[item.id] || Church
                return (
                  <article key={item.id || item.title}>
                    <span className={styles.whyIcon} aria-hidden="true">
                      <Icon size={22} strokeWidth={1.7} />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                )
              })}
            </div>
            <Link to="/pilgrimage/why-kibeho" className={styles.whyMore}>
              Read more →
            </Link>
          </div>

          <div className={styles.stayPanel}>
            <div className={styles.stayHead}>
              <div>
                <p className={styles.eyebrow}>{t('pilgrimage')}</p>
                <h2>{t('accommodation')}</h2>
              </div>
              <Link to="/pilgrimage/accommodation" className={styles.more}>
                {t('viewAll')} →
              </Link>
            </div>

            {current ? (
              <div className={styles.carousel}>
                <article className={styles.stayCard}>
                  <div className={styles.stayImage}>
                    <img
                      src={current.coverImage || current.featuredImage || '/images/sanctuary/welcome.jpg'}
                      alt=""
                    />
                  </div>
                  <div className={styles.stayBody}>
                    <span className={styles.stayCategory}>{current.category}</span>
                    <h3>{current.title}</h3>
                    <Stars rating={current.rating} />
                    {(() => {
                      const bookTo =
                        current.bookingUrl ||
                        `/contact?topic=accommodation&facility=${encodeURIComponent(current.slug || '')}`
                      const isExternal = /^https?:\/\//i.test(bookTo)
                      return isExternal ? (
                        <a href={bookTo} className={styles.bookBtn} target="_blank" rel="noopener noreferrer">
                          {t('bookNow')}
                        </a>
                      ) : (
                        <Link to={bookTo} className={styles.bookBtn}>
                          {t('bookNow')}
                        </Link>
                      )
                    })()}
                  </div>
                </article>

                {accommodations.length > 1 ? (
                  <div className={styles.carouselControls}>
                    <button
                      type="button"
                      className={styles.navBtn}
                      onClick={() => goTo(active - 1)}
                      aria-label="Previous accommodation"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className={styles.dots} role="tablist" aria-label="Accommodation slides">
                      {accommodations.map((item, index) => (
                        <button
                          key={item.id || item.slug}
                          type="button"
                          role="tab"
                          aria-selected={index === active}
                          aria-label={`Show ${item.title}`}
                          className={`${styles.dot} ${index === active ? styles.dotActive : ''}`}
                          onClick={() => goTo(index)}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      className={styles.navBtn}
                      onClick={() => goTo(active + 1)}
                      aria-label="Next accommodation"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <p className={styles.emptyStay}>
                Accommodation listings will appear here once published under Accommodations.
              </p>
            )}
          </div>
        </div>
      </section>
    </>
  )
}
