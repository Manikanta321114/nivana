import React from 'react'
import { Link } from 'react-router-dom'
import {
  Building2, CheckCircle, Bell, ClipboardList,
  TrendingUp, ArrowRight, Plus, Eye, Clock,
} from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { DEMO_ADMIN_PROPERTIES } from '../../constants/demoProperties'
import { DEMO_BOOKING_REQUESTS, DEMO_SUBMISSIONS } from '../../constants/demoData'
import { formatDate, timeAgo } from '../../utils'
import { REQUEST_STATUS_LABELS } from '../../constants/amenities'

// ── Stat Card ─────────────────────────────────────────────────────
interface StatCardProps {
  label: string
  value: number | string
  icon: React.ReactNode
  iconBg: string
  trend?: string
  trendUp?: boolean
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon, iconBg, trend, trendUp }) => (
  <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-5 flex items-center gap-4">
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-2xl font-bold text-stone-900 leading-tight">{value}</p>
      <p className="text-sm text-stone-500 mt-0.5">{label}</p>
      {trend && (
        <p className={`text-xs mt-1 flex items-center gap-1 font-medium ${trendUp ? 'text-emerald-600' : 'text-amber-600'}`}>
          <TrendingUp size={11} />
          {trend}
        </p>
      )}
    </div>
  </div>
)

// ── Quick Link Card ────────────────────────────────────────────────
interface QuickLinkProps {
  to: string
  icon: React.ReactNode
  label: string
  description: string
  accent: string
}

const QuickLink: React.FC<QuickLinkProps> = ({ to, icon, label, description, accent }) => (
  <Link
    to={to}
    className="bg-white rounded-2xl border border-stone-100 shadow-card p-5 flex items-center gap-4 hover:shadow-md transition-all duration-200 group"
  >
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${accent}`}>
      {icon}
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-sm font-semibold text-stone-800 group-hover:text-primary-700 transition-colors">{label}</p>
      <p className="text-xs text-stone-500 mt-0.5">{description}</p>
    </div>
    <ArrowRight size={16} className="text-stone-300 group-hover:text-primary-600 transition-colors flex-shrink-0" />
  </Link>
)

// ── Main Page ─────────────────────────────────────────────────────
const AdminDashboardPage: React.FC = () => {
  const totalProperties = DEMO_ADMIN_PROPERTIES.length
  const publishedProperties = DEMO_ADMIN_PROPERTIES.filter(p => p.listing_status === 'PUBLISHED').length
  const newRequests = DEMO_BOOKING_REQUESTS.filter(r => r.status === 'NEW').length
  const pendingSubmissions = DEMO_SUBMISSIONS.filter(s => s.verification_status === 'PENDING').length

  // 5 most recent requests
  const recentRequests = [...DEMO_BOOKING_REQUESTS]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 5)

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-stone-900">Dashboard</h1>
        <p className="text-stone-500 text-sm mt-1">
          Overview of your NIVASA platform — {formatDate(new Date().toISOString())}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Properties"
          value={totalProperties}
          icon={<Building2 size={22} className="text-primary-700" />}
          iconBg="bg-primary-50"
          trend="All sources"
        />
        <StatCard
          label="Published Listings"
          value={publishedProperties}
          icon={<CheckCircle size={22} className="text-emerald-600" />}
          iconBg="bg-emerald-50"
          trend={`${totalProperties - publishedProperties} unpublished`}
        />
        <StatCard
          label="New Inquiries"
          value={newRequests}
          icon={<Bell size={22} className="text-amber-600" />}
          iconBg="bg-amber-50"
          trend="Needs attention"
          trendUp={newRequests > 0}
        />
        <StatCard
          label="Pending Submissions"
          value={pendingSubmissions}
          icon={<ClipboardList size={22} className="text-blue-600" />}
          iconBg="bg-blue-50"
          trend="Awaiting review"
          trendUp={pendingSubmissions > 0}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Recent Requests Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl shadow-card border border-stone-100">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <div>
              <h2 className="text-base font-semibold text-stone-800">Recent Inquiries</h2>
              <p className="text-xs text-stone-400 mt-0.5">Latest 5 booking requests</p>
            </div>
            <Link
              to="/admin/requests"
              className="text-xs font-medium text-primary-700 hover:text-primary-800 flex items-center gap-1 transition-colors"
            >
              View all <ArrowRight size={13} />
            </Link>
          </div>

          {recentRequests.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-sm">No requests yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-stone-50 text-stone-500 text-xs uppercase">
                    <th className="text-left px-5 py-3 font-medium tracking-wide">Ref</th>
                    <th className="text-left px-5 py-3 font-medium tracking-wide">Customer</th>
                    <th className="text-left px-5 py-3 font-medium tracking-wide hidden sm:table-cell">Property</th>
                    <th className="text-left px-5 py-3 font-medium tracking-wide">Status</th>
                    <th className="text-left px-5 py-3 font-medium tracking-wide hidden md:table-cell">When</th>
                  </tr>
                </thead>
                <tbody>
                  {recentRequests.map(req => (
                    <tr
                      key={req.id}
                      className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <Link
                          to={`/admin/requests/${req.id}`}
                          className="text-xs font-mono text-primary-700 hover:underline"
                        >
                          {req.request_ref}
                        </Link>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-sm text-stone-800 font-medium truncate max-w-[120px]">{req.customer_name}</p>
                        <p className="text-xs text-stone-400 capitalize">{req.request_type.toLowerCase()}</p>
                      </td>
                      <td className="px-5 py-3 hidden sm:table-cell">
                        <p className="text-xs text-stone-600 truncate max-w-[160px]">{req.property_title}</p>
                        <p className="text-xs text-stone-400">{req.property_ref}</p>
                      </td>
                      <td className="px-5 py-3">
                        <Badge
                          status={req.status}
                          label={REQUEST_STATUS_LABELS[req.status] ?? req.status}
                          size="sm"
                        />
                      </td>
                      <td className="px-5 py-3 hidden md:table-cell">
                        <p className="text-xs text-stone-500">{timeAgo(req.created_at)}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h2 className="text-base font-semibold text-stone-800 px-1">Quick Actions</h2>

          <QuickLink
            to="/admin/properties/new"
            icon={<Plus size={18} className="text-primary-700" />}
            label="Add New Property"
            description="Manually list a property"
            accent="bg-primary-50"
          />
          <QuickLink
            to="/admin/properties"
            icon={<Building2 size={18} className="text-indigo-600" />}
            label="Manage Properties"
            description={`${totalProperties} total, ${publishedProperties} live`}
            accent="bg-indigo-50"
          />
          <QuickLink
            to="/admin/pending"
            icon={<ClipboardList size={18} className="text-blue-600" />}
            label="Review Submissions"
            description={`${pendingSubmissions} pending your review`}
            accent="bg-blue-50"
          />
          <QuickLink
            to="/admin/requests"
            icon={<Bell size={18} className="text-amber-600" />}
            label="Inquiries & Visits"
            description={`${newRequests} new, action needed`}
            accent="bg-amber-50"
          />
          <QuickLink
            to="/"
            icon={<Eye size={18} className="text-stone-500" />}
            label="View Public Site"
            description="Opens in current tab"
            accent="bg-stone-100"
          />

          {/* Summary card */}
          <div className="bg-primary-50 rounded-2xl border border-primary-100 p-5 mt-2">
            <div className="flex items-center gap-2 mb-3">
              <Clock size={14} className="text-primary-600" />
              <p className="text-xs font-semibold text-primary-700 uppercase tracking-wide">Submission Queue</p>
            </div>
            {DEMO_SUBMISSIONS.map(sub => (
              <Link
                key={sub.id}
                to={`/admin/pending/${sub.id}`}
                className="flex items-center justify-between py-1.5 group"
              >
                <span className="text-xs text-stone-700 font-mono">{sub.submission_ref}</span>
                <Badge status={sub.verification_status} size="sm" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
