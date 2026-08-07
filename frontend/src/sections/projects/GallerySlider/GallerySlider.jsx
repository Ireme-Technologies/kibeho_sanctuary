import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ImageLightbox from '@components/ui/ImageLightbox'
import styles from './GallerySlider.module.css'

export default function GallerySlider({ images, title }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  if (!images?.length) return null

  const hasMultiple = images.length > 1

  const goPrev = () => setActiveIndex((i) => (i - 1 + images.length) % images.length)
  const goNext = () => setActiveIndex((i) => (i + 1) % images.length)

  return (
    <div className={styles.slider}>
      <div className={styles.mainFrame}>
        <button
          type="button"
          className={styles.mainImageBtn}
          onClick={() => setLightboxOpen(true)}
          aria-label={`Open ${title} gallery image ${activeIndex + 1}`}
        >
          <img
            key={activeIndex}
            src={images[activeIndex]}
            alt={`${title} gallery image ${activeIndex + 1}`}
            className={styles.mainImage}
            loading="lazy"
          />
        </button>

        {hasMultiple && (
          <>
            <button
              type="button"
              className={`${styles.navBtn} ${styles.navBtnPrev}`}
              onClick={goPrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className={`${styles.navBtn} ${styles.navBtnNext}`}
              onClick={goNext}
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>

            <span className={styles.counter} aria-hidden="true">
              {activeIndex + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className={styles.thumbStrip} role="group" aria-label={`${title} gallery thumbnails`}>
          {images.map((image, i) => (
            <button
              key={image}
              type="button"
              aria-pressed={i === activeIndex}
              aria-label={`View image ${i + 1}`}
              className={`${styles.thumb} ${i === activeIndex ? styles.thumbActive : ''}`}
              onClick={() => setActiveIndex(i)}
              onDoubleClick={() => {
                setActiveIndex(i)
                setLightboxOpen(true)
              }}
            >
              <img src={image} alt="" className={styles.thumbImage} loading="lazy" />
            </button>
          ))}
        </div>
      )}

      <ImageLightbox
        open={lightboxOpen}
        images={images}
        index={activeIndex}
        onChangeIndex={setActiveIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  )
}
