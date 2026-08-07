import { Link } from 'react-router-dom'
import { aboutIntro } from '@data/home/sanctuaryHome'
import styles from './HomeAbout.module.css'

export default function HomeAbout() {
  const data = aboutIntro

  return (
    <section className={styles.section}>
      <div className={`container ${styles.layout}`}>
        <div className={styles.copy}>
          <p className={styles.eyebrow}>{data.eyebrow}</p>
          <h2 className={styles.heading}>{data.heading}</h2>
          <p className={styles.text}>{data.text}</p>
          <Link to={data.cta.path} className={styles.btn}>
            {data.cta.label}
          </Link>
        </div>
        <div className={styles.cards}>
          {data.cards.map((card) => (
            <Link key={card.id} to={card.path} className={styles.card}>
              <img src={card.image} alt="" className={styles.cardImg} />
              <span className={styles.cardTitle}>{card.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
