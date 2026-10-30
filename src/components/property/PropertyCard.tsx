import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Home, Wifi, Car, Zap, Lock } from 'lucide-react'
import type { PublicProperty } from '../../types'
import {
  formatRent, formatBHK,
  formatAvailability, truncate, cn,
} from '../../utils'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { PROPERTY_TYPE_LABELS } from '../../constants/amenities'
import { useUserAuth } from '../../hooks/useUserAuth'

interface PropertyCardProps {
  property: PublicProperty
  className?: string
  compact?: boolean
}

// Show up to 3 prominent amenity icons on the card
const FEATURED_AMENITIES: Record<string, React.ReactNode> = {
  wifi:         <Wifi size={13} />,
  parking:      <Car size={13} />,
  power_backup: <Zap size={13} />,
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, className, compact }) => {
  const navigate = useNavigate()
  const { isAuthenticated, requireAuth } = useUserAuth()

  const primaryImage = property.images.find(i => i.display_order === 0) ?? property.images[0]
  const isComing     = property.availability_status === 'COMING_SOON'
  const isOccupied   = property.availability_status === 'OCCUPIED'

  const featuredAmenities = Object.entries(FEATURED_AMENITIES)
    .filter(([key]) => property.amenities.includes(key))
    .slice(0, 3)

  const handleView = (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    requireAuth(
      () => navigate(`/properties/${property.property_ref}`),
      `/properties/${property.property_ref}`
    )
  }

  // ── Compact horizontal row variant ─────────────────────────────
  if (compact) {
    return (
      <article
        onClick={handleView}
        className={cn(
          'group flex items-center gap-3 bg-white rounded-xl border border-stone-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all duration-200 overflow-hidden cursor-pointer',
          className,
        )}
        aria-label={property.title}
      >
        {/* Thumbnail */}
        <div className="relative w-20 h-16 flex-shrink-0 bg-stone-100">
          {primaryImage ? (
            <img
              src={primaryImage.file_path}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-stone-300">
              <Home size={20} />
            </div>
          )}
          <div className="absolute top-1 left-1">
            <Badge status={property.availability_status} label="" size="sm" />
          </div>
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 py-2">
          <h3 className="text-stone-900 font-semibold text-xs leading-snug line-clamp-1 group-hover:text-primary-700 transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-stone-400 text-xs mt-0.5">
            <MapPin size={10} className="text-primary-400 flex-shrink-0" />
            <span className="truncate">{property.locality}</span>
          </div>
          <div className="flex items-center gap-1 mt-1">
            <span className="px-1.5 py-0.5 bg-stone-100 text-stone-500 text-xs rounded-full">
              {formatBHK(property.bhk)}
            </span>
            {featuredAmenities.slice(0, 2).map(([key, icon]) => (
              <span key={key} className="px-1.5 py-0.5 bg-primary-50 text-primary-600 text-xs rounded-full flex items-center">
                {icon}
              </span>
            ))}
          </div>
        </div>

        {/* Price + CTA */}
        <div className="flex-shrink-0 flex flex-col items-end gap-1.5 pr-3 py-2">
          <div className="text-right">
            <span className="text-sm font-bold text-stone-900">{formatRent(property.rent_paise)}</span>
            <span className="text-stone-400 text-xs">/mo</span>
          </div>
          <Button
            size="sm"
            variant="primary"
            onClick={handleView}
            className="text-xs px-2.5 py-1 !h-auto flex items-center gap-1"
            aria-label={`View ${property.title}`}
          >
            {!isAuthenticated && <Lock size={10} className="opacity-80" />}
            View
          </Button>
        </div>
      </article>
    )
  }

  // ── Full card variant (default) ──────────────────────────────────
  return (
    <article
      onClick={handleView}
      className={cn('card group flex flex-col h-full cursor-pointer', className)}
      aria-label={property.title}
    >
      {/* Image */}
      <div className="relative h-52 bg-stone-200 overflow-hidden flex-shrink-0">
        {primaryImage ? (
          <img
            src={primaryImage.file_path}
            alt={primaryImage.caption ?? property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-400">
            <Home size={40} />
          </div>
        )}

        {/* Availability overlay badge */}
        <div className="absolute top-3 left-3">
          <Badge
            status={property.availability_status}
            label={formatAvailability(property.availability_status)}
            size="sm"
          />
        </div>

        {/* Login required badge for unauthenticated users */}
        {!isAuthenticated && (
          <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-md text-white text-[11px] font-medium px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
            <Lock size={10} className="text-accent-400" />
            <span>Login to unlock</span>
          </div>
        )}

        {/* Image count */}
        {property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs rounded-full px-2 py-0.5 backdrop-blur-sm">
            1 / {property.images.length}
          </div>
        )}

        {/* Dimmed overlay for occupied */}
        {(isComing || isOccupied) && (
          <div className="absolute inset-0 bg-stone-900/20" aria-hidden="true" />
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1 gap-3">
        {/* Locality */}
        <div className="flex items-center gap-1.5 text-stone-500 text-xs">
          <MapPin size={13} className="text-primary-500 flex-shrink-0" />
          <span className="font-medium">{property.locality}</span>
          <span className="text-stone-300">·</span>
          <span>{property.city}</span>
        </div>

        {/* Title */}
        <h3 className="text-stone-900 font-semibold text-base leading-snug line-clamp-2 group-hover:text-primary-800 transition-colors">
          {property.title}
        </h3>

        {/* Type / BHK tags */}
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-xs rounded-full font-medium">
            {PROPERTY_TYPE_LABELS[property.property_type] ?? property.property_type}
          </span>
          <span className="px-2.5 py-1 bg-stone-100 text-stone-600 text-xs rounded-full font-medium">
            {formatBHK(property.bhk)}
          </span>
          {featuredAmenities.map(([key, icon]) => (
            <span
              key={key}
              className="px-2.5 py-1 bg-primary-50 text-primary-700 text-xs rounded-full font-medium flex items-center gap-1"
            >
              {icon}
            </span>
          ))}
        </div>

        {/* Description excerpt */}
        <p className="text-stone-500 text-sm leading-relaxed line-clamp-2 flex-1">
          {truncate(property.description, 110)}
        </p>

        {/* Price & CTA */}
        <div className="flex items-end justify-between pt-1 border-t border-stone-100">
          <div>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-stone-900">{formatRent(property.rent_paise)}</span>
              <span className="text-stone-400 text-xs">/mo</span>
            </div>
            {property.deposit_paise && (
              <p className="text-xs text-stone-400 mt-0.5">
                Deposit: {formatRent(property.deposit_paise)}
              </p>
            )}
          </div>

          <Button
            size="sm"
            variant="primary"
            onClick={handleView}
            leftIcon={!isAuthenticated ? <Lock size={13} /> : undefined}
            aria-label={`View details for ${property.title}`}
          >
            {isAuthenticated ? 'View Details' : 'Unlock & View'}
          </Button>
        </div>
      </div>
    </article>
  )
}
