import { useEffect, useState } from 'react'
import { fetchMedia, uploadMedia } from '@api/cms'
import { confirmDelete } from './confirmDelete'
import styles from '../admin.module.css'

const MAX_BYTES = 700 * 1024

function formatKb(bytes) {
  return `${Math.round(bytes / 1024)}KB`
}

/**
 * Multi-image field: upload several files at once and/or pick from the media library.
 * value: string[] of image URLs
 */
export default function MultiImageField({
  label,
  value = [],
  onChange,
  folder = 'uploads',
}) {
  const urls = Array.isArray(value) ? value.filter(Boolean) : []
  const [library, setLibrary] = useState([])
  const [openLibrary, setOpenLibrary] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [uploading, setUploading] = useState(false)

  const loadLibrary = async () => {
    const items = await fetchMedia()
    setLibrary(items.filter((item) => (item.mime_type || '').startsWith('image/')))
  }

  useEffect(() => {
    if (openLibrary) loadLibrary().catch((err) => setError(err.message))
  }, [openLibrary])

  const setUrls = (next) => onChange?.(next)

  const handleUploadMany = async (fileList) => {
    const files = Array.from(fileList || []).filter(Boolean)
    if (!files.length) return
    setError('')
    setNotice('')
    const large = files.filter((f) => f.size > MAX_BYTES).length
    if (large) {
      setNotice(
        large === 1
          ? 'One large image will be compressed under 700KB.'
          : `${large} large images will be compressed under 700KB.`
      )
    }
    setUploading(true)
    const added = []
    const failures = []
    try {
      for (const file of files) {
        try {
          const result = await uploadMedia(file, folder)
          if (result?.url) added.push(result.url)
        } catch (err) {
          failures.push(err.errors?.file?.[0] || err.message || file.name)
        }
      }
      if (added.length) setUrls([...urls, ...added])
      if (failures.length) setError(failures.join(' '))
      else if (added.length) setNotice(`${added.length} image(s) added.`)
    } finally {
      setUploading(false)
    }
  }

  const removeAt = (index) => setUrls(urls.filter((_, i) => i !== index))

  const move = (index, dir) => {
    const next = index + dir
    if (next < 0 || next >= urls.length) return
    const copy = [...urls]
    ;[copy[index], copy[next]] = [copy[next], copy[index]]
    setUrls(copy)
  }

  const toggleLibraryItem = (url) => {
    if (urls.includes(url)) setUrls(urls.filter((u) => u !== url))
    else setUrls([...urls, url])
  }

  return (
    <div className={styles.field}>
      <label>{label}</label>
      {urls.length ? (
        <div className={styles.multiImageList}>
          {urls.map((url, index) => (
            <div key={`${url}-${index}`} className={styles.multiImageItem}>
              <div className={styles.multiImagePreview}>
                <img src={url} alt="" />
                <span className={styles.multiImageIndex}>{index + 1}</span>
              </div>
              <div className={styles.multiImageActions}>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary} ${styles.btnCompact}`}
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  title="Move earlier"
                  aria-label="Move earlier"
                >
                  ↑
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary} ${styles.btnCompact}`}
                  onClick={() => move(index, 1)}
                  disabled={index === urls.length - 1}
                  title="Move later"
                  aria-label="Move later"
                >
                  ↓
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnDanger} ${styles.btnCompact}`}
                  onClick={async () => {
                    if (!(await confirmDelete('Remove this image?', { confirmLabel: 'Remove' }))) return
                    removeAt(index)
                  }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className={styles.muted}>No images yet. Upload several at once or choose from the library.</p>
      )}

      <div className={styles.actions}>
        <label className={`${styles.btn} ${styles.btnSecondary}`} style={{ cursor: 'pointer' }}>
          {uploading ? 'Uploading…' : 'Upload images'}
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={uploading}
            onChange={(e) => {
              handleUploadMany(e.target.files)
              e.target.value = ''
            }}
          />
        </label>
        <button
          type="button"
          className={`${styles.btn} ${styles.btnSecondary}`}
          onClick={() => setOpenLibrary((v) => !v)}
        >
          {openLibrary ? 'Hide library' : 'Choose from library'}
        </button>
      </div>
      {notice && <p className={styles.muted}>{notice}</p>}
      {error && <p className={styles.error}>{error}</p>}
      {openLibrary && (
        <div className={styles.mediaGrid}>
          {library.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`${styles.mediaThumb} ${urls.includes(item.url) ? styles.mediaThumbActive : ''}`}
              onClick={() => toggleLibraryItem(item.url)}
              title={item.original_name || item.url}
            >
              <img src={item.url} alt={item.alt || ''} />
            </button>
          ))}
          {!library.length && <p className={styles.muted}>No images in the library yet.</p>}
        </div>
      )}
    </div>
  )
}
