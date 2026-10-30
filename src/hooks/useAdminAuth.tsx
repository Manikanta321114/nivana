import React, { createContext, useContext, useState, useCallback } from 'react'
import type { AdminUser } from '../types'

/**
 * Demo authentication context.
 * Phase 2 only — simulates login with hardcoded demo credentials.
 * In Phase 4 this will be replaced with real JWT authentication.
 *
 * IMPORTANT: These are DEMO credentials for UI development ONLY.
 * Real credentials must never be hardcoded. See Phase 4 instructions.
 */

// Demo credentials — clearly labelled, will be removed in Phase 4
const DEMO_ADMINS: { username: string; password: string; user: AdminUser }[] = [
  {
    username: 'demo_admin1',
    password: 'demo_password_1',   // Phase 4: replace with JWT auth
    user: {
      id: 'demo-admin-001',
      username: 'demo_admin1',
      email: 'admin1@nivasa.demo',
      full_name: '[DEMO] Administrator One',
      is_active: true,
      is_superadmin: true,
      created_at: '2024-01-01T00:00:00Z',
      last_login_at: new Date().toISOString(),
    },
  },
  {
    username: 'demo_admin2',
    password: 'demo_password_2',   // Phase 4: replace with JWT auth
    user: {
      id: 'demo-admin-002',
      username: 'demo_admin2',
      email: 'admin2@nivasa.demo',
      full_name: '[DEMO] Administrator Two',
      is_active: true,
      is_superadmin: false,
      created_at: '2024-01-01T00:00:00Z',
      last_login_at: new Date().toISOString(),
    },
  },
]

const SESSION_KEY = 'nivasa_demo_admin'

interface AuthContextValue {
  admin: AdminUser | null
  isAuthenticated: boolean
  login: (username: string, password: string) => { success: boolean; error?: string }
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminUser | null>(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = useCallback((username: string, password: string) => {
    const match = DEMO_ADMINS.find(
      a => a.username === username && a.password === password
    )
    if (!match) {
      return { success: false, error: 'Invalid username or password.' }
    }
    setAdmin(match.user)
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(match.user))
    return { success: true }
  }, [])

  const logout = useCallback(() => {
    setAdmin(null)
    sessionStorage.removeItem(SESSION_KEY)
  }, [])

  return (
    <AuthContext.Provider value={{ admin, isAuthenticated: !!admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAdminAuth = (): AuthContextValue => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
