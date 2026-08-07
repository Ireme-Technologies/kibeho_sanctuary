import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchClientEnquiries } from '@api/cms'
import styles from './client.module.css'

export default function ClientDashboardPage() {
  const [items, setItems] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchClientEnquiries()
      .then(setItems)
      .catch((err) => setError(err.message))
  }, [])

  return (
    <div>
      <h1 className={styles.title}>My enquiries</h1>
      {error && <p className={styles.error}>{error}</p>}
      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Channel</th>
              <th>Status</th>
              <th>Preview</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.created_at ? new Date(item.created_at).toLocaleString() : '—'}</td>
                <td>{item.channel}</td>
                <td>{String(item.status || '').replace(/_/g, ' ')}</td>
                <td>{(item.message || '').slice(0, 80)}</td>
                <td>
                  <Link className={styles.btn} to={`/client/enquiries/${item.id}`}>Open</Link>
                </td>
              </tr>
            ))}
            {!items.length && !error && (
              <tr>
                <td colSpan={5} className={styles.muted}>
                  No enquiries yet. <a href="/contact">Submit one</a> or create an account with the email you used.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
