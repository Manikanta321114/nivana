import React, { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Building2, ClipboardList, Bell,
  LogOut, Menu, X, Home, ChevronRight, Settings,
} from 'lucide-react'
import { cn } from '../../utils'
import { useAdminAuth } from '../../hooks/useAdminAuth'

const NAV_ITEMS = [
  { to: '/admin',            label: 'Dashboard',      icon: LayoutDashboard, exact: true },
  { to: '/admin/properties', label: 'Properties',     icon: Building2 },
  { to: '/admin/pending',    label: 'Pending Review', icon: ClipboardList },
  { to: '/admin/requests',   label: 'Inquiries',      icon: Bell },
  { to: '/admin/settings',   label: 'Settings',       icon: Settings },
]

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { admin, logout }             = useAdminAuth()
  const navigate                       = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-stone-200">
        <Link to="/admin" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center">
            <Home size={15} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold font-display text-primary-900">NIVASA</p>
            <p className="text-xs text-stone-500">Admin Dashboard</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5" aria-label="Admin navigation">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
              isActive
                ? 'bg-primary-100 text-primary-800'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
            )}
          >
            <item.icon size={17} className="flex-shrink-0" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Admin info + logout */}
      <div className="px-3 py-4 border-t border-stone-200">
        <div className="flex items-center gap-3 px-3 py-2.5 mb-1">
          <div className="w-8 h-8 rounded-full bg-primary-200 flex items-center justify-center text-primary-800 text-sm font-bold uppercase">
            {admin?.username?.[0] ?? 'A'}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-stone-800 truncate">{admin?.username ?? 'Admin'}</p>
            <p className="text-xs text-stone-400">Administrator</p>
          </div>
        </div>
        <button
          id="admin-logout-btn"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-stone-600 hover:bg-red-50 hover:text-red-600 transition-colors"
        >
          <LogOut size={16} />
          Sign out
        </button>
        <div className="mt-3 px-3">
          <Link
            to="/"
            target="_blank"
            className="text-xs text-stone-400 hover:text-primary-600 flex items-center gap-1 transition-colors"
          >
            View public site <ChevronRight size={12} />
          </Link>
        </div>
      </div>
    </>
  )

  return (
    <div className="flex h-screen bg-bg-muted overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 bg-white border-r border-stone-200 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-stone-950/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
          <aside className="relative z-10 flex flex-col w-64 bg-white shadow-2xl animate-fade-in">
            <button
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
              className="absolute top-4 right-4 p-1.5 rounded-xl text-stone-400 hover:bg-stone-100"
            >
              <X size={18} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-stone-200">
          <button
            id="mobile-sidebar-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
            className="p-2 rounded-xl text-stone-600 hover:bg-stone-100"
          >
            <Menu size={20} />
          </button>
          <p className="text-sm font-semibold text-stone-800">NIVASA Admin</p>
          <div className="w-9" />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
