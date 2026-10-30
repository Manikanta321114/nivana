import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Home, Lock, User, AlertCircle, ArrowLeft, ShieldCheck, KeyRound } from 'lucide-react'
import { useAdminAuth } from '../../hooks/useAdminAuth'
import { Button } from '../../components/ui/Button'

export const AdminLoginPage: React.FC = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { login, isAuthenticated } = useAdminAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin'
      navigate(from, { replace: true })
    }
  }, [isAuthenticated, navigate, location])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      const res = login(username.trim(), password.trim())
      setLoading(false)
      if (res.success) {
        const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin'
        navigate(from, { replace: true })
      } else {
        setError(res.error || 'Authentication failed. Please verify credentials.')
      }
    }, 400)
  }

  const fillCredentials = (user: string, pass: string) => {
    setUsername(user)
    setPassword(pass)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-stone-600 hover:text-primary-700 text-sm mb-6 transition-colors">
          <ArrowLeft size={16} /> Back to Public Website
        </Link>

        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 bg-primary-700 rounded-xl flex items-center justify-center text-white shadow-md">
            <Home size={22} />
          </div>
          <div>
            <span className="text-2xl font-display font-bold tracking-tight text-primary-950">NIVASA</span>
            <span className="ml-2 text-xs uppercase bg-primary-100 text-primary-800 font-semibold px-2 py-0.5 rounded-full">
              Admin Portal
            </span>
          </div>
        </div>
        <h2 className="mt-4 text-center text-xl font-bold tracking-tight text-stone-800">
          Sign in to Admin Dashboard
        </h2>
        <p className="mt-1 text-center text-xs text-stone-500">
          Restricted access for authorized NIVASA operations staff
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-stone-200 sm:px-10">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 flex items-start gap-2.5">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <User size={16} />
                </span>
                <input
                  type="text"
                  autoComplete="username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. demo_admin1"
                  className="input-base pl-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-stone-400">
                  <Lock size={16} />
                </span>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="input-base pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              fullWidth
              loading={loading}
              className="mt-2"
            >
              Sign In
            </Button>
          </form>

          {/* Demo helper card */}
          <div className="mt-8 pt-6 border-t border-stone-100">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-800 mb-2">
              <KeyRound size={13} className="text-amber-600" />
              <span>Demo Quick-Fill Accounts</span>
            </div>
            <p className="text-xs text-stone-500 mb-3">
              Click a profile to quickly test the administrator dashboard:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillCredentials('demo_admin1', 'demo_password_1')}
                className="text-left p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-center gap-1 text-xs font-semibold text-stone-800">
                  <ShieldCheck size={13} className="text-primary-600" />
                  Admin 1 (Super)
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">demo_admin1</div>
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('demo_admin2', 'demo_password_2')}
                className="text-left p-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 hover:border-primary-300 transition-colors"
              >
                <div className="flex items-center gap-1 text-xs font-semibold text-stone-800">
                  <ShieldCheck size={13} className="text-primary-600" />
                  Admin 2 (Staff)
                </div>
                <div className="text-[11px] text-stone-500 mt-0.5">demo_admin2</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage
