import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  FileText, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Loader2, 
  MessageSquare,
  ExternalLink
} from 'lucide-react';
import { submitEnquiry } from '../lib/api';

export const ResalePage: React.FC = () => {
  const [intent, setIntent] = useState<'buy' | 'sell'>('buy');
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [requirements, setRequirements] = useState('');
  const [preferredArea, setPreferredArea] = useState('Bandra West');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || name.trim().length < 2) {
      setErrorMsg('Please enter your full name.');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      const fullRequirement = `Resale Intent: ${intent === 'buy' ? 'Looking to BUY resale property' : 'Looking to SELL resale property'} in ${preferredArea}. Requirements: ${requirements.trim() || 'Not specified'}`;

      const res = await submitEnquiry({
        name: name.trim(),
        mobile: cleanMobile,
        email: email.trim(),
        requirement: `Resale Desk: ${intent.toUpperCase()}`,
        message: fullRequirement
      });

      setSuccessMsg(res.message);
      setIsSubmitting(false);
    } catch (err: any) {
      setErrorMsg(err.message || 'Submission failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold">
            <ShieldCheck className="w-4 h-4 text-amber-700" />
            <span>Zero-Litigation Secondary Market Desk</span>
          </div>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight">
            Verified Resale Property Advisory in Western Mumbai
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Navigating secondary market residential transactions with comprehensive 30-year title searches, society transfer guidance, and transparent escrow facilitation.
          </p>
        </div>

        {/* 5-Step Resale Process Roadmap */}
        <section className="bg-white rounded-3xl p-8 sm:p-10 border border-stone-200 shadow-sm space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Transparent Framework
            </span>
            <h2 className="font-serif-display text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              The 5-Step Resale Verification Process
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {[
              {
                step: '01',
                title: '30-Year Title Search',
                desc: 'Independent advocate verification of chain of title deeds, Index II records, and encumbrance certificates.'
              },
              {
                step: '02',
                title: 'Society NOC & Dues Audit',
                desc: 'Confirmation of co-operative housing society share certificates, pending dues, transfer fee bylaws, and NOCs.'
              },
              {
                step: '03',
                title: 'Bank Valuation & Payoff',
                desc: 'Facilitating existing loan foreclosure letters, escrow accounts, and seamless fresh mortgage clearances.'
              },
              {
                step: '04',
                title: 'Agreement for Sale',
                desc: 'Carefully structured legal drafting protecting buyer advances and ensuring unconditional seller obligations.'
              },
              {
                step: '05',
                title: 'Sub-Registrar Registration',
                desc: 'End-to-end assistance at Mumbai Sub-Registrar offices for stamp duty, registration, and key handover.'
              }
            ].map((s) => (
              <div key={s.step} className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-3">
                <span className="font-mono text-2xl font-bold text-amber-700 block">
                  {s.step}
                </span>
                <h3 className="font-serif-display text-base font-bold text-stone-900">
                  {s.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Form & Direct Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-lg">
            
            <div className="mb-6">
              <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                Register Your Resale Intent
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Whether looking to acquire an off-market resale home or list your current apartment, connect with our dedicated secondary desk.
              </p>
            </div>

            {successMsg ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h4 className="font-serif-display text-xl font-bold text-emerald-950">
                  Resale Inquiry Received
                </h4>
                <p className="text-xs text-emerald-800 leading-relaxed max-w-md mx-auto">
                  {successMsg}
                </p>
                <button
                  onClick={() => setSuccessMsg(null)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 text-white font-semibold text-xs hover:bg-emerald-800 transition-colors"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                {errorMsg && (
                  <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Intent Radio Buttons */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-2">
                    I Want To: *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setIntent('buy')}
                      className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                        intent === 'buy'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      Buy a Resale Residence
                    </button>
                    <button
                      type="button"
                      onClick={() => setIntent('sell')}
                      className={`py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                        intent === 'sell'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      Sell a Resale Residence
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sunil V. Singhania"
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Contact Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                      Mobile Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-500">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="98200 54321"
                        maxLength={14}
                        className="w-full pl-11 pr-3.5 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
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
                      placeholder="sunil@example.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                {/* Preferred Area */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                    Target Micro-Market in Western Mumbai
                  </label>
                  <select
                    value={preferredArea}
                    onChange={(e) => setPreferredArea(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Bandra West">Bandra West (Pali Hill, Carter Rd, Turner Rd)</option>
                    <option value="Bandra East">Bandra East (BKC vicinity, Kalanagar)</option>
                    <option value="Khar West">Khar West (14th Rd, Madhu Park)</option>
                    <option value="Santacruz West">Santacruz West (Tagore Rd, Juhu link)</option>
                    <option value="Juhu">Juhu (JVPD Scheme, Gulmohar)</option>
                    <option value="Andheri West">Andheri West (Lokhandwala, Oshiwara)</option>
                    <option value="Goregaon West">Goregaon West (Link Rd, Bangur Nagar)</option>
                    <option value="Malad West">Malad West (Mindspace, Chincholi)</option>
                    <option value="Kandivali West">Kandivali West (Mahavir Nagar)</option>
                    <option value="Borivali West">Borivali West (Shimpoli, IC Colony)</option>
                  </select>
                </div>

                {/* Specific Requirements */}
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-700 mb-1">
                    Specific Requirements / Property Details
                  </label>
                  <textarea
                    rows={3}
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Mention preferred budget, BHK configuration, society age, parking requirements, or expected handover date..."
                    className="w-full px-4 py-2.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-900/20 flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Transmitting Resale Request...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Resale Request</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

          </div>

          {/* Secondary WhatsApp & Direct Advisory Column */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* WhatsApp Quick Action Card - Fresh, Luminous Emerald */}
            <div className="bg-gradient-to-br from-emerald-50 via-white to-emerald-100/70 text-emerald-950 rounded-3xl p-6 sm:p-8 border border-emerald-200/90 shadow-xs space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                Direct WhatsApp Channel
              </span>
              <h3 className="font-serif-display text-2xl font-bold text-slate-900">
                Urgent Secondary Market Requirement?
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect directly with our Resale Desk on WhatsApp for immediate off-market inventory checks and prompt title advice.
              </p>
              <a
                href="https://wa.me/919820198765?text=Hello%20TrustKeys%20Resale%20Desk%2C%20I%20have%20an%20inquiry%20regarding%20resale%20property%20in%20Western%20Mumbai."
                target="_blank"
                rel="noreferrer"
                className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-600/25 active:scale-95"
              >
                <span>Chat on WhatsApp (+91 98201 98765)</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>

            {/* Advisory Guarantee Box */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-3">
              <h4 className="font-serif-display text-lg font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-600" />
                The TrustKeys Resale Guarantee
              </h4>
              <ul className="space-y-2 text-xs text-stone-600">
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span><strong>Zero Disputed Titles:</strong> We decline properties with unclear ancestral succession or pending litigation.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span><strong>Accurate Carpet Verification:</strong> Physical on-ground measurement before token payment.</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span><strong>Escrow Protection:</strong> Advance tokens held in institutional escrow accounts until title clearance.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
