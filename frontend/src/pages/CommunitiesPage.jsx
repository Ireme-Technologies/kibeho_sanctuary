import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchCommunities } from '@api/cms'
import RichText from '@components/ui/RichText'
import { resolveSectionContent } from '@data/pages/mergePageContent'
import { cardExcerpt } from '@utils/text'
import styles from './CatalogPage.module.css'

export default function CommunitiesPage() {
  const { section, resolveHeaderImage, defaultHeaderImage } = useContent()
  const { locale, t } = useLocale()
  const hero = resolveSectionContent(section, 'shrine.communities', ['our-lady.communities'])
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCommunities({ locale })
      .then(setItems)
      .catch((err) => setError(err.message))
  }, [locale])

  const heroImage = resolveHeaderImage(hero.heroImage, '/images/sanctuary/hills.jpg')

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18, 40, 71, 0.9), rgba(26, 54, 93, 0.55)), url(${heroImage})`,
        }}
      >
        <div className="container">
          <h1>{hero.title || 'Communities around Kibeho'}</h1>
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}
        {error ? <p className={styles.empty}>{error}</p> : null}
        {!error && !items.length ? (
          <p className={styles.empty}>Communities will appear here once published.</p>
        ) : null}

        <div className={styles.grid}>
          {items.map((item) => (
            <Link key={item.id} to={item.path || `/shrine/communities/${item.slug}`} className={styles.card}>
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
