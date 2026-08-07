import { Link } from 'react-router-dom'
import styles from './ServicesCTA.module.css'
import { useContent } from '@context/ContentContext'
import { servicesCTA as fallbackServicesCTA } from '@data/services'

export default function ServicesCTA() {
  const { section } = useContent()
  const servicesCTA = Object.keys(section('services.cta')).length ? section('services.cta') : fallbackServicesCTA
  return (
    <section className={styles.section} aria-labelledby="services-cta-heading">
      <div className={styles.background} aria-hidden="true">
        <div className={styles.glow} />
      </div>

      <div className={styles.container}>
        <div className={styles.textSide}>
          <h2 id="services-cta-heading" className={styles.heading}>
            {servicesCTA.heading}
          </h2>
          <div className={styles.accentLine} aria-hidden="true" />
          <p className={styles.subline}>{servicesCTA.subline}</p>
        </div>

        <div className={styles.buttonSide}>
          <Link to={servicesCTA.primaryBtn.link} className={styles.btnPrimary}>
            {servicesCTA.primaryBtn.label}
          </Link>
          <Link to={servicesCTA.secondaryBtn.link} className={styles.btnSecondary}>
            {servicesCTA.secondaryBtn.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
