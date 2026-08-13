import { useEffect, useState } from 'react'
import {
  createUpcomingPilgrimage,
  deleteUpcomingPilgrimage,
  fetchUpcomingPilgrimages,
  updateUpcomingPilgrimage,
} from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import Modal from './components/Modal'
import ImageField from './components/ImageField'
import RichTextEditor from './components/RichTextEditor'
import FlashMessage from './components/FlashMessage'
import { confirmDelete } from './components/confirmDelete'
import LocaleTabs, { getLocaleField, setLocaleField, splitTranslationsPayload } from './components/LocaleTabs'
import { formatEventWhen, formatRecurrence, RECURRENCE_OPTIONS } from '@utils/eventTime'
import styles from './admin.module.css'

const LOCALE_FIELDS = ['title', 'meta', 'short_description', 'description', 'location']

const empty = {
  title: '',
  event_type: 'pilgrimage',
  meta: '',
  short_description: '',
  description: '',
  image: '',
  location: '',
  starts_on: '',
  ends_on: '',
  starts_at_time: '',
  ends_at_time: '',
  recurrence_type: '',
  sort_order: 0,
  registration_open: true,
  is_published: true,
  translations: {},
}

const EVENT_TYPES = [
  { value: 'pilgrimage', label: 'Pilgrimage' },
  { value: 'feast', label: 'Feast day' },
  { value: 'retreat', label: 'Retreat' },
  { value: 'calendar', label: 'Calendar event' },
]

export default function UpcomingPilgrimagesAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchUpcomingPilgrimages())

  useEffect(() => {
    load().catch((err) =>
      setFlash({ type: 'error', message: err.message || 'Failed to load pilgrimages' })
    )
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
      event_type: item.eventType || 'pilgrimage',
      meta: item.meta || '',
      short_description: item.shortDescription || '',
      description: item.description || '',
      image: item.image || '',
      location: item.location || '',
      starts_on: item.startsOn || '',
      ends_on: item.endsOn || '',
      starts_at_time: item.startsAtTime || '',
      ends_at_time: item.endsAtTime || '',
      recurrence_type: item.recurrenceType || (item.isRecurring ? 'annual' : ''),
      sort_order: item.sortOrder || 0,
      registration_open: item.registrationOpen !== false,
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
      starts_on: form.starts_on || null,
      ends_on: form.ends_on || null,
      starts_at_time: form.starts_at_time || null,
      ends_at_time: form.ends_at_time || null,
      recurrence_type: form.recurrence_type || null,
      translations: splitTranslationsPayload(form, LOCALE_FIELDS, defaultLocale),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateUpcomingPilgrimage(editingId, payload())
      else await createUpcomingPilgrimage(payload())
      setOpen(false)
      await load()
      setFlash({
        type: 'success',
        message: editingId ? 'Event updated.' : 'Event created.',
      })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save event.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this event?'))) return
    try {
      await deleteUpcomingPilgrimage(id)
      await load()
      setFlash({ type: 'success', message: 'Event deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete event.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Pilgrimage events</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>
          Add event
        </button>
      </div>

      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <p className={styles.muted} style={{ marginBottom: '1rem' }}>
        Manage pilgrimages, feast days, retreats, and other calendar events. Set dates, times, and
        recurrence (weekly, monthly, or annual). Published events appear on the public calendar and homepage.
      </p>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>When</th>
              <th>Repeats</th>
              <th>Published</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.image ? <img className={styles.thumb} src={item.image} alt="" /> : '—'}</td>
                <td>{item.title}</td>
                <td>{formatEventWhen(item) || item.meta || '—'}</td>
                <td>{formatRecurrence(item) || 'One-time'}</td>
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
        title={editingId ? 'Edit pilgrimage event' : 'Add pilgrimage event'}
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
              <label>Event type</label>
              <select
                value={form.event_type}
                onChange={(e) => setForm({ ...form, event_type: e.target.value })}
              >
                {EVENT_TYPES.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.field}>
              <label>Short label (optional)</label>
              <input
                value={getLocaleField(form, 'meta', localeTab, defaultLocale)}
                onChange={(e) => setForm(setLocaleField(form, 'meta', localeTab, e.target.value, defaultLocale))}
                placeholder="e.g. National pilgrimage"
              />
            </div>
          </div>
          <div className={styles.field}>
            <label>Location</label>
            <input
              value={getLocaleField(form, 'location', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'location', localeTab, e.target.value, defaultLocale))}
            />
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Start date</label>
              <input
                type="date"
                value={form.starts_on}
                onChange={(e) => setForm({ ...form, starts_on: e.target.value })}
                required
              />
            </div>
            <div className={styles.field}>
              <label>End date</label>
              <input
                type="date"
                value={form.ends_on}
                onChange={(e) => setForm({ ...form, ends_on: e.target.value })}
              />
            </div>
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Start time</label>
              <input
                type="time"
                value={form.starts_at_time}
                onChange={(e) => setForm({ ...form, starts_at_time: e.target.value })}
              />
            </div>
            <div className={styles.field}>
              <label>End time</label>
              <input
                type="time"
                value={form.ends_at_time}
                onChange={(e) => setForm({ ...form, ends_at_time: e.target.value })}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label>Recurrence</label>
            <select
              value={form.recurrence_type}
              onChange={(e) => setForm({ ...form, recurrence_type: e.target.value })}
            >
              {RECURRENCE_OPTIONS.map((opt) => (
                <option key={opt.value || 'none'} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>Short description</label>
            <textarea
              rows={3}
              value={getLocaleField(form, 'short_description', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'short_description', localeTab, e.target.value, defaultLocale))}
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
            label="Cover image"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            folder="pilgrimages"
          />
          <div className={styles.field}>
            <label>Sort order</label>
            <input
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })}
            />
          </div>
          <label>
            <input
              type="checkbox"
              checked={form.registration_open}
              onChange={(e) => setForm({ ...form, registration_open: e.target.checked })}
            />{' '}
            Registration open
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
