import React from 'react';

interface SectionHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  align?: 'center' | 'left';
  dark?: boolean;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  badge,
  title,
  description,
  align = 'center',
  dark = false,
}) => {
  const isCenter = align === 'center';

  return (
    <div className={`mb-12 ${isCenter ? 'text-center max-w-3xl mx-auto' : 'text-left max-w-2xl'}`}>
      {badge && (
        <span
          className={`inline-block px-3.5 py-1 text-xs font-semibold tracking-wide uppercase rounded-full mb-3.5 ${
            dark
              ? 'bg-amber-400/15 text-amber-300 border border-amber-400/30'
              : 'bg-amber-100 text-amber-900 border border-amber-200'
          }`}
        >
          {badge}
        </span>
      )}
      <h2
        className={`text-3xl sm:text-4xl font-bold tracking-tight font-display ${
          dark ? 'text-white' : 'text-[#0f2444]'
        }`}
      >
        {title}
      </h2>
      {description && (
        <p
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            dark ? 'text-slate-300' : 'text-slate-600'
          }`}
        >
          {description}
        </p>
      )}
    </div>
  );
};
