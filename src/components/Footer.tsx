import React from 'react';
import { Phone, Mail, MapPin, ShieldCheck, Clock, ExternalLink } from 'lucide-react';
import { SiteSettings } from '../types';
import { BrandLogo } from './BrandLogo';

interface FooterProps {
  settings: SiteSettings;
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, navigate }) => {
  const handleLink = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const westernMumbaiMicroMarkets = [
    'Bandra West',
    'Bandra East (BKC)',
    'Khar West',
    'Santacruz West',
    'Juhu',
    'Vile Parle West',
    'Andheri West',
    'Goregaon West',
    'Malad West',
    'Kandivali West',
    'Borivali West'
  ];

  return (
    <footer className="bg-white text-slate-700 pt-16 pb-12 border-t border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <BrandLogo className="w-12 h-13 shrink-0" />
              <div>
                <span className="block font-serif-display text-2xl font-bold tracking-tight text-slate-900">
                  {settings.businessName}
                </span>
                <span className="block text-[11px] tracking-wider uppercase text-amber-700 font-semibold">
                  Western Mumbai Residential Advisory
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-sm">
              {settings.aboutSummary}
            </p>
            {settings.advisorRera && <div className="p-3.5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>MahaRERA Compliance Mandate</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Principal Advisory Reg: <span className="text-slate-800 font-mono font-medium">{settings.advisorRera}</span>. Every residential development is verified on the official MahaRERA portal.
              </p>
            </div>}
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-serif-display">
              Navigate
            </h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button onClick={() => handleLink('/')} className="hover:text-amber-700 transition-colors">
                  Home Residences
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/projects')} className="hover:text-amber-700 transition-colors">
                  Projects Catalogue
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/resale')} className="hover:text-amber-700 transition-colors">
                  Verified Resale Homes
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/sell')} className="hover:text-amber-700 transition-colors">
                  Sell Your Property
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/compare')} className="hover:text-amber-700 transition-colors">
                  Compare Projects
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/vastu')} className="hover:text-amber-700 transition-colors flex items-center gap-1">
                  <span>Vastu Shastra Tool</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-semibold border border-amber-200">Free</span>
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/about')} className="hover:text-amber-700 transition-colors">
                  About TrustKeys
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('/contact')} className="hover:text-amber-700 transition-colors">
                  Contact Advisory
                </button>
              </li>
            </ul>
          </div>

          {/* Micro Markets */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-serif-display">
              Micro-Markets
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {westernMumbaiMicroMarkets.map((market) => (
                <button
                  key={market}
                  onClick={() => {
                    handleLink(`/projects?area=${encodeURIComponent(market)}`);
                  }}
                  className="px-2.5 py-1 text-xs rounded-lg bg-white hover:bg-amber-50 text-slate-700 hover:text-amber-900 border border-slate-200 shadow-xs transition-colors"
                >
                  {market}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 font-serif-display">
              Advisory Office
            </h4>
            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.address}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-amber-600 shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s+/g, '')}`} className="hover:text-amber-700 font-medium text-slate-800 transition-colors">
                  {settings.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-amber-600 shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-amber-700 font-medium text-slate-800 transition-colors">
                  {settings.email}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{settings.officeHours}</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <span className="block text-xs uppercase font-semibold text-slate-700 mb-2">Connect</span>
              <div className="flex items-center gap-2">
                {settings.socialLinks?.instagram && (
                  <a
                    href={settings.socialLinks.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                    aria-label="Instagram"
                  >
                    IG
                  </a>
                )}
                {settings.socialLinks?.facebook && (
                  <a
                    href={settings.socialLinks.facebook}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                    aria-label="Facebook"
                  >
                    f
                  </a>
                )}
                {settings.socialLinks?.linkedin && (
                  <a
                    href={settings.socialLinks.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                    aria-label="LinkedIn"
                  >
                    IN
                  </a>
                )}
                {settings.socialLinks?.youtube && (
                  <a
                    href={settings.socialLinks.youtube}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 border border-slate-200 transition-colors"
                    aria-label="YouTube"
                  >
                    YT
                  </a>
                )}
                <a
                  href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '')}?text=Hello%20TrustKeys%2C%20I%20would%20like%20to%20enquire%20about%20properties%20in%20Western%20Mumbai.`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1 shadow-xs transition-colors"
                >
                  <span>WhatsApp</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TrustKeys. All rights reserved. Registered Real Estate Consultant, Western Mumbai.</p>
          <div className="flex items-center gap-6">
            <span className="text-slate-400">RERA Disclaimer: MahaRERA project approvals subject to official government gazettes.</span>
            <button onClick={() => handleLink('/admin')} className="text-slate-500 hover:text-amber-800">
              Admin
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
