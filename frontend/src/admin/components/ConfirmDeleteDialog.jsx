import { useEffect, useRef, useState } from 'react'
import { subscribeConfirmDelete } from './confirmDelete'
import styles from '../admin.module.css'

export default function ConfirmDeleteDialog() {
  const [dialog, setDialog] = useState(null)
  const [step, setStep] = useState(1)
  const pendingRef = useRef(null)

  useEffect(() => {
    return subscribeConfirmDelete((next) => {
      if (pendingRef.current) pendingRef.current(false)
      pendingRef.current = next.resolve
      setStep(1)
      setDialog(next)
    })
  }, [])

  const settle = (ok) => {
    const resolve = pendingRef.current
    pendingRef.current = null
    setDialog(null)
    setStep(1)
    resolve?.(ok)
  }

  useEffect(() => {
    if (!dialog) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') settle(false)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [dialog])

  if (!dialog) return null

  const isFirstStep = step === 1
  const label = (dialog.confirmLabel || 'Delete').toLowerCase()
  const actionWord = label === 'remove' ? 'remove' : label === 'restore' ? 'restore' : 'delete'
  const secondMessage =
    dialog.finalMessage || `This cannot be undone. Permanently ${actionWord}?`

  return (
    <div className={`${styles.modalOverlay} ${styles.confirmOverlay}`} onClick={() => settle(false)} role="presentation">
      <div
        className={`${styles.modal} ${styles.confirmModal}`}
        onClick={(event) => event.stopPropagation()}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-delete-title"
        aria-describedby="confirm-delete-message"
      >
        <div className={styles.modalHeader}>
          <h2 id="confirm-delete-title">{dialog.title}</h2>
          <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => settle(false)}>
            Cancel
          </button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.confirmStep}>{isFirstStep ? 'Step 1 of 2' : 'Step 2 of 2'}</p>
          <p id="confirm-delete-message" className={styles.confirmMessage}>
            {isFirstStep ? dialog.message : secondMessage}
          </p>
          <p className={styles.confirmHint}>
            {isFirstStep
              ? 'You will be asked to confirm once more before this is applied.'
              : dialog.message}
          </p>
          <div className={styles.confirmActions}>
            <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={() => settle(false)}>
              Cancel
            </button>
            {isFirstStep ? (
              <button type="button" className={styles.btn} onClick={() => setStep(2)} autoFocus>
                Continue
              </button>
            ) : (
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDangerSolid}`}
                onClick={() => settle(true)}
                autoFocus
              >
                {dialog.confirmLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
