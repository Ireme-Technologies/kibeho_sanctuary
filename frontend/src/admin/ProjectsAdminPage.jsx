import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { createProject, deleteProject, fetchAccommodationReservations, fetchProjects, updateProject } from '@api/cms'
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

function imageUrl(value) {
  if (!value) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'object') return value.url || value.src || ''
  return ''
}

function splitReviews(links) {
  const list = Array.isArray(links) ? links : []
  const google = list.find((link) => link.platform === 'google')?.url || ''
  const tripadvisor = list.find((link) => link.platform === 'tripadvisor')?.url || ''
  const others = list
    .filter((link) => link.platform !== 'google' && link.platform !== 'tripadvisor' && link.url)
    .map((link) => ({ label: link.label || '', url: link.url || '' }))
  return {
    review_google: google,
    review_tripadvisor: tripadvisor,
    review_others: others.length ? others : [{ label: '', url: '' }],
  }
}

function packReviews(form) {
  const links = []
  if (String(form.review_google || '').trim()) {
    links.push({ platform: 'google', label: 'Google', url: form.review_google.trim() })
  }
  if (String(form.review_tripadvisor || '').trim()) {
    links.push({ platform: 'tripadvisor', label: 'Tripadvisor', url: form.review_tripadvisor.trim() })
  }
  ;(form.review_others || []).forEach((row) => {
    const url = String(row.url || '').trim()
    if (!url) return
    links.push({ platform: 'other', label: String(row.label || '').trim() || 'Reviews', url })
  })
  return links
}

function packMeetingRooms(rows) {
  return (rows || [])
    .map((row) => {
      const name = String(row.name || '').trim()
      const capacity = row.capacity === '' || row.capacity == null ? null : Number(row.capacity)
      return { name, capacity: Number.isFinite(capacity) && capacity > 0 ? capacity : null }
    })
    .filter((row) => row.name || row.capacity)
}

function listingImage(item) {
  const gallery = Array.isArray(item?.gallery) ? item.gallery.map(imageUrl).filter(Boolean) : []
  return imageUrl(item?.coverImage) || imageUrl(item?.featuredImage) || gallery[0] || ''
}

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
  room_count: '',
  distance_from_kibeho: '',
  price_from: '',
  meeting_rooms: [{ name: '', capacity: '' }],
  review_google: '',
  review_tripadvisor: '',
  review_others: [{ label: '', url: '' }],
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
  const [reservationCount, setReservationCount] = useState(null)

  const load = async () => setItems(await fetchProjects())
  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load accommodations' }))
    fetchAccommodationReservations({ page: 1 })
      .then((result) => setReservationCount(result?.grand_total ?? result?.total ?? 0))
      .catch(() => setReservationCount(null))
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
      gallery: Array.isArray(item.gallery) ? item.gallery.map(imageUrl).filter(Boolean) : [],
      amenities: Array.isArray(item.amenities) ? item.amenities : [],
      services: Array.isArray(item.services) ? item.services : [],
      website_url: item.websiteUrl || '',
      phone: item.phone || '',
      whatsapp: item.whatsapp || '',
      email: item.email || '',
      room_count: item.roomCount ?? '',
      distance_from_kibeho: item.distanceFromKibeho || '',
      price_from: item.priceFrom ?? '',
      meeting_rooms:
        Array.isArray(item.meetingRooms) && item.meetingRooms.length
          ? item.meetingRooms.map((room) => ({ name: room.name || '', capacity: room.capacity ?? '' }))
          : [{ name: '', capacity: '' }],
      ...splitReviews(item.reviewLinks),
      sort_order: item.sortOrder ?? '',
      is_published: item.isPublished !== false,
      translations: item.translations || {},
    })
    setLocaleTab(localeCode || defaultLocale || 'en')
    setError('')
    setOpen(true)
  }

  const payload = () => {
    const {
      translations: _t,
      sort_order,
      review_google: _google,
      review_tripadvisor: _tripadvisor,
      review_others: _others,
      ...rest
    } = form
    return {
      ...rest,
      room_count: form.room_count === '' || form.room_count == null ? null : Number(form.room_count),
      distance_from_kibeho: form.distance_from_kibeho || null,
      price_from: form.price_from === '' || form.price_from == null ? null : Number(form.price_from),
      meeting_rooms: packMeetingRooms(form.meeting_rooms),
      review_links: packReviews(form),
      ...(sort_order === '' || sort_order == null ? {} : { sort_order: Number(sort_order) }),
      rating: form.rating === '' || form.rating == null ? null : Number(form.rating),
      booking_url: form.booking_url || null,
      gallery: Array.isArray(form.gallery) ? form.gallery.map(imageUrl).filter(Boolean) : [],
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
        <div className={styles.actions}>
          <Link to="/admin/accommodation-reservations" className={`${styles.btn} ${styles.btnSecondary}`}>
            Reservations{reservationCount == null ? '' : ` (${reservationCount})`}
          </Link>
          <button type="button" className={styles.btn} onClick={openCreate}>Add accommodation</button>
        </div>
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
                <td>
                  {listingImage(item) ? (
                    <img className={styles.thumb} src={listingImage(item)} alt="" />
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
              <label>Reservation URL</label>
              <input
                value={form.booking_url}
                onChange={(e) => setForm({ ...form, booking_url: e.target.value })}
                placeholder="https://hotel-booking.example"
              />
              <p className={styles.muted}>
                Optional link to the hotel’s own booking page. Book Now on this website always opens the sanctuary form.
              </p>
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
              <p className={styles.muted}>Book Now sends the reservation to this number. Leave it empty to hide Book Now.</p>
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
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Number of rooms</label>
              <input
                type="number"
                min="1"
                value={form.room_count}
                onChange={(e) => setForm({ ...form, room_count: e.target.value })}
                placeholder="e.g. 40"
              />
              <p className={styles.muted}>Each room is treated as hosting 2 guests.</p>
            </div>
            <div className={styles.field}>
              <label>Distance from Kibeho</label>
              <input
                value={form.distance_from_kibeho}
                onChange={(e) => setForm({ ...form, distance_from_kibeho: e.target.value })}
                placeholder="e.g. 1.2 km"
              />
            </div>
            <div className={styles.field}>
              <label>Room price starts from (RWF)</label>
              <input
                type="number"
                min="0"
                value={form.price_from}
                onChange={(e) => setForm({ ...form, price_from: e.target.value })}
                placeholder="e.g. 25000"
              />
            </div>
          </div>
          <div className={styles.field}>
            <label>Meeting rooms</label>
            <p className={styles.muted}>Add each room and how many people it can host.</p>
            {(form.meeting_rooms || []).map((room, index) => (
              <div key={index} className={styles.fieldRow}>
                <input
                  value={room.name}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      meeting_rooms: current.meeting_rooms.map((entry, i) =>
                        i === index ? { ...entry, name: e.target.value } : entry,
                      ),
                    }))
                  }
                  placeholder="Room name"
                />
                <input
                  type="number"
                  min="1"
                  value={room.capacity}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      meeting_rooms: current.meeting_rooms.map((entry, i) =>
                        i === index ? { ...entry, capacity: e.target.value } : entry,
                      ),
                    }))
                  }
                  placeholder="People"
                />
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      meeting_rooms:
                        current.meeting_rooms.length === 1
                          ? [{ name: '', capacity: '' }]
                          : current.meeting_rooms.filter((_, i) => i !== index),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  meeting_rooms: [...(current.meeting_rooms || []), { name: '', capacity: '' }],
                }))
              }
            >
              Add meeting room
            </button>
          </div>
          <div className={styles.field}>
            <label>Review links</label>
            <p className={styles.muted}>The public page shows this section only when at least one link is saved.</p>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label>Google</label>
                <input
                  value={form.review_google}
                  onChange={(e) => setForm({ ...form, review_google: e.target.value })}
                  placeholder="https://maps.google.com/..."
                />
              </div>
              <div className={styles.field}>
                <label>Tripadvisor</label>
                <input
                  value={form.review_tripadvisor}
                  onChange={(e) => setForm({ ...form, review_tripadvisor: e.target.value })}
                  placeholder="https://www.tripadvisor.com/..."
                />
              </div>
            </div>
            {(form.review_others || []).map((row, index) => (
              <div key={index} className={styles.fieldRow}>
                <input
                  value={row.label}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      review_others: current.review_others.map((entry, i) =>
                        i === index ? { ...entry, label: e.target.value } : entry,
                      ),
                    }))
                  }
                  placeholder="Platform name"
                />
                <input
                  value={row.url}
                  onChange={(e) =>
                    setForm((current) => ({
                      ...current,
                      review_others: current.review_others.map((entry, i) =>
                        i === index ? { ...entry, url: e.target.value } : entry,
                      ),
                    }))
                  }
                  placeholder="https://..."
                />
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() =>
                    setForm((current) => ({
                      ...current,
                      review_others:
                        current.review_others.length === 1
                          ? [{ label: '', url: '' }]
                          : current.review_others.filter((_, i) => i !== index),
                    }))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() =>
                setForm((current) => ({
                  ...current,
                  review_others: [...(current.review_others || []), { label: '', url: '' }],
                }))
              }
            >
              Add another review link
            </button>
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
            onChange={(url) => setForm((current) => ({ ...current, cover_image: url }))}
            folder="projects"
          />
          <ImageField
            label="Featured image"
            value={form.featured_image}
            onChange={(url) => setForm((current) => ({ ...current, featured_image: url }))}
            folder="projects"
          />
          <MultiImageField
            label="Gallery images"
            hint="Upload several images at once, or open the library and click every photo you want. Selected photos stay highlighted; click one again to remove it."
            value={form.gallery}
            onChange={(gallery) => setForm((current) => ({ ...current, gallery }))}
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
