import React from 'react'
import { cn } from '../../utils'

// ── Input ─────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  id: string
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  id,
  className,
  ...props
}) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-1.5">
        {label}
        {props.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
    )}
    <div className="relative">
      {leftIcon && (
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
          {leftIcon}
        </span>
      )}
      <input
        id={id}
        {...props}
        className={cn(
          'input-base',
          leftIcon  && 'pl-10',
          rightIcon && 'pr-10',
          error     && 'border-red-400 focus:ring-red-400 focus:border-red-400',
          className,
        )}
        aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
        aria-invalid={!!error}
      />
      {rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
          {rightIcon}
        </span>
      )}
    </div>
    {error && (
      <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
        <span aria-hidden="true">⚠</span> {error}
      </p>
    )}
    {hint && !error && (
      <p id={`${id}-hint`} className="mt-1.5 text-xs text-stone-500">{hint}</p>
    )}
  </div>
)

// ── Textarea ──────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode
  error?: string
  hint?: string
  id: string
}

export const Textarea: React.FC<TextareaProps> = ({
  label, error, hint, id, className, ...props
}) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-1.5">
        {label}
        {props.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
    )}
    <textarea
      id={id}
      {...props}
      className={cn(
        'input-base resize-y min-h-[100px]',
        error && 'border-red-400 focus:ring-red-400 focus:border-red-400',
        className,
      )}
      aria-describedby={error ? `${id}-error` : undefined}
      aria-invalid={!!error}
    />
    {error && (
      <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
        <span aria-hidden="true">⚠</span> {error}
      </p>
    )}
    {hint && !error && (
      <p className="mt-1.5 text-xs text-stone-500">{hint}</p>
    )}
  </div>
)

// ── Select ────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode
  error?: string
  hint?: string
  id: string
  options: { value: string | number; label: string }[]
  placeholder?: string
}

export const Select: React.FC<SelectProps> = ({
  label, error, hint, id, options, placeholder, className, ...props
}) => (
  <div className="w-full">
    {label && (
      <label htmlFor={id} className="block text-sm font-medium text-stone-700 mb-1.5">
        {label}
        {props.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
    )}
    <select
      id={id}
      {...props}
      className={cn(
        'input-base appearance-none bg-no-repeat',
        'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 20 20\' fill=\'%239a8e7d\'%3E%3Cpath fill-rule=\'evenodd\' d=\'M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z\' clip-rule=\'evenodd\' /%3E%3C/svg%3E")]',
        'bg-[length:20px] bg-[right_0.75rem_center] pr-10',
        error && 'border-red-400 focus:ring-red-400',
        className,
      )}
      aria-invalid={!!error}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    {error && (
      <p role="alert" className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
        <span aria-hidden="true">⚠</span> {error}
      </p>
    )}
    {hint && !error && (
      <p className="mt-1.5 text-xs text-stone-500">{hint}</p>
    )}
  </div>
)

// ── Checkbox ──────────────────────────────────────────────────────
interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode
  error?: string
  id: string
}

export const Checkbox: React.FC<CheckboxProps> = ({ label, error, id, className, ...props }) => (
  <div className="w-full">
    <label htmlFor={id} className={cn('flex items-start gap-3 cursor-pointer', props.disabled && 'opacity-50 cursor-not-allowed')}>
      <input
        type="checkbox"
        id={id}
        {...props}
        className={cn(
          'mt-0.5 h-5 w-5 rounded border-stone-300 text-primary-700 cursor-pointer',
          'focus:ring-primary-500 focus:ring-offset-1 transition-colors',
          error && 'border-red-400',
          className,
        )}
      />
      <span className="text-sm text-stone-700 leading-relaxed">{label}</span>
    </label>
    {error && (
      <p role="alert" className="mt-1.5 text-sm text-red-600 flex items-center gap-1 ml-8">
        <span aria-hidden="true">⚠</span> {error}
      </p>
    )}
  </div>
)
