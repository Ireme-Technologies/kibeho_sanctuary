import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Eye, Trash2 } from 'lucide-react'
import { deleteEnquiry, fetchCmsAudit, fetchEnquiries, fetchEnquiryStats } from '@api/cms'
import FlashMessage from './components/FlashMessage'
import { confirmDelete } from './components/confirmDelete'
import { AuditBar, AuditCriticalList, AuditScore } from './components/AuditPanel'
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
  const [audit, setAudit] = useState(null)

  const load = async () => {
    const [nextStats, list, report] = await Promise.all([
      fetchEnquiryStats(),
      fetchEnquiries(),
      fetchCmsAudit().catch(() => null),
    ])
    setStats(nextStats || {})
    setItems(Array.isArray(list) ? list : [])
    setAudit(report)
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

  const overall = audit?.overall
  const areas = audit
    ? [
        { label: 'Settings', percent: audit.settings?.percent },
        { label: 'Menus & home', percent: audit.setup?.percent },
        { label: 'Pages', percent: audit.pages?.percent },
        {
          label: 'Listings',
          percent: audit.directories?.length
            ? Math.round(
                audit.directories.reduce((sum, dir) => sum + (Number(dir.percent) || 0), 0) /
                  audit.directories.length
              )
            : 0,
        },
        {
          label: 'Translations',
          percent: (() => {
            const langs = audit.translations?.languages || []
            if (!langs.length) return 0
            return Math.round(langs.reduce((sum, lang) => sum + (Number(lang.percent) || 0), 0) / langs.length)
          })(),
        },
      ]
    : []

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Dashboard</h1>
      </div>

      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <section className={styles.auditHero} aria-labelledby="cms-report">
        <div>
          <p className={styles.statLabel} id="cms-report">
            Content management report
          </p>
          {overall ? (
            <>
              <AuditScore percent={overall.percent} status={overall.status} size="lg" />
              <AuditBar percent={overall.percent} />
              <p className={styles.muted}>
                {overall.critical
                  ? `${overall.critical} item${overall.critical === 1 ? '' : 's'} need attention first.`
                  : 'Core setup looks complete.'}
              </p>
              <ul className={styles.auditSummaryAreas}>
                {areas.map((area) => (
                  <li key={area.label}>
                    <span>{area.label}</span>
                    <strong>{area.percent ?? 0}%</strong>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <p className={styles.muted}>Checking site content…</p>
          )}
          <Link to="/admin/audit" className={styles.btn}>
            View full audit report
          </Link>
        </div>
        {audit ? (
          <AuditCriticalList
            items={(audit.critical || []).slice(0, 4)}
            emptyText="No urgent gaps right now. Open the full report to review details."
          />
        ) : (
          <div className={styles.auditEmpty}>
            <p>Checking site content…</p>
          </div>
        )}
      </section>

      <div className={styles.topbar}>
        <h2 className={styles.sectionTitle} style={{ margin: 0 }}>
          Recent pilgrim enquiries
        </h2>
        <Link to="/admin/enquiries" className={`${styles.btn} ${styles.btnSecondary}`}>
          View all
        </Link>
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
