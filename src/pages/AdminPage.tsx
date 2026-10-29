import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Lock, 
  LogOut, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Sparkles, 
  Layers, 
  FileText, 
  Users2, 
  HelpCircle, 
  Settings as SettingsIcon, 
  Key, 
  Upload, 
  Download, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  MessageSquare, 
  Phone, 
  Mail, 
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  Project, 
  ProjectConfiguration, 
  FloorPlanItem, 
  Enquiry, 
  SellLead, 
  FAQ, 
  SiteSettings 
} from '../types';
import { 
  adminLogin, 
  getAdminToken, 
  clearAdminToken, 
  fetchProjects, 
  adminCreateProject, 
  adminUpdateProject, 
  adminDeleteProject, 
  adminGetEnquiries, 
  adminUpdateEnquiryStatus, 
  adminDeleteEnquiry, 
  adminGetSellLeads, 
  adminUpdateSellLeadStatus, 
  adminDeleteSellLead, 
  fetchFAQs, 
  adminCreateFAQ, 
  adminUpdateFAQ, 
  adminDeleteFAQ, 
  fetchSiteSettings, 
  adminUpdateSettings, 
  adminChangePassword,
  adminUploadFile
} from '../lib/api';

interface AdminPageProps {
  initialTab?: string;
  onLogoutSuccess?: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ initialTab = 'projects' }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getAdminToken());
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'projects' | 'leads' | 'faqs' | 'settings' | 'security'>(
    (initialTab as any) || 'projects'
  );

  // Notification banners
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const showBanner = (msg: string, isErr = false) => {
    if (isErr) {
      setActionError(msg);
      setTimeout(() => setActionError(null), 4000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  // --- PROJECTS TAB STATE ---
  const [projectsList, setProjectsList] = useState<Project[]>([]);
  const [projectsSearch, setProjectsSearch] = useState('');
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [projectSaving, setProjectSaving] = useState(false);
  const [deleteConfirmProject, setDeleteConfirmProject] = useState<Project | null>(null);
  const [floorPlanTitle, setFloorPlanTitle] = useState('');
  const [floorPlanType, setFloorPlanType] = useState('2 BHK');

  // Upload progress simulation
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  // --- LEADS TAB STATE ---
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [sellLeads, setSellLeads] = useState<SellLead[]>([]);
  const [leadsSubTab, setLeadsSubTab] = useState<'enquiries' | 'sell-leads'>('enquiries');
  const [leadsSearch, setLeadsSearch] = useState('');
  const [leadsLoading, setLeadsLoading] = useState(false);

  // --- FAQS TAB STATE ---
  const [faqsList, setFaqsList] = useState<FAQ[]>([]);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQ> | null>(null);

  // --- SETTINGS TAB STATE ---
  const [settingsForm, setSettingsForm] = useState<SiteSettings | null>(null);
  const [settingsSaving, setSettingsSaving] = useState(false);

  // --- SECURITY TAB STATE ---
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);

  // Check auth and initial loads
  useEffect(() => {
    if (isAuthenticated) {
      loadProjects();
      loadLeads();
      loadFaqs();
      loadSettings();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleSessionExpired = () => {
      setIsAuthenticated(false);
      setEditingProject(null);
      setIsCreatingNew(false);
      setLoginError('Your admin session expired. Please log in again.');
    };
    window.addEventListener('trustkeys:admin-session-expired', handleSessionExpired);
    return () => window.removeEventListener('trustkeys:admin-session-expired', handleSessionExpired);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLoggingIn(true);

    try {
      await adminLogin(passwordInput);
      setIsAuthenticated(true);
      setIsLoggingIn(false);
      showBanner('Welcome to TrustKeys Advisor Management Portal');
    } catch (err: any) {
      setLoginError(err.message || 'Authentication failed. Please verify password.');
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setIsAuthenticated(false);
    setPasswordInput('');
  };

  // --- Data Loaders ---
  const loadProjects = async () => {
    setProjectsLoading(true);
    try {
      const res = await fetchProjects({ limit: 100, includeUnpublished: true });
      setProjectsList(res.projects);
    } catch {
      showBanner('Failed to refresh residences list', true);
    } finally {
      setProjectsLoading(false);
    }
  };

  const loadLeads = async () => {
    setLeadsLoading(true);
    try {
      const [enqs, sells] = await Promise.all([
        adminGetEnquiries().catch(() => []),
        adminGetSellLeads().catch(() => [])
      ]);
      setEnquiries(enqs);
      setSellLeads(sells);
    } catch {
      showBanner('Failed to load inquiries and leads', true);
    } finally {
      setLeadsLoading(false);
    }
  };

  const loadFaqs = async () => {
    try {
      const res = await fetchFAQs(true);
      setFaqsList(res);
    } catch {
      // ignore
    }
  };

  const loadSettings = async () => {
    try {
      const s = await fetchSiteSettings();
      setSettingsForm(s);
    } catch {
      // ignore
    }
  };

  // --- Project CRUD Actions ---
  const handleStartCreateProject = () => {
    setFloorPlanTitle('');
    setFloorPlanType('2 BHK');
    setEditingProject({
      title: '',
      slug: '',
      area: 'Bandra West',
      address: '',
      category: 'Luxury Apartments',
      status: 'Ongoing',
      configuration: ['2 BHK', '3 BHK'],
      configurations: [
        {
          id: `cfg-${Date.now()}-1`,
          type: '2 BHK Premium',
          carpetArea: 850,
          price: 32000000,
          priceFormatted: '₹3.20 Cr',
          balcony: '1 Sundeck',
          features: ['East Facing', 'Vastu Friendly']
        }
      ],
      startingPrice: 32000000,
      startingPriceFormatted: '₹3.20 Cr',
      carpetArea: '850 - 1,450 sq.ft.',
      minArea: 850,
      maxArea: 1450,
      possession: 'December 2026',
      possessionDate: '2026-12-31',
      amenities: ['Infinity Swimming Pool', 'Gymnasium', 'EV Charging', '24/7 Security'],
      parking: '1 to 2 Covered Stilt',
      balcony: 'Expansive Sundecks',
      totalFloors: 24,
      vastuNotes: 'Ishanya (North-East) entrance with open East balcony ventilation.',
      description: '',
      images: [],
      googleMapsUrl: '',
      reraNumber: 'P51800045000',
      floorPlans: [],
      featured: false,
      published: true
    });
    setIsCreatingNew(true);
  };

  const handleSaveProject = async () => {
    if (!editingProject) return;

    if (!editingProject.title || !editingProject.area || !editingProject.startingPrice) {
      showBanner('Please fill in required fields: Residence Title, Area, and Starting Price.', true);
      return;
    }

    setProjectSaving(true);

    try {
      // Calculate formatted starting price if not present
      if (!editingProject.startingPriceFormatted && editingProject.startingPrice) {
        editingProject.startingPriceFormatted = `₹${(editingProject.startingPrice / 10000000).toFixed(2)} Cr`;
      }

      if (isCreatingNew) {
        await adminCreateProject(editingProject);
        showBanner('New residence created and published successfully!');
      } else if (editingProject.id) {
        await adminUpdateProject(editingProject.id, editingProject);
        showBanner('Residence details updated successfully!');
      }

      setEditingProject(null);
      setIsCreatingNew(false);
      await loadProjects();
    } catch (err: any) {
      showBanner(err.message || 'Failed to save residence', true);
    } finally {
      setProjectSaving(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    try {
      await adminDeleteProject(id);
      showBanner('Residence deleted successfully');
      setDeleteConfirmProject(null);
      await loadProjects();
    } catch (err: any) {
      showBanner(err.message || 'Failed to delete residence', true);
    }
  };

  const handleTogglePublish = async (p: Project) => {
    try {
      await adminUpdateProject(p.id, { published: !p.published });
      showBanner(`Residence ${p.published ? 'unpublished' : 'published'}`);
      await loadProjects();
    } catch {
      showBanner('Failed to update status', true);
    }
  };

  const handleToggleFeature = async (p: Project) => {
    try {
      await adminUpdateProject(p.id, { featured: !p.featured });
      showBanner(`Residence featured status updated`);
      await loadProjects();
    } catch {
      showBanner('Failed to update feature state', true);
    }
  };

  const uploadProjectAsset = async (file: File): Promise<string> => {
    if (file.size > 10 * 1024 * 1024) throw new Error('File exceeds 10MB limit');
    setUploadProgress(10);
    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = () => reject(new Error('Could not read the selected file'));
        reader.readAsDataURL(file);
      });
      setUploadProgress(45);
      const res = await adminUploadFile(base64Data, file.name, file.type);
      setUploadProgress(100);
      return res.url;
    } finally {
      setTimeout(() => setUploadProgress(null), 1000);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    e.target.value = '';
    if (files.length === 0 || !editingProject) return;

    const uploadedImages: string[] = [];
    const errors: string[] = [];
    for (const file of files) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        errors.push(`${file.name}: choose a JPG, PNG, or WebP image`);
        continue;
      }
      try {
        uploadedImages.push(await uploadProjectAsset(file));
      } catch (err: any) {
        errors.push(`${file.name}: ${err.message || 'upload failed'}`);
      }
    }

    if (uploadedImages.length > 0) {
      setEditingProject(project => project ? { ...project, images: [...(project.images || []), ...uploadedImages] } : project);
      showBanner(`${uploadedImages.length} project photo${uploadedImages.length === 1 ? '' : 's'} uploaded`);
    }
    if (errors.length > 0) showBanner(errors.join('. '), true);
  };

  const handleFloorPlanUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editingProject) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(file.type)) {
      showBanner('Choose an image or PDF file for a floor plan', true);
      return;
    }
    try {
      const url = await uploadProjectAsset(file);
      const title = floorPlanTitle.trim() || file.name.replace(/\.[^.]+$/, '');
      const plan: FloorPlanItem = {
        id: `floor-plan-${Date.now()}`,
        title,
        type: floorPlanType.trim() || 'Floor Plan',
        image: url
      };
      setEditingProject(project => project ? { ...project, floorPlans: [...(project.floorPlans || []), plan] } : project);
      setFloorPlanTitle('');
      showBanner('Floor plan uploaded');
    } catch (err: any) {
      showBanner(err.message || 'Floor plan upload failed', true);
    }
  };

  const handleBrochureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !editingProject) return;
    if (file.type !== 'application/pdf') {
      showBanner('Choose a PDF file for the brochure', true);
      return;
    }
    try {
      const url = await uploadProjectAsset(file);
      setEditingProject(project => project ? { ...project, brochureUrl: url } : project);
      showBanner('Brochure uploaded');
    } catch (err: any) {
      showBanner(err.message || 'Brochure upload failed', true);
    }
  };

  // CSV Export for Leads
  const handleExportCSV = () => {
    if (leadsSubTab === 'enquiries') {
      const headers = ['ID', 'Date', 'Name', 'Mobile', 'Email', 'Requirement', 'Project', 'Status', 'Message'];
      const rows = enquiries.map(e => [
        e.id,
        new Date(e.createdAt).toLocaleDateString('en-IN'),
        `"${e.name}"`,
        e.mobile,
        e.email,
        `"${e.requirement}"`,
        `"${e.projectRef || 'General'}"`,
        e.status,
        `"${(e.message || '').replace(/"/g, '""')}"`
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `trustkeys_enquiries_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      const headers = ['ID', 'Date', 'Name', 'Mobile', 'Email', 'Location', 'Category', 'Config', 'Carpet SqFt', 'Expected Price', 'Status', 'Notes'];
      const rows = sellLeads.map(l => [
        l.id,
        new Date(l.createdAt).toLocaleDateString('en-IN'),
        `"${l.name}"`,
        l.mobile,
        l.email,
        `"${l.location}"`,
        l.category,
        l.configuration,
        l.carpetArea,
        `"${l.expectedPrice}"`,
        l.status,
        `"${(l.extraDetails || '').replace(/"/g, '""')}"`
      ]);
      const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `trustkeys_seller_leads_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // --- Password Change ---
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      showBanner('Password must be at least 6 characters long.', true);
      return;
    }
    if (newPassword !== confirmPassword) {
      showBanner('Passwords do not match.', true);
      return;
    }

    setChangingPassword(true);
    try {
      await adminChangePassword(newPassword);
      showBanner('Admin password updated successfully!');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      showBanner(err.message || 'Failed to update password', true);
    } finally {
      setChangingPassword(false);
    }
  };

  // --- Settings Save ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settingsForm) return;

    setSettingsSaving(true);
    try {
      await adminUpdateSettings(settingsForm);
      showBanner('Site settings & business info updated successfully!');
    } catch (err: any) {
      showBanner(err.message || 'Failed to save settings', true);
    } finally {
      setSettingsSaving(false);
    }
  };

  // --------------------------------------------------------------------------
  // RENDER: LOGIN VIEW (if unauthenticated)
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50/80 via-white to-amber-100/50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200/90 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl text-slate-900 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-300 shadow-sm">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif-display text-2xl font-bold text-slate-950">
              Advisor Portal Access
            </h1>
            <p className="text-xs text-slate-600">
              TrustKeys management & leads administration console.
            </p>
          </div>

          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-800">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-700 mb-1">
                Admin Passkey
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Key className="w-4 h-4" />
                  <span>Authenticate Session</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // RENDER: AUTHENTICATED ADMIN DASHBOARD
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 pb-16">
      
      {/* Admin Top Header - Clean, Crisp & Bright */}
      <header className="bg-white text-slate-900 border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-400 text-white flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="font-serif-display font-bold text-base text-slate-900">TrustKeys</span>
              <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-mono ml-2 uppercase font-bold">Advisor Console</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-slate-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleLogout}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-200"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 overflow-x-auto border-t border-slate-100 pt-1.5 pb-1.5">
          {[
            { id: 'projects', label: 'Residences Portfolio', icon: Building2, count: projectsList.length },
            { id: 'leads', label: 'Buyer & Seller Leads', icon: Users2, count: enquiries.length + sellLeads.length },
            { id: 'faqs', label: 'FAQs Management', icon: HelpCircle, count: faqsList.length },
            { id: 'settings', label: 'Business & Advisor Info', icon: SettingsIcon },
            { id: 'security', label: 'Security & Password', icon: Key }
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setEditingProject(null);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-100/80 text-amber-950 border border-amber-300 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                    isActive ? 'bg-amber-600 text-white' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </header>

      {/* Global Toast Banners */}
      {actionSuccess && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 animate-in slide-in-from-top-2">
          <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>{actionSuccess}</span>
          </div>
        </div>
      )}

      {actionError && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 animate-in slide-in-from-top-2">
          <div className="p-3 bg-red-100 border border-red-300 text-red-900 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm">
            <AlertCircle className="w-4 h-4 text-red-700 shrink-0" />
            <span>{actionError}</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* ========================================================================= */}
        {/* TAB 1: PROJECTS PORTFOLIO */}
        {/* ========================================================================= */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            
            {/* Project List Top Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={projectsSearch}
                    onChange={(e) => setProjectsSearch(e.target.value)}
                    placeholder="Search residences by title, area, or RERA ID..."
                    className="pl-9 pr-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 w-64 sm:w-80"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={loadProjects}
                  className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs transition-colors"
                  title="Reload list"
                >
                  Refresh
                </button>
                <button
                  onClick={handleStartCreateProject}
                  className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Add New Residence</span>
                </button>
              </div>
            </div>

            {/* Project Editor Modal / Drawer */}
            {editingProject && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-500/40 shadow-xl space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                  <div>
                    <h2 className="font-serif-display text-xl font-bold text-stone-900">
                      {isCreatingNew ? 'Create New Western Mumbai Residence' : `Edit: ${editingProject.title}`}
                    </h2>
                    <p className="text-xs text-stone-500">
                      Configure status, multi-configurations, pricing, media, floor plans, and Vastu orientation.
                    </p>
                  </div>
                  <button
                    onClick={() => setEditingProject(null)}
                    className="p-2 rounded-full hover:bg-stone-100 text-stone-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                  
                  {/* Basic Details */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] border-b border-stone-100 pb-1">
                      1. Property Identity & Location
                    </h3>
                    
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Residence Title *</label>
                      <input
                        type="text"
                        required
                        value={editingProject.title || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                        placeholder="e.g. The Pali Crest Residences"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">URL Slug</label>
                      <input
                        type="text"
                        value={editingProject.slug || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value })}
                        placeholder="auto-generated-if-empty"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Locality / Micro-Market *</label>
                      <select
                        value={editingProject.area || 'Bandra West'}
                        onChange={(e) => setEditingProject({ ...editingProject, area: e.target.value })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      >
                        <option value="Bandra West">Bandra West</option>
                        <option value="Bandra East">Bandra East</option>
                        <option value="Khar West">Khar West</option>
                        <option value="Santacruz West">Santacruz West</option>
                        <option value="Juhu">Juhu</option>
                        <option value="Vile Parle">Vile Parle</option>
                        <option value="Andheri West">Andheri West</option>
                        <option value="Goregaon West">Goregaon West</option>
                        <option value="Malad West">Malad West</option>
                        <option value="Kandivali West">Kandivali West</option>
                        <option value="Borivali West">Borivali West</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Full Address *</label>
                      <textarea
                        rows={2}
                        value={editingProject.address || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, address: e.target.value })}
                        placeholder="e.g. Pali Hill, Nargis Dutt Road, Bandra West, Mumbai 400050"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Google Maps Link</label>
                      <input
                        type="url"
                        value={editingProject.googleMapsUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, googleMapsUrl: e.target.value })}
                        placeholder="Paste this project's Google Maps link"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Amenities</label>
                      <textarea
                        rows={5}
                        value={(editingProject.amenities || []).join('\n')}
                        onChange={(e) => setEditingProject({
                          ...editingProject,
                          amenities: e.target.value.split('\n').map(item => item.trim()).filter(Boolean)
                        })}
                        placeholder="Add one amenity per line, for example:\nSwimming pool\nGymnasium\nChildren's play area"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      />
                      <p className="text-[10px] text-stone-500 mt-1">One amenity per line. Leave a line blank to remove it.</p>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Description</label>
                      <textarea
                        rows={5}
                        value={editingProject.description || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        placeholder="Describe the project, location, design, and key benefits."
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs leading-relaxed"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Project Parking Type</label>
                      <input
                        type="text"
                        value={editingProject.parking || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, parking: e.target.value })}
                        placeholder="e.g. Covered podium parking"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      />
                      <p className="text-[10px] text-stone-500 mt-1">Set once for the building; it applies to every unit configuration.</p>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">MahaRERA Number</label>
                      <input
                        type="text"
                        value={editingProject.reraNumber || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, reraNumber: e.target.value })}
                        placeholder="e.g. P51800031890"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Pricing, Stage & Specs */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] border-b border-stone-100 pb-1">
                      2. Pricing & Timelines
                    </h3>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Status / Project Stage *</label>
                      <select
                        value={editingProject.status || 'Ongoing'}
                        onChange={(e) => setEditingProject({ ...editingProject, status: e.target.value as any })}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      >
                        <option value="Ready">Ready to Move</option>
                        <option value="Ongoing">Under Construction</option>
                        <option value="Upcoming">New Launch / Upcoming</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Starting Price (in INR) *</label>
                      <input
                        type="number"
                        required
                        value={editingProject.startingPrice || ''}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setEditingProject({
                            ...editingProject,
                            startingPrice: val,
                            startingPriceFormatted: `₹${(val / 10000000).toFixed(2)} Cr`
                          });
                        }}
                        placeholder="e.g. 45000000"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Display Starting Price</label>
                      <input
                        type="text"
                        value={editingProject.startingPriceFormatted || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, startingPriceFormatted: e.target.value })}
                        placeholder="e.g. ₹4.50 Cr"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Carpet Display</label>
                        <input
                          type="text"
                          value={editingProject.carpetArea || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, carpetArea: e.target.value })}
                          placeholder="e.g. 950 - 1,850 sq.ft."
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="block font-semibold text-stone-700 mb-1">Possession Date</label>
                        <input
                          type="text"
                          value={editingProject.possession || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, possession: e.target.value })}
                          placeholder="e.g. Dec 2026 or Ready"
                          className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">YouTube Walkthrough URL</label>
                      <input
                        type="url"
                        value={editingProject.youtubeUrl || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, youtubeUrl: e.target.value })}
                        placeholder="e.g. https://www.youtube.com/watch?v=..."
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Media & Publication */}
                  <div className="space-y-4">
                    <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] border-b border-stone-100 pb-1">
                      3. Media & Publication
                    </h3>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Upload Project Photo</label>
                      <div className="relative border-2 border-dashed border-stone-300 rounded-xl p-3 text-center bg-stone-50 hover:bg-stone-100 cursor-pointer">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          multiple
                          onChange={handleImageUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className="w-5 h-5 text-stone-400 mx-auto mb-1" />
                        <span className="text-[11px] text-stone-600 block">Click to upload a project photo (&lt;10MB)</span>
                      </div>
                      {uploadProgress !== null && (
                        <div className="mt-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                          <div style={{ width: `${uploadProgress}%` }} className="h-full bg-amber-500 transition-all" />
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-stone-200 space-y-2">
                      <label className="block font-semibold text-stone-700">Floor Plans</label>
                      <input
                        type="text"
                        value={floorPlanTitle}
                        onChange={(e) => setFloorPlanTitle(e.target.value)}
                        placeholder="Plan title (optional; defaults to filename)"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      />
                      <select
                        value={floorPlanType}
                        onChange={(e) => setFloorPlanType(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs"
                      >
                        {(editingProject.configuration?.length ? editingProject.configuration : ['Floor Plan']).map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      <div className="relative border-2 border-dashed border-stone-300 rounded-xl p-3 text-center bg-stone-50 hover:bg-stone-100 cursor-pointer">
                        <input
                          type="file"
                          accept="image/jpeg,image/png,image/webp,application/pdf,.pdf"
                          onChange={handleFloorPlanUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className="w-5 h-5 text-stone-400 mx-auto mb-1" />
                        <span className="text-[11px] text-stone-600 block">Upload a floor plan image or PDF (&lt;10MB)</span>
                      </div>
                      {editingProject.floorPlans?.map((plan, index) => (
                        <div key={plan.id} className="flex items-center justify-between gap-2 rounded-lg bg-stone-50 border border-stone-200 px-3 py-2">
                          <span className="min-w-0 truncate text-[11px] text-stone-700">{plan.title} · {plan.type}</span>
                          <button
                            type="button"
                            onClick={() => setEditingProject(project => project ? { ...project, floorPlans: (project.floorPlans || []).filter((_, i) => i !== index) } : project)}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            aria-label={`Remove ${plan.title}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-stone-200 space-y-2">
                      <label className="block font-semibold text-stone-700">Project Brochure (PDF)</label>
                      <div className="relative border-2 border-dashed border-stone-300 rounded-xl p-3 text-center bg-stone-50 hover:bg-stone-100 cursor-pointer">
                        <input
                          type="file"
                          accept="application/pdf,.pdf"
                          onChange={handleBrochureUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                        <Upload className="w-5 h-5 text-stone-400 mx-auto mb-1" />
                        <span className="text-[11px] text-stone-600 block">Upload brochure PDF (&lt;10MB)</span>
                      </div>
                      {editingProject.brochureUrl && editingProject.brochureUrl !== '#download-brochure' && (
                        <div className="flex items-center justify-between gap-2 rounded-lg bg-stone-50 border border-stone-200 px-3 py-2">
                          <a href={editingProject.brochureUrl} target="_blank" rel="noreferrer" className="min-w-0 truncate text-[11px] text-amber-800 underline">Current brochure</a>
                          <button
                            type="button"
                            onClick={() => setEditingProject({ ...editingProject, brochureUrl: undefined })}
                            className="p-1 text-red-600 hover:bg-red-50 rounded"
                            aria-label="Remove brochure"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Image URLs (comma separated)</label>
                      <textarea
                        rows={3}
                        value={(editingProject.images || []).join('\n')}
                        onChange={(e) => setEditingProject({
                          ...editingProject,
                          images: e.target.value.split('\n').map(s => s.trim()).filter(Boolean)
                        })}
                        placeholder="Paste image URLs (one per line)"
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs font-mono"
                      />
                    </div>

                    {(editingProject.images || []).length > 0 && (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {(editingProject.images || []).map((image, index) => (
                          <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-lg border border-stone-200 bg-stone-100">
                            <img src={image} alt={`Project photo ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => setEditingProject(project => project ? { ...project, images: (project.images || []).filter((_, imageIndex) => imageIndex !== index) } : project)}
                              className="absolute top-1 right-1 rounded-md bg-white/95 p-1 text-red-600 shadow hover:bg-red-50"
                              aria-label={`Remove project photo ${index + 1}`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="pt-2 space-y-2">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.published ?? true}
                          onChange={(e) => setEditingProject({ ...editingProject, published: e.target.checked })}
                          className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                        />
                        <span className="font-bold text-stone-800">Published on Live Website</span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingProject.featured ?? false}
                          onChange={(e) => setEditingProject({ ...editingProject, featured: e.target.checked })}
                          className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                        />
                        <span className="font-bold text-amber-800">Featured in Hero / Top Picks</span>
                      </label>
                    </div>
                  </div>

                </div>

                {/* Multiple Unit Configurations Manager */}
                <div className="pt-4 border-t border-stone-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-stone-900 uppercase tracking-wider text-[11px]">
                      Unit Configurations ({editingProject.configurations?.length || 0})
                    </h3>
                    <button
                      type="button"
                      onClick={() => {
                        const newCfg: ProjectConfiguration = {
                          id: `cfg-${Date.now()}`,
                          type: '3 BHK Grande',
                          carpetArea: 1250,
                          price: 48000000,
                          priceFormatted: '₹4.80 Cr',
                          balcony: '2 Sundecks',
                          features: ['East Facing', 'Vastu Compliant']
                        };
                        setEditingProject({
                          ...editingProject,
                          configurations: [...(editingProject.configurations || []), newCfg]
                        });
                      }}
                      className="px-3 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Configuration</span>
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingProject.configurations?.map((cfg, idx) => (
                      <div key={cfg.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xl grid grid-cols-1 sm:grid-cols-5 gap-2 items-center text-xs">
                        <div className="sm:col-span-2">
                          <input
                            type="text"
                            value={cfg.type}
                            onChange={(e) => {
                              const updated = [...(editingProject.configurations || [])];
                              updated[idx].type = e.target.value;
                              setEditingProject({ ...editingProject, configurations: updated });
                            }}
                            placeholder="Unit Type (e.g. 3 BHK Luxe)"
                            className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <input
                            type="number"
                            value={cfg.carpetArea}
                            onChange={(e) => {
                              const updated = [...(editingProject.configurations || [])];
                              updated[idx].carpetArea = Number(e.target.value);
                              setEditingProject({ ...editingProject, configurations: updated });
                            }}
                            placeholder="Carpet SqFt"
                            className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded text-xs"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={cfg.priceFormatted}
                            onChange={(e) => {
                              const updated = [...(editingProject.configurations || [])];
                              updated[idx].priceFormatted = e.target.value;
                              setEditingProject({ ...editingProject, configurations: updated });
                            }}
                            placeholder="₹ Price"
                            className="w-full px-2 py-1.5 bg-white border border-stone-300 rounded text-xs font-mono"
                          />
                        </div>
                        <div className="text-right">
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingProject.configurations || []).filter((_, i) => i !== idx);
                              setEditingProject({ ...editingProject, configurations: updated });
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                            title="Remove configuration"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Save & Cancel Row */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-5 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={projectSaving}
                    onClick={handleSaveProject}
                    className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md shadow-amber-900/20 disabled:opacity-50"
                  >
                    {projectSaving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Save Residence</span>
                      </>
                    )}
                  </button>
                </div>

              </div>
            )}

            {/* Residences Table View */}
            <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
                      <th className="py-3.5 px-4">Property</th>
                      <th className="py-3.5 px-4">Area</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Pricing</th>
                      <th className="py-3.5 px-4">MahaRERA</th>
                      <th className="py-3.5 px-4 text-center">Live</th>
                      <th className="py-3.5 px-4 text-center">Featured</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {projectsList
                      .filter(p => {
                        if (!projectsSearch.trim()) return true;
                        const q = projectsSearch.toLowerCase();
                        return p.title.toLowerCase().includes(q) || p.area.toLowerCase().includes(q) || p.reraNumber.toLowerCase().includes(q);
                      })
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.images[0]}
                                alt={p.title}
                                width={48}
                                height={36}
                                className="w-12 h-9 rounded-lg object-cover border border-stone-200 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-stone-900 block">{p.title}</span>
                                <span className="text-[11px] text-stone-500">{p.configuration.join(', ')}</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-stone-800">
                            {p.area}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              p.status === 'Ready'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'Ongoing'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-sky-100 text-sky-800'
                            }`}>
                              {p.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-bold text-amber-900">
                            {p.startingPriceFormatted}
                          </td>
                          <td className="py-3 px-4 font-mono text-[11px] text-stone-600">
                            {p.reraNumber || '—'}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleTogglePublish(p)}
                              className={`p-1.5 rounded-lg text-xs font-semibold transition-colors ${
                                p.published ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                              }`}
                              title={p.published ? 'Click to unpublish' : 'Click to publish'}
                            >
                              {p.published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => handleToggleFeature(p)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                p.featured ? 'text-amber-500 bg-amber-50' : 'text-stone-300 hover:text-stone-500'
                              }`}
                              title="Toggle featured status"
                            >
                              <Sparkles className="w-4 h-4" />
                            </button>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setEditingProject({ ...p });
                                  setFloorPlanTitle('');
                                  setFloorPlanType(p.configuration?.[0] || 'Floor Plan');
                                  setIsCreatingNew(false);
                                  window.scrollTo({ top: 180, behavior: 'smooth' });
                                }}
                                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg"
                                title="Edit residence"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmProject(p)}
                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg"
                                title="Delete residence"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteConfirmProject && (
              <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full space-y-4 border border-stone-200 shadow-2xl">
                  <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                    <Trash2 className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <h3 className="font-serif-display text-lg font-bold text-stone-900">
                      Delete Residence?
                    </h3>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                      Are you sure you want to permanently delete <strong>{deleteConfirmProject.title}</strong>? This action cannot be undone.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => setDeleteConfirmProject(null)}
                      className="w-1/2 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleDeleteProject(deleteConfirmProject.id)}
                      className="w-1/2 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold"
                    >
                      Yes, Delete
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BUYER ENQUIRIES & SELLER LEADS */}
        {/* ========================================================================= */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            
            {/* Leads Sub-navigation & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setLeadsSubTab('enquiries')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    leadsSubTab === 'enquiries'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  Buyer Enquiries ({enquiries.length})
                </button>
                <button
                  onClick={() => setLeadsSubTab('sell-leads')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    leadsSubTab === 'sell-leads'
                      ? 'bg-stone-900 text-white'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  Seller Listings & Leads ({sellLeads.length})
                </button>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={leadsSearch}
                  onChange={(e) => setLeadsSearch(e.target.value)}
                  placeholder="Search by customer name, phone, or email..."
                  className="px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 w-64 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <button
                  onClick={handleExportCSV}
                  className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Buyer Enquiries Table */}
            {leadsSubTab === 'enquiries' ? (
              <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Client Contact</th>
                        <th className="py-3.5 px-4">Requirement</th>
                        <th className="py-3.5 px-4">Project Ref</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Quick Connect</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {enquiries
                        .filter(e => {
                          if (!leadsSearch.trim()) return true;
                          const q = leadsSearch.toLowerCase();
                          return e.name.toLowerCase().includes(q) || e.mobile.includes(q) || e.email.toLowerCase().includes(q);
                        })
                        .map((enq) => (
                          <tr key={enq.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                              {new Date(enq.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-stone-900">{enq.name}</div>
                              <div className="font-mono text-stone-600 text-[11px]">{enq.mobile}</div>
                              <div className="text-stone-500 text-[11px]">{enq.email}</div>
                            </td>
                            <td className="py-3.5 px-4 max-w-xs">
                              <span className="font-semibold text-stone-800 block">{enq.requirement}</span>
                              {enq.message && (
                                <p className="text-[11px] text-stone-500 truncate" title={enq.message}>
                                  {enq.message}
                                </p>
                              )}
                            </td>
                            <td className="py-3.5 px-4 font-medium text-amber-900">
                              {enq.projectRef || 'General Inquiry'}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={enq.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value as any;
                                  await adminUpdateEnquiryStatus(enq.id, newStatus);
                                  await loadLeads();
                                  showBanner(`Status updated to ${newStatus}`);
                                }}
                                className={`px-2 py-1 rounded text-xs font-bold border ${
                                  enq.status === 'New'
                                    ? 'bg-amber-100 text-amber-900 border-amber-300'
                                    : enq.status === 'Contacted'
                                    ? 'bg-blue-100 text-blue-900 border-blue-300'
                                    : enq.status === 'Site Visit Scheduled'
                                    ? 'bg-purple-100 text-purple-900 border-purple-300'
                                    : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                                }`}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="Site Visit Scheduled">Site Visit Scheduled</option>
                                <option value="Closed">Closed</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <a
                                  href={`https://wa.me/${enq.mobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(enq.name)}%2C%20thank%20you%20for%20contacting%20TrustKeys%20regarding%20${encodeURIComponent(enq.projectRef || 'Western Mumbai properties')}.`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                  title="WhatsApp client"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </a>
                                <a
                                  href={`tel:${enq.mobile}`}
                                  className="p-1.5 rounded-lg bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200"
                                  title="Call client"
                                >
                                  <Phone className="w-4 h-4" />
                                </a>
                                <button
                                  onClick={async () => {
                                    if (confirm('Delete this inquiry?')) {
                                      await adminDeleteEnquiry(enq.id);
                                      await loadLeads();
                                      showBanner('Inquiry deleted');
                                    }
                                  }}
                                  className="p-1.5 text-stone-400 hover:text-red-600 rounded"
                                  title="Delete lead"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              /* Seller Leads Table */
              <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Seller Contact</th>
                        <th className="py-3.5 px-4">Location & Building</th>
                        <th className="py-3.5 px-4">Config & Area</th>
                        <th className="py-3.5 px-4">Expected Price</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {sellLeads
                        .filter(l => {
                          if (!leadsSearch.trim()) return true;
                          const q = leadsSearch.toLowerCase();
                          return l.name.toLowerCase().includes(q) || l.location.toLowerCase().includes(q) || l.mobile.includes(q);
                        })
                        .map((lead) => (
                          <tr key={lead.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="py-3.5 px-4 text-stone-500 whitespace-nowrap">
                              {new Date(lead.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short'
                              })}
                            </td>
                            <td className="py-3.5 px-4">
                              <div className="font-bold text-stone-900">{lead.name}</div>
                              <div className="font-mono text-stone-600 text-[11px]">{lead.mobile}</div>
                              <div className="text-stone-500 text-[11px]">{lead.email}</div>
                            </td>
                            <td className="py-3.5 px-4 max-w-xs">
                              <span className="font-semibold text-stone-800 block">{lead.location}</span>
                              <span className="text-[11px] text-stone-500">{lead.propertyStatus}</span>
                            </td>
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-stone-900 block">{lead.configuration}</span>
                              <span className="text-stone-600 font-mono text-[11px]">{lead.carpetArea} sq.ft.</span>
                            </td>
                            <td className="py-3.5 px-4 font-mono font-bold text-amber-900">
                              {lead.expectedPrice}
                            </td>
                            <td className="py-3.5 px-4">
                              <select
                                value={lead.status}
                                onChange={async (e) => {
                                  const newStatus = e.target.value as any;
                                  await adminUpdateSellLeadStatus(lead.id, newStatus);
                                  await loadLeads();
                                  showBanner(`Lead status updated to ${newStatus}`);
                                }}
                                className="px-2 py-1 rounded text-xs font-bold border bg-stone-100 text-stone-800 border-stone-300"
                              >
                                <option value="Pending Review">Pending Review</option>
                                <option value="Under Evaluation">Under Evaluation</option>
                                <option value="Listed">Listed</option>
                                <option value="Completed">Completed</option>
                              </select>
                            </td>
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <a
                                  href={`https://wa.me/${lead.mobile.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(lead.name)}%2C%20thank%20you%20for%20registering%20your%20property%20at%20${encodeURIComponent(lead.location)}%20with%20TrustKeys.`}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                                >
                                  <MessageSquare className="w-4 h-4" />
                                </a>
                                <button
                                  onClick={async () => {
                                    if (confirm('Delete this seller lead?')) {
                                      await adminDeleteSellLead(lead.id);
                                      await loadLeads();
                                      showBanner('Seller lead removed');
                                    }
                                  }}
                                  className="p-1.5 text-stone-400 hover:text-red-600 rounded"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FAQS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-stone-200">
              <div>
                <h2 className="font-serif-display text-lg font-bold text-stone-900">
                  Real Estate FAQs
                </h2>
                <p className="text-xs text-stone-500">
                  Manage questions shown dynamically on the About Us page.
                </p>
              </div>
              <button
                onClick={() => setEditingFaq({ question: '', answer: '', category: 'Buying', sortOrder: faqsList.length + 1, published: true })}
                className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-amber-800 text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add FAQ</span>
              </button>
            </div>

            {/* FAQ Editor Drawer */}
            {editingFaq && (
              <div className="bg-white rounded-3xl p-6 border-2 border-amber-500/40 shadow-lg space-y-4">
                <h3 className="font-bold text-stone-900 text-sm">
                  {editingFaq.id ? 'Edit FAQ' : 'Add New Question'}
                </h3>
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold mb-1">Question</label>
                    <input
                      type="text"
                      value={editingFaq.question || ''}
                      onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                      placeholder="e.g. How does TrustKeys verify MahaRERA compliance?"
                      className="w-full px-3 py-2 bg-stone-50 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Answer</label>
                    <textarea
                      rows={4}
                      value={editingFaq.answer || ''}
                      onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                      placeholder="Detailed explanation..."
                      className="w-full px-3 py-2 bg-stone-50 border rounded-lg"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Category</label>
                      <select
                        value={editingFaq.category || 'Buying'}
                        onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value as any })}
                        className="w-full px-3 py-2 bg-stone-50 border rounded-lg"
                      >
                        <option value="Buying">Buying</option>
                        <option value="Selling">Selling</option>
                        <option value="RERA & Legal">RERA & Legal</option>
                        <option value="Home Loans">Home Loans</option>
                        <option value="Vastu">Vastu</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Sort Order</label>
                      <input
                        type="number"
                        value={editingFaq.sortOrder ?? 1}
                        onChange={(e) => setEditingFaq({ ...editingFaq, sortOrder: Number(e.target.value) })}
                        className="w-full px-3 py-2 bg-stone-50 border rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setEditingFaq(null)}
                    className="px-4 py-2 rounded-lg bg-stone-100 text-stone-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={async () => {
                      if (!editingFaq.question || !editingFaq.answer) {
                        showBanner('Please fill question and answer', true);
                        return;
                      }
                      if (editingFaq.id) {
                        await adminUpdateFAQ(editingFaq.id, editingFaq);
                      } else {
                        await adminCreateFAQ(editingFaq);
                      }
                      setEditingFaq(null);
                      await loadFaqs();
                      showBanner('FAQ saved successfully');
                    }}
                    className="px-5 py-2 rounded-lg bg-amber-600 text-stone-950 text-xs font-bold"
                  >
                    Save FAQ
                  </button>
                </div>
              </div>
            )}

            {/* FAQs List */}
            <div className="space-y-3">
              {faqsList.map((faq) => (
                <div key={faq.id} className="bg-white p-5 rounded-2xl border border-stone-200 flex items-start justify-between gap-4 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-amber-700 font-bold">#{faq.sortOrder}</span>
                      <span className="px-2 py-0.5 rounded bg-stone-100 font-medium text-stone-700">{faq.category}</span>
                      {!faq.published && <span className="text-red-600 font-bold">(Unpublished)</span>}
                    </div>
                    <h4 className="font-bold text-stone-900 text-sm">{faq.question}</h4>
                    <p className="text-stone-600 leading-relaxed max-w-2xl">{faq.answer}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setEditingFaq({ ...faq })}
                      className="p-1.5 text-stone-600 hover:text-stone-900 rounded"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={async () => {
                        if (confirm('Delete FAQ?')) {
                          await adminDeleteFAQ(faq.id);
                          await loadFaqs();
                          showBanner('FAQ deleted');
                        }
                      }}
                      className="p-1.5 text-red-500 hover:text-red-700 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SITE SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && settingsForm && (
          <form onSubmit={handleSaveSettings} className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm space-y-6 max-w-3xl">
            <h2 className="font-serif-display text-xl font-bold text-stone-900 border-b border-stone-100 pb-3">
              Business Profile & Public Settings
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Business Name</label>
                <input
                  type="text"
                  value={settingsForm.businessName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, businessName: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tagline</label>
                <input
                  type="text"
                  value={settingsForm.tagline}
                  onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Primary Phone</label>
                <input
                  type="text"
                  value={settingsForm.phone}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">WhatsApp Hotline</label>
                <input
                  type="text"
                  value={settingsForm.whatsappNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Public Email</label>
                <input
                  type="email"
                  value={settingsForm.email}
                  onChange={(e) => setSettingsForm({ ...settingsForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Leads Notification Email</label>
                <input
                  type="email"
                  value={settingsForm.notificationEmail}
                  onChange={(e) => setSettingsForm({ ...settingsForm, notificationEmail: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border rounded-lg"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block font-semibold mb-1">Office Address</label>
              <textarea
                rows={2}
                value={settingsForm.address}
                onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border rounded-lg"
              />
            </div>

            <div className="text-xs">
              <label className="block font-semibold mb-1">Office Google Maps Link</label>
              <input
                type="url"
                value={settingsForm.googleMapsUrl || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, googleMapsUrl: e.target.value })}
                placeholder="Paste the TrustKeys office Google Maps link"
                className="w-full px-3 py-2 bg-stone-50 border rounded-lg font-mono"
              />
            </div>

            <div className="text-xs">
              <label className="block font-semibold mb-1">About Us Summary</label>
              <textarea
                rows={3}
                value={settingsForm.aboutSummary}
                onChange={(e) => setSettingsForm({ ...settingsForm, aboutSummary: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border rounded-lg"
              />
            </div>

            {/* Advisor Info */}
            <div className="pt-4 border-t border-stone-100 space-y-4 text-xs">
              <h3 className="font-bold text-stone-900 uppercase text-[11px]">Principal Advisor Profile</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold mb-1">Advisor Name</label>
                  <input
                    type="text"
                    value={settingsForm.advisorName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, advisorName: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Advisor Title</label>
                  <input
                    type="text"
                    value={settingsForm.advisorTitle}
                    onChange={(e) => setSettingsForm({ ...settingsForm, advisorTitle: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Advisor MahaRERA Reg</label>
                  <input
                    type="text"
                    value={settingsForm.advisorRera}
                    onChange={(e) => setSettingsForm({ ...settingsForm, advisorRera: e.target.value })}
                    className="w-full px-3 py-2 bg-stone-50 border rounded-lg font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Advisor Bio</label>
                <textarea
                  rows={3}
                  value={settingsForm.advisorBio}
                  onChange={(e) => setSettingsForm({ ...settingsForm, advisorBio: e.target.value })}
                  className="w-full px-3 py-2 bg-stone-50 border rounded-lg"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={settingsSaving}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md"
            >
              {settingsSaving ? 'Saving Changes...' : 'Save Site Settings'}
            </button>
          </form>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: SECURITY & PASSWORDS */}
        {/* ========================================================================= */}
        {activeTab === 'security' && (
          <div className="bg-white rounded-3xl p-8 border border-stone-200 shadow-sm max-w-md space-y-6">
            <div>
              <h2 className="font-serif-display text-xl font-bold text-stone-900">
                Change Admin Passkey
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Update the authentication credentials for this advisor dashboard.
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  New Password (min 6 characters)
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                disabled={changingPassword}
                className="w-full py-3 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold text-xs transition-colors"
              >
                {changingPassword ? 'Updating Password...' : 'Update Admin Password'}
              </button>
            </form>
          </div>
        )}

      </main>

    </div>
  );
};
