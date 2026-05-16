import React from 'react';
import { Users, Bed, Bath, Home } from 'lucide-react';
import { Apartment, Language } from '../types';

interface ApartmentCardProps {
  apartment: Apartment;
  language: Language;
}

export function ApartmentCard({ apartment, language }: ApartmentCardProps) {
  const translation = apartment.translations[language];
  
  // Translations for the unit labels
  const unitLabels = {
    sl: {
      night: 'noč',
      beds: 'spalnici',
      bed: 'spalnica',
      baths: 'kopalnica',
      upTo: 'do',
      from: 'od'
    },
    en: {
      night: 'night',
      beds: 'bedrooms',
      bed: 'bedroom',
      baths: 'bathroom',
      upTo: 'Up to',
      from: 'from'
    },
    de: {
      night: 'Nacht',
      beds: 'Schlafzimmer',
      bed: 'Schlafzimmer',
      baths: 'Badezimmer',
      upTo: 'Bis zu',
      from: 'ab'
    }
  };

  const getBedroomText = () => {
    if (apartment.id === 'camper') {
      return language === 'sl' ? '6 ležišč' : language === 'de' ? '6 Schlafplätze' : '6 beds';
    }
    return `${apartment.bedrooms} ${apartment.bedrooms > 1 ? unitLabels[language].beds : unitLabels[language].bed}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-80">
        <img
          src={apartment.images[0]}
          alt={translation.title}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{translation.title}</h3>
            <p className="text-gray-600">{translation.location}</p>
          </div>
          <p className="text-xl font-bold text-emerald-600">
            <span className="text-sm font-normal">{unitLabels[language].from} </span>
            €{apartment.price}
            <span className="text-sm font-normal">/{unitLabels[language].night}</span>
          </p>
        </div>
        <p className="text-gray-600 mb-4 text-justify">{translation.description}</p>
        <div className="flex items-center space-x-4 text-gray-600 mb-4">
          {apartment.id !== 'camper' && (
            <div className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span>{apartment.size} m²</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{getBedroomText()}</span>
          </div>
          {apartment.id === 'camper' && (
            <div className="flex items-center gap-1">
              <Bath className="w-4 h-4" />
              <span>{apartment.bathrooms} {unitLabels[language].baths}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{unitLabels[language].upTo} {apartment.maxGuests}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {translation.amenities.map((amenity) => (
            <span
              key={amenity}
              className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
            >
              {amenity}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
