import { Banknote, Handshake } from 'lucide-react'
import { useLocale } from '@context/LocaleContext'
import styles from './payments.module.css'

export default function TimingChoice({ value, onChange, error }) {
  const { t } = useLocale()
  return (
    <div className={styles.section}>
      <div className={styles.chooser} role="group" aria-label={t('offer.chooseTiming')}>
        <button
          type="button"
          className={`${styles.choice} ${styles.choiceRow} ${value === 'now' ? styles.choiceActive : ''}`}
          onClick={() => onChange('now')}
        >
          <Banknote size={18} />
          <strong>{t('offer.payNow')}</strong>
        </button>
        <button
          type="button"
          className={`${styles.choice} ${styles.choiceRow} ${value === 'later' ? styles.choiceActive : ''}`}
          onClick={() => onChange('later')}
        >
          <Handshake size={18} />
          <strong>{t('offer.pledge')}</strong>
        </button>
      </div>
      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  )
}
