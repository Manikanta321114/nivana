/**
 * ⚠️  DEMO DATA — FOR DEVELOPMENT AND DEMONSTRATION ONLY
 *
 * These properties are entirely fictional. No real addresses, real phone
 * numbers, or real individuals are represented. Images use placeholder
 * services. When the backend is connected, this file will be removed.
 */

import type { PublicProperty, AdminProperty } from '../types'

// ── Helper — rent as paise ────────────────────────────────────────
const inr = (amount: number) => amount * 100

// Placeholder image arrays — will be replaced by real uploads
const placeholders = (n: number, seed: string): { id: string; file_path: string; display_order: number; caption: null }[] =>
  Array.from({ length: n }, (_, i) => ({
    id: `img-${seed}-${i}`,
    file_path: `https://picsum.photos/seed/${seed}-${i}/800/600`,
    display_order: i,
    caption: null,
  }))

// ── Demo properties (public-safe) ─────────────────────────────────
export const DEMO_PROPERTIES: PublicProperty[] = [
  {
    id: 'demo-prop-001',
    property_ref: 'NVS-DEMO-001',
    title: '2 BHK Apartment in Koramangala',
    locality: 'Koramangala',
    city: 'Bengaluru',
    property_type: 'APARTMENT',
    bhk: 2,
    rent_paise: inr(22000),
    deposit_paise: inr(44000),
    amenities: ['wifi', 'parking', 'security', 'power_backup', 'lift', 'near_metro'],
    description:
      'Spacious 2 BHK apartment in the heart of Koramangala. Well-ventilated rooms, modern kitchen, and close to tech parks, restaurants, and shopping. Ideal for working professionals or small families.',
    availability_status: 'AVAILABLE',
    listing_status: 'PUBLISHED',
    approx_lat: 12.9352,
    approx_lng: 77.6245,
    images: placeholders(4, 'koramangala2bhk'),
    created_at: '2024-10-01T08:00:00Z',
    published_at: '2024-10-02T10:00:00Z',
  },
  {
    id: 'demo-prop-002',
    property_ref: 'NVS-DEMO-002',
    title: '1 BHK Apartment in Indiranagar',
    locality: 'Indiranagar',
    city: 'Bengaluru',
    property_type: 'APARTMENT',
    bhk: 1,
    rent_paise: inr(16500),
    deposit_paise: inr(33000),
    amenities: ['wifi', 'security', 'near_metro', 'near_bus_stop', 'cctv'],
    description:
      'Cosy 1 BHK in vibrant Indiranagar. Steps from the 100 Feet Road cafes, the metro station, and major bus routes. Perfect for young professionals.',
    availability_status: 'AVAILABLE',
    listing_status: 'PUBLISHED',
    approx_lat: 12.9784,
    approx_lng: 77.6408,
    images: placeholders(3, 'indiranagar1bhk'),
    created_at: '2024-10-05T09:00:00Z',
    published_at: '2024-10-06T11:00:00Z',
  },
  {
    id: 'demo-prop-003',
    property_ref: 'NVS-DEMO-003',
    title: '3 BHK Independent House in Basavanagudi',
    locality: 'Basavanagudi',
    city: 'Bengaluru',
    property_type: 'HOUSE',
    bhk: 3,
    rent_paise: inr(28000),
    deposit_paise: inr(84000),
    amenities: ['parking', 'garden', 'bore_well', 'water_24h', 'pets_allowed', 'near_market'],
    description:
      'Charming 3 BHK independent house in quiet residential Basavanagudi. Large garden, ample parking, and a peaceful neighbourhood. Suitable for families.',
    availability_status: 'AVAILABLE',
    listing_status: 'PUBLISHED',
    approx_lat: 12.9419,
    approx_lng: 77.5744,
    images: placeholders(5, 'basavanagudi3bhk'),
    created_at: '2024-10-07T10:00:00Z',
    published_at: '2024-10-08T09:00:00Z',
  },
  {
    id: 'demo-prop-004',
    property_ref: 'NVS-DEMO-004',
    title: 'Studio Apartment near Electronic City',
    locality: 'Electronic City',
    city: 'Bengaluru',
    property_type: 'STUDIO',
    bhk: 0,
    rent_paise: inr(8500),
    deposit_paise: inr(17000),
    amenities: ['wifi', 'power_backup', 'security', 'near_bus_stop', 'bachelors_ok'],
    description:
      'Compact and affordable studio apartment close to Electronic City Phase 1. Great connectivity to major IT campuses. Includes Wi-Fi and 24/7 security.',
    availability_status: 'AVAILABLE',
    listing_status: 'PUBLISHED',
    approx_lat: 12.8399,
    approx_lng: 77.6770,
    images: placeholders(3, 'electroniccitystudio'),
    created_at: '2024-10-09T08:00:00Z',
    published_at: '2024-10-10T10:00:00Z',
  },
  {
    id: 'demo-prop-005',
    property_ref: 'NVS-DEMO-005',
    title: '2 BHK Apartment in HSR Layout',
    locality: 'HSR Layout',
    city: 'Bengaluru',
    property_type: 'APARTMENT',
    bhk: 2,
    rent_paise: inr(19000),
    deposit_paise: inr(38000),
    amenities: ['parking', 'gym', 'security', 'lift', 'power_backup', 'modular_kitchen', 'gated_community'],
    description:
      'Modern 2 BHK in a well-maintained gated society in HSR Layout. Includes gym, covered parking, modular kitchen, and 24/7 power backup. Near Sector 7 market.',
    availability_status: 'COMING_SOON',
    listing_status: 'PUBLISHED',
    approx_lat: 12.9081,
    approx_lng: 77.6476,
    images: placeholders(4, 'hsrlayout2bhk'),
    created_at: '2024-10-12T08:00:00Z',
    published_at: '2024-10-13T09:00:00Z',
  },
  {
    id: 'demo-prop-006',
    property_ref: 'NVS-DEMO-006',
    title: '3 BHK Flat in Vijayanagar',
    locality: 'Vijayanagar',
    city: 'Bengaluru',
    property_type: 'APARTMENT',
    bhk: 3,
    rent_paise: inr(21000),
    deposit_paise: inr(63000),
    amenities: ['parking', 'bore_well', 'water_24h', 'power_backup', 'near_school', 'near_market', 'near_bus_stop'],
    description:
      'Spacious 3 BHK flat in the family-friendly Vijayanagar area. Walking distance to schools, hospitals, and the main commercial street. Ground-floor parking included.',
    availability_status: 'AVAILABLE',
    listing_status: 'PUBLISHED',
    approx_lat: 12.9726,
    approx_lng: 77.5315,
    images: placeholders(4, 'vijayanagar3bhk'),
    created_at: '2024-10-15T08:00:00Z',
    published_at: '2024-10-16T09:00:00Z',
  },
  {
    id: 'demo-prop-007',
    property_ref: 'NVS-DEMO-007',
    title: '1 BHK PG in BTM Layout',
    locality: 'BTM Layout',
    city: 'Bengaluru',
    property_type: 'PG',
    bhk: 1,
    rent_paise: inr(7500),
    deposit_paise: inr(15000),
    amenities: ['wifi', 'security', 'near_bus_stop', 'bachelors_ok', 'ladies_only'],
    description:
      'Clean and safe ladies-only PG in BTM Layout with attached bathroom. Includes Wi-Fi, housekeeping, and round-the-clock security. Close to Silk Board and Madiwala Market.',
    availability_status: 'AVAILABLE',
    listing_status: 'PUBLISHED',
    approx_lat: 12.9166,
    approx_lng: 77.6101,
    images: placeholders(2, 'btmlayout1bhkpg'),
    created_at: '2024-10-18T08:00:00Z',
    published_at: '2024-10-19T10:00:00Z',
  },
  {
    id: 'demo-prop-008',
    property_ref: 'NVS-DEMO-008',
    title: '4 BHK Villa in Whitefield',
    locality: 'Whitefield',
    city: 'Bengaluru',
    property_type: 'VILLA',
    bhk: 4,
    rent_paise: inr(55000),
    deposit_paise: inr(110000),
    amenities: [
      'parking', 'garden', 'gym', 'swimming_pool', 'security', 'cctv',
      'power_backup', 'gated_community', 'modular_kitchen', 'ac',
      'near_school', 'near_hospital',
    ],
    description:
      'Premium 4 BHK villa in an exclusive gated enclave in Whitefield. Private garden, swimming pool, and smart home features. Ideal for senior executives and large families. Close to ITPL and Phoenix Marketcity.',
    availability_status: 'AVAILABLE',
    listing_status: 'PUBLISHED',
    approx_lat: 12.9698,
    approx_lng: 77.7500,
    images: placeholders(6, 'whitefield4bhkvilla'),
    created_at: '2024-10-20T08:00:00Z',
    published_at: '2024-10-21T10:00:00Z',
  },
]

// ── Admin-extended demo properties (includes private fields) ───────
export const DEMO_ADMIN_PROPERTIES: AdminProperty[] = DEMO_PROPERTIES.map((p, i) => ({
  ...p,
  exact_address: `[DEMO] ${i + 1}XX, Sample Road, ${p.locality}, Bengaluru`,
  owner_name: `[DEMO] Property Owner ${i + 1}`,
  owner_phone: `[DEMO] +91-XXXXXXXXXX`,
  source: i % 3 === 0 ? 'PUBLIC_SUBMISSION' : 'ADMIN_UPLOAD',
  submission_id: i % 3 === 0 ? `demo-sub-00${i + 1}` : null,
  added_by_admin_id: 'demo-admin-001',
  updated_at: p.created_at,
}))

// Featured properties for the homepage (first 3 published)
export const DEMO_FEATURED_PROPERTIES: PublicProperty[] = DEMO_PROPERTIES.filter(
  p => p.listing_status === 'PUBLISHED'
).slice(0, 3)
