import { Link } from 'react-router-dom'
import { supportCta } from '@data/home/sanctuaryHome'
import styles from './ContentPage.module.css'

export default function SupportPage() {
  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className="container">
          <h1>Support the Mission</h1>
          <p>{supportCta.text}</p>
        </div>
      </header>

      <section className={`container ${styles.section}`} id="donate">
        <h2>Donate</h2>
        <p className={styles.lead}>
          Your gifts help maintain the shrine, welcome pilgrims, support liturgy and retreats,
          and sustain outreach to local communities in Nyaruguru.
        </p>
        <ul className={styles.list}>
          <li>
            <strong>Sanctuary Upkeep</strong>
            Care for the chapel, grounds, and pilgrimage facilities.
          </li>
          <li>
            <strong>Pilgrim Hospitality</strong>
            Support accommodation, meals, and welcome for those in need.
          </li>
          <li>
            <strong>Evangelization & Outreach</strong>
            Catechesis, youth programs, and community works of mercy.
          </li>
        </ul>
        <div className={styles.ctaRow}>
          <Link to="/contact" className={styles.btn}>
            {supportCta.primary.label}
          </Link>
        </div>
      </section>

      <section className={`container ${styles.section}`} id="volunteer">
        <h2>Become a Volunteer</h2>
        <p className={styles.lead}>
          Share your time and talents — hospitality, translation, music ministry, logistics,
          or practical maintenance during major pilgrimage seasons.
        </p>
        <div className={styles.ctaRow}>
          <Link to="/contact" className={styles.btn}>
            {supportCta.secondary.label}
          </Link>
          <Link to="/programs" className={styles.btnGhost}>
            See Current Programs
          </Link>
        </div>
      </section>
    </div>
  )
}
