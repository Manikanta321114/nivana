import React, { useState, useMemo } from 'react'
import { LayoutGrid, Map as MapIcon, Layers, ChevronDown, ChevronUp } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { PropertyCard } from '../../components/property/PropertyCard'
import { PropertyCardSkeleton, EmptyState } from '../../components/ui/States'
import { PropertyFiltersPanel } from '../../components/property/PropertyFilters'
import { MapView } from '../../components/property/MapView'
import type { PropertyFilters } from '../../types'
import { DEMO_PROPERTIES } from '../../constants/demoProperties'
import { cn } from '../../utils'
import { Button } from '../../components/ui/Button'

const EMPTY_FILTERS: PropertyFilters = {
  locality: '',
  property_type: '',
  bhk: '',
  min_rent: '',
  max_rent: '',
  availability_status: '',
}

type ViewMode = 'split' | 'grid' | 'map'

export const ExplorePropertiesPage: React.FC = () => {
  const [searchParams] = useSearchParams()

  // Default to 'split' so map is displayed above the listings when opened!
  const [viewMode, setViewMode] = useState<ViewMode>('split')
  const [mapCollapsed, setMapCollapsed] = useState(false)
  const [isLoading] = useState(false)
  const [highlightedId, setHighlightedId] = useState<string | undefined>()

  const [filters, setFilters] = useState<PropertyFilters>({
    ...EMPTY_FILTERS,
    locality: searchParams.get('locality') ?? '',
    property_type: (searchParams.get('type') ?? '') as PropertyFilters['property_type'],
  })

  // Filter demo properties client-side
  const filteredProperties = useMemo(() => {
    return DEMO_PROPERTIES.filter(p => {
      if (p.listing_status !== 'PUBLISHED') return false
      if (filters.locality && !p.locality.toLowerCase().includes(filters.locality.toLowerCase())) return false
      if (filters.property_type && p.property_type !== filters.property_type) return false
      if (filters.bhk !== '' && p.bhk !== Number(filters.bhk)) return false
      if (filters.min_rent !== '' && p.rent_paise < Number(filters.min_rent) * 100) return false
      if (filters.max_rent !== '' && p.rent_paise > Number(filters.max_rent) * 100) return false
      if (filters.availability_status && p.availability_status !== filters.availability_status) return false
      return true
    })
  }, [filters])

  return (
    <div className="pt-16 min-h-screen bg-bg-base">
      {/* Page Header */}
      <div className="bg-primary-950 text-white py-8 border-b border-primary-900">
        <div className="page-container">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-display font-bold tracking-tight">
                  Explore Rental Homes
                </h1>
                <span className="bg-primary-800 text-accent-300 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-primary-700">
                  {filteredProperties.length} Verified Homes
                </span>
              </div>
              <p className="text-white/70 text-xs sm:text-sm mt-1">
                Interactive map positioned above: locate your position, click any house symbol for preview block, or click for complete details.
              </p>
            </div>

            {/* View Mode Controls */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <div className="bg-white/10 backdrop-blur-md p-1 rounded-xl flex gap-1 border border-white/15" role="group" aria-label="View mode">
                <button
                  type="button"
                  id="view-split-btn"
                  onClick={() => {
                    setViewMode('split')
                    setMapCollapsed(false)
                  }}
                  aria-pressed={viewMode === 'split'}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    viewMode === 'split'
                      ? 'bg-white text-primary-950 shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10',
                  )}
                >
                  <Layers size={13} /> Map Above
                </button>
                <button
                  type="button"
                  id="view-grid-btn"
                  onClick={() => setViewMode('grid')}
                  aria-pressed={viewMode === 'grid'}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    viewMode === 'grid'
                      ? 'bg-white text-primary-950 shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10',
                  )}
                >
                  <LayoutGrid size={13} /> Grid Only
                </button>
                <button
                  type="button"
                  id="view-map-btn"
                  onClick={() => setViewMode('map')}
                  aria-pressed={viewMode === 'map'}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all',
                    viewMode === 'map'
                      ? 'bg-white text-primary-950 shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10',
                  )}
                >
                  <MapIcon size={13} /> Full Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-6 space-y-6">

        {/* ── MAP POSITIONED ABOVE ──────────────────────────────────── */}
        {viewMode !== 'grid' && (
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                <MapIcon size={13} className="text-primary-600" />
                Bengaluru Geolocation Map (House Symbols & Current Location)
              </span>

              {viewMode === 'split' && (
                <button
                  type="button"
                  onClick={() => setMapCollapsed(prev => !prev)}
                  className="text-xs text-primary-700 hover:text-primary-800 font-semibold flex items-center gap-1 transition-colors"
                >
                  {mapCollapsed ? (
                    <>
                      <ChevronDown size={14} /> Expand Map Above
                    </>
                  ) : (
                    <>
                      <ChevronUp size={14} /> Minimize Map Above
                    </>
                  )}
                </button>
              )}
            </div>

            {!mapCollapsed && (
              <MapView
                properties={filteredProperties}
                highlightedId={highlightedId}
                onMarkerClick={p => setHighlightedId(p.id)}
                className={
                  viewMode === 'map'
                    ? 'h-[calc(100vh-220px)] min-h-[550px]'
                    : 'h-[440px] w-full'
                }
                initialLocate={true}
              />
            )}
          </div>
        )}

        {/* ── FILTERS AND PROPERTY LISTINGS ─────────────────────────── */}
        {viewMode !== 'map' && (
          <div className="flex flex-col lg:flex-row gap-6 pt-2">
            {/* Filters panel */}
            <div className="w-full lg:w-72 flex-shrink-0">
              <PropertyFiltersPanel
                filters={filters}
                onChange={setFilters}
                resultCount={filteredProperties.length}
              />
            </div>

            {/* Main content grid */}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <PropertyCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredProperties.length === 0 ? (
                <EmptyState
                  icon="🏘️"
                  title="No properties found"
                  description="Try adjusting your filters, clearing rent constraints, or choosing another locality."
                  action={
                    <Button variant="outline" size="sm" onClick={() => setFilters(EMPTY_FILTERS)}>
                      Clear filters
                    </Button>
                  }
                />
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                      Showing {filteredProperties.length} Properties
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 stagger">
                    {filteredProperties.map((p, i) => (
                      <div
                        key={p.id}
                        className="animate-slide-up"
                        style={{ animationDelay: `${i * 40}ms` }}
                        onMouseEnter={() => setHighlightedId(p.id)}
                      >
                        <PropertyCard
                          property={p}
                          className={highlightedId === p.id ? 'ring-2 ring-primary-500 ring-offset-2' : ''}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExplorePropertiesPage
