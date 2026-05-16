import React, { useState, useEffect } from 'react';
import { addUnavailableDate, deleteUnavailableDate, getUnavailableDates, UnavailableDate } from '../lib/supabase';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { Language } from '../types';
import { Trash2 } from 'lucide-react';

interface AdminPageProps {
  language: Language;
}

export function AdminPage({ language }: AdminPageProps) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [unavailableDates, setUnavailableDates] = useState<UnavailableDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const correctPassword = 'camper2024'; // Simple password for grandma

  const translations = {
    sl: {
      title: 'Admin Panel - Nedostopni Datumi za Avtodom',
      password: 'Geslo',
      login: 'Prijava',
      wrongPassword: 'Napačno geslo',
      startDate: 'Začetni datum',
      endDate: 'Končni datum',
      add: 'Dodaj nedostopni termin',
      existingDates: 'Obstoječi nedostopni termini',
      noData: 'Ni nedostopnih terminov',
      from: 'Od',
      to: 'Do',
      delete: 'Izbriši',
      loading: 'Nalaganje...',
      error: 'Napaka:',
      success: 'Uspeh:',
      addSuccess: 'Termin uspešno dodan!',
      deleteSuccess: 'Termin uspešno izbrisan!',
      selectDates: 'Prosimo, izberite začetni in končni datum'
    },
    en: {
      title: 'Admin Panel - Camper Unavailable Dates',
      password: 'Password',
      login: 'Login',
      wrongPassword: 'Wrong password',
      startDate: 'Start Date',
      endDate: 'End Date',
      add: 'Add Unavailable Period',
      existingDates: 'Existing Unavailable Dates',
      noData: 'No unavailable dates',
      from: 'From',
      to: 'To',
      delete: 'Delete',
      loading: 'Loading...',
      error: 'Error:',
      success: 'Success:',
      addSuccess: 'Period added successfully!',
      deleteSuccess: 'Period deleted successfully!',
      selectDates: 'Please select both start and end dates'
    },
    de: {
      title: 'Admin-Panel - Nicht verfügbare Termine für Wohnmobil',
      password: 'Passwort',
      login: 'Anmelden',
      wrongPassword: 'Falsches Passwort',
      startDate: 'Startdatum',
      endDate: 'Enddatum',
      add: 'Nicht verfügbaren Zeitraum hinzufügen',
      existingDates: 'Bestehende nicht verfügbare Termine',
      noData: 'Keine nicht verfügbaren Termine',
      from: 'Von',
      to: 'Bis',
      delete: 'Löschen',
      loading: 'Wird geladen...',
      error: 'Fehler:',
      success: 'Erfolg:',
      addSuccess: 'Zeitraum erfolgreich hinzugefügt!',
      deleteSuccess: 'Zeitraum erfolgreich gelöscht!',
      selectDates: 'Bitte wählen Sie Start- und Enddatum aus'
    }
  };

  const t = translations[language];

  useEffect(() => {
    if (isAuthenticated) {
      fetchUnavailableDates();
    }
  }, [isAuthenticated]);

  const fetchUnavailableDates = async () => {
    setIsLoading(true);
    try {
      const dates = await getUnavailableDates();
      setUnavailableDates(dates);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError(null);
    } else {
      setError(t.wrongPassword);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    
    if (!startDate || !endDate) {
      setError(t.selectDates);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');
      
      const result = await addUnavailableDate(formattedStartDate, formattedEndDate);
      
      if (result) {
        setSuccess(t.addSuccess);
        setStartDate(null);
        setEndDate(null);
        fetchUnavailableDates();
      } else {
        setError('Failed to add date');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setError(null);
    setSuccess(null);
    
    try {
      const result = await deleteUnavailableDate(id);
      
      if (result) {
        setSuccess(t.deleteSuccess);
        fetchUnavailableDates();
      } else {
        setError('Failed to delete date');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">{t.title}</h1>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t.password}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>
          
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
          >
            {t.login}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">{t.title}</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">{t.add}</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.startDate}</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YYYY"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{t.endDate}</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate || new Date()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                dateFormat="dd/MM/yyyy"
                placeholderText="DD/MM/YYYY"
              />
            </div>
          </div>
          
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {t.error} {error}
            </div>
          )}
          
          {success && (
            <div className="p-3 bg-green-100 text-green-700 rounded-md text-sm">
              {t.success} {success}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-emerald-600 text-white py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:bg-emerald-300"
          >
            {isSubmitting ? t.loading : t.add}
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">{t.existingDates}</h2>
        
        {isLoading ? (
          <div className="text-center py-4">{t.loading}</div>
        ) : unavailableDates.length === 0 ? (
          <div className="text-center py-4 text-gray-500">{t.noData}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.from}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t.to}</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t.delete}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {unavailableDates.map((date) => (
                  <tr key={date.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(date.start_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(date.end_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDelete(date.id)}
                        className="text-red-600 hover:text-red-900"
                        title={t.delete}
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
