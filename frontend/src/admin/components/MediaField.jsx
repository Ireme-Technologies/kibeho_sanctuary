import { useEffect, useState } from 'react'
import { fetchMedia, uploadMedia } from '@api/cms'
import { compressImageFile, MAX_IMAGE_BYTES } from '@utils/compressImage'
import { confirmDelete } from './confirmDelete'
import styles from '../admin.module.css'

function formatKb(bytes) {
  return `${Math.round(bytes / 1024)}KB`
}

/**
 * Media picker/uploader for images and/or videos.
 * accept: 'image' | 'video' | 'both'
 */
export default function MediaField({
  label,
  value,
  onChange,
  folder = 'uploads',
  accept = 'image',
}) {
  const [library, setLibrary] = useState([])
  const [openLibrary, setOpenLibrary] = useState(false)
  const [error, setError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [notice, setNotice] = useState('')

  const acceptAttr =
    accept === 'video' ? 'video/mp4,video/webm' : accept === 'both' ? 'image/*,video/mp4,video/webm' : 'image/*'

  const filterLibrary = (items) => {
    if (accept === 'video') return items.filter((item) => (item.mime_type || '').startsWith('video/'))
    if (accept === 'both') {
      return items.filter((item) => {
        const mime = item.mime_type || ''
        return mime.startsWith('image/') || mime.startsWith('video/')
      })
    }
    return items.filter((item) => (item.mime_type || '').startsWith('image/'))
  }

  const loadLibrary = async () => {
    const items = await fetchMedia()
    setLibrary(filterLibrary(items))
  }

  useEffect(() => {
    if (openLibrary) loadLibrary().catch((err) => setError(err.message))
  }, [openLibrary])

  const isVideoUrl = (url) => /\.(mp4|webm)(\?|$)/i.test(url || '')

  const handleUpload = async (file) => {
    if (!file) return
    setError('')
    setNotice('')

    const isImage = file.type.startsWith('image/')
    const isVideo = file.type.startsWith('video/')

    if (accept === 'image' && !isImage) {
      setError('Please upload an image file.')
      return
    }
    if (accept === 'video' && !isVideo) {
      setError('Please upload a video file (mp4 or webm).')
      return
    }

    setUploading(true)
    try {
      let uploadFile = file
      let clientOptimized = false
      if (isImage && file.size > MAX_IMAGE_BYTES) {
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
      {value ? (
        <div className={styles.imagePreview}>
          {isVideoUrl(value) ? (
            <video src={value} controls muted playsInline style={{ maxWidth: '100%', maxHeight: 180 }} />
          ) : (
            <img src={value} alt="" />
          )}
          <button
            type="button"
            className={`${styles.btn} ${styles.btnDanger}`}
            onClick={async () => {
              if (!(await confirmDelete('Remove this media?', { confirmLabel: 'Remove' }))) return
              onChange?.('')
            }}
          >
            Remove
          </button>
        </div>
      ) : (
        <p className={styles.muted}>No media selected.</p>
      )}
      <div className={styles.actions}>
        <label className={`${styles.btn} ${styles.btnSecondary}`} style={{ cursor: 'pointer' }}>
          {uploading ? 'Uploading…' : 'Upload new'}
          <input
            type="file"
            accept={acceptAttr}
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
          {library.map((item) => {
            const video = (item.mime_type || '').startsWith('video/')
            return (
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
                {video ? (
                  <span className={styles.muted} style={{ padding: '0.5rem', display: 'block' }}>Video</span>
                ) : (
                  <img src={item.url} alt={item.alt || ''} />
                )}
              </button>
            )
          })}
          {!library.length && <p className={styles.muted}>No matching media in the library yet.</p>}
        </div>
      )}
    </div>
  )
}
