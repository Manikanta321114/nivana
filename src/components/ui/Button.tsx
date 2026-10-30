import React from 'react'
import { cn } from '../../utils'

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success'
type ButtonSize    = 'xs' | 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
  as?: 'button'
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:   'bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900 shadow-md-green focus:ring-primary-500',
  secondary: 'bg-primary-50 text-primary-800 hover:bg-primary-100 active:bg-primary-200 focus:ring-primary-400',
  outline:   'border-2 border-primary-700 text-primary-700 hover:bg-primary-50 active:bg-primary-100 focus:ring-primary-500',
  ghost:     'text-stone-600 hover:bg-stone-100 active:bg-stone-200 focus:ring-stone-400',
  danger:    'bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus:ring-red-500',
  success:   'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 focus:ring-emerald-500',
}

const sizeClasses: Record<ButtonSize, string> = {
  xs: 'px-2.5 py-1    text-xs  rounded-lg  gap-1',
  sm: 'px-3.5 py-1.5  text-sm  rounded-xl  gap-1.5',
  md: 'px-5   py-2.5  text-sm  rounded-xl  gap-2',
  lg: 'px-6   py-3    text-base rounded-2xl gap-2.5',
}

export const Button: React.FC<ButtonProps> = ({
  variant  = 'primary',
  size     = 'md',
  loading  = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  className,
  disabled,
  ...props
}) => {
  const isDisabled = disabled || loading

  return (
    <button
      {...props}
      disabled={isDisabled}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        variantClasses[variant],
        sizeClasses[size],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50 cursor-not-allowed',
        className,
      )}
    >
      {loading ? (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
      ) : (
        leftIcon
      )}
      {children}
      {!loading && rightIcon}
    </button>
  )
}

export default Button
