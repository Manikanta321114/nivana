import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Lock, Phone, Mail, User, ShieldCheck, ArrowRight,
  Sparkles, CheckCircle2,
} from 'lucide-react'
import { useUserAuth } from '../../hooks/useUserAuth'
import { Modal } from '../ui/Modal'
import { Button } from '../ui/Button'
import { cn } from '../../utils'

export const UserAuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    authModalMode,
    pendingRedirectUrl,
    isSupabaseLive,
    isDevMode,
    closeAuthModal,
    openLoginModal,
    openSignupModal,
    login,
    signup,
    quickDemoLogin,
  } = useUserAuth()

  const navigate = useNavigate()

  // Form states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePostAuthRedirect = () => {
    if (pendingRedirectUrl) {
      navigate(pendingRedirectUrl)
    }
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await login(email, password)
    setLoading(false)

    if (!res.success) {
      setError(res.error || 'Login failed')
      return
    }

    handlePostAuthRedirect()
  }

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const res = await signup(fullName, email, password, phone)
    setLoading(false)

    if (!res.success) {
      setError(res.error || 'Signup failed')
      return
    }

    handlePostAuthRedirect()
  }

  const handleQuickDemo = () => {
    quickDemoLogin()
    handlePostAuthRedirect()
  }

  return (
    <Modal
      isOpen={isAuthModalOpen}
      onClose={closeAuthModal}
      size="md"
    >
      <div className="p-6 sm:p-7">
        {/* Header icon badge */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center text-primary-700 shadow-sm">
            <Lock size={22} />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-200/60">
            {isSupabaseLive ? 'Supabase Auth' : 'NIVASA Verified Access'}
          </span>
        </div>

        {/* Title */}
        <div className="mb-5">
          <h3 className="text-xl font-display font-bold text-stone-900">
            {authModalMode === 'LOGIN' ? 'Sign in to unlock property' : 'Create your tenant account'}
          </h3>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 leading-relaxed">
            {authModalMode === 'LOGIN'
              ? 'Please sign in to view verified property addresses, schedule visits, and contact owners.'
              : 'Join NIVASA to request free callbacks, book site visits, and explore curated homes.'}
          </p>
        </div>

        {/* Mode switcher tabs */}
        <div className="flex bg-stone-100 p-1 rounded-xl mb-5" role="tablist">
          <button
            type="button"
            onClick={() => { setError(null); openLoginModal() }}
            className={cn(
              'flex-1 py-2 text-xs font-semibold rounded-lg transition-all',
              authModalMode === 'LOGIN'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-800',
            )}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setError(null); openSignupModal() }}
            className={cn(
              'flex-1 py-2 text-xs font-semibold rounded-lg transition-all',
              authModalMode === 'SIGNUP'
                ? 'bg-white text-stone-900 shadow-sm'
                : 'text-stone-500 hover:text-stone-800',
            )}
          >
            Create Account
          </button>
        </div>

        {/* Error notification */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
            {error}
          </div>
        )}

        {/* ── Sign In Form ────────────────────────────────────────── */}
        {authModalMode === 'LOGIN' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-base pl-9 text-sm"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide">
                  Password
                </label>
                {!isSupabaseLive && <span className="text-[11px] text-stone-400">(optional in demo)</span>}
              </div>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required={isSupabaseLive}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-base pl-9 text-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={loading}
              rightIcon={<ArrowRight size={15} />}
            >
              Sign In & Continue
            </Button>
          </form>
        )}

        {/* ── Sign Up Form ────────────────────────────────────────── */}
        {authModalMode === 'SIGNUP' && (
          <form onSubmit={handleSignupSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Priya Nair"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  className="input-base pl-9 text-sm"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="email"
                  required
                  placeholder="e.g. priya@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="input-base pl-9 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                Password {isSupabaseLive && <span className="text-stone-400 text-[10px] lowercase">(min 6 characters)</span>}
              </label>
              <div className="relative">
                <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="password"
                  required={isSupabaseLive}
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-base pl-9 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wide mb-1.5">
                10-Digit Mobile Number (Optional)
              </label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="input-base pl-9 text-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              fullWidth
              loading={loading}
              rightIcon={<ArrowRight size={15} />}
              className="mt-2"
            >
              Create Account & Unlock
            </Button>
          </form>
        )}

        {/* ⚡ Quick One-Click Demo Login (Available ONLY in DEV mode) */}
        {isDevMode && (
          <>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-stone-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-stone-400 font-medium">development mode</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-4 rounded-xl border border-primary-200 bg-primary-50/70 hover:bg-primary-100 text-primary-800 text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-sm"
            >
              <Sparkles size={15} className="text-primary-600 flex-shrink-0" />
              <span>Quick Demo Login as <strong>Rahul Sharma</strong></span>
            </button>
          </>
        )}

        {/* Privacy guarantees */}
        <div className="mt-4 pt-4 border-t border-stone-100 flex items-center justify-center gap-4 text-[11px] text-stone-400">
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald-600" /> No spam guaranteed
          </span>
          <span className="flex items-center gap-1">
            <CheckCircle2 size={13} className="text-emerald-600" /> 100% Free for renters
          </span>
        </div>
      </div>
    </Modal>
  )
}
