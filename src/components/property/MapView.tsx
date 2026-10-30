import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import type { PublicProperty } from '../../types'
import { formatRent, formatBHK } from '../../utils'
import { useNavigate } from 'react-router-dom'
import { Crosshair, MapPin, X, ArrowRight, Home, Lock } from 'lucide-react'
import { useUserAuth } from '../../hooks/useUserAuth'
import 'leaflet/dist/leaflet.css'

const Map = MapContainer as unknown as React.ComponentType<any>
const Tiles = TileLayer as unknown as React.ComponentType<any>
const MapMarker = Marker as unknown as React.ComponentType<any>
const MapPopup = Popup as unknown as React.ComponentType<any>

// Fix Leaflet default icon paths broken by bundlers
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// ── House Symbol / Mark Leaflet Marker ─────────────────────────────
const createHouseIcon = (property: PublicProperty, isHighlighted = false) => {
  const rent = formatRent(property.rent_paise).replace('₹', '₹').replace(',000', 'K')
  const activeClass = isHighlighted ? 'active' : ''
  return L.divIcon({
    html: `
      <div class="house-pin-container ${activeClass}">
        <div class="house-pin-bubble">
          <span class="house-symbol-icon">
            <svg viewBox="0 0 24 24" width="11" height="11" fill="white" stroke="white" stroke-width="0.5">
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
            </svg>
          </span>
          <span>${rent}/mo</span>
        </div>
        <div class="house-pin-arrow"></div>
      </div>
    `,
    className: 'house-marker-wrapper',
    iconSize: [85, 34],
    iconAnchor: [42, 34],
    popupAnchor: [0, -34],
  })
}

// ── Current User Location Marker ───────────────────────────────────
const createUserLocationIcon = () => {
  return L.divIcon({
    html: `
      <div class="current-user-marker">
        <div class="current-user-radar"></div>
        <div class="current-user-dot"></div>
      </div>
    `,
    className: 'current-user-wrapper',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

// ── Selected Location Pin ──────────────────────────────────────────
const createSelectedLocationIcon = () => {
  return L.divIcon({
    html: `
      <div class="selected-location-pin">
        <span>📍 Selected</span>
      </div>
    `,
    className: 'selected-location-wrapper',
    iconSize: [80, 24],
    iconAnchor: [40, 24],
  })
}

// ── Sync Map Bounds & View ─────────────────────────────────────────
interface MapBoundsSyncProps {
  properties: PublicProperty[]
  userLocation: [number, number] | null
  selectedLocation: [number, number] | null
}

const MapBoundsSync: React.FC<MapBoundsSyncProps> = ({ properties, userLocation, selectedLocation }) => {
  const map = useMap()

  useEffect(() => {
    // If user clicked or located themselves, prioritize keeping focus
    if (userLocation && !selectedLocation) {
      map.flyTo(userLocation, 14, { duration: 1.2 })
      return
    }

    if (selectedLocation) {
      map.flyTo(selectedLocation, 14, { duration: 1.2 })
      return
    }

    const withCoords = properties.filter(p => p.approx_lat && p.approx_lng)
    if (withCoords.length === 0) return

    const bounds = L.latLngBounds(
      withCoords.map(p => [p.approx_lat!, p.approx_lng!] as [number, number])
    )
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
  }, [properties, userLocation, selectedLocation, map])

  return null
}

// ── Map Click Event Listener for Location Selection ────────────────
interface MapClickSelectorProps {
  onSelectLocation: (coords: [number, number]) => void
}

const MapClickSelector: React.FC<MapClickSelectorProps> = ({ onSelectLocation }) => {
  useMapEvents({
    click(e) {
      onSelectLocation([e.latlng.lat, e.latlng.lng])
    },
  })
  return null
}

// ── Map View Props ────────────────────────────────────────────────
interface MapViewProps {
  properties: PublicProperty[]
  highlightedId?: string
  onMarkerClick?: (property: PublicProperty) => void
  onLocationSelect?: (coords: [number, number] | null) => void
  className?: string
  initialLocate?: boolean
}

export const MapView: React.FC<MapViewProps> = ({
  properties,
  highlightedId,
  onMarkerClick,
  onLocationSelect,
  className,
  initialLocate = false,
}) => {
  const navigate = useNavigate()
  const { isAuthenticated, requireAuth } = useUserAuth()
  const propertiesWithCoords = properties.filter(p => p.approx_lat && p.approx_lng)

  const handleNavigateProperty = (propertyRef: string) => {
    requireAuth(
      () => navigate(`/properties/${propertyRef}`),
      `/properties/${propertyRef}`
    )
  }

  // Default Bengaluru centre (Vidhana Soudha / MG Road)
  const defaultCentre: [number, number] = [12.9716, 77.5946]

  // State
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<[number, number] | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [locationStatus, setLocationStatus] = useState<string | null>(null)
  const [activeProperty, setActiveProperty] = useState<PublicProperty | null>(null)

  // Sync activeProperty with highlightedId from parent
  useEffect(() => {
    if (highlightedId) {
      const match = properties.find(p => p.id === highlightedId)
      if (match) setActiveProperty(match)
    }
  }, [highlightedId, properties])

  // Geolocation detector
  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser.')
      return
    }

    setIsLocating(true)
    setLocationStatus('Locating your position in Bengaluru…')

    navigator.geolocation.getCurrentPosition(
      pos => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude]
        setUserLocation(coords)
        setSelectedLocation(null)
        setIsLocating(false)
        setLocationStatus('Centered on your current location')
        onLocationSelect?.(coords)
        setTimeout(() => setLocationStatus(null), 4000)
      },
      err => {
        setIsLocating(false)
        setLocationStatus('Could not detect location. (Permission denied or unavailable)')
        setTimeout(() => setLocationStatus(null), 4000)
        console.warn('Geolocation error:', err.message)
      },
      { timeout: 8000, enableHighAccuracy: true }
    )
  }

  // Trigger on initial mount if requested
  useEffect(() => {
    if (initialLocate) {
      handleDetectLocation()
    }
  }, [initialLocate])

  const handleMapClick = (coords: [number, number]) => {
    setSelectedLocation(coords)
    onLocationSelect?.(coords)
    setLocationStatus(`Selected map point: ${coords[0].toFixed(3)}, ${coords[1].toFixed(3)}`)
    setTimeout(() => setLocationStatus(null), 3500)
  }

  const handlePropertyMarkerClick = (property: PublicProperty) => {
    setActiveProperty(property)
    onMarkerClick?.(property)
  }

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-stone-200/90 shadow-card bg-stone-100 ${className ?? ''}`}>
      {/* Top Banner Notice */}
      <div className="absolute top-0 left-0 right-0 z-[1000] bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-stone-700">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="font-semibold text-primary-950">Interactive Rental Map</span>
          <span className="text-stone-400">|</span>
          <span className="text-stone-500 hidden sm:inline">
            Click any <strong className="text-stone-700">House Symbol</strong> to view its preview block, or click map to select location.
          </span>
        </div>

        <div className="flex items-center gap-2">
          {locationStatus && (
            <span className="text-primary-800 bg-primary-50 px-2.5 py-0.5 rounded-full font-medium border border-primary-200 animate-fade-in">
              {locationStatus}
            </span>
          )}

          {/* Current Location Trigger Button */}
          <button
            type="button"
            onClick={handleDetectLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-semibold bg-primary-700 hover:bg-primary-800 text-white shadow-sm transition-all duration-150 active:scale-95"
            title="Center map on your current location"
          >
            <Crosshair size={13} className={isLocating ? 'animate-spin' : ''} />
            {isLocating ? 'Locating…' : 'Use My Current Location'}
          </button>
        </div>
      </div>

      {/* Main Leaflet Map */}
      <Map
        center={userLocation || defaultCentre}
        zoom={userLocation ? 14 : 12}
        style={{ height: '100%', minHeight: '460px', width: '100%' }}
        aria-label="Interactive Bengaluru property rental map"
      >
        <Tiles
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Sync bounds & handle clicks */}
        <MapBoundsSync
          properties={propertiesWithCoords}
          userLocation={userLocation}
          selectedLocation={selectedLocation}
        />
        <MapClickSelector onSelectLocation={handleMapClick} />

        {/* User Current Location Marker */}
        {userLocation && (
          <MapMarker position={userLocation} icon={createUserLocationIcon()}>
            <MapPopup>
              <div className="p-2 text-center text-xs">
                <p className="font-bold text-blue-700">📍 You Are Here</p>
                <p className="text-stone-500 mt-0.5">Your current detected location</p>
              </div>
            </MapPopup>
          </MapMarker>
        )}

        {/* User Selected Point on Map */}
        {selectedLocation && (
          <MapMarker position={selectedLocation} icon={createSelectedLocationIcon()}>
            <MapPopup>
              <div className="p-2 text-center text-xs">
                <p className="font-bold text-stone-800">Selected Location</p>
                <p className="text-stone-500 font-mono mt-0.5">
                  {selectedLocation[0].toFixed(4)}, {selectedLocation[1].toFixed(4)}
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedLocation(null)}
                  className="mt-1 text-[11px] text-red-600 hover:underline"
                >
                  Clear Selection
                </button>
              </div>
            </MapPopup>
          </MapMarker>
        )}

        {/* House Symbol Markers for Properties */}
        {propertiesWithCoords.map(property => {
          const isSelected = activeProperty?.id === property.id
          return (
            <MapMarker
              key={property.id}
              position={[property.approx_lat!, property.approx_lng!]}
              icon={createHouseIcon(property, isSelected)}
              eventHandlers={{
                click: () => handlePropertyMarkerClick(property),
              }}
            >
              {/* In-Map Popup Block */}
              <MapPopup minWidth={240} maxWidth={280}>
                <div
                  className="cursor-pointer group"
                  onClick={() => handleNavigateProperty(property.property_ref)}
                >
                  {property.images[0] && (
                    <div className="relative">
                      <img
                        src={property.images[0].file_path}
                        alt={property.title}
                        className="w-full h-32 object-cover rounded-t-xl"
                        loading="lazy"
                      />
                      <span className="absolute top-2 left-2 bg-stone-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {formatBHK(property.bhk)}
                      </span>
                    </div>
                  )}

                  <div className="p-3 bg-white rounded-b-xl space-y-1.5">
                    <p className="text-[11px] font-medium text-stone-500 flex items-center gap-1">
                      <MapPin size={11} className="text-primary-600" />
                      {property.locality}
                    </p>
                    <p className="font-bold text-stone-900 text-xs leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
                      {property.title}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-stone-100">
                      <div>
                        <span className="text-xs font-bold text-primary-800">
                          {formatRent(property.rent_paise)}
                        </span>
                        <span className="text-[10px] text-stone-400">/mo</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary-700 group-hover:translate-x-0.5 transition-transform">
                        {!isAuthenticated && <Lock size={10} />}
                        {isAuthenticated ? 'Complete Details →' : 'Login to View →'}
                      </span>
                    </div>
                  </div>
                </div>
              </MapPopup>
            </MapMarker>
          )
        })}
      </Map>

      {/* ── Floated Interactive Property Preview Block ──────────────── */}
      {activeProperty && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-4 z-[1000] sm:max-w-md w-auto bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-stone-200/90 animate-slide-up">
          <div className="flex items-start justify-between gap-2 pb-2 mb-2 border-b border-stone-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-primary-800">
              <Home size={14} className="text-primary-600" />
              <span>Selected House on Map</span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold ml-1">
                Verified
              </span>
            </div>
            <button
              type="button"
              onClick={() => setActiveProperty(null)}
              className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              aria-label="Close preview block"
            >
              <X size={15} />
            </button>
          </div>

          <div
            onClick={() => handleNavigateProperty(activeProperty.property_ref)}
            className="flex gap-3 cursor-pointer group"
          >
            {activeProperty.images[0] && (
              <img
                src={activeProperty.images[0].file_path}
                alt={activeProperty.title}
                className="w-24 h-24 sm:w-28 sm:h-24 object-cover rounded-xl flex-shrink-0 group-hover:opacity-90 transition-opacity"
              />
            )}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <p className="text-[11px] text-stone-500 font-medium">{activeProperty.locality}, Bengaluru</p>
                <h4 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-primary-700 transition-colors line-clamp-2 leading-snug">
                  {activeProperty.title}
                </h4>
              </div>

              <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                <span className="text-sm font-bold text-primary-800">
                  {formatRent(activeProperty.rent_paise)}
                  <span className="text-xs text-stone-400 font-normal">/mo</span>
                </span>
                <span className="text-xs font-semibold text-primary-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  {!isAuthenticated && <Lock size={12} />}
                  {isAuthenticated ? 'View Complete Details' : 'Login to Unlock'} <ArrowRight size={13} />
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MapView
