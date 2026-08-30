import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchTestimonials, submitEnquiry } from '@api/cms'
import { formatEventWhen, formatRecurrence } from '@utils/eventTime'
import {
  archiveGalleries,
  archiveNewsSlugs,
  classifyEvent,
  formatOccurrenceRange,
  relatedToEvent,
  statusLabel,
} from '@utils/occasion'
import ImageLightbox from '@components/ui/ImageLightbox'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import PaymentOptions, { paymentLabel } from '@components/payments/PaymentOptions'
import SharePageBar from '@components/payments/SharePageBar'
import TimingChoice from '@components/payments/TimingChoice'
import RichText from '@components/ui/RichText'
import NotFoundPage from './NotFoundPage'
import styles from './PilgrimageDetailPage.module.css'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  message: '',
  channel: 'email',
  audience: 'local',
  timing: '',
}

export default function PilgrimageDetailPage() {
  const { slug } = useParams()
  const { upcomingPilgrimages, blogPosts, resolveHeaderImage, offerings } = useContent()
  const { t } = useLocale()
  const pilgrimage = (upcomingPilgrimages || []).find((item) => item.slug === slug)

  const [values, setValues] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [statusMessage, setStatusMessage] = useState('')
  const [testimonials, setTestimonials] = useState([])
  const [lightbox, setLightbox] = useState({ open: false, images: [], index: 0 })

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

  if (!pilgrimage) return <NotFoundPage />

  const whenLabel = formatEventWhen(pilgrimage)
  const recurrenceLabel = formatRecurrence(pilgrimage)
  const occasion = classifyEvent(pilgrimage)
  const occasionWhen = formatOccurrenceRange(occasion.window)
  const liveLabel = statusLabel(occasion.status)
  const galleries = archiveGalleries(pilgrimage.archives)
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

  const validate = () => {
    const next = {}
    if (!values.name.trim()) next.name = 'Name is required.'
    if (!values.message.trim()) next.message = 'Please share a short message or group details.'
    if (!values.timing) next.timing = 'Choose pay now or submit a pledge.'
    if (values.timing === 'later') {
      if (values.channel === 'email') {
        if (!values.email.trim()) next.email = 'Email is required.'
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Enter a valid email.'
      } else if (!values.phone.trim()) {
        next.phone = 'WhatsApp number is required.'
      }
    } else if (values.timing === 'now') {
      if (!values.email.trim() && !values.phone.trim()) next.email = 'Add email or phone.'
      else if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        next.email = 'Enter a valid email.'
      }
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
      const channel =
        values.timing === 'now' ? (values.email.trim() ? 'email' : 'whatsapp') : values.channel
      const result = await submitEnquiry({
        name: values.name.trim(),
        email: values.email.trim() || null,
        phone: values.phone.trim(),
        subject: `Pilgrimage registration: ${pilgrimage.title}`,
        message: [
          values.message.trim(),
          '',
          `When: ${values.timing === 'now' ? 'Pay now' : 'Pledge — office to follow up'}`,
          `Payment: ${paymentLabel(offerings, values.audience, values.timing)}`,
          `Page: ${window.location.href}`,
        ].join('\n'),
        enquiry_type: 'pilgrimage',
        upcoming_pilgrimage_id: pilgrimage.id,
        channel,
      })
      if (values.timing !== 'now' && channel === 'whatsapp' && result.whatsapp_url) {
        window.open(result.whatsapp_url, '_blank', 'noopener,noreferrer')
      }
      setStatus('success')
      setStatusMessage(
        values.timing === 'now'
          ? 'Saved. Complete payment below.'
          : result.message || 'The pilgrim office has your registration.'
      )
      setValues((prev) => ({ ...initialForm, audience: prev.audience, timing: prev.timing }))
    } catch (err) {
      setStatus('error')
      setStatusMessage(err.errors?.email?.[0] || err.message || 'Unable to submit. Please try again.')
    }
  }

  const heroImage = resolveHeaderImage(pilgrimage.image)

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18,40,71,.88), rgba(26,54,93,.45)), url(${heroImage})`,
        }}
      >
        <div className="container">
          <p className={styles.eyebrow}>
            {liveLabel || (pilgrimage.eventType === 'feast' ? 'Feast day' : 'Pilgrimage event')}
          </p>
          <h1>{pilgrimage.title}</h1>
          <div className={styles.metaRow}>
            {pilgrimage.meta ? <span>{pilgrimage.meta}</span> : null}
            {occasionWhen || whenLabel ? <span>{occasionWhen || whenLabel}</span> : null}
            {recurrenceLabel ? <span>{recurrenceLabel}</span> : null}
            {pilgrimage.location ? <span>{pilgrimage.location}</span> : null}
          </div>
          {pilgrimage.registrationOpen !== false ? (
            <a href="#register" className={styles.heroCta}>
              {t('register')}
            </a>
          ) : null}
        </div>
      </header>

      <div className={`container ${styles.layout}`}>
        <div className={styles.content}>
          <ContentLocaleNotice translations={pilgrimage.translations} />
          {occasion.status === 'live' || occasion.status === 'recent' || occasion.status === 'upcoming' ? (
            <p className={`${styles.occasionNote} ${styles[occasion.status] || ''}`}>
              {occasion.status === 'live'
                ? `${pilgrimage.title} is being celebrated today at the Shrine.`
                : occasion.status === 'recent'
                  ? `The shrine celebrated ${pilgrimage.title} ${occasion.daysSince === 1 ? 'yesterday' : `${occasion.daysSince} days ago`}.`
                  : `${pilgrimage.title} is coming up ${occasion.daysUntil === 1 ? 'tomorrow' : `in ${occasion.daysUntil} days`}.`}
            </p>
          ) : null}

          {pilgrimage.description ? (
            <RichText html={pilgrimage.description} className={styles.body} />
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

          {galleries.length ? (
            <section className={styles.memory} aria-labelledby="event-years">
              <h2 id="event-years">{galleries.some((row) => row.year) ? 'Through the years' : 'Gallery'}</h2>
              <p className={styles.memoryIntro}>
                {galleries.some((row) => row.year)
                  ? 'Moments from previous celebrations of this gathering.'
                  : 'Photos from this event.'}
              </p>
              {galleries.map((archive, galleryIndex) => (
                <div key={`${archive.year || 'gallery'}-${galleryIndex}`} className={styles.yearBlock}>
                  {archive.year ? <h3>{archive.year}</h3> : galleries.length > 1 ? <h3>Gallery {galleryIndex + 1}</h3> : null}
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

          <Link to="/pilgrimage/calendar" className={styles.backLink}>
            ← All pilgrimage events
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

            <TimingChoice
              value={values.timing}
              onChange={(timing) => setValues((prev) => ({ ...prev, timing }))}
              error={errors.timing}
            />

            {values.timing === 'later' ? (
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
            ) : null}

            {values.timing ? (
              <>
                <label className={styles.field}>
                  <span>Email</span>
                  <input type="email" value={values.email} onChange={handleChange('email')} />
                  {errors.email ? <em>{errors.email}</em> : null}
                </label>
                <label className={styles.field}>
                  <span>Phone / WhatsApp</span>
                  <input value={values.phone} onChange={handleChange('phone')} />
                  {errors.phone ? <em>{errors.phone}</em> : null}
                </label>
              </>
            ) : null}

            {values.timing === 'now' ? (
              <PaymentOptions
                offerings={offerings}
                audience={values.audience}
                onAudienceChange={(audience) => setValues((prev) => ({ ...prev, audience }))}
              />
            ) : null}

            {statusMessage ? (
              <p className={status === 'error' ? styles.error : styles.success}>{statusMessage}</p>
            ) : null}

            <button className={styles.submit} type="submit" disabled={status === 'submitting'}>
              {status === 'submitting'
                ? 'Sending…'
                : values.timing === 'now'
                  ? 'Save request'
                  : values.channel === 'whatsapp'
                    ? 'Submit pledge on WhatsApp'
                    : 'Submit pledge by email'}
            </button>
          </form>
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
