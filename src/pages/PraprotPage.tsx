import React from 'react';
import { apartments } from '../data/apartments';
import { Language } from '../types';
import { ImageGallery } from '../components/ImageGallery';
import { BookingCalendar } from '../components/BookingCalendar';
import { BookButton } from '../components/BookButton';
import { ChevronLeft } from 'lucide-react';

interface PraprotPageProps {
  language: Language;
  onBack: () => void;
}

export function PraprotPage({ language, onBack }: PraprotPageProps) {
  const apartment = apartments.find(a => a.id === 'praprot')!;
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
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/594995310.jpg?k=a3d4942039812ff5f40a2904b342a0202988f2812fdd2150ca0c33741b53ffed&o=&hp=1',
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/594995306.jpg?k=966a57c2dad9d66ec4b4a10d3f892352a2637f7e14ac757dcacaecca700eb34b&o=&hp=1',
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/594995314.jpg?k=18a09a83bccb5d64bba905fe017e495d2914eaa8a24ef3b52b0e03399cd751ad&o=&hp=1',
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/594995311.jpg?k=b30f33b3af28adcc9fd89e847c08677eaead135e881b90417a61fe84a7fb1588&o=&hp=1',
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/594995277.jpg?k=069cbd4a107c40a8b303033505aa5da2f01b46cfe77ea0b6acf182b0008ef3f4&o=&hp=1',
        'https://cf.bstatic.com/xdata/images/hotel/max1024x768/594995308.jpg?k=6679d1fdf0bd1f92e686fdcdde0f80c20deaba0929a28fad9e2ca51bc129b23d&o=&hp=1'
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
                {apartment.bedrooms} {language === 'sl' ? 'spalnica' : language === 'de' ? 'Schlafzimmer' : 'bedroom'}
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
            <BookingCalendar language={language} apartmentId="praprot" />
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
            <BookButton language={language} apartmentId="praprot" />
          </div>
        </div>
      </div>
    </div>
  );
}
