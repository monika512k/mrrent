'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import enTranslations from '../translations/en.json';
import esTranslations from '../translations/es.json';
import deTranslations from '../translations/de.json';
import { Loader } from '../Common/Loader';

type Language = 'en' | 'de';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  setLoader: (isLoading: boolean) => void;
  loader: boolean;
}

const translations = {
  en: enTranslations,
  es: esTranslations,
  de: deTranslations,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('language');
      if (stored === 'en' || stored === 'de') {
        return stored;
      }
    }
    return 'de';
  });
  const [loader, setLoader] = useState(false);

  useEffect(() => {
   
    // Get language from localStorage on initial load
    const savedLanguage = window && window.localStorage.getItem('language') as Language;
    if (savedLanguage && (savedLanguage === 'en'  || savedLanguage === 'de')) {
      setLanguage(savedLanguage);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: unknown = translations[language];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }

    return typeof value === 'string' ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage,setLoader,loader, t }}>
      {loader?<Loader/>:null}
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
} 