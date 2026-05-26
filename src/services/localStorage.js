const KEYS = {
  QUIZZES: 'quizforge_quizzes',
  USER: 'quizforge_guest_user',
  ATTEMPTS: 'quizforge_attempts',
}

function getItem(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

// Quizzes
export function getLocalQuizzes() {
  return getItem(KEYS.QUIZZES) || []
}

export function saveLocalQuiz(quiz) {
  const quizzes = getLocalQuizzes()
  const existing = quizzes.findIndex(q => q.id === quiz.id)
  if (existing >= 0) {
    quizzes[existing] = { ...quiz, updated_at: new Date().toISOString() }
  } else {
    quizzes.unshift({ ...quiz, created_at: new Date().toISOString() })
  }
  setItem(KEYS.QUIZZES, quizzes)
  return quiz
}

export function deleteLocalQuiz(id) {
  const quizzes = getLocalQuizzes().filter(q => q.id !== id)
  setItem(KEYS.QUIZZES, quizzes)
}

export function getLocalQuiz(id) {
  return getLocalQuizzes().find(q => q.id === id) || null
}

// Attempts
export function getLocalAttempts() {
  return getItem(KEYS.ATTEMPTS) || []
}

export function saveLocalAttempt(attempt) {
  const attempts = getLocalAttempts()
  attempts.unshift({ ...attempt, id: crypto.randomUUID(), created_at: new Date().toISOString() })
  // Keep only last 100
  setItem(KEYS.ATTEMPTS, attempts.slice(0, 100))
  return attempt
}

export function getLocalAttemptsByQuiz(quizId) {
  return getLocalAttempts().filter(a => a.quiz_id === quizId)
}

// Guest user
export function getGuestUser() {
  let user = getItem(KEYS.USER)
  if (!user) {
    user = {
      id: `guest_${crypto.randomUUID()}`,
      email: 'guest@local',
      name: 'Guest User',
      isGuest: true,
    }
    setItem(KEYS.USER, user)
  }
  return user
}
