import { useEffect, useState } from 'react'
import {
  createMaryMessage,
  deleteMaryMessage,
  fetchMaryMessages,
  updateMaryMessage,
} from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import Modal from './components/Modal'
import ImageField from './components/ImageField'
import RichTextEditor from './components/RichTextEditor'
import FlashMessage from './components/FlashMessage'
import { confirmDelete } from './components/confirmDelete'
import LocaleTabs, { getLocaleField, setLocaleField, splitTranslationsPayload } from './components/LocaleTabs'
import { LocaleColumnHeaders, LocaleColumnCells } from './components/LocaleColumns'
import ListTitle from './components/ListTitle'
import styles from './admin.module.css'

const LOCALE_FIELDS = ['title', 'summary', 'body', 'theme', 'date_context']

const empty = {
  number: '',
  title: '',
  summary: '',
  body: '',
  date_context: '',
  theme: '',
  image: '',
  sort_order: 0,
  is_published: true,
  translations: {},
}

export default function MaryMessagesAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchMaryMessages())

  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load messages' }))
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
      number: item.number ?? '',
      title: item.title || '',
      summary: item.summary || '',
      body: item.body || '',
      date_context: item.dateContext || '',
      theme: item.theme || '',
      image: item.image || item.coverImage || '',
      sort_order: item.sortOrder ?? 0,
      is_published: item.isPublished !== false,
      translations: item.translations || {},
    })
    setLocaleTab(localeCode || defaultLocale || 'en')
    setError('')
    setOpen(true)
  }

  const payload = () => {
    const { translations: _t, number, ...rest } = form
    return {
      ...rest,
      ...(number === '' || number == null ? {} : { number: Number(number) }),
      sort_order: Number(form.sort_order) || 0,
      translations: splitTranslationsPayload(form, LOCALE_FIELDS, defaultLocale),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) await updateMaryMessage(editingId, payload())
      else await createMaryMessage(payload())
      setOpen(false)
      await load()
      setFlash({ type: 'success', message: editingId ? 'Message updated.' : 'Message added.' })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save message.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this message?'))) return
    try {
      await deleteMaryMessage(id)
      await load()
      setFlash({ type: 'success', message: 'Message deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete message.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Messages of Mary</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>
          Add message
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
              <th>#</th>
              <th>Title</th>
              <LocaleColumnHeaders defaultLocale={defaultLocale} />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.number || '—'}</td>
                <td>
                  <ListTitle
                    title={item.title}
                    onEdit={() => openEdit(item)}
                    onDelete={() => handleDelete(item.id)}
                  />
                </td>
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
                  No messages yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editingId ? 'Edit message' : 'Add message'} onClose={() => setOpen(false)} wide>
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
            <label>Message number</label>
            <input
              type="number"
              min="1"
              max="99"
              value={form.number}
              onChange={(e) => setForm({ ...form, number: e.target.value })}
            />
          </div>
          <div className={styles.field}>
            <label>Title</label>
            <input
              value={getLocaleField(form, 'title', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'title', localeTab, e.target.value, defaultLocale))}
              required={localeTab === defaultLocale}
            />
          </div>
          <div className={styles.field}>
            <label>Summary</label>
            <textarea
              rows={3}
              value={getLocaleField(form, 'summary', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'summary', localeTab, e.target.value, defaultLocale))}
            />
          </div>
          <div className={styles.field}>
            <label>Body</label>
            <RichTextEditor
              value={getLocaleField(form, 'body', localeTab, defaultLocale)}
              onChange={(html) => setForm(setLocaleField(form, 'body', localeTab, html, defaultLocale))}
            />
          </div>
          <div className={styles.field}>
            <label>Theme</label>
            <input
              value={getLocaleField(form, 'theme', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'theme', localeTab, e.target.value, defaultLocale))}
            />
          </div>
          <div className={styles.field}>
            <label>Date context</label>
            <input
              value={getLocaleField(form, 'date_context', localeTab, defaultLocale)}
              onChange={(e) =>
                setForm(setLocaleField(form, 'date_context', localeTab, e.target.value, defaultLocale))
              }
            />
          </div>
          <ImageField
            label="Image"
            value={form.image}
            onChange={(url) => setForm({ ...form, image: url })}
            folder="mary-messages"
          />
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
