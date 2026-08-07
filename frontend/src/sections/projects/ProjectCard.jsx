import { Link } from 'react-router-dom'
import { useInView } from '@hooks/useInView'
import styles from './ProjectCard.module.css'

export default function ProjectCard({ project, index = 0 }) {
  const { title, category, coverImage, slug } = project
  const [ref, inView] = useInView(0.15)

  return (
    <article
      ref={ref}
      className={`${styles.card} fade-in-up ${inView ? 'is-visible' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <Link to={`/projects/${slug}`} className={styles.link} aria-label={`View ${title}`}>
        <div className={styles.info}>
          <div className={styles.infoInner}>
            <div className={styles.texts}>
              <h3 className={styles.title}>{title}</h3>
              <span className={styles.category}>{category}</span>
            </div>

            <span className={styles.cta} aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 12h14M13 5l7 7-7 7"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>

        <div className={styles.imageFrame}>
          <img src={coverImage} alt={title} className={styles.image} loading="lazy" />
        </div>
      </Link>
    </article>
  )
}