import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import { SchoolSettings } from '../../types/index.ts';
import { Button } from '../ui/Button.tsx';
import { useTranslation } from '../../i18n/LanguageContext.tsx';

export interface HeroProps {
  navigate: (route: string) => void;
  settings?: SchoolSettings | null;
}

export const Hero: React.FC<HeroProps> = ({ navigate, settings }) => {
  const { d } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#071324] via-[#0f2444] to-[#142d54] text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Subtle background texture grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Supporting Text, CTAs, Key Indicators */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-semibold tracking-wide uppercase">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{d.common.admissionsOpenBadge}</span>
            </div>

            {/* Animated Moving Title: Albright Academy — Center of Excellence and Innovation */}
            <motion.div
              className="relative py-1"
              animate={{ y: [0, -3, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight font-display leading-[1.15] text-white">
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, x: -25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  {d.hero.headline}
                </motion.span>{' '}
                <span className="text-amber-400 font-light">—</span>{' '}
                <motion.span
                  className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-400 to-amber-200"
                  initial={{ opacity: 0, x: 25 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                >
                  {d.hero.headlineHighlight}
                </motion.span>
              </h1>
            </motion.div>

            <p className="text-base sm:text-lg text-slate-200 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-normal">
              {d.hero.supportingText}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Button
                id="hero-apply-btn"
                variant="gold"
                size="lg"
                onClick={() => navigate('/admissions')}
                icon={<ArrowRight className="w-5 h-5" />}
                className="w-full sm:w-auto shadow-lg shadow-amber-500/20 cursor-pointer"
              >
                {d.common.applyNow}
              </Button>
              <Button
                id="hero-explore-btn"
                variant="outline"
                size="lg"
                onClick={() => navigate('/academics')}
                className="w-full sm:w-auto bg-white/10 text-white border-white/20 hover:bg-white/20 hover:text-white cursor-pointer"
              >
                {d.common.exploreSchool}
              </Button>
            </div>

            {/* Key Indicators */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-slate-700/60 max-w-lg mx-auto lg:mx-0 text-left">
              <div>
                <div className="text-2xl font-black text-amber-400 font-display">
                  {d.hero.statGrades}
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {d.hero.statGradesLabel}
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400 font-display">
                  {d.hero.statRatio}
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {d.hero.statRatioLabel}
                </div>
              </div>
              <div>
                <div className="text-2xl font-black text-amber-400 font-display">
                  {d.hero.statExcellence}
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {d.hero.statExcellenceLabel}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Image with Floating Badge */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 bg-slate-800">
              <img
                src="https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=1200&q=80"
                alt={d.hero.imageAlt || `${d.common.schoolName} Students`}
                className="w-full h-[420px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071324]/90 via-transparent to-transparent" />

              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-900/90 backdrop-blur-md border border-amber-400/30 text-white">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white p-0.5 shadow-md shrink-0 overflow-hidden flex items-center justify-center border border-amber-400/40">
                    <img
                      src={settings?.logoUrl || '/logo.png'}
                      alt={d.common.schoolName}
                      className="w-full h-full object-contain rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                      {d.hero.floatingBadgeTitle}
                    </p>
                    <p className="text-xs text-white leading-tight mt-0.5">
                      {d.hero.floatingBadgeDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
