import { Building2, Church, Flame, Heart } from 'lucide-react'
import { resolveGiveWays } from '@utils/giveServices'
import styles from './ServicePicker.module.css'

const ICONS = {
  church: Church,
  building: Building2,
  heart: Heart,
  flame: Flame,
}

export default function ServicePicker({ offerings, value, onChange }) {
  const options = resolveGiveWays(offerings)

  return (
    <div className={styles.wrap} role="radiogroup" aria-label="Choose how to give">
      <p className={styles.label}>I would like to</p>
      <div className={styles.grid}>
        {options.map((item) => {
          const key = item.serviceKey || item.id
          const active = value === key
          const Icon = ICONS[item.icon] || Heart
          return (
            <button
              key={key}
              type="button"
              role="radio"
              aria-checked={active}
              className={`${styles.option} ${active ? styles.optionActive : ''}`}
              onClick={() => onChange(key)}
            >
              <Icon size={18} aria-hidden="true" />
              <span>{item.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
