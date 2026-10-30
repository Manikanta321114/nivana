import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Lock, ArrowLeft } from 'lucide-react'

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="pt-20 pb-20 bg-bg-base min-h-screen">
      <div className="page-container max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 mb-6 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Home
        </Link>

        <div className="bg-white rounded-3xl shadow-card border border-stone-100 p-8 sm:p-12">
          {/* Header */}
          <div className="pb-8 border-b border-stone-100">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary-100 text-primary-800 mb-3">
              <Shield size={13} />
              Privacy Policy & Data Security
            </div>
            <h1 className="text-3xl font-display font-bold text-stone-900 tracking-tight">
              NIVASA Privacy Policy
            </h1>
            <p className="text-xs text-stone-400 mt-2">
              Last updated: October 2026 • Effective immediately across Bengaluru operations
            </p>
          </div>

          {/* Privacy Boundary Summary Box */}
          <div className="my-8 bg-primary-50/60 rounded-2xl p-6 border border-primary-200/80">
            <h2 className="text-sm font-bold text-primary-950 flex items-center gap-2 mb-2">
              <Lock size={16} className="text-primary-700" />
              Our Core Privacy Commitment
            </h2>
            <p className="text-xs sm:text-sm text-primary-900 leading-relaxed">
              At NIVASA, privacy is not an afterthought — it is the core architecture of our platform.
              We never broadcast private phone numbers or exact door addresses on the public internet.
              All inquiries and visits are managed by verified NIVASA staff to protect both tenants and landlords
              from spam, scraping, and harassment.
            </p>
          </div>

          {/* Content sections */}
          <div className="space-y-8 text-sm text-stone-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-stone-900 mb-2">
                1. Information We Collect
              </h2>
              <p className="mb-2">
                When you use NIVASA, we collect only the information necessary to provide rental matching services:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-stone-600">
                <li>
                  <strong>For Prospective Tenants:</strong> Your full name, mobile number, preferred visit date/time, and any optional message you provide when requesting a callback or property visit.
                </li>
                <li>
                  <strong>For Property Owners / Landlords:</strong> Your name, contact number, property locality, configuration (BHK, property type), expected rent, deposit, amenities, and descriptive information.
                </li>
                <li>
                  <strong>Technical Data:</strong> Standard server logs, IP addresses (used exclusively for rate limiting and spam prevention), and browser user-agent strings.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-stone-900 mb-2">
                2. Strict Architectural Privacy Boundaries
              </h2>
              <p className="mb-3">
                Our backend API employs hard schema boundaries to ensure confidential information cannot leak to the public web:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                  <p className="font-semibold text-emerald-800 mb-1">Publicly Visible Information</p>
                  <ul className="list-disc pl-4 space-y-1 text-stone-600">
                    <li>Approved photos and property features</li>
                    <li>General locality (e.g. Koramangala 4th Block)</li>
                    <li>Rent & deposit amounts</li>
                    <li>Availability status & approximate map pin</li>
                  </ul>
                </div>
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                  <p className="font-semibold text-amber-900 mb-1">Strictly Confidential (Admin Only)</p>
                  <ul className="list-disc pl-4 space-y-1 text-stone-600">
                    <li>Owner / landlord direct mobile number</li>
                    <li>Exact street name, door number, and flat number</li>
                    <li>Prospective tenant contact numbers</li>
                    <li>Internal verification checklists & call notes</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-bold text-stone-900 mb-2">
                3. Approximate Map Pin Policy
              </h2>
              <p>
                To safeguard the privacy of current residents and property owners, the interactive map on NIVASA
                displays an approximate neighborhood pin (randomly offset by 100 to 200 meters). Exact directions
                and door coordinates are provided exclusively when an official visit has been scheduled and confirmed
                by our team.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-stone-900 mb-2">
                4. Zero Data Selling Guarantee
              </h2>
              <p>
                We do not sell, rent, monetize, or trade your personal contact information to any third-party real estate
                brokers, telemarketing agencies, lending institutions, or aggregators. Your information is used solely
                by NIVASA operations personnel to fulfill your direct request.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-stone-900 mb-2">
                5. Data Retention & Your Rights
              </h2>
              <p className="mb-2">
                You retain complete control over your personal data:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-stone-600">
                <li>You may request the immediate unpublishing or deletion of your property listing at any time.</li>
                <li>You may request the deletion of your inquiry logs and phone records from our administrative database.</li>
                <li>To exercise your privacy rights, email our Data Protection Desk at <span className="font-mono text-primary-800">privacy@nivasa.rentals</span>.</li>
              </ul>
            </section>

            <section className="pt-4 border-t border-stone-100">
              <h2 className="text-lg font-bold text-stone-900 mb-2">
                6. Contact Our Privacy Officer
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                If you have questions regarding this Privacy Policy or NIVASA's security practices, write to us at:
                <br />
                <strong>NIVASA Technologies India Pvt. Ltd.</strong>
                <br />
                HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038
                <br />
                Email: <span className="font-mono text-primary-800">privacy@nivasa.rentals</span>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicyPage
