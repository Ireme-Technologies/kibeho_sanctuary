import { useEffect, useState } from 'react'
import { createProject, deleteProject, fetchProjects, updateProject } from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import Modal from './components/Modal'
import ImageField from './components/ImageField'
import MultiImageField from './components/MultiImageField'
import OptionChecklist from './components/OptionChecklist'
import RichTextEditor from './components/RichTextEditor'
import FlashMessage from './components/FlashMessage'
import { confirmDelete } from './components/confirmDelete'
import LocaleTabs, { getLocaleField, setLocaleField, splitTranslationsPayload } from './components/LocaleTabs'
import { LocaleColumnHeaders, LocaleColumnCells } from './components/LocaleColumns'
import ListTitle from './components/ListTitle'
import { LODGING_AMENITIES, LODGING_SERVICES } from '@data/lodgingCatalog'
import styles from './admin.module.css'

const LOCALE_FIELDS = ['title', 'description', 'category', 'location', 'status']

const CATEGORY_OPTIONS = [
  'Hotel',
  'Guest House',
  'Apartment',
  'Hospitality',
  'Worship',
  'Dining',
  'Services',
  'Gathering',
  'Prayer',
]

const empty = {
  title: '',
  category: 'Guest House',
  year: '',
  location: '',
  client: '',
  area: '',
  status: '',
  rating: '',
  booking_url: '',
  featured: false,
  description: '',
  cover_image: '',
  featured_image: '',
  gallery: [],
  amenities: [],
  services: [],
  website_url: '',
  phone: '',
  whatsapp: '',
  email: '',
  sort_order: '',
  is_published: true,
  translations: {},
}

export default function ProjectsAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchProjects())
  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load accommodations' }))
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
      category: item.category || '',
      year: item.year || '',
      location: item.location || '',
      client: item.client || '',
      area: item.area || '',
      status: item.status || '',
      rating: item.rating ?? '',
      booking_url: item.bookingUrl || '',
      featured: Boolean(item.featured),
      description: item.description || '',
      cover_image: item.coverImage || '',
      featured_image: item.featuredImage || '',
      gallery: Array.isArray(item.gallery) ? item.gallery : [],
      amenities: Array.isArray(item.amenities) ? item.amenities : [],
      services: Array.isArray(item.services) ? item.services : [],
      website_url: item.websiteUrl || '',
      phone: item.phone || '',
      whatsapp: item.whatsapp || '',
      email: item.email || '',
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
      ...(sort_order === '' || sort_order == null ? {} : { sort_order: Number(sort_order) }),
      rating: form.rating === '' || form.rating == null ? null : Number(form.rating),
      booking_url: form.booking_url || null,
      gallery: Array.isArray(form.gallery) ? form.gallery : [],
      amenities: Array.isArray(form.amenities) ? form.amenities : [],
      services: Array.isArray(form.services) ? form.services : [],
      website_url: form.website_url || null,
      phone: form.phone || null,
      whatsapp: form.whatsapp || null,
      email: form.email || null,
      specs: {
        Location: form.location,
        Year: form.year,
        Category: form.category,
        Client: form.client,
        Area: form.area,
        Status: form.status,
        Rating: form.rating || '',
      },
      translations: splitTranslationsPayload(form, LOCALE_FIELDS, defaultLocale),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateProject(editingId, payload())
      else await createProject(payload())
      setOpen(false)
      await load()
      setFlash({
        type: 'success',
        message: editingId ? 'Accommodation updated.' : 'Accommodation created.',
      })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save accommodation.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this accommodation?'))) return
    try {
      await deleteProject(id)
      await load()
      setFlash({ type: 'success', message: 'Accommodation deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete accommodation.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Accommodations</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>Add accommodation</button>
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
              <th>Category</th>
              <th>Featured</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.coverImage ? <img className={styles.thumb} src={item.coverImage} alt="" /> : '—'}</td>
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
                <td>{item.category}</td>
                <td>{item.featured ? 'Yes' : 'No'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editingId ? 'Edit accommodation' : 'Add accommodation'} onClose={() => setOpen(false)} wide>
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
              <label>Category</label>
              <select
                value={getLocaleField(form, 'category', localeTab, defaultLocale)}
                onChange={(e) => setForm(setLocaleField(form, 'category', localeTab, e.target.value, defaultLocale))}
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <p className={styles.muted}>
                Use Hotel, Guest House, or Apartment to show on the homepage accommodation carousel.
              </p>
            </div>
            <div className={styles.field}>
              <label>Year</label>
              <input value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Location</label>
              <input
                value={getLocaleField(form, 'location', localeTab, defaultLocale)}
                onChange={(e) => setForm(setLocaleField(form, 'location', localeTab, e.target.value, defaultLocale))}
              />
            </div>
            <div className={styles.field}>
              <label>Status</label>
              <input
                value={getLocaleField(form, 'status', localeTab, defaultLocale)}
                onChange={(e) => setForm(setLocaleField(form, 'status', localeTab, e.target.value, defaultLocale))}
              />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Star rating (0–5)</label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={form.rating}
                onChange={(e) => setForm({ ...form, rating: e.target.value })}
                placeholder="e.g. 4.5"
              />
            </div>
            <div className={styles.field}>
              <label>Book Now URL</label>
              <input
                value={form.booking_url}
                onChange={(e) => setForm({ ...form, booking_url: e.target.value })}
                placeholder="/contact or https://..."
              />
            </div>
            <div className={styles.field}>
              <label>Official website</label>
              <input
                value={form.website_url}
                onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                placeholder="https://..."
              />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Phone</label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+250 7xx xxx xxx"
              />
            </div>
            <div className={styles.field}>
              <label>WhatsApp</label>
              <input
                value={form.whatsapp}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                placeholder="+250 7xx xxx xxx"
              />
            </div>
            <div className={styles.field}>
              <label>Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="stay@example.com"
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
          <ImageField label="Cover image" value={form.cover_image} onChange={(url) => setForm({ ...form, cover_image: url })} folder="projects" />
          <ImageField label="Featured image" value={form.featured_image} onChange={(url) => setForm({ ...form, featured_image: url })} folder="projects" />
          <MultiImageField
            label="Gallery images"
            value={form.gallery}
            onChange={(gallery) => setForm({ ...form, gallery })}
            folder="projects"
          />
          <OptionChecklist
            label="Amenities"
            hint="Tick what this stay offers. These appear beside the photo gallery."
            options={LODGING_AMENITIES}
            value={form.amenities}
            onChange={(amenities) => setForm({ ...form, amenities })}
            allowCustom
            customPlaceholder="e.g. Campfire"
          />
          <OptionChecklist
            label="Services offered"
            hint="Shown in the services section under the booking buttons."
            options={LODGING_SERVICES}
            value={form.services}
            onChange={(services) => setForm({ ...form, services })}
            allowCustom
            customPlaceholder="e.g. Packed lunch"
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
            <p className={styles.muted}>
              Lower numbers appear first. Leave blank on new listings so older stays stay on top.
            </p>
          </div>
          <label><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
          <label><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Published</label>
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
