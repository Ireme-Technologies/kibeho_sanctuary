import { partners } from '@data/home/sanctuaryHome'
import styles from './HomePartners.module.css'

export default function HomePartners() {
  return (
    <section className={styles.section}>
      <div className="container">
        <p className={styles.eyebrow}>{partners.eyebrow}</p>
        <h2 className={styles.heading}>{partners.heading}</h2>
        <div className={styles.row}>
          {partners.items.map((item) => (
            <div key={item.id} className={styles.logo}>
              {item.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
