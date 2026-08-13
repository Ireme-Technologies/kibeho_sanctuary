import { useEffect, useState } from 'react'
import { createBlogPost, deleteBlogPost, fetchBlogPosts, updateBlogPost } from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import Modal from './components/Modal'
import ImageField from './components/ImageField'
import RichTextEditor from './components/RichTextEditor'
import FlashMessage from './components/FlashMessage'
import { confirmDelete } from './components/confirmDelete'
import LocaleTabs, { getLocaleField, setLocaleField, splitTranslationsPayload } from './components/LocaleTabs'
import styles from './admin.module.css'

const LOCALE_FIELDS = ['title', 'excerpt', 'body']

const empty = {
  title: '',
  excerpt: '',
  body: '',
  category: 'News',
  tags: '',
  author_name: '',
  author_avatar: '',
  author_role: '',
  author_bio: '',
  cover_image: '',
  published_at: '',
  is_published: true,
  translations: {},
}

const CATEGORY_OPTIONS = [
  'Bishop',
  'Rector',
  'Priest',
  'Press',
  'Events',
  'News',
]

export default function BlogAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchBlogPosts())
  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load posts' }))
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
      excerpt: item.excerpt || '',
      body: item.body || '',
      category: item.category || '',
      tags: (item.tags || []).join(', '),
      author_name: item.author?.name || '',
      author_avatar: item.author?.avatar || '',
      author_role: item.author?.role || '',
      author_bio: item.author?.bio || '',
      cover_image: item.coverImage || '',
      published_at: item.publishedAt || '',
      is_published: item.isPublished !== false,
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
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      translations: splitTranslationsPayload(form, LOCALE_FIELDS, defaultLocale),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateBlogPost(editingId, payload())
      else await createBlogPost(payload())
      setOpen(false)
      await load()
      setFlash({
        type: 'success',
        message: editingId ? 'Post updated successfully.' : 'Post created successfully.',
      })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save post.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this post?'))) return
    try {
      await deleteBlogPost(id)
      await load()
      setFlash({ type: 'success', message: 'Post deleted successfully.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete post.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>News & clergy messages</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>Add post</button>
      </div>
      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr><th>Image</th><th>Title</th><th>Category</th><th>Published</th><th /></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.coverImage ? <img className={styles.thumb} src={item.coverImage} alt="" /> : '—'}</td>
                <td>{item.title}</td>
                <td>{item.category}</td>
                <td>{item.publishedAt || '—'}</td>
                <td className={styles.actions}>
                  <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => openEdit(item)}>Edit</button>
                  <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editingId ? 'Edit post' : 'Add post'} onClose={() => setOpen(false)} wide>
        <form className={styles.form} onSubmit={handleSubmit}>
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
            <label>Excerpt</label>
            <RichTextEditor
              value={getLocaleField(form, 'excerpt', localeTab, defaultLocale)}
              onChange={(html) => setForm(setLocaleField(form, 'excerpt', localeTab, html, defaultLocale))}
            />
          </div>
          <div className={styles.field}>
            <label>Body</label>
            <RichTextEditor
              value={getLocaleField(form, 'body', localeTab, defaultLocale)}
              onChange={(html) => setForm(setLocaleField(form, 'body', localeTab, html, defaultLocale))}
            />
          </div>
          <ImageField label="Cover image" value={form.cover_image} onChange={(url) => setForm({ ...form, cover_image: url })} folder="blog" />
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Category</label>
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <p className={styles.muted}>Use Bishop, Rector, or Priest for clergy messages shown under News.</p>
            </div>
            <div className={styles.field}>
              <label>Tags (comma separated)</label>
              <input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Author name</label>
              <input value={form.author_name} onChange={(e) => setForm({ ...form, author_name: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label>Published at</label>
              <input type="date" value={form.published_at || ''} onChange={(e) => setForm({ ...form, published_at: e.target.value })} />
            </div>
          </div>
          <label>
            <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Published
          </label>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button className={styles.btn} type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
            <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
