import { useEffect, useState } from 'react'
import {
  createTestimonial,
  deleteTestimonial,
  fetchTestimonials,
  updateTestimonial,
} from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import Modal from './components/Modal'
import ImageField from './components/ImageField'
import RichTextEditor from './components/RichTextEditor'
import FlashMessage from './components/FlashMessage'
import LocaleTabs, { getLocaleField, setLocaleField, splitTranslationsPayload } from './components/LocaleTabs'
import styles from './admin.module.css'

const LOCALE_FIELDS = ['title', 'body', 'author_role', 'author_location']

const empty = {
  author_name: '',
  author_role: '',
  author_location: '',
  author_avatar: '',
  title: '',
  body: '',
  rating: '',
  featured: false,
  sort_order: 0,
  is_published: true,
  published_at: '',
  translations: {},
}

export default function TestimonialsAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchTestimonials())

  useEffect(() => {
    load().catch((err) =>
      setFlash({ type: 'error', message: err.message || 'Failed to load testimonials' })
    )
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
      author_name: item.authorName || '',
      author_role: item.authorRole || '',
      author_location: item.authorLocation || '',
      author_avatar: item.authorAvatar || '',
      title: item.title || '',
      body: item.body || '',
      rating: item.rating ?? '',
      featured: Boolean(item.featured),
      sort_order: item.sortOrder ?? 0,
      is_published: item.isPublished !== false,
      published_at: item.publishedAt || '',
      translations: item.translations || {},
    })
    setLocaleTab(defaultLocale || 'en')
    setError('')
    setOpen(true)
  }

  const payload = () => {
    const { translations: _t, ...rest } = form
    return {
      ...rest,
      rating: form.rating === '' || form.rating == null ? null : Number(form.rating),
      sort_order: Number(form.sort_order) || 0,
      published_at: form.published_at || null,
      translations: splitTranslationsPayload(form, LOCALE_FIELDS, defaultLocale),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateTestimonial(editingId, payload())
      else await createTestimonial(payload())
      setOpen(false)
      await load()
      setFlash({
        type: 'success',
        message: editingId ? 'Testimonial updated.' : 'Testimonial created.',
      })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save testimonial.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this testimonial?')) return
    try {
      await deleteTestimonial(id)
      await load()
      setFlash({ type: 'success', message: 'Testimonial deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete testimonial.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Testimonials</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>
          Add testimonial
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
              <th>Author</th>
              <th>Title</th>
              <th>Rating</th>
              <th>Featured</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <strong>{item.authorName}</strong>
                  {item.authorRole ? (
                    <div className={styles.muted}>{item.authorRole}</div>
                  ) : null}
                </td>
                <td>{item.title || '—'}</td>
                <td>{item.rating != null ? `${item.rating}/5` : '—'}</td>
                <td>{item.featured ? 'Yes' : 'No'}</td>
                <td className={styles.actions}>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => openEdit(item)}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnDanger}`}
                    onClick={() => handleDelete(item.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={5} className={styles.muted}>
                  No testimonials yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title={editingId ? 'Edit testimonial' : 'Add testimonial'}
        onClose={() => setOpen(false)}
        wide
      >
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Author name</label>
              <input
                value={form.author_name}
                onChange={(e) => setForm({ ...form, author_name: e.target.value })}
                required
              />
            </div>
          </div>
          <LocaleTabs value={localeTab} onChange={setLocaleTab} defaultLocale={defaultLocale} />
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Author role</label>
              <input
                value={getLocaleField(form, 'author_role', localeTab, defaultLocale)}
                onChange={(e) => setForm(setLocaleField(form, 'author_role', localeTab, e.target.value, defaultLocale))}
                placeholder="e.g. Pilgrim, Local parishioner"
              />
            </div>
            <div className={styles.field}>
              <label>Author location</label>
              <input
                value={getLocaleField(form, 'author_location', localeTab, defaultLocale)}
                onChange={(e) => setForm(setLocaleField(form, 'author_location', localeTab, e.target.value, defaultLocale))}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label>Title</label>
            <input
              value={getLocaleField(form, 'title', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'title', localeTab, e.target.value, defaultLocale))}
            />
          </div>
          <ImageField
            label="Author avatar"
            value={form.author_avatar}
            onChange={(url) => setForm({ ...form, author_avatar: url })}
            folder="testimonials"
          />
          <div className={styles.field}>
            <label>Body</label>
            <RichTextEditor
              value={getLocaleField(form, 'body', localeTab, defaultLocale)}
              onChange={(html) => setForm(setLocaleField(form, 'body', localeTab, html, defaultLocale))}
            />
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Rating (1–5)</label>
              <select
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
              >
                <option value="">No rating</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
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
          </div>
          <div className={styles.field}>
            <label>Published date</label>
            <input
              type="date"
              value={form.published_at}
              onChange={(e) => setForm({ ...form, published_at: e.target.value })}
            />
          </div>
          <label>
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
            />{' '}
            Featured
          </label>
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
