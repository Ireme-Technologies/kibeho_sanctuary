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

export default function GiveWayCards({
  items = [],
  variant = 'home',
  className = '',
  activeKey = '',
  onSelect,
}) {
  if (!items.length) return null

  const selectable = typeof onSelect === 'function'

  return (
    <div
      className={`${styles.grid} ${styles[variant] || ''} ${className}`.trim()}
      role={selectable ? 'radiogroup' : 'list'}
      aria-label={selectable ? 'Choose how to give' : undefined}
    >
      {items.map((item, index) => {
        const key = item.serviceKey || item.id
        const Icon = ICONS[item.icon] || Heart
        const active = selectable && activeKey === key
        const href = item.path || getInvolvedHref(key)
        const sharedProps = {
          className: `${styles.card} ${active ? styles.cardActive : ''}`.trim(),
          style: { animationDelay: `${index * 0.07}s` },
        }

        const body = (
          <>
            <span className={styles.iconWrap} aria-hidden="true">
              <Icon size={22} strokeWidth={1.75} />
            </span>
            <h3>{item.title}</h3>
            {item.text ? <p>{item.text}</p> : null}
            {selectable ? (
              <span className={styles.cta}>{active ? 'Selected' : 'Choose this'}</span>
            ) : (
              <span className={styles.cta}>
                Get involved
                <ArrowRight size={15} aria-hidden="true" />
              </span>
            )}
          </>
        )

        if (selectable) {
          return (
            <button
              key={key || item.title}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => onSelect(key)}
              {...sharedProps}
            >
              {body}
            </button>
          )
        }

        return (
          <Link key={key || item.title} to={href} role="listitem" {...sharedProps}>
            {body}
          </Link>
        )
      })}
    </div>
  )
}
