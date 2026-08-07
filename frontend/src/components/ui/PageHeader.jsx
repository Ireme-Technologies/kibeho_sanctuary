import styles from './PageHeader.module.css'

/**
 * Reusable banner for inner pages: dark photo background + single heading.
 */
export default function PageHeader({ title, backgroundImage }) {
  return (
    <header className={styles.header}>
      <div
        className={styles.background}
        style={backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : undefined}
      />
      <div className={styles.overlay} />

      <div className={`container ${styles.content}`}>
        <h1 className={styles.title}>{title}</h1>
      </div>
    </header>
  )
}
