import { useState, useEffect, useCallback } from 'react'
import { fetchQuizzes, deleteQuiz, searchQuizzes } from '@/services/quizService'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export function useQuizzes() {
  const { user } = useAuth()
  const [quizzes, setQuizzes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')

  const load = useCallback(async () => {
    if (!user) return
    setLoading(true)
    setError(null)
    const { data, error: err } = await fetchQuizzes(user.id)
    setQuizzes(data || [])
    setError(err?.message || null)
    setLoading(false)
  }, [user])

  useEffect(() => { load() }, [load])

  const search = useCallback(async (query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      load()
      return
    }
    setLoading(true)
    const { data } = await searchQuizzes(user.id, query)
    setQuizzes(data || [])
    setLoading(false)
  }, [user, load])

  const remove = useCallback(async (id) => {
    const { error: err } = await deleteQuiz(id)
    if (err) {
      toast.error('Failed to delete quiz')
      return false
    }
    setQuizzes(prev => prev.filter(q => q.id !== id))
    toast.success('Quiz deleted')
    return true
  }, [])

  return { quizzes, loading, error, reload: load, search, searchQuery, remove }
}
