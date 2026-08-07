import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { fetchI18n } from '@api/cms'
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_STORAGE_KEY,
  getLocale,
  t as fallbackTranslate,
  uiStrings,
} from '@i18n/locales'

const LocaleContext = createContext(null)

function readStoredLocale(fallback = DEFAULT_LOCALE) {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && LOCALES.some((l) => l.code === stored)) return stored
  } catch {
    /* ignore */
  }
  return fallback
}

export function LocaleProvider({ children }) {
  const [defaultLocale, setDefaultLocale] = useState(DEFAULT_LOCALE)
  const [dictionary, setDictionary] = useState({})
  const [enabledLocales, setEnabledLocales] = useState(LOCALES.map((l) => l.code))
  const [locale, setLocaleState] = useState(() => readStoredLocale(DEFAULT_LOCALE))
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetchI18n()
      .then((data) => {
        if (cancelled) return
        const def = data.defaultLocale || DEFAULT_LOCALE
        setDefaultLocale(def)
        setEnabledLocales(data.enabledLocales?.length ? data.enabledLocales : LOCALES.map((l) => l.code))
        setDictionary(data.dictionary || {})
        setLocaleState((prev) => {
          // If user has a stored choice, keep it; otherwise use admin default
          try {
            const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
            if (stored && LOCALES.some((l) => l.code === stored)) return stored
          } catch {
            /* ignore */
          }
          return def
        })
      })
      .catch(() => {
        /* keep hardcoded fallbacks */
      })
      .finally(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const setLocale = (code) => {
    if (!LOCALES.some((l) => l.code === code)) return
    setLocaleState(code)
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, code)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    const meta = getLocale(locale)
    document.documentElement.lang = meta.htmlLang
  }, [locale])

  const locales = useMemo(
    () => LOCALES.filter((l) => enabledLocales.includes(l.code)),
    [enabledLocales]
  )

  const t = (key) => {
    const row = dictionary[key]
    if (row && typeof row === 'object') {
      return (
        row[locale] ||
        row[defaultLocale] ||
        row.en ||
        Object.values(row).find(Boolean) ||
        fallbackTranslate(locale, key) ||
        key
      )
    }
    if (typeof row === 'string' && row) return row
    return fallbackTranslate(locale, key) || uiStrings[defaultLocale]?.[key] || key
  }

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      locales: locales.length ? locales : LOCALES,
      current: getLocale(locale),
      defaultLocale,
      dictionary,
      t,
      ready,
      isTranslatedContent: true,
      reloadI18n: async () => {
        const data = await fetchI18n()
        setDefaultLocale(data.defaultLocale || DEFAULT_LOCALE)
        setEnabledLocales(data.enabledLocales?.length ? data.enabledLocales : LOCALES.map((l) => l.code))
        setDictionary(data.dictionary || {})
      },
    }),
    [locale, locales, defaultLocale, dictionary, ready]
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
