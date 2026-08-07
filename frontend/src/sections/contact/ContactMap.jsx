import { ArrowRight } from 'lucide-react'
import { useInView } from '@hooks/useInView'
import styles from './ContactMap.module.css'
import { useContent } from '@context/ContentContext'

export default function ContactMap() {
  const { contactMap } = useContent()
  const [ref, inView] = useInView(0.3)

  return (
    <section className={styles.section} aria-label={contactMap.label}>
      <div className={styles.container}>
        <div ref={ref} className={`${styles.card} fade-in-up ${inView ? 'is-visible' : ''}`}>
          <p className={styles.title}>{contactMap.title}</p>
          <p className={styles.subtitle}>{contactMap.subtitle}</p>

          <div className={styles.mapWrapper}>
            <iframe
              className={styles.map}
              title={contactMap.label}
              src={contactMap.embedSrc}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>

          <a
            href={contactMap.directionsLink}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.directionsLink}
          >
            {contactMap.directionsLabel}
            <ArrowRight size={13} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}