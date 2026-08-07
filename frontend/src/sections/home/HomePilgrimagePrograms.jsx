import { Link } from 'react-router-dom'
import { Cross, CalendarClock } from 'lucide-react'
import { pilgrimageServices, weeklyPrograms } from '@data/home/sanctuaryHome'
import styles from './HomePilgrimagePrograms.module.css'

export default function HomePilgrimagePrograms() {
  return (
    <section className={styles.section}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.panel}>
          <div className={styles.head}>
            <Cross size={22} className={styles.headIcon} aria-hidden="true" />
            <h2 className={styles.heading}>Pilgrimage & Services</h2>
          </div>
          <ul className={styles.list}>
            {pilgrimageServices.map((item) => (
              <li key={item.id}>
                <Link to={item.path} className={styles.listItem}>
                  <span className={styles.bullet} aria-hidden="true" />
                  <span>
                    <strong>{item.title}</strong>
                    <span className={styles.itemDesc}>{item.description}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <Link to="/pilgrimage" className={styles.more}>
            Explore Pilgrimage →
          </Link>
        </div>

        <div className={styles.panel} id="mass">
          <div className={styles.head}>
            <CalendarClock size={22} className={styles.headIcon} aria-hidden="true" />
            <h2 className={styles.heading}>Weekly & Monthly Programs</h2>
          </div>
          <ul className={styles.schedule}>
            {weeklyPrograms.map((item) => (
              <li key={item.id} className={styles.scheduleItem}>
                <div>
                  <p className={styles.when}>{item.when}</p>
                  <p className={styles.event}>{item.title}</p>
                </div>
                <p className={styles.time}>{item.time}</p>
              </li>
            ))}
          </ul>
          <Link to="/programs" className={styles.more}>
            Full Program Schedule →
          </Link>
        </div>
      </div>
    </section>
  )
}
