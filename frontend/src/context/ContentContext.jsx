import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import {
  fetchActivities,
  fetchBlogPosts,
  fetchPages,
  fetchProjects,
  fetchServices,
  fetchSettings,
  fetchUpcomingPilgrimages,
} from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import { company as fallbackCompany } from '@data/company'
import { services as fallbackServices } from '@data/services'
import { projects as fallbackProjects } from '@data/projects'
import { blogPosts as fallbackBlogPosts, blogAuthors as fallbackAuthors } from '@data/blog'
import { activities as fallbackActivities } from '@data/activities'
import { upcomingPilgrimages as fallbackUpcomingPilgrimages } from '@data/upcomingPilgrimages'
import {
  primaryNav as fallbackPrimaryNav,
  footerLinks as fallbackFooterLinks,
  footerServiceLinks as fallbackFooterServiceLinks,
  navCTA as fallbackNavCTA,
  utilityNav as fallbackUtilityNav,
  ensureBroadcastNav,
  ensureOurLadyNavChildren,
  ensureOurLadyNavPath,
  ensureNewsNavChildren,
  isStaleUtilityNav,
  normalizeNavGivePaths,
  normalizeGiveNavPath,
  stripShrineMapFromNav,
} from '@data/navigation'
import { resolveNavLabel } from '@i18n/navKeys'
import {
  contactHero,
  contactInfo,
  contactMap,
  contactFormLabels,
} from '@data/contact'
import { offerings as fallbackOfferings } from '@data/offerings'
import { defaultSiteButtons } from '@data/siteButtons'
import {
  footerCtaContent,
  involveStoryContent,
  mergeSiteButtons,
  navDonateButton,
} from '@utils/siteButtons'
import {
  applyFavicon,
  isStaleBrandAsset,
  resolveFavicon,
  resolveLogo,
  resolvePreloaderLogo,
} from '@utils/brand'
import { applyThemeToDocument, normalizeTheme, DEFAULT_THEME } from '@utils/theme'
import { firstUsableImage, parseRemovedAssetSet } from '@utils/siteImages'

const ContentContext = createContext(null)

function pageContent(pages, key, fallback = {}) {
  return pages?.[key]?.content ?? fallback
}

/** Prefer local ToR nav when API settings still use the old About/Activities IA */
function isStalePrimaryNav(apiPrimary) {
  if (!Array.isArray(apiPrimary) || !apiPrimary.length) return true
  const labels = apiPrimary.map((item) => String(item?.label || '').toLowerCase())
  const hasTorPillars =
    (labels.some((l) => l.includes('our lady')) || labels.some((l) => l.includes('shrine'))) &&
    labels.some((l) => l.includes('pilgrimage')) &&
    labels.some((l) => l.includes('spirituality'))
  if (!hasTorPillars) {
    return (
      labels.includes('about') ||
      labels.includes('activities') ||
      labels.includes('publications') ||
      labels.includes('hotels') ||
      labels.includes('contact') ||
      labels.includes('support us')
    )
  }

  const newsItem = apiPrimary.find((item) => {
    const path = String(item?.path || '').replace(/\/+$/, '') || '/'
    const label = String(item?.label || '').toLowerCase()
    return path === '/news' || label === 'news'
  })
  const newsChildren = Array.isArray(newsItem?.children) ? newsItem.children : []
  const broadcastNestedInNews = newsChildren.some((child) => {
    const path = String(child?.path || '').replace(/\/+$/, '') || '/'
    const label = String(child?.label || '').toLowerCase()
    return path === '/news/broadcast' || label === 'broadcast' || path === '/news/audio'
  })
  const hasBroadcastPillar = labels.some((l) => l === 'broadcast')
  if (broadcastNestedInNews || !hasBroadcastPillar) return true

  const shrineItem = apiPrimary.find((item) => {
    const path = String(item?.path || '').replace(/\/+$/, '') || '/'
    const label = String(item?.label || '').toLowerCase()
    return path === '/shrine' || label.includes('shrine')
  })
  const shrineChildren = Array.isArray(shrineItem?.children) ? shrineItem.children : []
  const hasShrineMap = shrineChildren.some((child) => String(child?.path || '').includes('/shrine/map'))
  if (hasShrineMap) return true

  return false
}

function translateNav(items, t, locale, defaultLocale) {
  if (!Array.isArray(items)) return items
  return items.map((item) => {
    const next = {
      ...item,
      label: resolveNavLabel(item, t, locale, defaultLocale),
    }
    if (Array.isArray(item.children)) {
      next.children = translateNav(item.children, t, locale, defaultLocale)
    }
    return next
  })
}

export function ContentProvider({ children }) {
  const { locale, defaultLocale, t, ready: localeReady } = useLocale()
  const [settings, setSettings] = useState({})
  const [services, setServices] = useState([])
  const [projects, setProjects] = useState([])
  const [blogPosts, setBlogPosts] = useState([])
  const [activities, setActivities] = useState([])
  const [upcomingPilgrimages, setUpcomingPilgrimages] = useState([])
  const [pages, setPages] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [fromApi, setFromApi] = useState(false)

  const load = useCallback(async (activeLocale) => {
    setLoading(true)
    setError(null)
    const params = activeLocale ? { locale: activeLocale } : {}
    try {
      const [
        settingsData,
        servicesData,
        projectsData,
        blogData,
        activitiesData,
        pilgrimagesData,
        pagesData,
      ] = await Promise.all([
        fetchSettings(),
        fetchServices(params),
        fetchProjects(params),
        fetchBlogPosts(params),
        fetchActivities(params),
        fetchUpcomingPilgrimages(params),
        fetchPages(params),
      ])
      setSettings(settingsData || {})
      setServices(servicesData || [])
      setProjects(projectsData || [])
      setBlogPosts(blogData || [])
      setActivities(activitiesData || [])
      setUpcomingPilgrimages(pilgrimagesData || [])
      setPages(pagesData || {})
      setFromApi(true)
    } catch (err) {
      setError(err)
      setFromApi(false)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!localeReady) return
    load(locale)
  }, [locale, localeReady, load])

  const theme = useMemo(
    () => normalizeTheme(settings.theme || DEFAULT_THEME),
    [settings.theme]
  )

  useEffect(() => {
    applyThemeToDocument(theme)
  }, [theme])

  useEffect(() => {
    applyFavicon(resolveFavicon(settings.company || fallbackCompany))
  }, [settings.company])

  const value = useMemo(() => {
    const rawCompany = settings.company || fallbackCompany
    const company = {
      ...fallbackCompany,
      ...rawCompany,
      name:
        locale !== defaultLocale && t('brand.name')
          ? t('brand.name')
          : !rawCompany.name ||
              rawCompany.name === 'Kibeho Sanctuary' ||
              /^Kibeho Sanctuary$/i.test(rawCompany.name) ||
              isStaleBrandAsset(rawCompany.name)
            ? fallbackCompany.name
            : rawCompany.name,
      tagline:
        locale !== defaultLocale && t('placeOfFaith')
          ? t('placeOfFaith')
          : !rawCompany.tagline ||
              rawCompany.tagline === 'Shrine of Our Lady of Kibeho' ||
              isStaleBrandAsset(rawCompany.tagline)
            ? fallbackCompany.tagline
            : rawCompany.tagline,
      shortName: rawCompany.shortName || fallbackCompany.shortName,
      logo: resolveLogo(rawCompany),
      favicon: resolveFavicon(rawCompany),
      preloaderLogo: resolvePreloaderLogo(rawCompany),
    }
    const navigation = settings.navigation || {}
    const contact = settings.contact || {}

    const removedAssets = parseRemovedAssetSet(settings)
    const defaultHeaderImage = firstUsableImage(
      [pageContent(pages, 'headers.default').backgroundImage],
      removedAssets,
    )
    const defaultFooterContent = pageContent(pages, 'footers.default')
    const defaultFooterImage = firstUsableImage(
      [defaultFooterContent.backgroundImage],
      removedAssets,
    )
    const defaultFooterImageAlt = defaultFooterContent.alt || ''

    const resolvedActivities = activities.length ? activities : fallbackActivities
    const resolvedPilgrimages = upcomingPilgrimages.length
      ? upcomingPilgrimages
      : fallbackUpcomingPilgrimages

    const apiPrimary = navigation.primaryNav
    const apiNavIsStale = isStalePrimaryNav(apiPrimary)
    const primaryNavRaw =
      Array.isArray(apiPrimary) && apiPrimary.length && !apiNavIsStale
        ? apiPrimary
        : fallbackPrimaryNav

    const footerLinksRaw = apiNavIsStale
      ? fallbackFooterLinks
      : navigation.footerLinks || fallbackFooterLinks
    const footerServiceLinksRaw = apiNavIsStale
      ? fallbackFooterServiceLinks
      : navigation.footerServiceLinks || fallbackFooterServiceLinks

    const navCTARaw = navigation.navCTA || fallbackNavCTA
    const siteButtons = mergeSiteButtons(settings.siteButtons || {})
    const navDonate = navDonateButton(siteButtons, locale, defaultLocale, t)
    const utilityNavRaw =
      Array.isArray(navigation.utilityNav) &&
      navigation.utilityNav.length &&
      !apiNavIsStale &&
      !isStaleUtilityNav(navigation.utilityNav)
        ? navigation.utilityNav
        : fallbackUtilityNav

    return {
      loading,
      error,
      fromApi,
      refresh: () => load(locale),
      company,
      primaryNav: translateNav(
        stripShrineMapFromNav(
          normalizeNavGivePaths(
            ensureBroadcastNav(
              ensureNewsNavChildren(ensureOurLadyNavPath(ensureOurLadyNavChildren(primaryNavRaw))),
            ),
          ),
        ),
        t,
        locale,
        defaultLocale,
      ),
      utilityNav: translateNav(normalizeNavGivePaths(utilityNavRaw), t, locale, defaultLocale),
      footerLinks: translateNav(normalizeNavGivePaths(footerLinksRaw), t, locale, defaultLocale),
      footerServiceLinks: translateNav(normalizeNavGivePaths(footerServiceLinksRaw), t, locale, defaultLocale),
      navCTA: {
        ...navCTARaw,
        path: normalizeGiveNavPath(navDonate.path || navCTARaw.path) || '/support/get-involved',
        label: navDonate.label,
      },
      siteButtons,
      footerCta: footerCtaContent(siteButtons, locale, defaultLocale, t),
      involveStory: involveStoryContent(siteButtons, locale, defaultLocale, t),
      contactHero: contact.hero || contactHero,
      contactInfo: contact.info || contactInfo,
      contactMap: contact.map || contactMap,
      contactFormLabels: {
        ...contactFormLabels,
        name: t('name'),
        email: t('email'),
        phone: t('phone'),
        message: t('message'),
        submit: t('sendMessage'),
      },
      offerings: { ...fallbackOfferings, ...(settings.offerings || {}) },
      services: services.length ? services : fallbackServices,
      projects: projects.length ? projects : fallbackProjects,
      activities: resolvedActivities,
      upcomingPilgrimages: resolvedPilgrimages,
      blogPosts: blogPosts.length
        ? blogPosts.map((post) => ({
            ...post,
            authorId: post.author?.name,
            tags: post.tags || [],
            comments: post.comments || [],
            content: post.body
              ? [{ type: 'html', html: post.body }]
              : post.content || [],
            author: post.author
              ? { ...post.author, socials: post.author.socials || [] }
              : post.author,
          }))
        : fallbackBlogPosts,
      blogAuthors: fallbackAuthors,
      pages,
      defaultHeaderImage,
      defaultFooterImage,
      defaultFooterImageAlt,
      resolveHeaderImage: (pageImage, fallback) =>
        firstUsableImage([pageImage, defaultHeaderImage, fallback], removedAssets),
      resolveFooterImage: (pageImage, fallback) =>
        firstUsableImage(
          [pageImage, defaultFooterImage, fallback, defaultHeaderImage],
          removedAssets,
        ),
      section: (key, fallback = {}) => pageContent(pages, key, fallback),
      theme,
      locale,
    }
  }, [
    settings,
    services,
    projects,
    blogPosts,
    activities,
    upcomingPilgrimages,
    pages,
    loading,
    error,
    fromApi,
    theme,
    t,
    locale,
    defaultLocale,
    load,
  ])

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
}

export function useContent() {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent must be used within ContentProvider')
  return ctx
}
