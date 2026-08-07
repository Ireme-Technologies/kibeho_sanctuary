import { useEffect, useState } from 'react'
import { deleteMedia, fetchMedia, reorderMedia, updateMedia, uploadMedia } from '@api/cms'
import FlashMessage from './components/FlashMessage'
import styles from './admin.module.css'

const MAX_BYTES = 700 * 1024

export default function GalleryAdminPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [uploading, setUploading] = useState(false)

  const load = async () => setItems(await fetchMedia())

  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load media' }))
  }, [])

  const galleryItems = [...items]
    .filter((item) => item.show_in_gallery)
    .sort((a, b) => (a.gallery_sort || 0) - (b.gallery_sort || 0))

  const handleUpload = async (fileList) => {
    const files = Array.from(fileList || []).filter(Boolean)
    if (!files.length) return

    setError('')
    setNotice('')
    setFlash({ type: 'success', message: '' })

    const largeCount = files.filter((file) => file.size > MAX_BYTES).length
    if (largeCount) {
      setNotice(
        largeCount === 1
          ? 'One large image will be compressed under 700KB.'
          : `${largeCount} large images will be compressed under 700KB.`
      )
    }

    setUploading(true)
    let uploaded = 0
    const failures = []

    try {
      for (const file of files) {
        try {
          await uploadMedia(file, 'gallery', { show_in_gallery: 1 })
          uploaded += 1
        } catch (err) {
          failures.push(err.errors?.file?.[0] || err.message || file.name)
        }
      }
      await load()

      if (uploaded && !failures.length) {
        setFlash({
          type: 'success',
          message: uploaded === 1 ? 'Image uploaded successfully.' : `${uploaded} images uploaded successfully.`,
        })
      } else if (uploaded && failures.length) {
        setFlash({
          type: 'error',
          message: `${uploaded} uploaded, ${failures.length} failed. ${failures[0]}`,
        })
        setError(failures.join(' '))
      } else {
        const message = failures[0] || 'Upload failed'
        setError(message)
        setFlash({ type: 'error', message })
      }
    } finally {
      setUploading(false)
    }
  }

  const toggleGallery = async (item) => {
    try {
      await updateMedia(item.id, { show_in_gallery: !item.show_in_gallery })
      await load()
      setFlash({
        type: 'success',
        message: item.show_in_gallery ? 'Image hidden from public gallery.' : 'Image added to public gallery.',
      })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to update gallery visibility.' })
    }
  }

  const move = async (id, direction) => {
    const ordered = galleryItems.map((item) => item.id)
    const index = ordered.indexOf(id)
    const next = index + direction
    if (index < 0 || next < 0 || next >= ordered.length) return
    ;[ordered[index], ordered[next]] = [ordered[next], ordered[index]]
    try {
      await reorderMedia(ordered)
      await load()
      setFlash({ type: 'success', message: 'Gallery order updated.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to reorder gallery.' })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this media file permanently?')) return
    try {
      await deleteMedia(id)
      await load()
      setFlash({ type: 'success', message: 'Media deleted successfully.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete media.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Gallery / Media</h1>
        <label className={styles.btn} style={{ cursor: uploading ? 'default' : 'pointer' }}>
          {uploading ? 'Uploading…' : 'Upload images'}
          <input
            type="file"
            accept="image/*"
            multiple
            hidden
            disabled={uploading}
            onChange={(e) => {
              handleUpload(e.target.files)
              e.target.value = ''
            }}
          />
        </label>
      </div>
      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />
      {notice && <p className={styles.muted}>{notice}</p>}
      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.card} style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ marginTop: 0 }}>Public gallery order</h2>
        <p className={styles.muted}>
          Select multiple images when uploading — they are added in one step. For YouTube videos, use{' '}
          <strong>Admin → Videos (YouTube)</strong> so visitors can watch on-site or on YouTube.
        </p>
        <table className={styles.table}>
          <thead>
            <tr><th>Image</th><th>Name</th><th>Sort</th><th /></tr>
          </thead>
          <tbody>
            {galleryItems.map((item) => (
              <tr key={item.id}>
                <td><img className={styles.thumb} src={item.url} alt="" /></td>
                <td>{item.original_name || item.path}</td>
                <td>{item.gallery_sort}</td>
                <td className={styles.actions}>
                  <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => move(item.id, -1)}>Up</button>
                  <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => move(item.id, 1)}>Down</button>
                  <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => toggleGallery(item)}>Hide from gallery</button>
                </td>
              </tr>
            ))}
            {!galleryItems.length && (
              <tr><td colSpan={4} className={styles.muted}>No gallery images yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className={styles.card}>
        <h2 style={{ marginTop: 0 }}>All media</h2>
        <table className={styles.table}>
          <thead>
            <tr><th>Image</th><th>Name</th><th>Size</th><th>In gallery</th><th /></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{(item.mime_type || '').startsWith('image/') ? <img className={styles.thumb} src={item.url} alt="" /> : '—'}</td>
                <td>{item.original_name || item.path}</td>
                <td>{Math.round((item.size || 0) / 1024)}KB</td>
                <td>{item.show_in_gallery ? 'Yes' : 'No'}</td>
                <td className={styles.actions}>
                  <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => toggleGallery(item)}>
                    {item.show_in_gallery ? 'Hide' : 'Show in gallery'}
                  </button>
                  <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
