import { useEffect, useState } from 'react'
import {
  createShrineProject,
  deleteShrineProject,
  fetchShrineProjects,
  updateShrineProject,
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

const LOCALE_FIELDS = ['title', 'description', 'status', 'phase']

const empty = {
  title: '',
  status: '',
  phase: '',
  description: '',
  cover_image: '',
  gallery: [],
  funding_goal: '',
  funding_raised: '',
  featured: false,
  sort_order: 0,
  is_published: true,
  translations: {},
}

export default function ShrineProjectsAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchShrineProjects())

  useEffect(() => {
    load().catch((err) =>
      setFlash({ type: 'error', message: err.message || 'Failed to load development projects' })
    )
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
      status: item.status || '',
      phase: item.phase || '',
      description: item.description || '',
      cover_image: item.coverImage || '',
      gallery: Array.isArray(item.gallery) ? item.gallery : [],
      funding_goal: item.fundingGoal || '',
      funding_raised: item.fundingRaised || '',
      featured: Boolean(item.featured),
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
      if (editingId) await updateShrineProject(editingId, payload())
      else await createShrineProject(payload())
      setOpen(false)
      await load()
      setFlash({
        type: 'success',
        message: editingId ? 'Development project updated.' : 'Development project created.',
      })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save development project.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this development project?'))) return
    try {
      await deleteShrineProject(id)
      await load()
      setFlash({ type: 'success', message: 'Development project deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete development project.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Development projects</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>
          Add project
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
              <th>Title</th>
              <LocaleColumnHeaders defaultLocale={defaultLocale} />
              <th>Status</th>
              <th>Featured</th>
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
                <td>{item.status || '—'}</td>
                <td>{item.featured ? 'Yes' : 'No'}</td>
              </tr>
            ))}
            {!items.length && (
              <tr>
                <td colSpan={8} className={styles.muted}>
                  No development projects yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title={editingId ? 'Edit development project' : 'Add development project'}
        onClose={() => setOpen(false)}
        wide
      >
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
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Status</label>
              <input
                value={getLocaleField(form, 'status', localeTab, defaultLocale)}
                onChange={(e) => setForm(setLocaleField(form, 'status', localeTab, e.target.value, defaultLocale))}
                placeholder="e.g. In progress, Completed"
              />
            </div>
            <div className={styles.field}>
              <label>Phase</label>
              <input
                value={getLocaleField(form, 'phase', localeTab, defaultLocale)}
                onChange={(e) => setForm(setLocaleField(form, 'phase', localeTab, e.target.value, defaultLocale))}
                placeholder="e.g. Phase 1"
              />
            </div>
          </div>
          <div className={styles.field}>
            <label>Description</label>
            <RichTextEditor
              value={getLocaleField(form, 'description', localeTab, defaultLocale)}
              onChange={(html) => setForm(setLocaleField(form, 'description', localeTab, html, defaultLocale))}
            />
            <p className={styles.muted}>Listings show the first 160 characters of this description.</p>
          </div>
          <ImageField
            label="Cover image"
            value={form.cover_image}
            onChange={(url) => setForm({ ...form, cover_image: url })}
            folder="shrine-projects"
          />
          <MultiImageField
            label="Gallery images"
            value={form.gallery}
            onChange={(gallery) => setForm({ ...form, gallery })}
            folder="shrine-projects"
          />
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Funding goal</label>
              <input
                value={form.funding_goal}
                onChange={(e) => setForm({ ...form, funding_goal: e.target.value })}
                placeholder="e.g. $500,000"
              />
            </div>
            <div className={styles.field}>
              <label>Funding raised</label>
              <input
                value={form.funding_raised}
                onChange={(e) => setForm({ ...form, funding_raised: e.target.value })}
                placeholder="e.g. $120,000"
              />
            </div>
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
