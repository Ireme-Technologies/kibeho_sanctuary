import { useEffect, useState } from 'react'
import {
  createSpiritualBook,
  deleteSpiritualBook,
  fetchSpiritualBooks,
  updateSpiritualBook,
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

const LOCALE_FIELDS = ['title', 'author', 'description', 'availability_note']

const empty = {
  title: '',
  author: '',
  description: '',
  cover_image: '',
  purchase_url: '',
  availability_note: '',
  sort_order: 0,
  is_published: true,
  translations: {},
}

export default function SpiritualBooksAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchSpiritualBooks())

  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load books' }))
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
      author: item.author || '',
      description: item.description || '',
      cover_image: item.coverImage || '',
      purchase_url: item.purchaseUrl || '',
      availability_note: item.availabilityNote || '',
      sort_order: item.sortOrder ?? 0,
      is_published: item.isPublished !== false,
      translations: item.translations || {},
    })
    setLocaleTab(localeCode || defaultLocale || 'en')
    setError('')
    setOpen(true)
  }

  const payload = () => {
    const { translations: _t, ...rest } = form
    return {
      ...rest,
      sort_order: Number(form.sort_order) || 0,
      translations: splitTranslationsPayload(form, LOCALE_FIELDS, defaultLocale),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateSpiritualBook(editingId, payload())
      else await createSpiritualBook(payload())
      setOpen(false)
      await load()
      setFlash({ type: 'success', message: editingId ? 'Book updated.' : 'Book added.' })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save book.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this book?'))) return
    try {
      await deleteSpiritualBook(id)
      await load()
      setFlash({ type: 'success', message: 'Book deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete book.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Spiritual Books</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>
          Add book
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
                <td colSpan={5} className={styles.muted}>
                  No books yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editingId ? 'Edit book' : 'Add book'} onClose={() => setOpen(false)} wide>
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
            <label>Author</label>
            <input
              value={getLocaleField(form, 'author', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'author', localeTab, e.target.value, defaultLocale))}
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
          <ImageField
            label="Cover image"
            value={form.cover_image}
            onChange={(url) => setForm({ ...form, cover_image: url })}
            folder="spiritual-books"
          />
          <div className={styles.field}>
            <label>Purchase URL</label>
            <input
              value={form.purchase_url}
              onChange={(e) => setForm({ ...form, purchase_url: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label>Availability note</label>
            <input
              value={getLocaleField(form, 'availability_note', localeTab, defaultLocale)}
              onChange={(e) =>
                setForm(setLocaleField(form, 'availability_note', localeTab, e.target.value, defaultLocale))
              }
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
