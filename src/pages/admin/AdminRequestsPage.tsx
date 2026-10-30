import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Phone, Calendar, ArrowRight } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { EmptyState } from '../../components/ui/States'
import { DEMO_BOOKING_REQUESTS } from '../../constants/demoData'
import type { BookingRequest, RequestStatus, RequestType } from '../../types'
import { REQUEST_STATUS_LABELS } from '../../constants/amenities'
import { formatDate, timeAgo } from '../../utils'

const STATUS_FILTERS: { value: RequestStatus | ''; label: string }[] = [
  { value: '', label: 'All Inquiries' },
  { value: 'NEW', label: 'New' },
  { value: 'CALLBACK_PENDING', label: 'Callback Pending' },
  { value: 'CONTACTED', label: 'Contacted' },
  { value: 'VISIT_SCHEDULED', label: 'Visit Scheduled' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' },
]

export const AdminRequestsPage: React.FC = () => {
  const [requests] = useState<BookingRequest[]>(DEMO_BOOKING_REQUESTS)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<RequestStatus | ''>('')
  const [typeFilter, setTypeFilter] = useState<RequestType | ''>('')

  const filtered = requests.filter(r => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      r.request_ref.toLowerCase().includes(q) ||
      r.customer_name.toLowerCase().includes(q) ||
      r.property_title.toLowerCase().includes(q) ||
      r.property_ref.toLowerCase().includes(q)
    const matchesStatus = !statusFilter || r.status === statusFilter
    const matchesType = !typeFilter || r.request_type === typeFilter
    return matchesSearch && matchesStatus && matchesType
  })

  const newCount = requests.filter(r => r.status === 'NEW').length
  const callbackPendingCount = requests.filter(r => r.status === 'CALLBACK_PENDING').length

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-stone-900">
            Customer Inquiries & Bookings
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Manage callback requests and visit appointments from prospective renters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {newCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              {newCount} New Inquiries
            </span>
          )}
          {callbackPendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-800">
              {callbackPendingCount} Callbacks Pending
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-4 mb-6 flex flex-col lg:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by customer, phone, ref, or property…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-base pl-9 py-2 text-sm w-full"
          />
        </div>

        {/* Request Type Toggle */}
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setTypeFilter('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              typeFilter === '' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All Types
          </button>
          <button
            onClick={() => setTypeFilter('CALLBACK')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
              typeFilter === 'CALLBACK' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Phone size={12} /> Callbacks
          </button>
          <button
            onClick={() => setTypeFilter('VISIT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
              typeFilter === 'VISIT' ? 'bg-white shadow-sm text-stone-900' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calendar size={12} /> Visits
          </button>
        </div>

        {/* Status filter pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0">
          {STATUS_FILTERS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
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
              title="No inquiries found"
              message={
                search || statusFilter || typeFilter
                  ? 'Try clearing your filters or search query.'
                  : 'There are currently no customer inquiries in the system.'
              }
              action={
                search || statusFilter || typeFilter ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearch('')
                      setStatusFilter('')
                      setTypeFilter('')
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
                  <th className="px-6 py-3.5">Ref</th>
                  <th className="px-6 py-3.5">Customer & Phone</th>
                  <th className="px-6 py-3.5">Type & Date</th>
                  <th className="px-6 py-3.5">Property</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5">Received</th>
                  <th className="px-6 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-sm">
                {filtered.map(req => (
                  <tr key={req.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-primary-900">
                      {req.request_ref}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-stone-900">{req.customer_name}</div>
                      <div className="text-xs text-stone-500 font-mono mt-0.5">{req.customer_phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700">
                        {req.request_type === 'CALLBACK' ? (
                          <>
                            <Phone size={11} className="text-primary-600" />
                            Callback Request
                          </>
                        ) : (
                          <>
                            <Calendar size={11} className="text-indigo-600" />
                            Visit Booking
                          </>
                        )}
                      </div>
                      {req.preferred_visit_date && (
                        <div className="text-xs text-stone-500 mt-1">
                          Pref: {formatDate(req.preferred_visit_date)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-stone-800 truncate max-w-[200px]">
                        {req.property_title}
                      </div>
                      <div className="text-xs text-stone-400 font-mono">{req.property_ref}</div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        status={req.status}
                        label={REQUEST_STATUS_LABELS[req.status] || req.status}
                        size="sm"
                      />
                    </td>
                    <td className="px-6 py-4 text-xs text-stone-500 whitespace-nowrap">
                      {timeAgo(req.created_at)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/admin/requests/${req.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          rightIcon={<ArrowRight size={14} />}
                        >
                          View & Call
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

export default AdminRequestsPage
