import { useState } from 'react'
import { Mail, MessageCircle } from 'lucide-react'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { submitEnquiry } from '@api/cms'
import { giftAmounts } from '@utils/payments'
import PaymentOptions, { paymentLabel } from './payments/PaymentOptions'
import SharePageBar from './payments/SharePageBar'
import TimingChoice from './payments/TimingChoice'
import styles from './payments/payments.module.css'

const KINDS = {
  candle: { titleKey: 'offer.lightCandle', enquiryType: 'candle', subject: 'Light a candle' },
  mass: { titleKey: 'offer.haveMass', enquiryType: 'mass', subject: 'Have a Mass said' },
  donation: { titleKey: 'offer.giveMission', enquiryType: 'donation', subject: 'Donation to the Shrine' },
  project: { titleKey: 'offer.supportProject', enquiryType: 'project', subject: 'Project gift' },
  partnership: { titleKey: 'offer.partnership', enquiryType: 'partnership', subject: 'Partnership enquiry' },
}

function emptyValues(kind) {
  return {
    quantity: kind === 'candle' ? '1' : '',
    amount: '',
    intention: '',
    name: '',
    email: '',
    phone: '',
    channel: 'email',
    audience: 'local',
    timing: '',
  }
}

export default function OfferingForm({ kind = 'candle', projectTitle = '', showShare = true }) {
  const { offerings } = useContent()
  const { t } = useLocale()
  const meta = KINDS[kind] || KINDS.donation
  const formTitle = projectTitle || t(meta.titleKey)
  const amounts = giftAmounts(offerings)
  const isCandle = kind === 'candle'
  const isMass = kind === 'mass'
  const isGift = kind === 'donation' || kind === 'project'
  const isPartnership = kind === 'partnership'
  const unitPrice = isMass ? Number(offerings.massPriceUsd) || 0 : Number(offerings.candlePriceUsd) || 0
  const [values, setValues] = useState(() => emptyValues(kind))
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [message, setMessage] = useState('')

  const qty = isCandle ? Math.max(1, Number(values.quantity) || 1) : 1
  const giftAmount = Number(values.amount) || 0
  const total = isGift ? giftAmount : isMass ? unitPrice : qty * unitPrice
  const amountLabel = total > 0 ? `${t('offer.usd')} ${total}` : ''
  const payNow = !isPartnership && values.timing === 'now'
  const payLater = isPartnership || values.timing === 'later'
  const channel = payNow ? (values.email.trim() ? 'email' : 'whatsapp') : values.channel

  const setField = (field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleChange = (field) => (e) => setField(field, e.target.value)

  const setQty = (next) => setField('quantity', String(Math.max(1, next)))

  const validate = () => {
    const next = {}
    if (isCandle && qty < 1) next.quantity = t('offer.atLeastOneCandle')
    if (isMass && !values.intention.trim()) next.intention = t('offer.addIntention')
    if (!values.name.trim()) next.name = t('offer.nameRequired')
    if (!isPartnership && !values.timing) next.timing = t('offer.chooseTiming')
    if (payLater) {
      if (channel === 'email') {
        if (!values.email.trim()) next.email = t('offer.emailRequired')
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) next.email = t('offer.validEmail')
      } else if (!values.phone.trim()) {
        next.phone = t('offer.whatsappRequired')
      }
    } else if (payNow) {
      if (!values.email.trim() && !values.phone.trim()) next.email = t('offer.addEmailOrPhone')
      else if (values.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
        next.email = t('offer.validEmail')
      }
    }
    return next
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const next = validate()
    setErrors(next)
    if (Object.keys(next).length) return

    const lines = []
    if (isCandle) {
      lines.push(`Candles: ${qty} × USD ${unitPrice} = USD ${total}`)
      if (values.intention.trim()) lines.push(`Dedication: ${values.intention.trim()}`)
    } else if (isMass) {
      lines.push(`Mass offering: USD ${unitPrice}`)
      lines.push(`Intention: ${values.intention.trim()}`)
    } else if (isGift) {
      if (projectTitle) lines.push(`Project: ${projectTitle}`)
      if (giftAmount) lines.push(`Amount: USD ${giftAmount}`)
      if (values.intention.trim()) lines.push(values.intention.trim())
    } else if (values.intention.trim()) {
      lines.push(values.intention.trim())
    }
    lines.push(`When: ${payNow ? 'Pay now' : 'Pledge — office to follow up'}`)
    lines.push(`Payment: ${paymentLabel(offerings, values.audience, values.timing)}`)
    lines.push(`Page: ${window.location.href}`)

    setStatus('submitting')
    setMessage('')
    try {
      const result = await submitEnquiry({
        name: values.name.trim(),
        email: values.email.trim() || null,
        phone: values.phone.trim() || '',
        subject: projectTitle ? `${meta.subject}: ${projectTitle}` : meta.subject,
        message: lines.join('\n'),
        enquiry_type: meta.enquiryType,
        channel,
      })
      if (!payNow && channel === 'whatsapp' && result.whatsapp_url) {
        window.open(result.whatsapp_url, '_blank', 'noopener,noreferrer')
      }
      setStatus('success')
      setMessage(
        payNow
          ? t('offer.savedPay')
          : channel === 'whatsapp'
            ? t('offer.thanksWhatsapp')
            : t('offer.thanksEmail')
      )
      setValues((prev) => ({
        ...emptyValues(kind),
        quantity: prev.quantity,
        amount: prev.amount,
        audience: prev.audience,
        timing: prev.timing,
      }))
    } catch (err) {
      setStatus('error')
      setMessage(err.errors?.email?.[0] || err.message || t('offer.sendFailed'))
    }
  }

  return (
    <div className={styles.formCard} id="pledge">
      <div className={styles.formHead}>
        <h2>{formTitle}</h2>
        <div className={styles.headMeta}>
          {amountLabel ? <span className={styles.totalChip}>{amountLabel}</span> : null}
          {showShare ? <SharePageBar title={formTitle} /> : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {isCandle ? (
          <div className={styles.section}>
            <div className={styles.qtyRow}>
              <span>{t('offer.candles')}</span>
              <div className={styles.stepper}>
                <button type="button" onClick={() => setQty(qty - 1)} aria-label={t('offer.fewerCandles')}>
                  −
                </button>
                <strong>{qty}</strong>
                <button type="button" onClick={() => setQty(qty + 1)} aria-label={t('offer.moreCandles')}>
                  +
                </button>
              </div>
            </div>
            {errors.quantity ? <p className={styles.error}>{errors.quantity}</p> : null}
            <div className={styles.field}>
              <label htmlFor="offering-dedication">{t('offer.dedication')}</label>
              <textarea
                id="offering-dedication"
                value={values.intention}
                onChange={handleChange('intention')}
                rows={3}
                placeholder={t('offer.dedicationPlaceholder')}
              />
            </div>
          </div>
        ) : null}

        {isMass ? (
          <div className={styles.field}>
            <label htmlFor="offering-intention">{t('offer.intention')}</label>
            <textarea
              id="offering-intention"
              value={values.intention}
              onChange={handleChange('intention')}
              rows={4}
              placeholder={t('offer.intentionPlaceholder')}
            />
            {errors.intention ? <p className={styles.error}>{errors.intention}</p> : null}
          </div>
        ) : null}

        {isGift || isPartnership ? (
          <>
            {isGift ? (
              <div className={styles.field}>
                <label htmlFor="offering-amount">{t('offer.yourGift')}</label>
                <div className={styles.amountRow}>
                  {amounts.map((n) => (
                    <button
                      key={n}
                      type="button"
                      className={`${styles.amountChip} ${giftAmount === n ? styles.amountChipActive : ''}`}
                      onClick={() => setField('amount', String(n))}
                    >
                      {t('offer.usd')} {n}
                    </button>
                  ))}
                </div>
                <input
                  id="offering-amount"
                  type="number"
                  min="1"
                  step="1"
                  value={values.amount}
                  onChange={handleChange('amount')}
                  placeholder={t('offer.anotherAmount')}
                />
              </div>
            ) : null}
            <div className={styles.field}>
              <label htmlFor="offering-note">{isPartnership ? t('offer.yourMessage') : t('offer.note')}</label>
              <textarea
                id="offering-note"
                value={values.intention}
                onChange={handleChange('intention')}
                rows={3}
              />
            </div>
          </>
        ) : null}

        <div className={styles.field}>
          <label htmlFor="offering-name">{t('offer.yourName')}</label>
          <input id="offering-name" value={values.name} onChange={handleChange('name')} />
          {errors.name ? <p className={styles.error}>{errors.name}</p> : null}
        </div>

        {!isPartnership ? (
          <TimingChoice
            value={values.timing}
            onChange={(timing) => setField('timing', timing)}
            error={errors.timing}
          />
        ) : null}

        {payLater ? (
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
                <label htmlFor="offering-email">{t('email')}</label>
                <input
                  id="offering-email"
                  type="email"
                  value={values.email}
                  onChange={handleChange('email')}
                />
                {errors.email ? <p className={styles.error}>{errors.email}</p> : null}
              </div>
              <div className={styles.field}>
                <label htmlFor="offering-phone">{t('offer.whatsapp')}</label>
                <input id="offering-phone" value={values.phone} onChange={handleChange('phone')} />
                {errors.phone ? <p className={styles.error}>{errors.phone}</p> : null}
              </div>
            </div>
          </div>
        ) : null}

        {payNow ? (
          <div className={styles.section}>
            <div className={styles.grid}>
              <div className={styles.field}>
                <label htmlFor="offering-email-now">{t('email')}</label>
                <input
                  id="offering-email-now"
                  type="email"
                  value={values.email}
                  onChange={handleChange('email')}
                />
                {errors.email ? <p className={styles.error}>{errors.email}</p> : null}
              </div>
              <div className={styles.field}>
                <label htmlFor="offering-phone-now">{t('phone')}</label>
                <input id="offering-phone-now" value={values.phone} onChange={handleChange('phone')} />
              </div>
            </div>
            <PaymentOptions
              offerings={offerings}
              amountLabel={amountLabel}
              audience={values.audience}
              onAudienceChange={(audience) => setField('audience', audience)}
            />
          </div>
        ) : null}

        <button className={`${styles.solidBtn} ${styles.submit}`} type="submit" disabled={status === 'submitting'}>
          {status === 'submitting'
            ? t('offer.sending')
            : payNow
              ? t('offer.saveRequest')
              : channel === 'whatsapp'
                ? t('offer.submitPledgeWhatsapp')
                : t('offer.submitPledgeEmail')}
        </button>
        {status === 'success' ? <p className={styles.success}>{message}</p> : null}
        {status === 'error' ? <p className={styles.error}>{message}</p> : null}
      </form>
    </div>
  )
}
