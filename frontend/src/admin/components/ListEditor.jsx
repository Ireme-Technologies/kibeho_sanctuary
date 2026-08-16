import { confirmDelete } from './confirmDelete'
import styles from '../admin.module.css'

/**
 * Simple repeater for arrays of objects with the same string fields.
 * fields: [{ key, label, placeholder?, type?, options? }]
 * Supports Up/Down reordering for menu and list management.
 */
export default function ListEditor({
  label,
  items = [],
  fields = [],
  onChange,
  addLabel = 'Add item',
  emptyItem,
  reorderable = true,
}) {
  const list = Array.isArray(items) ? items : []

  const updateRow = (index, key, value) => {
    const next = list.map((row, i) => (i === index ? { ...row, [key]: value } : row))
    onChange?.(next)
  }

  const removeRow = (index) => {
    onChange?.(list.filter((_, i) => i !== index))
  }

  const moveRow = (index, direction) => {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= list.length) return
    const next = [...list]
    ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
    onChange?.(next)
  }

  const addRow = () => {
    const blank =
      emptyItem ||
      fields.reduce((acc, field) => {
        acc[field.key] = ''
        return acc
      }, {})
    onChange?.([...list, { ...blank }])
  }

  return (
    <div className={styles.field}>
      <label>{label}</label>
      <div className={styles.listEditor}>
        {list.length === 0 && <p className={styles.muted}>No items yet.</p>}
        {list.map((row, index) => (
          <div key={index} className={styles.listEditorRow}>
            <div className={styles.listEditorFields}>
              {fields.map((field) => (
                <div key={field.key} className={styles.field}>
                  <label>{field.label}</label>
                  {field.type === 'select' ? (
                    <select
                      value={row[field.key] || ''}
                      onChange={(e) => updateRow(index, field.key, e.target.value)}
                    >
                      {(field.options || []).map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      rows={field.rows || 3}
                      value={row[field.key] || ''}
                      placeholder={field.placeholder || ''}
                      onChange={(e) => updateRow(index, field.key, e.target.value)}
                    />
                  ) : (
                    <input
                      value={row[field.key] || ''}
                      placeholder={field.placeholder || ''}
                      onChange={(e) => updateRow(index, field.key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className={styles.listEditorControls}>
              {reorderable && (
                <>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => moveRow(index, -1)}
                    disabled={index === 0}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => moveRow(index, 1)}
                    disabled={index === list.length - 1}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                </>
              )}
              <button
                type="button"
                className={`${styles.btn} ${styles.btnDanger}`}
                onClick={async () => {
                  if (!(await confirmDelete('Remove this item?', { confirmLabel: 'Remove' }))) return
                  removeRow(index)
                }}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={addRow}>
          {addLabel}
        </button>
      </div>
    </div>
  )
}
