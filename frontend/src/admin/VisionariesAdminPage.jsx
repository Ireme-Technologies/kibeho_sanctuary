import { useEffect, useState } from 'react'
import {
  createVisionary,
  deleteVisionary,
  fetchVisionaries,
  updateVisionary,
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

const LOCALE_FIELDS = ['name', 'summary', 'description', 'period_label']

const empty = {
  slug: '',
  name: '',
  summary: '',
  description: '',
  period_label: '',
  period_start: '',
  period_end: '',
  photo: '',
  is_approved: true,
  sort_order: 0,
  is_published: true,
  translations: {},
}

export default function VisionariesAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchVisionaries())

  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load visionaries' }))
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
      slug: item.slug || '',
      name: item.name || '',
      summary: item.summary || '',
      description: item.description || '',
      period_label: item.periodLabel || '',
      period_start: item.periodStart || '',
      period_end: item.periodEnd || '',
      photo: item.photo || item.coverImage || '',
      is_approved: item.isApproved !== false,
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
      slug: form.slug?.trim() || undefined,
      sort_order: Number(form.sort_order) || 0,
      translations: splitTranslationsPayload(form, LOCALE_FIELDS, defaultLocale),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateVisionary(editingId, payload())
      else await createVisionary(payload())
      setOpen(false)
      await load()
      setFlash({ type: 'success', message: editingId ? 'Visionary updated.' : 'Visionary added.' })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save visionary.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this visionary?'))) return
    try {
      await deleteVisionary(id)
      await load()
      setFlash({ type: 'success', message: 'Visionary deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete visionary.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Visionaries</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>
          Add visionary
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
              <th>Photo</th>
              <th>Name</th>
              <LocaleColumnHeaders defaultLocale={defaultLocale} />
              <th>Approved</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.photo || item.coverImage ? (
                    <img className={styles.thumb} src={item.photo || item.coverImage} alt="" />
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <ListTitle
                    title={item.name}
                    onEdit={() => openEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                    viewHref={item.path || `/shrine/visionaries/${item.slug}`}
                  />
                </td>
                <LocaleColumnCells
                  item={item}
                  fields={LOCALE_FIELDS}
                  defaultLocale={defaultLocale}
                  onEditLocale={(code) => openEdit(item, code)}
                />
                <td>{item.isApproved !== false ? 'Yes' : 'No'}</td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={6} className={styles.muted}>
                  No visionaries yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editingId ? 'Edit visionary' : 'Add visionary'} onClose={() => setOpen(false)} wide>
        <form className={styles.form} onSubmit={handleSubmit}>
          <LocaleTabs
            value={localeTab}
            onChange={setLocaleTab}
            defaultLocale={defaultLocale}
            form={form}
            setForm={setForm}
            fields={LOCALE_FIELDS}
          />
          {localeTab === defaultLocale ? (
            <div className={styles.field}>
              <label>URL slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                placeholder="alphonsine-mumureke"
              />
              <p className={styles.muted}>
                Used in the page address, e.g. /shrine/visionaries/alphonsine-mumureke
              </p>
            </div>
          ) : null}
          <div className={styles.field}>
            <label>Name</label>
            <input
              value={getLocaleField(form, 'name', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'name', localeTab, e.target.value, defaultLocale))}
              required={localeTab === defaultLocale}
            />
          </div>
          <div className={styles.field}>
            <label>Period label</label>
            <input
              value={getLocaleField(form, 'period_label', localeTab, defaultLocale)}
              onChange={(e) =>
                setForm(setLocaleField(form, 'period_label', localeTab, e.target.value, defaultLocale))
              }
            />
          </div>
          <div className={styles.field}>
            <label>Short description (listing page)</label>
            <textarea
              rows={3}
              value={getLocaleField(form, 'summary', localeTab, defaultLocale)}
              onChange={(e) =>
                setForm(setLocaleField(form, 'summary', localeTab, e.target.value, defaultLocale))
              }
              placeholder="One or two sentences shown on the main Visionaries page."
            />
          </div>
          <div className={styles.field}>
            <label>Historical insights (detail page)</label>
            <RichTextEditor
              value={getLocaleField(form, 'description', localeTab, defaultLocale)}
              onChange={(html) =>
                setForm(setLocaleField(form, 'description', localeTab, html, defaultLocale))
              }
            />
          </div>
          <ImageField
            label="Photo"
            value={form.photo}
            onChange={(url) => setForm({ ...form, photo: url })}
            folder="visionaries"
          />
          <div className={styles.field}>
            <label>Period start</label>
            <input value={form.period_start} onChange={(e) => setForm({ ...form, period_start: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>Period end</label>
            <input value={form.period_end} onChange={(e) => setForm({ ...form, period_end: e.target.value })} />
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
              checked={form.is_approved}
              onChange={(e) => setForm({ ...form, is_approved: e.target.checked })}
            />{' '}
            Approved by the Church
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
