import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchPastoralTeam } from '@api/cms'
import RichText from '@components/ui/RichText'
import { cardExcerpt } from '@utils/text'
import { resolveSectionContent } from '@data/pages/mergePageContent'
import styles from './CatalogPage.module.css'

export default function PastoralTeamPage() {
  const { section, resolveHeaderImage, defaultHeaderImage } = useContent()
  const { locale } = useLocale()
  const hero = resolveSectionContent(section, 'our-lady.pastoral-team')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPastoralTeam({ locale })
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
          <h1>{hero.title || 'Pastoral Team'}</h1>
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}
        {error ? <p className={styles.empty}>{error}</p> : null}
        {!error && !items.length ? (
          <p className={styles.empty}>Team members will appear here once published.</p>
        ) : null}

        <div className={styles.grid}>
          {items.map((item) => (
            <Link key={item.id} to={item.path || `/our-lady/pastoral-team/${item.slug}`} className={styles.card}>
              <div className={styles.cardMedia}>
                <img src={item.photo || item.coverImage || defaultHeaderImage} alt="" />
              </div>
              <div className={styles.cardBody}>
                {item.role ? <p className={styles.meta}>{item.role}</p> : null}
                <h2>{item.name}</h2>
                {cardExcerpt({ description: item.bio || item.description }) ? (
                  <p className={styles.excerpt}>{cardExcerpt({ description: item.bio || item.description })}</p>
                ) : null}
                <span className={styles.cta}>View profile →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
