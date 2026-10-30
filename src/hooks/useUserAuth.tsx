import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { TenantUser } from '../types'

const USER_SESSION_KEY = 'nivasa_tenant_user'

// Demo tenant for instant testing
export const DEMO_TENANT: TenantUser = {
  id: 'usr_demo_001',
  full_name: 'Rahul Sharma',
  phone: '9876543210',
  email: 'rahul.sharma@example.com',
  created_at: new Date().toISOString(),
}

interface UserAuthContextValue {
  user: TenantUser | null
  isAuthenticated: boolean
  isAuthModalOpen: boolean
  authModalMode: 'LOGIN' | 'SIGNUP'
  pendingRedirectUrl: string | null
  openLoginModal: (redirectUrl?: string) => void
  openSignupModal: (redirectUrl?: string) => void
  closeAuthModal: () => void
  login: (phoneOrEmail: string, passwordOrOtp?: string) => { success: boolean; error?: string }
  signup: (fullName: string, phone: string, email?: string) => { success: boolean; error?: string }
  quickDemoLogin: () => void
  logout: () => void
  requireAuth: (onSuccess: () => void, redirectUrl?: string) => boolean
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

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalMode, setAuthModalMode] = useState<'LOGIN' | 'SIGNUP'>('LOGIN')
  const [pendingRedirectUrl, setPendingRedirectUrl] = useState<string | null>(null)

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

  const login = useCallback((phoneOrEmail: string, _passwordOrOtp?: string) => {
    const clean = phoneOrEmail.trim()
    if (!clean) {
      return { success: false, error: 'Please enter your mobile number or email.' }
    }

    // Demo/simulated authentication
    const loggedUser: TenantUser = {
      id: `usr_${Date.now()}`,
      full_name: clean.includes('@') ? clean.split('@')[0] : 'Bengaluru Renter',
      phone: clean.replace(/\D/g, '').slice(-10) || '9876543210',
      email: clean.includes('@') ? clean : undefined,
      created_at: new Date().toISOString(),
    }

    setUser(loggedUser)
    setIsAuthModalOpen(false)
    return { success: true }
  }, [])

  const signup = useCallback((fullName: string, phone: string, email?: string) => {
    const cleanName = fullName.trim()
    const cleanPhone = phone.trim().replace(/\D/g, '')

    if (!cleanName) {
      return { success: false, error: 'Please enter your name.' }
    }
    if (cleanPhone.length < 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number.' }
    }

    const newUser: TenantUser = {
      id: `usr_${Date.now()}`,
      full_name: cleanName,
      phone: cleanPhone.slice(-10),
      email: email?.trim() || undefined,
      created_at: new Date().toISOString(),
    }

    setUser(newUser)
    setIsAuthModalOpen(false)
    return { success: true }
  }, [])

  const quickDemoLogin = useCallback(() => {
    setUser(DEMO_TENANT)
    setIsAuthModalOpen(false)
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setPendingRedirectUrl(null)
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
    [user, openLoginModal],
  )

  return (
    <UserAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isAuthModalOpen,
        authModalMode,
        pendingRedirectUrl,
        openLoginModal,
        openSignupModal,
        closeAuthModal,
        login,
        signup,
        quickDemoLogin,
        logout,
        requireAuth,
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
