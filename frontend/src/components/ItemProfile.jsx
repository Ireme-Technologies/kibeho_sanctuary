import { useState } from 'react'
import ImageLightbox from '@components/ui/ImageLightbox'
import styles from './ItemProfile.module.css'

export default function ItemProfile({ image, imageAlt = '', kicker, title, children, footer, extra, gallery = [] }) {
  const photos = (gallery || []).filter(Boolean)
  const [viewer, setViewer] = useState({ open: false, index: 0 })

  return (
    <article className={styles.profile}>
      <div className={`container ${styles.layout} ${image ? '' : styles.layoutText}`}>
        {image ? (
          <figure className={styles.portrait}>
            <img src={image} alt={imageAlt} />
          </figure>
        ) : null}
        <div className={styles.copy}>
          {kicker ? <p className={styles.role}>{kicker}</p> : null}
          {title ? <h1 className={styles.name}>{title}</h1> : null}
          {children}
          {footer ? <div className={styles.actions}>{footer}</div> : null}
        </div>
      </div>
      {photos.length ? (
        <div className={`container ${styles.extra}`}>
          <div className={styles.gallery}>
            {photos.map((src, index) => (
              <button
                key={src}
                type="button"
                className={styles.shot}
                onClick={() => setViewer({ open: true, index })}
                aria-label={`View image ${index + 1} of ${photos.length}`}
              >
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        </div>
      ) : null}
      {extra ? <div className={`container ${styles.extra}`}>{extra}</div> : null}
      <ImageLightbox
        open={viewer.open}
        images={photos}
        index={viewer.index}
        onClose={() => setViewer((prev) => ({ ...prev, open: false }))}
        onChangeIndex={(index) => setViewer((prev) => ({ ...prev, index }))}
      />
    </article>
  )
}

export { styles as itemProfileStyles }
