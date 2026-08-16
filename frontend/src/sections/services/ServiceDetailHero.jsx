import { ChevronDown } from 'lucide-react'
import { useContent } from '@context/ContentContext'
import { excerpt } from '@utils/text'
import styles from './ServiceDetailHero.module.css'

export default function ServiceDetailHero({ service }) {
  const { resolveHeaderImage } = useContent()
  const heroImage = resolveHeaderImage(service?.detailImage || service?.image)

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
          <p className={styles.summary}>{excerpt(service?.description)}</p>
          <button type="button" className={styles.readMore} onClick={scrollToDetails}>
            Read more
            <ChevronDown size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  )
}
