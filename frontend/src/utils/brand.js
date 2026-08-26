export const DEFAULT_LOGO = '/images/logo/logo-transparent.png'
export const DEFAULT_FAVICON = '/images/logo/favicon.svg'
export const PRELOADER_NAME = 'Shrine of Our Lady of Kibeho'
export const PRELOADER_TAG = 'Diocese of Gikongoro'

export function isStaleBrandAsset(value) {
  return /rvg|royal\s*ventures/i.test(String(value || ''))
}

export function resolveLogo(company) {
  const logo = company?.logo
  if (!logo || isStaleBrandAsset(logo)) return DEFAULT_LOGO
  return logo
}

export function resolveFavicon(company) {
  const fav = company?.favicon || company?.logo
  if (!fav || isStaleBrandAsset(fav)) return DEFAULT_FAVICON
  return fav
}

export function resolvePreloaderLogo(company) {
  const src = company?.preloaderLogo || company?.logo
  if (!src || isStaleBrandAsset(src)) return DEFAULT_LOGO
  return src
}

export function applyFavicon(href) {
  const url = href || DEFAULT_FAVICON
  const isSvg = /\.svg(\?|$)/i.test(url)
  const ensure = (rel) => {
    let link = document.querySelector(`link[rel="${rel}"]`)
    if (!link) {
      link = document.createElement('link')
      link.rel = rel
      document.head.appendChild(link)
    }
    if (rel === 'icon') {
      link.type = isSvg ? 'image/svg+xml' : 'image/png'
    }
    link.href = url
  }
  ensure('icon')
  ensure('apple-touch-icon')
}
