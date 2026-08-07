import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import PageLoader from '@components/ui/PageLoader'

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location }} />
  if (user.role === 'client') return <Navigate to="/client" replace />
  return children
}
