import { supabase, isSupabaseEnabled } from '@/lib/supabase'
import { getGuestUser } from './localStorage'

export async function signUp(email, password, name) {
  if (!isSupabaseEnabled) {
    return { data: null, error: { message: 'Supabase not configured. Using guest mode.' } }
  }
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })
  return { data, error }
}

export async function signIn(email, password) {
  if (!isSupabaseEnabled) {
    return { data: null, error: { message: 'Supabase not configured. Using guest mode.' } }
  }
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  if (!isSupabaseEnabled) return { error: null }
  return await supabase.auth.signOut()
}

export async function getSession() {
  if (!isSupabaseEnabled) return { session: null, user: getGuestUser() }
  const { data: { session } } = await supabase.auth.getSession()
  return { session, user: session?.user || null }
}

export function onAuthChange(callback) {
  if (!isSupabaseEnabled) {
    // Immediately call with guest user
    callback('SIGNED_IN', { user: getGuestUser() })
    return () => {}
  }
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session)
  })
  return () => subscription.unsubscribe()
}
