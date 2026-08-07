import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Eye, Trash2, MessageCircle } from 'lucide-react'
import {
  deleteEnquiry,
  fetchEnquiries,
  fetchEnquiry,
  replyEnquiry,
  updateEnquiry,
  uploadEnquiryDocument,
} from '@api/cms'
import FlashMessage from './components/FlashMessage'
import styles from './admin.module.css'

function statusLabel(status) {
  return String(status || 'new').replace(/_/g, ' ')
}

function EnquiryDetail({ id }) {
  const navigate = useNavigate()
  const [enquiry, setEnquiry] = useState(null)
  const [reply, setReply] = useState('')
  const [note, setNote] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const load = async () => setEnquiry(await fetchEnquiry(id))

  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message }))
  }, [id])

  if (!enquiry) {
    return <p className={styles.muted}>Loading enquiry…</p>
  }

  const adminHasResponded = (enquiry.messages || []).some((m) => m.author_type === 'admin')

  const handleReply = async (e) => {
    e.preventDefault()
    if (!reply.trim()) return
    setSaving(true)
    setFlash({ type: 'success', message: '' })
    try {
      const result = await replyEnquiry(enquiry.id, {
        body: reply.trim(),
        notify_email: enquiry.channel === 'email',
      })
      setEnquiry(result.enquiry)
      setReply('')
      setFlash({ type: 'success', message: 'Reply sent.' })
      if (result.whatsapp_url) window.open(result.whatsapp_url, '_blank', 'noopener,noreferrer')
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to reply.' })
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (file) => {
    if (!file) return
    setUploading(true)
    setFlash({ type: 'success', message: '' })
    try {
      const result = await uploadEnquiryDocument(enquiry.id, file, note)
      setEnquiry(result.enquiry)
      setNote('')
      setFlash({
        type: 'success',
        message: result.optimized
          ? 'Document uploaded and compressed under 700KB.'
          : 'Document uploaded.',
      })
    } catch (err) {
      setFlash({ type: 'error', message: err.errors?.file?.[0] || err.message || 'Upload failed.' })
    } finally {
      setUploading(false)
    }
  }

  const handleStatus = async (status) => {
    try {
      const updated = await updateEnquiry(enquiry.id, { status })
      setEnquiry(updated)
      setFlash({ type: 'success', message: 'Status updated.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to update status.' })
    }
  }

  const openWhatsApp = () => {
    if (!enquiry.phone) return
    const text = encodeURIComponent(reply.trim() || `Hello ${enquiry.name}, regarding your enquiry with Kibeho Sanctuary.`)
    const number = String(enquiry.phone).replace(/\D+/g, '')
    window.open(`https://wa.me/${number}?text=${text}`, '_blank', 'noopener,noreferrer')
  }

  return (
    <div>
      <div className={styles.topbar}>
        <div>
          <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => navigate('/admin/enquiries')}>
            Back
          </button>
          <h1 style={{ marginTop: '0.75rem' }}>{enquiry.name}</h1>
          <p className={styles.muted}>
            {enquiry.channel} · {enquiry.email || 'No email'} · {enquiry.phone || 'No phone'}
          </p>
        </div>
        <div className={styles.actions}>
          <select
            value={enquiry.status}
            onChange={(e) => handleStatus(e.target.value)}
            className={styles.inlineSelect}
          >
            <option value="new">New</option>
            <option value="in_progress">In progress</option>
            <option value="pending_client">Pending client</option>
            <option value="closed">Closed</option>
          </select>
          {enquiry.channel === 'whatsapp' && (
            <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={openWhatsApp}>
              <MessageCircle size={16} /> Continue on WhatsApp
            </button>
          )}
        </div>
      </div>

      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <div className={styles.detailGrid}>
        <div className={styles.card}>
          <h2 style={{ marginTop: 0 }}>Discussion</h2>
          <div className={styles.thread}>
            {(enquiry.messages || []).map((msg) => (
              <div
                key={msg.id}
                className={`${styles.threadBubble} ${msg.author_type === 'admin' ? styles.threadAdmin : styles.threadClient}`}
              >
                <div className={styles.threadMeta}>
                  <strong>{msg.author_type}</strong>
                  <span>{msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}</span>
                </div>
                <p>{msg.body}</p>
              </div>
            ))}
          </div>

          <form className={styles.form} onSubmit={handleReply} style={{ marginTop: '1rem' }}>
            <div className={styles.field}>
              <label>Admin reply</label>
              <textarea
                rows={4}
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                placeholder="Write your response to the client…"
                required
              />
            </div>
            <button className={styles.btn} type="submit" disabled={saving}>
              {saving ? 'Sending…' : enquiry.channel === 'email' ? 'Reply & email client' : 'Reply in thread'}
            </button>
          </form>
        </div>

        <div className={styles.card}>
          <h2 style={{ marginTop: 0 }}>Documents</h2>
          <p className={styles.muted}>
            {adminHasResponded
              ? 'Share proposals, images, or PDFs (max 700KB after compression).'
              : 'Send your first reply above, then both sides can exchange documents.'}
          </p>

          <ul className={styles.docList}>
            {(enquiry.documents || []).map((doc) => (
              <li key={doc.id}>
                <a href={doc.url} target="_blank" rel="noreferrer">{doc.original_name || 'Document'}</a>
                <span className={styles.muted}> · {doc.uploaded_by} · {Math.round((doc.size || 0) / 1024)}KB</span>
              </li>
            ))}
            {!enquiry.documents?.length && <li className={styles.muted}>No documents yet.</li>}
          </ul>

          <div className={styles.form} style={{ marginTop: '1rem' }}>
            <div className={styles.field}>
              <label>Note (optional)</label>
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Proposal draft, drawings…" />
            </div>
            <label className={`${styles.btn} ${styles.btnSecondary}`} style={{ cursor: uploading ? 'default' : 'pointer' }}>
              {uploading ? 'Uploading…' : 'Upload document'}
              <input
                type="file"
                accept="image/*,application/pdf"
                hidden
                disabled={uploading}
                onChange={(e) => {
                  handleUpload(e.target.files?.[0])
                  e.target.value = ''
                }}
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function EnquiriesAdminPage() {
  const { id } = useParams()
  const [items, setItems] = useState([])
  const [channel, setChannel] = useState('')
  const [status, setStatus] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })

  const load = async () => {
    const params = {}
    if (channel) params.channel = channel
    if (status) params.status = status
    setItems(await fetchEnquiries(params))
  }

  useEffect(() => {
    if (id) return
    load().catch((err) => setFlash({ type: 'error', message: err.message }))
  }, [id, channel, status])

  if (id) return <EnquiryDetail id={id} />

  const handleDelete = async (enquiryId) => {
    if (!confirm('Delete this enquiry?')) return
    try {
      await deleteEnquiry(enquiryId)
      await load()
      setFlash({ type: 'success', message: 'Enquiry deleted.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Delete failed.' })
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Pilgrim Enquiries</h1>
      </div>

      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <div className={styles.filterBar}>
        <div className={styles.field}>
          <label>Channel</label>
          <select value={channel} onChange={(e) => setChannel(e.target.value)}>
            <option value="">All</option>
            <option value="email">Email</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
        <div className={styles.field}>
          <label>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="new">New</option>
            <option value="in_progress">In progress</option>
            <option value="pending_client">Pending client</option>
            <option value="closed">Closed</option>
          </select>
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
              <th>Status</th>
              <th>Message</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.created_at ? new Date(item.created_at).toLocaleString() : '—'}</td>
                <td>
                  <div>{item.name}</div>
                  <div className={styles.muted}>{item.email || '—'}</div>
                </td>
                <td>{item.phone || '—'}</td>
                <td>{item.channel}</td>
                <td>
                  <span className={`${styles.badge} ${styles[`badge_${item.status}`] || ''}`}>
                    {statusLabel(item.status)}
                  </span>
                </td>
                <td>{(item.message || '').slice(0, 80)}{(item.message || '').length > 80 ? '…' : ''}</td>
                <td className={styles.actionStack}>
                  <Link to={`/admin/enquiries/${item.id}`} className={`${styles.iconBtn} ${styles.iconBtnView}`} title="Open">
                    <Eye size={16} />
                  </Link>
                  <button type="button" className={`${styles.iconBtn} ${styles.iconBtnDanger}`} onClick={() => handleDelete(item.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
            {!items.length && (
              <tr><td colSpan={7} className={styles.muted}>No enquiries yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
