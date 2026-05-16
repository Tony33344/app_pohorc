import React, { useState } from 'react';
import { Language } from '../types';
import { ReservationForm } from './ReservationForm';

interface BookButtonProps {
  language: Language;
  apartmentId: string;
}

const buttonText = {
  sl: {
    book: 'Rezerviraj zdaj',
    discount: 'Pridobi do 25% popusta za daljše termine!'
  },
  en: {
    book: 'Book now',
    discount: 'Get up to 25% discount for longer stays!'
  },
  de: {
    book: 'Jetzt buchen',
    discount: 'Bis zu 25% Rabatt für längere Aufenthalte!'
  }
};

export function BookButton({ language, apartmentId }: BookButtonProps) {
  const [showForm, setShowForm] = useState(false);
  const text = buttonText[language];

  return (
    <>
      <div className="space-y-2">
        <button
          onClick={() => setShowForm(true)}
          className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors"
        >
          {text.book}
        </button>
        <p className="text-sm text-emerald-600 text-center font-medium">
          {text.discount}
        </p>
      </div>

      {showForm && (
        <ReservationForm
          language={language}
          apartmentId={apartmentId}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}
