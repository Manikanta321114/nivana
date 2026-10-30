import React, { useState } from 'react'
import { useParams, useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Phone, Calendar, Shield } from 'lucide-react'
import { DEMO_PROPERTIES } from '../../constants/demoProperties'
import { Input, Textarea, Select, Checkbox } from '../../components/ui/FormFields'
import { Button } from '../../components/ui/Button'
import { Alert, SuccessState } from '../../components/ui/States'
import { formatRent, formatBHK, generateRef } from '../../utils'
import { PROPERTY_TYPE_LABELS } from '../../constants/amenities'
import { useUserAuth } from '../../hooks/useUserAuth'

// ── Validation Schema ──────────────────────────────────────────────
const bookingSchema = z.object({
  customer_name:       z.string().min(2, 'Please enter your full name'),
  customer_phone:      z.string()
    .min(10, 'Enter a valid 10-digit mobile number')
    .max(15)
    .regex(/^[6-9]\d{9}$/, 'Enter a valid Indian mobile number (starting with 6–9)'),
  request_type:        z.enum(['CALLBACK', 'VISIT']),
  preferred_visit_date: z.string().optional(),
  message:             z.string().max(500, 'Message too long (max 500 characters)').optional(),
  consent_to_contact:  z.literal(true, {
    errorMap: () => ({ message: 'You must consent to be contacted to submit this request.' }),
  }),
})

type BookingFormData = z.infer<typeof bookingSchema>

export const RequestPage: React.FC = () => {
  const { propertyRef }      = useParams<{ propertyRef: string }>()
  const [searchParams]        = useSearchParams()
  const defaultType           = searchParams.get('type') === 'VISIT' ? 'VISIT' : 'CALLBACK'
  const [submitted, setSubmitted] = useState(false)
  const [requestRef, setRequestRef] = useState('')
  const { user }              = useUserAuth()

  const property = DEMO_PROPERTIES.find(p => p.property_ref === propertyRef)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      request_type: defaultType as 'CALLBACK' | 'VISIT',
      customer_name: user?.full_name || '',
      customer_phone: user?.phone || '',
    },
  })

  const requestType = watch('request_type')

  const onSubmit = async (data: BookingFormData) => {
    // Phase 3: POST to /api/booking-requests
    await new Promise(r => setTimeout(r, 800)) // Simulate API
    const ref = generateRef('REQ')
    setRequestRef(ref)
    setSubmitted(true)
    console.info('[DEMO] Booking request data (would be sent to backend):', {
      ...data,
      property_id: property?.id,
      property_ref: property?.property_ref,
    })
  }

  if (submitted) {
    return (
      <div className="pt-24 page-container py-12 max-w-lg mx-auto">
        <SuccessState
          title="Request Submitted!"
          refNumber={requestRef}
          description="Our customer care team will review your request and call you within 24 hours. Submitting this request does not guarantee a property reservation — availability will be confirmed during the call."
          action={
            <div className="flex gap-3">
              <Link to="/properties"><Button variant="outline" size="sm">Browse More Properties</Button></Link>
              <Link to="/"><Button variant="primary" size="sm">Go Home</Button></Link>
            </div>
          }
        />
      </div>
    )
  }

  return (
    <div className="pt-16">
      <div className="bg-primary-900 text-white py-10">
        <div className="page-container">
          <h1 className="text-2xl font-display font-bold mb-1">
            {defaultType === 'VISIT' ? 'Book a Property Visit' : 'Request a Callback'}
          </h1>
          <p className="text-white/70 text-sm">
            Our team will review your request and call you to confirm.
          </p>
        </div>
      </div>

      <div className="page-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-4xl">
          {/* Form */}
          <div className="lg:col-span-2">
            {!property && (
              <Alert variant="warning" className="mb-6">
                Property not found. Please go back and select a valid property.
              </Alert>
            )}

            <div className="bg-white rounded-3xl border border-stone-100 shadow-card p-6 sm:p-8">
              <h2 className="text-lg font-semibold text-stone-900 mb-6">Your Request Details</h2>

              <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
                {/* Request type */}
                <Select
                  id="request-type"
                  label="Request Type"
                  required
                  options={[
                    { value: 'CALLBACK', label: 'Request a Callback — We will call you' },
                    { value: 'VISIT',    label: 'Book a Property Visit' },
                  ]}
                  error={errors.request_type?.message}
                  {...register('request_type')}
                />

                {/* Name */}
                <Input
                  id="customer-name"
                  label="Your Full Name"
                  required
                  placeholder="e.g. Arjun Mehta"
                  error={errors.customer_name?.message}
                  {...register('customer_name')}
                />

                {/* Phone */}
                <Input
                  id="customer-phone"
                  label="Mobile Number"
                  type="tel"
                  required
                  placeholder="10-digit mobile number"
                  leftIcon={<span className="text-sm text-stone-500">+91</span>}
                  hint="We will call you only on this number regarding your request."
                  error={errors.customer_phone?.message}
                  {...register('customer_phone')}
                />

                {/* Visit date (only if VISIT) */}
                {requestType === 'VISIT' && (
                  <Input
                    id="preferred-visit-date"
                    label="Preferred Visit Date (optional)"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    hint="We will confirm availability for this date when we call you."
                    error={errors.preferred_visit_date?.message}
                    {...register('preferred_visit_date')}
                  />
                )}

                {/* Message */}
                <Textarea
                  id="customer-message"
                  label="Message (optional)"
                  placeholder="Any specific requirements or questions…"
                  hint="Maximum 500 characters."
                  error={errors.message?.message}
                  {...register('message')}
                />

                {/* Privacy consent */}
                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100">
                  <Checkbox
                    id="consent-to-contact"
                    label={
                      <span>
                        I consent to NIVASA contacting me by phone regarding this request.
                        I understand that my contact details will be used only to process this request
                        and will not be shared with third parties. Read our{' '}
                        <Link to="/privacy-policy" className="text-primary-700 underline">Privacy Policy</Link>.
                      </span>
                    }
                    required
                    error={errors.consent_to_contact?.message}
                    {...register('consent_to_contact')}
                  />
                </div>

                {/* Important notice */}
                <Alert variant="info">
                  <strong>Please note:</strong> Submitting this form is not a confirmed booking or property
                  reservation. Our team will call you to confirm availability and arrange a visit.
                </Alert>

                <Button
                  id="submit-request-btn"
                  type="submit"
                  variant="primary"
                  size="lg"
                  fullWidth
                  loading={isSubmitting}
                  leftIcon={requestType === 'VISIT' ? <Calendar size={16} /> : <Phone size={16} />}
                >
                  {requestType === 'VISIT' ? 'Submit Visit Request' : 'Submit Callback Request'}
                </Button>
              </form>
            </div>
          </div>

          {/* Property card summary */}
          <div className="lg:col-span-1">
            {property ? (
              <div className="bg-white rounded-3xl border border-stone-100 shadow-card overflow-hidden sticky top-20">
                {property.images[0] && (
                  <img
                    src={property.images[0].file_path}
                    alt={property.title}
                    className="w-full h-36 object-cover"
                  />
                )}
                <div className="p-5">
                  <p className="text-xs text-stone-400 mb-0.5">{property.locality}, Bengaluru</p>
                  <p className="font-semibold text-stone-900 text-sm leading-snug mb-2">{property.title}</p>
                  <div className="flex gap-1.5 mb-3">
                    <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full">
                      {PROPERTY_TYPE_LABELS[property.property_type]}
                    </span>
                    <span className="px-2 py-0.5 bg-stone-100 text-stone-600 text-xs rounded-full">
                      {formatBHK(property.bhk)}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-stone-900">
                    {formatRent(property.rent_paise)}<span className="text-xs font-normal text-stone-400">/mo</span>
                  </p>
                  <p className="text-xs text-stone-400 mt-1">ID: {property.property_ref}</p>
                </div>
              </div>
            ) : (
              <div className="bg-stone-50 rounded-3xl border border-stone-200 p-6 text-center text-stone-400 text-sm">
                Property not selected
              </div>
            )}

            {/* Privacy badge */}
            <div className="mt-4 bg-primary-50 border border-primary-100 rounded-2xl p-4 flex items-start gap-3">
              <Shield size={18} className="text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-primary-900 mb-1">Your privacy is protected</p>
                <p className="text-xs text-stone-500 leading-relaxed">
                  Only your name and phone number are collected. Contact details are
                  not shared publicly and are only used to process your request.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
