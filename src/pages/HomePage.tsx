import React, { useState } from 'react';
import { 
  Building2, 
  ArrowRight, 
  ShieldCheck, 
  Award, 
  Sparkles, 
  Compass, 
  FileCheck2, 
  Users2, 
  TrendingUp, 
  CheckCircle2, 
  MapPin,
  ChevronRight
} from 'lucide-react';
import { ProjectCatalogue } from '../components/ProjectCatalogue';

interface HomePageProps {
  onSelectProject: (slug: string) => void;
  onOpenEnquiry: (projectTitle?: string) => void;
  navigate: (route: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onSelectProject,
  onOpenEnquiry,
  navigate
}) => {
  // Preset filters passed into the catalogue
  const [activeAreaPreset, setActiveAreaPreset] = useState<string | undefined>(undefined);
  const [activeStatusPreset, setActiveStatusPreset] = useState<string | undefined>(undefined);
  const [activeCategoryPreset, setActiveCategoryPreset] = useState<string | undefined>(undefined);

  const scrollToCatalogue = () => {
    const el = document.getElementById('home-project-catalogue');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleApplyPreset = (type: 'area' | 'status' | 'category', val: string) => {
    if (type === 'area') setActiveAreaPreset(val);
    if (type === 'status') setActiveStatusPreset(val);
    if (type === 'category') setActiveCategoryPreset(val);
    scrollToCatalogue();
  };

  return (
    <div className="min-h-screen bg-white">
      
      {/* 1. Hero Section - Bright, Sunlit & Modern Luxury */}
      <section className="relative bg-gradient-to-b from-amber-50/90 via-white to-amber-50/40 text-slate-900 overflow-hidden py-16 lg:py-24 border-b border-amber-200/70">
        {/* Soft Sunlit Architectural Backdrop */}
        <div className="absolute inset-0 z-0 opacity-15 mix-blend-multiply pointer-events-none">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80"
            alt="Western Mumbai luxury architecture"
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
            width={1920}
            height={1080}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            
            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/90 text-amber-950 border border-amber-300 text-xs font-bold shadow-xs">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Western Mumbai’s Premier Residential Advisory • 100% MahaRERA Verified</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-950 leading-[1.15]">
              Discreet, Verified Residential Properties Across <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500">Western Mumbai</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
              From sea-view penthouses in Bandra & Juhu to prime high-rises in Andheri & Borivali. We deliver verified land titles, zero-litigation track records, and bespoke developer pricing.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={scrollToCatalogue}
                className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-sm shadow-lg shadow-amber-600/25 flex items-center gap-2 transition-all duration-200 active:scale-95"
              >
                <span>Explore All Residences</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onOpenEnquiry()}
                className="px-6 py-3.5 rounded-xl bg-white hover:bg-amber-50/80 text-slate-800 font-semibold text-sm border border-slate-300 shadow-sm transition-colors flex items-center gap-2"
              >
                <span>Speak to Vikramaditya (Principal Advisor)</span>
              </button>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 border-t border-amber-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-amber-200/80 shadow-xs">
                <span className="font-serif-display text-2xl sm:text-3xl font-bold text-amber-700 block">
                  ₹450 Cr+
                </span>
                <span className="text-xs text-slate-600 font-medium">Transacted Advisory</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-amber-200/80 shadow-xs">
                <span className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900 block">
                  100%
                </span>
                <span className="text-xs text-slate-600 font-medium">RERA Title Audits</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-amber-200/80 shadow-xs">
                <span className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-900 block">
                  18+ Yrs
                </span>
                <span className="text-xs text-slate-600 font-medium">Western Suburbs Focus</span>
              </div>
              <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-amber-200/80 shadow-xs">
                <span className="font-serif-display text-2xl sm:text-3xl font-bold text-amber-700 block">
                  0
                </span>
                <span className="text-xs text-slate-600 font-medium">Litigation Record</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Quick Presets Bar: Property Categories & Project Stages */}
      <section className="bg-white border-b border-stone-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            
            {/* Stage presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 shrink-0">
                Explore by Stage:
              </span>
              {[
                { label: 'Ready to Move', val: 'Ready', badge: 'Immediate Handover', color: 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100' },
                { label: 'Ongoing Developments', val: 'Ongoing', badge: 'Under Construction', color: 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100' },
                { label: 'Upcoming / New Launches', val: 'Upcoming', badge: 'Pre-launch Rates', color: 'bg-sky-50 text-sky-800 border-sky-300 hover:bg-sky-100' }
              ].map(item => (
                <button
                  key={item.val}
                  onClick={() => handleApplyPreset('status', item.val)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all shrink-0 flex items-center gap-1.5 ${item.color}`}
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] opacity-75 font-normal">({item.badge})</span>
                </button>
              ))}
            </div>

            {/* Category presets */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 shrink-0">
                Categories:
              </span>
              {[
                'Luxury Apartments',
                'Penthouse Suites',
                'Boutique Seafront',
                'Gated Community'
              ].map(cat => (
                <button
                  key={cat}
                  onClick={() => handleApplyPreset('category', cat)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors shrink-0"
                >
                  {cat}
                </button>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* 3. The SAME Shared Project Catalogue Component */}
      <ProjectCatalogue
        id="home-project-catalogue"
        onSelectProject={onSelectProject}
        presetArea={activeAreaPreset}
        presetStatus={activeStatusPreset}
        presetCategory={activeCategoryPreset}
      />

      {/* 4. The TrustKeys Approach Section - Bright & Luminous */}
      <section className="py-20 bg-gradient-to-b from-white via-amber-50/40 to-slate-50 text-slate-900 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-800 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-300">
              The TrustKeys Standard
            </span>
            <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-slate-900 mt-3 mb-4">
              Why Discerning Buyers Choose Us Over Aggregator Portals
            </h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              We eliminate deceptive listing prices, obsolete developments, and unsolicited telemarketing. Every transaction is guided by strict fiduciary ethics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="bg-white p-7 rounded-3xl border border-amber-200/80 hover:border-amber-400 hover:shadow-lg transition-all shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display text-lg font-bold text-slate-900">
                100% Physical Inspection
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We physically tour every development, inspect construction quality, measure carpet areas, and review neighborhood acoustics before recommending.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-amber-200/80 hover:border-amber-400 hover:shadow-lg transition-all shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display text-lg font-bold text-slate-900">
                MahaRERA Title Audit
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct verification of Commencement Certificates (CC), Occupation Certificates (OC), bank escrow accounts, and litigation free reports.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-amber-200/80 hover:border-amber-400 hover:shadow-lg transition-all shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display text-lg font-bold text-slate-900">
                Certified Vastu Guidance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transparent directional evaluations covering Ishanya entrance zones, Agni kitchen placements, and Nairutya master chambers.
              </p>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-amber-200/80 hover:border-amber-400 hover:shadow-lg transition-all shadow-xs space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                <Users2 className="w-6 h-6" />
              </div>
              <h3 className="font-serif-display text-lg font-bold text-slate-900">
                Personal Negotiation Desk
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Direct access to developer leadership desks to secure prime payment structures, floor selection, and maximum commercial advantages.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Western Mumbai Micro-Markets Showcase */}
      <section className="py-20 bg-slate-50/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-amber-700 bg-amber-100 px-3 py-1 rounded-full">
                Western Mumbai Corridors
              </span>
              <h2 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900 mt-2">
                Hyper-Local Expertise in Every Micro-Market
              </h2>
            </div>
            <button
              onClick={() => navigate('/projects')}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1 group"
            >
              <span>Explore all neighbourhoods</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Bandra West (Pali Hill & Bandstand)',
                desc: 'Mumbai’s golden mile. Seafront promenades, heritage lanes, high-fashion boutiques, and Bollywood aristocracy.',
                priceAvg: '₹65,000 - ₹1,10,000 / sq.ft.',
                img: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
                areaFilter: 'Bandra West'
              },
              {
                name: 'Bandra East (BKC Financial Gateway)',
                desc: 'Immediate access to Mumbai’s business powerhouse, Jio World Drive, and top international schools.',
                priceAvg: '₹42,000 - ₹68,000 / sq.ft.',
                img: 'https://images.unsplash.com/photo-1515263487990-61b07816b324?auto=format&fit=crop&w=800&q=80',
                areaFilter: 'Bandra East'
              },
              {
                name: 'Juhu & JVPD Scheme',
                desc: 'Quiet coastal aristocracy, wide tree-lined avenues, luxury clubs, and expansive ocean estates.',
                priceAvg: '₹55,000 - ₹95,000 / sq.ft.',
                img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
                areaFilter: 'Juhu'
              },
              {
                name: 'Andheri West (Lokhandwala & Versova)',
                desc: 'Vibrant cultural pulse, premium culinary hotspots, metro intersections, and dynamic residential towers.',
                priceAvg: '₹28,000 - ₹48,000 / sq.ft.',
                img: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
                areaFilter: 'Andheri West'
              },
              {
                name: 'Goregaon & Malad West',
                desc: 'Suburban luxury hubs with Mindspace IT Parks, Inorbit Mall, premium gated communities, and lush green lungs.',
                priceAvg: '₹20,000 - ₹34,000 / sq.ft.',
                img: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=800&q=80',
                areaFilter: 'Goregaon West'
              },
              {
                name: 'Kandivali & Borivali West',
                desc: 'Peaceful, family-centric lifestyle along the Metro Line 2A with prominent Jain Derasars and national park views.',
                priceAvg: '₹17,000 - ₹28,000 / sq.ft.',
                img: 'https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=800&q=80',
                areaFilter: 'Borivali West'
              }
            ].map((market) => (
              <div
                key={market.name}
                onClick={() => handleApplyPreset('area', market.areaFilter)}
                className="group relative rounded-2xl overflow-hidden bg-white border border-stone-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <div className="aspect-[16/9] w-full overflow-hidden bg-stone-100">
                  <img
                    src={market.img}
                    alt={market.name}
                    width={800}
                    height={450}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent" />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-bold px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
                    {market.priceAvg}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-serif-display text-base font-bold text-slate-900 group-hover:text-amber-700 transition-colors">
                    {market.name}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {market.desc}
                  </p>
                  <div className="mt-3 flex items-center gap-1.5 text-xs font-bold text-amber-700">
                    <span>View Residences in this Sector</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. High-Conversion Enquiry CTA - Warm, Bright & Radiant */}
      <section className="py-20 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-white shadow-lg">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-white/20 border border-white/30 text-white flex items-center justify-center mx-auto shadow-sm">
            <Sparkles className="w-7 h-7" />
          </div>
          <h2 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white drop-shadow-xs">
            Planning Your Next Residential Acquisition in Western Mumbai?
          </h2>
          <p className="text-sm sm:text-base text-amber-50 max-w-2xl mx-auto leading-relaxed">
            Schedule a private consultation with our principal advisors. Gain confidential access to off-market penthouses, builder floor allocations, and pre-launch pricing.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onOpenEnquiry()}
              className="px-8 py-3.5 rounded-xl bg-white hover:bg-amber-50 text-slate-950 font-bold text-sm shadow-xl flex items-center gap-2 transition-transform active:scale-95"
            >
              <span>Schedule Advisory Call</span>
              <ArrowRight className="w-4 h-4 text-amber-700" />
            </button>
            <a
              href="https://wa.me/919820198765?text=Hello%20TrustKeys%2C%20I%20am%20exploring%20residential%20properties%20in%20Western%20Mumbai."
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3.5 rounded-xl bg-amber-700/60 hover:bg-amber-700 text-white font-semibold text-sm border border-white/30 backdrop-blur-xs transition-colors"
            >
              WhatsApp Us Instantly
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
