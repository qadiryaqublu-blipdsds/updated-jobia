export interface CityCoordinate {
  city: string;
  lat: number;
  lng: number;
  region: string;
}

export const AZERBAIJAN_REGIONS = [
  'Bakı və Abşeron',
  'Gəncə-Qazax',
  'Şəki-Zaqatala',
  'Lənkəran-Astara',
  'Quba-Xaçmaz',
  'Mərkəzi Aran',
  'Qarabağ və Şərqi Zəngəzur',
  'Naxçıvan Muxtar Respublikası',
  'Şirvan-Salyan'
];

export const AZERBAIJAN_CITY_COORDINATES: Record<string, CityCoordinate> = {
  'Bakı': { city: 'Bakı', lat: 40.4093, lng: 49.8671, region: 'Bakı və Abşeron' },
  'Sumqayıt': { city: 'Sumqayıt', lat: 40.5897, lng: 49.6686, region: 'Bakı və Abşeron' },
  'Xırdalan': { city: 'Xırdalan', lat: 40.4481, lng: 49.7550, region: 'Bakı və Abşeron' },
  'Gəncə': { city: 'Gəncə', lat: 40.6828, lng: 46.3606, region: 'Gəncə-Qazax' },
  'Mingəçevir': { city: 'Mingəçevir', lat: 40.7703, lng: 47.0496, region: 'Mərkəzi Aran' },
  'Şəki': { city: 'Şəki', lat: 41.1919, lng: 47.1706, region: 'Şəki-Zaqatala' },
  'Naxçıvan': { city: 'Naxçıvan', lat: 39.2089, lng: 45.4122, region: 'Naxçıvan Muxtar Respublikası' },
  'Lənkəran': { city: 'Lənkəran', lat: 38.7543, lng: 48.8505, region: 'Lənkəran-Astara' },
  'Quba': { city: 'Quba', lat: 41.3644, lng: 48.5134, region: 'Quba-Xaçmaz' },
  'Xaçmaz': { city: 'Xaçmaz', lat: 41.4639, lng: 48.8061, region: 'Quba-Xaçmaz' },
  'Şamaxı': { city: 'Şamaxı', lat: 40.6319, lng: 48.6414, region: 'Şirvan-Salyan' },
  'Göyçay': { city: 'Göyçay', lat: 40.6531, lng: 47.7406, region: 'Mərkəzi Aran' },
  'Bərdə': { city: 'Bərdə', lat: 40.3758, lng: 47.1261, region: 'Mərkəzi Aran' },
  'Şirvan': { city: 'Şirvan', lat: 39.9378, lng: 48.9290, region: 'Şirvan-Salyan' },
  'Qazax': { city: 'Qazax', lat: 41.0925, lng: 45.3656, region: 'Gəncə-Qazax' },
  'Zaqatala': { city: 'Zaqatala', lat: 41.6336, lng: 46.6433, region: 'Şəki-Zaqatala' },
  'Qəbələ': { city: 'Qəbələ', lat: 40.9982, lng: 47.8488, region: 'Şəki-Zaqatala' },
  'Şuşa': { city: 'Şuşa', lat: 39.7594, lng: 46.7497, region: 'Qarabağ və Şərqi Zəngəzur' },
  'Ağdam': { city: 'Ağdam', lat: 39.9911, lng: 46.9274, region: 'Qarabağ və Şərqi Zəngəzur' }
};

export const BAKU_METRO_STATIONS = [
  'İçərişəhər',
  'Sahil',
  '28 May',
  'Gənclik',
  'Nəriman Nərimanov',
  'Ulduz',
  'Koroğlu',
  'Qara Qarayev',
  'Neftçilər',
  'Xalqlar Dostluğu',
  'Əhmədli',
  'Həzi Aslanov',
  'Nizami',
  'Elmlər Akademiyası',
  'İnşaatçılar',
  '20 Yanvar',
  'Memar Əcəmi',
  'Nəsimi',
  'Azadlıq Prospekti',
  'Dərnəgül',
  'Avtovağzal',
  '8 Noyabr',
  'Xocəsən'
];

export function getCoordinatesForCity(cityName?: string): { lat: number; lng: number } {
  if (!cityName) return { lat: 40.4093, lng: 49.8671 }; // Default Baku
  const trimmed = cityName.trim();
  const found = AZERBAIJAN_CITY_COORDINATES[trimmed];
  if (found) {
    return { lat: found.lat, lng: found.lng };
  }
  // Try case-insensitive lookup
  const key = Object.keys(AZERBAIJAN_CITY_COORDINATES).find(
    (k) => k.toLowerCase() === trimmed.toLowerCase() || trimmed.toLowerCase().includes(k.toLowerCase())
  );
  if (key) {
    return {
      lat: AZERBAIJAN_CITY_COORDINATES[key].lat,
      lng: AZERBAIJAN_CITY_COORDINATES[key].lng
    };
  }
  return { lat: 40.4093, lng: 49.8671 };
}
