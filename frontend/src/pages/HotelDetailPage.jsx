import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Mail, Phone } from 'lucide-react'
import LocalizedLink from '@components/LocalizedLink'
import { fetchLodging, fetchProject } from '@api/cms'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import ContentLocaleNotice from '@components/ContentLocaleNotice'
import ImageLightbox from '@components/ui/ImageLightbox'
import LodgingIcon from '@components/ui/LodgingIcon'
import RichText from '@components/ui/RichText'
import { LODGING_AMENITIES, resolveLodgingItems } from '@data/lodgingCatalog'
import { cardExcerpt } from '@utils/text'
import { displayFacilityName } from '@utils/displayName'
import NotFoundPage from './NotFoundPage'
import styles from './HotelDetailPage.module.css'

function digits(value) {
  return String(value || '').replace(/\D/g, '')
}

function websiteHref(url) {
  const value = String(url || '').trim()
  if (!value) return ''
  if (/^https?:\/\//i.test(value)) return value
  return `https://${value}`
}

function externalReservationUrl(url) {
  const value = String(url || '').trim()
  if (!value || value.startsWith('/')) return ''
  return websiteHref(value)
}

function reviewLabel(link) {
  if (link.platform === 'google') return 'Google'
  if (link.platform === 'tripadvisor') return 'Tripadvisor'
  return link.label || 'Reviews'
}

function formatPrice(amount) {
  const value = Number(amount)
  if (!Number.isFinite(value) || value <= 0) return ''
  return `RWF ${value.toLocaleString('en-US')}`
}

export default function HotelDetailPage() {
  const { locale, t } = useLocale()
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
        <p>{t('loading')}</p>
      </div>
    )
  }

  if (notFound || !item) return <NotFoundPage />

  const amenities = resolveLodgingItems(item.amenities, LODGING_AMENITIES, t)
  const mainPhoto = photos[activeIndex] || photos[0]
  const reservationUrl = externalReservationUrl(item.bookingUrl)
  const phone = String(item.phone || '').trim()
  const email = String(item.email || '').trim()
  const about = item.description || cardExcerpt(item)
  const price = formatPrice(item.priceFrom)
  const meetingRooms = (item.meetingRooms || []).filter((room) => room?.name || room?.capacity)
  const reviews = (item.reviewLinks || [])
    .filter((link) => String(link?.url || '').trim())
    .map((link) => ({ ...link, href: websiteHref(link.url), label: reviewLabel(link) }))

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <Link to="/pilgrimage/accommodation" className={styles.back}>
          <ArrowLeft size={16} aria-hidden="true" />
          {t('accommodation')}
        </Link>
        <ContentLocaleNotice translations={item.translations} />

        <div className={styles.topGrid}>
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
            {photos.length > 1 ? (
              <div className={styles.thumbs} role="group" aria-label="Photo thumbnails">
                {photos.map((src, index) => (
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
          </div>

          <aside className={styles.summary}>
            <p className={styles.eyebrow}>{item.category || t('accommodation')}</p>
            <h1 className={styles.title}>{displayFacilityName(item.title)}</h1>

            {item.roomCount || meetingRooms.length || item.distanceFromKibeho || price ? (
              <dl className={styles.facts}>
                {item.roomCount ? (
                  <div className={styles.fact}>
                    <dt>{t('rooms')}</dt>
                    <dd>{item.roomCount}</dd>
                  </div>
                ) : null}
                {meetingRooms.length ? (
                  <div className={styles.fact}>
                    <dt>{t('meetingRooms')}</dt>
                    <dd>
                      <ul className={styles.meetingList}>
                        {meetingRooms.map((room, index) => (
                          <li key={`${room.name}-${index}`}>
                            {room.name || t('meetingRooms')}
                            {room.capacity ? ` — ${room.capacity} ${t('meetingRoomPeople')}` : ''}
                          </li>
                        ))}
                      </ul>
                    </dd>
                  </div>
                ) : null}
                {item.distanceFromKibeho ? (
                  <div className={styles.fact}>
                    <dt>{t('distanceFromKibeho')}</dt>
                    <dd>{item.distanceFromKibeho}</dd>
                  </div>
                ) : null}
                {price ? (
                  <div className={styles.fact}>
                    <dt>{t('priceFrom')}</dt>
                    <dd>{price}</dd>
                  </div>
                ) : null}
              </dl>
            ) : null}

            {phone || email ? (
              <div className={styles.contactBox}>
                {phone ? (
                  <a className={styles.contactLine} href={`tel:${digits(phone)}`}>
                    <Phone size={16} aria-hidden="true" />
                    <span>
                      <span className={styles.contactLabel}>{t('phone')}</span>
                      {phone}
                    </span>
                  </a>
                ) : null}
                {email ? (
                  <a className={styles.contactLine} href={`mailto:${email}`}>
                    <Mail size={16} aria-hidden="true" />
                    <span>
                      <span className={styles.contactLabel}>{t('email')}</span>
                      {email}
                    </span>
                  </a>
                ) : null}
              </div>
            ) : null}

            <LocalizedLink className={styles.bookBtn} to={`/pilgrimage/accommodation/${item.slug}/book`}>
              {t('reserveYourStay')}
            </LocalizedLink>
            {reservationUrl ? (
              <a className={styles.reserveLink} href={reservationUrl} target="_blank" rel="noopener noreferrer">
                {t('hotelReservationPage')}
              </a>
            ) : null}
          </aside>
        </div>

        {about ? (
          <section className={styles.about} aria-labelledby="hotel-about-heading">
            <h2 id="hotel-about-heading">{t('aboutStay')}</h2>
            {item.description ? (
              <RichText html={item.description} className={styles.aboutText} />
            ) : (
              <p className={styles.aboutText}>{about}</p>
            )}
          </section>
        ) : null}

        {reviews.length ? (
          <section className={styles.reviews} aria-labelledby="hotel-reviews-heading">
            <h2 id="hotel-reviews-heading">{t('guestReviews')}</h2>
            <ul className={styles.reviewList}>
              {reviews.map((review) => (
                <li key={`${review.platform}-${review.href}`}>
                  <a href={review.href} target="_blank" rel="noopener noreferrer">
                    {review.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {amenities.length ? (
          <section className={styles.amenities} aria-labelledby="hotel-amenities-heading">
            <h2 id="hotel-amenities-heading">{t('amenities')}</h2>
            <ul className={styles.amenityGrid}>
              {amenities.map((entry) => (
                <li key={entry.id}>
                  <LodgingIcon id={entry.id} size={18} />
                  <span>{entry.label}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {related.length ? (
          <section className={styles.related} aria-labelledby="related-stays-heading">
            <h2 id="related-stays-heading">{t('relatedAccommodation')}</h2>
            <div className={styles.relatedGrid}>
              {related.map((stay) => (
                <article key={stay.slug} className={styles.relatedCard}>
                    <Link to={`/pilgrimage/accommodation/${stay.slug}`} className={styles.relatedMedia}>
                      <img src={stay.coverImage || stay.featuredImage || defaultHeaderImage} alt="" />
                    </Link>
                  <div className={styles.relatedBody}>
                    <h3>{displayFacilityName(stay.title)}</h3>
                    <Link to={`/pilgrimage/accommodation/${stay.slug}`} className={styles.relatedLink}>
                      {t('viewDetails')} <ArrowRight size={14} />
                    </Link>
                    <Link to={`/pilgrimage/accommodation/${stay.slug}`} className={styles.relatedBtn}>
                      {t('viewDetails')}
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
