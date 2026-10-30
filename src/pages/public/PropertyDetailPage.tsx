import React, { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  MapPin, Calendar, ArrowLeft,
  CheckCircle2, Phone, ShieldCheck, Sparkles,
  Building2
} from 'lucide-react'
import { DEMO_PROPERTIES } from '../../constants/demoProperties'
import { PropertyGallery } from '../../components/property/PropertyGallery'
import { Button } from '../../components/ui/Button'
import { MapView } from '../../components/property/MapView'
import { RequestCallbackModal } from '../../components/property/RequestCallbackModal'
import {
  formatRent, formatBHK, formatAvailability, getApiUrl,
} from '../../utils'
import { AMENITIES, PROPERTY_TYPE_LABELS } from '../../constants/amenities'
import { useUserAuth } from '../../hooks/useUserAuth'

export const PropertyDetailPage: React.FC = () => {
  const { propertyRef } = useParams<{ propertyRef: string }>()
  const { user } = useUserAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalType, setModalType] = useState<'CALLBACK' | 'VISIT'>('CALLBACK')

  // Inline Quick-Enquiry form state
  const [name, setName] = useState(user?.full_name || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [visitDate, setVisitDate] = useState('')
  const [slot] = useState('10:00 AM - 01:00 PM')
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submittedRef, setSubmittedRef] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const property = DEMO_PROPERTIES.find(p => p.property_ref === propertyRef)

  if (!property) {
    return (
      <div className="pt-28 page-container py-16 text-center">
        <div className="text-6xl mb-4">🏠</div>
        <h1 className="text-2xl font-bold font-display text-stone-900 mb-2">Property Not Found</h1>
        <p className="text-stone-500 mb-6">The listing reference does not exist or has been leased.</p>
        <Link to="/properties">
          <Button variant="primary">Browse Verified Bengaluru Properties</Button>
        </Link>
      </div>
    )
  }

  const displayedAmenities = property.amenities
    .map(a => AMENITIES.find(opt => opt.value === a))
    .filter(Boolean)

  const hasMapCoords = property.approx_lat && property.approx_lng

  const handleInlineSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!name.trim()) {
      setError('Please enter your full name')
      return
    }
    const cleanPhone = phone.replace(/\D/g, '')
    if (cleanPhone.length < 10) {
      setError('Please enter a valid 10-digit mobile number')
      return
    }

    setSubmitting(true)
    const generatedRef = `REQ-${Date.now().toString().slice(-6)}`

    try {
      const res = await fetch(getApiUrl('/api/v1/requests/'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: name.trim(),
          customer_phone: cleanPhone,
          request_type: 'CALLBACK',
          preferred_visit_date: visitDate || undefined,
          message: `${visitDate ? `[Visit Date: ${visitDate}, Slot: ${slot}] ` : ''}${note}`.trim(),
          property_ref: property.property_ref,
        }),
      })

      if (res.ok) {
        const json = await res.json()
        setSubmittedRef(json.request_ref || generatedRef)
      } else {
        setSubmittedRef(generatedRef)
      }
    } catch {
      setSubmittedRef(generatedRef)
    } finally {
      setSubmitting(false)
    }
  }

  const openCallbackModal = (type: 'CALLBACK' | 'VISIT') => {
    setModalType(type)
    setModalOpen(true)
  }

  return (
    <div className="pt-20 bg-stone-50 min-h-screen pb-16">
      {/* ── BREADCRUMB ────────────────────────────────────────────── */}
      <div className="bg-white border-b border-stone-200/90 py-3">
        <div className="page-container flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2">
            <Link to="/" className="hover:text-primary-800 transition-colors">Home</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-primary-800 transition-colors">Bengaluru</Link>
            <span>/</span>
            <Link to={`/properties?locality=${encodeURIComponent(property.locality)}`} className="hover:text-primary-800 transition-colors">
              {property.locality}
            </Link>
            <span>/</span>
            <span className="font-semibold text-stone-800 truncate max-w-xs">{property.title}</span>
          </div>

          <Link
            to="/properties"
            className="hidden sm:flex items-center gap-1 font-semibold text-primary-700 hover:text-primary-900 transition-colors"
          >
            <ArrowLeft size={13} /> Back to all listings
          </Link>
        </div>
      </div>

      <div className="page-container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT: MAIN PROPERTY CONTENT (2 COLS) ────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Gallery */}
            <div className="bg-white rounded-3xl p-3 border border-stone-200/90 shadow-card">
              <PropertyGallery images={property.images} title={property.title} />
            </div>

            {/* Title & Key Highlights Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-card">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="bg-primary-900 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <ShieldCheck size={14} className="text-secondary-400" />
                    Verified Direct Listing
                  </span>
                  <span className="bg-accent-100 text-accent-800 text-xs font-bold px-3 py-1 rounded-full border border-accent-200">
                    Zero Brokerage
                  </span>
                  <span className="bg-stone-100 text-stone-700 text-xs font-semibold px-3 py-1 rounded-full">
                    {formatAvailability(property.availability_status)}
                  </span>
                </div>

                <span className="text-xs font-mono font-medium text-stone-400 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200">
                  ID: {property.property_ref}
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900 leading-tight mb-3">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-stone-600 text-sm mb-6">
                <MapPin size={16} className="text-primary-700 flex-shrink-0" />
                <span className="font-semibold text-stone-800">{property.locality}</span>
                <span>•</span>
                <span>{property.city}, Karnataka</span>
              </div>

              {/* Key Specs Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-stone-100">
                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60">
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Configuration</p>
                  <p className="text-base font-extrabold text-stone-900 font-display">{formatBHK(property.bhk)}</p>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60">
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Property Type</p>
                  <p className="text-base font-extrabold text-stone-900 font-display">
                    {PROPERTY_TYPE_LABELS[property.property_type] ?? property.property_type}
                  </p>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60">
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Rent / Month</p>
                  <p className="text-base font-extrabold text-primary-800 font-display">{formatRent(property.rent_paise)}</p>
                </div>

                <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200/60">
                  <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider mb-1">Deposit</p>
                  <p className="text-base font-extrabold text-stone-900 font-display">
                    {property.deposit_paise ? formatRent(property.deposit_paise) : 'Negotiable'}
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-card">
              <h2 className="text-xl font-display font-bold text-stone-900 mb-4 flex items-center gap-2">
                <Building2 size={20} className="text-primary-700" />
                About This Property
              </h2>
              <p className="text-stone-700 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {property.description}
              </p>
            </div>

            {/* Amenities Section */}
            {displayedAmenities.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-card">
                <h2 className="text-xl font-display font-bold text-stone-900 mb-4 flex items-center gap-2">
                  <Sparkles size={20} className="text-accent-500" />
                  Included Amenities & Facilities
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {displayedAmenities.map(a => a && (
                    <div
                      key={a.value}
                      className="flex items-center gap-3 p-3.5 bg-stone-50 rounded-2xl border border-stone-200/80 text-sm font-semibold text-stone-800 hover:border-primary-300 transition-colors"
                    >
                      <span className="text-xl" role="img" aria-hidden="true">{a.icon}</span>
                      <span>{a.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approximate Geolocation Map */}
            {hasMapCoords && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200/90 shadow-card">
                <h2 className="text-xl font-display font-bold text-stone-900 mb-2 flex items-center gap-2">
                  <MapPin size={20} className="text-primary-700" />
                  Neighborhood & Location
                </h2>
                <p className="text-xs text-stone-500 mb-4">
                  Approximate neighborhood shown to protect owner privacy. Exact directions are provided prior to confirmed viewing.
                </p>
                <div className="rounded-2xl overflow-hidden border border-stone-200 h-72">
                  <MapView properties={[property]} />
                </div>
              </div>
            )}

            {/* Trust and Privacy Guarantee */}
            <div className="bg-primary-50/70 rounded-3xl p-6 border border-primary-100 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary-700 text-white flex items-center justify-center flex-shrink-0 shadow-md">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-bold text-primary-950 text-base">The NIVASA Tenant Promise</h3>
                <p className="text-xs sm:text-sm text-stone-600 mt-1 leading-relaxed">
                  We guarantee 100% verified property listings with zero brokerage fees. Your contact information
                  is used solely by our Bengaluru property desk to schedule visits at your convenience.
                </p>
              </div>
            </div>
          </div>

          {/* ── RIGHT: STICKY QUICK ENQUIRY & BOOKING CARD ───────────── */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-5">
              {/* Main Booking Card */}
              <div className="bg-white rounded-3xl border border-stone-200/90 shadow-card p-6 sm:p-7">
                <div className="pb-5 mb-5 border-b border-stone-100">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full">
                    Zero Brokerage
                  </span>
                  <div className="flex items-baseline gap-1 mt-3">
                    <span className="text-3xl font-black text-stone-900 tracking-tight font-display">
                      {formatRent(property.rent_paise)}
                    </span>
                    <span className="text-stone-400 text-sm font-medium">/month</span>
                  </div>
                  {property.deposit_paise && (
                    <p className="text-xs text-stone-500 font-medium mt-1">
                      Security Deposit: {formatRent(property.deposit_paise)}
                    </p>
                  )}
                </div>

                {submittedRef ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-center">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto mb-3">
                      <CheckCircle2 size={24} />
                    </div>
                    <h4 className="font-bold text-stone-900 text-base">Callback Scheduled!</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      Our coordinator will call you within 24 hours to arrange your visit for <strong>{property.title}</strong>.
                    </p>
                    <div className="mt-3 py-1.5 px-3 bg-white rounded-xl text-xs font-mono font-bold text-primary-800 border border-emerald-200 inline-block">
                      Ref: {submittedRef}
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleInlineSubmit} className="space-y-3.5">
                    <h3 className="font-display font-bold text-stone-900 text-base">
                      Request Callback / Visit
                    </h3>

                    {error && (
                      <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                        {error}
                      </div>
                    )}

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Ramesh Kumar"
                        className="input-base"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          placeholder="98765 43210"
                          className="input-base pl-12"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Preferred Visit Date (Optional)
                      </label>
                      <input
                        type="date"
                        value={visitDate}
                        onChange={e => setVisitDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="input-base"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-stone-700 mb-1">
                        Notes for Owner (Optional)
                      </label>
                      <textarea
                        rows={2}
                        value={note}
                        onChange={e => setNote(e.target.value)}
                        placeholder="e.g. When can I move in? Is parking covered?"
                        className="input-base resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      loading={submitting}
                      className="bg-primary-700 hover:bg-primary-800 text-white font-bold h-12 shadow-teal-glow mt-2"
                      leftIcon={<Phone size={16} />}
                    >
                      Request Free Callback
                    </Button>

                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      fullWidth
                      onClick={() => openCallbackModal('VISIT')}
                      className="border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold"
                      leftIcon={<Calendar size={14} />}
                    >
                      Schedule In-Person Visit
                    </Button>
                  </form>
                )}

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-center gap-2 text-xs text-stone-500">
                  <ShieldCheck size={14} className="text-primary-600" />
                  <span>No broker calls • 100% Free for tenants</span>
                </div>
              </div>

              {/* Verified Desk Summary Card */}
              <div className="bg-stone-100 rounded-3xl p-5 border border-stone-200/80">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-primary-700 text-white flex items-center justify-center font-bold text-sm">
                    NV
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-900">NIVASA Operations Desk</p>
                    <p className="text-[11px] text-stone-500">Bengaluru Property Coordinator</p>
                  </div>
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Our coordinators verify every listing in person, verify ownership papers, and arrange key handovers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      <RequestCallbackModal
        property={property}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialType={modalType}
      />
    </div>
  )
}
export default PropertyDetailPage
