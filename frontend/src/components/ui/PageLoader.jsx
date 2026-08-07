import styles from './PageLoader.module.css'

export default function PageLoader() {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <span className={styles.mark}>RVG</span>
      <span className={styles.bar} />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
