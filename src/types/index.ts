// ── Property types ─────────────────────────────────────────────────
export type PropertyType = 'APARTMENT' | 'HOUSE' | 'PG' | 'VILLA' | 'STUDIO'
export type AvailabilityStatus = 'AVAILABLE' | 'OCCUPIED' | 'COMING_SOON'
export type ListingStatus = 'UNPUBLISHED' | 'PUBLISHED' | 'ARCHIVED'

// Public-safe property (no private owner/address data)
export interface PublicProperty {
  id: string
  property_ref: string       // e.g. NVS-2024-0001
  title: string
  locality: string
  city: string
  property_type: PropertyType
  bhk: number                // 0 = Studio
  rent_paise: number         // stored in paise; divide by 100 for INR
  deposit_paise: number | null
  amenities: string[]
  description: string
  availability_status: AvailabilityStatus
  listing_status: ListingStatus
  approx_lat: number | null
  approx_lng: number | null
  images: PublicPropertyImage[]
  created_at: string
  published_at: string | null
}

export interface PublicPropertyImage {
  id: string
  file_path: string          // URL or path
  display_order: number
  caption: string | null
}

// Admin-extended property (includes private fields)
export interface AdminProperty extends PublicProperty {
  exact_address: string | null
  owner_name: string | null
  owner_phone: string | null
  source: 'ADMIN_UPLOAD' | 'PUBLIC_SUBMISSION'
  submission_id: string | null
  added_by_admin_id: string | null
  updated_at: string
}

// ── Property Submission ────────────────────────────────────────────
export type VerificationStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED'

export interface PropertySubmission {
  id: string
  submission_ref: string    // e.g. SUB-2024-0042
  submitter_name: string
  locality: string
  property_type: PropertyType
  bhk: number
  rent_paise: number
  deposit_paise: number | null
  amenities: string[]
  description: string
  availability: string
  submitter_is_authorized: boolean
  consent_to_contact: boolean
  verification_status: VerificationStatus
  submitted_at: string
}

// Admin-extended submission (includes private contact)
export interface AdminPropertySubmission extends PropertySubmission {
  submitter_phone: string
  admin_notes: string | null
  reviewed_by_admin_id: string | null
  reviewed_at: string | null
}

// ── Booking / Request ──────────────────────────────────────────────
export type RequestType = 'CALLBACK' | 'VISIT'
export type RequestStatus =
  | 'NEW'
  | 'CALLBACK_PENDING'
  | 'CONTACTED'
  | 'VISIT_SCHEDULED'
  | 'COMPLETED'
  | 'CANCELLED'

export interface BookingRequest {
  id: string
  request_ref: string       // e.g. REQ-2024-0099
  property_id: string
  property_ref: string
  property_title: string
  property_locality: string
  customer_name: string
  customer_phone: string    // private — admin only
  request_type: RequestType
  preferred_visit_date: string | null
  message: string | null
  consent_to_contact: boolean
  status: RequestStatus
  admin_notes: string | null
  assigned_to_admin_id: string | null
  created_at: string
  updated_at: string
}

// ── Callback Log ───────────────────────────────────────────────────
export type CallbackOutcome =
  | 'NO_ANSWER'
  | 'LEFT_MESSAGE'
  | 'SPOKE'
  | 'VISIT_CONFIRMED'
  | 'CUSTOMER_CANCELLED'

export interface CallbackLog {
  id: string
  booking_request_id: string
  admin_id: string
  admin_name: string
  called_at: string
  outcome: CallbackOutcome
  notes: string | null
}

// ── Verification Record ────────────────────────────────────────────
export interface VerificationRecord {
  id: string
  submission_id: string
  admin_id: string
  authority_checked: boolean
  contact_checked: boolean
  availability_checked: boolean
  rent_checked: boolean
  location_checked: boolean
  publish_permission_confirmed: boolean
  notes: string | null
  created_at: string
  updated_at: string
}

// ── Admin User ─────────────────────────────────────────────────────
export interface AdminUser {
  id: string
  username: string
  email: string
  full_name: string
  is_active: boolean
  is_superadmin: boolean
  created_at: string
  last_login_at: string | null
}

// ── Tenant / Public User ──────────────────────────────────────────
export interface TenantUser {
  id: string
  full_name: string
  phone: string
  email?: string
  created_at: string
}

// ── Forms ─────────────────────────────────────────────────────────
export interface BookingRequestForm {
  customer_name: string
  customer_phone: string
  request_type: RequestType
  preferred_visit_date: string
  message: string
  consent_to_contact: boolean
}

export interface PropertySubmissionForm {
  submitter_name: string
  submitter_phone: string
  locality: string
  property_type: PropertyType
  bhk: number
  rent_paise: number
  deposit_paise: number | null
  amenities: string[]
  description: string
  availability: string
  submitter_is_authorized: boolean
  consent_to_contact: boolean
}

// ── Filters ───────────────────────────────────────────────────────
export interface PropertyFilters {
  locality: string
  property_type: PropertyType | ''
  bhk: number | ''
  min_rent: number | ''
  max_rent: number | ''
  availability_status: AvailabilityStatus | ''
}

// ── API Responses ─────────────────────────────────────────────────
export interface ApiResponse<T> {
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  pages: number
}

export interface SubmissionConfirmation {
  submission_ref: string
  message: string
}

export interface BookingConfirmation {
  request_ref: string
  message: string
}

// ── Auth ──────────────────────────────────────────────────────────
export interface AuthToken {
  access_token: string
  token_type: string
}

export interface LoginCredentials {
  username: string
  password: string
}
