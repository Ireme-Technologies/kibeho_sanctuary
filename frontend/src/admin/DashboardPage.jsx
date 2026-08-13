import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Trash2 } from 'lucide-react'
import { deleteEnquiry, fetchEnquiries, fetchEnquiryStats } from '@api/cms'
import FlashMessage from './components/FlashMessage'
import { confirmDelete } from './components/confirmDelete'
import styles from './admin.module.css'

function statusLabel(status) {
  return String(status || 'new').replace(/_/g, ' ')
}

function preview(text = '', max = 70) {
  const clean = String(text).trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max)}…`
}

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    email: 0,
    whatsapp: 0,
    unread: 0,
    in_progress: 0,
  })
  const [items, setItems] = useState([])
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  const load = async () => {
    const [nextStats, list] = await Promise.all([
      fetchEnquiryStats(),
      fetchEnquiries(),
    ])
    setStats(nextStats || {})
    setItems(Array.isArray(list) ? list : [])
  }

  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load dashboard' }))
  }, [])

  const filtered = items.filter((item) => {
    const created = item.created_at ? new Date(item.created_at) : null
    if (!created) return true
    if (from) {
      const start = new Date(`${from}T00:00:00`)
      if (created < start) return false
    }
    if (to) {
      const end = new Date(`${to}T23:59:59`)
      if (created > end) return false
    }
    return true
  })

  const handleDelete = async (id) => {
    if (!(await confirmDelete('Delete this enquiry?'))) return
    try {
      await deleteEnquiry(id)
      await load()
      setFlash({ type: 'success', message: 'Enquiry deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Delete failed.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Recent pilgrim enquiries</h1>
        <Link to="/admin/enquiries" className={`${styles.btn} ${styles.btnSecondary}`}>
          View all
        </Link>
      </div>

      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <div className={styles.howtoGrid}>
        <div className={styles.howtoCard}>
          <h2>Manage languages</h2>
          <p>
            Open any content item and use the <strong>Ikinyarwanda / Français / English / Deutsch</strong> tabs.
            A filled green dot means that language has text. Empty fields fall back to the default language.
          </p>
          <p>
            Use <strong>Copy from default</strong> to duplicate the English (or default) text, then translate in place.
          </p>
          <div className={styles.howtoLinks}>
            <Link to="/admin/sections">Pages &amp; layout</Link>
            <Link to="/admin/blog">News articles</Link>
            <Link to="/admin/translations">Button labels</Link>
          </div>
        </div>
        <div className={styles.howtoCard}>
          <h2>Flexible page layout</h2>
          <p>
            In <strong>Pages</strong>, add layout blocks: heading, rich text, note, list, gallery, YouTube,
            cards, steps, or schedule. Each language can have its own body layout.
          </p>
          <p>
            Inside a text block, the formatting toolbar covers bold, lists, alignment, colour, tables, images,
            and YouTube — then click <strong>Save page</strong>.
          </p>
          <div className={styles.howtoLinks}>
            <Link to="/admin/sections">Open Pages</Link>
            <Link to="/admin/home-hero">Home hero</Link>
          </div>
        </div>
      </div>

      <div className={styles.filterBar}>
        <div className={styles.field}>
          <label>Start date</label>
          <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </div>
        <div className={styles.field}>
          <label>End date</label>
          <input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
        <button type="button" className={styles.btn} onClick={() => { setFrom(''); setTo('') }}>
          Clear
        </button>
      </div>

      <div className={styles.statGrid}>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Enquiries</span>
          <strong className={styles.statValue}>{stats.total || 0}</strong>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>WhatsApp</span>
          <strong className={styles.statValue}>{stats.whatsapp || 0}</strong>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Email</span>
          <strong className={styles.statValue}>{stats.email || 0}</strong>
        </div>
        <div className={styles.statCard}>
          <span className={styles.statLabel}>Unread</span>
          <strong className={`${styles.statValue} ${styles.statAccent}`}>{stats.unread || 0}</strong>
          <span className={styles.statSub}>{(stats.in_progress || 0)} in progress</span>
        </div>
      </div>

      <div className={styles.card}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Client</th>
              <th>Phone</th>
              <th>Channel</th>
              <th>Subject / message</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 12).map((item) => (
              <tr key={item.id}>
                <td>{item.created_at ? new Date(item.created_at).toLocaleString() : '—'}</td>
                <td>
                  <div>{item.name}</div>
                  <span className={`${styles.badge} ${styles[`badge_${item.status}`] || ''}`}>
                    {statusLabel(item.status)}
                  </span>
                </td>
                <td>{item.phone || '—'}</td>
                <td className={styles.channelCell}>{item.channel}</td>
                <td>{preview(item.subject || item.message)}</td>
                <td className={styles.actionStack}>
                  <Link
                    to={`/admin/enquiries/${item.id}`}
                    className={`${styles.iconBtn} ${styles.iconBtnView}`}
                    title="Open enquiry"
                  >
                    <Eye size={16} />
                  </Link>
                  <button
                    type="button"
                    className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                    title="Delete"
                    onClick={() => handleDelete(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!filtered.length && (
              <tr>
                <td colSpan={6} className={styles.muted}>No enquiries yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
