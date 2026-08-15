import styles from '../admin.module.css'

export default function ListTitle({ title, subtitle, onEdit, onDelete, viewHref }) {
  return (
    <div>
      {onEdit ? (
        <button type="button" className={styles.rowTitle} onClick={onEdit}>
          {title || 'Untitled'}
        </button>
      ) : (
        <strong>{title || 'Untitled'}</strong>
      )}
      {subtitle ? <div className={styles.muted}>{subtitle}</div> : null}
      <div className={styles.rowActions}>
        {onEdit ? (
          <button type="button" onClick={onEdit}>
            Edit
          </button>
        ) : null}
        {viewHref ? (
          <a href={viewHref} target="_blank" rel="noreferrer">
            View
          </a>
        ) : null}
        {onDelete ? (
          <button type="button" className={styles.rowActionDanger} onClick={onDelete}>
            Delete
          </button>
        ) : null}
      </div>
    </div>
  )
}
