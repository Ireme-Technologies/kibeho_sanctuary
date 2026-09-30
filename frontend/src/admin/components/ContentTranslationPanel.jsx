import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPages, fetchSettings, updatePageSection, updateSettings } from '@api/cms'
import {
  footerLinks as fallbackFooterLinks,
  footerServiceLinks as fallbackFooterServiceLinks,
  primaryNav as fallbackPrimaryNav,
  utilityNav as fallbackUtilityNav,
  isStaleUtilityNav,
  ensureOurLadyNavChildren,
  stripPrayerIntentionsFromNav,
} from '@data/navigation'
import { pathForSectionKey } from '@data/pages/registry'
import {
  ensureNavIds,
  findNavNode,
  flattenNav,
  navLabelForLocale,
  persistNavItems,
  setNavLabelForLocale,
  updateNavNode,
} from '../menuUtils'
import styles from '../admin.module.css'

const PAGE_FIELDS = [
  { key: 'title', label: 'Header title' },
  { key: 'subtitle', label: 'Subtitle' },
  { key: 'intro', label: 'Introduction' },
]

function isPageKey(key) {
  return key && !key.startsWith('headers.') && !key.startsWith('footers.') && key !== 'home.hero'
}

function readPageField(section, field, locale, defaultLocale) {
  if (locale === defaultLocale) return section?.content?.[field] || ''
  return section?.translations?.[locale]?.content?.[field] || ''
}

function writePageField(section, field, locale, value, defaultLocale) {
  if (locale === defaultLocale) {
    return {
      ...section,
      content: { ...(section.content || {}), [field]: value },
    }
  }
  const translations = { ...(section.translations || {}) }
  const pack = { ...(translations[locale] || {}) }
  const content = { ...(pack.content || {}) }
  if (!String(value || '').trim()) delete content[field]
  else content[field] = value
  if (Object.keys(content).length) pack.content = content
  else delete pack.content
  if (Object.keys(pack).length) translations[locale] = pack
  else delete translations[locale]
  return { ...section, translations }
}

function pageHaystack(section, key, locales, defaultLocale) {
  const parts = [key, section?.label || '', pathForSectionKey(key) || '']
  locales.forEach((locale) => {
    PAGE_FIELDS.forEach((field) => {
      parts.push(readPageField(section, field.key, locale.code, defaultLocale))
    })
  })
  return parts.join(' ').toLowerCase()
}

function loadMenus(navigation) {
  return {
    primaryNav: ensureNavIds(
      stripPrayerIntentionsFromNav(
        ensureOurLadyNavChildren(navigation.primaryNav?.length ? navigation.primaryNav : fallbackPrimaryNav),
      ),
    ),
    utilityNav: ensureNavIds(
      navigation.utilityNav?.length && !isStaleUtilityNav(navigation.utilityNav)
        ? navigation.utilityNav
        : fallbackUtilityNav,
    ),
    footerLinks: ensureNavIds(navigation.footerLinks?.length ? navigation.footerLinks : fallbackFooterLinks),
    footerServiceLinks: ensureNavIds(
      navigation.footerServiceLinks?.length ? navigation.footerServiceLinks : fallbackFooterServiceLinks,
    ),
  }
}

function menuSnapshot(menus) {
  return JSON.stringify({
    primaryNav: persistNavItems(menus.primaryNav),
    utilityNav: persistNavItems(menus.utilityNav),
    footerLinks: persistNavItems(menus.footerLinks),
    footerServiceLinks: persistNavItems(menus.footerServiceLinks),
  })
}

export default function ContentTranslationPanel({
  area,
  languages,
  defaultLocale,
  onDirtyChange,
  saveRef,
}) {
  const [menus, setMenus] = useState(null)
  const [pages, setPages] = useState(null)
  const [menuSaved, setMenuSaved] = useState('')
  const [pagesSaved, setPagesSaved] = useState('')
  const [query, setQuery] = useState('')
  const [pageKey, setPageKey] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const locales = languages?.length ? languages : []

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    Promise.all([fetchSettings(), fetchPages()])
      .then(([settings, pageData]) => {
        if (cancelled) return
        const nextMenus = loadMenus(settings?.navigation || {})
        const nextPages = Object.fromEntries(
          Object.entries(pageData || {}).filter(([key]) => isPageKey(key)),
        )
        setMenus(nextMenus)
        setPages(nextPages)
        setMenuSaved(menuSnapshot(nextMenus))
        setPagesSaved(JSON.stringify(nextPages))
        const first = Object.keys(nextPages).sort()[0] || ''
        setPageKey((current) => (current && nextPages[current] ? current : first))
        setError('')
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Failed to load translations')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const menusDirty = Boolean(menus && menuSaved && menuSnapshot(menus) !== menuSaved)
  const pagesDirty = Boolean(pages && pagesSaved && JSON.stringify(pages) !== pagesSaved)
  const dirty = menusDirty || pagesDirty

  useEffect(() => {
    onDirtyChange?.(dirty)
  }, [dirty, onDirtyChange])

  const save = async () => {
    setSaving(true)
    setError('')
    try {
      if (menusDirty) {
        const current = await fetchSettings()
        const navigation = current?.navigation || {}
        await updateSettings({
          navigation: {
            ...navigation,
            primaryNav: persistNavItems(menus.primaryNav),
            utilityNav: persistNavItems(menus.utilityNav),
            footerLinks: persistNavItems(menus.footerLinks),
            footerServiceLinks: persistNavItems(menus.footerServiceLinks),
          },
        })
        setMenuSaved(menuSnapshot(menus))
      }
      if (pagesDirty) {
        const previous = JSON.parse(pagesSaved || '{}')
        const changed = Object.keys(pages).filter(
          (key) => JSON.stringify(pages[key]) !== JSON.stringify(previous[key]),
        )
        await Promise.all(
          changed.map((key) =>
            updatePageSection(key, {
              label: pages[key].label || key,
              content: pages[key].content || {},
              translations: pages[key].translations || {},
            }),
          ),
        )
        setPagesSaved(JSON.stringify(pages))
      }
    } catch (err) {
      setError(err.message || 'Save failed')
      throw err
    } finally {
      setSaving(false)
    }
  }

  if (saveRef) saveRef.current = save

  const q = query.trim().toLowerCase()

  const pageKeys = useMemo(() => {
    return Object.keys(pages || {})
      .filter((key) => {
        if (!q) return true
        return pageHaystack(pages[key], key, locales, defaultLocale).includes(q)
      })
      .sort((a, b) => (pages[a]?.label || a).localeCompare(pages[b]?.label || b))
  }, [pages, q, locales, defaultLocale])

  const selectedPageKey = pageKeys.includes(pageKey) ? pageKey : pageKeys[0] || ''

  const setMenuLabel = (bucket, id, locale, value) => {
    setMenus((current) => {
      const item = findNavNode(current[bucket], id)
      if (!item) return current
      return {
        ...current,
        [bucket]: updateNavNode(current[bucket], id, setNavLabelForLocale(item, locale, value, defaultLocale)),
      }
    })
  }

  const patchPage = (key, field, locale, value) => {
    setPages((current) => ({
      ...current,
      [key]: writePageField(current[key], field, locale, value, defaultLocale),
    }))
  }

  if (loading) return <p className={styles.muted}>Loading…</p>
  if (!menus || !pages) return error ? <p className={styles.error}>{error}</p> : null

  const menuGroups = [
    { id: 'primaryNav', title: 'Main menu', items: menus.primaryNav },
    { id: 'utilityNav', title: 'Top header', items: menus.utilityNav },
    { id: 'footerLinks', title: 'Footer — Quick links', items: menus.footerLinks },
    { id: 'footerServiceLinks', title: 'Footer — Explore', items: menus.footerServiceLinks },
  ]

  return (
    <div>
      <div className={styles.card} style={{ marginBottom: '1rem' }}>
        <div className={styles.field}>
          <label>{area === 'menus' ? 'Search a menu word' : 'Search a page or word'}</label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={area === 'menus' ? 'Pilgrimage, Umwibutso, /shrine…' : 'Spirituality, header title, /pilgrimage…'}
          />
        </div>
      </div>

      {area === 'menus' ? (
        menuGroups.map((group) => {
          const rows = flattenNav(group.items).filter((row) => {
            if (!q) return true
            const labels = locales.map((locale) => navLabelForLocale(row.item, locale.code, defaultLocale))
            return [row.item.label, row.item.path, ...labels].join(' ').toLowerCase().includes(q)
          })
          return (
            <section key={group.id} className={`${styles.card} ${styles.i18nTable}`} style={{ marginBottom: '1rem' }}>
              <h2 className={styles.sectionTitle}>{group.title}</h2>
              {!rows.length ? <p className={styles.muted}>No menu labels match.</p> : null}
              {rows.length ? (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Menu item</th>
                      {locales.map((locale) => (
                        <th key={locale.code}>
                          {locale.flag} {locale.nativeLabel || locale.label}
                          {locale.code === defaultLocale ? ' · default' : ''}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.item._id}>
                        <td>
                          <strong style={{ paddingLeft: `${row.depth * 0.85}rem`, display: 'inline-block' }}>
                            {row.item.label || row.item.path || 'Untitled'}
                          </strong>
                          <div className={styles.menuHint}>{row.item.path}</div>
                        </td>
                        {locales.map((locale) => {
                          const value = navLabelForLocale(row.item, locale.code, defaultLocale)
                          return (
                            <td key={locale.code}>
                              <input
                                className={!String(value).trim() && locale.code !== defaultLocale ? styles.i18nEmpty : undefined}
                                value={value}
                                placeholder={locale.code === defaultLocale ? 'Label' : 'Empty — uses the default label'}
                                onChange={(e) => setMenuLabel(group.id, row.item._id, locale.code, e.target.value)}
                              />
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : null}
            </section>
          )
        })
      ) : null}

      {area === 'headers' ? (
        <div className={`${styles.card} ${styles.i18nTable}`}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Page</th>
                {locales.map((locale) => (
                  <th key={locale.code}>
                    {locale.flag} {locale.nativeLabel || locale.label}
                    {locale.code === defaultLocale ? ' · default' : ''}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageKeys.map((key) => (
                <tr key={key}>
                  <td>
                    <strong>{pages[key]?.label || key}</strong>
                    <div className={styles.menuHint}>{pathForSectionKey(key) || key}</div>
                  </td>
                  {locales.map((locale) => {
                    const value = readPageField(pages[key], 'title', locale.code, defaultLocale)
                    return (
                      <td key={locale.code}>
                        <input
                          className={!String(value).trim() && locale.code !== defaultLocale ? styles.i18nEmpty : undefined}
                          value={value}
                          placeholder={locale.code === defaultLocale ? 'Header title' : 'Empty — uses the default title'}
                          onChange={(e) => patchPage(key, 'title', locale.code, e.target.value)}
                        />
                      </td>
                    )
                  })}
                </tr>
              ))}
              {!pageKeys.length ? (
                <tr>
                  <td colSpan={locales.length + 1} className={styles.muted}>
                    No pages match that search.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      ) : null}

      {area === 'page' ? (
        <div className={`${styles.card} ${styles.i18nTable}`}>
          <div className={styles.field} style={{ marginBottom: '1rem' }}>
            <label>Page</label>
            <select value={selectedPageKey} onChange={(e) => setPageKey(e.target.value)}>
              {pageKeys.map((key) => (
                <option key={key} value={key}>
                  {(pages[key]?.label || key) + (pathForSectionKey(key) ? ` — ${pathForSectionKey(key)}` : '')}
                </option>
              ))}
            </select>
          </div>
          {selectedPageKey && pages[selectedPageKey] ? (
            <>
              <p className={styles.muted}>
                These are the header and introduction for this page. Longer body text stays in{' '}
                <Link to="/admin/pages">Pages</Link>.
              </p>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Field</th>
                    {locales.map((locale) => (
                      <th key={locale.code}>
                        {locale.flag} {locale.nativeLabel || locale.label}
                        {locale.code === defaultLocale ? ' · default' : ''}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {PAGE_FIELDS.map((field) => (
                    <tr key={field.key}>
                      <td>
                        <strong>{field.label}</strong>
                      </td>
                      {locales.map((locale) => {
                        const value = readPageField(pages[selectedPageKey], field.key, locale.code, defaultLocale)
                        const long = field.key === 'intro'
                        return (
                          <td key={locale.code}>
                            {long ? (
                              <textarea
                                rows={4}
                                className={!String(value).trim() && locale.code !== defaultLocale ? styles.i18nEmpty : undefined}
                                value={value}
                                onChange={(e) => patchPage(selectedPageKey, field.key, locale.code, e.target.value)}
                              />
                            ) : (
                              <input
                                className={!String(value).trim() && locale.code !== defaultLocale ? styles.i18nEmpty : undefined}
                                value={value}
                                placeholder={locale.code === defaultLocale ? field.label : 'Empty — uses the default text'}
                                onChange={(e) => patchPage(selectedPageKey, field.key, locale.code, e.target.value)}
                              />
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <p className={styles.muted}>No page matches that search.</p>
          )}
        </div>
      ) : null}

      {error ? <p className={styles.error}>{error}</p> : null}
      {saving ? <p className={styles.muted}>Saving…</p> : null}
    </div>
  )
}
