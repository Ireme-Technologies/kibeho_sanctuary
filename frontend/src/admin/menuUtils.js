export function createNavId() {
  return `nav-${Math.random().toString(36).slice(2, 10)}`
}

export function ensureNavIds(items) {
  return (Array.isArray(items) ? items : []).map((item) => ({
    label: item.label || '',
    path: item.path || '',
    translations: item.translations && typeof item.translations === 'object' ? item.translations : {},
    _id: item._id || createNavId(),
    children: ensureNavIds(item.children || []),
  }))
}

export function persistNavItem(item) {
  const translations = item.translations && typeof item.translations === 'object' ? item.translations : null
  const children = Array.isArray(item.children)
    ? item.children
        .filter((child) => child.label || child.path || child.translations)
        .map((child) => persistNavItem(child))
    : []
  return {
    label: item.label || '',
    path: item.path || '',
    ...(translations && Object.keys(translations).length ? { translations } : {}),
    ...(children.length ? { children } : {}),
  }
}

export function persistNavItems(items) {
  return (items || [])
    .filter((item) => item.label || item.path || item.translations)
    .map((item) => persistNavItem(item))
}

export function navLabelForLocale(item, locale, defaultLocale) {
  if (locale === defaultLocale) return item.label || ''
  return item.translations?.[locale]?.label ?? ''
}

export function setNavLabelForLocale(item, locale, value, defaultLocale) {
  if (locale === defaultLocale) return { ...item, label: value }
  const translations = { ...(item.translations || {}) }
  const trimmed = String(value || '').trim()
  if (!trimmed) {
    const next = { ...(translations[locale] || {}) }
    delete next.label
    if (!Object.keys(next).length) delete translations[locale]
    else translations[locale] = next
    return { ...item, translations }
  }
  return {
    ...item,
    translations: {
      ...translations,
      [locale]: { ...(translations[locale] || {}), label: trimmed },
    },
  }
}

export function findNavNode(items, id) {
  for (const item of items || []) {
    if (item._id === id) return item
    const nested = findNavNode(item.children, id)
    if (nested) return nested
  }
  return null
}

export function depthOfNavNode(items, id, depth = 0) {
  for (const item of items || []) {
    if (item._id === id) return depth
    const nested = depthOfNavNode(item.children || [], id, depth + 1)
    if (nested >= 0) return nested
  }
  return -1
}

function isAncestorOf(items, ancestorId, nodeId) {
  const ancestor = findNavNode(items, ancestorId)
  return Boolean(findNavNode(ancestor?.children || [], nodeId))
}

function removeNavNode(items, id) {
  const next = []
  let removed = null
  for (const item of items || []) {
    if (item._id === id) {
      removed = item
      continue
    }
    const copy = { ...item, children: Array.isArray(item.children) ? [...item.children] : [] }
    if (copy.children.length) {
      const result = removeNavNode(copy.children, id)
      copy.children = result.items
      if (result.removed) removed = result.removed
    }
    next.push(copy)
  }
  return { items: next, removed }
}

function insertNavNode(items, targetId, where, node) {
  const next = []
  let inserted = false
  for (const item of items || []) {
    const copy = { ...item, children: Array.isArray(item.children) ? [...item.children] : [] }
    if (copy._id === targetId && !inserted) {
      if (where === 'before') {
        next.push(node)
        next.push(copy)
        inserted = true
        continue
      }
      if (where === 'after') {
        next.push(copy)
        next.push(node)
        inserted = true
        continue
      }
      if (where === 'inside') {
        copy.children = [...copy.children, node]
        next.push(copy)
        inserted = true
        continue
      }
    }
    if (!inserted && copy.children.length) {
      const result = insertNavNode(copy.children, targetId, where, node)
      copy.children = result.items
      inserted = result.inserted
    }
    next.push(copy)
  }
  return { items: next, inserted }
}

export function moveNavNode(items, sourceId, targetId, where, allowInside = true) {
  if (!sourceId || !targetId || sourceId === targetId) return items
  if (isAncestorOf(items, sourceId, targetId)) return items
  if (where === 'inside' && !allowInside) return items

  const { items: without, removed } = removeNavNode(items, sourceId)
  if (!removed) return items

  const targetDepth = depthOfNavNode(without, targetId)
  const willBeChild = where === 'inside' || targetDepth > 0
  let node = { ...removed, children: Array.isArray(removed.children) ? [...removed.children] : [] }
  let lift = []
  if (willBeChild && node.children.length) {
    lift = node.children
    node = { ...node, children: [] }
  }

  const placed = insertNavNode(without, targetId, where, node)
  if (!placed.inserted) return items

  let result = placed.items
  let afterId = node._id
  for (const child of lift) {
    const extra = { ...child, children: [] }
    const nested = insertNavNode(result, afterId, 'after', extra)
    if (!nested.inserted) break
    result = nested.items
    afterId = extra._id
  }
  return result
}

export function deleteNavNode(items, id) {
  return removeNavNode(items, id).items
}

export function moveNavSibling(items, id, direction) {
  const index = (items || []).findIndex((item) => item._id === id)
  if (index >= 0) {
    const nextIndex = index + direction
    if (nextIndex < 0 || nextIndex >= items.length) return items
    const next = [...items]
    ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
    return next
  }
  return (items || []).map((item) => ({
    ...item,
    children: moveNavSibling(item.children || [], id, direction),
  }))
}

export function updateNavNode(items, id, patch) {
  return (items || []).map((item) => {
    if (item._id === id) return { ...item, ...patch }
    return { ...item, children: updateNavNode(item.children || [], id, patch) }
  })
}

export function addNavItem(items, { label, path, parentId, afterId, translations }) {
  const node = {
    _id: createNavId(),
    label: label || '',
    path: path || '',
    children: [],
    translations: translations && typeof translations === 'object' ? translations : {},
  }
  if (parentId) {
    return (items || []).map((item) => {
      if (item._id !== parentId) return item
      const children = [...(item.children || [])]
      if (afterId) {
        const index = children.findIndex((child) => child._id === afterId)
        if (index >= 0) {
          children.splice(index + 1, 0, node)
          return { ...item, children }
        }
      }
      return { ...item, children: [...children, node] }
    })
  }
  if (afterId) {
    const placed = insertNavNode(items || [], afterId, 'after', node)
    if (placed.inserted) return placed.items
  }
  return [...(items || []), node]
}

export function flattenNav(items, parentId = null, depth = 0) {
  const rows = []
  ;(items || []).forEach((item, index) => {
    rows.push({ item, parentId, depth, index, siblingCount: items.length })
    if (item.children?.length) {
      rows.push(...flattenNav(item.children, item._id, depth + 1))
    }
  })
  return rows
}
