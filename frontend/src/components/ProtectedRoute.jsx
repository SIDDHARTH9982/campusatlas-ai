import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LoadingScreen } from './ui'

export const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) return <LoadingScreen />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (roles.length > 0 && !roles.includes(user.role)) {
    if (user.role === 'superadmin') return <Navigate to="/superadmin" replace />
    if (user.role === 'institutionAdmin') return <Navigate to="/admin" replace />
    return <Navigate to="/dashboard" replace />
  }
  return children
}

export const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (user) {
    if (user.role === 'superadmin') return <Navigate to="/superadmin" replace />
    if (user.role === 'institutionAdmin') return <Navigate to="/admin" replace />
    return <Navigate to="/dashboard" replace />
  }
  return children
}
