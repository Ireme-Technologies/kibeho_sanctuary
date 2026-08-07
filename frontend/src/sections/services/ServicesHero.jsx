import { useContent } from '@context/ContentContext'
import styles from './ServicesHero.module.css'

export default function ServicesHero() {
  const { section, resolveHeaderImage } = useContent()
  const hero = section('services.hero')
  const backgroundImage = resolveHeaderImage(
    hero.backgroundImage,
    '/images/services/architectural-design.JPG'
  )
  const title = hero.title || 'Services'

  return (
    <section className={styles.hero} aria-label={title}>
      <div className={styles.background} aria-hidden="true">
        <img src={backgroundImage} alt="" className={styles.bgImage} />
        <div className={styles.overlay} />
      </div>

      <div className={styles.contentWrapper}>
        <div className={styles.content}>
          <h1 className={`${styles.headline} ${styles.fadeInUp}`}>
            {title}
          </h1>
          <div className={`${styles.accentLine} ${styles.lineGrow}`} aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}
