import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchEnquiries, fetchUpcomingPilgrimages } from '@api/cms'
import { classifyEvent } from '@utils/occasion'
import FlashMessage from './components/FlashMessage'
import styles from './admin.module.css'

function formatDay(value) {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

function splitRegistrations(event, regs) {
  const classified = classifyEvent(event)
  const window = classified.window
  const during = []
  const earlier = []
  regs.forEach((reg) => {
    const created = new Date(reg.created_at)
    if (!window || Number.isNaN(created.getTime()) || created >= window.start) {
      during.push(reg)
      return
    }
    earlier.push(reg)
  })
  const finished = classified.status === 'past' || classified.status === 'recent'
  return {
    status: classified.status,
    window,
    upcoming: finished ? [] : during,
    past: finished ? [...earlier, ...during] : earlier,
  }
}

function byNewest(a, b) {
  return new Date(b.created_at) - new Date(a.created_at)
}

function groupByYear(regs) {
  const groups = new Map()
  regs.forEach((reg) => {
    const created = new Date(reg.created_at)
    const year = Number.isNaN(created.getTime()) ? 'Undated' : String(created.getFullYear())
    if (!groups.has(year)) groups.set(year, [])
    groups.get(year).push(reg)
  })
  return [...groups.entries()].sort((a, b) => String(b[0]).localeCompare(String(a[0])))
}

function RegistrationTable({ rows }) {
  if (!rows.length) {
    return <p className={styles.muted}>No registrations yet.</p>
  }
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Contact</th>
          <th>Registered</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td>{row.name || '—'}</td>
            <td>
              {row.email || '—'}
              {row.phone ? <div className={styles.muted}>{row.phone}</div> : null}
            </td>
            <td>{formatDay(row.created_at) || '—'}</td>
            <td>{row.status || 'new'}</td>
            <td>
              <Link to={`/admin/enquiries/${row.id}`}>Open</Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function EventRegistrationsAdminPage() {
  const { id } = useParams()
  const [events, setEvents] = useState([])
  const [enquiries, setEnquiries] = useState([])
  const [view, setView] = useState('upcoming')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const enquiryParams = id
      ? { upcoming_pilgrimage_id: id }
      : { for_events: 1 }
    Promise.all([
      fetchUpcomingPilgrimages(),
      fetchEnquiries(enquiryParams).catch(() => []),
    ])
      .then(([items, rows]) => {
        if (cancelled) return
        setEvents(Array.isArray(items) ? items : [])
        setEnquiries(Array.isArray(rows) ? rows : [])
      })
      .catch((err) => {
        if (!cancelled) setFlash({ type: 'error', message: err.message || 'Failed to load registrations.' })
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const boards = useMemo(() => {
    const selected = id
      ? events.filter((item) => String(item.id) === String(id))
      : events
    return selected
      .map((event) => {
        const rows = enquiries.filter(
          (row) => String(row.upcoming_pilgrimage_id) === String(event.id)
        )
        const split = splitRegistrations(event, rows)
        return { event, ...split }
      })
      .sort((a, b) => {
        const aStart = a.window?.start?.getTime?.() || 0
        const bStart = b.window?.start?.getTime?.() || 0
        return aStart - bStart
      })
  }, [events, enquiries, id])

  const upcomingBoards = boards.filter((board) => board.upcoming.length || board.status === 'live' || board.status === 'upcoming' || board.status === 'later')
  const pastBoards = boards.filter((board) => board.past.length || board.status === 'past')
  const focus = id ? boards[0] : null

  if (loading) {
    return <p className={styles.muted}>Loading registrations…</p>
  }

  if (id && !focus) {
    return (
      <div>
        <p className={styles.muted}>That event was not found.</p>
        <Link to="/admin/event-registrations">← All event registrations</Link>
      </div>
    )
  }

  return (
    <div>
      <div className={styles.topbar}>
        <div>
          <p className={styles.muted} style={{ margin: 0 }}>
            <Link to="/admin/upcoming-pilgrimages">Pilgrimage events</Link>
            {focus ? ' · ' : null}
            {focus ? <Link to="/admin/event-registrations">All registrations</Link> : null}
          </p>
          <h1>{focus ? `Registrations · ${focus.event.title}` : 'Event registrations'}</h1>
        </div>
      </div>

      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <p className={styles.muted} style={{ marginBottom: '1rem' }}>
        Upcoming lists people registered for the next celebration. Past lists people who registered
        for an earlier year, or for an event that has already finished.
      </p>

      {focus ? (
        <>
          <section className={styles.card} style={{ marginBottom: '1rem', padding: '1rem' }}>
            <h2 style={{ marginTop: 0 }}>
              Upcoming
              {focus.window ? ` · ${formatDay(focus.window.start)}` : ''}
            </h2>
            <RegistrationTable rows={[...focus.upcoming].sort(byNewest)} />
          </section>
          <section className={styles.card} style={{ padding: '1rem' }}>
            <h2 style={{ marginTop: 0 }}>Past</h2>
            {focus.past.length ? (
              groupByYear(focus.past).map(([year, rows]) => (
                <div key={year} style={{ marginBottom: '1rem' }}>
                  <h3>{year}</h3>
                  <RegistrationTable rows={[...rows].sort(byNewest)} />
                </div>
              ))
            ) : (
              <p className={styles.muted}>No past registrations.</p>
            )}
          </section>
        </>
      ) : (
        <>
          <div className={styles.actions} style={{ marginBottom: '1rem' }}>
            <button
              type="button"
              className={`${styles.btn} ${view === 'upcoming' ? '' : styles.btnSecondary}`}
              onClick={() => setView('upcoming')}
            >
              Upcoming ({upcomingBoards.reduce((sum, board) => sum + board.upcoming.length, 0)})
            </button>
            <button
              type="button"
              className={`${styles.btn} ${view === 'past' ? '' : styles.btnSecondary}`}
              onClick={() => setView('past')}
            >
              Past ({pastBoards.reduce((sum, board) => sum + board.past.length, 0)})
            </button>
          </div>

          {(view === 'upcoming' ? upcomingBoards : pastBoards).map((board) => {
            const rows = view === 'upcoming' ? board.upcoming : board.past
            return (
              <section key={board.event.id} className={styles.card} style={{ marginBottom: '1rem', padding: '1rem' }}>
                <div className={styles.topbar}>
                  <h2 style={{ margin: 0 }}>
                    {board.event.title}
                    {board.window ? ` · ${formatDay(board.window.start)}` : ''}
                  </h2>
                  <Link to={`/admin/upcoming-pilgrimages/${board.event.id}/registrations`}>
                    Open this event
                  </Link>
                </div>
                {view === 'past' && rows.length ? (
                  groupByYear(rows).map(([year, yearRows]) => (
                    <div key={year} style={{ marginTop: '0.75rem' }}>
                      <h3>{year}</h3>
                      <RegistrationTable rows={[...yearRows].sort(byNewest)} />
                    </div>
                  ))
                ) : (
                  <RegistrationTable rows={[...rows].sort(byNewest)} />
                )}
              </section>
            )
          })}

          {(view === 'upcoming' ? upcomingBoards : pastBoards).length === 0 ? (
            <p className={styles.muted}>Nothing in this list yet.</p>
          ) : null}
        </>
      )}
    </div>
  )
}
