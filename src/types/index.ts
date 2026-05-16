export type Language = 'sl' | 'en' | 'de';

export interface Apartment {
  id: string;
  images: string[];
  price: number;
  size: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  coordinates: {
    lat: number;
    lng: number;
  };
  translations: {
    [key in Language]: {
      title: string;
      location: string;
      description: string;
      amenities: string[];
    };
  };
}

export interface UnavailableDate {
  id: string;
  start_date: string;
  end_date: string;
}
