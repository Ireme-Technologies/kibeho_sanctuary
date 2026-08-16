import { useState } from 'react'
import { CUSTOM_PAGE, groupedMenuPages, isKnownMenuPath, pageLabel } from '../menuPages'
import styles from '../admin.module.css'

export default function MenuPathFields({
  path = '',
  onChange,
  label = 'Page',
  placeholder = '/page-path',
  showUrlHint = true,
}) {
  const groups = groupedMenuPages()
  const known = isKnownMenuPath(path)
  const [customMode, setCustomMode] = useState(!known && Boolean(path))
  const showCustom = customMode || (!known && Boolean(path))
  const selectValue = showCustom ? CUSTOM_PAGE : known ? path : ''

  return (
    <div className={styles.menuPathFields}>
      <div className={styles.field}>
        <label>{label}</label>
        <select
          value={selectValue}
          onChange={(event) => {
            const next = event.target.value
            if (!next) {
              setCustomMode(false)
              onChange?.('')
              return
            }
            if (next === CUSTOM_PAGE) {
              setCustomMode(true)
              onChange?.(path || '')
              return
            }
            setCustomMode(false)
            onChange?.(next)
          }}
        >
          <option value="">Choose a page…</option>
          <option value={CUSTOM_PAGE}>Custom URL…</option>
          {groups.map((group) => (
            <optgroup key={group.label} label={group.label}>
              {group.pages.map((page) => (
                <option key={page.path} value={page.path}>
                  {pageLabel(page.path, 'en')} — {page.path}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>
      {showCustom ? (
        <div className={styles.field}>
          <label>Custom URL</label>
          <input
            value={path}
            onChange={(event) => onChange?.(event.target.value)}
            placeholder={placeholder}
          />
          <p className={styles.menuHint}>
            Use this only for a page that is not in the list, or for an external link. The same URL is used in
            every language.
          </p>
        </div>
      ) : path && showUrlHint ? (
        <p className={styles.menuPathMeta}>
          URL: <code>{path}</code>
          <span> · same in every language</span>
        </p>
      ) : null}
    </div>
  )
}
