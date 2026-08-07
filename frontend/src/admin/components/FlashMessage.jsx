import { useEffect } from 'react'
import styles from '../admin.module.css'

export default function FlashMessage({ type = 'success', message, onClear, duration = 4000 }) {
  useEffect(() => {
    if (!message || !onClear) return undefined
    const timer = setTimeout(onClear, duration)
    return () => clearTimeout(timer)
  }, [message, onClear, duration])

  if (!message) return null

  return (
    <div
      className={`${styles.flash} ${type === 'error' ? styles.flashError : styles.flashSuccess}`}
      role="status"
    >
      <span>{message}</span>
      {onClear && (
        <button type="button" className={styles.flashClose} onClick={onClear} aria-label="Dismiss">
          ×
        </button>
      )}
    </div>
  )
}
