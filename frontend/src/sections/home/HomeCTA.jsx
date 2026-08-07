import { Link } from 'react-router-dom'
import { ArrowRight, Phone, Mail, MapPin } from 'lucide-react'
import { useInView } from '@hooks/useInView'
import { useContent } from '@context/ContentContext'
import { getVisibleSocials, resolveSocialIcon } from '@utils/socials'
import {
  ctaHeadingStart as fbStart,
  ctaHeadingHighlight as fbHighlight,
  ctaHeadingEnd as fbEnd,
  ctaSubline as fbSubline,
  ctaPrimaryBtn as fbPrimary,
  ctaSecondaryBtn as fbSecondary,
} from '@data/home/HomeCTA'
import styles from './HomeCTA.module.css'

export default function HomeCTA() {
  const { company, section } = useContent()
  const socials = getVisibleSocials(company.socials)
  const homeCta = section('home.cta')
  const ctaHeadingStart = homeCta.headingStart || fbStart
  const ctaHeadingHighlight = homeCta.headingHighlight || fbHighlight
  const ctaHeadingEnd = homeCta.headingEnd || fbEnd
  const ctaSubline = homeCta.subline || fbSubline
  const ctaPrimaryBtn = homeCta.primaryBtn || fbPrimary
  const ctaSecondaryBtn = homeCta.secondaryBtn || fbSecondary
  const [ref, inView] = useInView(0.2)

  return (
    <section className={styles.section} aria-labelledby="cta-heading">
      <div className="container">
        <div ref={ref} className={`${styles.card} fade-in-up ${inView ? 'is-visible' : ''}`}>
          <span className={styles.bracketTL} aria-hidden="true" />
          <span className={styles.bracketBR} aria-hidden="true" />

          <div className={styles.content}>
            <h2 id="cta-heading" className={styles.heading}>
              {ctaHeadingStart} <span>{ctaHeadingHighlight}</span> {ctaHeadingEnd}
            </h2>
            <p className={styles.subline}>{ctaSubline}</p>

            <div className={styles.buttons}>
              <Link to={ctaPrimaryBtn.link} className={styles.btnPrimary}>
                {ctaPrimaryBtn.label}
                <span className={styles.btnIcon}>
                  <ArrowRight size={14} />
                </span>
              </Link>
              <Link to={ctaSecondaryBtn.link} className={styles.btnSecondary}>
                {ctaSecondaryBtn.label}
                <span className={styles.btnIconOutline}>
                  <ArrowRight size={14} />
                </span>
              </Link>
            </div>

            <div className={styles.contactRow}>
              <a href={company.phoneHref} className={styles.contactItem}>
                <Phone size={15} />
                <span>{company.phone}</span>
              </a>
              <span className={styles.divider} aria-hidden="true" />
              <a href={`mailto:${company.email}`} className={styles.contactItem}>
                <Mail size={15} />
                <span>{company.email}</span>
              </a>
              <span className={styles.divider} aria-hidden="true" />
              <span className={styles.contactItem}>
                <MapPin size={15} />
                <span>{company.address}</span>
              </span>
            </div>

            <div className={styles.followSection}>
              <span className={styles.followLabel}>FOLLOW US</span>
              <div className={styles.socialIcons}>
                {socials.map((social, index) => {
                  const Icon = resolveSocialIcon(social)
                  return (
                    <a
                      key={`${social.label || social.href}-${index}`}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialIcon}
                      aria-label={social.label || 'Social link'}
                    >
                      <Icon size={16} />
                    </a>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
