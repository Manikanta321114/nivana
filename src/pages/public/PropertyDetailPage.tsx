import React from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  MapPin, IndianRupee, Calendar, Home, ArrowLeft,
  Tag, CheckCircle, Phone, Lock,
} from 'lucide-react'
import { DEMO_PROPERTIES } from '../../constants/demoProperties'
import { PropertyGallery } from '../../components/property/PropertyGallery'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/States'
import { MapView } from '../../components/property/MapView'
import { useUserAuth } from '../../hooks/useUserAuth'
import {
  formatRent, formatBHK, formatAvailability,
} from '../../utils'
import { AMENITIES, PROPERTY_TYPE_LABELS } from '../../constants/amenities'

export const PropertyDetailPage: React.FC = () => {
  const { propertyRef } = useParams<{ propertyRef: string }>()
  const { isAuthenticated, openLoginModal } = useUserAuth()

  const property = DEMO_PROPERTIES.find(p => p.property_ref === propertyRef)

  if (!property) {
    return (
      <div className="pt-24 page-container py-16 text-center">
        <div className="text-6xl mb-4">🏠</div>
        <h1 className="text-2xl font-bold text-stone-800 mb-2">Property not found</h1>
        <p className="text-stone-500 mb-6">The property you're looking for doesn't exist or has been removed.</p>
        <Link to="/properties"><Button variant="primary">Browse all properties</Button></Link>
      </div>
    )
  }

  const displayedAmenities = property.amenities
    .map(a => AMENITIES.find(opt => opt.value === a))
    .filter(Boolean)

  const hasMapCoords = property.approx_lat && property.approx_lng

  return (
    <div className="pt-16">
      {/* Breadcrumb */}
      <div className="bg-stone-50 border-b border-stone-100">
        <div className="page-container py-3 flex items-center gap-2 text-sm text-stone-500">
          <Link to="/properties" className="hover:text-primary-700 flex items-center gap-1 transition-colors">
            <ArrowLeft size={14} /> Explore Properties
          </Link>
          <span className="text-stone-300">/</span>
          <span className="text-stone-700 truncate max-w-xs">{property.title}</span>
        </div>
      </div>

      <div className="page-container py-8">
        {!isAuthenticated && (
          <div className="mb-6 bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 text-white rounded-2xl p-4 sm:p-5 shadow-lg border border-primary-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-slide-up">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0 text-accent-300">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-sm sm:text-base">Login required to view verified owner & booking details</h3>
                <p className="text-xs text-white/80 mt-0.5">Please sign in to schedule visits, request free callbacks, and see full photos.</p>
              </div>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => openLoginModal(`/properties/${property.property_ref}`)}
              className="whitespace-nowrap self-stretch sm:self-auto bg-white text-primary-900 hover:bg-stone-100 font-semibold"
            >
              Sign In to Unlock
            </Button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── Left: Main Content ─────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <PropertyGallery images={property.images} title={property.title} />

            {/* Header */}
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge
                  status={property.availability_status}
                  label={formatAvailability(property.availability_status)}
                />
                <Badge status={property.listing_status} />
              </div>
              <h1 className="text-2xl font-display font-bold text-stone-900 mb-2">{property.title}</h1>
              <div className="flex items-center gap-2 text-stone-500 text-sm">
                <MapPin size={15} className="text-primary-500" />
                <span>{property.locality}, Bengaluru</span>
              </div>
              <p className="text-xs text-stone-400 mt-1">Property ID: {property.property_ref}</p>
            </div>

            {/* Quick facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Home,     label: 'Type',        value: PROPERTY_TYPE_LABELS[property.property_type] ?? property.property_type },
                { icon: Tag,      label: 'BHK',         value: formatBHK(property.bhk) },
                { icon: IndianRupee, label: 'Rent',      value: formatRent(property.rent_paise) + '/mo' },
                { icon: CheckCircle, label: 'Availability', value: formatAvailability(property.availability_status) },
              ].map(fact => (
                <div key={fact.label} className="bg-stone-50 rounded-2xl p-4">
                  <fact.icon size={16} className="text-primary-600 mb-2" />
                  <p className="text-xs text-stone-400 mb-0.5">{fact.label}</p>
                  <p className="text-sm font-semibold text-stone-800">{fact.value}</p>
                </div>
              ))}
            </div>

            {/* Deposit */}
            {property.deposit_paise && (
              <div className="flex items-center gap-2 text-sm text-stone-600 bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
                <IndianRupee size={15} className="text-amber-600" />
                <span>Security deposit: <strong>{formatRent(property.deposit_paise)}</strong></span>
              </div>
            )}

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-stone-900 mb-3">About this Property</h2>
              <p className="text-stone-600 leading-relaxed">{property.description}</p>
            </div>

            {/* Amenities */}
            {displayedAmenities.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-stone-900 mb-3">Amenities</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {displayedAmenities.map(a => a && (
                    <div
                      key={a.value}
                      className="flex items-center gap-2.5 px-3 py-2.5 bg-stone-50 rounded-xl border border-stone-100 text-sm text-stone-700"
                    >
                      <span className="text-base" role="img" aria-hidden="true">{a.icon}</span>
                      {a.label}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approximate map */}
            {hasMapCoords && (
              <div>
                <h2 className="text-lg font-semibold text-stone-900 mb-3">Approximate Location</h2>
                <MapView
                  properties={[property]}
                  className="h-64"
                />
              </div>
            )}

            {/* Privacy notice */}
            <Alert variant="info">
              <strong>Privacy notice:</strong> For your safety, we do not display the owner's phone number or the
              exact address on this page. Our customer care team will share these details when appropriate,
              after reviewing your request.
            </Alert>
          </div>

          {/* ── Right: Booking Sidebar ─────────────────────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Rent card */}
              <div className="bg-white rounded-3xl border border-stone-100 shadow-card p-6">
                <div className="mb-4">
                  <p className="text-3xl font-bold text-stone-900">
                    {formatRent(property.rent_paise)}
                    <span className="text-base font-normal text-stone-400">/month</span>
                  </p>
                  {property.deposit_paise && (
                    <p className="text-sm text-stone-500 mt-1">
                      Deposit: {formatRent(property.deposit_paise)}
                    </p>
                  )}
                </div>

                <Badge
                  status={property.availability_status}
                  label={formatAvailability(property.availability_status)}
                  className="mb-4"
                />

                <div className="space-y-3">
                  {isAuthenticated ? (
                    <>
                      <Link to={`/request/${property.property_ref}?type=CALLBACK`}>
                        <Button
                          id={`callback-btn-${property.property_ref}`}
                          variant="primary"
                          size="lg"
                          fullWidth
                          leftIcon={<Phone size={16} />}
                        >
                          Request a Callback
                        </Button>
                      </Link>
                      <Link to={`/request/${property.property_ref}?type=VISIT`}>
                        <Button
                          id={`visit-btn-${property.property_ref}`}
                          variant="outline"
                          size="lg"
                          fullWidth
                          leftIcon={<Calendar size={16} />}
                        >
                          Book a Visit
                        </Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Button
                        id={`login-unlock-btn-${property.property_ref}`}
                        variant="primary"
                        size="lg"
                        fullWidth
                        leftIcon={<Lock size={16} />}
                        onClick={() => openLoginModal(`/request/${property.property_ref}?type=CALLBACK`)}
                      >
                        Sign In to Request Callback
                      </Button>
                      <Button
                        id={`login-visit-btn-${property.property_ref}`}
                        variant="outline"
                        size="lg"
                        fullWidth
                        leftIcon={<Calendar size={16} />}
                        onClick={() => openLoginModal(`/request/${property.property_ref}?type=VISIT`)}
                      >
                        Sign In to Book Visit
                      </Button>
                    </>
                  )}
                </div>

                <p className="text-xs text-stone-400 text-center mt-4 leading-relaxed">
                  Submitting a request is not a confirmed booking. Our team will call you to confirm
                  availability and schedule a visit.
                </p>
              </div>

              {/* How it works mini */}
              <div className="bg-primary-50 rounded-2xl p-5 border border-primary-100">
                <h3 className="text-sm font-semibold text-primary-900 mb-3">What happens next?</h3>
                <div className="space-y-2.5 text-xs text-stone-600">
                  {[
                    'Submit your callback or visit request',
                    'Our team reviews your request',
                    'We call you to confirm details and availability',
                    'A visit is scheduled at your convenience',
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="w-4 h-4 rounded-full bg-primary-200 text-primary-800 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      {step}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
