import React, { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext.tsx';
import { STUDENT_LIFE_DATA, StudentLifeActivity } from '../data/studentLifeData.ts';
import { Sparkles, Trophy, Palette, Globe, Compass, Cpu, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/Button.tsx';

interface StudentLifeViewProps {
  navigate: (route: string) => void;
}

export const StudentLifeView: React.FC<StudentLifeViewProps> = ({ navigate }) => {
  const { d, language } = useTranslation();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const filteredActivities = activeCategory === 'all'
    ? STUDENT_LIFE_DATA
    : STUDENT_LIFE_DATA.filter((item) => item.category === activeCategory);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a182e] via-[#0f2444] to-[#142d54] text-white py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Holistic Development • Sports, Arts, Clubs & Heritage</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
            {d.studentLife.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal">
            {d.studentLife.subtitle}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-slate-50 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: d.common.all },
              { id: 'sports', label: d.studentLife.sportsTitle },
              { id: 'clubs', label: d.studentLife.clubsTitle },
              { id: 'arts', label: d.studentLife.artsTitle },
              { id: 'competitions', label: d.studentLife.competitionsTitle },
              { id: 'trips', label: d.studentLife.tripsTitle },
              { id: 'projects', label: d.studentLife.projectsTitle },
              { id: 'culture', label: d.studentLife.cultureTitle },
            ].map((tab) => {
              const isActive = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`studentlife-tab-${tab.id}`}
                  onClick={() => setActiveCategory(tab.id)}
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

          {/* Activities Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map((activity: StudentLifeActivity) => (
              <div
                key={activity.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                <div className="relative h-56 overflow-hidden bg-slate-100">
                  <img
                    src={activity.imageUrl}
                    alt={activity.title[language] || activity.title.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-bold uppercase tracking-wider inline-block mb-1">
                      {activity.category}
                    </span>
                    <h3 className="text-lg font-bold font-display leading-snug">
                      {activity.title[language] || activity.title.en}
                    </h3>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                      {activity.subtitle[language] || activity.subtitle.en}
                    </p>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {activity.description[language] || activity.description.en}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 space-y-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                      Program Highlights:
                    </span>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {(activity.items[language] || activity.items.en).map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Student Life Callout */}
          <div className="bg-[#0f2444] text-white p-8 sm:p-10 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-2xl font-bold font-display text-white">
                Nurturing Character & Lifelong Joy
              </h3>
              <p className="text-slate-300 text-sm max-w-xl">
                Every child at Albright Academy discovers their distinct talent through caring mentorship and structured exploration.
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => navigate('/admissions')}
              className="shrink-0"
            >
              {d.common.applyNow}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};
