import styles from './PageHeader.module.css'
import { useLocale } from '@context/LocaleContext'
import { displayTitleLabel } from '@i18n/typography'

/**
 * Reusable banner for inner pages: dark photo background + single heading.
 */
export default function PageHeader({ title, backgroundImage }) {
  const { locale } = useLocale()
  return (
    <header className={styles.header}>
      <div
        className={styles.background}
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
      />
      <div className={styles.overlay} />

      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>{displayTitleLabel(title, locale)}</h1>
      </div>
    </header>
  )
}
