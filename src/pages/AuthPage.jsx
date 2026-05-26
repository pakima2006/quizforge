import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, User, AlertCircle, ArrowRight } from 'lucide-react'
import { signIn, signUp } from '@/services/authService'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { isSupabaseEnabled } from '@/lib/supabase'
import toast from 'react-hot-toast'

export function AuthPage() {
  const navigate = useNavigate()
  const { loginAsGuest } = useAuth()
  const [mode, setMode] = useState('login') // login | signup
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (mode === 'signup') {
      if (form.password.length < 6) {
        setError('Password must be at least 6 characters')
        setLoading(false)
        return
      }
      const { error: err } = await signUp(form.email, form.password, form.name)
      if (err) {
        setError(err.message)
      } else {
        toast.success('Account created! Check your email to confirm.')
        setMode('login')
      }
    } else {
      const { error: err } = await signIn(form.email, form.password)
      if (err) {
        setError(err.message)
      } else {
        toast.success('Welcome back!')
        navigate('/dashboard')
      }
    }
    setLoading(false)
  }

  const handleGuest = () => {
    loginAsGuest()
    navigate('/dashboard')
    toast('Continuing as guest — quizzes saved locally', { icon: '👤' })
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-forge-accent/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-forge-cyan/4 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-forge-accent flex items-center justify-center mx-auto mb-4 shadow-glow">
            <Zap size={24} className="text-white" />
          </div>
          <h1 className="font-display font-black text-2xl text-forge-text">
            Quiz<span className="text-gradient">Forge</span>
          </h1>
          <p className="text-sm text-forge-text-muted font-body mt-1">Upload. Parse. Quiz.</p>
        </div>

        {/* Card */}
        <div className="card p-7 space-y-5">
          {/* Tabs */}
          <div className="flex gap-1 bg-forge-surface rounded-xl p-1">
            {['login', 'signup'].map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); setError('') }}
                className={`flex-1 py-2 rounded-lg text-sm font-display font-medium transition-all duration-200
                  ${mode === m ? 'bg-forge-card text-forge-text shadow-sm' : 'text-forge-text-muted hover:text-forge-text'}`}
              >
                {m === 'login' ? 'Sign In' : 'Register'}
              </button>
            ))}
          </div>

          {!isSupabaseEnabled && (
            <div className="flex gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-400 font-body">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>Supabase not configured. Use guest mode to try locally.</span>
            </div>
          )}

          {error && (
            <div className="flex gap-2 p-3 bg-forge-rose/10 border border-forge-rose/20 rounded-xl text-sm text-forge-rose font-body animate-slide-down">
              <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <Input
                label="Name"
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                icon={User}
                required
              />
            )}
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              icon={Mail}
              required
            />
            <Input
              label="Password"
              type="password"
              placeholder={mode === 'signup' ? 'At least 6 characters' : '••••••••'}
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              icon={Lock}
              required
            />
            <Button
              type="submit"
              loading={loading}
              disabled={!isSupabaseEnabled}
              className="w-full mt-2"
            >
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-forge-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-forge-card text-forge-text-dim font-body">or</span>
            </div>
          </div>

          <button
            onClick={handleGuest}
            className="w-full flex items-center justify-center gap-2 btn-secondary text-sm"
          >
            Continue as Guest
            <ArrowRight size={14} />
          </button>
        </div>

        <p className="text-center text-xs text-forge-text-dim font-body mt-5">
          Guest mode saves quizzes to your browser only.
        </p>
      </div>
    </div>
  )
}
