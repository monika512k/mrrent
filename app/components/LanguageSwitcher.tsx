'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'Deutsch' },
];

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Set German as default on first mount
  useEffect(() => {
    if (window&&!localStorage.getItem('language')) {
      setLanguage('de');
    }else{
      setLanguage(window&&localStorage.getItem('language') as 'en' | 'de');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageChange = (langCode: string) => {
    setLanguage(langCode as 'en' | 'de');
    localStorage.setItem('language', langCode);
    setIsOpen(false);
  };

  const renderFlag = (langCode: string) => {
    switch (langCode) {
      case 'en':
        return (
          <svg width="20" height="15" viewBox="0 0 60 30">
            <clipPath id="s">
              <path d="M0,0 v30 h60 v-30 z" />
            </clipPath>
            <clipPath id="t">
              <path d="M30,15 h30 v15 h-30 z M0,0 h30 v15 h-30 z" />
            </clipPath>
            <g clipPath="url(#s)">
              <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
              <path d="M0,0 l60,30 M60,0 l-60,30" stroke="#fff" strokeWidth="6" />
              <path d="M0,0 l60,30 M60,0 l-60,30" clipPath="url(#t)" stroke="#C8102E" strokeWidth="4" />
              <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
              <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
            </g>
          </svg>
        );
      case 'de':
        return (
          <svg width="20" height="15" viewBox="0 0 5 3">
            <rect width="5" height="1" y="0" fill="#000" />
            <rect width="5" height="1" y="1" fill="#D00" />
            <rect width="5" height="1" y="2" fill="#FFCE00" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="relative " ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex cursor-pointer items-center gap-2 w-28 h-11 px-2 border border-[#F6F6F6] rounded bg-[#F6F6F60D] justify-center text-white hover:bg-[#F6F6F61A] transition-colors"
        aria-label="Select language"
      >
        {renderFlag(language)}
        <span className="uppercase">{language}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-36 bg-[#121212] border border-[#F6F6F6] rounded shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`w-full px-4 py-2 text-left text-white hover:bg-[#F6F6F61A] transition-colors flex items-center gap-2 ${
                language === lang.code ? 'bg-[#F6F6F61A]' : ''
              }`}
            >
              {renderFlag(lang.code)}
              {lang.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
