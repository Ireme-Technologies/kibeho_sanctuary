import { useEffect, useState } from 'react'
import { deleteContactMessage, fetchContactMessages } from '@api/cms'
import { confirmDelete } from './components/confirmDelete'
import styles from './admin.module.css'

export default function MessagesAdminPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  const load = async () => setItems(await fetchContactMessages())

  useEffect(() => {
    load().catch((err) => setError(err.message))
  }, [])

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this message?'))) return
    await deleteContactMessage(id)
    await load()
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Contact messages</h1>
      </div>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Message</th>
              <th>Received</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone || '—'}</td>
                <td>{item.message}</td>
                <td>{item.created_at ? new Date(item.created_at).toLocaleString() : '—'}</td>
                <td>
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
                <td colSpan={6} className={styles.muted}>No messages yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
