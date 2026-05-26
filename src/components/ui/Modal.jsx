import { useEffect } from 'react'
import { X } from 'lucide-react'

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose?.() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!isOpen) return null

  const sizes = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose?.() }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in" />
      <div className={`relative w-full ${sizes[size]} bg-forge-card border border-forge-border rounded-2xl shadow-2xl animate-scale-in overflow-hidden`}>
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-forge-border">
            <h2 className="font-display font-semibold text-lg text-forge-text">{title}</h2>
            <button
              onClick={onClose}
              className="text-forge-text-dim hover:text-forge-text transition-colors p-1 rounded-lg hover:bg-forge-muted/50"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-6">{children}</div>
      </div>
    </div>
  )
}
