import React from 'react'
import { cn } from '../../utils'

// ── Loading Spinner ───────────────────────────────────────────────
interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const spinnerSize = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' }

export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', className }) => (
  <svg
    className={cn('animate-spin text-primary-700', spinnerSize[size], className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
    role="img"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
)

// ── Page Loader ───────────────────────────────────────────────────
export const PageLoader: React.FC<{ label?: string }> = ({ label = 'Loading…' }) => (
  <div className="flex flex-col items-center justify-center min-h-[300px] gap-4" role="status" aria-label={label}>
    <Spinner size="lg" />
    <p className="text-stone-500 text-sm animate-pulse">{label}</p>
  </div>
)

// ── Skeleton ──────────────────────────────────────────────────────
interface SkeletonProps { className?: string }

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => (
  <div
    className={cn('bg-stone-200 rounded-xl animate-pulse-soft', className)}
    aria-hidden="true"
  />
)

export const PropertyCardSkeleton: React.FC = () => (
  <div className="card overflow-hidden" aria-label="Loading property" role="status">
    <Skeleton className="h-52 rounded-none" />
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-2 pt-1">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <div className="flex justify-between items-center pt-2">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>
    </div>
  </div>
)

// ── Empty State ───────────────────────────────────────────────────
interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description?: string
  message?: string
  action?: React.ReactNode
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, message, action }) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-4 gap-4">
    {icon && <div className="text-5xl mb-2">{icon}</div>}
    <h3 className="text-lg font-semibold text-stone-800">{title}</h3>
    {(description || message) && <p className="text-stone-500 text-sm max-w-sm">{description || message}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
)

// ── Error State ───────────────────────────────────────────────────
interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  onRetry,
}) => (
  <div className="flex flex-col items-center justify-center text-center py-16 px-4 gap-4" role="alert">
    <div className="text-5xl">⚠️</div>
    <h3 className="text-lg font-semibold text-stone-800">{title}</h3>
    <p className="text-stone-500 text-sm max-w-sm">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="mt-2 px-4 py-2 text-sm font-medium text-primary-700 border border-primary-300 rounded-xl hover:bg-primary-50 transition-colors"
      >
        Try again
      </button>
    )}
  </div>
)

// ── Success State ─────────────────────────────────────────────────
interface SuccessStateProps {
  title: string
  description?: string
  refNumber?: string
  action?: React.ReactNode
}

export const SuccessState: React.FC<SuccessStateProps> = ({
  title, description, refNumber, action,
}) => (
  <div className="flex flex-col items-center justify-center text-center py-10 px-4 gap-4">
    <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
      <svg className="w-8 h-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
    <h3 className="text-xl font-semibold text-stone-900">{title}</h3>
    {refNumber && (
      <div className="bg-primary-50 border border-primary-200 rounded-2xl px-6 py-3 text-center">
        <p className="text-xs text-stone-500 mb-1">Your Reference Number</p>
        <p className="text-lg font-bold text-primary-800 tracking-wide">{refNumber}</p>
        <p className="text-xs text-stone-400 mt-1">Please save this for future enquiries</p>
      </div>
    )}
    {description && <p className="text-stone-600 text-sm max-w-md">{description}</p>}
    {action && <div className="mt-2">{action}</div>}
  </div>
)


// ── Alert / Inline notification ───────────────────────────────────
type AlertVariant = 'info' | 'success' | 'warning' | 'error'

interface AlertProps {
  variant?: AlertVariant
  title?: string
  message?: string
  children?: React.ReactNode
  className?: string
}

const alertStyles: Record<AlertVariant, string> = {
  info:    'bg-blue-50 border-blue-200 text-blue-800',
  success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  warning: 'bg-amber-50 border-amber-200 text-amber-800',
  error:   'bg-red-50 border-red-200 text-red-800',
}

const alertIcons: Record<AlertVariant, string> = {
  info: 'ℹ️', success: '✅', warning: '⚠️', error: '❌',
}

export const Alert: React.FC<AlertProps> = ({ variant = 'info', title, message, children, className }) => (
  <div
    role="alert"
    className={cn(
      'flex gap-3 p-4 rounded-2xl border text-sm',
      alertStyles[variant],
      className,
    )}
  >
    <span className="flex-shrink-0 text-base">{alertIcons[variant]}</span>
    <div>
      {title && <p className="font-semibold mb-0.5">{title}</p>}
      {message && <p className="leading-relaxed">{message}</p>}
      {children && <div className="leading-relaxed">{children}</div>}
    </div>
  </div>
)
