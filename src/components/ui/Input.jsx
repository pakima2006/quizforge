import { forwardRef } from 'react'

export const Input = forwardRef(({ label, error, hint, icon: Icon, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forge-text-dim pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          className={`input-field ${Icon ? 'pl-10' : ''} ${error ? 'border-forge-rose/50 focus:border-forge-rose/70' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-forge-rose font-body">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-forge-text-dim font-body">{hint}</p>}
    </div>
  )
})

Input.displayName = 'Input'

export const Textarea = forwardRef(({ label, error, hint, className = '', ...props }, ref) => {
  return (
    <div className="w-full">
      {label && <label className="label">{label}</label>}
      <textarea
        ref={ref}
        className={`input-field resize-none ${error ? 'border-forge-rose/50' : ''} ${className}`}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-forge-rose font-body">{error}</p>}
      {hint && !error && <p className="mt-1.5 text-xs text-forge-text-dim font-body">{hint}</p>}
    </div>
  )
})

Textarea.displayName = 'Textarea'
