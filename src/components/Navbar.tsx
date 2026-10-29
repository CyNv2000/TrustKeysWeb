import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Compass, 
  Scale, 
  Menu, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { getCompareList } from '../lib/api';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
  onOpenEnquiry: (projectTitle?: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate, onOpenEnquiry }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [compareCount, setCompareCount] = useState<number>(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const updateCount = () => {
      setCompareCount(getCompareList().length);
    };
    updateCount();
    window.addEventListener('compare_updated', updateCount);
    return () => window.removeEventListener('compare_updated', updateCount);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', route: '/' },
    { label: 'Projects', route: '/projects' },
    { label: 'Resale', route: '/resale' },
    { label: 'Sell Property', route: '/sell' },
    { label: 'About Us', route: '/about' },
    { label: 'Vastu Shastra', route: '/vastu', icon: Compass },
    { label: 'Compare', route: '/compare', badge: compareCount > 0 ? compareCount : undefined, icon: Scale },
    { label: 'Contact', route: '/contact' }
  ];

  const handleNavClick = (route: string) => {
    navigate(route);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className={`sticky top-0 z-40 transition-all duration-200 ${
      scrolled 
        ? 'bg-white/95 backdrop-blur-md shadow-sm text-slate-800 py-3 border-b border-slate-200' 
        : 'bg-white text-slate-800 py-3.5 border-b border-slate-200'
    }`}>
      {/* Top Banner Notice - Light & Warm */}
      <div className="hidden lg:block bg-gradient-to-r from-amber-50 via-white to-amber-50/80 text-amber-950 text-xs py-1.5 px-6 border-b border-amber-200/70">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-amber-800 font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" /> 100% MahaRERA Verified Western Mumbai Portfolio
            </span>
            <span className="text-amber-300">•</span>
            <span className="text-slate-600">Bandra | Khar | Santacruz | Juhu | Andheri | Borivali</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="tel:+919987154120" className="hover:text-amber-700 text-slate-700 transition-colors flex items-center gap-1 font-medium">
              <Phone className="w-3 h-3 text-amber-600" /> +91 99871 54120
            </a>
            <button 
              onClick={() => handleNavClick('/admin')} 
              className="hover:text-amber-800 transition-colors text-slate-500 font-medium"
            >
              Advisor Portal
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <button 
            onClick={() => handleNavClick('/')} 
            className="flex items-center gap-3 text-left group focus:outline-none focus:ring-2 focus:ring-amber-500 rounded-lg p-1"
          >
            <BrandLogo className="w-10 h-11 shrink-0 transition-transform group-hover:scale-[1.03]" />
            <span>
              <span className="block font-serif-display text-xl font-bold tracking-tight text-slate-900 group-hover:text-amber-700 transition-colors">
                TrustKeys
              </span>
              <span className="block text-[10px] tracking-widest uppercase text-slate-600 font-semibold">
                Western Mumbai
              </span>
            </span>
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center space-x-1 lg:space-x-1.5">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route || (link.route !== '/' && currentRoute.startsWith(link.route));
              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`px-3 py-2 rounded-xl text-sm font-medium transition-all relative flex items-center gap-1.5 ${
                    isActive
                      ? 'text-amber-800 bg-amber-50 font-bold border border-amber-200/80 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
                >
                  {link.icon && <link.icon className="w-4 h-4 text-amber-600" />}
                  <span>{link.label}</span>
                  {link.badge !== undefined && (
                    <span className="ml-1 px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-500 text-white shadow-xs">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="tel:+919987154120"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-600" />
              <span>Call Advisory</span>
            </a>
            <button
              onClick={() => onOpenEnquiry()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white transition-all shadow-md shadow-amber-600/25 active:scale-95"
            >
              <span>Enquire Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 xl:hidden">
            {compareCount > 0 && (
              <button
                onClick={() => handleNavClick('/compare')}
                className="relative p-2 rounded-lg text-amber-700 bg-amber-50 border border-amber-200"
                aria-label="View Compare List"
              >
                <Scale className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {compareCount}
                </span>
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = currentRoute === link.route || (link.route !== '/' && currentRoute.startsWith(link.route));
              return (
                <button
                  key={link.route}
                  onClick={() => handleNavClick(link.route)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-amber-50 text-amber-800 font-bold border border-amber-200'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {link.icon && <link.icon className="w-4 h-4 text-amber-600" />}
                    {link.label}
                  </span>
                  {link.badge !== undefined && (
                    <span className="px-2 py-0.5 text-xs font-bold rounded-full bg-amber-500 text-white">
                      {link.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
            <a
              href="tel:+919987154120"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 font-semibold text-sm hover:bg-amber-100"
            >
              <Phone className="w-4 h-4 text-amber-600" />
              <span>Call Advisor: +91 99871 54120</span>
            </a>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenEnquiry();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-sm shadow-md shadow-amber-600/20"
            >
              <span>Instant Property Enquiry</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <div className="pt-2 text-center">
              <button 
                onClick={() => handleNavClick('/admin')} 
                className="text-xs text-slate-500 hover:text-amber-800 underline"
              >
                Advisor Admin Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
