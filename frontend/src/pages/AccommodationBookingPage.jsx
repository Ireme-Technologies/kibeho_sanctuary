import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { fetchProject, submitAccommodationReservation } from '@api/cms'
import LocalizedLink from '@components/LocalizedLink'
import { useLocale } from '@context/LocaleContext'
import { displayFacilityName } from '@utils/displayName'
import { buildReservationMessage, roomsForGuests, whatsappLink } from '@utils/reservationMessage'
import NotFoundPage from './NotFoundPage'
import styles from './AccommodationBookingPage.module.css'

function resizeNames(current, count) {
  const next = current.slice(0, count)
  while (next.length < count) next.push('')
  return next
}

function firstError(err) {
  const bag = err?.errors
  if (bag && typeof bag === 'object') {
    const message = Object.values(bag).flat()[0]
    if (message) return message
  }
  return err?.message || 'Could not save the reservation.'
}

export default function AccommodationBookingPage() {
  const { slug } = useParams()
  const { locale, t } = useLocale()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [guestNames, setGuestNames] = useState(['', ''])
  const [country, setCountry] = useState('')
  const [tripReason, setTripReason] = useState('')
  const [organization, setOrganization] = useState('')
  const [additionalRequest, setAdditionalRequest] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [whatsappUrl, setWhatsappUrl] = useState('')

  useEffect(() => {
    setLoading(true)
    setNotFound(false)
    fetchProject(slug, { locale })
      .then((detail) => setItem(detail))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug, locale])

  const guestCount = Math.max(1, Number(guests) || 1)
  const rooms = roomsForGuests(guestCount)
  const roomCount = Number(item?.roomCount) || 0
  const maxGuests = roomCount ? roomCount * 2 : 0
  const tooMany = Boolean(maxGuests && guestCount > maxGuests)
  const stayName = item ? displayFacilityName(item.title) : ''

  const namesReady = useMemo(
    () => guestNames.length === guestCount && guestNames.every((name) => String(name).trim()),
    [guestNames, guestCount],
  )

  const changeGuests = (value) => {
    const next = Math.max(1, Math.min(500, Number(value) || 1))
    setGuests(next)
    setGuestNames((current) => resizeNames(current, next))
    setWhatsappUrl('')
  }

  const submit = async (event) => {
    event.preventDefault()
    setError('')
    if (!checkIn || !checkOut || checkOut <= checkIn) {
      setError(t('checkOutAfter'))
      return
    }
    if (tooMany) {
      setError(t('tooManyGuests').replace('{rooms}', roomCount).replace('{guests}', maxGuests))
      return
    }
    if (!namesReady) {
      setError(t('namesRequired'))
      return
    }
    if (!country.trim()) {
      setError(t('country'))
      return
    }

    const payload = {
      slug,
      check_in: checkIn,
      check_out: checkOut,
      guests: guestCount,
      guest_names: guestNames.map((name) => name.trim()),
      country: country.trim(),
      trip_reason: tripReason.trim(),
      organization: organization.trim(),
      additional_request: additionalRequest.trim(),
    }
    const message = buildReservationMessage({
      stay: stayName,
      locale,
      t,
      form: {
        checkIn,
        checkOut,
        guests: guestCount,
        rooms,
        guestNames,
        country: country.trim(),
        tripReason,
        organization,
        additionalRequest,
      },
    })

    const popup = window.open('', '_blank')
    setSaving(true)
    try {
      const saved = await submitAccommodationReservation(payload)
      const url = whatsappLink(saved.whatsappNumber || item.whatsapp, message)
      setWhatsappUrl(url)
      if (url && popup) popup.location.href = url
      else popup?.close()
    } catch (err) {
      popup?.close()
      setError(firstError(err))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={`container ${styles.loading}`}>
        <p>{t('loading')}</p>
      </div>
    )
  }

  if (notFound || !item) return <NotFoundPage />

  return (
    <div className={styles.page}>
      <div className={`container ${styles.inner}`}>
        <LocalizedLink to={`/pilgrimage/accommodation/${item.slug}`} className={styles.back}>
          <ArrowLeft size={16} aria-hidden="true" />
          {t('backToStay')}
        </LocalizedLink>
        <h1 className={styles.title}>{t('bookNow')}</h1>
        <p className={styles.lead}>{t('bookingLead')}</p>

        {!String(item.whatsapp || '').trim() ? (
          <p className={styles.notice}>{t('bookingUnavailable')}</p>
        ) : (
          <form className={styles.form} onSubmit={submit}>
            <label className={styles.field}>
              <span>{t('accommodation')}</span>
              <input value={stayName} readOnly />
            </label>
            <div className={styles.row}>
              <label className={styles.field}>
                <span>{t('checkIn')}</span>
                <input type="date" value={checkIn} onChange={(e) => { setCheckIn(e.target.value); setWhatsappUrl('') }} required />
              </label>
              <label className={styles.field}>
                <span>{t('checkOut')}</span>
                <input type="date" value={checkOut} min={checkIn || undefined} onChange={(e) => { setCheckOut(e.target.value); setWhatsappUrl('') }} required />
              </label>
              <label className={styles.field}>
                <span>{t('guests')}</span>
                <input
                  type="number"
                  min="1"
                  max={maxGuests || 500}
                  value={guests}
                  onChange={(e) => changeGuests(e.target.value)}
                  required
                />
              </label>
            </div>
            <p className={styles.rooms}>
              {t('roomsNeeded')}: {rooms}. {t('eachRoomHosts')}
            </p>
            {tooMany ? (
              <p className={styles.error}>{t('tooManyGuests').replace('{rooms}', roomCount).replace('{guests}', maxGuests)}</p>
            ) : null}

            <fieldset className={styles.names}>
              <legend>{t('guestNames')}</legend>
              {guestNames.map((name, index) => (
                <label key={index} className={styles.field}>
                  <span>
                    {t('guestName')} {index + 1}
                  </span>
                  <input
                    value={name}
                    onChange={(e) =>
                      setGuestNames((current) => current.map((entry, i) => (i === index ? e.target.value : entry)))
                    }
                    required
                  />
                </label>
              ))}
            </fieldset>

            <div className={styles.row}>
              <label className={styles.field}>
                <span>{t('country')}</span>
                <input value={country} onChange={(e) => setCountry(e.target.value)} required />
              </label>
              <label className={styles.field}>
                <span>{t('tripReason')}</span>
                <input value={tripReason} onChange={(e) => setTripReason(e.target.value)} />
              </label>
              <label className={styles.field}>
                <span>{t('organization')}</span>
                <input value={organization} onChange={(e) => setOrganization(e.target.value)} />
              </label>
            </div>
            <label className={styles.field}>
              <span>{t('additionalRequest')}</span>
              <textarea rows={5} value={additionalRequest} onChange={(e) => setAdditionalRequest(e.target.value)} />
            </label>

            {error ? <p className={styles.error}>{error}</p> : null}
            {whatsappUrl ? (
              <div className={styles.saved}>
                <p>{t('bookingSaved')}</p>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                  {t('openWhatsapp')}
                </a>
                <button type="button" className={styles.secondary} onClick={() => setWhatsappUrl('')}>
                  {t('sendAnother')}
                </button>
              </div>
            ) : (
              <button type="submit" className={styles.submit} disabled={saving || tooMany}>
                {saving ? t('loading') : t('submitViaWhatsapp')}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  )
}
