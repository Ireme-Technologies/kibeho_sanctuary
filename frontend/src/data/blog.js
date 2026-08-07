/**
 * BLOG DATA — News & Events
 * ─────────────────────────────────────────────────────────────
 * Shared source of truth for BlogPage (grid), BlogPostPage (detail),
 * and the sidebar (popular posts, tags) on both.
 *
 * images: place files at /public/images/blog/
 * ─────────────────────────────────────────────────────────────
 */

export const blogAuthors = [
  {
    id: 1,
    name: 'Kibeho Sanctuary Team',
    avatar: '/images/blog/authors/team.jpg',
    role: 'Sanctuary Communications',
    bio: 'News and updates from the pastoral team serving pilgrims at Kibeho Sanctuary.',
    socials: [
      { iconKey: 'facebook', href: '#' },
      { iconKey: 'instagram', href: '#' },
      { iconKey: 'x', href: '#' },
      { iconKey: 'linkedin', href: '#' },
    ],
  },
  {
    id: 2,
    name: 'Fr. Emmanuel Niyonsaba',
    avatar: '/images/blog/authors/diane-uwimana.jpg',
    role: 'Parish Priest',
    bio: 'Reflections on pilgrimage, Marian devotion, and the message of Our Lady of Kibeho.',
    socials: [
      { iconKey: 'facebook', href: '#' },
      { iconKey: 'instagram', href: '#' },
      { iconKey: 'x', href: '#' },
      { iconKey: 'linkedin', href: '#' },
    ],
  },
]

export const blogCategories = [
  'All',
  'Pilgrimage',
  'Events',
  'Faith & Devotion',
  'Sanctuary News',
]

export const blogTags = [
  'Pilgrimage',
  'Holy Mass',
  'Retreats',
  'Our Lady of Kibeho',
  'Reconciliation',
  'Events',
  'Feast Days',
  'Sanctuary News',
]

export const blogPosts = [
  {
    id: 1,
    slug: 'preparing-for-your-first-pilgrimage-to-kibeho',
    title: 'Preparing for Your First Pilgrimage to Kibeho',
    excerpt:
      'What to bring, what to expect, and how to open your heart before arriving at this sacred place in Nyaruguru.',
    category: 'Pilgrimage',
    tags: ['Pilgrimage', 'Our Lady of Kibeho'],
    authorId: 1,
    publishedAt: '2026-05-15',
    coverImage: '/images/sanctuary/hero.jpg',
    content: [
      {
        type: 'paragraph',
        text: 'A pilgrimage to Kibeho is more than a journey through Rwanda\'s southern hills — it is an invitation to prayer, conversion, and reconciliation. Whether you come alone or with a parish group, a little preparation helps you receive the grace of this holy place.',
      },
      {
        type: 'image',
        src: '/images/blog/signs-structural-reinforcement/inline-1.png',
        caption: 'Pilgrims walking toward the shrine at Kibeho.',
      },
      {
        type: 'checklist',
        items: [
          'Pack modest clothing suitable for church and outdoor prayer',
          'Bring a Rosary and any devotional books you find helpful',
          'Arrange accommodation in advance during feast days',
          'Plan to attend at least one daily Mass and confession',
          'Allow time for silent prayer at the apparition sites',
        ],
      },
      { type: 'heading', text: 'Arriving with an Open Heart' },
      {
        type: 'paragraph',
        text: 'Our Lady of Kibeho asked for prayer, fasting, and conversion of heart. Come ready to listen — not only during liturgies, but in the quiet moments walking the paths where the apparitions took place.',
      },
      {
        type: 'quote',
        text: 'Pray, pray, pray — and convert your hearts.',
        author: 'Our Lady of Kibeho',
      },
    ],
    comments: [
      {
        id: 1,
        name: 'Isaac Byiringiro',
        avatar: '/images/blog/comments/isaac-byiringiro.jpg',
        date: '2026-05-17',
        text: 'This was exactly what our parish group needed before our trip. Thank you for the practical guidance.',
      },
      {
        id: 2,
        name: 'Claudine Ishimwe',
        avatar: null,
        date: '2026-05-18',
        text: 'Would love a follow-up on group booking for larger pilgrimages.',
      },
    ],
  },
  {
    id: 2,
    slug: 'feast-of-our-lady-of-kibeho-2026-schedule',
    title: 'Feast of Our Lady of Kibeho — 2026 Schedule',
    excerpt:
      'Join us for the annual feast day celebrations with special Masses, processions, and all-night adoration.',
    category: 'Events',
    tags: ['Events', 'Feast Days', 'Holy Mass'],
    authorId: 1,
    publishedAt: '2026-04-22',
    coverImage: '/images/sanctuary/welcome.jpg',
    content: [
      {
        type: 'paragraph',
        text: 'Each year, pilgrims from across Rwanda and beyond gather at Kibeho Sanctuary to celebrate the feast of Our Lady of Kibeho. The 2026 program includes solemn Masses, a candlelight procession, confessions throughout the day, and Eucharistic adoration through the night.',
      },
      { type: 'heading', text: 'Highlights of the Feast Day' },
      {
        type: 'paragraph',
        text: 'The main solemn Mass begins at 10:00 AM in the shrine chapel, followed by a procession to the apparition hill. Guest houses and dining services operate on extended hours to welcome all pilgrims.',
      },
      {
        type: 'gallery',
        images: [
          '/images/blog/sustainable-construction-rwanda/gallery-1.jpg',
          '/images/blog/sustainable-construction-rwanda/gallery-2.jpg',
        ],
      },
    ],
    comments: [
      {
        id: 1,
        name: 'Robert Twahirwa',
        avatar: '/images/blog/comments/robert-twahirwa.jpg',
        date: '2026-04-24',
        text: 'Will there be Mass in English for international pilgrims?',
      },
    ],
  },
  {
    id: 3,
    slug: 'meaning-of-the-seven-sorrows-rosary-at-kibeho',
    title: 'The Seven Sorrows Rosary at Kibeho',
    excerpt:
      'Discover the devotion Our Lady taught the visionaries — and why it remains central to prayer at the sanctuary today.',
    category: 'Faith & Devotion',
    tags: ['Our Lady of Kibeho', 'Reconciliation'],
    authorId: 2,
    publishedAt: '2026-03-10',
    coverImage: '/images/sanctuary/mary.jpg',
    content: [
      {
        type: 'paragraph',
        text: 'Among the messages given at Kibeho, Our Lady introduced a devotion to her Seven Sorrows — inviting the faithful to meditate on her suffering alongside Christ\'s passion. This Rosary is prayed daily at the sanctuary and offered as a path toward compassion and forgiveness.',
      },
      {
        type: 'checklist',
        items: [
          'Seven decades, each honoring a sorrow of the Blessed Virgin',
          'Prayed communally before daily Mass at the shrine',
          'Guides available in Kinyarwanda, French, and English',
          'A devotion especially recommended during Lent',
        ],
      },
      {
        type: 'paragraph',
        text: 'Pilgrims often find that praying the Seven Sorrows Rosary opens the heart to the reconciliation Our Lady urgently requested for Rwanda and for the world.',
      },
    ],
    comments: [],
  },
  {
    id: 4,
    slug: 'new-guest-house-wings-open-for-pilgrims',
    title: 'New Guest House Wings Open for Pilgrims',
    excerpt:
      'Expanded accommodation now welcomes more retreat groups and international pilgrims during peak seasons.',
    category: 'Sanctuary News',
    tags: ['Sanctuary News', 'Pilgrimage'],
    authorId: 1,
    publishedAt: '2026-02-18',
    coverImage: '/images/sanctuary/hills.jpg',
    content: [
      {
        type: 'paragraph',
        text: 'Kibeho Sanctuary has completed renovations on two guest house wings, adding capacity for parish groups and diocesan pilgrimages during feast days and retreat seasons.',
      },
      {
        type: 'image',
        src: '/images/blog/interior-design-trends-kigali/inline-1.jpg',
        caption: 'Refreshed guest rooms near the shrine grounds.',
      },
      {
        type: 'paragraph',
        text: 'Groups are encouraged to book early through the sanctuary office. Simple, clean rooms with shared facilities keep pilgrims close to the chapel and apparition sites.',
      },
    ],
    comments: [
      {
        id: 1,
        name: 'Fiona Uwizeye',
        avatar: null,
        date: '2026-02-20',
        text: 'Wonderful news for our diocese — we have struggled to find rooms during the feast.',
      },
    ],
  },
  {
    id: 5,
    slug: 'youth-retreat-weekend-at-kibeho-sanctuary',
    title: 'Youth Retreat Weekend at Kibeho Sanctuary',
    excerpt:
      'A weekend of prayer, catechesis, and fellowship for young Catholics — registration now open.',
    category: 'Events',
    tags: ['Retreats', 'Events'],
    authorId: 2,
    publishedAt: '2026-01-29',
    coverImage: '/images/sanctuary/crest.jpg',
    content: [
      {
        type: 'paragraph',
        text: 'The sanctuary invites youth groups from parishes across Rwanda to a dedicated retreat weekend focused on prayer, reconciliation, and Marian devotion. Programs include Mass, confession, guided reflection, and time at the apparition sites.',
      },
      { type: 'heading', text: 'How to Register' },
      {
        type: 'paragraph',
        text: 'Parish youth leaders may contact the sanctuary office to reserve places. Accommodation and meals are included for registered groups. Spaces are limited — early booking is recommended.',
      },
    ],
    comments: [],
  },
  {
    id: 6,
    slug: 'message-of-reconciliation-for-rwanda-and-the-world',
    title: 'The Message of Reconciliation for Rwanda and the World',
    excerpt:
      'Reflecting on Our Lady\'s call to forgive and heal — a message that continues to resonate at Kibeho today.',
    category: 'Faith & Devotion',
    tags: ['Reconciliation', 'Our Lady of Kibeho'],
    authorId: 2,
    publishedAt: '2025-12-05',
    coverImage: '/images/sanctuary/hero.jpg',
    content: [
      {
        type: 'paragraph',
        text: 'Long before Rwanda\'s darkest hour, the messages at Kibeho spoke of sorrow, warning, and an urgent call to reconciliation. Today, pilgrims come seeking healing — for themselves, their families, and their nation.',
      },
      {
        type: 'quote',
        text: 'Repent, repent, repent. Forgive each other. Help the poor.',
        author: 'Our Lady of Kibeho',
      },
      {
        type: 'paragraph',
        text: 'The sanctuary offers confession, spiritual guidance, and prayer spaces where this message can take root. Reconciliation is not a single moment — it is a path walked in faith, one step at a time.',
      },
    ],
    comments: [
      {
        id: 1,
        name: 'Claudine Ishimwe',
        avatar: null,
        date: '2025-12-08',
        text: 'A beautiful reminder of why Kibeho matters so deeply for our country.',
      },
    ],
  },
]
