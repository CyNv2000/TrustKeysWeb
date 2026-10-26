import React, { useState } from 'react';
import { 
  MapPin, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  Check, 
  Scale, 
  Home, 
  Maximize2 
} from 'lucide-react';
import { Project } from '../types';
import { addToCompare, removeFromCompare, getCompareList } from '../lib/api';

interface ProjectCardProps {
  project: Project;
  onSelect: (slug: string) => void;
  isFirst?: boolean; // For eager loading image
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onSelect, isFirst = false }) => {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [inCompare, setInCompare] = useState(() => getCompareList().includes(project.slug));

  const images = project.images && project.images.length > 0 
    ? project.images 
    : ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'];

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleCompareToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
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

  // Distinct Status Badge Colors
  const getStatusBadge = (status: Project['status']) => {
    switch (status) {
      case 'Ready':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide bg-emerald-600 text-white shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            Ready to Move
          </span>
        );
      case 'Ongoing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide bg-amber-500 text-white shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            Under Construction
          </span>
        );
      case 'Upcoming':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide bg-sky-600 text-white shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            New Launch / Upcoming
          </span>
        );
    }
  };

  return (
    <article 
      onClick={() => onSelect(project.slug)}
      className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-amber-400 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Media Carousel Header */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
        <img
          src={images[currentImgIdx]}
          alt={`${project.title} - ${project.area}`}
          width={800}
          height={500}
          loading={isFirst && currentImgIdx === 0 ? 'eager' : 'lazy'}
          decoding="async"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Soft Sunlit Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-slate-950/20 pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          <div className="flex items-center gap-1.5">
            {getStatusBadge(project.status)}
            {project.featured && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-400 text-slate-950 shadow-sm border border-amber-300">
                <Sparkles className="w-3 h-3 text-slate-950" />
                Featured
              </span>
            )}
          </div>

          {/* Quick Compare Button */}
          <button
            onClick={handleCompareToggle}
            className={`px-2 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md transition-all flex items-center gap-1 shadow-sm ${
              inCompare
                ? 'bg-amber-500 text-white shadow-xs'
                : 'bg-white/90 hover:bg-white text-slate-800 border border-white/60'
            }`}
            title={inCompare ? 'Remove from comparison' : 'Add to compare'}
            aria-label={`Compare ${project.title}`}
          >
            {inCompare ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">In Compare</span>
              </>
            ) : (
              <>
                <Scale className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline text-[11px]">Compare</span>
              </>
            )}
          </button>
        </div>

        {/* Image Nav Arrows (visible on hover or mobile) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4 text-slate-800" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-800 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4 text-slate-800" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1">
              {images.map((_, idx) => (
                <span
                  key={idx}
                  className={`w-1.5 h-1.5 rounded-full transition-all ${
                    idx === currentImgIdx ? 'bg-amber-400 w-3' : 'bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}

        {/* Bottom Locality Badge */}
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-white font-semibold drop-shadow-sm">
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            {project.area}
          </span>
          <span className="text-[11px] text-slate-900 font-semibold tracking-tight bg-white/95 px-2.5 py-0.5 rounded-md shadow-xs backdrop-blur-xs border border-white/60">
            {project.category}
          </span>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Title & MahaRERA */}
          <div className="mb-2">
            <h3 className="font-serif-display text-lg font-bold text-slate-900 group-hover:text-amber-700 transition-colors line-clamp-1">
              {project.title}
            </h3>
            <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
              {project.address}
            </p>
          </div>

          {/* RERA info */}
          {project.reraNumber && (
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 mb-3 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/80 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="font-semibold">MahaRERA:</span>
              <span className="font-mono text-emerald-950 font-bold">{project.reraNumber}</span>
            </div>
          )}

          {/* Key Specs Matrix */}
          <div className="grid grid-cols-2 gap-2 py-2.5 px-3 rounded-xl bg-slate-50 border border-slate-100 text-xs mb-3.5">
            <div className="flex items-center gap-2 text-slate-700">
              <Home className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="block text-[10px] uppercase text-slate-500 font-bold">Config</span>
                <span className="font-bold text-slate-900">{project.configuration.join(', ')}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-slate-700">
              <Maximize2 className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="block text-[10px] uppercase text-slate-500 font-bold">Carpet Area</span>
                <span className="font-bold text-slate-900">{project.carpetArea}</span>
              </div>
            </div>
          </div>

          {/* Per-configuration preview if available */}
          {project.configurations && project.configurations.length > 0 && (
            <div className="mb-3">
              <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">
                Unit Pricing Preview:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {project.configurations.slice(0, 3).map((cfg) => (
                  <span 
                    key={cfg.id}
                    className="text-[11px] px-2.5 py-0.5 rounded-lg bg-amber-50 text-amber-950 border border-amber-200/80"
                  >
                    <strong className="font-bold text-amber-900">{cfg.type}:</strong> {cfg.priceFormatted}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-slate-100 flex items-end justify-between mt-auto">
          <div>
            <span className="block text-[10px] uppercase font-bold text-amber-700 tracking-wider">
              Starting From
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif-display text-xl font-bold text-slate-950">
                {project.startingPriceFormatted}
              </span>
              <span className="text-[10px] text-slate-500 font-normal">+ Taxes</span>
            </div>
            <span className="block text-[11px] text-slate-500 mt-0.5">
              Possession: <strong className="text-slate-800 font-semibold">{project.possession}</strong>
            </span>
          </div>

          <button
            onClick={() => onSelect(project.slug)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-600 via-amber-500 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white transition-all shadow-md shadow-amber-500/25 group-hover:scale-105 active:scale-95"
          >
            <span>Explore</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
