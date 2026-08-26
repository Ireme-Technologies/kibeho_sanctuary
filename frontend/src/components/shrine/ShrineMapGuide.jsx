import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchSacredPlaces } from '@api/cms'
import { useContent } from '@context/ContentContext'
import { useLocale } from '@context/LocaleContext'
import styles from './ShrineMapGuide.module.css'

const STATIC_STOPS = [
  {
    id: 'welcome',
    number: 1,
    title: 'Welcome',
    text: 'Begin at pilgrim reception. Groups are asked to make themselves known so liturgy and lodging can be prepared.',
    path: '/shrine/welcome',
    image: '/images/sanctuary/welcome.jpg',
    area: 'arrival',
  },
  {
    id: 'churches',
    number: 2,
    title: 'Churches and chapels',
    text: 'The Church of Our Lady of Sorrows, the Chapel of the Apparitions, and the chapel of adoration.',
    path: '/shrine/churches',
    image: '/images/sanctuary/church.jpg',
    area: 'liturgy',
  },
  {
    id: 'sites',
    number: 3,
    title: 'Apparition sites',
    text: 'The place and esplanade remembered for the apparitions of the Mother of the Word.',
    path: '/shrine/apparition-sites',
    image: '/images/sanctuary/mary.jpg',
    area: 'memory',
  },
  {
    id: 'spring',
    number: 4,
    title: 'Holy Spring',
    text: 'The source of Mary — come in faith, as a sign of grace and interior trust.',
    path: '/shrine/holy-spring',
    image: '/images/sanctuary/activity-spring.jpg',
    area: 'spring',
  },
  {
    id: 'cross',
    number: 5,
    title: 'Way of the Cross',
    text: 'Walk the Stations with Christ, in the company of Our Lady of Sorrows.',
    path: '/shrine/way-of-the-cross',
    image: '/images/sanctuary/activity-rock.jpg',
    area: 'path',
  },
  {
    id: 'adoration',
    number: 6,
    title: 'Eucharistic Adoration',
    text: 'Remain in silent prayer before the Blessed Sacrament.',
    path: '/shrine/eucharistic-adorations',
    image: '/images/sanctuary/crest.jpg',
    area: 'silence',
  },
]

function placePath(place) {
  if (place.path) return place.path
  const base = place.type === 'church' ? '/shrine/churches' : '/shrine/apparition-sites'
  return `${base}/${place.slug}`
}

export default function ShrineMapGuide() {
  const { defaultHeaderImage } = useContent()
  const { locale, t } = useLocale()
  const [places, setPlaces] = useState([])

  useEffect(() => {
    fetchSacredPlaces({ locale })
      .then(setPlaces)
      .catch(() => setPlaces([]))
  }, [locale])

  const directory = useMemo(
    () =>
      (places || []).map((place) => ({
        id: place.slug || place.id,
        title: place.name || place.title,
        text: place.shortDescription || '',
        path: placePath(place),
        kind: place.type === 'church' ? t('map.church') : t('map.site'),
      })),
    [places, t],
  )

  return (
    <div className={styles.wrap}>
      <div className={styles.plan} aria-hidden="true">
        <p className={styles.planLabel}>{t('map.grounds')}</p>
        <div className={styles.hill}>
          {STATIC_STOPS.map((stop) => (
            <Link key={stop.id} to={stop.path} className={`${styles.pin} ${styles[stop.area]}`}>
              <span>{stop.number}</span>
              {stop.title}
            </Link>
          ))}
        </div>
      </div>

      <ol className={styles.stops}>
        {STATIC_STOPS.map((stop) => (
          <li key={stop.id}>
            <Link to={stop.path} className={styles.stop}>
              <img src={stop.image || defaultHeaderImage} alt="" />
              <div>
                <span className={styles.num}>{stop.number}</span>
                <h3>{stop.title}</h3>
                <p>{stop.text}</p>
              </div>
            </Link>
          </li>
        ))}
      </ol>

      {directory.length ? (
        <div className={styles.directory}>
          <h3>{t('map.placesList')}</h3>
          <ul>
            {directory.map((place) => (
              <li key={place.id}>
                <Link to={place.path}>
                  <em>{place.kind}</em>
                  <strong>{place.title}</strong>
                  {place.text ? <span>{place.text}</span> : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className={styles.note}>{t('map.askOffice')}</p>
    </div>
  )
}
