import { useInView } from '@hooks/useInView'
import styles from './MissionVision.module.css'
import { useContent } from '@context/ContentContext'
import { missionVision as fb } from '@data/about'

// ── Telescope SVG icon — kept for the Vision block ─────────────
function TelescopeIcon() {
  return (
    <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden="true">
      <line x1="2" y1="10" x2="16" y2="5" />
      <line x1="2" y1="14" x2="16" y2="19" />
      <line x1="2" y1="10" x2="2" y2="14" />
      <path d="M16 5 Q18 12 16 19" />
      <line x1="9" y1="17" x2="7" y2="22" />
      <line x1="9" y1="17" x2="11" y2="22" />
      <line x1="9" y1="17" x2="9" y2="12" />
      <circle cx="16" cy="12" r="3" />
      <line x1="18.5" y1="9.5" x2="20" y2="8" />
    </svg>
  )
}

// ── Single Mission or Vision block ─────────────────────────────
// data shape: { heading, text }
function Block({ data, icon, delay, inView }) {
  return (
    <div
      className={`${styles.block} fade-in-up ${inView ? 'is-visible' : ''}`}
      style={{ animationDelay: `${delay}s` }}
    >
      <div className={styles.iconWrap} aria-hidden="true">
        {icon}
      </div>

      <h3 className={styles.blockHeading}>{data.heading}</h3>
      <p className={styles.blockText}>{data.text}</p>
    </div>
  )
}

// ── Centre divider — vertical line + gold diamond ──────────────
function Divider() {
  return (
    <div className={styles.divider} aria-hidden="true">
      <span className={styles.diamond} />
    </div>
  )
}

export default function MissionVision() {
  const { section } = useContent()
  const missionVision = Object.keys(section('about.mission_vision')).length ? section('about.mission_vision') : fb
  const [ref, inView] = useInView(0.2)

  return (
    <section className={styles.section} aria-labelledby="mv-heading">
      <div ref={ref} className={styles.container}>

        {/* Section header */}
        <div className={`${styles.header} fade-in-up ${inView ? 'is-visible' : ''}`}>
          <h2 className={styles.heading} id="mv-heading">
            Our <span>Purpose</span>
          </h2>
        </div>

        {/* Mission + Divider + Vision */}
        <div className={styles.body}>

          <Block
            data={missionVision.mission}
            icon={
              <img
                src="/images/about/royal-ventures-logo.png"
                alt=""
                className={styles.logoIcon}
              />
            }
            delay={0.15}
            inView={inView}
          />

          <Divider />

          <Block
            data={missionVision.vision}
            icon={<TelescopeIcon />}
            delay={0.3}
            inView={inView}
          />

        </div>

      </div>
    </section>
  )
}