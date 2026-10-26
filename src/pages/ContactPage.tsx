import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';
import { SiteSettings } from '../types';
import { submitEnquiry } from '../lib/api';

interface ContactPageProps {
  settings: SiteSettings;
}

export const ContactPage: React.FC<ContactPageProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Buying Advisory');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!message.trim() || message.trim().length < 5) {
      setErrorMessage('Please provide a brief message describing your requirement.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitEnquiry({
        name: name.trim(),
        mobile: cleanMobile,
        email: email.trim(),
        requirement: `Contact Us: ${subject}`,
        message: message.trim()
      });

      setSuccessResponse(res.message);
      setIsSubmitting(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold">
            <Building2 className="w-4 h-4 text-amber-700" />
            <span>TrustKeys Office • Borivali, Mumbai</span>
          </div>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight">
            Connect with Our Senior Advisory Team
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Reach out for bespoke property searches, developer pricing negotiations, private site visits, or asset valuation across Western Mumbai.
          </p>
        </div>

        {/* Main Grid: Info & Map Card on Left, Working Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Business Details, Advisor Card & Map */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Headquarters Card */}
            <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6">
              <h3 className="font-serif-display text-xl font-bold text-stone-900">
                Headquarters & Advisory Office
              </h3>
              
              <div className="space-y-4 text-xs sm:text-sm text-stone-700">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-stone-900">Registered Office</span>
                    <p className="text-stone-600 leading-relaxed mt-0.5">{settings.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-stone-900">Telephone Hotlines</span>
                    <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="text-stone-800 hover:text-amber-800 font-mono block">
                      Primary: {settings.phone}
                    </a>
                    {settings.phoneSecondary && (
                      <a href={`tel:${settings.phoneSecondary.replace(/\s+/g, '')}`} className="text-stone-600 hover:text-amber-800 font-mono block">
                        Boardline: {settings.phoneSecondary}
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-stone-900">Electronic Correspondence</span>
                    <a href={`mailto:${settings.email}`} className="text-stone-800 hover:text-amber-800 block">
                      {settings.email}
                    </a>
                    <span className="text-[11px] text-stone-400">Leads: {settings.notificationEmail}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold block text-stone-900">Advisory Hours</span>
                    <p className="text-stone-600">{settings.officeHours}</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Action */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=Hello%20TrustKeys%2C%20I%20would%20like%20to%20schedule%20an%20advisory%20call.`}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp Directly</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Interactive Map Visual for Office */}
            <div className="bg-white rounded-3xl overflow-hidden border border-stone-200 shadow-sm">
              <div className="relative aspect-[16/10] w-full bg-stone-200">
                {/* Embed OpenStreetMap / Static visual tile */}
                <iframe
                  title="TrustKeys Borivali Office Location"
                  width="100%"
                  height="100%"
                  loading="lazy"
                  className="w-full h-full border-0"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(settings.address)}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                />
              </div>
              <div className="p-4 bg-stone-50 border-t border-stone-200 text-xs text-stone-600 flex items-center justify-between">
                <span>{settings.address}</span>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(settings.address)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-amber-800 font-semibold hover:underline flex items-center gap-1"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Principal Advisor Badge - Bright Luxury Card */}
            <div className="p-5 bg-gradient-to-r from-amber-50 via-white to-amber-100/60 text-slate-900 rounded-3xl border border-amber-200/90 shadow-xs flex items-center gap-4">
              <img
                src={settings.advisorImage}
                alt={settings.advisorName}
                width={80}
                height={80}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-400/60 shrink-0 shadow-sm"
              />
              <div className="text-xs space-y-1">
                <span className="font-serif-display text-base font-bold text-slate-950 block">
                  {settings.advisorName}
                </span>
                <p className="text-slate-600 font-medium">{settings.advisorTitle}</p>
                <span className="font-mono text-[11px] text-amber-800 block font-bold">
                  {settings.advisorRera}
                </span>
              </div>
            </div>

          </div>

          {/* Right Column: Working Enquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-lg">
            
            <div className="mb-6">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                Direct Submission
              </span>
              <h3 className="font-serif-display text-2xl font-bold text-stone-900 mt-2">
                Send an Advisory Request
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Fill in your details and requirement. We guarantee a response from a senior Western Mumbai advisor within 2 business hours.
              </p>
            </div>

            {successResponse ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                <h4 className="font-serif-display text-2xl font-bold text-emerald-950">
                  Enquiry Dispatched
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                  {successResponse}
                </p>
                <button
                  onClick={() => setSuccessResponse(null)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {errorMessage && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Subject / Purpose */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                    Subject / Area of Interest *
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Buying Advisory">Looking to Buy a Residence (New Launch / Ready)</option>
                    <option value="Selling Mandate">Looking to Sell My Property</option>
                    <option value="Resale Secondary Desk">Secondary Market / Resale Apartment Query</option>
                    <option value="Vastu Inspection">Vastu Shastra Layout Inspection</option>
                    <option value="Home Loan Guidance">Bank Financing & Loan Pre-approval</option>
                    <option value="General Inquiry">General Real Estate Advisory</option>
                  </select>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Tejas Shah"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Contact Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="98201 12345"
                        maxLength={14}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="vikram@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                    Message / Specific Preferences *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Please specify your preferred locations (e.g. Bandra, Juhu, Andheri), budget range, configuration, or any specific questions..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-900/20 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Dispatch Advisory Request</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-stone-400 text-center pt-1">
                  MahaRERA compliant privacy mandate. Your contact details are never shared with unauthorized third parties.
                </p>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
