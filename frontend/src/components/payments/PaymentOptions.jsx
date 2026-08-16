import { useState } from 'react'
import { Copy, CreditCard, Landmark, Smartphone } from 'lucide-react'
import { useLocale } from '@context/LocaleContext'
import { copyText, hasOnlineGateway, momoTelHref } from '@utils/payments'
import styles from './payments.module.css'

export default function PaymentOptions({
  offerings,
  amountLabel,
  audience: audienceProp,
  onAudienceChange,
}) {
  const { t } = useLocale()
  const [internalAudience, setInternalAudience] = useState('local')
  const audience = audienceProp ?? internalAudience
  const setAudience = onAudienceChange ?? setInternalAudience
  const [copied, setCopied] = useState('')
  const online = hasOnlineGateway(offerings)
  const momoHref = momoTelHref(offerings.momoCode)

  const markCopied = async (key, value) => {
    const ok = await copyText(value)
    setCopied(ok ? key : '')
    if (ok) window.setTimeout(() => setCopied(''), 1800)
  }

  return (
    <div className={styles.panel}>
      <div className={styles.chooser} role="group" aria-label={t('offer.whereYouPay')}>
        <button
          type="button"
          className={`${styles.choice} ${audience === 'local' ? styles.choiceActive : ''}`}
          onClick={() => setAudience('local')}
        >
          <strong>{t('offer.rwanda')}</strong>
          <span>{t('offer.momoHint')}</span>
        </button>
        <button
          type="button"
          className={`${styles.choice} ${audience === 'international' ? styles.choiceActive : ''}`}
          onClick={() => setAudience('international')}
        >
          <strong>{t('offer.abroad')}</strong>
          <span>{online ? t('offer.cardOrMomo') : t('offer.bankTransfer')}</span>
        </button>
      </div>

      {audience === 'local' && offerings.momoCode ? (
        <div className={`${styles.method} ${styles.momo}`}>
          <div className={styles.methodHead}>
            <span className={styles.iconWrap} aria-hidden="true">
              <Smartphone size={18} />
            </span>
            <div>
              <h3>{offerings.momoLabel || t('offer.momoHint')}</h3>
              {amountLabel ? <p>{amountLabel}</p> : null}
            </div>
          </div>
          <code className={styles.code}>{offerings.momoCode}</code>
          <div className={styles.actions}>
            {momoHref ? (
              <a className={styles.solidBtn} href={momoHref}>
                {t('offer.openMomo')}
              </a>
            ) : null}
            <button type="button" className={styles.ghostBtn} onClick={() => markCopied('momo', offerings.momoCode)}>
              <Copy size={16} />
              {copied === 'momo' ? t('offer.copied') : t('offer.copy')}
            </button>
          </div>
        </div>
      ) : null}

      {audience === 'international' && online ? (
        <div className={`${styles.method} ${styles.online}`}>
          <div className={styles.methodHead}>
            <span className={styles.iconWrap} aria-hidden="true">
              <CreditCard size={18} />
            </span>
            <div>
              <h3>{offerings.onlinePaymentLabel || t('offer.payOnline')}</h3>
            </div>
          </div>
          <div className={styles.actions}>
            <a
              className={styles.solidBtn}
              href={offerings.onlinePaymentUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {t('offer.payOnline')}
            </a>
          </div>
        </div>
      ) : null}

      {audience === 'international' && !online ? (
        <div className={styles.method}>
          <div className={styles.methodHead}>
            <span className={styles.iconWrap} aria-hidden="true">
              <Landmark size={18} />
            </span>
            <div>
              <h3>{offerings.bankLabel || t('offer.bankTransfer')}</h3>
            </div>
          </div>
          <div className={styles.accounts}>
            {(offerings.accounts || []).map((row) => {
              const key = `${row.bank}-${row.number}`
              return (
                <div className={styles.account} key={key}>
                  <p>
                    <strong>
                      {row.bank} · {row.currency}
                    </strong>
                    {row.number}
                  </p>
                  <button type="button" className={styles.copyBtn} onClick={() => markCopied(key, row.number)}>
                    {copied === key ? t('offer.copied') : t('offer.copy')}
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      ) : null}
    </div>
  )
}

export function paymentLabel(offerings, audience, timing) {
  if (timing === 'later') return 'Pledge — office to follow up'
  if (audience === 'local') {
    return `${offerings.momoLabel || 'MoMo Pay'} (${offerings.momoCode || ''})`
  }
  if (hasOnlineGateway(offerings)) {
    return offerings.onlinePaymentLabel || 'Pay online'
  }
  return offerings.bankLabel || 'Bank transfer'
}
