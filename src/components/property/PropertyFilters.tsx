import React, { useState } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react'
import type { PropertyFilters } from '../../types'
import { BENGALURU_LOCALITIES } from '../../constants/localities'
import { BHK_OPTIONS, PROPERTY_TYPE_LABELS } from '../../constants/amenities'
import { Button } from '../ui/Button'
import { cn } from '../../utils'

interface PropertyFiltersProps {
  filters: PropertyFilters
  onChange: (filters: PropertyFilters) => void
  resultCount?: number
}

const EMPTY_FILTERS: PropertyFilters = {
  locality: '',
  property_type: '',
  bhk: '',
  min_rent: '',
  max_rent: '',
  availability_status: '',
}

const RENT_PRESETS = [
  { label: 'Under ₹10K',    min: 0,     max: 10000 },
  { label: '₹10K–₹20K',    min: 10000, max: 20000 },
  { label: '₹20K–₹35K',    min: 20000, max: 35000 },
  { label: 'Above ₹35K',   min: 35000, max: 999999 },
]

export const PropertyFiltersPanel: React.FC<PropertyFiltersProps> = ({
  filters, onChange, resultCount,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false)

  const set = <K extends keyof PropertyFilters>(key: K, value: PropertyFilters[K]) => {
    onChange({ ...filters, [key]: value })
  }

  const activeCount = Object.values(filters).filter(v => v !== '').length

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Locality search */}
      <div>
        <label htmlFor="filter-locality" className="block text-sm font-semibold text-stone-700 mb-2">
          Locality
        </label>
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            id="filter-locality"
            type="text"
            value={filters.locality}
            onChange={e => set('locality', e.target.value)}
            placeholder="Search locality…"
            list="locality-list"
            className="input-base pl-9 text-sm"
          />
          <datalist id="locality-list">
            {BENGALURU_LOCALITIES.map(l => <option key={l} value={l} />)}
          </datalist>
        </div>
      </div>

      {/* Property type */}
      <div>
        <p className="text-sm font-semibold text-stone-700 mb-2">Property Type</p>
        <div className="flex flex-wrap gap-2">
          {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
            <button
              key={value}
              onClick={() => set('property_type', filters.property_type === value ? '' : value as PropertyFilters['property_type'])}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                filters.property_type === value
                  ? 'bg-primary-700 text-white border-primary-700'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-primary-400 hover:text-primary-700',
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* BHK */}
      <div>
        <p className="text-sm font-semibold text-stone-700 mb-2">BHK</p>
        <div className="flex flex-wrap gap-2">
          {BHK_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => set('bhk', filters.bhk === opt.value ? '' : opt.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                filters.bhk === opt.value
                  ? 'bg-primary-700 text-white border-primary-700'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-primary-400 hover:text-primary-700',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rent range presets */}
      <div>
        <p className="text-sm font-semibold text-stone-700 mb-2">Monthly Rent</p>
        <div className="grid grid-cols-2 gap-2">
          {RENT_PRESETS.map(preset => {
            const isActive = filters.min_rent === preset.min && filters.max_rent === preset.max
            return (
              <button
                key={preset.label}
                onClick={() => {
                  if (isActive) {
                    onChange({ ...filters, min_rent: '', max_rent: '' })
                  } else {
                    onChange({ ...filters, min_rent: preset.min, max_rent: preset.max })
                  }
                }}
                className={cn(
                  'px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all duration-150',
                  isActive
                    ? 'bg-primary-700 text-white border-primary-700'
                    : 'bg-white text-stone-600 border-stone-200 hover:border-primary-400 hover:text-primary-700',
                )}
              >
                {preset.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Availability */}
      <div>
        <p className="text-sm font-semibold text-stone-700 mb-2">Availability</p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: 'AVAILABLE',   label: 'Available Now' },
            { value: 'COMING_SOON', label: 'Available Soon' },
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => set('availability_status', filters.availability_status === opt.value ? '' : opt.value as PropertyFilters['availability_status'])}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150',
                filters.availability_status === opt.value
                  ? 'bg-primary-700 text-white border-primary-700'
                  : 'bg-white text-stone-600 border-stone-200 hover:border-primary-400 hover:text-primary-700',
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear */}
      {activeCount > 0 && (
        <Button
          variant="ghost"
          size="sm"
          fullWidth
          onClick={() => onChange(EMPTY_FILTERS)}
          leftIcon={<X size={14} />}
        >
          Clear all filters ({activeCount})
        </Button>
      )}
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-64 flex-shrink-0">
        <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-card sticky top-20">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-stone-800 flex items-center gap-2">
              <SlidersHorizontal size={15} />
              Filters
              {activeCount > 0 && (
                <span className="ml-1 bg-primary-700 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {activeCount}
                </span>
              )}
            </h2>
            {resultCount !== undefined && (
              <span className="text-xs text-stone-400">{resultCount} results</span>
            )}
          </div>
          <FilterContent />
        </div>
      </aside>

      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <Button
          id="mobile-filter-btn"
          variant="outline"
          size="sm"
          onClick={() => setMobileOpen(o => !o)}
          leftIcon={<SlidersHorizontal size={15} />}
          rightIcon={activeCount > 0 ? (
            <span className="bg-primary-700 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {activeCount}
            </span>
          ) : <ChevronDown size={14} className={mobileOpen ? 'rotate-180 transition-transform' : 'transition-transform'} />}
        >
          Filters
        </Button>

        {mobileOpen && (
          <div className="mt-3 bg-white rounded-2xl p-5 border border-stone-100 shadow-card animate-slide-up">
            <FilterContent />
          </div>
        )}
      </div>
    </>
  )
}
