import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { Lock, ArrowLeft, CheckCircle, Camera, MapPin } from 'lucide-react'
import { Input, Textarea, Select } from '../../components/ui/FormFields'
import { Button } from '../../components/ui/Button'
import { Alert, SuccessState } from '../../components/ui/States'
import { BENGALURU_LOCALITIES } from '../../constants/localities'
import { AMENITIES, BHK_OPTIONS, PROPERTY_TYPE_LABELS } from '../../constants/amenities'
import { generateRef } from '../../utils'
import { PhotoCapture, type CapturedPhoto } from '../../components/admin/PhotoCapture'
import { LocationPicker, type PickedLocation } from '../../components/admin/LocationPicker'
import type { PropertyType, AvailabilityStatus, ListingStatus } from '../../types'

// ── Form shape ────────────────────────────────────────────────────
interface AdminPropertyFormValues {
  title: string
  locality: string
  property_type: PropertyType
  bhk: number
  rent_inr: number
  deposit_inr: number
  amenities: string[]
  description: string
  // Private fields
  exact_address: string
  owner_name: string
  owner_phone: string
  availability_status: AvailabilityStatus
  listing_status: ListingStatus
}

// ── Private field label ───────────────────────────────────────────
const PrivateLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="flex items-center gap-1.5">
    {children}
    <span className="inline-flex items-center gap-1 text-xs font-normal text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
      <Lock size={9} />
      Private — not shown publicly
    </span>
  </span>
)

// ── Section heading ────────────────────────────────────────────────
const SectionHeading: React.FC<{ title: string; description?: string; private?: boolean }> = ({
  title, description, private: isPrivate,
}) => (
  <div className={`mb-4 pb-3 border-b ${isPrivate ? 'border-amber-100' : 'border-stone-100'}`}>
    <h2 className={`text-base font-semibold flex items-center gap-2 ${isPrivate ? 'text-amber-800' : 'text-stone-800'}`}>
      {isPrivate && <Lock size={14} className="text-amber-600" />}
      {title}
    </h2>
    {description && <p className="text-xs text-stone-500 mt-0.5">{description}</p>}
  </div>
)

// ── Main Page ─────────────────────────────────────────────────────
const AdminAddPropertyPage: React.FC = () => {
  const navigate = useNavigate()
  const [submitted, setSubmitted]     = useState(false)
  const [generatedRef, setGeneratedRef] = useState('')
  const [photos, setPhotos]           = useState<CapturedPhoto[]>([])
  const [location, setLocation]       = useState<PickedLocation | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AdminPropertyFormValues>({
    defaultValues: {
      property_type: 'APARTMENT',
      bhk: 2,
      availability_status: 'AVAILABLE',
      listing_status: 'UNPUBLISHED',
      amenities: [],
    },
  })

  const watchedAmenities = watch('amenities') ?? []

  const onSubmit = async (data: AdminPropertyFormValues) => {
    // Simulate async save
    await new Promise(resolve => setTimeout(resolve, 900))
    const ref = generateRef('NVS-DEMO')
    setGeneratedRef(ref)
    setSubmitted(true)
    console.log('[DEMO] Would save property:', data)
  }

  if (submitted) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-10">
          <SuccessState
            title="Property Added Successfully"
            refNumber={generatedRef}
            description="The property has been saved. You can now publish it from the Properties page, or add another."
            action={
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-2">
                <Button variant="outline" onClick={() => navigate('/admin/properties')}>
                  View All Properties
                </Button>
                <Button variant="primary" onClick={() => { setSubmitted(false) }}>
                  Add Another Property
                </Button>
              </div>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/properties')}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-3 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Properties
        </button>
        <h1 className="text-2xl font-display font-bold text-stone-900">Add New Property</h1>
        <p className="text-stone-500 text-sm mt-1">
          Manually list a property. Private fields are stored securely and never shown publicly.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Left / Main column */}
          <div className="xl:col-span-2 space-y-6">

            {/* Basic Information */}
            <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
              <SectionHeading title="Basic Information" description="Public-facing property details" />
              <div className="space-y-4">
                <Input
                  id="title"
                  label="Listing Title"
                  placeholder="e.g. 2 BHK Apartment in Koramangala"
                  required
                  {...register('title', { required: 'Title is required', minLength: { value: 10, message: 'Title must be at least 10 characters' } })}
                  error={errors.title?.message}
                />

                {/* Locality with datalist */}
                <div className="w-full">
                  <label htmlFor="locality" className="block text-sm font-medium text-stone-700 mb-1.5">
                    Locality <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="locality"
                    list="locality-list"
                    placeholder="Type or select a locality…"
                    {...register('locality', { required: 'Locality is required' })}
                    className={`input-base ${errors.locality ? 'border-red-400 focus:ring-red-400' : ''}`}
                  />
                  <datalist id="locality-list">
                    {BENGALURU_LOCALITIES.map(loc => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                  {errors.locality && (
                    <p role="alert" className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                      <span aria-hidden="true">⚠</span> {errors.locality.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Select
                    id="property_type"
                    label="Property Type"
                    required
                    options={Object.entries(PROPERTY_TYPE_LABELS).map(([v, l]) => ({ value: v, label: l }))}
                    {...register('property_type', { required: true })}
                    error={errors.property_type?.message}
                  />
                  <Select
                    id="bhk"
                    label="BHK / Rooms"
                    required
                    options={BHK_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
                    {...register('bhk', { required: true, valueAsNumber: true })}
                    error={errors.bhk?.message}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    id="rent_inr"
                    label="Monthly Rent (₹)"
                    type="number"
                    min={0}
                    placeholder="e.g. 18000"
                    required
                    hint="Enter amount in INR — stored as paise internally"
                    {...register('rent_inr', {
                      required: 'Rent is required',
                      min: { value: 1, message: 'Must be at least ₹1' },
                      valueAsNumber: true,
                    })}
                    error={errors.rent_inr?.message}
                  />
                  <Input
                    id="deposit_inr"
                    label="Security Deposit (₹)"
                    type="number"
                    min={0}
                    placeholder="e.g. 36000"
                    hint="Leave 0 if not applicable"
                    {...register('deposit_inr', { valueAsNumber: true })}
                    error={errors.deposit_inr?.message}
                  />
                </div>

                <Textarea
                  id="description"
                  label="Description"
                  placeholder="Describe the property, neighbourhood, and what makes it great…"
                  rows={4}
                  required
                  {...register('description', { required: 'Description is required', minLength: { value: 30, message: 'Please write at least 30 characters' } })}
                  error={errors.description?.message}
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
              <SectionHeading title="Amenities" description="Select all that apply" />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AMENITIES.map(amenity => (
                  <label
                    key={amenity.value}
                    className="flex items-center gap-2.5 cursor-pointer p-2 rounded-xl hover:bg-stone-50 transition-colors"
                  >
                    <Controller
                      control={control}
                      name="amenities"
                      render={({ field }) => (
                        <input
                          type="checkbox"
                          value={amenity.value}
                          checked={field.value?.includes(amenity.value) ?? false}
                          onChange={e => {
                            const current = field.value ?? []
                            field.onChange(
                              e.target.checked
                                ? [...current, amenity.value]
                                : current.filter((v: string) => v !== amenity.value)
                            )
                          }}
                          className="h-4 w-4 rounded border-stone-300 text-primary-700 focus:ring-primary-500"
                        />
                      )}
                    />
                    <span className="text-sm text-stone-700">
                      <span className="mr-1">{amenity.icon}</span>
                      {amenity.label}
                    </span>
                  </label>
                ))}
              </div>
              {watchedAmenities.length > 0 && (
                <p className="text-xs text-stone-400 mt-3">{watchedAmenities.length} amenity/amenities selected</p>
              )}
            </div>
          </div>

          {/* Photos */}
          <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
            <div className="mb-4 pb-3 border-b border-stone-100">
              <h2 className="text-base font-semibold text-stone-800 flex items-center gap-2">
                <Camera size={16} className="text-primary-600" />
                Property Photos
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Take photos on-site or upload from your gallery. First photo becomes the cover image.
              </p>
            </div>
            <PhotoCapture photos={photos} onChange={setPhotos} maxPhotos={12} />
          </div>

          {/* Location */}
          <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
            <div className="mb-4 pb-3 border-b border-stone-100">
              <h2 className="text-base font-semibold text-stone-800 flex items-center gap-2">
                <MapPin size={16} className="text-emerald-600" />
                Approximate Location
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Used to show the property on the map. Use GPS if you're at the property right now.
              </p>
            </div>
            <LocationPicker value={location} onChange={setLocation} />
          </div>

          {/* Right column — Private + Status */}
          <div className="space-y-6">

            {/* Private Fields */}
            <div className="bg-white rounded-2xl shadow-card border border-amber-100 p-6">
              <SectionHeading
                title="Owner & Location"
                description="Stored securely. Never shown publicly."
                private
              />
              <Alert variant="warning" className="mb-4 text-xs">
                These fields are <strong>private</strong> and visible only to authorised NIVASA staff.
                They are never displayed on the public listing.
              </Alert>
              <div className="space-y-4">
                <div className="w-full">
                  <label htmlFor="exact_address" className="block text-sm font-medium text-stone-700 mb-1.5">
                    <PrivateLabel>Exact Address</PrivateLabel>
                  </label>
                  <textarea
                    id="exact_address"
                    rows={3}
                    placeholder="Full door / flat no., street, landmark…"
                    {...register('exact_address')}
                    className="input-base resize-y"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="owner_name" className="block text-sm font-medium text-stone-700 mb-1.5">
                    <PrivateLabel>Owner Name</PrivateLabel>
                  </label>
                  <input
                    id="owner_name"
                    type="text"
                    placeholder="Full name of the property owner"
                    {...register('owner_name')}
                    className="input-base"
                  />
                </div>

                <div className="w-full">
                  <label htmlFor="owner_phone" className="block text-sm font-medium text-stone-700 mb-1.5">
                    <PrivateLabel>Owner Phone</PrivateLabel>
                  </label>
                  <input
                    id="owner_phone"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    {...register('owner_phone')}
                    className="input-base"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
              <SectionHeading title="Listing Status" />
              <div className="space-y-4">
                <Select
                  id="availability_status"
                  label="Availability"
                  required
                  options={[
                    { value: 'AVAILABLE', label: 'Available Now' },
                    { value: 'COMING_SOON', label: 'Available Soon' },
                    { value: 'OCCUPIED', label: 'Currently Occupied' },
                  ]}
                  {...register('availability_status', { required: true })}
                  error={errors.availability_status?.message}
                />
                <Select
                  id="listing_status"
                  label="Listing Status"
                  required
                  hint="Set to 'Published' to make this listing live immediately"
                  options={[
                    { value: 'UNPUBLISHED', label: 'Unpublished (Draft)' },
                    { value: 'PUBLISHED', label: 'Published (Live)' },
                    { value: 'ARCHIVED', label: 'Archived' },
                  ]}
                  {...register('listing_status', { required: true })}
                  error={errors.listing_status?.message}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-5 flex flex-col gap-3">
              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={isSubmitting}
                leftIcon={<CheckCircle size={16} />}
              >
                {isSubmitting ? 'Saving…' : 'Save Property'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                fullWidth
                onClick={() => navigate('/admin/properties')}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminAddPropertyPage
