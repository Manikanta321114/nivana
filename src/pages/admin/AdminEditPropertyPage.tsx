import React, { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { Lock, ArrowLeft, ExternalLink, Save } from 'lucide-react'
import { Input, Textarea, Select, Checkbox } from '../../components/ui/FormFields'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/States'
import { BENGALURU_LOCALITIES } from '../../constants/localities'
import { AMENITIES, BHK_OPTIONS, PROPERTY_TYPE_LABELS } from '../../constants/amenities'
import { DEMO_ADMIN_PROPERTIES } from '../../constants/demoProperties'
import type { PropertyType, AvailabilityStatus, ListingStatus, AdminProperty } from '../../types'

interface AdminPropertyFormValues {
  title: string
  locality: string
  property_type: PropertyType
  bhk: number
  rent_inr: number
  deposit_inr: number
  amenities: string[]
  description: string
  exact_address: string
  owner_name: string
  owner_phone: string
  availability_status: AvailabilityStatus
  listing_status: ListingStatus
}

const PrivateLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <span className="flex items-center gap-1.5">
    {children}
    <span className="inline-flex items-center gap-1 text-xs font-normal text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2 py-0.5">
      <Lock size={9} />
      Private — not shown publicly
    </span>
  </span>
)

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

export const AdminEditPropertyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [property, setProperty] = useState<AdminProperty | null>(null)
  const [saved, setSaved] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminPropertyFormValues>()

  useEffect(() => {
    const found = DEMO_ADMIN_PROPERTIES.find(p => p.id === id || p.property_ref === id)
    if (found) {
      setProperty(found)
      reset({
        title: found.title,
        locality: found.locality,
        property_type: found.property_type,
        bhk: found.bhk,
        rent_inr: Math.round(found.rent_paise / 100),
        deposit_inr: found.deposit_paise ? Math.round(found.deposit_paise / 100) : 0,
        amenities: found.amenities || [],
        description: found.description || '',
        exact_address: found.exact_address || '',
        owner_name: found.owner_name || '',
        owner_phone: found.owner_phone || '',
        availability_status: found.availability_status,
        listing_status: found.listing_status,
      })
    }
  }, [id, reset])

  const onSubmit = async (data: AdminPropertyFormValues) => {
    await new Promise(resolve => setTimeout(resolve, 800))
    console.info('[DEMO] Updating property:', id, data)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
    }, 4000)
  }

  if (!property) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center py-20">
        <h2 className="text-xl font-bold text-stone-800 mb-2">Property Not Found</h2>
        <p className="text-sm text-stone-500 mb-6">Could not find any property matching ID or Ref "{id}".</p>
        <Button variant="primary" onClick={() => navigate('/admin/properties')}>
          Back to Properties
        </Button>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <button
            onClick={() => navigate('/admin/properties')}
            className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-2 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Properties
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-display font-bold text-stone-900">
              Edit Property
            </h1>
            <span className="font-mono text-sm bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200">
              {property.property_ref}
            </span>
          </div>
          <p className="text-stone-500 text-sm mt-1">
            Update listing details, pricing, availability, and confidential management notes.
          </p>
        </div>

        {property.listing_status === 'PUBLISHED' && (
          <Link
            to={`/properties/${property.property_ref}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary-700 hover:text-primary-800 bg-primary-50 px-3.5 py-2 rounded-xl border border-primary-200 transition-colors"
          >
            <ExternalLink size={14} /> View on Public Site
          </Link>
        )}
      </div>

      {saved && (
        <div className="mb-6">
          <Alert
            variant="success"
            title="Changes Saved"
            message="Property details have been updated successfully in demo state."
          />
        </div>
      )}

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
                  required
                  {...register('title', {
                    required: 'Title is required',
                    minLength: { value: 10, message: 'Title must be at least 10 characters' },
                  })}
                  error={errors.title?.message}
                />

                <div className="w-full">
                  <label htmlFor="locality" className="block text-sm font-medium text-stone-700 mb-1.5">
                    Locality <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                  </label>
                  <input
                    id="locality"
                    list="locality-list"
                    placeholder="Type or select a locality…"
                    {...register('locality', { required: 'Locality is required' })}
                    className="input-base"
                  />
                  <datalist id="locality-list">
                    {BENGALURU_LOCALITIES.map(loc => (
                      <option key={loc} value={loc} />
                    ))}
                  </datalist>
                  {errors.locality && (
                    <p className="mt-1 text-xs text-red-600">{errors.locality.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Select
                    id="property_type"
                    label="Property Type"
                    required
                    options={Object.entries(PROPERTY_TYPE_LABELS).map(([val, label]) => ({
                      value: val,
                      label,
                    }))}
                    {...register('property_type', { required: 'Property type is required' })}
                    error={errors.property_type?.message}
                  />

                  <Select
                    id="bhk"
                    label="BHK Configuration"
                    required
                    options={BHK_OPTIONS}
                    {...register('bhk', { valueAsNumber: true })}
                    error={errors.bhk?.message}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="rent_inr"
                    label="Monthly Rent (₹)"
                    type="number"
                    min="1000"
                    step="500"
                    required
                    {...register('rent_inr', {
                      valueAsNumber: true,
                      required: 'Rent is required',
                      min: { value: 1000, message: 'Rent must be at least ₹1,000' },
                    })}
                    error={errors.rent_inr?.message}
                  />

                  <Input
                    id="deposit_inr"
                    label="Security Deposit (₹)"
                    type="number"
                    min="0"
                    step="1000"
                    {...register('deposit_inr', { valueAsNumber: true })}
                    error={errors.deposit_inr?.message}
                  />
                </div>

                <Textarea
                  id="description"
                  label="Description"
                  rows={4}
                  placeholder="Describe the property layout, key highlights, and surroundings…"
                  {...register('description')}
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
              <SectionHeading
                title="Amenities & Features"
                description="Select all features that apply to this listing"
              />
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {AMENITIES.map(amenity => (
                  <Controller
                    key={amenity.value}
                    name="amenities"
                    control={control}
                    render={({ field }) => (
                      <Checkbox
                        id={`amenity-${amenity.value}`}
                        label={amenity.label}
                        checked={field.value?.includes(amenity.value)}
                        onChange={e => {
                          const current = field.value || []
                          if (e.target.checked) {
                            field.onChange([...current, amenity.value])
                          } else {
                            field.onChange(current.filter((val: string) => val !== amenity.value))
                          }
                        }}
                      />
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Private Management Details */}
            <div className="bg-amber-50/40 rounded-2xl border border-amber-200/70 p-6">
              <SectionHeading
                title="Confidential Owner & Location Details"
                description="Kept strictly confidential by NIVASA operations staff."
                private
              />
              <div className="space-y-4">
                <Textarea
                  id="exact_address"
                  label={<PrivateLabel>Exact Street Address & Door / Flat No.</PrivateLabel>}
                  rows={3}
                  {...register('exact_address')}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="owner_name"
                    label={<PrivateLabel>Owner / Contact Full Name</PrivateLabel>}
                    {...register('owner_name')}
                  />

                  <Input
                    id="owner_phone"
                    label={<PrivateLabel>Owner Phone Number</PrivateLabel>}
                    {...register('owner_phone')}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
              <h2 className="text-base font-semibold text-stone-800 mb-4 pb-3 border-b border-stone-100">
                Listing Status & Controls
              </h2>

              <div className="space-y-4">
                <Select
                  id="listing_status"
                  label="Listing Visibility"
                  options={[
                    { value: 'PUBLISHED', label: 'Published (Live)' },
                    { value: 'UNPUBLISHED', label: 'Unpublished (Draft/Hidden)' },
                    { value: 'ARCHIVED', label: 'Archived' },
                  ]}
                  {...register('listing_status')}
                />

                <Select
                  id="availability_status"
                  label="Occupancy / Availability"
                  options={[
                    { value: 'AVAILABLE', label: 'Available Now' },
                    { value: 'OCCUPIED', label: 'Occupied' },
                    { value: 'COMING_SOON', label: 'Coming Soon' },
                  ]}
                  {...register('availability_status')}
                />
              </div>

              <div className="mt-6 pt-5 border-t border-stone-100 space-y-3">
                <Button
                  type="submit"
                  variant="primary"
                  fullWidth
                  loading={isSubmitting}
                  leftIcon={<Save size={16} />}
                >
                  {isSubmitting ? 'Saving Changes…' : 'Save Changes'}
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
        </div>
      </form>
    </div>
  )
}

export default AdminEditPropertyPage
