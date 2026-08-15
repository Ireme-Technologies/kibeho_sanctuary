/**
 * Sibling pages for the current pillar (Support, Shrine, …), from primary nav.
 * Used so visitors can move between items without returning to the hub.
 */
export function getSectionNav(pathname, primaryNav = []) {
  const current = normalizePath(pathname)
  if (!current || current === '/') return null

  const items = Array.isArray(primaryNav) ? primaryNav : []

  for (const item of items) {
    const children = (Array.isArray(item.children) ? item.children : []).filter((child) => child?.path)
    if (!children.length) continue

    const hubPath = hubPathFor(item)
    const onHub = current === hubPath
    const onChild = children.some((child) => pathMatches(current, child.path))

    if (!onHub && !onChild) continue
    if (onHub) return null

    const links = []
    const seen = new Set()
    const push = (label, path) => {
      const key = String(path).split('?')[0]
      if (!key || seen.has(key)) return
      seen.add(key)
      links.push({ label: label || key, path })
    }

    push(item.label || 'Overview', hubPath)
    children.forEach((child) => push(child.label, child.path))

    if (links.length < 2) return null

    return {
      label: item.label || '',
      hubPath,
      current,
      links,
    }
  }

  return null
}

export function sectionLinkIsActive(currentPath, linkPath, hubPath) {
  const current = normalizePath(currentPath)
  const link = normalizePath(String(linkPath || '').split('?')[0])
  if (!current || !link) return false
  if (link === hubPath) return current === hubPath
  return current === link || current.startsWith(`${link}/`)
}

function hubPathFor(item) {
  if (item.path === '/' || !item.path) return '/our-lady'
  return normalizePath(item.path)
}

function pathMatches(current, rawPath) {
  const path = normalizePath(String(rawPath || '').split('?')[0])
  if (!path || path === '/') return false
  return current === path || current.startsWith(`${path}/`)
}

function normalizePath(pathname) {
  const value = String(pathname || '').trim()
  if (!value) return '/'
  const trimmed = value.replace(/\/+$/, '')
  return trimmed || '/'
}
