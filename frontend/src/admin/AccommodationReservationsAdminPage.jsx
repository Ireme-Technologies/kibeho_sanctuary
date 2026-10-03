import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAccommodationReservations, fetchProjects } from '@api/cms'
import { displayFacilityName } from '@utils/displayName'
import { formatStayDate } from '@utils/reservationMessage'
import FlashMessage from './components/FlashMessage'
import styles from './admin.module.css'

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function formatDay(value) {
  if (!value) return '—'
  return formatStayDate(String(value).slice(0, 10), 'en-GB')
}

function printReservations(rows, summary) {
  const body = rows
    .map(
      (row) => `<tr>
        <td>${escapeHtml(formatDay(row.createdAt))}</td>
        <td>${escapeHtml(displayFacilityName(row.accommodationName))}</td>
        <td>${escapeHtml(formatDay(row.checkIn))} – ${escapeHtml(formatDay(row.checkOut))}</td>
        <td>${escapeHtml(row.guests)} / ${escapeHtml(row.rooms)}</td>
        <td>${escapeHtml((row.guestNames || []).join(', '))}</td>
        <td>${escapeHtml(row.country)}</td>
        <td>${escapeHtml(row.tripReason || '')}</td>
        <td>${escapeHtml(row.organization || '')}</td>
        <td>${escapeHtml(row.additionalRequest || '')}</td>
      </tr>`,
    )
    .join('')
  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Accommodation reservations</title>
    <style>
      body { font-family: Georgia, serif; color: #1a2744; margin: 24px; }
      h1 { font-size: 22px; margin: 0 0 4px; }
      p { margin: 0 0 16px; }
      table { width: 100%; border-collapse: collapse; font-size: 12px; }
      th, td { border-bottom: 1px solid #d5dbe3; text-align: left; vertical-align: top; padding: 6px; }
      th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.04em; }
    </style></head><body>
    <h1>Accommodation reservations</h1>
    <p>${escapeHtml(summary)} · Kibeho Sanctuary website</p>
    <table>
      <thead><tr><th>Received</th><th>Accommodation</th><th>Stay</th><th>Guests / rooms</th><th>Names</th><th>Country</th><th>Reason</th><th>Organization</th><th>Request</th></tr></thead>
      <tbody>${body || '<tr><td colspan="9">No reservations.</td></tr>'}</tbody>
    </table>
    </body></html>`
  const frame = window.open('', '_blank', 'noopener,noreferrer')
  if (!frame) return false
  frame.document.open()
  frame.document.write(html)
  frame.document.close()
  frame.focus()
  frame.print()
  return true
}

export default function AccommodationReservationsAdminPage() {
  const [facilities, setFacilities] = useState([])
  const [draft, setDraft] = useState({ facilityId: '', dateFrom: '', dateTo: '' })
  const [filters, setFilters] = useState(draft)
  const [page, setPage] = useState(1)
  const [result, setResult] = useState({ data: [], total: 0, grand_total: 0, last_page: 1 })
  const [loading, setLoading] = useState(true)
  const [flash, setFlash] = useState({ type: 'success', message: '' })

  useEffect(() => {
    fetchProjects()
      .then((items) => setFacilities(Array.isArray(items) ? items : []))
      .catch(() => setFacilities([]))
  }, [])

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchAccommodationReservations({
      facility_id: filters.facilityId,
      date_from: filters.dateFrom,
      date_to: filters.dateTo,
      page,
    })
      .then((payload) => {
        if (!cancelled) setResult(payload)
      })
      .catch((err) => {
        if (!cancelled) setFlash({ type: 'error', message: err.message || 'Failed to load reservations.' })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [filters, page])

  const summary = () => {
    const stay = facilities.find((item) => String(item.id) === String(filters.facilityId))
    const name = stay ? displayFacilityName(stay.title) : 'All accommodations'
    const dates = [filters.dateFrom, filters.dateTo].filter(Boolean).map((value) => formatDay(value)).join(' – ')
    return `${result.total} reservation${result.total === 1 ? '' : 's'} · ${name}${dates ? ` · ${dates}` : ''}`
  }

  const openPrint = async () => {
    try {
      const payload = await fetchAccommodationReservations({
        facility_id: filters.facilityId,
        date_from: filters.dateFrom,
        date_to: filters.dateTo,
        all: 1,
      })
      const opened = printReservations(payload.data || [], summary())
      if (!opened) setFlash({ type: 'error', message: 'Allow pop-ups to print or save the reservations as PDF.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Could not prepare the reservations.' })
    }
  }

  const rows = result.data || []

  return (
    <div>
      <div className={styles.topbar}>
        <div>
          <h1>Reservations</h1>
          <p className={styles.muted}>
            {result.grand_total} in total
            {filters.facilityId || filters.dateFrom || filters.dateTo ? ` · ${result.total} match this search` : ''}
          </p>
        </div>
        <Link to="/admin/projects" className={`${styles.btn} ${styles.btnSecondary}`}>
          Accommodations
        </Link>
      </div>
      <FlashMessage type={flash.type} message={flash.message} onClear={() => setFlash({ type: 'success', message: '' })} />
      <form
        className={styles.card}
        onSubmit={(event) => {
          event.preventDefault()
          setPage(1)
          setFilters(draft)
        }}
      >
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>Accommodation</label>
            <select value={draft.facilityId} onChange={(e) => setDraft({ ...draft, facilityId: e.target.value })}>
              <option value="">All accommodations</option>
              {facilities.map((item) => (
                <option key={item.id} value={item.id}>
                  {displayFacilityName(item.title)}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.field}>
            <label>From</label>
            <input type="date" value={draft.dateFrom} onChange={(e) => setDraft({ ...draft, dateFrom: e.target.value })} />
          </div>
          <div className={styles.field}>
            <label>To</label>
            <input type="date" value={draft.dateTo} onChange={(e) => setDraft({ ...draft, dateTo: e.target.value })} />
          </div>
        </div>
        <div className={styles.actions}>
          <button type="submit" className={styles.btn}>Retrieve</button>
          <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={openPrint}>Print</button>
          <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={openPrint}>Save as PDF</button>
        </div>
        <p className={styles.muted}>Save as PDF opens the print dialog. Choose Save as PDF there. The file includes every reservation in this search, not only this page.</p>
      </form>
      <div className={styles.card} style={{ overflowX: 'auto', marginTop: '1rem' }}>
        {loading ? <p className={styles.muted}>Loading reservations…</p> : null}
        {!loading && !rows.length ? <p className={styles.muted}>No reservations match this search.</p> : null}
        {rows.length ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Received</th>
                <th>Accommodation</th>
                <th>Stay</th>
                <th>Guests</th>
                <th>Rooms</th>
                <th>Names</th>
                <th>Country</th>
                <th>Reason</th>
                <th>Organization</th>
                <th>Request</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{formatDay(row.createdAt)}</td>
                  <td>{displayFacilityName(row.accommodationName)}</td>
                  <td>
                    {formatDay(row.checkIn)}
                    <div className={styles.muted}>{formatDay(row.checkOut)}</div>
                  </td>
                  <td>{row.guests}</td>
                  <td>{row.rooms}</td>
                  <td>{(row.guestNames || []).join(', ')}</td>
                  <td>{row.country}</td>
                  <td>{row.tripReason || '—'}</td>
                  <td>{row.organization || '—'}</td>
                  <td>{row.additionalRequest || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : null}
        {result.last_page > 1 ? (
          <div className={styles.actions} style={{ marginTop: '1rem' }}>
            <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
              Previous
            </button>
            <span className={styles.muted}>
              Page {page} of {result.last_page}
            </span>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              disabled={page >= result.last_page}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
