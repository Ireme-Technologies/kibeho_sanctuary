import { useState } from 'react'
import { lodgingLabel } from '@data/lodgingCatalog'
import styles from '../admin.module.css'

export default function OptionChecklist({
  label,
  hint,
  options = [],
  value = [],
  onChange,
  allowCustom = false,
  customPlaceholder = 'Add another…',
}) {
  const selected = Array.isArray(value) ? value : []
  const [custom, setCustom] = useState('')
  const extras = selected
    .filter((id) => !options.some((item) => item.id === id))
    .map((id) => ({ id, label: lodgingLabel(id, options) }))
  const list = [...options, ...extras]

  const toggle = (id) => {
    if (selected.includes(id)) onChange?.(selected.filter((item) => item !== id))
    else onChange?.([...selected, id])
  }

  const addCustom = () => {
    const labelText = custom.trim()
    if (!labelText) return
    const id = labelText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    if (!id) return
    if (!selected.includes(id)) onChange?.([...selected, id])
    setCustom('')
  }

  return (
    <div className={styles.field}>
      {label ? <label>{label}</label> : null}
      {hint ? <p className={styles.muted}>{hint}</p> : null}
      <div className={styles.optionChecklist}>
        {list.map((item) => (
          <label key={item.id} className={styles.optionCheck}>
            <input
              type="checkbox"
              checked={selected.includes(item.id)}
              onChange={() => toggle(item.id)}
            />
            <span>{item.label}</span>
          </label>
        ))}
      </div>
      {allowCustom ? (
        <div className={styles.optionCustomRow}>
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            placeholder={customPlaceholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addCustom()
              }
            }}
          />
          <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={addCustom}>
            Add
          </button>
        </div>
      ) : null}
    </div>
  )
}
