import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft, CheckCircle2, XCircle, ShieldCheck, Lock,
  Phone, User, Check, Clock
} from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Checkbox, Textarea } from '../../components/ui/FormFields'
import { Alert } from '../../components/ui/States'
import { ConfirmDialog } from '../../components/ui/Modal'
import { DEMO_SUBMISSIONS } from '../../constants/demoData'
import { AMENITIES } from '../../constants/amenities'
import type { AdminPropertySubmission, VerificationStatus } from '../../types'
import { formatRent, formatBHK, formatPropertyType, formatDate } from '../../utils'

interface VerificationChecklistState {
  authority_checked: boolean
  contact_checked: boolean
  availability_checked: boolean
  rent_checked: boolean
  location_checked: boolean
  publish_permission_confirmed: boolean
}

export const AdminSubmissionReviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [submission, setSubmission] = useState<AdminPropertySubmission | null>(null)
  const [checklist, setChecklist] = useState<VerificationChecklistState>({
    authority_checked: false,
    contact_checked: false,
    availability_checked: false,
    rent_checked: false,
    location_checked: false,
    publish_permission_confirmed: false,
  })
  const [adminNotes, setAdminNotes] = useState('')
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [actionSuccess, setActionSuccess] = useState<string | null>(null)

  useEffect(() => {
    const found = DEMO_SUBMISSIONS.find(s => s.id === id || s.submission_ref === id)
    if (found) {
      setSubmission(found)
      setAdminNotes(found.admin_notes || '')
      if (found.verification_status === 'APPROVED') {
        setChecklist({
          authority_checked: true,
          contact_checked: true,
          availability_checked: true,
          rent_checked: true,
          location_checked: true,
          publish_permission_confirmed: true,
        })
      } else if (found.verification_status === 'UNDER_REVIEW') {
        setChecklist({
          authority_checked: true,
          contact_checked: true,
          availability_checked: false,
          rent_checked: false,
          location_checked: false,
          publish_permission_confirmed: false,
        })
      }
    }
  }, [id])

  if (!submission) {
    return (
      <div className="p-8 max-w-4xl mx-auto text-center py-20">
        <h2 className="text-xl font-bold text-stone-800 mb-2">Submission Not Found</h2>
        <p className="text-sm text-stone-500 mb-6">Could not find any submission matching "{id}".</p>
        <Button variant="primary" onClick={() => navigate('/admin/pending')}>
          Back to Submissions
        </Button>
      </div>
    )
  }

  const allChecksPassed = Object.values(checklist).every(Boolean)

  const handleUpdateStatus = (newStatus: VerificationStatus) => {
    setSubmission(prev => prev ? { ...prev, verification_status: newStatus, admin_notes: adminNotes } : null)
    setActionSuccess(`Status successfully updated to ${newStatus}`)
    setTimeout(() => setActionSuccess(null), 4000)
  }

  const handleApprove = () => {
    setSubmission(prev => prev ? { ...prev, verification_status: 'APPROVED', admin_notes: adminNotes } : null)
    setActionSuccess('Submission APPROVED! Property record created & ready for publishing.')
    setTimeout(() => setActionSuccess(null), 5000)
  }

  const handleReject = () => {
    setRejectModalOpen(false)
    setSubmission(prev => prev ? { ...prev, verification_status: 'REJECTED', admin_notes: adminNotes } : null)
    setActionSuccess('Submission has been REJECTED.')
    setTimeout(() => setActionSuccess(null), 4000)
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/admin/pending')}
          className="flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-700 mb-3 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Submissions Queue
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-display font-bold text-stone-900">
                Review Submission
              </h1>
              <span className="font-mono text-sm bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200">
                {submission.submission_ref}
              </span>
              <Badge status={submission.verification_status} />
            </div>
            <p className="text-stone-500 text-sm mt-1">
              Submitted on {formatDate(submission.submitted_at)} by {submission.submitter_name}
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

        {/* Left Column: Submitter & Property Details */}
        <div className="xl:col-span-2 space-y-6">

          {/* Submitter Confidential Info */}
          <div className="bg-amber-50/50 rounded-2xl border border-amber-200/80 p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-amber-200/60">
              <div className="flex items-center gap-2 text-amber-900 font-semibold text-base">
                <Lock size={16} className="text-amber-700" />
                <span>Confidential Submitter Details</span>
              </div>
              <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full font-medium">
                Admin Eyes Only
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-stone-500 mb-0.5">Submitter Name</p>
                <p className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                  <User size={14} className="text-stone-400" />
                  {submission.submitter_name}
                </p>
              </div>

              <div>
                <p className="text-xs text-stone-500 mb-0.5">Phone Number</p>
                <p className="text-sm font-semibold font-mono text-stone-900 flex items-center gap-1.5">
                  <Phone size={14} className="text-stone-400" />
                  {submission.submitter_phone}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/50 flex flex-wrap gap-4 text-xs text-stone-600">
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600" />
                Authorized representative confirmed
              </span>
              <span className="flex items-center gap-1.5">
                <Check size={14} className="text-emerald-600" />
                Consent to contact granted
              </span>
            </div>
          </div>

          {/* Property Specifications */}
          <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-4 pb-3 border-b border-stone-100">
              Submitted Property Information
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
                <p className="text-xs text-stone-500">Locality</p>
                <p className="text-sm font-semibold text-stone-900 mt-0.5">{submission.locality}</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
                <p className="text-xs text-stone-500">Configuration</p>
                <p className="text-sm font-semibold text-stone-900 mt-0.5">
                  {formatBHK(submission.bhk)} {formatPropertyType(submission.property_type)}
                </p>
              </div>
              <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
                <p className="text-xs text-stone-500">Rent Expected</p>
                <p className="text-sm font-semibold text-primary-900 mt-0.5">
                  {formatRent(submission.rent_paise)}/mo
                </p>
              </div>
              <div className="bg-stone-50 rounded-xl p-3 border border-stone-100">
                <p className="text-xs text-stone-500">Security Deposit</p>
                <p className="text-sm font-semibold text-stone-800 mt-0.5">
                  {submission.deposit_paise ? formatRent(submission.deposit_paise) : 'Not specified'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Availability
                </p>
                <p className="text-sm text-stone-800">{submission.availability}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                  Property Description
                </p>
                <p className="text-sm text-stone-700 bg-stone-50 rounded-xl p-4 border border-stone-100 whitespace-pre-line leading-relaxed">
                  {submission.description || 'No description provided.'}
                </p>
              </div>

              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  Amenities
                </p>
                <div className="flex flex-wrap gap-2">
                  {submission.amenities.map(a => {
                    const match = AMENITIES.find(item => item.value === a)
                    return (
                      <span
                        key={a}
                        className="bg-stone-100 text-stone-700 text-xs px-2.5 py-1 rounded-lg border border-stone-200"
                      >
                        {match?.label || a}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
            <h2 className="text-base font-semibold text-stone-900 mb-2">
              Internal Admin Notes
            </h2>
            <p className="text-xs text-stone-500 mb-4">
              Record conversations, verification notes, or reasons for status changes.
            </p>
            <Textarea
              id="admin_notes"
              rows={4}
              placeholder="e.g. Spoke with owner Ramesh on Oct 29. Verified lease terms and key handover availability..."
              value={adminNotes}
              onChange={e => setAdminNotes(e.target.value)}
            />
          </div>
        </div>

        {/* Right Column: Verification Checklist & Decision */}
        <div className="space-y-6">

          {/* Checklist Card */}
          <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-stone-100">
              <ShieldCheck size={18} className="text-primary-700" />
              <div>
                <h2 className="text-base font-semibold text-stone-900">Verification Checklist</h2>
                <p className="text-xs text-stone-500">All 6 steps required for approval</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <Checkbox
                id="chk_authority"
                label="1. Authority to List Confirmed"
                checked={checklist.authority_checked}
                onChange={e => setChecklist(prev => ({ ...prev, authority_checked: e.target.checked }))}
              />
              <Checkbox
                id="chk_contact"
                label="2. Submitter Phone Called & Validated"
                checked={checklist.contact_checked}
                onChange={e => setChecklist(prev => ({ ...prev, contact_checked: e.target.checked }))}
              />
              <Checkbox
                id="chk_availability"
                label="3. Move-in Date & Occupancy Verified"
                checked={checklist.availability_checked}
                onChange={e => setChecklist(prev => ({ ...prev, availability_checked: e.target.checked }))}
              />
              <Checkbox
                id="chk_rent"
                label="4. Monthly Rent & Deposit Verified"
                checked={checklist.rent_checked}
                onChange={e => setChecklist(prev => ({ ...prev, rent_checked: e.target.checked }))}
              />
              <Checkbox
                id="chk_location"
                label="5. Exact Locality & Address Verified"
                checked={checklist.location_checked}
                onChange={e => setChecklist(prev => ({ ...prev, location_checked: e.target.checked }))}
              />
              <Checkbox
                id="chk_permission"
                label="6. Permission to Publish Confirmed"
                checked={checklist.publish_permission_confirmed}
                onChange={e => setChecklist(prev => ({ ...prev, publish_permission_confirmed: e.target.checked }))}
              />
            </div>

            <div className="mt-5 pt-4 border-t border-stone-100">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-medium text-stone-600">Verification Progress</span>
                <span className="font-semibold text-primary-800">
                  {Object.values(checklist).filter(Boolean).length} / 6
                </span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary-600 h-full transition-all duration-300"
                  style={{
                    width: `${(Object.values(checklist).filter(Boolean).length / 6) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-6 space-y-3">
            <h2 className="text-base font-semibold text-stone-900 mb-2">
              Review Actions
            </h2>

            <Button
              type="button"
              variant="primary"
              fullWidth
              leftIcon={<CheckCircle2 size={16} />}
              disabled={!allChecksPassed || submission.verification_status === 'APPROVED'}
              onClick={handleApprove}
            >
              Approve & Create Property
            </Button>
            {!allChecksPassed && submission.verification_status !== 'APPROVED' && (
              <p className="text-[11px] text-amber-700 text-center">
                Complete all 6 checklist items above to enable approval.
              </p>
            )}

            {submission.verification_status !== 'UNDER_REVIEW' && submission.verification_status !== 'APPROVED' && (
              <Button
                type="button"
                variant="outline"
                fullWidth
                leftIcon={<Clock size={16} />}
                onClick={() => handleUpdateStatus('UNDER_REVIEW')}
              >
                Mark Under Review
              </Button>
            )}

            {submission.verification_status !== 'REJECTED' && (
              <Button
                type="button"
                variant="danger"
                fullWidth
                leftIcon={<XCircle size={16} />}
                onClick={() => setRejectModalOpen(true)}
              >
                Reject Submission
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Reject Confirmation Dialog */}
      <ConfirmDialog
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onConfirm={handleReject}
        variant="danger"
        title="Reject Property Submission"
        confirmLabel="Yes, Reject Submission"
        message={`Are you sure you want to reject submission ${submission.submission_ref}? The listing will not be published.`}
      />
    </div>
  )
}

export default AdminSubmissionReviewPage
