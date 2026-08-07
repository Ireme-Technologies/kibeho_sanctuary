import { Link } from 'react-router-dom'
import { useInView } from '@hooks/useInView'
import styles from './AboutCTA.module.css'
import { useContent } from '@context/ContentContext'
import { aboutCTA as fb } from '@data/about'

export default function AboutCTA() {
  const { section } = useContent()
  const aboutCTA = Object.keys(section('about.cta')).length ? section('about.cta') : fb
  const [ref, inView] = useInView(0.3)

  return (
    <section className={styles.section} aria-labelledby="about-cta-heading">

      {/* Background image + dark gold-tinted overlay */}
      <div className={styles.background} aria-hidden="true">
        <img
          src={aboutCTA.backgroundImage}
          alt=""
          className={styles.bgImage}
        />
        <div className={styles.overlay} />
      </div>

      {/* Faint diagonal gold accents, layered over the image */}
      <div className={styles.accentTopRight} aria-hidden="true" />
      <div className={styles.accentBottomLeft} aria-hidden="true" />

      {/* Content */}
      <div ref={ref} className={styles.container}>

        {/* Left — heading + subline */}
        <div
          className={`${styles.textSide} fade-in-up ${inView ? 'is-visible' : ''}`}
        >
          <h2 id="about-cta-heading" className={styles.heading}>
            {aboutCTA.heading}
          </h2>
          <div className={styles.accentLine} aria-hidden="true" />
          <p className={styles.subline}>{aboutCTA.subline}</p>
        </div>

        {/* Right — buttons */}
        <div
          className={`${styles.buttonSide} fade-in-up ${inView ? 'is-visible' : ''}`}
          style={{ animationDelay: '0.15s' }}
        >
          <Link to={aboutCTA.primaryBtn.link} className={styles.btnPrimary}>
            {aboutCTA.primaryBtn.label}
          </Link>
          <Link to={aboutCTA.secondaryBtn.link} className={styles.btnSecondary}>
            {aboutCTA.secondaryBtn.label}
          </Link>
        </div>

      </div>
    </section>
  )
}