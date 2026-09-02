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
  return {
    title: pack.title || t('supportMission') || 'Support our mission',
    text: pack.text || t('supportMissionText') || '',
    primary: {
      path: button.primaryPath || '/support/get-involved',
      label: pack.primaryLabel || t('donate') || 'Donate',
    },
    secondary: {
      path: button.secondaryPath || '/support/partners',
      label: pack.secondaryLabel || t('becomeVolunteer') || 'Become a partner',
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
