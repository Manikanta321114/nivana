import React, { useState } from 'react'
import {
  User, Lock, Bell, Globe, Shield, Save, Eye, EyeOff,
  CheckCircle, AlertCircle, Building2, Phone, Mail, MapPin,
  Moon, Sun, Monitor, Palette,
} from 'lucide-react'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { Button } from '../../components/ui/Button'
import { cn } from '../../utils'

// ── Section wrapper ─────────────────────────────────────────────────
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={cn('bg-white rounded-2xl shadow-card border border-stone-100 p-6', className)}>
    {children}
  </div>
)

const SectionTitle: React.FC<{ icon: React.ReactNode; title: string; description: string }> = ({
  icon, title, description,
}) => (
  <div className="flex items-start gap-3 mb-6 pb-4 border-b border-stone-100">
    <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
      {icon}
    </div>
    <div>
      <h2 className="text-base font-semibold text-stone-900">{title}</h2>
      <p className="text-xs text-stone-500 mt-0.5">{description}</p>
    </div>
  </div>
)

// ── Toggle switch ───────────────────────────────────────────────────
const Toggle: React.FC<{
  id: string
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}> = ({ id, label, description, checked, onChange, disabled }) => (
  <div className="flex items-center justify-between py-3">
    <div className="min-w-0">
      <label htmlFor={id} className="text-sm font-medium text-stone-800 cursor-pointer">
        {label}
      </label>
      {description && <p className="text-xs text-stone-400 mt-0.5">{description}</p>}
    </div>
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-6 w-11 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1',
        checked ? 'bg-primary-600' : 'bg-stone-200',
        disabled && 'opacity-40 cursor-not-allowed',
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition duration-200',
          checked ? 'translate-x-5' : 'translate-x-0',
        )}
      />
    </button>
  </div>
)

// ── Toast notification ──────────────────────────────────────────────
const Toast: React.FC<{ message: string; type: 'success' | 'error'; onDone: () => void }> = ({
  message, type, onDone,
}) => {
  React.useEffect(() => {
    const t = setTimeout(onDone, 3000)
    return () => clearTimeout(t)
  }, [onDone])

  return (
    <div className={cn(
      'fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-2xl shadow-xl text-sm font-medium animate-slide-up',
      type === 'success' ? 'bg-emerald-600 text-white' : 'bg-red-500 text-white',
    )}>
      {type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
      {message}
    </div>
  )
}

// ── TABS ────────────────────────────────────────────────────────────
type Tab = 'profile' | 'notifications' | 'platform' | 'security' | 'appearance'

const TABS: { id: Tab; label: string; icon: React.ComponentType<any> }[] = [
  { id: 'profile',       label: 'Profile',       icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'platform',      label: 'Platform',      icon: Globe },
  { id: 'security',      label: 'Security',      icon: Shield },
  { id: 'appearance',    label: 'Appearance',    icon: Palette },
]

// ══════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ══════════════════════════════════════════════════════════════════════
const AdminSettingsPage: React.FC = () => {
  const { admin } = useAdminAuth()
  const [activeTab, setActiveTab] = useState<Tab>('profile')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [saving, setSaving] = useState(false)

  // ── Profile state ─────────────────────────────────────────────────
  const [profile, setProfile] = useState({
    full_name:  admin?.full_name?.replace('[DEMO] ', '') ?? '',
    email:      admin?.email ?? '',
    phone:      '',
    role:       admin?.is_superadmin ? 'Super Admin' : 'Staff',
    bio:        '',
  })

  // ── Password state ────────────────────────────────────────────────
  const [pwd, setPwd] = useState({ current: '', next: '', confirm: '' })
  const [showPwd, setShowPwd] = useState({ current: false, next: false, confirm: false })

  // ── Notification prefs ────────────────────────────────────────────
  const [notif, setNotif] = useState({
    new_inquiry:    true,
    new_submission: true,
    property_visit: true,
    system_alerts:  true,
    email_digest:   false,
    browser_push:   false,
  })

  // ── Platform settings ─────────────────────────────────────────────
  const [platform, setPlatform] = useState({
    site_name:     'NIVASA',
    tagline:       'Bengaluru Rentals',
    contact_email: 'hello@nivasa.in',
    contact_phone: '',
    address:       'Bengaluru, Karnataka, India',
    auto_publish:  false,
    review_mode:   true,
    max_photos:    12,
  })

  // ── Appearance ────────────────────────────────────────────────────
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('light')

  // ── Helpers ───────────────────────────────────────────────────────
  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
  }

  const simulateSave = async (cb?: () => void) => {
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    setSaving(false)
    cb?.()
    showToast('Settings saved successfully.')
  }

  // ── Password save ─────────────────────────────────────────────────
  const handlePasswordSave = async () => {
    if (!pwd.current) { showToast('Enter your current password.', 'error'); return }
    if (pwd.next.length < 8) { showToast('New password must be at least 8 characters.', 'error'); return }
    if (pwd.next !== pwd.confirm) { showToast('Passwords do not match.', 'error'); return }
    await simulateSave(() => setPwd({ current: '', next: '', confirm: '' }))
  }

  // ══════════════════════════════════════════════════════════════════
  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-display font-bold text-stone-900">Settings</h1>
        <p className="text-stone-500 text-sm mt-1">Manage your account, platform preferences, and notifications.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Tab sidebar ─────────────────────────────────────────── */}
        <nav className="lg:w-52 flex-shrink-0" aria-label="Settings sections">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-card p-2 flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {TABS.map(tab => (
              <button
                key={tab.id}
                id={`settings-tab-${tab.id}`}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap w-full text-left',
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-800'
                    : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900',
                )}
              >
                <tab.icon size={16} className="flex-shrink-0" />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* ── Tab content ─────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* ── PROFILE ─────────────────────────────────────────── */}
          {activeTab === 'profile' && (
            <>
              <Card>
                <SectionTitle
                  icon={<User size={18} className="text-primary-700" />}
                  title="My Profile"
                  description="Your public admin identity visible to other NIVASA staff."
                />

                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary-200 flex items-center justify-center text-primary-800 text-2xl font-bold uppercase shadow-sm">
                    {profile.full_name?.[0] ?? admin?.username?.[0] ?? 'A'}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-800">{profile.full_name || admin?.username}</p>
                    <p className="text-xs text-stone-400">{profile.role}</p>
                    <p className="text-xs text-primary-600 mt-1 font-mono">{admin?.username}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                        Full Name
                      </label>
                      <div className="relative">
                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          id="setting-full-name"
                          className="input-base pl-9"
                          value={profile.full_name}
                          onChange={e => setProfile(p => ({ ...p, full_name: e.target.value }))}
                          placeholder="Your full name"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          id="setting-email"
                          type="email"
                          className="input-base pl-9"
                          value={profile.email}
                          onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                          placeholder="admin@example.com"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                      Phone (optional)
                    </label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        id="setting-phone"
                        type="tel"
                        className="input-base pl-9"
                        value={profile.phone}
                        onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))}
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                      Short Bio
                    </label>
                    <textarea
                      id="setting-bio"
                      rows={3}
                      className="input-base resize-none"
                      value={profile.bio}
                      onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                      placeholder="A short note about your role at NIVASA…"
                    />
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <Button
                    id="save-profile-btn"
                    variant="primary"
                    loading={saving}
                    leftIcon={<Save size={15} />}
                    onClick={() => simulateSave()}
                  >
                    Save Profile
                  </Button>
                </div>
              </Card>

              {/* Change Password */}
              <Card>
                <SectionTitle
                  icon={<Lock size={18} className="text-amber-600" />}
                  title="Change Password"
                  description="Use a strong, unique password for your admin account."
                />
                <div className="space-y-4">
                  {(['current', 'next', 'confirm'] as const).map(key => (
                    <div key={key}>
                      <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">
                        {key === 'current' ? 'Current Password' : key === 'next' ? 'New Password' : 'Confirm New Password'}
                      </label>
                      <div className="relative">
                        <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          id={`setting-pwd-${key}`}
                          type={showPwd[key] ? 'text' : 'password'}
                          className="input-base pl-9 pr-10"
                          value={pwd[key]}
                          onChange={e => setPwd(p => ({ ...p, [key]: e.target.value }))}
                          placeholder="••••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPwd(s => ({ ...s, [key]: !s[key] }))}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                        >
                          {showPwd[key] ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-5 flex justify-end">
                  <Button
                    id="save-password-btn"
                    variant="primary"
                    loading={saving}
                    leftIcon={<Lock size={15} />}
                    onClick={handlePasswordSave}
                  >
                    Update Password
                  </Button>
                </div>
              </Card>
            </>
          )}

          {/* ── NOTIFICATIONS ──────────────────────────────────────── */}
          {activeTab === 'notifications' && (
            <Card>
              <SectionTitle
                icon={<Bell size={18} className="text-primary-700" />}
                title="Notification Preferences"
                description="Choose what alerts you receive as an admin."
              />
              <div className="divide-y divide-stone-100">
                <Toggle id="notif-inquiry"    label="New Inquiry / Callback Request" description="When a tenant submits a callback or visit request."           checked={notif.new_inquiry}    onChange={v => setNotif(n => ({ ...n, new_inquiry: v }))} />
                <Toggle id="notif-submission" label="New Property Submission"         description="When an owner submits a property via the public form."        checked={notif.new_submission} onChange={v => setNotif(n => ({ ...n, new_submission: v }))} />
                <Toggle id="notif-visit"      label="Visit Scheduled"                 description="When a site visit is confirmed with a tenant."               checked={notif.property_visit} onChange={v => setNotif(n => ({ ...n, property_visit: v }))} />
                <Toggle id="notif-alerts"     label="System Alerts"                   description="Platform errors, maintenance notices, and critical updates."  checked={notif.system_alerts}  onChange={v => setNotif(n => ({ ...n, system_alerts: v }))} />
                <Toggle id="notif-digest"     label="Daily Email Digest"              description="Morning summary of all activity from the previous day."       checked={notif.email_digest}   onChange={v => setNotif(n => ({ ...n, email_digest: v }))} />
                <Toggle id="notif-push"       label="Browser Push Notifications"      description="Real-time browser notifications (requires permission)."       checked={notif.browser_push}   onChange={v => setNotif(n => ({ ...n, browser_push: v }))} disabled />
              </div>
              <div className="mt-5 flex justify-end">
                <Button id="save-notif-btn" variant="primary" loading={saving} leftIcon={<Save size={15} />} onClick={() => simulateSave()}>
                  Save Preferences
                </Button>
              </div>
            </Card>
          )}

          {/* ── PLATFORM ──────────────────────────────────────────── */}
          {activeTab === 'platform' && (
            <Card>
              <SectionTitle
                icon={<Globe size={18} className="text-primary-700" />}
                title="Platform Settings"
                description="Global configuration for the NIVASA rental platform."
              />
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">Site Name</label>
                    <div className="relative">
                      <Building2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input id="plat-name" className="input-base pl-9" value={platform.site_name} onChange={e => setPlatform(p => ({ ...p, site_name: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">Tagline</label>
                    <input id="plat-tagline" className="input-base" value={platform.tagline} onChange={e => setPlatform(p => ({ ...p, tagline: e.target.value }))} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">Contact Email</label>
                    <div className="relative">
                      <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input id="plat-email" type="email" className="input-base pl-9" value={platform.contact_email} onChange={e => setPlatform(p => ({ ...p, contact_email: e.target.value }))} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">Contact Phone</label>
                    <div className="relative">
                      <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input id="plat-phone" type="tel" className="input-base pl-9" value={platform.contact_phone} onChange={e => setPlatform(p => ({ ...p, contact_phone: e.target.value }))} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">Office Address</label>
                  <div className="relative">
                    <MapPin size={14} className="absolute left-3 top-3 text-stone-400" />
                    <textarea id="plat-address" rows={2} className="input-base pl-9 resize-none" value={platform.address} onChange={e => setPlatform(p => ({ ...p, address: e.target.value }))} />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1.5">Max Photos per Property</label>
                  <input id="plat-maxphotos" type="number" min={1} max={30} className="input-base w-32" value={platform.max_photos} onChange={e => setPlatform(p => ({ ...p, max_photos: Number(e.target.value) }))} />
                </div>

                <div className="pt-4 border-t border-stone-100 divide-y divide-stone-100">
                  <Toggle id="plat-autopublish" label="Auto-Publish Approved Properties" description="Automatically make a listing live when admin approves a submission." checked={platform.auto_publish} onChange={v => setPlatform(p => ({ ...p, auto_publish: v }))} />
                  <Toggle id="plat-reviewmode"  label="Submission Review Required"         description="All owner submissions must pass admin review before going live."   checked={platform.review_mode}  onChange={v => setPlatform(p => ({ ...p, review_mode: v }))} />
                </div>
              </div>
              <div className="mt-5 flex justify-end">
                <Button id="save-platform-btn" variant="primary" loading={saving} leftIcon={<Save size={15} />} onClick={() => simulateSave()}>
                  Save Platform Settings
                </Button>
              </div>
            </Card>
          )}

          {/* ── SECURITY ──────────────────────────────────────────── */}
          {activeTab === 'security' && (
            <Card>
              <SectionTitle
                icon={<Shield size={18} className="text-primary-700" />}
                title="Security & Sessions"
                description="Manage access controls and active sessions."
              />

              {/* Account info */}
              <div className="mb-6 bg-stone-50 rounded-xl border border-stone-100 p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500 font-medium">Username</span>
                  <span className="font-mono text-stone-800">{admin?.username}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500 font-medium">Role</span>
                  <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', admin?.is_superadmin ? 'bg-primary-100 text-primary-800' : 'bg-stone-200 text-stone-700')}>
                    {admin?.is_superadmin ? 'Super Admin' : 'Staff'}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500 font-medium">Account Created</span>
                  <span className="text-stone-600">{admin?.created_at ? new Date(admin.created_at).toLocaleDateString('en-IN') : '—'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500 font-medium">Last Login</span>
                  <span className="text-stone-600">{admin?.last_login_at ? new Date(admin.last_login_at).toLocaleString('en-IN') : '—'}</span>
                </div>
              </div>

              {/* Active sessions */}
              <h3 className="text-sm font-semibold text-stone-800 mb-3">Active Sessions</h3>
              <div className="rounded-xl border border-stone-200 overflow-hidden">
                <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border-b border-emerald-100">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-stone-800">This Device</p>
                    <p className="text-xs text-stone-500">Browser Session · Bengaluru, India</p>
                  </div>
                  <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-full">Current</span>
                </div>
              </div>

              <div className="mt-5 flex justify-end">
                <Button id="revoke-sessions-btn" variant="outline" onClick={() => showToast('All other sessions revoked.', 'success')}>
                  Revoke All Other Sessions
                </Button>
              </div>
            </Card>
          )}

          {/* ── APPEARANCE ────────────────────────────────────────── */}
          {activeTab === 'appearance' && (
            <Card>
              <SectionTitle
                icon={<Palette size={18} className="text-primary-700" />}
                title="Appearance"
                description="Customize how the admin dashboard looks."
              />

              <h3 className="text-sm font-semibold text-stone-700 mb-3">Theme Mode</h3>
              <div className="grid grid-cols-3 gap-3 mb-6">
                {([
                  { value: 'light',  label: 'Light',  icon: Sun },
                  { value: 'dark',   label: 'Dark',   icon: Moon },
                  { value: 'system', label: 'System', icon: Monitor },
                ] as const).map(opt => (
                  <button
                    key={opt.value}
                    id={`theme-${opt.value}`}
                    type="button"
                    onClick={() => setTheme(opt.value)}
                    className={cn(
                      'flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-sm font-semibold transition-all',
                      theme === opt.value
                        ? 'border-primary-500 bg-primary-50 text-primary-800'
                        : 'border-stone-200 text-stone-500 hover:border-stone-300',
                    )}
                  >
                    <opt.icon size={22} />
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700 flex items-center gap-2">
                <AlertCircle size={14} />
                Dark mode will be fully available when the live backend is connected.
              </div>

              <div className="mt-5 flex justify-end">
                <Button id="save-appearance-btn" variant="primary" loading={saving} leftIcon={<Save size={15} />} onClick={() => simulateSave()}>
                  Save Appearance
                </Button>
              </div>
            </Card>
          )}

        </div>
      </div>

      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onDone={() => setToast(null)} />
      )}
    </div>
  )
}

export default AdminSettingsPage
