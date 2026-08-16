/**
 * CONTACT PAGE DATA
 * ─────────────────────────────────────────────────────────────
 * All content for the Contact page lives here. Replace placeholder
 * address/phone/email/hours with real details when ready.
 *
 * Social links are NOT duplicated here — they're imported from
 * src/data/navigation.js (socialLinks), same source used by the
 * footer, so updating one place keeps both in sync.
 * ─────────────────────────────────────────────────────────────
 */

// ── CONTACT HERO ─────────────────────────────────────────
export const contactHero = {
  eyebrow: 'Where to find us',
  headline: 'Contact us',
  'hero-bg-image': '',
  subline:
    'The Sanctuary Our Lady of Kibeho is situated in Gikongoro Diocese, Nyaruguru District, in Southern Rwanda, not far from the Burundian border.',
}

// ── CONTACT INFO (glass panel) ────────────────────────────
export const contactInfo = {
  eyebrow: 'Get In Touch',
  heading: 'Contact us',
  address: 'Sanctuary Our Lady of Kibeho, B.P. 341 Butare / Rwanda',
  postalAddress: 'B.P. 341 Butare, RWANDA',
  phone: '+250 788 559 192',
  phone2: '+250 788 307 376',
  email: 'info@kibehosanctuary.rw',
  plusCode: '9H23+58 Kibeho',
  localization:
    'Pilgrims from foreign countries can use the airplane that lands in Kigali. From Kigali, the St. Vincent Pallotti Pilgrimages Centre can help you find facilities for your pilgrimage to Kibeho.',
  routes: [
    'Kigali – Huye – Matyazo – Kibeho',
    'Rusizi – Huye – Matyazo – Kibeho',
    'Akanyaru – Cahinda – Kibeho',
  ],
  businessHours: [
    { day: 'Monday – Saturday', hours: '7:00 AM – 6:00 PM' },
    { day: 'Sunday', hours: '6:00 AM – 8:00 PM (Pilgrimage Day)' },
    { day: 'Feast Days', hours: 'Extended hours — check schedule' },
  ],
  whatsappNumber: '250788559192',
  whatsappLabel: 'Message on WhatsApp',
  responseNote: 'We typically respond within 1–2 business days.',
}

// ── CONTACT FORM ─────────────────────────────────────────
export const contactFormLabels = {
  eyebrow: 'Send A Message',
  heading: 'Get In Touch',
  fields: {
    name: { label: 'Full Name', placeholder: 'Your name' },
    email: { label: 'Email Address', placeholder: 'you@example.com' },
    phone: { label: 'Phone Number', placeholder: '+250 7xx xxx xxx' },
    message: { label: 'Message', placeholder: 'Tell us about your pilgrimage plans or question...' },
  },
  submitLabel: 'Send Message',
  submitLoadingLabel: 'Sending...',
  successMessage: "Thank you for reaching out! We'll respond as soon as we can.",
  errorMessage: 'Something went wrong. Please try again or contact us directly.',
  validation: {
    nameRequired: 'Please enter your name.',
    emailRequired: 'Please enter your email.',
    emailInvalid: 'Please enter a valid email address.',
    phoneRequired: 'Please enter your phone number.',
    messageRequired: 'Please enter a message.',
  },
}

// ── CONTACT MAP (small, standalone widget) ────────────────
export const contactMap = {
  label: '9H23+58 Kibeho',
  title: 'Sanctuary Our Lady of Kibeho',
  subtitle: 'Nyaruguru District · Diocese of Gikongoro',
  embedSrc: 'https://www.google.com/maps?q=9H23%2B58+Kibeho&output=embed',
  directionsLink: 'https://maps.google.com/?q=9H23+58+Kibeho',
  directionsLabel: 'Get Directions',
}
