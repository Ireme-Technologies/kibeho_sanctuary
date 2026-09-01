import { useState } from 'react'
import { Mail, MessageCircle } from 'lucide-react'
import { useLocale } from '@context/LocaleContext'
import { submitEnquiry } from '@api/cms'
import styles from './payments/payments.module.css'

const KIND_META = {
  prayer: { subject: 'Prayer intention', enquiryType: 'prayer' },
  testimony: { subject: 'Share your testimony', enquiryType: 'testimony' },
}

function emptyValues() {
  return {
    name: '',
    email: '',
    phone: '',
    message: '',
    channel: 'email',
  }
}

export default function PrivateEnquiryForm({
  kind = 'prayer',
  title,
  messageLabel,
  messagePlaceholder,
  showShare = false,
}) {
  const { t } = useLocale()
  const meta = KIND_META[kind] || KIND_META.prayer
  const formTitle = title || (kind === 'testimony' ? 'Share your testimony' : 'Prayer intention')
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
    if (!values.name.trim()) next.name = t('offer.nameRequired')
    if (!values.message.trim()) next.message = messageLabel || 'Please share your intention.'
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

    const lines = [values.message.trim(), `Page: ${window.location.href}`]

    setStatus('submitting')
    setFeedback('')
    try {
      const result = await submitEnquiry({
        name: values.name.trim(),
        email: values.email.trim() || null,
        phone: values.phone.trim() || '',
        subject: meta.subject,
        message: lines.join('\n'),
        enquiry_type: meta.enquiryType,
        channel: values.channel,
      })
      if (values.channel === 'whatsapp' && result.whatsapp_url) {
        window.open(result.whatsapp_url, '_blank', 'noopener,noreferrer')
      }
      setStatus('success')
      setFeedback(
        values.channel === 'whatsapp' ? t('offer.thanksWhatsapp') : t('offer.thanksEmail')
      )
      setValues(emptyValues())
    } catch (err) {
      setStatus('error')
      setFeedback(err.errors?.email?.[0] || err.message || t('offer.sendFailed'))
    }
  }

  return (
    <div className={styles.formCard} id="pledge">
      <div className={styles.formHead}>
        <h2>{formTitle}</h2>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="private-message">{messageLabel || 'Your message'}</label>
          <textarea
            id="private-message"
            value={values.message}
            onChange={handleChange('message')}
            rows={5}
            placeholder={messagePlaceholder || ''}
          />
          {errors.message ? <p className={styles.error}>{errors.message}</p> : null}
        </div>

        <div className={styles.field}>
          <label htmlFor="private-name">{t('offer.yourName')}</label>
          <input id="private-name" value={values.name} onChange={handleChange('name')} />
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
              <label htmlFor="private-email">{t('email')}</label>
              <input id="private-email" type="email" value={values.email} onChange={handleChange('email')} />
              {errors.email ? <p className={styles.error}>{errors.email}</p> : null}
            </div>
            <div className={styles.field}>
              <label htmlFor="private-phone">{t('offer.whatsapp')}</label>
              <input id="private-phone" value={values.phone} onChange={handleChange('phone')} />
              {errors.phone ? <p className={styles.error}>{errors.phone}</p> : null}
            </div>
          </div>
        </div>

        <button className={`${styles.solidBtn} ${styles.submit}`} type="submit" disabled={status === 'submitting'}>
          {status === 'submitting'
            ? t('offer.sending')
            : values.channel === 'whatsapp'
              ? t('offer.submitPledgeWhatsapp')
              : t('offer.submitPledgeEmail')}
        </button>
        {status === 'success' ? <p className={styles.success}>{feedback}</p> : null}
        {status === 'error' ? <p className={styles.error}>{feedback}</p> : null}
      </form>
    </div>
  )
}
