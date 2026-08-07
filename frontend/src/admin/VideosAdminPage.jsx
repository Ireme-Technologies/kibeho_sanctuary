import { useEffect, useState } from 'react'
import {
  createVideo,
  deleteVideo,
  fetchVideos,
  reorderVideos,
  updateVideo,
} from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import Modal from './components/Modal'
import ImageField from './components/ImageField'
import RichTextEditor from './components/RichTextEditor'
import FlashMessage from './components/FlashMessage'
import LocaleTabs, { getLocaleField, setLocaleField, splitTranslationsPayload } from './components/LocaleTabs'
import { parseYoutubeId, youtubeThumbUrl } from '@utils/youtube'
import styles from './admin.module.css'

const LOCALE_FIELDS = ['title', 'description']

const empty = {
  title: '',
  description: '',
  youtube_url: '',
  thumbnail_url: '',
  sort_order: 0,
  is_published: true,
  published_at: '',
  translations: {},
}

export default function VideosAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchVideos())
  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load videos' }))
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(empty)
    setLocaleTab(defaultLocale || 'en')
    setError('')
    setOpen(true)
  }

  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({
      title: item.title || '',
      description: item.description || '',
      youtube_url: item.youtubeUrl || '',
      thumbnail_url: item.thumbnailUrl || '',
      sort_order: item.sortOrder ?? 0,
      is_published: item.isPublished !== false,
      published_at: item.publishedAt || '',
      translations: item.translations || {},
    })
    setLocaleTab(defaultLocale || 'en')
    setError('')
    setOpen(true)
  }

  const buildPayload = () => {
    const { translations: _t, ...rest } = form
    return {
      ...rest,
      translations: splitTranslationsPayload(form, LOCALE_FIELDS, defaultLocale),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ytId = parseYoutubeId(form.youtube_url)
    if (!ytId) {
      setError('Please enter a valid YouTube URL or video ID.')
      return
    }
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...buildPayload(),
        thumbnail_url: form.thumbnail_url || youtubeThumbUrl(ytId),
      }
      if (editingId) await updateVideo(editingId, payload)
      else await createVideo(payload)
      setOpen(false)
      await load()
      setFlash({
        type: 'success',
        message: editingId ? 'Video updated.' : 'Video created.',
      })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save video.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this video?')) return
    try {
      await deleteVideo(id)
      await load()
      setFlash({ type: 'success', message: 'Video deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete video.' })
    }
  }

  const move = async (id, direction) => {
    const ordered = items.map((item) => item.id)
    const index = ordered.indexOf(id)
    const next = index + direction
    if (index < 0 || next < 0 || next >= ordered.length) return
    ;[ordered[index], ordered[next]] = [ordered[next], ordered[index]]
    try {
      await reorderVideos(ordered)
      await load()
      setFlash({ type: 'success', message: 'Video order updated.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to reorder.' })
    }
  }

  const previewId = parseYoutubeId(form.youtube_url)

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Videos</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>
          Add YouTube video
        </button>
      </div>
      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />
      <p className={styles.muted}>
        Manage YouTube videos for the public Videos page. Visitors can watch in a modal on the site or
        open the video on YouTube.
      </p>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Preview</th>
              <th>Title</th>
              <th>Published</th>
              <th>Order</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt="" style={{ width: 96, borderRadius: 6 }} />
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <strong>{item.title}</strong>
                  <div className={styles.muted}>{item.youtubeId}</div>
                </td>
                <td>{item.isPublished ? 'Yes' : 'No'}</td>
                <td>
                  <div className={styles.actions}>
                    <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => move(item.id, -1)}>
                      ↑
                    </button>
                    <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => move(item.id, 1)}>
                      ↓
                    </button>
                  </div>
                </td>
                <td>
                  <div className={styles.actions}>
                    <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => openEdit(item)}>
                      Edit
                    </button>
                    <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={() => handleDelete(item.id)}>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={5} className={styles.muted}>
                  No videos yet. Add a YouTube URL to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editingId ? 'Edit video' : 'Add YouTube video'} onClose={() => setOpen(false)}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <LocaleTabs value={localeTab} onChange={setLocaleTab} defaultLocale={defaultLocale} />
          <div className={styles.field}>
            <label>Title</label>
            <input
              value={getLocaleField(form, 'title', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'title', localeTab, e.target.value, defaultLocale))}
              required={localeTab === defaultLocale}
            />
          </div>
          <div className={styles.field}>
            <label>YouTube URL or video ID</label>
            <input
              value={form.youtube_url}
              onChange={(e) => setForm({ ...form, youtube_url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              required
            />
            {previewId ? (
              <div className={styles.youtubePreview}>
                <img src={`https://img.youtube.com/vi/${previewId}/hqdefault.jpg`} alt="" />
              </div>
            ) : null}
          </div>
          <ImageField
            label="Custom thumbnail (optional — defaults to YouTube thumbnail)"
            value={form.thumbnail_url}
            onChange={(url) => setForm({ ...form, thumbnail_url: url })}
            folder="videos"
          />
          <div className={styles.field}>
            <label>Description</label>
            <RichTextEditor
              value={getLocaleField(form, 'description', localeTab, defaultLocale)}
              onChange={(html) => setForm(setLocaleField(form, 'description', localeTab, html, defaultLocale))}
            />
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Published date</label>
              <input
                type="date"
                value={form.published_at}
                onChange={(e) => setForm({ ...form, published_at: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>
                <input
                  type="checkbox"
                  checked={form.is_published}
                  onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
                />{' '}
                Published
              </label>
            </div>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.btn} type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save video'}
          </button>
        </form>
      </Modal>
    </div>
  )
}
