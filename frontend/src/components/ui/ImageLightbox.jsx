import { useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import styles from './ImageLightbox.module.css'

/**
 * Normalize mixed image inputs into { src, alt }[].
 * Accepts string URLs or objects with url/src/alt.
 */
export function normalizeLightboxImages(images = []) {
  return (images || [])
    .map((item) => {
      if (!item) return null
      if (typeof item === 'string') return { src: item, alt: '' }
      const src = item.src || item.url || ''
      if (!src) return null
      return {
        src,
        alt: item.alt || item.original_name || item.caption || '',
      }
    })
    .filter(Boolean)
}

export default function ImageLightbox({
  open,
  images = [],
  index = 0,
  onClose,
  onChangeIndex,
}) {
  const items = normalizeLightboxImages(images)
  const hasMultiple = items.length > 1
  const safeIndex = items.length ? ((index % items.length) + items.length) % items.length : 0
  const current = items[safeIndex]

  const goTo = useCallback(
    (nextIndex) => {
      if (!items.length) return
      const normalized = ((nextIndex % items.length) + items.length) % items.length
      onChangeIndex?.(normalized)
    },
    [items.length, onChangeIndex]
  )

  const goPrev = useCallback(() => goTo(safeIndex - 1), [goTo, safeIndex])
  const goNext = useCallback(() => goTo(safeIndex + 1), [goTo, safeIndex])

  useEffect(() => {
    if (!open) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
      if (e.key === 'ArrowLeft') goPrev()
      if (e.key === 'ArrowRight') goNext()
    }

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, goPrev, goNext])

  if (!open || !current) return null

  return createPortal(
    <div
      className={styles.overlay}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-label={current.alt || 'Image viewer'}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close image viewer"
        >
          <X size={22} />
        </button>

        <div className={styles.stage}>
          {hasMultiple && (
            <button
              type="button"
              className={`${styles.navBtn} ${styles.navPrev}`}
              onClick={goPrev}
              aria-label="Previous image"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          <img
            key={current.src + safeIndex}
            src={current.src}
            alt={current.alt || ''}
            className={styles.image}
          />

          {hasMultiple && (
            <button
              type="button"
              className={`${styles.navBtn} ${styles.navNext}`}
              onClick={goNext}
              aria-label="Next image"
            >
              <ChevronRight size={28} />
            </button>
          )}
        </div>

        <div className={styles.footer}>
          {current.alt ? <p className={styles.caption}>{current.alt}</p> : <span />}
          {hasMultiple && (
            <span className={styles.counter} aria-live="polite">
              {safeIndex + 1} / {items.length}
            </span>
          )}
        </div>
      </div>
    </div>,
    document.body
  )
}
