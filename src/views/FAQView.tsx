import React, { useState } from 'react';
import { useTranslation } from '../i18n/LanguageContext.tsx';
import { FAQ_DATA, FAQItem } from '../data/faqData.ts';
import { ChevronDown, HelpCircle, Search, MessageSquare, PhoneCall } from 'lucide-react';
import { Button } from '../components/ui/Button.tsx';

interface FAQViewProps {
  navigate: (route: string) => void;
}

export const FAQView: React.FC<FAQViewProps> = ({ navigate }) => {
  const { d, language } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const filteredFAQs = FAQ_DATA.filter((item: FAQItem) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const questionText = item.question[language] || item.question.en;
    const answerText = item.answer[language] || item.answer.en;
    const query = searchQuery.toLowerCase().trim();

    const matchesSearch = !query ||
      questionText.toLowerCase().includes(query) ||
      answerText.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Header */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0a182e] via-[#0f2444] to-[#142d54] text-white py-16 lg:py-24">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>Clear Answers for Prospective & Enrolled Families</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display text-white tracking-tight">
            {d.faq.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-200 max-w-2xl mx-auto font-normal">
            {d.faq.subtitle}
          </p>

          {/* Search Bar */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <input
              type="text"
              id="faq-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={d.faq.searchPlaceholder}
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white text-slate-900 placeholder-slate-400 text-sm shadow-xl focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
          </div>
        </div>
      </section>

      {/* Main FAQs Accordion Section */}
      <section className="py-16 bg-slate-50 flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {[
              { id: 'all', label: d.faq.allCategories },
              { id: 'admissions', label: d.faq.admissionsCat },
              { id: 'academics', label: d.faq.academicsCat },
              { id: 'campus', label: d.faq.campusCat },
            ].map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  id={`faq-cat-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0f2444] text-white shadow-md'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Accordion List */}
          {filteredFAQs.length > 0 ? (
            <div className="space-y-3.5">
              {filteredFAQs.map((faq: FAQItem) => {
                const isOpen = openId === faq.id;
                const questionText = faq.question[language] || faq.question.en;
                const answerText = faq.answer[language] || faq.answer.en;

                return (
                  <div
                    key={faq.id}
                    className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                      isOpen
                        ? 'bg-white border-amber-400/60 shadow-md ring-1 ring-amber-400/20'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <button
                      type="button"
                      id={`faq-toggle-${faq.id}`}
                      onClick={() => toggleAccordion(faq.id)}
                      aria-expanded={isOpen}
                      className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="font-bold text-sm sm:text-base text-slate-900 font-display">
                        {questionText}
                      </span>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-amber-500' : ''
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                        <p>{answerText}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8 space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-lg font-bold text-slate-800">No matching questions found</h3>
              <p className="text-xs sm:text-sm text-slate-500">
                Try searching with different keywords or browse our categories.
              </p>
              <button
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                className="text-xs font-semibold text-amber-600 hover:underline cursor-pointer pt-2"
              >
                Reset Search Filters
              </button>
            </div>
          )}

          {/* Still Have Questions Box */}
          <div className="bg-[#0f2444] text-white p-6 sm:p-8 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl mt-12">
            <div className="space-y-2 text-center sm:text-left">
              <h3 className="text-xl font-bold font-display text-white">
                {d.faq.stillHaveQuestions}
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-lg">
                {d.faq.contactSupportText}
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={() => navigate('/contact')}
                icon={<PhoneCall className="w-4 h-4" />}
              >
                {d.common.contactUs}
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
