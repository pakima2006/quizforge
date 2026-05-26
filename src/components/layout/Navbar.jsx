import { Link, useNavigate, useLocation } from 'react-router-dom'
import { LogOut, LayoutDashboard, Zap, User, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export function Navbar() {
  const { user, signOut, isGuest } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
    toast.success('Signed out successfully')
  }

  const isActive = (path) => location.pathname === path

  return (
    <nav className="sticky top-0 z-40 border-b border-forge-border glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-forge-accent flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow">
            <Zap size={16} className="text-white" />
          </div>
          <span className="font-display font-bold text-lg text-forge-text">
            Quiz<span className="text-gradient">Forge</span>
          </span>
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/dashboard" active={isActive('/dashboard')}>
            <LayoutDashboard size={15} />
            Dashboard
          </NavLink>
        </div>

        {/* User menu */}
        {user && (
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-forge-muted/50 transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-forge-accent/20 border border-forge-accent/30 flex items-center justify-center">
                <User size={13} className="text-forge-accent-glow" />
              </div>
              <span className="hidden sm:block text-sm font-body text-forge-text-muted max-w-[120px] truncate">
                {isGuest ? 'Guest' : (user.user_metadata?.name || user.email?.split('@')[0] || 'User')}
              </span>
              {isGuest && <span className="badge badge-amber hidden sm:flex">Guest</span>}
              <ChevronDown size={13} className={`text-forge-text-dim transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-forge-card border border-forge-border rounded-xl shadow-card-hover overflow-hidden animate-scale-in">
                <div className="px-3 py-3 border-b border-forge-border">
                  <p className="text-xs text-forge-text-dim font-body">Signed in as</p>
                  <p className="text-sm font-body text-forge-text truncate">{isGuest ? 'Guest (local only)' : user.email}</p>
                </div>
                <div className="p-1">
                  {!isGuest && (
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-forge-rose hover:bg-forge-rose/10 rounded-lg transition-colors font-body"
                    >
                      <LogOut size={14} />
                      Sign out
                    </button>
                  )}
                  {isGuest && (
                    <Link
                      to="/auth"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-forge-accent-glow hover:bg-forge-accent/10 rounded-lg transition-colors font-body"
                    >
                      <User size={14} />
                      Sign in / Register
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

function NavLink({ to, active, children }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-body transition-colors
        ${active ? 'bg-forge-accent/15 text-forge-accent-glow' : 'text-forge-text-muted hover:text-forge-text hover:bg-forge-muted/50'}`}
    >
      {children}
    </Link>
  )
}
