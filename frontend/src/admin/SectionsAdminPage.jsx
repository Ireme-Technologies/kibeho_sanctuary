import { useEffect, useRef, useState } from 'react'
import { fetchPages, updatePageSection } from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import { pathForSectionKey } from '@data/pages/registry'
import { pathForCmsKey } from '@i18n/localizedPath'
import FlashMessage from './components/FlashMessage'
import ImageField from './components/ImageField'
import ListEditor from './components/ListEditor'
import BlocksEditor from './components/BlocksEditor'
import RichTextEditor from './components/RichTextEditor'
import LocaleTabs, { isFilledValue } from './components/LocaleTabs'
import { LocaleColumnHeaders, LocaleColumnCells } from './components/LocaleColumns'
import ListTitle from './components/ListTitle'
import MenuPathFields from './components/MenuPathFields'
import {
  contentToForm,
  emptyPageForm,
  formToContent,
  groupedPageKeys,
  isHomeSectionKey,
  isStoryPageKey,
  pageKind,
  pageOptionLabel,
} from './pageForm'
import styles from './admin.module.css'

const PAGES_TAB_KEY = 'admin.pages.activeTab'
const PAGES_SELECTED_KEY = 'admin.pages.selectedKey'

const TABS = [
  { id: 'default-header', label: 'Default header' },
  { id: 'page', label: 'All pages' },
]

const ARRAY_FIELDS = ['blocks', 'links', 'buttons', 'highlights', 'items', 'involveLinks', 'values', 'exploreLinks']

const emptyContent = emptyPageForm

function readStoredTab() {
  try {
    const urlTab = new URLSearchParams(window.location.search).get('tab')
    if (TABS.some((tab) => tab.id === urlTab)) return urlTab
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
  if (locale === defaultLocale) {
    if (ARRAY_FIELDS.includes(field)) return Array.isArray(form[field]) ? form[field] : []
    return form[field] ?? ''
  }
  const overlay = translations?.[locale]?.content || {}
  if (ARRAY_FIELDS.includes(field)) {
    return Array.isArray(overlay[field]) ? overlay[field] : []
  }
  return overlay[field] ?? ''
}

function setPageContentField(form, translations, field, locale, value, defaultLocale) {
  if (locale === defaultLocale) {
    return { form: { ...form, [field]: value }, translations }
  }
  const prevContent = translations?.[locale]?.content || {}
  return {
    form,
    translations: {
      ...(translations || {}),
      [locale]: { ...(translations?.[locale] || {}), content: { ...prevContent, [field]: value } },
    },
  }
}

function buildSectionTranslations(translations, defaultLocale) {
  const result = {}
  Object.entries(translations || {}).forEach(([locale, pack]) => {
    if (locale === defaultLocale || !pack || typeof pack !== 'object') return
    const cleaned = {}
    if (pack.label != null && String(pack.label).trim() !== '') cleaned.label = pack.label
    if (pack.path != null && String(pack.path).trim() !== '') cleaned.path = String(pack.path).trim()
    const overlay = pack.content
    if (overlay && typeof overlay === 'object') {
      const content = {}
      ;[
        'eyebrow',
        'title',
        'subtitle',
        'intro',
        'heroCtaLabel',
        'involveTitle',
        'involveLead',
        'cardLinkLabel',
        'welcomeEyebrow',
        'welcomeTitle',
        'missionEyebrow',
        'missionTitle',
        'missionText',
        'visionEyebrow',
        'visionTitle',
        'visionText',
        'leadershipTitle',
        'leadershipIntro',
        'mapAlt',
        'mapCaption',
      ].forEach((field) => {
        if (overlay[field] != null && String(overlay[field]).trim() !== '') content[field] = overlay[field]
      })
      ARRAY_FIELDS.forEach((field) => {
        if (Array.isArray(overlay[field]) && overlay[field].length) content[field] = overlay[field]
      })
      if (Object.keys(content).length) cleaned.content = content
    }
    if (Object.keys(cleaned).length) result[locale] = cleaned
  })
  return result
}

function cloneJson(value) {
  try {
    return JSON.parse(JSON.stringify(value ?? null))
  } catch {
    return value
  }
}

function pageLocaleFilled(form, label, translations, locale, defaultLocale) {
  if (locale === defaultLocale) {
    return (
      isFilledValue(label) ||
      isFilledValue(form.title) ||
      isFilledValue(form.intro) ||
      (Array.isArray(form.blocks) && form.blocks.length > 0)
    )
  }
  const pack = translations?.[locale] || {}
  const overlay = pack.content || {}
  return (
    isFilledValue(pack.label) ||
    isFilledValue(pack.path) ||
    isFilledValue(overlay.title) ||
    isFilledValue(overlay.intro) ||
    (Array.isArray(overlay.blocks) && overlay.blocks.length > 0)
  )
}

function copyPageLocaleFromDefault(form, label, translations, locale) {
  return {
    ...translations,
    [locale]: {
      label,
      path: pathForSectionKey(form.key || '')?.replace(/^\//, '') || '',
      content: {
        eyebrow: form.eyebrow || '',
        title: form.title || '',
        subtitle: form.subtitle || '',
        intro: form.intro || '',
        blocks: cloneJson(form.blocks || []),
        links: cloneJson(form.links || []),
        buttons: cloneJson(form.buttons || []),
        highlights: cloneJson(form.highlights || []),
        items: cloneJson(form.items || []),
        involveLinks: cloneJson(form.involveLinks || []),
        heroCtaLabel: form.heroCtaLabel || '',
        involveTitle: form.involveTitle || '',
        involveLead: form.involveLead || '',
        cardLinkLabel: form.cardLinkLabel || '',
      },
    },
  }
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
  const [editingPage, setEditingPage] = useState(false)
  const [pageQuery, setPageQuery] = useState('')
  const pendingLocaleRef = useRef(null)

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
    const extras = {
      'home.quickLinks': data?.['home.quickLinks'] || { label: 'Home — Quick links', content: {} },
      'home.partners': data?.['home.partners'] || { label: 'Home — Partners', content: {} },
    }
    const next = { ...(data || {}), ...extras }
    setSections(next)
    setDefaultImage(data?.['headers.default']?.content?.backgroundImage || '')
    const keys = Object.keys(next).filter(isEditablePageKey)
    if (!keys.length) return
    if (!selectedKey || !next?.[selectedKey] || !isEditablePageKey(selectedKey)) {
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
    setForm(contentToForm(section.content || {}, selectedKey))
    setSectionTranslations(section.translations || {})
  }, [selectedKey, sections])

  useEffect(() => {
    const next = pendingLocaleRef.current || defaultLocale || 'en'
    pendingLocaleRef.current = null
    setLocaleTab(next)
  }, [selectedKey, defaultLocale])

  const sectionKeys = Object.keys(sections)
    .filter(isEditablePageKey)
    .sort((a, b) => {
      const labelA = (sections[a]?.label || a).toLowerCase()
      const labelB = (sections[b]?.label || b).toLowerCase()
      return labelA.localeCompare(labelB)
    })

  const filteredKeys = sectionKeys.filter((key) => {
    const q = pageQuery.trim().toLowerCase()
    if (!q) return true
    const label = (sections[key]?.label || '').toLowerCase()
    const path = pathForSectionKey(key).toLowerCase()
    return label.includes(q) || key.toLowerCase().includes(q) || path.includes(q)
  })
  const groupedKeys = groupedPageKeys(sectionKeys)
  const kind = pageKind(selectedKey)
  const isStory = isStoryPageKey(selectedKey)
  const isDefaultLang = localeTab === defaultLocale

  const patchField = (field, value) => {
    const next = setPageContentField(form, sectionTranslations, field, localeTab, value, defaultLocale)
    setForm(next.form)
    setSectionTranslations(next.translations)
  }

  const openPageEditor = (key, localeCode) => {
    pendingLocaleRef.current = localeCode || defaultLocale || 'en'
    selectPage(key)
    setEditingPage(true)
    setLocaleTab(localeCode || defaultLocale || 'en')
  }

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
        content: formToContent(form, previous, selectedKey),
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
        <div>
          <h1>Pages</h1>
          <p className={styles.muted} style={{ margin: '0.25rem 0 0' }}>
            All website pages and homepage sections are listed below. Open a page to edit the same text,
            cards, and buttons visitors see. Empty fields are filled from the current public defaults so
            you can correct them without retyping.
          </p>
        </div>
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
            onClick={() => {
              selectTab(tab.id)
              if (tab.id === 'page') setEditingPage(false)
            }}
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
              Used when a page does not set its own header / hero image below under All pages.
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

      {activeTab === 'page' && !editingPage && (
        <div className={styles.card}>
          <p className={styles.langLegend}>
            Flag columns start with the default language. Pencil = that language has text. Plus = still
            empty — click it to open the page in that language. Edit and View sit under the title.
          </p>
          <div className={styles.filterBar}>
            <div className={styles.field}>
              <label>Search pages</label>
              <input
                value={pageQuery}
                onChange={(e) => setPageQuery(e.target.value)}
                placeholder="Name, key, or URL"
              />
            </div>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Title</th>
                <LocaleColumnHeaders defaultLocale={defaultLocale} />
                <th>URL</th>
              </tr>
            </thead>
            <tbody>
              {filteredKeys.map((key) => (
                <tr key={key}>
                  <td>
                    <ListTitle
                      title={sections[key]?.label || key}
                      subtitle={isHomeSectionKey(key) ? 'Homepage section' : pathForSectionKey(key)}
                      onEdit={() => openPageEditor(key)}
                      viewHref={isHomeSectionKey(key) ? '/' : pathForSectionKey(key)}
                    />
                  </td>
                  <LocaleColumnCells
                    item={sections[key]}
                    defaultLocale={defaultLocale}
                    onEditLocale={(code) => openPageEditor(key, code)}
                  />
                  <td>{isHomeSectionKey(key) ? 'Homepage' : pathForSectionKey(key)}</td>
                </tr>
              ))}
              {!filteredKeys.length && (
                <tr>
                  <td colSpan={6} className={styles.muted}>
                    No pages match that search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'page' && editingPage && (
        <div className={styles.card}>
          <form className={styles.form} onSubmit={handleSavePage} style={{ maxWidth: 920 }}>
            <div className={styles.actions} style={{ marginBottom: '0.75rem' }}>
              <button
                type="button"
                className={`${styles.btn} ${styles.btnSecondary}`}
                onClick={() => setEditingPage(false)}
              >
                Back to page list
              </button>
            </div>
            <div className={styles.field}>
              <label>Page</label>
              <select value={selectedKey} onChange={(e) => selectPage(e.target.value)}>
                <optgroup label="Website pages">
                  {groupedKeys.website.map((key) => (
                    <option key={key} value={key}>
                      {pageOptionLabel(key, sections[key])}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Homepage sections">
                  {groupedKeys.home.map((key) => (
                    <option key={key} value={key}>
                      {pageOptionLabel(key, sections[key])}
                    </option>
                  ))}
                </optgroup>
              </select>
              <p className={styles.muted}>
                {isHomeSectionKey(selectedKey)
                  ? 'This is a strip on the homepage (/), not a full website page. Example: Home — At the Shrine is the homepage cards; The Shrine (/shrine) is the public shrine page.'
                  : `Public URL (default language): ${pathForSectionKey(selectedKey)} — switch language tabs below to set translated paths.`}
              </p>
            </div>
            <LocaleTabs
              value={localeTab}
              onChange={setLocaleTab}
              defaultLocale={defaultLocale}
              completeness={{
                rw: pageLocaleFilled(form, label, sectionTranslations, 'rw', defaultLocale),
                fr: pageLocaleFilled(form, label, sectionTranslations, 'fr', defaultLocale),
                en: pageLocaleFilled(form, label, sectionTranslations, 'en', defaultLocale),
                de: pageLocaleFilled(form, label, sectionTranslations, 'de', defaultLocale),
              }}
              onCopyFromDefault={() =>
                setSectionTranslations(
                  copyPageLocaleFromDefault(form, label, sectionTranslations, localeTab),
                )
              }
            />
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
            {!isHomeSectionKey(selectedKey) ? (
              <div className={styles.field}>
                <label>Public URL path ({localeTab})</label>
                <input
                  value={
                    localeTab === defaultLocale
                      ? pathForSectionKey(selectedKey).replace(/^\//, '')
                      : sectionTranslations?.[localeTab]?.path ||
                        pathForCmsKey(selectedKey, localeTab, {
                          [selectedKey]: { translations: sectionTranslations },
                        }, defaultLocale).replace(/^\//, '')
                  }
                  onChange={(e) => {
                    if (localeTab === defaultLocale) return
                    const value = e.target.value.trim().replace(/^\/+/, '')
                    setSectionTranslations({
                      ...(sectionTranslations || {}),
                      [localeTab]: {
                        ...(sectionTranslations?.[localeTab] || {}),
                        path: value,
                      },
                    })
                  }}
                  readOnly={localeTab === defaultLocale}
                  placeholder="e.g. pelerinage/pourquoi-kibeho"
                />
                <p className={styles.muted}>
                  Visitors will open <code>/{localeTab}/{localeTab === defaultLocale
                    ? pathForSectionKey(selectedKey).replace(/^\//, '')
                    : sectionTranslations?.[localeTab]?.path ||
                      pathForCmsKey(selectedKey, localeTab, {
                        [selectedKey]: { translations: sectionTranslations },
                      }, defaultLocale).replace(/^\//, '')}</code>
                  . Default language path is fixed by the site structure; other languages can use a
                  translated path.
                </p>
              </div>
            ) : null}

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
                onChange={(html) => patchField('intro', html)}
              />
            </div>

            {kind === 'home.activities' ? (
              <>
                <h2 className={styles.sectionTitle}>Highlight cards</h2>
                <p className={styles.muted}>Cards on the homepage “At the Shrine” strip. Add, edit, reorder, or remove.</p>
                <ListEditor
                  label="Cards"
                  items={getPageContentField(form, sectionTranslations, 'highlights', localeTab, defaultLocale)}
                  onChange={(highlights) => patchField('highlights', highlights)}
                  addLabel="Add card"
                  emptyItem={{ title: '', shortDescription: '', path: '', image: '' }}
                  fields={[
                    { key: 'title', label: 'Title' },
                    { key: 'path', label: 'URL', placeholder: '/shrine/holy-spring' },
                    { key: 'shortDescription', label: 'Description', type: 'textarea' },
                    { key: 'image', label: 'Image URL (optional)' },
                  ]}
                />
                <div className={styles.field}>
                  <label>Card button label</label>
                  <input
                    value={getPageContentField(form, sectionTranslations, 'cardLinkLabel', localeTab, defaultLocale)}
                    onChange={(e) => patchField('cardLinkLabel', e.target.value)}
                    placeholder="Learn more"
                  />
                </div>
              </>
            ) : null}

            {kind === 'home.whyVisit' ||
            kind === 'home.accommodationHelp' ||
            kind === 'home.items' ||
            kind === 'home.partners' ? (
              <>
                <h2 className={styles.sectionTitle}>
                  {kind === 'home.accommodationHelp' ? 'How we help pilgrims' : 'Items'}
                </h2>
                {kind === 'home.accommodationHelp' ? (
                  <p className={styles.muted}>
                    Short points shown in the homepage accommodation panel — how the Pilgrimage Office helps
                    with lodging and travel.
                  </p>
                ) : null}
                <ListEditor
                  label={kind === 'home.partners' ? 'Partner names' : 'Items'}
                  items={getPageContentField(form, sectionTranslations, 'items', localeTab, defaultLocale)}
                  onChange={(items) => patchField('items', items)}
                  addLabel="Add item"
                  emptyItem={
                    kind === 'home.partners'
                      ? { label: '' }
                      : kind === 'home.items'
                        ? { title: '', text: '', meta: '' }
                        : { title: '', text: '' }
                  }
                  fields={
                    kind === 'home.partners'
                      ? [{ key: 'label', label: 'Name' }]
                      : kind === 'home.items'
                        ? [
                            { key: 'title', label: 'Title' },
                            { key: 'meta', label: 'Meta' },
                            { key: 'text', label: 'Text', type: 'textarea' },
                          ]
                        : [
                            { key: 'title', label: 'Title' },
                            { key: 'text', label: 'Text', type: 'textarea' },
                          ]
                  }
                />
              </>
            ) : null}

            {kind === 'home.schedule' ? (
              <>
                <h2 className={styles.sectionTitle}>Schedule items</h2>
                <ListEditor
                  label="Times"
                  items={getPageContentField(form, sectionTranslations, 'items', localeTab, defaultLocale)}
                  onChange={(items) => patchField('items', items)}
                  addLabel="Add row"
                  emptyItem={{ title: '', time: '' }}
                  fields={[
                    { key: 'title', label: 'Title' },
                    { key: 'time', label: 'Time' },
                  ]}
                />
              </>
            ) : null}

            {kind === 'shrine.welcome' ? (
              <>
                <h2 className={styles.sectionTitle}>Welcome message</h2>
                <p className={styles.muted}>
                  Shown in the two-column welcome block below the hero. The homepage welcome strip also uses
                  the title, subtitle, intro, and hero image from this page.
                </p>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>Section eyebrow</label>
                    <input
                      value={getPageContentField(form, sectionTranslations, 'welcomeEyebrow', localeTab, defaultLocale)}
                      onChange={(e) => patchField('welcomeEyebrow', e.target.value)}
                      placeholder="Welcome"
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Section heading</label>
                    <input
                      value={getPageContentField(form, sectionTranslations, 'welcomeTitle', localeTab, defaultLocale)}
                      onChange={(e) => patchField('welcomeTitle', e.target.value)}
                      placeholder="Same as page title if empty"
                    />
                  </div>
                </div>
                {isDefaultLang ? (
                  <ImageField
                    label="Welcome section photo (optional — uses hero image if empty)"
                    value={form.welcomeImage}
                    onChange={(url) => setForm({ ...form, welcomeImage: url })}
                    folder="pages"
                  />
                ) : null}

                <h2 className={styles.sectionTitle}>Mission & vision</h2>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>Mission eyebrow</label>
                    <input
                      value={getPageContentField(form, sectionTranslations, 'missionEyebrow', localeTab, defaultLocale)}
                      onChange={(e) => patchField('missionEyebrow', e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Mission title</label>
                    <input
                      value={getPageContentField(form, sectionTranslations, 'missionTitle', localeTab, defaultLocale)}
                      onChange={(e) => patchField('missionTitle', e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Mission text</label>
                  <textarea
                    rows={4}
                    value={getPageContentField(form, sectionTranslations, 'missionText', localeTab, defaultLocale)}
                    onChange={(e) => patchField('missionText', e.target.value)}
                  />
                </div>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label>Vision eyebrow</label>
                    <input
                      value={getPageContentField(form, sectionTranslations, 'visionEyebrow', localeTab, defaultLocale)}
                      onChange={(e) => patchField('visionEyebrow', e.target.value)}
                    />
                  </div>
                  <div className={styles.field}>
                    <label>Vision title</label>
                    <input
                      value={getPageContentField(form, sectionTranslations, 'visionTitle', localeTab, defaultLocale)}
                      onChange={(e) => patchField('visionTitle', e.target.value)}
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Vision text</label>
                  <textarea
                    rows={4}
                    value={getPageContentField(form, sectionTranslations, 'visionText', localeTab, defaultLocale)}
                    onChange={(e) => patchField('visionText', e.target.value)}
                  />
                </div>

                <h2 className={styles.sectionTitle}>Core values</h2>
                <ListEditor
                  label="Values"
                  items={getPageContentField(form, sectionTranslations, 'values', localeTab, defaultLocale)}
                  onChange={(values) => patchField('values', values)}
                  addLabel="Add value"
                  emptyItem={{ title: '', text: '' }}
                  fields={[
                    { key: 'title', label: 'Title' },
                    { key: 'text', label: 'Description', type: 'textarea' },
                  ]}
                />

                <h2 className={styles.sectionTitle}>Leadership team</h2>
                <p className={styles.muted}>
                  Heading and introduction only — team members are managed under Pastoral Team in the admin.
                  The page shows up to four published members automatically.
                </p>
                <div className={styles.field}>
                  <label>Section title</label>
                  <input
                    value={getPageContentField(form, sectionTranslations, 'leadershipTitle', localeTab, defaultLocale)}
                    onChange={(e) => patchField('leadershipTitle', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label>Section introduction</label>
                  <textarea
                    rows={3}
                    value={getPageContentField(form, sectionTranslations, 'leadershipIntro', localeTab, defaultLocale)}
                    onChange={(e) => patchField('leadershipIntro', e.target.value)}
                  />
                </div>

                <h2 className={styles.sectionTitle}>Explore the Shrine links</h2>
                <p className={styles.muted}>
                  Shortcut buttons to other pages under The Shrine menu. Leave empty to use the site menu
                  defaults.
                </p>
                <ListEditor
                  label="Navigation links"
                  items={getPageContentField(form, sectionTranslations, 'exploreLinks', localeTab, defaultLocale)}
                  onChange={(exploreLinks) => patchField('exploreLinks', exploreLinks)}
                  addLabel="Add link"
                  emptyItem={{ label: '', path: '' }}
                  fields={[
                    { key: 'label', label: 'Label' },
                    { key: 'path', label: 'URL', placeholder: '/shrine/history' },
                  ]}
                />

                <h2 className={styles.sectionTitle}>Shrine map band</h2>
                <p className={styles.muted}>
                  Full-width image above the footer. Guidelines and Get involved buttons are fixed on the page.
                </p>
                {isDefaultLang ? (
                  <ImageField
                    label="Map image"
                    value={form.mapImage}
                    onChange={(url) => setForm({ ...form, mapImage: url })}
                    folder="pages"
                  />
                ) : null}
                <div className={styles.field}>
                  <label>Map image alt text</label>
                  <input
                    value={getPageContentField(form, sectionTranslations, 'mapAlt', localeTab, defaultLocale)}
                    onChange={(e) => patchField('mapAlt', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label>Map caption</label>
                  <textarea
                    rows={2}
                    value={getPageContentField(form, sectionTranslations, 'mapCaption', localeTab, defaultLocale)}
                    onChange={(e) => patchField('mapCaption', e.target.value)}
                  />
                </div>
              </>
            ) : null}

            {kind === 'home.quickLinks' || (kind === 'cms' && selectedKey !== 'shrine.welcome') ? (
              <>
                <h2 className={styles.sectionTitle}>{kind === 'home.quickLinks' ? 'Quick link cards' : 'Quick links'}</h2>
                <p className={styles.muted}>
                  {kind === 'home.quickLinks'
                    ? 'The four shortcut cards under the homepage hero. Add more if needed.'
                    : 'Optional link cards under the introduction (used on hub pages such as Our Lady).'}
                </p>
                <ListEditor
                  label="Link cards"
                  items={getPageContentField(form, sectionTranslations, 'links', localeTab, defaultLocale)}
                  onChange={(links) => patchField('links', links)}
                  addLabel="Add link"
                  emptyItem={{ label: '', path: '', text: '', icon: '' }}
                  fields={[
                    { key: 'label', label: 'Label' },
                    { key: 'path', label: 'URL', placeholder: '/our-lady' },
                    ...(kind === 'home.quickLinks'
                      ? [
                          { key: 'text', label: 'Description' },
                          { key: 'icon', label: 'Icon', placeholder: 'info, users, calendar, heart' },
                        ]
                      : []),
                  ]}
                />
              </>
            ) : null}

            {kind === 'cms' && selectedKey !== 'shrine.welcome' ? (
              <>
                <h2 className={styles.sectionTitle}>Body content</h2>
                <p className={styles.muted}>
                  Headings, paragraphs, notes, and cards (for example Places to visit on The Shrine). Add a Cards
                  block to create a table of linked items.
                </p>
                <BlocksEditor
                  blocks={getPageContentField(form, sectionTranslations, 'blocks', localeTab, defaultLocale)}
                  onChange={(blocks) => patchField('blocks', blocks)}
                />
              </>
            ) : null}

            {kind === 'cms' && isStory && selectedKey !== 'shrine.welcome' ? (
              <>
                <h2 className={styles.sectionTitle}>Hero button</h2>
                <p className={styles.muted}>
                  The button on the header image (default: Be part of this). Leave blank to keep the automatic
                  translation.
                </p>
                <div className={styles.field}>
                  <label>Hero button label</label>
                  <input
                    value={getPageContentField(form, sectionTranslations, 'heroCtaLabel', localeTab, defaultLocale)}
                    onChange={(e) => patchField('heroCtaLabel', e.target.value)}
                    placeholder="Be part of this"
                  />
                </div>
                {isDefaultLang ? (
                  <MenuPathFields
                    path={form.heroCtaPath || '#join'}
                    label="Hero button opens"
                    placeholder="#join"
                    onChange={(path) => setForm({ ...form, heroCtaPath: path })}
                  />
                ) : (
                  <p className={styles.muted}>URL: {form.heroCtaPath || '#join'} · same in every language</p>
                )}

                <h2 className={styles.sectionTitle}>Invite cards</h2>
                <p className={styles.muted}>
                  The three cards near the bottom (Light a candle, Have a Mass said, Come on pilgrimage). Add or
                  remove cards here — they belong to this page, not a separate buttons screen.
                </p>
                <div className={styles.field}>
                  <label>Section title</label>
                  <input
                    value={getPageContentField(form, sectionTranslations, 'involveTitle', localeTab, defaultLocale)}
                    onChange={(e) => patchField('involveTitle', e.target.value)}
                  />
                </div>
                <div className={styles.field}>
                  <label>Section text</label>
                  <textarea
                    rows={3}
                    value={getPageContentField(form, sectionTranslations, 'involveLead', localeTab, defaultLocale)}
                    onChange={(e) => patchField('involveLead', e.target.value)}
                  />
                </div>
                <ListEditor
                  label="Invite cards"
                  items={getPageContentField(form, sectionTranslations, 'involveLinks', localeTab, defaultLocale)}
                  onChange={(involveLinks) => patchField('involveLinks', involveLinks)}
                  addLabel="Add card"
                  emptyItem={{ label: '', text: '', path: '' }}
                  fields={[
                    { key: 'label', label: 'Title' },
                    { key: 'path', label: 'URL', placeholder: '/pilgrimage/plan' },
                    { key: 'text', label: 'Description', type: 'textarea' },
                  ]}
                />
              </>
            ) : null}

            {kind !== 'shrine.welcome' ? (
              <>
            <h2 className={styles.sectionTitle}>Buttons</h2>
            <p className={styles.muted}>
              Buttons at the bottom of this page. Pick a page so the URL is filled automatically — the same URL
              is used in every language. Add more buttons if this page needs them. Header Donate stays in Site
              menus.
            </p>
            <ListEditor
              label="Page buttons"
              items={getPageContentField(form, sectionTranslations, 'buttons', localeTab, defaultLocale)}
              onChange={(buttons) => patchField('buttons', buttons)}
              addLabel="Add button"
              emptyItem={{ label: '', path: '' }}
              fields={[
                { key: 'label', label: 'Label' },
                { key: 'path', label: 'URL', placeholder: '/shrine/mass-schedule' },
              ]}
            />
              </>
            ) : (
              <p className={styles.muted}>
                Action buttons on this page (Guidelines before you come, Get involved) are built into the layout
                and cannot be edited here.
              </p>
            )}

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
