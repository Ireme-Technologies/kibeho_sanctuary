import { useEffect, useState } from 'react'
import { fetchPages, updatePageSection } from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import FlashMessage from './components/FlashMessage'
import ImageField from './components/ImageField'
import ListEditor from './components/ListEditor'
import BlocksEditor from './components/BlocksEditor'
import RichTextEditor from './components/RichTextEditor'
import LocaleTabs from './components/LocaleTabs'
import styles from './admin.module.css'

const PAGES_TAB_KEY = 'admin.pages.activeTab'
const PAGES_SELECTED_KEY = 'admin.pages.selectedKey'

const TABS = [
  { id: 'default-header', label: 'Default header' },
  { id: 'page', label: 'Edit page' },
]

const emptyContent = () => ({
  eyebrow: '',
  title: '',
  subtitle: '',
  heroImage: '',
  intro: '',
  blocks: [],
  links: [],
  ctaPrimaryLabel: '',
  ctaPrimaryPath: '',
  ctaSecondaryLabel: '',
  ctaSecondaryPath: '',
})

function contentToForm(content = {}) {
  const cta = content.cta || {}
  const heroImage = content.heroImage || content.backgroundImage || ''
  return {
    eyebrow: content.eyebrow || '',
    title: content.title || content.heading || (content.headlineLines || [])[0] || '',
    subtitle: content.subtitle || content.subline || '',
    heroImage,
    intro: content.intro || '',
    blocks: Array.isArray(content.blocks) ? content.blocks : [],
    links: Array.isArray(content.links) ? content.links : [],
    ctaPrimaryLabel: cta.primary?.label || '',
    ctaPrimaryPath: cta.primary?.path || '',
    ctaSecondaryLabel: cta.secondary?.label || '',
    ctaSecondaryPath: cta.secondary?.path || '',
  }
}

function formToContent(form, previous = {}) {
  const cta =
    form.ctaPrimaryLabel || form.ctaPrimaryPath
      ? {
          primary: {
            label: form.ctaPrimaryLabel,
            path: form.ctaPrimaryPath,
          },
          ...(form.ctaSecondaryLabel || form.ctaSecondaryPath
            ? {
                secondary: {
                  label: form.ctaSecondaryLabel,
                  path: form.ctaSecondaryPath,
                },
              }
            : {}),
        }
      : null

  return {
    ...previous,
    eyebrow: form.eyebrow,
    title: form.title,
    heading: form.title,
    subtitle: form.subtitle,
    subline: form.subtitle,
    heroImage: form.heroImage,
    // Keep header image fields in sync for pages that use PageHeader
    backgroundImage: form.heroImage,
    headlineLines: form.title ? [form.title] : [],
    breadcrumbLabel: form.title,
    intro: form.intro,
    blocks: form.blocks,
    links: (form.links || []).filter((link) => link.label || link.path),
    cta,
  }
}

function readStoredTab() {
  try {
    const stored = sessionStorage.getItem(PAGES_TAB_KEY)
    if (TABS.some((tab) => tab.id === stored)) return stored
  } catch {
    /* ignore */
  }
  return 'page'
}

function readStoredSelected() {
  try {
    return sessionStorage.getItem(PAGES_SELECTED_KEY) || ''
  } catch {
    return ''
  }
}

function isEditablePageKey(key) {
  return key && !key.startsWith('headers.') && key !== 'home.hero'
}

function getPageLabel(label, translations, locale, defaultLocale) {
  if (locale === defaultLocale) return label ?? ''
  return translations?.[locale]?.label ?? ''
}

function setPageLabel(label, translations, locale, value, defaultLocale) {
  if (locale === defaultLocale) return { label: value, translations }
  return {
    label,
    translations: {
      ...(translations || {}),
      [locale]: { ...(translations?.[locale] || {}), label: value },
    },
  }
}

function getPageContentField(form, translations, field, locale, defaultLocale) {
  if (locale === defaultLocale) return form[field] ?? ''
  const overlay = translations?.[locale]?.content || {}
  if (field === 'ctaPrimaryLabel') return overlay.cta?.primary?.label ?? ''
  if (field === 'ctaSecondaryLabel') return overlay.cta?.secondary?.label ?? ''
  return overlay[field] ?? ''
}

function setPageContentField(form, translations, field, locale, value, defaultLocale) {
  if (locale === defaultLocale) {
    return { form: { ...form, [field]: value }, translations }
  }
  const prevContent = translations?.[locale]?.content || {}
  let contentPatch
  if (field === 'ctaPrimaryLabel') {
    contentPatch = {
      ...prevContent,
      cta: { ...prevContent.cta, primary: { ...prevContent.cta?.primary, label: value } },
    }
  } else if (field === 'ctaSecondaryLabel') {
    contentPatch = {
      ...prevContent,
      cta: { ...prevContent.cta, secondary: { ...prevContent.cta?.secondary, label: value } },
    }
  } else {
    contentPatch = { ...prevContent, [field]: value }
  }
  return {
    form,
    translations: {
      ...(translations || {}),
      [locale]: { ...(translations?.[locale] || {}), content: contentPatch },
    },
  }
}

function buildSectionTranslations(translations, defaultLocale) {
  const result = {}
  Object.entries(translations || {}).forEach(([locale, pack]) => {
    if (locale === defaultLocale || !pack || typeof pack !== 'object') return
    const cleaned = {}
    if (pack.label != null && String(pack.label).trim() !== '') cleaned.label = pack.label
    const overlay = pack.content
    if (overlay && typeof overlay === 'object') {
      const content = {}
      ;['eyebrow', 'title', 'subtitle', 'intro'].forEach((field) => {
        if (overlay[field] != null && String(overlay[field]).trim() !== '') content[field] = overlay[field]
      })
      if (overlay.cta?.primary?.label?.trim()) {
        content.cta = { ...content.cta, primary: { label: overlay.cta.primary.label } }
      }
      if (overlay.cta?.secondary?.label?.trim()) {
        content.cta = {
          ...content.cta,
          secondary: { label: overlay.cta.secondary.label },
        }
      }
      if (Object.keys(content).length) cleaned.content = content
    }
    if (Object.keys(cleaned).length) result[locale] = cleaned
  })
  return result
}

export default function SectionsAdminPage() {
  const { defaultLocale } = useLocale()
  const [sections, setSections] = useState({})
  const [activeTab, setActiveTab] = useState(readStoredTab)
  const [selectedKey, setSelectedKey] = useState(readStoredSelected)
  const [label, setLabel] = useState('')
  const [sectionTranslations, setSectionTranslations] = useState({})
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [form, setForm] = useState(emptyContent())
  const [defaultImage, setDefaultImage] = useState('')
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)
  const [savingDefault, setSavingDefault] = useState(false)

  const selectTab = (id) => {
    setActiveTab(id)
    try {
      sessionStorage.setItem(PAGES_TAB_KEY, id)
    } catch {
      /* ignore */
    }
  }

  const selectPage = (key) => {
    setSelectedKey(key)
    try {
      sessionStorage.setItem(PAGES_SELECTED_KEY, key)
    } catch {
      /* ignore */
    }
  }

  const load = async () => {
    const data = await fetchPages()
    setSections(data || {})
    setDefaultImage(data?.['headers.default']?.content?.backgroundImage || '')
    const keys = Object.keys(data || {}).filter(isEditablePageKey)
    if (!keys.length) return
    if (!selectedKey || !data?.[selectedKey] || !isEditablePageKey(selectedKey)) {
      selectPage(keys[0])
    }
  }

  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load pages' }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!selectedKey || !sections[selectedKey]) return
    const section = sections[selectedKey]
    setLabel(section.label || selectedKey)
    setForm(contentToForm(section.content || {}))
    setSectionTranslations(section.translations || {})
    setLocaleTab(defaultLocale || 'en')
  }, [selectedKey, sections, defaultLocale])

  const sectionKeys = Object.keys(sections)
    .filter(isEditablePageKey)
    .sort((a, b) => {
      const labelA = (sections[a]?.label || a).toLowerCase()
      const labelB = (sections[b]?.label || b).toLowerCase()
      return labelA.localeCompare(labelB)
    })

  const handleSaveDefault = async (e) => {
    e.preventDefault()
    setSavingDefault(true)
    setFlash({ type: 'success', message: '' })
    try {
      await updatePageSection('headers.default', {
        label: 'Default Header Image',
        content: { backgroundImage: defaultImage },
      })
      await load()
      setFlash({ type: 'success', message: 'Default header image saved.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to save default header image.' })
    } finally {
      setSavingDefault(false)
    }
  }

  const handleSavePage = async (e) => {
    e.preventDefault()
    if (!selectedKey) return
    setError('')
    setSaving(true)
    setFlash({ type: 'success', message: '' })
    try {
      const previous = sections[selectedKey]?.content || {}
      await updatePageSection(selectedKey, {
        label,
        content: formToContent(form, previous),
        translations: buildSectionTranslations(sectionTranslations, defaultLocale),
      })
      await load()
      setFlash({ type: 'success', message: 'Page saved successfully.' })
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
        <h1>Pages</h1>
      </div>
      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <div className={styles.tabs} role="tablist" aria-label="Page management">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => selectTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'default-header' && (
        <div className={styles.card}>
          <form className={styles.form} onSubmit={handleSaveDefault}>
            <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>
              Default header image
            </h2>
            <p className={styles.muted}>
              Used when a page does not set its own header / hero image below under Edit page.
            </p>
            <ImageField
              label="Default background image"
              value={defaultImage}
              onChange={setDefaultImage}
              folder="headers"
            />
            <button className={styles.btn} type="submit" disabled={savingDefault}>
              {savingDefault ? 'Saving…' : 'Save default image'}
            </button>
          </form>
        </div>
      )}

      {activeTab === 'page' && (
        <div className={styles.card}>
          <form className={styles.form} onSubmit={handleSavePage} style={{ maxWidth: 920 }}>
            <div className={styles.field}>
              <label>Page</label>
              <select value={selectedKey} onChange={(e) => selectPage(e.target.value)}>
                {sectionKeys.map((key) => (
                  <option key={key} value={key}>
                    {sections[key].label || key}
                  </option>
                ))}
              </select>
            </div>
            <LocaleTabs value={localeTab} onChange={setLocaleTab} defaultLocale={defaultLocale} />
            <div className={styles.field}>
              <label>Admin label</label>
              <input
                value={getPageLabel(label, sectionTranslations, localeTab, defaultLocale)}
                onChange={(e) => {
                  const next = setPageLabel(label, sectionTranslations, localeTab, e.target.value, defaultLocale)
                  setLabel(next.label)
                  setSectionTranslations(next.translations)
                }}
              />
            </div>

            <h2 className={styles.sectionTitle}>Page header</h2>
            <p className={styles.muted}>
              Heading and hero image shown at the top of this page. Leave the image empty to use the
              default header image.
            </p>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label>Eyebrow</label>
                <input
                  value={getPageContentField(form, sectionTranslations, 'eyebrow', localeTab, defaultLocale)}
                  onChange={(e) => {
                    const next = setPageContentField(form, sectionTranslations, 'eyebrow', localeTab, e.target.value, defaultLocale)
                    setForm(next.form)
                    setSectionTranslations(next.translations)
                  }}
                />
              </div>
              <div className={styles.field}>
                <label>Title</label>
                <input
                  value={getPageContentField(form, sectionTranslations, 'title', localeTab, defaultLocale)}
                  onChange={(e) => {
                    const next = setPageContentField(form, sectionTranslations, 'title', localeTab, e.target.value, defaultLocale)
                    setForm(next.form)
                    setSectionTranslations(next.translations)
                  }}
                  required={localeTab === defaultLocale}
                />
              </div>
            </div>
            <div className={styles.field}>
              <label>Subtitle</label>
              <input
                value={getPageContentField(form, sectionTranslations, 'subtitle', localeTab, defaultLocale)}
                onChange={(e) => {
                  const next = setPageContentField(form, sectionTranslations, 'subtitle', localeTab, e.target.value, defaultLocale)
                  setForm(next.form)
                  setSectionTranslations(next.translations)
                }}
              />
            </div>
            {localeTab === defaultLocale ? (
              <ImageField
                label="Header / hero image"
                value={form.heroImage}
                onChange={(url) => setForm({ ...form, heroImage: url })}
                folder="pages"
              />
            ) : null}
            {localeTab === defaultLocale && !form.heroImage && defaultImage ? (
              <p className={styles.muted}>Currently falling back to the default header image.</p>
            ) : null}

            <h2 className={styles.sectionTitle}>Introduction</h2>
            <div className={styles.field}>
              <label>Intro description</label>
              <RichTextEditor
                value={getPageContentField(form, sectionTranslations, 'intro', localeTab, defaultLocale)}
                onChange={(html) => {
                  const next = setPageContentField(form, sectionTranslations, 'intro', localeTab, html, defaultLocale)
                  setForm(next.form)
                  setSectionTranslations(next.translations)
                }}
              />
            </div>

            {localeTab === defaultLocale ? (
              <>
                <h2 className={styles.sectionTitle}>Quick links</h2>
                <ListEditor
                  label="Link cards"
                  items={form.links}
                  onChange={(links) => setForm({ ...form, links })}
                  addLabel="Add link"
                  emptyItem={{ label: '', path: '' }}
                  fields={[
                    { key: 'label', label: 'Label' },
                    { key: 'path', label: 'Path', placeholder: '/about/mass-times' },
                  ]}
                />

                <h2 className={styles.sectionTitle}>Body content</h2>
                <BlocksEditor
                  blocks={form.blocks}
                  onChange={(blocks) => setForm({ ...form, blocks })}
                />
              </>
            ) : (
              <p className={styles.muted}>
                Quick links and body blocks are shared across languages. Switch to the default locale tab to edit them.
              </p>
            )}

            <h2 className={styles.sectionTitle}>Call to action</h2>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label>Primary button label</label>
                <input
                  value={getPageContentField(form, sectionTranslations, 'ctaPrimaryLabel', localeTab, defaultLocale)}
                  onChange={(e) => {
                    const next = setPageContentField(form, sectionTranslations, 'ctaPrimaryLabel', localeTab, e.target.value, defaultLocale)
                    setForm(next.form)
                    setSectionTranslations(next.translations)
                  }}
                />
              </div>
              {localeTab === defaultLocale ? (
                <div className={styles.field}>
                  <label>Primary button path</label>
                  <input
                    value={form.ctaPrimaryPath}
                    onChange={(e) => setForm({ ...form, ctaPrimaryPath: e.target.value })}
                  />
                </div>
              ) : null}
            </div>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label>Secondary button label</label>
                <input
                  value={getPageContentField(form, sectionTranslations, 'ctaSecondaryLabel', localeTab, defaultLocale)}
                  onChange={(e) => {
                    const next = setPageContentField(form, sectionTranslations, 'ctaSecondaryLabel', localeTab, e.target.value, defaultLocale)
                    setForm(next.form)
                    setSectionTranslations(next.translations)
                  }}
                />
              </div>
              {localeTab === defaultLocale ? (
                <div className={styles.field}>
                  <label>Secondary button path</label>
                  <input
                    value={form.ctaSecondaryPath}
                    onChange={(e) => setForm({ ...form, ctaSecondaryPath: e.target.value })}
                  />
                </div>
              ) : null}
            </div>

            {error && <p className={styles.error}>{error}</p>}
            <button className={styles.btn} type="submit" disabled={saving || !selectedKey}>
              {saving ? 'Saving…' : 'Save page'}
            </button>
          </form>
        </div>
      )}
    </div>
  )
}
