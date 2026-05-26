import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-forge-accent" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return children
}
