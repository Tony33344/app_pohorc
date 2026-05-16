import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ApartmentCard } from './components/ApartmentCard';
import { Footer } from './components/Footer';
import { apartments } from './data/apartments';
import { heroText } from './data/translations';
import { SearchBar } from './components/SearchBar';
import { ImageGallery } from './components/ImageGallery';
import { MacesenPage } from './pages/MacesenPage';
import { PraprotPage } from './pages/PraprotPage';
import { CamperPage } from './pages/CamperPage';
import { KostanjPage } from './pages/KostanjPage';
import { AdminPage } from './pages/AdminPage';
import type { Language } from './types';

function App() {
  const [language, setLanguage] = useState<Language>('sl');
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [pendingScroll, setPendingScroll] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check for admin parameter in URL
    const urlParams = new URLSearchParams(window.location.search);
    const adminParam = urlParams.get('admin');
    if (adminParam === 'true') {
      setIsAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (selectedFacility) {
      window.scrollTo(0, 0);
    } else if (pendingScroll) {
      const element = document.getElementById(pendingScroll);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
      setPendingScroll(null);
    }
  }, [selectedFacility, pendingScroll]);

  const handleNavigate = (sectionId: string) => {
    if (selectedFacility) {
      setSelectedFacility(null);
      setPendingScroll(sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  if (isAdmin) {
    return <AdminPage language={language} />;
  }

  const renderContent = () => {
    switch (selectedFacility) {
      case 'macesen':
        return <MacesenPage language={language} onBack={() => handleNavigate('facilities')} />;
      case 'praprot':
        return <PraprotPage language={language} onBack={() => handleNavigate('facilities')} />;
      case 'camper':
        return <CamperPage language={language} onBack={() => handleNavigate('facilities')} />;
      case 'kostanj':
        return <KostanjPage language={language} onBack={() => handleNavigate('facilities')} />;
      default:
        return (
          <>
            {/* Hero Section */}
            <div className="relative h-[800px] mb-8">
              <div className="absolute inset-0">
                <img
                  src="/images/soncni vzhod 1.1..jpg"
                  alt="Pohorje landscape"
                  className="w-full h-full object-cover object-bottom"
                />
                <div className="absolute inset-0 bg-black/40" />
              </div>
              
              <div className="relative max-w-7xl mx-auto px-4 h-full flex flex-col justify-center items-center text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  {heroText[language].title}
                </h1>
                <p className="text-xl text-white/90 mb-8">
                  {heroText[language].subtitle}
                </p>
                <div className="w-full max-w-4xl">
                  <SearchBar language={language} />
                </div>
              </div>
            </div>

            {/* Apartments Listing */}
            <div id="facilities" className="max-w-7xl mx-auto px-4 py-12 flex-grow">
              <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                {language === 'sl' ? 'Naše nastanitve' : language === 'de' ? 'Unsere Unterkünfte' : 'Our Accommodations'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
                {apartments.map((apartment) => (
                  <div
                    key={apartment.id}
                    data-apartment-id={apartment.id}
                    onClick={() => setSelectedFacility(apartment.id)}
                    className="cursor-pointer"
                  >
                    <ApartmentCard
                      apartment={apartment}
                      language={language}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* About Section */}
            <div id="about" className="py-16 bg-gray-50">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  {language === 'sl' ? 'O nas' : language === 'de' ? 'Über uns' : 'About Us'}
                </h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto text-center">
                  {language === 'sl' 
                    ? 'Apartma Pohorc se nahaja na čudoviti lokaciji na Pohorju, kjer se prepletata mir narave in dostopnost do številnih aktivnosti. Naša zgodba se je začela z željo po deljenju lepot Pohorja z gosti iz celega sveta.'
                    : language === 'de'
                    ? 'Apartment Pohorc befindet sich an einer wunderschönen Lage am Pohorje, wo sich die Ruhe der Natur mit der Zugänglichkeit zu zahlreichen Aktivitäten verbindet. Unsere Geschichte begann mit dem Wunsch, die Schönheit des Pohorje mit Gästen aus der ganzen Welt zu teilen.'
                    : 'Apartment Pohorc is located in a beautiful location on Pohorje, where the peace of nature intertwines with accessibility to numerous activities. Our story began with a desire to share the beauty of Pohorje with guests from around the world.'}
                </p>
              </div>
            </div>

            {/* Gallery Section */}
            <div id="gallery" className="py-16 bg-white">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  {language === 'sl' ? 'Galerija' : language === 'de' ? 'Galerie' : 'Gallery'}
                </h2>
                <div className="max-w-4xl mx-auto">
                  <ImageGallery
                    images={[
                      '/images/razgled 11h 1.1.jpg',
                      '/images/soncni vzhod 1.1..jpg'
                    ]}
                  />
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div id="contact" className="py-16">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  {language === 'sl' ? 'Kontakt' : language === 'de' ? 'Kontakt' : 'Contact'}
                </h2>
                <div className="max-w-2xl mx-auto text-center">
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-2">
                      {language === 'sl' ? 'Pokličite nas' : language === 'de' ? 'Rufen Sie uns an' : 'Call us'}
                    </h3>
                    <a href="tel:+38631815256" className="text-emerald-600 hover:text-emerald-700 text-lg">
                      +386 31 815 256
                    </a>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">Email</h3>
                    <a href="mailto:apartma.pohorc@gmail.com" className="text-emerald-600 hover:text-emerald-700 text-lg">
                      apartma.pohorc@gmail.com
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Map Section */}
            <div id="map" className="w-full py-12 bg-gray-100">
              <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                  {language === 'sl' ? 'Kje nas najdete' : language === 'de' ? 'Wo Sie uns finden' : 'Where to find us'}
                </h2>
                <div className="w-full h-[500px] rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2744.5076796647164!2d15.569916876889391!3d46.50411487161777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDbCsDMwJzE0LjgiTiAxNcKwMzQnMTkuNiJF!5e0!3m2!1sen!2s!4v1710337960045!5m2!1sen!2s"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        language={language}
        onLanguageChange={setLanguage}
        onLogoClick={() => handleNavigate('facilities')}
        onNavigate={handleNavigate}
      />
      {renderContent()}
      <Footer language={language} onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
