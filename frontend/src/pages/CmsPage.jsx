import { useEffect, useState } from 'react'
import { ExternalLink, Play, X } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { displayTitleLabel, displayCapsLabel } from '@i18n/typography'
import { sectionKeyForPath } from '@data/pages/registry'
import { getPageFallback } from '@data/pages/content'
import { mergePageContent } from '@data/pages/mergePageContent'
import { navKeyForPath } from '@i18n/navKeys'
import { parseYoutubeId, youtubeEmbedUrl, youtubeThumbUrl, youtubeWatchUrl } from '@utils/youtube'
import ContentLocaleNotice, { hasLocaleTranslation } from '@components/ContentLocaleNotice'
import OfferingForm from '@components/OfferingForm'
import GiveInvite, { ActionInvite, InvolveMore, isStaleInviteCopy, isStalePaymentCopy } from '@components/payments/GiveInvite'
import ShrineMapGuide from '@components/shrine/ShrineMapGuide'
import RichText from '@components/ui/RichText'
import { applyPageSeo, stripHtml } from '@utils/seo'
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

function splitNamedItem(item) {
  const parts = String(item || '').split(/\s+[—–-]\s+/)
  if (parts.length < 2) return null
  return { title: parts[0], meta: parts.slice(1).join(' — ') }
}

function ListBlock({ items }) {
  const rows = (items || []).filter(Boolean)
  if (!rows.length) return null
  const named = rows.map(splitNamedItem)
  if (named.every(Boolean)) {
    return (
      <ul className={styles.namedCards}>
        {named.map((row) => (
          <li key={row.title}>
            <strong>{row.title}</strong>
            <span>{row.meta}</span>
          </li>
        ))}
      </ul>
    )
  }
  return (
    <ol className={styles.inviteList}>
      {rows.map((item, index) => (
        <li key={item}>
          <span className={styles.inviteNum}>{index + 1}</span>
          <span>{item}</span>
        </li>
      ))}
    </ol>
  )
}

function Block({ block }) {
  const { t } = useLocale()
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
    return <ListBlock items={block.items} />
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
    const items = block.items || []
    return (
      <div className={`${styles.cards} ${items.length === 3 ? styles.cardsThree : ''}`}>
        {items.map((item) => {
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
                  {item.linkLabel || t('learnMore')} →
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

function PageLink({ to, className, children }) {
  if (!to) return null
  if (to.startsWith('#') || /^https?:/i.test(to)) {
    return (
      <a href={to} className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link to={to} className={className}>
      {children}
    </Link>
  )
}

export default function CmsPage() {
  const { pathname } = useLocation()
  const { section, pages, company, offerings, resolveHeaderImage } = useContent()
  const { t, locale, defaultLocale } = useLocale()
  const key = sectionKeyForPath(pathname)
  const fallback = (key && getPageFallback(key)) || {}
  const record = key ? pages?.[key] : null
  const translated = hasLocaleTranslation(record?.translations, locale, defaultLocale)
  const live = key ? section(key, {}) : {}
  const data = mergePageContent(fallback, live)
  if (key && !translated) {
    const navKey = navKeyForPath(pathname)
    if (navKey) {
      data.title = t(navKey)
      data.heading = t(navKey)
    }
    if (Array.isArray(data.links)) {
      data.links = data.links.map((link) => {
        const linkKey = navKeyForPath(link.path)
        return linkKey ? { ...link, label: t(linkKey) } : link
      })
    }
  }
  const blocks = data.blocks?.length ? data.blocks : fallback.blocks || []
  const links = data.links?.length ? data.links : fallback.links || []
  const buttons = (Array.isArray(data.buttons) && data.buttons.length
    ? data.buttons
    : [data.cta?.primary, data.cta?.secondary].filter((item) => item && (item.label || item.path))
  ).map((item) => {
    const path = item.path || item.link || ''
    const linkKey = navKeyForPath(path)
    const label =
      !translated && linkKey ? t(linkKey) : item.label
    return { label, path }
  })
  const rawTitle = data.title || fallback.title
  const pageTitle = displayTitleLabel(rawTitle, locale)

  useEffect(() => {
    if (!key) return
    applyPageSeo({
      title: rawTitle || company?.name || t('brand.name'),
      description: data.seoDescription || stripHtml(data.intro) || data.subtitle,
      image: data.heroImage,
      path: pathname,
    })
  }, [key, rawTitle, company?.name, t, data.seoDescription, data.intro, data.subtitle, data.heroImage, pathname])

  const heroImage = resolveHeaderImage(data.heroImage)
  const actionPage = {
    'spirituality.prayer-intentions': { kind: 'candle', heroCta: t('offer.lightCandle'), involve: 'candle' },
    'spirituality.request-a-mass': { kind: 'mass', heroCta: t('offer.haveMass'), involve: 'mass' },
    'support.donations': { kind: 'donation', heroCta: t('offer.giveNow'), involve: 'donation' },
    'support.partners': { kind: 'partnership', heroCta: t('offer.beginPartnership'), involve: 'partnership' },
  }[key]
  const isAction = Boolean(actionPage)
  const isDonations = actionPage?.kind === 'donation'
  if (isDonations && isStalePaymentCopy(data.subtitle)) {
    data.subtitle = t('invite.donationSubtitle')
  }
  if (key === 'spirituality.prayer-intentions' && /popular piety/i.test(data.subtitle || '')) {
    data.subtitle = t('invite.candleSubtitle')
  }

  const priceLabel =
    actionPage?.kind === 'candle'
      ? `${t('offer.usd')} ${Number(offerings?.candlePriceUsd) || 1} ${t('offer.each')}`
      : actionPage?.kind === 'mass'
        ? `${t('offer.usd')} ${Number(offerings?.massPriceUsd) || 20}`
        : null
  const inviteIntro = actionPage && !isStaleInviteCopy(data.intro, actionPage.kind) ? data.intro : ''
  const isHub = [
    'our-lady.index',
    'shrine.index',
    'pilgrimage.index',
    'spirituality.index',
    'support.index',
    'support.vision',
    'support.master-plan',
  ].includes(key)
  const isStory =
    !isAction &&
    Boolean(
        key?.startsWith('our-lady.') ||
        key?.startsWith('spirituality.') ||
        key?.startsWith('shrine.') ||
        key?.startsWith('pilgrimage.') ||
        key === 'support.vision' ||
        key === 'support.master-plan' ||
        key === 'support.transparency' ||
        key === 'support.annual-reports',
    )

  if (!key) return <NotFoundPage />

  return (
    <div className={`${styles.page} ${isStory ? styles.pageStory : ''}`}>
      <header
        className={styles.hero}
        style={{
          backgroundImage: `linear-gradient(120deg, rgba(18,40,71,.88), rgba(26,54,93,.5)), url(${heroImage})`,
        }}
      >
        <div className="container">
          {data.eyebrow ? (
            <p className={styles.eyebrow}>{displayCapsLabel(data.eyebrow, locale)}</p>
          ) : null}
          <h1>{pageTitle}</h1>
          {data.subtitle ? <p className={styles.subtitle}>{data.subtitle}</p> : null}
          {actionPage ? (
            <a href="#pledge" className={styles.heroCta}>
              {actionPage.heroCta}
            </a>
          ) : isHub ? (
            <PageLink to={data.heroCtaPath || data.cta?.primary?.path || '#join'} className={styles.heroCta}>
              {data.heroCtaLabel || data.cta?.primary?.label || t('story.bePart')}
            </PageLink>
          ) : null}
        </div>
      </header>

      <div className={`container ${styles.body} ${isAction ? styles.bodyAction : ''} ${isStory ? styles.bodyStory : ''}`}>
        <ContentLocaleNotice translations={record?.translations} />
        {isDonations ? <GiveInvite introHtml={inviteIntro} /> : null}
        {actionPage && !isDonations ? (
          <ActionInvite kind={actionPage.kind} priceLabel={priceLabel} introHtml={inviteIntro} />
        ) : null}
        {!isAction && data.intro ? <RichText html={data.intro} className={styles.intro} /> : null}

        {links.length > 0 ? (
          <nav className={styles.linkGrid} aria-label="Section pages">
            {links.map((link) => (
              <Link key={link.path} to={link.path} className={styles.linkCard}>
                {displayTitleLabel(link.label, locale)}
              </Link>
            ))}
          </nav>
        ) : null}

        {!isAction
          ? blocks.map((block, index) => <Block key={`${block.type}-${index}`} block={block} />)
          : null}

        {key === 'shrine.map' ? <ShrineMapGuide /> : null}

        {actionPage?.kind === 'candle' ? <OfferingForm kind="candle" /> : null}
        {actionPage?.kind === 'mass' ? <OfferingForm kind="mass" /> : null}
        {actionPage?.kind === 'donation' ? <OfferingForm kind="donation" /> : null}
        {actionPage?.kind === 'partnership' ? <OfferingForm kind="partnership" /> : null}
        {actionPage ? <InvolveMore variant={actionPage.involve} /> : null}
        {isHub ? (
          <InvolveMore
            variant="story"
            title={data.involveTitle}
            lead={data.involveLead}
            links={data.involveLinks}
          />
        ) : null}

        {!isAction && buttons.length ? (
          <div className={styles.ctaRow}>
            {buttons.map((item, index) => (
              <PageLink
                key={`${item.path}-${item.label}`}
                to={item.path}
                className={index === 0 ? styles.btn : styles.btnGhost}
              >
                {item.label}
              </PageLink>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  )
}
