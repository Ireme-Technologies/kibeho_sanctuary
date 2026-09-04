import { useEffect, useState } from 'react'
import { ExternalLink, Play, X } from 'lucide-react'
import PageHeader from '@components/ui/PageHeader'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchVideos } from '@api/cms'
import { catalogErrorMessage } from '@api/client'
import { excerpt, stripHtml } from '@utils/text'
import styles from './VideosPage.module.css'

export default function VideosPage() {
  const { section, resolveHeaderImage } = useContent()
  const { locale, t } = useLocale()
  const hero = section('news.videos') || section('videos.hero') || {}
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [active, setActive] = useState(null)

  useEffect(() => {
    fetchVideos({ locale })
      .then(setItems)
      .catch((err) => setError(catalogErrorMessage(err)))
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
        title={hero.title || t('videos')}
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
            <p className={styles.intro}>{t('videosIntro')}</p>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.grid}>
            {items.map((item) => (
              <article key={item.id} className={styles.card}>
                <button
                  type="button"
                  className={styles.thumbBtn}
                  onClick={() => setActive(item)}
                  aria-label={`${t('watchHere')}: ${item.title}`}
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
                  <ContentLocaleNotice translations={item.translations} />
                  {item.description ? (
                    <p className={styles.excerpt}>{excerpt(item.description)}</p>
                  ) : null}
                  <div className={styles.actions}>
                    <button type="button" className={styles.watchBtn} onClick={() => setActive(item)}>
                      {t('watchHere')}
                    </button>
                    <a
                      className={styles.ytBtn}
                      href={item.watchUrl || item.youtubeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {t('watchOnYoutube')} <ExternalLink size={14} />
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {!items.length && !error && (
            <p className={styles.empty}>{t('videosEmpty')}</p>
          )}
        </div>
      </section>

      {active && (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-label={active.title}>
          <button
            type="button"
            className={styles.backdrop}
            aria-label={t('close')}
            onClick={() => setActive(null)}
          />
          <div className={styles.modalPanel}>
            <div className={styles.modalHead}>
              <h3>{active.title}</h3>
              <button
                type="button"
                className={styles.closeBtn}
                onClick={() => setActive(null)}
                aria-label={t('close')}
              >
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
                <p className={styles.error}>{t('unableToEmbedVideo')}</p>
              )}
            </div>
            <div className={styles.modalFooter}>
              <a href={active.watchUrl || active.youtubeUrl} target="_blank" rel="noopener noreferrer">
                {t('openOnYoutube')} <ExternalLink size={14} />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
