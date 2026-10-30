import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Building2, CheckCircle2, Bell, ClipboardList,
  TrendingUp, ArrowRight, Plus, Eye, Clock, Phone,
  Check, X
} from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { DEMO_ADMIN_PROPERTIES } from '../../constants/demoProperties'
import { DEMO_BOOKING_REQUESTS, DEMO_SUBMISSIONS } from '../../constants/demoData'
import { formatDate, formatRent, timeAgo } from '../../utils'
import type { AdminProperty } from '../../types'

interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  iconBg: string
  trend?: string
  trendUp?: boolean
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, iconBg, trend, trendUp }) => (
  <div className="bg-white rounded-3xl shadow-card border border-stone-200/90 p-5 flex items-center gap-4">
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-3xl font-extrabold text-stone-900 leading-tight font-display">{value}</p>
      <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mt-0.5">{label}</p>
      {trend && (
        <p className={`text-[11px] mt-1 flex items-center gap-1 font-bold ${trendUp ? 'text-teal-700' : 'text-amber-700'}`}>
          <TrendingUp size={12} />
          {trend}
        </p>
      )}
    </div>
  </div>
)

export const AdminDashboardPage: React.FC = () => {
  const [propertiesList, setPropertiesList] = useState<AdminProperty[]>(DEMO_ADMIN_PROPERTIES)
  const [activeTab, setActiveTab] = useState<'ALL' | 'UNPUBLISHED' | 'PUBLISHED'>('ALL')

  const totalProperties = propertiesList.length
  const publishedProperties = propertiesList.filter(p => p.listing_status === 'PUBLISHED').length
  const pendingApprovals = propertiesList.filter(p => p.listing_status === 'UNPUBLISHED').length
  const totalInquiries = DEMO_BOOKING_REQUESTS.length

  const handleApprove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPropertiesList(prev =>
      prev.map(p => (p.id === id ? { ...p, listing_status: 'PUBLISHED' as const } : p))
    )
  }

  const handleUnpublish = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setPropertiesList(prev =>
      prev.map(p => (p.id === id ? { ...p, listing_status: 'UNPUBLISHED' as const } : p))
    )
  }

  const filteredProperties = propertiesList.filter(p => {
    if (activeTab === 'PUBLISHED') return p.listing_status === 'PUBLISHED'
    if (activeTab === 'UNPUBLISHED') return p.listing_status === 'UNPUBLISHED'
    return true
  })

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* ── TOP HEADER WITH QUICK ACTIONS ─────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-stone-900 tracking-tight">
            NIVASA Operations Desk
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Real-time overview of properties, approval queues, and tenant visits • {formatDate(new Date().toISOString())}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/add-property">
            <Button
              variant="primary"
              size="md"
              className="bg-primary-700 hover:bg-primary-800 text-white font-bold rounded-2xl shadow-teal-glow flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Add Property</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* ── 4 STAT CARDS ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          label="Total Properties"
          value={totalProperties}
          icon={<Building2 size={24} className="text-primary-700" />}
          iconBg="bg-primary-50"
          trend="+14% this month"
          trendUp={true}
        />
        <StatCard
          label="Pending Queue"
          value={pendingApprovals}
          icon={<ClipboardList size={24} className="text-amber-700" />}
          iconBg="bg-amber-50"
          trend="Review required"
          trendUp={false}
        />
        <StatCard
          label="Total Inquiries"
          value={totalInquiries}
          icon={<Bell size={24} className="text-secondary-600" />}
          iconBg="bg-secondary-50"
          trend="+8 today"
          trendUp={true}
        />
        <StatCard
          label="Active Listings"
          value={publishedProperties}
          icon={<CheckCircle2 size={24} className="text-teal-700" />}
          iconBg="bg-teal-50"
          trend="100% verified"
          trendUp={true}
        />
      </div>

      {/* ── PROPERTY MANAGEMENT TABLE ────────────────────────────── */}
      <div className="bg-white rounded-3xl border border-stone-200/90 shadow-card overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-5 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-display font-bold text-stone-900">
              Property Listings Management
            </h2>
            <p className="text-xs text-stone-500">
              Review, publish, and manage verified rentals across Bengaluru.
            </p>
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-stone-100 p-1 rounded-2xl text-xs font-bold" role="tablist">
            {(['ALL', 'UNPUBLISHED', 'PUBLISHED'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-xl transition-all ${
                  activeTab === tab
                    ? 'bg-white text-primary-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab === 'ALL' ? 'All Listings' : tab === 'UNPUBLISHED' ? 'Pending Queue' : 'Published'}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-700">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Property</th>
                <th className="py-3.5 px-4">Locality</th>
                <th className="py-3.5 px-4">Rent / Mo</th>
                <th className="py-3.5 px-4">Listing Status</th>
                <th className="py-3.5 px-4">Availability</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProperties.slice(0, 8).map(prop => (
                <tr key={prop.id} className="hover:bg-stone-50/70 transition-colors">
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-10 rounded-xl bg-stone-100 overflow-hidden flex-shrink-0">
                        {prop.images[0] ? (
                          <img
                            src={prop.images[0].file_path}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-400">
                            <Building2 size={16} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-stone-900 text-xs line-clamp-1">{prop.title}</p>
                        <p className="text-[10px] text-stone-400 font-mono mt-0.5">{prop.property_ref}</p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 font-semibold text-stone-800">
                    {prop.locality}
                  </td>

                  <td className="py-4 px-4 font-extrabold text-stone-900">
                    {formatRent(prop.rent_paise)}
                  </td>

                  <td className="py-4 px-4">
                    <Badge status={prop.listing_status} />
                  </td>

                  <td className="py-4 px-4">
                    <span className="font-medium text-stone-600">
                      {prop.availability_status}
                    </span>
                  </td>

                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {prop.listing_status !== 'PUBLISHED' ? (
                        <button
                          type="button"
                          onClick={e => handleApprove(prop.id, e)}
                          title="Publish Listing"
                          className="px-2.5 py-1.5 rounded-xl bg-teal-50 text-teal-700 hover:bg-teal-100 font-bold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <Check size={12} /> Publish
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={e => handleUnpublish(prop.id, e)}
                          title="Unpublish Listing"
                          className="px-2.5 py-1.5 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 font-bold text-[11px] flex items-center gap-1 transition-colors"
                        >
                          <X size={12} /> Unpublish
                        </button>
                      )}
                      <Link
                        to={`/properties/${prop.property_ref}`}
                        target="_blank"
                        className="p-1.5 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                        title="View Public Listing"
                      >
                        <Eye size={15} />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* View all footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50/50 flex justify-between items-center text-xs">
          <span className="text-stone-500">Showing {filteredProperties.slice(0, 8).length} of {filteredProperties.length} listings</span>
          <Link
            to="/admin/properties"
            className="font-bold text-primary-700 hover:text-primary-900 flex items-center gap-1"
          >
            <span>Go to Full Properties Directory</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      {/* ── RECENT INQUIRIES & CALL BACK REQUESTS ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Callback Requests */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-card p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
            <div>
              <h3 className="font-display font-bold text-stone-900 text-base">
                Recent Callback Requests
              </h3>
              <p className="text-xs text-stone-500">Tenants requesting contact from our desk.</p>
            </div>
            <Link to="/admin/requests" className="text-xs font-bold text-primary-700 hover:text-primary-900">
              View All ({DEMO_BOOKING_REQUESTS.length})
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_BOOKING_REQUESTS.slice(0, 4).map(req => (
              <div
                key={req.id}
                className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-xs">{req.customer_name}</span>
                    <span className="text-[10px] bg-primary-100 text-primary-800 font-bold px-2 py-0.5 rounded-full">
                      {req.request_type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-1">
                    <Phone size={11} className="text-stone-400" />
                    <span>{req.customer_phone}</span>
                    <span>•</span>
                    <Clock size={11} className="text-stone-400" />
                    <span>{timeAgo(req.created_at)}</span>
                  </div>
                </div>

                <Link to={`/admin/requests/${req.id}`}>
                  <Button size="sm" variant="outline" className="text-xs font-semibold">
                    Manage
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Owner Submissions Queue */}
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-card p-6">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100">
            <div>
              <h3 className="font-display font-bold text-stone-900 text-base">
                Owner Listing Submissions
              </h3>
              <p className="text-xs text-stone-500">Pending verification and onboarding.</p>
            </div>
            <Link to="/admin/pending" className="text-xs font-bold text-primary-700 hover:text-primary-900">
              View All ({DEMO_SUBMISSIONS.length})
            </Link>
          </div>

          <div className="space-y-3">
            {DEMO_SUBMISSIONS.slice(0, 4).map(sub => (
              <div
                key={sub.id}
                className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="font-bold text-stone-900 text-xs">{sub.locality} ({sub.bhk} BHK)</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    By {sub.submitter_name} • {formatRent(sub.rent_paise)}/mo
                  </p>
                </div>

                <Link to={`/admin/submissions/${sub.id}`}>
                  <Button size="sm" variant="primary" className="bg-primary-700 text-xs font-semibold">
                    Review
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminDashboardPage
