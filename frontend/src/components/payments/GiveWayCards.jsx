import { Link } from 'react-router-dom'
import { ArrowRight, Building2, Church, Flame, Heart } from 'lucide-react'
import { getInvolvedHref } from '@utils/giveServices'
import styles from './GiveWayCards.module.css'

const ICONS = {
  church: Church,
  building: Building2,
  heart: Heart,
  flame: Flame,
}

export default function GiveWayCards({ items = [], variant = 'home', className = '' }) {
  if (!items.length) return null

  return (
    <div className={`${styles.grid} ${styles[variant] || ''} ${className}`.trim()} role="list">
      {items.map((item, index) => {
        const Icon = ICONS[item.icon] || Heart
        const href = item.path || getInvolvedHref(item.serviceKey || item.id)
        return (
          <Link
            key={item.id || item.serviceKey || item.title}
            to={href}
            className={styles.card}
            role="listitem"
            style={{ animationDelay: `${index * 0.07}s` }}
          >
            <span className={styles.iconWrap} aria-hidden="true">
              <Icon size={22} strokeWidth={1.75} />
            </span>
            <h3>{item.title}</h3>
            {item.text ? <p>{item.text}</p> : null}
            <span className={styles.cta}>
              Get involved
              <ArrowRight size={15} aria-hidden="true" />
            </span>
          </Link>
        )
      })}
    </div>
  )
}
