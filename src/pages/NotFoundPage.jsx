import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center animate-slide-up">
        <p className="font-display font-black text-8xl text-gradient mb-4">404</p>
        <h1 className="font-display font-bold text-2xl text-forge-text mb-2">Page not found</h1>
        <p className="text-forge-text-muted font-body mb-8">This page doesn't exist or has been moved.</p>
        <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
          <Home size={15} />
          Go Home
        </Link>
      </div>
    </div>
  )
}
