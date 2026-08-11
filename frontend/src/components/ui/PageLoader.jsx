import { useContent } from '@context/ContentContext'
import styles from './PageLoader.module.css'

export default function PageLoader() {
  const { company } = useContent()
  const logo = company?.logo || '/images/logo/logo-transparent.png'
  const name = company?.name || 'Shrine of Our Lady of Kibeho'

  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <img src={logo} alt={name} className={styles.logo} />
      <span className={styles.bar} />
      <span className="sr-only">Loading…</span>
    </div>
  )
}
