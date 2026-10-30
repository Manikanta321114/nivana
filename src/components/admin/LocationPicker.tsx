import React, { useState, useRef } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Crosshair, RefreshCw, AlertCircle, CheckCircle2 } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet icons
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

const Map    = MapContainer as unknown as React.ComponentType<any>
const Tiles  = TileLayer   as unknown as React.ComponentType<any>
const Pin    = Marker      as unknown as React.ComponentType<any>

// Bengaluru city centre default
const BENGALURU_CENTER: [number, number] = [12.9716, 77.5946]

// ── Click handler inside the map ──────────────────────────────────
const MapClickHandler: React.FC<{ onPick: (lat: number, lng: number) => void }> = ({ onPick }) => {
  useMapEvents({ click(e) { onPick(e.latlng.lat, e.latlng.lng) } })
  return null
}

// ── Props ─────────────────────────────────────────────────────────
export interface PickedLocation {
  lat: number
  lng: number
  accuracy?: number   // metres, GPS only
  source: 'gps' | 'manual' | 'map_click'
}

interface LocationPickerProps {
  value: PickedLocation | null
  onChange: (loc: PickedLocation | null) => void
}

export const LocationPicker: React.FC<LocationPickerProps> = ({ value, onChange }) => {
  const [locating, setLocating]   = useState(false)
  const [gpsError, setGpsError]   = useState<string | null>(null)
  const mapRef = useRef<any>(null)

  const markerPos: [number, number] | null = value ? [value.lat, value.lng] : null

  // ── GPS ─────────────────────────────────────────────────────────
  const useMyLocation = () => {
    if (!navigator.geolocation) {
      setGpsError('Geolocation is not supported by your browser.')
      return
    }
    setLocating(true)
    setGpsError(null)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const loc: PickedLocation = {
          lat: parseFloat(pos.coords.latitude.toFixed(6)),
          lng: parseFloat(pos.coords.longitude.toFixed(6)),
          accuracy: Math.round(pos.coords.accuracy),
          source: 'gps',
        }
        onChange(loc)
        setLocating(false)
        // fly map
        if (mapRef.current) mapRef.current.flyTo([loc.lat, loc.lng], 16, { duration: 1 })
      },
      err => {
        setGpsError(
          err.code === 1
            ? 'Location permission denied. Please allow location access in your browser.'
            : 'Could not determine your location. Try again or pin it on the map.',
        )
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 12000 },
    )
  }

  // ── Map click ───────────────────────────────────────────────────
  const handleMapClick = (lat: number, lng: number) => {
    onChange({
      lat: parseFloat(lat.toFixed(6)),
      lng: parseFloat(lng.toFixed(6)),
      source: 'map_click',
    })
  }

  // ── Manual input ─────────────────────────────────────────────────
  const handleManualChange = (field: 'lat' | 'lng', raw: string) => {
    const num = parseFloat(raw)
    if (isNaN(num)) return
    const updated: PickedLocation = {
      lat: value?.lat ?? 0,
      lng: value?.lng ?? 0,
      source: 'manual',
      ...{ [field]: parseFloat(num.toFixed(6)) },
    }
    onChange(updated)
    if (mapRef.current) mapRef.current.flyTo([updated.lat, updated.lng], 16, { duration: 0.8 })
  }

  const clear = () => onChange(null)

  return (
    <div className="space-y-4">
      {/* GPS button */}
      <div className="flex flex-wrap gap-3 items-center">
        <button
          type="button"
          disabled={locating}
          onClick={useMyLocation}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition-all disabled:opacity-60 shadow-sm"
        >
          {locating
            ? <RefreshCw size={15} className="animate-spin" />
            : <Crosshair size={15} />}
          {locating ? 'Detecting location…' : 'Use My Current Location'}
        </button>
        {value && (
          <button
            type="button"
            onClick={clear}
            className="text-xs text-stone-400 hover:text-red-500 underline transition-colors"
          >
            Clear pin
          </button>
        )}
        <p className="text-xs text-stone-400 ml-auto">or click anywhere on the map to pin</p>
      </div>

      {/* GPS error */}
      {gpsError && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl p-3">
          <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Success / accuracy info */}
      {value?.source === 'gps' && value.accuracy != null && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-xl px-3 py-2">
          <CheckCircle2 size={13} />
          <span>GPS fix — accuracy ≈ {value.accuracy} m</span>
        </div>
      )}

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm" style={{ height: 280 }}>
        <Map
          center={markerPos ?? BENGALURU_CENTER}
          zoom={markerPos ? 16 : 12}
          style={{ height: '100%', width: '100%' }}
          ref={mapRef}
        >
          <Tiles
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          />
          <MapClickHandler onPick={handleMapClick} />
          {markerPos && <Pin position={markerPos} />}
        </Map>
      </div>

      {/* Manual lat/lng inputs */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1 uppercase tracking-wide">
            Latitude
          </label>
          <input
            type="number"
            step="0.000001"
            placeholder="e.g. 12.971598"
            value={value?.lat ?? ''}
            onChange={e => handleManualChange('lat', e.target.value)}
            className="input-base text-sm font-mono"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-600 mb-1 uppercase tracking-wide">
            Longitude
          </label>
          <input
            type="number"
            step="0.000001"
            placeholder="e.g. 77.594562"
            value={value?.lng ?? ''}
            onChange={e => handleManualChange('lng', e.target.value)}
            className="input-base text-sm font-mono"
          />
        </div>
      </div>

      {/* Coords summary */}
      {value && (
        <div className="flex items-center gap-2 text-xs text-stone-500 bg-stone-50 rounded-xl px-3 py-2 border border-stone-100">
          <MapPin size={12} className="text-primary-500 flex-shrink-0" />
          <span className="font-mono">{value.lat}, {value.lng}</span>
          <span className="ml-auto text-stone-400 capitalize">via {value.source.replace('_', ' ')}</span>
        </div>
      )}
    </div>
  )
}
