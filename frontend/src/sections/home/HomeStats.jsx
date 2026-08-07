import { Clock, Building2, Users, MapPin } from 'lucide-react'
import { useInView } from '@hooks/useInView'
import { useCountUp } from '@hooks/useCountUp'
import styles from './HomeStats.module.css'
import { useContent } from '@context/ContentContext'
import { statsHeading as fbHeading, statsSupportingText as fbSupport, stats as fbStats } from '@data/home/HomeStats'

const icons = {
  years: Clock,
  projects: Building2,
  clients: Users,
  location: MapPin,
}

function StatCard({ stat, start, index }) {
  const count = useCountUp(stat.value ?? 0, 2000, start)
  const displayValue = stat.value === null ? stat.text : count
  const Icon = icons[stat.iconKey]

  return (
    <div
      className={`${styles.card} fade-in-up ${start ? 'is-visible' : ''}`}
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <div className={styles.iconWrapper} aria-hidden="true">
        <Icon size={28} strokeWidth={1.75} />
      </div>
      <div className={styles.accentLine} />
      <p className={styles.statValue}>
        {displayValue}
        {stat.suffix && <span className={styles.suffix}>{stat.suffix}</span>}
      </p>
      <p className={styles.statLabel}>{stat.label}</p>
      <p className={styles.statDescription}>{stat.description}</p>
    </div>
  )
}

export default function HomeStats() {
  const { section } = useContent()
  const homeStats = section('home.stats')
  const statsHeading = homeStats.heading || fbHeading
  const statsSupportingText = homeStats.supportingText || fbSupport
  const stats = homeStats.stats || fbStats
  const [sectionRef, inView] = useInView(0.25)

  return (
    <section className={styles.section} aria-labelledby="stats-heading">
      <div className="container">
        <div className={`${styles.header} fade-in-up ${inView ? 'is-visible' : ''}`}>
          <h2 id="stats-heading" className={styles.heading}>
            {statsHeading}
          </h2>
        </div>

        <div ref={sectionRef} className={styles.grid}>
          {stats.map((stat, i) => (
            <div key={stat.id} className={styles.cardWrapper}>
              <StatCard stat={stat} start={inView} index={i} />
              {i < stats.length - 1 && <div className={styles.divider} aria-hidden="true" />}
            </div>
          ))}
        </div>

        <p
          className={`${styles.supportingText} fade-in ${inView ? 'is-visible' : ''}`}
          style={{ animationDelay: '0.4s' }}
        >
          {statsSupportingText}
        </p>
      </div>
    </section>
  )
}