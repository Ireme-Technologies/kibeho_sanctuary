import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useContent } from '@context/ContentContext'
import { useInView } from '../../hooks/useInView'
import styles from './ServicesList.module.css'

function shortText(text = '', max = 120) {
  const clean = String(text).trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max).replace(/\s+\S*$/, '')}…`
}

function ServiceCard({ service, index, defaultImage }) {
  const [ref, inView] = useInView(0.15)

  return (
    <article
      ref={ref}
      className={`${styles.card} ${inView ? styles.visible : ''}`}
      style={{ '--delay': `${Math.min(index * 0.08, 0.24)}s` }}
    >
      <Link to={service.link} className={styles.cardLink} aria-label={`Learn more about ${service.title}`}>
        <div className={styles.media}>
          <img src={service.image || defaultImage} alt="" aria-hidden="true" className={styles.image} loading="lazy" />
          <span className={styles.numberBadge}>{String(index + 1).padStart(2, '0')}</span>
        </div>

        <div className={styles.titleBar}>
          <h2 className={styles.title}>{service.title}</h2>
        </div>

        <div className={styles.hoverPanel}>
          <p className={styles.hoverText}>{shortText(service.description)}</p>
          <span className={styles.viewMore}>
            View more <ArrowRight size={15} />
          </span>
        </div>
      </Link>
    </article>
  )
}

export default function ServicesList() {
  const { services, defaultHeaderImage } = useContent()
  return (
    <section className={styles.section} aria-label="Our Services">
      <div className={`container ${styles.grid}`}>
        {services.map((service, index) => (
          <ServiceCard key={service.id} service={service} index={index} defaultImage={defaultHeaderImage} />
        ))}
      </div>
    </section>
  )
}
