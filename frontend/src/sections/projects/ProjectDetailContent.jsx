import { Link } from 'react-router-dom'
import { useInView } from '@hooks/useInView'
import GallerySlider from '@sections/projects/GallerySlider/GallerySlider'
import RichText from '@components/ui/RichText'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import styles from './ProjectDetailContent.module.css'
import { useContent } from '@context/ContentContext'
import { projectDetailLabels } from '@data/projects'

function RelatedProject({ project, index, inView }) {
  return (
    <Link
      to={`/projects/${project.slug}`}
      className={`${styles.relatedCard} fade-in-up ${inView ? 'is-visible' : ''}`}
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className={styles.relatedImageWrapper}>
        <img
          src={project.coverImage}
          alt={project.title}
          className={styles.relatedImage}
          loading="lazy"
        />
        <div className={styles.relatedOverlay} />
        <div className={styles.relatedInfo}>
          <span className={styles.relatedCategory}>{project.category}</span>
          <h3 className={styles.relatedTitle}>{project.title}</h3>
        </div>
      </div>
    </Link>
  )
}

export default function ProjectDetailContent({ project }) {
  const { projects } = useContent()
  const [overviewRef, overviewInView] = useInView(0.2)
  const [galleryRef, galleryInView] = useInView(0.2)
  const [relatedRef, relatedInView] = useInView(0.15)

  const relatedProjects = projects
    .filter((item) => item.slug !== project.slug && item.category === project.category)
    .slice(0, 3)

  const fallbackProjects = projects
    .filter((item) => item.slug !== project.slug && !relatedProjects.includes(item))
    .slice(0, 3 - relatedProjects.length)

  const related = [...relatedProjects, ...fallbackProjects]

  return (
    <main className={styles.page}>

      {/* ── OVERVIEW + SPECS ─────────────────── */}
      <section className={styles.detailSection} aria-label="Project overview">
        <div ref={overviewRef} className={styles.detailInner}>

          <div className={`${styles.overviewBlock} fade-in-up ${overviewInView ? 'is-visible' : ''}`}>
            <ContentLocaleNotice translations={project.translations} />
            <h2 className={styles.blockHeading}>{projectDetailLabels.overviewHeading}</h2>
            <div className={styles.accentLine} aria-hidden="true" />
            <RichText html={project.description} className={styles.description} />
            <div className={styles.servicesBlock}>
              <h3 className={styles.servicesHeading}>{projectDetailLabels.servicesHeading}</h3>
              <div className={styles.tags}>
                {project.services.map((service) => (
                  <span key={service} className={styles.tag}>
                    {service}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div
            className={`${styles.specsBlock} fade-in-up ${overviewInView ? 'is-visible' : ''}`}
            style={{ animationDelay: '0.15s' }}
          >
            <h2 className={styles.blockHeading}>{projectDetailLabels.specsHeading}</h2>
            <div className={styles.accentLine} aria-hidden="true" />
            <dl className={styles.specsList}>
              {Object.entries(project.specs).map(([key, value]) => (
                <div key={key} className={styles.specRow}>
                  <dt className={styles.specKey}>{key}</dt>
                  <dd className={styles.specVal}>{value}</dd>
                </div>
              ))}
            </dl>
            <Link to="/contact" className={styles.ctaBtn}>
              {projectDetailLabels.ctaLabel}
            </Link>
          </div>

        </div>
      </section>

      {/* ── GALLERY (now GallerySlider instead of static grid) ── */}
      <section className={styles.gallerySection} aria-label="Project gallery">
        <div ref={galleryRef} className={styles.galleryContainer}>
          <h2 className={`${styles.blockHeading} fade-in-up ${galleryInView ? 'is-visible' : ''}`}>
            {projectDetailLabels.galleryHeading}
          </h2>

          <div
            className={`${styles.galleryWrapper} fade-in-up ${galleryInView ? 'is-visible' : ''}`}
            style={{ animationDelay: '0.1s' }}
          >
            <GallerySlider images={project.gallery} title={project.title} />
          </div>
        </div>
      </section>

      {/* ── RELATED PROJECTS ─────────────────── */}
      {related.length > 0 && (
        <section className={styles.relatedSection} aria-label="Related projects">
          <div ref={relatedRef} className={styles.relatedContainer}>
            <h2 className={`${styles.relatedHeading} fade-in-up ${relatedInView ? 'is-visible' : ''}`}>
              {projectDetailLabels.relatedHeading}
            </h2>
            <div className={styles.relatedGrid}>
              {related.map((item, i) => (
                <RelatedProject key={item.slug} project={item} index={i} inView={relatedInView} />
              ))}
            </div>
          </div>
        </section>
      )}

    </main>
  )
}