const BRAND = 'Shrine of Our Lady of Kibeho'

export const DEFAULT_SEO = {
  title: `${BRAND} | Official Website`,
  description:
    'Official website of the Shrine of Our Lady of Kibeho — the first Marian apparition site in Africa recognised by the Catholic Church. Discover the message, prepare your pilgrimage, and support the Shrine.',
  image: '',
}

export function stripHtml(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function absoluteUrl(path) {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  return `${origin}${path.startsWith('/') ? path : `/${path}`}`
}

function upsertMeta(attr, key, content) {
  if (!content || typeof document === 'undefined') return
  const selector = `meta[${attr}="${key}"]`
  let node = document.head.querySelector(selector)
  if (!node) {
    node = document.createElement('meta')
    node.setAttribute(attr, key)
    document.head.appendChild(node)
  }
  node.setAttribute('content', content)
}

function upsertLink(rel, href) {
  if (!href || typeof document === 'undefined') return
  let node = document.head.querySelector(`link[rel="${rel}"]`)
  if (!node) {
    node = document.createElement('link')
    node.setAttribute('rel', rel)
    document.head.appendChild(node)
  }
  node.setAttribute('href', href)
}

export function applyPageSeo({ title, description, image, path } = {}) {
  const pageTitle = title
    ? title.includes(BRAND)
      ? title
      : `${title} | ${BRAND}`
    : DEFAULT_SEO.title
  const desc = stripHtml(description).slice(0, 220) || DEFAULT_SEO.description
  const img = absoluteUrl(image || DEFAULT_SEO.image)
  const url = absoluteUrl(path || (typeof window !== 'undefined' ? window.location.pathname : '/'))

  if (typeof document !== 'undefined') {
    document.title = pageTitle
    upsertMeta('name', 'description', desc)
    upsertMeta('property', 'og:title', pageTitle)
    upsertMeta('property', 'og:description', desc)
    upsertMeta('property', 'og:image', img)
    upsertMeta('property', 'og:type', 'website')
    upsertMeta('property', 'og:url', url)
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertLink('canonical', url)
  }

  return { title: pageTitle, description: desc }
}
