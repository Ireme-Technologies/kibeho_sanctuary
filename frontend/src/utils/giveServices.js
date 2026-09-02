/**
 * Ways to give — shared between the homepage strip, Get Involved page, and OfferingForm.
 */

export const DEFAULT_GIVE_WAYS = [
  {
    id: 'offerings',
    serviceKey: 'offerings',
    title: 'Church offerings',
    text: 'Support the daily liturgy, sacraments, and pastoral life of the Shrine.',
    icon: 'church',
    showOnHome: true,
  },
  {
    id: 'expansion',
    serviceKey: 'expansion',
    title: "Support the Shrine's expansion",
    text: 'Walk with pathways, welcome, and the works that help Kibeho receive pilgrims with dignity.',
    icon: 'building',
    showOnHome: true,
  },
  {
    id: 'community',
    serviceKey: 'community',
    title: 'Community development',
    text: 'Partner in projects that serve pilgrims and the communities around the hillside.',
    icon: 'heart',
    showOnHome: true,
  },
  {
    id: 'candle',
    serviceKey: 'candle',
    title: 'Light a candle',
    text: 'Leave a prayer intention burning before Our Lady of Kibeho.',
    icon: 'flame',
    showOnHome: false,
  },
  {
    id: 'mass',
    serviceKey: 'mass',
    title: 'Mass intention',
    text: 'Offer Mass for a loved one, the sick, or the departed.',
    icon: 'church',
    showOnHome: false,
  },
]

export const SERVICE_META = {
  offerings: { kind: 'donation', subject: 'Church offering' },
  expansion: { kind: 'donation', subject: "Shrine expansion gift" },
  community: { kind: 'donation', subject: 'Community development gift' },
  candle: { kind: 'candle', subject: 'Light a candle' },
  mass: { kind: 'mass', subject: 'Have a Mass said' },
}

export function resolveGiveWays(offerings = {}) {
  const rows = Array.isArray(offerings.giveWays) ? offerings.giveWays : []
  const cleaned = rows.filter((row) => row?.serviceKey && row?.title)
  return cleaned.length ? cleaned : DEFAULT_GIVE_WAYS
}

export function homeGiveWays(offerings = {}) {
  return resolveGiveWays(offerings)
    .filter((row) => {
      const flag = row.showOnHome
      if (flag === false || flag === 'no' || flag === 'false') return false
      return true
    })
    .slice(0, 3)
}

export const GIVE_PAGE_PATH = '/support/get-involved'

export function getInvolvedHref(serviceKey = '') {
  const key = String(serviceKey || '').trim()
  return key ? `${GIVE_PAGE_PATH}?service=${encodeURIComponent(key)}` : GIVE_PAGE_PATH
}

/** Map action-page kinds to payment service keys for the unified give page. */
export function serviceKeyForActionKind(kind) {
  const map = {
    candle: 'candle',
    mass: 'mass',
    donation: 'offerings',
    partnership: 'offerings',
  }
  return map[String(kind || '').trim()] || 'offerings'
}

export function serviceMeta(serviceKey) {
  return SERVICE_META[String(serviceKey || '').trim()] || SERVICE_META.offerings
}

export function isValidServiceKey(key) {
  return Boolean(SERVICE_META[String(key || '').trim()])
}
