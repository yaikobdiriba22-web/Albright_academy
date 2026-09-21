import React from 'react';
import { useTranslation, SUPPORTED_LANGUAGES } from '../../i18n/LanguageContext.tsx';
import { Globe } from 'lucide-react';
import { Language } from '../../i18n/types.ts';

interface LanguageSwitcherProps {
  variant?: 'light' | 'dark' | 'minimal';
  className?: string;
  showIcon?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'light',
  className = '',
  showIcon = true,
}) => {
  const { language, setLanguage } = useTranslation();

  const handleSelect = (code: Language) => {
    setLanguage(code);
  };

  return (
    <div
      className={`inline-flex items-center gap-1 p-1 rounded-full border text-xs font-semibold select-none ${
        variant === 'dark'
          ? 'bg-slate-900/90 border-slate-700 text-slate-300'
          : variant === 'minimal'
          ? 'bg-transparent border-transparent'
          : 'bg-slate-100 border-slate-200 text-slate-700'
      } ${className}`}
      role="group"
      aria-label="Language Selector"
    >
      {showIcon && (
        <span className="pl-1.5 pr-0.5 text-amber-500 flex items-center" aria-hidden="true">
          <Globe className="w-3.5 h-3.5" />
        </span>
      )}

      {SUPPORTED_LANGUAGES.map((lang) => {
        const isActive = language === lang.code;
        return (
          <button
            key={lang.code}
            id={`lang-select-${lang.code}`}
            type="button"
            onClick={() => handleSelect(lang.code)}
            aria-pressed={isActive}
            aria-label={`Switch language to ${lang.name}`}
            className={`px-2.5 py-1 rounded-full transition-all duration-150 cursor-pointer ${
              isActive
                ? 'bg-[#0f2444] text-white shadow-sm font-bold scale-[1.02]'
                : variant === 'dark'
                ? 'hover:text-white hover:bg-slate-800 text-slate-400'
                : 'hover:text-[#0f2444] hover:bg-slate-200 text-slate-600'
            }`}
          >
            {lang.shortLabel}
          </button>
        );
      })}
    </div>
  );
};
