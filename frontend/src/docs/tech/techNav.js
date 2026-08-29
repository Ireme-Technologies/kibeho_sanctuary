/** Ordered chapters of the technical details / hosting handoff. */
export const TECH_BASE = '/docs/server-requirements'

export const TECH_CHAPTERS = [
  { slug: '', label: 'Overview', title: 'Technical details — handoff', page: 'Overview' },
  { slug: 'hosting', label: 'Hosting & domain', title: 'Hosting & domain', page: 'Hosting' },
  { slug: 'access', label: 'Server access', title: 'Server access (Git / SSH)', page: 'Access' },
  { slug: 'database', label: 'Database', title: 'Database', page: 'Database' },
  { slug: 'email', label: 'Email', title: 'Email', page: 'Email' },
  { slug: 'messaging', label: 'Messaging', title: 'Messaging', page: 'Messaging' },
  { slug: 'admin', label: 'Admin access', title: 'Admin access', page: 'Admin' },
  { slug: 'backups', label: 'Backups', title: 'Backups & recovery', page: 'Backups' },
  { slug: 'checklist', label: 'Hosting checklist', title: 'Hosting partner checklist', page: 'Checklist' },
]

export function techPath(slug) {
  return slug ? `${TECH_BASE}/${slug}` : TECH_BASE
}

export function findTechChapter(slugParam) {
  const slug = slugParam || ''
  const index = TECH_CHAPTERS.findIndex((c) => c.slug === slug)
  if (index < 0) return null
  const current = TECH_CHAPTERS[index]
  const prev = index > 0 ? TECH_CHAPTERS[index - 1] : null
  const next = index < TECH_CHAPTERS.length - 1 ? TECH_CHAPTERS[index + 1] : null
  return { current, index, prev, next }
}
