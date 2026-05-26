import { useState } from 'react'
import { Plus, Search, BookOpen, Zap, Upload, TrendingUp } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { QuizCard } from '@/components/dashboard/QuizCard'
import { CreateQuizModal } from '@/components/dashboard/CreateQuizModal'
import { EmptyState } from '@/components/ui/EmptyState'
import { QuizCardSkeleton } from '@/components/ui/Skeleton'
import { useQuizzes } from '@/hooks/useQuizzes'
import { useAuth } from '@/hooks/useAuth'

export function DashboardPage() {
  const { user, isGuest } = useAuth()
  const { quizzes, loading, reload, search, searchQuery, remove } = useQuizzes()
  const [createOpen, setCreateOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  const handleSearch = (v) => {
    setSearchVal(v)
    search(v)
  }

  const handleCreated = (quiz) => {
    reload()
    setCreateOpen(false)
  }

  const displayName = isGuest ? 'Guest' : (user?.user_metadata?.name || user?.email?.split('@')[0] || 'there')

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-slide-down">
          <div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-forge-text">
              Hey, {displayName} 👋
            </h1>
            <p className="text-forge-text-muted font-body text-sm mt-1">
              {quizzes.length > 0
                ? `You have ${quizzes.length} quiz${quizzes.length !== 1 ? 'zes' : ''}`
                : 'Start by uploading a quiz file'
              }
            </p>
          </div>
          <button
            onClick={() => setCreateOpen(true)}
            className="btn-primary flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus size={16} />
            New Quiz
          </button>
        </div>

        {/* Stats row */}
        {quizzes.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 animate-fade-in">
            <StatCard
              icon={BookOpen}
              label="Total Quizzes"
              value={quizzes.length}
              color="text-forge-accent-glow"
              bg="bg-forge-accent/10"
            />
            <StatCard
              icon={Zap}
              label="Total Questions"
              value={quizzes.reduce((acc, q) => acc + (q.question_count || 0), 0)}
              color="text-forge-cyan"
              bg="bg-forge-cyan/10"
            />
            <StatCard
              icon={TrendingUp}
              label="Public Quizzes"
              value={quizzes.filter(q => q.is_public).length}
              color="text-emerald-400"
              bg="bg-emerald-500/10"
              className="col-span-2 sm:col-span-1"
            />
          </div>
        )}

        {/* Search */}
        {quizzes.length > 0 && (
          <div className="relative max-w-md animate-fade-in">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forge-text-dim" />
            <input
              type="text"
              placeholder="Search quizzes..."
              value={searchVal}
              onChange={(e) => handleSearch(e.target.value)}
              className="input-field pl-10 text-sm"
            />
          </div>
        )}

        {/* Quiz grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => <QuizCardSkeleton key={i} />)}
          </div>
        ) : quizzes.length === 0 ? (
          <EmptyState
            icon={Upload}
            title="No quizzes yet"
            description="Upload a .txt file to create your first quiz. It only takes a few seconds!"
            action={
              <button onClick={() => setCreateOpen(true)} className="btn-primary flex items-center gap-2">
                <Plus size={15} />
                Upload Quiz File
              </button>
            }
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map(quiz => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onDelete={remove}
              />
            ))}
          </div>
        )}

        {searchVal && quizzes.length === 0 && !loading && (
          <EmptyState
            icon={Search}
            title="No results"
            description={`No quizzes match "${searchVal}"`}
          />
        )}
      </main>

      <CreateQuizModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color, bg, className = '' }) {
  return (
    <div className={`card p-4 flex items-center gap-3 ${className}`}>
      <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
        <Icon size={18} className={color} />
      </div>
      <div>
        <p className="font-display font-bold text-xl text-forge-text">{value}</p>
        <p className="text-xs text-forge-text-dim font-body">{label}</p>
      </div>
    </div>
  )
}
