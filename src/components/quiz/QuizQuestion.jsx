import { CheckCircle2, XCircle, ArrowRight } from 'lucide-react'

const KEYS = ['1', '2', '3', '4']

export function QuizQuestion({ question, selected, revealed, onSelect, onNext, questionNumber }) {
  if (!question) return null

  return (
    <div className="animate-slide-up">
      {/* Question */}
      <div className="mb-8">
        <p className="text-xs font-display font-semibold text-forge-text-dim uppercase tracking-wider mb-3">
          Question {questionNumber}
        </p>
        <h2 className="font-display font-bold text-xl sm:text-2xl text-forge-text leading-snug">
          {question.question}
        </h2>
      </div>

      {/* Answers */}
      <div className="space-y-3 mb-8">
        {question.shuffledAnswers?.map((answer, i) => {
          const isSelected = selected === answer
          const isCorrect = answer === question.correct_answer
          const isWrong = revealed && isSelected && !isCorrect

          let stateClass = 'border-forge-border bg-forge-card hover:border-forge-accent/30 hover:bg-forge-card cursor-pointer'

          if (revealed) {
            if (isCorrect) {
              stateClass = 'border-emerald-500/50 bg-emerald-500/10 cursor-default'
            } else if (isWrong) {
              stateClass = 'border-forge-rose/50 bg-forge-rose/10 cursor-default'
            } else {
              stateClass = 'border-forge-border bg-forge-card opacity-50 cursor-default'
            }
          } else {
            stateClass = 'border-forge-border bg-forge-card hover:border-forge-accent/40 hover:bg-forge-muted/30 cursor-pointer active:scale-[0.99]'
          }

          return (
            <button
              key={answer}
              onClick={() => onSelect(answer)}
              disabled={revealed}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-3 group ${stateClass}`}
            >
              <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-display font-bold flex-shrink-0 transition-colors
                ${revealed && isCorrect ? 'bg-emerald-500/20 text-emerald-400' :
                  revealed && isWrong ? 'bg-forge-rose/20 text-forge-rose' :
                  'bg-forge-muted/60 text-forge-text-dim group-hover:bg-forge-accent/20 group-hover:text-forge-accent-glow'
                }`}>
                {KEYS[i]}
              </span>

              <span className={`flex-1 font-body text-sm sm:text-base ${
                revealed && isCorrect ? 'text-emerald-400' :
                revealed && isWrong ? 'text-forge-rose' :
                'text-forge-text'
              }`}>
                {answer}
              </span>

              {revealed && isCorrect && <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />}
              {revealed && isWrong && <XCircle size={18} className="text-forge-rose flex-shrink-0" />}
            </button>
          )
        })}
      </div>

      {/* Feedback + Next */}
      {revealed && (
        <div className="animate-slide-up space-y-4">
          <div className={`p-4 rounded-xl border ${
            selected === question.correct_answer
              ? 'bg-emerald-500/10 border-emerald-500/20'
              : 'bg-forge-rose/10 border-forge-rose/20'
          }`}>
            <p className={`font-display font-semibold text-sm ${
              selected === question.correct_answer ? 'text-emerald-400' : 'text-forge-rose'
            }`}>
              {selected === question.correct_answer ? '🎉 Correct!' : '❌ Incorrect'}
            </p>
            {selected !== question.correct_answer && (
              <p className="text-sm font-body text-forge-text-muted mt-1">
                Correct answer: <span className="text-emerald-400 font-medium">{question.correct_answer}</span>
              </p>
            )}
          </div>

          <button
            onClick={onNext}
            className="btn-primary w-full flex items-center justify-center gap-2"
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
