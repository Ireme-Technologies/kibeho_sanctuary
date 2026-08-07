import { Navigate, useParams } from 'react-router-dom'
import ServiceDetailHero from '@sections/services/ServiceDetailHero'
import ServiceDetailContent from '@sections/services/ServiceDetailContent'
import { useContent } from '@context/ContentContext'

export default function ServiceDetailPage() {
  const { services } = useContent()
  const { slug } = useParams()
  const service = services.find((item) => item.slug === slug)

  if (!service) {
    return <Navigate to="/pilgrimage" replace />
  }

  return (
    <>
      <ServiceDetailHero service={service} />
      <ServiceDetailContent service={service} />
    </>
  )
}
