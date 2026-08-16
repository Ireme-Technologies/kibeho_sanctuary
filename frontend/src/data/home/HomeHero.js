/**
 * Hero copy — brand-first, ToR CTAs:
 * proclaim the message · welcome pilgrims
 */

export const heroMode = 'cover'

export const heroHeading = 'Shrine of Our Lady of Kibeho'

export const heroCaption =
  'The first Marian apparition site in Africa recognised by the Catholic Church — a place of conversion, prayer, and reconciliation for pilgrims of every nation.'

export const heroSlides = [
  { id: 1, src: '/images/sanctuary/hero.jpg', duration: 8000 },
]

export const heroVideo = { src: '', poster: '/images/sanctuary/hero.jpg' }

export const heroCoverImage = '/images/sanctuary/hero.jpg'

export const heroForeground = { src: '', alt: '' }

/** ToR priorities: proclaim the message, then welcome pilgrims */
export const heroCTAs = {
  primary: { label: 'Discover the Message', link: '/our-lady' },
  secondary: { label: 'Plan Your Pilgrimage', link: '/pilgrimage/plan' },
}
