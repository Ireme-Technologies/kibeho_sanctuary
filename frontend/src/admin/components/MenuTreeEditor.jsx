import { useState } from 'react'
import { GripVertical } from 'lucide-react'
import { t as uiTranslate } from '@i18n/locales'
import { navKeyForPath } from '@i18n/navKeys'
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
import { confirmDelete } from './confirmDelete'
import styles from '../admin.module.css'

const emptyAdd = {
  label: '',
  path: '',
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
  const [draggingId, setDraggingId] = useState(null)
  const [hint, setHint] = useState(null)
  const list = Array.isArray(items) ? items : []
  const rows = flattenNav(list)
  const parents = list.filter((item) => item._id)
  const isDefault = locale === defaultLocale
  const dragging = findNavNode(list, draggingId)

  const setItems = (next) => onChange?.(next)

  const handleAdd = (event) => {
    event.preventDefault()
    const label = add.label.trim()
    const path = add.path.trim()
    if (!label) return
    if (add.placement === 'sub' && allowChildren) {
      if (!add.parentId) return
      setItems(addNavItem(list, { label, path, parentId: add.parentId }))
    } else {
      setItems(addNavItem(list, { label, path }))
    }
    setAdd(emptyAdd)
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

  return (
    <div className={styles.menuEditor}>
      <form className={styles.menuAddCard} onSubmit={handleAdd}>
        <h3>{addTitle}</h3>
        <p className={styles.muted}>
          {allowChildren
            ? 'Choose whether this is a top-level item or a submenu, then pick which parent it belongs under.'
            : 'Enter a label and path, then add it to this list. Drag items on the right to reorder.'}
        </p>
        <div className={styles.field}>
          <label>Label</label>
          <input
            value={add.label}
            onChange={(e) => setAdd({ ...add, label: e.target.value })}
            placeholder="Menu label"
            required
          />
        </div>
        <div className={styles.field}>
          <label>Path</label>
          <input
            value={add.path}
            onChange={(e) => setAdd({ ...add, path: e.target.value })}
            placeholder={pathPlaceholder}
          />
        </div>
        {allowChildren ? (
          <fieldset className={styles.menuPlacement}>
            <legend>This item is</legend>
            <label className={styles.menuRadio}>
              <input
                type="radio"
                name="placement"
                checked={add.placement === 'top'}
                onChange={() => setAdd({ ...add, placement: 'top', parentId: '' })}
              />
              Top-level in this menu
            </label>
            <label className={styles.menuRadio}>
              <input
                type="radio"
                name="placement"
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
                      {navLabelForLocale(item, locale, defaultLocale) || item.label || item.path}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </fieldset>
        ) : (
          <p className={styles.muted}>This location is a single list — new items are added at the end. Drag to reorder.</p>
        )}
        <button className={styles.btn} type="submit" disabled={!add.label.trim()}>
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
            const autoLabel =
              !isDefault && navKeyForPath(row.item.path)
                ? uiTranslate(locale, navKeyForPath(row.item.path))
                : ''
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
                    <label>Label</label>
                    <input
                      value={navLabelForLocale(row.item, locale, defaultLocale)}
                      placeholder={isDefault ? '' : autoLabel || row.item.label || ''}
                      onChange={(e) =>
                        setItems(
                          updateNavNode(
                            list,
                            row.item._id,
                            setNavLabelForLocale(row.item, locale, e.target.value, defaultLocale),
                          ),
                        )
                      }
                    />
                  </div>
                  {isDefault ? (
                    <div className={styles.field}>
                      <label>Path</label>
                      <input
                        value={row.item.path}
                        placeholder={pathPlaceholder}
                        onChange={(e) =>
                          setItems(updateNavNode(list, row.item._id, { path: e.target.value }))
                        }
                      />
                    </div>
                  ) : null}
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
