import { Link } from 'react-router-dom'
import { Church, BedDouble, CalendarDays, HeartHandshake, Users, Info } from 'lucide-react'
import { useContent } from '@context/ContentContext'
import { quickLinks as fallbackLinks } from '@data/home/sanctuaryHome'
import { mergePageContent } from '@data/pages/mergePageContent'
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
  const { section } = useContent()
  const data = mergePageContent(
    {
      links: fallbackLinks.map((item) => ({
        label: item.title,
        text: item.description,
        path: item.path,
        icon: item.icon,
        id: item.id,
      })),
    },
    section('home.quickLinks', {}),
  )
  const items = data.links?.length ? data.links : fallbackLinks

  return (
    <section className={styles.section} aria-label="Quick links">
      <div className={`container ${styles.grid}`}>
        {items.map((item) => {
          const Icon = icons[item.icon] || Info
          return (
            <Link key={item.id || item.path || item.label} to={item.path} className={styles.item}>
              <span className={styles.iconWrap} aria-hidden="true">
                <Icon size={28} strokeWidth={1.6} />
              </span>
              <span className={styles.title}>{item.label || item.title}</span>
              <span className={styles.desc}>{item.text || item.description}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
