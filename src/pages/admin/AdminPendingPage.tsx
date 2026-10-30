import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, ArrowRight } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/States'
import { DEMO_SUBMISSIONS } from '../../constants/demoData'
import type { AdminPropertySubmission, VerificationStatus } from '../../types'
import { formatRent, formatBHK, formatPropertyType, timeAgo } from '../../utils'

const STATUS_FILTERS: { value: VerificationStatus | ''; label: string }[] = [
  { value: '', label: 'All Submissions' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'UNDER_REVIEW', label: 'Under Review' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
]

export const AdminPendingPage: React.FC = () => {
  const [submissions] = useState<AdminPropertySubmission[]>(DEMO_SUBMISSIONS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | ''>('')

  const filtered = submissions.filter(s => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      s.submission_ref.toLowerCase().includes(q) ||
      s.submitter_name.toLowerCase().includes(q) ||
      s.locality.toLowerCase().includes(q)
    const matchesStatus = !statusFilter || s.verification_status === statusFilter
    return matchesSearch && matchesStatus
  })

  const pendingCount = submissions.filter(s => s.verification_status === 'PENDING').length
  const underReviewCount = submissions.filter(s => s.verification_status === 'UNDER_REVIEW').length

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-stone-900">
            Pending Listings Queue
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Review user-submitted property listings, verify ownership and details before publishing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              {pendingCount} Pending Action
            </span>
          )}
          {underReviewCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-800">
              {underReviewCount} Under Review
            </span>
          )}
        </div>
      </div>

      {/* Filters bar */}
      <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-4 mb-6 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by ref, submitter name, or locality…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-base pl-9 py-2 text-sm w-full"
          />
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {STATUS_FILTERS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                statusFilter === opt.value
                  ? 'bg-primary-800 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-card border border-stone-100 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <EmptyState
              title="No submissions found"
              message={
                search || statusFilter
                  ? 'Try clearing your filters or search query.'
                  : 'There are currently no property submissions in the queue.'
              }
              action={
                search || statusFilter ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearch('')
                      setStatusFilter('')
                    }}
                  >
                    Reset Filters
                  </Button>
                ) : undefined
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100 text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
                  <th className="px-6 py-3.5">Submission Ref</th>
                  <th className="px-6 py-3.5">Submitter & Phone</th>
                  <th className="px-6 py-3.5">Property Details</th>
                  <th className="px-6 py-3.5">Rent / Deposit</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Submitted</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {filtered.map(sub => (
                  <tr key={sub.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-primary-900">
                      {sub.submission_ref}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-stone-900">{sub.submitter_name}</div>
                      <div className="text-xs text-stone-500 font-mono mt-0.5">{sub.submitter_phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-stone-800">
                        {formatBHK(sub.bhk)} {formatPropertyType(sub.property_type)}
                      </div>
                      <div className="text-xs text-stone-500">{sub.locality}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-stone-900">{formatRent(sub.rent_paise)}/mo</div>
                      {sub.deposit_paise && (
                        <div className="text-xs text-stone-400">
                          Dep: {formatRent(sub.deposit_paise)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={sub.verification_status} size="sm" />
                    </td>
                    <td className="px-6 py-4 text-xs text-stone-500 whitespace-nowrap">
                      {timeAgo(sub.submitted_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/admin/pending/${sub.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          rightIcon={<ArrowRight size={14} />}
                        >
                          Review
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPendingPage
