import React, { useState, useMemo, useEffect } from 'react'
import {
  LayoutGrid, List, Map as MapIcon, Layers, ChevronDown, ChevronUp,
  SlidersHorizontal, ArrowUpDown, X, RotateCcw, MapPin
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { PropertyCard } from '../../components/property/PropertyCard'
import { PropertyCardSkeleton, EmptyState } from '../../components/ui/States'
import { MapView } from '../../components/property/MapView'
import type { PropertyFilters, PublicProperty } from '../../types'
import { DEMO_PROPERTIES } from '../../constants/demoProperties'
import { BENGALURU_LOCALITIES } from '../../constants/localities'
import { AMENITIES } from '../../constants/amenities'
import { Button } from '../../components/ui/Button'
import { cn, getApiUrl } from '../../utils'

const EMPTY_FILTERS: PropertyFilters = {
  locality: '',
  property_type: '',
  bhk: '',
  min_rent: '',
  max_rent: '',
  availability_status: '',
}

type ViewMode = 'split' | 'grid' | 'list' | 'map'
type SortOption = 'newest' | 'rent_asc' | 'rent_desc' | 'bhk_asc'

export const ExplorePropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams()

  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [mapCollapsed, setMapCollapsed] = useState(false)
  const [highlightedId, setHighlightedId] = useState<string | undefined>()
  const [sortOption, setSortOption] = useState<SortOption>('newest')
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])

  // Properties state (combines live API with demo properties fallback)
  const [properties, setProperties] = useState<PublicProperty[]>(DEMO_PROPERTIES)
  const [loading, setLoading] = useState(false)

  const initialBhk = searchParams.get('bhk')
  const [filters, setFilters] = useState<PropertyFilters>({
    ...EMPTY_FILTERS,
    locality: searchParams.get('locality') ?? '',
    property_type: (searchParams.get('type') ?? '') as PropertyFilters['property_type'],
    bhk: initialBhk ? Number(initialBhk) : '',
  })

  // Try fetching from backend API on mount
  useEffect(() => {
    let isMounted = true
    const fetchLiveProperties = async () => {
      try {
        setLoading(true)
        const res = await fetch(getApiUrl('/api/v1/properties/'))
        if (res.ok) {
          const data = await res.json()
          if (data && data.items && data.items.length > 0 && isMounted) {
            setProperties(data.items)
          }
        }
      } catch (err) {
        console.debug('Backend properties endpoint fallback to demo data:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchLiveProperties()
    return () => { isMounted = false }
  }, [])

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const toggleAmenity = (val: string) => {
    setSelectedAmenities(prev =>
      prev.includes(val) ? prev.filter(a => a !== val) : [...prev, val]
    )
  }

  const resetAllFilters = () => {
    setFilters(EMPTY_FILTERS)
    setSelectedAmenities([])
    setSearchParams({})
  }

  // Filter & Sort
  const filteredAndSortedProperties = useMemo(() => {
    const list = properties.filter(p => {
      if (p.listing_status !== 'PUBLISHED') return false

      if (filters.locality && !p.locality.toLowerCase().includes(filters.locality.toLowerCase())) {
        return false
      }
      if (filters.property_type && p.property_type !== filters.property_type) {
        return false
      }
      if (filters.bhk !== '' && p.bhk !== Number(filters.bhk)) {
        return false
      }
      if (filters.min_rent !== '' && p.rent_paise < Number(filters.min_rent) * 100) {
        return false
      }
      if (filters.max_rent !== '' && p.rent_paise > Number(filters.max_rent) * 100) {
        return false
      }
      if (filters.availability_status && p.availability_status !== filters.availability_status) {
        return false
      }
      if (selectedAmenities.length > 0) {
        const hasAllAmenities = selectedAmenities.every(a => p.amenities.includes(a))
        if (!hasAllAmenities) return false
      }
      return true
    })

    // Sort
    return list.sort((a, b) => {
      if (sortOption === 'rent_asc') return a.rent_paise - b.rent_paise
      if (sortOption === 'rent_desc') return b.rent_paise - a.rent_paise
      if (sortOption === 'bhk_asc') return a.bhk - b.bhk
      return 0
    })
  }, [properties, filters, selectedAmenities, sortOption])

  const activeFilterCount =
    (filters.locality ? 1 : 0) +
    (filters.property_type ? 1 : 0) +
    (filters.bhk !== '' ? 1 : 0) +
    (filters.min_rent !== '' ? 1 : 0) +
    (filters.max_rent !== '' ? 1 : 0) +
    selectedAmenities.length

  return (
    <div className="pt-20 min-h-screen bg-stone-50">
      {/* ── SUBHEADER BAR ─────────────────────────────────────────── */}
      <div className="bg-white border-b border-stone-200/90 sticky top-20 z-30 shadow-sm">
        <div className="page-container py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search by locality directly in bar */}
          <div className="flex items-center gap-3 flex-1 max-w-xl">
            <div className="relative flex-1">
              <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-primary-600" />
              <input
                type="text"
                value={filters.locality}
                onChange={e => updateFilter('locality', e.target.value)}
                placeholder="Search by locality (Indiranagar, HSR, Whitefield...)"
                list="explore-locality-list"
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm font-medium text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-600 focus:bg-white transition-all"
              />
              {filters.locality && (
                <button
                  type="button"
                  onClick={() => updateFilter('locality', '')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X size={14} />
                </button>
              )}
              <datalist id="explore-locality-list">
                {BENGALURU_LOCALITIES.map(l => (
                  <option key={l} value={l} />
                ))}
              </datalist>
            </div>

            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 border border-stone-200 text-xs font-bold text-stone-800"
            >
              <SlidersHorizontal size={14} />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>
          </div>

          {/* Controls: Sorting + View Switcher */}
          <div className="flex items-center gap-3 justify-between md:justify-end">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-xs">
              <ArrowUpDown size={13} className="text-stone-500" />
              <select
                value={sortOption}
                onChange={e => setSortOption(e.target.value as SortOption)}
                className="bg-transparent text-stone-800 font-semibold outline-none cursor-pointer"
              >
                <option value="newest">Featured & Newest</option>
                <option value="rent_asc">Rent: Low to High</option>
                <option value="rent_desc">Rent: High to Low</option>
                <option value="bhk_asc">BHK Count</option>
              </select>
            </div>

            {/* View Mode Switcher */}
            <div className="bg-stone-100 p-1 rounded-xl flex gap-1 border border-stone-200" role="group">
              <button
                type="button"
                onClick={() => { setViewMode('split'); setMapCollapsed(false) }}
                title="Map Above & Listings"
                className={cn(
                  'p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all',
                  viewMode === 'split' ? 'bg-white text-primary-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                )}
              >
                <Layers size={14} />
                <span className="hidden sm:inline">Split</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                title="Grid View"
                className={cn(
                  'p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all',
                  viewMode === 'grid' ? 'bg-white text-primary-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                )}
              >
                <LayoutGrid size={14} />
                <span className="hidden sm:inline">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                title="List View"
                className={cn(
                  'p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all',
                  viewMode === 'list' ? 'bg-white text-primary-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                )}
              >
                <List size={14} />
                <span className="hidden sm:inline">List</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('map')}
                title="Map Only"
                className={cn(
                  'p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all',
                  viewMode === 'map' ? 'bg-white text-primary-900 shadow-sm' : 'text-stone-600 hover:text-stone-900'
                )}
              >
                <MapIcon size={14} />
                <span className="hidden sm:inline">Map</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-6 space-y-6">
        {/* ── MAP POSITIONED ABOVE (Split or Full Map Mode) ─────────── */}
        {viewMode !== 'grid' && viewMode !== 'list' && (
          <div className="animate-fade-in bg-white rounded-3xl p-3 border border-stone-200/90 shadow-card">
            <div className="flex items-center justify-between mb-2 px-2 pt-1">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                <MapIcon size={14} className="text-primary-700" />
                Bengaluru Interactive Map • Click any house icon to view rent & photos
              </span>

              {viewMode === 'split' && (
                <button
                  type="button"
                  onClick={() => setMapCollapsed(prev => !prev)}
                  className="text-xs text-primary-700 hover:text-primary-900 font-bold flex items-center gap-1 transition-colors"
                >
                  {mapCollapsed ? (
                    <>
                      <ChevronDown size={14} /> Expand Map
                    </>
                  ) : (
                    <>
                      <ChevronUp size={14} /> Collapse Map
                    </>
                  )}
                </button>
              )}
            </div>

            {!mapCollapsed && (
              <div className="rounded-2xl overflow-hidden border border-stone-200">
                <MapView
                  properties={filteredAndSortedProperties}
                  highlightedId={highlightedId}
                  onMarkerClick={p => setHighlightedId(p.id)}
                  className={viewMode === 'map' ? 'h-[calc(100vh-230px)] min-h-[550px]' : 'h-[380px] w-full'}
                  initialLocate={true}
                />
              </div>
            )}
          </div>
        )}

        {/* ── FILTERS SIDEBAR + PROPERTIES CONTENT ─────────────────── */}
        {viewMode !== 'map' && (
          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Desktop Filters Panel */}
            <aside className="hidden lg:block w-72 flex-shrink-0 bg-white rounded-3xl border border-stone-200/90 p-5 shadow-card sticky top-36">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
                <h3 className="font-display font-bold text-stone-900 text-sm flex items-center gap-2">
                  <SlidersHorizontal size={15} className="text-primary-700" />
                  Filter Properties
                </h3>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
                  >
                    <RotateCcw size={11} /> Reset
                  </button>
                )}
              </div>

              <div className="space-y-5 text-xs">
                {/* BHK Filter */}
                <div>
                  <label className="block font-bold text-stone-700 mb-2 uppercase tracking-wider text-[11px]">
                    Bedrooms (BHK)
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {['', 1, 2, 3].map(b => (
                      <button
                        key={String(b)}
                        type="button"
                        onClick={() => updateFilter('bhk', b)}
                        className={cn(
                          'py-1.5 rounded-xl font-bold transition-all border text-center',
                          filters.bhk === b
                            ? 'bg-primary-700 text-white border-primary-700 shadow-sm'
                            : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                        )}
                      >
                        {b === '' ? 'All' : `${b} BHK`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div>
                  <label className="block font-bold text-stone-700 mb-2 uppercase tracking-wider text-[11px]">
                    Property Type
                  </label>
                  <div className="space-y-1.5">
                    {[
                      { val: '', label: 'All Property Types' },
                      { val: 'APARTMENT', label: 'Apartment' },
                      { val: 'HOUSE', label: 'Independent House' },
                      { val: 'VILLA', label: 'Gated Villa' },
                      { val: 'STUDIO', label: 'Studio Room' },
                    ].map(type => (
                      <label
                        key={type.val}
                        className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-50 cursor-pointer font-medium text-stone-700"
                      >
                        <input
                          type="radio"
                          name="property_type"
                          checked={filters.property_type === type.val}
                          onChange={() => updateFilter('property_type', type.val)}
                          className="accent-primary-700"
                        />
                        <span>{type.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Monthly Rent Range */}
                <div>
                  <label className="block font-bold text-stone-700 mb-2 uppercase tracking-wider text-[11px]">
                    Budget (₹ Monthly Rent)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Min ₹"
                      value={filters.min_rent}
                      onChange={e => updateFilter('min_rent', e.target.value ? Number(e.target.value) : '')}
                      className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold"
                    />
                    <input
                      type="number"
                      placeholder="Max ₹"
                      value={filters.max_rent}
                      onChange={e => updateFilter('max_rent', e.target.value ? Number(e.target.value) : '')}
                      className="px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs font-semibold"
                    />
                  </div>
                  {/* Quick Rent Buttons */}
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {[
                      { label: '< ₹25k', min: '', max: 25000 },
                      { label: '₹25k - ₹50k', min: 25000, max: 50000 },
                      { label: '₹50k+', min: 50000, max: '' },
                    ].map(q => (
                      <button
                        key={q.label}
                        type="button"
                        onClick={() => {
                          updateFilter('min_rent', q.min)
                          updateFilter('max_rent', q.max)
                        }}
                        className="text-[10px] font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-1 rounded-lg"
                      >
                        {q.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amenities Multi-Select */}
                <div>
                  <label className="block font-bold text-stone-700 mb-2 uppercase tracking-wider text-[11px]">
                    Key Amenities
                  </label>
                  <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                    {AMENITIES.map(amenity => (
                      <label
                        key={amenity.value}
                        className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-stone-50 cursor-pointer text-stone-700"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAmenities.includes(amenity.value)}
                          onChange={() => toggleAmenity(amenity.value)}
                          className="accent-primary-700 rounded"
                        />
                        <span className="text-xs">{amenity.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Properties List / Grid Section */}
            <main className="flex-1 min-w-0 w-full">
              {/* Results summary header */}
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-200">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-stone-900">
                    {filteredAndSortedProperties.length} Properties Available
                  </span>
                  {activeFilterCount > 0 && (
                    <span className="bg-primary-50 text-primary-800 text-[11px] font-bold px-2 py-0.5 rounded-full border border-primary-200">
                      {activeFilterCount} active filters
                    </span>
                  )}
                </div>

                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-xs font-bold text-primary-700 hover:text-primary-900"
                  >
                    Clear all filters
                  </button>
                )}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <PropertyCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredAndSortedProperties.length === 0 ? (
                <div className="bg-white rounded-3xl p-12 text-center border border-stone-200/90 shadow-card">
                  <EmptyState
                    icon="🏘️"
                    title="No matching properties found"
                    description="Try widening your search radius, adjusting rent limits, or clearing BHK filters."
                    action={
                      <Button variant="primary" size="sm" onClick={resetAllFilters}>
                        Reset all filters
                      </Button>
                    }
                  />
                </div>
              ) : viewMode === 'list' ? (
                <div className="space-y-3">
                  {filteredAndSortedProperties.map(p => (
                    <PropertyCard
                      key={p.id}
                      property={p}
                      compact
                      className={highlightedId === p.id ? 'ring-2 ring-primary-600' : ''}
                    />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {filteredAndSortedProperties.map(p => (
                    <div
                      key={p.id}
                      onMouseEnter={() => setHighlightedId(p.id)}
                    >
                      <PropertyCard
                        property={p}
                        className={highlightedId === p.id ? 'ring-2 ring-primary-600' : ''}
                      />
                    </div>
                  ))}
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* ── MOBILE FILTER DRAWER MODAL ────────────────────────────── */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-sm bg-white h-full p-6 flex flex-col justify-between overflow-y-auto animate-fade-in">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 mb-4">
                <h3 className="font-bold text-base text-stone-900 flex items-center gap-2">
                  <SlidersHorizontal size={16} /> Filters
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 rounded-full text-stone-400 hover:text-stone-700"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Mobile BHK */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-stone-700 mb-2 uppercase">BHK</label>
                <div className="grid grid-cols-4 gap-2">
                  {['', 1, 2, 3].map(b => (
                    <button
                      key={String(b)}
                      type="button"
                      onClick={() => updateFilter('bhk', b)}
                      className={cn(
                        'py-2 rounded-xl text-xs font-bold border text-center',
                        filters.bhk === b
                          ? 'bg-primary-700 text-white border-primary-700'
                          : 'bg-stone-50 text-stone-700 border-stone-200'
                      )}
                    >
                      {b === '' ? 'All' : `${b} BHK`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Property Type */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-stone-700 mb-2 uppercase">Property Type</label>
                <select
                  value={filters.property_type}
                  onChange={e => updateFilter('property_type', e.target.value)}
                  className="input-base"
                >
                  <option value="">All Types</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">Independent House</option>
                  <option value="VILLA">Gated Villa</option>
                  <option value="STUDIO">Studio</option>
                </select>
              </div>

              {/* Mobile Budget */}
              <div className="mb-5">
                <label className="block text-xs font-bold text-stone-700 mb-2 uppercase">Max Rent (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 40000"
                  value={filters.max_rent}
                  onChange={e => updateFilter('max_rent', e.target.value ? Number(e.target.value) : '')}
                  className="input-base"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex gap-3">
              <Button
                variant="outline"
                onClick={resetAllFilters}
                className="flex-1"
              >
                Reset
              </Button>
              <Button
                variant="primary"
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 bg-primary-700"
              >
                Show Results
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default ExplorePropertiesPage
