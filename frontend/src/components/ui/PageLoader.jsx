import styles from './PageLoader.module.css'

const LOGO = '/images/logo/logo-transparent.png'

export default function PageLoader() {
  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <img src={LOGO} alt="Kibeho Sanctuary" className={styles.logo} />
      <span className={styles.bar} />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
