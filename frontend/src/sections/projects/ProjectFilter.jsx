import { useInView } from '@hooks/useInView'
import { projectCategories } from '@data/projects'
import styles from './ProjectFilter.module.css'

export default function ProjectFilter({ active, onChange }) {
  const [ref, inView] = useInView(0.3)

  return (
    <div
      ref={ref}
      className={`${styles.filterBar} fade-in-up ${inView ? 'is-visible' : ''}`}
      role="group"
      aria-label="Filter projects by category"
    >
      {projectCategories.map((category) => (
        <button
          key={category}
          type="button"
          aria-pressed={active === category}
          className={`${styles.filterBtn} ${active === category ? styles.filterBtnActive : ''}`}
          onClick={() => onChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  )
}