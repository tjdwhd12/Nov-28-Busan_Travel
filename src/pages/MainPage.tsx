/**
 * ========================================================
 * [메인페이지 / 11/28 부산 여행 플래너 대시보드]
 * - 파일 위치: src/pages/MainPage.tsx
 * - 역할: 웹사이트 접속 시 보여지는 메인 화면
 *   (상단 타이틀, 코스 탭 네비게이션, 당일 타임라인 코스, 인터랙티브 코스 지도, 5인 예산 & 예매 현황)
 * - GitHub에서 메인 화면의 레이아웃, 배치 순서, 탭 구성을 변경할 때 이 파일을 수정하세요.
 * ========================================================
 */

import React from 'react';
import { Trip, Place, ExtraExpense, FeeInfo, SettlementAccount } from '../types/trip';
import { DayTimeline } from '../components/itinerary/DayTimeline';
import { BusanCourseMap } from '../components/map/BusanCourseMap';
import { BudgetSummary } from '../components/info/BudgetSummary';
import { ParkingGuide } from '../components/parking/ParkingGuide';
import { MapPin, Calendar, DollarSign, Car, Eye, Crown, Shield } from 'lucide-react';

export interface MainPageProps {
  trip: Trip;
  currentTab: string;
  onTabChange: (tab: string) => void;
  isHost: boolean;
  isPreviewingAsViewer: boolean;
  quotaExceeded: boolean;
  onOpenDetail: (place: Place) => void;
  onOpenEdit: (place: Place) => void;
  onOpenAdd: () => void;
  onStopViewerPreview: () => void;
  onAddExtraExpense?: (item: Omit<ExtraExpense, 'id'>) => void;
  onDeleteExtraExpense?: (id: string) => void;
  onUpdatePlaceFeeInfo?: (placeId: string, feeInfo: Partial<FeeInfo>) => void;
  onUpdateSettlementAccount?: (account: SettlementAccount | undefined) => void;
}

export const MainPage: React.FC<MainPageProps> = ({
  trip,
  currentTab,
  onTabChange,
  isHost,
  isPreviewingAsViewer,
  quotaExceeded,
  onOpenDetail,
  onOpenEdit,
  onOpenAdd,
  onStopViewerPreview,
  onAddExtraExpense,
  onDeleteExtraExpense,
  onUpdatePlaceFeeInfo,
  onUpdateSettlementAccount,
}) => {
  const activeDay = trip.days[0];

  return (
    <div className="flex-1 flex flex-col">
      {/* 1. 관리자의 열람 화면(보기 전용) 미리보기 상태 안내 배너 */}
      {isPreviewingAsViewer && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs sm:text-sm font-semibold sticky top-16 z-40 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 max-w-2xl">
            <Eye className="w-4 h-4 shrink-0 text-slate-950" />
            <span>
              [미리보기 중] 공유 링크로 접속했을 때 보게 될 <strong>열람 전용 화면(수정/추가 버튼 숨김)</strong>입니다.
            </span>
          </div>
          <button
            onClick={onStopViewerPreview}
            className="px-3 py-1 bg-slate-950 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>관리자 편집 모드로 복귀</span>
          </button>
        </div>
      )}

      {/* 2. Google Maps API 쿼터 알림 배너 */}
      {quotaExceeded && (
        <div className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2.5 text-xs md:text-sm text-center sticky top-16 z-50 shadow-sm">
          <span>
            Google Maps Platform quota reached. If you are the app owner, visit{' '}
            <a
              href="https://developers.google.com/maps/ai/ai-studio?utm_campaign=gmp_mcp_codeassist_v1_aistudio#quota_exceeded_errors"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-semibold text-amber-950 hover:text-amber-800"
            >
              maps developer site
            </a>{' '}
            for instructions to update your account.
          </span>
        </div>
      )}

      {/* 3. 메인 콘텐츠 컨테이너 */}
      <main className="flex-1 max-w-7xl w-full mx-auto pb-24 sm:pb-16">
        
        {/* 상단 헤더 & 탭 네비게이션 */}
        <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200">
            <div>
              {/* 여행 메타 정보 뱃지 */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-500 font-medium mb-1">
                <span className="font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                  당일치기 코스
                </span>
                <span>{trip.startDate}</span>
                <span aria-hidden="true">·</span>
                <span>{trip.travelerCount}인 동행</span>
                <span aria-hidden="true">·</span>
                <span>{trip.destination}</span>
                {!isHost && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      <Shield className="w-3 h-3 text-emerald-600" />
                      보기 전용
                    </span>
                  </>
                )}
              </div>
              
              {/* 메인 타이틀 (11/28 부산 여행) */}
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {trip.title}
              </h1>
            </div>

            {/* 네비게이션 탭 바 (모바일 반응형 4분할 그리드 & 데스크톱 플렉스) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 w-full sm:w-auto sm:flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
              <button
                onClick={() => onTabChange('day-1')}
                className={`px-2 sm:px-3.5 py-2 rounded-lg text-xs font-bold transition-all justify-center flex items-center gap-1.5 ${
                  currentTab === 'day-1'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                <span className="truncate">당일 코스</span>
              </button>
              <button
                onClick={() => onTabChange('map')}
                className={`px-2 sm:px-3.5 py-2 rounded-lg text-xs font-bold transition-all justify-center flex items-center gap-1.5 ${
                  currentTab === 'map'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <span className="truncate">코스 지도</span>
              </button>
              <button
                onClick={() => onTabChange('parking')}
                className={`px-2 sm:px-3.5 py-2 rounded-lg text-xs font-bold transition-all justify-center flex items-center gap-1.5 ${
                  currentTab === 'parking'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Car className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                <span className="truncate">주차장</span>
              </button>
              <button
                onClick={() => onTabChange('budget')}
                className={`px-2 sm:px-3.5 py-2 rounded-lg text-xs font-bold transition-all justify-center flex items-center gap-1.5 ${
                  currentTab === 'budget'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">예산 & 예매</span>
              </button>
            </div>
          </div>
        </div>

        {/* 탭 전환 콘텐츠 영역 */}
        <div className="px-4 sm:px-6 lg:px-8 mt-6">
          
          {/* 탭 1: 당일 타임라인 코스 */}
          {currentTab === 'day-1' && activeDay && (
            <DayTimeline
              day={activeDay}
              isHost={isHost}
              onOpenDetail={onOpenDetail}
              onEditPlace={onOpenEdit}
              onAddPlace={onOpenAdd}
            />
          )}

          {/* 탭 2: 인터랙티브 부산 코스 지도 */}
          {currentTab === 'map' && (
            <BusanCourseMap
              trip={trip}
              onSelectPlace={onOpenDetail}
            />
          )}

          {/* 탭 3: 자차 여행 코스별 주차장 가이드 */}
          {currentTab === 'parking' && (
            <ParkingGuide />
          )}

          {/* 탭 4: 5인 회비 정산 및 예산/예매 현황 */}
          {currentTab === 'budget' && (
            <BudgetSummary
              trip={trip}
              onSelectPlace={onOpenDetail}
              isHost={isHost}
              onAddExtraExpense={onAddExtraExpense}
              onDeleteExtraExpense={onDeleteExtraExpense}
              onUpdatePlaceFeeInfo={onUpdatePlaceFeeInfo}
              onUpdateSettlementAccount={onUpdateSettlementAccount}
            />
          )}

        </div>

      </main>
    </div>
  );
};

export default MainPage;
