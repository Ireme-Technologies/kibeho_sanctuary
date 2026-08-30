import { useEffect, useState } from 'react'
import {
  deleteAllSiteAssets,
  deleteMedia,
  deleteSiteAsset,
  fetchMedia,
  fetchMediaUsage,
  fetchSiteAssetUsage,
  fetchSiteAssets,
  reorderMedia,
  replaceMediaFile,
  replaceSiteAsset,
  updateMedia,
  uploadMedia,
} from '@api/cms'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import FlashMessage from './components/FlashMessage'
import LocaleTabs from './components/LocaleTabs'
import Modal from './components/Modal'
import { confirmDelete, confirmPermanentDelete } from './components/confirmDelete'
import styles from './admin.module.css'

const isImage = (item) => (item.mime_type || '').startsWith('image/')

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

function AssetCard({ item, busy, onReplace, onRemove, removeLabel = 'Remove' }) {
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
        <div className={styles.assetActions}>
          <ReplaceButton disabled={busy} onFile={(file) => onReplace(item, file)} />
          {onRemove ? (
            <button
              type="button"
              className={`${styles.btn} ${styles.btnDanger}`}
              disabled={busy}
              onClick={() => onRemove(item)}
            >
              {removeLabel}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default function GalleryAdminPage() {
  const { refresh } = useContent()
  const { defaultLocale, workspaceLocales } = useLocale()
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
  const [pickerOpen, setPickerOpen] = useState(false)
  const [pickerSelected, setPickerSelected] = useState(() => new Set())
  const [altEditor, setAltEditor] = useState(null)
  const [altLocale, setAltLocale] = useState(defaultLocale || 'en')
  const [altSaving, setAltSaving] = useState(false)

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

  const imageUploads = items.filter(isImage)
  const filteredImageUploads = imageUploads.filter((item) => {
    if (!query.trim()) return true
    const q = query.toLowerCase()
    return (
      (item.original_name || '').toLowerCase().includes(q) ||
      (item.path || '').toLowerCase().includes(q) ||
      (item.url || '').toLowerCase().includes(q)
    )
  })
  const pickerCandidates = imageUploads.filter((item) => !item.show_in_gallery)

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
          await uploadMedia(file, tab === 'gallery' ? 'gallery' : 'uploads', {
            show_in_gallery: tab === 'gallery' ? 1 : 0,
          })
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

  const applyInventory = (inventory) => {
    if (!inventory) return
    setBranding(inventory.branding || [])
    setSite(inventory.site || [])
  }

  const handleRemoveSite = async (item) => {
    const key = (item.role || 'site') + item.path
    setBusyKey(key)
    setFlash({ type: 'success', message: '' })
    try {
      const data = await fetchSiteAssetUsage(item.path)
      if (
        !(await confirmPermanentDelete({
          name: item.label || item.path,
          usages: data.usages || [],
        }))
      ) {
        return
      }
      const result = await deleteSiteAsset(item.path)
      applyInventory(result.inventory)
      await refresh()
      if (result.deleted === false || result.pending) {
        setFlash({
          type: 'error',
          message:
            result.message ||
            `${item.label || item.path} is marked removed but the live file could not be deleted yet.`,
        })
      } else {
        setFlash({ type: 'success', message: `${item.label || item.path} removed.` })
      }
    } catch (err) {
      setFlash({
        type: 'error',
        message: err.errors?.path?.[0] || err.message || 'Could not remove this image.',
      })
    } finally {
      setBusyKey('')
    }
  }

  const handleRemoveAllSite = async () => {
    const count = site.length
    if (!count) return
    if (
      !(await confirmDelete(
        `Remove all ${count} bundled site images? Logo, brand files, and uploaded photos stay. Content that pointed at these files will be cleared until you upload new photos.`,
        {
          confirmLabel: 'Remove all',
          title: 'Remove all site images',
          finalMessage: 'This permanently deletes the bundled photos from the server. Continue?',
        }
      ))
    ) {
      return
    }
    setBusyKey('site-all')
    setFlash({ type: 'success', message: '' })
    try {
      const result = await deleteAllSiteAssets()
      applyInventory(result.inventory)
      await refresh()
      const n = result.removed ?? count
      if (result.pending) {
        setFlash({
          type: 'error',
          message:
            result.message ||
            `${n} marked removed, but ${result.pending} file(s) could not be deleted from the live folder yet.`,
        })
      } else {
        setFlash({
          type: 'success',
          message: n === 1 ? '1 site image removed.' : `${n} site images removed.`,
        })
      }
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to remove site images.' })
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

  const togglePickerItem = (id) => {
    setPickerSelected((current) => {
      const next = new Set(current)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const addFromLibrary = async () => {
    const ids = [...pickerSelected]
    if (!ids.length) return
    setBusyKey('gallery-add')
    try {
      for (const id of ids) {
        await updateMedia(id, { show_in_gallery: true })
      }
      await loadUploads()
      setPickerOpen(false)
      setPickerSelected(new Set())
      setFlash({
        type: 'success',
        message: ids.length === 1 ? 'Image added to the public gallery.' : `${ids.length} images added to the public gallery.`,
      })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to add images to the gallery.' })
    } finally {
      setBusyKey('')
    }
  }

  const openAltEditor = (item) => {
    setAltEditor({
      id: item.id,
      name: item.original_name || item.path,
      alt: item.alt || '',
      translations: item.translations || {},
    })
    setAltLocale(defaultLocale || 'en')
  }

  const setAltField = (value) => {
    setAltEditor((current) => {
      if (!current) return current
      if (altLocale === (defaultLocale || 'en')) {
        return { ...current, alt: value }
      }
      return {
        ...current,
        translations: {
          ...(current.translations || {}),
          [altLocale]: {
            ...(current.translations?.[altLocale] || {}),
            alt: value,
          },
        },
      }
    })
  }

  const currentAltValue =
    altEditor &&
    (altLocale === (defaultLocale || 'en')
      ? altEditor.alt || ''
      : altEditor.translations?.[altLocale]?.alt || '')

  const saveAltEditor = async () => {
    if (!altEditor) return
    setAltSaving(true)
    try {
      await updateMedia(altEditor.id, {
        alt: altEditor.alt || null,
        translations: altEditor.translations || {},
      })
      await loadUploads()
      setAltEditor(null)
      setFlash({ type: 'success', message: 'Alt text saved for all languages.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to save alt text.' })
    } finally {
      setAltSaving(false)
    }
  }

  const handleDelete = async (item) => {
    setBusyKey(`media-${item.id}`)
    setFlash({ type: 'success', message: '' })
    try {
      const data = await fetchMediaUsage(item.id)
      if (
        !(await confirmPermanentDelete({
          name: item.original_name || item.path,
          usages: data.usages || [],
        }))
      ) {
        return
      }
      await deleteMedia(item.id)
      await loadUploads()
      setFlash({ type: 'success', message: 'Image deleted permanently.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete media.' })
    } finally {
      setBusyKey('')
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Media library</h1>
        <label className={styles.btn} style={{ cursor: uploading ? 'default' : 'pointer' }}>
          {uploading ? 'Uploading…' : tab === 'gallery' ? 'Upload to gallery' : 'Upload images'}
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
          <div className={styles.topbar} style={{ marginBottom: '0.75rem' }}>
            <h2 style={{ margin: 0 }}>All site images</h2>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnDanger}`}
              disabled={!site.length || busyKey === 'site-all'}
              onClick={handleRemoveAllSite}
            >
              {busyKey === 'site-all' ? 'Removing…' : 'Remove all bundled images'}
            </button>
          </div>
          <p className={styles.muted}>
            Every photo lives here: uploaded files and bundled <code>/images/…</code> files. Removing an
            image here deletes it permanently after you review where it is used. To hide a photo from the
            public gallery without deleting it, use the <strong>Public gallery</strong> tab.
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

          <h3>Uploaded photos</h3>
          <p className={styles.muted}>These are the files in your media library. Delete only after replacing any live uses.</p>
          <div className={styles.assetGrid}>
            {filteredImageUploads.map((item) => (
              <AssetCard
                key={`upload-${item.id}`}
                item={{
                  role: 'upload',
                  label: item.original_name || item.path,
                  hint: item.show_in_gallery ? 'Uploaded · also in public gallery' : 'Uploaded library',
                  path: item.path,
                  url: item.url,
                  preview: item.url,
                  exists: true,
                  size: item.size,
                }}
                busy={busyKey === `media-${item.id}` || busyKey === 'site-all'}
                onReplace={(_card, file) => handleReplaceUpload(item, file)}
                onRemove={() => handleDelete(item)}
                removeLabel="Delete"
              />
            ))}
            {!filteredImageUploads.length && <p className={styles.muted}>No uploaded photos yet.</p>}
          </div>

          <h3 style={{ marginTop: '1.75rem' }}>Bundled /images files</h3>
          <p className={styles.muted}>
            Static files used by seeders and fallbacks. Logo and brand files stay on the Logo & brand tab.
            Removals are stored on the server so the next deploy will not copy these files back.
          </p>
          <div className={styles.assetGrid}>
            {filteredSite.map((item) => (
              <AssetCard
                key={item.path}
                item={item}
                busy={busyKey === (item.role || 'site') + item.path || busyKey === 'site-all'}
                onReplace={handleReplaceSite}
                onRemove={handleRemoveSite}
                removeLabel="Delete"
              />
            ))}
            {!filteredSite.length && <p className={styles.muted}>No matching bundled site images.</p>}
          </div>
        </div>
      )}

      {tab === 'uploads' && (
        <div className={styles.card}>
          <h2 style={{ marginTop: 0 }}>Uploaded media</h2>
          <p className={styles.muted}>
            This is the full library. Replace keeps the same URL so existing pages update. Add a photo to the
            public gallery here, or open <strong>Public gallery</strong>. Permanent delete is on{' '}
            <strong>Site images</strong>, after a check of where the file is used.
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
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      onClick={() => openAltEditor(item)}
                    >
                      Edit alt
                    </button>
                    <ReplaceButton
                      disabled={busyKey === `media-${item.id}`}
                      onFile={(file) => handleReplaceUpload(item, file)}
                    />
                    <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => toggleGallery(item)}>
                      {item.show_in_gallery ? 'Hide from gallery' : 'Add to gallery'}
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
          <div className={styles.topbar} style={{ marginBottom: '0.75rem' }}>
            <h2 style={{ margin: 0 }}>Public gallery</h2>
            <div className={styles.assetActions}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => {
                  setPickerSelected(new Set())
                  setPickerOpen(true)
                }}
              >
                Add from library
              </button>
              <label className={styles.btn} style={{ cursor: uploading ? 'default' : 'pointer' }}>
                {uploading ? 'Uploading…' : 'Upload new'}
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
          </div>
          <p className={styles.muted}>
            This list is what visitors see on <code>/gallery</code>. Removing an image here only hides it — the
            file stays in Uploads and Site images. For YouTube videos, use <strong>Admin → Videos (YouTube)</strong>.
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
                  <td>
                    <div>{item.original_name || item.path}</div>
                    {item.alt ? (
                      <div className={styles.muted} style={{ fontSize: '0.78rem' }}>
                        Alt: {item.alt}
                      </div>
                    ) : (
                      <div className={styles.muted} style={{ fontSize: '0.78rem' }}>
                        No alt text yet
                      </div>
                    )}
                  </td>
                  <td>{item.gallery_sort}</td>
                  <td className={styles.actions}>
                    <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => move(item.id, -1)}>
                      Up
                    </button>
                    <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => move(item.id, 1)}>
                      Down
                    </button>
                    <button
                      type="button"
                      className={`${styles.btn} ${styles.btnSecondary}`}
                      onClick={() => openAltEditor(item)}
                    >
                      Edit alt
                    </button>
                    <ReplaceButton
                      disabled={busyKey === `media-${item.id}`}
                      onFile={(file) => handleReplaceUpload(item, file)}
                    />
                    <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => toggleGallery(item)}>
                      Remove from gallery
                    </button>
                  </td>
                </tr>
              ))}
              {!galleryItems.length && (
                <tr>
                  <td colSpan={4} className={styles.muted}>
                    No gallery images yet. Add photos from the library or upload new ones.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={pickerOpen}
        wide
        title="Add images to the public gallery"
        onClose={() => {
          setPickerOpen(false)
          setPickerSelected(new Set())
        }}
      >
        <p className={styles.muted}>
          Choose photos already in the library. They stay in Uploads and Site images if you later remove them
          from the gallery.
        </p>
        {pickerCandidates.length ? (
          <div className={styles.mediaGrid} style={{ maxHeight: 360 }}>
            {pickerCandidates.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`${styles.mediaThumb} ${pickerSelected.has(item.id) ? styles.mediaThumbActive : ''}`}
                onClick={() => togglePickerItem(item.id)}
                title={item.original_name || item.path}
              >
                <img src={item.url} alt="" />
              </button>
            ))}
          </div>
        ) : (
          <p className={styles.muted}>All uploaded images are already in the gallery, or none have been uploaded yet.</p>
        )}
        <div className={styles.assetActions} style={{ marginTop: '1rem' }}>
          <button
            type="button"
            className={styles.btn}
            disabled={!pickerSelected.size || busyKey === 'gallery-add'}
            onClick={addFromLibrary}
          >
            {busyKey === 'gallery-add'
              ? 'Adding…'
              : pickerSelected.size
                ? `Add ${pickerSelected.size} to gallery`
                : 'Add to gallery'}
          </button>
        </div>
      </Modal>

      <Modal
        open={Boolean(altEditor)}
        title={altEditor ? `Alt text — ${altEditor.name}` : 'Alt text'}
        onClose={() => !altSaving && setAltEditor(null)}
      >
        <p className={styles.muted}>
          Describe the image for accessibility. Add a translation for each language so the gallery
          can show the right alt text when visitors switch language.
        </p>
        <LocaleTabs
          value={altLocale}
          onChange={setAltLocale}
          defaultLocale={defaultLocale || 'en'}
          locales={workspaceLocales}
          form={altEditor}
          setForm={setAltEditor}
          fields={['alt']}
        />
        <div className={styles.field} style={{ marginTop: '1rem' }}>
          <label htmlFor="media-alt">Alt text</label>
          <input
            id="media-alt"
            value={currentAltValue || ''}
            onChange={(e) => setAltField(e.target.value)}
            placeholder="Short description of the image"
          />
        </div>
        <div className={styles.assetActions} style={{ marginTop: '1rem' }}>
          <button type="button" className={styles.btn} disabled={altSaving} onClick={saveAltEditor}>
            {altSaving ? 'Saving…' : 'Save alt text'}
          </button>
          <button
            type="button"
            className={`${styles.btn} ${styles.btnSecondary}`}
            disabled={altSaving}
            onClick={() => setAltEditor(null)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  )
}
