import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
}

const sizes = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3',
  lg: 'px-8 py-4 text-lg',
}

export const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  icon: Icon,
  iconRight,
  ...props
}, ref) => {
  const base = variants[variant] || variants.primary
  const sizeClass = variant === 'ghost' ? '' : sizes[size]

  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 ${base} ${sizeClass} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : Icon ? (
        <Icon size={16} />
      ) : null}
      {children}
      {iconRight && !loading && <iconRight.type size={16} />}
    </button>
  )
})

Button.displayName = 'Button'
