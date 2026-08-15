import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  fetchBlogPosts,
  fetchUpcomingPilgrimages,
  updateUpcomingPilgrimageArchives,
} from '@api/cms'
import FlashMessage from './components/FlashMessage'
import MultiImageField from './components/MultiImageField'
import styles from './admin.module.css'

const RELATED_TYPES = [
  { value: 'gallery', label: 'Gallery images' },
  { value: 'news', label: 'News / article' },
]

function yearChoices() {
  const current = new Date().getFullYear()
  const years = []
  for (let year = current; year >= current - 25; year -= 1) years.push(year)
  return years
}

function emptyRelated(type = 'gallery') {
  return { type, year: '', caption: '', images: [], slug: '' }
}

function patchRelated(list, index, patch) {
  return list.map((row, i) => (i === index ? { ...row, ...patch } : row))
}

function fromArchives(raw) {
  return (Array.isArray(raw) ? raw : []).map((row) => ({
    type: row.type === 'news' ? 'news' : 'gallery',
    year: row.year || '',
    caption: row.caption || '',
    images: Array.isArray(row.images) ? row.images : [],
    slug: row.slug || '',
  }))
}

function toArchives(list) {
  return (list || [])
    .map((row) => {
      const type = row.type === 'news' ? 'news' : 'gallery'
      const year = Number(row.year) || null
      const caption = row.caption || ''
      if (type === 'news') {
        return row.slug ? { type, year, caption, slug: row.slug } : null
      }
      const images = Array.isArray(row.images) ? row.images.filter(Boolean) : []
      return images.length ? { type, year, caption, images } : null
    })
    .filter(Boolean)
}

export default function EventUpdatesAdminPage() {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [archives, setArchives] = useState([])
  const [posts, setPosts] = useState([])
  const [addType, setAddType] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    let cancelled = false
    Promise.all([fetchUpcomingPilgrimages(), fetchBlogPosts().catch(() => [])])
      .then(([items, news]) => {
        if (cancelled) return
        const match = (items || []).find((item) => String(item.id) === String(id))
        if (!match) {
          setMissing(true)
          return
        }
        setEvent(match)
        setArchives(fromArchives(match.archives))
        setPosts(Array.isArray(news) ? news : [])
      })
      .catch((err) => {
        if (!cancelled) setFlash({ type: 'error', message: err.message || 'Failed to load event.' })
      })
    return () => {
      cancelled = true
    }
  }, [id])

  const handleAdd = (type) => {
    if (!type) return
    setArchives((prev) => [...prev, emptyRelated(type)])
    setAddType('')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFlash({ type: 'success', message: '' })
    try {
      const saved = await updateUpcomingPilgrimageArchives(id, toArchives(archives))
      setEvent(saved)
      setArchives(fromArchives(saved.archives))
      setFlash({ type: 'success', message: 'Updates saved.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to save updates.' })
    } finally {
      setSaving(false)
    }
  }

  if (missing) {
    return (
      <div>
        <p className={styles.muted}>That event was not found.</p>
        <Link to="/admin/upcoming-pilgrimages">← Back to pilgrimage events</Link>
      </div>
    )
  }

  if (!event) {
    return <p className={styles.muted}>Loading updates…</p>
  }

  return (
    <div>
      <div className={styles.topbar}>
        <div>
          <p className={styles.muted} style={{ margin: 0 }}>
            <Link to="/admin/upcoming-pilgrimages">Pilgrimage events</Link>
          </p>
          <h1>Updates · {event.title}</h1>
        </div>
        <a className={`${styles.btn} ${styles.btnSecondary}`} href={event.path} target="_blank" rel="noreferrer">
          View event
        </a>
      </div>

      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <p className={styles.muted} style={{ marginBottom: '1rem' }}>
        Add photo galleries or link a news article for this event. Choose a year for annual feasts, or
        leave it as “No year”.
      </p>

      <form className={styles.form} onSubmit={handleSave}>
        {archives.map((row, index) => (
          <div key={`related-${index}`} className={styles.card} style={{ marginBottom: '0.85rem', padding: '1rem' }}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label>Type</label>
                <select
                  value={row.type || 'gallery'}
                  onChange={(e) =>
                    setArchives(
                      patchRelated(archives, index, {
                        type: e.target.value,
                        images: e.target.value === 'gallery' ? row.images || [] : [],
                        slug: e.target.value === 'news' ? row.slug || '' : '',
                      })
                    )
                  }
                >
                  {RELATED_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.field}>
                <label>Year (optional)</label>
                <select
                  value={row.year || ''}
                  onChange={(e) => setArchives(patchRelated(archives, index, { year: e.target.value }))}
                >
                  <option value="">No year</option>
                  {yearChoices().map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className={styles.field}>
              <label>Caption (optional)</label>
              <input
                value={row.caption || ''}
                onChange={(e) => setArchives(patchRelated(archives, index, { caption: e.target.value }))}
              />
            </div>
            {(row.type || 'gallery') === 'news' ? (
              <div className={styles.field}>
                <label>News / article</label>
                <select
                  value={row.slug || ''}
                  onChange={(e) => setArchives(patchRelated(archives, index, { slug: e.target.value }))}
                >
                  <option value="">Select an article</option>
                  {posts.map((post) => (
                    <option key={post.slug} value={post.slug}>
                      {post.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <MultiImageField
                label="Gallery images"
                value={row.images || []}
                onChange={(images) => setArchives(patchRelated(archives, index, { images }))}
                folder="pilgrimages"
              />
            )}
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSecondary}`}
              onClick={() => setArchives(archives.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          </div>
        ))}

        <div className={styles.field} style={{ maxWidth: '18rem' }}>
          <label>Add related</label>
          <select
            value={addType}
            onChange={(e) => handleAdd(e.target.value)}
          >
            <option value="">Choose…</option>
            {RELATED_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.actions}>
          <button className={styles.btn} type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save updates'}
          </button>
          <Link to="/admin/upcoming-pilgrimages" className={`${styles.btn} ${styles.btnSecondary}`}>
            Back to events
          </Link>
        </div>
      </form>
    </div>
  )
}
