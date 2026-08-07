export const welcomeMessage =
  'Peace to all who visit the Shrine of Our Lady of Kibeho.'

export const homeWelcome = {
  eyebrow: 'Our Lady of Kibeho',
  heading: 'Recognised. Welcoming. A place of conversion.',
  text: 'The Shrine of Our Lady of Kibeho is the first — and to date the only — Marian apparition site in Africa officially recognised by the Catholic Church. Pilgrims from every nation are welcome.',
  cta: { label: 'Discover the Message', path: '/our-lady' },
  image: '/images/sanctuary/welcome.jpg',
}

export const quickLinks = [
  {
    id: 'message',
    icon: 'info',
    title: 'The Message',
    description: 'Apparitions & recognition',
    path: '/our-lady',
  },
  {
    id: 'plan',
    icon: 'users',
    title: 'Pilgrimage',
    description: 'Plan your visit',
    path: '/pilgrimage/plan',
  },
  {
    id: 'pray',
    icon: 'calendar',
    title: 'Spirituality',
    description: 'Pray with the Shrine',
    path: '/spirituality',
  },
  {
    id: 'donate',
    icon: 'heart',
    title: 'Support',
    description: 'Master Plan & gifts',
    path: '/support',
  },
]

export const homeActivities = {
  heading: 'At the Shrine',
  subline:
    'Explore the churches, apparition sites, Holy Spring, Way of the Cross, and liturgical life of the Shrine of Our Lady of Kibeho.',
  primaryCta: { label: 'Explore the Shrine', path: '/shrine' },
  secondaryCta: { label: 'Mass Schedule', path: '/shrine/mass-schedule' },
}

/** Home highlights mapped to ToR “The Shrine” (not mixed Spirituality items) */
export const shrineHighlights = [
  {
    id: 'holy-spring',
    title: 'Holy Spring',
    shortDescription:
      'Pilgrims come to the spring in faith — a sign of God’s grace and a call to trust.',
    image: '/images/sanctuary/activity-spring.jpg',
    path: '/shrine/holy-spring',
  },
  {
    id: 'way-of-the-cross',
    title: 'Way of the Cross',
    shortDescription:
      'Walk the Stations in prayer with Christ, in the company of Our Lady of Sorrows.',
    image: '/images/sanctuary/hills.jpg',
    path: '/shrine/way-of-the-cross',
  },
  {
    id: 'apparition-sites',
    title: 'Apparition Sites',
    shortDescription:
      'Visit the places associated with the apparitions of the Mother of the Word.',
    image: '/images/sanctuary/mary.jpg',
    path: '/shrine/apparition-sites',
  },
]

export const upcomingPilgrimages = [
  {
    id: 1,
    title: 'Feast of the Assumption',
    text: 'A major Marian gathering of prayer and thanksgiving at the shrine.',
    meta: '15 August',
  },
  {
    id: 2,
    title: 'Marian Youth Pilgrimage',
    text: 'Young people journeying together in faith, song, and hope.',
    meta: 'Youth',
  },
  {
    id: 3,
    title: 'National Pilgrimage',
    text: 'The Church in Rwanda united in prayer at Kibeho.',
    meta: 'National',
  },
  {
    id: 4,
    title: 'International Pilgrimage',
    text: 'Pilgrims from beyond Rwanda welcomed in one communion of faith.',
    meta: 'Worldwide',
  },
]

export const todaySchedule = [
  { id: 1, title: 'Daily Mass', time: 'See Mass Schedule' },
  { id: 2, title: 'Confessions', time: 'As announced' },
  { id: 3, title: 'Rosary', time: 'After Mass / evening' },
  { id: 4, title: 'Adoration', time: 'Selected days' },
]

/** Aligns with ToR Pilgrimage → “Why Kibeho?” */
export const whyVisit = [
  {
    id: 'message',
    title: 'The Message',
    text: 'Discover the call of Our Lady of Kibeho to conversion, prayer, and reconciliation.',
  },
  {
    id: 'recognised',
    title: 'Church Recognition',
    text: 'The only Marian apparition site in Africa officially recognised by the Catholic Church.',
  },
  {
    id: 'liturgy',
    title: 'Liturgical Life',
    text: 'Join Mass, Adoration, and the prayer life of the Shrine.',
  },
  {
    id: 'pilgrimage',
    title: 'A Living Pilgrimage',
    text: 'Come alone or with your parish — prepare your journey with the Pilgrimage Office.',
  },
]

export const partners = {
  eyebrow: 'Partners',
  heading: 'Walking together in faith',
  items: [
    { id: 1, label: 'Diocese of Gikongoro' },
    { id: 2, label: 'Caritas' },
    { id: 3, label: 'Radio Maria' },
    { id: 4, label: 'Local Parishes' },
    { id: 5, label: 'Friends of Kibeho' },
  ],
}
