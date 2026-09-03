import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { fetchSettings, updateSettings } from '@api/cms'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import {
  footerLinks as fallbackFooterLinks,
  footerServiceLinks as fallbackFooterServiceLinks,
  primaryNav as fallbackPrimaryNav,
  utilityNav as fallbackUtilityNav,
  isStaleUtilityNav,
  ensureOurLadyNavChildren,
} from '@data/navigation'
import FlashMessage from './components/FlashMessage'
import LocaleTabs from './components/LocaleTabs'
import MenuTreeEditor from './components/MenuTreeEditor'
import { ensureNavIds, persistNavItems } from './menuUtils'
import styles from './admin.module.css'

const LOCATIONS = [
  {
    id: 'main',
    label: 'Main menu',
    title: 'Main menu',
    hint: 'This is the primary navigation under the logo (Notre-Dame, Le Sanctuaire, Pèlerinage, …). Top-level items can have dropdown submenus.',
  },
  {
    id: 'header',
    label: 'Top header',
    title: 'Top header menu',
    hint: 'Links in the dark bar above the logo. The Donate button on the right is managed under Site buttons.',
  },
  {
    id: 'footer',
    label: 'Footer',
    title: 'Footer menus',
    hint: 'Two columns at the bottom of every page: Quick links and Explore. These lists have no dropdowns.',
  },
]

export default function MenusAdminPage() {
  const { refresh } = useContent()
  const { defaultLocale } = useLocale()
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('location')
  const locationId = LOCATIONS.some((item) => item.id === requested) ? requested : 'main'
  const location = LOCATIONS.find((item) => item.id === locationId) || LOCATIONS[0]

  const [menuLocale, setMenuLocale] = useState(defaultLocale || 'en')
  const [primaryNav, setPrimaryNav] = useState([])
  const [utilityNav, setUtilityNav] = useState([])
  const [footerLinks, setFooterLinks] = useState([])
  const [footerServiceLinks, setFooterServiceLinks] = useState([])
  const [error, setError] = useState('')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setMenuLocale(defaultLocale || 'en')
  }, [defaultLocale])

  useEffect(() => {
    fetchSettings()
      .then((data) => {
        const navigation = data.navigation || {}
        setPrimaryNav(
          ensureNavIds(
            ensureOurLadyNavChildren(
              navigation.primaryNav?.length ? navigation.primaryNav : fallbackPrimaryNav,
            ),
          ),
        )
        setUtilityNav(
          ensureNavIds(
            navigation.utilityNav?.length && !isStaleUtilityNav(navigation.utilityNav)
              ? navigation.utilityNav
              : fallbackUtilityNav,
          ),
        )
        setFooterLinks(ensureNavIds(navigation.footerLinks?.length ? navigation.footerLinks : fallbackFooterLinks))
        setFooterServiceLinks(
          ensureNavIds(
            navigation.footerServiceLinks?.length ? navigation.footerServiceLinks : fallbackFooterServiceLinks,
          ),
        )
      })
      .catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load menus' }))
  }, [])

  const selectLocation = (id) => {
    const next = new URLSearchParams(searchParams)
    next.set('location', id)
    setSearchParams(next, { replace: true })
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    setFlash({ type: 'success', message: '' })
    try {
      const current = await fetchSettings()
      const navigation = current?.navigation || {}
      await updateSettings({
        navigation: {
          ...navigation,
          primaryNav: persistNavItems(primaryNav),
          utilityNav: persistNavItems(utilityNav),
          footerLinks: persistNavItems(footerLinks),
          footerServiceLinks: persistNavItems(footerServiceLinks),
        },
      })
      await refresh?.()
      setFlash({ type: 'success', message: 'Menus saved. The public site will use this structure.' })
    } catch (err) {
      const message = err.message || 'Save failed'
      setError(message)
      setFlash({ type: 'error', message })
    } finally {
      setSaving(false)
    }
  }

  const locationLabel = useMemo(() => location.title, [location])

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Site menus</h1>
        <button className={styles.btn} type="button" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save menus'}
        </button>
      </div>
      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <div className={styles.tabs} role="tablist" aria-label="Menu locations">
        {LOCATIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={item.id === locationId}
            className={`${styles.tab} ${item.id === locationId ? styles.tabActive : ''}`}
            onClick={() => selectLocation(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div>
        <div className={styles.menuLocationBanner} role="status">
          <p className={styles.menuLocationKicker}>You are editing</p>
          <h2>{locationLabel}</h2>
          <p>{location.hint}</p>
        </div>

        <LocaleTabs value={menuLocale} onChange={setMenuLocale} defaultLocale={defaultLocale} />
        <p className={styles.muted}>
          There is one menu and one URL per page for every language. Pick a page from the list — the path is
          filled automatically and reused in Ikinyarwanda, Français, English, and Deutsch. Labels follow
          Translations; type a label only if the automatic text is wrong.
        </p>

        {locationId === 'main' ? (
          <MenuTreeEditor
            items={primaryNav}
            onChange={setPrimaryNav}
            allowChildren
            locale={menuLocale}
            defaultLocale={defaultLocale}
            addTitle="Add to the main menu"
            pathPlaceholder="/our-lady"
          />
        ) : null}

        {locationId === 'header' ? (
          <>
            <div className={styles.card} style={{ marginBottom: '1rem' }}>
              <h2 className={styles.sectionTitle} style={{ marginTop: 0 }}>
                Header Donate button
              </h2>
              <p className={styles.muted}>
                Links on the dark top bar (View Calendar, Plan Your Pilgrimage). The white Donate button is
                managed in <Link to="/admin/buttons">Site buttons</Link>. The left side shows the shrine
                address (or a live event when one is running).
              </p>
            </div>
            <MenuTreeEditor
              items={utilityNav}
              onChange={setUtilityNav}
              locale={menuLocale}
              defaultLocale={defaultLocale}
              addTitle="Add a top header link"
              pathPlaceholder="/pilgrimage/calendar"
            />
          </>
        ) : null}

        {locationId === 'footer' ? (
          <div className={styles.menuFooterColumns}>
            <div>
              <h2 className={styles.sectionTitle}>Quick links</h2>
              <MenuTreeEditor
                items={footerLinks}
                onChange={setFooterLinks}
                locale={menuLocale}
                defaultLocale={defaultLocale}
                addTitle="Add a quick link"
                pathPlaceholder="/contact"
              />
            </div>
            <div>
              <h2 className={styles.sectionTitle}>Explore</h2>
              <MenuTreeEditor
                items={footerServiceLinks}
                onChange={setFooterServiceLinks}
                locale={menuLocale}
                defaultLocale={defaultLocale}
                addTitle="Add an Explore link"
                pathPlaceholder="/pilgrimage/plan"
              />
            </div>
          </div>
        ) : null}

        {error ? <p className={styles.error}>{error}</p> : null}
        <button className={styles.btn} type="button" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving…' : 'Save menus'}
        </button>
      </div>
    </div>
  )
}
