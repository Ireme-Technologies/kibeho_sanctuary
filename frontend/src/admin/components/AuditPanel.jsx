import { Link } from 'react-router-dom'
import styles from '../admin.module.css'

export function statusLabel(status) {
  if (status === 'ready') return 'Ready'
  if (status === 'good') return 'Good'
  if (status === 'needs_work') return 'Needs work'
  return 'Missing'
}

export function barTone(percent) {
  if (percent >= 90) return styles.auditFillReady
  if (percent >= 70) return styles.auditFillGood
  if (percent >= 40) return styles.auditFillWarn
  return styles.auditFillBad
}

export function AuditBar({ percent }) {
  const value = Math.max(0, Math.min(100, Number(percent) || 0))
  return (
    <div className={styles.auditBar} aria-hidden="true">
      <span className={`${styles.auditFill} ${barTone(value)}`} style={{ width: `${value}%` }} />
    </div>
  )
}

export function AuditScore({ percent, status, size = 'md' }) {
  return (
    <div className={`${styles.auditScore} ${size === 'lg' ? styles.auditScoreLg : ''}`}>
      <strong>{percent}%</strong>
      <span className={`${styles.auditPill} ${styles[`auditPill_${status}`] || ''}`}>{statusLabel(status)}</span>
    </div>
  )
}

export function AuditCriticalList({
  items,
  title = 'Fix these first',
  emptyText = 'Nothing urgent. Keep reviewing the sections below when you have time.',
}) {
  if (!items?.length) {
    return (
      <div className={styles.auditEmpty}>
        <p>{emptyText}</p>
      </div>
    )
  }

  return (
    <div className={styles.auditCritical}>
      <h2>{title}</h2>
      <ol>
        {items.map((item) => (
          <li key={`${item.href}-${item.label}`}>
            <Link to={item.href}>{item.label}</Link>
            <span>
              {item.area}
              {item.reason ? ` · ${item.reason}` : ''}
            </span>
          </li>
        ))}
      </ol>
    </div>
  )
}
