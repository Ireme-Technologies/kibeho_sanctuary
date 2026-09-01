import { useState } from 'react'
import { Mail, MessageCircle } from 'lucide-react'
import { useLocale } from '@context/LocaleContext'
import { submitEnquiry } from '@api/cms'
import styles from './payments/payments.module.css'

function emptyValues() {
  return {
    groupName: '',
    pilgrimCount: '',
    leaderName: '',
    leaderPhone: '',
    services: '',
    arrivalDate: '',
    departureDate: '',
    agenda: '',
    transport: '',
    accommodation: '',
    celebret: '',
    name: '',
    email: '',
    phone: '',
    channel: 'email',
  }
}

export default function GroupRegistrationForm() {
  const { t } = useLocale()
  const [values, setValues] = useState(emptyValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [feedback, setFeedback] = useState('')

  const setField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleChange = (field) => (e) => setField(field, e.target.value)

  const validate = () => {
    const next = {}
    if (!values.groupName.trim()) next.groupName = 'Group name is required.'
    if (!values.pilgrimCount.trim()) next.pilgrimCount = 'Number of pilgrims is required.'
    if (!values.leaderName.trim()) next.leaderName = 'Team leader name is required.'
    if (!values.leaderPhone.trim()) next.leaderPhone = 'Team leader phone is required.'
    if (!values.name.trim()) next.name = t('offer.nameRequired')
    if (values.channel === 'email') {
      if (!values.email.trim()) next.email = t('offer.emailRequired')
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t('offer.validEmail')
    } else if (!values.phone.trim()) {
      next.phone = t('offer.whatsappRequired')
    }
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) return

    const lines = [
      `Group: ${values.groupName.trim()}`,
      `Pilgrims: ${values.pilgrimCount.trim()}`,
      `Team leader: ${values.leaderName.trim()} (${values.leaderPhone.trim()})`,
      values.services.trim() ? `Services requested: ${values.services.trim()}` : null,
      values.arrivalDate ? `Arrival: ${values.arrivalDate}` : null,
      values.departureDate ? `Departure: ${values.departureDate}` : null,
      values.agenda.trim() ? `Program agenda:\n${values.agenda.trim()}` : null,
      values.transport.trim() ? `Transport: ${values.transport.trim()}` : null,
      values.accommodation.trim() ? `Accommodation: ${values.accommodation.trim()}` : null,
      values.celebret.trim() ? `Celebret / authority document: ${values.celebret.trim()}` : null,
      `Page: ${window.location.href}`,
    ].filter(Boolean)

    setStatus('submitting')
    setFeedback('')
    try {
      const result = await submitEnquiry({
        name: values.name.trim(),
        email: values.email.trim() || null,
        phone: values.phone.trim() || values.leaderPhone.trim(),
        subject: 'Pilgrimage group registration',
        message: lines.join('\n'),
        enquiry_type: 'pilgrimage',
        channel: values.channel,
      })
      if (values.channel === 'whatsapp' && result.whatsapp_url) {
        window.open(result.whatsapp_url, '_blank', 'noopener,noreferrer')
      }
      setStatus('success')
      setFeedback(
        values.channel === 'whatsapp' ? t('offer.thanksWhatsapp') : t('offer.thanksEmail'),
      )
      setValues(emptyValues())
    } catch (err) {
      setStatus('error')
      setFeedback(err.errors?.email?.[0] || err.message || t('offer.sendFailed'))
    }
  }

  return (
    <div className={styles.formCard} id="register">
      <div className={styles.formHead}>
        <h2>Register your pilgrimage group</h2>
        <p>Submit this form before you travel. The Pilgrimage Office will contact you to confirm.</p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor="group-name">Group name</label>
            <input id="group-name" value={values.groupName} onChange={handleChange('groupName')} />
            {errors.groupName ? <p className={styles.error}>{errors.groupName}</p> : null}
          </div>
          <div className={styles.field}>
            <label htmlFor="pilgrim-count">Number of pilgrims</label>
            <input id="pilgrim-count" value={values.pilgrimCount} onChange={handleChange('pilgrimCount')} />
            {errors.pilgrimCount ? <p className={styles.error}>{errors.pilgrimCount}</p> : null}
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor="leader-name">Team leader&apos;s name</label>
            <input id="leader-name" value={values.leaderName} onChange={handleChange('leaderName')} />
            {errors.leaderName ? <p className={styles.error}>{errors.leaderName}</p> : null}
          </div>
          <div className={styles.field}>
            <label htmlFor="leader-phone">Team leader&apos;s phone</label>
            <input id="leader-phone" value={values.leaderPhone} onChange={handleChange('leaderPhone')} />
            {errors.leaderPhone ? <p className={styles.error}>{errors.leaderPhone}</p> : null}
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="services">Services requested</label>
          <input
            id="services"
            value={values.services}
            onChange={handleChange('services')}
            placeholder="Mass, confession, guided tour, etc."
          />
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor="arrival-date">Arrival date</label>
            <input id="arrival-date" type="date" value={values.arrivalDate} onChange={handleChange('arrivalDate')} />
          </div>
          <div className={styles.field}>
            <label htmlFor="departure-date">Departure date</label>
            <input
              id="departure-date"
              type="date"
              value={values.departureDate}
              onChange={handleChange('departureDate')}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="agenda">Program agenda</label>
          <textarea id="agenda" value={values.agenda} onChange={handleChange('agenda')} rows={4} />
        </div>

        <div className={styles.grid}>
          <div className={styles.field}>
            <label htmlFor="transport">Means of transport</label>
            <input id="transport" value={values.transport} onChange={handleChange('transport')} />
          </div>
          <div className={styles.field}>
            <label htmlFor="accommodation">Accommodation details</label>
            <input id="accommodation" value={values.accommodation} onChange={handleChange('accommodation')} />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="celebret">Valid celebret or authority document</label>
          <textarea
            id="celebret"
            value={values.celebret}
            onChange={handleChange('celebret')}
            rows={3}
            placeholder="For priests: celebret from Bishop or religious superior. For seminarians: document from competent ecclesiastical authority."
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="contact-name">{t('offer.yourName')} (contact person)</label>
          <input id="contact-name" value={values.name} onChange={handleChange('name')} />
          {errors.name ? <p className={styles.error}>{errors.name}</p> : null}
        </div>

        <div className={styles.section}>
          <div className={styles.channelRow}>
            <label className={`${styles.channel} ${values.channel === 'email' ? styles.channelActive : ''}`}>
              <input
                type="radio"
                name="channel"
                value="email"
                checked={values.channel === 'email'}
                onChange={handleChange('channel')}
              />
              <Mail size={16} />
              {t('email')}
            </label>
            <label className={`${styles.channel} ${values.channel === 'whatsapp' ? styles.channelActive : ''}`}>
              <input
                type="radio"
                name="channel"
                value="whatsapp"
                checked={values.channel === 'whatsapp'}
                onChange={handleChange('channel')}
              />
              <MessageCircle size={16} />
              {t('offer.whatsapp')}
            </label>
          </div>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label htmlFor="contact-email">{t('email')}</label>
              <input id="contact-email" type="email" value={values.email} onChange={handleChange('email')} />
              {errors.email ? <p className={styles.error}>{errors.email}</p> : null}
            </div>
            <div className={styles.field}>
              <label htmlFor="contact-phone">{t('offer.whatsapp')}</label>
              <input id="contact-phone" value={values.phone} onChange={handleChange('phone')} />
              {errors.phone ? <p className={styles.error}>{errors.phone}</p> : null}
            </div>
          </div>
        </div>

        <button className={`${styles.solidBtn} ${styles.submit}`} type="submit" disabled={status === 'submitting'}>
          {status === 'submitting' ? t('offer.sending') : 'Submit registration'}
        </button>
        {status === 'success' ? <p className={styles.success}>{feedback}</p> : null}
        {status === 'error' ? <p className={styles.error}>{feedback}</p> : null}
      </form>
    </div>
  )
}
