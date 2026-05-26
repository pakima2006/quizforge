import { CheckCircle2, XCircle, RotateCcw, LayoutDashboard, Clock, Trophy, Target } from 'lucide-react'

function ScoreBadge({ score, total }) {
  const pct = Math.round((score / total) * 100)
  let label, color

  if (pct >= 90) { label = 'Excellent!'; color = 'text-emerald-400' }
  else if (pct >= 70) { label = 'Good job!'; color = 'text-forge-accent-glow' }
  else if (pct >= 50) { label = 'Keep practicing!'; color = 'text-amber-400' }
  else { label = 'Try again!'; color = 'text-forge-rose' }

  return (
    <div className="text-center">
      <div className="relative w-32 h-32 mx-auto mb-4">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(30,30,46,1)" strokeWidth="8" />
          <circle
            cx="50" cy="50" r="40" fill="none"
            stroke={pct >= 90 ? '#10b981' : pct >= 70 ? '#8b5cf6' : pct >= 50 ? '#f59e0b' : '#f43f5e'}
            strokeWidth="8" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 40}`}
            strokeDashoffset={`${2 * Math.PI * 40 * (1 - pct / 100)}`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display font-black text-2xl text-forge-text">{pct}%</span>
        </div>
      </div>
      <p className={`font-display font-bold text-xl ${color}`}>{label}</p>
    </div>
  )
}

export function QuizResults({ quiz, answers, timeTaken, timeFormatted, onRetry, onBack }) {
  const score = answers.filter(a => a.isCorrect).length
  const total = answers.length

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 animate-slide-up">
      {/* Score */}
      <div className="card p-8 text-center mb-6">
        <ScoreBadge score={score} total={total} />

        <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-forge-border">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 mb-1">
              <CheckCircle2 size={14} />
              <span className="font-display font-bold text-lg">{score}</span>
            </div>
            <p className="text-xs text-forge-text-dim font-body">Correct</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-forge-rose mb-1">
              <XCircle size={14} />
              <span className="font-display font-bold text-lg">{total - score}</span>
            </div>
            <p className="text-xs text-forge-text-dim font-body">Incorrect</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 text-forge-cyan mb-1">
              <Clock size={14} />
              <span className="font-display font-bold text-lg font-mono">{timeFormatted}</span>
            </div>
            <p className="text-xs text-forge-text-dim font-body">Time</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <button onClick={onRetry} className="btn-secondary flex items-center justify-center gap-2">
          <RotateCcw size={15} />
          Try Again
        </button>
        <button onClick={onBack} className="btn-primary flex items-center justify-center gap-2">
          <LayoutDashboard size={15} />
          Dashboard
        </button>
      </div>

      {/* Answer review */}
      <div className="space-y-3">
        <h3 className="font-display font-semibold text-forge-text text-sm uppercase tracking-wider">
          Answer Review
        </h3>
        {answers.map((a, i) => (
          <div
            key={a.questionId}
            className={`card p-4 border ${a.isCorrect ? 'border-emerald-500/20' : 'border-forge-rose/20'}`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
                ${a.isCorrect ? 'bg-emerald-500/20' : 'bg-forge-rose/20'}`}>
                {a.isCorrect
                  ? <CheckCircle2 size={13} className="text-emerald-400" />
                  : <XCircle size={13} className="text-forge-rose" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body text-forge-text mb-2">{a.question}</p>
                {!a.isCorrect && (
                  <div className="space-y-1">
                    <p className="text-xs font-body text-forge-rose/80">
                      Your answer: <span className="font-medium">{a.selected}</span>
                    </p>
                    <p className="text-xs font-body text-emerald-400">
                      Correct: <span className="font-medium">{a.correct}</span>
                    </p>
                  </div>
                )}
                {a.isCorrect && (
                  <p className="text-xs font-body text-emerald-400/70">{a.correct}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
