import { useState, useEffect, useCallback } from 'react';
import { TripPlan, Place, ExtraExpense, FeeInfo } from '../types/trip';
import { INITIAL_TRIP_DATA } from '../data/initialTripData';
import { resolvePlaceImage } from '../assets/images';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, testConnection } from '../lib/firebase';

const STORAGE_KEY = 'busan_trip_data_1128_v15';
const TRIP_DOC_ID = 'busan_trip_1128';

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
  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

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

  // Real-time Cloud Firestore synchronization
  useEffect(() => {
    testConnection();

    const tripRef = doc(db, 'trips', TRIP_DOC_ID);

    // Listen to real-time changes from Firestore
    const unsubscribe = onSnapshot(
      tripRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const cloudData = snapshot.data() as TripPlan;
          if (cloudData && cloudData.days && Array.isArray(cloudData.days)) {
            const sanitized = sanitizeTripImages(cloudData);
            setTrip(sanitized);
            setIsCloudConnected(true);
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
            } catch (e) {
              console.warn('Failed to save cloud trip to localStorage', e);
            }
          }
        } else {
          // Initialize remote database with current trip data
          const initialClean = JSON.parse(JSON.stringify(INITIAL_TRIP_DATA));
          setDoc(tripRef, initialClean)
            .then(() => setIsCloudConnected(true))
            .catch((err) => {
              console.warn('Could not seed initial trip to Firestore:', err);
              handleFirestoreError(err, OperationType.WRITE, `trips/${TRIP_DOC_ID}`);
            });
        }
      },
      (error) => {
        console.warn('Firestore snapshot subscription warning:', error);
        setIsCloudConnected(false);
        handleFirestoreError(error, OperationType.GET, `trips/${TRIP_DOC_ID}`);
      }
    );

    return () => unsubscribe();
  }, []);

  // Save to Firebase and LocalStorage synchronously
  const commitTrip = useCallback((updated: TripPlan) => {
    setTrip(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Failed to save trip to localStorage', e);
    }

    // Async sync to Firestore
    setIsSyncing(true);
    const cleaned = JSON.parse(JSON.stringify(updated));
    const tripRef = doc(db, 'trips', TRIP_DOC_ID);
    setDoc(tripRef, cleaned, { merge: true })
      .then(() => {
        setIsCloudConnected(true);
        setIsSyncing(false);
      })
      .catch((err) => {
        console.warn('Failed to sync changes to Firestore:', err);
        setIsSyncing(false);
        handleFirestoreError(err, OperationType.WRITE, `trips/${TRIP_DOC_ID}`);
      });
  }, []);

  const updatePlace = (dayNumber: number, updatedPlace: Place) => {
    const nextTrip: TripPlan = {
      ...trip,
      days: trip.days.map(day => {
        if (day.dayNumber !== dayNumber) return day;
        return {
          ...day,
          places: day.places.map(p => (p.id === updatedPlace.id ? updatedPlace : p)),
        };
      }),
    };
    commitTrip(nextTrip);
  };

  const addPlace = (dayNumber: number, newPlace: Place) => {
    const nextTrip: TripPlan = {
      ...trip,
      days: trip.days.map(day => {
        if (day.dayNumber !== dayNumber) return day;
        return {
          ...day,
          places: [...day.places, newPlace],
        };
      }),
    };
    commitTrip(nextTrip);
  };

  const deletePlace = (dayNumber: number, placeId: string) => {
    const nextTrip: TripPlan = {
      ...trip,
      days: trip.days.map(day => {
        if (day.dayNumber !== dayNumber) return day;
        return {
          ...day,
          places: day.places.filter(p => p.id !== placeId),
        };
      }),
    };
    commitTrip(nextTrip);
  };

  const updateTripMeta = (updates: Partial<Pick<TripPlan, 'title' | 'destination' | 'startDate' | 'endDate' | 'travelerCount' | 'dDay'>>) => {
    const nextTrip: TripPlan = {
      ...trip,
      ...updates,
    };
    commitTrip(nextTrip);
  };

  const resetToDefault = () => {
    commitTrip(INITIAL_TRIP_DATA);
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
        commitTrip(parsed);
        return true;
      }
    } catch (e) {
      console.error('Import failed', e);
    }
    return false;
  };

  const addExtraExpense = (expense: Omit<ExtraExpense, 'id'>) => {
    const newExpense: ExtraExpense = {
      ...expense,
      id: 'ext_' + Date.now(),
    };
    const nextTrip: TripPlan = {
      ...trip,
      extraExpenses: [...(trip.extraExpenses || []), newExpense],
    };
    commitTrip(nextTrip);
  };

  const deleteExtraExpense = (id: string) => {
    const nextTrip: TripPlan = {
      ...trip,
      extraExpenses: (trip.extraExpenses || []).filter(e => e.id !== id),
    };
    commitTrip(nextTrip);
  };

  const updatePlaceFeeInfo = (placeId: string, feeInfoUpdates: Partial<FeeInfo>) => {
    const nextTrip: TripPlan = {
      ...trip,
      days: trip.days.map(day => ({
        ...day,
        places: day.places.map(p => {
          if (p.id !== placeId) return p;
          const merged: FeeInfo = {
            ...p.feeInfo,
            ...feeInfoUpdates,
          };
          if (merged.costPerPerson > 0) {
            merged.hasFee = true;
          } else if (merged.costPerPerson === 0 && merged.bookingStatus === 'free') {
            merged.hasFee = false;
          }
          return {
            ...p,
            feeInfo: merged,
          };
        }),
      })),
    };
    commitTrip(nextTrip);
  };

  const getEncodedTrip = useCallback(() => {
    return serializeTripData(trip);
  }, [trip]);

  return {
    trip,
    updatePlace,
    updatePlaceFeeInfo,
    addPlace,
    deletePlace,
    addExtraExpense,
    deleteExtraExpense,
    updateTripMeta,
    resetToDefault,
    exportToJson,
    importFromJson,
    getEncodedTrip,
    isCloudConnected,
    isSyncing,
  };
}
