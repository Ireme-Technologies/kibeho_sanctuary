/**
 * HOME STATS DATA
 * ─────────────────────────────────────────────────────────────
 * Used by: src/sections/home/HomeStats.jsx ("Numbers That Define Us")
 *
 * iconKey maps to a lucide-react icon in the component itself.
 * value: null means it's a text stat (no count-up animation) — use `text`.
 * ─────────────────────────────────────────────────────────────
 */

export const statsEyebrow = 'Our Impact'
export const statsHeading = 'Numbers That Define Us'
export const statsSupportingText =
  'Every project is a testament to our commitment — built on trust, precision, and a relentless pursuit of excellence.'

export const stats = [
  {
    id: 1,
    iconKey: 'years',
    value: 10,
    suffix: '+',
    label: 'Years Experience',
    description:
      'Over a decade delivering architectural and engineering excellence across Rwanda.',
  },
  {
    id: 2,
    iconKey: 'projects',
    value: 30,
    suffix: '+',
    label: 'Projects Completed',
    description:
      'From landmark commercial buildings to premium interior design commissions.',
  },
  {
    id: 3,
    iconKey: 'clients',
    value: 50,
    suffix: '+',
    label: 'Happy Clients',
    description:
      'Trusted by government institutions, private developers, and businesses alike.',
  },
  {
    id: 4,
    iconKey: 'location',
    value: null,
    text: 'Kigali',
    suffix: '',
    label: 'Rwanda',
    description: 'Headquartered in Kigali, delivering landmark projects across the nation.',
  },
]