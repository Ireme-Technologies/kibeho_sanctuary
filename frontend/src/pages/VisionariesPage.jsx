import { useEffect, useState } from 'react'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchVisionaries } from '@api/cms'
import RichText from '@components/ui/RichText'
import { resolveSectionContent } from '@data/pages/mergePageContent'
import { cardExcerpt } from '@utils/text'
import styles from './CatalogPage.module.css'

export default function VisionariesPage() {
  const { section, resolveHeaderImage, defaultHeaderImage } = useContent()
  const { locale } = useLocale()
  const hero = resolveSectionContent(section, 'shrine.visionaries')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchVisionaries({ locale })
      .then(setItems)
      .catch((err) => setError(err.message))
  }, [locale])

  const heroImage = resolveHeaderImage(hero.heroImage, '/images/sanctuary/welcome.jpg')

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18, 40, 71, 0.9), rgba(26, 54, 93, 0.55)), url(${heroImage})`,
        }}
      >
        <div className="container">
          <h1>{hero.title || 'The Visionaries'}</h1>
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}
        {error ? <p className={styles.empty}>{error}</p> : null}
        {!error && !items.length ? (
          <p className={styles.empty}>Visionaries will appear here once published.</p>
        ) : null}

        <div className={styles.grid}>
          {items.map((item) => (
            <article key={item.id} id={item.slug} className={styles.card}>
              <div className={styles.cardMedia}>
                <img src={item.photo || item.coverImage || defaultHeaderImage} alt="" />
              </div>
              <div className={styles.cardBody}>
                {item.periodLabel ? <p className={styles.meta}>{item.periodLabel}</p> : null}
                <h2>{item.name}</h2>
                {item.isApproved === false ? (
                  <p className={styles.meta}>Not approved by the Church</p>
                ) : null}
                {cardExcerpt(item) ? <p className={styles.excerpt}>{cardExcerpt(item)}</p> : null}
                {item.description ? <RichText html={item.description} className={styles.excerpt} /> : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
