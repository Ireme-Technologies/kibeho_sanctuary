import { MapPin, Phone, Mail, Heart } from 'lucide-react'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import { getVisibleSocials, resolveSocialIcon } from '@utils/socials'
import { displayCapsLabel, displayTitleLabel } from '@i18n/typography'
import LocalizedLink, { LocalizedNavLink } from '@components/LocalizedLink'
import { GIVE_PAGE_PATH } from '@utils/giveServices'
import { useSwitchLocale } from '@router/LocaleRoute'
import styles from './Footer.module.css'

const LOCATION_CHAIN = ['Africa', 'Rwanda', 'Kibeho']

export default function Footer() {
  const { company, footerLinks, footerServiceLinks, footerCta } = useContent()
  const { locales, locale, t } = useLocale()
  const switchLocale = useSwitchLocale()
  const brandName = company.name || 'Shrine of Our Lady of Kibeho'
  const socials = getVisibleSocials(company.socials)

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.ctaBand}`}>
        <div className={styles.ctaPlace}>
          <div className={styles.locationRow}>
            <span className={styles.locationIcon} aria-hidden="true">
              <MapPin size={18} strokeWidth={2} />
            </span>
            <p className={styles.locationChain} aria-label="Africa, Rwanda, Kibeho">
              {LOCATION_CHAIN.map((part, index) => (
                <span key={part} className={styles.locationPart}>
                  {index > 0 ? <span className={styles.locationSep} aria-hidden="true" /> : null}
                  <span className={index === LOCATION_CHAIN.length - 1 ? styles.locationHere : undefined}>
                    {part}
                  </span>
                </span>
              ))}
            </p>
          </div>
          <h2 className={styles.ctaTitle}>
            {displayTitleLabel(
              footerCta.title || 'The only Marian place in Africa recognised by the Church',
              locale,
            )}
          </h2>
          {footerCta.text ? <p className={styles.ctaText}>{footerCta.text}</p> : null}
        </div>

        <div className={styles.ctaActions}>
          <LocalizedNavLink to={footerCta.primary.path || '/pilgrimage/plan'} className={styles.ctaBtn}>
            {displayCapsLabel(footerCta.primary.label || 'Plan Your Pilgrimage', locale)}
          </LocalizedNavLink>
          <LocalizedNavLink to={footerCta.secondary.path || GIVE_PAGE_PATH} className={styles.ctaBtnGhost}>
            <Heart size={16} aria-hidden="true" />
            {displayCapsLabel(footerCta.secondary.label || 'Get involved', locale)}
          </LocalizedNavLink>
        </div>
      </div>

      <div className={`container ${styles.grid}`}>
        <div className={styles.brandCol}>
          <LocalizedNavLink to="/" className={styles.logo}>
            <img
              src={company.logo || '/images/logo/logo-transparent.png'}
              alt=""
              className={styles.logoImg}
            />
            <span className={styles.brandText}>
              <span className={styles.brandName}>{brandName}</span>
              <span className={styles.brandTag}>{t('brand.diocese')}</span>
            </span>
          </LocalizedNavLink>
          <div className={styles.socials}>
            {socials.map((social, index) => {
              const Icon = resolveSocialIcon(social)
              return (
                <a
                  key={`${social.label || social.href}-${index}`}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label || 'Social link'}
                  className={styles.socialIcon}
                >
                  <Icon size={16} />
                </a>
              )
            })}
          </div>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t('quickLinks')}</h4>
          <ul>
            {footerLinks.map((link) => (
              <li key={link.path + link.label}>
                <LocalizedLink to={link.path}>{link.label}</LocalizedLink>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t('explore')}</h4>
          <ul>
            {footerServiceLinks.map((link) => (
              <li key={link.path + link.label}>
                <LocalizedLink to={link.path}>{link.label}</LocalizedLink>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.col}>
          <h4 className={styles.colTitle}>{t('contact')}</h4>
          <ul className={styles.contactList}>
            <li>
              <span className={styles.contactIcon} aria-hidden="true">
                <MapPin size={15} />
              </span>
              <span>{company.address}</span>
            </li>
            <li>
              <span className={styles.contactIcon} aria-hidden="true">
                <Phone size={15} />
              </span>
              <a href={company.phoneHref || `tel:${company.phone}`}>{company.phone}</a>
            </li>
            {company.phone2 ? (
              <li>
                <span className={styles.contactIcon} aria-hidden="true">
                  <Phone size={15} />
                </span>
                <a href={`tel:${String(company.phone2).replace(/\s+/g, '')}`}>{company.phone2}</a>
              </li>
            ) : null}
            <li>
              <span className={styles.contactIcon} aria-hidden="true">
                <Mail size={15} />
              </span>
              <a href={`mailto:${company.email}`}>{company.email}</a>
            </li>
          </ul>
          <div className={styles.langRow} role="group" aria-label={t('language')}>
            {locales.map((l) => (
              <button
                key={l.code}
                type="button"
                className={styles.langChip}
                aria-pressed={locale === l.code}
                onClick={() => switchLocale(l.code)}
              >
                {l.flag} {l.code.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={`container ${styles.bottomInner}`}>
          <p>
            © {new Date().getFullYear()} {brandName}. {t('allRights')}
          </p>
          <p className={styles.bottomNote}>{t('placeOfFaith')}</p>
        </div>
      </div>
    </footer>
  )
}
