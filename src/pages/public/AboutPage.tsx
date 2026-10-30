import React from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck, HeartHandshake, MapPin, EyeOff,
  ArrowRight, Home
} from 'lucide-react'
import { Button } from '../../components/ui/Button'

export const AboutPage: React.FC = () => {
  return (
    <div className="pt-16 pb-20 bg-bg-base min-h-screen">
      {/* Hero */}
      <div className="bg-primary-900 text-white py-16 lg:py-24">
        <div className="page-container text-center max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white mb-4 border border-white/20">
            <Home size={13} className="text-accent-300" />
            Bengaluru Born & Built
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-bold tracking-tight mb-6">
            Find a Place to Call Home.
          </h1>
          <p className="text-base sm:text-lg text-white/80 leading-relaxed">
            NIVASA was created to eliminate the chaos, spam, and deceit in Bengaluru’s rental market.
            We believe finding a home should be safe, transparent, and respectful of everyone’s time and privacy.
          </p>
        </div>
      </div>

      {/* The Problem & Solution */}
      <div className="page-container py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary-700">The Problem</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900 mt-2 mb-4">
              House hunting in Bengaluru shouldn’t be a full-time ordeal
            </h2>
            <div className="space-y-4 text-stone-600 text-sm leading-relaxed">
              <p>
                Anyone who has searched for a home in Bengaluru knows the routine: outdated aggregator listings,
                phantom flats that were rented three months ago, sudden surprise brokerage fees, and spam calls
                at all hours of the night.
              </p>
              <p>
                Landlords face the same frustration: after publishing a listing, their personal phone numbers get scraped
                into telemarketing databases, leading to 40 unsolicited calls a day from unregistered agents.
              </p>
              <p className="font-semibold text-stone-800">
                NIVASA fixes this broken model by putting privacy, verification, and managed customer care first.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-2xl shadow-card border border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center mb-4">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1">Strict Verification</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Every property undergoes a 6-point verification process before it appears on our public site.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card border border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
                <EyeOff size={20} />
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1">Privacy By Design</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                No phone numbers are broadcast online. We facilitate callbacks and visit appointments securely.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card border border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-4">
                <MapPin size={20} />
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1">Neighborhood Focus</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Hyperlocal listings curated across 35+ prime Bengaluru residential and tech corridor hubs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-card border border-stone-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-4">
                <HeartHandshake size={20} />
              </div>
              <h3 className="font-bold text-stone-900 text-base mb-1">Managed Visits</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                We coordinate physical walkthroughs directly with tenants and property owners at convenient times.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Pillars */}
      <div className="bg-stone-100 py-16">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-stone-900">
              Our Core Promises
            </h2>
            <p className="text-stone-500 text-sm mt-2">
              The four foundational principles behind every listing on NIVASA.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200/80">
              <div className="text-2xl font-bold font-display text-primary-800 mb-2">01</div>
              <h3 className="font-bold text-stone-900 text-sm mb-2">No Phantom Listings</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                When a flat is rented, it is immediately marked as occupied or archived. We do not keep ghost listings for traffic.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200/80">
              <div className="text-2xl font-bold font-display text-primary-800 mb-2">02</div>
              <h3 className="font-bold text-stone-900 text-sm mb-2">Accurate Pricing</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Rent and security deposit amounts are checked and confirmed directly with the property owner.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200/80">
              <div className="text-2xl font-bold font-display text-primary-800 mb-2">03</div>
              <h3 className="font-bold text-stone-900 text-sm mb-2">Zero Spam Calls</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Tenants and landlords only receive communication from our dedicated concierge desk when a visit is ready to be set.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-stone-200/80">
              <div className="text-2xl font-bold font-display text-primary-800 mb-2">04</div>
              <h3 className="font-bold text-stone-900 text-sm mb-2">Bengaluru Expertise</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                From metro connectivity to water availability and local commute routes, we provide transparent local context.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to action */}
      <div className="page-container py-16 text-center">
        <div className="bg-primary-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl max-w-4xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-display font-bold mb-3">
            Ready to experience a better way to rent?
          </h2>
          <p className="text-white/70 text-sm max-w-xl mx-auto mb-8">
            Whether you are looking for your next apartment in Koramangala or have a property to list in Indiranagar,
            we are here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/properties">
              <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                Explore Properties
              </Button>
            </Link>
            <Link to="/list-property">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-stone-900">
                List Your Property
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AboutPage
