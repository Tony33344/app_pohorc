import type { Language } from '../types';

interface HeroTranslations {
  [key in Language]: {
    title: string;
    subtitle: string;
  };
}

export const heroText: HeroTranslations = {
  sl: {
    title: 'Dobrodošli v Apartmajih Pohorc',
    subtitle: 'Uživajte v čudovitem razgledu iz Pohorja na dravsko dolino in okolico'
  },
  en: {
    title: 'Welcome to Apartments Pohorc',
    subtitle: 'Enjoy beautiful views of Pohorje and Maribor'
  },
  de: {
    title: 'Willkommen bei Apartments Pohorc',
    subtitle: 'Genießen Sie den herrlichen Blick auf Pohorje und Maribor'
  }
};
