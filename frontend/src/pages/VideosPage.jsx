import { useEffect, useState } from 'react'
import { ExternalLink, Play, X } from 'lucide-react'
import PageHeader from '@components/ui/PageHeader'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchVideos } from '@api/cms'
import { excerpt, stripHtml } from '@utils/text'
import styles from './VideosPage.module.css'

export default function VideosPage() {
  const { section, resolveHeaderImage } = useContent()
  const { locale } = useLocale()
  const hero = section('news.videos') || section('videos.hero') || {}
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [active, setActive] = useState(null)

  useEffect(() => {
    fetchVideos({ locale })
      .then(setItems)
      .catch((err) => setError(err.message))
  }, [locale])

  useEffect(() => {
    if (!active) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') setActive(null)
    }
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      document.removeEventListener('keydown', onKey)
    }
  }, [active])

  return (
    <>
      <PageHeader
        title={hero.title || 'Videos'}
        backgroundImage={resolveHeaderImage(
          hero.heroImage || hero.backgroundImage,
          '/images/sanctuary/hero.jpg'
        )}
      />

      <section className={styles.section}>
        <div className="container">
          {hero.intro ? (
            <p className={styles.intro}>{stripHtml(hero.intro)}</p>
          ) : (
            <p className={styles.intro}>
              Watch messages and moments from the Shrine of Our Lady of Kibeho. Play videos here or open
              them on YouTube.
            </p>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.grid}>
            {items.map((item) => (
              <article key={item.id} className={styles.card}>
                <button
                  type="button"
                  className={styles.thumbBtn}
                  onClick={() => setActive(item)}
                  aria-label={`Play ${item.title}`}
                >
                  <img
                    src={item.thumbnailUrl || '/images/sanctuary/hero.jpg'}
                    alt=""
                    className={styles.thumb}
                  />
                  <span className={styles.playBadge} aria-hidden="true">
                    <Play size={28} fill="currentColor" />
                  </span>
                </button>
                <div className={styles.body}>
                  <h2 className={styles.title}>{item.title}</h2>
                  {item.description ? (
                    <p className={styles.excerpt}>{excerpt(item.description)}</p>
                  ) : null}
                  <div className={styles.actions}>
                    <button type="button" className={styles.watchBtn} onClick={() => setActive(item)}>
                      Watch here
                    </button>
                    <a
                      className={styles.ytBtn}
                      href={item.watchUrl || item.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Watch on YouTube <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!items.length && !error && (
            <p className={styles.empty}>Videos will appear here once published from the admin.</p>
          )}
        </div>
      </section>

      {active && (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-label={active.title}>
          <button type="button" className={styles.backdrop} aria-label="Close" onClick={() => setActive(null)} />
          <div className={styles.modalPanel}>
            <div className={styles.modalHead}>
              <h3>{active.title}</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setActive(null)} aria-label="Close">
                <X size={22} />
              </button>
            </div>
            <div className={styles.player}>
              {active.embedUrl ? (
                <iframe
                  title={active.title}
                  src={`${active.embedUrl}?autoplay=1`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <p className={styles.error}>Unable to embed this video.</p>
              )}
            </div>
            <div className={styles.modalFooter}>
              <a href={active.watchUrl || active.youtubeUrl} target="_blank" rel="noopener noreferrer">
                Open on YouTube <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
