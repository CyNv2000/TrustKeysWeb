import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  ShieldCheck, 
  Sparkles, 
  Home, 
  Maximize2, 
  Car, 
  Compass, 
  Calendar, 
  Download, 
  Share2, 
  Scale, 
  Check, 
  Phone, 
  MessageSquare, 
  ArrowLeft, 
  Layers, 
  FileText, 
  ChevronRight, 
  AlertCircle,
  Eye,
  CheckCircle2
} from 'lucide-react';
import { Project, ProjectConfiguration } from '../types';
import { fetchProjectBySlug, fetchProjects, addToCompare, removeFromCompare, getCompareList } from '../lib/api';
import { ProjectCard } from '../components/ProjectCard';
import { YouTubeEmbed } from '../components/YouTubeEmbed';
import { EmiCalculator } from '../components/EmiCalculator';

interface ProjectDetailPageProps {
  slug: string;
  onNavigateBack: () => void;
  onSelectProject: (slug: string) => void;
  onOpenEnquiry: (projectTitle: string, defaultRequirement?: string) => void;
}

export const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({
  slug,
  onNavigateBack,
  onSelectProject,
  onOpenEnquiry
}) => {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Gallery Active Image
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Selected Configuration
  const [selectedConfig, setSelectedConfig] = useState<ProjectConfiguration | null>(null);

  // Compare State
  const [inCompare, setInCompare] = useState(false);

  // Related Projects
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);

  // Floor plan enlarged modal
  const [viewingFloorPlan, setViewingFloorPlan] = useState<string | null>(null);

  // Copy share link feedback
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    fetchProjectBySlug(slug)
      .then(async (data) => {
        if (!isMounted) return;
        setProject(data);
        setActiveImageIdx(0);

        // Set default configuration
        if (data.configurations && data.configurations.length > 0) {
          setSelectedConfig(data.configurations[0]);
        } else {
          setSelectedConfig(null);
        }

        setInCompare(getCompareList().includes(data.slug));
        setIsLoading(false);

        // Fetch related projects in same or neighboring area
        try {
          const related = await fetchProjects({
            area: [data.area],
            limit: 4
          });
          if (isMounted) {
            setRelatedProjects(related.projects.filter(p => p.slug !== data.slug).slice(0, 3));
          }
        } catch {
          // Non-blocking
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err.message || 'Failed to load residence details');
        setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleCompareToggle = () => {
    if (!project) return;
    if (inCompare) {
      removeFromCompare(project.slug);
      setInCompare(false);
    } else {
      const res = addToCompare(project.slug);
      if (res.success) {
        setInCompare(true);
      } else {
        alert(res.message);
      }
    }
  };

  const handleCopyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-pulse">
          <div className="h-6 bg-stone-200 rounded w-48" />
          <div className="aspect-[21/9] bg-stone-300 rounded-3xl w-full" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-8 bg-stone-200 rounded w-3/4" />
              <div className="h-4 bg-stone-200 rounded w-1/2" />
              <div className="h-32 bg-stone-100 rounded-2xl" />
            </div>
            <div className="h-64 bg-stone-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-stone-50 py-20">
        <div className="max-w-lg mx-auto px-4 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7" />
          </div>
          <h2 className="font-serif-display text-2xl font-bold text-stone-900 mb-2">
            Residence Not Found
          </h2>
          <p className="text-xs text-stone-600 mb-6 leading-relaxed">
            {error || 'The requested residence is no longer available or the link may have changed.'}
          </p>
          <button
            onClick={onNavigateBack}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-amber-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Projects Catalogue</span>
          </button>
        </div>
      </div>
    );
  }

  // Active specs derived from selected configuration (or base project)
  const currentPriceFormatted = selectedConfig ? selectedConfig.priceFormatted : project.startingPriceFormatted;
  const currentPrice = selectedConfig ? selectedConfig.price : project.startingPrice;
  const currentCarpet = selectedConfig ? `${selectedConfig.carpetArea} sq.ft.` : project.carpetArea;
  const currentBalcony = selectedConfig ? selectedConfig.balcony : project.balcony;
  const currentFeatures = selectedConfig ? selectedConfig.features : [];

  // Distinct Status Badge
  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'Ready':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-700 text-white">
            Ready to Move
          </span>
        );
      case 'Ongoing':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-600 text-white">
            Under Construction
          </span>
        );
      case 'Upcoming':
      default:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-700 text-white">
            New Launch / Upcoming
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-20">
      
      {/* 1. Breadcrumbs & Top Bar */}
      <div className="bg-white border-b border-stone-200 py-3 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center gap-2 overflow-x-auto">
            <button onClick={onNavigateBack} className="hover:text-amber-800 flex items-center gap-1 font-semibold text-stone-700">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Catalogue</span>
            </button>
            <span>/</span>
            <span className="text-stone-400">{project.area}</span>
            <span>/</span>
            <span className="font-medium text-stone-900 truncate max-w-xs">{project.title}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCompareToggle}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                inCompare
                  ? 'bg-amber-500 text-stone-950 border-amber-600 shadow-sm'
                  : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200'
              }`}
            >
              {inCompare ? <Check className="w-3.5 h-3.5" /> : <Scale className="w-3.5 h-3.5" />}
              <span>{inCompare ? 'In Compare List' : 'Add to Compare'}</span>
            </button>
            <button
              onClick={handleCopyShareLink}
              className="p-1.5 rounded-lg bg-white hover:bg-stone-50 text-stone-700 border border-stone-200 transition-colors"
              title="Copy property link"
              aria-label="Share property link"
            >
              <Share2 className="w-4 h-4" />
            </button>
            {copiedLink && (
              <span className="text-[11px] text-emerald-700 font-semibold animate-in fade-in">
                Link copied!
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-10">
        
        {/* 2. Photo Gallery & Hero Media */}
        <section className="space-y-4">
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full rounded-3xl overflow-hidden bg-stone-900 shadow-xl border border-stone-200">
            <img
              src={project.images[activeImageIdx] || project.images[0]}
              alt={`${project.title} view ${activeImageIdx + 1}`}
              width={1400}
              height={600}
              loading="eager"
              decoding="async"
              className="w-full h-full object-cover transition-opacity duration-300"
            />
            
            {/* Top Badges Overlay */}
            <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
              {getStatusBadge(project.status)}
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 backdrop-blur-md text-slate-900 border border-slate-200 shadow-xs">
                {project.category}
              </span>
              {project.featured && (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm border border-amber-300">
                  <Sparkles className="w-3.5 h-3.5" /> Featured Residence
                </span>
              )}
            </div>

            {/* Bottom Info Gradient */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-950/70 via-slate-950/40 to-transparent p-6 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
              <div>
                <h1 className="font-serif-display text-2xl sm:text-4xl font-bold tracking-tight text-white drop-shadow-md">
                  {project.title}
                </h1>
                <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 mt-1 font-medium">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{project.address}</span>
                </div>
              </div>

              {/* Starting Price Box - Light, Crisp, High-Contrast */}
              <div className="text-left sm:text-right bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-white/80 shadow-xl text-slate-900">
                <span className="block text-[10px] uppercase font-bold tracking-wider text-amber-700">
                  {selectedConfig ? `${selectedConfig.type} Starting Price` : 'Starting Price'}
                </span>
                <span className="font-serif-display text-2xl sm:text-3xl font-bold text-slate-950">
                  {currentPriceFormatted}
                </span>
                <span className="block text-[11px] text-slate-600 mt-0.5">
                  Possession: <strong className="text-slate-900 font-semibold">{project.possession}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Thumbnail Strip */}
          {project.images.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {project.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIdx(idx)}
                  className={`relative aspect-[16/10] w-24 sm:w-32 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    activeImageIdx === idx
                      ? 'border-amber-500 scale-95 shadow-md'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    width={160}
                    height={100}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </section>

        {/* 3. Main Content Grid & Sticky Action Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Details, Configs, Amenities, Floor Plans, Vastu */}
          <div className="lg:col-span-8 space-y-10">

            {/* MahaRERA Official Compliance Card */}
            {project.reraNumber && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                      MahaRERA Registered Project
                    </span>
                    <div className="font-mono text-base font-bold text-emerald-950">
                      {project.reraNumber}
                    </div>
                    <span className="text-xs text-emerald-700">
                      Physical title verified & escrow records audited by TrustKeys Legal Desk.
                    </span>
                  </div>
                </div>
                <a
                  href={`https://maharera.mahaonline.gov.in/`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold whitespace-nowrap transition-colors"
                >
                  Verify on MahaRERA Portal
                </a>
              </div>
            )}

            {/* Unit Configurations Selector (Only show if multiple configurations exist) */}
            {project.configurations && project.configurations.length > 1 && (
              <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif-display text-xl font-bold text-stone-900">
                      Select Unit Configuration
                    </h3>
                    <p className="text-xs text-stone-500">
                      Choose a unit type to view its pricing and carpet area. Project parking is shared across configurations.
                    </p>
                  </div>
                  <span className="text-xs font-medium text-stone-500 font-mono">
                    {project.configurations.length} Options
                  </span>
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {project.configurations.map((cfg) => {
                    const isSelected = selectedConfig?.id === cfg.id;
                    return (
                      <button
                        key={cfg.id}
                        onClick={() => setSelectedConfig(cfg)}
                        className={`p-4 rounded-2xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                        }`}
                      >
                        <span className="block font-serif-display text-base font-bold text-stone-900">
                          {cfg.type}
                        </span>
                        <span className="block font-mono text-sm font-semibold text-amber-800 mt-0.5">
                          {cfg.priceFormatted}
                        </span>
                        <span className="block text-xs text-stone-500 mt-1">
                          Carpet: <strong className="text-stone-700">{cfg.carpetArea} sq.ft.</strong>
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Configuration Highlight Box */}
                {selectedConfig && (
                  <div className="mt-4 p-4 rounded-2xl bg-stone-50 border border-stone-200 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-stone-600 font-semibold block text-[10px] uppercase">Project Parking</span>
                      <span className="font-semibold text-stone-800">{project.parking || 'Contact advisor'}</span>
                    </div>
                    <div>
                      <span className="text-stone-600 font-semibold block text-[10px] uppercase">Balcony / Sundeck</span>
                      <span className="font-semibold text-stone-800">{selectedConfig.balcony}</span>
                    </div>
                    <div>
                      <span className="text-stone-600 font-semibold block text-[10px] uppercase">Unit Pricing</span>
                      <span className="font-mono font-bold text-amber-800">{selectedConfig.priceFormatted}</span>
                    </div>
                    <div>
                      <span className="text-stone-600 font-semibold block text-[10px] uppercase">Carpet Area</span>
                      <span className="font-mono font-bold text-stone-800">{selectedConfig.carpetArea} sq.ft.</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Description & Overview */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
              <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                Architectural Overview
              </h3>
              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>

              {/* Key Highlights Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-stone-100 text-xs">
                <div>
                  <span className="text-stone-600 font-semibold uppercase text-[10px] block">Total Floors</span>
                  <span className="font-bold text-stone-900 text-sm">{project.totalFloors} Stories</span>
                </div>
                <div>
                  <span className="text-stone-600 font-semibold uppercase text-[10px] block">Configurations</span>
                  <span className="font-bold text-stone-900 text-sm">{project.configuration.join(', ')}</span>
                </div>
                <div>
                  <span className="text-stone-600 font-semibold uppercase text-[10px] block">Carpet Area Range</span>
                  <span className="font-bold text-stone-900 text-sm">{currentCarpet}</span>
                </div>
                <div>
                  <span className="text-stone-600 font-semibold uppercase text-[10px] block">Possession Date</span>
                  <span className="font-bold text-stone-900 text-sm">{project.possession}</span>
                </div>
              </div>
            </div>

            {/* Vastu Shastra Compliance Summary */}
            <div className="bg-amber-50/60 rounded-3xl p-6 sm:p-8 border border-amber-200/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2.5 text-amber-900">
                <Compass className="w-6 h-6 text-amber-700" />
                <h3 className="font-serif-display text-xl font-bold">
                  Vastu Shastra Orientation Audit
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                {project.vastuNotes}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs text-amber-800 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Verified Ishanya (Water) & Agneya (Fire) spatial harmony.</span>
              </div>
            </div>

            {/* Amenities Grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
              <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                Curated Amenities & Lifestyle Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {project.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800"
                  >
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Floor Plans Section (Show only when floorPlans exist) */}
            {project.floorPlans && project.floorPlans.length > 0 && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                      Approved Floor Plans & Unit Layouts
                    </h3>
                    <p className="text-xs text-stone-500">
                      Standardized architect blueprints with accurate internal carpet demarcation.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {project.floorPlans.map((fp) => {
                    const isPdf = fp.image.startsWith('data:application/pdf') || /\.pdf(?:$|[?#])/i.test(fp.image);
                    return (
                      <div
                        key={fp.id}
                        className="group border border-stone-200 rounded-2xl overflow-hidden bg-stone-50 hover:shadow-md transition-shadow"
                      >
                        <div className="relative aspect-[4/3] bg-white overflow-hidden p-3 flex items-center justify-center">
                          {isPdf ? (
                            <a
                              href={fp.image}
                              target="_blank"
                              rel="noreferrer"
                              className="flex h-full w-full flex-col items-center justify-center gap-3 text-amber-800"
                            >
                              <FileText className="w-12 h-12" />
                              <span className="text-sm font-semibold">Open floor plan PDF</span>
                            </a>
                          ) : (
                            <>
                              <img
                                src={fp.image}
                                alt={fp.title}
                                loading="lazy"
                                decoding="async"
                                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
                              />
                              <button
                                onClick={() => setViewingFloorPlan(fp.image)}
                                className="absolute inset-0 bg-stone-950/30 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-semibold gap-1.5 transition-opacity"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Full Layout</span>
                              </button>
                            </>
                          )}
                        </div>
                        <div className="p-3 border-t border-stone-200 flex items-center justify-between">
                          <span className="text-xs font-bold text-stone-800">{fp.title}</span>
                          <span className="text-[10px] bg-stone-200 px-2 py-0.5 rounded font-mono font-semibold text-stone-700">
                            {fp.type}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* YouTube Walkthrough Tour (Click-to-load thumbnail) */}
            {project.youtubeUrl && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-4">
                <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                  Virtual Architecture Walkthrough
                </h3>
                <p className="text-xs text-stone-500">
                  Take a guided video tour through show-apartments, podium greens, and rooftop lounges.
                </p>
                <YouTubeEmbed
                  url={project.youtubeUrl}
                  title={project.title}
                  customThumbnail={project.images[0]}
                />
              </div>
            )}

            {/* EMI & Home Loan Estimator */}
            <EmiCalculator
              propertyPrice={currentPrice}
              onLoanEnquiry={() => onOpenEnquiry(project.title, 'Pricing & Negotiation')}
            />

          </div>

          {/* Right Column: Sticky Action Desk */}
          <div className="lg:col-span-4 sticky top-32 space-y-6">
            
            {/* Primary Action Card */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-lg space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">
                  Direct Developer Access
                </span>
                <div className="font-serif-display text-3xl font-bold text-stone-900 mt-1">
                  {currentPriceFormatted}
                </div>
                <span className="text-xs text-stone-500">
                  Configuration: <strong className="text-stone-800 font-semibold">{selectedConfig ? selectedConfig.type : project.configuration.join(', ')}</strong>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => onOpenEnquiry(project.title, 'Schedule Site Visit')}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-500/25 flex items-center justify-center gap-2 transition-transform active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Private Site Visit</span>
                </button>

                <button
                  onClick={() => onOpenEnquiry(project.title, 'Instant Callback')}
                  className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Phone className="w-4 h-4 text-amber-400" />
                  <span>Request Instant Callback</span>
                </button>

                <button
                  onClick={() => onOpenEnquiry(project.title, 'Pricing & Negotiation')}
                  className="w-full py-3 px-4 rounded-xl bg-amber-50 hover:bg-amber-100/80 text-amber-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-amber-200"
                >
                  <MessageSquare className="w-4 h-4 text-amber-700" />
                  <span>Submit Purchase Offer / Negotiation</span>
                </button>
              </div>

              {/* Brochure Download (Shown only when available) */}
              {project.brochureUrl && (
                <div className="pt-4 border-t border-stone-100">
                  {project.brochureUrl !== '#download-brochure' ? (
                    <a
                      href={project.brochureUrl}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-2.5 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4 text-amber-700" />
                      <span>Download Brochure (PDF)</span>
                    </a>
                  ) : (
                    <button
                      onClick={() => onOpenEnquiry(project.title, 'Download Brochure')}
                      className="w-full py-2.5 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium border border-stone-200 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Download className="w-4 h-4 text-amber-700" />
                      <span>Request Brochure & Price Sheet (PDF)</span>
                    </button>
                  )}
                </div>
              )}

              {/* Direct Hotline */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs space-y-1">
                <span className="font-semibold text-amber-950 block">Assigned Senior Advisor:</span>
                <p className="text-amber-900">Tejas Shah</p>
                <a href="tel:+919987154120" className="font-mono text-amber-800 font-bold block pt-1 hover:underline">
                  +91 99871 54120
                </a>
              </div>
            </div>

            {/* Trust Assurance Badge */}
            <div className="bg-stone-100/80 rounded-2xl p-4 border border-stone-200 text-xs text-stone-600 space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Zero Brokerage on New Developments</span>
              </div>
              <p className="leading-relaxed text-[11px]">
                Under developer advisory agreements, buyers pay 0% brokerage on developer-direct inventory. Free title audit and legal advisory included.
              </p>
            </div>

          </div>

        </div>

        {/* 4. Related Residences Section */}
        {relatedProjects.length > 0 && (
          <section className="pt-12 border-t border-stone-200 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                  Similar Residences in {project.area}
                </h3>
                <p className="text-xs text-stone-500">
                  Hand-picked alternatives sharing comparable configuration, luxury finishes, and possession timelines.
                </p>
              </div>
              <button
                onClick={onNavigateBack}
                className="text-xs font-semibold text-amber-800 hover:text-amber-900 flex items-center gap-1"
              >
                <span>View all catalogue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((p) => (
                <ProjectCard
                  key={p.id}
                  project={p}
                  onSelect={onSelectProject}
                />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Enlarged Floor Plan Modal */}
      {viewingFloorPlan && (
        <div 
          onClick={() => setViewingFloorPlan(null)}
          className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-3xl p-4 overflow-hidden">
            <button
              onClick={() => setViewingFloorPlan(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-stone-900 text-white z-10"
              aria-label="Close layout"
            >
              ✕
            </button>
            <img
              src={viewingFloorPlan}
              alt="Enlarged floor plan"
              className="max-h-[80vh] w-auto object-contain mx-auto"
            />
          </div>
        </div>
      )}

    </div>
  );
};
