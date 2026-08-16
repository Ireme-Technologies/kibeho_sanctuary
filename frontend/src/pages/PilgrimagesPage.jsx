import { Link, useSearchParams } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { formatEventWhen, formatRecurrence } from '@utils/eventTime'
import { classifyEvent, statusLabel } from '@utils/occasion'
import { cardExcerpt } from '@utils/text'
import { PAGE_SIZE, paginate, sortByLatest } from '@utils/paginate'
import Pagination from '@components/Pagination'
import styles from './CmsPage.module.css'

export default function PilgrimagesPage() {
  const { upcomingPilgrimages, section, resolveHeaderImage, defaultHeaderImage } = useContent()
  const [searchParams] = useSearchParams()
  const page = Number(searchParams.get('page') || 1)
  const hero = section('pilgrimage.calendar', {})
  const heroImage = resolveHeaderImage(hero.heroImage, '/images/sanctuary/hero.jpg')
  const sorted = sortByLatest(upcomingPilgrimages || [], (item) => item.startsOn || item.starts_on)
  const paged = paginate(sorted, page, PAGE_SIZE)

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18,40,71,.88), rgba(26,54,93,.5)), url(${heroImage})`,
        }}
      >
        <div className="container">
          <h1>{hero.title || 'Pilgrimage events'}</h1>
          <p className={styles.subtitle}>
            {hero.subtitle ||
              'Join prayer gatherings, feast days, and pilgrimages at the Shrine of Our Lady of Kibeho.'}
          </p>
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        <div className={styles.cards}>
          {paged.items.map((item) => {
            const when = formatEventWhen(item)
            const badge = statusLabel(classifyEvent(item).status)
            const metaBits = [badge, when, formatRecurrence(item)].filter(Boolean)

            return (
              <article key={item.id || item.slug} className={styles.card}>
                <img
                  src={item.image || defaultHeaderImage}
                  alt=""
                  style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6, marginBottom: 12 }}
                />
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
        <Pagination
          page={paged.page}
          pageCount={paged.pageCount}
          total={paged.total}
          pageSize={PAGE_SIZE}
        />
      </div>
    </div>
  )
}
