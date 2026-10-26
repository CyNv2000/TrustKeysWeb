import React, { useState, useEffect, useTransition, useMemo } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  RefreshCw, 
  Building2, 
  ChevronDown, 
  AlertCircle, 
  Sparkles,
  Check
} from 'lucide-react';
import { Project, SortOption } from '../types';
import { ProjectCard } from './ProjectCard';
import { fetchProjects } from '../lib/api';

interface ProjectCatalogueProps {
  onSelectProject: (slug: string) => void;
  presetArea?: string;
  presetStatus?: string;
  presetCategory?: string;
  id?: string;
}

const NEIGHBOURHOODS = [
  'All',
  'Bandra West',
  'Bandra East',
  'Khar West',
  'Santacruz West',
  'Juhu',
  'Vile Parle',
  'Andheri West',
  'Goregaon West',
  'Malad West',
  'Kandivali West',
  'Borivali West'
];

const BHK_OPTIONS = ['All', '1 BHK', '2 BHK', '3 BHK', '4 BHK', 'Penthouse'];

const PROPERTY_TYPES = [
  'Luxury Apartments',
  'Premium Residences',
  'Penthouse Suites',
  'Boutique Seafront',
  'Gated Community',
  'High-Rise Tower'
];

const AMENITY_TAGS = [
  'Infinity Rooftop Pool',
  'Technogym Fitness Studio',
  'EV Charging Stations',
  'Sky Lounge at 300 Ft',
  'Private Screening Lounge',
  'Badminton Court',
  'Squash Court'
];

export const ProjectCatalogue: React.FC<ProjectCatalogueProps> = ({
  onSelectProject,
  presetArea,
  presetStatus,
  presetCategory,
  id = 'project-catalogue'
}) => {
  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedArea, setSelectedArea] = useState<string>(presetArea || 'All');
  const [selectedBHK, setSelectedBHK] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>(presetStatus || 'All');
  const [possessionFilter, setPossessionFilter] = useState<string>('all');
  const [budgetTier, setBudgetTier] = useState<string>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Advanced Filters Drawer
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(presetCategory ? [presetCategory] : []);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [hasParkingOnly, setHasParkingOnly] = useState(false);
  const [hasBalconyOnly, setHasBalconyOnly] = useState(false);
  const [minPriceInput, setMinPriceInput] = useState<number | undefined>(undefined);
  const [maxPriceInput, setMaxPriceInput] = useState<number | undefined>(undefined);
  const [minAreaInput, setMinAreaInput] = useState<number | undefined>(undefined);
  const [maxAreaInput, setMaxAreaInput] = useState<number | undefined>(undefined);

  // Pagination & Loading States
  const [projects, setProjects] = useState<Project[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [, startTransition] = useTransition();

  // Debounce search input (350ms)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Synchronize when presets change from outside
  useEffect(() => {
    if (presetArea) setSelectedArea(presetArea);
  }, [presetArea]);

  useEffect(() => {
    if (presetStatus) setSelectedStatus(presetStatus);
  }, [presetStatus]);

  useEffect(() => {
    if (presetCategory) setSelectedCategories([presetCategory]);
  }, [presetCategory]);

  // Determine budget bounds from tier
  const calculatedBudgetRange = useMemo(() => {
    switch (budgetTier) {
      case 'under-2cr':
        return { min: undefined, max: 20000000 };
      case '2-5cr':
        return { min: 20000000, max: 50000000 };
      case '5-10cr':
        return { min: 50000000, max: 100000000 };
      case 'above-10cr':
        return { min: 100000000, max: undefined };
      default:
        return { min: minPriceInput, max: maxPriceInput };
    }
  }, [budgetTier, minPriceInput, maxPriceInput]);

  // Main data fetcher
  const loadData = async (pageToLoad: number, append = false) => {
    if (append) {
      setIsLoadingMore(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      const areaParam = selectedArea !== 'All' ? [selectedArea] : undefined;
      const bhkParam = selectedBHK !== 'All' ? [selectedBHK] : undefined;
      const statusParam = selectedStatus !== 'All' ? [selectedStatus] : undefined;
      const catParam = selectedCategories.length > 0 ? selectedCategories : undefined;

      const result = await fetchProjects({
        search: debouncedSearch.trim() || undefined,
        area: areaParam,
        bhk: bhkParam,
        status: statusParam,
        category: catParam,
        minPrice: calculatedBudgetRange.min,
        maxPrice: calculatedBudgetRange.max,
        minArea: minAreaInput,
        maxArea: maxAreaInput,
        possession: possessionFilter,
        sort: sortBy,
        page: pageToLoad,
        limit: 12
      });

      startTransition(() => {
        if (append) {
          setProjects(prev => [...prev, ...result.projects]);
        } else {
          setProjects(result.projects);
        }
        setTotalCount(result.total);
        setCurrentPage(result.page);
        setTotalPages(result.totalPages);
        setIsLoading(false);
        setIsLoadingMore(false);
      });
    } catch (err: any) {
      console.error('Projects load failed:', err);
      setError(err.message || 'Unable to load residential properties. Please retry.');
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  };

  // Reload when filters change
  useEffect(() => {
    setCurrentPage(1);
    loadData(1, false);
  }, [
    debouncedSearch,
    selectedArea,
    selectedBHK,
    selectedStatus,
    possessionFilter,
    budgetTier,
    selectedCategories,
    selectedAmenities,
    hasParkingOnly,
    hasBalconyOnly,
    minAreaInput,
    maxAreaInput,
    calculatedBudgetRange,
    sortBy
  ]);

  const handleLoadMore = () => {
    if (currentPage < totalPages && !isLoadingMore) {
      const nextPage = currentPage + 1;
      loadData(nextPage, true);
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedArea('All');
    setSelectedBHK('All');
    setSelectedStatus('All');
    setPossessionFilter('all');
    setBudgetTier('all');
    setSelectedCategories([]);
    setSelectedAmenities([]);
    setHasParkingOnly(false);
    setHasBalconyOnly(false);
    setMinPriceInput(undefined);
    setMaxPriceInput(undefined);
    setMinAreaInput(undefined);
    setMaxAreaInput(undefined);
    setSortBy('newest');
    setShowAdvancedFilters(false);
  };

  // Filter count for badge
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedArea !== 'All') count++;
    if (selectedBHK !== 'All') count++;
    if (selectedStatus !== 'All') count++;
    if (possessionFilter !== 'all') count++;
    if (budgetTier !== 'all') count++;
    if (selectedCategories.length > 0) count += selectedCategories.length;
    if (selectedAmenities.length > 0) count += selectedAmenities.length;
    if (hasParkingOnly) count++;
    if (hasBalconyOnly) count++;
    if (debouncedSearch) count++;
    return count;
  }, [
    selectedArea,
    selectedBHK,
    selectedStatus,
    possessionFilter,
    budgetTier,
    selectedCategories,
    selectedAmenities,
    hasParkingOnly,
    hasBalconyOnly,
    debouncedSearch
  ]);

  return (
    <section id={id} className="py-12 bg-slate-50/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-6 border-b border-slate-200 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-950 border border-amber-300 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Verified MahaRERA Properties</span>
            </div>
            <h2 className="font-serif-display text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 tracking-tight">
              Curated Western Mumbai Residences
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl">
              Physical inspection, clear title deeds, and verified developer track records. Filter through Bandra, Juhu, Andheri, and beyond.
            </p>
          </div>

          {/* Results count & sorting */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">
              Showing <strong className="text-slate-900 font-bold">{projects.length}</strong> of <strong className="text-slate-900">{totalCount}</strong> homes
            </span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none bg-white text-slate-800 text-xs font-semibold pl-3 pr-8 py-2 rounded-xl border border-slate-200 shadow-xs focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                aria-label="Sort residences by"
              >
                <option value="newest">Sort: Newly Listed</option>
                <option value="early-possession">Sort: Early Possession</option>
                <option value="price-asc">Sort: Price (Low to High)</option>
                <option value="price-desc">Sort: Price (High to Low)</option>
                <option value="area-asc">Sort: Carpet Area (Low to High)</option>
                <option value="area-desc">Sort: Carpet Area (High to Low)</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Search Bar & Primary Controls */}
        <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 mb-6 space-y-4">
          <div className="flex flex-col lg:flex-row items-stretch gap-3">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search residence name, locality, BHK, amenities, or RERA ID..."
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 focus:bg-white text-sm text-slate-900 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* BHK Selector */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 lg:pb-0 scrollbar-none">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mr-1 hidden sm:inline">
                BHK:
              </span>
              {BHK_OPTIONS.map((bhk) => (
                <button
                  key={bhk}
                  onClick={() => setSelectedBHK(bhk)}
                  className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedBHK === bhk
                      ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700'
                  }`}
                >
                  {bhk}
                </button>
              ))}
            </div>

            {/* Advanced Filters Toggle */}
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                showAdvancedFilters || activeFilterCount > 0
                  ? 'bg-amber-50 border-amber-300 text-amber-950 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 text-amber-600" />
              <span>Filters</span>
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[11px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Micro-Market Neighbourhood Chips */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider mr-1 shrink-0">
                Area:
              </span>
              {NEIGHBOURHOODS.map((area) => (
                <button
                  key={area}
                  onClick={() => setSelectedArea(area)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                    selectedArea === area
                      ? 'bg-amber-500 text-white font-bold shadow-sm shadow-amber-500/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {area}
                </button>
              ))}
            </div>
          </div>

          {/* Budget & Possession Quick Row */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs">
            {/* Status Pills */}
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-bold uppercase mr-1">Stage:</span>
              {[
                { val: 'All', label: 'All Stages', activeClass: 'bg-amber-500 text-white' },
                { val: 'Ready', label: 'Ready to Move', activeClass: 'bg-emerald-600 text-white', color: 'hover:text-emerald-700 bg-emerald-50 text-emerald-800 border border-emerald-200' },
                { val: 'Ongoing', label: 'Under Construction', activeClass: 'bg-amber-500 text-white', color: 'hover:text-amber-700 bg-amber-50 text-amber-800 border border-amber-200' },
                { val: 'Upcoming', label: 'New Launch', activeClass: 'bg-sky-600 text-white', color: 'hover:text-sky-700 bg-sky-50 text-sky-800 border border-sky-200' }
              ].map(st => (
                <button
                  key={st.val}
                  onClick={() => setSelectedStatus(st.val)}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    selectedStatus === st.val
                      ? `${st.activeClass} shadow-xs`
                      : st.color || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {st.label}
                </button>
              ))}
            </div>

            {/* Budget Presets */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1">
              <span className="text-slate-500 font-bold uppercase mr-1">Budget:</span>
              {[
                { val: 'all', label: 'Any' },
                { val: 'under-2cr', label: '< ₹2 Cr' },
                { val: '2-5cr', label: '₹2 - 5 Cr' },
                { val: '5-10cr', label: '₹5 - 10 Cr' },
                { val: 'above-10cr', label: '₹10 Cr+' }
              ].map(b => (
                <button
                  key={b.val}
                  onClick={() => setBudgetTier(b.val)}
                  className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                    budgetTier === b.val
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>

            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-amber-800 hover:text-amber-950 font-bold flex items-center gap-1 underline underline-offset-2 ml-auto"
              >
                <X className="w-3.5 h-3.5" />
                <span>Reset all</span>
              </button>
            )}
          </div>
        </div>

        {/* Expandable Advanced Filters Drawer */}
        {showAdvancedFilters && (
          <div className="bg-amber-50/50 rounded-2xl p-5 border border-amber-200/80 mb-8 space-y-5 animate-in slide-in-from-top-3 duration-200 shadow-xs">
            <div className="flex items-center justify-between border-b border-amber-200/70 pb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-amber-600" />
                Refine Residence Criteria
              </h3>
              <button
                onClick={handleResetFilters}
                className="text-xs text-stone-500 hover:text-stone-800 underline"
              >
                Clear all filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-2">
                  Property Category
                </label>
                <div className="space-y-1.5">
                  {PROPERTY_TYPES.map((cat) => {
                    const isSelected = selectedCategories.includes(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategories(prev => 
                            isSelected ? prev.filter(c => c !== cat) : [...prev, cat]
                          );
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium border text-left transition-colors ${
                          isSelected
                            ? 'bg-amber-100 border-amber-300 text-amber-900'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span>{cat}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Area & Carpet Range */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-2">
                  Min & Max Carpet Area (sq.ft)
                </label>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <input
                    type="number"
                    placeholder="Min sq.ft"
                    value={minAreaInput || ''}
                    onChange={(e) => setMinAreaInput(e.target.value ? Number(e.target.value) : undefined)}
                    className="px-3 py-2 bg-white text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="number"
                    placeholder="Max sq.ft"
                    value={maxAreaInput || ''}
                    onChange={(e) => setMaxAreaInput(e.target.value ? Number(e.target.value) : undefined)}
                    className="px-3 py-2 bg-white text-xs border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <label className="block text-xs font-semibold text-stone-700 uppercase mb-2">
                  Key Specifications
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasParkingOnly}
                      onChange={(e) => setHasParkingOnly(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>Must include reserved covered parking</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasBalconyOnly}
                      onChange={(e) => setHasBalconyOnly(e.target.checked)}
                      className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4"
                    />
                    <span>Must include sundeck / balcony</span>
                  </label>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase mb-2">
                  Specific Lifestyle Amenities
                </label>
                <div className="space-y-1.5">
                  {AMENITY_TAGS.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        onClick={() => {
                          setSelectedAmenities(prev =>
                            isSelected ? prev.filter(a => a !== amenity) : [...prev, amenity]
                          );
                        }}
                        className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium border text-left transition-colors ${
                          isSelected
                            ? 'bg-amber-100 border-amber-300 text-amber-900'
                            : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <span>{amenity}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-amber-700" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Content Section: Loading, Error, Empty, or Projects Grid */}
        {isLoading ? (
          /* Skeletons with explicit dimensions */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-sm animate-pulse"
              >
                <div className="aspect-[16/10] bg-stone-200 w-full" />
                <div className="p-5 space-y-3">
                  <div className="h-5 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-200 rounded w-1/2" />
                  <div className="grid grid-cols-2 gap-2 py-3 border-y border-stone-100">
                    <div className="h-8 bg-stone-100 rounded" />
                    <div className="h-8 bg-stone-100 rounded" />
                  </div>
                  <div className="h-8 bg-stone-200 rounded w-full mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State with Retry Button (fulfilling requirement) */
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-lg mx-auto my-12">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-red-900 mb-1">
              Failed to Load Residences
            </h3>
            <p className="text-xs text-red-700 mb-6 leading-relaxed">
              {error}
            </p>
            <button
              onClick={() => loadData(1, false)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry Loading Projects</span>
            </button>
          </div>
        ) : projects.length === 0 ? (
          /* No Results State with Clear Action */
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto my-12 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="font-serif-display text-lg font-bold text-slate-900 mb-2">
              No Matching Residences Found
            </h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              We could not find any properties matching your exact filter combination. Try adjusting the budget, BHK preference, or selected micro-market.
            </p>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/25 active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project, idx) => (
                <ProjectCard
                  key={project.id || project.slug}
                  project={project}
                  onSelect={onSelectProject}
                  isFirst={idx === 0}
                />
              ))}
            </div>

            {/* Load More Pagination (12 per page) */}
            {currentPage < totalPages && (
              <div className="mt-12 text-center">
                <button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white text-sm font-bold transition-all shadow-lg shadow-amber-500/25 active:scale-95 disabled:opacity-50"
                >
                  {isLoadingMore ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      <span>Loading residences...</span>
                    </>
                  ) : (
                    <>
                      <span>Load More Residences ({totalCount - projects.length} remaining)</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};
