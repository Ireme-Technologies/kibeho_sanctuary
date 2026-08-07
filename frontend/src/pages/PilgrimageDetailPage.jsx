import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { submitEnquiry } from '@api/cms'
import { formatEventWhen, formatRecurrence } from '@utils/eventTime'
import RichText from '@components/ui/RichText'
import NotFoundPage from './NotFoundPage'
import styles from './PilgrimageDetailPage.module.css'

const initialForm = { name: '', email: '', phone: '', message: '', channel: 'email' }

export default function PilgrimageDetailPage() {
  const { slug } = useParams()
  const { upcomingPilgrimages } = useContent()
  const pilgrimage = (upcomingPilgrimages || []).find((item) => item.slug === slug)

  const [values, setValues] = useState(initialForm)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [statusMessage, setStatusMessage] = useState('')

  if (!pilgrimage) return <NotFoundPage />

  const whenLabel = formatEventWhen(pilgrimage)
  const recurrenceLabel = formatRecurrence(pilgrimage)

  const handleChange = (field) => (e) => {
    setValues((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const validate = () => {
    const next = {}
    if (!values.name.trim()) next.name = 'Name is required.'
    if (values.channel === 'email') {
      if (!values.email.trim()) next.email = 'Email is required.'
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = 'Enter a valid email.'
    }
    if (!values.phone.trim()) next.phone = 'Phone is required.'
    if (!values.message.trim()) next.message = 'Please share a short message or group details.'
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
      const result = await submitEnquiry({
        name: values.name.trim(),
        email: values.email.trim() || null,
        phone: values.phone.trim(),
        subject: `Pilgrimage registration: ${pilgrimage.title}`,
        message: values.message.trim(),
        enquiry_type: 'pilgrimage',
        upcoming_pilgrimage_id: pilgrimage.id,
        channel: values.channel,
      })
      if (values.channel === 'whatsapp' && result.whatsapp_url) {
        window.open(result.whatsapp_url, '_blank', 'noopener,noreferrer')
      }
      setStatus('success')
      setStatusMessage(
        result.message ||
          'Thank you. Your registration enquiry was received and our pilgrim office will follow up.'
      )
      setValues(initialForm)
    } catch (err) {
      setStatus('error')
      setStatusMessage(err.errors?.email?.[0] || err.message || 'Unable to submit. Please try again.')
    }
  }

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={
          pilgrimage.image
            ? {
                backgroundImage: `linear-gradient(120deg, rgba(18,40,71,.88), rgba(26,54,93,.45)), url(${pilgrimage.image})`,
              }
            : undefined
        }
      >
        <div className="container">
          <p className={styles.eyebrow}>Upcoming Pilgrimage</p>
          <h1>{pilgrimage.title}</h1>
          <div className={styles.metaRow}>
            {pilgrimage.meta ? <span>{pilgrimage.meta}</span> : null}
            {whenLabel ? <span>{whenLabel}</span> : null}
            {recurrenceLabel ? <span>{recurrenceLabel}</span> : null}
            {pilgrimage.location ? <span>{pilgrimage.location}</span> : null}
          </div>
        </div>
      </header>

      <div className={`container ${styles.layout}`}>
        <div className={styles.content}>
          {pilgrimage.shortDescription ? (
            <p className={styles.lead}>{pilgrimage.shortDescription}</p>
          ) : null}
          {pilgrimage.description ? (
            <RichText html={pilgrimage.description} className={styles.body} />
          ) : null}
          <Link to="/pilgrimages" className={styles.backLink}>
            ← All upcoming pilgrimages
          </Link>
        </div>

        <aside className={styles.formCard} id="register">
          <h2>Register your interest</h2>
          <p className={styles.formIntro}>
            {pilgrimage.registrationOpen === false
              ? 'Registration is currently closed for this pilgrimage. You may still send a message to the pilgrim office.'
              : 'Send an enquiry to register yourself or your group for this pilgrimage.'}
          </p>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
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

            <label className={styles.field}>
              <span>Full name</span>
              <input value={values.name} onChange={handleChange('name')} />
              {errors.name ? <em>{errors.name}</em> : null}
            </label>

            <label className={styles.field}>
              <span>Email {values.channel === 'email' ? '' : '(optional)'}</span>
              <input type="email" value={values.email} onChange={handleChange('email')} />
              {errors.email ? <em>{errors.email}</em> : null}
            </label>

            <label className={styles.field}>
              <span>Phone / WhatsApp</span>
              <input value={values.phone} onChange={handleChange('phone')} />
              {errors.phone ? <em>{errors.phone}</em> : null}
            </label>

            <label className={styles.field}>
              <span>Group size, dates, or message</span>
              <textarea rows={5} value={values.message} onChange={handleChange('message')} />
              {errors.message ? <em>{errors.message}</em> : null}
            </label>

            {statusMessage ? (
              <p className={status === 'error' ? styles.error : styles.success}>{statusMessage}</p>
            ) : null}

            <button className={styles.submit} type="submit" disabled={status === 'submitting'}>
              {status === 'submitting' ? 'Sending…' : 'Submit registration enquiry'}
            </button>
          </form>
        </aside>
      </div>
    </div>
  )
}
