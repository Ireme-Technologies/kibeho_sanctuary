import { useEffect, useMemo, useState } from 'react'
import { fetchI18n, updateI18n } from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import { LOCALES } from '@i18n/locales'
import { normalizeLanguages } from '@i18n/languageCatalog'
import FlashMessage from './components/FlashMessage'
import LanguagesManager from './components/LanguagesManager'
import { confirmDelete } from './components/confirmDelete'
import { orderedLocales } from './components/LocaleColumns'
import styles from './admin.module.css'

function emptyRow(locales) {
  return Object.fromEntries(locales.map((code) => [code, '']))
}

function snapshotState({ dictionary }) {
  return JSON.stringify({ dictionary })
}

export default function TranslationsAdminPage() {
  const { reloadI18n } = useLocale()
  const [defaultLocale, setDefaultLocale] = useState('en')
  const [languages, setLanguages] = useState(LOCALES.map((item) => ({ ...item, public: true })))
  const [catalog, setCatalog] = useState([])
  const [dictionary, setDictionary] = useState({})
  const [savedSnapshot, setSavedSnapshot] = useState('')
  const [query, setQuery] = useState('')
  const [newKey, setNewKey] = useState('')
  const [showAllLocales, setShowAllLocales] = useState(false)
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [langBusy, setLangBusy] = useState(false)

  const enabledLocales = languages.map((item) => item.code)

  const dirty = useMemo(() => {
    if (!savedSnapshot) return false
    return snapshotState({ dictionary }) !== savedSnapshot
  }, [dictionary, savedSnapshot])

  const applyPack = (data) => {
    const nextDict = data.dictionary || {}
    setDefaultLocale(data.defaultLocale || 'en')
    setLanguages(normalizeLanguages(data))
    setCatalog(data.catalog || [])
    setDictionary(nextDict)
    setSavedSnapshot(snapshotState({ dictionary: nextDict }))
  }

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchI18n()
      applyPack(data)
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to load translations' })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (!dirty) return undefined
    const onBeforeUnload = (e) => {
      e.preventDefault()
      e.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [dirty])

  const keys = useMemo(() => {
    const list = Object.keys(dictionary).sort((a, b) => a.localeCompare(b))
    const q = query.trim().toLowerCase()
    if (!q) return list
    return list.filter((key) => {
      const row = dictionary[key] || {}
      return (
        key.toLowerCase().includes(q) ||
        Object.values(row).some((v) => String(v || '').toLowerCase().includes(q))
      )
    })
  }, [dictionary, query])

  const setValue = (key, locale, value) => {
    setDictionary((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || emptyRow(enabledLocales)),
        [locale]: value,
      },
    }))
  }

  const addKey = () => {
    const key = newKey.trim()
    if (!key) return
    if (dictionary[key]) {
      setFlash({ type: 'error', message: `Key “${key}” already exists.` })
      return
    }
    setDictionary((prev) => ({ ...prev, [key]: emptyRow(enabledLocales) }))
    setNewKey('')
    setFlash({ type: 'success', message: `Added key “${key}”. Click Save translations to keep it.` })
  }

  const removeKey = async (key) => {
    if (!(await confirmDelete(`Delete translation key “${key}”?`))) return
    setDictionary((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const persistLanguages = async (nextLanguages, nextDefault = defaultLocale) => {
    setLangBusy(true)
    try {
      const data = await updateI18n({
        defaultLocale: nextDefault,
        enabledLocales: nextLanguages.map((item) => item.code),
        languages: nextLanguages,
      })
      setDefaultLocale(data.defaultLocale || nextDefault)
      setLanguages(normalizeLanguages(data))
      setCatalog(data.catalog || [])
      if (nextLanguages.length > 3) setShowAllLocales(true)
      await reloadI18n()
      setFlash({ type: 'success', message: 'Languages updated.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to update languages' })
      throw err
    } finally {
      setLangBusy(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateI18n({
        defaultLocale,
        enabledLocales,
        languages,
        strings: dictionary,
      })
      setFlash({ type: 'success', message: 'Translations saved.' })
      await load()
      await reloadI18n()
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to save translations' })
    } finally {
      setSaving(false)
    }
  }

  const enabledMeta = languages.length ? languages : LOCALES
  const columnLocales = orderedLocales(defaultLocale, {
    locales: enabledMeta,
    limit: showAllLocales ? undefined : 3,
  })
  const hiddenLocales = enabledMeta.filter((l) => !columnLocales.some((c) => c.code === l.code))
  const saveLabel = saving ? 'Saving…' : 'Save translations'
  const saveDisabled = saving || loading || !dirty

  return (
    <div className={dirty ? styles.translationsPageDirty : undefined}>
      <div className={styles.topbar}>
        <div>
          <h1>Translations</h1>
          {dirty && <p className={styles.unsavedHint}>Unsaved changes</p>}
        </div>
        <button type="button" className={styles.btn} onClick={handleSave} disabled={saveDisabled}>
          {saveLabel}
        </button>
      </div>

      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <p className={styles.muted} style={{ marginBottom: '1rem' }}>
        This page is for <strong>short buttons and labels</strong> (Donate, menu words, form hints).
        Empty cells are highlighted — visitors then see the default language. Long articles belong in{' '}
        <strong>Pages</strong> or <strong>News</strong>, where each language has its own editor.
      </p>

      <LanguagesManager
        languages={enabledMeta}
        defaultLocale={defaultLocale}
        catalog={catalog}
        onPersist={persistLanguages}
        busy={langBusy || saving}
      />

      <div className={styles.card} style={{ marginBottom: '1rem' }}>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>Search keys</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by key or text…"
            />
          </div>
          <div className={styles.field}>
            <label>Add key</label>
            <input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              placeholder="e.g. nav.donate"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addKey()
                }
              }}
            />
          </div>
          <div className={styles.field} style={{ alignSelf: 'end' }}>
            <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={addKey}>
              Add key
            </button>
          </div>
        </div>
      </div>

      <div className={`${styles.card} ${styles.i18nTable}`}>
        <div className={styles.i18nToolbar}>
          <p className={styles.i18nToolbarHint}>
            Columns start with the default language. Cream cells are still empty
            {hiddenLocales.length
              ? ` — ${hiddenLocales.map((l) => l.nativeLabel || l.label).join(', ')} ${
                  hiddenLocales.length === 1 ? 'is' : 'are'
                } hidden until you show all languages.`
              : '.'}
          </p>
          {enabledMeta.length > 3 ? (
            <button
              type="button"
              className={showAllLocales ? `${styles.btn} ${styles.btnSecondary}` : styles.btn}
              onClick={() => setShowAllLocales((value) => !value)}
            >
              {showAllLocales ? 'Show 3 languages' : 'Show all languages'}
            </button>
          ) : null}
        </div>

        {loading ? (
          <p className={styles.muted}>Loading…</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '18%' }}>Key</th>
                {columnLocales.map((l) => (
                  <th key={l.code}>
                    {l.flag} {l.nativeLabel || l.label}
                    {l.code === defaultLocale ? ' · default' : ''}
                    {l.public === false && l.code !== defaultLocale ? ' · draft' : ''}
                  </th>
                ))}
                <th style={{ width: 90 }} />
              </tr>
            </thead>
            <tbody>
              {keys.map((key) => {
                const row = dictionary[key] || {}
                const fallback =
                  row[defaultLocale] || row.en || Object.values(row).find(Boolean) || ''
                return (
                  <tr key={key}>
                    <td>
                      <code>{key}</code>
                    </td>
                    {columnLocales.map((l) => {
                      const value = row[l.code] || ''
                      const empty = !String(value).trim()
                      return (
                        <td key={l.code}>
                          <input
                            className={empty && l.code !== defaultLocale ? styles.i18nEmpty : undefined}
                            value={value}
                            onChange={(e) => setValue(key, l.code, e.target.value)}
                            placeholder={
                              l.code === defaultLocale
                                ? 'Default text'
                                : fallback
                                  ? `Empty — uses: ${fallback}`
                                  : 'Empty'
                            }
                          />
                        </td>
                      )
                    })}
                    <td>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnSecondary} ${styles.btnCompact}`}
                        onClick={() => removeKey(key)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )
              })}
              {!keys.length && (
                <tr>
                  <td colSpan={columnLocales.length + 2} className={styles.muted}>
                    No translation keys match. Open Pages or News to translate long text.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {dirty && (
        <div className={styles.saveBar} role="status" aria-live="polite">
          <span>You have unsaved translation changes.</span>
          <button type="button" className={styles.btn} onClick={handleSave} disabled={saveDisabled}>
            {saveLabel}
          </button>
        </div>
      )}
    </div>
  )
}
