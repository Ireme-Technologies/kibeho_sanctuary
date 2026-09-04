import { useInView } from '@hooks/useInView'
import styles from './ContactHero.module.css'
import { useContent } from '@context/ContentContext'

export default function ContactHero() {
  const { contactHero, section, resolveHeaderImage } = useContent()
  const pageHero = section('contact.hero')
  const [ref, inView] = useInView(0.3)
  const title = pageHero.title || contactHero.headline || "Let's Talk"
  const backgroundImage = resolveHeaderImage(
    pageHero.backgroundImage,
    contactHero['hero-bg-image']
  )

  return (
    <section className={styles.hero} aria-label={title}>
      <div className={styles.background} aria-hidden="true">
        {backgroundImage ? (
          <img src={backgroundImage} alt="" className={styles.bgImage} />
        ) : null}
        <div className={styles.overlay} />
      </div>

      <div ref={ref} className={styles.contentWrapper}>
        <div className={styles.content}>
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
