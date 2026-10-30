import React, { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, Lock, PlusCircle, Search, User } from 'lucide-react'
import { cn } from '../../utils'
import { Button } from '../ui/Button'
import { useUserAuth } from '../../hooks/useUserAuth'

const NAV_LINKS = [
  { to: '/properties', label: 'Explore Homes' },
  { to: '/#how-it-works', label: 'How It Works' },
  { to: '/list-property', label: 'List Property', highlight: true },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const { user, isAuthenticated, openLoginModal, logout } = useUserAuth()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  // Solid background on scroll, non-home pages, or mobile menu open
  const solid = !isHome || scrolled || menuOpen

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        solid
          ? 'bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-[0_2px_15px_-3px_rgba(10,96,103,0.08)]'
          : 'bg-transparent',
      )}
    >
      <div className="page-container">
        <nav className="flex items-center justify-between h-20" aria-label="Main navigation">
          {/* Logo with original graphic branding */}
          <Link
            to="/"
            className="flex items-center group py-2"
            aria-label="NIVASA — Find a Place to Call Home"
          >
            <img
              src={solid ? '/nivasa_logo.png' : '/nivasa_logo_white.png'}
              alt="NIVASA"
              className="h-10 sm:h-12 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop nav links */}
          <div className="hidden lg:flex items-center gap-1.5">
            {NAV_LINKS.map(link => {
              if (link.to.startsWith('/#')) {
                return (
                  <a
                    key={link.to}
                    href={link.to}
                    className={cn(
                      'px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                      solid
                        ? 'text-stone-700 hover:text-primary-800 hover:bg-stone-100'
                        : 'text-white/90 hover:text-white hover:bg-white/10',
                    )}
                  >
                    {link.label}
                  </a>
                )
              }
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => cn(
                    'px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                    isActive
                      ? solid
                        ? 'bg-primary-50 text-primary-800 font-semibold'
                        : 'bg-white/20 text-white font-semibold'
                      : solid
                      ? 'text-stone-700 hover:text-primary-800 hover:bg-stone-100'
                      : 'text-white/90 hover:text-white hover:bg-white/10',
                    link.highlight && 'text-accent-500 font-semibold'
                  )}
                >
                  {link.label}
                </NavLink>
              )
            })}
          </div>

          {/* Desktop Right Actions: List Free + Auth + Find a Home */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/list-property"
              className={cn(
                'inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border',
                solid
                  ? 'border-accent-400/60 bg-accent-50 text-accent-800 hover:bg-accent-100 hover:border-accent-500'
                  : 'border-accent-300/40 bg-white/10 text-accent-300 hover:bg-white/20'
              )}
            >
              <PlusCircle size={14} className="text-accent-600" />
              <span>Post Free Listing</span>
            </Link>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-2 bg-stone-100/90 backdrop-blur-sm pl-2.5 pr-1 py-1 rounded-full border border-stone-200/80 shadow-sm">
                <div className="w-7 h-7 rounded-full bg-primary-700 text-white text-xs font-bold flex items-center justify-center uppercase">
                  {user.full_name?.[0] || 'U'}
                </div>
                <span className="text-xs font-semibold text-stone-800 pr-1 max-w-[110px] truncate">
                  {user.full_name.split(' ')[0]}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  title="Sign out"
                  className="p-1.5 rounded-full text-stone-400 hover:text-rose-600 hover:bg-stone-200 transition-colors"
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
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all',
                  solid
                    ? 'text-stone-700 hover:text-primary-800 hover:bg-stone-100'
                    : 'text-white/90 hover:text-white hover:bg-white/10',
                )}
              >
                <User size={14} />
                Sign In
              </button>
            )}

            <Link to="/properties">
              <Button
                variant={solid ? 'primary' : 'outline'}
                size="sm"
                className={cn(
                  'font-semibold shadow-sm',
                  !solid && 'border-white text-white hover:bg-white hover:text-primary-900',
                  solid && 'bg-primary-700 hover:bg-primary-800 text-white'
                )}
                leftIcon={<Search size={14} />}
              >
                Find a Home
              </Button>
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            id="mobile-menu-btn"
            onClick={() => setMenuOpen(o => !o)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className={cn(
              'lg:hidden p-2.5 rounded-xl transition-colors',
              solid ? 'text-stone-700 hover:bg-stone-100' : 'text-white hover:bg-white/10',
            )}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile drawer */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden bg-white border-t border-stone-200/80 shadow-xl animate-fade-in"
        >
          <div className="page-container py-5 flex flex-col gap-1.5">
            {/* Mobile Header Logo */}
            <div className="px-3 pb-3 mb-2 border-b border-stone-100 flex items-center justify-between">
              <img src="/nivasa_logo.png" alt="NIVASA" className="h-9 w-auto" />
              <span className="text-[11px] font-semibold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200">
                Bengaluru Rentals
              </span>
            </div>

            {NAV_LINKS.map(link => {
              if (link.to.startsWith('/#')) {
                return (
                  <a
                    key={link.to}
                    href={link.to}
                    onClick={() => setMenuOpen(false)}
                    className="px-4 py-3 rounded-xl text-sm font-medium text-stone-700 hover:bg-stone-50"
                  >
                    {link.label}
                  </a>
                )
              }
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) => cn(
                    'px-4 py-3 rounded-xl text-sm font-medium transition-colors flex items-center justify-between',
                    isActive
                      ? 'bg-primary-50 text-primary-800 font-semibold'
                      : 'text-stone-700 hover:bg-stone-50',
                  )}
                >
                  <span>{link.label}</span>
                  {link.highlight && (
                    <span className="text-[10px] uppercase font-bold text-accent-700 bg-accent-100 px-2 py-0.5 rounded-full">
                      Free
                    </span>
                  )}
                </NavLink>
              )
            })}

            <div className="pt-3 border-t border-stone-100 mt-2 space-y-2.5">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-primary-700 text-white text-xs font-bold flex items-center justify-center uppercase">
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
                    className="text-xs text-rose-600 hover:text-rose-700 font-semibold px-2.5 py-1.5 rounded-lg hover:bg-rose-50 flex items-center gap-1 transition-colors"
                  >
                    <LogOut size={13} /> Sign Out
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => { openLoginModal(); setMenuOpen(false) }}
                  className="w-full py-3 px-4 rounded-xl border border-stone-200 text-stone-800 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-stone-50 transition-colors"
                >
                  <Lock size={15} className="text-primary-700" />
                  Sign In / Register
                </button>
              )}

              <Link to="/properties" onClick={() => setMenuOpen(false)} className="block">
                <Button variant="primary" size="md" fullWidth className="bg-primary-700 hover:bg-primary-800">
                  Explore Verified Homes
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
