import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ExternalLink, Globe, Mail, Phone, Star } from 'lucide-react'
import { fetchLodging, fetchProject } from '@api/cms'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import ImageLightbox from '@components/ui/ImageLightbox'
import LodgingIcon from '@components/ui/LodgingIcon'
import RichText from '@components/ui/RichText'
import { LODGING_AMENITIES, LODGING_SERVICES, resolveLodgingItems } from '@data/lodgingCatalog'
import { cardExcerpt } from '@utils/text'
import NotFoundPage from './NotFoundPage'
import styles from './HotelDetailPage.module.css'

function digits(value) {
  return String(value || '').replace(/\D/g, '')
}

function isExternal(url) {
  return /^https?:\/\//i.test(url || '')
}

function HotelStars({ rating }) {
  const value = Number(rating)
  if (rating == null || rating === '' || Number.isNaN(value) || value <= 0) return null
  const clamped = Math.max(0, Math.min(5, value))
  const full = Math.floor(clamped + 1e-9)
  const fraction = clamped - full
  const roundedUp = fraction >= 0.75
  const label = clamped % 1 === 0 ? String(clamped) : clamped.toFixed(1)

  return (
    <p className={styles.stars} aria-label={`${label} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < full || (i === full && roundedUp)
        return (
          <Star
            key={i}
            size={18}
            className={filled ? styles.starFilled : styles.starEmpty}
            fill={filled ? 'currentColor' : 'none'}
            aria-hidden="true"
          />
        )
      })}
      <span className={styles.starsNumber}>{label}</span>
    </p>
  )
}

function ActionLink({ href, className, children }) {
  if (isExternal(href)) {
    return (
      <a href={href} className={className} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    )
  }
  return (
    <Link to={href} className={className}>
      {children}
    </Link>
  )
}

export default function HotelDetailPage() {
  const { locale } = useLocale()
  const { defaultHeaderImage } = useContent()
  const { slug } = useParams()
  const [item, setItem] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    setActiveIndex(0)
    Promise.all([fetchProject(slug, { locale }), fetchLodging({ locale })])
      .then(([detail, lodging]) => {
        setItem(detail)
        setRelated(
          (lodging || []).filter((entry) => entry.slug && entry.slug !== slug).slice(0, 3),
        )
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug, locale])

  const photos = useMemo(() => {
    if (!item) return defaultHeaderImage ? [defaultHeaderImage] : []
    const list = [item.coverImage, item.featuredImage, ...(item.gallery || [])].filter(Boolean)
    const unique = [...new Set(list)]
    return unique.length ? unique : defaultHeaderImage ? [defaultHeaderImage] : []
  }, [item, defaultHeaderImage])

  if (loading) {
    return (
      <div className={`container ${styles.loading}`}>
        <p>Loading…</p>
      </div>
    )
  }

  if (notFound || !item) return <NotFoundPage />

  const amenities = resolveLodgingItems(item.amenities, LODGING_AMENITIES)
  const services = resolveLodgingItems(item.services, LODGING_SERVICES)
  const mainPhoto = photos[activeIndex] || photos[0]
  const thumbs = photos.slice(0, 3)
  const website = String(item.websiteUrl || '').trim()
  const bookUrl = String(item.bookingUrl || '').trim()
  const phone = String(item.phone || '').trim()
  const email = String(item.email || '').trim()
  const hasContact = Boolean(website || bookUrl || phone || email)

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <p className={styles.crumb}>
          <Link to="/hotels">Accommodation</Link>
          {item.category ? <span> · {item.category}</span> : null}
        </p>
        <h1 className={`${styles.title} ${item.rating ? styles.titleWithStars : ''}`}>{item.title}</h1>
        <HotelStars rating={item.rating} />

        <div className={`${styles.topGrid} ${amenities.length ? '' : styles.topGridSolo}`}>
          <div className={styles.gallery}>
            {mainPhoto ? (
              <button
                type="button"
                className={styles.mainPhotoBtn}
                onClick={() => setLightboxOpen(true)}
                aria-label={`View photos of ${item.title}`}
              >
                <img src={mainPhoto} alt="" className={styles.mainPhoto} />
              </button>
            ) : (
              <div className={styles.mainPhoto} />
            )}
            {thumbs.length > 1 ? (
              <div className={styles.thumbs} role="group" aria-label="Photo thumbnails">
                {thumbs.map((src, index) => (
                  <button
                    key={src}
                    type="button"
                    className={`${styles.thumb} ${index === activeIndex ? styles.thumbActive : ''}`}
                    onClick={() => setActiveIndex(index)}
                    aria-label={`Photo ${index + 1}`}
                    aria-pressed={index === activeIndex}
                  >
                    <img src={src} alt="" />
                  </button>
                ))}
              </div>
            ) : null}
            {photos.length ? (
              <button
                type="button"
                className={styles.viewAll}
                onClick={() => setLightboxOpen(true)}
              >
                View all photos <ArrowRight size={14} />
              </button>
            ) : null}
          </div>

          {amenities.length ? (
            <aside className={styles.amenitiesCard}>
              <h2>Amenities</h2>
              <ul className={styles.amenityGrid}>
                {amenities.map((entry) => (
                  <li key={entry.id}>
                    <LodgingIcon id={entry.id} size={18} />
                    <span>{entry.label}</span>
                  </li>
                ))}
              </ul>
            </aside>
          ) : null}
        </div>

        {item.description ? (
          <RichText html={item.description} className={styles.description} />
        ) : cardExcerpt(item) ? (
          <p className={styles.description}>{cardExcerpt(item)}</p>
        ) : null}

        {services.length ? (
          <section className={styles.services} aria-labelledby="hotel-services-heading">
            <h2 id="hotel-services-heading">Services offered</h2>
            <div className={styles.serviceGrid}>
              {services.map((entry) => (
                <article key={entry.id} className={styles.serviceCard}>
                  <span className={styles.serviceIcon}>
                    <LodgingIcon id={entry.id} size={28} />
                  </span>
                  <h3>{entry.label}</h3>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {hasContact ? (
          <section className={styles.contactCard} aria-labelledby="hotel-contact-heading">
            <h2 id="hotel-contact-heading">Reservations &amp; contact</h2>
            {website || bookUrl ? (
              <div className={styles.ctaButtons}>
                {website ? (
                  <ActionLink href={website} className={styles.btnGhost}>
                    <Globe size={16} aria-hidden="true" />
                    Visit the website
                    {isExternal(website) ? <ExternalLink size={14} aria-hidden="true" /> : null}
                  </ActionLink>
                ) : null}
                {bookUrl ? (
                  <ActionLink href={bookUrl} className={styles.btnSolid}>
                    Book directly
                    {isExternal(bookUrl) ? <ExternalLink size={14} aria-hidden="true" /> : null}
                  </ActionLink>
                ) : null}
              </div>
            ) : null}
            {phone || email ? (
              <dl className={styles.contactFacts}>
                {phone ? (
                  <div className={styles.contactFact}>
                    <dt>
                      <Phone size={14} aria-hidden="true" />
                      Phone
                    </dt>
                    <dd>
                      <a href={`tel:${digits(phone)}`}>{phone}</a>
                    </dd>
                  </div>
                ) : null}
                {email ? (
                  <div className={styles.contactFact}>
                    <dt>
                      <Mail size={14} aria-hidden="true" />
                      Email
                    </dt>
                    <dd>
                      <a href={`mailto:${email}`}>{email}</a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}
          </section>
        ) : null}

        {related.length ? (
          <section className={styles.related} aria-labelledby="related-stays-heading">
            <h2 id="related-stays-heading">Related accommodation</h2>
            <div className={styles.relatedGrid}>
              {related.map((stay) => (
                <article key={stay.slug} className={styles.relatedCard}>
                    <Link to={`/hotels/${stay.slug}`} className={styles.relatedMedia}>
                      <img src={stay.coverImage || stay.featuredImage || defaultHeaderImage} alt="" />
                    </Link>
                  <div className={styles.relatedBody}>
                    <h3>{stay.title}</h3>
                    <Link to={`/hotels/${stay.slug}`} className={styles.relatedLink}>
                      View details <ArrowRight size={14} />
                    </Link>
                    <Link to={`/hotels/${stay.slug}`} className={styles.relatedBtn}>
                      View details
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}
      </div>

      <ImageLightbox
        open={lightboxOpen}
        images={photos}
        index={activeIndex}
        onClose={() => setLightboxOpen(false)}
        onChangeIndex={setActiveIndex}
      />
    </div>
  )
}
