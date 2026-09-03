import { getPageFallback } from '@data/pages/content'
import { pathForSectionKey } from '@data/pages/registry'
import { mergePageContent } from '@data/pages/mergePageContent'
import {
  homeActivities,
  homeWelcome,
  partners,
  quickLinks,
  shrineHighlights,
  whyVisit,
  accommodationHelp,
} from '@data/home/sanctuaryHome'
import { welcomePageDefaults } from '@data/welcomePage'
import { isPillarExploreKey, PILLAR_EXPLORE_FALLBACKS } from '@data/pillarExplore'

export const STORY_INVOLVE_DEFAULTS = {
  involveTitle: 'This call is still being lived at Kibeho',
  involveLead:
    'Read, then walk with the pilgrims — in prayer, at Mass, or on the road to the Shrine.',
  involveLinks: [
    {
      label: 'View Calendar',
      text: '',
      path: '/pilgrimage/calendar',
    },
    {
      label: 'Plan Your Pilgrimage',
      text: '',
      path: '/pilgrimage/plan',
    },
    {
      label: 'Get involved',
      text: '',
      path: '/support/get-involved',
    },
  ],
}

export function isHomeSectionKey(key) {
  return String(key || '').startsWith('home.')
}

export function isStoryPageKey(key) {
  if (key === 'shrine.welcome') return false
  return Boolean(
    key?.startsWith('shrine.') ||
      key?.startsWith('spirituality.') ||
      key?.startsWith('pilgrimage.') ||
      key === 'support.vision',
  )
}

export function pageKind(key) {
  if (isPillarExploreKey(key)) return 'pillar.explore'
  if (key === 'shrine.welcome') return 'shrine.welcome'
  if (key === 'shrine.schedule') return 'shrine.schedule'
  if (key === 'home.activities') return 'home.activities'
  if (key === 'home.welcome') return 'home.welcome'
  if (key === 'home.quickLinks') return 'home.quickLinks'
  if (key === 'home.whyVisit') return 'home.whyVisit'
  if (key === 'home.accommodationHelp') return 'home.accommodationHelp'
  if (key === 'home.upcomingPilgrimages') return 'home.items'
  if (key === 'home.todaySchedule') return 'home.schedule'
  if (key === 'home.partners') return 'home.partners'
  if (isHomeSectionKey(key)) return 'home'
  return 'cms'
}

function normalizeGuidelines(raw) {
  if (!Array.isArray(raw)) return []
  return raw
    .map((item) => {
      if (typeof item === 'string') {
        return { title: item, text: '', tone: 'caution', icon: 'alert', image: '' }
      }
      if (!item || typeof item !== 'object') return null
      return {
        title: item.title || item.label || '',
        text: item.text || item.description || '',
        tone: item.tone || 'caution',
        icon: item.icon || 'alert',
        image: item.image || '',
      }
    })
    .filter((item) => item && (item.title || item.text))
}

function buttonsFromContent(content = {}) {
  if (Array.isArray(content.buttons) && content.buttons.length) {
    return content.buttons.map((item) => ({
      label: item?.label || '',
      path: item?.path || item?.link || '',
    }))
  }
  const primary = content.cta?.primary || content.primaryCta || content.ctas?.primary
  const secondary = content.cta?.secondary || content.secondaryCta || content.ctas?.secondary
  return [primary, secondary]
    .filter((item) => item && (item.label || item.path || item.link))
    .map((item) => ({
      label: item.label || '',
      path: item.path || item.link || '',
    }))
}

export function defaultsForSection(key) {
  if (key === 'home.activities') {
    return {
      heading: homeActivities.heading,
      subline: homeActivities.subline,
      title: homeActivities.heading,
      subtitle: homeActivities.subline,
      highlights: shrineHighlights,
      primaryCta: homeActivities.primaryCta,
      secondaryCta: homeActivities.secondaryCta,
      cta: { primary: homeActivities.primaryCta, secondary: homeActivities.secondaryCta },
      buttons: [homeActivities.primaryCta, homeActivities.secondaryCta],
      cardLinkLabel: 'Learn more',
    }
  }
  if (key === 'home.welcome') {
    return {
      eyebrow: homeWelcome.eyebrow,
      heading: homeWelcome.heading,
      title: homeWelcome.heading,
      text: homeWelcome.text,
      intro: homeWelcome.text,
      image: homeWelcome.image,
      cta: homeWelcome.cta,
      buttons: [homeWelcome.cta],
    }
  }
  if (key === 'home.quickLinks') {
    return {
      title: 'Home quick links',
      links: quickLinks.map((item) => ({
        label: item.title,
        text: item.description,
        path: item.path,
        icon: item.icon,
      })),
    }
  }
  if (key === 'home.whyVisit') {
    return {
      eyebrow: 'Why Kibeho?',
      heading: 'Why make a pilgrimage here?',
      title: 'Why make a pilgrimage here?',
      items: whyVisit,
      cta: { primary: { label: 'Read more', path: '/pilgrimage/why-kibeho' } },
      buttons: [{ label: 'Read more', path: '/pilgrimage/why-kibeho' }],
    }
  }
  if (key === 'home.accommodationHelp') {
    return {
      eyebrow: accommodationHelp.eyebrow,
      heading: accommodationHelp.heading,
      title: accommodationHelp.heading,
      intro: accommodationHelp.intro,
      items: accommodationHelp.items,
      cta: { primary: accommodationHelp.cta },
      buttons: [accommodationHelp.cta],
    }
  }
  if (key === 'home.partners') {
    return {
      eyebrow: partners.eyebrow,
      heading: partners.heading,
      title: partners.heading,
      items: partners.items,
    }
  }
  if (isPillarExploreKey(key)) {
    const fallback = PILLAR_EXPLORE_FALLBACKS[key] || {}
    return {
      ...fallback,
      title: fallback.heading || '',
    }
  }
  if (key === 'shrine.welcome') {
    const defaults = welcomePageDefaults
    const page = getPageFallback(key) || {}
    return {
      ...page,
      mission: page.mission || defaults.mission,
      vision: page.vision || defaults.vision,
      values: page.values?.length ? page.values : defaults.values,
      leadership: page.leadership || defaults.leadership,
      map: page.map || defaults.map,
      exploreLinks: page.exploreLinks?.length ? page.exploreLinks : defaults.exploreLinks,
      welcomeEyebrow: page.welcomeEyebrow || '',
      welcomeTitle: page.welcomeTitle || page.title || '',
      welcomeImage: page.welcomeImage || page.heroImage || '',
    }
  }
  const page = getPageFallback(key)
  if (!page) return {}
  const story = isStoryPageKey(key)
  return {
    ...page,
    ...(story
      ? {
          heroCtaLabel: 'Be part of this',
          heroCtaPath: '#join',
          ...STORY_INVOLVE_DEFAULTS,
        }
      : {}),
    buttons: buttonsFromContent(page),
  }
}

export function mergedSectionContent(key, live = {}) {
  return mergePageContent(defaultsForSection(key), live || {})
}

export function emptyPageForm() {
  return {
    eyebrow: '',
    title: '',
    subtitle: '',
    heroImage: '',
    heroCompact: false,
    footerImage: '',
    footerImageAlt: '',
    intro: '',
    blocks: [],
    links: [],
    buttons: [],
    highlights: [],
    items: [],
    heroCtaLabel: '',
    heroCtaPath: '',
    involveTitle: '',
    involveLead: '',
    involveLinks: [],
    cardLinkLabel: '',
    welcomeEyebrow: '',
    welcomeTitle: '',
    welcomeImage: '',
    missionEyebrow: '',
    missionTitle: '',
    missionText: '',
    visionEyebrow: '',
    visionTitle: '',
    visionText: '',
    leadershipTitle: '',
    leadershipIntro: '',
    mapImage: '',
    mapAlt: '',
    mapCaption: '',
    weeklyIntro: '',
    annualIntro: '',
    guidelinesTitle: '',
    guidelines: [],
  }
}

export function contentToForm(content = {}, key = '') {
  const merged = key ? mergedSectionContent(key, content) : content
  const buttons = buttonsFromContent(merged)
  const mission = merged.mission || {}
  const vision = merged.vision || {}
  const leadership = merged.leadership || {}
  const map = merged.map || {}
  return {
    eyebrow: merged.eyebrow || '',
    title: merged.title || merged.heading || (merged.headlineLines || [])[0] || '',
    subtitle: merged.subtitle || merged.subline || '',
    heroImage: merged.heroImage || merged.backgroundImage || merged.image || '',
    heroCompact: Boolean(merged.heroCompact),
    footerImage: merged.footerImage || merged.map?.image || merged.mapImage || '',
    footerImageAlt: merged.footerImageAlt || merged.map?.alt || merged.mapAlt || '',
    intro: merged.intro || merged.text || '',
    blocks: Array.isArray(merged.blocks) ? merged.blocks : [],
    links: Array.isArray(merged.links) ? merged.links : [],
    buttons,
    highlights: Array.isArray(merged.highlights) ? merged.highlights : [],
    items: Array.isArray(merged.items) ? merged.items : [],
    values: Array.isArray(merged.values) ? merged.values : [],
    exploreLinks: Array.isArray(merged.exploreLinks) ? merged.exploreLinks : [],
    heroCtaLabel: merged.heroCtaLabel || '',
    heroCtaPath: merged.heroCtaPath || '',
    involveTitle: merged.involveTitle || '',
    involveLead: merged.involveLead || '',
    involveLinks: Array.isArray(merged.involveLinks) ? merged.involveLinks : [],
    cardLinkLabel: merged.cardLinkLabel || '',
    welcomeEyebrow: merged.welcomeEyebrow || '',
    welcomeTitle: merged.welcomeTitle || '',
    welcomeImage: merged.welcomeImage || '',
    missionEyebrow: mission.eyebrow || '',
    missionTitle: mission.title || '',
    missionText: mission.text || '',
    visionEyebrow: vision.eyebrow || '',
    visionTitle: vision.title || '',
    visionText: vision.text || '',
    leadershipTitle: leadership.title || '',
    leadershipIntro: leadership.intro || '',
    mapImage: map.image || merged.mapImage || '',
    mapAlt: map.alt || '',
    mapCaption: map.caption || '',
    weeklyIntro: merged.weeklyIntro || '',
    annualIntro: merged.annualIntro || '',
    guidelinesTitle: merged.guidelinesTitle || '',
    guidelines: normalizeGuidelines(merged.guidelines),
  }
}

export function formToContent(form, previous = {}, key = '') {
  return {
    ...previous,
    eyebrow: form.eyebrow,
    title: form.title,
    heading: form.title,
    subtitle: form.subtitle,
    subline: form.subtitle,
    text: form.intro,
    intro: form.intro,
    heroImage: form.heroImage,
    heroCompact: Boolean(form.heroCompact),
    backgroundImage: form.heroImage,
    image: form.heroImage,
    footerImage: form.footerImage,
    footerImageAlt: form.footerImageAlt,
    headlineLines: form.title ? [form.title] : [],
    breadcrumbLabel: form.title,
    blocks: form.blocks,
    links: (form.links || []).filter((link) => link.label || link.path || link.text),
    highlights: form.highlights || [],
    items: form.items || [],
    cardLinkLabel: form.cardLinkLabel,
    welcomeEyebrow: form.welcomeEyebrow,
    welcomeTitle: form.welcomeTitle,
    welcomeImage: form.welcomeImage,
    mission: {
      eyebrow: form.missionEyebrow,
      title: form.missionTitle,
      text: form.missionText,
    },
    vision: {
      eyebrow: form.visionEyebrow,
      title: form.visionTitle,
      text: form.visionText,
    },
    values: (form.values || []).filter((item) => item.title || item.text),
    leadership: {
      title: form.leadershipTitle,
      intro: form.leadershipIntro,
    },
    map: {
      image: form.mapImage,
      alt: form.mapAlt,
      caption: form.mapCaption,
    },
    ...(key === 'shrine.schedule'
      ? {
          weeklyIntro: form.weeklyIntro || '',
          annualIntro: form.annualIntro || '',
          guidelinesTitle: form.guidelinesTitle || '',
          guidelines: normalizeGuidelines(form.guidelines),
        }
      : {}),
    ...(isPillarExploreKey(key)
      ? {
          heading: form.title,
          intro: form.intro,
          blocks: [],
          links: [],
          buttons: [],
          cta: null,
        }
      : {}),
    ...(key === 'shrine.welcome'
      ? {
          blocks: [],
          links: [],
          buttons: [],
          cta: null,
          involveTitle: '',
          involveLead: '',
          involveLinks: [],
        }
      : {}),
    ...(key === 'home.quickLinks'
      ? {
          links: (form.links || []).filter((link) => link.label || link.path),
        }
      : {}),
  }
}

export function pageOptionLabel(key, section) {
  const name = section?.label || key
  if (isHomeSectionKey(key)) return `${name} · homepage`
  const path = pathForSectionKey(key)
  return path && path !== `/${String(key || '').replace(/\./g, '/')}` ? `${name} · ${path}` : `${name} · ${key}`
}

export function groupedPageKeys(sectionKeys) {
  const website = []
  const home = []
  sectionKeys.forEach((key) => {
    if (isHomeSectionKey(key)) home.push(key)
    else website.push(key)
  })
  return { website, home }
}
