import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Award, 
  Users2, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Scale, 
  TrendingUp, 
  FileCheck2,
  ExternalLink
} from 'lucide-react';
import { FAQ, SiteSettings } from '../types';
import { fetchFAQs } from '../lib/api';

interface AboutPageProps {
  settings: SiteSettings;
  onOpenEnquiry: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ settings, onOpenEnquiry }) => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [selectedFaqCategory, setSelectedFaqCategory] = useState<string>('All');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  useEffect(() => {
    fetchFAQs().then(setFaqs).catch(console.error);
  }, []);

  const categories = ['All', 'Buying', 'Selling', 'RERA & Legal', 'Home Loans', 'Vastu'];

  const filteredFaqs = faqs.filter(f => {
    if (selectedFaqCategory === 'All') return true;
    return f.category === selectedFaqCategory;
  });

  const toggleFaq = (id: string) => {
    setOpenFaqId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* 1. Hero & Philosophy */}
        <section className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold">
            <Award className="w-4 h-4 text-amber-700" />
            <span>Fiduciary Real Estate Consultancy</span>
          </div>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight">
            Curating Western Mumbai’s Most Desirable Homes with Absolute Integrity
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed whitespace-pre-line">
            {settings.aboutSummary || 'Founded on the principle that property acquisition should be rooted in physical verification, title certainty, and client-first fiduciary representation.'}
          </p>
          {settings.googleMapsUrl && (
            <a href={settings.googleMapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-amber-800 hover:underline">
              <MapPin className="w-3.5 h-3.5" /> Find our office on Google Maps
            </a>
          )}
        </section>

        {/* 2. Core Pillars Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display text-xl font-bold text-stone-900">
              The Curated Residences Standard
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We decline more than 60% of projects in the market due to delayed track records, questionable floor plan claims, or ambiguous legal titles. Only vetted homes enter our catalogue.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display text-xl font-bold text-stone-900">
              End-to-End Legal & Title Clarity
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              From MahaRERA registration audits to Commencement Certificates, Sub-Registrar registration, and society NOCs, our legal desk oversees every stage of documentation.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
              <Users2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif-display text-xl font-bold text-stone-900">
              Personalized Senior Advisory
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              You will never be handed off to junior call center agents. Every client works directly with senior advisors possessing over a decade of micro-market negotiation experience.
            </p>
          </div>

        </section>

        {/* 3. Comprehensive Services Matrix - Radiant, Bright & Luxury */}
        <section className="bg-gradient-to-br from-amber-50 via-white to-amber-100/60 rounded-3xl p-8 sm:p-12 border border-amber-200/90 shadow-xs space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
              Full-Spectrum Support
            </span>
            <h2 className="font-serif-display text-3xl font-bold text-slate-900">
              End-to-End Advisory Services
            </h2>
            <p className="text-xs text-slate-600">
              Whether purchasing a primary residence, divesting an inherited apartment, or structuring an investment portfolio.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
              <h4 className="font-serif-display text-base font-bold text-slate-900">
                Buyer Representation
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Objective property discovery, private site tours, comparative price benchmarking, and developer contract negotiations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
              <h4 className="font-serif-display text-base font-bold text-slate-900">
                Seller Mandate
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Data-driven property valuation, professional architectural media, pre-vetted buyer screenings, and discrete sales closures.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
              <h4 className="font-serif-display text-base font-bold text-slate-900">
                Home Loan Guidance
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct partnerships with HDFC, ICICI, SBI, and Axis Bank for pre-approved credit lines and competitive interest rates.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-amber-200/80 shadow-xs space-y-2 hover:shadow-md transition-shadow">
              <h4 className="font-serif-display text-base font-bold text-slate-900">
                Vastu Shastra Audits
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Classical directional assessment of Ishanya, Agneya, and Nairutya zones with non-invasive remedial balancing.
              </p>
            </div>
          </div>
        </section>

        {/* 4. Senior Advisor Profile */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-4">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 shadow-md border border-stone-200">
                <img
                  src={settings.advisorImage}
                  alt={settings.advisorName}
                  width={600}
                  height={800}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 p-4 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400">Principal Advisor</span>
                  <div className="font-serif-display text-lg font-bold">{settings.advisorName}</div>
                </div>
              </div>
            </div>

            <div className="md:col-span-8 space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  Leadership Profile
                </span>
                <h3 className="font-serif-display text-3xl font-bold text-stone-900 mt-2">
                  {settings.advisorName}
                </h3>
                <span className="text-xs text-stone-500 font-medium block">
                  {settings.advisorTitle}{settings.advisorRera && <> • <strong className="font-mono text-stone-800">{settings.advisorRera}</strong></>}
                </span>
              </div>

              <p className="text-sm text-stone-700 leading-relaxed">
                {settings.advisorBio}
              </p>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-stone-500 uppercase font-semibold text-[10px] block">Experience</span>
                  <span className="font-bold text-stone-900 text-sm">15 Years</span>
                </div>
                <div>
                  <span className="text-stone-500 uppercase font-semibold text-[10px] block">Specialization</span>
                  <span className="font-bold text-stone-900 text-sm">Western Mumbai Luxury</span>
                </div>
                <div>
                  <span className="text-stone-500 uppercase font-semibold text-[10px] block">Direct Contact</span>
                  <a href="tel:+919987154120" className="font-bold text-amber-800 text-sm hover:underline">
                    +91 99871 54120
                  </a>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenEnquiry}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/25 transition-all"
                >
                  Schedule Private Appointment
                </button>
                <a
                  href={`https://wa.me/919987154120?text=Hello%20Tejas%20Shah%2C%20I%20would%20like%20to%20consult%20with%20you%20regarding%20residential%20property%20in%20Western%20Mumbai.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5"
                >
                  <span>WhatsApp Tejas Shah</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* 5. Dynamically Loaded FAQs with Category Tabs */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800">
              Frequently Asked Questions
            </span>
            <h2 className="font-serif-display text-3xl font-bold text-stone-900">
              Clear Answers for Mumbai Homebuyers & Sellers
            </h2>
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFaqCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 ${
                  selectedFaqCategory === cat
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Accordion List */}
          <div className="max-w-3xl mx-auto space-y-3">
            {filteredFaqs.map((faq) => {
              const isOpen = openFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50 transition-colors"
                >
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif-display text-base font-bold text-stone-900 pr-4">
                      {faq.question}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 border border-stone-200 text-stone-500">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-200/60 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </div>
    </div>
  );
};
