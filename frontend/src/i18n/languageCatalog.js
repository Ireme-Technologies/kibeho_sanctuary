/**
 * Languages the CMS can add. The four sanctuary locales stay first;
 * the rest are common pilgrim languages. Admins can also enter a custom code.
 */

export const LANGUAGE_CATALOG = [
  { code: 'rw', label: 'Kinyarwanda', nativeLabel: 'Ikinyarwanda', flag: '🇷🇼', htmlLang: 'rw' },
  { code: 'fr', label: 'Français', nativeLabel: 'Français', flag: '🇫🇷', htmlLang: 'fr' },
  { code: 'en', label: 'English', nativeLabel: 'English', flag: '🇬🇧', htmlLang: 'en' },
  { code: 'de', label: 'Deutsch', nativeLabel: 'Deutsch', flag: '🇩🇪', htmlLang: 'de' },
  { code: 'sw', label: 'Swahili', nativeLabel: 'Kiswahili', flag: '🇹🇿', htmlLang: 'sw' },
  { code: 'rn', label: 'Kirundi', nativeLabel: 'Ikirundi', flag: '🇧🇮', htmlLang: 'rn' },
  { code: 'lg', label: 'Luganda', nativeLabel: 'Luganda', flag: '🇺🇬', htmlLang: 'lg' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', flag: '🇪🇸', htmlLang: 'es' },
  { code: 'it', label: 'Italian', nativeLabel: 'Italiano', flag: '🇮🇹', htmlLang: 'it' },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português', flag: '🇵🇹', htmlLang: 'pt' },
  { code: 'nl', label: 'Dutch', nativeLabel: 'Nederlands', flag: '🇳🇱', htmlLang: 'nl' },
  { code: 'pl', label: 'Polish', nativeLabel: 'Polski', flag: '🇵🇱', htmlLang: 'pl' },
  { code: 'ko', label: 'Korean', nativeLabel: '한국어', flag: '🇰🇷', htmlLang: 'ko' },
  { code: 'zh', label: 'Chinese', nativeLabel: '中文', flag: '🇨🇳', htmlLang: 'zh' },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', flag: '🇸🇦', htmlLang: 'ar' },
  { code: 'cs', label: 'Czech', nativeLabel: 'Čeština', flag: '🇨🇿', htmlLang: 'cs' },
  { code: 'sk', label: 'Slovak', nativeLabel: 'Slovenčina', flag: '🇸🇰', htmlLang: 'sk' },
  { code: 'hu', label: 'Hungarian', nativeLabel: 'Magyar', flag: '🇭🇺', htmlLang: 'hu' },
  { code: 'uk', label: 'Ukrainian', nativeLabel: 'Українська', flag: '🇺🇦', htmlLang: 'uk' },
  { code: 'vi', label: 'Vietnamese', nativeLabel: 'Tiếng Việt', flag: '🇻🇳', htmlLang: 'vi' },
  { code: 'tl', label: 'Filipino', nativeLabel: 'Filipino', flag: '🇵🇭', htmlLang: 'tl' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', flag: '🇯🇵', htmlLang: 'ja' },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳', htmlLang: 'hi' },
  { code: 'am', label: 'Amharic', nativeLabel: 'አማርኛ', flag: '🇪🇹', htmlLang: 'am' },
  { code: 'la', label: 'Latin', nativeLabel: 'Latina', flag: '🇻🇦', htmlLang: 'la' },
]

export const LOCALE_CODE_PATTERN = /^[a-z]{2}(?:-[a-z]{2})?$/

export function findLanguageMeta(code, extras = []) {
  const list = [...(extras || []), ...LANGUAGE_CATALOG]
  return (
    list.find((item) => item.code === code) ||
    list.find((item) => item.code === 'en') ||
    LANGUAGE_CATALOG[0]
  )
}

export function languageFromCode(code, extras = []) {
  const clean = String(code || '')
    .trim()
    .toLowerCase()
  const meta = findLanguageMeta(clean, extras)
  if (meta?.code === clean) {
    return { ...meta, code: clean }
  }
  return {
    code: clean,
    label: clean.toUpperCase(),
    nativeLabel: clean.toUpperCase(),
    flag: '🌐',
    htmlLang: clean,
  }
}

export function normalizeLanguages(data) {
  const fallback = LANGUAGE_CATALOG.filter((item) => ['rw', 'fr', 'en', 'de'].includes(item.code)).map(
    (item) => ({ ...item, public: true }),
  )
  if (Array.isArray(data?.languages) && data.languages.length) {
    return data.languages.map((row) => ({
      ...languageFromCode(row.code, data.languages),
      label: row.label || languageFromCode(row.code).label,
      nativeLabel: row.nativeLabel || row.label || languageFromCode(row.code).nativeLabel,
      flag: row.flag || languageFromCode(row.code).flag,
      htmlLang: row.htmlLang || row.code,
      public: row.public !== false || row.code === data.defaultLocale,
    }))
  }
  const enabled = data?.enabledLocales?.length ? data.enabledLocales : fallback.map((item) => item.code)
  const publicCodes = data?.publicLocales?.length ? data.publicLocales : enabled
  const defaultLocale = data?.defaultLocale || 'en'
  return enabled.map((code) => ({
    ...languageFromCode(code),
    public: publicCodes.includes(code) || code === defaultLocale,
  }))
}

export function addableFromCatalog(languages, catalog) {
  const used = new Set((languages || []).map((item) => item.code))
  const source = catalog?.length ? catalog : LANGUAGE_CATALOG
  return source.filter((item) => !used.has(item.code))
}
