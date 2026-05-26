import { useState, useRef, useCallback } from 'react'
import { Upload, FileText, AlertTriangle, CheckCircle2, X, Eye, ChevronDown, ChevronUp } from 'lucide-react'
import { parseQuizFile, EXAMPLE_QUIZ_TEXT } from '@/utils/parser'
import { Button } from '@/components/ui/Button'

export function FileUploader({ onParsed }) {
  const [dragging, setDragging] = useState(false)
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const inputRef = useRef(null)

  const processFile = useCallback(async (f) => {
    if (!f) return
    if (!f.name.endsWith('.txt')) {
      setResult({ errors: ['Only .txt files are supported.'], questions: [] })
      return
    }
    setFile(f)
    setLoading(true)
    const text = await f.text()
    const parsed = parseQuizFile(text)
    setResult(parsed)
    setLoading(false)
    if (parsed.questions.length > 0) {
      onParsed?.(parsed.questions, f.name.replace('.txt', ''))
    }
  }, [onParsed])

  const onDrop = useCallback((e) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) processFile(f)
  }, [processFile])

  const onFileChange = (e) => {
    const f = e.target.files[0]
    if (f) processFile(f)
  }

  const loadExample = async () => {
    const blob = new Blob([EXAMPLE_QUIZ_TEXT], { type: 'text/plain' })
    const f = new File([blob], 'example-quiz.txt', { type: 'text/plain' })
    processFile(f)
  }

  const reset = () => {
    setFile(null)
    setResult(null)
    setShowPreview(false)
    if (inputRef.current) inputRef.current.value = ''
    onParsed?.(null, null)
  }

  const hasErrors = result?.errors?.length > 0
  const hasQuestions = result?.questions?.length > 0

  return (
    <div className="space-y-4">
      {/* Drop zone */}
      {!file && (
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300
            ${dragging
              ? 'border-forge-accent bg-forge-accent/10 scale-[1.01]'
              : 'border-forge-border hover:border-forge-accent/40 hover:bg-forge-accent/5'
            }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".txt"
            className="hidden"
            onChange={onFileChange}
          />
          <div className={`w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center transition-colors
            ${dragging ? 'bg-forge-accent/20' : 'bg-forge-muted/50'}`}>
            <Upload size={24} className={dragging ? 'text-forge-accent-glow' : 'text-forge-text-dim'} />
          </div>
          <p className="font-display font-semibold text-forge-text mb-1">
            {dragging ? 'Drop it!' : 'Drop your .txt file here'}
          </p>
          <p className="text-sm text-forge-text-muted font-body">or click to browse</p>
          <p className="text-xs text-forge-text-dim font-mono mt-3">Only .txt files supported</p>
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="card p-6 text-center animate-pulse">
          <div className="w-10 h-10 rounded-full border-2 border-forge-accent border-t-transparent animate-spin mx-auto mb-3" />
          <p className="text-sm text-forge-text-muted font-body">Parsing your quiz file...</p>
        </div>
      )}

      {/* Result */}
      {result && !loading && (
        <div className="space-y-3 animate-slide-up">
          {/* File info */}
          <div className="card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forge-accent/15 border border-forge-accent/20 flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-forge-accent-glow" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-medium text-forge-text text-sm truncate">{file?.name}</p>
              <p className="text-xs text-forge-text-dim font-body">
                {(file?.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button onClick={reset} className="text-forge-text-dim hover:text-forge-text p-1.5 rounded-lg hover:bg-forge-muted/50 transition-colors">
              <X size={15} />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className={`card p-4 flex items-center gap-3 ${hasQuestions ? 'border-emerald-500/20' : ''}`}>
              <CheckCircle2 size={18} className="text-emerald-400 flex-shrink-0" />
              <div>
                <p className="font-display font-bold text-lg text-forge-text">{result.questions.length}</p>
                <p className="text-xs text-forge-text-dim font-body">Questions parsed</p>
              </div>
            </div>
            <div className={`card p-4 flex items-center gap-3 ${hasErrors ? 'border-forge-rose/20' : ''}`}>
              <AlertTriangle size={18} className={hasErrors ? 'text-forge-rose flex-shrink-0' : 'text-forge-text-dim flex-shrink-0'} />
              <div>
                <p className={`font-display font-bold text-lg ${hasErrors ? 'text-forge-rose' : 'text-forge-text'}`}>
                  {result.errors.length}
                </p>
                <p className="text-xs text-forge-text-dim font-body">Parse errors</p>
              </div>
            </div>
          </div>

          {/* Errors */}
          {hasErrors && (
            <div className="bg-forge-rose/5 border border-forge-rose/20 rounded-xl p-4 space-y-2">
              <p className="text-xs font-display font-semibold text-forge-rose uppercase tracking-wider">Parse Errors</p>
              {result.errors.map((err, i) => (
                <p key={i} className="text-sm text-forge-rose/80 font-body flex gap-2">
                  <span className="font-mono text-forge-rose/50 flex-shrink-0">{i + 1}.</span>
                  {err}
                </p>
              ))}
            </div>
          )}

          {/* Preview toggle */}
          {hasQuestions && (
            <button
              onClick={() => setShowPreview(v => !v)}
              className="w-full flex items-center justify-between px-4 py-3 bg-forge-surface border border-forge-border rounded-xl text-sm text-forge-text-muted hover:text-forge-text hover:border-forge-accent/30 transition-all font-body"
            >
              <span className="flex items-center gap-2">
                <Eye size={14} />
                Preview parsed questions
              </span>
              {showPreview ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}

          {showPreview && hasQuestions && (
            <div className="bg-forge-surface border border-forge-border rounded-xl divide-y divide-forge-border overflow-hidden animate-slide-down">
              {result.questions.slice(0, 5).map((q, i) => (
                <div key={q.id} className="p-4">
                  <p className="text-sm font-display font-medium text-forge-text mb-2">
                    <span className="text-forge-text-dim mr-2">{i + 1}.</span>
                    {q.question}
                  </p>
                  <div className="space-y-1">
                    <p className="text-xs font-body text-emerald-400 flex gap-1.5">
                      <span className="text-emerald-500/50">✓</span> {q.correct_answer}
                    </p>
                    {q.incorrect_answers.map((a, j) => (
                      <p key={j} className="text-xs font-body text-forge-text-dim flex gap-1.5">
                        <span className="text-forge-text-dim/40">✗</span> {a}
                      </p>
                    ))}
                  </div>
                </div>
              ))}
              {result.questions.length > 5 && (
                <div className="p-3 text-center text-xs text-forge-text-dim font-body">
                  +{result.questions.length - 5} more questions
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Example button */}
      {!file && (
        <button
          onClick={loadExample}
          className="w-full text-center text-xs text-forge-text-dim hover:text-forge-accent-glow transition-colors font-body py-2"
        >
          Or try with an example quiz →
        </button>
      )}
    </div>
  )
}
