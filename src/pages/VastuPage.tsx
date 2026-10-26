import React, { useState, useMemo } from 'react';
import { 
  Compass, 
  RotateCcw, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Scale, 
  Building2,
  Droplets,
  Flame,
  Globe2,
  Wind,
  Layers
} from 'lucide-react';
import { vastuQuestions } from '../data/vastuData';
import { evaluateVastu } from '../lib/vastuCalculator';

interface VastuPageProps {
  onOpenEnquiry: () => void;
  navigate: (route: string) => void;
}

export const VastuPage: React.FC<VastuPageProps> = ({ onOpenEnquiry, navigate }) => {
  // Initial default answers
  const defaultAnswers: Record<string, string> = {
    entrance: 'north-east',
    kitchen: 'south-east',
    master_bedroom: 'south-west',
    pooja_space: 'north-east',
    toilet: 'north-west',
    living_room: 'north-east',
    shape: 'rectangle',
    sunlight: 'east_north'
  };

  const [answers, setAnswers] = useState<Record<string, string>>(defaultAnswers);
  const [showFullReport, setShowFullReport] = useState(false);

  const evaluation = useMemo(() => {
    return evaluateVastu(answers);
  }, [answers]);

  const handleSelectOption = (questionId: string, optionValue: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionValue
    }));
  };

  const handleReset = () => {
    setAnswers(defaultAnswers);
    setShowFullReport(false);
  };

  return (
    <div className="min-h-screen bg-slate-50/60 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold">
            <Compass className="w-4 h-4 text-amber-700" />
            <span>Interactive Vedic Architecture Assessment</span>
          </div>
          <h1 className="font-serif-display text-4xl sm:text-5xl font-bold text-stone-900 tracking-tight">
            Vastu Shastra Directional Alignment Tool
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Evaluate directional alignment across your entrance, kitchen, master suite, and sanitation sectors. Transparent 0–100 Vedic score calculated instantly in your browser.
          </p>

          {/* Traditional Guidance Disclaimer Notice */}
          <div className="p-4 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-900 flex items-start gap-3 text-left">
            <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-0.5">
              <span className="font-bold">Informational Guidance Disclaimer:</span>
              <p className="text-[11px] text-amber-800 leading-relaxed">
                This digital tool is presented solely as traditional informational guidance and cultural reference based on classical Sthapatya Veda texts. It does not constitute a legal guarantee, structural engineering review, or certified architectural inspection.
              </p>
            </div>
          </div>
        </div>

        {/* Live Score Overview Card - Bright, Sunlit & Radiant */}
        <div className="bg-gradient-to-br from-amber-50/90 via-white to-amber-100/60 text-slate-900 rounded-3xl p-6 sm:p-10 border border-amber-200/90 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Score Ring & Rating */}
            <div className="lg:col-span-5 text-center sm:text-left flex flex-col sm:flex-row items-center gap-6">
              <div className="relative w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-white flex flex-col items-center justify-center border-4 border-amber-500 shadow-lg shrink-0">
                <span className="font-serif-display text-4xl sm:text-5xl font-bold text-amber-600">
                  {evaluation.score}
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
                  / 100 Score
                </span>
              </div>
              <div className="space-y-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${evaluation.badgeColor}`}>
                  {evaluation.rating}
                </span>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {evaluation.summary}
                </p>
              </div>
            </div>

            {/* Element Balance Bars */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-amber-200/80 shadow-xs space-y-3.5">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Pancha Bhoota (Five Elements) Balance:
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                {/* Water */}
                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5 font-medium"><Droplets className="w-3.5 h-3.5 text-sky-500" /> Water (Ishanya)</span>
                    <span className="font-mono font-bold text-slate-900">{evaluation.elementBalance.water}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div style={{ width: `${evaluation.elementBalance.water}%` }} className="h-full bg-sky-500 rounded-full" />
                  </div>
                </div>

                {/* Fire */}
                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5 font-medium"><Flame className="w-3.5 h-3.5 text-amber-500" /> Fire (Agni)</span>
                    <span className="font-mono font-bold text-slate-900">{evaluation.elementBalance.fire}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div style={{ width: `${evaluation.elementBalance.fire}%` }} className="h-full bg-amber-500 rounded-full" />
                  </div>
                </div>

                {/* Earth */}
                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5 font-medium"><Globe2 className="w-3.5 h-3.5 text-emerald-500" /> Earth (Nairutya)</span>
                    <span className="font-mono font-bold text-slate-900">{evaluation.elementBalance.earth}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div style={{ width: `${evaluation.elementBalance.earth}%` }} className="h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>

                {/* Air */}
                <div>
                  <div className="flex justify-between text-slate-700 mb-1">
                    <span className="flex items-center gap-1.5 font-medium"><Wind className="w-3.5 h-3.5 text-teal-500" /> Air (Vayavya)</span>
                    <span className="font-mono font-bold text-slate-900">{evaluation.elementBalance.air}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div style={{ width: `${evaluation.elementBalance.air}%` }} className="h-full bg-teal-500 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Quick Action Controls in Score Box */}
          <div className="mt-8 pt-6 border-t border-amber-200/70 flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
              <span>Reset Assessment</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/projects')}
                className="px-4 py-2 rounded-xl bg-white hover:bg-amber-50 text-amber-950 text-xs font-bold border border-amber-200 transition-colors flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Filter Vastu Compliant Homes</span>
              </button>
              <button
                onClick={onOpenEnquiry}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-400 text-white text-xs font-bold transition-all shadow-md shadow-amber-500/25 active:scale-95"
              >
                <span>Request Custom Layout Audit</span>
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Questions Section */}
        <section className="space-y-8">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <h2 className="font-serif-display text-2xl font-bold text-stone-900">
              Customize Functional Sectors
            </h2>
            <span className="text-xs text-stone-500 font-medium">
              Click any direction to recalculate alignment
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {vastuQuestions.map((q) => {
              const currentVal = answers[q.id];
              return (
                <div
                  key={q.id}
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200 shadow-sm space-y-4"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded border border-amber-200">
                      {q.category}
                    </span>
                    <h3 className="font-serif-display text-lg font-bold text-stone-900 mt-1.5">
                      {q.title}
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      {q.description}
                    </p>
                  </div>

                  {/* Options Radio List */}
                  <div className="space-y-2">
                    {q.options.map((opt) => {
                      const isSelected = currentVal === opt.value;
                      return (
                        <div
                          key={opt.value}
                          onClick={() => handleSelectOption(q.id, opt.value)}
                          className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-amber-50/70 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                              : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between font-semibold">
                            <span className={isSelected ? 'text-stone-900 font-bold' : 'text-stone-800'}>
                              {opt.label}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                              opt.score >= 8
                                ? 'bg-emerald-100 text-emerald-800'
                                : opt.score >= 5
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}>
                              {opt.score}/10 pts
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                            {opt.rationale}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Detailed Item-by-Item Breakdown & Non-Invasive Remedies */}
        <section className="bg-white rounded-3xl p-8 sm:p-12 border border-stone-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-serif-display text-2xl font-bold text-stone-900">
                Actionable Remedies & Sector Notes
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Specific traditional harmonizing tips for your selected orientation choices.
              </p>
            </div>
            <button
              onClick={() => setShowFullReport(!showFullReport)}
              className="text-xs font-semibold text-amber-800 hover:text-amber-900 underline"
            >
              {showFullReport ? 'Hide Detail Table' : 'Show Complete Matrix'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {evaluation.itemBreakdown.map((item) => (
              <div
                key={item.question.id}
                className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900">{item.question.title}</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                    item.status === 'optimal'
                      ? 'bg-emerald-100 text-emerald-800'
                      : item.status === 'moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {item.scorePercent}% Aligned
                  </span>
                </div>
                <div className="text-stone-700">
                  Selected: <strong className="text-stone-900">{item.selectedOption.label}</strong>
                </div>
                {item.selectedOption.remedy && (
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200 text-[11px] text-stone-600 space-y-1">
                    <span className="font-semibold text-amber-800 block">Traditional Harmonizer:</span>
                    <p>{item.selectedOption.remedy}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Consultation CTA */}
          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-stone-500">
              Need a certified on-site Vastu inspection for an upcoming Western Mumbai purchase?
            </div>
            <button
              onClick={onOpenEnquiry}
              className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-semibold text-xs transition-colors"
            >
              Book Advisory Consultation
            </button>
          </div>
        </section>

      </div>
    </div>
  );
};
