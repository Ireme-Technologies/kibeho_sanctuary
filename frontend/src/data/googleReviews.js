/**
 * GOOGLE BUSINESS REVIEWS CONFIG
 * ─────────────────────────────────────────────────────────────
 * Reviews are pulled live from Google — nothing to manage here
 * except your profile link and optional widget embed.
 *
 * Setup:
 * 1. Set profileUrl to your Google Business profile (Share → Copy link).
 * 2. Update rating / reviewCount when you want the summary badge refreshed
 *    (or leave null to hide the numbers until you have them).
 * 3. Optional: add a third-party widget (Elfsight, EmbedSocial, etc.)
 *    by setting widgetSrc + widgetClass in GoogleReviews.jsx.
 * ─────────────────────────────────────────────────────────────
 */

export const googleReviews = {
  profileUrl: 'https://g.page/r/kibeho-sanctuary/review',
  placeName: 'Kibeho Sanctuary',

  // Set to null to hide until you have real figures from Google
  rating: null,
  reviewCount: null,

  // Optional live-review widget (uncomment and fill when ready)
  // widgetSrc: 'https://static.elfsight.com/platform/platform.js',
  // widgetClass: 'elfsight-app-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
}

export const googleReviewsCopy = {
  eyebrow: 'Pilgrim Reviews',
  heading: 'Blessed by Pilgrims from Around the World',
  description:
    'Read what pilgrims share about their experience at Kibeho Sanctuary — verified reviews from our Google Business profile.',
  ctaLabel: 'See All Reviews on Google',
}
