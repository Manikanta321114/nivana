import React, { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '../../utils'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
  footer?: React.ReactNode
}

const sizeMap = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

export const Modal: React.FC<ModalProps> = ({
  isOpen, onClose, title, size = 'md', children, footer,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={e => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-stone-950/50 backdrop-blur-sm animate-fade-in" aria-hidden="true" />

      {/* Panel */}
      <div
        className={cn(
          'relative w-full bg-white rounded-3xl shadow-2xl flex flex-col animate-slide-up',
          sizeMap[size],
          'max-h-[90vh]',
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        {!title && (
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-1.5 rounded-xl text-stone-400 hover:text-stone-600 hover:bg-stone-100 z-10 transition-colors"
          >
            <X size={18} />
          </button>
        )}

        {/* Content */}
        <div className="overflow-y-auto flex-1 px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="px-6 py-4 border-t border-stone-100 flex justify-end gap-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Confirm Dialog ────────────────────────────────────────────────
interface ConfirmDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  message: string
  confirmLabel?: string
  variant?: 'danger' | 'primary'
  loading?: boolean
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen, onClose, onConfirm, title, message,
  confirmLabel = 'Confirm', variant = 'primary', loading = false,
}) => (
  <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
    <p className="text-stone-600 leading-relaxed">{message}</p>
    <div className="flex justify-end gap-3 mt-6">
      <Button variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
      <Button variant={variant} onClick={onConfirm} loading={loading}>{confirmLabel}</Button>
    </div>
  </Modal>
)
