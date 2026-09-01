import { useEffect, useState } from 'react'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchOfficialPrayers } from '@api/cms'
import RichText from '@components/ui/RichText'
import { resolveSectionContent } from '@data/pages/mergePageContent'
import styles from './CatalogPage.module.css'

export default function OfficialPrayersPage() {
  const { section, resolveHeaderImage } = useContent()
  const { locale } = useLocale()
  const hero = resolveSectionContent(section, 'spirituality.official-prayers')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOfficialPrayers({ locale })
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
          <h1>{hero.title || 'Official Prayers'}</h1>
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}
        {error ? <p className={styles.empty}>{error}</p> : null}
        {!error && !items.length ? (
          <p className={styles.empty}>Official prayers will appear here once published.</p>
        ) : null}

        <div className={styles.schedule}>
          {items.map((item) => (
            <article key={item.id} className={styles.scheduleRow}>
              <div>
                <p className={styles.title}>{item.title}</p>
                {item.timeLabel ? <p className={styles.meta}>{item.timeLabel}</p> : null}
              </div>
              {item.description ? (
                <RichText html={item.description} className={styles.notes} />
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
