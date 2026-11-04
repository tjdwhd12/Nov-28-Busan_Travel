import { useState, useEffect, useCallback } from 'react';
import { TripPlan, Place } from '../types/trip';
import { INITIAL_TRIP_DATA } from '../data/initialTripData';

const STORAGE_KEY = 'busan_trip_data_1128_v6';

// Helper to encode trip data for share link
export function serializeTripData(data: TripPlan): string {
  try {
    const jsonStr = JSON.stringify(data);
    return encodeURIComponent(btoa(unescape(encodeURIComponent(jsonStr))));
  } catch (e) {
    console.warn('Serialization error', e);
    return '';
  }
}

// Helper to decode trip data from share link
export function deserializeTripData(encoded: string): TripPlan | null {
  try {
    const jsonStr = decodeURIComponent(escape(atob(decodeURIComponent(encoded))));
    const parsed = JSON.parse(jsonStr) as TripPlan;
    if (parsed && parsed.days && Array.isArray(parsed.days) && parsed.days.length > 0) {
      if (parsed.days[0].title === '부산 알짜 당일치기 코스') {
        parsed.days[0].title = '부산 여행 코스';
      }
      return parsed;
    }
  } catch (e) {
    console.warn('Deserialization error', e);
  }
  return null;
}

export function useTripData() {
  const [trip, setTrip] = useState<TripPlan>(() => {
    // 1. Check if there is data payload in URL hash (e.g. from shared custom link)
    if (typeof window !== 'undefined' && window.location.hash) {
      try {
        const hash = window.location.hash.substring(1);
        const match = hash.match(/(?:data|trip)=([^&]+)/);
        if (match && match[1]) {
          const parsed = deserializeTripData(match[1]);
          if (parsed) {
            return parsed;
          }
        }
      } catch (e) {
        console.warn('Failed to parse trip from hash', e);
      }
    }

    // 2. Fallback to localStorage
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('busan_trip_data_1128_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.days && parsed.days.length === 1) {
          if (parsed.days[0].title === '부산 알짜 당일치기 코스') {
            parsed.days[0].title = '부산 여행 코스';
          }
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved trip data from localStorage', e);
    }

    // 3. Fallback to default 5-person initial data
    return INITIAL_TRIP_DATA;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trip));
    } catch (e) {
      console.warn('Failed to save trip to localStorage', e);
    }
  }, [trip]);

  const updatePlace = (dayNumber: number, updatedPlace: Place) => {
    setTrip(prev => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.dayNumber !== dayNumber) return day;
        return {
          ...day,
          places: day.places.map(p => (p.id === updatedPlace.id ? updatedPlace : p)),
        };
      }),
    }));
  };

  const addPlace = (dayNumber: number, newPlace: Place) => {
    setTrip(prev => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.dayNumber !== dayNumber) return day;
        return {
          ...day,
          places: [...day.places, newPlace],
        };
      }),
    }));
  };

  const deletePlace = (dayNumber: number, placeId: string) => {
    setTrip(prev => ({
      ...prev,
      days: prev.days.map(day => {
        if (day.dayNumber !== dayNumber) return day;
        return {
          ...day,
          places: day.places.filter(p => p.id !== placeId),
        };
      }),
    }));
  };

  const updateTripMeta = (updates: Partial<Pick<TripPlan, 'title' | 'destination' | 'startDate' | 'endDate' | 'travelerCount' | 'dDay'>>) => {
    setTrip(prev => ({
      ...prev,
      ...updates,
    }));
  };

  const resetToDefault = () => {
    setTrip(INITIAL_TRIP_DATA);
    localStorage.removeItem(STORAGE_KEY);
    if (typeof window !== 'undefined' && window.location.hash) {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  const exportToJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trip, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `busan_day_trip_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importFromJson = (jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString) as TripPlan;
      if (parsed.days && Array.isArray(parsed.days)) {
        setTrip(parsed);
        return true;
      }
    } catch (e) {
      console.error('Import failed', e);
    }
    return false;
  };

  const getEncodedTrip = useCallback(() => {
    return serializeTripData(trip);
  }, [trip]);

  return {
    trip,
    updatePlace,
    addPlace,
    deletePlace,
    updateTripMeta,
    resetToDefault,
    exportToJson,
    importFromJson,
    getEncodedTrip,
  };
}
