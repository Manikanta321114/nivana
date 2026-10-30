import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  ShieldCheck, CheckCircle2, Sparkles,
  ArrowRight, Lock, Building2
} from 'lucide-react'
import { Input, Textarea, Select, Checkbox } from '../../components/ui/FormFields'
import { Button } from '../../components/ui/Button'
import { SuccessState } from '../../components/ui/States'
import { BENGALURU_LOCALITIES } from '../../constants/localities'
import { AMENITIES, BHK_OPTIONS, PROPERTY_TYPE_LABELS } from '../../constants/amenities'
import { generateRef } from '../../utils'

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
  availability: z.string().min(2, 'Specify availability, e.g. "Available Immediately" or "From Nov 1"'),
  submitter_is_authorized: z.literal(true, {
    errorMap: () => ({ message: 'You must confirm that you are the owner or authorized to list this property.' }),
  }),
  consent_to_contact: z.literal(true, {
    errorMap: () => ({ message: 'You must consent to being contacted by NIVASA to verify the listing.' }),
  }),
})

type SubmissionFormData = z.infer<typeof submissionSchema>

export const ListPropertyPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false)
  const [submissionRef, setSubmissionRef] = useState('')

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      property_type: 'APARTMENT',
      bhk: 2,
      amenities: [],
      availability: 'Available Immediately',
    },
  })

  const onSubmit = async (data: SubmissionFormData) => {
    // Simulate API submission
    await new Promise(r => setTimeout(r, 1000))
    const ref = generateRef('SUB')
    setSubmissionRef(ref)
    setSubmitted(true)
    console.info('[DEMO] Property submission received:', { ...data, submission_ref: ref })
  }

  if (submitted) {
    return (
      <div className="pt-24 pb-16 page-container max-w-3xl">
        <div className="bg-white rounded-3xl shadow-card border border-stone-100 p-8 sm:p-12 text-center animate-fade-in">
          <SuccessState
            title="Property Submission Received!"
            refNumber={submissionRef}
            description="Thank you for listing with NIVASA. Your property has been placed in our verification queue."
            action={
              <div className="mt-8 space-y-4">
                <div className="bg-stone-50 rounded-2xl p-6 text-left border border-stone-200/80">
                  <h3 className="text-sm font-semibold text-stone-900 mb-3 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-primary-600" />
                    What happens next?
                  </h3>
                  <ol className="space-y-3 text-xs sm:text-sm text-stone-600">
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        1
                      </span>
                      <span>
                        <strong>Verification Call:</strong> Our operations desk will call you within 24 hours to confirm lease details and answer any questions.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        2
                      </span>
                      <span>
                        <strong>Photos & Details Review:</strong> We help format and organize photos to make your property stand out.
                      </span>
                    </li>
                    <li className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-primary-100 text-primary-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                        3
                      </span>
                      <span>
                        <strong>Go Live:</strong> Your listing is published to thousands of verified seekers across Bengaluru.
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
    <div className="pt-20 pb-16 bg-bg-base min-h-screen">
      {/* Hero Header */}
      <div className="bg-primary-900 text-white py-12 mb-8">
        <div className="page-container max-w-4xl text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white mb-4 border border-white/20">
            <Sparkles size={13} className="text-accent-300" />
            Zero Spam • 100% Free Listing
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-3">
            List Your Property in Bengaluru
          </h1>
          <p className="text-white/80 text-base max-w-2xl mx-auto leading-relaxed">
            Reach verified tenants without publishing your personal contact number to the internet.
            NIVASA screens inquiries and schedules visits on your behalf.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 max-w-3xl mx-auto text-left">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
              <ShieldCheck className="text-accent-300 mb-2" size={20} />
              <p className="text-sm font-semibold text-white">Your Privacy Protected</p>
              <p className="text-xs text-white/70 mt-1">We never reveal your phone number publicly. No unsolicited calls.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
              <CheckCircle2 className="text-accent-300 mb-2" size={20} />
              <p className="text-sm font-semibold text-white">Verified Seekers Only</p>
              <p className="text-xs text-white/70 mt-1">Every visit request is confirmed before reaching your schedule.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/15">
              <Building2 className="text-accent-300 mb-2" size={20} />
              <p className="text-sm font-semibold text-white">Bengaluru Localized</p>
              <p className="text-xs text-white/70 mt-1">Targeted exposure in Koramangala, Indiranagar, HSR, and 30+ hubs.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Submission Form */}
      <div className="page-container max-w-3xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>

          {/* Section 1: Submitter Contact */}
          <div className="bg-white rounded-3xl shadow-card border border-stone-100 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-2 pb-3 border-b border-stone-100">
              <Lock size={16} className="text-primary-700" />
              <h2 className="text-lg font-semibold text-stone-900">Your Contact Details</h2>
              <span className="ml-auto text-xs text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded-full">
                Kept strictly confidential
              </span>
            </div>
            <p className="text-xs text-stone-500 mb-5">
              These details are only used by NIVASA staff to verify your listing and coordinate visits.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="submitter_name"
                label="Full Name"
                placeholder="e.g. Ramesh Kumar"
                required
                {...register('submitter_name')}
                error={errors.submitter_name?.message}
              />

              <Input
                id="submitter_phone"
                label="Mobile Number (WhatsApp preferred)"
                placeholder="e.g. 9876543210"
                type="tel"
                required
                {...register('submitter_phone')}
                error={errors.submitter_phone?.message}
              />
            </div>
          </div>

          {/* Section 2: Property Specifications */}
          <div className="bg-white rounded-3xl shadow-card border border-stone-100 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-stone-900 mb-2 pb-3 border-b border-stone-100">
              Property Details
            </h2>
            <p className="text-xs text-stone-500 mb-5">
              Accurate details ensure your home appears in the right tenant searches.
            </p>

            <div className="space-y-4">
              <div className="w-full">
                <label htmlFor="locality" className="block text-sm font-medium text-stone-700 mb-1.5">
                  Locality in Bengaluru <span className="text-red-500 ml-1" aria-hidden="true">*</span>
                </label>
                <input
                  id="locality"
                  list="locality-list"
                  placeholder="Type or select locality, e.g. HSR Layout, Koramangala, Whitefield…"
                  {...register('locality')}
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
                  {...register('property_type')}
                  error={errors.property_type?.message}
                />

                <Select
                  id="bhk"
                  label="BHK Configuration"
                  required
                  options={BHK_OPTIONS}
                  {...register('bhk')}
                  error={errors.bhk?.message}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="rent_inr"
                  label="Expected Monthly Rent (₹)"
                  placeholder="e.g. 25000"
                  type="number"
                  min="1000"
                  step="500"
                  required
                  {...register('rent_inr')}
                  error={errors.rent_inr?.message}
                />

                <Input
                  id="deposit_inr"
                  label="Expected Security Deposit (₹)"
                  placeholder="e.g. 100000"
                  type="number"
                  min="0"
                  step="1000"
                  {...register('deposit_inr')}
                  error={errors.deposit_inr?.message}
                />
              </div>

              <Input
                id="availability"
                label="Earliest Move-in Date / Availability"
                placeholder="e.g. Available Immediately, or From December 1st"
                required
                {...register('availability')}
                error={errors.availability?.message}
              />

              <Textarea
                id="description"
                label="Property Description & Highlights"
                rows={4}
                placeholder="Describe furnishings, flooring, balcony orientation, nearby metro/landmarks..."
                required
                {...register('description')}
                error={errors.description?.message}
              />
            </div>
          </div>

          {/* Section 3: Amenities */}
          <div className="bg-white rounded-3xl shadow-card border border-stone-100 p-6 sm:p-8">
            <h2 className="text-lg font-semibold text-stone-900 mb-2 pb-3 border-b border-stone-100">
              Amenities & Key Features
            </h2>
            <p className="text-xs text-stone-500 mb-5">
              Check all amenities currently available at this property.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {AMENITIES.map(amenity => (
                <Controller
                  key={amenity.value}
                  name="amenities"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id={`list-amenity-${amenity.value}`}
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

          {/* Section 4: Terms & Consents */}
          <div className="bg-white rounded-3xl shadow-card border border-stone-100 p-6 sm:p-8 space-y-4">
            <h2 className="text-lg font-semibold text-stone-900 mb-2 pb-3 border-b border-stone-100">
              Confirmation & Consent
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
                rightIcon={<ArrowRight size={18} />}
              >
                Submit Property for Verification
              </Button>
              <p className="text-center text-xs text-stone-500 mt-3">
                Listing on NIVASA is 100% free of charge. No upfront fees.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ListPropertyPage
