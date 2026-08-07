import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  fetchClientEnquiry,
  replyClientEnquiry,
  uploadClientEnquiryDocument,
} from '@api/cms'
import styles from './client.module.css'

export default function ClientEnquiryPage() {
  const { id } = useParams()
  const [enquiry, setEnquiry] = useState(null)
  const [reply, setReply] = useState('')
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  const load = async () => setEnquiry(await fetchClientEnquiry(id))

  useEffect(() => {
    load().catch((err) => setError(err.message))
  }, [id])

  if (!enquiry) {
    return <p className={styles.muted}>{error || 'Loading…'}</p>
  }

  const adminHasResponded = (enquiry.messages || []).some((m) => m.author_type === 'admin')

  const handleReply = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const updated = await replyClientEnquiry(enquiry.id, { body: reply.trim() })
      setEnquiry(updated)
      setReply('')
      setNotice('Message sent.')
    } catch (err) {
      setError(err.message || 'Failed to send message.')
    } finally {
      setSaving(false)
    }
  }

  const handleUpload = async (file) => {
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const result = await uploadClientEnquiryDocument(enquiry.id, file, note)
      setEnquiry(result.enquiry)
      setNote('')
      setNotice('Document uploaded.')
    } catch (err) {
      setError(err.errors?.file?.[0] || err.message || 'Upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <Link to="/client" className={`${styles.btn} ${styles.btnSecondary}`}>Back</Link>
      <h1 className={styles.title} style={{ marginTop: '1rem' }}>
        Enquiry #{enquiry.id}
      </h1>
      <p className={styles.muted}>
        {enquiry.channel} · {String(enquiry.status || '').replace(/_/g, ' ')}
      </p>
      {error && <p className={styles.error}>{error}</p>}
      {notice && <p className={styles.muted}>{notice}</p>}

      <div className={styles.card} style={{ marginBottom: '1rem' }}>
        <h2 style={{ marginTop: 0 }}>Discussion</h2>
        <div className={styles.thread}>
          {(enquiry.messages || []).map((msg) => (
            <div
              key={msg.id}
              className={`${styles.bubble} ${msg.author_type === 'admin' ? styles.bubbleAdmin : ''}`}
            >
              <strong>{msg.author_type}</strong>
              <span className={styles.muted}> · {msg.created_at ? new Date(msg.created_at).toLocaleString() : ''}</span>
              <p>{msg.body}</p>
            </div>
          ))}
        </div>

        <form className={styles.form} onSubmit={handleReply}>
          <div className={styles.field}>
            <label>Your message</label>
            <textarea
              rows={4}
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              required
              placeholder={adminHasResponded ? 'Continue the discussion…' : 'Waiting for admin response before document sharing.'}
            />
          </div>
          <button className={styles.btn} type="submit" disabled={saving}>
            {saving ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </div>

      <div className={styles.card}>
        <h2 style={{ marginTop: 0 }}>Documents</h2>
        {!adminHasResponded && (
          <p className={styles.muted}>Document upload unlocks after the admin sends the first response.</p>
        )}
        <ul className={styles.docList}>
          {(enquiry.documents || []).map((doc) => (
            <li key={doc.id}>
              <a href={doc.url} target="_blank" rel="noreferrer">{doc.original_name || 'Document'}</a>
              <span className={styles.muted}> · {doc.uploaded_by}</span>
            </li>
          ))}
          {!enquiry.documents?.length && <li className={styles.muted}>No documents yet.</li>}
        </ul>

        {adminHasResponded && (
          <div className={styles.form}>
            <div className={styles.field}>
              <label>Note (optional)</label>
              <input value={note} onChange={(e) => setNote(e.target.value)} />
            </div>
            <label className={`${styles.btn} ${styles.btnSecondary}`} style={{ cursor: 'pointer' }}>
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
        )}
      </div>
    </div>
  )
}
