/**
 * Site theme defaults and Google Font helpers.
 */

export const DEFAULT_THEME = {
  primaryColor: '#1a365d',
  secondaryColor: '#4aa3e0',
  headingFont: 'Libre Baskerville',
  bodyFont: 'Source Sans 3',
}

/** Curated Google Fonts for the font pickers (admin can still type any family). */
export const GOOGLE_FONT_OPTIONS = [
  'Libre Baskerville',
  'Source Sans 3',
  'Playfair Display',
  'Lora',
  'Merriweather',
  'Cormorant Garamond',
  'EB Garamond',
  'Crimson Pro',
  'Inter',
  'Roboto',
  'Open Sans',
  'Nunito Sans',
  'Lato',
  'Montserrat',
  'Poppins',
  'Raleway',
  'DM Sans',
  'Work Sans',
  'Josefin Sans',
  'PT Serif',
]

export function normalizeTheme(raw = {}) {
  return {
    primaryColor: sanitizeHex(raw.primaryColor, DEFAULT_THEME.primaryColor),
    secondaryColor: sanitizeHex(raw.secondaryColor, DEFAULT_THEME.secondaryColor),
    headingFont: String(raw.headingFont || DEFAULT_THEME.headingFont).trim() || DEFAULT_THEME.headingFont,
    bodyFont: String(raw.bodyFont || DEFAULT_THEME.bodyFont).trim() || DEFAULT_THEME.bodyFont,
  }
}

function sanitizeHex(value, fallback) {
  const raw = String(value || '').trim()
  if (/^#([0-9a-fA-F]{6})$/.test(raw)) return raw.toLowerCase()
  if (/^#([0-9a-fA-F]{3})$/.test(raw)) {
    const [, a, b, c] = raw.match(/^#(.)(.)(.)$/)
    return `#${a}${a}${b}${b}${c}${c}`.toLowerCase()
  }
  return fallback
}

/** Build a Google Fonts CSS2 URL for one or more family names. */
export function googleFontsHref(fonts = []) {
  const unique = [...new Set(fonts.map((f) => String(f || '').trim()).filter(Boolean))]
  if (!unique.length) return ''
  const families = unique
    .map((name) => {
      const encoded = name.replace(/\s+/g, '+')
      // Load common weights for headings/body
      return `family=${encoded}:ital,wght@0,400;0,500;0,600;0,700;1,400`
    })
    .join('&')
  return `https://fonts.googleapis.com/css2?${families}&display=swap`
}

export function applyThemeToDocument(themeInput) {
  if (typeof document === 'undefined') return
  const theme = normalizeTheme(themeInput)
  const root = document.documentElement

  root.style.setProperty('--color-navy', theme.primaryColor)
  root.style.setProperty('--color-navy-deep', shadeColor(theme.primaryColor, -18))
  root.style.setProperty('--color-navy-soft', shadeColor(theme.primaryColor, 10))
  root.style.setProperty('--color-sky', theme.secondaryColor)
  root.style.setProperty('--color-sky-light', shadeColor(theme.secondaryColor, 18))
  root.style.setProperty('--color-sky-soft', softTint(theme.secondaryColor, 0.12))
  root.style.setProperty('--color-gold', theme.secondaryColor)
  root.style.setProperty('--color-gold-light', shadeColor(theme.secondaryColor, 18))
  root.style.setProperty('--color-gold-dark', theme.primaryColor)
  root.style.setProperty('--font-heading', `'${theme.headingFont}', Georgia, 'Times New Roman', serif`)
  root.style.setProperty('--font-body', `'${theme.bodyFont}', 'Segoe UI', sans-serif`)

  // Keep admin chrome in sync when browsing /admin
  root.style.setProperty('--admin-primary', theme.primaryColor)
  root.style.setProperty('--admin-primary-deep', shadeColor(theme.primaryColor, -18))
  root.style.setProperty('--admin-accent', theme.secondaryColor)
  root.style.setProperty('--admin-accent-soft', shadeColor(theme.secondaryColor, 18))
  root.style.setProperty('--admin-font', `'${theme.bodyFont}', 'Segoe UI', sans-serif`)

  ensureGoogleFonts(theme.headingFont, theme.bodyFont)
}

const FONT_LINK_ID = 'site-theme-google-fonts'

function ensureGoogleFonts(...fonts) {
  const href = googleFontsHref(fonts)
  if (!href) return
  let link = document.getElementById(FONT_LINK_ID)
  if (!link) {
    link = document.createElement('link')
    link.id = FONT_LINK_ID
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  if (link.href !== href) link.href = href
}

/** Mix hex toward white (positive) or black (negative). amount is roughly -100..100 */
function shadeColor(hex, amount) {
  const { r, g, b } = hexToRgb(hex)
  const t = amount < 0 ? 0 : 255
  const p = Math.min(100, Math.abs(amount)) / 100
  const nr = Math.round((t - r) * p + r)
  const ng = Math.round((t - g) * p + g)
  const nb = Math.round((t - b) * p + b)
  return rgbToHex(nr, ng, nb)
}

function softTint(hex, alpha = 0.12) {
  const { r, g, b } = hexToRgb(hex)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function hexToRgb(hex) {
  const clean = sanitizeHex(hex, DEFAULT_THEME.primaryColor).slice(1)
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  }
}

function rgbToHex(r, g, b) {
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`
}
