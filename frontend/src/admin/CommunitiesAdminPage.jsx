import { useEffect, useState } from 'react'
import {
  createCommunity,
  deleteCommunity,
  fetchCommunities,
  updateCommunity,
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

const LOCALE_FIELDS = ['name', 'location', 'description']

const empty = {
  name: '',
  location: '',
  description: '',
  cover_image: '',
  gallery: [],
  sort_order: '',
  is_published: true,
  translations: {},
}

export default function CommunitiesAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchCommunities())

  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load communities' }))
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
      name: item.name || item.title || '',
      location: item.location || '',
      description: item.description || '',
      cover_image: item.coverImage || '',
      gallery: Array.isArray(item.gallery) ? item.gallery : [],
      sort_order: item.sortOrder ?? '',
      is_published: item.isPublished !== false,
      translations: item.translations || {},
    })
    setLocaleTab(localeCode || defaultLocale || 'en')
    setError('')
    setOpen(true)
  }

  const payload = () => {
    const { translations: _t, sort_order, ...rest } = form
    return {
      ...rest,
      gallery: Array.isArray(form.gallery) ? form.gallery : [],
      ...(sort_order === '' || sort_order == null ? {} : { sort_order: Number(sort_order) }),
      translations: splitTranslationsPayload(form, LOCALE_FIELDS, defaultLocale),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateCommunity(editingId, payload())
      else await createCommunity(payload())
      setOpen(false)
      await load()
      setFlash({
        type: 'success',
        message: editingId ? 'Community updated.' : 'Community added.',
      })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save community.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this community?'))) return
    try {
      await deleteCommunity(id)
      await load()
      setFlash({ type: 'success', message: 'Community deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete community.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Communities</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>
          Add community
        </button>
      </div>
      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />
      <p className={styles.muted}>
        Parishes, villages, and religious communities around Kibeho. They appear under Our Lady of Kibeho.
      </p>
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <LocaleColumnHeaders defaultLocale={defaultLocale} />
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.coverImage ? <img className={styles.thumb} src={item.coverImage} alt="" /> : '—'}
                </td>
                <td>
                  <ListTitle
                    title={item.name || item.title}
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
                <td>{item.location || '—'}</td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={8} className={styles.muted}>
                  No communities yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title={editingId ? 'Edit community' : 'Add community'}
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
            <label>Name</label>
            <input
              value={getLocaleField(form, 'name', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'name', localeTab, e.target.value, defaultLocale))}
              required={localeTab === defaultLocale}
            />
          </div>
          <div className={styles.field}>
            <label>Location</label>
            <input
              value={getLocaleField(form, 'location', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'location', localeTab, e.target.value, defaultLocale))}
              placeholder="Kibeho, Nyaruguru"
            />
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
            folder="communities"
          />
          <MultiImageField
            label="Gallery images"
            value={form.gallery}
            onChange={(gallery) => setForm({ ...form, gallery })}
            folder="communities"
          />
          <div className={styles.field}>
            <label>Sort order</label>
            <input
              type="number"
              min="0"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
              placeholder="Leave blank to keep at the end"
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
          {error ? <p className={styles.error}>{error}</p> : null}
          <div className={styles.actions}>
            <button className={styles.btn} type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setOpen(false)}>
              Cancel
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
