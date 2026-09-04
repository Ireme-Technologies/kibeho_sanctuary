import { useEffect, useState } from 'react'
import {
  createTravelRoute,
  deleteTravelRoute,
  fetchTravelRoutes,
  updateTravelRoute,
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

const LOCALE_FIELDS = ['origin', 'title', 'description']

const empty = {
  origin: '',
  title: '',
  description: '',
  sort_order: 0,
  is_published: true,
  translations: {},
}

export default function TravelRoutesAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchTravelRoutes())

  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load routes' }))
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
      origin: item.origin || '',
      title: item.title || '',
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
      if (editingId) await updateTravelRoute(editingId, payload())
      else await createTravelRoute(payload())
      setOpen(false)
      await load()
      setFlash({ type: 'success', message: editingId ? 'Route updated.' : 'Route added.' })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save route.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this route?'))) return
    try {
      await deleteTravelRoute(id)
      await load()
      setFlash({ type: 'success', message: 'Route deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete route.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Travel routes</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>
          Add route
        </button>
      </div>

      <p className={styles.muted} style={{ marginTop: 0 }}>
        These routes appear on How to Get Here, above the map, so pilgrims can follow directions from
        different parts of Rwanda.
      </p>

      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Route</th>
              <th>From</th>
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
                <td>{item.origin || '—'}</td>
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
                  No travel routes yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editingId ? 'Edit route' : 'Add route'} onClose={() => setOpen(false)} wide>
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
            <label>Starting place</label>
            <input
              value={getLocaleField(form, 'origin', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'origin', localeTab, e.target.value, defaultLocale))}
              placeholder="Kigali, Rusizi, Akanyaru…"
            />
          </div>
          <div className={styles.field}>
            <label>Route title</label>
            <input
              value={getLocaleField(form, 'title', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'title', localeTab, e.target.value, defaultLocale))}
              required={localeTab === defaultLocale}
              placeholder="Kigali – Huye – Matyazo – Kibeho"
            />
          </div>
          <div className={styles.field}>
            <label>Directions</label>
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
