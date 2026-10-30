import React from 'react'
import { Link } from 'react-router-dom'
import { MapPin, ShieldCheck, Heart } from 'lucide-react'

const TOP_LOCALITIES = [
  'Indiranagar',
  'Koramangala',
  'HSR Layout',
  'Whitefield',
  'Bellandur',
  'Marathahalli',
  'Jayanagar',
  'Electronic City',
]

const FOOTER_NAV = {
  Explore: [
    { to: '/properties', label: 'All Verified Rentals' },
    { to: '/properties?type=APARTMENT', label: 'Apartments in Bengaluru' },
    { to: '/properties?type=HOUSE', label: 'Independent Houses' },
    { to: '/properties?type=VILLA', label: 'Gated Community Villas' },
    { to: '/properties?type=PG', label: 'Studio & PG Stays' },
  ],
  Owners: [
    { to: '/list-property', label: 'Post Free Property Listing' },
    { to: '/#how-it-works', label: 'Verification Process' },
    { to: '/about', label: 'Zero Brokerage Policy' },
    { to: '/contact', label: 'Owner Support Desk' },
  ],
  Company: [
    { to: '/about', label: 'About NIVASA' },
    { to: '/contact', label: 'Contact Us' },
    { to: '/privacy-policy', label: 'Privacy Policy' },
    { to: '/terms', label: 'Terms of Service' },
  ],
}

export const Footer: React.FC = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-charcoal text-stone-300 border-t border-stone-800" aria-label="Site footer">
      <div className="page-container pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800/80">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block" aria-label="NIVASA Home">
              <img
                src="/nivasa_logo_white.png"
                alt="NIVASA"
                className="h-11 w-auto object-contain"
              />
            </Link>
            <p className="text-accent-400 text-xs font-semibold uppercase tracking-widest">
              Find a Place to Call Home.
            </p>
            <p className="text-sm leading-relaxed text-stone-400 max-w-sm">
              NIVASA is Bengaluru’s curated rental property platform. Direct owner listings,
              zero brokerage, admin-verified homes, and transparent visit scheduling.
            </p>

            <div className="pt-2 space-y-2.5 text-xs text-stone-400">
              <div className="flex items-center gap-2.5">
                <MapPin size={15} className="text-secondary-400 flex-shrink-0" />
                <span>Bengaluru, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={15} className="text-secondary-400 flex-shrink-0" />
                <span>100% Verified Properties • Safe Tenant Privacy</span>
              </div>
            </div>
          </div>

          {/* Localities Column */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Top Localities
            </h3>
            <ul className="space-y-2 text-xs">
              {TOP_LOCALITIES.map(loc => (
                <li key={loc}>
                  <Link
                    to={`/properties?locality=${encodeURIComponent(loc)}`}
                    className="text-stone-400 hover:text-secondary-400 transition-colors"
                  >
                    Rentals in {loc}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Navigation Columns */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Renters & Owners
            </h3>
            <ul className="space-y-2 text-xs">
              {FOOTER_NAV.Explore.concat(FOOTER_NAV.Owners.slice(0, 3)).map(item => (
                <li key={item.label}>
                  <Link
                    to={item.to}
                    className="text-stone-400 hover:text-secondary-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Company & Trust
            </h3>
            <ul className="space-y-2 text-xs">
              {FOOTER_NAV.Company.map(item => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-stone-400 hover:text-secondary-400 transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/admin/login"
                  className="text-stone-500 hover:text-stone-300 transition-colors text-[11px]"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {year} NIVASA Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-stone-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-stone-300 transition-colors">Terms of Service</Link>
            <span className="text-stone-600">·</span>
            <span className="flex items-center gap-1 text-stone-400">
              Crafted with <Heart size={12} className="text-rose-500 fill-rose-500" /> for Bengaluru
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
