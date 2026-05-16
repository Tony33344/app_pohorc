import React, { useState } from 'react';
import { TreePine, Menu, X } from 'lucide-react';
import { Language } from '../types';
import { LanguageSelector } from './LanguageSelector';

const navigation = {
  sl: {
    explore: 'Raziskuj',
    about: 'O nas',
    gallery: 'Galerija',
    contact: 'Kontakt',
    location: 'Kje smo'
  },
  en: {
    explore: 'Explore',
    about: 'About',
    gallery: 'Gallery',
    contact: 'Contact',
    location: 'Location'
  },
  de: {
    explore: 'Entdecken',
    about: 'Über uns',
    gallery: 'Galerie',
    contact: 'Kontakt',
    location: 'Standort'
  }
};

interface HeaderProps {
  language: Language;
  onLanguageChange: (language: Language) => void;
  onLogoClick: () => void;
  onNavigate: (sectionId: string) => void;
}

export function Header({ language, onLanguageChange, onLogoClick, onNavigate }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    onNavigate(sectionId);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={onLogoClick}
          >
            <TreePine className="w-8 h-8 text-emerald-600" />
            <span className="text-xl font-semibold text-gray-900">Apartma Pohorc</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <nav className="flex gap-4">
              <a href="#facilities" className="text-gray-600 hover:text-gray-900" onClick={(e) => handleNavClick(e, 'facilities')}>
                {navigation[language].explore}
              </a>
              <a href="#about" className="text-gray-600 hover:text-gray-900" onClick={(e) => handleNavClick(e, 'about')}>
                {navigation[language].about}
              </a>
              <a href="#gallery" className="text-gray-600 hover:text-gray-900" onClick={(e) => handleNavClick(e, 'gallery')}>
                {navigation[language].gallery}
              </a>
              <a href="#contact" className="text-gray-600 hover:text-gray-900" onClick={(e) => handleNavClick(e, 'contact')}>
                {navigation[language].contact}
              </a>
              <a href="#map" className="text-gray-600 hover:text-gray-900" onClick={(e) => handleNavClick(e, 'map')}>
                {navigation[language].location}
              </a>
            </nav>
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
            />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <LanguageSelector
              currentLanguage={language}
              onLanguageChange={onLanguageChange}
            />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a
                href="#facilities"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={(e) => handleNavClick(e, 'facilities')}
              >
                {navigation[language].explore}
              </a>
              <a
                href="#about"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={(e) => handleNavClick(e, 'about')}
              >
                {navigation[language].about}
              </a>
              <a
                href="#gallery"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={(e) => handleNavClick(e, 'gallery')}
              >
                {navigation[language].gallery}
              </a>
              <a
                href="#contact"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={(e) => handleNavClick(e, 'contact')}
              >
                {navigation[language].contact}
              </a>
              <a
                href="#map"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                onClick={(e) => handleNavClick(e, 'map')}
              >
                {navigation[language].location}
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
