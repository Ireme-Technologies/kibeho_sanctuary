import { LOCALES } from '@i18n/locales'
import styles from '../admin.module.css'

/**
 * Language tabs for CMS entity forms (option A: one record, per-locale fields).
 */
export default function LocaleTabs({ value, onChange, defaultLocale = 'en', locales = LOCALES }) {
  const list = locales.length ? locales : LOCALES

  return (
    <div className={styles.localeTabs} role="tablist" aria-label="Content language">
      {list.map((l) => (
        <button
          key={l.code}
          type="button"
          role="tab"
          aria-selected={value === l.code}
          className={`${styles.localeTab} ${value === l.code ? styles.localeTabActive : ''}`}
          onClick={() => onChange?.(l.code)}
        >
          {l.nativeLabel || l.label}
          {l.code === defaultLocale ? (
            <span className={styles.localeTabHint}>default</span>
          ) : null}
        </button>
      ))}
    </div>
  )
}

/** Read a translatable field for the active locale tab. */
export function getLocaleField(form, field, locale, defaultLocale = 'en') {
  if (locale === defaultLocale || locale === 'en' && !form.translations) {
    // Base columns hold default/en content
    if (locale === defaultLocale) return form[field] ?? ''
  }
  if (locale === defaultLocale) return form[field] ?? ''
  return form.translations?.[locale]?.[field] ?? ''
}

/** Write a translatable field for the active locale tab. */
export function setLocaleField(form, field, locale, value, defaultLocale = 'en') {
  if (locale === defaultLocale) {
    return { ...form, [field]: value }
  }
  return {
    ...form,
    translations: {
      ...(form.translations || {}),
      [locale]: {
        ...(form.translations?.[locale] || {}),
        [field]: value,
      },
    },
  }
}

/** Build API payload: base fields + translations object (omit empty locale packs). */
export function splitTranslationsPayload(form, localeFields, defaultLocale = 'en') {
  const translations = {}
  const bag = form.translations || {}
  Object.entries(bag).forEach(([locale, values]) => {
    if (locale === defaultLocale) return
    if (!values || typeof values !== 'object') return
    const cleaned = {}
    localeFields.forEach((field) => {
      if (values[field] != null && String(values[field]).trim() !== '') {
        cleaned[field] = values[field]
      }
    })
    if (Object.keys(cleaned).length) translations[locale] = cleaned
  })
  return translations
}
