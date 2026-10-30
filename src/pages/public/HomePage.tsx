import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search, MapPin, ArrowRight, Phone,
  CheckCircle2, Home, Building2, Sparkles, Map,
  Users, DollarSign, ShieldCheck,
} from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { PropertyCard } from '../../components/property/PropertyCard'
import { MapView } from '../../components/property/MapView'
import { DEMO_FEATURED_PROPERTIES, DEMO_PROPERTIES } from '../../constants/demoProperties'
import { BENGALURU_LOCALITIES } from '../../constants/localities'

// Multi-parameter Hero Search Bar
const HeroSearchWidget: React.FC = () => {
  const [locality, setLocality] = useState('')
  const [bhk, setBhk] = useState('')
  const [propertyType, setPropertyType] = useState('')
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (locality) params.set('locality', locality)
    if (bhk) params.set('bhk', bhk)
    if (propertyType) params.set('type', propertyType)
    navigate(`/properties?${params.toString()}`)
  }

  return (
    <form
      onSubmit={handleSearch}
      className="bg-white rounded-3xl p-3 sm:p-4 shadow-2xl border border-stone-200/90 text-left"
      aria-label="Property search"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 items-center">
        {/* Locality */}
        <div className="bg-stone-50 rounded-2xl px-3.5 py-2.5 border border-stone-200/70 focus-within:border-primary-600 focus-within:bg-white transition-all">
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">
            Locality
          </label>
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-primary-600 flex-shrink-0" />
            <input
              type="text"
              value={locality}
              onChange={e => setLocality(e.target.value)}
              placeholder="e.g. Indiranagar, HSR..."
              list="hero-locality-options"
              className="w-full bg-transparent text-sm font-semibold text-stone-900 placeholder-stone-400 outline-none"
            />
            <datalist id="hero-locality-options">
              {BENGALURU_LOCALITIES.map(l => (
                <option key={l} value={l} />
              ))}
            </datalist>
          </div>
        </div>

        {/* BHK */}
        <div className="bg-stone-50 rounded-2xl px-3.5 py-2.5 border border-stone-200/70 focus-within:border-primary-600 focus-within:bg-white transition-all">
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">
            Bedrooms (BHK)
          </label>
          <div className="flex items-center gap-2">
            <Home size={16} className="text-primary-600 flex-shrink-0" />
            <select
              value={bhk}
              onChange={e => setBhk(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-stone-900 outline-none cursor-pointer"
            >
              <option value="">Any BHK</option>
              <option value="1">1 BHK</option>
              <option value="2">2 BHK</option>
              <option value="3">3 BHK</option>
              <option value="4">4+ BHK</option>
            </select>
          </div>
        </div>

        {/* Property Type */}
        <div className="bg-stone-50 rounded-2xl px-3.5 py-2.5 border border-stone-200/70 focus-within:border-primary-600 focus-within:bg-white transition-all">
          <label className="block text-[11px] font-bold text-stone-500 uppercase tracking-wider mb-0.5">
            Property Type
          </label>
          <div className="flex items-center gap-2">
            <Building2 size={16} className="text-primary-600 flex-shrink-0" />
            <select
              value={propertyType}
              onChange={e => setPropertyType(e.target.value)}
              className="w-full bg-transparent text-sm font-semibold text-stone-900 outline-none cursor-pointer"
            >
              <option value="">All Types</option>
              <option value="APARTMENT">Apartment</option>
              <option value="HOUSE">Independent House</option>
              <option value="VILLA">Gated Villa</option>
              <option value="STUDIO">Studio Room</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            className="h-[52px] bg-primary-700 hover:bg-primary-800 text-white font-bold rounded-2xl shadow-teal-glow flex items-center justify-center gap-2 text-sm"
          >
            <Search size={18} />
            <span>Search Homes</span>
          </Button>
        </div>
      </div>
    </form>
  )
}

// Statistics Counters
const STATS = [
  { value: '5,000+', label: 'Verified Homes', sub: 'Across Bengaluru' },
  { value: '₹0', label: 'Zero Brokerage', sub: 'Direct from owners' },
  { value: '12,000+', label: 'Happy Renters', sub: 'Found home on NIVASA' },
  { value: '4.9 ★', label: 'Renter Rating', sub: 'Trustpilot & Google' },
]

// How It Works Steps
const HOW_IT_WORKS_STEPS = [
  {
    step: '01',
    title: 'Browse Verified Listings',
    desc: 'Explore genuine listings across Bengaluru with verified photos, true floor plans, and transparent rent details.',
    icon: Search,
  },
  {
    step: '02',
    title: 'Schedule a Visit or Callback',
    desc: 'Found a home you love? Book a free in-person visit slot or request an instant callback with just your name & phone.',
    icon: Phone,
  },
  {
    step: '03',
    title: 'Visit at Your Convenience',
    desc: 'Our local Bengaluru desk coordinates directly with the property owner. No unverified middleman calls.',
    icon: CheckCircle2,
  },
  {
    step: '04',
    title: 'Move In with Zero Brokerage',
    desc: 'Confirm your choice, sign a digital lease, and move in effortlessly without paying a single rupee of brokerage fees.',
    icon: Home,
  },
]

export const HomePage: React.FC = () => {
  return (
    <div className="bg-stone-50 min-h-screen">
      {/* ── HERO SECTION ─────────────────────────────────────────── */}
      <section
        className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#063f45]"
        aria-label="NIVASA Hero"
      >
        {/* Deep Teal layered background with subtle radial glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#03262a] via-[#063f45] to-[#0a6067]" />
        
        {/* Soft decorative ambient light */}
        <div
          className="absolute top-1/4 -right-20 w-[500px] h-[500px] bg-secondary-500/15 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-10 -left-20 w-[450px] h-[450px] bg-accent-500/15 rounded-full blur-[100px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative page-container text-center text-white pt-32 pb-20 animate-fade-in z-10">
          {/* Logo in Hero */}
          <div className="inline-block mb-4">
            <img
              src="/nivasa_logo_white.png"
              alt="NIVASA"
              className="h-16 sm:h-20 w-auto mx-auto object-contain drop-shadow-md"
            />
          </div>

          {/* Subheading pill */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" aria-hidden="true" />
            <span className="text-accent-300">Bengaluru's Premium Zero Brokerage Rental Platform</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold tracking-tight mb-5 leading-[1.08] max-w-4xl mx-auto">
            Find a Place <br />
            <span className="text-accent-400">to Call Home.</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-xl text-stone-200/90 mb-10 max-w-2xl mx-auto leading-relaxed font-normal">
            Direct owner listings in Indiranagar, Koramangala, HSR Layout, Whitefield, and beyond.
            Verified properties, real photos, and zero brokerage.
          </p>

          {/* Hero Search Box */}
          <div className="max-w-4xl mx-auto mb-14">
            <HeroSearchWidget />
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
              <span className="text-stone-300">Popular Searches:</span>
              {['Indiranagar 2BHK', 'Koramangala 1BHK', 'HSR Layout 3BHK', 'Whitefield Villa'].map(tag => (
                <Link
                  key={tag}
                  to={`/properties?locality=${encodeURIComponent(tag.split(' ')[0])}`}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded-full border border-white/15 transition-colors font-medium"
                >
                  {tag}
                </Link>
              ))}
            </div>
          </div>

          {/* Statistics Counter */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
            {STATS.map(s => (
              <div
                key={s.label}
                className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15 text-left shadow-lg"
              >
                <p className="text-2xl sm:text-3xl font-extrabold text-accent-400 font-display">{s.value}</p>
                <p className="text-sm font-bold text-white mt-1">{s.label}</p>
                <p className="text-xs text-stone-300/80 mt-0.5">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED LISTINGS ────────────────────────────────────── */}
      <section className="section bg-stone-50" aria-label="Featured rental listings">
        <div className="page-container">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles size={16} className="text-accent-500 fill-accent-500" />
                <span className="text-primary-800 text-xs font-bold uppercase tracking-widest">
                  Hand-Picked For You
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-stone-900 tracking-tight">
                Featured Properties in Bengaluru
              </h2>
              <p className="text-stone-500 text-sm mt-1">
                Verified photos, accurate coordinates, and direct owner pricing.
              </p>
            </div>
            <Link to="/properties">
              <Button
                variant="outline"
                size="md"
                className="border-stone-300 hover:border-primary-700 hover:text-primary-800 font-semibold"
                rightIcon={<ArrowRight size={15} />}
              >
                View all {DEMO_PROPERTIES.length} Homes
              </Button>
            </Link>
          </div>

          {/* Featured Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DEMO_FEATURED_PROPERTIES.map(p => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how-it-works" className="section bg-white border-y border-stone-200/80" aria-label="How NIVASA Works">
        <div className="page-container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-primary-700 text-xs font-bold uppercase tracking-widest bg-primary-50 px-3.5 py-1 rounded-full border border-primary-200">
              Simple • Private • Zero Brokerage
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-extrabold text-stone-900 tracking-tight mt-3">
              How NIVASA Works
            </h2>
            <p className="text-stone-600 mt-2 text-base leading-relaxed">
              We take the frustration out of renting. No fake listings, no aggressive agents, no broker commission fees.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS_STEPS.map((item) => (
              <div
                key={item.step}
                className="relative bg-stone-50 rounded-3xl p-6 border border-stone-200/80 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-2xl bg-primary-700 text-white flex items-center justify-center shadow-md">
                      <item.icon size={22} />
                    </div>
                    <span className="text-2xl font-black font-display text-accent-500/80">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mb-2 font-display">
                    {item.title}
                  </h3>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GEOLOCATION MAP PREVIEW ──────────────────────────────── */}
      <section className="section bg-stone-50" aria-label="Interactive map preview">
        <div className="page-container">
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-card p-6 sm:p-8 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-700 flex items-center justify-center flex-shrink-0 border border-primary-200">
                  <Map size={24} />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-stone-900">
                    Find Homes Close to Work & Metro
                  </h2>
                  <p className="text-xs sm:text-sm text-stone-500">
                    Explore interactive house symbols across Bengaluru's tech corridors.
                  </p>
                </div>
              </div>

              <Link to="/properties">
                <Button variant="primary" size="md" className="bg-primary-700 hover:bg-primary-800" rightIcon={<ArrowRight size={15} />}>
                  Explore Full Screen Map
                </Button>
              </Link>
            </div>

            <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-inner h-[380px] w-full">
              <MapView properties={DEMO_PROPERTIES} />
            </div>
          </div>
        </div>
      </section>

      {/* ── OWNER CTA BANNER ─────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-r from-primary-950 via-primary-900 to-primary-800 text-white relative overflow-hidden">
        <div className="page-container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-accent-400 text-xs font-bold uppercase tracking-widest bg-white/10 px-3.5 py-1 rounded-full border border-white/15">
                For Property Owners
              </span>
              <h2 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight mt-4 mb-4">
                List Your Bengaluru Home with Zero Brokerage
              </h2>
              <p className="text-stone-300 text-base leading-relaxed mb-8 max-w-lg">
                Connect directly with verified families, software professionals, and students.
                NIVASA coordinates viewings, protects your privacy, and saves you broker fees.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/list-property">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="bg-accent-500 hover:bg-accent-400 text-stone-950 font-bold px-6 shadow-gold-glow"
                  >
                    Post Free Property Listing
                  </Button>
                </Link>
                <Link to="/about">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    Learn How We Verify
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 space-y-4 shadow-2xl">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-400 text-stone-950 flex items-center justify-center font-bold flex-shrink-0">
                  <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Save 1 Month Brokerage</h3>
                  <p className="text-xs text-stone-300 mt-0.5">Keep 100% of your rental income without losing thousands to brokers.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary-400 text-stone-950 flex items-center justify-center font-bold flex-shrink-0">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Tenant Identity Verified</h3>
                  <p className="text-xs text-stone-300 mt-0.5">We screen tenant inquiries and schedule visits strictly at your pre-agreed time.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-400 text-stone-950 flex items-center justify-center font-bold flex-shrink-0">
                  <Users size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Dedicated Property Desk</h3>
                  <p className="text-xs text-stone-300 mt-0.5">Our Bengaluru-based team handles all tenant inquiries so your phone doesn't ring endlessly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
export default HomePage
