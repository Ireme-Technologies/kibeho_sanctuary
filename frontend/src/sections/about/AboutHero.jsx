import { useInView } from '@hooks/useInView'
import { useContent } from '@context/ContentContext'
import styles from './AboutHero.module.css'

export default function AboutHero() {
  const { section, resolveHeaderImage } = useContent()
  const hero = section('about.hero')
  const [ref, inView] = useInView(0.3)
  const backgroundImage = resolveHeaderImage(hero.backgroundImage, '/images/about/about-hero.jpg')
  const title = hero.title || 'About Us'

  return (
    <section className={styles.hero} aria-label={title}>
      <div className={styles.background} aria-hidden="true">
        <img src={backgroundImage} alt="" className={styles.bgImage} />
        <div className={styles.overlay} />
      </div>

      <div className={styles.contentWrapper}>
        <div ref={ref} className={styles.content}>
          <h1
            className={`${styles.headline} fade-in-up ${inView ? 'is-visible' : ''}`}
          >
            {title}
          </h1>
          <div
            className={`${styles.accentLine} ${inView ? styles.accentLineVisible : ''}`}
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  )
}
