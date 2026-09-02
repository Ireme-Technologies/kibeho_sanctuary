import { defaultSiteButtons } from '@data/siteButtons'

function localePack(button, locale, defaultLocale) {
  if (!button || typeof button !== 'object') return {}
  const translations = button.translations || {}
  return translations[locale] || translations[defaultLocale] || {}
}

export function mergeSiteButtons(raw = {}) {
  return {
    navDonate: { ...defaultSiteButtons.navDonate, ...(raw.navDonate || {}) },
    footerCta: {
      ...defaultSiteButtons.footerCta,
      ...(raw.footerCta || {}),
      translations: {
        ...defaultSiteButtons.footerCta.translations,
        ...(raw.footerCta?.translations || {}),
      },
    },
    involveStory: {
      ...defaultSiteButtons.involveStory,
      ...(raw.involveStory || {}),
      translations: {
        ...defaultSiteButtons.involveStory.translations,
        ...(raw.involveStory?.translations || {}),
      },
    },
  }
}

export function navDonateButton(siteButtons, locale, defaultLocale, t) {
  const button = siteButtons?.navDonate || defaultSiteButtons.navDonate
  const pack = localePack(button, locale, defaultLocale)
  return {
    path: button.path || '/support/get-involved',
    label: pack.label || t('donate') || 'Donate',
  }
}

export function footerCtaContent(siteButtons, locale, defaultLocale, t) {
  const button = siteButtons?.footerCta || defaultSiteButtons.footerCta
  const pack = localePack(button, locale, defaultLocale)
  const fallback = localePack(defaultSiteButtons.footerCta, locale, defaultLocale)
  const primaryLabel = pack.primaryLabel || fallback.primaryLabel || 'Plan your pilgrimage'
  const secondaryLabel = pack.secondaryLabel || fallback.secondaryLabel || 'Donate'
  const stalePair =
    /^(donate|faire un don|tanga|spenden)$/i.test(String(primaryLabel).trim()) &&
    /partner|partenair|umufatanyabikorwa|support our shrine|soutenir notre sanctuaire/i.test(
      String(secondaryLabel),
    )

  if (stalePair) {
    return {
      title: fallback.title || 'The only Marian place in Africa recognised by the Church',
      text: fallback.text || '',
      primary: {
        path: defaultSiteButtons.footerCta.primaryPath,
        label: fallback.primaryLabel || 'Plan your pilgrimage',
      },
      secondary: {
        path: defaultSiteButtons.footerCta.secondaryPath,
        label: fallback.secondaryLabel || 'Donate',
      },
    }
  }

  const staleMissionTitle = /support our mission|soutenir notre mission|fasha umurimo|unterstützen sie unsere mission/i.test(
    String(pack.title || ''),
  )

  return {
    title:
      (staleMissionTitle ? fallback.title : pack.title) ||
      fallback.title ||
      'The only Marian place in Africa recognised by the Church',
    text: pack.text || fallback.text || t('supportMissionText') || '',
    primary: {
      path: button.primaryPath || defaultSiteButtons.footerCta.primaryPath,
      label: primaryLabel,
    },
    secondary: {
      path: button.secondaryPath || defaultSiteButtons.footerCta.secondaryPath,
      label: secondaryLabel,
    },
  }
}

export function involveStoryContent(siteButtons, locale, defaultLocale, t) {
  const block = siteButtons?.involveStory || defaultSiteButtons.involveStory
  const pack = localePack(block, locale, defaultLocale)
  const fallback = localePack(defaultSiteButtons.involveStory, locale, defaultLocale)
  const cards = Array.isArray(pack.cards) && pack.cards.length ? pack.cards : fallback.cards || []
  return {
    title: pack.title || t('story.joinTitle') || fallback.title || '',
    lead: pack.lead || t('story.joinLead') || fallback.lead || '',
    cards: cards.filter((item) => item?.title && item?.path),
  }
}
