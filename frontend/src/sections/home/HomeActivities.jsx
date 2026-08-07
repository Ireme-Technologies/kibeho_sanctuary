import { Link } from 'react-router-dom'
import { useInView } from '@hooks/useInView'
import { useContent } from '@context/ContentContext'
import {
  homeActivities as fallbackMeta,
  shrineHighlights as fallbackHighlights,
} from '@data/home/sanctuaryHome'
import styles from './HomeActivities.module.css'

export default function HomeActivities() {
  const { section } = useContent()
  const meta = { ...fallbackMeta, ...section('home.activities', {}) }
  const items = meta.highlights?.length ? meta.highlights : fallbackHighlights
  const [ref, inView] = useInView(0.12)

  if (!items.length) return null

  return (
    <section className={styles.section} aria-labelledby="home-activities-heading" ref={ref}>
      <div className="container">
        <div className={`${styles.intro} ${inView ? styles.visible : ''}`}>
          <h2 id="home-activities-heading" className={styles.heading}>
            {meta.heading}
          </h2>
          <p className={styles.subline}>{meta.subline}</p>
          <span className={styles.divider} aria-hidden="true" />
        </div>

        <div className={`${styles.grid} ${inView ? styles.visible : ''}`}>
          {items.map((item, index) => (
            <article
              key={item.id || item.slug || item.path}
              className={styles.card}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <img src={item.image || '/images/sanctuary/hero.jpg'} alt="" aria-hidden="true" />
              <span className={styles.overlay} aria-hidden="true" />
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <div className={styles.hoverPanel}>
                  {item.shortDescription ? (
                    <p className={styles.cardDesc}>{item.shortDescription}</p>
                  ) : null}
                  <Link to={item.path} className={styles.cardCta}>
                    Learn more
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={`${styles.actions} ${inView ? styles.visible : ''}`}>
          <Link to={meta.primaryCta?.path || '/shrine'} className={styles.btn}>
            {meta.primaryCta?.label || 'Explore the Shrine'}
          </Link>
          <Link to={meta.secondaryCta?.path || '/shrine/mass-schedule'} className={styles.btn}>
            {meta.secondaryCta?.label || 'Mass Schedule'}
          </Link>
        </div>
      </div>
    </section>
  )
}
