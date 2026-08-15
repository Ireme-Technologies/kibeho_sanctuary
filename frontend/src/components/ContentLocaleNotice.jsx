import { useLocale } from '@context/LocaleContext'
import styles from './ContentLocaleNotice.module.css'

function isFilledValue(value) {
  if (Array.isArray(value)) return value.length > 0
  if (value && typeof value === 'object') {
    return Object.values(value).some((item) => isFilledValue(item))
  }
  return String(value || '')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .trim().length > 0
}

export function hasLocaleTranslation(translations, locale, defaultLocale = 'en') {
  if (!locale || locale === defaultLocale) return true
  return isFilledValue(translations?.[locale])
}

export default function ContentLocaleNotice({ translations }) {
  const { locale, defaultLocale, t } = useLocale()
  if (hasLocaleTranslation(translations, locale, defaultLocale)) return null

  return (
    <p className={styles.notice} role="status">
      {t('contentNotice')}
    </p>
  )
}
