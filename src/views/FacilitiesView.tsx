import React, { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext.tsx';
import { FACILITIES_DATA, FacilityItem } from '../data/facilitiesData.ts';
import { CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { Button } from '../components/ui/Button.tsx';

interface FacilitiesViewProps {
  navigate: (route: string) => void;
}

export const FacilitiesView: React.FC<FacilitiesViewProps> = ({ navigate }) => {
  const { d, language } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<'all' | 'academic' | 'technology' | 'recreation' | 'services'>('all');

  const filteredFacilities = activeCategory === 'all'
    ? FACILITIES_DATA
    : FACILITIES_DATA.filter((f) => f.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a182e] via-[#0f2444] to-[#142d54] text-white py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>Safe, Modern & Stimulating Learning Environment</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
            {d.facilities.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal">
            {d.facilities.subtitle}
          </p>
        </div>
      </section>

      {/* Facilities Grid Section */}
      <section className="py-16 bg-slate-50 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: d.common.all },
              { id: 'academic', label: 'Academic & Laboratories' },
              { id: 'technology', label: 'Technology & Robotics' },
              { id: 'recreation', label: 'Sports & Recreation' },
              { id: 'services', label: 'Dining & Transportation' },
            ].map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`facility-tab-${tab.id}`}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0f2444] text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredFacilities.map((facility: FacilityItem) => (
              <div
                key={facility.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-60 overflow-hidden bg-slate-100">
                  <img
                    src={facility.imageUrl}
                    alt={facility.name[language] || facility.name.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-sm text-amber-300 text-xs font-bold border border-amber-400/30">
                      Albright Campus Facility
                    </span>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold font-display text-slate-900 group-hover:text-[#0f2444] transition-colors">
                      {facility.name[language] || facility.name.en}
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {facility.description[language] || facility.description.en}
                    </p>
                  </div>

                  {/* Key Features List */}
                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Key Specifications:
                    </span>
                    <ul className="grid grid-cols-1 gap-1.5 text-xs text-slate-700">
                      {(facility.features[language] || facility.features.en).map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Campus Tour Callout */}
          <div className="bg-[#0f2444] text-white rounded-2xl p-8 lg:p-12 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold font-display text-white">
                Experience Albright Academy in Person
              </h3>
              <p className="text-slate-300 text-sm max-w-xl">
                We invite prospective families and scholars for a guided campus tour every Tuesday and Thursday morning.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="primary"
                onClick={() => navigate('/admissions')}
              >
                {d.common.applyNow}
              </Button>
              <Button
                variant="outline"
                className="text-white border-white/20 hover:bg-white/10"
                onClick={() => navigate('/contact')}
              >
                Schedule a Visit
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
