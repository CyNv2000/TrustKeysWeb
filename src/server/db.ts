import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialProjects, initialFAQs, initialSiteSettings } from '../data/seedData';
import { Project, Enquiry, SellLead, FAQ, SiteSettings } from '../types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../.data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

interface DatabaseSchema {
  projects: Project[];
  enquiries: Enquiry[];
  sellLeads: SellLead[];
  faqs: FAQ[];
  settings: SiteSettings;
  adminPasswordHash: string;
}

const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || 'trustkeys2026';

class LocalDatabase {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        // Ensure default structures are present
        return {
          projects: parsed.projects && parsed.projects.length > 0 ? parsed.projects : initialProjects,
          enquiries: parsed.enquiries || [],
          sellLeads: parsed.sellLeads || [],
          faqs: parsed.faqs && parsed.faqs.length > 0 ? parsed.faqs : initialFAQs,
          settings: parsed.settings || initialSiteSettings,
          adminPasswordHash: parsed.adminPasswordHash || DEFAULT_ADMIN_PASS
        };
      }
    } catch (err) {
      console.warn('Error reading db.json, initializing fresh data:', err);
    }

    const initialData: DatabaseSchema = {
      projects: initialProjects,
      enquiries: [
        {
          id: 'enq-seed-1',
          name: 'Rohit K. Mehra',
          mobile: '9820011223',
          email: 'rohit.mehra@example.com',
          requirement: 'Schedule Site Visit',
          projectRef: 'The Pali Crest Residences',
          message: 'Interested in 4 BHK presidential suite. Prefer weekend site visit.',
          status: 'Contacted',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
        },
        {
          id: 'enq-seed-2',
          name: 'Pooja & Sanjay Singhal',
          mobile: '9819922334',
          email: 'pooja.singhal@example.com',
          requirement: 'Pricing & Negotiation',
          projectRef: 'Oberoi Sky Horizons',
          message: 'Looking for 3 BHK ready or near-ready possession.',
          status: 'New',
          createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
        }
      ],
      sellLeads: [
        {
          id: 'sell-seed-1',
          name: 'Anand Parekh',
          mobile: '9821144556',
          email: 'anand.p@example.com',
          location: 'Bandra West (Pali Hill)',
          category: 'Residential',
          configuration: '3 BHK',
          carpetArea: 1350,
          expectedPrice: '₹8.50 Cr',
          propertyStatus: 'Ready',
          extraDetails: 'Renovated sea-view flat in a co-operative housing society with 2 stilt parkings.',
          status: 'Under Evaluation',
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
        }
      ],
      faqs: initialFAQs,
      settings: initialSiteSettings,
      adminPasswordHash: DEFAULT_ADMIN_PASS
    };

    this.saveData(initialData);
    return initialData;
  }

  private saveData(dataToSave?: DatabaseSchema) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tempFile = `${DB_FILE}.${process.pid}.tmp`;
    try {
      fs.writeFileSync(tempFile, JSON.stringify(dataToSave || this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      try {
        if (fs.existsSync(tempFile)) fs.unlinkSync(tempFile);
      } catch {
        // Keep the original write error for the API response.
      }
      console.error('Failed to save db.json:', err);
      throw new Error('Could not persist project data. Please retry or contact support.');
    }
  }

  // --- Projects Querying ---
  getProjects(filters?: {
    search?: string;
    area?: string | string[];
    bhk?: string | string[];
    status?: string | string[];
    category?: string | string[];
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    possession?: string;
    sort?: string;
    page?: number;
    limit?: number;
    includeUnpublished?: boolean;
  }): { projects: Project[]; total: number; page: number; limit: number; totalPages: number } {
    let list = this.data.projects.filter(p => filters?.includeUnpublished ? true : p.published);

    if (filters?.search && filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      list = list.filter(p => 
        p.title.toLowerCase().includes(q) ||
        p.area.toLowerCase().includes(q) ||
        p.address.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.amenities.some((a: string) => a.toLowerCase().includes(q)) ||
        p.configuration.some((c: string) => c.toLowerCase().includes(q)) ||
        p.reraNumber.toLowerCase().includes(q)
      );
    }

    if (filters?.area) {
      const areas = Array.isArray(filters.area) ? filters.area : [filters.area];
      if (areas.length > 0 && !areas.includes('All')) {
        list = list.filter(p => areas.some((a: string) => p.area.toLowerCase().includes(a.toLowerCase())));
      }
    }

    if (filters?.status) {
      const statuses = Array.isArray(filters.status) ? filters.status : [filters.status];
      if (statuses.length > 0 && !statuses.includes('All')) {
        list = list.filter(p => statuses.includes(p.status));
      }
    }

    if (filters?.category) {
      const cats = Array.isArray(filters.category) ? filters.category : [filters.category];
      if (cats.length > 0 && !cats.includes('All')) {
        list = list.filter(p => cats.includes(p.category));
      }
    }

    if (filters?.bhk) {
      const bhks = Array.isArray(filters.bhk) ? filters.bhk : [filters.bhk];
      if (bhks.length > 0 && !bhks.includes('All')) {
        list = list.filter(p => p.configuration.some((c: string) => bhks.some((b: string) => c.toLowerCase().includes(b.toLowerCase()))));
      }
    }

    if (filters?.minPrice && filters.minPrice > 0) {
      list = list.filter(p => p.startingPrice >= filters.minPrice!);
    }

    if (filters?.maxPrice && filters.maxPrice > 0) {
      list = list.filter(p => p.startingPrice <= filters.maxPrice!);
    }

    if (filters?.minArea && filters.minArea > 0) {
      list = list.filter(p => p.maxArea >= filters.minArea!);
    }

    if (filters?.maxArea && filters.maxArea > 0) {
      list = list.filter(p => p.minArea <= filters.maxArea!);
    }

    if (filters?.possession && filters.possession !== 'all') {
      if (filters.possession === 'ready') {
        list = list.filter(p => p.status === 'Ready');
      } else if (filters.possession === 'ongoing') {
        list = list.filter(p => p.status === 'Ongoing');
      } else if (filters.possession === 'upcoming') {
        list = list.filter(p => p.status === 'Upcoming');
      }
    }

    // Sorting
    switch (filters?.sort) {
      case 'early-possession':
        list.sort((a, b) => (a.possessionDate || '').localeCompare(b.possessionDate || ''));
        break;
      case 'price-asc':
        list.sort((a, b) => a.startingPrice - b.startingPrice);
        break;
      case 'price-desc':
        list.sort((a, b) => b.startingPrice - a.startingPrice);
        break;
      case 'area-asc':
        list.sort((a, b) => a.minArea - b.minArea);
        break;
      case 'area-desc':
        list.sort((a, b) => b.maxArea - a.maxArea);
        break;
      case 'newest':
      default:
        list.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
        break;
    }

    const total = list.length;
    const page = filters?.page && filters.page > 0 ? Number(filters.page) : 1;
    const limit = filters?.limit && filters.limit > 0 ? Number(filters.limit) : 12;
    const totalPages = Math.ceil(total / limit) || 1;
    const start = (page - 1) * limit;
    const paginated = list.slice(start, start + limit);

    return {
      projects: paginated,
      total,
      page,
      limit,
      totalPages
    };
  }

  getProjectBySlug(slug: string): Project | undefined {
    const normalizedSlug = slug.trim().toLowerCase();
    return this.data.projects.find(p => p.slug.trim().toLowerCase() === normalizedSlug);
  }

  getProjectById(id: string): Project | undefined {
    return this.data.projects.find(p => p.id === id);
  }

  createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    const newProj: Project = {
      ...project,
      id: `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.projects.unshift(newProj);
    this.saveData();
    return newProj;
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.data.projects[index] = {
      ...this.data.projects[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    return this.data.projects[index];
  }

  deleteProject(id: string): boolean {
    const index = this.data.projects.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.data.projects.splice(index, 1);
    this.saveData();
    return true;
  }

  // --- Enquiries ---
  getEnquiries(): Enquiry[] {
    return [...this.data.enquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  createEnquiry(enquiry: Omit<Enquiry, 'id' | 'createdAt' | 'status'>): Enquiry {
    const newEnq: Enquiry = {
      ...enquiry,
      id: `enq-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'New',
      createdAt: new Date().toISOString()
    };
    this.data.enquiries.unshift(newEnq);
    this.saveData();
    return newEnq;
  }

  updateEnquiryStatus(id: string, status: Enquiry['status']): Enquiry | null {
    const item = this.data.enquiries.find(e => e.id === id);
    if (!item) return null;
    item.status = status;
    this.saveData();
    return item;
  }

  deleteEnquiry(id: string): boolean {
    const idx = this.data.enquiries.findIndex(e => e.id === id);
    if (idx === -1) return false;
    this.data.enquiries.splice(idx, 1);
    this.saveData();
    return true;
  }

  // --- Sell Leads ---
  getSellLeads(): SellLead[] {
    return [...this.data.sellLeads].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  createSellLead(lead: Omit<SellLead, 'id' | 'createdAt' | 'status'>): SellLead {
    const newLead: SellLead = {
      ...lead,
      id: `sell-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      status: 'Pending Review',
      createdAt: new Date().toISOString()
    };
    this.data.sellLeads.unshift(newLead);
    this.saveData();
    return newLead;
  }

  updateSellLeadStatus(id: string, status: SellLead['status']): SellLead | null {
    const item = this.data.sellLeads.find(l => l.id === id);
    if (!item) return null;
    item.status = status;
    this.saveData();
    return item;
  }

  deleteSellLead(id: string): boolean {
    const idx = this.data.sellLeads.findIndex(l => l.id === id);
    if (idx === -1) return false;
    this.data.sellLeads.splice(idx, 1);
    this.saveData();
    return true;
  }

  // --- FAQs ---
  getFAQs(publishedOnly = true): FAQ[] {
    let list = this.data.faqs;
    if (publishedOnly) {
      list = list.filter(f => f.published);
    }
    return [...list].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  createFAQ(faq: Omit<FAQ, 'id' | 'createdAt'>): FAQ {
    const newFaq: FAQ = {
      ...faq,
      id: `faq-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    this.data.faqs.push(newFaq);
    this.saveData();
    return newFaq;
  }

  updateFAQ(id: string, updates: Partial<FAQ>): FAQ | null {
    const idx = this.data.faqs.findIndex(f => f.id === id);
    if (idx === -1) return null;
    this.data.faqs[idx] = { ...this.data.faqs[idx], ...updates };
    this.saveData();
    return this.data.faqs[idx];
  }

  deleteFAQ(id: string): boolean {
    const idx = this.data.faqs.findIndex(f => f.id === id);
    if (idx === -1) return false;
    this.data.faqs.splice(idx, 1);
    this.saveData();
    return true;
  }

  // --- Settings ---
  getSettings(): SiteSettings {
    return this.data.settings;
  }

  updateSettings(settings: Partial<SiteSettings>): SiteSettings {
    this.data.settings = {
      ...this.data.settings,
      ...settings,
      updatedAt: new Date().toISOString()
    };
    this.saveData();
    return this.data.settings;
  }

  // --- Admin Auth ---
  verifyAdminPassword(password: string): boolean {
    const envPass = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_PASS;
    return password === this.data.adminPasswordHash || password === envPass;
  }

  changeAdminPassword(newPassword: string): void {
    this.data.adminPasswordHash = newPassword;
    this.saveData();
  }
}

export const db = new LocalDatabase();
