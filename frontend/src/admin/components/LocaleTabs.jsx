import { LOCALES } from '@i18n/locales'
import styles from '../admin.module.css'

function cloneValue(value) {
  if (value == null) return value
  try {
    return JSON.parse(JSON.stringify(value))
  } catch {
    return value
  }
}

export function isFilledValue(value) {
  if (Array.isArray(value)) return value.length > 0
  if (value && typeof value === 'object') {
    return Object.values(value).some((item) => isFilledValue(item))
  }
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim().length > 0
}

export function localeHasContent(form, fields, locale, defaultLocale = 'en') {
  if (!form || !fields?.length) return false
  if (locale === defaultLocale) {
    return fields.some((field) => isFilledValue(form[field]))
  }
  const pack = form.translations?.[locale] || {}
  return fields.some((field) => isFilledValue(pack[field]))
}

export function copyLocaleFromDefault(form, fields, locale, defaultLocale = 'en') {
  if (!form || locale === defaultLocale) return form
  const copied = {}
  fields.forEach((field) => {
    copied[field] = cloneValue(form[field] ?? '')
  })
  return {
    ...form,
    translations: {
      ...(form.translations || {}),
      [locale]: copied,
    },
  }
}

/**
 * Language tabs for CMS entity forms (one record, per-locale fields).
 */
export default function LocaleTabs({
  value,
  onChange,
  defaultLocale = 'en',
  locales = LOCALES,
  form,
  setForm,
  fields,
  completeness,
  onCopyFromDefault,
}) {
  const list = locales.length ? locales : LOCALES
  const current = list.find((item) => item.code === value) || list[0]
  const defaultMeta = list.find((item) => item.code === defaultLocale)
  const defaultLabel = defaultMeta?.nativeLabel || defaultMeta?.label || defaultLocale
  const isDefault = value === defaultLocale

  const filledFor = (code) => {
    if (completeness && typeof completeness[code] === 'boolean') return completeness[code]
    if (form && fields?.length) return localeHasContent(form, fields, code, defaultLocale)
    return null
  }

  const handleCopy = () => {
    if (isDefault) return
    const alreadyFilled = filledFor(value)
    if (
      alreadyFilled &&
      !window.confirm(
        `Replace the ${current?.nativeLabel || value} fields with ${defaultLabel} text? You can then translate in place.`,
      )
    ) {
      return
    }
    if (onCopyFromDefault) {
      onCopyFromDefault()
      return
    }
    if (form && setForm && fields?.length) {
      setForm(copyLocaleFromDefault(form, fields, value, defaultLocale))
    }
  }

  const canCopy = Boolean(onCopyFromDefault || (form && setForm && fields?.length))

  return (
    <div className={styles.localeBar}>
      <div className={styles.localeBarHead}>
        <div>
          <p className={styles.localeBarTitle}>Content language</p>
          <p className={styles.localeBarHint}>
            {isDefault
              ? `You are editing the default language (${current?.nativeLabel || value}). This is what visitors see when a translation is still empty.`
              : `You are editing ${current?.nativeLabel || value}. Fill the fields below, then Save. Empty fields fall back to ${defaultLabel} on the public site.`}
          </p>
        </div>
        {!isDefault && canCopy ? (
          <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={handleCopy}>
            Copy from {defaultLabel}
          </button>
        ) : null}
      </div>

      <div className={styles.localeTabs} role="tablist" aria-label="Content language">
        {list.map((item) => {
          const filled = filledFor(item.code)
          return (
            <button
              key={item.code}
              type="button"
              role="tab"
              aria-selected={value === item.code}
              className={`${styles.localeTab} ${value === item.code ? styles.localeTabActive : ''}`}
              onClick={() => onChange?.(item.code)}
            >
              {filled != null ? (
                <span
                  className={filled ? styles.localeDotFilled : styles.localeDotEmpty}
                  title={filled ? 'Has text in this language' : 'Not translated yet'}
                  aria-hidden="true"
                />
              ) : null}
              {item.nativeLabel || item.label}
              {item.code === defaultLocale ? (
                <span className={styles.localeTabHint}>default</span>
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/** Read a translatable field for the active locale tab. */
export function getLocaleField(form, field, locale, defaultLocale = 'en') {
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
