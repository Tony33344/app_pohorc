import React from 'react';
import { apartments } from '../data/apartments';
import { Language } from '../types';
import { ImageGallery } from '../components/ImageGallery';
import { BookingCalendar } from '../components/BookingCalendar';
import { BookButton } from '../components/BookButton';
import { ChevronLeft } from 'lucide-react';

interface CamperPageProps {
  language: Language;
  onBack: () => void;
}

export function CamperPage({ language, onBack }: CamperPageProps) {
  const camper = apartments.find(a => a.id === 'camper')!;
  const translation = camper.translations[language];

  const seasonalPricing = {
    sl: {
      title: 'Sezonske cene',
      lowSeason: 'Nizka sezona',
      highSeason: 'Visoka sezona',
      lowSeasonDate: '1.9. - 31.5.',
      highSeasonDate: '1.6. - 31.8.',
      highSeasonNote: 'Velja tudi za praznike in počitnice'
    },
    en: {
      title: 'Seasonal Pricing',
      lowSeason: 'Low Season',
      highSeason: 'High Season',
      lowSeasonDate: 'Sep 1 - May 31',
      highSeasonDate: 'Jun 1 - Aug 31',
      highSeasonNote: 'Also applies to holidays and vacations'
    },
    de: {
      title: 'Saisonpreise',
      lowSeason: 'Nebensaison',
      highSeason: 'Hochsaison',
      lowSeasonDate: '1.9. - 31.5.',
      highSeasonDate: '1.6. - 31.8.',
      highSeasonNote: 'Gilt auch für Feiertage und Ferien'
    }
  };

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
      
      <ImageGallery images={camper.images} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'sl' ? 'O avtodomu' : language === 'de' ? 'Über das Wohnmobil' : 'About the Camper'}
          </h2>
          <p className="text-gray-600 mb-6">{translation.description}</p>
          
          <div className="bg-emerald-50 p-6 rounded-lg mb-6">
            <h3 className="font-semibold mb-3">
              {language === 'sl' ? 'Značilnosti' : language === 'de' ? 'Eigenschaften' : 'Features'}
            </h3>
            <ul className="grid grid-cols-2 gap-3">
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</span>
                {language === 'sl' ? 'Letnik 2016' : language === 'de' ? 'Baujahr 2016' : 'Year 2016'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</span>
                {language === 'sl' ? '6 ležišč' : language === 'de' ? '6 Schlafplätze' : '6 beds'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</span>
                {language === 'sl' ? 'Opremljena kuhinja' : language === 'de' ? 'Ausgestattete Küche' : 'Equipped kitchen'}
              </li>
              <li className="flex items-center gap-2">
                <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">✓</span>
                {language === 'sl' ? 'Neomejeni kilometri' : language === 'de' ? 'Unbegrenzte Kilometer' : 'Unlimited mileage'}
              </li>
            </ul>
          </div>

          {/* Seasonal Pricing Table */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
            <h3 className="text-xl font-semibold p-4 bg-emerald-600 text-white">
              {seasonalPricing[language].title}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <tbody>
                  <tr className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{seasonalPricing[language].lowSeason}</div>
                      <div className="text-sm text-gray-600">{seasonalPricing[language].lowSeasonDate}</div>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">€99</td>
                  </tr>
                  <tr className="border-t">
                    <td className="px-4 py-3">
                      <div className="font-semibold">{seasonalPricing[language].highSeason}</div>
                      <div className="text-sm text-gray-600">{seasonalPricing[language].highSeasonDate}</div>
                      {seasonalPricing[language].highSeasonNote && (
                        <div className="text-xs text-emerald-600 mt-1">{seasonalPricing[language].highSeasonNote}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold">€119</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4">
              {language === 'sl' ? 'Razpoložljivost' : language === 'de' ? 'Verfügbarkeit' : 'Availability'}
            </h3>
            <BookingCalendar language={language} apartmentId="camper" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">
            {language === 'sl' ? 'Oprema' : language === 'de' ? 'Ausstattung' : 'Equipment'}
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
            <BookButton language={language} apartmentId="camper" />
          </div>
        </div>
      </div>
    </div>
  );
}
