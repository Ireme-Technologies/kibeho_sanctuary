import { lazy, Suspense } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import styles from '../DocsLayout.module.css'
import { DocsToolbar, DocsCrossNav } from '../DocsChrome'
import PageLoader from '../../components/ui/PageLoader'
import { TECH_CHAPTERS, TECH_BASE, findTechChapter, techPath } from './techNav'

const CHAPTER_PAGES = {
  Overview: lazy(() => import('./sections/Overview')),
  Hosting: lazy(() => import('./sections/Hosting')),
  Access: lazy(() => import('./sections/Access')),
  Database: lazy(() => import('./sections/Database')),
  Email: lazy(() => import('./sections/Email')),
  Messaging: lazy(() => import('./sections/Messaging')),
  Admin: lazy(() => import('./sections/Admin')),
  Backups: lazy(() => import('./sections/Backups')),
  Checklist: lazy(() => import('./sections/Checklist')),
}

function TechSidebar({ activeSlug }) {
  return (
    <aside className={styles.toc} aria-label="Technical details chapters">
      <h2>Technical details</h2>
      {TECH_CHAPTERS.map((chapter) => {
        const to = techPath(chapter.slug)
        const active = (activeSlug || '') === chapter.slug
        return (
          <Link
            key={chapter.slug || 'index'}
            to={to}
            className={active ? styles.tocActive : undefined}
            aria-current={active ? 'page' : undefined}
          >
            {chapter.label}
          </Link>
        )
      })}
      <hr className={styles.tocDivider} />
      <Link to="/docs/sitemap-and-admin-guide" className={styles.tocExternal}>
        Administrator guide ↗
      </Link>
    </aside>
  )
}

export default function TechDetailsPage() {
  const { section } = useParams()
  const found = findTechChapter(section)

  if (!found) {
    return <Navigate to={TECH_BASE} replace />
  }

  const { current, prev, next } = found
  const Page = CHAPTER_PAGES[current.page]
  const stepLabel = `${found.index + 1} of ${TECH_CHAPTERS.length}`

  return (
    <div>
      <div className={styles.pageHeader}>
        <p className={styles.brandEyebrow}>Technical details · {stepLabel}</p>
        <h1>{current.title}</h1>
        <p className={styles.lede}>
          Clear handoff for the Diocese and hosting partner — React + Laravel stack, recommended
          DigitalOcean droplet (~$7/month), SSH not FTP. One topic per page. Use <strong>Back</strong> /{' '}
          <strong>Next</strong>, or open a row from the overview.
        </p>
      </div>

      <DocsToolbar
        downloadHref="/evaluation-downloads/server-requirements.md"
        downloadLabel="Download technical details (.md)"
      />

      <div className={styles.layout}>
        <TechSidebar activeSlug={current.slug} />
        <article className={styles.article}>
          <Suspense fallback={<PageLoader />}>
            <Page />
          </Suspense>

          <DocsCrossNav
            prev={
              prev
                ? { to: techPath(prev.slug), label: prev.label }
                : { to: '/docs', label: 'Documentation hub' }
            }
            next={
              next
                ? { to: techPath(next.slug), label: next.label }
                : { to: '/docs/proposed-solution', label: 'Proposed solution' }
            }
          />
        </article>
      </div>
    </div>
  )
}
