export function roomsForGuests(guests) {
  const count = Math.max(0, Number(guests) || 0)
  if (!count) return 0
  return Math.ceil(count / 2)
}

export function whatsappDigits(value) {
  let digits = String(value || '').replace(/\D/g, '')
  if (digits.startsWith('0') && digits.length === 10) digits = `250${digits.slice(1)}`
  return digits
}

export function formatStayDate(value, locale = 'en') {
  if (!value) return ''
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString(locale, { day: 'numeric', month: 'long', year: 'numeric' })
}

export function buildReservationMessage({ stay, form, locale, t }) {
  const names = (form.guestNames || [])
    .map((name, index) => `${index + 1}. ${String(name || '').trim()}`)
    .join('\n')
  const lines = [
    t('reservationFromSite'),
    '',
    `${t('accommodation')}: ${stay}`,
    `${t('checkIn')}: ${formatStayDate(form.checkIn, locale)}`,
    `${t('checkOut')}: ${formatStayDate(form.checkOut, locale)}`,
    `${t('guests')}: ${form.guests}`,
    `${t('roomsNeeded')}: ${form.rooms}`,
    `${t('guestNames')}:`,
    names,
    `${t('country')}: ${form.country}`,
  ]
  if (String(form.tripReason || '').trim()) lines.push(`${t('tripReason')}: ${form.tripReason.trim()}`)
  if (String(form.organization || '').trim()) lines.push(`${t('organization')}: ${form.organization.trim()}`)
  if (String(form.additionalRequest || '').trim()) {
    lines.push(`${t('additionalRequest')}: ${form.additionalRequest.trim()}`)
  }
  return lines.join('\n')
}

export function whatsappLink(number, message) {
  const digits = whatsappDigits(number)
  if (!digits) return ''
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}
