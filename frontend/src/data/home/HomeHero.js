/**
 * Hero copy — brand-first, ToR CTAs:
 * proclaim the message · welcome pilgrims
 */

export const heroMode = 'cover'

export const heroHeading = 'Shrine of Our Lady of Kibeho'

export const heroCaption =
  'The Only Marian Place in Africa Approved by the Church — a sanctuary of conversion, prayer, and reconciliation for pilgrims of every nation.'

export const heroSlides = [
  { id: 1, src: '/images/sanctuary/hero.jpg', duration: 8000 },
]

export const heroVideo = { src: '', poster: '/images/sanctuary/hero.jpg' }

export const heroCoverImage = '/images/sanctuary/hero.jpg'

export const heroForeground = { src: '', alt: '' }

/** ToR priorities: proclaim the message, then welcome pilgrims */
export const heroCTAs = {
  primary: { label: 'Discover the Shrine', link: '/shrine' },
  secondary: { label: 'Plan Your Pilgrimage', link: '/pilgrimage/plan' },
}
