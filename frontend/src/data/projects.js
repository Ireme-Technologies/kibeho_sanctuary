/**
 * PROJECTS DATA — Sanctuary Facilities
 * ─────────────────────────────────────────────────────────────
 * Shared source of truth for:
 *   - Homepage Featured Projects (HomeProjects)
 *   - Full Projects page (ProjectsHero, ProjectFilter, ProjectsGrid, ProjectsCTA)
 *   - Individual ProjectDetailPage (/projects/:slug)
 *
 * coverImage:    used on the Projects page grid card
 * featuredImage: used in the large hero card (Home + top of Projects page)
 * gallery:       used on the detail page gallery slider
 *
 * images: place files at /public/images/projects/
 * ─────────────────────────────────────────────────────────────
 */

export const projects = [
  {
    id: 1,
    slug: 'guest-houses',
    title: 'Sanctuary Guest Houses',
    category: 'Guest House',
    year: '2018',
    location: 'Kibeho, Nyaruguru',
    client: 'Kibeho Sanctuary',
    area: '120 rooms',
    status: 'Available',
    rating: 4.5,
    bookingUrl: '/contact',
    featured: true,
    shortDescription:
      'Comfortable accommodation for pilgrims and retreat groups — a place of rest before and after prayer.',
    description:
      'Our guest houses welcome pilgrims from Rwanda and around the world with simple, clean rooms and a spirit of hospitality.',
    coverImage: '/images/sanctuary/welcome.jpg',
    featuredImage: '/images/sanctuary/welcome.jpg',
    gallery: ['/images/sanctuary/welcome.jpg'],
    services: ['Retreats', 'Spiritual Guidance'],
    specs: {
      Location: 'Kibeho, Nyaruguru',
      Capacity: '120 rooms',
      Category: 'Guest House',
      Status: 'Available',
    },
  },
  {
    id: 101,
    slug: 'kibeho-hillside-hotel',
    title: 'Kibeho Hillside Hotel',
    category: 'Hotel',
    rating: 4.0,
    bookingUrl: '/contact',
    featured: true,
    coverImage: '/images/sanctuary/hero.jpg',
    featuredImage: '/images/sanctuary/hero.jpg',
    shortDescription: 'Hotel stays with easy access to the shrine for pilgrims and visitors.',
    description:
      'A welcoming hotel near the sanctuary grounds, suited for pilgrims seeking comfortable rooms close to daily Mass and shrine activities.',
    gallery: ['/images/sanctuary/hero.jpg', '/images/sanctuary/welcome.jpg', '/images/sanctuary/hills.jpg'],
    amenities: [
      'parking',
      'wifi',
      'hot-water',
      'hill-views',
      'swimming-pool',
      'bar',
      'table-tennis',
      'restaurant',
    ],
    services: ['daily-mass', 'shuttle', 'guided-tours', 'laundry'],
    specs: {},
  },
  {
    id: 102,
    slug: 'pilgrim-apartments',
    title: 'Pilgrim Apartments',
    category: 'Apartment',
    rating: 3.5,
    bookingUrl: '/contact',
    featured: false,
    coverImage: '/images/sanctuary/hills.jpg',
    featuredImage: '/images/sanctuary/hills.jpg',
    shortDescription: 'Self-catering apartments for families and longer pilgrimage stays.',
    description: 'Furnished apartments for families and groups.',
    gallery: [],
    services: [],
    specs: {},
  },
  {
    id: 103,
    slug: 'marian-retreat-house',
    title: 'Marian Retreat House',
    category: 'Guest House',
    rating: 4.2,
    bookingUrl: '/contact',
    featured: true,
    coverImage: '/images/sanctuary/mary.jpg',
    featuredImage: '/images/sanctuary/mary.jpg',
    shortDescription: 'Quiet retreat lodging for prayer groups and spiritual weekends.',
    description: 'A peaceful guest house oriented toward retreats.',
    gallery: [],
    services: [],
    specs: {},
  },
  {
    id: 2,
    slug: 'chapel-shrine',
    title: 'Chapel & Shrine',
    category: 'Worship',
    year: '2003',
    location: 'Kibeho, Nyaruguru',
    client: 'Diocese of Gikongoro',
    area: 'Main sanctuary',
    status: 'Open Daily',
    featured: false,
    shortDescription:
      'The heart of Kibeho — where Holy Mass, adoration, and pilgrim devotions take place throughout the day.',
    description:
      'The shrine chapel is the spiritual center of Kibeho Sanctuary. Here pilgrims gather for daily Mass, Eucharistic adoration, and the Rosary — in the shadow of the apparition hill where Our Lady appeared to the visionaries.',
    coverImage: '/images/projects/nyarutarama-residence/cover.jpg',
    featuredImage: '/images/projects/nyarutarama-residence/featured.jpg',
    gallery: ['/images/projects/nyarutarama-residence/gallery-1.jpg'],
    services: ['Holy Mass', 'Adoration', 'Rosary'],
    specs: {
      Location: 'Kibeho, Nyaruguru',
      Category: 'Worship',
      Capacity: '2,000+ seated',
      'Managed by': 'Diocese of Gikongoro',
      Hours: 'Open daily',
      Status: 'Open Daily',
    },
  },
  {
    id: 3,
    slug: 'dining',
    title: 'Dining Hall',
    category: 'Dining',
    year: '2016',
    location: 'Kibeho, Nyaruguru',
    client: 'Kibeho Sanctuary',
    area: '350 seats',
    status: 'Available',
    featured: false,
    shortDescription:
      'Shared meals for pilgrims and groups — simple, nourishing food served in a spirit of community.',
    description:
      'The dining hall serves breakfast, lunch, and dinner for resident pilgrims and day visitors. Group meals can be arranged in advance for parish pilgrimages and retreat programs.',
    coverImage: '/images/projects/grand-legacy-hotel-interior/cover.jpg',
    featuredImage: '/images/projects/grand-legacy-hotel-interior/featured.jpg',
    gallery: ['/images/projects/grand-legacy-hotel-interior/gallery-1.jpg'],
    services: ['Retreats'],
    specs: {
      Location: 'Kibeho, Nyaruguru',
      Capacity: '350 seats',
      Category: 'Dining',
      Meals: 'Breakfast, lunch, dinner',
      'Group booking': 'By arrangement',
      Status: 'Available',
    },
  },
  {
    id: 4,
    slug: 'souvenir-shop',
    title: 'Souvenir Shop',
    category: 'Services',
    year: '2010',
    location: 'Kibeho, Nyaruguru',
    client: 'Kibeho Sanctuary',
    area: 'Ground floor',
    status: 'Open Daily',
    featured: false,
    shortDescription:
      'Rosaries, medals, books, and devotional items to carry the grace of Kibeho home with you.',
    description:
      'The sanctuary shop offers religious articles, books on the Kibeho apparitions, candles, and locally made crafts. Proceeds support the ongoing mission and maintenance of the sanctuary.',
    coverImage: '/images/projects/rwanda-trade-innovation-center/cover.jpg',
    featuredImage: '/images/projects/rwanda-trade-innovation-center/featured.jpg',
    gallery: ['/images/projects/rwanda-trade-innovation-center/gallery-1.jpg'],
    services: [],
    specs: {
      Location: 'Kibeho, Nyaruguru',
      Category: 'Services',
      Items: 'Devotional articles & books',
      Languages: 'Kinyarwanda, French, English',
      Hours: '8:00 AM – 5:00 PM',
      Status: 'Open Daily',
    },
  },
  {
    id: 5,
    slug: 'meeting-halls',
    title: 'Meeting Halls',
    category: 'Gathering',
    year: '2014',
    location: 'Kibeho, Nyaruguru',
    client: 'Kibeho Sanctuary',
    area: '3 halls',
    status: 'Available',
    featured: false,
    shortDescription:
      'Spaces for group catechesis, parish meetings, and retreat sessions during pilgrimage programs.',
    description:
      'Meeting halls of varying sizes accommodate parish groups, youth programs, and retreat facilitators. Audio-visual equipment and seating arrangements can be configured for talks, workshops, and small-group reflection.',
    coverImage: '/images/projects/kacyiru-corporate-towers/cover.jpg',
    featuredImage: '/images/projects/kacyiru-corporate-towers/featured.jpg',
    gallery: ['/images/projects/kacyiru-corporate-towers/gallery-1.jpg'],
    services: ['Retreats', 'Spiritual Guidance'],
    specs: {
      Location: 'Kibeho, Nyaruguru',
      Halls: '3 configurable spaces',
      Category: 'Gathering',
      Capacity: 'Up to 200 per hall',
      Equipment: 'AV & seating',
      Status: 'Available',
    },
  },
  {
    id: 6,
    slug: 'outdoor-prayer-areas',
    title: 'Outdoor Prayer Areas',
    category: 'Prayer',
    year: '2008',
    location: 'Kibeho, Nyaruguru',
    client: 'Kibeho Sanctuary',
    area: 'Apparition sites',
    status: 'Open Daily',
    featured: false,
    shortDescription:
      'Sacred outdoor spaces including the apparition hill, Stations of the Cross, and Marian grottos.',
    description:
      'Pilgrims walk the paths of the apparition sites, pray the Stations of the Cross on the hillside, and find quiet corners for personal devotion. These outdoor spaces connect visitors to the very ground where Our Lady of Kibeho appeared.',
    coverImage: '/images/projects/musanze-regional-works/cover.jpg',
    featuredImage: '/images/projects/musanze-regional-works/featured.jpg',
    gallery: ['/images/projects/musanze-regional-works/gallery-1.jpg'],
    services: ['Rosary', 'Spiritual Guidance'],
    specs: {
      Location: 'Kibeho, Nyaruguru',
      Category: 'Prayer',
      Sites: 'Apparition hill, grottos, stations',
      Access: 'Open to all pilgrims',
      'Guided tours': 'Available on request',
      Status: 'Open Daily',
    },
  },
]

// ── FILTER CATEGORIES ─────────────────────────────────────
export const projectCategories = [
  'All',
  'Hospitality',
  'Worship',
  'Dining',
  'Services',
  'Gathering',
  'Prayer',
]

// ── PROJECTS PAGE HERO COPY ────────────────────────────────
export const projectsHero = {
  eyebrow: 'Our Facilities',
  headlineLines: ['Spaces That Serve', 'Every Pilgrim'],
  subline:
    'From guest accommodation to the shrine chapel — everything you need for a meaningful pilgrimage at Kibeho.',
}

// ── PROJECTS GRID — EMPTY STATE ────────────────────────────
export const projectsEmptyMessage = 'No facilities match this category yet — check back soon.'

// ── PROJECT DETAIL PAGE — SECTION LABELS ───────────────────
export const projectDetailLabels = {
  overviewHeading: 'Facility Overview',
  servicesHeading: 'Related Programs',
  specsHeading: 'Facility Details',
  galleryHeading: 'Photo Gallery',
  relatedHeading: 'Other Facilities',
  ctaLabel: 'Plan Your Visit',
}

// ── PROJECTS PAGE CTA ─────────────────────────────────────
export const projectsCTA = {
  eyebrow: 'Plan Your Pilgrimage',
  heading: 'Ready to Visit Kibeho?',
  subline:
    'Explore our facilities and programs, then contact us to arrange your pilgrimage or group retreat.',
  primaryBtn: { label: 'Plan Your Visit', link: '/visit' },
  secondaryBtn: { label: 'Our Programs', link: '/pilgrimage' },
}
