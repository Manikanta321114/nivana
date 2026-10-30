import React from 'react'
import { Link } from 'react-router-dom'
import { FileCheck, ArrowLeft } from 'lucide-react'

export const TermsPage: React.FC = () => {
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
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-800 mb-3">
              <FileCheck size={13} />
              Platform Terms of Service
            </div>
            <h1 className="text-3xl font-display font-bold text-stone-900 tracking-tight">
              Terms & Conditions
            </h1>
            <p className="text-xs text-stone-400 mt-2">
              Last updated: October 2026 • Applicable to all visitors, seekers, and property submitters
            </p>
          </div>

          <div className="mt-8 space-y-8 text-sm text-stone-700 leading-relaxed">
            <section>
              <h2 className="text-lg font-bold text-stone-900 mb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing, browsing, submitting property details, or requesting property callbacks on NIVASA
                ("Platform"), you agree to be bound by these Terms of Service. If you do not agree with any part
                of these terms, please do not use the Platform.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-bold text-stone-900 mb-2">
                2. Platform Role & Scope of Services
              </h2>
              <p className="mb-2">
                NIVASA is a managed property listing, verification, and visit scheduling service operating in Bengaluru.
                Please note the following service boundaries:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-stone-600">
                <li>
                  NIVASA does not own, lease, or manage the residential properties displayed on the platform.
                </li>
                <li>
                  Final tenancy agreements, security deposit transactions, and rental contracts are entered into
                  directly between the verified property owner and the tenant.
                </li>
                <li>
                  While our verification team inspects ownership documents and validates premises details, seekers
                  are advised to conduct standard due diligence prior to signing lease agreements.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-stone-900 mb-2">
                3. Obligations for Property Submitters (Landlords & Owners)
              </h2>
              <p className="mb-2">
                When you list a property through "List Your Property", you represent and warrant that:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-stone-600">
                <li>You are the lawful property owner or hold verified legal authority to list and negotiate lease terms.</li>
                <li>All details, rent figures, deposit expectations, and photos provided are accurate and current.</li>
                <li>You will promptly inform NIVASA when the premises are rented or no longer available for visits.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-stone-900 mb-2">
                4. Obligations for Seekers & Inquirers
              </h2>
              <p className="mb-2">
                When requesting callbacks or booking in-person visits:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-stone-600">
                <li>You will provide accurate, valid contact details and be available for scheduled visits.</li>
                <li>If you need to reschedule or cancel a visit, you will notify our support desk in advance.</li>
                <li>You will respect the premises, residents, and neighbors during scheduled walkthroughs.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-stone-900 mb-2">
                5. Prohibited Conduct
              </h2>
              <p className="mb-2">
                The following actions are strictly prohibited on NIVASA:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-stone-600">
                <li>Automated scraping, crawling, or extracting of property photos, descriptions, or prices.</li>
                <li>Submitting fraudulent, duplicate, or unauthorized property listings.</li>
                <li>Attempting to bypass security controls, spam the callback submission form, or disrupt platform operations.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-bold text-stone-900 mb-2">
                6. Governing Law & Dispute Resolution
              </h2>
              <p>
                These terms are governed by the laws of India. Any legal dispute, claim, or proceeding arising
                out of or related to the use of NIVASA shall be subject to the exclusive jurisdiction of the
                competent courts located in Bengaluru, Karnataka, India.
              </p>
            </section>

            <section className="pt-4 border-t border-stone-100">
              <h2 className="text-lg font-bold text-stone-900 mb-2">
                7. Questions & Support
              </h2>
              <p className="text-xs sm:text-sm text-stone-600">
                For questions regarding these Terms, contact our legal team at:
                <br />
                Email: <span className="font-mono text-primary-800">legal@nivasa.rentals</span>
                <br />
                Address: 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage
