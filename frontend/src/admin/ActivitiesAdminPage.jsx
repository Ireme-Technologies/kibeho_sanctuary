import { useEffect, useState } from 'react'
import { createActivity, deleteActivity, fetchActivities, updateActivity } from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import Modal from './components/Modal'
import ImageField from './components/ImageField'
import RichTextEditor from './components/RichTextEditor'
import FlashMessage from './components/FlashMessage'
import LocaleTabs, { getLocaleField, setLocaleField, splitTranslationsPayload } from './components/LocaleTabs'
import styles from './admin.module.css'

const LOCALE_FIELDS = ['title', 'short_description', 'description']

const empty = {
  title: '',
  short_description: '',
  description: '',
  image: '',
  sort_order: 0,
  show_in_menu: true,
  is_published: true,
  translations: {},
}

export default function ActivitiesAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchActivities())

  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load activities' }))
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
      short_description: item.shortDescription || '',
      description: item.description || '',
      image: item.image || '',
      sort_order: item.sortOrder || 0,
      show_in_menu: item.showInMenu !== false,
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
      sort_order: Number(form.sort_order) || 0,
      translations: splitTranslationsPayload(form, LOCALE_FIELDS, defaultLocale),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateActivity(editingId, payload())
      else await createActivity(payload())
      setOpen(false)
      await load()
      setFlash({
        type: 'success',
        message: editingId ? 'Activity updated.' : 'Activity created.',
      })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save activity.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this activity?')) return
    try {
      await deleteActivity(id)
      await load()
      setFlash({ type: 'success', message: 'Activity deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete activity.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Activities</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>
          Add activity
        </button>
      </div>

      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <p className={styles.muted} style={{ marginBottom: '1rem' }}>
        Homepage shows the first 3 published activities by sort order. Menu lists activities marked
        “Show in menu”.
      </p>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Order</th>
              <th>Menu</th>
              <th>Published</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.image ? <img className={styles.thumb} src={item.image} alt="" /> : '—'}</td>
                <td>{item.title}</td>
                <td>{item.sortOrder}</td>
                <td>{item.showInMenu ? 'Yes' : 'No'}</td>
                <td>{item.isPublished ? 'Yes' : 'No'}</td>
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
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title={editingId ? 'Edit activity' : 'Add activity'}
        onClose={() => setOpen(false)}
        wide
      >
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
            <label>Short description</label>
            <textarea
              rows={3}
              value={getLocaleField(form, 'short_description', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'short_description', localeTab, e.target.value, defaultLocale))}
              placeholder="Shown on homepage cards when hovered"
            />
          </div>
          <div className={styles.field}>
            <label>Full description</label>
            <RichTextEditor
              value={getLocaleField(form, 'description', localeTab, defaultLocale)}
              onChange={(html) => setForm(setLocaleField(form, 'description', localeTab, html, defaultLocale))}
            />
          </div>
          <ImageField
            label="Card image"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            folder="activities"
          />
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Sort order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              />
            </div>
          </div>
          <label>
            <input
              type="checkbox"
              checked={form.show_in_menu}
              onChange={(e) => setForm({ ...form, show_in_menu: e.target.checked })}
            />{' '}
            Show in menu
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
