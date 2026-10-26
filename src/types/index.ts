export type ProjectStatus = 'Ready' | 'Ongoing' | 'Upcoming';

export type PropertyCategory = 
  | 'Luxury Apartments'
  | 'Premium Residences'
  | 'Penthouse Suites'
  | 'Boutique Seafront'
  | 'Gated Community'
  | 'High-Rise Tower';

export interface ProjectConfiguration {
  id: string;
  type: string; // e.g. "2 BHK", "3 BHK", "4 BHK"
  carpetArea: number; // in sq.ft
  price: number; // in INR
  priceFormatted: string; // e.g. "₹3.85 Cr"
  parking: string; // e.g. "1 Covered Stilt"
  balcony: string; // e.g. "2 Sundecks"
  features: string[]; // e.g. ["East Facing", "Vaastu Compliant", "Panoramic Arabian Sea View"]
  floorPlanUrl?: string;
}

export interface FloorPlanItem {
  id: string;
  title: string;
  type: string;
  image: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  area: string; // e.g. "Bandra West", "Andheri West"
  address: string;
  category: PropertyCategory;
  status: ProjectStatus;
  configuration: string[]; // e.g. ["2 BHK", "3 BHK", "4 BHK"]
  configurations: ProjectConfiguration[];
  startingPrice: number; // in INR
  maxPrice?: number;
  startingPriceFormatted: string; // e.g. "₹4.20 Cr"
  carpetArea: string; // e.g. "920 - 2,450 sq.ft."
  minArea: number;
  maxArea: number;
  possession: string; // e.g. "Dec 2026", "Ready to Move"
  possessionDate: string; // YYYY-MM-DD
  amenities: string[];
  parking: string;
  balcony: string;
  totalFloors: number;
  vastuNotes: string;
  description: string;
  images: string[];
  reraNumber: string;
  floorPlans: FloorPlanItem[];
  brochureUrl?: string;
  architecturalPlanUrl?: string;
  youtubeUrl?: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
}

export type EnquiryRequirement = 
  | 'General Enquiry'
  | 'Schedule Site Visit'
  | 'Instant Callback'
  | 'Download Brochure'
  | 'Pricing & Negotiation'
  | 'Resale Inquiry';

export type EnquiryStatus = 'New' | 'Contacted' | 'Site Visit Scheduled' | 'Closed';

export interface Enquiry {
  id: string;
  name: string;
  mobile: string;
  email: string;
  requirement: EnquiryRequirement | string;
  projectRef?: string;
  message?: string;
  status: EnquiryStatus;
  createdAt: string;
}

export type SellLeadStatus = 'Pending Review' | 'Under Evaluation' | 'Listed' | 'Completed';

export interface SellLead {
  id: string;
  name: string;
  mobile: string;
  email: string;
  location: string;
  category: 'Residential' | 'Commercial';
  configuration: string;
  carpetArea: number;
  expectedPrice: string;
  propertyStatus: string;
  extraDetails?: string;
  status: SellLeadStatus;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: 'Buying' | 'Selling' | 'RERA & Legal' | 'Home Loans' | 'Vastu';
  sortOrder: number;
  published: boolean;
  createdAt?: string;
}

export interface SiteSettings {
  id: string;
  businessName: string;
  tagline: string;
  phone: string;
  phoneSecondary?: string;
  email: string;
  notificationEmail: string;
  address: string;
  officeHours: string;
  aboutSummary: string;
  advisorName: string;
  advisorTitle: string;
  advisorRera: string;
  advisorBio: string;
  advisorImage: string;
  whatsappNumber: string;
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    facebook?: string;
    youtube?: string;
  };
  updatedAt: string;
}

export interface FilterState {
  search: string;
  areas: string[]; // e.g. ["Bandra West", "Andheri West"]
  bhk: string[]; // e.g. ["2 BHK", "3 BHK"]
  status: string[]; // e.g. ["Ready", "Ongoing"]
  categories: string[];
  minPrice: number;
  maxPrice: number;
  minArea: number;
  maxArea: number;
  possessionTimeline: string; // 'all' | 'ready' | '6months' | '1year' | '2026+'
  amenities: string[];
  hasParking: boolean;
  hasBalcony: boolean;
  sortBy: SortOption;
}

export type SortOption = 
  | 'newest'
  | 'early-possession'
  | 'price-asc'
  | 'price-desc'
  | 'area-asc'
  | 'area-desc';

export interface VastuItemOption {
  value: string;
  label: string;
  score: number; // 0 to 10
  rationale: string;
  remedy?: string;
}

export interface VastuQuestion {
  id: string;
  category: string;
  title: string;
  description: string;
  options: VastuItemOption[];
}
