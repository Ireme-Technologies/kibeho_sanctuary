import { Link } from 'react-router-dom'
import { pilgrimageServices } from '@data/home/sanctuaryHome'
import { useContent } from '@context/ContentContext'
import styles from './ContentPage.module.css'

export default function PilgrimagePage() {
  const { services } = useContent()
  const items = services?.length
    ? services.map((s) => ({
        id: s.slug,
        title: s.title,
        description: s.summary || s.excerpt || s.description,
        path: `/pilgrimage/${s.slug}`,
      }))
    : pilgrimageServices

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className="container">
          <h1>Pilgrimage</h1>
          <p>
            Come to Kibeho to pray, receive the sacraments, and renew your faith at the
            Shrine of Our Lady of Kibeho.
          </p>
        </div>
      </header>

      <section className={`container ${styles.section}`}>
        <h2>Pilgrimage Services</h2>
        <p className={styles.lead}>
          Whether you arrive alone or with a group, the sanctuary offers Mass, confession,
          adoration, retreats, and pastoral accompaniment for a fruitful pilgrimage.
        </p>
        <div className={styles.grid}>
          {items.map((item) => (
            <article key={item.id || item.slug} className={styles.card} id={item.id}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              {item.path?.includes('/') && item.path.split('/').length > 2 ? (
                <Link to={item.path} className={styles.btn} style={{ marginTop: '1rem' }}>
                  Learn more
                </Link>
              ) : null}
            </article>
          ))}
        </div>
        <div className={styles.ctaRow}>
          <Link to="/visit" className={styles.btn}>
            Plan Your Visit
          </Link>
          <Link to="/programs" className={styles.btnGhost}>
            View Programs
          </Link>
        </div>
      </section>
    </div>
  )
}
