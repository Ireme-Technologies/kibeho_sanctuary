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
import { addableFromCatalog, normalizeLanguages } from '@i18n/languageCatalog'

const LocaleContext = createContext(null)

function applyI18nData(data) {
  const languages = normalizeLanguages(data)
  const defaultLocale = data?.defaultLocale || DEFAULT_LOCALE
  const workspaceCodes = languages.map((item) => item.code)
  const publicCodes = languages
    .filter((item) => item.public !== false || item.code === defaultLocale)
    .map((item) => item.code)
  return {
    defaultLocale,
    languages,
    workspaceCodes,
    publicCodes: publicCodes.length ? publicCodes : [defaultLocale],
    dictionary: data?.dictionary || {},
    catalog: data?.catalog || addableFromCatalog(languages),
  }
}

function readStoredLocale(allowed, fallback = DEFAULT_LOCALE) {
  try {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
    if (stored && allowed.includes(stored)) return stored
  } catch {
    /* ignore */
  }
  return fallback
}

export function LocaleProvider({ children }) {
  const [defaultLocale, setDefaultLocale] = useState(DEFAULT_LOCALE)
  const [dictionary, setDictionary] = useState({})
  const [languages, setLanguages] = useState(() =>
    LOCALES.map((item) => ({ ...item, public: true })),
  )
  const [catalog, setCatalog] = useState(() => addableFromCatalog(LOCALES))
  const [locale, setLocaleState] = useState(() =>
    readStoredLocale(
      LOCALES.map((item) => item.code),
      DEFAULT_LOCALE,
    ),
  )
  const [ready, setReady] = useState(false)

  const applyData = (data) => {
    const next = applyI18nData(data)
    setDefaultLocale(next.defaultLocale)
    setLanguages(next.languages)
    setDictionary(next.dictionary)
    setCatalog(next.catalog)
    setLocaleState((prev) => {
      if (next.publicCodes.includes(prev)) return prev
      return readStoredLocale(next.publicCodes, next.defaultLocale)
    })
    return next
  }

  useEffect(() => {
    let cancelled = false
    fetchI18n()
      .then((data) => {
        if (cancelled) return
        applyData(data)
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

  const publicLocales = useMemo(
    () => languages.filter((item) => item.public !== false || item.code === defaultLocale),
    [languages, defaultLocale],
  )
  const workspaceLocales = useMemo(
    () => (languages.length ? languages : LOCALES.map((item) => ({ ...item, public: true }))),
    [languages],
  )

  const setLocale = (code) => {
    const allowed = publicLocales.map((item) => item.code)
    if (!allowed.includes(code)) return
    setLocaleState(code)
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, code)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    const meta = getLocale(locale, workspaceLocales)
    document.documentElement.lang = meta.htmlLang
  }, [locale, workspaceLocales])

  const t = (key) => {
    const row = dictionary[key]
    const fromUi = fallbackTranslate(locale, key)
    const uiHit = fromUi && fromUi !== key ? fromUi : null
    if (row && typeof row === 'object') {
      return (
        row[locale] ||
        uiHit ||
        row[defaultLocale] ||
        row.en ||
        Object.values(row).find(Boolean) ||
        key
      )
    }
    if (typeof row === 'string' && row) return row
    return uiHit || uiStrings[defaultLocale]?.[key] || key
  }

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      locales: publicLocales.length ? publicLocales : LOCALES,
      workspaceLocales,
      publicLocales,
      catalog,
      current: getLocale(locale, workspaceLocales),
      defaultLocale,
      dictionary,
      t,
      ready,
      reloadI18n: async () => {
        const data = await fetchI18n()
        applyData(data)
        return data
      },
    }),
    [locale, publicLocales, workspaceLocales, catalog, defaultLocale, dictionary, ready],
  )

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
