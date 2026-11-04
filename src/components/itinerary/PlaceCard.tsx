import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  Edit2,
  Footprints,
  Bus,
  Train,
  Car,
} from 'lucide-react';
import { Place, TransportType } from '../../types/trip';
import { CategoryBadge, BookingStatusBadge } from '../common/Badge';
import { getNaverMapUrl, getKakaoMapUrl, getGoogleMapUrl, formatCurrency } from '../../utils/mapUtils';

interface PlaceCardProps {
  place: Place;
  index: number;
  onOpenDetail: () => void;
  onEdit: () => void;
  isHost?: boolean;
}

export const PlaceCard: React.FC<PlaceCardProps> = ({
  place,
  index,
  onOpenDetail,
  onEdit,
  isHost = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${place.name} (${place.address})`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderTransportIcon = (type: TransportType) => {
    switch (type) {
      case 'walk':
        return <Footprints className="w-4 h-4 text-emerald-600" />;
      case 'bus':
        return <Bus className="w-4 h-4 text-blue-600" />;
      case 'subway':
        return <Train className="w-4 h-4 text-amber-600" />;
      case 'taxi':
      case 'car':
        return <Car className="w-4 h-4 text-orange-600" />;
    }
  };

  const getTransportLabel = (type: TransportType) => {
    switch (type) {
      case 'walk':
        return '도보';
      case 'bus':
        return '시내/마을버스';
      case 'subway':
        return '지하철';
      case 'taxi':
        return '택시';
      case 'car':
        return '자가용';
    }
  };

  return (
    <div className="relative">
      {/* Main Place Card */}
      <div
        onClick={onOpenDetail}
        className="group bg-white rounded-2xl border border-slate-200/90 hover:border-sky-300 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
      >
        <div className="p-4 sm:p-5">
          
          {/* Top Row: Time, Sequence, Category, Area */}
          <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-slate-700 min-w-0">
              <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-[11px] sm:text-xs font-bold tabular-nums shrink-0">
                {index + 1}
              </span>
              <span className="text-slate-900 font-bold tabular-nums flex items-center gap-1 shrink-0">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                {place.startTime} - {place.endTime}
              </span>
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">·</span>
              <span className="text-slate-500 font-medium truncate hidden sm:inline">{place.duration}</span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs text-slate-500 font-medium">{place.area}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <CategoryBadge category={place.category} />
            </div>
          </div>

          {/* Place Title, Summary & Thumbnail Row */}
          <div className="flex items-start justify-between gap-3 sm:gap-4 mb-3">
            <div className="flex-1 min-w-0">
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-slate-900 group-hover:text-sky-600 transition-colors tracking-tight leading-snug mb-1">
                {place.name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-2 mb-2.5">
                {place.summary}
              </p>

              {/* Address bar */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{place.address}</span>
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="p-1 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
                  title="주소 복사"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Thumbnail Image */}
            {place.imageUrl && (
              <div className="w-20 h-20 sm:w-32 sm:h-24 md:w-36 md:h-24 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 shadow-2xs">
                <img
                  src={place.imageUrl}
                  alt={place.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>

          {/* Fee & Booking Status Bar */}
          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap min-w-0">
              <BookingStatusBadge feeInfo={place.feeInfo} />
              {place.feeInfo.hasFee ? (
                <span className="font-semibold text-slate-800 tabular-nums">
                  1인 {formatCurrency(place.feeInfo.costPerPerson)}
                </span>
              ) : (
                <span className="text-slate-500 font-medium">무료</span>
              )}
              {place.feeInfo.notes && (
                <span className="hidden sm:inline text-slate-400 text-xs truncate max-w-[200px]">
                  ({place.feeInfo.notes})
                </span>
              )}
            </div>

            <div className="flex items-center gap-0.5 text-sky-600 font-bold shrink-0 text-xs group-hover:text-sky-700">
              <span>상세보기</span>
              <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Quick Action Map Links Toolbar */}
          <div className="mt-2.5 pt-2.5 border-t border-slate-100">
            <div className={`flex items-center ${isHost ? 'justify-between' : 'justify-start'} gap-1.5`}>
              <div className="flex items-center gap-1 sm:gap-1.5 flex-1 min-w-0">
                <span className="hidden sm:inline text-[11px] text-slate-500 font-semibold mr-1">지도 앱:</span>
                
                {/* Google Map Link */}
                <a
                  href={getGoogleMapUrl(place.name, place.coords.lat, place.coords.lng)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 border border-sky-200/80 hover:bg-sky-100 transition-colors flex items-center justify-center gap-1"
                  title="구글 지도에서 길찾기"
                >
                  <span>구글</span>
                  <ExternalLink className="w-2.5 h-2.5 hidden sm:inline" />
                </a>

                {/* Naver Map Link */}
                <a
                  href={getNaverMapUrl(place.name, place.address)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"
                  title="네이버 지도에서 열기"
                >
                  <span>네이버</span>
                  <ExternalLink className="w-2.5 h-2.5 hidden sm:inline" />
                </a>

                {/* Kakao Map Link */}
                <a
                  href={getKakaoMapUrl(place.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1"
                  title="카카오맵에서 열기"
                >
                  <span>카카오</span>
                  <ExternalLink className="w-2.5 h-2.5 hidden sm:inline" />
                </a>
              </div>

              {/* Edit button - only visible to Host */}
              {isHost && (
                <div className="flex items-center justify-end shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit();
                    }}
                    className="px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg transition-colors flex items-center justify-center gap-1"
                    title="일정 정보 수정"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>수정</span>
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* Route & Transport Connector to Next Place */}
      {place.transportToNext && (
        <div className="py-2.5 px-3 sm:px-6 my-1 flex items-center gap-2.5 sm:gap-3">
          <div className="flex flex-col items-center pl-3 sm:pl-4 shrink-0">
            <div className="w-0.5 h-6 bg-slate-300" />
          </div>
          <div className="flex-1 bg-slate-100/90 hover:bg-slate-100 rounded-xl px-3 py-2 text-xs text-slate-700 flex items-center justify-between gap-2 border border-slate-200/60 min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <span className="p-1 rounded-md bg-white shadow-2xs shrink-0">
                {renderTransportIcon(place.transportToNext.type)}
              </span>
              <span className="font-bold text-slate-900 shrink-0">
                {getTransportLabel(place.transportToNext.type)} {place.transportToNext.durationMin}분
              </span>
              <span className="text-slate-400 hidden sm:inline" aria-hidden="true">·</span>
              <span className="text-slate-600 truncate">{place.transportToNext.description}</span>
            </div>

            {place.transportToNext.fare && (
              <span className="text-slate-500 font-medium tabular-nums shrink-0 text-[11px] sm:text-xs">
                약 {formatCurrency(place.transportToNext.fare)}
              </span>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
