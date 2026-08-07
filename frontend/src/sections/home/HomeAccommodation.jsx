import { Link } from 'react-router-dom'
import { BedDouble, Utensils, ShoppingBag } from 'lucide-react'
import { accommodation } from '@data/home/sanctuaryHome'
import styles from './HomeAccommodation.module.css'

const facilityIcons = {
  houses: BedDouble,
  restaurant: Utensils,
  shop: ShoppingBag,
}

export default function HomeAccommodation() {
  const data = accommodation

  return (
    <section className={styles.section} id="accommodation">
      <div className={`container ${styles.layout}`}>
        <div className={styles.media}>
          <img src={data.image} alt="Pilgrim accommodation near Kibeho Sanctuary" />
        </div>
        <div className={styles.copy}>
          <h2 className={styles.heading}>{data.heading}</h2>
          <p className={styles.text}>{data.text}</p>
          <div className={styles.facilities}>
            {data.facilities.map((item) => {
              const Icon = facilityIcons[item.id] || BedDouble
              return (
                <Link key={item.id} to={item.path} className={styles.facility}>
                  <Icon size={22} className={styles.icon} aria-hidden="true" />
                  <span>
                    <strong>{item.title}</strong>
                    <span>{item.description}</span>
                  </span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
