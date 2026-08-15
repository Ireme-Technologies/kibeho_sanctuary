import { Pencil, Plus } from 'lucide-react'
import { LOCALES } from '@i18n/locales'
import { useLocale } from '@context/LocaleContext'
import { isFilledValue, localeHasContent } from './LocaleTabs'
import styles from '../admin.module.css'

export function orderedLocales(defaultLocale = 'en', { limit, locales = LOCALES } = {}) {
  const list = locales?.length ? locales : LOCALES
  const preferred = list.find((item) => item.code === defaultLocale)
  const rest = list.filter((item) => item.code !== defaultLocale)
  const ordered = preferred ? [preferred, ...rest] : list
  return typeof limit === 'number' ? ordered.slice(0, limit) : ordered
}

export function itemHasLocale(item, fields, locale, defaultLocale = 'en') {
  const form = { ...(item || {}), translations: item?.translations || {} }
  if (locale === defaultLocale) return true
  if (fields?.length) return localeHasContent(form, fields, locale, defaultLocale)
  return isFilledValue(form.translations?.[locale])
}

function useColumnLocales(defaultLocale, limit, locales) {
  const { workspaceLocales } = useLocale()
  return orderedLocales(defaultLocale, {
    limit,
    locales: locales?.length ? locales : workspaceLocales,
  })
}

export function LocaleColumnHeaders({ defaultLocale = 'en', limit, locales }) {
  return useColumnLocales(defaultLocale, limit, locales).map((loc) => {
    const draft = loc.public === false && loc.code !== defaultLocale
    return (
      <th
        key={loc.code}
        className={`${styles.langColHead} ${draft ? styles.langColHeadDraft : ''}`}
        title={draft ? `${loc.nativeLabel || loc.label} (draft — not on the public site)` : loc.nativeLabel || loc.label}
      >
        <span aria-hidden="true">{loc.flag}</span>
        <span className={styles.srOnly}>
          {loc.nativeLabel || loc.label}
          {draft ? ' (draft)' : ''}
        </span>
      </th>
    )
  })
}

export function LocaleColumnCells({
  item,
  fields,
  defaultLocale = 'en',
  onEditLocale,
  limit,
  locales,
}) {
  return useColumnLocales(defaultLocale, limit, locales).map((loc) => {
    const filled = itemHasLocale(item, fields, loc.code, defaultLocale)
    const draft = loc.public === false && loc.code !== defaultLocale
    const label = filled
      ? `Edit ${loc.nativeLabel || loc.label}`
      : `Add ${loc.nativeLabel || loc.label} translation`
    return (
      <td key={loc.code} className={styles.langCol}>
        <button
          type="button"
          className={`${styles.langStatusBtn} ${filled ? styles.langStatusReady : styles.langStatusMissing} ${
            draft ? styles.langStatusBtnDraft : ''
          }`}
          title={draft ? `${label} (draft — not on the public site)` : label}
          aria-label={draft ? `${label} (draft)` : label}
          onClick={() => onEditLocale?.(loc.code)}
        >
          {filled ? <Pencil size={14} /> : <Plus size={16} />}
        </button>
      </td>
    )
  })
}

export function localeColumnCount(defaultLocale = 'en', { limit, locales } = {}) {
  return orderedLocales(defaultLocale, { limit, locales }).length
}
