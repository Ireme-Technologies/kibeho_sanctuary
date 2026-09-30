import { mergedSectionContent } from './pageForm'

const SKIP_KEYS = new Set([
  'path',
  'link',
  'href',
  'url',
  'to',
  'image',
  'icon',
  'type',
  'tone',
  'slug',
  'id',
  '_id',
  'embedSrc',
  'backgroundImage',
  'heroImage',
  'src',
  'key',
  'footerImage',
  'mapImage',
  'welcomeImage',
  'directionsLink',
  'heroCompact',
  'mapEmbedSrc',
  'mapDirectionsLink',
  'video',
  'youtube',
  'youtubeId',
  'thumb',
])

const TEXT_KEYS = new Set([
  'title',
  'heading',
  'subtitle',
  'subline',
  'intro',
  'text',
  'eyebrow',
  'label',
  'caption',
  'description',
  'shortDescription',
  'lead',
  'name',
  'quote',
  'when',
  'time',
  'contact',
  'distance',
  'facilities',
  'meta',
  'cardLinkLabel',
  'heroCtaLabel',
  'involveTitle',
  'involveLead',
  'welcomeEyebrow',
  'welcomeTitle',
  'missionEyebrow',
  'missionTitle',
  'missionText',
  'visionEyebrow',
  'visionTitle',
  'visionText',
  'leadershipTitle',
  'leadershipIntro',
  'mapAlt',
  'mapCaption',
  'weeklyIntro',
  'annualIntro',
  'guidelinesTitle',
  'footerImageAlt',
])

const ALWAYS = new Set(['title', 'heading', 'subtitle', 'subline', 'intro', 'eyebrow'])

const FIELD_LABELS = {
  title: 'Title',
  heading: 'Heading',
  subtitle: 'Subtitle',
  subline: 'Subtitle',
  intro: 'Introduction',
  text: 'Text',
  eyebrow: 'Eyebrow',
  label: 'Label',
  caption: 'Caption',
  description: 'Description',
  shortDescription: 'Description',
  lead: 'Lead',
  name: 'Name',
  quote: 'Quote',
  when: 'When',
  time: 'Time',
  contact: 'Contact',
  distance: 'Distance',
  facilities: 'Facilities',
  meta: 'Meta',
  cardLinkLabel: 'Card button',
  heroCtaLabel: 'Button',
  involveTitle: 'Title',
  involveLead: 'Text',
  welcomeEyebrow: 'Eyebrow',
  welcomeTitle: 'Title',
  mapAlt: 'Image description',
  mapCaption: 'Caption',
  weeklyIntro: 'Weekly programmes',
  annualIntro: 'Annual celebrations',
  guidelinesTitle: 'Heading',
  footerImageAlt: 'Image description',
}

const BLOCK_NAMES = {
  heading: 'Heading',
  paragraph: 'Paragraph',
  note: 'Note',
  list: 'List',
  cards: 'Cards',
  steps: 'Steps',
  schedule: 'Schedule',
  hotels: 'Places',
  youtube: 'Video',
  gallery: 'Gallery',
}

function looksLikeAsset(value) {
  const text = String(value || '').trim()
  if (!text || text.includes(' ')) return false
  return text.startsWith('/') || /^https?:\/\//i.test(text) || /\.(jpg|jpeg|png|webp|gif|svg|mp4)$/i.test(text)
}

export function readPath(root, path) {
  if (!root || !path) return undefined
  return String(path)
    .split('.')
    .reduce((current, part) => (current == null ? undefined : current[part]), root)
}

function setPathFromSource(target, source, path, value) {
  const parts = String(path).split('.')
  const root = structuredClone(target || {})
  let cursor = root
  let sourceCursor = source
  for (let index = 0; index < parts.length - 1; index += 1) {
    const key = parts[index]
    if (cursor[key] == null || typeof cursor[key] !== 'object') {
      const fromSource = sourceCursor?.[key]
      cursor[key] =
        fromSource != null && typeof fromSource === 'object'
          ? structuredClone(fromSource)
          : /^\d+$/.test(parts[index + 1])
            ? []
            : {}
    }
    cursor = cursor[key]
    sourceCursor = sourceCursor?.[key]
  }
  cursor[parts[parts.length - 1]] = value
  return root
}

function pushField(fields, seen, path, label, group, source, force = false) {
  if (!path || seen.has(path)) return
  const text = typeof source === 'string' ? source : ''
  const key = path.split('.').pop()
  if (!TEXT_KEYS.has(key) || SKIP_KEYS.has(key)) return
  if (looksLikeAsset(text)) return
  if (!text.trim() && !force) return
  seen.add(path)
  const plain = text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  fields.push({
    path,
    label,
    group,
    source: text,
    multiline: plain.length > 90 || /<(p|br|div|li|h[1-6])\b/i.test(text) || key === 'intro' || key === 'text' || key === 'lead',
  })
}

function walkObject(fields, seen, value, path, group) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return
  Object.entries(value).forEach(([key, item]) => {
    if (SKIP_KEYS.has(key)) return
    const nextPath = path ? `${path}.${key}` : key
    if (typeof item === 'string') {
      pushField(fields, seen, nextPath, FIELD_LABELS[key] || key, group, item)
    } else if (Array.isArray(item)) {
      item.forEach((entry, index) => walkEntry(fields, seen, entry, `${nextPath}.${index}`, group, index))
    } else if (item && typeof item === 'object') {
      walkObject(fields, seen, item, nextPath, group)
    }
  })
}

function walkEntry(fields, seen, entry, path, group, index) {
  if (typeof entry === 'string') {
    pushField(fields, seen, path, `Item ${index + 1}`, group, entry)
    return
  }
  if (!entry || typeof entry !== 'object') return
  Object.entries(entry).forEach(([key, item]) => {
    if (typeof item !== 'string' || SKIP_KEYS.has(key) || !TEXT_KEYS.has(key)) return
    const noun = FIELD_LABELS[key] || key
    pushField(fields, seen, `${path}.${key}`, `${noun} ${index + 1}`, group, item)
  })
}

export function collectPageFields(content, key) {
  const merged = mergedSectionContent(key, content || {})
  const fields = []
  const seen = new Set()

  ;['eyebrow', 'title', 'heading', 'subtitle', 'subline', 'intro', 'text'].forEach((field) => {
    if (field === 'heading' && merged.heading === merged.title) return
    if (field === 'subline' && merged.subline === merged.subtitle) return
    if (field === 'text' && merged.text === merged.intro) return
    if (typeof merged[field] === 'string') {
      pushField(fields, seen, field, FIELD_LABELS[field], 'Header', merged[field], ALWAYS.has(field))
    }
  })

  ;(merged.blocks || []).forEach((block, index) => {
    const group = `${BLOCK_NAMES[block?.type] || 'Section'} ${index + 1}`
    if (typeof block?.text === 'string') pushField(fields, seen, `blocks.${index}.text`, 'Text', group, block.text)
    if (typeof block?.title === 'string') pushField(fields, seen, `blocks.${index}.title`, 'Title', group, block.title)
    ;(block?.items || []).forEach((item, itemIndex) => {
      walkEntry(fields, seen, item, `blocks.${index}.items.${itemIndex}`, group, itemIndex)
    })
  })

  const lists = [
    ['links', 'Link cards'],
    ['highlights', 'Cards'],
    ['items', 'Items'],
    ['values', 'Values'],
    ['guidelines', 'Guidelines'],
    ['involveLinks', 'Call to action'],
    ['exploreLinks', 'Explore links'],
    ['buttons', 'Buttons'],
  ]
  lists.forEach(([field, group]) => {
    ;(merged[field] || []).forEach((item, index) => walkEntry(fields, seen, item, `${field}.${index}`, group, index))
  })

  ;[
    ['mission', 'Mission'],
    ['vision', 'Vision'],
    ['leadership', 'Leadership'],
    ['cta', 'Buttons'],
    ['map', 'Map'],
  ].forEach(([field, group]) => walkObject(fields, seen, merged[field], field, group))

  ;['cardLinkLabel', 'heroCtaLabel', 'involveTitle', 'involveLead', 'welcomeEyebrow', 'welcomeTitle', 'weeklyIntro', 'annualIntro', 'guidelinesTitle', 'mapAlt', 'mapCaption'].forEach(
    (field) => {
      if (typeof merged[field] === 'string') {
        const group = field.startsWith('involve')
          ? 'Call to action'
          : field.startsWith('welcome')
            ? 'Welcome'
            : field.startsWith('weekly') || field.startsWith('annual') || field.startsWith('guidelines')
              ? 'Schedule'
              : field.startsWith('map')
                ? 'Map'
                : 'Labels'
        pushField(fields, seen, field, FIELD_LABELS[field], group, merged[field])
      }
    },
  )

  return { source: merged, fields }
}

export function pageFieldText(section, path, locale, defaultLocale, sourceText) {
  if (locale === defaultLocale) {
    const stored = readPath(section?.content, path)
    if (typeof stored === 'string' && stored.trim()) return stored
    return sourceText || ''
  }
  const translated = readPath(section?.translations?.[locale]?.content, path)
  return typeof translated === 'string' ? translated : ''
}

export function writePageFieldValue(section, path, value, locale, defaultLocale, source) {
  if (locale === defaultLocale) {
    return {
      ...section,
      content: setPathFromSource(section.content || {}, source, path, value),
    }
  }
  const translations = structuredClone(section.translations || {})
  const pack = { ...(translations[locale] || {}) }
  translations[locale] = {
    ...pack,
    content: setPathFromSource(pack.content || {}, source, path, value),
  }
  return { ...section, translations }
}
