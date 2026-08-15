import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchShrineProjects } from '@api/cms'
import RichText from '@components/ui/RichText'
import { cardExcerpt } from '@utils/text'
import styles from './CatalogPage.module.css'

export default function SupportProjectsPage() {
  const { section, resolveHeaderImage } = useContent()
  const { locale } = useLocale()
  const hero = section('support.projects', {})
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchShrineProjects({ locale })
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
          <h1>{hero.title || 'Development projects'}</h1>
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}

        {error ? <p className={styles.empty}>{error}</p> : null}

        {!error && !items.length ? (
          <p className={styles.empty}>Development projects will appear here once published.</p>
        ) : null}

        <div className={styles.grid}>
          {items.map((item) => (
            <Link
              key={item.id}
              to={item.path || `/support/projects/${item.slug}`}
              className={styles.card}
            >
              {item.coverImage ? (
                <div className={styles.cardMedia}>
                  <img src={item.coverImage} alt="" />
                </div>
              ) : null}
              <div className={styles.cardBody}>
                {item.status ? <p className={styles.meta}>{item.status}</p> : null}
                <h2>{item.title}</h2>
                {cardExcerpt(item) ? <p className={styles.excerpt}>{cardExcerpt(item)}</p> : null}
                <span className={styles.cta}>View project →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
