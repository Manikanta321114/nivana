import { clsx, type ClassValue } from 'clsx'

// ── Currency ──────────────────────────────────────────────────────

/**
 * Format paise value as INR string.
 * e.g. 2200000 → "₹22,000"
 */
export const formatRent = (paise: number): string => {
  const inr = paise / 100
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inr)
}

/**
 * Format paise as compact INR (e.g. ₹22K, ₹1.2L).
 */
export const formatRentCompact = (paise: number): string => {
  const inr = paise / 100
  if (inr >= 100000) return `₹${(inr / 100000).toFixed(1)}L`
  if (inr >= 1000)   return `₹${(inr / 1000).toFixed(0)}K`
  return `₹${inr}`
}

// ── Date / time ───────────────────────────────────────────────────

export const formatDate = (iso: string): string => {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export const formatDateTime = (iso: string): string => {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const timeAgo = (iso: string): string => {
  const diff = Date.now() - new Date(iso).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'Just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7)   return `${days}d ago`
  return formatDate(iso)
}

// ── Property helpers ──────────────────────────────────────────────

export const formatBHK = (bhk: number): string => {
  if (bhk === 0) return 'Studio'
  return `${bhk} BHK`
}

export const formatPropertyType = (type: string): string => {
  const map: Record<string, string> = {
    APARTMENT: 'Apartment',
    HOUSE: 'Independent House',
    PG: 'PG / Hostel',
    VILLA: 'Villa',
    STUDIO: 'Studio',
  }
  return map[type] ?? type
}

export const formatAvailability = (status: string): string => {
  const map: Record<string, string> = {
    AVAILABLE:   'Available Now',
    OCCUPIED:    'Currently Occupied',
    COMING_SOON: 'Available Soon',
  }
  return map[status] ?? status
}

// ── Reference generation (frontend-only, for confirmation display) ─
export const generateRef = (prefix: string): string => {
  const year   = new Date().getFullYear()
  const random = Math.floor(Math.random() * 9000) + 1000
  return `${prefix}-${year}-${random}`
}

// ── Class name utility ────────────────────────────────────────────
export const cn = (...classes: ClassValue[]): string => clsx(classes)

// ── Truncation ────────────────────────────────────────────────────
export const truncate = (text: string, maxLen = 120): string =>
  text.length > maxLen ? `${text.slice(0, maxLen)}…` : text

// ── Phone formatting ──────────────────────────────────────────────
export const maskPhone = (phone: string): string => {
  // Show only last 4 digits: +91 XXXXXX1234
  if (phone.length < 4) return '****'
  return `${phone.slice(0, -4).replace(/\d/g, 'X')}${phone.slice(-4)}`
}

// ── Status badge class ────────────────────────────────────────────
export const getStatusBadgeClass = (status: string): string => {
  const map: Record<string, string> = {
    NEW:              'badge-new',
    CALLBACK_PENDING: 'badge-callback',
    CONTACTED:        'badge-contacted',
    VISIT_SCHEDULED:  'badge-scheduled',
    COMPLETED:        'badge-completed',
    CANCELLED:        'badge-cancelled',
    PENDING:          'badge-pending',
    UNDER_REVIEW:     'badge-review',
    APPROVED:         'badge-approved',
    REJECTED:         'badge-rejected',
    PUBLISHED:        'badge-published',
    UNPUBLISHED:      'badge-unpublished',
    AVAILABLE:        'badge-available',
    OCCUPIED:         'badge-occupied',
    COMING_SOON:      'badge-coming',
    ARCHIVED:         'badge-unpublished',
  }
  return map[status] ?? 'badge-pending'
}

// ── API URL resolver ──────────────────────────────────────────────
/**
 * Resolves full API URL with environment variable support for production.
 * In production (Vercel), VITE_API_BASE_URL points to the Render backend (e.g. https://nivasa-api.onrender.com).
 * In development, falls back to VITE_API_BASE_URL or relative path.
 */
export const getApiUrl = (endpoint: string): string => {
  const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  return base ? `${base}${path}` : path
}
