export interface AmenityOption {
  value: string
  label: string
  icon: string  // emoji for quick display
}

export const AMENITIES: AmenityOption[] = [
  { value: 'wifi',          label: 'Wi-Fi',             icon: '📶' },
  { value: 'parking',       label: 'Parking',           icon: '🚗' },
  { value: 'power_backup',  label: 'Power Backup',      icon: '🔋' },
  { value: 'security',      label: '24/7 Security',     icon: '🔒' },
  { value: 'cctv',          label: 'CCTV',              icon: '📷' },
  { value: 'lift',          label: 'Lift / Elevator',   icon: '🛗' },
  { value: 'gym',           label: 'Gym',               icon: '🏋️' },
  { value: 'swimming_pool', label: 'Swimming Pool',     icon: '🏊' },
  { value: 'garden',        label: 'Garden / Park',     icon: '🌿' },
  { value: 'play_area',     label: 'Children Play Area',icon: '🛝' },
  { value: 'clubhouse',     label: 'Clubhouse',         icon: '🏛️' },
  { value: 'water_24h',     label: '24/7 Water Supply', icon: '🚰' },
  { value: 'bore_well',     label: 'Borewell',          icon: '💧' },
  { value: 'gas_pipeline',  label: 'Piped Gas',         icon: '🔥' },
  { value: 'modular_kitchen', label: 'Modular Kitchen', icon: '🍳' },
  { value: 'furnished',     label: 'Furnished',         icon: '🛋️' },
  { value: 'semi_furnished', label: 'Semi-Furnished',   icon: '🪑' },
  { value: 'ac',            label: 'Air Conditioning',  icon: '❄️' },
  { value: 'gated_community', label: 'Gated Community', icon: '🏘️' },
  { value: 'visitors_parking', label: "Visitor Parking",icon: '🅿️' },
  { value: 'intercom',      label: 'Intercom',          icon: '📞' },
  { value: 'pets_allowed',  label: 'Pets Allowed',      icon: '🐾' },
  { value: 'bachelors_ok',  label: 'Bachelors OK',      icon: '✅' },
  { value: 'ladies_only',   label: 'Ladies Only',       icon: '👩' },
  { value: 'near_metro',    label: 'Near Metro',        icon: '🚇' },
  { value: 'near_bus_stop', label: 'Near Bus Stop',     icon: '🚌' },
  { value: 'near_school',   label: 'Near School',       icon: '🏫' },
  { value: 'near_hospital', label: 'Near Hospital',     icon: '🏥' },
  { value: 'near_market',   label: 'Near Market',       icon: '🛒' },
]

export const getAmenityByValue = (value: string): AmenityOption | undefined =>
  AMENITIES.find(a => a.value === value)

export const BHK_OPTIONS = [
  { value: 0, label: 'Studio' },
  { value: 1, label: '1 BHK' },
  { value: 2, label: '2 BHK' },
  { value: 3, label: '3 BHK' },
  { value: 4, label: '4 BHK' },
  { value: 5, label: '5+ BHK' },
]

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  APARTMENT: 'Apartment',
  HOUSE:     'Independent House',
  PG:        'PG / Hostel',
  VILLA:     'Villa',
  STUDIO:    'Studio',
}

export const AVAILABILITY_LABELS: Record<string, string> = {
  AVAILABLE:   'Available',
  OCCUPIED:    'Currently Occupied',
  COMING_SOON: 'Available Soon',
}

export const LISTING_STATUS_LABELS: Record<string, string> = {
  UNPUBLISHED: 'Unpublished',
  PUBLISHED:   'Published',
  ARCHIVED:    'Archived',
}

export const VERIFICATION_STATUS_LABELS: Record<string, string> = {
  PENDING:      'Pending Review',
  UNDER_REVIEW: 'Under Review',
  APPROVED:     'Approved',
  REJECTED:     'Rejected',
}

export const REQUEST_STATUS_LABELS: Record<string, string> = {
  NEW:              'New',
  CALLBACK_PENDING: 'Callback Pending',
  CONTACTED:        'Contacted',
  VISIT_SCHEDULED:  'Visit Scheduled',
  COMPLETED:        'Completed',
  CANCELLED:        'Cancelled',
}

export const CALLBACK_OUTCOME_LABELS: Record<string, string> = {
  NO_ANSWER:          'No Answer',
  LEFT_MESSAGE:       'Left Message',
  SPOKE:              'Spoke with Customer',
  VISIT_CONFIRMED:    'Visit Confirmed',
  CUSTOMER_CANCELLED: 'Customer Cancelled',
}

// Rent range quick-filters (in INR — converted to paise for API)
export const RENT_RANGE_OPTIONS = [
  { label: 'Under ₹8,000',         min: 0,       max: 8000 },
  { label: '₹8,000 – ₹12,000',     min: 8000,    max: 12000 },
  { label: '₹12,000 – ₹18,000',    min: 12000,   max: 18000 },
  { label: '₹18,000 – ₹25,000',    min: 18000,   max: 25000 },
  { label: '₹25,000 – ₹40,000',    min: 25000,   max: 40000 },
  { label: 'Above ₹40,000',         min: 40000,   max: 999999 },
]
