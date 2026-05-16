import React from 'react';
import { Language } from '../types';

const footerText = {
  sl: {
    rights: 'Vse pravice pridržane',
    address: 'Hočko Pohorje 44 r, 2208 Pohorje, Slovenija',
    navigation: {
      explore: 'Raziskuj',
      about: 'O nas',
      contact: 'Kontakt',
      location: 'Kje smo'
    }
  },
  en: {
    rights: 'All rights reserved',
    address: 'Hočko Pohorje 44 r, 2208 Pohorje, Slovenia',
    navigation: {
      explore: 'Explore',
      about: 'About',
      contact: 'Contact',
      location: 'Location'
    }
  },
  de: {
    rights: 'Alle Rechte vorbehalten',
    address: 'Hočko Pohorje 44 r, 2208 Pohorje, Slowenien',
    navigation: {
      explore: 'Entdecken',
      about: 'Über uns',
      contact: 'Kontakt',
      location: 'Standort'
    }
  }
};

interface FooterProps {
  language: Language;
  onNavigate: (sectionId: string) => void;
}

export function Footer({ language, onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const text = footerText[language];
  
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    onNavigate(sectionId);
  };
  
  return (
    <footer className="bg-gray-900 text-white py-8 mt-16">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Apartma Pohorc</h3>
            <p className="text-gray-400">{text.address}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">{text.navigation.contact}</h3>
            <div className="flex flex-col space-y-2">
              <a href="tel:+38631815256" className="text-gray-400 hover:text-white transition-colors">
                +386 31 815 256
              </a>
              <a href="mailto:apartma.pohorc@gmail.com" className="text-gray-400 hover:text-white transition-colors">
                apartma.pohorc@gmail.com
              </a>
            </div>
          </div>
          <div className="block">
            <h3 className="text-lg font-semibold mb-4">{text.navigation.explore}</h3>
            <nav className="flex flex-col space-y-2">
              <a href="#facilities" className="text-gray-400 hover:text-white transition-colors" onClick={(e) => handleNavClick(e, 'facilities')}>
                {text.navigation.explore}
              </a>
              <a href="#about" className="text-gray-400 hover:text-white transition-colors" onClick={(e) => handleNavClick(e, 'about')}>
                {text.navigation.about}
              </a>
              <a href="#contact" className="text-gray-400 hover:text-white transition-colors" onClick={(e) => handleNavClick(e, 'contact')}>
                {text.navigation.contact}
              </a>
              <a href="#map" className="text-gray-400 hover:text-white transition-colors" onClick={(e) => handleNavClick(e, 'map')}>
                {text.navigation.location}
              </a>
            </nav>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>© {currentYear} Apartma Pohorc. {text.rights}.</p>
        </div>
      </div>
    </footer>
  );
}
