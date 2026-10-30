import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Search, MapPin, ArrowRight, Shield, Phone, CheckCircle, Star, Home, Map } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { PropertyCard } from '../../components/property/PropertyCard'
import { MapView } from '../../components/property/MapView'
import { DEMO_FEATURED_PROPERTIES, DEMO_PROPERTIES } from '../../constants/demoProperties'
import { BENGALURU_LOCALITIES } from '../../constants/localities'
import { cn } from '../../utils'

// Hero search bar
const HeroSearch: React.FC = () => {
  const [locality, setLocality]   = useState('')
  const navigate                   = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (locality) params.set('locality', locality)
    navigate(`/properties?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white/10 backdrop-blur-md rounded-3xl p-2 border border-white/20 shadow-2xl"
      aria-label="Property search form"
    >
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="flex-1 flex items-center gap-3 bg-white rounded-2xl px-4 py-3">
          <MapPin size={18} className="text-primary-500 flex-shrink-0" />
          <input
            id="hero-locality-search"
            type="text"
            value={locality}
            onChange={e => setLocality(e.target.value)}
            placeholder="Search by locality…"
            list="hero-locality-list"
            className="flex-1 bg-transparent text-stone-900 placeholder-stone-400 text-sm outline-none"
            aria-label="Search by locality in Bengaluru"
          />
          <datalist id="hero-locality-list">
            {BENGALURU_LOCALITIES.map(l => <option key={l} value={l} />)}
          </datalist>
        </div>
        <Button type="submit" variant="primary" size="lg" rightIcon={<Search size={16} />}>
          Search
        </Button>
      </div>
    </form>
  )
}

// Stats row
const stats = [
  { value: `${DEMO_PROPERTIES.length}+`, label: 'Active Listings' },
  { value: '50+', label: 'Localities Covered' },
  { value: '100%', label: 'Verified Listings' },
  { value: 'Free', label: 'For Tenants' },
]

// How it works
const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Search,
    title: 'Search & Explore',
    desc: 'Browse our curated Bengaluru listings by locality, budget, or property type. Use our interactive map to find what suits you.',
  },
  {
    step: '02',
    icon: CheckCircle,
    title: 'Request a Callback',
    desc: 'Found something you like? Submit a callback or visit request. Provide only your name, number, and preferred timing — nothing more.',
  },
  {
    step: '03',
    icon: Phone,
    title: 'We Call You',
    desc: 'Our NIVASA team reviews your request and calls you directly. We coordinate with the property owner and arrange a convenient visit.',
  },
  {
    step: '04',
    icon: Home,
    title: 'Move In',
    desc: 'After you visit and confirm your decision, we help finalise the details. No brokerage hassle — just a smooth, safe experience.',
  },
]

const WHY_NIVASA = [
  {
    icon: Shield,
    title: 'Privacy First',
    desc: 'We never publicly display owner phone numbers or exact addresses. All contact is coordinated through our verified team.',
  },
  {
    icon: CheckCircle,
    title: 'Admin-Verified Listings',
    desc: 'Every property is reviewed and approved by our team before it appears on the platform. No unverified or misleading listings.',
  },
  {
    icon: Star,
    title: 'Trusted for Bengaluru',
    desc: "Built specifically for Bengaluru's rental market. Curated localities, accurate rent data, and real availability information.",
  },
]

export const HomePage: React.FC = () => {
  return (
    <div>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section
        className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
        aria-label="NIVASA hero section"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700" />
        {/* Decorative circles */}
        <div className="absolute top-1/4 -right-32 w-96 h-96 bg-primary-600/30 rounded-full blur-3xl" aria-hidden="true" />
        <div className="absolute -bottom-20 -left-32 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl" aria-hidden="true" />

        <div className="relative page-container text-center text-white pt-24 pb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-sm mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" aria-hidden="true" />
            Verified rentals across Bengaluru
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold mb-5 leading-[1.1] max-w-3xl mx-auto">
            Find a Place<br />
            <span className="text-accent-400">to Call Home.</span>
          </h1>

          <p className="text-lg sm:text-xl text-white/75 mb-10 max-w-xl mx-auto leading-relaxed">
            Discover verified rental homes across Bengaluru. Students, professionals,
            and families — we find the right place for you.
          </p>

          <div className="max-w-xl mx-auto mb-12">
            <HeroSearch />
            <div className="mt-4 flex items-center justify-center gap-4 text-xs">
              <Link
                to="/properties"
                className="inline-flex items-center gap-1.5 text-accent-300 hover:text-white font-medium bg-white/10 px-3.5 py-1.5 rounded-full border border-white/15 transition-colors"
              >
                <span>🗺️ Open Interactive Map Above</span>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
            {stats.map(s => (
              <div key={s.label} className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
                <p className="text-2xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-white/60 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Interactive Map ───────────────────────────────────────── */}
      <section className="bg-stone-50 border-b border-stone-200" aria-label="Interactive property map">
        <div className="page-container py-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-primary-100 flex items-center justify-center">
                <Map size={16} className="text-primary-700" />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-stone-900">Explore on Map</h2>
                <p className="text-xs text-stone-500">{DEMO_PROPERTIES.length} properties across Bengaluru</p>
              </div>
            </div>
            <Link to="/properties">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight size={14} />}>
                Full Map View
              </Button>
            </Link>
          </div>
          {/* Map container */}
          <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm" style={{ height: '380px' }}>
            <MapView properties={DEMO_PROPERTIES} />
          </div>
        </div>
      </section>

      {/* ── Featured Properties ──────────────────────────────────── */}
      <section className="section bg-bg-base" aria-label="Featured properties">
        <div className="page-container">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-primary-600 text-sm font-semibold uppercase tracking-widest mb-1">Hand-picked for you</p>
              <h2 className="text-2xl font-display font-bold text-stone-900">Featured Listings</h2>
            </div>
            <Link to="/properties">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight size={15} />}>
                View all
              </Button>
            </Link>
          </div>

          {/* Compact 2-col list grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {DEMO_FEATURED_PROPERTIES.map(p => (
              <PropertyCard key={p.id} property={p} compact />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────── */}
      <section className="section bg-stone-50" aria-label="How NIVASA works">
        <div className="page-container">
          <div className="text-center mb-12">
            <p className="text-primary-600 text-sm font-semibold uppercase tracking-widest mb-2">Simple & safe</p>
            <h2 className="text-3xl font-display font-bold text-stone-900">How NIVASA Works</h2>
            <p className="text-stone-500 mt-3 max-w-md mx-auto">
              From search to move-in, our team handles the coordination so you don't have to.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((step, i) => (
              <div
                key={step.step}
                className={cn(
                  'relative bg-white rounded-3xl p-6 border border-stone-100 shadow-card',
                  i < HOW_IT_WORKS.length - 1 && 'lg:after:content-["→"] lg:after:absolute lg:after:-right-3 lg:after:top-1/2 lg:after:-translate-y-1/2 lg:after:text-stone-300 lg:after:text-2xl lg:after:z-10',
                )}
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
                  <step.icon size={22} className="text-primary-700" />
                </div>
                <p className="text-xs font-bold text-stone-300 mb-1">STEP {step.step}</p>
                <h3 className="font-semibold text-stone-900 mb-2">{step.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why NIVASA ───────────────────────────────────────────── */}
      <section className="section bg-bg-base" aria-label="Why choose NIVASA">
        <div className="page-container">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
            <div>
              <p className="text-primary-600 text-sm font-semibold uppercase tracking-widest mb-2">Why NIVASA</p>
              <h2 className="text-3xl font-display font-bold text-stone-900 mb-4">
                Rental search done<br />right.
              </h2>
              <p className="text-stone-500 leading-relaxed mb-8 max-w-md">
                We believe finding a home should be safe, private, and hassle-free.
                NIVASA manages every listing with care and keeps your information secure.
              </p>
              <Link to="/properties">
                <Button variant="primary" size="lg" rightIcon={<ArrowRight size={16} />}>
                  Explore Properties
                </Button>
              </Link>
            </div>

            <div className="mt-10 lg:mt-0 space-y-4">
              {WHY_NIVASA.map(item => (
                <div key={item.title} className="flex gap-4 p-5 bg-white rounded-2xl border border-stone-100 shadow-card">
                  <div className="w-11 h-11 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <item.icon size={20} className="text-primary-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-stone-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-stone-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────── */}
      <section className="py-16 bg-primary-800" aria-label="Call to action">
        <div className="page-container text-center text-white">
          <h2 className="text-3xl font-display font-bold mb-3">Have a property to list?</h2>
          <p className="text-white/70 mb-8 max-w-md mx-auto">
            Submit your property for review. Our team verifies every listing before it goes live.
          </p>
          <Link to="/list-property">
            <Button variant="secondary" size="lg">
              List Your Property
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
