import { Link } from 'react-router-dom'
import { weeklyPrograms } from '@data/home/sanctuaryHome'
import styles from './ContentPage.module.css'

export default function ProgramsPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className="container">
          <h1>Programs</h1>
          <p>Weekly liturgy, monthly gatherings, and special feast-day celebrations at Kibeho Sanctuary.</p>
        </div>
      </header>

      <section className={`container ${styles.section}`} id="mass">
        <h2>Weekly & Monthly Schedule</h2>
        <p className={styles.lead}>
          Times may vary on solemnities and major pilgrimage days. Please confirm with the
          sanctuary office before travel.
        </p>
        <ul className={styles.list}>
          {weeklyPrograms.map((item) => (
            <li key={item.id}>
              <strong>
                {item.when} · {item.time}
              </strong>
              {item.title}
            </li>
          ))}
        </ul>
        <div className={styles.ctaRow}>
          <Link to="/visit" className={styles.btn}>
            Visitor Information
          </Link>
          <Link to="/contact" className={styles.btnGhost}>
            Ask About Group Programs
          </Link>
        </div>
      </section>
    </div>
  )
}
