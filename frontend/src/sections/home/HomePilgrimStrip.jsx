import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  BedDouble,
  BookOpen,
  Church,
  HandHeart,
  MapPin,
  Users,
} from 'lucide-react'
import { whyVisit, accommodationHelp as fallbackAccommodationHelp } from '@data/home/sanctuaryHome'
import { mergePageContent } from '@data/pages/mergePageContent'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { useInView } from '@hooks/useInView'
import { formatEventWhen, formatRecurrence } from '@utils/eventTime'
import { classifyEvent, pickSiteOccasion, statusLabel } from '@utils/occasion'
import { cardExcerpt } from '@utils/text'
import RichText from '@components/ui/RichText'
import styles from './HomePilgrimStrip.module.css'

const whyIcons = {
  message: BookOpen,
  recognised: BadgeCheck,
  liturgy: Church,
  pilgrimage: Users,
}

const helpIcons = {
  trusted: BedDouble,
  guidance: MapPin,
  booking: HandHeart,
}

export default function HomePilgrimStrip() {
  const { section, upcomingPilgrimages } = useContent()
  const { t } = useLocale()
  const occasion = pickSiteOccasion(upcomingPilgrimages)
  const pilgrimages = useMemo(() => {
    const list = [...(upcomingPilgrimages || [])]
    const featuredSlug = occasion?.item?.slug
    return list
      .sort((a, b) => {
        if (featuredSlug && a.slug === featuredSlug) return -1
        if (featuredSlug && b.slug === featuredSlug) return 1
        return (a.startsOn || '').localeCompare(b.startsOn || '')
      })
      .slice(0, 4)
  }, [upcomingPilgrimages, occasion?.item?.slug])
  const why = mergePageContent(
    {
      eyebrow: 'Why Kibeho?',
      heading: 'Why make a pilgrimage here?',
      items: whyVisit,
      cta: { primary: { label: 'Read more', path: '/pilgrimage/why-kibeho' } },
    },
    section('home.whyVisit', {}),
  )
  const stay = mergePageContent(
    {
      eyebrow: fallbackAccommodationHelp.eyebrow,
      heading: fallbackAccommodationHelp.heading,
      intro: fallbackAccommodationHelp.intro,
      items: fallbackAccommodationHelp.items,
      cta: { primary: fallbackAccommodationHelp.cta },
      buttons: [fallbackAccommodationHelp.cta],
    },
    section('home.accommodationHelp', {}),
  )
  const reasons = why.items?.length ? why.items : whyVisit
  const helpItems = stay.items?.length ? stay.items : fallbackAccommodationHelp.items
  const whyCta = why.buttons?.[0] || why.cta?.primary || { label: 'Read more', path: '/pilgrimage/why-kibeho' }
  const stayCta =
    stay.buttons?.[0] ||
    stay.cta?.primary ||
    fallbackAccommodationHelp.cta
  const [ref, inView] = useInView(0.12)
  const [visitRef, visitInView] = useInView(0.12)

  return (
    <>
      <section className={styles.section} ref={ref}>
        <div className="container">
          <div className={styles.head}>
            <div>
              <p className={styles.eyebrow}>{t('home.calendarEyebrow')}</p>
              <h2>{t('upcomingPilgrimages')}</h2>
            </div>
            <Link to="/pilgrimage/calendar" className={styles.more}>
              {t('viewCalendar')} →
            </Link>
          </div>
          <div className={`${styles.pilgrimGrid} ${inView ? styles.visible : ''}`}>
            {pilgrimages.map((item, index) => {
              const state = classifyEvent(item)
              const badge = statusLabel(state.status)
              return (
                <article
                  key={item.id || item.slug}
                  className={`${styles.pill} ${state.status === 'live' ? styles.pillLive : ''}`}
                  style={{ animationDelay: `${index * 0.08}s` }}
                >
                  <span className={styles.meta}>
                    {[badge, formatEventWhen(item), formatRecurrence(item), item.meta]
                      .filter(Boolean)
                      .join(' · ') || 'Upcoming'}
                  </span>
                  <h3>{item.title}</h3>
                  <p>{cardExcerpt(item)}</p>
                  <Link
                    to={item.path || `/pilgrimages/${item.slug}`}
                    className={styles.viewMore}
                  >
                    {t('viewMore')}
                  </Link>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className={styles.visitSection} ref={visitRef}>
        <div className={`container ${styles.visitLayout} ${visitInView ? styles.visitVisible : ''}`}>
          <div className={styles.whyPanel}>
            <p className={styles.eyebrow}>{why.eyebrow || 'Why Kibeho?'}</p>
            <h2>{why.heading || why.title || 'Why make a pilgrimage here?'}</h2>
            <span className={styles.panelRule} aria-hidden="true" />
            <div className={styles.whyGrid}>
              {reasons.map((item, index) => {
                const Icon = whyIcons[item.id] || Church
                return (
                  <article key={item.id || item.title} style={{ animationDelay: `${index * 0.06}s` }}>
                    <span className={styles.whyIcon} aria-hidden="true">
                      <Icon size={22} strokeWidth={1.7} />
                    </span>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                )
              })}
            </div>
            <Link to={whyCta.path || '/pilgrimage/why-kibeho'} className={styles.whyMore}>
              {whyCta.label || 'Read more'} →
            </Link>
          </div>

          <div className={styles.stayPanel}>
            <div className={styles.stayCard}>
              <p className={styles.eyebrow}>{stay.eyebrow || t('pilgrimage')}</p>
              <h2>{stay.heading || stay.title || t('accommodation')}</h2>
              <span className={styles.panelRuleLight} aria-hidden="true" />

              {stay.intro ? (
                <div className={styles.stayNotice}>
                  <RichText html={stay.intro} className={styles.stayNoticeText} />
                </div>
              ) : null}

              <ul className={styles.helpList}>
                {helpItems.map((item, index) => {
                  const Icon = helpIcons[item.id] || BedDouble
                  return (
                    <li key={item.id || item.title} style={{ animationDelay: `${index * 0.07}s` }}>
                      <span className={styles.helpIcon} aria-hidden="true">
                        <Icon size={20} strokeWidth={1.75} />
                      </span>
                      <div>
                        <h3>{item.title}</h3>
                        <p>{item.text}</p>
                      </div>
                    </li>
                  )
                })}
              </ul>

              <Link to={stayCta.path || '/pilgrimage/accommodation'} className={styles.stayBtn}>
                {stayCta.label || 'View our partnering accommodations'}
                <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
