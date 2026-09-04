import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchLodging } from '@api/cms'
import { catalogErrorMessage } from '@api/client'
import { sectionKeyForPath } from '@data/pages/registry'
import { resolveSectionContent } from '@data/pages/mergePageContent'
import RichText from '@components/ui/RichText'
import { cardExcerpt } from '@utils/text'
import { displayFacilityName } from '@utils/displayName'
import { heroBackgroundStyle } from '@utils/heroBackground'
import styles from './CatalogPage.module.css'

export default function HotelsPage() {
  const { pathname } = useLocation()
  const { section, resolveHeaderImage, defaultHeaderImage } = useContent()
  const { locale } = useLocale()
  const key = sectionKeyForPath(pathname) || 'hotels.index'
  const extra = key === 'hotels.index' ? ['pilgrimage.accommodation'] : ['hotels.index']
  const hero = resolveSectionContent(section, key, extra)
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchLodging({ locale })
      .then(setItems)
      .catch((err) => setError(catalogErrorMessage(err)))
  }, [locale])

  const heroImage = resolveHeaderImage(hero.heroImage)

  return (
    <div className={styles.page}>
      <header className={styles.hero} style={heroBackgroundStyle(heroImage)}>
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
            <article key={item.id} className={`${styles.card} ${styles.lodgingCard}`}>
              <Link to={`/pilgrimage/accommodation/${item.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                <div className={styles.cardMedia}>
                  {item.category ? <span className={styles.categoryBadge}>{item.category}</span> : null}
                  <img src={item.coverImage || item.featuredImage || defaultHeaderImage} alt="" />
                </div>
                <div className={styles.cardBody}>
                  <h2>{displayFacilityName(item.title)}</h2>
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
