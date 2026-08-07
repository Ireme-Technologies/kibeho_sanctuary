import { useEffect, useState } from 'react'
import PageHeader from '@components/ui/PageHeader'
import ImageLightbox from '@components/ui/ImageLightbox'
import { useContent } from '@context/ContentContext'
import { fetchGallery } from '@api/cms'
import styles from './GalleryPage.module.css'

export default function GalleryPage() {
  const { section, resolveHeaderImage } = useContent()
  const hero = section('gallery.hero')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    fetchGallery()
      .then(setItems)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <>
      <PageHeader
        title={hero.title || 'Gallery'}
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
                <img src={item.url} alt={item.alt || item.original_name || 'Gallery image'} />
              </button>
            ))}
          </div>
          {!items.length && !error && (
            <p className={styles.empty}>Gallery images will appear here once published from the admin.</p>
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
