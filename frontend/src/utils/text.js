export function stripHtml(html = '') {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim()
}

export function excerpt(html = '', max = 160) {
  const clean = stripHtml(html)
  if (!clean) return ''
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max).replace(/\s+\S*$/, '')
  return `${(cut || clean.slice(0, max)).replace(/[.,;: ]+$/, '')}…`
}

export function cardExcerpt(item, max = 160) {
  if (!item) return ''
  return excerpt(item.summary || item.description || item.shortDescription || item.text || '', max)
}

/** Turns a full name into up-to-2-character initials, e.g. "Isaac Byiringiro" -> "IB" */
export function getInitials(name = '') {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}