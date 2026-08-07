import { Award, Lightbulb, ShieldCheck, Leaf } from 'lucide-react'
import { useInView } from '@hooks/useInView'
import styles from './CoreValues.module.css'
import { useContent } from '@context/ContentContext'
import { coreValues as fb } from '@data/about'

const icons = {
  quality: Award,
  innovation: Lightbulb,
  integrity: ShieldCheck,
  sustainability: Leaf,
}

function ValueCard({ value, index, inView }) {
  const Icon = icons[value.iconKey]

  return (
    <div
      className={`${styles.card} fade-in-up ${inView ? 'is-visible' : ''}`}
      style={{ animationDelay: `${index * 0.12}s` }}
    >
      <div className={styles.iconWrap} aria-hidden="true">
        <Icon size={26} strokeWidth={1.75} />
      </div>
      <h3 className={styles.title}>{value.title}</h3>
      <p className={styles.description}>{value.description}</p>
    </div>
  )
}

export default function CoreValues() {
  const { section } = useContent()
  const coreValues = section('about.values').values || fb
  const [ref, inView] = useInView(0.15)

  return (
    <section className={styles.section} aria-labelledby="values-heading">
      <div className="container">
        <div className={`${styles.header} fade-in-up ${inView ? 'is-visible' : ''}`}>
          <h2 id="values-heading" className={styles.heading}>
            Our Core Values
          </h2>
        </div>

        <div ref={ref} className={styles.grid}>
          {coreValues.map((value, i) => (
            <ValueCard key={value.id} value={value} index={i} inView={inView} />
          ))}
        </div>
      </div>
    </section>
  )
}