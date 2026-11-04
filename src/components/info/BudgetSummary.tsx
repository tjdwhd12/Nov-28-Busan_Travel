import React, { useState } from 'react';
import { TripPlan, Place } from '../../types/trip';
import { Calculator, Ticket, Utensils, Home, Car, CheckCircle2, AlertCircle, Users, ExternalLink } from 'lucide-react';
import { formatCurrency } from '../../utils/mapUtils';
import { BookingStatusBadge } from '../common/Badge';

interface BudgetSummaryProps {
  trip: TripPlan;
  onSelectPlace: (place: Place) => void;
}

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({ trip, onSelectPlace }) => {
  const [friendsCount, setFriendsCount] = useState<number>(trip.travelerCount || 5);

  // Collect all places
  const allPlaces: Place[] = [];
  trip.days.forEach(d => d.places.forEach(p => allPlaces.push(p)));

  // Calculate costs
  let totalActivityCostPerPerson = 0;
  let totalFoodCostPerPerson = 0;
  let totalStayCostPerPerson = 0;
  let totalTransportCostPerPerson = 0;

  allPlaces.forEach(p => {
    const cost = p.feeInfo.hasFee ? p.feeInfo.costPerPerson : 0;
    if (p.category === 'activity' || p.category === 'sightseeing') {
      totalActivityCostPerPerson += cost;
    } else if (p.category === 'food' || p.category === 'cafe') {
      totalFoodCostPerPerson += cost;
    } else if (p.category === 'stay') {
      totalStayCostPerPerson += cost;
    } else if (p.category === 'transport') {
      totalTransportCostPerPerson += cost;
    }
  });

  // Calculate estimated inter-spot transport fares
  let interSpotFaresTotal = 0;
  allPlaces.forEach(p => {
    if (p.transportToNext?.fare) {
      if (p.transportToNext.type === 'taxi') {
        // Shared among friends
        interSpotFaresTotal += Math.round(p.transportToNext.fare / friendsCount);
      } else {
        interSpotFaresTotal += p.transportToNext.fare;
      }
    }
  });

  const grandTotalPerPerson =
    totalActivityCostPerPerson +
    totalFoodCostPerPerson +
    totalStayCostPerPerson +
    totalTransportCostPerPerson +
    interSpotFaresTotal;

  const grandTotalAll = grandTotalPerPerson * friendsCount;

  // Filter booked or need-booking places
  const reservationPlaces = allPlaces.filter(p => p.feeInfo.hasFee || p.feeInfo.isPreBookRequired);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Card */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 mb-1.5">
              <Calculator className="w-4 h-4" />
              <span>관리자를 위한 스마트 정산 & 예산 계산기</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              예산 & 예매 현황 ({friendsCount}인 기준)
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              입장료, 식비, 액티비티, 숙소 비용을 인원수별로 자동 분할 계산합니다.
            </p>
          </div>

          {/* Friends Count Changer */}
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 p-1.5 sm:p-2 bg-slate-100 rounded-2xl self-start md:self-auto">
            <span className="text-xs font-bold text-slate-700 pl-1.5 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-500" />
              <span>인원</span>
            </span>
            <div className="flex items-center gap-1 bg-white rounded-xl p-1 shadow-2xs">
              {[2, 3, 4, 5, 6, 7].map(num => (
                <button
                  key={num}
                  onClick={() => setFriendsCount(num)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all ${
                    friendsCount === num
                      ? 'bg-sky-500 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {num}명
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 5인 기준 특화 안내 배너 */}
      {friendsCount === 5 && (
        <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-3.5 text-xs sm:text-sm text-sky-900 shadow-2xs animate-in fade-in duration-200">
          <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0 font-extrabold text-xs">
            5인
          </div>
          <div className="flex-1 leading-relaxed">
            <span className="font-bold text-sky-950">5인 맞춤 이동 & 예매 안내: </span>
            블루라인파크 스카이캡슐은 1대당 최대 4인승 규정으로 <strong>3인승 1대 + 2인승 1대(총 79,000원 / 1인 15,800원)</strong>로 나누어 탑승하며, 이동 택시비 역시 <strong>일반택시 2대 분할 또는 대형택시(벤티/아이엠)</strong> 기준으로 5인 분할 계산되어 있습니다.
          </div>
        </div>
      )}

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1인당 총 예상 회비 */}
        <div className="bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-3xl p-6 shadow-md shadow-sky-500/20">
          <div className="text-xs font-medium text-sky-100">1인당 예상 총 회비</div>
          <div className="text-3xl font-black tabular-nums tracking-tight mt-1.5">
            {formatCurrency(grandTotalPerPerson)}
          </div>
          <div className="text-xs text-sky-100/90 mt-2">
            {friendsCount}인 총합: {formatCurrency(grandTotalAll)}
          </div>
        </div>

        {/* 액티비티 및 입장료 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>티켓 / 액티비티</span>
            <Ticket className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1.5">
            {formatCurrency(totalActivityCostPerPerson)}
          </div>
          <div className="text-xs text-slate-500 mt-2">1인당 (블루라인, 요트 등)</div>
        </div>

        {/* 식비 및 카페 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>식비 & 디저트</span>
            <Utensils className="w-4 h-4 text-orange-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1.5">
            {formatCurrency(totalFoodCostPerPerson)}
          </div>
          <div className="text-xs text-slate-500 mt-2">1인당 (국밥, 회, 밀면, 조개구이 등)</div>
        </div>

        {/* 숙소비 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>숙소 / 기타</span>
            <Home className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1.5">
            {formatCurrency(totalStayCostPerPerson + interSpotFaresTotal)}
          </div>
          <div className="text-xs text-slate-500 mt-2">1인당 (숙소 + 이동 교통비)</div>
        </div>

      </div>

      {/* Reservation & Booking Checklist Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              티켓팅 및 사전예약 리스트
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              각 장소의 예약 상태와 1인당 비용, 오픈 일정을 점검하세요.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            총 {reservationPlaces.length}건
          </span>
        </div>

        <div className="space-y-3">
          {reservationPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className="p-4 rounded-2xl border border-slate-100 hover:border-sky-300 hover:bg-sky-50/30 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                  <Ticket className="w-4 h-4 text-sky-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900 hover:text-sky-600 transition-colors">
                      {place.name}
                    </h4>
                    <span className="text-xs text-slate-400">·</span>
                    <span className="text-xs text-slate-500">{place.area}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {place.feeInfo.notes || place.summary}
                  </p>
                  {place.feeInfo.bookingDeadline && (
                    <div className="text-[11px] text-sky-700 font-medium mt-1">
                      📅 {place.feeInfo.bookingDeadline}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-3 sm:shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-900 tabular-nums">
                    {place.feeInfo.hasFee
                      ? `1인 ${formatCurrency(place.feeInfo.costPerPerson)}`
                      : '무료'}
                  </div>
                  {place.feeInfo.hasFee && (
                    <div className="text-[11px] text-slate-500 tabular-nums">
                      {friendsCount}인 총 {formatCurrency(place.feeInfo.costPerPerson * friendsCount)}
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  <BookingStatusBadge feeInfo={place.feeInfo} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
