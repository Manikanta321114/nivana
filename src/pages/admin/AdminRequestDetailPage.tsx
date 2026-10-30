import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Phone, Calendar, User, MessageSquare,
  Building2, ExternalLink, Plus
} from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Select, Textarea, Input } from '../../components/ui/FormFields'
import { Alert } from '../../components/ui/States'
import { DEMO_BOOKING_REQUESTS, DEMO_CALLBACK_LOGS } from '../../constants/demoData'
import { DEMO_PROPERTIES } from '../../constants/demoProperties'
import { REQUEST_STATUS_LABELS } from '../../constants/amenities'
import type { BookingRequest, RequestStatus, CallbackOutcome, CallbackLog } from '../../types'
import { formatDate, timeAgo, formatRent } from '../../utils'
import { useAdminAuth } from '../../hooks/useAdminAuth'

export const AdminRequestDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { admin } = useAdminAuth()

  const [request, setRequest] = useState<BookingRequest | null>(null)
  const [callbackLogs, setCallbackLogs] = useState<CallbackLog[]>([])
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  // Log Call form state
  const [outcome, setOutcome] = useState<CallbackOutcome>('SPOKE')
  const [callNotes, setCallNotes] = useState('')
  const [loggingCall, setLoggingCall] = useState(false)

  // Admin notes state
  const [adminNotes, setAdminNotes] = useState('')

  useEffect(() => {
    const foundReq = DEMO_BOOKING_REQUESTS.find(r => r.id === id || r.request_ref === id)
    if (foundReq) {
      setRequest(foundReq)
      setAdminNotes(foundReq.admin_notes || '')
      const relatedLogs = DEMO_CALLBACK_LOGS.filter(l => l.booking_request_id === foundReq.id)
      setCallbackLogs(relatedLogs)
    }
  }, [id])

  if (!request) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center py-20">
        <h2 className="text-xl font-bold text-stone-800 mb-2">Request Not Found</h2>
        <p className="text-sm text-stone-500 mb-6">Could not find any inquiry matching "{id}".</p>
        <Button variant="primary" onClick={() => navigate('/admin/requests')}>
          Back to Inquiries
        </Button>
      </div>
    )
  }

  const property = DEMO_PROPERTIES.find(p => p.id === request.property_id || p.property_ref === request.property_ref)

  const handleStatusChange = (newStatus: RequestStatus) => {
    setRequest(prev => prev ? { ...prev, status: newStatus } : null)
    setActionSuccess(`Status updated to ${REQUEST_STATUS_LABELS[newStatus] || newStatus}`)
    setTimeout(() => setActionSuccess(null), 4000)
  }

  const handleSaveNotes = () => {
    setRequest(prev => prev ? { ...prev, admin_notes: adminNotes } : null)
    setActionSuccess('Admin notes updated.')
    setTimeout(() => setActionSuccess(null), 4000)
  }

  const handleAddCallLog = (e: React.FormEvent) => {
    e.preventDefault()
    setLoggingCall(true)

    setTimeout(() => {
      const newLog: CallbackLog = {
        id: `demo-log-${Date.now()}`,
        booking_request_id: request.id,
        admin_id: admin?.id || 'demo-admin-001',
        admin_name: admin?.full_name || 'Admin Officer',
        called_at: new Date().toISOString(),
        outcome,
        notes: callNotes.trim() || null,
      }

      setCallbackLogs(prev => [newLog, ...prev])
      setCallNotes('')
      setLoggingCall(false)

      // Automatically update request status if helpful
      if (outcome === 'VISIT_CONFIRMED' && request.status !== 'VISIT_SCHEDULED') {
        setRequest(prev => prev ? { ...prev, status: 'VISIT_SCHEDULED' } : null)
      } else if (outcome === 'SPOKE' && request.status === 'NEW') {
        setRequest(prev => prev ? { ...prev, status: 'CONTACTED' } : null)
      }

      setActionSuccess('Call log saved successfully.')
      setTimeout(() => setActionSuccess(null), 4000)
    }, 400)
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/requests')}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-3 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Inquiries Queue
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display font-bold text-stone-900">
                Inquiry Details
              </h1>
              <span className="font-mono text-sm bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200">
                {request.request_ref}
              </span>
              <Badge
                status={request.status}
                label={REQUEST_STATUS_LABELS[request.status] || request.status}
              />
            </div>
            <p className="text-stone-500 text-sm mt-1">
              Received {formatDate(request.created_at)} ({timeAgo(request.created_at)})
            </p>
          </div>
        </div>
      </div>

      {actionSuccess && (
        <div className="mb-6">
          <Alert variant="success" title="Success" message={actionSuccess} />
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Left Column: Customer details, inquiry message, and logged calls */}
        <div className="xl:col-span-2 space-y-6">

          {/* Customer Information Card */}
          <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-4 pb-3 border-b border-stone-100 flex items-center justify-between">
              <span>Customer Information</span>
              <span className="text-xs font-normal text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                Private Contact Details
              </span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-stone-500 mb-1">Customer Full Name</p>
                <p className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                  <User size={15} className="text-stone-400" />
                  {request.customer_name}
                </p>
              </div>

              <div>
                <p className="text-xs text-stone-500 mb-1">Direct Phone Number</p>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold font-mono text-primary-950 flex items-center gap-2">
                    <Phone size={15} className="text-primary-600" />
                    {request.customer_phone}
                  </p>
                  <a
                    href={`tel:${request.customer_phone}`}
                    className="text-xs font-semibold text-primary-700 hover:text-primary-800 bg-primary-50 px-2.5 py-1 rounded-lg border border-primary-200 transition-colors"
                  >
                    Click to Dial
                  </a>
                </div>
              </div>

              <div>
                <p className="text-xs text-stone-500 mb-1">Request Type</p>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800">
                  {request.request_type === 'CALLBACK' ? (
                    <>
                      <Phone size={13} className="text-primary-600" /> Callback Requested
                    </>
                  ) : (
                    <>
                      <Calendar size={13} className="text-indigo-600" /> Property Visit Requested
                    </>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-stone-500 mb-1">Preferred Visit Date</p>
                <p className="text-sm font-medium text-stone-800">
                  {request.preferred_visit_date ? formatDate(request.preferred_visit_date) : 'Flexible / As soon as possible'}
                </p>
              </div>
            </div>

            {request.message && (
              <div className="mt-5 pt-4 border-t border-stone-100">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MessageSquare size={13} /> Customer Message
                </p>
                <p className="text-sm text-stone-700 bg-stone-50 rounded-xl p-3.5 border border-stone-100 leading-relaxed">
                  "{request.message}"
                </p>
              </div>
            )}
          </div>

          {/* Callback Log & Call History */}
          <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-4 pb-3 border-b border-stone-100">
              Record Call & Conversation Log
            </h2>

            <form onSubmit={handleAddCallLog} className="bg-stone-50 rounded-xl p-4 border border-stone-100 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                <Select
                  id="call_outcome"
                  label="Call Outcome"
                  value={outcome}
                  onChange={e => setOutcome(e.target.value as CallbackOutcome)}
                  options={[
                    { value: 'SPOKE', label: 'Spoke with Customer' },
                    { value: 'VISIT_CONFIRMED', label: 'Visit Confirmed' },
                    { value: 'LEFT_MESSAGE', label: 'Left Message / SMS' },
                    { value: 'NO_ANSWER', label: 'No Answer / Busy' },
                    { value: 'CUSTOMER_CANCELLED', label: 'Customer Not Interested / Cancelled' },
                  ]}
                />

                <Input
                  id="called_by"
                  label="Caller Name"
                  disabled
                  value={admin?.full_name || 'Admin Officer'}
                />
              </div>

              <div className="mb-3">
                <Textarea
                  id="call_notes"
                  label="Call Notes / Follow-up Details"
                  rows={2}
                  placeholder="e.g. Discussed move-in date, tenant prefers Saturday morning..."
                  value={callNotes}
                  onChange={e => setCallNotes(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={loggingCall}
                leftIcon={<Plus size={15} />}
              >
                Log This Call
              </Button>
            </form>

            <h3 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
              Call History ({callbackLogs.length})
            </h3>

            {callbackLogs.length === 0 ? (
              <p className="text-sm text-stone-400 py-4 text-center">No call logs recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {callbackLogs.map(log => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-xl border border-stone-100 bg-white hover:bg-stone-50/60 transition-colors flex items-start gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Phone size={14} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold text-stone-900">
                          {log.outcome.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {formatDate(log.called_at)}
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-0.5">
                        Logged by {log.admin_name}
                      </p>
                      {log.notes && (
                        <p className="text-xs text-stone-700 mt-1.5 bg-stone-50 p-2 rounded-lg border border-stone-100">
                          {log.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Target Property & Status Controls */}
        <div className="space-y-6">

          {/* Target Property Card */}
          {property && (
            <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-stone-100">
                <h2 className="text-base font-semibold text-stone-900 flex items-center gap-2">
                  <Building2 size={16} className="text-primary-700" />
                  Target Property
                </h2>
                <Link
                  to={`/properties/${property.property_ref}`}
                  target="_blank"
                  className="text-xs text-primary-700 hover:text-primary-800 flex items-center gap-1 font-medium"
                >
                  <ExternalLink size={12} /> View Listing
                </Link>
              </div>

              {property.images[0] && (
                <img
                  src={property.images[0].file_path}
                  alt={property.title}
                  className="w-full h-36 object-cover rounded-xl mb-3"
                />
              )}

              <p className="font-semibold text-stone-900 text-sm">{property.title}</p>
              <p className="text-xs text-stone-500 mt-0.5">{property.locality}, Bengaluru</p>
              <p className="text-sm font-bold text-primary-800 mt-2">
                {formatRent(property.rent_paise)}/month
              </p>
            </div>
          )}

          {/* Status Controls */}
          <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-4 pb-3 border-b border-stone-100">
              Update Inquiry Status
            </h2>

            <div className="space-y-3">
              <Select
                id="req_status"
                label="Inquiry Status"
                value={request.status}
                onChange={e => handleStatusChange(e.target.value as RequestStatus)}
                options={Object.entries(REQUEST_STATUS_LABELS).map(([val, label]) => ({
                  value: val,
                  label,
                }))}
              />
            </div>

            {/* Admin Internal Notes */}
            <div className="mt-5 pt-4 border-t border-stone-100">
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Staff Quick Notes
              </label>
              <Textarea
                id="quick_notes"
                rows={3}
                placeholder="Internal notes for this inquiry..."
                value={adminNotes}
                onChange={e => setAdminNotes(e.target.value)}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                fullWidth
                onClick={handleSaveNotes}
                className="mt-2.5"
              >
                Save Notes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminRequestDetailPage
