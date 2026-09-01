import { useEffect, useMemo, useState } from 'react'
import { ExternalLink, Headphones } from 'lucide-react'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchAudioItems } from '@api/cms'
import RichText from '@components/ui/RichText'
import { resolveSectionContent } from '@data/pages/mergePageContent'
import { cardExcerpt } from '@utils/text'
import styles from './CatalogPage.module.css'

const SECTION_KEYS = {
  audio: 'news.audio',
  documentary: 'news.documentaries',
  broadcast: 'news.broadcast',
}

const DEFAULT_TITLES = {
  audio: 'Audio',
  documentary: 'Documentaries',
  broadcast: 'Broadcast',
}

export default function AudioCatalogPage({ type = 'audio' }) {
  const { section, resolveHeaderImage, defaultHeaderImage } = useContent()
  const { locale } = useLocale()
  const sectionKey = SECTION_KEYS[type] || SECTION_KEYS.audio
  const hero = resolveSectionContent(section, sectionKey)
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAudioItems({ type, locale })
      .then(setItems)
      .catch((err) => setError(err.message))
  }, [type, locale])

  const heroImage = resolveHeaderImage(hero.heroImage, '/images/sanctuary/hero.jpg')
  const pageTitle = hero.title || DEFAULT_TITLES[type] || 'Audio'

  const sorted = useMemo(
    () => [...items].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0)),
    [items]
  )

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18, 40, 71, 0.9), rgba(26, 54, 93, 0.55)), url(${heroImage})`,
        }}
      >
        <div className="container">
          <h1>{pageTitle}</h1>
          {hero.subtitle ? <p className={styles.subtitle}>{hero.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {hero.intro ? <RichText html={hero.intro} className={styles.intro} /> : null}
        {error ? <p className={styles.empty}>{error}</p> : null}
        {!error && !sorted.length ? (
          <p className={styles.empty}>Content will appear here once published.</p>
        ) : null}

        <div className={styles.grid}>
          {sorted.map((item) => (
            <article key={item.id} className={styles.card}>
              <div className={styles.cardMedia}>
                <img src={item.coverImage || defaultHeaderImage} alt="" />
              </div>
              <div className={styles.cardBody}>
                {item.duration ? <p className={styles.meta}>{item.duration}</p> : null}
                <h2>{item.title}</h2>
                {cardExcerpt(item) ? <p className={styles.excerpt}>{cardExcerpt(item)}</p> : null}
                {item.audioUrl ? (
                  <a href={item.audioUrl} className={styles.cta} target="_blank" rel="noopener noreferrer">
                    <Headphones size={14} /> Listen <ExternalLink size={14} />
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
