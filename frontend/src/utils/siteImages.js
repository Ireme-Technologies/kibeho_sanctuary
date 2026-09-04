/** Bundled seed photo of the shrine (blue roof). Not a CMS choice unless replaced. */
const LEGACY_HERO_PATH = 'images/sanctuary/hero.jpg'

export function normalizeAssetPath(url) {
  const raw = String(url || '').trim()
  if (!raw || raw === 'undefined' || raw === 'null') return ''

  let path = raw.split('?')[0].split('#')[0].replace(/\\/g, '/')
  try {
    if (/^https?:\/\//i.test(path)) {
      path = new URL(path).pathname
    }
  } catch {
    return ''
  }

  return path.replace(/^\/+/, '')
}

export function parseRemovedAssetSet(settings) {
  const raw = settings?.site_removed_assets
  const list = Array.isArray(raw?.paths) ? raw.paths : Array.isArray(raw) ? raw : []
  return new Set(list.map((item) => normalizeAssetPath(item)).filter(Boolean))
}

function isRemovedPath(path, removedSet) {
  if (!path) return true
  if (removedSet.has(path)) return true
  for (const removed of removedSet) {
    if (!removed) continue
    if (path === removed || path.endsWith(`/${removed}`) || removed.endsWith(`/${path}`)) {
      return true
    }
  }
  return false
}

function isLegacyBundledHero(url) {
  const raw = String(url || '').trim()
  if (normalizeAssetPath(raw) !== LEGACY_HERO_PATH) return false
  return !/[?&]v=/.test(raw)
}

export function firstUsableImage(candidates, removedSet = new Set()) {
  for (const url of candidates) {
    const raw = String(url || '').trim()
    if (!raw) continue
    const path = normalizeAssetPath(raw)
    if (!path) continue
    if (isLegacyBundledHero(raw)) continue
    if (isRemovedPath(path, removedSet)) continue
    return raw
  }
  return ''
}
