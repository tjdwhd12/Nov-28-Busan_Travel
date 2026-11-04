import React from 'react';
import { Calendar, Plus, MapPin } from 'lucide-react';
import { DaySchedule, Place } from '../../types/trip';
import { PlaceCard } from './PlaceCard';

interface DayTimelineProps {
  day: DaySchedule;
  onOpenDetail: (place: Place) => void;
  onEditPlace: (place: Place) => void;
  onAddPlace: (dayNumber: number) => void;
  isHost?: boolean;
}

export const DayTimeline: React.FC<DayTimelineProps> = ({
  day,
  onOpenDetail,
  onEditPlace,
  onAddPlace,
  isHost = true,
}) => {
  const totalCost = day.places.reduce(
    (sum, p) => sum + (p.feeInfo.hasFee ? p.feeInfo.costPerPerson : 0),
    0
  );

  return (
    <div className="space-y-6">
      
      {/* Day Header Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-bold text-sky-600 mb-1.5">
              <Calendar className="w-3.5 h-3.5 shrink-0" />
              <span>{day.date}</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="text-slate-600 font-medium">총 {day.places.length}개 코스</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="text-slate-600 font-medium tabular-nums">
                1인 약 {totalCost.toLocaleString()}원
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {day.title}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2 leading-relaxed">
              {day.subtitle}
            </p>
          </div>

          {/* Add Place Button - ONLY shown to Host */}
          {isHost && (
            <div className="flex items-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <button
                onClick={() => onAddPlace(day.dayNumber)}
                className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 text-xs font-bold transition-colors border border-sky-200"
              >
                <Plus className="w-4 h-4" />
                <span>장소 추가</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Places Timeline List */}
      <div className="space-y-4">
        {day.places.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300">
            <MapPin className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">아직 등록된 일정이 없습니다.</h3>
            {isHost ? (
              <>
                <p className="text-xs text-slate-500 mt-1 mb-4">
                  위의 &apos;장소 추가&apos; 버튼을 눌러 첫 번째 방문지를 등록해 보세요.
                </p>
                <button
                  onClick={() => onAddPlace(day.dayNumber)}
                  className="px-4 py-2 bg-sky-500 text-white font-semibold text-xs rounded-xl shadow-xs"
                >
                  장소 추가하기
                </button>
              </>
            ) : (
              <p className="text-xs text-slate-500 mt-1">
                주최자가 일정을 구성하는 중입니다.
              </p>
            )}
          </div>
        ) : (
          day.places.map((place, idx) => (
            <PlaceCard
              key={place.id}
              place={place}
              index={idx}
              isHost={isHost}
              onOpenDetail={() => onOpenDetail(place)}
              onEdit={() => onEditPlace(place)}
            />
          ))
        )}
      </div>

      {/* Bottom Day End Summary Card */}
      {day.places.length > 0 && (
        <div className="p-4 rounded-2xl bg-slate-100/80 border border-slate-200 text-center text-xs text-slate-600">
          <span className="font-semibold text-slate-800">부산 당일치기 코스 일정이 모두 준비되었습니다.</span>
          <span className="mx-2" aria-hidden="true">·</span>
          <span>총 {day.places.length}곳 방문 예정</span>
        </div>
      )}

    </div>
  );
};
