import { useEffect, useState } from 'react'
import {
  createSacredPlace,
  deleteSacredPlace,
  fetchSacredPlaces,
  updateSacredPlace,
} from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import Modal from './components/Modal'
import ImageField from './components/ImageField'
import MultiImageField from './components/MultiImageField'
import RichTextEditor from './components/RichTextEditor'
import FlashMessage from './components/FlashMessage'
import { confirmDelete } from './components/confirmDelete'
import LocaleTabs, { getLocaleField, setLocaleField, splitTranslationsPayload } from './components/LocaleTabs'
import { LocaleColumnHeaders, LocaleColumnCells } from './components/LocaleColumns'
import ListTitle from './components/ListTitle'
import styles from './admin.module.css'

const LOCALE_FIELDS = ['name', 'description', 'location', 'why_visit']

const TYPE_OPTIONS = [
  { value: 'apparition_site', label: 'Apparition site' },
  { value: 'main_place', label: 'Main place' },
]

const typeLabel = (type) => TYPE_OPTIONS.find((opt) => opt.value === type)?.label || type

function pageTitle(fixedType) {
  if (fixedType === 'main_place') return 'Main places'
  if (fixedType === 'apparition_site') return 'Apparition sites'
  return 'Sacred places'
}

function emptyForm(fixedType) {
  return {
    type: fixedType || 'main_place',
    category: '',
    name: '',
    description: '',
    why_visit: '',
    key_points_text: '',
    cover_image: '',
    gallery: [],
    location: '',
    sort_order: 0,
    is_published: true,
    translations: {},
  }
}

function keyPointsToText(points) {
  return Array.isArray(points) ? points.join('\n') : ''
}

function textToKeyPoints(text) {
  return String(text || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
}

export default function SacredPlacesAdminPage({ fixedType } = {}) {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(emptyForm(fixedType))
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const title = pageTitle(fixedType)

  const load = async () => {
    const params = fixedType ? { type: fixedType } : {}
    setItems(await fetchSacredPlaces(params))
  }

  useEffect(() => {
    load().catch((err) =>
      setFlash({ type: 'error', message: err.message || 'Failed to load sacred places' })
    )
  }, [fixedType])

  const openCreate = () => {
    setEditingId(null)
    setForm(emptyForm(fixedType))
    setLocaleTab(defaultLocale || 'en')
    setError('')
    setOpen(true)
  }

  const openEdit = (item, localeCode) => {
    setEditingId(item.id)
    setForm({
      type: fixedType || item.type || 'main_place',
      category: item.category || '',
      name: item.name || '',
      description: item.description || '',
      why_visit: item.whyVisit || '',
      key_points_text: keyPointsToText(item.keyPoints),
      cover_image: item.coverImage || '',
      gallery: Array.isArray(item.gallery) ? item.gallery : [],
      location: item.location || '',
      sort_order: item.sortOrder ?? 0,
      is_published: item.isPublished !== false,
      translations: item.translations || {},
    })
    setLocaleTab(localeCode || defaultLocale || 'en')
    setError('')
    setOpen(true)
  }

  const payload = () => {
    const { translations: _t, key_points_text, ...rest } = form
    return {
      ...rest,
      type: fixedType || form.type,
      key_points: textToKeyPoints(key_points_text),
      gallery: Array.isArray(form.gallery) ? form.gallery : [],
      sort_order: Number(form.sort_order) || 0,
      translations: splitTranslationsPayload(form, LOCALE_FIELDS, defaultLocale),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateSacredPlace(editingId, payload())
      else await createSacredPlace(payload())
      setOpen(false)
      await load()
      setFlash({
        type: 'success',
        message: editingId ? 'Entry updated.' : 'Entry created.',
      })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save sacred place.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this sacred place?'))) return
    try {
      await deleteSacredPlace(id)
      await load()
      setFlash({ type: 'success', message: 'Sacred place deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete sacred place.' })
    }
  }

  const addLabel = fixedType === 'main_place'
    ? 'Add main place'
    : fixedType === 'apparition_site'
      ? 'Add apparition site'
      : 'Add sacred place'

  const editLabel = fixedType === 'main_place'
    ? 'Edit main place'
    : fixedType === 'apparition_site'
      ? 'Edit apparition site'
      : 'Edit sacred place'

  return (
    <div>
      <div className={styles.topbar}>
        <h1>{title}</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>
          {addLabel}
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
              <th>Image</th>
              <th>Name</th>
              <LocaleColumnHeaders defaultLocale={defaultLocale} />
              {!fixedType && <th>Type</th>}
              <th>Category</th>
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
                    title={item.name}
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
                {!fixedType && <td>{typeLabel(item.type)}</td>}
                <td>{item.category || '—'}</td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={fixedType ? 7 : 8} className={styles.muted}>
                  No {title.toLowerCase()} yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editingId ? editLabel : addLabel} onClose={() => setOpen(false)} wide>
        <form className={styles.form} onSubmit={handleSubmit}>
          {!fixedType && (
            <div className={styles.field}>
              <label>Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                required
              >
                {TYPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className={styles.field}>
            <label>Category</label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              placeholder="e.g. Chapel, Spring, Stations"
            />
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
            <label>Name</label>
            <input
              value={getLocaleField(form, 'name', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'name', localeTab, e.target.value, defaultLocale))}
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
          <div className={styles.field}>
            <label>Why visit</label>
            <RichTextEditor
              value={getLocaleField(form, 'why_visit', localeTab, defaultLocale)}
              onChange={(html) => setForm(setLocaleField(form, 'why_visit', localeTab, html, defaultLocale))}
            />
          </div>
          <div className={styles.field}>
            <label>Key points (one per line)</label>
            <textarea
              rows={4}
              value={form.key_points_text}
              onChange={(e) => setForm({ ...form, key_points_text: e.target.value })}
            />
          </div>
          <ImageField
            label="Cover image"
            value={form.cover_image}
            onChange={(url) => setForm({ ...form, cover_image: url })}
            folder="sacred-places"
          />
          <MultiImageField
            label="Gallery images"
            value={form.gallery}
            onChange={(gallery) => setForm({ ...form, gallery })}
            folder="sacred-places"
          />
          <div className={styles.field}>
            <label>Location</label>
            <input
              value={getLocaleField(form, 'location', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'location', localeTab, e.target.value, defaultLocale))}
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
