import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react'
import { fetchQuiz } from '@/services/quizService'
import { QuizPlayer } from '@/components/quiz/QuizPlayer'
import { Navbar } from '@/components/layout/Navbar'
import { useAuth } from '@/hooks/useAuth'

export function QuizPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const [quiz, setQuiz] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      const { data, error: err } = await fetchQuiz(id)
      if (err || !data) {
        setError('Quiz not found or access denied.')
      } else {
        setQuiz(data)
      }
      setLoading(false)
    }
    if (id) load()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={32} className="animate-spin text-forge-accent mx-auto mb-4" />
          <p className="text-forge-text-muted font-body">Loading quiz...</p>
        </div>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-md mx-auto px-4 py-20 text-center">
          <div className="w-16 h-16 rounded-2xl bg-forge-rose/10 border border-forge-rose/20 flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={24} className="text-forge-rose" />
          </div>
          <h2 className="font-display font-bold text-xl text-forge-text mb-2">Quiz Not Found</h2>
          <p className="text-forge-text-muted font-body text-sm mb-6">{error}</p>
          <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
            <ArrowLeft size={15} />
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <QuizPlayer quiz={quiz} />
    </div>
  )
}
