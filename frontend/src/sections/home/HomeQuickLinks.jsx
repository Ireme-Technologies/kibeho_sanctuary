import { Link } from 'react-router-dom'
import { Church, BedDouble, CalendarDays, HeartHandshake, Users, Info } from 'lucide-react'
import { quickLinks } from '@data/home/sanctuaryHome'
import styles from './HomeQuickLinks.module.css'

const icons = {
  church: Church,
  bed: BedDouble,
  calendar: CalendarDays,
  heart: HeartHandshake,
  users: Users,
  info: Info,
}

export default function HomeQuickLinks() {
  return (
    <section className={styles.section} aria-label="Quick links">
      <div className={`container ${styles.grid}`}>
        {quickLinks.map((item) => {
          const Icon = icons[item.icon] || Info
          return (
            <Link key={item.id} to={item.path} className={styles.item}>
              <span className={styles.iconWrap} aria-hidden="true">
                <Icon size={28} strokeWidth={1.6} />
              </span>
              <span className={styles.title}>{item.title}</span>
              <span className={styles.desc}>{item.description}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
