import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  ShieldCheck, 
  Camera, 
  Users2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Phone,
  ExternalLink 
} from 'lucide-react';
import { submitSellLead } from '../lib/api';

export const SellPage: React.FC = () => {
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState<'Residential' | 'Commercial'>('Residential');
  const [configuration, setConfiguration] = useState('3 BHK');
  const [carpetArea, setCarpetArea] = useState<number | ''>('');
  const [expectedPrice, setExpectedPrice] = useState('');
  const [propertyStatus, setPropertyStatus] = useState('Ready / Vacant');
  const [extraDetails, setExtraDetails] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successResponse, setSuccessResponse] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return; // Prevent duplicate submissions while saving

    setErrorMessage(null);

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMessage('Please enter a valid 10-digit contact number.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    if (!location.trim() || location.trim().length < 2) {
      setErrorMessage('Please provide property building name and micro-market location.');
      return;
    }

    if (!carpetArea || Number(carpetArea) <= 0) {
      setErrorMessage('Please enter a valid carpet area in square feet.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await submitSellLead({
        name: name.trim(),
        mobile: cleanMobile,
        email: email.trim(),
        location: location.trim(),
        category,
        configuration,
        carpetArea: Number(carpetArea),
        expectedPrice: expectedPrice.trim() || 'Market Valuation Requested',
        propertyStatus,
        extraDetails: extraDetails.trim() || undefined
      });

      setSuccessResponse(res.message);
      setIsSubmitting(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit seller details. Please check network.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold">
            <TrendingUp className="w-4 h-4 text-amber-700" />
            <span>Maximize Property Value in Western Mumbai</span>
          </div>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight">
            Sell Your Western Mumbai Residence at Maximum Market Value
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Direct access to qualified pre-approved buyers, HNI networks, and NRI investors. Zero cold callers, discrete showings, and data-backed valuation benchmarking.
          </p>
        </div>

        {/* 4-Step Selling Advisory Roadmap */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              The Advisory Roadmap
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              How TrustKeys Sells Your Property Faster
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                step: 'Phase 1',
                title: 'Data-Backed Valuation (CMA)',
                desc: 'We analyze recent registered transactions in your specific building and lane to determine the optimal price ceiling.'
              },
              {
                step: 'Phase 2',
                title: 'Architectural Presentation',
                desc: 'High-definition photography, verified floor-plan digitization, and a curated property docket highlighting unique USPs.'
              },
              {
                step: 'Phase 3',
                title: 'Pre-Screened Private Showings',
                desc: 'Only KYC-verified buyers with bank pre-approvals or verified funds are escorted for private viewings.'
              },
              {
                step: 'Phase 4',
                title: 'Escrow & Legal Closure',
                desc: 'Full assistance with society NOCs, draft approvals, TDS filings, and registration at the Sub-Registrar office.'
              }
            ].map((p, idx) => (
              <div key={p.step} className="p-6 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3 relative">
                <span className="text-xs font-mono font-bold text-amber-700 uppercase tracking-wider block">
                  {p.step}
                </span>
                <h3 className="font-serif-display text-base font-bold text-stone-900">
                  {p.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Seller Lead Submission Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-lg">
            <div className="mb-6">
              <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                List Your Property for Valuation
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Enter your property details below. Our valuation desk will generate a Comparative Market Analysis (CMA) within 24 hours.
              </p>
            </div>

            {successResponse ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                <h4 className="font-serif-display text-2xl font-bold text-emerald-950">
                  Listing Request Submitted
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                  {successResponse}
                </p>
                <div className="p-4 bg-white rounded-xl border border-emerald-200 text-xs text-emerald-900 text-left space-y-1">
                  <div className="font-semibold">Next Step:</div>
                  <p>Our senior valuation specialist will contact you to review recent registration prices in your building and schedule a private inspection.</p>
                </div>
                <button
                  onClick={() => setSuccessResponse(null)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors"
                >
                  Submit Another Property
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {errorMessage && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Seller Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anand K. Parekh"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

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
                        className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
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
                      placeholder="anand@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Property Location & Category */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                      Building / Society Name & Locality *
                    </label>
                    <input
                      type="text"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. Pali Crest, Pali Hill, Bandra West"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as 'Residential' | 'Commercial')}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="Residential">Residential Residence</option>
                      <option value="Commercial">Commercial / Office Space</option>
                    </select>
                  </div>
                </div>

                {/* Configuration, Carpet Area & Expected Price */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                      Configuration *
                    </label>
                    <select
                      value={configuration}
                      onChange={(e) => setConfiguration(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="1 BHK">1 BHK</option>
                      <option value="2 BHK">2 BHK</option>
                      <option value="3 BHK">3 BHK</option>
                      <option value="4 BHK">4 BHK</option>
                      <option value="5+ BHK">5+ BHK</option>
                      <option value="Penthouse">Penthouse Suite</option>
                      <option value="Duplex">Duplex Residence</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                      Carpet Area (sq.ft.) *
                    </label>
                    <input
                      type="number"
                      required
                      value={carpetArea}
                      onChange={(e) => setCarpetArea(e.target.value ? Number(e.target.value) : '')}
                      placeholder="e.g. 1350"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                      Expected Price (INR)
                    </label>
                    <input
                      type="text"
                      value={expectedPrice}
                      onChange={(e) => setExpectedPrice(e.target.value)}
                      placeholder="e.g. ₹8.50 Cr or Open to Valuation"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Property Status */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                    Current Possession / Occupancy Status *
                  </label>
                  <select
                    value={propertyStatus}
                    onChange={(e) => setPropertyStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Ready / Vacant">Ready to Move & Vacant</option>
                    <option value="Self Occupied">Self Occupied by Owner</option>
                    <option value="Currently Tenanted">Currently Tenanted (Rental Inflow)</option>
                    <option value="Under Construction / Re-development">Under Construction / Near Possession</option>
                  </select>
                </div>

                {/* Extra Details */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                    Special Features & Details (Floor level, Parkings, Balconies, Sea View)
                  </label>
                  <textarea
                    rows={3}
                    value={extraDetails}
                    onChange={(e) => setExtraDetails(e.target.value)}
                    placeholder="Mention if you have dedicated stilt parking, sea views, recent interior renovations, or special society amenities..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Submit button with duplicate prevention */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-900/20 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Seller Docket & Creating Enquiry...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Property for Comparative Market Valuation</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

              </form>
            )}

          </div>

          {/* Right Sidebar: WhatsApp & Seller Advantages */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* WhatsApp Direct Action - Bright, Luminous Emerald */}
            <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70 text-emerald-950 rounded-3xl p-6 border border-emerald-200/90 shadow-xs space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                Seller Fast-Track
              </span>
              <h3 className="font-serif-display text-xl font-bold text-slate-900">
                Need an Immediate Valuation Assessment?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Send photos or property location directly on WhatsApp for an immediate confidential discussion with Vikramaditya.
              </p>
              <a
                href="https://wa.me/919820198765?text=Hello%20TrustKeys%2C%20I%20am%20a%20property%20owner%20looking%20to%20sell%20my%20residence%20in%20Western%20Mumbai."
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/25 active:scale-95"
              >
                <span>WhatsApp Owner Desk</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Why Sellers Choose Us */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
              <h4 className="font-serif-display text-base font-bold text-stone-900">
                The TrustKeys Selling Advantage
              </h4>
              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Total Confidentiality:</strong> No open public gate banners or noisy crowd showings without consent.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <Users2 className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Pre-Qualified Buyers:</strong> Every prospective purchaser is vetted for financial readiness.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <TrendingUp className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Data-Driven Pricing:</strong> Real-time Sub-Registrar data ensures you never underprice your asset.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
