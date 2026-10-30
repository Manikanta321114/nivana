import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { ConfirmDialog } from '../../components/ui/Modal'
import { EmptyState } from '../../components/ui/States'
import { DEMO_ADMIN_PROPERTIES } from '../../constants/demoProperties'
import type { AdminProperty, ListingStatus } from '../../types'
import { formatRent, formatBHK, formatPropertyType } from '../../utils'
import { LISTING_STATUS_LABELS } from '../../constants/amenities'

const LISTING_STATUS_OPTIONS: { value: ListingStatus | ''; label: string }[] = [
  { value: '', label: 'All Statuses' },
  { value: 'PUBLISHED', label: 'Published' },
  { value: 'UNPUBLISHED', label: 'Unpublished' },
  { value: 'ARCHIVED', label: 'Archived' },
]

const AdminPropertiesPage: React.FC = () => {
  const navigate = useNavigate()

  // Local state for demo interactions
  const [properties, setProperties] = useState<AdminProperty[]>(DEMO_ADMIN_PROPERTIES)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<ListingStatus | ''>('')

  // Delete confirm dialog
  const [deleteTarget, setDeleteTarget] = useState<AdminProperty | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Filtered list
  const filtered = properties.filter(p => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      p.property_ref.toLowerCase().includes(q) ||
      p.title.toLowerCase().includes(q) ||
      p.locality.toLowerCase().includes(q)
    const matchesStatus = !statusFilter || p.listing_status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleTogglePublish = (prop: AdminProperty) => {
    setProperties(prev =>
      prev.map(p =>
        p.id === prop.id
          ? {
              ...p,
              listing_status:
                p.listing_status === 'PUBLISHED' ? 'UNPUBLISHED' : 'PUBLISHED',
            }
          : p
      )
    )
  }

  const handleDelete = () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    // Simulate async delete
    setTimeout(() => {
      setProperties(prev => prev.filter(p => p.id !== deleteTarget.id))
      setDeleteTarget(null)
      setDeleteLoading(false)
    }, 700)
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-stone-900">Properties</h1>
          <p className="text-stone-500 text-sm mt-1">
            Manage all {properties.length} listed properties
          </p>
        </div>
        <Link to="/admin/properties/new">
          <Button variant="primary" size="sm" leftIcon={<Plus size={15} />}>
            Add Property
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-card border border-stone-100 p-4 mb-5 flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by ref, title, or locality…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="input-base pl-9 py-2 text-sm w-full"
          />
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as ListingStatus | '')}
          className="input-base appearance-none py-2 text-sm w-full sm:w-44"
        >
          {LISTING_STATUS_OPTIONS.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card border border-stone-100 overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={<span>🏘️</span>}
            title="No properties found"
            description="Try adjusting your search or filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-stone-50 text-stone-500 text-xs uppercase">
                  <th className="text-left px-5 py-3 font-medium tracking-wide">Ref</th>
                  <th className="text-left px-5 py-3 font-medium tracking-wide">Title</th>
                  <th className="text-left px-5 py-3 font-medium tracking-wide hidden md:table-cell">Locality</th>
                  <th className="text-left px-5 py-3 font-medium tracking-wide hidden lg:table-cell">Type / BHK</th>
                  <th className="text-left px-5 py-3 font-medium tracking-wide hidden sm:table-cell">Rent</th>
                  <th className="text-left px-5 py-3 font-medium tracking-wide">Status</th>
                  <th className="text-right px-5 py-3 font-medium tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(prop => (
                  <tr
                    key={prop.id}
                    className="border-b border-stone-100 hover:bg-stone-50 transition-colors"
                  >
                    <td className="px-5 py-3.5">
                      <span className="text-xs font-mono text-stone-500">{prop.property_ref}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-stone-800 truncate max-w-[180px]">{prop.title}</p>
                      <p className="text-xs text-stone-400 md:hidden">{prop.locality}</p>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <span className="text-sm text-stone-600">{prop.locality}</span>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <span className="text-sm text-stone-600">
                        {formatPropertyType(prop.property_type)} · {formatBHK(prop.bhk)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <span className="text-sm font-medium text-stone-800">{formatRent(prop.rent_paise)}</span>
                      <span className="text-xs text-stone-400">/mo</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge
                        status={prop.listing_status}
                        label={LISTING_STATUS_LABELS[prop.listing_status]}
                        size="sm"
                      />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Edit */}
                        <button
                          onClick={() => navigate(`/admin/properties/${prop.id}/edit`)}
                          title="Edit property"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-primary-700 hover:bg-primary-50 transition-colors"
                        >
                          <Pencil size={15} />
                        </button>

                        {/* Publish / Unpublish */}
                        <button
                          onClick={() => handleTogglePublish(prop)}
                          title={prop.listing_status === 'PUBLISHED' ? 'Unpublish' : 'Publish'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            prop.listing_status === 'PUBLISHED'
                              ? 'text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50'
                              : 'text-stone-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                        >
                          {prop.listing_status === 'PUBLISHED' ? (
                            <EyeOff size={15} />
                          ) : (
                            <Eye size={15} />
                          )}
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteTarget(prop)}
                          title="Delete property"
                          className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {filtered.length > 0 && (
        <p className="text-xs text-stone-400 mt-3 px-1">
          Showing {filtered.length} of {properties.length} properties
        </p>
      )}

      {/* Delete Confirm Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        variant="danger"
        title="Delete Property"
        confirmLabel="Yes, Delete"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}" (${deleteTarget.property_ref})? This action cannot be undone.`
            : ''
        }
      />
    </div>
  )
}

export default AdminPropertiesPage
