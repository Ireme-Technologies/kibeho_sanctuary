import { useMemo, useState } from 'react'
import { CUSTOM_FONT_VALUE, GOOGLE_FONT_OPTIONS } from '@utils/theme'
import styles from '../admin.module.css'

/**
 * Reliable font picker: native <select> for curated fonts + optional custom Google Font name.
 */
export default function FontPicker({ id, label, value, onChange, previewText, fallbackStack }) {
  const inList = GOOGLE_FONT_OPTIONS.includes(value)
  const [customMode, setCustomMode] = useState(!inList)
  const selectValue = customMode || !inList ? CUSTOM_FONT_VALUE : value

  const options = useMemo(() => GOOGLE_FONT_OPTIONS, [])

  return (
    <div className={styles.field}>
      <label htmlFor={id}>{label}</label>
      <select
        id={id}
        value={selectValue}
        onChange={(e) => {
          const next = e.target.value
          if (next === CUSTOM_FONT_VALUE) {
            setCustomMode(true)
            return
          }
          setCustomMode(false)
          onChange(next)
        }}
      >
        {options.map((font) => (
          <option key={font} value={font}>
            {font}
          </option>
        ))}
        <option value={CUSTOM_FONT_VALUE}>Custom Google Font…</option>
      </select>

      {(customMode || !inList) && (
        <input
          style={{ marginTop: '0.5rem' }}
          value={value}
          onChange={(e) => {
            setCustomMode(true)
            onChange(e.target.value)
          }}
          placeholder="Exact Google Font family name"
          aria-label={`${label} custom name`}
        />
      )}

      <div className={styles.fontPreview} style={{ fontFamily: `'${value}', ${fallbackStack}` }}>
        {previewText}
      </div>
      <p className={styles.muted} style={{ marginTop: '0.35rem', marginBottom: 0 }}>
        Select a font from the list (recommended). Preview updates immediately; click Save settings to
        publish.
      </p>
    </div>
  )
}
