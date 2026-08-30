/** Map sanctuary locale codes to BCP 47 tags for Intl date formatting. */
const LOCALE_MAP = {
  en: 'en-GB',
  fr: 'fr-FR',
  rw: 'rw-RW',
  de: 'de-DE',
  sw: 'sw-TZ',
  es: 'es-ES',
  it: 'it-IT',
  pt: 'pt-PT',
  nl: 'nl-NL',
  pl: 'pl-PL',
}

export function toBcp47(locale) {
  if (!locale) return 'en-GB'
  return LOCALE_MAP[locale] || locale
}

export function formatLocaleDate(
  dateStr,
  locale,
  options = { year: 'numeric', month: 'long', day: 'numeric' },
) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString(toBcp47(locale), options)
}

export function formatDateBadge(dateStr, locale) {
  const date = new Date(dateStr)
  if (Number.isNaN(date.getTime())) return { day: '', month: '' }
  const month = date
    .toLocaleDateString(toBcp47(locale), { month: 'short' })
    .replace(/\./g, '')
    .toUpperCase()
    .slice(0, 3)
  return { day: date.getDate(), month }
}
