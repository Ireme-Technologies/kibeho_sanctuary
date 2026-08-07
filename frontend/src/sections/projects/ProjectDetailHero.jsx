import { Link } from 'react-router-dom'
import { useInView } from '@hooks/useInView'
import styles from './ProjectDetailHero.module.css'

export default function ProjectDetailHero({ project }) {
  const [ref, inView] = useInView(0.3)

  return (
    <section className={styles.hero} aria-label={`${project.title} overview`}>
      <div className={styles.background} aria-hidden="true">
        <img src={project.featuredImage} alt="" className={styles.backgroundImage} />
        <div className={styles.overlay} />
      </div>

      <div ref={ref} className={styles.content}>
        <nav
          className={`${styles.breadcrumb} fade-in-up ${inView ? 'is-visible' : ''}`}
          aria-label="Breadcrumb"
        >
          <Link to="/" className={styles.breadcrumbLink}>Home</Link>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <Link to="/projects" className={styles.breadcrumbLink}>Projects</Link>
          <span className={styles.breadcrumbSep} aria-hidden="true">/</span>
          <span className={styles.breadcrumbCurrent}>{project.title}</span>
        </nav>

        <span
          className={`${styles.categoryBadge} fade-in-up ${inView ? 'is-visible' : ''}`}
          style={{ animationDelay: '0.1s' }}
        >
          {project.category}
        </span>

        <h1
          className={`${styles.title} fade-in-up ${inView ? 'is-visible' : ''}`}
          style={{ animationDelay: '0.2s' }}
        >
          {project.title}
        </h1>

        <p
          className={`${styles.meta} fade-in-up ${inView ? 'is-visible' : ''}`}
          style={{ animationDelay: '0.3s' }}
        >
          {project.location} • {project.year} • {project.status}
        </p>
      </div>
    </section>
  )
}