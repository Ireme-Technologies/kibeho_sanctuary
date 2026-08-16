import { useState } from 'react'
import { GripVertical } from 'lucide-react'
import {
  addNavItem,
  deleteNavNode,
  findNavNode,
  flattenNav,
  moveNavNode,
  moveNavSibling,
  navLabelForLocale,
  setNavLabelForLocale,
  updateNavNode,
} from '../menuUtils'
import {
  isKnownMenuPath,
  pageLabel,
  pathPatchForPage,
  suggestPathFromLabel,
} from '../menuPages'
import { confirmDelete } from './confirmDelete'
import MenuPathFields from './MenuPathFields'
import styles from '../admin.module.css'

const emptyAdd = {
  label: '',
  path: '',
  pathTouched: false,
  placement: 'top',
  parentId: '',
}

export default function MenuTreeEditor({
  items = [],
  onChange,
  allowChildren = false,
  locale,
  defaultLocale = 'en',
  addTitle = 'Add a menu item',
  emptyText = 'No items yet. Add the first one on the left.',
  pathPlaceholder = '/page-path',
}) {
  const [add, setAdd] = useState(emptyAdd)
  const [addKey, setAddKey] = useState(0)
  const [draggingId, setDraggingId] = useState(null)
  const [hint, setHint] = useState(null)
  const list = Array.isArray(items) ? items : []
  const rows = flattenNav(list)
  const parents = list.filter((item) => item._id)
  const isDefault = locale === defaultLocale
  const dragging = findNavNode(list, draggingId)

  const setItems = (next) => onChange?.(next)

  const handleAddPath = (nextPath) => {
    setAdd((current) => {
      const known = isKnownMenuPath(nextPath)
      const autoDefault = pageLabel(nextPath, defaultLocale)
      const autoLocale = pageLabel(nextPath, locale)
      let label = current.label
      if (known) {
        label = isDefault ? autoDefault || current.label : autoLocale || current.label
      }
      return {
        ...current,
        path: nextPath,
        pathTouched: known ? false : Boolean(nextPath) && !known,
        label,
      }
    })
  }

  const handleAddLabel = (value) => {
    setAdd((current) => {
      const next = { ...current, label: value }
      if (!isKnownMenuPath(current.path) && !current.pathTouched) {
        next.path = suggestPathFromLabel(value)
      }
      return next
    })
  }

  const handleAdd = (event) => {
    event.preventDefault()
    const path = add.path.trim() || suggestPathFromLabel(add.label)
    if (!path) return
    const autoDefault = pageLabel(path, defaultLocale)
    const autoLocale = pageLabel(path, locale)
    const typed = add.label.trim()
    const storedLabel = isDefault ? typed || autoDefault : autoDefault || typed
    if (!storedLabel) return

    const translations = {}
    if (!isDefault && typed && typed !== autoLocale) {
      translations[locale] = { label: typed }
    }

    if (add.placement === 'sub' && allowChildren) {
      if (!add.parentId) return
      setItems(addNavItem(list, { label: storedLabel, path, parentId: add.parentId, translations }))
    } else {
      setItems(addNavItem(list, { label: storedLabel, path, translations }))
    }
    setAdd(emptyAdd)
    setAddKey((value) => value + 1)
  }

  const handleDragOver = (event, row) => {
    event.preventDefault()
    if (!draggingId || draggingId === row.item._id) return
    const rect = event.currentTarget.getBoundingClientRect()
    const y = (event.clientY - rect.top) / Math.max(rect.height, 1)
    const canNest =
      allowChildren &&
      row.depth === 0 &&
      !(dragging?.children || []).length &&
      draggingId !== row.item._id
    let where = y < 0.5 ? 'before' : 'after'
    if (canNest && y >= 0.28 && y <= 0.72) where = 'inside'
    setHint({ id: row.item._id, where })
  }

  const handleDrop = (event, row) => {
    event.preventDefault()
    const sourceId = event.dataTransfer.getData('text/plain') || draggingId
    const where = hint?.id === row.item._id ? hint.where : 'after'
    if (sourceId) setItems(moveNavNode(list, sourceId, row.item._id, where, allowChildren))
    setDraggingId(null)
    setHint(null)
  }

  const canAdd = Boolean(add.path.trim() || add.label.trim())
  const placementName = `placement-${String(addTitle).replace(/\s+/g, '-').toLowerCase()}`

  return (
    <div className={styles.menuEditor}>
      <form className={styles.menuAddCard} onSubmit={handleAdd}>
        <h3>{addTitle}</h3>
        <p className={styles.muted}>
          {allowChildren
            ? 'Pick a page from the list. The URL is filled for every language. Then choose top-level or a submenu.'
            : 'Pick a page from the list. The URL is filled for every language. Drag items on the right to reorder.'}
        </p>
        <MenuPathFields key={addKey} path={add.path} onChange={handleAddPath} placeholder={pathPlaceholder} />
        <div className={styles.field}>
          <label>{isDefault ? 'Label' : 'Label (optional override)'}</label>
          <input
            value={add.label}
            onChange={(e) => handleAddLabel(e.target.value)}
            placeholder={isDefault ? 'Filled from the page' : pageLabel(add.path, locale) || 'Automatic translation'}
          />
        </div>
        {allowChildren ? (
          <fieldset className={styles.menuPlacement}>
            <legend>This item is</legend>
            <label className={styles.menuRadio}>
              <input
                type="radio"
                name={placementName}
                checked={add.placement === 'top'}
                onChange={() => setAdd({ ...add, placement: 'top', parentId: '' })}
              />
              Top-level in this menu
            </label>
            <label className={styles.menuRadio}>
              <input
                type="radio"
                name={placementName}
                checked={add.placement === 'sub'}
                onChange={() =>
                  setAdd({
                    ...add,
                    placement: 'sub',
                    parentId: add.parentId || parents[0]?._id || '',
                  })
                }
                disabled={!parents.length}
              />
              Submenu under a parent
            </label>
            {add.placement === 'sub' ? (
              <div className={styles.field}>
                <label>Parent menu</label>
                <select
                  value={add.parentId}
                  onChange={(e) => setAdd({ ...add, parentId: e.target.value })}
                  required
                >
                  <option value="">Select a parent…</option>
                  {parents.map((item) => (
                    <option key={item._id} value={item._id}>
                      {navLabelForLocale(item, locale, defaultLocale) ||
                        pageLabel(item.path, locale) ||
                        item.label ||
                        item.path}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </fieldset>
        ) : (
          <p className={styles.muted}>This location is a single list — new items are added at the end. Drag to reorder.</p>
        )}
        <button className={styles.btn} type="submit" disabled={!canAdd}>
          Add to menu
        </button>
      </form>

      <div className={styles.menuTreeCard}>
        <h3>Menu structure</h3>
        <p className={styles.muted}>
          Drag the handle to move items
          {allowChildren ? '. Drop on the middle of a top-level item to nest it as a submenu.' : '.'} Arrow buttons also work.
        </p>
        {!rows.length ? <p className={styles.muted}>{emptyText}</p> : null}
        <div className={styles.menuTree} onDragOver={(event) => event.preventDefault()}>
          {rows.map((row) => {
            const autoLabel = pageLabel(row.item.path, locale) || row.item.label || ''
            const stored = navLabelForLocale(row.item, locale, defaultLocale)
            const displayLabel = stored || autoLabel
            const usingAuto = !isDefault && !String(stored || '').trim() && Boolean(autoLabel)
            const drop = hint?.id === row.item._id ? hint.where : null
            return (
              <div
                key={row.item._id}
                className={[
                  styles.menuRow,
                  row.depth ? styles.menuRowChild : '',
                  draggingId === row.item._id ? styles.menuRowDragging : '',
                  drop === 'before' ? styles.menuRowDropBefore : '',
                  drop === 'after' ? styles.menuRowDropAfter : '',
                  drop === 'inside' ? styles.menuRowDropInside : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onDragOver={(event) => handleDragOver(event, row)}
                onDrop={(event) => handleDrop(event, row)}
              >
                <span
                  className={styles.menuDragHandle}
                  draggable
                  aria-label="Drag to reorder"
                  onDragStart={(event) => {
                    event.dataTransfer.effectAllowed = 'move'
                    event.dataTransfer.setData('text/plain', row.item._id)
                    setDraggingId(row.item._id)
                  }}
                  onDragEnd={() => {
                    setDraggingId(null)
                    setHint(null)
                  }}
                >
                  <GripVertical size={16} aria-hidden="true" />
                </span>
                <div className={styles.menuRowFields}>
                  <div className={styles.field}>
                    <label>{isDefault ? 'Label' : 'Label'}</label>
                    <input
                      value={displayLabel}
                      placeholder={isDefault ? '' : autoLabel || row.item.label || ''}
                      onChange={(e) => {
                        const next = e.target.value
                        const save = !isDefault && next.trim() === String(autoLabel).trim() ? '' : next
                        setItems(
                          updateNavNode(
                            list,
                            row.item._id,
                            setNavLabelForLocale(row.item, locale, save, defaultLocale),
                          ),
                        )
                      }}
                    />
                    {usingAuto ? (
                      <p className={styles.menuHint}>Automatic translation. Type here only to correct it.</p>
                    ) : !isDefault && stored ? (
                      <button
                        type="button"
                        className={styles.menuResetLink}
                        onClick={() =>
                          setItems(
                            updateNavNode(
                              list,
                              row.item._id,
                              setNavLabelForLocale(row.item, locale, '', defaultLocale),
                            ),
                          )
                        }
                      >
                        Use automatic label
                      </button>
                    ) : null}
                  </div>
                  <MenuPathFields
                    path={row.item.path}
                    placeholder={pathPlaceholder}
                    onChange={(nextPath) =>
                      setItems(updateNavNode(list, row.item._id, pathPatchForPage(row.item, nextPath, defaultLocale)))
                    }
                  />
                  {row.depth ? <p className={styles.menuBadge}>Submenu</p> : null}
                </div>
                <div className={styles.menuRowActions}>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => setItems(moveNavSibling(list, row.item._id, -1))}
                    disabled={row.index === 0}
                    aria-label="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnSecondary}`}
                    onClick={() => setItems(moveNavSibling(list, row.item._id, 1))}
                    disabled={row.index === row.siblingCount - 1}
                    aria-label="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className={`${styles.btn} ${styles.btnDanger}`}
                    onClick={async () => {
                      if (!(await confirmDelete('Remove this menu item?', { confirmLabel: 'Remove' }))) return
                      setItems(deleteNavNode(list, row.item._id))
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
