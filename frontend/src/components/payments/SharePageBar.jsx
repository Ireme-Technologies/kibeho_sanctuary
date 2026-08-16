import { useState } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'
import { useLocale } from '@context/LocaleContext'
import { copyText, shareOrCopyPage } from '@utils/payments'
import styles from './payments.module.css'

export default function SharePageBar({ title }) {
  const { t } = useLocale()
  const [copied, setCopied] = useState(false)

  const flash = () => {
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const handleShare = async () => {
    const result = await shareOrCopyPage({ title })
    if (result === 'copied' || result === 'shared') flash()
  }

  const handleCopy = async () => {
    if (await copyText(window.location.href)) flash()
  }

  return (
    <div className={styles.shareBar}>
      <button type="button" className={styles.iconBtn} onClick={handleShare} aria-label={t('offer.sharePage')} title={t('offer.share')}>
        <Share2 size={16} />
      </button>
      <button type="button" className={styles.iconBtn} onClick={handleCopy} aria-label={t('offer.copyLink')} title={t('offer.copyLink')}>
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  )
}
