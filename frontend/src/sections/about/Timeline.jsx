import { useInView } from '@hooks/useInView'
import { useParallax } from '@hooks/useParallax'
import styles from './Timeline.module.css'
import { useContent } from '@context/ContentContext'
import { milestones as fb } from '@data/about'

function MilestoneItem({ milestone, index }) {
  const isLeft = index % 2 === 0
  const [ref, inView] = useInView(0.3)

  return (
    <div
      ref={ref}
      className={`${styles.milestone} ${isLeft ? styles.milestoneLeft : styles.milestoneRight} fade-in-up ${
        inView ? 'is-visible' : ''
      }`}
    >
      {/* Glass card */}
      <div className={styles.contentArea}>
        <div className={styles.card}>
          <span className={styles.yearWatermark} aria-hidden="true">
            {milestone.year}
          </span>
          <span className={styles.year}>{milestone.year}</span>
          <span className={styles.badge}>{milestone.badge}</span>
          <h3 className={styles.title}>{milestone.title}</h3>
          <p className={styles.description}>{milestone.description}</p>
        </div>
      </div>

      {/* Center node with logo */}
      <div className={styles.circleArea}>
        <div className={styles.circle} aria-hidden="true">
          <img src="/logo-color.png" alt="" className={styles.circleLogo} />
        </div>
      </div>

      {/* Empty side (hidden on mobile) */}
      <div className={styles.emptyArea} aria-hidden="true" />
    </div>
  )
}

export default function Timeline() {
  const { section } = useContent()
  const milestones = section('about.timeline').milestones || fb
  const [headerRef, headerInView] = useInView(0.4)
  const [parallaxRef, parallaxOffset] = useParallax(0.15)

  return (
    <section ref={parallaxRef} className={styles.section} aria-labelledby="timeline-heading">

      {/* Parallax background */}
      <div className={styles.parallaxBg} aria-hidden="true">
        <div
          className={styles.bgImage}
          style={{ transform: `translateY(${parallaxOffset}px)` }}
        />
        <div className={styles.bgOverlay} />
      </div>

      {/* Content */}
      <div className={styles.content}>

        <div
          ref={headerRef}
          className={`${styles.header} fade-in-up ${headerInView ? 'is-visible' : ''}`}
        >
          <h2 id="timeline-heading" className={styles.heading}>
            Milestones That Define Us
          </h2>
        </div>

        <div className={styles.timelineWrapper}>
          <div className={styles.centerLine} aria-hidden="true" />

          {milestones.map((milestone, i) => (
            <MilestoneItem key={milestone.id} milestone={milestone} index={i} />
          ))}
        </div>

      </div>
    </section>
  )
}