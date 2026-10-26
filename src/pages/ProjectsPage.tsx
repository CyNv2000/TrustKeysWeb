import React, { useEffect, useState } from 'react';
import { ProjectCatalogue } from '../components/ProjectCatalogue';
import { Building2, Compass, ShieldCheck } from 'lucide-react';

interface ProjectsPageProps {
  onSelectProject: (slug: string) => void;
  onOpenEnquiry: (projectTitle?: string) => void;
  queryArea?: string;
  queryStatus?: string;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  onSelectProject,
  queryArea,
  queryStatus
}) => {
  const [initialArea, setInitialArea] = useState<string | undefined>(queryArea);
  const [initialStatus, setInitialStatus] = useState<string | undefined>(queryStatus);

  useEffect(() => {
    if (queryArea) setInitialArea(queryArea);
  }, [queryArea]);

  useEffect(() => {
    if (queryStatus) setInitialStatus(queryStatus);
  }, [queryStatus]);

  return (
    <div className="min-h-screen bg-slate-50/60 pb-16">
      {/* Header Banner - Bright & Luminous */}
      <div className="bg-gradient-to-r from-amber-50 via-white to-amber-50/70 text-slate-900 py-12 border-b border-amber-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300 mb-2">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>Western Mumbai Real Estate Portfolio</span>
              </div>
              <h1 className="font-serif-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-slate-950">
                All Residential Properties
              </h1>
              <p className="text-sm text-slate-600 mt-2 max-w-2xl">
                Explore verified developments across Bandra, Khar, Santacruz, Juhu, Andheri, Goregaon, Malad, Kandivali, and Borivali.
              </p>
            </div>
            
            <div className="flex items-center gap-2 self-start md:self-auto bg-white p-3.5 rounded-2xl border border-amber-200 text-xs text-slate-700 shadow-xs">
              <Compass className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Looking for Vastu-aligned homes? Use our Vastu filter or tool.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Shared Project Catalogue Component */}
      <ProjectCatalogue
        id="main-project-catalogue"
        onSelectProject={onSelectProject}
        presetArea={initialArea}
        presetStatus={initialStatus}
      />
    </div>
  );
};
