import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  ReactNode,
  useCallback,
} from 'react';
import { Language, TranslationDictionary, SUPPORTED_LANGUAGES } from './types.ts';
import { enTranslations } from './locales/en.ts';
import { amTranslations } from './locales/am.ts';
import { omTranslations } from './locales/om.ts';
import enJson from './en.json';
import amJson from './am.json';
import omJson from './om.json';

export interface LanguageContextType {
  /**
   * The currently active language code ('en' | 'am' | 'om')
   */
  language: Language;

  /**
   * Updates the active language and persists the choice in localStorage & cookies
   */
  setLanguage: (lang: Language) => void;

  /**
   * Fully typed translation dictionary for the active language
   */
  d: TranslationDictionary;

  /**
   * Safe key-path lookup helper with automatic English fallback (e.g. t('nav.home'))
   */
  t: (keyPath: string, fallback?: string) => string;

  /**
   * List of supported language options
   */
  supportedLanguages: typeof SUPPORTED_LANGUAGES;
}

// Deeply merge TypeScript definitions with JSON locale files
function buildDictionary(
  tsDict: TranslationDictionary,
  jsonDict: Record<string, any>
): TranslationDictionary {
  return {
    ...tsDict,
    ...jsonDict,
    common: { ...tsDict.common, ...(jsonDict.common || {}) },
    nav: { ...tsDict.nav, ...(jsonDict.nav || {}) },
    hero: { ...tsDict.hero, ...(jsonDict.hero || {}) },
    about: { ...tsDict.about, ...(jsonDict.about || {}) },
    academics: { ...tsDict.academics, ...(jsonDict.academics || {}) },
    admissions: { ...tsDict.admissions, ...(jsonDict.admissions || {}) },
    teachers: { ...tsDict.teachers, ...(jsonDict.teachers || {}) },
    facilities: { ...tsDict.facilities, ...(jsonDict.facilities || {}) },
    studentLife: { ...tsDict.studentLife, ...(jsonDict.studentLife || {}) },
    news: { ...tsDict.news, ...(jsonDict.news || {}) },
    events: { ...tsDict.events, ...(jsonDict.events || {}) },
    contact: { ...tsDict.contact, ...(jsonDict.contact || {}) },
    portals: { ...tsDict.portals, ...(jsonDict.portals || {}) },
    adminAuth: {
      ...((tsDict as any).adminAuth || {}),
      ...(jsonDict.adminAuth || {}),
    },
    footer: { ...tsDict.footer, ...(jsonDict.footer || {}) },
  } as TranslationDictionary;
}

const dictionaries: Record<Language, TranslationDictionary> = {
  en: buildDictionary(enTranslations, enJson),
  am: buildDictionary(amTranslations, amJson),
  om: buildDictionary(omTranslations, omJson),
};

export const STORAGE_KEY = 'albright_locale';
export const LEGACY_STORAGE_KEY = 'language';
export const COOKIE_NAME = 'preferred_locale';

/**
 * Validates whether an arbitrary string is a supported language code
 */
export function isSupportedLanguage(code: unknown): code is Language {
  return code === 'en' || code === 'am' || code === 'om';
}

/**
 * Reads the preferred language from localStorage across multiple keys
 */
export function getLocaleFromLocalStorage(): Language | null {
  if (typeof window === 'undefined') return null;
  try {
    // 1. Primary key
    const primary = localStorage.getItem(STORAGE_KEY);
    if (isSupportedLanguage(primary)) {
      return primary;
    }

    // 2. Secondary/fallback keys
    const secondary = localStorage.getItem(LEGACY_STORAGE_KEY) || localStorage.getItem('locale');
    if (isSupportedLanguage(secondary)) {
      return secondary;
    }
  } catch {
    // localStorage might be unavailable (e.g. private browsing storage quota)
  }
  return null;
}

/**
 * Reads the preferred language from persistent cookies
 */
export function getLocaleFromCookie(): Language | null {
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
    if (match) {
      const val = decodeURIComponent(match[1].trim());
      if (isSupportedLanguage(val)) {
        return val;
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
    document.cookie = `${COOKIE_NAME}=${encodeURIComponent(
      lang
    )}; path=/; max-age=${maxAge}; expires=${expires}; SameSite=Lax`;
  } catch {
    // Ignore cookie write issues
  }
}

/**
 * Resolves the initial language preference on application boot:
 * 1. localStorage (persisted by user)
 * 2. persistent cookie
 * 3. Default to English ('en')
 */
function getInitialLanguage(): Language {
  // 1. Primary: check localStorage
  const storedLocale = getLocaleFromLocalStorage();
  if (storedLocale) {
    return storedLocale;
  }

  // 2. Secondary: check cookies
  const cookieLocale = getLocaleFromCookie();
  if (cookieLocale) {
    return cookieLocale;
  }

  // 3. Fallback: default to English
  return 'en';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  /**
   * Sets the global active language and guarantees persistence in localStorage and cookies
   */
  const setLanguage = useCallback((newLang: Language) => {
    if (!isSupportedLanguage(newLang)) return;

    setLanguageState(newLang);

    // 1. Persist directly in localStorage across refreshes
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      localStorage.setItem(LEGACY_STORAGE_KEY, newLang);
    } catch {
      // Ignore localStorage quotas or restrictions
    }

    // 2. Sync to cookies for server-side & edge compatibility
    setLocaleCookie(newLang, 365);
  }, []);

  /**
   * Listen to external storage updates (e.g. user changes language in another tab)
   */
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if ((e.key === STORAGE_KEY || e.key === LEGACY_STORAGE_KEY) && isSupportedLanguage(e.newValue)) {
        setLanguageState(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  /**
   * Keep HTML attributes and CSS classes in sync with active language
   */
  useEffect(() => {
    // Ensure persistence is verified on mount
    try {
      localStorage.setItem(STORAGE_KEY, language);
      setLocaleCookie(language, 365);
    } catch {
      // ignore
    }

    // Sync HTML document lang attribute
    document.documentElement.lang = language;

    // Apply native font styling hooks for Amharic Ge'ez & Afaan Oromoo
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

  /**
   * Active dictionary memoized by language
   */
  const dictionary = useMemo(() => {
    return dictionaries[language] || dictionaries.en;
  }, [language]);

  /**
   * Deep key-path lookup with automatic English fallback
   */
  const t = useCallback(
    (keyPath: string, fallback?: string): string => {
      const parts = keyPath.split('.');
      let current: any = dictionary;

      for (const part of parts) {
        if (current && typeof current === 'object' && part in current) {
          current = current[part];
        } else {
          // Fallback to English dictionary
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
    },
    [dictionary]
  );

  const contextValue = useMemo(
    () => ({
      language,
      setLanguage,
      d: dictionary,
      t,
      supportedLanguages: SUPPORTED_LANGUAGES,
    }),
    [language, setLanguage, dictionary, t]
  );

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * Hook to consume the current language state and translation dictionaries
 */
export const useTranslation = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};

export { SUPPORTED_LANGUAGES };
