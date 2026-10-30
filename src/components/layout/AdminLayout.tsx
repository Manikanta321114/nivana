import React, { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Building2, ClipboardList, Bell,
  LogOut, Menu, ExternalLink, Settings, ShieldCheck
} from 'lucide-react'
import { cn } from '../../utils'
import { useAdminAuth } from '../../hooks/useAdminAuth'

const NAV_ITEMS = [
  { to: '/admin',            label: 'Overview',       icon: LayoutDashboard, exact: true },
  { to: '/admin/properties', label: 'Properties',     icon: Building2 },
  { to: '/admin/pending',    label: 'Pending Review', icon: ClipboardList, badge: 'New' },
  { to: '/admin/requests',   label: 'Inquiries',      icon: Bell },
  { to: '/admin/settings',   label: 'Settings',       icon: Settings },
]

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { admin, logout } = useAdminAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login')
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white border-r border-stone-200">
      {/* Official NIVASA Logo */}
      <div className="px-6 py-5 border-b border-stone-100 flex items-center justify-between">
        <Link to="/admin" className="flex items-center">
          <img
            src="/nivasa_logo.png"
            alt="NIVASA Admin"
            className="h-10 w-auto object-contain"
          />
        </Link>
      </div>

      <div className="px-5 py-3 bg-stone-50/70 border-b border-stone-100 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-primary-800 flex items-center gap-1.5">
          <ShieldCheck size={14} className="text-primary-600" />
          Admin Portal
        </span>
        <span className="text-[10px] bg-primary-100 text-primary-800 font-bold px-2 py-0.5 rounded-full">
          Superadmin
        </span>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto" aria-label="Admin navigation">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.exact}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) => cn(
              'flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150',
              isActive
                ? 'bg-primary-700 text-white shadow-sm'
                : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900',
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon size={18} className="flex-shrink-0" />
              <span>{item.label}</span>
            </div>
            {item.badge && (
              <span className="text-[10px] font-bold bg-accent-400 text-stone-950 px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Admin user info & public link */}
      <div className="p-4 border-t border-stone-200 bg-stone-50/60 space-y-3">
        <div className="flex items-center gap-3 px-1">
          <div className="w-9 h-9 rounded-full bg-primary-700 flex items-center justify-center text-white text-sm font-bold uppercase shadow-sm">
            {admin?.username?.[0] ?? 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-stone-900 truncate">{admin?.username ?? 'Administrator'}</p>
            <p className="text-[11px] text-stone-500 truncate">Secured Session</p>
          </div>
        </div>

        <div className="pt-2 flex flex-col gap-1.5">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200/60 transition-colors"
          >
            <span>Public Website</span>
            <ExternalLink size={13} className="text-stone-400" />
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center justify-between w-full px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors"
          >
            <span>Sign Out</span>
            <LogOut size={13} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-64 max-w-xs z-10 flex-shrink-0">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main content body */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile top header bar */}
        <header className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-stone-200">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-stone-700 hover:bg-stone-100 rounded-xl"
            aria-label="Open sidebar"
          >
            <Menu size={22} />
          </button>
          <img src="/nivasa_logo.png" alt="NIVASA" className="h-8 w-auto" />
          <button
            type="button"
            onClick={handleLogout}
            className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl"
            title="Sign out"
          >
            <LogOut size={18} />
          </button>
        </header>

        {/* Scrollable page body */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
export default AdminLayout
