import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { User as SupabaseUser, Session } from '@supabase/supabase-js'
import type { TenantUser } from '../types'
import { supabase, isSupabaseConfigured } from '../utils/supabase'

const USER_SESSION_KEY = 'nivasa_tenant_user'

// Demo tenant for instant testing in DEV mode only
export const DEMO_TENANT: TenantUser = {
  id: 'usr_demo_001',
  full_name: 'Rahul Sharma',
  phone: '9876543210',
  email: 'rahul.sharma@example.com',
  created_at: new Date().toISOString(),
}

const mapSupabaseUser = (sbUser: SupabaseUser): TenantUser => ({
  id: sbUser.id,
  full_name:
    sbUser.user_metadata?.full_name ||
    sbUser.email?.split('@')[0] ||
    'NIVASA Resident',
  phone: sbUser.user_metadata?.phone || sbUser.phone || '',
  email: sbUser.email,
  created_at: sbUser.created_at,
})

interface UserAuthContextValue {
  user: TenantUser | null
  session: Session | null
  isAuthenticated: boolean
  isAuthModalOpen: boolean
  authModalMode: 'LOGIN' | 'SIGNUP'
  pendingRedirectUrl: string | null
  isSupabaseLive: boolean
  isDevMode: boolean
  openLoginModal: (redirectUrl?: string) => void
  openSignupModal: (redirectUrl?: string) => void
  closeAuthModal: () => void
  login: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>
  signup: (
    fullName: string,
    email: string,
    password?: string,
    phone?: string
  ) => Promise<{ success: boolean; error?: string }>
  quickDemoLogin: () => void
  logout: () => Promise<void>
  requireAuth: (onSuccess: () => void, redirectUrl?: string) => boolean
  getAccessToken: () => Promise<string | null>
}

const UserAuthContext = createContext<UserAuthContextValue | null>(null)

export const UserAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<TenantUser | null>(() => {
    try {
      const stored = localStorage.getItem(USER_SESSION_KEY)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const [session, setSession] = useState<Session | null>(null)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN')
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null)

  const isDevMode = Boolean(import.meta.env.DEV)

  // ── Sync Supabase Session on Mount and Auth Changes ──────────────
  useEffect(() => {
    if (!isSupabaseConfigured) return

    // 1. Initial session load
    supabase.auth.getSession().then(({ data: { session: initialSession }, error }) => {
      if (error) {
        console.warn('[Supabase Auth] Failed to restore session:', error.message)
        return
      }
      if (initialSession?.user) {
        setSession(initialSession)
        const mapped = mapSupabaseUser(initialSession.user)
        setUser(mapped)
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(mapped))
      }
    })

    // 2. Real-time auth state subscription
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession)
      if (currentSession?.user) {
        const mapped = mapSupabaseUser(currentSession.user)
        setUser(mapped)
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(mapped))
      } else {
        // If logged out from Supabase, clear user unless using dev demo
        setUser(prev => (prev?.id === DEMO_TENANT.id && isDevMode ? prev : null))
        if (!isDevMode || user?.id !== DEMO_TENANT.id) {
          localStorage.removeItem(USER_SESSION_KEY)
        }
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [isDevMode])

  // Persist local state for non-Supabase demo session
  useEffect(() => {
    if (user) {
      try {
        localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user))
      } catch (err) {
        console.error('Failed to persist user session', err)
      }
    } else {
      localStorage.removeItem(USER_SESSION_KEY)
    }
  }, [user])

  const openLoginModal = useCallback((redirectUrl?: string) => {
    if (redirectUrl) setPendingRedirectUrl(redirectUrl)
    setAuthModalMode('LOGIN')
    setIsAuthModalOpen(true)
  }, [])

  const openSignupModal = useCallback((redirectUrl?: string) => {
    if (redirectUrl) setPendingRedirectUrl(redirectUrl)
    setAuthModalMode('SIGNUP')
    setIsAuthModalOpen(true)
  }, [])

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false)
  }, [])

  // ── Real Email/Password Login ────────────────────────────────────
  const login = useCallback(
    async (email: string, password?: string): Promise<{ success: boolean; error?: string }> => {
      const cleanEmail = email.trim()
      if (!cleanEmail) {
        return { success: false, error: 'Please enter your email address.' }
      }

      // Real Supabase Auth login
      if (isSupabaseConfigured && password) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: password,
        })

        if (error) {
          return { success: false, error: error.message }
        }

        if (data.user) {
          const mapped = mapSupabaseUser(data.user)
          setUser(mapped)
          setSession(data.session)
          setIsAuthModalOpen(false)
          return { success: true }
        }
      }

      // Fallback in DEV mode if Supabase keys have not been placed in .env.local yet
      if (isDevMode) {
        const loggedUser: TenantUser = {
          id: `usr_${Date.now()}`,
          full_name: cleanEmail.includes('@') ? cleanEmail.split('@')[0] : 'Bengaluru Renter',
          phone: cleanEmail.replace(/\D/g, '').slice(-10) || '9876543210',
          email: cleanEmail.includes('@') ? cleanEmail : undefined,
          created_at: new Date().toISOString(),
        }

        setUser(loggedUser)
        setIsAuthModalOpen(false)
        return { success: true }
      }

      return {
        success: false,
        error: 'Invalid login credentials. Please check your email and password.',
      }
    },
    [isDevMode]
  )

  // ── Real Email/Password Signup ───────────────────────────────────
  const signup = useCallback(
    async (
      fullName: string,
      email: string,
      password?: string,
      phone?: string
    ): Promise<{ success: boolean; error?: string }> => {
      const cleanName = fullName.trim()
      const cleanEmail = email.trim()
      const cleanPhone = (phone || '').trim().replace(/\D/g, '')

      if (!cleanName) {
        return { success: false, error: 'Please enter your full name.' }
      }
      if (!cleanEmail || !cleanEmail.includes('@')) {
        return { success: false, error: 'Please enter a valid email address.' }
      }

      // Real Supabase Auth signup
      if (isSupabaseConfigured && password) {
        if (password.length < 6) {
          return { success: false, error: 'Password must be at least 6 characters long.' }
        }

        const { data, error } = await supabase.auth.signUp({
          email: cleanEmail,
          password: password,
          options: {
            data: {
              full_name: cleanName,
              phone: cleanPhone,
            },
          },
        })

        if (error) {
          return { success: false, error: error.message }
        }

        if (data.user) {
          const mapped = mapSupabaseUser(data.user)
          setUser(mapped)
          setSession(data.session)
          setIsAuthModalOpen(false)
          return { success: true }
        }
      }

      // Fallback in DEV mode
      if (isDevMode) {
        const newUser: TenantUser = {
          id: `usr_${Date.now()}`,
          full_name: cleanName,
          phone: cleanPhone.slice(-10) || '9876543210',
          email: cleanEmail,
          created_at: new Date().toISOString(),
        }

        setUser(newUser)
        setIsAuthModalOpen(false)
        return { success: true }
      }

      return { success: false, error: 'Signup failed. Please try again.' }
    },
    [isDevMode]
  )

  // ── Quick Demo Login (DEV mode only) ─────────────────────────────
  const quickDemoLogin = useCallback(() => {
    if (isDevMode) {
      setUser(DEMO_TENANT)
      setIsAuthModalOpen(false)
    }
  }, [isDevMode])

  // ── Logout ───────────────────────────────────────────────────────
  const logout = useCallback(async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut()
      } catch (err) {
        console.warn('[Supabase Auth] Sign out error:', err)
      }
    }
    setUser(null)
    setSession(null)
    setPendingRedirectUrl(null)
    localStorage.removeItem(USER_SESSION_KEY)
  }, [])

  // ── Access Token Helper for Backend Requests ─────────────────────
  const getAccessToken = useCallback(async (): Promise<string | null> => {
    if (!isSupabaseConfigured) return null
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession()
    return currentSession?.access_token ?? null
  }, [])

  const requireAuth = useCallback(
    (onSuccess: () => void, redirectUrl?: string): boolean => {
      if (user) {
        onSuccess()
        return true
      }
      openLoginModal(redirectUrl)
      return false
    },
    [user, openLoginModal]
  )

  return (
    <UserAuthContext.Provider
      value={{
        user,
        session,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalMode,
        pendingRedirectUrl,
        isSupabaseLive: isSupabaseConfigured,
        isDevMode,
        openLoginModal,
        openSignupModal,
        closeAuthModal,
        login,
        signup,
        quickDemoLogin,
        logout,
        requireAuth,
        getAccessToken,
      }}
    >
      {children}
    </UserAuthContext.Provider>
  )
}

export const useUserAuth = (): UserAuthContextValue => {
  const ctx = useContext(UserAuthContext)
  if (!ctx) throw new Error('useUserAuth must be used within UserAuthProvider')
  return ctx
}
