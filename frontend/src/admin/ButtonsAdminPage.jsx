import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchSettings, updateSettings } from '@api/cms'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { defaultSiteButtons } from '@data/siteButtons'
import { resolveStoryCtas, STANDARD_SITE_CTAS } from '@data/siteCtas'
import { mergeSiteButtons } from '@utils/siteButtons'
import FlashMessage from './components/FlashMessage'
import LocaleTabs from './components/LocaleTabs'
import ListEditor from './components/ListEditor'
import MenuPathFields from './components/MenuPathFields'
import styles from './admin.module.css'

function pickTranslation(button, locale, defaultLocale) {
  const translations = button?.translations || {}
  return translations[locale] || translations[defaultLocale] || {}
}

function setTranslation(button, locale, defaultLocale, patch) {
  const translations = { ...(button?.translations || {}) }
  const current = { ...pickTranslation(button, locale, defaultLocale), ...patch }
  translations[locale] = current
  return { ...button, translations }
}

export default function ButtonsAdminPage() {
  const { refresh } = useContent()
  const { defaultLocale } = useLocale()
  const [locale, setLocale] = useState(defaultLocale || 'en')
  const [buttons, setButtons] = useState(defaultSiteButtons)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setLocale(defaultLocale || 'en')
  }, [defaultLocale])

  useEffect(() => {
    fetchSettings()
      .then((data) => {
        const merged = mergeSiteButtons(data?.siteButtons || {})
        const en = merged.involveStory?.translations?.en || {}
        const cards = resolveStoryCtas(en.cards)
        setButtons({
          ...merged,
          involveStory: {
            ...merged.involveStory,
            translations: {
              ...merged.involveStory.translations,
              en: { ...en, cards },
            },
          },
        })
      })
      .catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load buttons' }))
  }, [])

  const footerPack = pickTranslation(buttons.footerCta, locale, defaultLocale)
  const involvePack = pickTranslation(buttons.involveStory, locale, defaultLocale)
  const involveCards =
    Array.isArray(involvePack.cards) && involvePack.cards.length
      ? involvePack.cards
      : STANDARD_SITE_CTAS
  const navPack = pickTranslation(buttons.navDonate, locale, defaultLocale)

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setFlash({ type: 'success', message: '' })
    try {
      await updateSettings({ siteButtons: buttons })
      await refresh?.()
      setFlash({ type: 'success', message: 'Site buttons saved.' })
    } catch (err) {
      const message = err.message || 'Save failed'
      setError(message)
      setFlash({ type: 'error', message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Site buttons</h1>
        <button className={styles.btn} type="button" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save buttons'}
        </button>
      </div>

      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <p className={styles.muted}>
        Manage site-wide call-to-action buttons and their translations here. Menu structure and links are
        edited under <Link to="/admin/menus">Site menus</Link>. Page images are edited under{' '}
        <Link to="/admin/sections">Site pages</Link> (header and footer image only).
      </p>

      <LocaleTabs value={locale} onChange={setLocale} defaultLocale={defaultLocale} />

      <div className={styles.card} style={{ marginTop: '1rem' }}>
        <h2 className={styles.sectionTitle}>Top bar — Donate</h2>
        <p className={styles.muted}>White button on the dark header bar (right side).</p>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>Button label ({locale})</label>
            <input
              value={navPack.label || ''}
              onChange={(e) =>
                setButtons((prev) => ({
                  ...prev,
                  navDonate: setTranslation(prev.navDonate, locale, defaultLocale, { label: e.target.value }),
                }))
              }
            />
          </div>
          <MenuPathFields
            path={buttons.navDonate?.path || '/support/get-involved'}
            label="Opens this page"
            onChange={(path) => setButtons((prev) => ({ ...prev, navDonate: { ...prev.navDonate, path } }))}
            placeholder="/support/get-involved"
          />
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '1.25rem' }}>
        <h2 className={styles.sectionTitle}>Footer call-to-action band</h2>
        <p className={styles.muted}>Navy band above the footer links on every page.</p>
        <div className={styles.field}>
          <label>Title ({locale})</label>
          <input
            value={footerPack.title || ''}
            onChange={(e) =>
              setButtons((prev) => ({
                ...prev,
                footerCta: setTranslation(prev.footerCta, locale, defaultLocale, { title: e.target.value }),
              }))
            }
          />
        </div>
        <div className={styles.field}>
          <label>Text ({locale})</label>
          <textarea
            rows={3}
            value={footerPack.text || ''}
            onChange={(e) =>
              setButtons((prev) => ({
                ...prev,
                footerCta: setTranslation(prev.footerCta, locale, defaultLocale, { text: e.target.value }),
              }))
            }
          />
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>Primary button ({locale})</label>
            <input
              value={footerPack.primaryLabel || ''}
              onChange={(e) =>
                setButtons((prev) => ({
                  ...prev,
                  footerCta: setTranslation(prev.footerCta, locale, defaultLocale, {
                    primaryLabel: e.target.value,
                  }),
                }))
              }
            />
          </div>
          <MenuPathFields
            path={buttons.footerCta?.primaryPath || '/pilgrimage/plan'}
            label="Primary opens"
            onChange={(path) =>
              setButtons((prev) => ({ ...prev, footerCta: { ...prev.footerCta, primaryPath: path } }))
            }
          />
        </div>
        <div className={styles.fieldRow}>
          <div className={styles.field}>
            <label>Secondary button ({locale})</label>
            <input
              value={footerPack.secondaryLabel || ''}
              onChange={(e) =>
                setButtons((prev) => ({
                  ...prev,
                  footerCta: setTranslation(prev.footerCta, locale, defaultLocale, {
                    secondaryLabel: e.target.value,
                  }),
                }))
              }
            />
          </div>
          <MenuPathFields
            path={buttons.footerCta?.secondaryPath || '/support/get-involved'}
            label="Secondary opens"
            onChange={(path) =>
              setButtons((prev) => ({ ...prev, footerCta: { ...prev.footerCta, secondaryPath: path } }))
            }
          />
        </div>
      </div>

      <div className={styles.card} style={{ marginTop: '1.25rem' }}>
        <h2 className={styles.sectionTitle}>Story pages — call to action</h2>
        <p className={styles.muted}>
          Three buttons shown near the bottom of Shrine, Pilgrimage, and Spirituality story pages
          (View Calendar, Plan Your Pilgrimage, Get involved).
        </p>
        <div className={styles.field}>
          <label>Section title ({locale})</label>
          <input
            value={involvePack.title || ''}
            onChange={(e) =>
              setButtons((prev) => ({
                ...prev,
                involveStory: setTranslation(prev.involveStory, locale, defaultLocale, { title: e.target.value }),
              }))
            }
          />
        </div>
        <div className={styles.field}>
          <label>Section intro ({locale})</label>
          <textarea
            rows={3}
            value={involvePack.lead || ''}
            onChange={(e) =>
              setButtons((prev) => ({
                ...prev,
                involveStory: setTranslation(prev.involveStory, locale, defaultLocale, { lead: e.target.value }),
              }))
            }
          />
        </div>
        <ListEditor
          label={`Buttons (${locale})`}
          items={involveCards}
          onChange={(cards) =>
            setButtons((prev) => ({
              ...prev,
              involveStory: setTranslation(prev.involveStory, locale, defaultLocale, { cards }),
            }))
          }
          addLabel="Add button"
          emptyItem={{ title: '', text: '', path: '' }}
          fields={[
            { key: 'title', label: 'Button label' },
            { key: 'text', label: 'Description (optional)', type: 'textarea' },
            { key: 'path', label: 'URL', placeholder: '/pilgrimage/plan' },
          ]}
        />
      </div>

      {error ? <p className={styles.error}>{error}</p> : null}
    </div>
  )
}
