import { useState, useEffect, useCallback } from 'react';
import { TripPlan, Place } from '../types/trip';
import { INITIAL_TRIP_DATA } from '../data/initialTripData';
import { resolvePlaceImage } from '../assets/images';

const STORAGE_KEY = 'busan_trip_data_1128_v14';

export function sanitizeTripImages(plan: TripPlan): TripPlan {
  if (!plan || !plan.days) return plan;
  return {
    ...plan,
    title: plan.title === '11/28 부산 여행' ? '11월 28일 부산 여행' : (plan.title || '11월 28일 부산 여행'),
    days: plan.days.map((day) => ({
      ...day,
      title: day.title === '부산 알짜 당일치기 코스' ? '부산 여행 코스' : day.title,
      places: day.places.map((place) => ({
        ...place,
        imageUrl: resolvePlaceImage(place.imageUrl, place.id, place.name),
      })),
    })),
  };
}

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
      return sanitizeTripImages(parsed);
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

    // 2. Fallback to localStorage for v11
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.days && parsed.days.length === 1 && parsed.days[0].places?.length >= 6) {
          return sanitizeTripImages(parsed);
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved trip data from localStorage', e);
    }

    // 3. Fallback to default initial data
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
