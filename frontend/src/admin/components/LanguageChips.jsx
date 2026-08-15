import { LOCALES } from '@i18n/locales'
import { useLocale } from '@context/LocaleContext'
import { isFilledValue, localeHasContent } from './LocaleTabs'
import styles from '../admin.module.css'

export default function LanguageChips({ item, fields, defaultLocale = 'en' }) {
  const { workspaceLocales } = useLocale()
  const list = workspaceLocales?.length ? workspaceLocales : LOCALES
  const form = {
    ...(item || {}),
    translations: item?.translations || {},
  }

  return (
    <div className={styles.langChips} aria-label="Languages with content">
      {list.map((loc) => {
        const filled =
          loc.code === defaultLocale
            ? true
            : fields?.length
              ? localeHasContent(form, fields, loc.code, defaultLocale)
              : isFilledValue(form.translations?.[loc.code])
        const draft = loc.public === false && loc.code !== defaultLocale
        return (
          <span
            key={loc.code}
            className={`${styles.langChip} ${filled ? styles.langChipOn : styles.langChipOff}`}
            title={
              filled
                ? `${loc.nativeLabel}: has its own text${draft ? ' (draft)' : ''}`
                : `${loc.nativeLabel}: not translated yet (visitors see the default language)${
                    draft ? ' — draft, not on the public site' : ''
                  }`
            }
          >
            {loc.code.toUpperCase()}
          </span>
        )
      })}
    </div>
  )
}
