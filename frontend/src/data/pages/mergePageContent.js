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

/** Thin ToR placeholder copy — prefer the richer fallback until staff rewrite it. */
export function isPlaceholderCopy(value) {
  const text = String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return false
  return /interactive map of the Shrine grounds is planned|Detailed plans and project phases will be published|Annual reports of the Shrine and related development initiatives will be published|committed to transparent stewardship of gifts received for the Shrine/i.test(
    text
  )
}

export function mergePageContent(fallback = {}, live = {}) {
  const keys = new Set([...Object.keys(fallback || {}), ...Object.keys(live || {})])
  const out = { ...(fallback || {}) }
  const liveIntroPlaceholder = isPlaceholderCopy(live?.intro)
  keys.forEach((key) => {
    const liveVal = live?.[key]
    out[key] = isEmptyContentValue(liveVal) ? fallback?.[key] : liveVal
    if (key === 'intro' && liveIntroPlaceholder) {
      out[key] = fallback?.intro || liveVal
    }
    if (key === 'blocks' && liveIntroPlaceholder && !isEmptyContentValue(fallback?.blocks)) {
      out[key] = fallback.blocks
    }
    if (
      key === 'blocks' &&
      Array.isArray(fallback?.blocks) &&
      fallback.blocks.length > 1 &&
      Array.isArray(liveVal) &&
      liveVal.length === 1 &&
      liveVal[0]?.type === 'list'
    ) {
      out[key] = fallback.blocks
    }
  })
  return out
}

/** Live CMS for a page key, falling back to seeded copy and optional legacy keys. */
export function resolveSectionContent(sectionFn, key, extraKeys = []) {
  const legacy = extraKeys.reduce((acc, extra) => mergePageContent(sectionFn(extra, {}), acc), {})
  return mergePageContent(getPageFallback(key) || {}, mergePageContent(legacy, sectionFn(key, {})))
}
