import React, { useState, useEffect } from 'react';
import { SiteSettings } from './types';
import { initialSiteSettings } from './data/seedData';
import { fetchSiteSettings } from './lib/api';

// Components
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { EnquiryModal } from './components/EnquiryModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { ComparePage } from './pages/ComparePage';
import { ResalePage } from './pages/ResalePage';
import { SellPage } from './pages/SellPage';
import { AboutPage } from './pages/AboutPage';
import { VastuPage } from './pages/VastuPage';
import { ContactPage } from './pages/ContactPage';
import { AdminPage } from './pages/AdminPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return window.location.pathname || '/';
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(initialSiteSettings);

  // Global Enquiry Modal
  const [enquiryModalOpen, setEnquiryModalOpen] = useState(false);
  const [enquiryProjectRef, setEnquiryProjectRef] = useState<string | undefined>(undefined);
  const [enquiryDefaultReq, setEnquiryDefaultReq] = useState<string | undefined>(undefined);

  // Load site settings on mount
  useEffect(() => {
    fetchSiteSettings().then(setSiteSettings).catch(console.error);
  }, []);

  // Sync browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Update document title dynamically based on route
  useEffect(() => {
    let title = `${siteSettings.businessName} – Curated Residences in Western Mumbai`;
    if (currentPath === '/projects') {
      title = `Projects Portfolio – ${siteSettings.businessName}`;
    } else if (currentPath.startsWith('/projects/')) {
      const slug = currentPath.replace('/projects/', '');
      const formattedSlug = slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      title = `${formattedSlug} – ${siteSettings.businessName}`;
    } else if (currentPath === '/compare') {
      title = `Compare Residences – ${siteSettings.businessName}`;
    } else if (currentPath === '/resale') {
      title = `Verified Resale Homes – ${siteSettings.businessName}`;
    } else if (currentPath === '/sell') {
      title = `Sell Your Property – ${siteSettings.businessName}`;
    } else if (currentPath === '/about') {
      title = `About Our Advisory – ${siteSettings.businessName}`;
    } else if (currentPath === '/vastu') {
      title = `Vastu Shastra Assessment – ${siteSettings.businessName}`;
    } else if (currentPath === '/contact') {
      title = `Contact Advisory – ${siteSettings.businessName}`;
    } else if (currentPath.startsWith('/admin')) {
      title = `Advisor Portal – ${siteSettings.businessName}`;
    }
    document.title = title;
  }, [currentPath, siteSettings.businessName]);

  const navigate = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEnquiry = (projectTitle?: string, requirement?: string) => {
    setEnquiryProjectRef(projectTitle);
    setEnquiryDefaultReq(requirement || 'General Enquiry');
    setEnquiryModalOpen(true);
  };

  // Route Dispatcher
  const renderRoute = () => {
    // 1. Projects Detail Page: /projects/:slug
    if (currentPath.startsWith('/projects/') && currentPath.length > 10) {
      const slug = currentPath.replace('/projects/', '');
      return (
        <ProjectDetailPage
          slug={slug}
          onNavigateBack={() => navigate('/projects')}
          onSelectProject={(newSlug) => navigate(`/projects/${newSlug}`)}
          onOpenEnquiry={handleOpenEnquiry}
        />
      );
    }

    // 2. Admin Portal: /admin or /admin/leads
    if (currentPath === '/admin' || currentPath.startsWith('/admin/')) {
      const sub = currentPath.includes('/leads') ? 'leads' : 'projects';
      return <AdminPage initialTab={sub} />;
    }

    // 3. Compare Page
    if (currentPath === '/compare') {
      return (
        <ComparePage
          onSelectProject={(slug) => navigate(`/projects/${slug}`)}
          onOpenEnquiry={handleOpenEnquiry}
          navigate={navigate}
        />
      );
    }

    // 4. Resale Page
    if (currentPath === '/resale') {
      return <ResalePage />;
    }

    // 5. Sell Page
    if (currentPath === '/sell') {
      return <SellPage />;
    }

    // 6. About Page
    if (currentPath === '/about') {
      return (
        <AboutPage
          settings={siteSettings}
          onOpenEnquiry={() => handleOpenEnquiry()}
        />
      );
    }

    // 7. Vastu Page
    if (currentPath === '/vastu') {
      return (
        <VastuPage
          onOpenEnquiry={() => handleOpenEnquiry(undefined, 'Vastu Consultation')}
          navigate={navigate}
        />
      );
    }

    // 8. Contact Page
    if (currentPath === '/contact') {
      return <ContactPage settings={siteSettings} />;
    }

    // 9. Projects Catalogue Page
    if (currentPath === '/projects') {
      // Check for search query params
      const searchParams = new URLSearchParams(window.location.search);
      const queryArea = searchParams.get('area') || undefined;
      const queryStatus = searchParams.get('status') || undefined;

      return (
        <ProjectsPage
          onSelectProject={(slug) => navigate(`/projects/${slug}`)}
          onOpenEnquiry={handleOpenEnquiry}
          queryArea={queryArea}
          queryStatus={queryStatus}
        />
      );
    }

    // 10. Default Home Page (/)
    return (
      <HomePage
        onSelectProject={(slug) => navigate(`/projects/${slug}`)}
        onOpenEnquiry={handleOpenEnquiry}
        navigate={navigate}
      />
    );
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/60 text-slate-900 selection:bg-amber-500 selection:text-white">
      {/* Public Navbar (Hidden on Admin pages to preserve dedicated dashboard layout) */}
      {!isAdminRoute && (
        <Navbar
          currentRoute={currentPath}
          navigate={navigate}
          onOpenEnquiry={handleOpenEnquiry}
        />
      )}

      {/* Main Page Body */}
      <main className="flex-1">
        {renderRoute()}
      </main>

      {/* Public Footer */}
      {!isAdminRoute && (
        <Footer
          settings={siteSettings}
          navigate={navigate}
        />
      )}

      {/* Global Interactive Enquiry Modal */}
      <EnquiryModal
        isOpen={enquiryModalOpen}
        onClose={() => setEnquiryModalOpen(false)}
        defaultProjectRef={enquiryProjectRef}
        defaultRequirement={enquiryDefaultReq}
      />
    </div>
  );
}
