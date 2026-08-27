import { PRELOADER_NAME, PRELOADER_TAG, DEFAULT_FAVICON } from '@utils/brand'
import styles from './PageLoader.module.css'

export default function PageLoader() {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <img src={DEFAULT_FAVICON} alt="" className={styles.logo} />
      <span className={styles.brand}>{PRELOADER_NAME}</span>
      <span className={styles.tag}>{PRELOADER_TAG}</span>
      <span className={styles.bar} />
      <span className="sr-only">Loading {PRELOADER_NAME}…</span>
    </div>
  )
}
