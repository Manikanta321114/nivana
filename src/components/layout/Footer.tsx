import React from 'react'
import { Link } from 'react-router-dom'
import { Home, MapPin, Phone, Mail } from 'lucide-react'

const footerLinks = {
  Explore: [
    { to: '/properties', label: 'All Properties' },
    { to: '/properties?type=APARTMENT', label: 'Apartments' },
    { to: '/properties?type=HOUSE', label: 'Independent Houses' },
    { to: '/properties?type=PG', label: 'PG / Hostels' },
    { to: '/list-property', label: 'List Your Property' },
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
    <footer className="bg-stone-900 text-stone-300" aria-label="Site footer">
      <div className="page-container pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-stone-800">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary-700 rounded-xl flex items-center justify-center">
                <Home size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xl font-display font-bold text-white tracking-tight">NIVASA</p>
                <p className="text-xs text-primary-400 leading-none">Find a Place to Call Home.</p>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-stone-400 max-w-sm">
              NIVASA helps you find rental homes across Bengaluru. We verify listings,
              coordinate visits, and connect you with the right property — safely and
              without hassle.
            </p>
            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center gap-2.5 text-stone-400">
                <MapPin size={15} className="text-primary-500 flex-shrink-0" />
                <span>Bengaluru, Karnataka, India</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-400">
                <Phone size={15} className="text-primary-500 flex-shrink-0" />
                <span>Customer care contact listed on the Contact page</span>
              </div>
              <div className="flex items-center gap-2.5 text-stone-400">
                <Mail size={15} className="text-primary-500 flex-shrink-0" />
                <span>Contact form available on the Contact page</span>
              </div>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">{heading}</h3>
              <ul className="space-y-2.5">
                {links.map(link => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-sm text-stone-400 hover:text-primary-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {year} NIVASA. All rights reserved. Bengaluru Rental Platform.</p>
          <div className="flex gap-4">
            <Link to="/privacy-policy" className="hover:text-stone-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-stone-300 transition-colors">Terms</Link>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="mt-4 text-xs text-stone-600 text-center leading-relaxed">
          NIVASA is a managed property listing platform. We do not own or manage the properties listed.
          All booking requests are subject to property availability and admin verification.
          Customer contact details are used only for processing your request and are kept strictly private.
        </p>
      </div>
    </footer>
  )
}
