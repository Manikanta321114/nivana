import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Home, Wifi, Car, Zap, Phone, ArrowRight, ShieldCheck, Sparkles, Layers } from 'lucide-react'
import type { PublicProperty } from '../../types'
import {
  formatRent, formatBHK,
  formatAvailability, truncate, cn,
} from '../../utils'
import { Button } from '../ui/Button'
import { PROPERTY_TYPE_LABELS } from '../../constants/amenities'
import { RequestCallbackModal } from './RequestCallbackModal'

interface PropertyCardProps {
  property: PublicProperty
  className?: string
  compact?: boolean
  onSelect?: (property: PublicProperty) => void
}

const FEATURED_AMENITIES: Record<string, { icon: React.ReactNode; label: string }> = {
  wifi:         { icon: <Wifi size={12} />, label: 'WiFi' },
  parking:      { icon: <Car size={12} />, label: 'Parking' },
  power_backup: { icon: <Zap size={12} />, label: 'Backup' },
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  className,
  compact,
  onSelect,
}) => {
  const navigate = useNavigate()
  const [modalOpen, setModalOpen] = useState(false)

  const primaryImage = property.images.find(i => i.display_order === 0) ?? property.images[0]
  const isComing = property.availability_status === 'COMING_SOON'
  const isOccupied = property.availability_status === 'OCCUPIED'

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(property)
    }
    navigate(`/properties/${property.property_ref}`)
  }

  const handleCallbackClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setModalOpen(true)
  }

  // ── Compact row variant ──────────────────────────────────────────
  if (compact) {
    return (
      <>
        <article
          onClick={handleCardClick}
          className={cn(
            'group flex items-center gap-3.5 bg-white rounded-2xl border border-stone-200/80 shadow-card hover:shadow-card-hover hover:border-primary-300 transition-all duration-200 overflow-hidden cursor-pointer p-2.5',
            className,
          )}
          aria-label={property.title}
        >
          {/* Thumbnail */}
          <div className="relative w-24 h-20 flex-shrink-0 bg-stone-100 rounded-xl overflow-hidden">
            {primaryImage ? (
              <img
                src={primaryImage.file_path}
                alt={property.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-stone-300">
                <Home size={22} />
              </div>
            )}
            <div className="absolute top-1 left-1">
              <span className="text-[10px] font-bold bg-primary-700 text-white px-1.5 py-0.5 rounded-full shadow-sm">
                {formatBHK(property.bhk)}
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-0.5">
              <MapPin size={11} className="text-primary-600 flex-shrink-0" />
              <span className="truncate font-medium">{property.locality}</span>
            </div>
            <h3 className="text-stone-900 font-bold text-sm leading-snug line-clamp-1 group-hover:text-primary-700 transition-colors">
              {property.title}
            </h3>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-base font-extrabold text-stone-900">
                {formatRent(property.rent_paise)}
              </span>
              <span className="text-stone-400 text-xs">/mo</span>
            </div>
          </div>

          {/* Action */}
          <div className="flex-shrink-0 pr-1">
            <Button
              size="sm"
              variant="outline"
              onClick={handleCallbackClick}
              className="text-xs px-2.5 py-1.5 !h-auto border-stone-300 hover:border-primary-600 hover:text-primary-800"
            >
              Callback
            </Button>
          </div>
        </article>

        <RequestCallbackModal
          property={property}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      </>
    )
  }

  // ── Full Card Variant (Grid) ─────────────────────────────────────
  return (
    <>
      <article
        onClick={handleCardClick}
        className={cn(
          'card group flex flex-col h-full cursor-pointer bg-white rounded-2xl border border-stone-200/90 shadow-card hover:shadow-card-hover transition-all duration-300',
          className,
        )}
        aria-label={property.title}
      >
        {/* Image Container with Badges */}
        <div className="relative h-56 bg-stone-100 overflow-hidden flex-shrink-0 rounded-t-2xl">
          {primaryImage ? (
            <img
              src={primaryImage.file_path}
              alt={primaryImage.caption ?? property.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300 bg-stone-100">
              <Home size={44} />
            </div>
          )}

          {/* Gradient overlay for text contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

          {/* Top badges: Verified & Availability */}
          <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
            <span className="bg-primary-900/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/20">
              <ShieldCheck size={12} className="text-secondary-400" />
              Verified
            </span>
            <span className="bg-white/95 backdrop-blur-md text-stone-800 text-[11px] font-semibold px-2.5 py-1 rounded-full shadow-sm">
              {formatAvailability(property.availability_status)}
            </span>
          </div>

          {/* Featured Gold Badge or Type */}
          <div className="absolute top-3 right-3">
            <span className="bg-accent-500 text-stone-950 font-bold text-[11px] px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles size={11} className="text-stone-950 fill-stone-950" />
              {PROPERTY_TYPE_LABELS[property.property_type] ?? property.property_type}
            </span>
          </div>

          {/* Photo Count Pill */}
          {property.images.length > 0 && (
            <div className="absolute bottom-3 right-3 bg-stone-900/75 backdrop-blur-md text-white text-[11px] font-medium rounded-full px-2.5 py-0.5 flex items-center gap-1">
              <Layers size={11} />
              <span>{property.images.length} photos</span>
            </div>
          )}

          {/* Locality Overlay at Bottom Left of Image */}
          <div className="absolute bottom-3 left-3 text-white flex items-center gap-1.5 text-xs font-semibold drop-shadow-md">
            <MapPin size={13} className="text-secondary-400" />
            <span>{property.locality}, Bengaluru</span>
          </div>

          {/* Dimmed overlay for occupied */}
          {(isComing || isOccupied) && (
            <div className="absolute inset-0 bg-stone-950/40 backdrop-blur-[1px] flex items-center justify-center">
              <span className="bg-white text-stone-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                {formatAvailability(property.availability_status)}
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 flex flex-col flex-1 justify-between gap-4">
          <div>
            {/* Title */}
            <h3 className="text-stone-900 font-bold text-base leading-snug line-clamp-1 group-hover:text-primary-700 transition-colors">
              {property.title}
            </h3>

            {/* Spec chips */}
            <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
              <span className="px-2.5 py-1 bg-primary-50 text-primary-800 text-xs rounded-xl font-bold border border-primary-200/60">
                {formatBHK(property.bhk)}
              </span>
              <span className="px-2.5 py-1 bg-stone-100 text-stone-700 text-xs rounded-xl font-medium border border-stone-200">
                Zero Brokerage
              </span>
              {Object.entries(FEATURED_AMENITIES)
                .filter(([key]) => property.amenities.includes(key))
                .slice(0, 2)
                .map(([key, item]) => (
                  <span
                    key={key}
                    className="px-2 py-1 bg-stone-100 text-stone-600 text-xs rounded-xl font-medium flex items-center gap-1 border border-stone-200"
                  >
                    {item.icon} {item.label}
                  </span>
                ))}
            </div>

            {/* Brief description */}
            <p className="text-stone-500 text-xs leading-relaxed line-clamp-2 mt-2.5">
              {truncate(property.description, 100)}
            </p>
          </div>

          {/* Pricing & Dual Action Buttons */}
          <div className="pt-3 border-t border-stone-100">
            <div className="flex items-baseline justify-between mb-3">
              <div>
                <span className="text-xl font-black text-stone-900 tracking-tight">
                  {formatRent(property.rent_paise)}
                </span>
                <span className="text-stone-400 text-xs font-medium"> /month</span>
              </div>
              {property.deposit_paise && (
                <span className="text-xs text-stone-500 font-medium">
                  Deposit: {formatRent(property.deposit_paise)}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleCallbackClick}
                className="text-xs font-semibold border-stone-300 text-stone-700 hover:border-primary-700 hover:text-primary-800 hover:bg-primary-50"
                leftIcon={<Phone size={13} className="text-primary-600" />}
              >
                Callback
              </Button>
              <Button
                size="sm"
                variant="primary"
                onClick={handleCardClick}
                className="text-xs font-semibold bg-primary-700 hover:bg-primary-800 text-white"
                rightIcon={<ArrowRight size={13} />}
              >
                View Details
              </Button>
            </div>
          </div>
        </div>
      </article>

      {/* Quick Inquiry / Callback Modal */}
      <RequestCallbackModal
        property={property}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
