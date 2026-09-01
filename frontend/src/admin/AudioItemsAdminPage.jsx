import { useEffect, useState } from 'react'
import {
  createAudioItem,
  deleteAudioItem,
  fetchAudioItems,
  updateAudioItem,
} from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import Modal from './components/Modal'
import ImageField from './components/ImageField'
import RichTextEditor from './components/RichTextEditor'
import FlashMessage from './components/FlashMessage'
import { confirmDelete } from './components/confirmDelete'
import LocaleTabs, { getLocaleField, setLocaleField, splitTranslationsPayload } from './components/LocaleTabs'
import { LocaleColumnHeaders, LocaleColumnCells } from './components/LocaleColumns'
import ListTitle from './components/ListTitle'
import styles from './admin.module.css'

const LOCALE_FIELDS = ['title', 'description']

const TYPE_OPTIONS = [
  { value: 'audio', label: 'Audio' },
  { value: 'documentary', label: 'Documentary' },
  { value: 'broadcast', label: 'Broadcast' },
]

const empty = {
  title: '',
  description: '',
  type: 'audio',
  audio_url: '',
  cover_image: '',
  duration: '',
  published_at: '',
  sort_order: 0,
  is_published: true,
  translations: {},
}

export default function AudioItemsAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchAudioItems())

  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load audio items' }))
  }, [])

  const openCreate = () => {
    setEditingId(null)
    setForm(empty)
    setLocaleTab(defaultLocale || 'en')
    setError('')
    setOpen(true)
  }

  const openEdit = (item, localeCode) => {
    setEditingId(item.id)
    setForm({
      title: item.title || '',
      description: item.description || '',
      type: item.type || 'audio',
      audio_url: item.audioUrl || '',
      cover_image: item.coverImage || '',
      duration: item.duration || '',
      published_at: item.publishedAt ? item.publishedAt.slice(0, 10) : '',
      sort_order: item.sortOrder ?? 0,
      is_published: item.isPublished !== false,
      translations: item.translations || {},
    })
    setLocaleTab(localeCode || defaultLocale || 'en')
    setError('')
    setOpen(true)
  }

  const payload = () => {
    const { translations: _t, published_at, ...rest } = form
    return {
      ...rest,
      ...(published_at ? { published_at } : {}),
      sort_order: Number(form.sort_order) || 0,
      translations: splitTranslationsPayload(form, LOCALE_FIELDS, defaultLocale),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateAudioItem(editingId, payload())
      else await createAudioItem(payload())
      setOpen(false)
      await load()
      setFlash({ type: 'success', message: editingId ? 'Item updated.' : 'Item added.' })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save item.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this audio item?'))) return
    try {
      await deleteAudioItem(id)
      await load()
      setFlash({ type: 'success', message: 'Item deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete item.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Audio &amp; Broadcast</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>
          Add item
        </button>
      </div>

      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Cover</th>
              <th>Title</th>
              <th>Type</th>
              <LocaleColumnHeaders defaultLocale={defaultLocale} />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.coverImage ? (
                    <img className={styles.thumb} src={item.coverImage} alt="" />
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <ListTitle
                    title={item.title}
                    onEdit={() => openEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                    viewHref={item.path}
                  />
                </td>
                <td>{TYPE_OPTIONS.find((opt) => opt.value === item.type)?.label || item.type}</td>
                <LocaleColumnCells
                  item={item}
                  fields={LOCALE_FIELDS}
                  defaultLocale={defaultLocale}
                  onEditLocale={(code) => openEdit(item, code)}
                />
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={6} className={styles.muted}>
                  No audio items yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editingId ? 'Edit item' : 'Add item'} onClose={() => setOpen(false)} wide>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} required>
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <LocaleTabs
            value={localeTab}
            onChange={setLocaleTab}
            defaultLocale={defaultLocale}
            form={form}
            setForm={setForm}
            fields={LOCALE_FIELDS}
          />
          <div className={styles.field}>
            <label>Title</label>
            <input
              value={getLocaleField(form, 'title', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'title', localeTab, e.target.value, defaultLocale))}
              required={localeTab === defaultLocale}
            />
          </div>
          <div className={styles.field}>
            <label>Description</label>
            <RichTextEditor
              value={getLocaleField(form, 'description', localeTab, defaultLocale)}
              onChange={(html) =>
                setForm(setLocaleField(form, 'description', localeTab, html, defaultLocale))
              }
            />
          </div>
          <div className={styles.field}>
            <label>Audio / stream URL</label>
            <input value={form.audio_url} onChange={(e) => setForm({ ...form, audio_url: e.target.value })} />
          </div>
          <ImageField
            label="Cover image"
            value={form.cover_image}
            onChange={(url) => setForm({ ...form, cover_image: url })}
            folder="audio-items"
          />
          <div className={styles.field}>
            <label>Duration</label>
            <input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>Published date</label>
            <input
              type="date"
              value={form.published_at}
              onChange={(e) => setForm({ ...form, published_at: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label>Sort order</label>
            <input
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
            />
          </div>
          <label>
            <input
              type="checkbox"
              checked={form.is_published}
              onChange={(e) => setForm({ ...form, is_published: e.target.checked })}
            />{' '}
            Published
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button className={styles.btn} type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
