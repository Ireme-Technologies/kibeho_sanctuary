import { useMemo, useState } from 'react'
import {
  LANGUAGE_CATALOG,
  LOCALE_CODE_PATTERN,
  addableFromCatalog,
  languageFromCode,
} from '@i18n/languageCatalog'
import { confirmDelete } from './confirmDelete'
import { confirmAction, notifyFlash } from './notify'
import styles from '../admin.module.css'

export default function LanguagesManager({
  languages,
  defaultLocale,
  catalog,
  onPersist,
  busy,
}) {
  const [addCode, setAddCode] = useState('')
  const [customCode, setCustomCode] = useState('')
  const [customLabel, setCustomLabel] = useState('')
  const addable = useMemo(
    () => addableFromCatalog(languages, catalog?.length ? catalog : LANGUAGE_CATALOG),
    [languages, catalog],
  )
  const defaultMeta = languages.find((item) => item.code === defaultLocale)
  const defaultName = defaultMeta?.nativeLabel || defaultMeta?.label || defaultLocale

  const persist = async (nextLanguages, nextDefault = defaultLocale) => {
    const withDefault = nextLanguages.map((item) =>
      item.code === nextDefault ? { ...item, public: true } : item,
    )
    try {
      await onPersist(withDefault, nextDefault)
      return true
    } catch {
      return false
    }
  }

  const handleAdd = async () => {
    let next
    if (addCode === '__other__') {
      const code = customCode.trim().toLowerCase()
      if (!LOCALE_CODE_PATTERN.test(code)) {
        notifyFlash('error', 'Use a two-letter code such as it, sw, or pt-br.')
        return
      }
      if (languages.some((item) => item.code === code)) {
        notifyFlash('error', 'That language is already added.')
        return
      }
      const label = customLabel.trim() || languageFromCode(code).label
      next = {
        ...languageFromCode(code),
        label,
        nativeLabel: label,
        public: false,
      }
    } else {
      const picked = addable.find((item) => item.code === addCode)
      if (!picked) return
      next = { ...picked, public: false }
    }

    const ok = await persist([...languages, next])
    if (!ok) return
    setAddCode('')
    setCustomCode('')
    setCustomLabel('')
  }

  const handleDefaultChange = async (code) => {
    if (code === defaultLocale) return
    const meta = languages.find((item) => item.code === code)
    const name = meta?.nativeLabel || meta?.label || code
    if (
      !(await confirmAction({
        title: 'Change default language',
        text: `Use ${name} as the default language? First-time visitors will see it, and empty translations will fall back to it. It stays visible on the public site.`,
        confirmLabel: 'Use this default',
      }))
    ) {
      return
    }
    await persist(languages, code)
  }

  const handleTogglePublic = async (code, makePublic) => {
    if (code === defaultLocale) return
    const meta = languages.find((item) => item.code === code)
    const name = meta?.nativeLabel || meta?.label || code
    if (makePublic) {
      if (
        !(await confirmAction({
          title: 'Show language to visitors',
          text: `Show ${name} on the public language menu? Visitors will be able to choose it. Any empty translations will fall back to ${defaultName}.`,
          confirmLabel: 'Show to visitors',
        }))
      ) {
        return
      }
    } else if (
      !(await confirmAction({
        title: 'Hide language from visitors',
        text: `Hide ${name} from the public site? Staff can keep translating in admin. Visitors will no longer see it in the language menu.`,
        confirmLabel: 'Hide from visitors',
      }))
    ) {
      return
    }
    await persist(
      languages.map((item) => (item.code === code ? { ...item, public: makePublic } : item)),
    )
  }

  const handleRemove = async (code) => {
    if (code === defaultLocale) return
    const meta = languages.find((item) => item.code === code)
    const name = meta?.nativeLabel || meta?.label || code
    if (
      !(await confirmDelete(`Remove ${name} from this site?`, {
        title: 'Remove language',
        confirmLabel: 'Remove',
        finalMessage: 'It will disappear from admin tabs and the public menu. Saved translations stay stored if you add it again later.',
      }))
    ) {
      return
    }
    await persist(languages.filter((item) => item.code !== code))
  }

  return (
    <div className={styles.card} style={{ marginBottom: '1rem' }}>
      <h2 className={styles.langManagerTitle}>Site languages</h2>
      <p className={styles.muted} style={{ marginTop: 0 }}>
        Add a language to translate in admin. It starts as <strong>Draft</strong> (staff only). When
        the wording is ready, turn on <strong>Public</strong> so it appears in the language menu on
        every page.
      </p>

      <div className={styles.langManagerTableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Language</th>
              <th>For visitors</th>
              <th>Default</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {languages.map((item) => {
              const isDefault = item.code === defaultLocale
              const isPublic = item.public !== false || isDefault
              return (
                <tr key={item.code}>
                  <td>
                    <span className={styles.langManagerName}>
                      <span aria-hidden="true">{item.flag}</span>
                      <span>
                        {item.nativeLabel || item.label}
                        <span className={styles.langManagerCode}>{item.code}</span>
                      </span>
                    </span>
                  </td>
                  <td>
                    {isDefault ? (
                      <span className={`${styles.langStatusPill} ${styles.langStatusPublic}`}>
                        Always public
                      </span>
                    ) : isPublic ? (
                      <span className={`${styles.langStatusPill} ${styles.langStatusPublic}`}>
                        Public
                      </span>
                    ) : (
                      <span className={`${styles.langStatusPill} ${styles.langStatusDraft}`}>
                        Draft — staff only
                      </span>
                    )}
                  </td>
                  <td>
                    <label className={styles.langDefaultPick}>
                      <input
                        type="radio"
                        name="default-locale"
                        checked={isDefault}
                        disabled={busy}
                        onChange={() => handleDefaultChange(item.code)}
                      />
                      {isDefault ? 'Yes' : 'Set as default'}
                    </label>
                  </td>
                  <td>
                    <div className={styles.langManagerActions}>
                      {!isDefault ? (
                        <button
                          type="button"
                          className={isPublic ? `${styles.btn} ${styles.btnSecondary} ${styles.btnCompact}` : `${styles.btn} ${styles.btnCompact}`}
                          disabled={busy}
                          onClick={() => handleTogglePublic(item.code, !isPublic)}
                        >
                          {isPublic ? 'Hide from public' : 'Show to visitors'}
                        </button>
                      ) : null}
                      {!isDefault ? (
                        <button
                          type="button"
                          className={`${styles.btn} ${styles.btnSecondary} ${styles.btnCompact}`}
                          disabled={busy}
                          onClick={() => handleRemove(item.code)}
                        >
                          Remove
                        </button>
                      ) : null}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <div className={styles.langAddRow}>
        <div className={styles.field}>
          <label htmlFor="add-language">Add a language</label>
          <select
            id="add-language"
            value={addCode}
            disabled={busy}
            onChange={(e) => setAddCode(e.target.value)}
          >
            <option value="">Choose a language…</option>
            {addable.map((item) => (
              <option key={item.code} value={item.code}>
                {item.flag} {item.nativeLabel || item.label} ({item.code})
              </option>
            ))}
            <option value="__other__">Other — enter a code</option>
          </select>
        </div>
        {addCode === '__other__' ? (
          <>
            <div className={styles.field}>
              <label htmlFor="custom-lang-code">Code</label>
              <input
                id="custom-lang-code"
                value={customCode}
                onChange={(e) => setCustomCode(e.target.value)}
                placeholder="e.g. sw"
                disabled={busy}
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="custom-lang-label">Name</label>
              <input
                id="custom-lang-label"
                value={customLabel}
                onChange={(e) => setCustomLabel(e.target.value)}
                placeholder="e.g. Kiswahili"
                disabled={busy}
              />
            </div>
          </>
        ) : null}
        <div className={styles.field} style={{ alignSelf: 'end' }}>
          <button
            type="button"
            className={styles.btn}
            disabled={busy || !addCode || (addCode === '__other__' && !customCode.trim())}
            onClick={handleAdd}
          >
            Add language
          </button>
        </div>
      </div>
      <p className={styles.muted} style={{ marginBottom: 0 }}>
        New languages appear immediately on Pages, News, menus, and this translation table — still
        hidden from visitors until you click Show to visitors.
      </p>
    </div>
  )
}
