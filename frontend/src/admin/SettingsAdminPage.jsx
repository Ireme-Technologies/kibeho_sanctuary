import { useEffect, useState } from 'react'
import { fetchSettings, updateSettings } from '@api/cms'
import { useContent } from '@context/ContentContext'
import {
  primaryNav as fallbackPrimaryNav,
  footerLinks as fallbackFooterLinks,
  footerServiceLinks as fallbackFooterServiceLinks,
  navCTA as fallbackNavCTA,
  utilityNav as fallbackUtilityNav,
} from '@data/navigation'
import {
  DEFAULT_THEME,
  applyThemeToDocument,
  normalizeTheme,
} from '@utils/theme'
import { inferSocialKey, SOCIAL_ICON_CODE_HINT } from '@utils/socials'
import FlashMessage from './components/FlashMessage'
import FontPicker from './components/FontPicker'
import ImageField from './components/ImageField'
import ListEditor from './components/ListEditor'
import { confirmDelete } from './components/confirmDelete'
import RichTextEditor from './components/RichTextEditor'
import styles from './admin.module.css'

const TABS = [
  { id: 'brand', label: 'Brand & theme' },
  { id: 'contact', label: 'Contact & social' },
  { id: 'contact-page', label: 'Contact page' },
  { id: 'map', label: 'Map' },
  { id: 'menus', label: 'Menus & links' },
]

const SETTINGS_TAB_KEY = 'admin.settings.activeTab'

const emptyHours = { day: '', hours: '' }
const emptyLink = { label: '', path: '' }
const emptySocial = { label: '', href: '' }
const emptyCustomSocial = { iconCode: '', label: '', href: '' }
const emptyNavChild = { label: '', path: '' }
const emptyNavItem = { label: '', path: '', children: [] }

function normalizeNavItems(items) {
  if (!Array.isArray(items) || !items.length) return fallbackPrimaryNav
  return items.map((item) => ({
    label: item.label || '',
    path: item.path || '',
    children: Array.isArray(item.children)
      ? item.children.map((child) => ({ label: child.label || '', path: child.path || '' }))
      : [],
  }))
}

function readStoredTab() {
  try {
    const stored = sessionStorage.getItem(SETTINGS_TAB_KEY)
    if (TABS.some((tab) => tab.id === stored)) return stored
  } catch {
    /* ignore */
  }
  return 'brand'
}

export default function SettingsAdminPage() {
  const { refresh } = useContent()
  const [activeTab, setActiveTab] = useState(readStoredTab)
  const [company, setCompany] = useState({
    name: '',
    tagline: '',
    logo: '',
    favicon: '',
    preloaderLogo: '',
    phone: '',
    phoneHref: '',
    whatsapp: '',
    email: '',
    notifyEmail: '',
    address: '',
  })
  const [theme, setTheme] = useState(DEFAULT_THEME)
  const [socials, setSocials] = useState([])
  const [customSocials, setCustomSocials] = useState([])
  const [contact, setContact] = useState({
    heroEyebrow: '',
    heroHeadline: '',
    heroSubline: '',
    heroImage: '',
    infoEyebrow: '',
    infoHeading: '',
    address: '',
    phone: '',
    email: '',
    whatsappNumber: '',
    whatsappLabel: '',
    responseNote: '',
    businessHours: [],
  })
  const [map, setMap] = useState({
    label: '',
    title: '',
    subtitle: '',
    embedSrc: '',
    directionsLink: '',
    directionsLabel: 'Get Directions',
  })
  const [primaryNav, setPrimaryNav] = useState([])
  const [utilityNav, setUtilityNav] = useState([])
  const [footerLinks, setFooterLinks] = useState([])
  const [footerServiceLinks, setFooterServiceLinks] = useState([])
  const [navCTA, setNavCTA] = useState({ label: 'Donate', path: '/support/donations' })
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  const selectTab = (id) => {
    setActiveTab(id)
    try {
      sessionStorage.setItem(SETTINGS_TAB_KEY, id)
    } catch {
      /* ignore */
    }
  }

  useEffect(() => {
    fetchSettings()
      .then((data) => {
        const c = data.company || {}
        const contactData = data.contact || {}
        const navigation = data.navigation || {}
        const nextTheme = normalizeTheme(data.theme || DEFAULT_THEME)
        setCompany({
          name: c.name || 'Shrine of Our Lady of Kibeho',
          tagline: c.tagline || '',
          logo: c.logo || '/images/logo/logo-transparent.png',
          favicon: c.favicon || '/images/logo/favicon.svg',
          preloaderLogo: c.preloaderLogo || c.logo || '/images/logo/logo-transparent.png',
          phone: c.phone || '',
          phoneHref: c.phoneHref || '',
          whatsapp: c.whatsapp || '',
          email: c.email || '',
          notifyEmail: c.notifyEmail || '',
          address: c.address || '',
        })
        setTheme(nextTheme)
        applyThemeToDocument(nextTheme)
        const loadedSocials = Array.isArray(c.socials) ? c.socials : []
        const standard = []
        const custom = []
        loadedSocials.forEach((s) => {
          const item = {
            label: s.label || '',
            href: s.href || '',
            iconKey: s.iconKey || '',
            iconCode: s.iconCode || '',
          }
          if (item.iconCode) {
            custom.push({
              iconCode: item.iconCode,
              label: item.label,
              href: item.href,
            })
          } else {
            standard.push({
              label: item.label,
              href: item.href,
              iconKey: item.iconKey,
            })
          }
        })
        setSocials(standard.length ? standard : [{ ...emptySocial }])
        setCustomSocials(custom)
        setContact({
          heroEyebrow: contactData.hero?.eyebrow || '',
          heroHeadline: contactData.hero?.headline || '',
          heroSubline: contactData.hero?.subline || '',
          heroImage: contactData.hero?.['hero-bg-image'] || '',
          infoEyebrow: contactData.info?.eyebrow || '',
          infoHeading: contactData.info?.heading || '',
          address: contactData.info?.address || c.address || '',
          phone: contactData.info?.phone || c.phone || '',
          email: contactData.info?.email || c.email || '',
          whatsappNumber: contactData.info?.whatsappNumber || '',
          whatsappLabel: contactData.info?.whatsappLabel || 'Message on WhatsApp',
          responseNote: contactData.info?.responseNote || '',
          businessHours:
            Array.isArray(contactData.info?.businessHours) && contactData.info.businessHours.length
              ? contactData.info.businessHours
              : [{ ...emptyHours }],
        })
        setMap({
          label: contactData.map?.label || '',
          title: contactData.map?.title || '',
          subtitle: contactData.map?.subtitle || '',
          embedSrc: contactData.map?.embedSrc || '',
          directionsLink: contactData.map?.directionsLink || '',
          directionsLabel: contactData.map?.directionsLabel || 'Get Directions',
        })
        setPrimaryNav(normalizeNavItems(navigation.primaryNav))
        setUtilityNav(
          Array.isArray(navigation.utilityNav) && navigation.utilityNav.length
            ? navigation.utilityNav
            : fallbackUtilityNav
        )
        setFooterLinks(
          Array.isArray(navigation.footerLinks) && navigation.footerLinks.length
            ? navigation.footerLinks
            : fallbackFooterLinks
        )
        setFooterServiceLinks(
          Array.isArray(navigation.footerServiceLinks) && navigation.footerServiceLinks.length
            ? navigation.footerServiceLinks
            : fallbackFooterServiceLinks
        )
        setNavCTA(navigation.navCTA || fallbackNavCTA)
      })
      .catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load settings' }))
  }, [])

  const updateTheme = (patch) => {
    setTheme((prev) => {
      const next = normalizeTheme({ ...prev, ...patch })
      applyThemeToDocument(next)
      return next
    })
  }

  const updateNavItem = (index, patch) => {
    setPrimaryNav((prev) => prev.map((item, i) => (i === index ? { ...item, ...patch } : item)))
  }

  const updateNavChildren = (index, children) => {
    updateNavItem(index, { children })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setFlash({ type: 'success', message: '' })
    try {
      const phoneHref = company.phoneHref || (company.phone ? `tel:${company.phone.replace(/\s+/g, '')}` : '')
      await updateSettings({
        company: {
          name: company.name,
          tagline: company.tagline,
          logo: company.logo,
          favicon: company.favicon,
          preloaderLogo: company.preloaderLogo || company.logo,
          phone: company.phone,
          phoneHref,
          whatsapp: company.whatsapp,
          email: company.email,
          notifyEmail: company.notifyEmail,
          address: company.address,
          socials: [
            ...socials
              .filter((s) => String(s.href || '').trim())
              .map((s) => ({
                label: s.label || '',
                href: String(s.href).trim(),
                iconKey: inferSocialKey(s),
              })),
            ...customSocials
              .filter((s) => String(s.href || '').trim())
              .map((s) => ({
                label: s.label || '',
                href: String(s.href).trim(),
                iconCode: String(s.iconCode || '').trim().toLowerCase(),
                iconKey: inferSocialKey(s),
              })),
          ],
        },
        theme: normalizeTheme(theme),
        contact: {
          hero: {
            eyebrow: contact.heroEyebrow,
            headline: contact.heroHeadline,
            subline: contact.heroSubline,
            'hero-bg-image': contact.heroImage,
          },
          info: {
            eyebrow: contact.infoEyebrow,
            heading: contact.infoHeading,
            address: contact.address,
            phone: contact.phone,
            email: contact.email,
            whatsappNumber: contact.whatsappNumber,
            whatsappLabel: contact.whatsappLabel,
            responseNote: contact.responseNote,
            businessHours: contact.businessHours.filter((h) => h.day || h.hours),
          },
          map: {
            label: map.label,
            title: map.title,
            subtitle: map.subtitle,
            embedSrc: map.embedSrc,
            directionsLink: map.directionsLink,
            directionsLabel: map.directionsLabel,
          },
        },
        navigation: {
          primaryNav: primaryNav.map((item) => ({
            label: item.label,
            path: item.path,
            ...(item.children?.length
              ? {
                  children: item.children
                    .filter((child) => child.label || child.path)
                    .map((child) => ({ label: child.label, path: child.path })),
                }
              : {}),
          })),
          utilityNav: utilityNav.filter((item) => item.label || item.path),
          footerLinks: footerLinks.filter((item) => item.label || item.path),
          footerServiceLinks: footerServiceLinks.filter((item) => item.label || item.path),
          navCTA,
        },
      })
      applyThemeToDocument(theme)
      await refresh?.()
      setFlash({ type: 'success', message: 'Settings saved successfully.' })
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
        <h1>Settings</h1>
      </div>
      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <div className={styles.tabs} role="tablist" aria-label="Settings sections">
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

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit} style={{ maxWidth: 920 }}>
          {activeTab === 'brand' && (
            <div className={styles.tabPanel} role="tabpanel">
              <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>
                Brand & logo
              </h2>
              <ImageField
                label="Site logo"
                value={company.logo}
                onChange={(url) => setCompany({ ...company, logo: url })}
                folder="logo"
              />
              <ImageField
                label="Favicon (browser tab)"
                value={company.favicon}
                onChange={(url) => setCompany({ ...company, favicon: url })}
                folder="logo"
              />
              <ImageField
                label="Preloader image"
                value={company.preloaderLogo}
                onChange={(url) => setCompany({ ...company, preloaderLogo: url })}
                folder="logo"
              />
              <p className={styles.muted}>
                To replace the seeded files in place (same URL for every page), use{' '}
                <strong>Admin → Media library → Logo & brand</strong>.
              </p>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Site name</label>
                  <input
                    value={company.name}
                    onChange={(e) => setCompany({ ...company, name: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>Tagline</label>
                  <input
                    value={company.tagline}
                    onChange={(e) => setCompany({ ...company, tagline: e.target.value })}
                  />
                </div>
              </div>

              <h2 className={styles.sectionTitle}>Site colors</h2>
              <p className={styles.muted}>
                Primary and secondary colors update the public site and admin chrome. Defaults match the
                Shrine navy and sky palette.
              </p>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Primary color</label>
                  <div className={styles.colorSwatchRow}>
                    <input
                      type="color"
                      value={theme.primaryColor}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      aria-label="Primary color picker"
                    />
                    <input
                      type="text"
                      value={theme.primaryColor}
                      onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                      placeholder="#1a365d"
                    />
                  </div>
                </div>
                <div className={styles.field}>
                  <label>Secondary color</label>
                  <div className={styles.colorSwatchRow}>
                    <input
                      type="color"
                      value={theme.secondaryColor}
                      onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                      aria-label="Secondary color picker"
                    />
                    <input
                      type="text"
                      value={theme.secondaryColor}
                      onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                      placeholder="#4aa3e0"
                    />
                  </div>
                </div>
              </div>

              <h2 className={styles.sectionTitle}>Google Fonts</h2>
              <p className={styles.muted}>
                Pick a heading and body font from the list, or choose “Custom Google Font…” and type the
                exact family name. Fonts load in the background (non-blocking) so they do not slow first
                paint. Click <strong>Save settings</strong> to publish.
              </p>
              <div className={styles.fieldRow}>
                <FontPicker
                  id="heading-font"
                  label="Heading font"
                  value={theme.headingFont}
                  onChange={(headingFont) => updateTheme({ headingFont })}
                  fallbackStack="Georgia, 'Times New Roman', serif"
                  previewText="Heading preview — Shrine of Our Lady of Kibeho"
                />
                <FontPicker
                  id="body-font"
                  label="Body font"
                  value={theme.bodyFont}
                  onChange={(bodyFont) => updateTheme({ bodyFont })}
                  fallbackStack="'Segoe UI', sans-serif"
                  previewText="Body preview — Welcome pilgrims to the first Marian apparition site recognised in Africa."
                />
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className={styles.tabPanel} role="tabpanel">
              <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>
                Contact details
              </h2>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Phone</label>
                  <input
                    value={company.phone}
                    onChange={(e) => setCompany({ ...company, phone: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>WhatsApp number</label>
                  <input
                    value={company.whatsapp}
                    onChange={(e) => setCompany({ ...company, whatsapp: e.target.value })}
                    placeholder="+2507..."
                  />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Public email</label>
                  <input
                    value={company.email}
                    onChange={(e) => setCompany({ ...company, email: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>Admin notify email</label>
                  <input
                    value={company.notifyEmail}
                    onChange={(e) => setCompany({ ...company, notifyEmail: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label>Address</label>
                <input
                  value={company.address}
                  onChange={(e) => setCompany({ ...company, address: e.target.value })}
                />
              </div>

              <h2 className={styles.sectionTitle}>Social links</h2>
              <p className={styles.muted}>
                Add a label and URL. Icons are detected from the URL or label. Leave the URL empty to hide
                that link on the public site.
              </p>
              <ListEditor
                label="Social profiles"
                items={socials}
                onChange={setSocials}
                addLabel="Add social link"
                emptyItem={{ ...emptySocial }}
                fields={[
                  { key: 'label', label: 'Label', placeholder: 'Facebook' },
                  { key: 'href', label: 'URL', placeholder: 'https://...' },
                ]}
              />

              <h2 className={styles.sectionTitle}>Custom icon links</h2>
              <p className={styles.muted}>
                Add extra links with a Lucide-style icon code, title, and URL. {SOCIAL_ICON_CODE_HINT}
              </p>
              <ListEditor
                label="Custom icons"
                items={customSocials}
                onChange={setCustomSocials}
                addLabel="Add custom icon"
                emptyItem={{ ...emptyCustomSocial }}
                fields={[
                  { key: 'iconCode', label: 'Icon code', placeholder: 'globe' },
                  { key: 'label', label: 'Title', placeholder: 'Website' },
                  { key: 'href', label: 'URL', placeholder: 'https://...' },
                ]}
              />
            </div>
          )}

          {activeTab === 'contact-page' && (
            <div className={styles.tabPanel} role="tabpanel">
              <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>
                Contact page
              </h2>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Hero eyebrow</label>
                  <input
                    value={contact.heroEyebrow}
                    onChange={(e) => setContact({ ...contact, heroEyebrow: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>Hero headline</label>
                  <input
                    value={contact.heroHeadline}
                    onChange={(e) => setContact({ ...contact, heroHeadline: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label>Hero description</label>
                <RichTextEditor
                  value={contact.heroSubline}
                  onChange={(html) => setContact({ ...contact, heroSubline: html })}
                />
              </div>
              <ImageField
                label="Contact hero image"
                value={contact.heroImage}
                onChange={(url) => setContact({ ...contact, heroImage: url })}
                folder="contact"
              />
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Info eyebrow</label>
                  <input
                    value={contact.infoEyebrow}
                    onChange={(e) => setContact({ ...contact, infoEyebrow: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>Info heading</label>
                  <input
                    value={contact.infoHeading}
                    onChange={(e) => setContact({ ...contact, infoHeading: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label>Response note</label>
                <RichTextEditor
                  value={contact.responseNote}
                  onChange={(html) => setContact({ ...contact, responseNote: html })}
                />
              </div>
              <ListEditor
                label="Business hours"
                items={contact.businessHours}
                onChange={(businessHours) => setContact({ ...contact, businessHours })}
                addLabel="Add hours row"
                emptyItem={{ ...emptyHours }}
                fields={[
                  { key: 'day', label: 'Day', placeholder: 'Monday – Saturday' },
                  { key: 'hours', label: 'Hours', placeholder: '7:00 AM – 6:00 PM' },
                ]}
              />
            </div>
          )}

          {activeTab === 'map' && (
            <div className={styles.tabPanel} role="tabpanel">
              <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>
                Google Map
              </h2>
              <p className={styles.muted}>Paste the Google Maps embed URL (iframe src), not the share link.</p>
              <div className={styles.field}>
                <label>Embed URL (src)</label>
                <input
                  value={map.embedSrc}
                  onChange={(e) => setMap({ ...map, embedSrc: e.target.value })}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Map title</label>
                  <input value={map.title} onChange={(e) => setMap({ ...map, title: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label>Map subtitle</label>
                  <input value={map.subtitle} onChange={(e) => setMap({ ...map, subtitle: e.target.value })} />
                </div>
              </div>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Directions link</label>
                  <input
                    value={map.directionsLink}
                    onChange={(e) => setMap({ ...map, directionsLink: e.target.value })}
                  />
                </div>
                <div className={styles.field}>
                  <label>Directions label</label>
                  <input
                    value={map.directionsLabel}
                    onChange={(e) => setMap({ ...map, directionsLabel: e.target.value })}
                  />
                </div>
              </div>
              {map.embedSrc ? (
                <div className={styles.field}>
                  <label>Preview</label>
                  <iframe
                    title="Map preview"
                    src={map.embedSrc}
                    style={{ width: '100%', minHeight: 240, border: 0, borderRadius: 8 }}
                    loading="lazy"
                  />
                </div>
              ) : null}
            </div>
          )}

          {activeTab === 'menus' && (
            <div className={styles.tabPanel} role="tabpanel">
              <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>
                Header CTA button
              </h2>
              <div className={styles.fieldRow}>
                <div className={styles.field}>
                  <label>Button label</label>
                  <input value={navCTA.label} onChange={(e) => setNavCTA({ ...navCTA, label: e.target.value })} />
                </div>
                <div className={styles.field}>
                  <label>Button link</label>
                  <input value={navCTA.path} onChange={(e) => setNavCTA({ ...navCTA, path: e.target.value })} />
                </div>
              </div>

              <h2 className={styles.sectionTitle}>Top utility links</h2>
              <ListEditor
                label="Utility bar links"
                items={utilityNav}
                onChange={setUtilityNav}
                addLabel="Add utility link"
                emptyItem={{ ...emptyLink }}
                fields={[
                  { key: 'label', label: 'Label' },
                  { key: 'path', label: 'Path', placeholder: '/about/mass-times' },
                ]}
              />

              <h2 className={styles.sectionTitle}>Main menu</h2>
              <p className={styles.muted}>
                Edit labels, paths, and dropdown children. Use ↑ ↓ to reorder top-level items and dropdowns.
              </p>
              <div className={styles.listEditor}>
                {primaryNav.map((item, index) => (
                  <div key={`nav-${index}`} className={styles.listEditorRow}>
                    <div>
                      <div className={styles.listEditorFields}>
                        <div className={styles.field}>
                          <label>Menu label</label>
                          <input
                            value={item.label}
                            onChange={(e) => updateNavItem(index, { label: e.target.value })}
                          />
                        </div>
                        <div className={styles.field}>
                          <label>Path</label>
                          <input
                            value={item.path}
                            onChange={(e) => updateNavItem(index, { path: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className={styles.nestedCard}>
                        <ListEditor
                          label="Dropdown items"
                          items={item.children || []}
                          onChange={(children) => updateNavChildren(index, children)}
                          addLabel="Add dropdown item"
                          emptyItem={{ ...emptyNavChild }}
                          fields={[
                            { key: 'label', label: 'Label' },
                            { key: 'path', label: 'Path' },
                          ]}
                        />
                      </div>
                    </div>
                    <div className={styles.listEditorControls}>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnSecondary}`}
                        onClick={() =>
                          setPrimaryNav((prev) => {
                            if (index === 0) return prev
                            const next = [...prev]
                            ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
                            return next
                          })
                        }
                        disabled={index === 0}
                        aria-label="Move menu item up"
                      >
                        ↑
                      </button>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnSecondary}`}
                        onClick={() =>
                          setPrimaryNav((prev) => {
                            if (index >= prev.length - 1) return prev
                            const next = [...prev]
                            ;[next[index + 1], next[index]] = [next[index], next[index + 1]]
                            return next
                          })
                        }
                        disabled={index === primaryNav.length - 1}
                        aria-label="Move menu item down"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDanger}`}
                        onClick={async () => {
                          if (!(await confirmDelete('Remove this menu item?', { confirmLabel: 'Remove' }))) return
                          setPrimaryNav((prev) => prev.filter((_, i) => i !== index))
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  type="button"
                  className={`${styles.btn} ${styles.btnSecondary}`}
                  onClick={() => setPrimaryNav((prev) => [...prev, { ...emptyNavItem, children: [] }])}
                >
                  Add menu item
                </button>
              </div>

              <h2 className={styles.sectionTitle}>Footer links</h2>
              <ListEditor
                label="Useful links"
                items={footerLinks}
                onChange={setFooterLinks}
                addLabel="Add footer link"
                emptyItem={{ ...emptyLink }}
                fields={[
                  { key: 'label', label: 'Label' },
                  { key: 'path', label: 'Path' },
                ]}
              />
              <ListEditor
                label="Pilgrimage / quick service links"
                items={footerServiceLinks}
                onChange={setFooterServiceLinks}
                addLabel="Add link"
                emptyItem={{ ...emptyLink }}
                fields={[
                  { key: 'label', label: 'Label' },
                  { key: 'path', label: 'Path' },
                ]}
              />
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}
          <button className={styles.btn} type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save settings'}
          </button>
        </form>
      </div>
    </div>
  )
}
