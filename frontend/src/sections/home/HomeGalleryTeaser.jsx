import { Link } from 'react-router-dom'
import { useInView } from '@hooks/useInView'
import styles from './HomeGalleryTeaser.module.css'

const images = [
  { src: '/images/sanctuary/hero.jpg', alt: 'Kibeho Sanctuary shrine exterior' },
  { src: '/images/sanctuary/welcome.jpg', alt: 'Pilgrims welcomed at the shrine' },
  { src: '/images/sanctuary/hills.jpg', alt: 'Hills surrounding Kibeho' },
  { src: '/images/sanctuary/mary.jpg', alt: 'Devotion to Our Lady of Kibeho' },
  { src: '/images/sanctuary/crest.jpg', alt: 'Diocese of Gikongoro' },
]

export default function HomeGalleryTeaser() {
  const [ref, inView] = useInView(0.12)

  return (
    <section className={styles.section} ref={ref}>
      <div className="container">
        <div className={styles.head}>
          <div>
            <p className={styles.eyebrow}>Moments of Faith</p>
            <h2 className={styles.heading}>Gallery</h2>
          </div>
          <Link to="/gallery" className={styles.more}>
            Open gallery →
          </Link>
        </div>
        <div className={`${styles.grid} ${inView ? styles.visible : ''}`}>
          {images.map((item, index) => (
            <Link
              key={item.src}
              to="/gallery"
              className={`${styles.cell} ${index === 0 ? styles.feature : ''}`}
              style={{ animationDelay: `${index * 0.07}s` }}
            >
              <img src={item.src} alt={item.alt} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
