import React from 'react';
import { Category, FeeInfo } from '../../types/trip';
import { Utensils, Coffee, Camera, Footprints, Train, Home, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

interface CategoryBadgeProps {
  category: Category;
}

export const CategoryBadge: React.FC<CategoryBadgeProps> = ({ category }) => {
  switch (category) {
    case 'food':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-600 dark:text-orange-400">
          <Utensils className="w-3.5 h-3.5" />
          <span>맛집/식사</span>
        </span>
      );
    case 'cafe':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400">
          <Coffee className="w-3.5 h-3.5" />
          <span>오션뷰 카페</span>
        </span>
      );
    case 'sightseeing':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-sky-600 dark:text-sky-400">
          <Camera className="w-3.5 h-3.5" />
          <span>관광명소</span>
        </span>
      );
    case 'activity':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 dark:text-indigo-400">
          <Footprints className="w-3.5 h-3.5" />
          <span>체험/액티비티</span>
        </span>
      );
    case 'transport':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 dark:text-slate-400">
          <Train className="w-3.5 h-3.5" />
          <span>교통/집결</span>
        </span>
      );
    case 'stay':
      return (
        <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <Home className="w-3.5 h-3.5" />
          <span>숙소/휴식</span>
        </span>
      );
    default:
      return null;
  }
};

interface BookingStatusBadgeProps {
  feeInfo: FeeInfo;
}

export const BookingStatusBadge: React.FC<BookingStatusBadgeProps> = ({ feeInfo }) => {
  if (!feeInfo.hasFee || feeInfo.bookingStatus === 'free') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
        <CheckCircle2 className="w-3.5 h-3.5" />
        <span>무료 입장</span>
      </span>
    );
  }

  if (feeInfo.bookingStatus === 'booked') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-sky-600" />
        <span>사전예매 완료</span>
      </span>
    );
  }

  if (feeInfo.bookingStatus === 'need_booking') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
        <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
        <span>사전예약 필요</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
      <Clock className="w-3.5 h-3.5 text-slate-500" />
      <span>현장 결제</span>
    </span>
  );
};
