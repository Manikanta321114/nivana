import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Home, LogOut, Lock } from 'lucide-react'
import { cn } from '../../utils'
import { Button } from '../ui/Button'
import { useUserAuth } from '../../hooks/useUserAuth'

const NAV_LINKS = [
  { to: '/properties', label: 'Explore Properties' },
  { to: '/list-property', label: 'List Your Property' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen]     = useState(false)
  const [scrolled, setScrolled]     = useState(false)
  const location                     = useLocation()
  const isHome                       = location.pathname === '/'
  const { user, isAuthenticated, openLoginModal, logout } = useUserAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // On the home page, navbar starts transparent and becomes solid on scroll
  const solid = !isHome || scrolled || menuOpen

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        solid
          ? 'bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-sm'
          : 'bg-transparent',
      )}
    >
      <div className="page-container">
        <nav className="flex items-center justify-between h-16" aria-label="Main navigation">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group"
            aria-label="NIVASA — home"
          >
            <div className="w-8 h-8 bg-primary-700 rounded-lg flex items-center justify-center group-hover:bg-primary-800 transition-colors">
              <Home size={16} className="text-white" />
            </div>
            <div>
              <span className={cn(
                'text-xl font-display font-bold tracking-tight transition-colors',
                solid ? 'text-primary-800' : 'text-white',
              )}>
                NIVASA
              </span>
              <p className={cn(
                'text-xs leading-none transition-colors hidden sm:block',
                solid ? 'text-primary-500' : 'text-white/70',
              )}>
                Bengaluru Rentals
              </p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => cn(
                  'px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary-100 text-primary-800'
                    : solid
                    ? 'text-stone-700 hover:text-primary-700 hover:bg-primary-50'
                    : 'text-white/90 hover:text-white hover:bg-white/10',
                )}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop CTA & User Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 bg-stone-100/90 backdrop-blur-sm pl-2 pr-1 py-1 rounded-full border border-stone-200/80 shadow-sm">
                <div className="w-7 h-7 rounded-full bg-primary-700 text-white text-xs font-bold flex items-center justify-center uppercase">
                  {user.full_name?.[0] || 'U'}
                </div>
                <span className="text-xs font-semibold text-stone-800 pr-1 max-w-[120px] truncate">
                  {user.full_name.split(' ')[0]}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  title="Sign out"
                  className="p-1 rounded-full text-stone-400 hover:text-red-600 hover:bg-stone-200 transition-colors"
                  aria-label="Sign out"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openLoginModal()}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all',
                  solid
                    ? 'text-stone-700 hover:text-primary-800 hover:bg-stone-100'
                    : 'text-white/90 hover:text-white hover:bg-white/10',
                )}
              >
                <Lock size={13} />
                Sign In
              </button>
            )}

            <Button
              variant={solid ? 'primary' : 'outline'}
              size="sm"
              as="button"
              onClick={() => window.location.href = '/properties'}
              className={!solid ? 'border-white text-white hover:bg-white hover:text-primary-800' : ''}
            >
              Find a Home
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={cn(
              'md:hidden p-2 rounded-xl transition-colors',
              solid ? 'text-stone-700 hover:bg-stone-100' : 'text-white hover:bg-white/10',
            )}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-white border-t border-stone-100 animate-fade-in"
        >
          <div className="page-container py-4 flex flex-col gap-1">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => cn(
                  'px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary-100 text-primary-800'
                    : 'text-stone-700 hover:bg-stone-50',
                )}
              >
                {link.label}
              </NavLink>
            ))}
            <div className="pt-2 border-t border-stone-100 mt-1 space-y-2">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-primary-700 text-white text-xs font-bold flex items-center justify-center uppercase">
                      {user.full_name?.[0] || 'U'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-stone-900">{user.full_name}</p>
                      <p className="text-[11px] text-stone-500">{user.phone}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { logout(); setMenuOpen(false) }}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold px-2 py-1 rounded-lg hover:bg-red-50 flex items-center gap-1 transition-colors"
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { openLoginModal(); setMenuOpen(false) }}
                  className="w-full py-2.5 px-4 rounded-xl border border-stone-200 text-stone-800 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors"
                >
                  <Lock size={15} className="text-primary-600" />
                  Sign In / Register
                </button>
              )}

              <Link to="/properties" onClick={() => setMenuOpen(false)}>
                <Button variant="primary" size="sm" fullWidth>
                  Find a Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
