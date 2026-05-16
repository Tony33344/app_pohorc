import React from 'react';
import { Language } from '../types';

interface LanguageSelectorProps {
  currentLanguage: Language;
  onLanguageChange: (language: Language) => void;
}

export function LanguageSelector({ currentLanguage, onLanguageChange }: LanguageSelectorProps) {
  return (
    <div className="flex gap-2">
      {(['sl', 'en', 'de'] as Language[]).map((lang) => (
        <button
          key={lang}
          onClick={() => onLanguageChange(lang)}
          className={`px-2 py-1 rounded ${
            currentLanguage === lang
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
