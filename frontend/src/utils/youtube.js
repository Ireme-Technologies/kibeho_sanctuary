/**
 * Extract a YouTube video ID from a URL or bare 11-char ID.
 */
export function parseYoutubeId(input = '') {
  const raw = String(input || '').trim()
  if (!raw) return ''
  if (/^[\w-]{11}$/.test(raw)) return raw
  try {
    const url = new URL(raw)
    if (url.hostname.includes('youtu.be')) return url.pathname.replace(/^\//, '').slice(0, 11)
    if (url.searchParams.get('v')) return url.searchParams.get('v')
    const embed = url.pathname.match(/\/embed\/([\w-]{11})/)
    if (embed) return embed[1]
  } catch {
    /* ignore */
  }
  const loose = raw.match(/(?:v=|\/)([\w-]{11})(?:\?|&|$)/)
  return loose?.[1] || ''
}

export function youtubeEmbedUrl(idOrUrl) {
  const id = parseYoutubeId(idOrUrl)
  return id ? `https://www.youtube.com/embed/${id}` : ''
}

export function youtubeWatchUrl(idOrUrl) {
  const id = parseYoutubeId(idOrUrl)
  return id ? `https://www.youtube.com/watch?v=${id}` : ''
}

export function youtubeThumbUrl(idOrUrl) {
  const id = parseYoutubeId(idOrUrl)
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : ''
}
