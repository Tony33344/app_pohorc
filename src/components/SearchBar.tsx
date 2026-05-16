import React from 'react';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import type { Language } from '../types';

interface SearchBarProps {
  language: Language;
}

export function SearchBar({ language }: SearchBarProps) {
  const placeholders = {
    sl: {
      where: 'Kam želite?',
      dates: 'Prijava - Odjava',
      guests: 'Gostje',
      search: 'Iskanje'
    },
    en: {
      where: 'Where to?',
      dates: 'Check in - Check out',
      guests: 'Guests',
      search: 'Search'
    },
    de: {
      where: 'Wohin?',
      dates: 'Check-in - Check-out',
      guests: 'Gäste',
      search: 'Suche'
    }
  };

  const t = placeholders[language];
  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg shadow-lg p-4">
        <div className="flex-1 flex items-center gap-2 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4">
          <MapPin className="w-5 h-5 text-emerald-600" />
          <input
            type="text"
            placeholder={t.where}
            className="w-full outline-none text-gray-600"
          />
        </div>
        
        <div className="flex-1 flex items-center gap-2 border-b md:border-b-0 md:border-r border-gray-200 pb-4 md:pb-0 md:pr-4">
          <Calendar className="w-5 h-5 text-emerald-600" />
          <input
            type="text"
            placeholder={t.dates}
            className="w-full outline-none text-gray-600"
          />
        </div>
        
        <div className="flex-1 flex items-center gap-2">
          <Users className="w-5 h-5 text-emerald-600" />
          <input
            type="text"
            placeholder={t.guests}
            className="w-full outline-none text-gray-600"
          />
        </div>
        
        <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 flex items-center gap-2">
          <Search className="w-5 h-5" />
          <span>{t.search}</span>
        </button>
      </div>
    </div>
  );
}
