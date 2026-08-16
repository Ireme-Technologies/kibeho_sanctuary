import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { useInView } from '@hooks/useInView'
import { useContent } from '@context/ContentContext'
import { homeWelcome as fallback } from '@data/home/sanctuaryHome'
import styles from './HomeWelcome.module.css'

export default function HomeWelcome() {
  const { section, defaultHeaderImage } = useContent()
  const data = { ...fallback, ...section('home.welcome', {}) }
  const [ref, inView] = useInView(0.15)
  const image = data.image || defaultHeaderImage

  return (
    <section className={styles.section} ref={ref}>
      <div className={`container ${styles.layout} ${inView ? styles.visible : ''}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{data.eyebrow}</p>
          <h2 className={styles.heading}>{data.heading}</h2>
          <span className={styles.rule} aria-hidden="true" />
          <p className={styles.text}>{data.text}</p>
          <Link to={data.cta?.path || '/about'} className={styles.btn}>
            {data.cta?.label || 'Discover More'}
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
        <div className={styles.media}>
          <img src={image} alt="Shrine of Our Lady of Kibeho" />
        </div>
      </div>
    </section>
  )
}
