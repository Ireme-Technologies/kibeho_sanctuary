import { useEffect, useState } from 'react'
import {
  deleteMedia,
  fetchMedia,
  fetchSiteAssets,
  reorderMedia,
  replaceMediaFile,
  replaceSiteAsset,
  updateMedia,
  uploadMedia,
} from '@api/cms'
import { useContent } from '@context/ContentContext'
import FlashMessage from './components/FlashMessage'
import styles from './admin.module.css'

const MAX_BYTES = 700 * 1024
const TABS = [
  { id: 'branding', label: 'Logo & brand' },
  { id: 'site', label: 'Site images' },
  { id: 'uploads', label: 'Uploads' },
  { id: 'gallery', label: 'Public gallery' },
]

function ReplaceButton({ onFile, disabled, label = 'Replace' }) {
  return (
    <label className={`${styles.btn} ${styles.btnSecondary}`} style={{ cursor: disabled ? 'default' : 'pointer' }}>
      {disabled ? 'Saving…' : label}
      <input
        type="file"
        accept="image/*"
        hidden
        disabled={disabled}
        onChange={(e) => {
          const file = e.target.files?.[0]
          e.target.value = ''
          if (file) onFile(file)
        }}
      />
    </label>
  )
}

function AssetCard({ item, busy, onReplace }) {
  return (
    <article className={styles.assetCard}>
      <div className={styles.assetPreview}>
        {item.exists === false ? (
          <span className={styles.muted}>Missing file</span>
        ) : (
          <img src={item.preview || item.url} alt="" />
        )}
      </div>
      <div className={styles.assetMeta}>
        <strong>{item.label || item.path}</strong>
        <span className={styles.muted}>{item.hint || item.path}</span>
        {item.size ? <span className={styles.muted}>{Math.round(item.size / 1024)}KB</span> : null}
        <ReplaceButton disabled={busy} onFile={(file) => onReplace(item, file)} />
      </div>
    </article>
  )
}

export default function GalleryAdminPage() {
  const { refresh } = useContent()
  const [tab, setTab] = useState('branding')
  const [items, setItems] = useState([])
  const [branding, setBranding] = useState([])
  const [site, setSite] = useState([])
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [uploading, setUploading] = useState(false)
  const [busyKey, setBusyKey] = useState('')

  const loadUploads = async () => setItems(await fetchMedia())

  const loadAssets = async () => {
    const data = await fetchSiteAssets()
    setBranding(data.branding || [])
    setSite(data.site || [])
  }

  const loadAll = async () => {
    await Promise.all([loadUploads(), loadAssets()])
  }

  useEffect(() => {
    loadAll().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load media' }))
  }, [])

  const galleryItems = [...items]
    .filter((item) => item.show_in_gallery)
    .sort((a, b) => (a.gallery_sort || 0) - (b.gallery_sort || 0))

  const filteredSite = site.filter((item) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (item.path || '').toLowerCase().includes(q) || (item.label || '').toLowerCase().includes(q)
  })

  const filteredUploads = items.filter((item) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      (item.original_name || '').toLowerCase().includes(q) ||
      (item.path || '').toLowerCase().includes(q) ||
      (item.url || '').toLowerCase().includes(q)
    )
  })

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
          await uploadMedia(file, 'gallery', { show_in_gallery: tab === 'gallery' ? 1 : 0 })
          uploaded += 1
        } catch (err) {
          failures.push(err.errors?.file?.[0] || err.message || file.name)
        }
      }
      await loadUploads()

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

  const handleReplaceSite = async (item, file) => {
    setBusyKey(item.role + item.path)
    setFlash({ type: 'success', message: '' })
    try {
      const result = await replaceSiteAsset(file, item.path, item.role || 'site')
      setBranding(result.inventory?.branding || [])
      setSite(result.inventory?.site || [])
      await refresh()
      setFlash({ type: 'success', message: `${item.label || item.path} replaced.` })
    } catch (err) {
      setFlash({ type: 'error', message: err.errors?.file?.[0] || err.errors?.path?.[0] || err.message || 'Replace failed' })
    } finally {
      setBusyKey('')
    }
  }

  const handleReplaceUpload = async (item, file) => {
    setBusyKey(`media-${item.id}`)
    setFlash({ type: 'success', message: '' })
    try {
      await replaceMediaFile(item.id, file)
      await loadUploads()
      await refresh()
      setFlash({ type: 'success', message: 'File replaced. Pages using this URL now show the new image.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.errors?.file?.[0] || err.message || 'Replace failed' })
    } finally {
      setBusyKey('')
    }
  }

  const toggleGallery = async (item) => {
    try {
      await updateMedia(item.id, { show_in_gallery: !item.show_in_gallery })
      await loadUploads()
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
      await loadUploads()
      setFlash({ type: 'success', message: 'Gallery order updated.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to reorder gallery.' })
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this media file permanently?')) return
    try {
      await deleteMedia(id)
      await loadUploads()
      setFlash({ type: 'success', message: 'Media deleted successfully.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete media.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Media library</h1>
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

      <div className={styles.tabs} role="tablist">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`${styles.tab} ${tab === item.id ? styles.tabActive : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'branding' && (
        <div className={styles.card}>
          <h2 style={{ marginTop: 0 }}>Logo, favicon & preloader</h2>
          <p className={styles.muted}>
            Replace these files in place. The preloader and browser tab use them immediately — keep the Kibeho
            Sanctuary brand here, not leftover demo artwork.
          </p>
          <div className={styles.assetGrid}>
            {branding.map((item) => (
              <AssetCard
                key={item.role}
                item={item}
                busy={busyKey === item.role + item.path}
                onReplace={handleReplaceSite}
              />
            ))}
          </div>
        </div>
      )}

      {tab === 'site' && (
        <div className={styles.card}>
          <h2 style={{ marginTop: 0 }}>Seeded & bundled site images</h2>
          <p className={styles.muted}>
            These are the static <code>/images/…</code> files used by seeders and fallbacks. Replacing a file
            updates every page that still points at that path.
          </p>
          <div className={styles.field} style={{ maxWidth: 360, marginBottom: '1rem' }}>
            <label htmlFor="site-search">Filter</label>
            <input
              id="site-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="hero.jpg, sanctuary, lodging…"
            />
          </div>
          <div className={styles.assetGrid}>
            {filteredSite.map((item) => (
              <AssetCard
                key={item.path}
                item={item}
                busy={busyKey === (item.role || 'site') + item.path}
                onReplace={handleReplaceSite}
              />
            ))}
            {!filteredSite.length && <p className={styles.muted}>No matching site images.</p>}
          </div>
        </div>
      )}

      {tab === 'uploads' && (
        <div className={styles.card}>
          <h2 style={{ marginTop: 0 }}>Uploaded media</h2>
          <p className={styles.muted}>
            Replace keeps the same URL so existing pages, news, and galleries update without editing each record.
          </p>
          <div className={styles.field} style={{ maxWidth: 360, marginBottom: '1rem' }}>
            <label htmlFor="upload-search">Filter</label>
            <input
              id="upload-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="filename or folder…"
            />
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Size</th>
                <th>In gallery</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {filteredUploads.map((item) => (
                <tr key={item.id}>
                  <td>
                    {(item.mime_type || '').startsWith('image/') ? (
                      <img className={styles.thumb} src={item.url} alt="" />
                    ) : (
                      '—'
                    )}
                  </td>
                  <td>
                    <div>{item.original_name || item.path}</div>
                    <div className={styles.muted} style={{ fontSize: '0.78rem' }}>
                      {item.url}
                    </div>
                  </td>
                  <td>{Math.round((item.size || 0) / 1024)}KB</td>
                  <td>{item.show_in_gallery ? 'Yes' : 'No'}</td>
                  <td className={styles.actions}>
                    <ReplaceButton
                      disabled={busyKey === `media-${item.id}`}
                      onFile={(file) => handleReplaceUpload(item, file)}
                    />
                    <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => toggleGallery(item)}>
                      {item.show_in_gallery ? 'Hide' : 'Show in gallery'}
                    </button>
                    <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {!filteredUploads.length && (
                <tr>
                  <td colSpan={5} className={styles.muted}>
                    No uploaded media yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {tab === 'gallery' && (
        <div className={styles.card}>
          <h2 style={{ marginTop: 0 }}>Public gallery order</h2>
          <p className={styles.muted}>
            Images marked “show in gallery” appear on the public gallery page. For YouTube videos, use{' '}
            <strong>Admin → Videos (YouTube)</strong>.
          </p>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Sort</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {galleryItems.map((item) => (
                <tr key={item.id}>
                  <td>
                    <img className={styles.thumb} src={item.url} alt="" />
                  </td>
                  <td>{item.original_name || item.path}</td>
                  <td>{item.gallery_sort}</td>
                  <td className={styles.actions}>
                    <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => move(item.id, -1)}>
                      Up
                    </button>
                    <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => move(item.id, 1)}>
                      Down
                    </button>
                    <ReplaceButton
                      disabled={busyKey === `media-${item.id}`}
                      onFile={(file) => handleReplaceUpload(item, file)}
                    />
                    <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => toggleGallery(item)}>
                      Hide from gallery
                    </button>
                  </td>
                </tr>
              ))}
              {!galleryItems.length && (
                <tr>
                  <td colSpan={4} className={styles.muted}>
                    No gallery images yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
