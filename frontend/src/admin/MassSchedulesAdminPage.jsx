import { useEffect, useState } from 'react'
import {
  createMassSchedule,
  deleteMassSchedule,
  fetchMassSchedules,
  updateMassSchedule,
} from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import Modal from './components/Modal'
import FlashMessage from './components/FlashMessage'
import { confirmDelete } from './components/confirmDelete'
import LocaleTabs, { getLocaleField, setLocaleField, splitTranslationsPayload } from './components/LocaleTabs'
import { formatMassTime, formatRecurrence, RECURRENCE_OPTIONS } from '@utils/eventTime'
import styles from './admin.module.css'

const LOCALE_FIELDS = ['day_label', 'title', 'notes']

const empty = {
  day_label: '',
  title: '',
  starts_at_time: '',
  ends_at_time: '',
  recurrence_type: 'weekly',
  language: '',
  location: '',
  notes: '',
  sort_order: 0,
  is_published: true,
  translations: {},
}

export default function MassSchedulesAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchMassSchedules())

  useEffect(() => {
    load().catch((err) =>
      setFlash({ type: 'error', message: err.message || 'Failed to load mass schedules' })
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
      day_label: item.dayLabel || '',
      title: item.title || '',
      starts_at_time: item.startsAtTime || '',
      ends_at_time: item.endsAtTime || '',
      recurrence_type: item.recurrenceType || (item.isRecurring ? 'weekly' : ''),
      language: item.language || '',
      location: item.location || '',
      notes: item.notes || '',
      sort_order: item.sortOrder ?? 0,
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
      starts_at_time: form.starts_at_time || null,
      ends_at_time: form.ends_at_time || null,
      recurrence_type: form.recurrence_type || null,
      sort_order: Number(form.sort_order) || 0,
      translations: splitTranslationsPayload(form, LOCALE_FIELDS, defaultLocale),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateMassSchedule(editingId, payload())
      else await createMassSchedule(payload())
      setOpen(false)
      await load()
      setFlash({
        type: 'success',
        message: editingId ? 'Mass schedule updated.' : 'Mass schedule created.',
      })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save mass schedule.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this mass schedule entry?'))) return
    try {
      await deleteMassSchedule(id)
      await load()
      setFlash({ type: 'success', message: 'Mass schedule deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete mass schedule.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Mass schedules</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>
          Add schedule
        </button>
      </div>

      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <p className={styles.muted} style={{ marginBottom: '1rem' }}>
        Set start and end times, and whether Mass repeats weekly, monthly, or annually.
      </p>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Day</th>
              <th>Title</th>
              <th>Time</th>
              <th>Repeats</th>
              <th>Published</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.dayLabel || '—'}</td>
                <td>{item.title}</td>
                <td>{formatMassTime(item) || '—'}</td>
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
            {!items.length && (
              <tr>
                <td colSpan={6} className={styles.muted}>
                  No mass schedules yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title={editingId ? 'Edit mass schedule' : 'Add mass schedule'}
        onClose={() => setOpen(false)}
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
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Day label</label>
              <input
                value={getLocaleField(form, 'day_label', localeTab, defaultLocale)}
                onChange={(e) => setForm(setLocaleField(form, 'day_label', localeTab, e.target.value, defaultLocale))}
                placeholder="e.g. Sunday, Weekdays"
                required={localeTab === defaultLocale}
              />
            </div>
            <div className={styles.field}>
              <label>Title</label>
              <input
                value={getLocaleField(form, 'title', localeTab, defaultLocale)}
                onChange={(e) => setForm(setLocaleField(form, 'title', localeTab, e.target.value, defaultLocale))}
                placeholder="e.g. Holy Mass"
                required={localeTab === defaultLocale}
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
                required
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
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Language</label>
              <input
                value={form.language}
                onChange={(e) => setForm({ ...form, language: e.target.value })}
                placeholder="e.g. Kinyarwanda, English"
              />
            </div>
            <div className={styles.field}>
              <label>Location</label>
              <input
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
          </div>
          <div className={styles.field}>
            <label>Notes</label>
            <textarea
              rows={3}
              value={getLocaleField(form, 'notes', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'notes', localeTab, e.target.value, defaultLocale))}
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
