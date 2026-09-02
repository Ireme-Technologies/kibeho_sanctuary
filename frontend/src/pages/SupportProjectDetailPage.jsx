import { useLocale } from '@context/LocaleContext'
import { useContent } from '@context/ContentContext'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchShrineProject } from '@api/cms'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import { getInvolvedHref } from '@utils/giveServices'
import ImageLightbox from '@components/ui/ImageLightbox'
import RichText from '@components/ui/RichText'
import NotFoundPage from './NotFoundPage'
import catalog from './CatalogPage.module.css'
import styles from './SupportProject.module.css'

function StoryBlock({ kicker, title, html }) {
  if (!html) return null
  return (
    <section className={styles.story}>
      {kicker ? <p className={styles.kicker}>{kicker}</p> : null}
      <h2>{title}</h2>
      <RichText html={html} />
    </section>
  )
}

export default function SupportProjectDetailPage() {
  const { locale, t } = useLocale()
  const { resolveHeaderImage } = useContent()
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [lightbox, setLightbox] = useState({ open: false, index: 0 })

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetchShrineProject(slug, { locale })
      .then(setItem)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug, locale])

  if (loading) {
    return (
      <div className={`container ${catalog.body}`}>
        <p className={catalog.empty}>{t('loading')}</p>
      </div>
    )
  }

  if (notFound || !item) return <NotFoundPage />

  const gallery = (item.gallery || []).filter(Boolean)
  const heroImage = resolveHeaderImage(item.coverImage)

  return (
    <div className={catalog.page}>
      <header
        className={catalog.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18, 40, 71, 0.9), rgba(26, 54, 93, 0.55)), url(${heroImage})`,
        }}
      >
        <div className="container">
          {item.status ? <p className={catalog.subtitle}>{item.status}</p> : null}
          <h1>{item.title}</h1>
          <Link to={getInvolvedHref('expansion')} className={catalog.heroCta}>
            {t('offer.bePart')}
          </Link>
        </div>
      </header>

      <div className={`container ${catalog.body}`}>
        <div className={styles.layout}>
          <ContentLocaleNotice translations={item.translations} />
          {item.phase ? <p className={catalog.meta}>{item.phase}</p> : null}

          {item.description ? <RichText html={item.description} className={styles.lead} /> : null}

          {item.problem || item.solution || item.impactLocal || item.impactGlobal || item.impactChurch ? (
            <div className={styles.storyList}>
              <StoryBlock title={t('project.need')} html={item.problem} />
              <StoryBlock title={t('project.solution')} html={item.solution} />
            </div>
          ) : null}

          {item.impactLocal || item.impactGlobal || item.impactChurch ? (
            <section className={styles.impact}>
              <h2>{t('project.fruit')}</h2>
              <div className={styles.impactGrid}>
                {item.impactLocal ? (
                  <article>
                    <h3>{t('project.local')}</h3>
                    <RichText html={item.impactLocal} />
                  </article>
                ) : null}
                {item.impactChurch ? (
                  <article>
                    <h3>{t('project.church')}</h3>
                    <RichText html={item.impactChurch} />
                  </article>
                ) : null}
                {item.impactGlobal ? (
                  <article>
                    <h3>{t('project.world')}</h3>
                    <RichText html={item.impactGlobal} />
                  </article>
                ) : null}
              </div>
            </section>
          ) : null}

          <section className={styles.galleryBlock}>
            <h2>{t('project.gallery')}</h2>
            {gallery.length ? (
              <div className={styles.gallery}>
                {gallery.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    className={styles.galleryBtn}
                    onClick={() => setLightbox({ open: true, index })}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            ) : (
              <p className={styles.galleryHint}>
                {t('project.galleryHint')}
              </p>
            )}
          </section>

          <div className={catalog.actions}>
            <Link to="/support/projects" className={catalog.btnGhost}>
              {t('project.allProjects')}
            </Link>
            <Link to={getInvolvedHref('expansion')} className={catalog.btn}>
              {t('offer.giveMission')}
            </Link>
          </div>
        </div>
      </div>

      <ImageLightbox
        open={lightbox.open}
        images={gallery}
        index={lightbox.index}
        onClose={() => setLightbox((prev) => ({ ...prev, open: false }))}
        onChangeIndex={(index) => setLightbox((prev) => ({ ...prev, index }))}
      />
    </div>
  )
}
