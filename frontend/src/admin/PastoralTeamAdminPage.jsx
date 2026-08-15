import { useEffect, useState } from 'react'
import {
  createPastoralTeamMember,
  deletePastoralTeamMember,
  fetchPastoralTeam,
  updatePastoralTeamMember,
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

const LOCALE_FIELDS = ['name', 'role', 'bio']

const empty = {
  name: '',
  role: '',
  bio: '',
  photo: '',
  sort_order: '',
  is_published: true,
  translations: {},
}

export default function PastoralTeamAdminPage() {
  const { defaultLocale } = useLocale()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const load = async () => setItems(await fetchPastoralTeam())

  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load pastoral team' }))
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
      name: item.name || '',
      role: item.role || '',
      bio: item.bio || item.description || '',
      photo: item.photo || item.coverImage || '',
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
      translations: splitTranslationsPayload(form, LOCALE_FIELDS, defaultLocale),
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editingId) await updatePastoralTeamMember(editingId, payload())
      else await createPastoralTeamMember(payload())
      setOpen(false)
      await load()
      setFlash({
        type: 'success',
        message: editingId ? 'Team member updated.' : 'Team member added.',
      })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save team member.' })
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this team member?'))) return
    try {
      await deletePastoralTeamMember(id)
      await load()
      setFlash({ type: 'success', message: 'Team member deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete team member.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Pastoral team</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>
          Add member
        </button>
      </div>
      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />
      <p className={styles.muted}>
        These people appear on the public Pastoral Team page under Our Lady of Kibeho.
      </p>
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Photo</th>
              <th>Name</th>
              <LocaleColumnHeaders defaultLocale={defaultLocale} />
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  {item.photo || item.coverImage ? (
                    <img className={styles.thumb} src={item.photo || item.coverImage} alt="" />
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
                <td>{item.role || '—'}</td>
              </tr>
            ))}
            {!items.length ? (
              <tr>
                <td colSpan={8} className={styles.muted}>
                  No team members yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Modal
        open={open}
        title={editingId ? 'Edit team member' : 'Add team member'}
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
            <label>Role</label>
            <input
              value={getLocaleField(form, 'role', localeTab, defaultLocale)}
              onChange={(e) => setForm(setLocaleField(form, 'role', localeTab, e.target.value, defaultLocale))}
              placeholder="Rector, Chaplain, …"
            />
          </div>
          <div className={styles.field}>
            <label>Biography</label>
            <RichTextEditor
              value={getLocaleField(form, 'bio', localeTab, defaultLocale)}
              onChange={(html) => setForm(setLocaleField(form, 'bio', localeTab, html, defaultLocale))}
            />
            <p className={styles.muted}>Listings show the first 160 characters.</p>
          </div>
          <ImageField
            label="Photo"
            value={form.photo}
            onChange={(url) => setForm({ ...form, photo: url })}
            folder="pastoral-team"
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
