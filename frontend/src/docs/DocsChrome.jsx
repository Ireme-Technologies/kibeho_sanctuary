import { Link } from 'react-router-dom'
import styles from './DocsLayout.module.css'

export function DocsToolbar({ downloadHref, downloadLabel }) {
  return (
    <div className={`${styles.toolbar} ${styles.noPrint}`}>
      <a className={styles.btnSoft} href={downloadHref} download>
        {downloadLabel || 'Download document'}
      </a>
      <button
        type="button"
        className={styles.btnGhost}
        onClick={() => window.print()}
        title="Opens the print dialog with built-in page margins. Choose “Save as PDF” as the destination."
      >
        Save as PDF
      </button>
      <a className={styles.btnGhost} href="/" target="_blank" rel="noreferrer">
        Live demo
      </a>
      <a className={styles.btnPrimary} href="/admin/login" target="_blank" rel="noreferrer">
        Admin panel
      </a>
      <p className={styles.printHint}>
        <strong>Save as PDF</strong> already includes page margins — open the dialog, choose destination{' '}
        <em>Save as PDF</em>, then save. You do not need to set margins manually.
      </p>
    </div>
  )
}

export function DocsCrossNav({ prev, next }) {
  return (
    <div className={styles.crossNav}>
      {prev ? (
        <Link className={styles.btnGhost} to={prev.to}>
          ← {prev.label}
        </Link>
      ) : (
        <span />
      )}
      {next ? (
        <Link className={styles.btnPrimary} to={next.to}>
          {next.label} →
        </Link>
      ) : (
        <span />
      )}
    </div>
  )
}

export function DocsToc({ items }) {
  return (
    <aside className={styles.toc} aria-label="On this page">
      <h2>On this page</h2>
      {items.map((item) => (
        <a key={item.href} href={item.href}>
          {item.label}
        </a>
      ))}
    </aside>
  )
}
