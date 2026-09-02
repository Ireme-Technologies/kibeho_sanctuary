/**
 * Site-wide buttons — labels per locale, paths shared across languages.
 * Managed in Admin → Site buttons. Do not edit per page in Site pages.
 */

export const defaultSiteButtons = {
  navDonate: {
    path: '/support/get-involved',
    translations: {
      en: { label: 'Donate' },
      fr: { label: 'Faire un don' },
      rw: { label: 'Tanga' },
      de: { label: 'Spenden' },
    },
  },
  footerCta: {
    primaryPath: '/support/get-involved',
    secondaryPath: '/support/partners',
    translations: {
      en: {
        title: 'Support our mission',
        text: 'Your gift helps welcome pilgrims, sustain the liturgy, and build the Shrine Our Lady asked for.',
        primaryLabel: 'Donate',
        secondaryLabel: 'Become a partner',
      },
      fr: {
        title: 'Soutenir notre mission',
        text: 'Votre don aide à accueillir les pèlerins, soutenir la liturgie et construire le Sanctuaire.',
        primaryLabel: 'Faire un don',
        secondaryLabel: 'Devenir partenaire',
      },
      rw: {
        title: 'Fasha umurimo wacu',
        text: 'Impano yawe ifasha kwakira abapelerinaji no guteza imbere Umwibutso.',
        primaryLabel: 'Tanga',
        secondaryLabel: 'Ba umufatanyabikorwa',
      },
      de: {
        title: 'Unterstützen Sie unsere Mission',
        text: 'Ihre Gabe hilft, Pilger willkommen zu heißen und das Heiligtum zu erhalten.',
        primaryLabel: 'Spenden',
        secondaryLabel: 'Partner werden',
      },
    },
  },
  involveStory: {
    translations: {
      en: {
        title: 'This call is still being lived at Kibeho',
        lead: 'Read, then walk with the pilgrims — in prayer, at Mass, or on the road to the Shrine.',
        cards: [
          {
            title: 'Light a candle',
            text: 'Leave a prayer intention at the Shrine.',
            path: '/spirituality/light-a-candle',
          },
          {
            title: 'Have a Mass said',
            text: 'Offer Mass for a loved one or intention.',
            path: '/spirituality/mass-request',
          },
          {
            title: 'Come on pilgrimage',
            text: 'Plan a visit to Our Lady of Kibeho.',
            path: '/pilgrimage/plan',
          },
        ],
      },
    },
  },
}
