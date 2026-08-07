import { useState } from 'react'
import { useInView } from '@hooks/useInView'
import ImageLightbox from '@components/ui/ImageLightbox'
import styles from './OurStory.module.css'
import { useContent } from '@context/ContentContext'
import { storyContent as fb } from '@data/about'

// Stat row — kept in sync with HomeStats.js figures (10+ / 30+ / 50+)
const stats = [
  { value: '10+', label: 'Years Experience' },
  { value: '30+', label: 'Projects' },
  { value: '50+', label: 'Happy Clients' },
]

export default function OurStory() {
  const { section } = useContent()
  const storyContent = Object.keys(section('about.story')).length ? section('about.story') : fb
  const [ref, inView] = useInView(0.15)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  // Stagger offsets: paragraphs first, then quote, then stats
  const paragraphDelay = (i) => `${0.3 + i * 0.15}s`
  const quoteDelay = `${0.3 + storyContent.paragraphs.length * 0.15 + 0.1}s`
  const statsDelay = `${0.3 + storyContent.paragraphs.length * 0.15 + 0.3}s`

  return (
    <section className={styles.section} aria-labelledby="story-heading">
      <div ref={ref} className={styles.container}>

        {/* ── TEXT COLUMN (left) ───────────────── */}
        <div
          className={`${styles.textColumn} ${inView ? styles.textColumnVisible : ''}`}
        >
          <h2 id="story-heading" className={styles.heading}>
            {storyContent.heading}
          </h2>

          <div className={styles.accentLine} aria-hidden="true" />

          <div className={styles.paragraphs}>
            {storyContent.paragraphs.map((para, i) => (
              <p
                key={i}
                className={`${styles.paragraph} fade-in-up ${inView ? 'is-visible' : ''}`}
                style={{ animationDelay: paragraphDelay(i) }}
              >
                {para}
              </p>
            ))}
          </div>

          <blockquote
            className={`${styles.quote} fade-in-up ${inView ? 'is-visible' : ''}`}
            style={{ animationDelay: quoteDelay }}
          >
            <p>{storyContent.quote}</p>
          </blockquote>

          <div
            className={`${styles.stats} fade-in-up ${inView ? 'is-visible' : ''}`}
            style={{ animationDelay: statsDelay }}
          >
            {stats.map((stat, i) => (
              <div key={i} className={styles.statItem}>
                <span className={styles.statValue}>{stat.value}</span>
                <span className={styles.statLabel}>{stat.label}</span>
                {i < stats.length - 1 && <div className={styles.statDot} aria-hidden="true" />}
              </div>
            ))}
          </div>
        </div>

        {/* ── IMAGE COLUMN (right) ─────────────── */}
        <div
          className={`${styles.imageColumn} ${inView ? styles.imageColumnVisible : ''}`}
        >
          <button
            type="button"
            className={styles.imageFrame}
            onClick={() => setLightboxOpen(true)}
            aria-label="View story image"
          >
            <img
              src={storyContent.image}
              alt={storyContent.imageAlt}
              className={styles.image}
              loading="lazy"
            />
          </button>
        </div>

      </div>

      <ImageLightbox
        open={lightboxOpen}
        images={[{ src: storyContent.image, alt: storyContent.imageAlt || '' }]}
        index={0}
        onClose={() => setLightboxOpen(false)}
      />
    </section>
  )
}