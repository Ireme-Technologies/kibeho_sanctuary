import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '@context/AuthContext'
import PageLoader from '@components/ui/PageLoader'

export default function ClientProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader />
  if (!user || user.role !== 'client') {
    return <Navigate to="/client/login" replace state={{ from: location }} />
  }
  return <Outlet />
}
