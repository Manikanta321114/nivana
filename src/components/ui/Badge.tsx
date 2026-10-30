import React from 'react'
import { cn, getStatusBadgeClass } from '../../utils'

interface BadgeProps {
  status: string
  label?: string
  size?: 'sm' | 'md'
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ status, label, size = 'md', className }) => {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        getStatusBadgeClass(status),
        className,
      )}
    >
      {label ?? status.replace(/_/g, ' ')}
    </span>
  )
}

export default Badge
