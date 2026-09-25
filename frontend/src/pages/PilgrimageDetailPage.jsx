import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchTestimonials, submitEnquiry } from '@api/cms'
import { formatEventWhen, formatRecurrence } from '@utils/eventTime'
import {
  archiveGalleries,
  archiveLinks,
  archiveNewsSlugs,
  classifyEvent,
  formatOccurrenceRange,
  relatedToEvent,
} from '@utils/occasion'
import ImageLightbox from '@components/ui/ImageLightbox'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import PaymentOptions from '@components/payments/PaymentOptions'
import SharePageBar from '@components/payments/SharePageBar'
import RichText from '@components/ui/RichText'
import ItemProfile, { itemProfileStyles as profile } from '@components/ItemProfile'
import NotFoundPage from './NotFoundPage'
import styles from './PilgrimageDetailPage.module.css'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
  channel: 'email',
  audience: 'local',
}

export default function PilgrimageDetailPage() {
  const { slug } = useParams()
  const { upcomingPilgrimages, blogPosts, offerings } = useContent()
  const { t } = useLocale()
  const pilgrimage = (upcomingPilgrimages || []).find((item) => item.slug === slug)

  const [values, setValues] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [testimonials, setTestimonials] = useState([])
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 })
  const [contributeOpen, setContributeOpen] = useState(false)

  useEffect(() => {
    if (!slug) return undefined
    let cancelled = false
    fetchTestimonials()
      .then((rows) => {
        if (!cancelled) setTestimonials(Array.isArray(rows) ? rows : [])
      })
      .catch(() => {
        if (!cancelled) setTestimonials([])
      })
    return () => {
      cancelled = true
    }
  }, [slug])

  useEffect(() => {
    if (window.location.hash !== '#register') return undefined
    const node = document.getElementById('register')
    if (!node) return undefined
    const timer = window.setTimeout(() => {
      const top = node.getBoundingClientRect().top + window.scrollY - 152
      window.scrollTo({ top: Math.max(0, top), behavior: 'auto' })
    }, 0)
    return () => window.clearTimeout(timer)
  }, [slug])

  if (!pilgrimage) return <NotFoundPage />

  const whenLabel = formatEventWhen(pilgrimage)
  const recurrenceLabel = formatRecurrence(pilgrimage)
  const occasion = classifyEvent(pilgrimage)
  const occasionWhen = formatOccurrenceRange(occasion.window)
  const galleries = archiveGalleries(pilgrimage.archives)
  const videos = archiveLinks(pilgrimage.archives, 'video')
  const reports = archiveLinks(pilgrimage.archives, 'report')
  const linkedNews = new Set(archiveNewsSlugs(pilgrimage.archives))
  const updates = (blogPosts || [])
    .filter((post) => relatedToEvent(post, pilgrimage) || linkedNews.has(post.slug))
    .slice(0, 8)
  const linkedTestimonials = testimonials.filter((item) => relatedToEvent(item, pilgrimage) || item.relatedEventSlug === pilgrimage.slug)

  const openGallery = (images, index) => {
    setLightbox({ open: true, images, index })
  }

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const charged = pilgrimage.isCharged === true

  const validate = () => {
    const next = {}
    if (!values.name.trim()) next.name = 'Name is required.'
    if (!values.message.trim()) next.message = 'Please share a short message or group details.'
    if (values.channel === 'email') {
      if (!values.email.trim()) next.email = 'Email is required.'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Enter a valid email.'
    } else if (!values.phone.trim()) {
      next.phone = 'WhatsApp number is required.'
    }
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const nextErrors = validate()
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    setStatus('submitting')
    setStatusMessage('')
    try {
      const channel = values.channel === 'whatsapp' ? 'whatsapp' : 'email'
      const result = await submitEnquiry({
        name: values.name.trim(),
        email: values.email.trim() || null,
        phone: values.phone.trim(),
        subject: `Registration: ${pilgrimage.title}`,
        message: [values.message.trim(), '', `Page: ${window.location.href}`].join('\n'),
        enquiry_type: 'pilgrimage',
        upcoming_pilgrimage_id: pilgrimage.id,
        channel,
      })
      if (channel === 'whatsapp' && result.whatsapp_url) {
        window.open(result.whatsapp_url, '_blank', 'noopener,noreferrer')
      }
      setStatus('success')
      setStatusMessage(result.message || 'The Pilgrimage Office has your registration.')
      setValues((prev) => ({ ...initialForm, audience: prev.audience, channel: prev.channel }))
    } catch (err) {
      setStatus('error')
      setStatusMessage(err.errors?.email?.[0] || err.message || 'Unable to submit. Please try again.')
    }
  }

  const leadImage = pilgrimage.image || ''
  const facts = [pilgrimage.meta, occasionWhen || whenLabel, recurrenceLabel, pilgrimage.location].filter(Boolean)
  const visibleGalleries = galleries
    .map((archive) => ({
      ...archive,
      images: (archive.images || []).filter((src) => src && src !== leadImage),
    }))
    .filter((archive) => archive.images.length)

  return (
    <div className={styles.page}>
      <ItemProfile
        image={leadImage}
        title={pilgrimage.title}
        footer={
          pilgrimage.registrationOpen !== false ? (
            <a href="#register" className={profile.primary}>
              {t('register')}
            </a>
          ) : null
        }
      >
        <ContentLocaleNotice translations={pilgrimage.translations} />
        {facts.length ? <p className={profile.meta}>{facts.join(' · ')}</p> : null}
        {pilgrimage.description ? <RichText html={pilgrimage.description} /> : null}
      </ItemProfile>

      <div className={`container ${styles.layout}`}>
        <div className={styles.content}>
          {occasion.status === 'live' || occasion.status === 'recent' || occasion.status === 'upcoming' ? (
            <p className={`${styles.occasionNote} ${styles[occasion.status] || ''}`}>
              {occasion.status === 'live'
                ? `${pilgrimage.title} is being celebrated today at the Shrine.`
                : occasion.status === 'recent'
                  ? `The shrine celebrated ${pilgrimage.title} ${occasion.daysSince === 1 ? 'yesterday' : `${occasion.daysSince} days ago`}.`
                  : `${pilgrimage.title} is coming up ${occasion.daysUntil === 1 ? 'tomorrow' : `in ${occasion.daysUntil} days`}.`}
            </p>
          ) : null}

          {updates.length ? (
            <section className={styles.memory} aria-labelledby="event-updates">
              <h2 id="event-updates">Recent updates</h2>
              <div className={styles.updateList}>
                {updates.map((post) => (
                  <Link key={post.id || post.slug} to={`/news/${post.slug}`} className={styles.updateCard}>
                    {post.coverImage ? <img src={post.coverImage} alt="" /> : null}
                    <div>
                      {post.publishedAt ? <p className={styles.memoryMeta}>{post.publishedAt}</p> : null}
                      <h3>{post.title}</h3>
                      {post.excerpt ? (
                        <p>{String(post.excerpt).replace(/<[^>]+>/g, '').slice(0, 140)}</p>
                      ) : null}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}

          {visibleGalleries.length ? (
            <section className={styles.memory} aria-labelledby="event-years">
              <h2 id="event-years">{visibleGalleries.some((row) => row.year) ? 'Through the years' : 'Gallery'}</h2>
              <p className={styles.memoryIntro}>
                {visibleGalleries.some((row) => row.year)
                  ? 'Moments from previous celebrations of this gathering.'
                  : 'Photos from this event.'}
              </p>
              {visibleGalleries.map((archive, galleryIndex) => (
                <div key={`${archive.year || 'gallery'}-${galleryIndex}`} className={styles.yearBlock}>
                  {archive.year ? <h3>{archive.year}</h3> : visibleGalleries.length > 1 ? <h3>Gallery {galleryIndex + 1}</h3> : null}
                  {archive.caption ? <p>{archive.caption}</p> : null}
                  <div className={styles.yearGrid}>
                    {archive.images.map((src, index) => (
                      <button
                        key={`${archive.year}-${src}-${index}`}
                        type="button"
                        className={styles.yearShot}
                        onClick={() => openGallery(archive.images, index)}
                      >
                        <img src={src} alt={`${pilgrimage.title} ${archive.year || ''}`.trim()} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </section>
          ) : null}

          {videos.length ? (
            <section className={styles.memory} aria-labelledby="event-videos">
              <h2 id="event-videos">Videos</h2>
              <ul className={styles.voiceList}>
                {videos.map((item) => (
                  <li key={`${item.year}-${item.url}`}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.caption || 'Watch video'}
                      {item.year ? ` · ${item.year}` : ''}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {reports.length ? (
            <section className={styles.memory} aria-labelledby="event-reports">
              <h2 id="event-reports">Reports</h2>
              <ul className={styles.voiceList}>
                {reports.map((item) => (
                  <li key={`${item.year}-${item.url}`}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer">
                      {item.caption || 'Open report'}
                      {item.year ? ` · ${item.year}` : ''}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {!updates.length && !visibleGalleries.length && !videos.length && !reports.length ? (
            <p className={styles.memoryIntro}>
              Photos, articles, videos, and reports from past celebrations will appear here when they are added.
            </p>
          ) : null}

          {linkedTestimonials.length ? (
            <section className={styles.memory} aria-labelledby="event-voices">
              <h2 id="event-voices">Voices from this gathering</h2>
              <div className={styles.voiceList}>
                {linkedTestimonials.map((item) => (
                  <blockquote key={item.id || item.slug} className={styles.voice}>
                    {item.title ? <p className={styles.voiceTitle}>{item.title}</p> : null}
                    {item.body ? <RichText html={item.body} /> : null}
                    <footer>
                      <strong>{item.authorName}</strong>
                      {[item.authorRole, item.authorLocation].filter(Boolean).join(' · ')}
                    </footer>
                  </blockquote>
                ))}
              </div>
            </section>
          ) : null}

          <Link to="/pilgrimage/annual-celebrations" className={styles.backLink}>
            ← Annual Celebrations
          </Link>
        </div>

        <aside className={styles.formCard} id="register">
          <div className={styles.formHeadRow}>
            <h2>Register</h2>
            <SharePageBar title={pilgrimage.title} />
          </div>
          {pilgrimage.registrationOpen === false ? (
            <p className={styles.formIntro}>Registration is closed. You may still send a message.</p>
          ) : null}

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <label className={styles.field}>
              <span>Full name</span>
              <input value={values.name} onChange={handleChange('name')} />
              {errors.name ? <em>{errors.name}</em> : null}
            </label>

            <label className={styles.field}>
              <span>Group size, dates, or message</span>
              <textarea rows={4} value={values.message} onChange={handleChange('message')} />
              {errors.message ? <em>{errors.message}</em> : null}
            </label>

            <div className={styles.channelRow}>
              <label className={values.channel === 'email' ? styles.channelActive : undefined}>
                <input
                  type="radio"
                  name="channel"
                  value="email"
                  checked={values.channel === 'email'}
                  onChange={handleChange('channel')}
                />
                Email
              </label>
              <label className={values.channel === 'whatsapp' ? styles.channelActive : undefined}>
                <input
                  type="radio"
                  name="channel"
                  value="whatsapp"
                  checked={values.channel === 'whatsapp'}
                  onChange={handleChange('channel')}
                />
                WhatsApp
              </label>
            </div>

            {values.channel === 'email' ? (
              <label className={styles.field}>
                <span>Email</span>
                <input type="email" value={values.email} onChange={handleChange('email')} />
                {errors.email ? <em>{errors.email}</em> : null}
              </label>
            ) : (
              <label className={styles.field}>
                <span>WhatsApp number</span>
                <input value={values.phone} onChange={handleChange('phone')} />
                {errors.phone ? <em>{errors.phone}</em> : null}
              </label>
            )}

            {charged ? (
              <>
                <p className={styles.formIntro}>This celebration is charged. Use the payment details, then send your registration.</p>
                <PaymentOptions
                  offerings={offerings}
                  audience={values.audience}
                  onAudienceChange={(audience) => setValues((prev) => ({ ...prev, audience }))}
                />
              </>
            ) : null}

            {statusMessage ? (
              <p className={status === 'error' ? styles.error : styles.success}>{statusMessage}</p>
            ) : null}

            <button className={styles.submit} type="submit" disabled={status === 'submitting'}>
              {status === 'submitting'
                ? 'Sending…'
                : values.channel === 'whatsapp'
                  ? 'Register on WhatsApp'
                  : 'Register by email'}
            </button>
          </form>

          {!charged ? (
            <div className={styles.contribute}>
              <button type="button" className={styles.contributeBtn} onClick={() => setContributeOpen((open) => !open)}>
                {contributeOpen ? 'Close contribution' : 'Contribute'}
              </button>
              {contributeOpen ? (
                <PaymentOptions
                  offerings={offerings}
                  audience={values.audience}
                  onAudienceChange={(audience) => setValues((prev) => ({ ...prev, audience }))}
                />
              ) : null}
            </div>
          ) : null}
        </aside>
      </div>

      <ImageLightbox
        open={lightbox.open}
        images={lightbox.images}
        index={lightbox.index}
        onClose={() => setLightbox((prev) => ({ ...prev, open: false }))}
        onChangeIndex={(index) => setLightbox((prev) => ({ ...prev, index }))}
      />
    </div>
  )
}
