import { useEffect, useState } from 'react'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchTestimonials } from '@api/cms'
import { catalogErrorMessage } from '@api/client'
import { resolveSectionContent } from '@data/pages/mergePageContent'
import { heroBackgroundStyle } from '@utils/heroBackground'
import RichText from '@components/ui/RichText'
import styles from './CatalogPage.module.css'

function renderStars(rating) {
  const n = Math.round(Number(rating) || 0)
  if (!n) return null
  return '★'.repeat(Math.min(n, 5))
}

export default function TestimonialsPage() {
  const { section, resolveHeaderImage } = useContent()
  const { locale } = useLocale()
  const hero = resolveSectionContent(section, 'spirituality.testimonies', ['pilgrimage.testimonials'])
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchTestimonials({ locale })
      .then(setItems)
      .catch((err) => setError(catalogErrorMessage(err)))
  }, [locale])

  const heroImage = resolveHeaderImage(hero.heroImage, '/images/sanctuary/welcome.jpg')

  return (
    <div className={styles.page}>
      <header className={styles.hero} style={heroBackgroundStyle(heroImage)}>
        <div className="container">
          <h1>{hero.title || 'Testimonials'}</h1>
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}

        {error ? <p className={styles.empty}>{error}</p> : null}

        {!error && !items.length ? (
          <p className={styles.empty}>Testimonials will appear here once published.</p>
        ) : null}

        <div className={styles.grid}>
          {items.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.cardBody}>
                {item.rating ? (
                  <p className={styles.stars} aria-label={`${item.rating} out of 5 stars`}>
                    {renderStars(item.rating)}
                  </p>
                ) : null}
                {item.title ? <p className={styles.meta}>{item.title}</p> : null}
                <RichText html={item.body} as="blockquote" className={styles.quote} />
                <p className={styles.author}>
                  {item.authorName}
                  {item.authorRole ? ` — ${item.authorRole}` : ''}
                  {item.authorLocation ? `, ${item.authorLocation}` : ''}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
