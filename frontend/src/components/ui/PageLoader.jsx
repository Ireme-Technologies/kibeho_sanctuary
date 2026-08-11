import { useContent } from '@context/ContentContext'
import { PRELOADER_NAME, PRELOADER_TAG, resolvePreloaderLogo } from '@utils/brand'
import styles from './PageLoader.module.css'

export default function PageLoader() {
  const { company } = useContent()
  const logo = resolvePreloaderLogo(company)
  const tag = company?.name && !/rvg|royal/i.test(company.name) ? company.name : PRELOADER_TAG

  return (
    <div className={styles.loader} role="status" aria-live="polite">
      <img src={logo} alt={PRELOADER_NAME} className={styles.logo} />
      <span className={styles.brand}>{PRELOADER_NAME}</span>
      <span className={styles.tag}>{tag}</span>
      <span className={styles.bar} />
      <span className="sr-only">Loading {PRELOADER_NAME}…</span>
    </div>
  )
}
