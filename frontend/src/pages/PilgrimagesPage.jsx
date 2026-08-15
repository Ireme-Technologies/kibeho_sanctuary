import { Link } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { formatEventWhen, formatRecurrence } from '@utils/eventTime'
import { classifyEvent, statusLabel } from '@utils/occasion'
import { cardExcerpt } from '@utils/text'
import styles from './CmsPage.module.css'

export default function PilgrimagesPage() {
  const { upcomingPilgrimages } = useContent()

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={{
          backgroundImage:
            'linear-gradient(120deg, rgba(18,40,71,.88), rgba(26,54,93,.5)), url(/images/sanctuary/hero.jpg)',
        }}
      >
        <div className="container">
          <h1>Pilgrimage events</h1>
          <p className={styles.subtitle}>Join prayer gatherings, feast days, and pilgrimages at the Shrine of Our Lady of Kibeho.</p>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        <div className={styles.cards}>
          {(upcomingPilgrimages || []).map((item) => {
            const when = formatEventWhen(item)
            const badge = statusLabel(classifyEvent(item).status)
            const metaBits = [badge, when, formatRecurrence(item)].filter(Boolean)

            return (
              <article key={item.id || item.slug} className={styles.card}>
                {item.image ? (
                  <img
                    src={item.image}
                    alt=""
                    style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6, marginBottom: 12 }}
                  />
                ) : null}
                <p className={styles.eyebrow}>{metaBits.join(' · ') || item.meta || 'Upcoming'}</p>
                <h3>{item.title}</h3>
                {cardExcerpt(item) ? <p>{cardExcerpt(item)}</p> : null}
                <Link to={item.path || `/pilgrimages/${item.slug}`} className={styles.inlineLink}>
                  View more & register →
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </div>
  )
}
