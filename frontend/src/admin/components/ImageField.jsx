import { useEffect, useState } from 'react'
import { fetchMedia, uploadMedia } from '@api/cms'
import { compressImageFile, MAX_IMAGE_BYTES } from '@utils/compressImage'
import { confirmDelete } from './confirmDelete'
import styles from '../admin.module.css'

function formatKb(bytes) {
  return `${Math.round(bytes / 1024)}KB`
}

export default function ImageField({ label, value, onChange, folder = 'uploads', hidePreview = false }) {
  const [library, setLibrary] = useState([])
  const [openLibrary, setOpenLibrary] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState('')

  const loadLibrary = async () => {
    const items = await fetchMedia()
    setLibrary(items.filter((item) => (item.mime_type || '').startsWith('image/')))
  }

  useEffect(() => {
    if (openLibrary) loadLibrary().catch((err) => setError(err.message))
  }, [openLibrary])

  const handleUpload = async (file) => {
    if (!file) return
    setError('')
    setNotice('')

    setUploading(true)
    try {
      let uploadFile = file
      let clientOptimized = false
      if (file.type.startsWith('image/') && file.size > MAX_IMAGE_BYTES) {
        setNotice(`Image is ${formatKb(file.size)}. Compressing to stay under 700KB…`)
        const compressed = await compressImageFile(file)
        uploadFile = compressed.file
        clientOptimized = compressed.optimized
      }

      const result = await uploadMedia(uploadFile, folder)
      onChange?.(result.url)
      if (result.optimized || clientOptimized) setNotice('Image was compressed to stay under 700KB.')
      else setNotice('')
    } catch (err) {
      setError(err.errors?.file?.[0] || err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className={styles.field}>
      <label>{label}</label>
      {!hidePreview && value ? (
        <div className={styles.imagePreview}>
          <img src={value} alt="" />
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={async () => {
              if (!(await confirmDelete('Remove this image?', { confirmLabel: 'Remove' }))) return
              onChange?.('')
            }}
          >
            Remove
          </button>
        </div>
      ) : null}
      {hidePreview && value ? (
        <div className={styles.actions}>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={async () => {
              if (!(await confirmDelete('Clear this image?', { confirmLabel: 'Remove' }))) return
              onChange?.('')
            }}
          >
            Clear image
          </button>
        </div>
      ) : null}
      {!value ? (
        <p className={styles.muted}>No image selected. Upload a new file or choose from the media library.</p>
      ) : null}
      <div className={styles.actions}>
        <label className={`${styles.btn} ${styles.btnSecondary}`} style={{ cursor: 'pointer' }}>
          {uploading ? 'Uploading…' : 'Upload new'}
          <input
            type="file"
            accept="image/*"
            hidden
            disabled={uploading}
            onChange={(e) => handleUpload(e.target.files?.[0])}
          />
        </label>
        <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setOpenLibrary((v) => !v)}>
          {openLibrary ? 'Hide library' : 'Choose existing'}
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
              className={`${styles.mediaThumb} ${value === item.url ? styles.mediaThumbActive : ''}`}
              onClick={() => {
                onChange?.(item.url)
                setOpenLibrary(false)
              }}
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
