import React from 'react';
import { Heart, Users, Bed, Bath } from 'lucide-react';
import type { Property } from '../types';

interface PropertyCardProps {
  property: Property;
}

export function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transition-transform hover:scale-[1.02]">
      <div className="relative h-64">
        <img
          src={property.images[0]}
          alt={property.title}
          className="w-full h-full object-cover"
        />
        <button className="absolute top-4 right-4 p-2 bg-white/80 rounded-full hover:bg-white">
          <Heart className="w-5 h-5 text-rose-500" />
        </button>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{property.title}</h3>
            <p className="text-gray-600">{property.location}</p>
          </div>
          <p className="text-xl font-bold text-emerald-600">${property.price}<span className="text-sm font-normal">/night</span></p>
        </div>
        <div className="flex gap-4 text-gray-600 mb-4">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms} beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms} baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>Up to {property.maxGuests}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {property.natureFeatures.map((feature) => (
            <span
              key={feature}
              className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
