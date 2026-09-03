/**
 * Standard public CTAs used on story pages and generic call-to-action rows.
 * Keep action-specific pages (candle, mass, donate forms, etc.) on their own links.
 */

export const SITE_CTA_PATHS = {
  calendar: '/pilgrimage/calendar',
  plan: '/pilgrimage/plan',
  getInvolved: '/support/get-involved',
}

export const STANDARD_SITE_CTAS = [
  {
    title: 'View Calendar',
    text: '',
    path: SITE_CTA_PATHS.calendar,
  },
  {
    title: 'Plan Your Pilgrimage',
    text: '',
    path: SITE_CTA_PATHS.plan,
  },
  {
    title: 'Get involved',
    text: '',
    path: SITE_CTA_PATHS.getInvolved,
  },
]

/** Old story-join cards that should be replaced by STANDARD_SITE_CTAS. */
export function isStaleStoryCtas(cards = []) {
  if (!Array.isArray(cards) || !cards.length) return true
  const blob = cards
    .map((item) => `${item?.title || ''} ${item?.path || ''}`)
    .join(' ')
    .toLowerCase()
  return /light a candle|have a mass|come on pilgrimage|light-a-candle|mass-request|prayer-intentions|request-a-mass/.test(
    blob,
  )
}

export function resolveStoryCtas(cards) {
  return isStaleStoryCtas(cards) ? STANDARD_SITE_CTAS : cards.filter((item) => item?.title && item?.path)
}
