import { Link } from 'react-router-dom'
import { useInView } from '@hooks/useInView'
import { useSacredPlaces } from '@hooks/useSacredPlaces'
import { useContent } from '@context/ContentContext'
import {
  homeActivities as fallbackMeta,
  shrineHighlights as fallbackHighlights,
} from '@data/home/sanctuaryHome'
import { mergePageContent } from '@data/pages/mergePageContent'
import { placeCardExcerpt } from '@utils/text'
import { useLocale } from '@context/LocaleContext'
import styles from './HomeActivities.module.css'

export default function HomeActivities() {
  const { section, defaultHeaderImage } = useContent()
  const { locale, t } = useLocale()
  const { items: places, error, loaded } = useSacredPlaces('main_place', locale)
  const meta = mergePageContent(
    {
      heading: fallbackMeta.heading,
      subline: fallbackMeta.subline,
      primaryCta: fallbackMeta.primaryCta,
      secondaryCta: fallbackMeta.secondaryCta,
      cardLinkLabel: t('learnMore'),
    },
    section('home.activities', {}),
  )
  const items = places.length ? places : !loaded || error ? fallbackHighlights : []
  const buttons = (
    Array.isArray(meta.buttons) && meta.buttons.length
      ? meta.buttons
      : [meta.primaryCta, meta.secondaryCta]
  ).filter((item) => item && (item.label || item.path))
  const [ref, inView] = useInView(0.12)

  if (!items.length) return null

  return (
    <section className={styles.section} aria-labelledby="home-activities-heading" ref={ref}>
      <div className="container">
        <div className={`${styles.intro} ${inView ? styles.visible : ''}`}>
          <h2 id="home-activities-heading" className={styles.heading}>
            {meta.heading || meta.title}
          </h2>
          <span className={styles.divider} aria-hidden="true" />
        </div>

        <div className={`${styles.grid} ${inView ? styles.visible : ''}`}>
          {items.map((item, index) => {
            const title = item.title || item.name
            const summary = placeCardExcerpt(item)
            const path = item.path || (item.slug ? `/shrine/places/${item.slug}` : '/shrine/places')
            return (
              <Link
                key={item.id || item.slug || path}
                to={path}
                className={styles.card}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <img src={item.coverImage || item.image || defaultHeaderImage} alt="" aria-hidden="true" />
                <span className={styles.overlay} aria-hidden="true" />
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{title}</h3>
                  <div className={styles.hoverPanel}>
                    {summary ? <p className={styles.cardDesc}>{summary}</p> : null}
                    <span className={styles.cardCta}>{meta.cardLinkLabel || t('learnMore')}</span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className={`${styles.actions} ${inView ? styles.visible : ''}`}>
          {buttons.map((item) => (
            <Link
              key={`${item.path}-${item.label}`}
              to={item.path || '/shrine'}
              className={styles.btn}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
