import { useEffect, useState } from 'react'
import visionariesRaw from './directories/visionaries.json'

function asCollection(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.data)) return data.data
  return []
}

function pickTranslated(item, locale, fields) {
  const code = String(locale || 'en').toLowerCase()
  const tr = item?.translations?.[code]
  if (!tr) return item
  const next = { ...item }
  fields.forEach((field) => {
    const snake = field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
    const value = tr[field] ?? tr[snake]
    if (value) next[field] = value
  })
  return next
}

export function mapVisionary(raw, index = 0) {
  const slug = raw.slug
  return {
    id: raw.id || index + 1,
    slug,
    name: raw.name,
    title: raw.name,
    photo: raw.photo,
    coverImage: raw.photo || raw.coverImage,
    periodLabel: raw.periodLabel || raw.period_label,
    periodStart: raw.periodStart || raw.period_start,
    periodEnd: raw.periodEnd || raw.period_end,
    summary: raw.summary,
    description: raw.description,
    isApproved: raw.isApproved ?? raw.is_approved ?? true,
    sortOrder: raw.sortOrder ?? raw.sort_order ?? index + 1,
    isPublished: true,
    path: raw.path || `/shrine/visionaries/${slug}`,
    translations: raw.translations || {},
  }
}

export const VISIONARY_FALLBACKS = (visionariesRaw || []).map(mapVisionary)

export { MESSAGE_FALLBACKS } from './directories/maryMessages'

export const PRAYER_FALLBACKS = [
  {
    id: 1,
    title: 'A prayer to Our Lady of Kibeho',
    timeLabel: '',
    description:
      '<p>Blessed Virgin Mary, Mother of the Word, Mother of all who believe in Him: we thank you for the gift of your apparitions at Kibeho. Obtain for us the grace of conversion, a sincere love of the Cross, and reconciliation with God and with one another. Teach us to pray the Rosary, especially the Rosary of your Seven Sorrows. Mother of the Word, pray for Rwanda, for Africa, and for the whole world. Amen.</p>',
    sortOrder: 1,
    isPublished: true,
    translations: {},
  },
]

export const TRAVEL_ROUTE_FALLBACKS = [
  {
    id: 1,
    origin: 'Kigali',
    title: 'Kigali – Huye – Matyazo – Kibeho',
    description:
      '<p>From Kigali, take the road south to Huye (Butare), continue to Matyazo, then on to Kibeho in Nyaruguru District. International pilgrims usually fly into Kigali International Airport and continue by road (about three hours).</p>',
    sortOrder: 1,
  },
  {
    id: 2,
    origin: 'Rusizi',
    title: 'Rusizi – Huye – Matyazo – Kibeho',
    description: '<p>From Rusizi in the west, travel via Huye and Matyazo to reach the Shrine at Kibeho.</p>',
    sortOrder: 2,
  },
  {
    id: 3,
    origin: 'Akanyaru',
    title: 'Akanyaru – Cahinda – Kibeho',
    description: '<p>From the Akanyaru border area, the usual approach is through Cahinda and on to Kibeho.</p>',
    sortOrder: 3,
  },
]

function localizeList(items, locale, fields) {
  return (items || []).map((item) => pickTranslated(item, locale, fields))
}

function mergeFromFallbacks(list, fallbacks) {
  if (!fallbacks.length) return list
  return list.map((item) => {
    const fallback = fallbacks.find(
      (row) =>
        (item.slug && row.slug === item.slug) ||
        (item.number != null && row.number === item.number) ||
        (item.title && row.title === item.title),
    )
    if (!fallback) return item
    const next = { ...item }
    Object.keys(fallback).forEach((key) => {
      if (key === 'id' || key === 'translations') return
      if (next[key] == null || next[key] === '') next[key] = fallback[key]
    })
    return next
  })
}

/**
 * Public directory pages: prefer the live API, but never show a Laravel
 * "route could not be found" error. If the endpoint is missing (older
 * deploy), show bundled records. Sparse API rows (title only) are filled
 * from the same bundled copy so pages still read as full entries.
 */
export function usePublicDirectory(loader, fallbackItems, locale, fields = [], extraKey = '') {
  const [items, setItems] = useState(() => localizeList(fallbackItems, locale, fields))

  useEffect(() => {
    let cancelled = false
    const fallbacks = localizeList(fallbackItems, locale, fields)
    loader()
      .then((data) => {
        if (cancelled) return
        const list = asCollection(data)
        setItems(list.length ? mergeFromFallbacks(list, fallbacks) : fallbacks)
      })
      .catch(() => {
        if (cancelled) return
        setItems(fallbacks)
      })
    return () => {
      cancelled = true
    }
  }, [locale, extraKey])

  return items
}

export function visionaryFromFallbacks(slug, locale) {
  const list = localizeList(VISIONARY_FALLBACKS, locale, ['name', 'summary', 'description', 'periodLabel'])
  return list.find((item) => item.slug === slug) || null
}
