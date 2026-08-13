import { useEffect, useState } from 'react'
import { createService, deleteService, fetchServices, updateService } from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import Modal from './components/Modal'
import ImageField from './components/ImageField'
import RichTextEditor from './components/RichTextEditor'
import FlashMessage from './components/FlashMessage'
import { confirmDelete } from './components/confirmDelete'
import LocaleTabs, { getLocaleField, setLocaleField, splitTranslationsPayload } from './components/LocaleTabs'
import styles from './admin.module.css'

const LOCALE_FIELDS = ['title', 'description']

function deliverablesToLines(value) {
  if (Array.isArray(value)) return value.join('\n')
  return value ?? ''
}

function getDeliverablesField(form, locale, defaultLocale) {
  if (locale === defaultLocale) return form.deliverables ?? ''
  return deliverablesToLines(form.translations?.[locale]?.highlights)
}

function setDeliverablesField(form, locale, value, defaultLocale) {
  if (locale === defaultLocale) return { ...form, deliverables: value }
  return {
    ...form,
    translations: {
      ...(form.translations || {}),
      [locale]: {
        ...(form.translations?.[locale] || {}),
        highlights: value.split('\n').map((line) => line.trim()).filter(Boolean),
      },
    },
  }
}

const empty = {
  title: '',
  description: '',
  image: '',
  detail_image: '',
  icon_key: '',
  deliverables: '',
  sort_order: 0,
  is_published: true,
  translations: {},
}

export default function ServicesAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchServices())

  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load services' }))
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
      image: item.image || '',
      detail_image: item.detailImage || '',
      icon_key: item.iconKey || '',
      deliverables: (item.deliverables || []).join('\n'),
      sort_order: item.sortOrder || 0,
      is_published: item.isPublished !== false,
      translations: item.translations || {},
    })
    setLocaleTab(defaultLocale || 'en')
    setError('')
    setOpen(true)
  }

  const payload = () => {
    const { translations: _t, deliverables, ...rest } = form
    const translations = splitTranslationsPayload(form, ['title', 'description'], defaultLocale)
    const bag = form.translations || {}
    Object.entries(bag).forEach(([locale, values]) => {
      if (locale === defaultLocale || !values || typeof values !== 'object') return
      const highlights = values.highlights
      if (Array.isArray(highlights) && highlights.length) {
        translations[locale] = { ...(translations[locale] || {}), highlights }
      }
    })
    return {
      ...rest,
      sort_order: Number(form.sort_order) || 0,
      deliverables: deliverables.split('\n').map((line) => line.trim()).filter(Boolean),
      translations,
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateService(editingId, payload())
      else await createService(payload())
      setOpen(false)
      await load()
      setFlash({
        type: 'success',
        message: editingId ? 'Pilgrimage service updated.' : 'Pilgrimage service created.',
      })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save service.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this service?'))) return
    try {
      await deleteService(id)
      await load()
      setFlash({ type: 'success', message: 'Pilgrimage service deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete service.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Pilgrimage Services</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>Add service</button>
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
              <th>Image</th>
              <th>Title</th>
              <th>Published</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.image ? <img className={styles.thumb} src={item.image} alt="" /> : '—'}</td>
                <td>{item.title}</td>
                <td>{item.isPublished ? 'Yes' : 'No'}</td>
                <td className={styles.actions}>
                  <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => openEdit(item)}>Edit</button>
                  <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editingId ? 'Edit service' : 'Add service'} onClose={() => setOpen(false)} wide>
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
            <label>Description</label>
            <RichTextEditor
              value={getLocaleField(form, 'description', localeTab, defaultLocale)}
              onChange={(html) => setForm(setLocaleField(form, 'description', localeTab, html, defaultLocale))}
            />
          </div>
          <ImageField label="Card image" value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="services" />
          <ImageField label="Detail image" value={form.detail_image} onChange={(url) => setForm({ ...form, detail_image: url })} folder="services" />
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Icon key</label>
              <input value={form.icon_key} onChange={(e) => setForm({ ...form, icon_key: e.target.value })} />
            </div>
            <div className={styles.field}>
              <label>Sort order</label>
              <input type="number" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
            </div>
          </div>
          <div className={styles.field}>
            <label>Deliverables (one per line)</label>
            <textarea
              rows={5}
              value={getDeliverablesField(form, localeTab, defaultLocale)}
              onChange={(e) => setForm(setDeliverablesField(form, localeTab, e.target.value, defaultLocale))}
            />
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
