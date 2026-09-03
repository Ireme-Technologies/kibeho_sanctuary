import { useEffect, useState } from 'react'
import { fetchPages, updatePageSection } from '@api/cms'
import { useLocale } from '@context/LocaleContext'
import ImageField from './components/ImageField'
import MediaField from './components/MediaField'
import FlashMessage from './components/FlashMessage'
import { confirmDelete } from './components/confirmDelete'
import { confirmAction } from './components/notify'
import RichTextEditor from './components/RichTextEditor'
import LocaleTabs, { isFilledValue } from './components/LocaleTabs'
import { parseYoutubeId } from '@utils/youtube'
import styles from './admin.module.css'

const MODES = [
  {
    value: 'slider',
    label: 'Sliding images',
    hint: 'Rotate through several photos',
  },
  {
    value: 'video',
    label: 'Video',
    hint: 'Upload a file or paste YouTube',
  },
  {
    value: 'cover',
    label: 'One cover image',
    hint: 'Single photo with optional figure',
  },
]

const emptyForm = {
  mode: 'slider',
  heading: '',
  caption: '',
  slides: [],
  videoSource: 'file',
  videoSrc: '',
  youtubeUrl: '',
  videoPoster: '',
  coverImage: '',
  foregroundSrc: '',
  foregroundAlt: '',
  primaryLabel: 'View Our Projects',
  primaryLink: '/projects',
  secondaryLabel: 'Get in Touch',
  secondaryLink: '/contact',
}

function contentToForm(content = {}) {
  const rawSlides = Array.isArray(content.slides) ? content.slides : []
  const slides = rawSlides
    .filter((slide) => slide.type !== 'video')
    .map((slide, index) => ({
      id: slide.id || index + 1,
      src: slide.src || '',
      duration: slide.duration || 7000,
    }))

  const legacyVideoSlide = rawSlides.find((slide) => slide.type === 'video' && slide.src)
  const firstImageSlide = rawSlides.find((slide) => slide.type !== 'video' && slide.src)
  const firstTextSlide = rawSlides[0] || {}
  const videoProvider = content.video?.provider === 'youtube' ? 'youtube' : 'file'
  const youtubeUrl = content.video?.youtubeUrl || (videoProvider === 'youtube' ? content.video?.src : '') || ''

  return {
    mode: content.mode || 'slider',
    heading: content.heading || content.title || firstTextSlide.headline || '',
    caption: content.caption || content.subline || firstTextSlide.subline || '',
    slides,
    videoSource: videoProvider,
    videoSrc: videoProvider === 'file' ? content.video?.src || legacyVideoSlide?.src || '' : '',
    youtubeUrl,
    videoPoster: content.video?.poster || legacyVideoSlide?.poster || '',
    coverImage: content.coverImage || firstImageSlide?.src || '',
    foregroundSrc: content.foreground?.src || '',
    foregroundAlt: content.foreground?.alt || '',
    primaryLabel: content.ctas?.primary?.label || emptyForm.primaryLabel,
    primaryLink: content.ctas?.primary?.link || emptyForm.primaryLink,
    secondaryLabel: content.ctas?.secondary?.label || emptyForm.secondaryLabel,
    secondaryLink: content.ctas?.secondary?.link || emptyForm.secondaryLink,
  }
}

function formatSeconds(ms) {
  const seconds = Math.max(1, Math.round((Number(ms) || 7000) / 1000))
  return `${seconds}s`
}

function getHeroField(form, translations, field, locale, defaultLocale) {
  if (locale === defaultLocale) return form[field] ?? ''
  const overlay = translations?.[locale]?.content || {}
  if (field === 'primaryLabel') return overlay.ctas?.primary?.label ?? ''
  if (field === 'secondaryLabel') return overlay.ctas?.secondary?.label ?? ''
  if (field === 'foregroundAlt') return overlay.foreground?.alt ?? ''
  return overlay[field] ?? ''
}

function setHeroField(form, translations, field, locale, value, defaultLocale) {
  if (locale === defaultLocale) {
    return { form: { ...form, [field]: value }, translations }
  }
  const prevContent = translations?.[locale]?.content || {}
  let contentPatch
  if (field === 'primaryLabel') {
    contentPatch = {
      ...prevContent,
      ctas: { ...prevContent.ctas, primary: { ...prevContent.ctas?.primary, label: value } },
    }
  } else if (field === 'secondaryLabel') {
    contentPatch = {
      ...prevContent,
      ctas: { ...prevContent.ctas, secondary: { ...prevContent.ctas?.secondary, label: value } },
    }
  } else if (field === 'foregroundAlt') {
    contentPatch = {
      ...prevContent,
      foreground: { ...prevContent.foreground, alt: value },
    }
  } else {
    contentPatch = { ...prevContent, [field]: value }
  }
  return {
    form,
    translations: {
      ...(translations || {}),
      [locale]: { ...(translations?.[locale] || {}), content: contentPatch },
    },
  }
}

function buildHeroTranslations(translations, defaultLocale) {
  const result = {}
  Object.entries(translations || {}).forEach(([locale, pack]) => {
    if (locale === defaultLocale || !pack || typeof pack !== 'object') return
    const overlay = pack.content
    if (!overlay || typeof overlay !== 'object') return
    const content = {}
    ;['heading', 'caption'].forEach((field) => {
      if (overlay[field] != null && String(overlay[field]).trim() !== '') content[field] = overlay[field]
    })
    if (overlay.foreground?.alt?.trim()) {
      content.foreground = { alt: overlay.foreground.alt }
    }
    if (overlay.ctas?.primary?.label?.trim()) {
      content.ctas = { ...content.ctas, primary: { label: overlay.ctas.primary.label } }
    }
    if (overlay.ctas?.secondary?.label?.trim()) {
      content.ctas = {
        ...content.ctas,
        secondary: { label: overlay.ctas.secondary.label },
      }
    }
    if (Object.keys(content).length) result[locale] = { content }
  })
  return result
}

function heroLocaleFilled(form, translations, locale, defaultLocale) {
  if (locale === defaultLocale) {
    return isFilledValue(form.heading) || isFilledValue(form.caption) || isFilledValue(form.primaryLabel)
  }
  const overlay = translations?.[locale]?.content || {}
  return (
    isFilledValue(overlay.heading) ||
    isFilledValue(overlay.caption) ||
    isFilledValue(overlay.ctas?.primary?.label)
  )
}

function copyHeroLocaleFromDefault(form, translations, locale) {
  return {
    ...translations,
    [locale]: {
      content: {
        heading: form.heading || '',
        caption: form.caption || '',
        foreground: { alt: form.foregroundAlt || '' },
        ctas: {
          primary: { label: form.primaryLabel || '' },
          secondary: { label: form.secondaryLabel || '' },
        },
      },
    },
  }
}

export default function HomeHeroAdminPage() {
  const { defaultLocale } = useLocale()
  const [form, setForm] = useState(emptyForm)
  const [sectionTranslations, setSectionTranslations] = useState({})
  const [localeTab, setLocaleTab] = useState(defaultLocale || 'en')
  const [flash, setFlash] = useState({ type: 'success', message: '' })
  const [saving, setSaving] = useState(false)
  const [label, setLabel] = useState('Home Hero')

  const load = async () => {
    const data = await fetchPages()
    const section = data?.['home.hero']
    setLabel(section?.label || 'Home Hero')
    setForm(contentToForm(section?.content || {}))
    setSectionTranslations(section?.translations || {})
    setLocaleTab(defaultLocale || 'en')
  }

  useEffect(() => {
    load().catch((err) => setFlash({ type: 'error', message: err.message || 'Failed to load home hero' }))
  }, [])

  const updateSlide = (index, patch) => {
    setForm((prev) => ({
      ...prev,
      slides: prev.slides.map((slide, i) => (i === index ? { ...slide, ...patch } : slide)),
    }))
  }

  const addSlide = () => {
    setForm((prev) => ({
      ...prev,
      slides: [...prev.slides, { id: Date.now(), src: '', duration: 7000 }],
    }))
  }

  const removeSlide = async (index) => {
    if (!(await confirmDelete('Remove this hero slide?', { confirmLabel: 'Remove' }))) return
    setForm((prev) => ({
      ...prev,
      slides: prev.slides.filter((_, i) => i !== index),
    }))
  }

  const moveSlide = (index, direction) => {
    setForm((prev) => {
      const next = [...prev.slides]
      const target = index + direction
      if (target < 0 || target >= next.length) return prev
      ;[next[index], next[target]] = [next[target], next[index]]
      return { ...prev, slides: next }
    })
  }

  const changeHeroMode = async (nextMode) => {
    if (nextMode === form.mode) return
    const current = MODES.find((mode) => mode.value === form.mode)
    const next = MODES.find((mode) => mode.value === nextMode)
    const ok = await confirmAction({
      title: 'Change hero media type?',
      text: `Switch from “${current?.label || form.mode}” to “${next?.label || nextMode}”? Media settings for the current type will stay saved until you save with the new type.`,
      confirmLabel: 'Change type',
      cancelLabel: 'Keep current',
      icon: 'warning',
    })
    if (!ok) return
    setForm((prev) => ({ ...prev, mode: nextMode }))
  }

  const changeVideoSource = async (nextSource) => {
    if (nextSource === form.videoSource) return
    const ok = await confirmAction({
      title: 'Change video source?',
      text:
        nextSource === 'youtube'
          ? 'Switch to a YouTube URL? The uploaded video file setting will stay in place until you save.'
          : 'Switch to an uploaded video file? The YouTube URL setting will stay in place until you save.',
      confirmLabel: 'Change source',
      cancelLabel: 'Keep current',
      icon: 'warning',
    })
    if (!ok) return
    setForm((prev) => ({ ...prev, videoSource: nextSource }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setFlash({ type: 'success', message: '' })

    if (form.mode === 'slider' && !form.slides.some((slide) => slide.src)) {
      setFlash({ type: 'error', message: 'Add at least one slide image before saving.' })
      setSaving(false)
      return
    }

    if (form.mode === 'video' && form.videoSource === 'youtube' && !parseYoutubeId(form.youtubeUrl)) {
      setFlash({ type: 'error', message: 'Enter a valid YouTube URL for the hero video.' })
      setSaving(false)
      return
    }

    const content = {
      mode: form.mode,
      heading: form.heading.trim(),
      caption: form.caption.trim(),
      slides: form.slides
        .filter((slide) => slide.src)
        .map((slide, index) => ({
          id: slide.id || index + 1,
          src: slide.src,
          duration: Number(slide.duration) || 7000,
        })),
      video: {
        provider: form.videoSource === 'youtube' ? 'youtube' : 'file',
        src: form.videoSource === 'youtube' ? form.youtubeUrl : form.videoSrc,
        youtubeUrl: form.videoSource === 'youtube' ? form.youtubeUrl : '',
        poster: form.videoPoster,
      },
      coverImage: form.coverImage,
      foreground: {
        src: form.foregroundSrc,
        alt: form.foregroundAlt || 'Kibeho Sanctuary',
      },
      ctas: {
        primary: { label: form.primaryLabel, link: form.primaryLink },
        secondary: { label: form.secondaryLabel, link: form.secondaryLink },
      },
    }

    try {
      await updatePageSection('home.hero', {
        label,
        content,
        translations: buildHeroTranslations(sectionTranslations, defaultLocale),
      })
      await load()
      setFlash({ type: 'success', message: 'Home hero saved successfully.' })
    } catch (err) {
      setFlash({ type: 'error', message: err.message || 'Failed to save home hero.' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <div className={styles.topbar}>
        <h1>Home hero</h1>
      </div>

      <FlashMessage
        type={flash.type}
        message={flash.message}
        onClear={() => setFlash({ type: 'success', message: '' })}
      />

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSave} style={{ maxWidth: 920 }}>
          <p className={styles.muted}>
            Set the homepage welcome media, heading, caption, and buttons. Choose one media type below.
          </p>

          <div className={styles.field}>
            <label>Hero media type</label>
            <div className={styles.modeTabs} role="radiogroup" aria-label="Hero media type">
              {MODES.map((mode) => (
                <button
                  key={mode.value}
                  type="button"
                  role="radio"
                  aria-checked={form.mode === mode.value}
                  className={`${styles.modeTab} ${form.mode === mode.value ? styles.modeTabActive : ''}`}
                  onClick={() => changeHeroMode(mode.value)}
                >
                  <strong>{mode.label}</strong>
                  <span>{mode.hint}</span>
                </button>
              ))}
            </div>
          </div>

          <LocaleTabs
            value={localeTab}
            onChange={setLocaleTab}
            defaultLocale={defaultLocale}
            completeness={{
              rw: heroLocaleFilled(form, sectionTranslations, 'rw', defaultLocale),
              fr: heroLocaleFilled(form, sectionTranslations, 'fr', defaultLocale),
              en: heroLocaleFilled(form, sectionTranslations, 'en', defaultLocale),
              de: heroLocaleFilled(form, sectionTranslations, 'de', defaultLocale),
            }}
            onCopyFromDefault={() =>
              setSectionTranslations(copyHeroLocaleFromDefault(form, sectionTranslations, localeTab))
            }
          />

          <div className={styles.field}>
            <label>Heading</label>
            <input
              value={getHeroField(form, sectionTranslations, 'heading', localeTab, defaultLocale)}
              onChange={(e) => {
                const next = setHeroField(form, sectionTranslations, 'heading', localeTab, e.target.value, defaultLocale)
                setForm(next.form)
                setSectionTranslations(next.translations)
              }}
              placeholder="Main hero heading"
              required={localeTab === defaultLocale}
            />
          </div>

          <div className={styles.field}>
            <label>Caption</label>
            <RichTextEditor
              value={getHeroField(form, sectionTranslations, 'caption', localeTab, defaultLocale)}
              onChange={(html) => {
                const next = setHeroField(form, sectionTranslations, 'caption', localeTab, html, defaultLocale)
                setForm(next.form)
                setSectionTranslations(next.translations)
              }}
            />
          </div>

          {localeTab === defaultLocale ? (
            <>
          {form.mode === 'slider' && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>Sliding images</h2>
                  <p className={styles.muted} style={{ margin: '0.25rem 0 0' }}>
                    Upload or pick images, then set how long each slide stays on screen.
                  </p>
                </div>
                <button type="button" className={`${styles.btn} ${styles.btnSecondary}`} onClick={addSlide}>
                  Add slide
                </button>
              </div>

              {!form.slides.length ? (
                <div className={styles.emptyState}>
                  No slides yet. Add at least one image for the homepage carousel.
                </div>
              ) : (
                <div className={styles.slideList}>
                  {form.slides.map((slide, index) => (
                    <div key={slide.id || index} className={styles.slideCard}>
                      <div className={styles.slidePreview}>
                        {slide.src ? (
                          <img src={slide.src} alt="" />
                        ) : (
                          <div className={styles.slidePreviewEmpty}>No image selected</div>
                        )}
                      </div>

                      <div className={styles.slideBody}>
                        <div className={styles.slideMeta}>
                          <div>
                            <strong>Slide {index + 1}</strong>
                            <p className={styles.slideMetaHint}>
                              {slide.src ? `Shows for ${formatSeconds(slide.duration)}` : 'Choose an image'}
                            </p>
                          </div>
                          <div className={styles.actions}>
                            <button
                              type="button"
                              className={`${styles.btn} ${styles.btnSecondary}`}
                              onClick={() => moveSlide(index, -1)}
                              disabled={index === 0}
                              aria-label="Move slide up"
                            >
                              ↑
                            </button>
                            <button
                              type="button"
                              className={`${styles.btn} ${styles.btnSecondary}`}
                              onClick={() => moveSlide(index, 1)}
                              disabled={index === form.slides.length - 1}
                              aria-label="Move slide down"
                            >
                              ↓
                            </button>
                            <button
                              type="button"
                              className={`${styles.btn} ${styles.btnDanger}`}
                              onClick={() => removeSlide(index)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        <ImageField
                          label="Slide image"
                          value={slide.src}
                          onChange={(url) => updateSlide(index, { src: url })}
                          folder="hero"
                          hidePreview
                        />

                        <div className={styles.durationRow}>
                          <div className={styles.field}>
                            <label>Duration (seconds)</label>
                            <input
                              type="number"
                              min={2}
                              max={30}
                              step={1}
                              value={Math.round((Number(slide.duration) || 7000) / 1000)}
                              onChange={(e) =>
                                updateSlide(index, {
                                  duration: Math.max(2, Number(e.target.value) || 7) * 1000,
                                })
                              }
                            />
                          </div>
                          <div className={styles.durationHint} aria-hidden="true">
                            {formatSeconds(slide.duration)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {form.mode === 'video' && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>Hero video</h2>
                  <p className={styles.muted} style={{ margin: '0.25rem 0 0' }}>
                    Use an uploaded video file or a YouTube URL as the homepage background.
                  </p>
                </div>
              </div>
              <div className={styles.mediaTypeTabs}>
                <button
                  type="button"
                  className={`${styles.btn} ${form.videoSource === 'file' ? '' : styles.btnSecondary}`}
                  onClick={() => changeVideoSource('file')}
                >
                  Upload file
                </button>
                <button
                  type="button"
                  className={`${styles.btn} ${form.videoSource === 'youtube' ? '' : styles.btnSecondary}`}
                  onClick={() => changeVideoSource('youtube')}
                >
                  YouTube URL
                </button>
              </div>
              {form.videoSource === 'youtube' ? (
                <div className={styles.field}>
                  <label>YouTube URL</label>
                  <input
                    value={form.youtubeUrl}
                    onChange={(e) => setForm({ ...form, youtubeUrl: e.target.value })}
                    placeholder="https://www.youtube.com/watch?v=..."
                  />
                  {parseYoutubeId(form.youtubeUrl) ? (
                    <p className={styles.muted}>Video ID: {parseYoutubeId(form.youtubeUrl)}</p>
                  ) : (
                    <p className={styles.muted}>Paste a YouTube link to use as the homepage background video.</p>
                  )}
                </div>
              ) : (
                <MediaField
                  label="Video file"
                  value={form.videoSrc}
                  onChange={(url) => setForm({ ...form, videoSrc: url })}
                  folder="hero"
                  accept="video"
                />
              )}
              <ImageField
                label="Poster image (optional)"
                value={form.videoPoster}
                onChange={(url) => setForm({ ...form, videoPoster: url })}
                folder="hero"
              />
            </div>
          )}

          {form.mode === 'cover' && (
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <div>
                  <h2>Cover image</h2>
                  <p className={styles.muted} style={{ margin: '0.25rem 0 0' }}>
                    One full-bleed background image, with an optional person image on the right.
                  </p>
                </div>
              </div>
              <ImageField
                label="Background cover image"
                value={form.coverImage}
                onChange={(url) => setForm({ ...form, coverImage: url })}
                folder="hero"
              />
              <ImageField
                label="Front person image (shown on the right)"
                value={form.foregroundSrc}
                onChange={(url) => setForm({ ...form, foregroundSrc: url })}
                folder="hero"
              />
            </div>
          )}
            </>
          ) : (
            <p className={styles.muted}>
              Hero media (slides, video, cover images) is shared across languages. Switch to the default locale tab to edit media.
            </p>
          )}

          {form.mode === 'cover' ? (
            <div className={styles.field}>
              <label>Person image alt text</label>
              <input
                value={getHeroField(form, sectionTranslations, 'foregroundAlt', localeTab, defaultLocale)}
                onChange={(e) => {
                  const next = setHeroField(form, sectionTranslations, 'foregroundAlt', localeTab, e.target.value, defaultLocale)
                  setForm(next.form)
                  setSectionTranslations(next.translations)
                }}
                placeholder="Describe the person image"
              />
            </div>
          ) : null}

          <h2 className={styles.sectionTitle}>Call-to-action buttons</h2>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Primary button label</label>
              <input
                value={getHeroField(form, sectionTranslations, 'primaryLabel', localeTab, defaultLocale)}
                onChange={(e) => {
                  const next = setHeroField(form, sectionTranslations, 'primaryLabel', localeTab, e.target.value, defaultLocale)
                  setForm(next.form)
                  setSectionTranslations(next.translations)
                }}
              />
            </div>
            {localeTab === defaultLocale ? (
            <div className={styles.field}>
              <label>Primary button link</label>
              <input
                value={form.primaryLink}
                onChange={(e) => setForm({ ...form, primaryLink: e.target.value })}
              />
            </div>
            ) : null}
          </div>

          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label>Secondary button label</label>
              <input
                value={getHeroField(form, sectionTranslations, 'secondaryLabel', localeTab, defaultLocale)}
                onChange={(e) => {
                  const next = setHeroField(form, sectionTranslations, 'secondaryLabel', localeTab, e.target.value, defaultLocale)
                  setForm(next.form)
                  setSectionTranslations(next.translations)
                }}
              />
            </div>
            {localeTab === defaultLocale ? (
            <div className={styles.field}>
              <label>Secondary button link</label>
              <input
                value={form.secondaryLink}
                onChange={(e) => setForm({ ...form, secondaryLink: e.target.value })}
              />
            </div>
            ) : null}
          </div>

          <button className={styles.btn} type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save home hero'}
          </button>
        </form>
      </div>
    </div>
  )
}
