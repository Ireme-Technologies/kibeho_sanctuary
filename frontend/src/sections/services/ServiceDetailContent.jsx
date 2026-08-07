import { Link } from 'react-router-dom'
import styles from './ServiceDetailContent.module.css'
import { useContent } from '@context/ContentContext'
import { serviceWhyChooseUs } from '@data/services'

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="#4aa3e0" strokeWidth="1.4" />
      <path d="M5 8l2 2 4-4" stroke="#4aa3e0" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function ServiceDetailContent({ service }) {
  const { services } = useContent()
  const currentIndex = services.findIndex((item) => item.slug === service?.slug)
  const prevService = services[currentIndex - 1] ?? null
  const nextService = services[currentIndex + 1] ?? null

  return (
    <section id="service-details" className={styles.section} aria-label={`${service?.title} details`}>
      <div className={`${styles.container} ${styles.revealContainer}`}>
        <div className={styles.mainContent}>
          <h2 className={`${styles.heading} ${styles.reveal}`}>{service?.title}</h2>
          <div className={`${styles.accentLine} ${styles.revealLine}`} aria-hidden="true" />
          <p className={`${styles.description} ${styles.reveal} ${styles.delay2}`}>{service?.description}</p>
          <p className={`${styles.leadingText} ${styles.reveal} ${styles.delay3}`}>
            At Kibeho Sanctuary, every pilgrimage service is offered with pastoral care, reverence, and a warm welcome for all who come to pray.
          </p>

          <div className={styles.highlights}>
            {serviceWhyChooseUs.map((item, index) => (
              <div key={item.title} className={`${styles.highlightCard} ${styles.reveal}`} style={{ '--delay': `${0.16 + index * 0.08}s` }}>
                <h3 className={styles.highlightTitle}>{item.title}</h3>
                <p className={styles.highlightText}>{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={`${styles.sidebarCard} ${styles.reveal} ${styles.delay4}`}>
            <ul className={styles.deliverables}>
              {service?.deliverables?.map((item, index) => (
                <li key={item} className={`${styles.deliverable} ${styles.reveal}`} style={{ '--delay': `${0.22 + index * 0.05}s` }}>
                  <span className={styles.checkIcon}><CheckIcon /></span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className={`${styles.ctaBlock} ${styles.reveal} ${styles.panelReveal}`}>
        <p className={styles.ctaText}>
          Planning a pilgrimage or retreat? Contact the sanctuary office and we will gladly assist you.
        </p>
        <Link to="/contact" className={styles.ctaBtn}>Contact the Sanctuary</Link>
      </div>

      <div className={`${styles.navBlock} ${styles.panelReveal}`}>
        {prevService ? (
          <Link to={`/pilgrimage/${prevService.slug}`} className={`${styles.navLink} ${styles.navLinkLeft} ${styles.reveal}`} style={{ '--delay': '0.15s' }}>
            <span className={styles.navDirection}>Previous</span>
            <span className={styles.navServiceName}>{prevService.title}</span>
          </Link>
        ) : <span className={styles.navSpacer} />}

        <Link to="/pilgrimage" className={`${styles.navAll} ${styles.reveal}`} style={{ '--delay': '0.2s' }}>All pilgrimage services</Link>

        {nextService ? (
          <Link to={`/pilgrimage/${nextService.slug}`} className={`${styles.navLink} ${styles.navLinkRight} ${styles.reveal}`} style={{ '--delay': '0.25s' }}>
            <span className={styles.navDirection}>Next</span>
            <span className={styles.navServiceName}>{nextService.title}</span>
          </Link>
        ) : <span className={styles.navSpacer} />}
      </div>
    </section>
  )
}
