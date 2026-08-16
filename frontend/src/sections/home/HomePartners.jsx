import { partners as fallback } from '@data/home/sanctuaryHome'
import { useContent } from '@context/ContentContext'
import { mergePageContent } from '@data/pages/mergePageContent'
import styles from './HomePartners.module.css'

export default function HomePartners() {
  const { section } = useContent()
  const data = mergePageContent(fallback, section('home.partners', {}))
  const items = data.items?.length ? data.items : fallback.items

  return (
    <section className={styles.section}>
      <div className="container">
        <p className={styles.eyebrow}>{data.eyebrow}</p>
        <h2 className={styles.heading}>{data.heading || data.title}</h2>
        <div className={styles.row}>
          {items.map((item) => (
            <div key={item.id || item.label} className={styles.logo}>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
