import { Link } from 'react-router-dom'
import { Play, Share2, Pencil, Trash2, Clock, HelpCircle, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'

function formatDate(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function QuizCard({ quiz, onDelete, onEdit }) {
  const shareUrl = `${window.location.origin}/quiz/${quiz.id}`

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      toast.success('Quiz link copied!')
    } catch {
      toast.error('Could not copy link')
    }
  }

  const count = quiz.question_count || quiz.questions?.length || 0

  return (
    <div className="card p-5 flex flex-col gap-4 animate-fade-in group hover:border-forge-accent/20 transition-all duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-forge-text text-base leading-snug line-clamp-2 mb-1">
            {quiz.title}
          </h3>
          {quiz.description && (
            <p className="text-sm text-forge-text-muted font-body line-clamp-1">{quiz.description}</p>
          )}
        </div>
        {quiz.is_public && (
          <span className="badge badge-emerald flex-shrink-0">Public</span>
        )}
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-forge-text-dim font-body">
        <span className="flex items-center gap-1.5">
          <HelpCircle size={12} />
          {count} {count === 1 ? 'question' : 'questions'}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={12} />
          {formatDate(quiz.created_at)}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1">
        <Link
          to={`/quiz/${quiz.id}`}
          className="flex-1 btn-primary text-sm py-2 px-4 text-center flex items-center justify-center gap-1.5"
        >
          <Play size={13} />
          Start Quiz
        </Link>
        <button
          onClick={handleShare}
          className="p-2 rounded-xl bg-forge-surface border border-forge-border text-forge-text-muted hover:text-forge-text hover:border-forge-accent/30 transition-all"
          title="Copy link"
        >
          <Share2 size={14} />
        </button>
        {onEdit && (
          <button
            onClick={() => onEdit(quiz)}
            className="p-2 rounded-xl bg-forge-surface border border-forge-border text-forge-text-muted hover:text-forge-text hover:border-forge-accent/30 transition-all"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(quiz.id)}
            className="p-2 rounded-xl bg-forge-surface border border-forge-border text-forge-text-dim hover:text-forge-rose hover:border-forge-rose/30 hover:bg-forge-rose/5 transition-all"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
