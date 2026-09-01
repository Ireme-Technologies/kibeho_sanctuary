import { useEffect, useState } from 'react'
import {
  createOfficialPrayer,
  deleteOfficialPrayer,
  fetchOfficialPrayers,
  updateOfficialPrayer,
} from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import Modal from './components/Modal'
import RichTextEditor from './components/RichTextEditor'
import FlashMessage from './components/FlashMessage'
import { confirmDelete } from './components/confirmDelete'
import LocaleTabs, { getLocaleField, setLocaleField, splitTranslationsPayload } from './components/LocaleTabs'
import { LocaleColumnHeaders, LocaleColumnCells } from './components/LocaleColumns'
import ListTitle from './components/ListTitle'
import styles from './admin.module.css'

const LOCALE_FIELDS = ['title', 'time_label', 'description']

const empty = {
  title: '',
  time_label: '',
  description: '',
  sort_order: 0,
  is_published: true,
  translations: {},
}

export default function OfficialPrayersAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchOfficialPrayers())

  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load prayers' }))
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
      time_label: item.timeLabel || '',
      description: item.description || '',
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
      if (editingId) await updateOfficialPrayer(editingId, payload())
      else await createOfficialPrayer(payload())
      setOpen(false)
      await load()
      setFlash({ type: 'success', message: editingId ? 'Prayer updated.' : 'Prayer added.' })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save prayer.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this prayer?'))) return
    try {
      await deleteOfficialPrayer(id)
      await load()
      setFlash({ type: 'success', message: 'Prayer deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete prayer.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Official Prayers</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>
          Add prayer
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
              <th>Title</th>
              <th>Time</th>
              <LocaleColumnHeaders defaultLocale={defaultLocale} />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <ListTitle
                    title={item.title}
                    onEdit={() => openEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </td>
                <td>{item.timeLabel || '—'}</td>
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
                  No official prayers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editingId ? 'Edit prayer' : 'Add prayer'} onClose={() => setOpen(false)} wide>
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
            <label>Time label</label>
            <input
              value={getLocaleField(form, 'time_label', localeTab, defaultLocale)}
              onChange={(e) =>
                setForm(setLocaleField(form, 'time_label', localeTab, e.target.value, defaultLocale))
              }
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
