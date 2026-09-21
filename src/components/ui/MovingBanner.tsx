import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Award, Play, Pause, ShieldCheck } from 'lucide-react';
import { useTranslation } from '../../i18n/LanguageContext.tsx';
import { SchoolSettings } from '../../types/index.ts';

interface MovingBannerProps {
  variant?: 'dark' | 'gold' | 'compact';
  className?: string;
  showControls?: boolean;
  settings?: SchoolSettings | null;
  // Overrides for live preview inside Admin Console
  overrideText?: string;
  overrideBadge?: string;
  overrideSubtext?: string;
  overrideSecondaryText?: string;
  overrideSpeed?: 'fast' | 'normal' | 'slow';
}

export const MovingBanner: React.FC<MovingBannerProps> = ({
  variant = 'dark',
  className = '',
  showControls = false,
  settings,
  overrideText,
  overrideBadge,
  overrideSubtext,
  overrideSecondaryText,
  overrideSpeed,
}) => {
  const { language } = useTranslation();
  const [isPaused, setIsPaused] = useState(false);

  // If ticker has been explicitly disabled by Admin and not in override mode
  if (settings && settings.tickerEnabled === false && !overrideText) {
    return null;
  }

  // Translated subtitle according to language
  const mottoSubtitle =
    language === 'am'
      ? 'የልህቀት እና የፈጠራ ማዕከል • ከኬጂ1 እስከ 8ኛ ክፍል'
      : language === 'om'
      ? 'Wiirtuu Gahumsaa fi Kalaqaa • KG1 hanga Kutaa 8ffaa'
      : 'Center of Excellence and Innovation • KG1 to Grade 8';

  const mainText =
    overrideText ?? settings?.tickerText ?? 'Albright Academy — Center of Excellence and Innovation';
  const badgeText = overrideBadge ?? settings?.tickerBadge ?? 'Created by Admin';
  const subText = overrideSubtext ?? settings?.tickerSubtext ?? mottoSubtitle;
  const secondaryText =
    overrideSecondaryText ??
    settings?.tickerSecondaryText ??
    'Admissions Open 2026/2018 E.C. — Sheggar City, Gefarsa Gujjee, kella';
  const speedMode = overrideSpeed ?? settings?.tickerSpeed ?? 'normal';

  const defaultDuration = speedMode === 'fast' ? 16 : speedMode === 'slow' ? 36 : 24;
  const [speed, setSpeed] = useState<number>(defaultDuration);

  useEffect(() => {
    setSpeed(defaultDuration);
  }, [defaultDuration]);

  const marqueeItems = [
    { type: 'primary', badge: badgeText, text: mainText, highlight: true },
    { type: 'sub', text: subText, highlight: false },
    { type: 'secondary', badge: 'Notice', text: secondaryText, highlight: true },
    { type: 'primary', badge: badgeText, text: mainText, highlight: true },
    { type: 'sub', text: subText, highlight: false },
    { type: 'secondary', badge: 'Admissions', text: secondaryText, highlight: true },
  ];

  const isGold = variant === 'gold';
  const isCompact = variant === 'compact';

  return (
    <div
      id="albright-moving-motto-banner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      title="Albright Academy Announcement Ticker • Created and Managed by Admin"
      className={`relative w-full overflow-hidden border-y select-none transition-colors group ${
        isGold
          ? 'bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 border-amber-600/30 py-2.5 font-bold shadow-xs'
          : isCompact
          ? 'bg-[#071324] text-amber-300 border-slate-800/80 py-1.5 text-xs'
          : 'bg-gradient-to-r from-[#061224] via-[#0d2242] to-[#061224] text-amber-300 border-amber-500/20 py-2.5 shadow-inner'
      } ${className}`}
      aria-label="Albright Academy Announcement Ticker"
    >
      {/* Edge fades for smooth infinite stream effect */}
      {isGold ? (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-amber-500 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-amber-500 to-transparent z-10 pointer-events-none" />
        </>
      ) : (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-r from-[#061224] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-10 sm:w-16 bg-gradient-to-l from-[#061224] to-transparent z-10 pointer-events-none" />
        </>
      )}

      {showControls && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 hidden md:flex items-center gap-1.5 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full text-[10px] text-white border border-white/10 shadow-sm">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsPaused(!isPaused);
            }}
            className="hover:text-amber-400 transition-colors cursor-pointer p-0.5 flex items-center gap-1"
            title={isPaused ? 'Resume animation' : 'Pause animation'}
          >
            {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            <span className="text-[9px] uppercase font-semibold tracking-wider">
              {isPaused ? 'Play' : 'Pause'}
            </span>
          </button>
          <span className="text-slate-500">|</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setSpeed(speed === 16 ? 24 : speed === 24 ? 36 : 16);
            }}
            className="hover:text-amber-400 transition-colors cursor-pointer px-1 font-mono text-[10px]"
            title="Toggle animation speed"
          >
            {speed === 16 ? 'Fast (16s)' : speed === 24 ? 'Normal (24s)' : 'Slow (36s)'}
          </button>
        </div>
      )}

      <div className="flex w-max">
        {/* Track 1 */}
        <motion.div
          className="flex shrink-0 items-center gap-6 sm:gap-10 pr-6 sm:pr-10 will-change-transform"
          animate={isPaused ? {} : { x: ['0%', '-100%'] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          }}
        >
          {marqueeItems.map((item, idx) => (
            <div key={`m1-${idx}`} className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Logo / Icon */}
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full overflow-hidden shrink-0 ${
                  isGold ? 'bg-white p-0.5 shadow-2xs' : 'bg-white p-0.5 shadow-2xs'
                }`}
              >
                {idx % 3 === 0 ? (
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : idx % 3 === 1 ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                )}
              </span>

              {/* Admin Attribution Badge */}
              {item.badge && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 shadow-xs ${
                    isGold
                      ? 'bg-slate-950 text-amber-300 border border-slate-800'
                      : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
                  {item.badge}
                </span>
              )}

              {/* Text */}
              <span
                className={`tracking-wide text-xs sm:text-sm uppercase ${
                  item.highlight
                    ? isGold
                      ? 'font-black text-slate-950 tracking-wider'
                      : 'font-extrabold text-white drop-shadow-xs tracking-wider'
                    : isGold
                    ? 'font-semibold text-slate-900/90'
                    : 'font-medium text-amber-200/90'
                }`}
              >
                {item.text}
              </span>

              <span
                className={`font-bold ${isGold ? 'text-slate-900/40' : 'text-amber-400/60'}`}
              >
                •
              </span>
            </div>
          ))}
        </motion.div>

        {/* Track 2 (Seamless duplicate for infinite loop) */}
        <motion.div
          className="flex shrink-0 items-center gap-6 sm:gap-10 pr-6 sm:pr-10 will-change-transform"
          animate={isPaused ? {} : { x: ['0%', '-100%'] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: speed,
            ease: 'linear',
          }}
          aria-hidden="true"
        >
          {marqueeItems.map((item, idx) => (
            <div key={`m2-${idx}`} className="flex items-center gap-3 sm:gap-4 shrink-0">
              {/* Logo / Icon */}
              <span
                className={`flex items-center justify-center w-6 h-6 rounded-full overflow-hidden shrink-0 ${
                  isGold ? 'bg-white p-0.5 shadow-2xs' : 'bg-white p-0.5 shadow-2xs'
                }`}
              >
                {idx % 3 === 0 ? (
                  <img
                    src="/logo.png"
                    alt="Logo"
                    className="w-full h-full object-contain"
                    referrerPolicy="no-referrer"
                  />
                ) : idx % 3 === 1 ? (
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                ) : (
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                )}
              </span>

              {/* Admin Attribution Badge */}
              {item.badge && (
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shrink-0 shadow-xs ${
                    isGold
                      ? 'bg-slate-950 text-amber-300 border border-slate-800'
                      : 'bg-amber-400/20 text-amber-300 border border-amber-400/40'
                  }`}
                >
                  <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
                  {item.badge}
                </span>
              )}

              {/* Text */}
              <span
                className={`tracking-wide text-xs sm:text-sm uppercase ${
                  item.highlight
                    ? isGold
                      ? 'font-black text-slate-950 tracking-wider'
                      : 'font-extrabold text-white drop-shadow-xs tracking-wider'
                    : isGold
                    ? 'font-semibold text-slate-900/90'
                    : 'font-medium text-amber-200/90'
                }`}
              >
                {item.text}
              </span>

              <span
                className={`font-bold ${isGold ? 'text-slate-900/40' : 'text-amber-400/60'}`}
              >
                •
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};
