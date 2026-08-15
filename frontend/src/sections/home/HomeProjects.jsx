import { Link } from 'react-router-dom'
import { MapPin, ArrowRight } from 'lucide-react'
import { useInView } from '@hooks/useInView'
import { useContent } from '@context/ContentContext'
import { cardExcerpt } from '@utils/text'
import {
  projectsHeadingStart as fbStart,
  projectsHeadingHighlight as fbHighlight,
  projectsSubtext as fbSubtext,
  viewAllProjectsCTA as fbCTA,
} from '@data/home/HomeProjects'
import styles from './HomeProjects.module.css'

function ProjectCard({ project, isHero, index, inView }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`${styles.card} ${isHero ? styles.heroCard : ''} fade-in-up ${
        inView ? 'is-visible' : ''
      }`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={styles.imageArea}>
        <img
          className={styles.image}
          src={isHero ? project.featuredImage : project.coverImage}
          alt=""
          aria-hidden="true"
        />
        <span className={styles.categoryBadge}>{project.category}</span>
        <span className={styles.yearBadge}>{project.year}</span>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <div className={styles.cardMeta}>
          <MapPin size={13} className={styles.metaIcon} />
          <span className={styles.cardLocation}>{project.location}</span>
        </div>
        {cardExcerpt(project) ? (
          <p className={styles.cardDescription}>{cardExcerpt(project)}</p>
        ) : null}
        <span className={styles.cardCta}>
          View Project
          <span className={styles.ctaArrow}>
            <ArrowRight size={12} />
          </span>
        </span>
      </div>
    </Link>
  )
}

export default function HomeProjects() {
  const { projects, section } = useContent()
  const homeProjects = section('home.projects')
  const projectsHeadingStart = homeProjects.headingStart || fbStart
  const projectsHeadingHighlight = homeProjects.headingHighlight || fbHighlight
  const projectsSubtext = homeProjects.subtext || fbSubtext
  const viewAllProjectsCTA = homeProjects.viewAllCTA || fbCTA
  const [sectionRef, inView] = useInView(0.1)

  const featuredProject = projects.find((p) => p.featured)
  const gridProjects = projects.filter((p) => !p.featured).slice(0, 5)

  return (
    <section className={styles.section} aria-labelledby="projects-heading">
      <div className="container">
        <div className={`${styles.header} fade-in-up ${inView ? 'is-visible' : ''}`}>
          <h2 id="projects-heading" className={styles.heading}>
            {projectsHeadingStart} <span>{projectsHeadingHighlight}</span>
          </h2>
          <p className={styles.subtext}>{projectsSubtext}</p>
        </div>

        <div ref={sectionRef} className={styles.grid}>
          {featuredProject && (
            <div className={styles.heroWrapper}>
              <ProjectCard project={featuredProject} isHero index={0} inView={inView} />
            </div>
          )}

          <div className={styles.smallGrid}>
            {gridProjects.map((project, i) => (
              <ProjectCard
                key={project.id}
                project={project}
                isHero={false}
                index={i + 1}
                inView={inView}
              />
            ))}
          </div>
        </div>

        <div className={styles.footer}>
          <Link to={viewAllProjectsCTA.link} className={styles.viewAllBtn}>
            {viewAllProjectsCTA.label}
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}