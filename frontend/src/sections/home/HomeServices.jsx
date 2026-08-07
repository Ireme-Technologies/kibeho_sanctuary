import { Link } from 'react-router-dom'
import { Compass, Building2, Wrench, ClipboardList, HardHat, Sofa, ArrowRight } from 'lucide-react'
import { useInView } from '@hooks/useInView'
import styles from './HomeServices.module.css'
import { useContent } from '@context/ContentContext'
import { servicesHeading as fbHeading, viewAllServicesCTA as fbCTA } from '@data/home/HomeServices'

const icons = {
  architecture: Compass,
  structure: Building2,
  mep: Wrench,
  management: ClipboardList,
  construction: HardHat,
  interior: Sofa,
}

function shortText(text = '', max = 110) {
  const clean = String(text).trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max).replace(/\s+\S*$/, '')}…`
}

function ServiceCard({ service, index, inView }) {
  const Icon = icons[service.iconKey]

  return (
    <Link
      to={service.link}
      className={`${styles.card} fade-in-up ${inView ? 'is-visible' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
      aria-label={`Learn more about ${service.title}`}
    >
      <div className={styles.media}>
        <img
          className={styles.image}
          src={service.image}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      </div>

      <div className={styles.titleBar}>
        <Icon size={18} strokeWidth={1.75} aria-hidden="true" />
        <h3 className={styles.title}>{service.title}</h3>
      </div>

      <div className={styles.hoverPanel}>
        <p className={styles.hoverText}>{shortText(service.description)}</p>
        <span className={styles.viewMore}>
          View more <ArrowRight size={15} />
        </span>
      </div>
    </Link>
  )
}

export default function HomeServices() {
  const { services, section } = useContent()
  const homeServices = section('home.services')
  const servicesHeading = homeServices.heading || fbHeading
  const viewAllServicesCTA = homeServices.viewAllCTA || fbCTA
  const [sectionRef, inView] = useInView(0.15)

  return (
    <section className={styles.section} aria-labelledby="services-heading">
      <div className="container">
        <div className={`${styles.header} fade-in-up ${inView ? 'is-visible' : ''}`}>
          <h2 id="services-heading" className={styles.heading}>
            {servicesHeading}
          </h2>
        </div>

        <div ref={sectionRef} className={styles.grid}>
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} inView={inView} />
          ))}
        </div>

        <div className={styles.ctaWrapper}>
          <Link to={viewAllServicesCTA.link} className={styles.viewAllBtn}>
            {viewAllServicesCTA.label}
          </Link>
        </div>
      </div>
    </section>
  )
}
