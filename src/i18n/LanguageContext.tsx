import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { Language, TranslationDictionary, SUPPORTED_LANGUAGES } from './types.ts';
import { enTranslations } from './locales/en.ts';
import { amTranslations } from './locales/am.ts';
import { omTranslations } from './locales/om.ts';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  d: TranslationDictionary;
  t: (keyPath: string, fallback?: string) => string;
}

const dictionaries: Record<Language, TranslationDictionary> = {
  en: enTranslations,
  am: amTranslations,
  om: omTranslations,
};

const STORAGE_KEY = 'albright_locale';
const COOKIE_NAME = 'preferred_locale';

function getInitialLanguage(): Language {
  // 1. Check localStorage
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && (saved === 'en' || saved === 'am' || saved === 'om')) {
      return saved as Language;
    }
  } catch {
    // ignore
  }

  // 2. Check Cookie
  try {
    const match = document.cookie.match(new RegExp(`(^|;\\s*)(${COOKIE_NAME})=([^;]+)`));
    if (match && (match[3] === 'en' || match[3] === 'am' || match[3] === 'om')) {
      return match[3] as Language;
    }
  } catch {
    // ignore
  }

  return 'en';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      // Also persist to cookie for server/persistence consistency
      document.cookie = `${COOKIE_NAME}=${lang}; path=/; max-age=31536000; SameSite=Lax`;
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    // Update HTML lang attribute
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
