import { useState } from 'react'
import { FileText, Sparkles } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FileUploader } from './FileUploader'
import { createQuiz } from '@/services/quizService'
import { generateQuizFromQuestions } from '@/utils/parser'
import { useAuth } from '@/hooks/useAuth'
import toast from 'react-hot-toast'

export function CreateQuizModal({ isOpen, onClose, onCreated }) {
  const { user } = useAuth()
  const [step, setStep] = useState('upload') // upload | details
  const [parsedQuestions, setParsedQuestions] = useState(null)
  const [suggestedTitle, setSuggestedTitle] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleParsed = (questions, filename) => {
    setParsedQuestions(questions)
    if (questions && filename) {
      const title = filename
        .replace(/-/g, ' ')
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase())
      setSuggestedTitle(title)
      setTitle(title)
      setStep('details')
    }
  }

  const handleSave = async () => {
    if (!title.trim()) {
      toast.error('Please enter a quiz title')
      return
    }
    if (!parsedQuestions?.length) {
      toast.error('No questions to save')
      return
    }
    setSaving(true)
    const quiz = generateQuizFromQuestions(parsedQuestions, title, description)
    quiz.is_public = isPublic

    const { data, error } = await createQuiz(quiz, parsedQuestions, user?.id)
    setSaving(false)

    if (error) {
      toast.error('Failed to save quiz: ' + error.message)
      return
    }

    toast.success(`Quiz created with ${parsedQuestions.length} questions!`)
    onCreated?.(data)
    handleClose()
  }

  const handleClose = () => {
    setStep('upload')
    setParsedQuestions(null)
    setTitle('')
    setDescription('')
    setIsPublic(false)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 'upload' ? 'Upload Quiz File' : 'Quiz Details'}
      size="md"
    >
      {step === 'upload' && (
        <div className="space-y-4">
          <p className="text-sm text-forge-text-muted font-body leading-relaxed">
            Upload a <code className="font-mono text-xs bg-forge-muted/50 px-1.5 py-0.5 rounded">.txt</code> file with your quiz questions.
            Each question block should have one correct answer (<code className="font-mono text-xs bg-forge-muted/50 px-1.5 py-0.5 rounded">=</code>) and
            one or more wrong answers (<code className="font-mono text-xs bg-forge-muted/50 px-1.5 py-0.5 rounded">-</code>).
          </p>

          {/* Format hint */}
          <div className="bg-forge-surface border border-forge-border rounded-xl p-4">
            <p className="text-xs font-display font-semibold text-forge-text-dim uppercase tracking-wider mb-2">Format</p>
            <pre className="font-mono text-xs text-forge-text-muted leading-relaxed whitespace-pre-wrap">{`What is the capital of France?
= Paris
- London
- Berlin

What is 2 + 2?
= 4
- 3
- 5`}</pre>
          </div>

          <FileUploader onParsed={handleParsed} />
        </div>
      )}

      {step === 'details' && (
        <div className="space-y-5 animate-slide-up">
          <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
            <Sparkles size={16} className="text-emerald-400 flex-shrink-0" />
            <p className="text-sm text-emerald-400 font-body">
              {parsedQuestions.length} questions successfully parsed!
            </p>
          </div>

          <Input
            label="Quiz Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Geography Basics"
            icon={FileText}
          />

          <Input
            label="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of the quiz..."
          />

          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => setIsPublic(v => !v)}
              className={`w-10 h-5.5 rounded-full relative transition-colors duration-200 flex items-center
                ${isPublic ? 'bg-forge-accent' : 'bg-forge-muted'}`}
              style={{ height: '22px', minWidth: '40px' }}
            >
              <div className={`w-4 h-4 rounded-full bg-white shadow-md absolute transition-all duration-200 ${isPublic ? 'left-5' : 'left-1'}`} />
            </div>
            <span className="text-sm font-body text-forge-text-muted group-hover:text-forge-text transition-colors">
              Make quiz public (shareable link)
            </span>
          </label>

          <div className="flex gap-3 pt-1">
            <Button variant="secondary" onClick={() => setStep('upload')} className="flex-1">
              Back
            </Button>
            <Button onClick={handleSave} loading={saving} className="flex-1">
              Save Quiz
            </Button>
          </div>
        </div>
      )}
    </Modal>
  )
}
