import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Language, TranslationDictionary, SUPPORTED_LANGUAGES } from './types.ts';
import { enTranslations } from './locales/en.ts';
import { amTranslations } from './locales/am.ts';
import { omTranslations } from './locales/om.ts';
import enJson from './en.json';
import amJson from './am.json';
import omJson from './om.json';

export interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  d: TranslationDictionary;
  t: (keyPath: string, fallback?: string) => string;
}

// Merge JSON files with TypeScript dictionaries to ensure all deep keys are present
const dictionaries: Record<Language, TranslationDictionary> = {
  en: {
    ...enTranslations,
    ...enJson,
    common: { ...enTranslations.common, ...enJson.common },
    nav: { ...enTranslations.nav, ...enJson.nav },
    hero: { ...enTranslations.hero, ...enJson.hero },
    portals: { ...enTranslations.portals, ...enJson.portals },
    footer: { ...enTranslations.footer, ...enJson.footer },
  } as TranslationDictionary,
  am: {
    ...amTranslations,
    ...amJson,
    common: { ...amTranslations.common, ...amJson.common },
    nav: { ...amTranslations.nav, ...amJson.nav },
    hero: { ...amTranslations.hero, ...amJson.hero },
    portals: { ...amTranslations.portals, ...amJson.portals },
    footer: { ...amTranslations.footer, ...amJson.footer },
  } as TranslationDictionary,
  om: {
    ...omTranslations,
    ...omJson,
    common: { ...omTranslations.common, ...omJson.common },
    nav: { ...omTranslations.nav, ...omJson.nav },
    hero: { ...omTranslations.hero, ...omJson.hero },
    portals: { ...omTranslations.portals, ...omJson.portals },
    footer: { ...omTranslations.footer, ...omJson.footer },
  } as TranslationDictionary,
};

export const COOKIE_NAME = 'preferred_locale';
export const STORAGE_KEY = 'albright_locale';

/**
 * Reads the preferred language from persistent cookies
 */
export function getLocaleFromCookie(): Language | null {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
    if (match) {
      const val = decodeURIComponent(match[1].trim());
      if (val === 'en' || val === 'am' || val === 'om') {
        return val as Language;
      }
    }
  } catch {
    // Ignore cookie read issues
  }
  return null;
}

/**
 * Writes the preferred language to a persistent cookie (1 year lifespan)
 */
export function setLocaleCookie(lang: Language, days: number = 365): void {
  if (typeof document === 'undefined') return;
  try {
    const maxAge = days * 24 * 60 * 60;
    const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(lang)}; path=/; max-age=${maxAge}; expires=${expires}; SameSite=Lax`;
  } catch {
    // Ignore cookie write issues
  }
}

function getInitialLanguage(): Language {
  // 1. Primary: Check persistent cookie
  const cookieLocale = getLocaleFromCookie();
  if (cookieLocale) {
    return cookieLocale;
  }

  // 2. Secondary: Check localStorage
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && (saved === 'en' || saved === 'am' || saved === 'om')) {
        return saved as Language;
      }
    } catch {
      // ignore
    }
  }

  return 'en';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      // Persist in cookie (1 year lifespan)
      setLocaleCookie(lang, 365);
      // Also sync to localStorage
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // Ensure cookie is in sync on mount
    setLocaleCookie(language, 365);

    // Update HTML lang attribute and body class for typography
    document.documentElement.lang = language;
    if (language === 'am') {
      document.documentElement.classList.add('lang-am');
      document.documentElement.classList.remove('lang-om');
    } else if (language === 'om') {
      document.documentElement.classList.add('lang-om');
      document.documentElement.classList.remove('lang-am');
    } else {
      document.documentElement.classList.remove('lang-am', 'lang-om');
    }
  }, [language]);

  const dictionary = useMemo(() => {
    return dictionaries[language] || dictionaries.en;
  }, [language]);

  const t = (keyPath: string, fallback?: string): string => {
    const parts = keyPath.split('.');
    let current: any = dictionary;

    for (const part of parts) {
      if (current && typeof current === 'object' && part in current) {
        current = current[part];
      } else {
        // Fallback to English
        let fallbackVal: any = dictionaries.en;
        for (const p of parts) {
          if (fallbackVal && typeof fallbackVal === 'object' && p in fallbackVal) {
            fallbackVal = fallbackVal[p];
          } else {
            return fallback || keyPath;
          }
        }
        return typeof fallbackVal === 'string' ? fallbackVal : fallback || keyPath;
      }
    }

    return typeof current === 'string' ? current : fallback || keyPath;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, d: dictionary, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export { SUPPORTED_LANGUAGES };
