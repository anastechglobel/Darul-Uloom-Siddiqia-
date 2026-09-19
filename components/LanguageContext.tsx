'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Language } from '@/lib/types';
import { translations, TranslationDictionary, isRtl } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  lang: Language;
  currentLanguage: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  lang: 'en',
  currentLanguage: 'en',
  setLanguage: () => {},
  t: translations.en,
  isRTL: false,
});

const LANG_STORAGE_KEY = 'dus_preferred_lang';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(LANG_STORAGE_KEY) as Language | null;
        if (stored && ['en', 'hi', 'ur', 'ar'].includes(stored)) {
          return stored;
        }
      } catch {
        // ignore
      }
    }
    return 'en';
  });

  useEffect(() => {
    const rtl = isRtl(language);
    document.documentElement.setAttribute('dir', rtl ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        lang: language,
        currentLanguage: language,
        setLanguage,
        t: translations[language] || translations.en,
        isRTL: isRtl(language),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
