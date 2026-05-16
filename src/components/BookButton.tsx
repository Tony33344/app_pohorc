import { useState } from 'react';
import { Language } from '../types';
import { ReservationForm } from './ReservationForm';

interface BookButtonProps {
  language: Language;
  apartmentId: string;
}

export function BookButton({ language, apartmentId }: BookButtonProps) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
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
