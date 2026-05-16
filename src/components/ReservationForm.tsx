import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Language } from '../types';
import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';
import emailjs from 'emailjs-com';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format, isWithinInterval } from 'date-fns';
import ICAL from 'ical.js';
import { countries } from '../data/countries';

interface ReservationFormProps {
  language: Language;
  apartmentId: string;
  onClose: () => void;
}

const formText = {
  sl: {
    title: 'Rezervacija',
    name: 'Ime in priimek',
    email: 'E-pošta',
    phone: 'Telefon',
    address: 'Naslov',
    country: 'Država',
    guests: 'Število gostov',
    message: 'Sporočilo (opcijsko)',
    submit: 'Pošlji povpraševanje',
    success: 'Vaše povpraševanje je bilo uspešno poslano. Kontaktirali vas bomo v najkrajšem možnem času.',
    error: 'Prišlo je do napake. Prosimo, poskusite ponovno.',
    dates: {
      checkIn: 'Prihod',
      checkOut: 'Odhod',
      select: 'Izberite datum'
    },
    placeholder: {
      name: 'Vnesite ime in priimek',
      email: 'Vnesite e-poštni naslov',
      phone: 'Vnesite telefonsko številko',
      address: 'Vnesite naslov',
      country: 'Izberite državo',
      message: 'Vnesite dodatne zahteve ali vprašanja'
    },
    validation: {
      required: 'To polje je obvezno',
      email: 'Vnesite veljaven e-poštni naslov',
      phone: 'Vnesite veljavno telefonsko številko',
      dates: 'Izberite datum prihoda in odhoda'
    },
    format: {
      email: 'Primer: janez.novak@email.com',
      phone: 'Primer: +386 31 123 456',
      address: 'Primer: Slovenska cesta 1, 1000 Ljubljana'
    }
  },
  en: {
    title: 'Reservation',
    name: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    country: 'Country',
    guests: 'Number of Guests',
    message: 'Message (optional)',
    submit: 'Send Inquiry',
    success: 'Your inquiry has been sent successfully. We will contact you as soon as possible.',
    error: 'An error occurred. Please try again.',
    dates: {
      checkIn: 'Check-in',
      checkOut: 'Check-out',
      select: 'Select date'
    },
    placeholder: {
      name: 'Enter your full name',
      email: 'Enter your email address',
      phone: 'Enter your phone number',
      address: 'Enter your address',
      country: 'Select country',
      message: 'Enter any additional requirements or questions'
    },
    validation: {
      required: 'This field is required',
      email: 'Please enter a valid email address',
      phone: 'Please enter a valid phone number',
      dates: 'Please select check-in and check-out dates'
    },
    format: {
      email: 'Example: john.smith@email.com',
      phone: 'Example: +386 31 123 456',
      address: 'Example: 123 Main St, New York, NY 10001'
    }
  },
  de: {
    title: 'Reservierung',
    name: 'Vollständiger Name',
    email: 'E-Mail',
    phone: 'Telefon',
    address: 'Adresse',
    country: 'Land',
    guests: 'Anzahl der Gäste',
    message: 'Nachricht (optional)',
    submit: 'Anfrage senden',
    success: 'Ihre Anfrage wurde erfolgreich gesendet. Wir werden Sie schnellstmöglich kontaktieren.',
    error: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.',
    dates: {
      checkIn: 'Anreise',
      checkOut: 'Abreise',
      select: 'Datum auswählen'
    },
    placeholder: {
      name: 'Geben Sie Ihren vollständigen Namen ein',
      email: 'Geben Sie Ihre E-Mail-Adresse ein',
      phone: 'Geben Sie Ihre Telefonnummer ein',
      address: 'Geben Sie Ihre Adresse ein',
      country: 'Land auswählen',
      message: 'Geben Sie zusätzliche Anforderungen oder Fragen ein'
    },
    validation: {
      required: 'Dieses Feld ist erforderlich',
      email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein',
      phone: 'Bitte geben Sie eine gültige Telefonnummer ein',
      dates: 'Bitte wählen Sie An- und Abreisedatum'
    },
    format: {
      email: 'Beispiel: hans.mueller@email.com',
      phone: 'Beispiel: +386 31 123 456',
      address: 'Beispiel: Hauptstraße 1, 10115 Berlin'
    }
  }
};

const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

const validatePhone = (phone: string): boolean => {
  try {
    return isValidPhoneNumber(phone);
  } catch {
    return false;
  }
};

interface Booking {
  start: Date;
  end: Date;
}

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
    default:
      return null;
  }
};

export function ReservationForm({ language, apartmentId, onClose }: ReservationFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    country: '',
    guests: '2',
    message: '',
    checkIn: null as Date | null,
    checkOut: null as Date | null
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(true);
  const text = formText[language];

  useEffect(() => {
    const fetchCalendars = async () => {
      if (apartmentId === 'camper') {
        setBookings([]);
        setIsLoadingCalendar(false);
        return;
      }

      try {
        const urls = getCalendarUrls(apartmentId);
        if (!urls) {
          throw new Error('Invalid apartment ID');
        }

        const responses = await Promise.all([
          fetch(urls.airbnb),
          fetch(urls.booking)
        ]);

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
        setIsLoadingCalendar(false);
      } catch (err) {
        console.error('Error fetching calendars:', err);
        setIsLoadingCalendar(false);
      }
    };

    fetchCalendars();
  }, [apartmentId]);

  const isDateBooked = (date: Date) => {
    if (apartmentId === 'camper') return false;
    return bookings.some(booking => 
      isWithinInterval(date, { start: booking.start, end: booking.end })
    );
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = text.validation.required;
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = text.validation.email;
    }

    if (!validatePhone(formData.phone)) {
      newErrors.phone = text.validation.phone;
    }

    if (!formData.address.trim()) {
      newErrors.address = text.validation.required;
    }

    if (!formData.country) {
      newErrors.country = text.validation.required;
    }

    if (!formData.checkIn || !formData.checkOut) {
      newErrors.dates = text.validation.dates;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('submitting');

    try {
      emailjs.init("kjPfZcoV_uH-5GBum");

      await emailjs.send(
        "service_k78m6f8",
        "template_hd5nnlh",
        {
          to_email: "onten44@proton.me",
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone,
          address: `${formData.address}, ${formData.country}`,
          guests: formData.guests,
          message: formData.message,
          apartment_id: apartmentId,
          check_in: formData.checkIn ? format(formData.checkIn, 'dd.MM.yyyy') : '',
          check_out: formData.checkOut ? format(formData.checkOut, 'dd.MM.yyyy') : ''
        }
      );

      setStatus('success');
    } catch (error) {
      console.error('Error sending email:', error);
      setStatus('error');
    }
  };

  const formatPhoneNumber = (value: string) => {
    try {
      const phoneNumber = parsePhoneNumberFromString(value);
      if (phoneNumber) {
        return phoneNumber.formatInternational();
      }
    } catch {
      // Return original value if parsing fails
    }
    return value;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-lg relative max-h-[95vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">{text.title}</h2>

          {status === 'success' ? (
            <div className="text-center py-6">
              <p className="text-emerald-600 mb-4">{text.success}</p>
              <button
                onClick={onClose}
                className="bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700"
              >
                OK
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {text.dates.checkIn} *
                  </label>
                  <DatePicker
                    selected={formData.checkIn}
                    onChange={(date) => setFormData({ ...formData, checkIn: date })}
                    selectsStart
                    startDate={formData.checkIn}
                    endDate={formData.checkOut}
                    minDate={new Date()}
                    placeholderText={text.dates.select}
                    className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300 text-sm"
                    dateFormat="dd.MM.yyyy"
                    excludeDates={bookings.flatMap(booking => {
                      const dates = [];
                      let currentDate = new Date(booking.start);
                      while (currentDate <= booking.end) {
                        dates.push(new Date(currentDate));
                        currentDate.setDate(currentDate.getDate() + 1);
                      }
                      return dates;
                    })}
                    filterDate={(date) => !isDateBooked(date)}
                    disabled={isLoadingCalendar}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {text.dates.checkOut} *
                  </label>
                  <DatePicker
                    selected={formData.checkOut}
                    onChange={(date) => setFormData({ ...formData, checkOut: date })}
                    selectsEnd
                    startDate={formData.checkIn}
                    endDate={formData.checkOut}
                    minDate={formData.checkIn || new Date()}
                    placeholderText={text.dates.select}
                    className="w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border-gray-300 text-sm"
                    dateFormat="dd.MM.yyyy"
                    excludeDates={bookings.flatMap(booking => {
                      const dates = [];
                      let currentDate = new Date(booking.start);
                      while (currentDate <= booking.end) {
                        dates.push(new Date(currentDate));
                        currentDate.setDate(currentDate.getDate() + 1);
                      }
                      return dates;
                    })}
                    filterDate={(date) => !isDateBooked(date)}
                    disabled={isLoadingCalendar || !formData.checkIn}
                  />
                </div>
              </div>
              {errors.dates && (
                <p className="text-red-500 text-xs">{errors.dates}</p>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {text.name} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={text.placeholder.name}
                  className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {text.email} *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder={text.placeholder.email}
                  className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email ? (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1">{text.format.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {text.phone} *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: formatPhoneNumber(e.target.value) })}
                  placeholder={text.placeholder.phone}
                  className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone ? (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1">{text.format.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {text.address} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder={text.placeholder.address}
                  className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm ${
                    errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.address ? (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                ) : (
                  <p className="text-gray-500 text-xs mt-1">{text.format.address}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {text.country} *
                </label>
                <select
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className={`w-full px-3 py-1.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm ${
                    errors.country ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">{text.placeholder.country}</option>
                  {countries.map((country) => (
                    <option key={country.code} value={country.translations[language]}>
                      {country.translations[language]}
                    </option>
                  ))}
                </select>
                {errors.country && (
                  <p className="text-red-500 text-xs mt-1">{errors.country}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {text.guests}
                </label>
                <select
                  value={formData.guests}
                  onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {text.message}
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={text.placeholder.message}
                  rows={2}
                  className="w-full px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
                />
              </div>

              {status === 'error' && (
                <p className="text-red-600 text-sm">{text.error}</p>
              )}

              <button
                type="submit"
                disabled={status === 'submitting'}
                className={`w-full bg-emerald-600 text-white py-2 px-6 rounded-lg transition-colors ${
                  status === 'submitting'
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-emerald-700'
                }`}
              >
                {status === 'submitting' ? (
                  <span className="flex items-center justify-center">
                    <span className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></span>
                    {text.submit}
                  </span>
                ) : (
                  text.submit
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
