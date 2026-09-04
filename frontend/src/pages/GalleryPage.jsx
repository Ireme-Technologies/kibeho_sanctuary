import { useEffect, useState } from 'react'
import PageHeader from '@components/ui/PageHeader'
import ImageLightbox from '@components/ui/ImageLightbox'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchGallery } from '@api/cms'
import { catalogErrorMessage } from '@api/client'
import styles from './GalleryPage.module.css'

export default function GalleryPage() {
  const { section, resolveHeaderImage } = useContent()
  const { locale, t } = useLocale()
  const hero = section('gallery.hero')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    fetchGallery({ locale })
      .then(setItems)
      .catch((err) => setError(catalogErrorMessage(err)))
  }, [locale])

  return (
    <>
      <PageHeader
        title={hero.title || t('gallery')}
        backgroundImage={resolveHeaderImage(
          hero.backgroundImage,
          '/images/projects/kigali-business-plaza/featured.jpg'
        )}
      />
      <section className={styles.section}>
        <div className="container">
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.grid}>
            {items.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className={styles.card}
                onClick={() => setLightboxIndex(index)}
                aria-label={`View ${item.alt || item.original_name || 'gallery image'}`}
              >
                <img src={item.url} alt={item.alt || item.original_name || t('gallery')} />
              </button>
            ))}
          </div>
          {!items.length && !error && (
            <p className={styles.empty}>{t('galleryEmpty')}</p>
          )}
        </div>
      </section>

      <ImageLightbox
        open={lightboxIndex !== null}
        images={items}
        index={lightboxIndex ?? 0}
        onChangeIndex={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />
    </>
  )
}
