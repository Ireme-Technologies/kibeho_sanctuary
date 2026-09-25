import { useLocale } from '@context/LocaleContext'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { fetchShrineProject } from '@api/cms'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import ItemProfile, { itemProfileStyles as profile } from '@components/ItemProfile'
import LocalizedLink from '@components/LocalizedLink'
import { getInvolvedHref } from '@utils/giveServices'
import ImageLightbox from '@components/ui/ImageLightbox'
import RichText from '@components/ui/RichText'
import { latestImages } from '@utils/latestImages'
import NotFoundPage from './NotFoundPage'
import catalog from './CatalogPage.module.css'
import styles from './SupportProject.module.css'

function StoryBlock({ title, html }) {
  if (!html) return null
  return (
    <section className={styles.story}>
      <h2>{title}</h2>
      <RichText html={html} />
    </section>
  )
}

export default function SupportProjectDetailPage() {
  const { locale, t } = useLocale()
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

  const photo = item.coverImage || ''
  const gallery = latestImages(item.gallery, { exclude: photo })

  return (
    <div className={catalog.page}>
      <ItemProfile
        image={photo}
        kicker={item.status}
        title={item.title}
        footer={
          <>
            <LocalizedLink to="/support/projects" className={profile.back}>
              {t('project.allProjects')}
            </LocalizedLink>
            <LocalizedLink to={getInvolvedHref('expansion')} className={profile.primary}>
              {t('offer.bePart')}
            </LocalizedLink>
          </>
        }
      >
        <ContentLocaleNotice translations={item.translations} />
        {item.phase ? <p className={profile.meta}>{item.phase}</p> : null}
        {item.description ? <RichText html={item.description} /> : null}
      </ItemProfile>

      <div className={`container ${catalog.body}`}>
        <div className={styles.layout}>
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
            <LocalizedLink to={getInvolvedHref('expansion')} className={catalog.btn}>
              {t('offer.giveMission')}
            </LocalizedLink>
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
