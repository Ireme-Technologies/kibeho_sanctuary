import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { occasionCopy, pickSiteOccasion } from '@utils/occasion'
import { hasLocaleTranslation } from '@components/ContentLocaleNotice'
import { displayTitleLabel, displayCapsLabel } from '@i18n/typography'
import { parseYoutubeId, youtubeEmbedUrl } from '@utils/youtube'
import { firstUsableImage } from '@utils/siteImages'
import {
  heroMode as fbMode,
  heroHeading as fbHeading,
  heroCaption as fbCaption,
  heroSlides as fbSlides,
  heroVideo as fbVideo,
  heroCoverImage as fbCover,
  heroForeground as fbForeground,
  heroCTAs as fbCTAs,
} from '../../data/home/HomeHero.js'
import styles from './HomeHero.module.css'

function normalizeMode(raw) {
  if (raw === 'video' || raw === 'cover' || raw === 'slider') return raw
  return 'cover'
}

const LEGACY_MEDIA =
  /construction|structural|mep-engineering|interior-design|building-compliance|sustainable-construction|professional-project|hero-slide|loader|crane/i

function sanitizeMedia(src, fallback = '') {
  if (!src || LEGACY_MEDIA.test(src)) return firstUsableImage([fallback])
  return firstUsableImage([src, fallback])
}

function resolveCtas(raw) {
  const primary = raw?.primary || fbCTAs.primary
  const secondary = raw?.secondary || fbCTAs.secondary
  return {
    primary: {
      label: primary.label || fbCTAs.primary.label,
      link: primary.link || primary.path || fbCTAs.primary.link,
    },
    secondary: {
      label: secondary.label || fbCTAs.secondary.label,
      link: secondary.link || secondary.path || fbCTAs.secondary.link,
    },
  }
}

export default function HomeHero() {
  const { section, company, pages, upcomingPilgrimages } = useContent()
  const { t, locale, defaultLocale } = useLocale()
  const hero = section('home.hero')
  const heroTranslated = hasLocaleTranslation(pages?.['home.hero']?.translations, locale, defaultLocale)

  const rawSlides = hero.slides?.length ? hero.slides : fbSlides
  const firstLegacy = rawSlides[0] || {}
  const mode = normalizeMode(hero.mode || fbMode)
  const heading = heroTranslated
    ? hero.heading ||
      hero.title ||
      firstLegacy.headline ||
      company?.name ||
      fbHeading
    : t('brand.name') || hero.heading || company?.name || fbHeading
  const caption = hero.caption || hero.subline || firstLegacy.subline || fbCaption
  const heroCTAs = resolveCtas(hero.ctas)
  const foreground = hero.foreground || fbForeground
  const coverImage = sanitizeMedia(
    hero.coverImage || rawSlides.find((s) => s.type !== 'video' && s.src)?.src || fbCover,
    fbCover
  )
  const legacyVideo = rawSlides.find((s) => s.type === 'video' && s.src)
  const videoProvider =
    hero.video?.provider === 'youtube' || parseYoutubeId(hero.video?.youtubeUrl || hero.video?.src || '')
      ? 'youtube'
      : 'file'
  const youtubeId = parseYoutubeId(hero.video?.youtubeUrl || (videoProvider === 'youtube' ? hero.video?.src : '') || '')
  const video = {
    provider: youtubeId ? 'youtube' : 'file',
    src: hero.video?.src || legacyVideo?.src || fbVideo.src,
    youtubeId,
    embedUrl: youtubeId ? `${youtubeEmbedUrl(youtubeId)}?autoplay=1&mute=1&controls=0&loop=1&playlist=${youtubeId}` : '',
    poster: sanitizeMedia(hero.video?.poster || legacyVideo?.poster || fbVideo.poster, fbCover),
  }

  const siteOccasion = pickSiteOccasion(upcomingPilgrimages)
  const occasion = occasionCopy(siteOccasion)
  const occasionImage = sanitizeMedia(siteOccasion?.item?.image || '', '')

  const slides = rawSlides
    .filter((slide) => slide.type !== 'video')
    .map((slide, index) => ({
      id: slide.id || index + 1,
      src: sanitizeMedia(slide.src || '', fbCover),
      duration: slide.duration ?? 8000,
    }))
    .filter((slide) => slide.src)

  if (occasion && occasionImage && slides[0]?.src !== occasionImage) {
    slides.unshift({ id: 'occasion', src: occasionImage, duration: 9000 })
  }

  const [currentIndex, setCurrentIndex] = useState(0)
  const [foregroundVisible, setForegroundVisible] = useState(false)
  const [coverMovedOn, setCoverMovedOn] = useState(false)
  const timerRef = useRef(null)
  const isAdvancingRef = useRef(false)
  const videoRef = useRef(null)

  const currentSlide = slides[currentIndex] || slides[0]

  const advance = useCallback(
    (toIndex = null) => {
      if (mode !== 'slider' || slides.length < 2) return
      if (isAdvancingRef.current) return
      isAdvancingRef.current = true

      setCurrentIndex((prev) => (toIndex !== null ? toIndex : (prev + 1) % slides.length))

      setTimeout(() => {
        isAdvancingRef.current = false
      }, 1300)
    },
    [mode, slides.length]
  )

  useEffect(() => {
    if (mode !== 'slider' || slides.length < 2 || !currentSlide) return

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => advance(), currentSlide.duration ?? 8000)
    return () => clearTimeout(timerRef.current)
  }, [mode, currentIndex, currentSlide, advance, slides.length])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  useEffect(() => {
    if (mode !== 'video' || video.provider === 'youtube') return
    const videoEl = videoRef.current
    if (!videoEl) return
    videoEl.muted = true
    videoEl.playsInline = true
    const playPromise = videoEl.play()
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {})
    }
  }, [mode, video.src, video.provider])

  useEffect(() => {
    if (mode !== 'cover') {
      setForegroundVisible(false)
      return
    }
    const t = setTimeout(() => setForegroundVisible(true), 250)
    return () => clearTimeout(t)
  }, [mode])

  useEffect(() => {
    setCurrentIndex(0)
    setCoverMovedOn(false)
  }, [mode, slides.length, occasion?.path])

  useEffect(() => {
    if (!occasion || mode === 'slider') return undefined
    const wait = setTimeout(() => setCoverMovedOn(true), 8000)
    return () => clearTimeout(wait)
  }, [occasion?.path, mode])

  const goToSlide = (index) => {
    if (index === currentIndex) return
    clearTimeout(timerRef.current)
    advance(index)
  }

  const showForeground = mode === 'cover' && foreground?.src
  const showOccasionCopy = Boolean(occasion) && (mode === 'slider' ? currentIndex === 0 : !coverMovedOn)
  const occasionCaption = String(
    siteOccasion?.item?.shortDescription || siteOccasion?.item?.short_description || occasion?.message || ''
  ).replace(/<[^>]+>/g, '')

  return (
    <section className={styles.hero} aria-label="Shrine of Our Lady of Kibeho welcome">
      <div className={styles.background} aria-hidden="true">
        {mode === 'slider' &&
          slides.map((slide, i) => {
            const isActive = i === currentIndex
            return (
              <div
                key={slide.id}
                className={`${styles.slide} ${isActive ? styles.slideActive : ''}`}
                style={{ '--slide-duration': `${slide.duration ?? 8000}ms` }}
              >
                <div
                  className={styles.media}
                  style={{ backgroundImage: `url(${slide.src})` }}
                />
              </div>
            )
          })}

        {mode === 'video' && (
          <div className={`${styles.slide} ${styles.slideActive}`}>
            {video.provider === 'youtube' && video.embedUrl ? (
              <iframe
                className={styles.media}
                src={video.embedUrl}
                title="Homepage video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : video.src ? (
              <video
                ref={videoRef}
                className={styles.media}
                src={video.src}
                poster={video.poster || undefined}
                preload="auto"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <div className={`${styles.media} ${styles.fallback}`} />
            )}
          </div>
        )}

        {mode === 'cover' && (
          <div className={`${styles.slide} ${styles.slideActive}`}>
            {coverImage ? (
              <div
                className={styles.media}
                style={{
                  backgroundImage: `url(${showOccasionCopy && occasionImage ? occasionImage : coverImage})`,
                }}
              />
            ) : (
              <div className={`${styles.media} ${styles.fallback}`} />
            )}
          </div>
        )}

        {mode === 'slider' && !slides.length && (
          <div className={`${styles.slide} ${styles.slideActive}`}>
            <div className={`${styles.media} ${styles.fallback}`} />
          </div>
        )}

        <div className={styles.overlay} />
      </div>

      <div className={styles.contentWrapper}>
        <div className={`container ${styles.grid} ${showForeground ? '' : styles.gridSingle}`}>
          <div key={showOccasionCopy ? 'occasion' : 'brand'} className={styles.textContent}>
            {showOccasionCopy ? (
              <>
                <p className={styles.kicker}>{occasion.kicker}</p>
                <h1 className={styles.headline}>{displayTitleLabel(siteOccasion.item.title, locale)}</h1>
                {occasionCaption ? <p className={styles.subline}>{occasionCaption}</p> : null}
                <div className={styles.buttons}>
                  <Link to={occasion.path} className={styles.btnPrimary}>
                    {displayCapsLabel(occasion.cta, locale)}
                  </Link>
                  <Link to={heroCTAs.secondary.link} className={styles.btnSecondary}>
                    {displayCapsLabel(heroCTAs.secondary.label, locale)}
                  </Link>
                </div>
              </>
            ) : (
              <>
                <p className={styles.kicker}>{t('brand.diocese')}</p>
                <h1 className={styles.headline}>{displayTitleLabel(heading, locale)}</h1>
                {caption ? (
                  <p className={styles.subline}>{String(caption).replace(/<[^>]+>/g, '')}</p>
                ) : null}
                <div className={styles.buttons}>
                  <Link to={heroCTAs.primary.link} className={styles.btnPrimary}>
                    {displayCapsLabel(heroCTAs.primary.label, locale)}
                  </Link>
                  <Link to={heroCTAs.secondary.link} className={styles.btnSecondary}>
                    {displayCapsLabel(heroCTAs.secondary.label, locale)}
                  </Link>
                </div>
              </>
            )}
          </div>

          {showForeground && (
            <div
              className={`${styles.foreground} ${
                foregroundVisible ? styles.foregroundVisible : ''
              }`}
            >
              <img src={foreground.src} alt={foreground.alt || ''} />
            </div>
          )}
        </div>
      </div>

      {mode === 'slider' && slides.length > 1 && (
        <div className={styles.dots} role="tablist" aria-label="Slide navigation">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              role="tab"
              aria-selected={i === currentIndex}
              aria-label={`Slide ${i + 1}`}
              className={`${styles.dot} ${i === currentIndex ? styles.dotActive : ''}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      )}
    </section>
  )
}
