import { Link } from 'react-router-dom'
import { useLocale } from '@context/LocaleContext'

export default function NotFoundPage() {
  const { t } = useLocale()

  return (
    <div
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
        textAlign: 'center',
        padding: '2rem',
      }}
    >
      <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-navy)', fontSize: '3rem' }}>
        404
      </h1>
      <p>{t('notFound')}</p>
      <Link to="/" style={{ color: 'var(--color-sky)', fontWeight: 700 }}>
        {t('backHome')}
      </Link>
    </div>
  )
}
