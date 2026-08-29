/** Ordered chapters of the administrator guide (each has its own URL). */
export const GUIDE_BASE = '/docs/sitemap-and-admin-guide'

export const GUIDE_CHAPTERS = [
  { slug: '', label: 'How to use this CMS', title: 'How to use this CMS', page: 'StartHere' },
  { slug: 'audit', label: 'CMS audit & readiness', title: 'CMS audit & readiness', page: 'Audit' },
  { slug: 'sign-in', label: 'Sign in', title: 'Sign in', page: 'SignIn' },
  { slug: 'settings', label: 'Settings', title: 'Settings', page: 'Settings' },
  { slug: 'offerings', label: 'Offerings & gifts', title: 'Offerings & gifts', page: 'Offerings' },
  { slug: 'languages', label: 'Languages', title: 'Languages', page: 'Languages' },
  { slug: 'menus-media', label: 'Menus & media', title: 'Menus & media', page: 'MenusMedia' },
  { slug: 'pages-news', label: 'Pages & news', title: 'Pages & news', page: 'PagesNews' },
  { slug: 'directories', label: 'Directories', title: 'Directories', page: 'Directories' },
  { slug: 'translations', label: 'Button labels', title: 'Button labels', page: 'Translations' },
  { slug: 'enquiries-users', label: 'Enquiries & users', title: 'Enquiries & users', page: 'EnquiriesUsers' },
  { slug: 'backup', label: 'Backup & restore', title: 'Backup & restore', page: 'Backup' },
  { slug: 'sitemap', label: 'Public sitemap', title: 'Public sitemap', page: 'Sitemap' },
  { slug: 'content-types', label: 'Content types', title: 'Content types', page: 'ContentTypes' },
  { slug: 'checklist', label: 'Checklist', title: 'Checklist', page: 'Checklist' },
  { slug: 'future', label: 'Future upgrades', title: 'Future upgrades', page: 'Future' },
]

/** Shareable technical details / hosting handoff (not nested inside the guide). */
export const SERVER_REQUIREMENTS = {
  to: '/docs/server-requirements',
  label: 'Technical details',
}

export function guidePath(slug) {
  return slug ? `${GUIDE_BASE}/${slug}` : GUIDE_BASE
}

export function findGuideChapter(slugParam) {
  const slug = slugParam || ''
  const index = GUIDE_CHAPTERS.findIndex((c) => c.slug === slug)
  if (index < 0) return null
  const current = GUIDE_CHAPTERS[index]
  const prev = index > 0 ? GUIDE_CHAPTERS[index - 1] : null
  const next = index < GUIDE_CHAPTERS.length - 1 ? GUIDE_CHAPTERS[index + 1] : null
  return { current, index, prev, next }
}
