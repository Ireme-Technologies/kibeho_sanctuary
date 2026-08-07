import { Link } from 'react-router-dom'
import { accommodation } from '@data/home/sanctuaryHome'
import { useContent } from '@context/ContentContext'
import styles from './ContentPage.module.css'

export default function VisitPage() {
  const { projects, company } = useContent()
  const facilities = projects?.length
    ? projects.slice(0, 6)
    : accommodation.facilities.map((f) => ({
        title: f.title,
        summary: f.description,
        slug: f.id,
      }))

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className="container">
          <h1>Visit Kibeho</h1>
          <p>
            Practical information for pilgrims — how to arrive, where to stay, and how to
            prepare for a prayerful visit.
          </p>
        </div>
      </header>

      <section className={`container ${styles.section}`}>
        <h2>Getting Here</h2>
        <p className={styles.lead}>
          Kibeho Sanctuary is located in Nyaruguru District, Southern Province, Rwanda.
          Pilgrims commonly travel via Kigali or Huye, then continue by road to Kibeho.
        </p>
        <p className={styles.lead}>
          Address: {company.address}
          <br />
          Phone: {company.phone} · Email: {company.email}
        </p>
      </section>

      <section className={`container ${styles.section}`} id="accommodation">
        <h2>Accommodation & Facilities</h2>
        <p className={styles.lead}>{accommodation.text}</p>
        <div className={styles.grid}>
          {facilities.map((item) => (
            <article key={item.slug || item.title} className={styles.card} id={item.slug}>
              <h3>{item.title}</h3>
              <p>{item.summary || item.description || item.excerpt}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={`container ${styles.section}`} id="groups">
        <h2>Group Visits</h2>
        <p className={styles.lead}>
          Parishes, schools, and pilgrimage movements are welcome. Share your expected dates,
          group size, and liturgical needs so we can prepare hospitality and pastoral support.
        </p>
        <div className={styles.ctaRow}>
          <Link to="/contact" className={styles.btn}>
            Request a Group Visit
          </Link>
          <Link to="/support" className={styles.btnGhost}>
            Support Pilgrims
          </Link>
        </div>
      </section>
    </div>
  )
}
