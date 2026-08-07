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
  eyebrow: 'Reach Out',
  headline: 'Contact Us',
  'hero-bg-image': '/images/contact/contact-hero.jpeg',
  subline:
    'Have questions about visiting Kibeho, group pilgrimages, or retreats? Our team is happy to help.',
}

// ── CONTACT INFO (glass panel) ────────────────────────────
export const contactInfo = {
  eyebrow: 'Get In Touch',
  heading: 'Contact Information',
  address: 'Kibeho, Nyaruguru District, Southern Province, Rwanda',
  phone: '+250 788 123 456',
  email: 'info@kibehosanctuary.org',
  businessHours: [
    { day: 'Monday – Saturday', hours: '7:00 AM – 6:00 PM' },
    { day: 'Sunday', hours: '6:00 AM – 8:00 PM (Pilgrimage Day)' },
    { day: 'Feast Days', hours: 'Extended hours — check schedule' },
  ],
  whatsappNumber: '250788123456',
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
  label: 'Kibeho Sanctuary — Nyaruguru, Rwanda',
  title: 'Kibeho Sanctuary',
  subtitle: 'Shrine of Our Lady of Kibeho',
  embedSrc:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.5!2d29.556!3d-2.635!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sKibeho%2C%20Rwanda!5e0!3m2!1sen!2srw!4v1699000000000!5m2!1sen!2srw',
  directionsLink: 'https://maps.google.com/?q=Kibeho,Nyaruguru,Rwanda',
  directionsLabel: 'Get Directions',
}
