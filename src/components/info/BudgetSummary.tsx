import React, { useState } from 'react';
import { TripPlan, Place, ExtraExpense, FeeInfo } from '../../types/trip';
import {
  Calculator,
  Ticket,
  Utensils,
  Home,
  Car,
  Users,
  Plus,
  Trash2,
  Receipt,
  Fuel,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Pencil,
  DollarSign,
  X,
  Check
} from 'lucide-react';
import { formatCurrency } from '../../utils/mapUtils';
import { BookingStatusBadge } from '../common/Badge';

interface BudgetSummaryProps {
  trip: TripPlan;
  onSelectPlace: (place: Place) => void;
  isHost?: boolean;
  onAddExtraExpense?: (expense: Omit<ExtraExpense, 'id'>) => void;
  onDeleteExtraExpense?: (id: string) => void;
  onUpdatePlaceFeeInfo?: (placeId: string, feeInfo: Partial<FeeInfo>) => void;
}

const CATEGORY_MAP = {
  transport: { label: '교통/주유/통행료', icon: Fuel, color: 'text-blue-600 bg-blue-50 border-blue-200' },
  parking: { label: '주차비', icon: Car, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  food: { label: '간식/야식/음료', icon: Utensils, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  etc: { label: '기타 공용경비', icon: Receipt, color: 'text-purple-600 bg-purple-50 border-purple-200' },
};

const QUICK_TEMPLATES: Array<Omit<ExtraExpense, 'id'>> = [
  { title: '광안대교 / 고속도로 통행료', amount: 5000, category: 'transport', note: '왕복 톨게이트 요금' },
  { title: '차량 주유비', amount: 40000, category: 'transport', note: '부산 시내 및 귀가 주유' },
  { title: '공영/유료주차장 주차비', amount: 12000, category: 'parking', note: '미포·연산 인근 주차비' },
  { title: '편의점 간식 & 음료', amount: 25000, category: 'food', note: '물, 커피, 멀미약 등' },
];

export const BudgetSummary: React.FC<BudgetSummaryProps> = ({
  trip,
  onSelectPlace,
  isHost = false,
  onAddExtraExpense,
  onDeleteExtraExpense,
  onUpdatePlaceFeeInfo,
}) => {
  const [friendsCount, setFriendsCount] = useState<number>(trip.travelerCount || 5);

  // Form State for Manager Extra Expense
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState<string>('');
  const [newCategory, setNewCategory] = useState<'transport' | 'parking' | 'food' | 'etc'>('etc');
  const [newNote, setNewNote] = useState('');
  const [formError, setFormError] = useState('');
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // State for Editing Reservation Checklist Item
  const [editingPlaceId, setEditingPlaceId] = useState<string | null>(null);
  const [editInputMode, setEditInputMode] = useState<'perPerson' | 'total'>('perPerson');
  const [editCostPerPerson, setEditCostPerPerson] = useState<string>('');
  const [editTotalCost, setEditTotalCost] = useState<string>('');
  const [editNotes, setEditNotes] = useState<string>('');
  const [editDeadline, setEditDeadline] = useState<string>('');
  const [editStatus, setEditStatus] = useState<'booked' | 'need_booking' | 'on_site' | 'free'>('booked');
  const [editSuccessPlaceId, setEditSuccessPlaceId] = useState<string | null>(null);

  // Collect all places
  const allPlaces: Place[] = [];
  trip.days.forEach(d => d.places.forEach(p => allPlaces.push(p)));

  // Calculate costs dynamically from place feeInfo
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
        interSpotFaresTotal += Math.round(p.transportToNext.fare / friendsCount);
      } else {
        interSpotFaresTotal += p.transportToNext.fare;
      }
    }
  });

  // Calculate Extra Expenses
  const extraExpenses = trip.extraExpenses || [];
  const totalExtraAll = extraExpenses.reduce((sum, item) => sum + (item.amount || 0), 0);
  const totalExtraPerPerson = Math.round(totalExtraAll / friendsCount);

  const grandTotalPerPerson =
    totalActivityCostPerPerson +
    totalFoodCostPerPerson +
    totalStayCostPerPerson +
    totalTransportCostPerPerson +
    interSpotFaresTotal +
    totalExtraPerPerson;

  const grandTotalAll = grandTotalPerPerson * friendsCount;

  // Filter booked or need-booking places
  const reservationPlaces = allPlaces.filter(
    p => p.feeInfo.hasFee || p.feeInfo.isPreBookRequired || p.feeInfo.costPerPerson > 0 || p.category === 'activity'
  );

  // Extra Expense Handlers
  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('항목명을 입력해주세요.');
      return;
    }
    const parsedAmount = parseInt(newAmount.replace(/[^0-9]/g, ''), 10);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setFormError('올바른 금액(원)을 입력해주세요.');
      return;
    }

    if (onAddExtraExpense) {
      onAddExtraExpense({
        title: newTitle.trim(),
        amount: parsedAmount,
        category: newCategory,
        note: newNote.trim() || undefined,
      });

      setNewTitle('');
      setNewAmount('');
      setNewNote('');
      setFormError('');
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 2500);
    }
  };

  const handleApplyTemplate = (tpl: Omit<ExtraExpense, 'id'>) => {
    setNewTitle(tpl.title);
    setNewAmount(tpl.amount.toLocaleString());
    setNewCategory(tpl.category);
    setNewNote(tpl.note || '');
    setFormError('');
  };

  const handleQuickAddAmount = (addValue: number) => {
    const current = parseInt(newAmount.replace(/[^0-9]/g, '') || '0', 10);
    const updated = current + addValue;
    setNewAmount(updated.toLocaleString());
  };

  // Reservation Checklist Item Edit Handlers
  const handleStartEditReservation = (place: Place, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPlaceId(place.id);
    const cost = place.feeInfo.hasFee ? place.feeInfo.costPerPerson : 0;
    setEditCostPerPerson(cost > 0 ? cost.toLocaleString() : '0');
    setEditTotalCost((cost * friendsCount).toLocaleString());
    setEditInputMode('perPerson');
    setEditNotes(place.feeInfo.notes || '');
    setEditDeadline(place.feeInfo.bookingDeadline || '');
    setEditStatus(place.feeInfo.bookingStatus || 'need_booking');
  };

  const handleCancelEditReservation = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPlaceId(null);
  };

  const handlePerPersonCostChange = (valStr: string) => {
    const cleanNum = parseInt(valStr.replace(/[^0-9]/g, '') || '0', 10);
    setEditCostPerPerson(cleanNum > 0 ? cleanNum.toLocaleString() : '0');
    setEditTotalCost((cleanNum * friendsCount).toLocaleString());
  };

  const handleTotalCostChange = (valStr: string) => {
    const cleanTotal = parseInt(valStr.replace(/[^0-9]/g, '') || '0', 10);
    setEditTotalCost(cleanTotal > 0 ? cleanTotal.toLocaleString() : '0');
    const perPerson = Math.round(cleanTotal / friendsCount);
    setEditCostPerPerson(perPerson > 0 ? perPerson.toLocaleString() : '0');
  };

  const handleQuickAdjustReservationCost = (delta: number) => {
    const current = parseInt(editCostPerPerson.replace(/[^0-9]/g, '') || '0', 10);
    const updated = delta === 0 ? 0 : Math.max(0, current + delta);
    handlePerPersonCostChange(updated.toString());
  };

  const handleSaveReservationEdit = (placeId: string, e?: React.FormEvent | React.MouseEvent) => {
    if (e) e.preventDefault();
    const costPerPersonNum = parseInt(editCostPerPerson.replace(/[^0-9]/g, '') || '0', 10);

    if (onUpdatePlaceFeeInfo) {
      onUpdatePlaceFeeInfo(placeId, {
        costPerPerson: costPerPersonNum,
        hasFee: costPerPersonNum > 0 || editStatus !== 'free',
        notes: editNotes.trim(),
        bookingStatus: editStatus,
        bookingDeadline: editDeadline.trim() || undefined,
      });

      setEditingPlaceId(null);
      setEditSuccessPlaceId(placeId);
      setTimeout(() => setEditSuccessPlaceId(null), 2500);
    }
  };

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
              입장료, 식비, 액티비티, 숙소, 그리고 관리자 추가 경비까지 인원수별로 자동 분할 계산합니다.
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
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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
          <div className="text-xs text-slate-500 mt-2">1인당 (블루라인, 엑스더스카이 등)</div>
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
          <div className="text-xs text-slate-500 mt-2">1인당 (국밥, 회, 밀면, 디저트 등)</div>
        </div>

        {/* 숙소비 및 기타 추가 경비 */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>기타 공용경비 & 이동</span>
            <Receipt className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-slate-900 tabular-nums mt-1.5">
            {formatCurrency(totalStayCostPerPerson + interSpotFaresTotal + totalExtraPerPerson)}
          </div>
          <div className="text-xs text-slate-500 mt-2">
            1인당 (기타경비 {formatCurrency(totalExtraPerPerson)} 포함)
          </div>
        </div>

      </div>

      {/* ========================================================
          [섹션 1] 관리자 기타 공용 경비 / 추가 비용 관리
          ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <Receipt className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-900">
                기타 공용 경비 & 추가 비용 관리
              </h3>
              {isHost && (
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  관리자 모드
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              차량 주유비, 고속도로 통행료, 주차비, 숙소 간식비 등 현장 공용 경비를 등록하여 {friendsCount}인 1/N 정산에 즉시 반영합니다.
            </p>
          </div>

          <div className="text-right shrink-0">
            <span className="text-xs text-slate-400 block">기타 경비 총합</span>
            <span className="text-base font-extrabold text-purple-900 tabular-nums">
              {formatCurrency(totalExtraAll)}
            </span>
            <span className="text-xs text-slate-500 ml-1">
              (1인당 {formatCurrency(totalExtraPerPerson)})
            </span>
          </div>
        </div>

        {/* 관리자 등록 폼 (isHost === true 일 때만 활성화) */}
        {isHost ? (
          <div className="bg-purple-50/50 border border-purple-200/80 rounded-2xl p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-purple-900">
                <Plus className="w-4 h-4 text-purple-600" />
                <span>새 기타 경비 등록</span>
              </div>
              <span className="text-[11px] text-purple-700">
                💡 빠른 템플릿을 클릭하면 자동으로 채워집니다
              </span>
            </div>

            {/* 빠른 추천 템플릿 칩 */}
            <div className="flex flex-wrap items-center gap-1.5">
              {QUICK_TEMPLATES.map((tpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleApplyTemplate(tpl)}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white border border-purple-200 hover:border-purple-400 text-purple-900 hover:bg-purple-100/60 transition-colors font-medium flex items-center gap-1 shadow-2xs cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-purple-500" />
                  <span>{tpl.title}</span>
                  <span className="text-purple-600 font-bold">({formatCurrency(tpl.amount)})</span>
                </button>
              ))}
            </div>

            <form onSubmit={handleAddExpense} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* 항목명 */}
                <div className="sm:col-span-5">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    항목명 <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => {
                      setNewTitle(e.target.value);
                      if (formError) setFormError('');
                    }}
                    placeholder="예: 광안대교 통행료, 주유비, 주차비"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 focus:border-transparent font-medium"
                  />
                </div>

                {/* 카테고리 */}
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    카테고리
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
                  >
                    <option value="transport">교통/주유/통행료</option>
                    <option value="parking">주차비</option>
                    <option value="food">간식/음료</option>
                    <option value="etc">기타 공용경비</option>
                  </select>
                </div>

                {/* 금액 */}
                <div className="sm:col-span-4">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    총 금액 (원) <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={newAmount}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setNewAmount(val ? parseInt(val, 10).toLocaleString() : '');
                        if (formError) setFormError('');
                      }}
                      placeholder="예: 30,000"
                      className="w-full px-3 py-2 pr-7 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 text-right font-bold tabular-nums"
                    />
                    <span className="absolute right-2.5 top-2 text-xs font-bold text-slate-400">원</span>
                  </div>
                </div>
              </div>

              {/* 금액 퀵 버튼 & 메모 & 등록 버튼 */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500 font-medium">금액 더하기:</span>
                  {[5000, 10000, 30000, 50000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleQuickAddAmount(val)}
                      className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold transition-colors cursor-pointer"
                    >
                      +{formatCurrency(val)}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2 flex-1 sm:max-w-md">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="상세 메모 (선택사항, 예: 미포 인근 주차장 2시간)"
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-purple-500 font-medium"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shrink-0 transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>경비 등록</span>
                  </button>
                </div>
              </div>

              {formError && (
                <div className="text-xs text-rose-600 font-medium flex items-center gap-1.5 pt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {showSuccessToast && (
                <div className="text-xs text-emerald-700 font-medium flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>새로운 기타 경비가 등록되었으며 총 예산에 반영되었습니다!</span>
                </div>
              )}
            </form>
          </div>
        ) : (
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5 text-xs text-slate-600 flex items-center justify-between">
            <span>💡 우측 상단 <strong>[호스트 모드]</strong>를 활성화하면 새로운 기타 경비를 직접 등록 및 삭제할 수 있습니다.</span>
          </div>
        )}

        {/* 등록된 기타 경비 목록 */}
        <div className="space-y-2.5">
          {extraExpenses.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
              <Receipt className="w-6 h-6 mx-auto mb-2 text-slate-300" />
              <span>등록된 기타 공용 경비가 없습니다.</span>
              {isHost && <p className="text-[11px] text-slate-500 mt-1">위 등록창에서 주유비나 통행료, 주차비를 등록해보세요.</p>}
            </div>
          ) : (
            extraExpenses.map((expense) => {
              const catInfo = CATEGORY_MAP[expense.category] || CATEGORY_MAP.etc;
              const IconComp = catInfo.icon;
              const perPerson = Math.round(expense.amount / friendsCount);

              return (
                <div
                  key={expense.id}
                  className="p-3.5 rounded-2xl border border-slate-200/90 hover:border-purple-300 hover:bg-purple-50/20 transition-all flex items-center justify-between gap-3 bg-white"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2 rounded-xl shrink-0 border ${catInfo.color}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-bold text-slate-900">{expense.title}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                          {catInfo.label}
                        </span>
                      </div>
                      {expense.note && (
                        <p className="text-[11px] text-slate-500 mt-0.5 truncate">{expense.note}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs sm:text-sm font-extrabold text-slate-900 tabular-nums">
                        {formatCurrency(expense.amount)}
                      </div>
                      <div className="text-[10px] text-slate-400 tabular-nums">
                        1인당 {formatCurrency(perPerson)}
                      </div>
                    </div>

                    {isHost && onDeleteExtraExpense && (
                      <button
                        type="button"
                        onClick={() => onDeleteExtraExpense(expense.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="경비 삭제"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ========================================================
          [섹션 2] 티켓팅 및 사전예약 리스트 (항목별 실결제 수정 지원)
          ======================================================== */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                티켓팅 및 사전예약 리스트
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                총 {reservationPlaces.length}건
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              각 장소의 예약 상태와 1인당 비용, 오픈 일정을 점검하세요.
            </p>
          </div>

          {isHost && (
            <div className="text-xs text-sky-700 bg-sky-50 border border-sky-200 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5 self-start sm:self-auto">
              <Pencil className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span>실제 결제 금액 및 메모가 다를 경우 <strong>[수정]</strong> 버튼으로 변경할 수 있습니다.</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {reservationPlaces.map((place) => {
            const isEditing = editingPlaceId === place.id;
            const isJustSaved = editSuccessPlaceId === place.id;

            // 1. 인라인 편집 모드인 경우
            if (isEditing) {
              return (
                <div
                  key={place.id}
                  className="p-4 sm:p-5 rounded-2xl border-2 border-sky-400 bg-sky-50/50 shadow-sm transition-all space-y-4 animate-in fade-in duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between gap-2 pb-3 border-b border-sky-200">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-sky-600 text-white shrink-0">
                        <Pencil className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-extrabold text-slate-900">
                            {place.name} 예약 정보 및 결제 금액 수정
                          </h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-200 text-sky-900">
                            {place.area}
                          </span>
                        </div>
                        <p className="text-[11px] text-sky-800 font-medium mt-0.5">
                          영수증 실결제 금액과 인원수 분할, 예약 일정 메모를 변경합니다.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCancelEditReservation}
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
                      title="닫기"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <form onSubmit={(e) => handleSaveReservationEdit(place.id, e)} className="space-y-4">
                    {/* 결제 금액 설정 (1인당 vs N인 총액 듀얼 입력 모드) */}
                    <div className="bg-white p-3.5 rounded-xl border border-sky-200 space-y-2.5 shadow-2xs">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <DollarSign className="w-3.5 h-3.5 text-sky-600" />
                          <span>결제 금액 설정 ({friendsCount}인 여행)</span>
                        </label>
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-[11px] font-bold">
                          <button
                            type="button"
                            onClick={() => setEditInputMode('perPerson')}
                            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                              editInputMode === 'perPerson'
                                ? 'bg-sky-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            1인당 금액 기준
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditInputMode('total')}
                            className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                              editInputMode === 'total'
                                ? 'bg-sky-600 text-white shadow-2xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {friendsCount}인 총 결제금액 기준
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {/* 1인당 금액 input */}
                        <div>
                          <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                            1인당 금액 (원) {editInputMode === 'perPerson' && <span className="text-sky-600 font-bold">● 직접 입력 중</span>}
                          </span>
                          <div className="relative">
                            <input
                              type="text"
                              value={editCostPerPerson}
                              disabled={editInputMode === 'total'}
                              onChange={(e) => handlePerPersonCostChange(e.target.value)}
                              placeholder="예: 20,500"
                              className={`w-full px-3 py-2 text-xs rounded-xl border font-bold text-right tabular-nums pr-7 ${
                                editInputMode === 'perPerson'
                                  ? 'border-sky-300 bg-white ring-2 ring-sky-300/60 focus:outline-hidden'
                                  : 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed'
                              }`}
                            />
                            <span className="absolute right-2.5 top-2 text-xs font-bold text-slate-400">원</span>
                          </div>
                        </div>

                        {/* N인 총 결제금액 input */}
                        <div>
                          <span className="block text-[11px] font-semibold text-slate-600 mb-1">
                            {friendsCount}인 총 결제금액 (원) {editInputMode === 'total' && <span className="text-sky-600 font-bold">● 직접 입력 중</span>}
                          </span>
                          <div className="relative">
                            <input
                              type="text"
                              value={editTotalCost}
                              disabled={editInputMode === 'perPerson'}
                              onChange={(e) => handleTotalCostChange(e.target.value)}
                              placeholder="예: 102,500"
                              className={`w-full px-3 py-2 text-xs rounded-xl border font-bold text-right tabular-nums pr-7 ${
                                editInputMode === 'total'
                                  ? 'border-sky-300 bg-white ring-2 ring-sky-300/60 focus:outline-hidden'
                                  : 'border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed'
                              }`}
                            />
                            <span className="absolute right-2.5 top-2 text-xs font-bold text-slate-400">원</span>
                          </div>
                        </div>
                      </div>

                      {/* 금액 빠른 조정 칩 */}
                      <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-100 text-[11px]">
                        <span className="text-slate-500 font-medium">빠른 조정:</span>
                        <button
                          type="button"
                          onClick={() => handleQuickAdjustReservationCost(0)}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold cursor-pointer"
                        >
                          무료 (0원)
                        </button>
                        {[1000, 5000, 10000, 20000].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => handleQuickAdjustReservationCost(val)}
                            className="px-2 py-0.5 rounded-md bg-sky-50 hover:bg-sky-100 border border-sky-200 text-sky-800 font-bold cursor-pointer"
                          >
                            +{formatCurrency(val)}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 예약 상태 선택 */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1.5">
                        예약 상태
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {[
                          { key: 'booked', label: '✅ 예매완료', desc: '결제/발권 완료' },
                          { key: 'need_booking', label: '⏳ 예매필요', desc: '사전 오픈 대기' },
                          { key: 'on_site', label: '🎫 현장발권', desc: '당일 현장 결제' },
                          { key: 'free', label: '🆓 무료입장', desc: '비용 없음' },
                        ].map((item) => (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => setEditStatus(item.key as any)}
                            className={`p-2 rounded-xl text-left border transition-all text-xs cursor-pointer ${
                              editStatus === item.key
                                ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                            }`}
                          >
                            <div className="font-bold">{item.label}</div>
                            <div className={`text-[10px] mt-0.5 ${editStatus === item.key ? 'text-sky-100' : 'text-slate-400'}`}>
                              {item.desc}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 예약 내용 및 실제 결제 메모 */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        예약 내용 및 실제 결제/할인 메모
                      </label>
                      <textarea
                        rows={2}
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="예: 3인승 1대 + 2인승 1대 총 79,000원 네이버페이 결제 완료 (스카이캡슐 미포->청사포)"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
                      />
                    </div>

                    {/* 예약 기한 / 오픈 일정 안내 */}
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        예약 기한 / 일정 안내 (선택사항)
                      </label>
                      <input
                        type="text"
                        value={editDeadline}
                        onChange={(e) => setEditDeadline(e.target.value)}
                        placeholder="예: 이용일 2주 전 화요일 09:00 오픈 / 모바일 바코드 입장"
                        className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-sky-200">
                      <button
                        type="button"
                        onClick={handleCancelEditReservation}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                      >
                        취소
                      </button>
                      <button
                        type="submit"
                        className="px-5 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-4 h-4" />
                        <span>수정사항 저장</span>
                      </button>
                    </div>
                  </form>
                </div>
              );
            }

            // 2. 일반 리스트 표시 모드
            return (
              <div
                key={place.id}
                onClick={() => onSelectPlace(place)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isJustSaved
                    ? 'border-emerald-400 bg-emerald-50/40 ring-1 ring-emerald-300'
                    : 'border-slate-100 hover:border-sky-300 hover:bg-sky-50/30 bg-white'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 shrink-0 mt-0.5">
                    <Ticket className="w-4 h-4 text-sky-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900 hover:text-sky-600 transition-colors">
                        {place.name}
                      </h4>
                      <span className="text-xs text-slate-400">·</span>
                      <span className="text-xs text-slate-500">{place.area}</span>
                      {isJustSaved && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                          수정 완료! ✨
                        </span>
                      )}
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
                      {place.feeInfo.hasFee && place.feeInfo.costPerPerson > 0
                        ? `1인 ${formatCurrency(place.feeInfo.costPerPerson)}`
                        : '무료'}
                    </div>
                    {place.feeInfo.hasFee && place.feeInfo.costPerPerson > 0 && (
                      <div className="text-[11px] text-slate-500 tabular-nums">
                        {friendsCount}인 총 {formatCurrency(place.feeInfo.costPerPerson * friendsCount)}
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    <BookingStatusBadge feeInfo={place.feeInfo} />
                  </div>

                  {isHost && (
                    <button
                      type="button"
                      onClick={(e) => handleStartEditReservation(place, e)}
                      className="px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-sky-100 hover:text-sky-700 text-slate-600 text-xs font-bold transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                      title="실제 결제 내용 및 금액 수정"
                    >
                      <Pencil className="w-3.5 h-3.5 text-sky-600" />
                      <span>수정</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
