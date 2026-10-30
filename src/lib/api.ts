import { Project, FAQ, SiteSettings, Enquiry, SellLead } from '../types';
import { initialProjects, initialFAQs, initialSiteSettings } from '../data/seedData';

const API_BASE = '/api';

// Admin Token Management
const TOKEN_KEY = 'trustkeys_admin_token';

export const getAdminToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setAdminToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearAdminToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

async function adminApiFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const headers = new Headers(options.headers);
  const token = getAdminToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const response = await fetch(url, { ...options, headers });
  if (response.status === 401) {
    clearAdminToken();
    window.dispatchEvent(new Event('trustkeys:admin-session-expired'));
  }
  return response;
}

// Fetch helper with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 8000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return response;
  } catch (error: any) {
    clearTimeout(id);
    if (error.name === 'AbortError') {
      throw new Error('Connection timed out. Please check your internet or retry.');
    }
    throw error;
  }
}

// Fetch Projects
export interface ProjectQuery {
  search?: string;
  area?: string[];
  bhk?: string[];
  status?: string[];
  category?: string[];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  possession?: string;
  sort?: string;
  page?: number;
  limit?: number;
  includeUnpublished?: boolean;
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function fetchProjects(query: ProjectQuery = {}): Promise<ProjectsResponse> {
  const params = new URLSearchParams();

  if (query.search) params.set('search', query.search);
  if (query.area && query.area.length > 0) params.set('area', query.area.join(','));
  if (query.bhk && query.bhk.length > 0) params.set('bhk', query.bhk.join(','));
  if (query.status && query.status.length > 0) params.set('status', query.status.join(','));
  if (query.category && query.category.length > 0) params.set('category', query.category.join(','));
  if (query.minPrice) params.set('minPrice', String(query.minPrice));
  if (query.maxPrice) params.set('maxPrice', String(query.maxPrice));
  if (query.minArea) params.set('minArea', String(query.minArea));
  if (query.maxArea) params.set('maxArea', String(query.maxArea));
  if (query.possession && query.possession !== 'all') params.set('possession', query.possession);
  if (query.sort) params.set('sort', query.sort);
  if (query.page) params.set('page', String(query.page));
  if (query.limit) params.set('limit', String(query.limit));
  if (query.includeUnpublished) params.set('includeUnpublished', 'true');

  try {
    const res = await fetchWithTimeout(`${API_BASE}/projects?${params.toString()}`, {}, 7000);
    if (!res.ok) {
      throw new Error(`Failed to fetch residences: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn('API fetch failed, falling back to local dataset filter:', err);
    // Client-side fallback if server is starting or network hiccup
    let list = [...initialProjects];
    if (query.search) {
      const q = query.search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(q) || p.area.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
    }
    if (query.area && query.area.length > 0 && !query.area.includes('All')) {
      list = list.filter(p => query.area!.some(a => p.area.toLowerCase().includes(a.toLowerCase())));
    }
    if (query.status && query.status.length > 0 && !query.status.includes('All')) {
      list = list.filter(p => query.status!.includes(p.status));
    }
    const page = query.page || 1;
    const limit = query.limit || 12;
    const paginated = list.slice((page - 1) * limit, page * limit);
    return {
      projects: paginated,
      total: list.length,
      page,
      limit,
      totalPages: Math.ceil(list.length / limit)
    };
  }
}

// Fetch single project by slug
export async function fetchProjectBySlug(slug: string): Promise<Project> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/projects/${encodeURIComponent(slug)}`, {}, 7000);
    if (!res.ok) {
      throw new Error('Project not found');
    }
    return await res.json();
  } catch (err) {
    const found = initialProjects.find(p => p.slug === slug);
    if (found) return found;
    throw new Error('Residence not found. It may have been relocated or updated.');
  }
}

// Enquiries
export async function submitEnquiry(data: {
  name: string;
  mobile: string;
  email: string;
  requirement: string;
  projectRef?: string;
  message?: string;
}): Promise<{ success: boolean; message: string; enquiryId?: string }> {
  const res = await fetchWithTimeout(`${API_BASE}/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, 8000);

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to submit enquiry');
  }
  return json;
}

// Sell Leads
export async function submitSellLead(data: {
  name: string;
  mobile: string;
  email: string;
  location: string;
  category: string;
  configuration: string;
  carpetArea: number;
  expectedPrice: string;
  propertyStatus: string;
  extraDetails?: string;
}): Promise<{ success: boolean; message: string; leadId?: string }> {
  const res = await fetchWithTimeout(`${API_BASE}/sell-leads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }, 8000);

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Failed to submit property details');
  }
  return json;
}

// FAQs
export async function fetchFAQs(all = false): Promise<FAQ[]> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/faqs${all ? '?all=true' : ''}`, {}, 6000);
    if (!res.ok) throw new Error('Failed to fetch FAQs');
    return await res.json();
  } catch {
    return initialFAQs;
  }
}

// Settings
export async function fetchSiteSettings(): Promise<SiteSettings> {
  try {
    const res = await fetchWithTimeout(`${API_BASE}/settings`, {}, 6000);
    if (!res.ok) throw new Error('Failed to load settings');
    return await res.json();
  } catch {
    return initialSiteSettings;
  }
}

// Admin APIs
export async function adminLogin(password: string): Promise<{ token: string; message: string }> {
  const res = await fetch(`${API_BASE}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password })
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error || 'Invalid credentials');
  }
  setAdminToken(json.token);
  return json;
}

export async function adminChangePassword(newPassword: string): Promise<void> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/admin/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ newPassword })
  });
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json.error || 'Failed to change password');
  }
}

export async function adminGetEnquiries(): Promise<Enquiry[]> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/enquiries`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Unauthorized');
  return await res.json();
}

export async function adminUpdateEnquiryStatus(id: string, status: Enquiry['status']): Promise<Enquiry> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/enquiries/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  return await res.json();
}

export async function adminDeleteEnquiry(id: string): Promise<void> {
  const token = getAdminToken();
  await fetch(`${API_BASE}/enquiries/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function adminGetSellLeads(): Promise<SellLead[]> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/sell-leads`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('Unauthorized');
  return await res.json();
}

export async function adminUpdateSellLeadStatus(id: string, status: SellLead['status']): Promise<SellLead> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/sell-leads/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ status })
  });
  return await res.json();
}

export async function adminDeleteSellLead(id: string): Promise<void> {
  const token = getAdminToken();
  await fetch(`${API_BASE}/sell-leads/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function adminCreateProject(data: Partial<Project>): Promise<Project> {
  const res = await adminApiFetch(`${API_BASE}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to create project');
  return json;
}

export async function adminUpdateProject(id: string, data: Partial<Project>): Promise<Project> {
  const res = await adminApiFetch(`${API_BASE}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Failed to update project');
  return json;
}

export async function adminDeleteProject(id: string): Promise<void> {
  const res = await adminApiFetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const json = await res.json().catch(() => ({}));
    throw new Error(json.error || 'Failed to delete project');
  }
}

export async function adminCreateFAQ(faq: Partial<FAQ>): Promise<FAQ> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/faqs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(faq)
  });
  return await res.json();
}

export async function adminUpdateFAQ(id: string, faq: Partial<FAQ>): Promise<FAQ> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/faqs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(faq)
  });
  return await res.json();
}

export async function adminDeleteFAQ(id: string): Promise<void> {
  const token = getAdminToken();
  await fetch(`${API_BASE}/faqs/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
}

export async function adminUpdateSettings(settings: Partial<SiteSettings>): Promise<SiteSettings> {
  const token = getAdminToken();
  const res = await fetch(`${API_BASE}/settings`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(settings)
  });
  return await res.json();
}

export async function adminUploadFile(fileData: string, filename: string, mimeType: string): Promise<{ url: string }> {
  const res = await adminApiFetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ fileData, filename, mimeType })
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Upload failed');
  return json;
}

// Compare LocalStorage helper
const COMPARE_KEY = 'trustkeys_compare_projects';

export function getCompareList(): string[] {
  try {
    const raw = localStorage.getItem(COMPARE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToCompare(slug: string): { success: boolean; message: string; list: string[] } {
  const current = getCompareList();
  if (current.includes(slug)) {
    return { success: false, message: 'Property is already in your compare list', list: current };
  }
  if (current.length >= 3) {
    return { success: false, message: 'You can compare a maximum of 3 properties at once. Please remove one to add this.', list: current };
  }
  const updated = [...current, slug];
  localStorage.setItem(COMPARE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('compare_updated'));
  return { success: true, message: 'Added to compare list', list: updated };
}

export function removeFromCompare(slug: string): string[] {
  const current = getCompareList();
  const updated = current.filter(s => s !== slug);
  localStorage.setItem(COMPARE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new Event('compare_updated'));
  return updated;
}

export function clearCompareList(): void {
  localStorage.removeItem(COMPARE_KEY);
  window.dispatchEvent(new Event('compare_updated'));
}
