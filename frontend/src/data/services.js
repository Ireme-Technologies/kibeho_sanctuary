/**
 * SERVICES DATA — Pilgrimage Programs
 * ─────────────────────────────────────────────────────────────
 * Shared source of truth for:
 *   - Homepage Services teaser (HomeServices)
 *   - Full Services page (ServicesPage)
 *   - Individual ServiceDetailPage (/services/:slug)
 *
 * image:       place files at /public/images/services/
 * detailImage: larger hero image for the detail page
 * deliverables: bullet points shown on the detail page
 * ─────────────────────────────────────────────────────────────
 */

export const services = [
  {
    id: 1,
    slug: 'holy-mass',
    title: 'Holy Mass',
    description:
      'Join daily and feast-day celebrations of the Eucharist at the heart of Kibeho Sanctuary — the source and summit of our pilgrimage life.',
    image: '/images/services/architectural-design.JPG',
    detailImage: '/images/services/architectural-design-detail.jpg',
    iconKey: 'architecture',
    link: '/pilgrimage/holy-mass',
    deliverables: [
      'Daily Mass in the shrine chapel',
      'Sunday and feast-day liturgies with pilgrim congregations',
      'Masses in Kinyarwanda, French, and English when scheduled',
      'Special Masses for groups and pilgrimages',
      'Opportunity for intentions and thanksgiving',
    ],
  },
  {
    id: 2,
    slug: 'confession',
    title: 'Confession',
    description:
      'Receive the sacrament of Reconciliation with priests available throughout the day — a grace Our Lady of Kibeho urged every pilgrim to seek.',
    image: '/images/services/structural-engineering.JPG',
    detailImage: '/images/services/structural-engineering-detail.jpg',
    iconKey: 'structure',
    link: '/pilgrimage/confession',
    deliverables: [
      'Confession available before and after Mass',
      'Extended hours during pilgrimage seasons',
      'Priests fluent in Kinyarwanda, French, and English',
      'Private reconciliation rooms in the shrine area',
      'Spiritual counsel for those seeking deeper healing',
    ],
  },
  {
    id: 3,
    slug: 'adoration',
    title: 'Adoration',
    description:
      'Spend time in silent prayer before the Blessed Sacrament — a quiet refuge for pilgrims seeking peace and deeper union with Christ.',
    image: '/images/services/mep-engineering.JPG',
    detailImage: '/images/services/mep-engineering-detail.jpg',
    iconKey: 'mep',
    link: '/pilgrimage/adoration',
    deliverables: [
      'Eucharistic adoration in the chapel',
      'Scheduled holy hours and all-night vigils on feast days',
      'Quiet prayer spaces for individual devotion',
      'Guided adoration for pilgrimage groups',
      'Exposition before and after major liturgies',
    ],
  },
  {
    id: 4,
    slug: 'rosary',
    title: 'Rosary',
    description:
      'Pray the Rosary together in the spirit of Our Lady of Kibeho — meditating on the mysteries of Christ\'s life through Mary\'s intercession.',
    image: '/images/services/project-management.JPG',
    detailImage: '/images/services/project-management-detail.jpg',
    iconKey: 'management',
    link: '/pilgrimage/rosary',
    deliverables: [
      'Communal Rosary before daily Mass',
      'Rosary processions on pilgrimage days',
      'Seven Sorrows Rosary devotion unique to Kibeho',
      'Rosary guides available in multiple languages',
      'Children\'s and family Rosary sessions when scheduled',
    ],
  },
  {
    id: 5,
    slug: 'retreats',
    title: 'Retreats',
    description:
      'Deeper spiritual renewal through guided retreats — from day visits to multi-day programs of prayer, reflection, and community.',
    image: '/images/services/construction-management.jpg',
    detailImage: '/images/services/construction-management-detail.jpg',
    iconKey: 'construction',
    link: '/pilgrimage/retreats',
    deliverables: [
      'Day retreats for individuals and small groups',
      'Multi-day parish and diocesan pilgrimage programs',
      'Themed retreats on reconciliation and Marian devotion',
      'Accommodation coordination with guest houses',
      'Retreat schedules tailored to group needs',
    ],
  },
  {
    id: 6,
    slug: 'spiritual-guidance',
    title: 'Spiritual Guidance',
    description:
      'Meet with a priest or spiritual director for personal counsel — helping pilgrims discern God\'s will and integrate their Kibeho experience.',
    image: '/images/services/interior-design.jpg',
    detailImage: '/images/services/interior-design-detail.jpg',
    iconKey: 'interior',
    link: '/pilgrimage/spiritual-guidance',
    deliverables: [
      'One-on-one meetings with available priests',
      'Guidance on the messages of Our Lady of Kibeho',
      'Support for those seeking healing and forgiveness',
      'Direction for ongoing prayer life after pilgrimage',
      'Appointments arranged through the sanctuary office',
    ],
  },
]

// ── PROCESS STEPS ─────────────────────────────────────────
export const processSteps = [
  {
    id: 1,
    number: '01',
    title: 'Plan Your Visit',
    description:
      'Contact us or explore our visit guide to choose dates, arrange group travel, and learn what to expect at Kibeho.',
  },
  {
    id: 2,
    number: '02',
    title: 'Arrive & Settle In',
    description:
      'Check in at guest accommodation, orient yourself to the shrine grounds, and prepare your heart for prayer.',
  },
  {
    id: 3,
    number: '03',
    title: 'Participate in Liturgy',
    description:
      'Join Holy Mass, confession, adoration, and the Rosary — the rhythm of sacramental life at the sanctuary.',
  },
  {
    id: 4,
    number: '04',
    title: 'Pray & Reflect',
    description:
      'Walk the apparition sites, spend time in silent prayer, and receive spiritual guidance if you wish.',
  },
  {
    id: 5,
    number: '05',
    title: 'Return Renewed',
    description:
      'Depart with a heart converted to prayer, forgiveness, and peace — carrying Our Lady\'s message into daily life.',
  },
]

// ── SERVICES PAGE CTA ─────────────────────────────────────
export const servicesCTA = {
  heading: 'Ready to Begin Your Pilgrimage?',
  subline: 'Explore our programs and plan your visit to Kibeho Sanctuary.',
  primaryBtn: { label: 'Plan Your Visit', link: '/visit' },
  secondaryBtn: { label: 'Contact Us', link: '/contact' },
}

export const serviceWhyChooseUs = [
  {
    title: 'Authentic devotion',
    description: 'Programs rooted in the approved apparitions and the living tradition of the Catholic Church.',
  },
  {
    title: 'Warm hospitality',
    description: 'From arrival to departure, every pilgrim is welcomed with care, respect, and practical support.',
  },
  {
    title: 'Sacramental life',
    description: 'Daily Mass, confession, and adoration at the heart of every visit to this holy place.',
  },
]
