import { useState, useEffect, useCallback } from 'react'
import { shuffleArray } from '@/utils/parser'
import { saveAttempt } from '@/services/quizService'
import { useAuth } from '@/hooks/useAuth'
import { useTimer } from '@/hooks/useTimer'
import { QuizQuestion } from './QuizQuestion'
import { QuizResults } from './QuizResults'
import { Timer, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function QuizPlayer({ quiz }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const timer = useTimer()

  const [questions, setQuestions] = useState([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState([]) // { questionId, selected, correct }
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [phase, setPhase] = useState('intro') // intro | playing | results
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    if (quiz?.questions) {
      const shuffled = shuffleArray(quiz.questions).map(q => ({
        ...q,
        shuffledAnswers: shuffleArray([q.correct_answer, ...q.incorrect_answers])
      }))
      setQuestions(shuffled)
    }
  }, [quiz])

  const startQuiz = () => {
    setCurrentIdx(0)
    setAnswers([])
    setSelected(null)
    setRevealed(false)
    setPhase('playing')
    timer.restart()
  }

  const handleSelect = (answer) => {
    if (revealed) return
    setSelected(answer)
    setRevealed(true)
  }

  const handleNext = useCallback(() => {
    if (!revealed) return

    const current = questions[currentIdx]
    const isCorrect = selected === current.correct_answer

    const newAnswers = [
      ...answers,
      {
        questionId: current.id,
        question: current.question,
        selected,
        correct: current.correct_answer,
        isCorrect,
      }
    ]
    setAnswers(newAnswers)

    if (currentIdx + 1 >= questions.length) {
      // Quiz complete
      timer.pause()
      setPhase('results')

      // Save attempt
      const score = newAnswers.filter(a => a.isCorrect).length
      saveAttempt({
        quiz_id: quiz.id,
        score,
        total: questions.length,
        time_taken: timer.seconds,
        answers: newAnswers,
      }, user?.id)
    } else {
      setTransitioning(true)
      setTimeout(() => {
        setCurrentIdx(i => i + 1)
        setSelected(null)
        setRevealed(false)
        setTransitioning(false)
      }, 200)
    }
  }, [revealed, questions, currentIdx, selected, answers, timer, quiz, user])

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      if (phase !== 'playing') return
      if (e.key === 'Enter' && revealed) handleNext()
      if (e.key === '1') handleSelect(questions[currentIdx]?.shuffledAnswers[0])
      if (e.key === '2') handleSelect(questions[currentIdx]?.shuffledAnswers[1])
      if (e.key === '3') handleSelect(questions[currentIdx]?.shuffledAnswers[2])
      if (e.key === '4') handleSelect(questions[currentIdx]?.shuffledAnswers[3])
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [phase, revealed, handleNext, questions, currentIdx])

  if (!quiz) return null

  return (
    <div className="min-h-screen bg-forge-bg">
      {/* Intro */}
      {phase === 'intro' && (
        <div className="max-w-xl mx-auto px-4 py-20 text-center animate-slide-up">
          <div className="w-20 h-20 rounded-3xl bg-forge-accent/20 border border-forge-accent/30 flex items-center justify-center mx-auto mb-6 shadow-glow">
            <span className="text-3xl font-display font-black text-gradient">{quiz.question_count || questions.length}</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-forge-text mb-3">
            {quiz.title}
          </h1>
          {quiz.description && (
            <p className="text-forge-text-muted font-body mb-8">{quiz.description}</p>
          )}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-forge-text-muted font-body mb-10">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-forge-accent" />
              {questions.length} questions
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-forge-cyan" />
              Randomized order
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-forge-emerald" />
              Instant feedback
            </span>
          </div>
          <button onClick={startQuiz} className="btn-primary text-lg px-10 py-4">
            Start Quiz
          </button>
          <p className="mt-4 text-xs text-forge-text-dim font-body">
            Use keyboard: 1–4 to select, Enter to continue
          </p>
        </div>
      )}

      {/* Playing */}
      {phase === 'playing' && questions.length > 0 && (
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Header bar */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2 text-forge-text-muted font-body text-sm">
              <Timer size={14} />
              <span className="font-mono">{timer.formatted}</span>
            </div>
            <div className="text-sm font-display text-forge-text-muted">
              <span className="text-forge-text font-semibold">{currentIdx + 1}</span>
              <span className="mx-1">/</span>
              {questions.length}
            </div>
            <button
              onClick={() => { timer.pause(); setPhase('intro') }}
              className="text-forge-text-dim hover:text-forge-text p-1.5 rounded-lg hover:bg-forge-muted/50 transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Progress */}
          <div className="progress-bar mb-8">
            <div
              className="progress-fill"
              style={{ width: `${((currentIdx) / questions.length) * 100}%` }}
            />
          </div>

          {/* Question */}
          <div className={`transition-opacity duration-200 ${transitioning ? 'opacity-0' : 'opacity-100'}`}>
            <QuizQuestion
              question={questions[currentIdx]}
              selected={selected}
              revealed={revealed}
              onSelect={handleSelect}
              onNext={handleNext}
              questionNumber={currentIdx + 1}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {phase === 'results' && (
        <QuizResults
          quiz={quiz}
          answers={answers}
          timeTaken={timer.seconds}
          timeFormatted={timer.formatted}
          onRetry={startQuiz}
          onBack={() => navigate('/dashboard')}
        />
      )}
    </div>
  )
}
