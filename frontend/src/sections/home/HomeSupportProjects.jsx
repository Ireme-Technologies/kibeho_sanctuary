import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useInView } from '@hooks/useInView'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { fetchShrineProjects } from '@api/cms'
import { cardExcerpt } from '@utils/text'
import { mergePageContent } from '@data/pages/mergePageContent'
import styles from './HomeNewsSimple.module.css'
import local from './HomeSupportProjects.module.css'

const COVER_BY_SLUG = {
  'master-plan-phase-one': '/images/sanctuary/hills.jpg',
  'pilgrim-welcome-centre': '/images/sanctuary/welcome.jpg',
}

const FALLBACK_PROJECTS = [
  {
    slug: 'master-plan-phase-one',
    title: 'Shrine Master Plan — Phase One',
    status: 'In progress',
    shortDescription:
      'Pathways, sanitation, and hospitality so pilgrims can be received with dignity.',
    path: '/support/projects/master-plan-phase-one',
    coverImage: COVER_BY_SLUG['master-plan-phase-one'],
  },
  {
    slug: 'pilgrim-welcome-centre',
    title: 'Pilgrim Welcome Centre',
    status: 'Planning',
    shortDescription:
      'A house of orientation, information, and pastoral accompaniment at the gate of the Shrine.',
    path: '/support/projects/pilgrim-welcome-centre',
    coverImage: COVER_BY_SLUG['pilgrim-welcome-centre'],
  },
]

export default function HomeSupportProjects() {
  const { section, defaultHeaderImage } = useContent()
  const { locale, t } = useLocale()
  const meta = mergePageContent(
    {
      eyebrow: t('home.projectsEyebrow'),
      heading: t('home.projectsHeading'),
      subtext: t('home.projectsSubtext'),
    },
    section('home.supportProjects', {}),
  )
  const [items, setItems] = useState(FALLBACK_PROJECTS)
  const [ref, inView] = useInView(0.12)

  useEffect(() => {
    fetchShrineProjects({ locale })
      .then((rows) => {
        if (!Array.isArray(rows) || !rows.length) return
        setItems(
          rows.slice(0, 3).map((item) => ({
            ...item,
            coverImage:
              item.coverImage || COVER_BY_SLUG[item.slug] || defaultHeaderImage,
            path: item.path || `/support/projects/${item.slug}`,
          })),
        )
      })
      .catch(() => {})
  }, [locale, defaultHeaderImage])

  if (!items.length) return null

  return (
    <section className={styles.section} ref={ref} aria-labelledby="home-projects-heading">
      <div className="container">
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>{meta.eyebrow}</p>
            <h2 id="home-projects-heading">{meta.heading}</h2>
            <p>{meta.subtext}</p>
          </div>
          <div className={local.links}>
            <Link to="/support/master-plan" className={styles.more}>
              {t('home.viewMasterPlan')} →
            </Link>
            <Link to="/support/projects" className={styles.more}>
              {t('home.viewProjects')} →
            </Link>
          </div>
        </div>
        <div className={`${styles.grid} ${items.length < 3 ? local.gridTwo : ''} ${inView ? styles.visible : ''}`}>
          {items.map((item, index) => (
            <Link
              key={item.slug || item.id}
              to={item.path}
              className={styles.card}
              style={{ animationDelay: `${index * 0.08}s` }}
            >
              <div className={styles.imageWrap}>
                <img
                  src={item.coverImage || defaultHeaderImage}
                  alt=""
                  aria-hidden="true"
                />
              </div>
              <div className={styles.body}>
                {item.status ? <span>{item.status}</span> : null}
                <h3>{item.title}</h3>
                {cardExcerpt(item) ? <p className={local.excerpt}>{cardExcerpt(item)}</p> : null}
                <em>{t('project.cardCta')}</em>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
