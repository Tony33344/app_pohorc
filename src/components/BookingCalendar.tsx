import React, { useState, useEffect } from 'react';
import { format, addMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isBefore, isWithinInterval } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ICAL from 'ical.js';
import { getUnavailableDates, UnavailableDate } from '../lib/supabase';

interface BookingCalendarProps {
  language: 'sl' | 'en' | 'de';
  apartmentId: 'praprot' | 'macesen' | 'camper' | 'kostanj';
}

interface Booking {
  start: Date;
  end: Date;
}

const monthNames = {
  sl: ['Januar', 'Februar', 'Marec', 'April', 'Maj', 'Junij', 'Julij', 'Avgust', 'September', 'Oktober', 'November', 'December'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  de: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
};

const weekDays = {
  sl: ['Ned', 'Pon', 'Tor', 'Sre', 'Čet', 'Pet', 'Sob'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  de: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
};

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

const getCalendarUrls = (apartmentId: string) => {
  switch (apartmentId) {
    case 'praprot':
      return {
        airbnb: `${CORS_PROXY}${encodeURIComponent('https://www.airbnb.com/calendar/ical/1339847873413518084.ics?s=22f2790450cc99126096673433300b1c')}`,
        booking: `${CORS_PROXY}${encodeURIComponent('https://ical.booking.com/v1/export?t=834817fb-29f9-43c1-9436-fd239860aa08')}`
      };
    case 'macesen':
      return {
        airbnb: `${CORS_PROXY}${encodeURIComponent('https://www.airbnb.com/calendar/ical/1339839044164896422.ics?s=11cf547d0c878e58aa42a38560da0718')}`,
        booking: `${CORS_PROXY}${encodeURIComponent('https://ical.booking.com/v1/export?t=cda796c1-1ddc-41f3-908b-fd52301167d4')}`
      };
    case 'kostanj':
      return {
        airbnb: null,
        booking: `${CORS_PROXY}${encodeURIComponent('https://ical.booking.com/v1/export?t=kostanj-placeholder')}`
      };
    default:
      return null;
  }
};

const getPrice = (apartmentId: string, date: Date) => {
  const month = date.getMonth() + 1;
  const isHighSeason = month >= 6 && month <= 8;

  switch (apartmentId) {
    case 'praprot':
      return 79;
    case 'macesen':
      return 119;
    case 'camper':
      return isHighSeason ? 119 : 99;
    case 'kostanj':
      return 89;
    default:
      return 0;
  }
};

export function BookingCalendar({ language, apartmentId }: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [unavailableDates, setUnavailableDates] = useState<UnavailableDate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCalendars = async () => {
      setIsLoading(true);
      
      try {
        // For camper, fetch unavailable dates from Supabase
        if (apartmentId === 'camper') {
          const supabaseDates = await getUnavailableDates();
          setUnavailableDates(supabaseDates);
          setBookings([]);
          setIsLoading(false);
          return;
        }

        // For apartments, fetch from iCal
        const urls = getCalendarUrls(apartmentId);
        if (!urls) {
          throw new Error('Invalid apartment ID');
        }

        const fetchPromises: Promise<Response>[] = [];
        if (urls.airbnb) fetchPromises.push(fetch(urls.airbnb));
        if (urls.booking) fetchPromises.push(fetch(urls.booking));
        
        const responses = await Promise.all(fetchPromises);

        const icalDataArray = await Promise.all(responses.map(response => response.text()));
        const allBookings: Booking[] = [];

        for (const icalData of icalDataArray) {
          try {
            const jcalData = ICAL.parse(icalData);
            const comp = new ICAL.Component(jcalData);
            const vevents = comp.getAllSubcomponents('vevent');

            const calendarBookings = vevents.map(vevent => {
              const event = new ICAL.Event(vevent);
              return {
                start: event.startDate.toJSDate(),
                end: event.endDate.toJSDate()
              };
            });

            allBookings.push(...calendarBookings);
          } catch (err) {
            console.error('Error parsing calendar data:', err);
          }
        }

        setBookings(allBookings);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error fetching calendars:', err);
        setError(
          language === 'sl' ? 'Napaka pri nalaganju koledarja' :
          language === 'de' ? 'Fehler beim Laden des Kalenders' :
          'Error loading calendar'
        );
        setIsLoading(false);
      }
    };

    fetchCalendars();
  }, [apartmentId, language]);

  const isDateBooked = (date: Date) => {
    if (apartmentId === 'camper') {
      // Check against Supabase unavailable dates for camper
      return unavailableDates.some(booking => {
        const startDate = new Date(booking.start_date);
        const endDate = new Date(booking.end_date);
        return isWithinInterval(date, { start: startDate, end: endDate });
      });
    }
    
    // For apartments, check against iCal bookings
    return bookings.some(booking => 
      isWithinInterval(date, { start: booking.start, end: booking.end })
    );
  };

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(addMonths(currentDate, -1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center p-4 bg-red-50 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={prevMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold">
          {monthNames[language][currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <button
          onClick={nextMonth}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays[language].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: monthStart.getDay() }).map((_, index) => (
          <div key={`empty-start-${index}`} className="h-16" />
        ))}

        {days.map(day => {
          const isBooked = isDateBooked(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isPast = isBefore(day, new Date()) && !isToday(day);
          const price = getPrice(apartmentId, day);

          return (
            <div
              key={day.toISOString()}
              className={`relative h-16 flex flex-col items-center justify-start p-1 transition-colors ${
                isCurrentMonth
                  ? isPast
                    ? 'text-gray-400'
                    : isBooked
                    ? 'bg-red-100 text-red-800'
                    : 'hover:bg-emerald-50 text-gray-900 cursor-pointer'
                  : 'text-gray-400'
              }`}
            >
              <span className="text-sm font-medium">{day.getDate()}</span>
              {!isPast && !isBooked && isCurrentMonth && (
                <span className="text-xs text-emerald-600 mt-1">
                  €{price}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 rounded-full"></div>
          <span className="text-gray-600">
            {language === 'sl' ? 'Zasedeno' : language === 'de' ? 'Belegt' : 'Booked'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-50 rounded-full"></div>
          <span className="text-gray-600">
            {language === 'sl' ? 'Prosto' : language === 'de' ? 'Verfügbar' : 'Available'}
          </span>
        </div>
      </div>
    </div>
  );
}
