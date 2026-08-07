import { ChevronDown } from 'lucide-react'
import styles from './ServiceDetailHero.module.css'

function shortDescription(text = '', max = 160) {
  const clean = String(text)
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (clean.length <= max) return clean
  return `${clean.slice(0, max).replace(/\s+\S*$/, '')}…`
}

export default function ServiceDetailHero({ service }) {
  const heroImage = service?.detailImage || `/images/services/detail-heros/${service?.slug || 'service'}.jpg`

  const scrollToDetails = () => {
    const target = document.getElementById('service-details')
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <section className={styles.hero} aria-label={`${service?.title} overview`}>
      <div className={styles.media} aria-hidden="true">
        <img src={heroImage} alt="" className={styles.heroImage} />
        <div className={styles.overlay} />
      </div>

      <div className={styles.inner}>
        <h1 className={styles.title}>{service?.title}</h1>

        <div className={styles.bottom}>
          <p className={styles.summary}>{shortDescription(service?.description)}</p>
          <button type="button" className={styles.readMore} onClick={scrollToDetails}>
            Read more
            <ChevronDown size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
