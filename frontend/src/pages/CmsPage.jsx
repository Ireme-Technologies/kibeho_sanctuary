import { useState } from 'react'
import { ExternalLink, Play, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { sectionKeyForPath } from '@data/pages/registry'
import { getPageFallback } from '@data/pages/content'
import { parseYoutubeId, youtubeEmbedUrl, youtubeThumbUrl, youtubeWatchUrl } from '@utils/youtube'
import RichText from '@components/ui/RichText'
import NotFoundPage from './NotFoundPage'
import styles from './CmsPage.module.css'

function YoutubeBlock({ block }) {
  const [open, setOpen] = useState(false)
  const ytId = parseYoutubeId(block.url)
  if (!ytId) return null
  const watchUrl = youtubeWatchUrl(ytId)
  const embedUrl = youtubeEmbedUrl(ytId)
  const thumb = youtubeThumbUrl(ytId)

  return (
    <div className={styles.youtubeBlock}>
      {block.title ? <h3 className={styles.blockHeading}>{block.title}</h3> : null}
      <button type="button" className={styles.youtubeThumb} onClick={() => setOpen(true)}>
        <img src={thumb} alt={block.title || 'Watch video'} />
        <span className={styles.playBadge} aria-hidden="true">
          <Play size={28} fill="currentColor" />
        </span>
      </button>
      <div className={styles.youtubeActions}>
        <button type="button" className={styles.btn} onClick={() => setOpen(true)}>
          Watch here
        </button>
        <a className={styles.btnGhost} href={watchUrl} target="_blank" rel="noopener noreferrer">
          Watch on YouTube <ExternalLink size={14} />
        </a>
      </div>
      {open ? (
        <div className={styles.modal} role="dialog" aria-modal="true" aria-label={block.title || 'Video'}>
          <button type="button" className={styles.backdrop} aria-label="Close" onClick={() => setOpen(false)} />
          <div className={styles.modalPanel}>
            <div className={styles.modalHead}>
              <h3>{block.title || 'Video'}</h3>
              <button type="button" className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close">
                <X size={22} />
              </button>
            </div>
            <div className={styles.player}>
              <iframe
                title={block.title || 'YouTube video'}
                src={`${embedUrl}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function Block({ block }) {
  if (!block?.type) return null

  if (block.type === 'heading') {
    return <h2 className={styles.blockHeading}>{block.text}</h2>
  }

  if (block.type === 'paragraph') {
    return <RichText html={block.text} className={styles.paragraph} />
  }

  if (block.type === 'note') {
    return <RichText html={block.text} as="aside" className={styles.note} />
  }

  if (block.type === 'list') {
    return (
      <ul className={styles.list}>
        {(block.items || []).map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }

  if (block.type === 'gallery') {
    const images = (block.images || []).filter(Boolean)
    if (!images.length) return null
    return (
      <div className={styles.galleryGrid}>
        {images.map((src) => (
          <figure key={src} className={styles.galleryItem}>
            <img src={src} alt="" loading="lazy" />
          </figure>
        ))}
      </div>
    )
  }

  if (block.type === 'youtube') {
    return <YoutubeBlock block={block} />
  }

  if (block.type === 'cards') {
    return (
      <div className={styles.cards}>
        {(block.items || []).map((item) => {
          const inner = (
            <>
              <h3>{item.title}</h3>
              <RichText html={item.text} />
            </>
          )
          return item.path ? (
            <Link key={item.title} to={item.path} className={styles.card}>
              {inner}
            </Link>
          ) : (
            <article key={item.title} className={styles.card}>
              {inner}
            </article>
          )
        })}
      </div>
    )
  }

  if (block.type === 'steps') {
    return (
      <ol className={styles.steps}>
        {(block.items || []).map((item, index) => (
          <li key={item.title}>
            <span className={styles.stepNum}>{index + 1}</span>
            <div>
              <h3>{item.title}</h3>
              <RichText html={item.text} />
              {item.path ? (
                <Link to={item.path} className={styles.inlineLink}>
                  Learn more →
                </Link>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    )
  }

  if (block.type === 'schedule') {
    return (
      <ul className={styles.schedule}>
        {(block.items || []).map((item) => (
          <li key={`${item.when}-${item.title}`}>
            <div>
              <p className={styles.when}>{item.when}</p>
              <p className={styles.event}>{item.title}</p>
            </div>
            <p className={styles.time}>{item.time}</p>
          </li>
        ))}
      </ul>
    )
  }

  if (block.type === 'hotels') {
    return (
      <div className={styles.hotels}>
        {(block.items || []).map((item) => (
          <article key={item.title} className={styles.hotel}>
            <h3>{item.title}</h3>
            <p className={styles.meta}>
              {item.distance}
              {item.contact ? ` · ${item.contact}` : ''}
            </p>
            <RichText html={item.text} />
            {item.facilities?.length ? (
              <ul className={styles.facilityTags}>
                {item.facilities.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            ) : null}
          </article>
        ))}
      </div>
    )
  }

  return null
}

export default function CmsPage() {
  const { pathname } = useLocation()
  const { section } = useContent()
  const key = sectionKeyForPath(pathname)
  if (!key) return <NotFoundPage />

  const fallback = getPageFallback(key) || {}
  const data = { ...fallback, ...section(key, {}) }
  const blocks = data.blocks?.length ? data.blocks : fallback.blocks || []
  const links = data.links?.length ? data.links : fallback.links || []
  const cta = data.cta || fallback.cta

  return (
    <div className={styles.page}>
      <header
        className={styles.hero}
        style={
          data.heroImage
            ? { backgroundImage: `linear-gradient(120deg, rgba(18,40,71,.88), rgba(26,54,93,.5)), url(${data.heroImage})` }
            : undefined
        }
      >
        <div className="container">
          {data.eyebrow ? <p className={styles.eyebrow}>{data.eyebrow}</p> : null}
          <h1>{data.title || fallback.title}</h1>
          {data.subtitle ? <p className={styles.subtitle}>{data.subtitle}</p> : null}
        </div>
      </header>

      <div className={`container ${styles.body}`}>
        {data.intro ? <RichText html={data.intro} className={styles.intro} /> : null}

        {links.length > 0 ? (
          <nav className={styles.linkGrid} aria-label="Section pages">
            {links.map((link) => (
              <Link key={link.path} to={link.path} className={styles.linkCard}>
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}

        {blocks.map((block, index) => (
          <Block key={`${block.type}-${index}`} block={block} />
        ))}

        {cta?.primary ? (
          <div className={styles.ctaRow}>
            <Link to={cta.primary.path} className={styles.btn}>
              {cta.primary.label}
            </Link>
            {cta.secondary ? (
              <Link to={cta.secondary.path} className={styles.btnGhost}>
                {cta.secondary.label}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  )
}
