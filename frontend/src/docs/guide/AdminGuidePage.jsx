import { lazy, Suspense } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import styles from '../DocsLayout.module.css'
import { DocsToolbar, DocsCrossNav } from '../DocsChrome'
import PageLoader from '../../components/ui/PageLoader'
import {
  GUIDE_CHAPTERS,
  GUIDE_BASE,
  SERVER_REQUIREMENTS,
  findGuideChapter,
  guidePath,
} from './guideNav'

const CHAPTER_PAGES = {
  StartHere: lazy(() => import('./sections/StartHere')),
  Audit: lazy(() => import('./sections/Audit')),
  SignIn: lazy(() => import('./sections/SignIn')),
  Settings: lazy(() => import('./sections/Settings')),
  Offerings: lazy(() => import('./sections/Offerings')),
  Languages: lazy(() => import('./sections/Languages')),
  MenusMedia: lazy(() => import('./sections/MenusMedia')),
  PagesNews: lazy(() => import('./sections/PagesNews')),
  Directories: lazy(() => import('./sections/Directories')),
  Translations: lazy(() => import('./sections/Translations')),
  EnquiriesUsers: lazy(() => import('./sections/EnquiriesUsers')),
  Backup: lazy(() => import('./sections/Backup')),
  Sitemap: lazy(() => import('./sections/Sitemap')),
  ContentTypes: lazy(() => import('./sections/ContentTypes')),
  Checklist: lazy(() => import('./sections/Checklist')),
  Future: lazy(() => import('./sections/Future')),
}

function GuideSidebar({ activeSlug }) {
  return (
    <aside className={styles.toc} aria-label="Guide chapters">
      <h2>Guide chapters</h2>
      {GUIDE_CHAPTERS.map((chapter) => {
        const to = guidePath(chapter.slug)
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
      <Link to={SERVER_REQUIREMENTS.to} className={styles.tocExternal}>
        {SERVER_REQUIREMENTS.label} ↗
      </Link>
    </aside>
  )
}

export default function AdminGuidePage() {
  const { section } = useParams()
  const found = findGuideChapter(section)

  if (!found) {
    return <Navigate to={GUIDE_BASE} replace />
  }

  const { current, prev, next } = found
  const Page = CHAPTER_PAGES[current.page]
  const stepLabel = `${found.index + 1} of ${GUIDE_CHAPTERS.length}`

  return (
    <div>
      <div className={styles.pageHeader}>
        <p className={styles.brandEyebrow}>Administrator guide · {stepLabel}</p>
        <h1>{current.title}</h1>
        <p className={styles.lede}>
          Short chapters so staff can follow one topic at a time. Use <strong>Back</strong> /{' '}
          <strong>Next</strong> below, or jump from the chapter list. Technical details for Diocese IT and
          the hosting partner: <Link to={SERVER_REQUIREMENTS.to}>{SERVER_REQUIREMENTS.to}</Link>
        </p>
      </div>

      <DocsToolbar
        downloadHref="/evaluation-downloads/sitemap-and-admin-guide.md"
        downloadLabel="Download full guide (.md)"
      />

      <div className={styles.layout}>
        <GuideSidebar activeSlug={current.slug} />
        <article className={styles.article}>
          <Suspense fallback={<PageLoader />}>
            <Page />
          </Suspense>

          <DocsCrossNav
            prev={
              prev
                ? { to: guidePath(prev.slug), label: prev.label }
                : { to: '/docs', label: 'Documentation hub' }
            }
            next={
              next
                ? { to: guidePath(next.slug), label: next.label }
                : { to: SERVER_REQUIREMENTS.to, label: SERVER_REQUIREMENTS.label }
            }
          />
        </article>
      </div>
    </div>
  )
}
