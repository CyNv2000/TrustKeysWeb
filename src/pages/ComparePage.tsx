import React, { useState, useEffect } from 'react';
import { 
  Scale, 
  Trash2, 
  Plus, 
  ArrowRight, 
  ShieldCheck, 
  Building2, 
  ExternalLink, 
  Home, 
  Maximize2, 
  Car, 
  Layers, 
  Compass,
  AlertCircle
} from 'lucide-react';
import { Project } from '../types';
import { getCompareList, removeFromCompare, clearCompareList, fetchProjectBySlug } from '../lib/api';

interface ComparePageProps {
  onSelectProject: (slug: string) => void;
  onOpenEnquiry: (projectTitle: string) => void;
  navigate: (route: string) => void;
}

export const ComparePage: React.FC<ComparePageProps> = ({
  onSelectProject,
  onOpenEnquiry,
  navigate
}) => {
  const [slugs, setSlugs] = useState<string[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const reloadCompare = async () => {
    setIsLoading(true);
    const list = getCompareList();
    setSlugs(list);

    if (list.length === 0) {
      setProjects([]);
      setIsLoading(false);
      return;
    }

    try {
      const loaded = await Promise.all(
        list.map((slug) => fetchProjectBySlug(slug).catch(() => null))
      );
      setProjects(loaded.filter((p): p is Project => p !== null));
    } catch {
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reloadCompare();
    const handleUpdate = () => reloadCompare();
    window.addEventListener('compare_updated', handleUpdate);
    return () => window.removeEventListener('compare_updated', handleUpdate);
  }, []);

  const handleRemove = (slug: string) => {
    removeFromCompare(slug);
    reloadCompare();
  };

  const handleClearAll = () => {
    clearCompareList();
    reloadCompare();
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-200 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
              <Scale className="w-4 h-4 text-amber-700" />
              <span>Multi-Property Evaluation Matrix</span>
            </div>
            <h1 className="font-serif-display text-3xl sm:text-4xl font-bold text-stone-900">
              Side-by-Side Residence Comparison
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Evaluate up to 3 Western Mumbai residences across pricing, configurations, carpet area, possession, and Vastu alignment.
            </p>
          </div>

          {projects.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleClearAll}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 text-xs font-semibold border border-stone-300 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All ({projects.length})</span>
              </button>
              <button
                onClick={() => navigate('/projects')}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5 active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add More</span>
              </button>
            </div>
          )}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-12 text-center text-stone-500 font-medium">
            Loading comparison matrix...
          </div>
        ) : projects.length === 0 ? (
          /* Empty State: Instructions on how to add */
          <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center max-w-xl mx-auto shadow-sm space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
              <Scale className="w-8 h-8" />
            </div>
            <div>
              <h2 className="font-serif-display text-2xl font-bold text-stone-900 mb-2">
                Your Comparison Tray is Empty
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed max-w-md mx-auto">
                Compare up to 3 Western Mumbai residences side-by-side. To add properties:
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-5 text-left text-xs text-stone-700 space-y-3 border border-stone-200">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <span>Browse our verified properties on the <strong>Home</strong> or <strong>Projects</strong> page.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <span>Click the <strong>Compare</strong> button located on any project card or detail page.</span>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <span>Return here to review prices, possession timelines, carpet specifications, and amenities side by side.</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/projects')}
              className="px-6 py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider shadow-md shadow-amber-900/20 inline-flex items-center gap-2"
            >
              <span>Explore Projects Catalogue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* Comparison Matrix Table */
          <div className="overflow-x-auto bg-white rounded-3xl border border-stone-200 shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50/80">
                  <th className="p-4 sm:p-6 w-1/4 min-w-[200px] text-xs font-bold uppercase tracking-wider text-stone-600">
                    Feature / Attribute
                  </th>
                  {projects.map((p) => (
                    <th key={p.id} className="p-4 sm:p-6 w-1/4 min-w-[260px] align-top">
                      <div className="space-y-3">
                        <div className="relative aspect-[16/10] rounded-xl overflow-hidden bg-stone-100">
                          <img
                            src={p.images[0]}
                            alt={p.title}
                            width={400}
                            height={250}
                            className="w-full h-full object-cover"
                          />
                          <button
                            onClick={() => handleRemove(p.slug)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-stone-900/80 hover:bg-red-600 text-white text-xs transition-colors"
                            title="Remove from comparison"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div>
                          <h3 className="font-serif-display text-base font-bold text-stone-900">
                            {p.title}
                          </h3>
                          <span className="text-xs text-stone-500 block">
                            {p.area}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onSelectProject(p.slug)}
                            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-xs"
                          >
                            <span>View Details</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </th>
                  ))}
                  {/* Fill empty slot if fewer than 3 */}
                  {projects.length < 3 && (
                    <th className="p-4 sm:p-6 w-1/4 min-w-[220px] align-middle text-center bg-stone-50/40 border-l border-stone-100">
                      <div className="p-6 border-2 border-dashed border-stone-300 rounded-2xl space-y-3">
                        <Building2 className="w-8 h-8 text-stone-400 mx-auto" />
                        <span className="block text-xs font-medium text-stone-500">
                          Add 1 more residence to compare
                        </span>
                        <button
                          onClick={() => navigate('/projects')}
                          className="px-3 py-1.5 rounded-lg bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold"
                        >
                          Select Residence
                        </button>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-xs">
                
                {/* Starting Price */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 sm:p-6 font-semibold text-stone-600">Starting Price</td>
                  {projects.map((p) => (
                    <td key={p.id} className="p-4 sm:p-6 font-serif-display text-lg font-bold text-amber-900">
                      {p.startingPriceFormatted}
                    </td>
                  ))}
                  {projects.length < 3 && <td />}
                </tr>

                {/* Status */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 sm:p-6 font-semibold text-stone-600">Status</td>
                  {projects.map((p) => (
                    <td key={p.id} className="p-4 sm:p-6">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-bold text-white ${
                        p.status === 'Ready' ? 'bg-emerald-700' : p.status === 'Ongoing' ? 'bg-amber-600' : 'bg-sky-700'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                  ))}
                  {projects.length < 3 && <td />}
                </tr>

                {/* Configurations */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 sm:p-6 font-semibold text-stone-600">Configurations</td>
                  {projects.map((p) => (
                    <td key={p.id} className="p-4 sm:p-6 font-semibold text-stone-800">
                      {p.configuration.join(', ')}
                    </td>
                  ))}
                  {projects.length < 3 && <td />}
                </tr>

                {/* Carpet Area */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 sm:p-6 font-semibold text-stone-600">Carpet Area</td>
                  {projects.map((p) => (
                    <td key={p.id} className="p-4 sm:p-6 text-stone-700 font-mono">
                      {p.carpetArea}
                    </td>
                  ))}
                  {projects.length < 3 && <td />}
                </tr>

                {/* Possession Timeline */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 sm:p-6 font-semibold text-stone-600">Possession</td>
                  {projects.map((p) => (
                    <td key={p.id} className="p-4 sm:p-6 text-stone-800 font-medium">
                      {p.possession}
                    </td>
                  ))}
                  {projects.length < 3 && <td />}
                </tr>

                {/* Parking Facilities */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 sm:p-6 font-semibold text-stone-600">Parking Allocation</td>
                  {projects.map((p) => (
                    <td key={p.id} className="p-4 sm:p-6 text-stone-700">
                      {p.parking}
                    </td>
                  ))}
                  {projects.length < 3 && <td />}
                </tr>

                {/* Balcony / Sundecks */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 sm:p-6 font-semibold text-stone-600">Balcony / Sundeck</td>
                  {projects.map((p) => (
                    <td key={p.id} className="p-4 sm:p-6 text-stone-700">
                      {p.balcony}
                    </td>
                  ))}
                  {projects.length < 3 && <td />}
                </tr>

                {/* MahaRERA Registration */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 sm:p-6 font-semibold text-stone-600">MahaRERA Number</td>
                  {projects.map((p) => (
                    <td key={p.id} className="p-4 sm:p-6 font-mono text-emerald-800 font-bold">
                      {p.reraNumber || 'Verified Exemption'}
                    </td>
                  ))}
                  {projects.length < 3 && <td />}
                </tr>

                {/* Vastu Compliance */}
                <tr className="hover:bg-stone-50/50">
                  <td className="p-4 sm:p-6 font-semibold text-stone-600">Vastu Assessment</td>
                  {projects.map((p) => (
                    <td key={p.id} className="p-4 sm:p-6 text-stone-700">
                      {p.vastuNotes}
                    </td>
                  ))}
                  {projects.length < 3 && <td />}
                </tr>

                {/* Direct Action */}
                <tr className="bg-stone-50/50">
                  <td className="p-4 sm:p-6 font-semibold text-stone-600">Enquire for Residence</td>
                  {projects.map((p) => (
                    <td key={p.id} className="p-4 sm:p-6">
                      <button
                        onClick={() => onOpenEnquiry(p.title)}
                        className="w-full py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs uppercase tracking-wider transition-colors shadow-sm"
                      >
                        Enquire Now
                      </button>
                    </td>
                  ))}
                  {projects.length < 3 && <td />}
                </tr>

              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
};
