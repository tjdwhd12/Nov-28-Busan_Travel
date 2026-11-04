/**
 * ========================================================
 * [JS / 타입 정의 모듈 (TypeScript)]
 * - 파일 위치: src/types/trip.ts
 * - 역할: 장소(Place), 당일 일정(DaySchedule), 전체 계획(TripPlan), 카테고리(Category) 등 타입 정의
 * ========================================================
 */

export type Category =
  | 'sightseeing' // 관광명소
  | 'food'        // 맛집/식사
  | 'cafe'        // 카페/디저트
  | 'activity'    // 액티비티/체험
  | 'transport'   // 이동/교통
  | 'stay';       // 숙소

export type TransportType = 'walk' | 'subway' | 'bus' | 'taxi' | 'car';

export interface TransportInfo {
  type: TransportType;
  durationMin: number;
  description: string;
  fare?: number;
}

export interface FeeInfo {
  hasFee: boolean;
  costPerPerson: number;       // 1인당 비용 (원)
  isPreBookRequired: boolean;  // 사전예약 필수 여부
  bookingStatus: 'booked' | 'need_booking' | 'on_site' | 'free'; // 예매완료, 예매필요, 현장발권, 무료
  bookingUrl?: string;         // 예매 링크 (공식 웹사이트/네이버예약 등)
  bookingDeadline?: string;    // 예약 기한/오픈일정 (예: 이용일 2주 전 화요일 09:00 오픈)
  notes?: string;              // 예매 및 할인 팁
}

export interface Place {
  id: string;
  name: string;
  category: Category;
  startTime: string;      // "11:30"
  endTime: string;        // "13:00"
  duration: string;       // "1시간 30분"
  area: string;           // "부산역/초량", "영도", "광안리", "해운대", "기장", "남포동"
  address: string;
  coords: {
    lat: number;
    lng: number;
    mapX: number; // 0-100% relative for custom map visualizer
    mapY: number; // 0-100% relative for custom map visualizer
  };
  summary: string;
  description: string;
  feeInfo: FeeInfo;
  transportToNext?: TransportInfo;
  imageUrl?: string;
  photoSpots?: string[];
  recommendedMenu?: string[];
  tips?: string[];
  isSecret?: boolean; // For mystery mode (friends don't know yet)
  phone?: string;
}

export interface DaySchedule {
  dayNumber: number;
  date: string;         // "2026.11.14 (토)"
  title: string;        // "Day 1. 바다의 시작과 광안리 야경"
  subtitle: string;     // "부산역 도착부터 영도 바다 절벽, 그리고 광안대교 야경까지"
  color: string;
  places: Place[];
}

export interface ChecklistItem {
  id: string;
  text: string;
  category: '필수' | '의류/신발' | '전자기기' | '기타';
  isChecked: boolean;
}

export interface TripPlan {
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelerCount: number;
  authorName: string;
  dDay: string; // ISO date string e.g. "2026-11-14"
  days: DaySchedule[];
  checklist?: ChecklistItem[];
}

export type Trip = TripPlan;
