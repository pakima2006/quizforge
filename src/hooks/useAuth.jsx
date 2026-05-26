import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthChange, getSession, signOut as authSignOut } from '@/services/authService'
import { getGuestUser } from '@/services/localStorage'
import { isSupabaseEnabled } from '@/lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isGuest, setIsGuest] = useState(false)

  useEffect(() => {
    if (!isSupabaseEnabled) {
      const guest = getGuestUser()
      setUser(guest)
      setIsGuest(true)
      setLoading(false)
      return
    }

    getSession().then(({ user: u }) => {
      setUser(u)
      setLoading(false)
    })

    const unsub = onAuthChange((event, session) => {
      setUser(session?.user || null)
      setIsGuest(false)
      setLoading(false)
    })

    return unsub
  }, [])

  const signOut = async () => {
    await authSignOut()
    if (!isSupabaseEnabled) {
      // re-create guest
      setUser(getGuestUser())
    }
  }

  const loginAsGuest = () => {
    const guest = getGuestUser()
    setUser(guest)
    setIsGuest(true)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isGuest, signOut, loginAsGuest, isSupabaseEnabled }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
