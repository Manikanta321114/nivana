import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ShieldCheck, Sparkles,
  ArrowRight, Lock, UploadCloud, X,
  MapPin, Home, Image as ImageIcon
} from 'lucide-react'
import { Input, Textarea, Select, Checkbox } from '../../components/ui/FormFields'
import { Button } from '../../components/ui/Button'
import { SuccessState } from '../../components/ui/States'
import { BENGALURU_LOCALITIES } from '../../constants/localities'
import { AMENITIES, BHK_OPTIONS, PROPERTY_TYPE_LABELS } from '../../constants/amenities'
import { generateRef } from '../../utils'
import { useUserAuth } from '../../hooks/useUserAuth'

const submissionSchema = z.object({
  submitter_name: z.string().min(2, 'Please enter your full name'),
  submitter_phone: z
    .string()
    .min(10, 'Enter a valid 10-digit mobile number')
    .max(15)
    .regex(/^[6-9]\d{9}$/, 'Enter a valid Indian mobile number (starting with 6–9)'),
  locality: z.string().min(2, 'Please select or enter the locality in Bengaluru'),
  property_type: z.enum(['APARTMENT', 'HOUSE', 'PG', 'VILLA', 'STUDIO']),
  bhk: z.coerce.number().min(0).max(10),
  rent_inr: z.coerce.number().min(1000, 'Rent must be at least ₹1,000'),
  deposit_inr: z.coerce.number().optional(),
  amenities: z.array(z.string()),
  description: z.string().min(10, 'Please provide at least a brief description (10+ characters)'),
  availability: z.string().min(2, 'Specify availability, e.g. "Available Immediately"'),
  submitter_is_authorized: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm that you are the owner or authorized to list this property.' }),
  }),
  consent_to_contact: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to being contacted by NIVASA to verify the listing.' }),
  }),
})

type SubmissionFormData = z.infer<typeof submissionSchema>

export const ListPropertyPage: React.FC = () => {
  const { user } = useUserAuth()
  const [submitted, setSubmitted] = useState(false)
  const [submissionRef, setSubmissionRef] = useState('')
  const [photos, setPhotos] = useState<{ id: string; url: string; name: string }[]>([])

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      submitter_name: user?.full_name || '',
      submitter_phone: user?.phone || '',
      property_type: 'APARTMENT',
      bhk: 2,
      amenities: ['parking', 'lift', 'power_backup'],
      availability: 'Available Immediately',
    },
  })

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const files = Array.from(e.target.files)
    const newPhotos = files.map(f => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(f),
      name: f.name,
    }))
    setPhotos(prev => [...prev, ...newPhotos].slice(0, 12))
  }

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(p => p.id !== id))
  }

  const onSubmit = async () => {
    await new Promise(r => setTimeout(r, 900))
    const ref = generateRef('SUB')
    setSubmissionRef(ref)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="pt-28 pb-20 page-container max-w-3xl">
        <div className="bg-white rounded-3xl shadow-card border border-stone-200/90 p-8 sm:p-12 text-center animate-fade-in">
          <SuccessState
            title="Property Submission Received!"
            refNumber={submissionRef}
            description="Thank you for listing with NIVASA. Your property has been placed in our verification queue. Zero brokerage guaranteed."
            action={
              <div className="mt-8 space-y-4">
                <div className="bg-stone-50 rounded-2xl p-6 text-left border border-stone-200/80">
                  <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-primary-700" />
                    What Happens Next?
                  </h3>
                  <ol className="space-y-3 text-xs sm:text-sm text-stone-600">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        <strong>Verification Call:</strong> Our Bengaluru operations desk will call you within 24 hours to confirm lease terms.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        <strong>Photos & Details Review:</strong> We enhance photos and verify floor plans to maximize genuine tenant interest.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        <strong>Live on NIVASA:</strong> Your listing goes live and we coordinate physical visits strictly at your approved time.
                      </span>
                    </li>
                  </ol>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Link to="/">
                    <Button variant="primary">Return to Homepage</Button>
                  </Link>
                  <Link to="/properties">
                    <Button variant="outline">Browse Explore Page</Button>
                  </Link>
                </div>
              </div>
            }
          />
        </div>
      </div>
    )
  }

  return (
    <div className="pt-20 pb-20 bg-stone-50 min-h-screen">
      {/* Header Banner */}
      <div className="bg-[#063f45] text-white py-14 mb-8 border-b border-stone-800">
        <div className="page-container max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-white/10 text-accent-300 mb-4 border border-white/20">
            <Sparkles size={13} className="text-accent-400" />
            100% Free Listing • Zero Brokerage • Direct Tenants
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight mb-3">
            List Your Bengaluru Rental Property
          </h1>
          <p className="text-stone-200 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
            Reach thousands of verified renters without exposing your personal phone number on open forums.
            NIVASA protects your privacy and screens inquiries on your behalf.
          </p>
        </div>
      </div>

      <div className="page-container max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

          {/* Section 1: Submitter Info */}
          <div className="bg-white rounded-3xl shadow-card border border-stone-200/90 p-6 sm:p-8">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-stone-100">
              <h2 className="text-base font-display font-bold text-stone-900 flex items-center gap-2">
                <Lock size={16} className="text-primary-700" />
                1. Owner & Contact Information
              </h2>
              <span className="text-[11px] font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200">
                Private & Encrypted
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="submitter_name"
                label="Owner / Representative Name *"
                placeholder="e.g. Ramesh Kumar"
                required
                {...register('submitter_name')}
                error={errors.submitter_name?.message}
              />
              <Input
                id="submitter_phone"
                label="Mobile Number (WhatsApp) *"
                placeholder="e.g. 9876543210"
                type="tel"
                required
                {...register('submitter_phone')}
                error={errors.submitter_phone?.message}
              />
            </div>
          </div>

          {/* Section 2: Basic Property Info */}
          <div className="bg-white rounded-3xl shadow-card border border-stone-200/90 p-6 sm:p-8">
            <div className="pb-3 mb-4 border-b border-stone-100">
              <h2 className="text-base font-display font-bold text-stone-900 flex items-center gap-2">
                <Home size={16} className="text-primary-700" />
                2. Property Details & Pricing
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Select
                  id="property_type"
                  label="Property Type *"
                  required
                  options={Object.entries(PROPERTY_TYPE_LABELS).map(([val, label]) => ({
                    value: val,
                    label,
                  }))}
                  {...register('property_type')}
                  error={errors.property_type?.message}
                />

                <Select
                  id="bhk"
                  label="Configuration *"
                  required
                  options={BHK_OPTIONS}
                  {...register('bhk')}
                  error={errors.bhk?.message}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="rent_inr"
                  label="Monthly Rent (₹) *"
                  placeholder="e.g. 32000"
                  type="number"
                  min="1000"
                  step="500"
                  required
                  {...register('rent_inr')}
                  error={errors.rent_inr?.message}
                />

                <Input
                  id="deposit_inr"
                  label="Security Deposit (₹)"
                  placeholder="e.g. 150000"
                  type="number"
                  min="0"
                  step="1000"
                  {...register('deposit_inr')}
                  error={errors.deposit_inr?.message}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Location */}
          <div className="bg-white rounded-3xl shadow-card border border-stone-200/90 p-6 sm:p-8">
            <div className="pb-3 mb-4 border-b border-stone-100">
              <h2 className="text-base font-display font-bold text-stone-900 flex items-center gap-2">
                <MapPin size={16} className="text-primary-700" />
                3. Location in Bengaluru
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="locality" className="block text-xs font-bold text-stone-700 mb-1">
                  Locality / Hub *
                </label>
                <input
                  id="locality"
                  list="locality-list"
                  placeholder="e.g. Indiranagar, HSR Layout, Koramangala, Whitefield..."
                  {...register('locality')}
                  className="input-base"
                />
                <datalist id="locality-list">
                  {BENGALURU_LOCALITIES.map(loc => (
                    <option key={loc} value={loc} />
                  ))}
                </datalist>
                {errors.locality && (
                  <p className="mt-1 text-xs text-rose-600">{errors.locality.message}</p>
                )}
              </div>

              <Input
                id="availability"
                label="Earliest Move-in Date *"
                placeholder="e.g. Immediate / Next Month"
                required
                {...register('availability')}
                error={errors.availability?.message}
              />

              <Textarea
                id="description"
                label="Property Description *"
                rows={3}
                placeholder="Describe furnishings, flooring, balcony orientation, nearby metro/landmarks..."
                required
                {...register('description')}
                error={errors.description?.message}
              />
            </div>
          </div>

          {/* Section 4: Amenities */}
          <div className="bg-white rounded-3xl shadow-card border border-stone-200/90 p-6 sm:p-8">
            <div className="pb-3 mb-4 border-b border-stone-100">
              <h2 className="text-base font-display font-bold text-stone-900 flex items-center gap-2">
                <Sparkles size={16} className="text-accent-500" />
                4. Amenities Available
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITIES.map(amenity => (
                <Controller
                  key={amenity.value}
                  name="amenities"
                  control={control}
                  render={({ field }) => (
                    <label className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/70 hover:bg-stone-100 cursor-pointer text-xs font-semibold text-stone-800 transition-colors">
                      <input
                        type="checkbox"
                        checked={field.value?.includes(amenity.value)}
                        onChange={e => {
                          const current = field.value || []
                          if (e.target.checked) {
                            field.onChange([...current, amenity.value])
                          } else {
                            field.onChange(current.filter((v: string) => v !== amenity.value))
                          }
                        }}
                        className="accent-primary-700 rounded"
                      />
                      <span className="text-base">{amenity.icon}</span>
                      <span>{amenity.label}</span>
                    </label>
                  )}
                />
              ))}
            </div>
          </div>

          {/* Section 5: Photo Upload Area */}
          <div className="bg-white rounded-3xl shadow-card border border-stone-200/90 p-6 sm:p-8">
            <div className="pb-3 mb-4 border-b border-stone-100">
              <h2 className="text-base font-display font-bold text-stone-900 flex items-center gap-2">
                <ImageIcon size={16} className="text-primary-700" />
                5. Property Photos (Max 12)
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Listings with clear living room, bedroom, and kitchen photos rent 3x faster.
              </p>
            </div>

            {/* Drag & Drop Box */}
            <label className="border-2 border-dashed border-stone-300 hover:border-primary-600 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-stone-50 hover:bg-primary-50/40 transition-colors mb-4 text-center">
              <UploadCloud size={36} className="text-primary-700 mb-2" />
              <p className="text-sm font-bold text-stone-800">Click to upload property photos</p>
              <p className="text-xs text-stone-400 mt-1">PNG, JPG, WEBP up to 5MB each</p>
              <input
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </label>

            {/* Preview Thumbnails */}
            {photos.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {photos.map((photo, i) => (
                  <div key={photo.id} className="relative aspect-video rounded-xl overflow-hidden border border-stone-200 group">
                    <img src={photo.url} alt="" className="w-full h-full object-cover" />
                    {i === 0 && (
                      <span className="absolute top-1 left-1 bg-primary-900/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                        Cover
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removePhoto(photo.id)}
                      className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 text-white rounded-full transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Consents & Submit */}
          <div className="bg-white rounded-3xl shadow-card border border-stone-200/90 p-6 sm:p-8 space-y-4">
            <h2 className="text-base font-display font-bold text-stone-900 pb-2 border-b border-stone-100">
              6. Legal Authorization & Free Listing Terms
            </h2>

            <Checkbox
              id="submitter_is_authorized"
              label="I confirm that I am the legal owner or authorized representative of this property."
              {...register('submitter_is_authorized')}
              error={errors.submitter_is_authorized?.message}
            />

            <Checkbox
              id="consent_to_contact"
              label="I consent to NIVASA contacting me via phone/WhatsApp regarding this listing and coordinating tenant visits."
              {...register('consent_to_contact')}
              error={errors.consent_to_contact?.message}
            />

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isSubmitting}
                className="bg-primary-700 hover:bg-primary-800 text-white font-bold h-14 shadow-teal-glow text-base"
                rightIcon={<ArrowRight size={18} />}
              >
                Submit Property for Verification
              </Button>
              <p className="text-center text-xs text-stone-500 mt-3">
                Zero listing fee • Zero tenant brokerage • 100% Free
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
export default ListPropertyPage
