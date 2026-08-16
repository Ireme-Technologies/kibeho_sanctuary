import { Link } from 'react-router-dom'
import { Church, Flame, Handshake, Heart } from 'lucide-react'
import { useLocale } from '@context/LocaleContext'
import RichText from '@components/ui/RichText'
import styles from './GiveInvite.module.css'

const PILLAR_ICONS = [Flame, Heart, Church, Handshake]

function InviteCard({ leadHtml, leadText, pillars, priceLabel, ctaLabel }) {
  return (
    <section className={styles.wrap}>
      {leadHtml ? (
        <RichText html={leadHtml} className={styles.lead} />
      ) : (
        <p className={styles.lead}>{leadText}</p>
      )}
      <ul className={styles.pillars}>
        {pillars.map((label, index) => {
          const Icon = PILLAR_ICONS[index] || Heart
          return (
            <li key={label}>
              <Icon size={18} />
              <span>{label}</span>
            </li>
          )
        })}
      </ul>
      <div className={styles.inviteActions}>
        {priceLabel ? <span className={styles.price}>{priceLabel}</span> : null}
        <a href="#pledge" className={styles.begin}>
          {ctaLabel}
        </a>
      </div>
    </section>
  )
}

export default function GiveInvite({ introHtml }) {
  const { t } = useLocale()
  return (
    <InviteCard
      leadHtml={introHtml}
      leadText={t('invite.donation.lead')}
      pillars={[t('invite.donation.p1'), t('invite.donation.p2'), t('invite.donation.p3')]}
      ctaLabel={t('offer.giveNow')}
    />
  )
}

export function ActionInvite({ kind, priceLabel, introHtml }) {
  const { t } = useLocale()
  if (!['candle', 'mass', 'partnership'].includes(kind)) return null
  const cta =
    kind === 'candle' ? t('offer.lightCandle') : kind === 'mass' ? t('offer.haveMass') : t('offer.beginPartnership')
  return (
    <InviteCard
      leadHtml={introHtml}
      leadText={t(`invite.${kind}.lead`)}
      pillars={[t(`invite.${kind}.p1`), t(`invite.${kind}.p2`), t(`invite.${kind}.p3`)]}
      priceLabel={priceLabel}
      ctaLabel={cta}
    />
  )
}

const INVOLVE = {
  candle: {
    title: 'invite.involveTitle',
    lead: 'invite.involveLead',
    links: [
      { to: '/spirituality/request-a-mass', title: 'invite.massTitle', text: 'invite.massText' },
      { to: '/support/donations', title: 'invite.giveTitle', text: 'invite.giveText' },
      { to: '/support/partners', title: 'invite.partnerTitle', text: 'invite.partnerText' },
    ],
  },
  mass: {
    title: 'invite.involveTitle',
    lead: 'invite.involveLead',
    links: [
      { to: '/spirituality/prayer-intentions', title: 'invite.candleTitle', text: 'invite.candleText' },
      { to: '/support/donations', title: 'invite.giveTitle', text: 'invite.giveText' },
      { to: '/support/partners', title: 'invite.partnerTitle', text: 'invite.partnerText' },
    ],
  },
  partnership: {
    title: 'invite.involveTitle',
    lead: 'invite.involveLead',
    links: [
      { to: '/support/donations', title: 'invite.giveTitle', text: 'invite.giveText' },
      { to: '/spirituality/prayer-intentions', title: 'invite.candleTitle', text: 'invite.candleText' },
      { to: '/support/projects', title: 'invite.projectTitle', text: 'invite.projectText' },
    ],
  },
  donation: {
    title: 'invite.involveTitle',
    lead: 'invite.involveLead',
    links: [
      { to: '/support/projects', title: 'invite.projectTitle', text: 'invite.projectText' },
      { to: '/spirituality/prayer-intentions', title: 'invite.candleTitle', text: 'invite.candleText' },
      { to: '/support/partners', title: 'invite.partnerTitle', text: 'invite.partnerText' },
    ],
  },
  story: {
    title: 'story.joinTitle',
    lead: 'story.joinLead',
    links: [
      { to: '/spirituality/prayer-intentions', title: 'invite.candleTitle', text: 'invite.candleText' },
      { to: '/spirituality/request-a-mass', title: 'invite.massTitle', text: 'invite.massText' },
      { to: '/pilgrimage/plan', title: 'story.planTitle', text: 'story.planText' },
    ],
  },
}

export function InvolveMore({ variant = 'donation', title, lead, links }) {
  const { t } = useLocale()
  const data = INVOLVE[variant] || INVOLVE.donation
  const heading = title || t(data.title)
  const intro = lead || t(data.lead)
  const cards =
    Array.isArray(links) && links.length
      ? links.map((item) => ({
          to: item.path || item.to,
          title: item.label || t(item.title),
          text: item.label ? item.text : t(item.text),
        }))
      : data.links.map((item) => ({
          to: item.to,
          title: t(item.title),
          text: t(item.text),
        }))

  return (
    <section className={styles.involve} id="join" aria-labelledby="involve-heading">
      <h2 id="involve-heading">{heading}</h2>
      <p className={styles.involveLead}>{intro}</p>
      <nav className={styles.involveGrid}>
        {cards.map((item) => (
          <Link key={item.to} to={item.to} className={styles.involveCard}>
            <strong>{item.title}</strong>
            <span>{item.text}</span>
          </Link>
        ))}
      </nav>
    </section>
  )
}

export function isStalePaymentCopy(value) {
  return /bank of kigali|banque populaire|momo pay|accounts of the diocese|mobile money|00266|475453/i.test(
    String(value || '')
  )
}

export function isStaleInviteCopy(html, kind) {
  const text = String(html || '')
  if (!text.trim()) return true
  if (kind === 'candle') return /popular piety|piety of the people/i.test(text)
  if (kind === 'mass') return /offering for a Mass is USD/i.test(text)
  return false
}
