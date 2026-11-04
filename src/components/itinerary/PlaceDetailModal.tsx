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
  Lightbulb,
  Edit2,
  Calendar,
  Share2,
} from 'lucide-react';
import { Place } from '../../types/trip';
import { CategoryBadge, BookingStatusBadge } from '../common/Badge';
import { formatCurrency, getGoogleMapUrl } from '../../utils/mapUtils';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

interface PlaceDetailModalProps {
  place: Place | null;
  travelerCount: number;
  isOpen: boolean;
  onClose: () => void;
  onEdit: (place: Place) => void;
  isHost?: boolean;
}

export const PlaceDetailModal: React.FC<PlaceDetailModalProps> = ({
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
        {place.imageUrl ? (
          <div className="relative h-56 sm:h-64 w-full overflow-hidden rounded-t-3xl bg-slate-100">
            <img
              src={place.imageUrl}
              alt={place.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
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
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {place.name}
              </h2>
            </div>
          </div>
        ) : (
          <div className="px-6 pt-6 pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1.5">
              <span>{place.area}</span>
              <span aria-hidden="true">·</span>
              <CategoryBadge category={place.category} />
              <span aria-hidden="true">·</span>
              <span>소요시간 {place.duration}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {place.name}
            </h2>
          </div>
        )}

        <div className="p-6 sm:p-7 space-y-6">

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

          {/* Recommended Menu (if available) */}
          {place.recommendedMenu && place.recommendedMenu.length > 0 && (
            <div>
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-2.5">
                <Utensils className="w-4 h-4 text-orange-600" />
                <span>추천 메뉴</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {place.recommendedMenu.map((menu, i) => (
                  <span
                    key={i}
                    className="text-xs font-semibold text-slate-800 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl shadow-2xs"
                  >
                    {menu}
                  </span>
                ))}
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

          {/* Local Secret Tips */}
          {place.tips && place.tips.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80">
              <h4 className="text-sm font-bold text-amber-950 flex items-center gap-1.5 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>총무의 핵심 꿀팁</span>
              </h4>
              <ul className="text-xs text-amber-900 space-y-1.5 list-disc list-inside">
                {place.tips.map((tip, i) => (
                  <li key={i}>{tip}</li>
                ))}
              </ul>
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
            <div className="flex items-center justify-between gap-2 mb-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-sky-600" />
                <span>구글 지도 위치 & 마커</span>
              </h4>
              <a
                href={getGoogleMapUrl(place.name, place.coords.lat, place.coords.lng)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
              >
                <span>구글 지도 앱에서 열기</span>
                <ExternalLink className="w-3 h-3" />
              </a>
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
