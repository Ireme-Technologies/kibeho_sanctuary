import { useState } from 'react'
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
} from 'lucide-react'
import { useInView } from '@hooks/useInView'
import { Link } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { submitEnquiry } from '@api/cms'
import { getVisibleSocials, resolveSocialIcon } from '@utils/socials'
import RichText from '@components/ui/RichText'
import styles from './ContactMain.module.css'

const initialFormState = { name: '', email: '', phone: '', message: '', channel: 'email' }

function validate(values, labels) {
  const errors = {}
  if (!values.name.trim()) errors.name = labels.validation.nameRequired
  if (values.channel === 'email') {
    if (!values.email.trim()) {
      errors.email = labels.validation.emailRequired
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      errors.email = labels.validation.emailInvalid
    }
  } else if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = labels.validation.emailInvalid
  }
  if (!values.phone.trim()) errors.phone = labels.validation.phoneRequired
  if (!values.message.trim()) errors.message = labels.validation.messageRequired
  return errors
}

export default function ContactMain() {
  const { contactInfo, contactFormLabels, company } = useContent()
  const socials = getVisibleSocials(company.socials)
  const [formRef, formInView] = useInView(0.15)
  const [infoRef, infoInView] = useInView(0.15)

  const [values, setValues] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | submitting | success | error
  const [statusMessage, setStatusMessage] = useState('')

  const handleChange = (field) => (e) => {
    const { value } = e.target
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate(values, contactFormLabels)
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) return

    setStatus('submitting')
    setStatusMessage('')
    try {
      const result = await submitEnquiry({
        name: values.name.trim(),
        email: values.email.trim() || null,
        phone: values.phone.trim(),
        message: values.message.trim(),
        channel: values.channel,
      })
      if (values.channel === 'whatsapp' && result.whatsapp_url) {
        window.open(result.whatsapp_url, '_blank', 'noopener,noreferrer')
      }
      setStatus('success')
      setStatusMessage(
        result.message
          || (values.channel === 'whatsapp'
            ? 'Enquiry saved. Continue in WhatsApp.'
            : contactFormLabels.successMessage)
      )
      setValues(initialFormState)
    } catch (err) {
      setStatus('error')
      setStatusMessage(err.errors?.email?.[0] || err.message || contactFormLabels.errorMessage)
    }
  }

  return (
    <section className={styles.section} aria-label="Contact form and information">
      <div className={styles.background} aria-hidden="true" />

      <div className={styles.container}>

        {/* ── FORM CARD (light, floating) ─────────────── */}
        <div
          ref={formRef}
          className={`${styles.formCard} fade-in-up ${formInView ? 'is-visible' : ''}`}
        >
          <h2 className={styles.formHeading}>{contactFormLabels.heading}</h2>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.fieldGroup}>
              <span className={styles.label}>How should we contact you?</span>
              <div className={styles.channelRow}>
                <label className={`${styles.channelOption} ${values.channel === 'email' ? styles.channelActive : ''}`}>
                  <input
                    type="radio"
                    name="channel"
                    value="email"
                    checked={values.channel === 'email'}
                    onChange={handleChange('channel')}
                  />
                  Email
                </label>
                <label className={`${styles.channelOption} ${values.channel === 'whatsapp' ? styles.channelActive : ''}`}>
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
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="name" className={styles.label}>
                {contactFormLabels.fields.name.label}
              </label>
              <input
                id="name"
                type="text"
                className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                placeholder={contactFormLabels.fields.name.placeholder}
                value={values.name}
                onChange={handleChange('name')}
              />
              {errors.name && <p className={styles.error}>{errors.name}</p>}
            </div>

            <div className={styles.fieldRow}>
              <div className={styles.fieldGroup}>
                <label htmlFor="email" className={styles.label}>
                  {contactFormLabels.fields.email.label}
                  {values.channel === 'whatsapp' ? ' (optional)' : ''}
                </label>
                <input
                  id="email"
                  type="email"
                  className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                  placeholder={contactFormLabels.fields.email.placeholder}
                  value={values.email}
                  onChange={handleChange('email')}
                />
                {errors.email && <p className={styles.error}>{errors.email}</p>}
                {values.channel === 'email' && (
                  <p className={styles.helperNote}>
                    Prefer tracking replies online?{' '}
                    <Link to="/client/register">Create a client account</Link>
                  </p>
                )}
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="phone" className={styles.label}>
                  {contactFormLabels.fields.phone.label}
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={`${styles.input} ${errors.phone ? styles.inputError : ''}`}
                  placeholder={contactFormLabels.fields.phone.placeholder}
                  value={values.phone}
                  onChange={handleChange('phone')}
                />
                {errors.phone && <p className={styles.error}>{errors.phone}</p>}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="message" className={styles.label}>
                {contactFormLabels.fields.message.label}
              </label>
              <textarea
                id="message"
                className={`${styles.textarea} ${errors.message ? styles.inputError : ''}`}
                placeholder={contactFormLabels.fields.message.placeholder}
                value={values.message}
                onChange={handleChange('message')}
              />
              {errors.message && <p className={styles.error}>{errors.message}</p>}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={status === 'submitting'}>
              {status === 'submitting' ? (
                <>
                  <span className={styles.spinner} aria-hidden="true" />
                  {contactFormLabels.submitLoadingLabel}
                </>
              ) : (
                <>
                  <Send size={16} aria-hidden="true" />
                  {contactFormLabels.submitLabel}
                </>
              )}
            </button>

            {status === 'success' && (
              <p className={styles.successMsg} role="status">
                {statusMessage || contactFormLabels.successMessage}
              </p>
            )}
            {status === 'error' && (
              <p className={styles.errorMsg} role="alert">
                {statusMessage || contactFormLabels.errorMessage}
              </p>
            )}
          </form>
        </div>

        {/* ── INFO PANEL (glassmorphism, dark) ────────── */}
        <div
          ref={infoRef}
          className={`${styles.infoCard} fade-in-up ${infoInView ? 'is-visible' : ''}`}
          style={{ animationDelay: '0.15s' }}
        >
          <h2 className={styles.infoHeading}>{contactInfo.heading}</h2>
          <div className={styles.infoAccent} aria-hidden="true" />

          <ul className={styles.infoList}>
            <li className={styles.infoItem}>
              <span className={styles.infoIcon} aria-hidden="true">
                <MapPin size={18} />
              </span>
              <div className={styles.infoText}>
                <span className={styles.infoLabel}>Address</span>
                <span className={styles.infoValue}>{contactInfo.address}</span>
              </div>
            </li>

            <li className={styles.infoItem}>
              <span className={styles.infoIcon} aria-hidden="true">
                <Phone size={18} />
              </span>
              <div className={styles.infoText}>
                <span className={styles.infoLabel}>Phone</span>
                <a
                  href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`}
                  className={styles.infoValueLink}
                >
                  {contactInfo.phone}
                </a>
              </div>
            </li>

            <li className={styles.infoItem}>
              <span className={styles.infoIcon} aria-hidden="true">
                <Mail size={18} />
              </span>
              <div className={styles.infoText}>
                <span className={styles.infoLabel}>Email</span>
                <a href={`mailto:${contactInfo.email}`} className={styles.infoValueLink}>
                  {contactInfo.email}
                </a>
              </div>
            </li>

            <li className={styles.infoItem}>
              <span className={styles.infoIcon} aria-hidden="true">
                <Clock size={18} />
              </span>
              <div className={styles.infoText}>
                <span className={styles.infoLabel}>Business Hours</span>
                {contactInfo.businessHours.map((row) => (
                  <span key={row.day} className={styles.hoursRow}>
                    <span className={styles.hoursDay}>{row.day}</span>
                    <span>{row.hours}</span>
                  </span>
                ))}
              </div>
            </li>
          </ul>

          <a
            href={`https://wa.me/${contactInfo.whatsappNumber}`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.whatsappBtn}
          >
            <MessageCircle size={18} aria-hidden="true" />
            {contactInfo.whatsappLabel}
          </a>

          <div className={styles.socialRow}>
            {socials.map((social, index) => {
              const Icon = resolveSocialIcon(social)
              return (
                <a
                  key={`${social.label || social.href}-${index}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={social.label || 'Social link'}
                >
                  <Icon size={16} />
                </a>
              )
            })}
          </div>

          <RichText html={contactInfo.responseNote} className={styles.responseNote} />
        </div>

      </div>
    </section>
  )
}