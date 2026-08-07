import { useEffect, useMemo, useState } from 'react'
import { fetchI18n, updateI18n } from '@api/cms'
import { LOCALES } from '@i18n/locales'
import FlashMessage from './components/FlashMessage'
import styles from './admin.module.css'

function emptyRow(locales) {
  return Object.fromEntries(locales.map((code) => [code, '']))
}

function snapshotState({ defaultLocale, enabledLocales, dictionary }) {
  return JSON.stringify({ defaultLocale, enabledLocales, dictionary })
}

export default function TranslationsAdminPage() {
  const [defaultLocale, setDefaultLocale] = useState('en')
  const [enabledLocales, setEnabledLocales] = useState(LOCALES.map((l) => l.code))
  const [dictionary, setDictionary] = useState({})
  const [savedSnapshot, setSavedSnapshot] = useState('')
  const [tab, setTab] = useState('en')
  const [query, setQuery] = useState('')
  const [newKey, setNewKey] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  const dirty = useMemo(() => {
    if (!savedSnapshot) return false
    return (
      snapshotState({ defaultLocale, enabledLocales, dictionary }) !== savedSnapshot
    )
  }, [defaultLocale, enabledLocales, dictionary, savedSnapshot])

  const load = async () => {
    setLoading(true)
    try {
      const data = await fetchI18n()
      const nextDefault = data.defaultLocale || 'en'
      const nextEnabled = data.enabledLocales?.length
        ? data.enabledLocales
        : LOCALES.map((l) => l.code)
      const nextDict = data.dictionary || {}
      setDefaultLocale(nextDefault)
      setEnabledLocales(nextEnabled)
      setDictionary(nextDict)
      setSavedSnapshot(
        snapshotState({
          defaultLocale: nextDefault,
          enabledLocales: nextEnabled,
          dictionary: nextDict,
        }),
      )
      if (data.defaultLocale) setTab(data.defaultLocale)
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

  const removeKey = (key) => {
    if (!confirm(`Delete translation key “${key}”?`)) return
    setDictionary((prev) => {
      const next = { ...prev }
      delete next[key]
      return next
    })
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await updateI18n({
        defaultLocale,
        enabledLocales,
        strings: dictionary,
      })
      setFlash({ type: 'success', message: 'Translations saved.' })
      await load()
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to save translations' })
    } finally {
      setSaving(false)
    }
  }

  const tabs = LOCALES.filter((l) => enabledLocales.includes(l.code))
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
        Edit any key below, then click <strong>Save translations</strong> to publish the change.
        Empty values fall back to the default language, then English. CMS page content is translated
        on each content form (language tabs).
      </p>

      <div className={styles.card} style={{ marginBottom: '1rem' }}>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>Default language</label>
            <select value={defaultLocale} onChange={(e) => setDefaultLocale(e.target.value)}>
              {LOCALES.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            <p className={styles.muted}>Used for first-time visitors and as fallback when a translation is missing.</p>
          </div>
          <div className={styles.field}>
            <label>Search keys</label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Filter by key or text…"
            />
          </div>
        </div>
        <div className={styles.fieldRow}>
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

      <div className={styles.card}>
        <div className={styles.localeTabs} role="tablist" aria-label="Languages">
          {tabs.map((l) => (
            <button
              key={l.code}
              type="button"
              role="tab"
              aria-selected={tab === l.code}
              className={`${styles.localeTab} ${tab === l.code ? styles.localeTabActive : ''}`}
              onClick={() => setTab(l.code)}
            >
              {l.flag} {l.label}
              {l.code === defaultLocale ? ' · default' : ''}
            </button>
          ))}
        </div>

        {loading ? (
          <p className={styles.muted}>Loading…</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '28%' }}>Key</th>
                <th>{tabs.find((l) => l.code === tab)?.label || tab}</th>
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
                    <td>
                      <input
                        value={row[tab] || ''}
                        onChange={(e) => setValue(key, tab, e.target.value)}
                        placeholder={fallback ? `Fallback: ${fallback}` : 'Enter translation'}
                      />
                    </td>
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
                  <td colSpan={3} className={styles.muted}>
                    No translation keys match.
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
