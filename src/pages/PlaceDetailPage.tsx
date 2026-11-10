/**
 * ========================================================
 * [상세페이지 / 장소 세부 정보 모달]
 * - 파일 위치: src/pages/PlaceDetailPage.tsx
 * - 역할: 특정 여행지를 클릭했을 때 열리는 상세 정보 화면
 *   (사진, 시간, 5인 입장료/예산 계산, 예약 링크, 꿀팁, 인생샷 포토존, 구글 지도 마커)
 * - GitHub에서 장소 상세 화면의 UI나 구성을 바꿀 때 이 파일을 수정하세요.
 * ========================================================
 */

import React, { useState } from 'react';
import {
  X,
  MapPin,
  Clock,
  ExternalLink,
  Copy,
  Check,
  Ticket,
  AlertCircle,
  Camera,
  Utensils,
  Edit2,
  CheckCircle2,
  ShoppingBag,
  Car,
  Home,
} from 'lucide-react';
import { Place } from '../types/trip';
import { CategoryBadge, BookingStatusBadge } from '../components/common/Badge';
import { formatCurrency, getNaverMapUrl, getKakaoMapUrl, getGoogleMapUrl } from '../utils/mapUtils';
import { resolvePlaceImage } from '../assets/images';
import { BUSAN_PARKING_DATA } from '../data/parkingData';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

export interface ParsedMenuItem {
  raw: string;
  name: string;
  price: string;
  description?: string;
  isHighlight: boolean;
}

export function parseMenuItem(raw: string): ParsedMenuItem {
  const isHighlight = raw.includes('구매 예정') || raw.includes('⭐');
  let clean = raw.replace(/^⭐\s*/, '').replace(/\[구매\s*예정!?\]\s*/i, '').trim();

  let price = '';
  let name = clean;
  let description = '';

  // 1. Separate description if " - " delimiter is present
  if (clean.includes(' - ')) {
    const parts = clean.split(' - ');
    name = parts[0].trim();
    description = parts.slice(1).join(' - ').trim();
  }

  // 2. Extract price inside parentheses e.g. (16,000원) or (55,000원~) or (소 55,000 / 중 75,000 ...)
  const parenMatch = name.match(/\(([^)]*(?:원|변동|무료|\d+)[^)]*)\)/);
  if (parenMatch) {
    const rawInside = parenMatch[1].trim();
    name = name.replace(parenMatch[0], '').trim();

    // If price inside parentheses is a multi-tier list (contains '/' or is very long)
    if (rawInside.includes('/') || rawInside.length > 18) {
      const firstNum = rawInside.match(/\d{1,3}(?:,\d{3})*/);
      if (firstNum) {
        price = `${firstNum[0]}원~`;
      } else {
        price = rawInside;
      }
      description = description ? `${description} (${rawInside})` : rawInside;
    } else {
      price = rawInside;
    }
  } else {
    // 3. Match end of name price e.g. 4,500원
    const endPriceMatch = name.match(/(\d{1,3}(?:,\d{3})*원(?:\s*~\s*\d{1,3}(?:,\d{3})*원|\+)?)$/);
    if (endPriceMatch) {
      price = endPriceMatch[1].trim();
      name = name.substring(0, endPriceMatch.index).trim();
    }
  }

  // 4. Fallback search in description
  if (!price && description) {
    const descParen = description.match(/\(([^)]*(?:원|변동)[^)]*)\)/);
    if (descParen) {
      price = descParen[1].trim();
      description = description.replace(descParen[0], '').trim();
    }
  }

  return {
    raw,
    name: name || raw,
    price,
    description,
    isHighlight,
  };
}

export interface PlaceDetailPageProps {
  place: Place | null;
  travelerCount: number;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (place: Place) => void;
  isHost?: boolean;
}

export const PlaceDetailPage: React.FC<PlaceDetailPageProps> = ({
  place,
  travelerCount,
  isOpen,
  onClose,
  onEdit,
  isHost = true,
}) => {
  const [copied, setCopied] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  if (!isOpen || !place) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(`${place.name} (${place.address})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalCost = place.feeInfo.hasFee ? place.feeInfo.costPerPerson * travelerCount : 0;
  const parkingInfo = BUSAN_PARKING_DATA.find((p) => p.placeId === place.id || place.name.includes(p.placeName) || p.placeName.includes(place.name));

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Modal Dialog Card */}
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-black/50 hover:bg-black/75 text-white flex items-center justify-center transition-colors backdrop-blur-xs shadow-md"
          title="닫기"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Section */}
        <div className="relative h-56 sm:h-64 w-full overflow-hidden rounded-t-3xl bg-slate-100">
          <img
            src={resolvePlaceImage(place.imageUrl, place.id, place.name)}
            alt={place.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = resolvePlaceImage('', place.id, place.name);
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase tracking-wider font-semibold text-sky-300">
                {place.area}
              </span>
              <span className="text-white/40" aria-hidden="true">·</span>
              <span className="text-xs text-white/90">{place.duration} 소요</span>
            </div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {place.name}
              </h2>
              {place.isTbd && (
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400 text-amber-950 shadow-xs">
                  장소 미정 (선정 중)
                </span>
              )}
            </div>
          </div>
        </div>


        <div className="p-6 sm:p-7 space-y-6">

          {/* 할 일 / 구매 예정 섹션 */}
          {place.plannedTask && (
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-sky-50 to-indigo-50/80 border border-sky-200">
              <div className="flex items-center gap-2 mb-1.5 text-xs font-bold text-sky-800 uppercase">
                <CheckCircle2 className="w-4 h-4 text-sky-600" />
                <span>할 일 및 구매 예정</span>
              </div>
              <p className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                {place.plannedTask}
              </p>
            </div>
          )}

          {/* 장소 미정 상태 안내 카드 */}
          {place.isTbd && (
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 text-xs sm:text-sm leading-relaxed flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">세부 장소 조율 중:</span> 아직 구체적인 식당/카페가 확정되지 않았으며 후보지 비교 중입니다. 확정 시 실시간으로 주소와 지도 링크가 업데이트됩니다!
              </div>
            </div>
          )}

          {/* Quick Info Grid: 운영/방문 시간, 입장료, 예약 상태 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
            
            {/* 시간 */}
            <div className="p-2">
              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 uppercase">
                <Clock className="w-3.5 h-3.5 text-sky-600" />
                <span>방문 / 운영 시간</span>
              </div>
              <div className="text-base font-bold text-slate-900 tabular-nums mt-1">
                {place.startTime} ~ {place.endTime}
              </div>
              <div className="text-xs text-slate-500 mt-0.5">예상 체류 {place.duration}</div>
            </div>

            {/* 입장료 */}
            <div className="p-2 border-t sm:border-t-0 sm:border-l border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 uppercase">
                <Ticket className="w-3.5 h-3.5 text-amber-600" />
                <span>입장료 / 예매 비용</span>
              </div>
              <div className="text-base font-bold text-slate-900 tabular-nums mt-1">
                {place.feeInfo.hasFee ? `1인 ${formatCurrency(place.feeInfo.costPerPerson)}` : '무료 입장'}
              </div>
              {place.feeInfo.hasFee && (
                <div className="text-xs text-slate-500 mt-0.5">
                  {travelerCount}인 기준 총 {formatCurrency(totalCost)}
                </div>
              )}
            </div>

            {/* 예약 상태 */}
            <div className="p-2 border-t sm:border-t-0 sm:border-l border-slate-200">
              <div className="text-[11px] font-bold text-slate-500 flex items-center gap-1.5 uppercase">
                <AlertCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>예약 / 예매 구분</span>
              </div>
              <div className="mt-1">
                <BookingStatusBadge feeInfo={place.feeInfo} />
              </div>
              <div className="text-xs text-slate-500 mt-1 truncate">
                {place.feeInfo.isPreBookRequired ? '사전 필수 예약' : '현장 자율 이용'}
              </div>
            </div>

          </div>

          {/* Reservation / Ticketing Guidance Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-sky-50/70 border border-sky-200">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="text-sm font-bold text-sky-950 flex items-center gap-1.5">
                <Ticket className="w-4 h-4 text-sky-600" />
                <span>예약 방법 및 예매 정보</span>
              </h4>
              <BookingStatusBadge feeInfo={place.feeInfo} />
            </div>

            <div className="text-xs sm:text-sm text-sky-900 space-y-2 leading-relaxed">
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <span className="font-bold text-sky-950 min-w-[70px]">예약 방법:</span>
                <span>
                  {place.feeInfo.isPreBookRequired
                    ? '공식 웹사이트 또는 네이버 예약을 통한 사전 티켓팅 필수'
                    : place.feeInfo.hasFee
                    ? '현장 매표소 발권 및 직접 주문 결제'
                    : '별도 예약 없이 상시 자유 입장 가능'}
                </span>
              </div>

              {place.feeInfo.bookingDeadline && (
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                  <span className="font-bold text-sky-950 min-w-[70px]">오픈 일정:</span>
                  <span className="text-slate-800 font-medium">{place.feeInfo.bookingDeadline}</span>
                </div>
              )}

              {place.feeInfo.notes && (
                <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-2">
                  <span className="font-bold text-sky-950 min-w-[70px] shrink-0">할인/팁:</span>
                  <span className="text-slate-700">{place.feeInfo.notes}</span>
                </div>
              )}
            </div>

            {/* Official Booking URL Link if provided */}
            {place.feeInfo.bookingUrl && (
              <div className="mt-3.5 pt-3 border-t border-sky-200/80 flex items-center justify-between gap-2">
                <span className="text-xs text-sky-800 font-medium hidden sm:inline">
                  공식 예매처에서 잔여 좌석 확인 및 예약하기
                </span>
                <a
                  href={place.feeInfo.bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition-colors inline-flex items-center gap-1.5 shadow-sm active:scale-95"
                >
                  <span>공식 예매 사이트 열기</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Place Description */}
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-2">장소 상세 소개</h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              {place.description}
            </p>
          </div>

          {/* Recommended / Full Menu (if available) */}
          {place.recommendedMenu && place.recommendedMenu.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  {place.category === 'stay' ? (
                    <Home className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Utensils className="w-4 h-4 text-orange-600" />
                  )}
                  <span>
                    {place.category === 'cafe'
                      ? '카페 전체 메뉴판'
                      : place.category === 'stay'
                      ? '숙소 객실 구성 및 구비 어메니티'
                      : '전체 및 추천 메뉴'}
                  </span>
                </h4>
                <span className="text-[11px] text-slate-400">총 {place.recommendedMenu.length}개 항목</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {place.recommendedMenu.map((menuRaw, i) => {
                  const item = parseMenuItem(menuRaw);
                  return (
                    <div
                      key={i}
                      className={`text-xs p-3 rounded-2xl border transition-all flex flex-col justify-between gap-1.5 ${
                        item.isHighlight
                          ? 'bg-amber-50/90 border-amber-300 text-amber-950 font-bold shadow-xs ring-1 ring-amber-300/70'
                          : 'bg-slate-50/80 border-slate-200/90 text-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="min-w-0 flex-1">
                          {item.isHighlight && (
                            <div className="mb-1">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-200/90 text-amber-950 font-extrabold text-[10px] shadow-2xs">
                                <ShoppingBag className="w-3 h-3 text-amber-700" />
                                <span>구매 예정!</span>
                              </span>
                            </div>
                          )}
                          <h5 className="font-bold text-slate-900 text-xs sm:text-[13px] leading-snug">
                            {item.name}
                          </h5>
                        </div>

                        {item.price && (
                          <span
                            className={`px-2.5 py-1 rounded-xl text-xs font-black tabular-nums shrink-0 whitespace-nowrap shadow-2xs ${
                              item.isHighlight
                                ? 'bg-amber-200 text-amber-950 border border-amber-300'
                                : 'bg-white text-sky-800 border border-sky-200 font-bold'
                            }`}
                          >
                            {item.price}
                          </span>
                        )}
                      </div>

                      {item.description && (
                        <div className="text-[11px] text-slate-600 font-medium leading-relaxed bg-white/80 p-2 rounded-xl border border-slate-100">
                          {item.description}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Photo Spots (if available) */}
          {place.photoSpots && place.photoSpots.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-2.5">
                <Camera className="w-4 h-4 text-indigo-600" />
                <span>인생샷 포토존</span>
              </h4>
              <div className="space-y-1.5">
                {place.photoSpots.map((spot, i) => (
                  <div
                    key={i}
                    className="text-xs text-slate-700 bg-indigo-50/60 border border-indigo-100 px-3.5 py-2 rounded-xl flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                    <span>{spot}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parking Information Card */}
          {parkingInfo && (
            <div className="p-4 rounded-2xl bg-slate-50/90 border border-slate-200/90 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Car className="w-4 h-4 text-orange-600" />
                  <span>주차 정보</span>
                </h4>
                {parkingInfo.hasDedicatedParking ? (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    자체 주차장 이용 가능
                  </span>
                ) : (
                  <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    전용 주차장 없음 (인근 주차)
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200/80 leading-relaxed">
                <strong className="text-slate-900 font-bold block mb-0.5">💡 주차 안내 & 추천:</strong>
                {parkingInfo.recommendation}
              </div>

              <div className="space-y-2">
                {parkingInfo.facilities.map((fac, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-white border border-slate-200/80 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-slate-900">{fac.name}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-semibold">
                          {fac.typeLabel}
                        </span>
                        {fac.hasFreeSupport && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold">
                            무료 지원
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">
                        <strong>요금:</strong> {fac.feeRate} {fac.dailyMax ? `(${fac.dailyMax})` : ''} · <span className="text-slate-700 font-medium">{fac.walkingDistance}</span>
                      </div>
                      {fac.freeCondition && (
                        <div className="text-[11px] text-emerald-700 font-semibold mt-0.5">
                          ✓ {fac.freeCondition}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0 self-end sm:self-auto">
                      <a
                        href={getNaverMapUrl(fac.name, fac.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 transition-colors"
                      >
                        네이버
                      </a>
                      <a
                        href={getKakaoMapUrl(fac.name, fac.address)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-1 text-[11px] font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 transition-colors"
                      >
                        카카오
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Address Card */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5 mb-1">
                <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span>위치 및 주소</span>
              </div>
              <div className="text-sm font-semibold text-slate-900 truncate">
                {place.address}
              </div>
            </div>

            <button
              onClick={handleCopy}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shrink-0 shadow-2xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨!' : '주소 복사'}</span>
            </button>
          </div>

          {/* Bottom Section: Google Map Location & Marker */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span>지도 앱 길찾기</span>
              </h4>
              <div className="flex items-center gap-1.5">
                <a
                  href={getNaverMapUrl(place.name, place.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 transition-colors flex items-center gap-1 cursor-pointer"
                  title="네이버 지도에서 열기"
                >
                  <span>네이버</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <a
                  href={getKakaoMapUrl(place.name, place.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 transition-colors flex items-center gap-1 cursor-pointer"
                  title="카카오맵에서 열기"
                >
                  <span>카카오</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
                <a
                  href={getGoogleMapUrl(place.name, place.coords.lat, place.coords.lng, place.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 border border-sky-200/80 hover:bg-sky-100 transition-colors flex items-center gap-1 cursor-pointer"
                  title="구글 지도에서 열기"
                >
                  <span>구글</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
            </div>

            {/* Google Map Viewport */}
            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-xs relative h-[260px] w-full bg-slate-100">
              {apiKey ? (
                <APIProvider apiKey={apiKey} language="ko" region="KR">
                  <Map
                    mapId="DEMO_MAP_ID"
                    defaultCenter={{ lat: place.coords.lat, lng: place.coords.lng }}
                    center={{ lat: place.coords.lat, lng: place.coords.lng }}
                    defaultZoom={15}
                    gestureHandling="cooperative"
                    disableDefaultUI={false}
                    internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                    className="w-full h-full"
                  >
                    <AdvancedMarker
                      position={{ lat: place.coords.lat, lng: place.coords.lng }}
                      title={place.name}
                    >
                      <Pin
                        background="#0284c7"
                        borderColor="#ffffff"
                        glyphColor="#ffffff"
                      />
                    </AdvancedMarker>
                  </Map>
                </APIProvider>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                  지도를 불러오는 중입니다...
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className={`pt-4 border-t border-slate-200 flex items-center ${isHost ? 'justify-between' : 'justify-end'} gap-3`}>
            {isHost && (
              <button
                onClick={() => {
                  onClose();
                  onEdit(place);
                }}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>장소 정보 수정</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-sm"
            >
              닫기
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PlaceDetailPage;
