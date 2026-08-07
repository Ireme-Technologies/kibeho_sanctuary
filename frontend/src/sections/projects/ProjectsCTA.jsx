import { Link } from 'react-router-dom'
import { useInView } from '@hooks/useInView'
import styles from './ProjectsCTA.module.css'
import { useContent } from '@context/ContentContext'
import { projectsCTA as fallbackProjectsCTA } from '@data/projects'

export default function ProjectsCTA() {
  const { section } = useContent()
  const projectsCTA = Object.keys(section('projects.cta')).length ? section('projects.cta') : fallbackProjectsCTA
  const [ref, inView] = useInView(0.3)

  return (
    <section className={styles.section} aria-labelledby="projects-cta-heading">

      {/* Faint diagonal gold accents */}
      <div className={styles.accentTopRight} aria-hidden="true" />
      <div className={styles.accentBottomLeft} aria-hidden="true" />

      <div ref={ref} className={styles.container}>

        {/* Left — heading + subline */}
        <div className={`${styles.textSide} fade-in-up ${inView ? 'is-visible' : ''}`}>
          <h2 id="projects-cta-heading" className={styles.heading}>
            {projectsCTA.heading}
          </h2>
          <div className={styles.accentLine} aria-hidden="true" />
          <p className={styles.subline}>{projectsCTA.subline}</p>
        </div>

        {/* Right — buttons */}
        <div
          className={`${styles.buttonSide} fade-in-up ${inView ? 'is-visible' : ''}`}
          style={{ animationDelay: '0.15s' }}
        >
          <Link to={projectsCTA.primaryBtn.link} className={styles.btnPrimary}>
            {projectsCTA.primaryBtn.label}
          </Link>
          <Link to={projectsCTA.secondaryBtn.link} className={styles.btnSecondary}>
            {projectsCTA.secondaryBtn.label}
          </Link>
        </div>

      </div>
    </section>
  )
}