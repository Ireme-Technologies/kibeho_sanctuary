import { useEffect, useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchSpiritualBooks } from '@api/cms'
import { catalogErrorMessage } from '@api/client'
import RichText from '@components/ui/RichText'
import { resolveSectionContent } from '@data/pages/mergePageContent'
import { cardExcerpt } from '@utils/text'
import styles from './CatalogPage.module.css'

export default function BooksPage() {
  const { section, resolveHeaderImage, defaultHeaderImage } = useContent()
  const { locale } = useLocale()
  const hero = resolveSectionContent(section, 'spirituality.books')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSpiritualBooks({ locale })
      .then(setItems)
      .catch((err) => setError(catalogErrorMessage(err)))
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
          <h1>{hero.title || 'Spiritual Books'}</h1>
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}
        {error ? <p className={styles.empty}>{error}</p> : null}
        {!error && !items.length ? (
          <p className={styles.empty}>Books will appear here once published.</p>
        ) : null}

        <div className={styles.grid}>
          {items.map((item) => (
            <article key={item.id} id={item.slug} className={styles.card}>
              <div className={styles.cardMedia}>
                <img src={item.coverImage || defaultHeaderImage} alt="" />
              </div>
              <div className={styles.cardBody}>
                {item.author ? <p className={styles.meta}>{item.author}</p> : null}
                <h2>{item.title}</h2>
                {cardExcerpt(item) ? <p className={styles.excerpt}>{cardExcerpt(item)}</p> : null}
                {item.availabilityNote ? <p className={styles.meta}>{item.availabilityNote}</p> : null}
                {item.purchaseUrl ? (
                  <a
                    href={item.purchaseUrl}
                    className={styles.cta}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Find this book <ExternalLink size={14} />
                  </a>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
