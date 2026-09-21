import React, { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext.tsx';
import { TEACHERS_DATA, TeacherMember } from '../data/teachersData.ts';
import { SectionHeader } from '../components/ui/SectionHeader.tsx';
import { Award, GraduationCap, Sparkles, BookOpen } from 'lucide-react';

interface TeachersViewProps {
  navigate: (route: string) => void;
}

export const TeachersView: React.FC<TeachersViewProps> = ({ navigate }) => {
  const { d, language } = useTranslation();
  const [selectedDept, setSelectedDept] = useState<'all' | 'early' | 'primary' | 'junior' | 'stem'>('all');

  const filteredTeachers = selectedDept === 'all'
    ? TEACHERS_DATA
    : TEACHERS_DATA.filter((t) => t.department === selectedDept);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a182e] via-[#0f2444] to-[#142d54] text-white py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Center of Pedagogical Excellence</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
            {d.teachers.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal">
            {d.teachers.subtitle}
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-16 bg-slate-50 flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {/* Department Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: d.teachers.allDepartments },
              { id: 'early', label: d.teachers.earlyYearsDept },
              { id: 'primary', label: d.teachers.primaryDept },
              { id: 'junior', label: d.teachers.juniorDept },
              { id: 'stem', label: d.teachers.stemDept },
            ].map((tab) => {
              const isActive = selectedDept === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`teacher-tab-${tab.id}`}
                  onClick={() => setSelectedDept(tab.id as any)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0f2444] text-white shadow-md shadow-slate-900/10'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Teacher Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredTeachers.map((teacher: TeacherMember) => (
              <div
                key={teacher.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Photo with overlay */}
                <div className="relative h-64 overflow-hidden bg-slate-100">
                  <img
                    src={teacher.imageUrl}
                    alt={teacher.name[language] || teacher.name.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[11px] font-bold mb-1">
                      {teacher.experience} {d.teachers.experienceLabel}
                    </span>
                    <h3 className="text-lg font-bold font-display leading-snug">
                      {teacher.name[language] || teacher.name.en}
                    </h3>
                  </div>
                </div>

                {/* Body Details */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-amber-600 uppercase tracking-wide">
                      {teacher.position[language] || teacher.position.en}
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-start gap-2">
                        <GraduationCap className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-800">{d.teachers.qualificationLabel}:</strong>{' '}
                          {teacher.qualification}
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <Award className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <span>
                          <strong className="text-slate-800">{d.teachers.specializationLabel}:</strong>{' '}
                          {teacher.specialization[language] || teacher.specialization.en}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-500 leading-relaxed italic border-t border-slate-100 pt-3">
                      “{teacher.bio[language] || teacher.bio.en}”
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Commitment Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-2xl p-8 text-slate-950 text-center shadow-lg">
            <h3 className="text-xl sm:text-2xl font-black font-display">
              Join a Faculty Committed to Excellence
            </h3>
            <p className="text-sm text-slate-900 mt-2 max-w-2xl mx-auto">
              All educators at Albright Academy hold accredited degrees, undergo continuous professional development, and are thoroughly certified in modern child safety standards.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
