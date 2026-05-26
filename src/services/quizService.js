import { supabase, isSupabaseEnabled } from '@/lib/supabase'
import * as local from './localStorage'

// ── Quizzes ──────────────────────────────────────────────────────────────────

export async function fetchQuizzes(userId) {
  if (!isSupabaseEnabled) {
    return { data: local.getLocalQuizzes(), error: null }
  }
  const { data, error } = await supabase
    .from('quizzes')
    .select('*, questions(count)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

export async function fetchQuiz(id) {
  if (!isSupabaseEnabled) {
    return { data: local.getLocalQuiz(id), error: null }
  }
  const { data, error } = await supabase
    .from('quizzes')
    .select('*, questions(*)')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function fetchPublicQuiz(id) {
  if (!isSupabaseEnabled) {
    return { data: local.getLocalQuiz(id), error: null }
  }
  const { data, error } = await supabase
    .from('quizzes')
    .select('*, questions(*)')
    .eq('id', id)
    .eq('is_public', true)
    .single()
  return { data, error }
}

export async function createQuiz(quiz, questions, userId) {
  if (!isSupabaseEnabled) {
    const full = { ...quiz, questions, user_id: userId || 'guest', question_count: questions.length }
    local.saveLocalQuiz(full)
    return { data: full, error: null }
  }

  const { data: quizData, error: quizError } = await supabase
    .from('quizzes')
    .insert({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description || '',
      user_id: userId,
      question_count: questions.length,
      is_public: quiz.is_public || false,
    })
    .select()
    .single()

  if (quizError) return { data: null, error: quizError }

  const questionRows = questions.map(q => ({
    id: q.id,
    quiz_id: quizData.id,
    question: q.question,
    correct_answer: q.correct_answer,
    incorrect_answers: q.incorrect_answers,
  }))

  const { error: qError } = await supabase.from('questions').insert(questionRows)
  if (qError) return { data: null, error: qError }

  return { data: { ...quizData, questions }, error: null }
}

export async function updateQuiz(id, updates) {
  if (!isSupabaseEnabled) {
    const quiz = local.getLocalQuiz(id)
    if (quiz) local.saveLocalQuiz({ ...quiz, ...updates })
    return { error: null }
  }
  const { error } = await supabase
    .from('quizzes')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  return { error }
}

export async function deleteQuiz(id) {
  if (!isSupabaseEnabled) {
    local.deleteLocalQuiz(id)
    return { error: null }
  }
  const { error } = await supabase.from('quizzes').delete().eq('id', id)
  return { error }
}

export async function searchQuizzes(userId, query) {
  if (!isSupabaseEnabled) {
    const all = local.getLocalQuizzes()
    const q = query.toLowerCase()
    return { data: all.filter(quiz => quiz.title?.toLowerCase().includes(q) || quiz.description?.toLowerCase().includes(q)), error: null }
  }
  const { data, error } = await supabase
    .from('quizzes')
    .select('*')
    .eq('user_id', userId)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('created_at', { ascending: false })
  return { data: data || [], error }
}

// ── Attempts ─────────────────────────────────────────────────────────────────

export async function saveAttempt(attempt, userId) {
  if (!isSupabaseEnabled) {
    local.saveLocalAttempt(attempt)
    return { error: null }
  }
  const { error } = await supabase.from('quiz_attempts').insert({
    quiz_id: attempt.quiz_id,
    user_id: userId,
    score: attempt.score,
    total: attempt.total,
    time_taken: attempt.time_taken,
    answers: attempt.answers,
  })
  return { error }
}

export async function fetchAttempts(quizId, userId) {
  if (!isSupabaseEnabled) {
    return { data: local.getLocalAttemptsByQuiz(quizId), error: null }
  }
  const { data, error } = await supabase
    .from('quiz_attempts')
    .select('*')
    .eq('quiz_id', quizId)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(10)
  return { data: data || [], error }
}
