import React from 'react';
import { apartments } from '../data/apartments';
import { Language } from '../types';
import { ImageGallery } from '../components/ImageGallery';
import { BookingCalendar } from '../components/BookingCalendar';
import { BookButton } from '../components/BookButton';
import { ChevronLeft } from 'lucide-react';

interface MacesenPageProps {
  language: Language;
  onBack: () => void;
}

export function MacesenPage({ language, onBack }: MacesenPageProps) {
  const apartment = apartments.find(a => a.id === 'macesen')!;
  const translation = apartment.translations[language];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-6"
      >
        <ChevronLeft className="w-5 h-5" />
        <span>
          {language === 'sl' ? 'Nazaj na pregled' : language === 'de' ? 'Zurück zur Übersicht' : 'Back to overview'}
        </span>
      </button>
      
      <h1 className="text-4xl font-bold mb-8">{translation.title}</h1>
      
      <ImageGallery images={[
        apartment.images[0],
        apartment.images[1],
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/639089112.jpg?k=5a06eec1297dff56815b09f8b29cd13f4fd078518390d1013905cadceee5f557&o=&hp=1',
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/639089121.jpg?k=d6a33b87cce9cd6aac57ed5ec00c6e501922aa0852be15d20c5280ca5b892a65&o=&hp=1',
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/639108552.jpg?k=39eac00b72eff9af82f923fd7d33ddb860cae2f6242a9d32ebd67e249f5c5a06&o=&hp=1',
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/639108112.jpg?k=73a30288ba277d39ea7968f935e2d3f5416728b0b7a8903888181c104a222233&o=&hp=1',
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/639089126.jpg?k=559ea02957da3b5ddc1b9ac0ef576b50919b089aaeaaa004b783bc93ef7c16e4&o=&hp=1',
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/639108074.jpg?k=0c6a1f5ca0e7f271819f5feb1de573dac9abe00239d23e1dc346ee4344d295cf&o=&hp=1'
      ]} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'sl' ? 'O apartmaju' : language === 'de' ? 'Über das Apartment' : 'About the Apartment'}
          </h2>
          <p className="text-gray-600 mb-6">{translation.description}</p>
          
          <div className="bg-emerald-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold mb-3">
              {language === 'sl' ? 'Značilnosti' : language === 'de' ? 'Eigenschaften' : 'Features'}
            </h3>
            <ul className="grid grid-cols-2 gap-3">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</span>
                {apartment.size} m²
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</span>
                {apartment.maxGuests} {language === 'sl' ? 'oseb' : language === 'de' ? 'Personen' : 'persons'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</span>
                {apartment.bedrooms} {language === 'sl' ? 'spalnici' : language === 'de' ? 'Schlafzimmer' : 'bedrooms'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</span>
                {language === 'sl' ? 'opremljena kuhinja' : language === 'de' ? 'ausgestattete Küche' : 'equipped kitchen'}
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              {language === 'sl' ? 'Razpoložljivost' : language === 'de' ? 'Verfügbarkeit' : 'Availability'}
            </h3>
            <BookingCalendar language={language} apartmentId="macesen" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'sl' ? 'Ugodnosti' : language === 'de' ? 'Annehmlichkeiten' : 'Amenities'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {translation.amenities.map((amenity) => (
              <div key={amenity} className="flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</span>
                {amenity}
              </div>
            ))}
          </div>
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg">
            <BookButton language={language} apartmentId="macesen" />
          </div>
        </div>
      </div>
    </div>
  );
}
