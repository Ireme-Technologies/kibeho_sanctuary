import { useEffect, useState } from 'react'
import { createUser, deleteUser, fetchUsers, updateUser } from '@api/cms'
import { useAuth } from '@context/AuthContext'
import Modal from './components/Modal'
import FlashMessage from './components/FlashMessage'
import { confirmDelete } from './components/confirmDelete'
import styles from './admin.module.css'

const empty = { name: '', email: '', password: '', role: 'super_admin' }

export default function UsersAdminPage() {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [form, setForm] = useState(empty)
  const [editingId, setEditingId] = useState(null)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })

  const canManageUsers = Boolean(user?.can_manage_users)

  const load = async () => setItems(await fetchUsers())

  useEffect(() => {
    if (!canManageUsers) return
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load users' }))
  }, [canManageUsers])

  if (!canManageUsers) {
    return (
      <div className={styles.card}>
        <h1>Users</h1>
        <p className={styles.error}>Only @iremetech.com accounts can manage users.</p>
      </div>
    )
  }

  const openCreate = () => { setEditingId(null); setForm(empty); setError(''); setOpen(true) }
  const openEdit = (item) => {
    setEditingId(item.id)
    setForm({ name: item.name || '', email: item.email || '', password: '', role: item.role || 'super_admin' })
    setError('')
    setOpen(true)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editingId) {
        const body = { name: form.name, email: form.email, role: form.role }
        if (form.password) body.password = form.password
        await updateUser(editingId, body)
      } else {
        await createUser(form)
      }
      setOpen(false)
      await load()
      setFlash({
        type: 'success',
        message: editingId ? 'User updated successfully.' : 'User created successfully.',
      })
    } catch (err) {
      setError(err.message || 'Save failed')
      setFlash({ type: 'error', message: err.message || 'Failed to save user.' })
    }
  }

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this user?'))) return
    try {
      await deleteUser(id)
      await load()
      setFlash({ type: 'success', message: 'User deleted successfully.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to delete user.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Users</h1>
        <button type="button" className={styles.btn} onClick={openCreate}>Add user</button>
      </div>
      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Role</th><th /></tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>
                  {item.email}
                  {item.is_master_admin ? ' (master)' : ''}
                  {item.can_manage_users ? ' · ireme' : ''}
                </td>
                <td>{item.role}</td>
                <td className={styles.actions}>
                  <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => openEdit(item)}>Edit</button>
                  {item.id !== user?.id && (
                    <button type="button" className={`${styles.btn} ${styles.btnDanger}`} onClick={() => handleDelete(item.id)}>Delete</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={open} title={editingId ? 'Edit user' : 'Add user'} onClose={() => setOpen(false)}>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label>Name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </div>
          <div className={styles.field}>
            <label>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div className={styles.field}>
            <label>{editingId ? 'New password (optional)' : 'Password'}</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editingId} minLength={8} />
          </div>
          <div className={styles.field}>
            <label>Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="super_admin">Super admin</option>
              <option value="editor">Editor</option>
            </select>
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <div className={styles.actions}>
            <button className={styles.btn} type="submit">Save</button>
            <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => setOpen(false)}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
