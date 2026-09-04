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

export const MESSAGE_FALLBACKS = [
  {
    id: 1,
    number: 1,
    title: 'Convert while there is still time',
    theme: 'Conversion',
    summary: 'Our Lady called the world to conversion of heart — not later, but now.',
    body: '<p>The Mother of the Word asked Kibeho, and through Kibeho the Church, to convert while there is still time. Her message is urgent and merciful: return to God, do not postpone repentance, and live as children who have heard the call.</p>',
    sortOrder: 1,
  },
  {
    id: 2,
    number: 2,
    title: 'Pray the Rosary daily',
    theme: 'Prayer',
    summary: 'Daily prayer of the Rosary remains at the centre of the message of Kibeho.',
    body: '<p>Our Lady asked for the Rosary to be prayed faithfully. At Kibeho this prayer is not an ornament of devotion but a path of conversion, peace, and perseverance.</p>',
    sortOrder: 2,
  },
  {
    id: 3,
    number: 3,
    title: 'Offer reparation for sins',
    theme: 'Reparation',
    summary: 'Prayer, sacrifice, and love offered for the conversion of sinners.',
    body: '<p>The apparitions invite reparation — a willing offering of prayer and sacrifice so that hearts may return to God and wounds among people may be healed.</p>',
    sortOrder: 3,
  },
  {
    id: 4,
    number: 4,
    title: 'Seek reconciliation',
    theme: 'Reconciliation',
    summary: 'Be reconciled with God and with one another.',
    body: '<p>Kibeho is a sanctuary of reconciliation. The Mother of the Word asks forgiveness, peace, and a love that mends what hatred has broken.</p>',
    sortOrder: 4,
  },
  {
    id: 5,
    number: 5,
    title: 'Live as children of the Mother of the Word',
    theme: 'Discipleship',
    summary: 'To hear Mary at Kibeho is to follow her Son more closely.',
    body: '<p>Those who come to Kibeho are invited to live as children of the Mother of the Word: humble, prayerful, and faithful to the Gospel in ordinary life.</p>',
    sortOrder: 5,
  },
  {
    id: 6,
    number: 6,
    title: 'Repent and return to God',
    theme: 'Conversion',
    summary: 'Repentance is the first step of the pilgrimage of the heart.',
    body: '<p>The call to repent is not accusation but invitation. Return to God, confess, and begin again — this is the first work of a pilgrim at Kibeho.</p>',
    sortOrder: 6,
  },
  {
    id: 7,
    number: 7,
    title: 'Pray the Seven Sorrows Rosary',
    theme: 'Devotion',
    summary: 'The distinctive prayer of Kibeho, asked of Marie Claire and of the whole Church.',
    body: '<p>Our Lady asked that the faithful pray the Rosary of the Seven Sorrows — uniting our hearts to her compassion and to the Passion of her Son.</p>',
    sortOrder: 7,
  },
  {
    id: 8,
    number: 8,
    title: 'Help the poor',
    theme: 'Charity',
    summary: 'Love of neighbour is part of the conversion Mary asked for.',
    body: '<p>The message of Kibeho is not only interior. Those who hear Our Lady are sent to the poor, the wounded, and the forgotten with practical charity.</p>',
    sortOrder: 8,
  },
  {
    id: 9,
    number: 9,
    title: 'Forgive one another',
    theme: 'Reconciliation',
    summary: 'Forgiveness is the peace Our Lady asked Rwanda — and the world — to choose.',
    body: '<p>Forgive one another. This word, spoken on a hillside that would later know great suffering, remains the heart of the Shrine’s pastoral mission.</p>',
    sortOrder: 9,
  },
  {
    id: 10,
    number: 10,
    title: 'Be witnesses of hope',
    theme: 'Mission',
    summary: 'Carry the message of Kibeho into the world with hope, not fear.',
    body: '<p>Those who have prayed at Kibeho are sent as witnesses of hope: conversion is possible, peace is possible, and the Mother of the Word still gathers her children.</p>',
    sortOrder: 10,
  },
].map((row) => ({ ...row, isPublished: true, translations: {} }))

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
