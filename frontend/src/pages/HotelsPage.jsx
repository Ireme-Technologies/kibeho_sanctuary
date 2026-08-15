import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchLodging } from '@api/cms'
import RichText from '@components/ui/RichText'
import { cardExcerpt } from '@utils/text'
import styles from './CatalogPage.module.css'

function renderStars(rating) {
  const n = Math.round(Number(rating) || 0)
  if (!n) return null
  return '★'.repeat(Math.min(n, 5))
}

export default function HotelsPage() {
  const { section, resolveHeaderImage } = useContent()
  const { locale } = useLocale()
  const hero = section('hotels.index', {})
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLodging({ locale })
      .then(setItems)
      .catch((err) => setError(err.message))
  }, [locale])

  const heroImage = resolveHeaderImage(hero.heroImage, '/images/sanctuary/hero.jpg')

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18, 40, 71, 0.9), rgba(26, 54, 93, 0.55)), url(${heroImage})`,
        }}
      >
        <div className="container">
          <h1>{hero.title || 'Accommodation near the Shrine'}</h1>
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}

        {error ? <p className={styles.empty}>{error}</p> : null}

        {!error && !items.length ? (
          <p className={styles.empty}>Lodging listings will appear here once published.</p>
        ) : null}

        <div className={styles.lodgingGrid}>
          {items.map((item) => (
            <article key={item.id} className={styles.card}>
              <Link to={`/hotels/${item.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                {(item.coverImage || item.featuredImage) && (
                  <div className={styles.cardMedia}>
                    <img src={item.coverImage || item.featuredImage} alt="" />
                  </div>
                )}
                <div className={styles.cardBody}>
                  {item.category ? <p className={styles.meta}>{item.category}</p> : null}
                  <h2>{item.title}</h2>
                  {item.rating ? (
                    <p className={styles.stars} aria-label={`${item.rating} out of 5 stars`}>
                      {renderStars(item.rating)}
                    </p>
                  ) : null}
                  {cardExcerpt(item) ? (
                    <p className={styles.excerpt}>{cardExcerpt(item)}</p>
                  ) : null}
                  <span className={styles.cta}>View details →</span>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
