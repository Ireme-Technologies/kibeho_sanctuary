import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchSacredPlaces } from '@api/cms'
import RichText from '@components/ui/RichText'
import { resolveSectionContent } from '@data/pages/mergePageContent'
import { cardExcerpt } from '@utils/text'
import styles from './CatalogPage.module.css'

export default function SacredPlacesPage({ type: typeProp }) {
  const { pathname } = useLocation()
  const { section, resolveHeaderImage, defaultHeaderImage } = useContent()
  const { locale, t } = useLocale()

  const type = useMemo(() => {
    if (typeProp) return typeProp
    return pathname.includes('apparition-sites') ? 'apparition_site' : 'church'
  }, [typeProp, pathname])

  const sectionKey = type === 'apparition_site' ? 'shrine.apparition-sites' : 'shrine.churches'
  const hero = resolveSectionContent(section, sectionKey)
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchSacredPlaces({ ...{ type }, locale })
      .then(setItems)
      .catch((err) => setError(err.message))
  }, [type, locale])

  const heroImage = resolveHeaderImage(
    hero.heroImage,
    type === 'church' ? '/images/sanctuary/church.jpg' : '/images/sanctuary/hero.jpg'
  )

  const basePath = type === 'apparition_site' ? '/shrine/apparition-sites' : '/shrine/churches'

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18, 40, 71, 0.9), rgba(26, 54, 93, 0.55)), url(${heroImage})`,
        }}
      >
        <div className="container">
          <h1>{hero.title || (type === 'church' ? 'Churches' : 'Apparition Sites')}</h1>
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}

        {error ? <p className={styles.empty}>{error}</p> : null}

        {!error && !items.length ? (
          <p className={styles.empty}>Places will appear here once published.</p>
        ) : null}

        <div className={styles.grid}>
          {items.map((item) => (
            <Link
              key={item.id}
              to={item.path || `${basePath}/${item.slug}`}
              className={styles.card}
            >
              <div className={styles.cardMedia}>
                <img src={item.coverImage || defaultHeaderImage} alt="" />
              </div>
              <div className={styles.cardBody}>
                {item.location ? <p className={styles.meta}>{item.location}</p> : null}
                <h2>{item.name || item.title}</h2>
                {cardExcerpt(item) ? <p className={styles.excerpt}>{cardExcerpt(item)}</p> : null}
                <span className={styles.cta}>{t('learnMore')} →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
