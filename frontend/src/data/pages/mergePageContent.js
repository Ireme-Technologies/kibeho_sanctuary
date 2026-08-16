import { getPageFallback } from './content'

/** Treat empty CMS values as missing so seeded/public defaults stay visible. */
export function isEmptyContentValue(value) {
  if (value == null) return true
  if (typeof value === 'string') {
    return value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').trim() === ''
  }
  if (Array.isArray(value)) return value.length === 0
  if (typeof value === 'object') {
    const keys = Object.keys(value)
    if (!keys.length) return true
    return keys.every((key) => isEmptyContentValue(value[key]))
  }
  return false
}

export function mergePageContent(fallback = {}, live = {}) {
  const keys = new Set([...Object.keys(fallback || {}), ...Object.keys(live || {})])
  const out = { ...(fallback || {}) }
  keys.forEach((key) => {
    const liveVal = live?.[key]
    out[key] = isEmptyContentValue(liveVal) ? fallback?.[key] : liveVal
  })
  return out
}

/** Live CMS for a page key, falling back to seeded copy and optional legacy keys. */
export function resolveSectionContent(sectionFn, key, extraKeys = []) {
  const legacy = extraKeys.reduce((acc, extra) => mergePageContent(sectionFn(extra, {}), acc), {})
  return mergePageContent(getPageFallback(key) || {}, mergePageContent(legacy, sectionFn(key, {})))
}
