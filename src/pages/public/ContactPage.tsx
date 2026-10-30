import React, { useState } from 'react'
import {
  Mail, Phone, MapPin, Clock, Send, CheckCircle2,
  HelpCircle, ChevronDown
} from 'lucide-react'
import { Input, Textarea, Select } from '../../components/ui/FormFields'
import { Button } from '../../components/ui/Button'
import { Alert } from '../../components/ui/States'

const FAQS = [
  {
    q: 'How quickly does NIVASA call after I request a callback?',
    a: 'Our Bengaluru concierge team typically reaches out within 2 to 4 business hours during our operating hours (9:00 AM – 7:00 PM IST, Monday through Saturday).',
  },
  {
    q: 'Is there any fee for tenants to view or visit a property?',
    a: 'No. Browsing properties, requesting callbacks, and scheduling physical property walkthroughs through NIVASA is completely free of charge for prospective tenants.',
  },
  {
    q: 'Why are exact door numbers and owner numbers not listed online?',
    a: 'To protect the privacy of both owners and tenants, and prevent unsolicited spam, harassment, or broker scraping. We verify all visits before sharing specific meeting details.',
  },
  {
    q: 'How does an owner list an apartment or house?',
    a: 'Simply click "List Your Property" in the top navigation. Fill out our simple submission form, and our onboarding team will contact you within 24 hours to verify and activate your listing.',
  },
]

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [subject, setSubject] = useState('Renter Inquiry')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !contact.trim() || !message.trim()) return

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
      setName('')
      setContact('')
      setMessage('')
    }, 600)
  }

  return (
    <div className="pt-16 pb-20 bg-bg-base min-h-screen">
      {/* Header */}
      <div className="bg-primary-900 text-white py-14">
        <div className="page-container text-center max-w-2xl">
          <h1 className="text-3xl sm:text-4xl font-display font-bold tracking-tight mb-3">
            Contact NIVASA
          </h1>
          <p className="text-white/80 text-sm sm:text-base leading-relaxed">
            Have questions about a property, want assistance with your home search, or need help listing your rental?
            Our Bengaluru support team is ready to assist you.
          </p>
        </div>
      </div>

      <div className="page-container py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left Column: Office Details & Hours */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-card border border-stone-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-stone-900 mb-6 pb-3 border-b border-stone-100">
                Bengaluru Desk
              </h2>

              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Office Location</p>
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                      100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Concierge Desk</p>
                    <p className="text-xs text-stone-500 mt-0.5 font-mono">+91 (80) 4920-8000</p>
                    <p className="text-[11px] text-stone-400">Direct phone support & WhatsApp</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Email Support</p>
                    <p className="text-xs text-stone-500 mt-0.5 font-mono">support@nivasa.rentals</p>
                    <p className="text-[11px] text-stone-400">For general inquiries and partnerships</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">Operating Hours</p>
                    <p className="text-xs text-stone-500 mt-0.5">Monday – Saturday</p>
                    <p className="text-[11px] text-stone-400">9:00 AM – 7:00 PM IST</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Assurance */}
            <div className="bg-primary-50 rounded-2xl p-5 border border-primary-200/80">
              <div className="flex items-center gap-2 text-primary-900 font-semibold text-sm mb-1">
                <CheckCircle2 size={16} className="text-primary-700" />
                <span>Zero Telemarketing Guarantee</span>
              </div>
              <p className="text-xs text-primary-800/80 leading-relaxed">
                We will never sell or share your contact number with third-party real estate databases.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Form & FAQ */}
          <div className="lg:col-span-2 space-y-10">

            {/* Contact Form */}
            <div className="bg-white rounded-3xl shadow-card border border-stone-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-stone-900 mb-2">
                Send Us a Message
              </h2>
              <p className="text-xs text-stone-500 mb-6">
                Fill in the details below and an operations specialist will follow up shortly.
              </p>

              {submitted && (
                <div className="mb-6">
                  <Alert
                    variant="success"
                    title="Message Received!"
                    message="Thank you for reaching out. A NIVASA team member will respond to you within 4 business hours."
                  />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    id="contact_name"
                    label="Your Name"
                    placeholder="e.g. Ananya Rao"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />

                  <Input
                    id="contact_info"
                    label="Mobile Number or Email"
                    placeholder="e.g. 9876543210 or name@example.com"
                    required
                    value={contact}
                    onChange={e => setContact(e.target.value)}
                  />
                </div>

                <Select
                  id="contact_subject"
                  label="Subject / Topic"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  options={[
                    { value: 'Renter Inquiry', label: 'Renter Assistance (Need help finding a flat)' },
                    { value: 'Property Owner', label: 'Property Owner (Listing questions / status)' },
                    { value: 'Visit Support', label: 'Visit / Appointment Rescheduling' },
                    { value: 'Feedback', label: 'Feedback / Platform Suggestions' },
                    { value: 'Other', label: 'Other Inquiries' },
                  ]}
                />

                <Textarea
                  id="contact_message"
                  label="How can we help?"
                  rows={4}
                  placeholder="Tell us what property or neighborhood you're interested in, or describe your query..."
                  required
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />

                <Button
                  type="submit"
                  variant="primary"
                  loading={loading}
                  leftIcon={<Send size={15} />}
                  className="mt-2"
                >
                  Send Message
                </Button>
              </form>
            </div>

            {/* FAQs */}
            <div className="bg-white rounded-3xl shadow-card border border-stone-100 p-6 sm:p-8">
              <h2 className="text-lg font-bold text-stone-900 mb-4 pb-3 border-b border-stone-100 flex items-center gap-2">
                <HelpCircle size={18} className="text-primary-700" />
                Frequently Asked Questions
              </h2>

              <div className="divide-y divide-stone-100">
                {FAQS.map((faq, idx) => (
                  <div key={idx} className="py-4">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                      className="w-full flex items-center justify-between text-left font-semibold text-stone-900 text-sm hover:text-primary-800 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={16}
                        className={`text-stone-400 transition-transform duration-200 flex-shrink-0 ml-2 ${
                          openFaq === idx ? 'rotate-180 text-primary-700' : ''
                        }`}
                      />
                    </button>
                    {openFaq === idx && (
                      <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed animate-fade-in">
                        {faq.a}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  )
}

export default ContactPage
