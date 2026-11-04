import React, { useState, useEffect } from 'react';
import { useTripData } from './hooks/useTripData';
import { useTripRole } from './hooks/useTripRole';
import { Place } from './types/trip';
import { Navbar } from './components/common/Navbar';
import { MobileBottomBar } from './components/common/MobileBottomBar';
import { DayTimeline } from './components/itinerary/DayTimeline';
import { PlaceDetailModal } from './components/itinerary/PlaceDetailModal';
import { PlaceEditorModal } from './components/editor/PlaceEditorModal';
import { BusanCourseMap } from './components/map/BusanCourseMap';
import { BudgetSummary } from './components/info/BudgetSummary';
import { Footer } from './components/common/Footer';
import { ShareModal } from './components/modals/ShareModal';
import { HostAuthModal } from './components/auth/HostAuthModal';
import { Sparkles, MapPin, Calendar, DollarSign, Eye, Crown, ArrowLeft, Shield } from 'lucide-react';

export default function App() {
  const {
    trip,
    updatePlace,
    addPlace,
    deletePlace,
    resetToDefault,
    exportToJson,
    getEncodedTrip,
  } = useTripData();

  const {
    role,
    isHost,
    isViewer,
    isPreviewingAsViewer,
    loginAsHost,
    startViewerPreview,
    stopViewerPreview,
    getShareUrl,
  } = useTripRole();

  const [currentTab, setCurrentTab] = useState<string>('day-1');
  const [selectedDetailPlace, setSelectedDetailPlace] = useState<Place | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);

  const [selectedEditPlace, setSelectedEditPlace] = useState<Place | null>(null);
  const [editDayNumber, setEditDayNumber] = useState<number>(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);

  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [isHostAuthModalOpen, setIsHostAuthModalOpen] = useState<boolean>(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [quotaExceeded, setQuotaExceeded] = useState<boolean>(false);

  useEffect(() => {
    const handleQuota = () => setQuotaExceeded(true);
    window.addEventListener('gmp-quota-exceeded', handleQuota);
    return () => window.removeEventListener('gmp-quota-exceeded', handleQuota);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleOpenDetail = (place: Place) => {
    setSelectedDetailPlace(place);
    setIsDetailModalOpen(true);
  };

  const handleOpenEdit = (place: Place) => {
    if (!isHost) {
      showToast('일정 수정은 총무(주최자)만 가능합니다.');
      return;
    }
    setEditDayNumber(1);
    setSelectedEditPlace(place);
    setIsEditModalOpen(true);
  };

  const handleOpenAdd = () => {
    if (!isHost) {
      showToast('장소 추가는 총무(주최자)만 가능합니다.');
      return;
    }
    setEditDayNumber(1);
    setSelectedEditPlace(null);
    setIsEditModalOpen(true);
  };

  const handleSavePlace = (dayNumber: number, place: Place) => {
    if (selectedEditPlace) {
      updatePlace(dayNumber, place);
      showToast('장소 정보가 성공적으로 수정되었습니다! ✨');
    } else {
      addPlace(dayNumber, place);
      showToast('새로운 장소가 당일 일정에 추가되었습니다! 🎉');
    }
    if (selectedDetailPlace && selectedDetailPlace.id === place.id) {
      setSelectedDetailPlace(place);
    }
  };

  const handleDeletePlace = (dayNumber: number, placeId: string) => {
    deletePlace(dayNumber, placeId);
    showToast('일정 장소가 삭제되었습니다.');
  };

  const handleReset = () => {
    if (!isHost) return;
    if (confirm('초기 추천 부산 당일치기 코스로 되돌리시겠습니까?')) {
      resetToDefault();
      showToast('초기 부산 당일치기 일정으로 복원되었습니다.');
    }
  };

  const activeDay = trip.days[0];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        onOpenAddModal={handleOpenAdd}
        onResetData={handleReset}
        onShare={() => setIsShareModalOpen(true)}
        isHost={isHost}
        isPreviewingAsViewer={isPreviewingAsViewer}
        onOpenHostLogin={() => setIsHostAuthModalOpen(true)}
        onTogglePreview={isPreviewingAsViewer ? stopViewerPreview : startViewerPreview}
      />

      {/* Host Previewing Friend View Banner */}
      {isPreviewingAsViewer && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2.5 text-xs sm:text-sm font-semibold sticky top-16 z-40 shadow-sm flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 max-w-2xl">
            <Eye className="w-4 h-4 shrink-0 text-slate-950" />
            <span>
              [미리보기 중] 친구들에게 공유되었을 때 보게 될 <strong>열람 전용 화면(수정/추가 버튼 숨김)</strong>입니다.
            </span>
          </div>
          <button
            onClick={stopViewerPreview}
            className="px-3 py-1 bg-slate-950 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shrink-0 flex items-center gap-1"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>총무 편집 모드로 복귀</span>
          </button>
        </div>
      )}

      {/* Google Maps Quota Warning Banner */}
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

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto pb-24 sm:pb-16">
        
        {/* Clean Header Bar */}
        <div className="px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-4 border-b border-slate-200">
            <div>
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
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                {trip.title}
              </h1>
            </div>

            {/* Navigation Tabs Bar */}
            <div className="grid grid-cols-3 w-full sm:w-auto sm:flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0">
              <button
                onClick={() => setCurrentTab('day-1')}
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
                onClick={() => setCurrentTab('map')}
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
                onClick={() => setCurrentTab('budget')}
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

        {/* View Content based on active tab */}
        <div className="px-4 sm:px-6 lg:px-8 mt-6">
          
          {/* Day View */}
          {currentTab === 'day-1' && activeDay && (
            <DayTimeline
              day={activeDay}
              isHost={isHost}
              onOpenDetail={handleOpenDetail}
              onEditPlace={handleOpenEdit}
              onAddPlace={() => handleOpenAdd()}
            />
          )}

          {/* Interactive Map View */}
          {currentTab === 'map' && (
            <BusanCourseMap
              trip={trip}
              onSelectPlace={handleOpenDetail}
            />
          )}

          {/* Budget & Reservations View */}
          {currentTab === 'budget' && (
            <BudgetSummary
              trip={trip}
              onSelectPlace={handleOpenDetail}
            />
          )}

        </div>

      </main>

      {/* Place Detail Modal */}
      <PlaceDetailModal
        place={selectedDetailPlace}
        travelerCount={trip.travelerCount}
        isOpen={isDetailModalOpen}
        isHost={isHost}
        onClose={() => setIsDetailModalOpen(false)}
        onEdit={(place) => {
          setIsDetailModalOpen(false);
          handleOpenEdit(place);
        }}
      />

      {/* Place Editor / Add Modal (Only accessible if isHost) */}
      {isHost && (
        <PlaceEditorModal
          place={selectedEditPlace}
          dayNumber={editDayNumber}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSave={handleSavePlace}
          onDelete={handleDeletePlace}
        />
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        trip={trip}
        getShareUrl={getShareUrl}
        getEncodedTrip={getEncodedTrip}
        onPreviewFriendView={startViewerPreview}
      />

      {/* Host Auth / PIN Login Modal */}
      <HostAuthModal
        isOpen={isHostAuthModalOpen}
        onClose={() => setIsHostAuthModalOpen(false)}
        onSuccess={(pin) => {
          const res = loginAsHost(pin);
          if (res.success) {
            showToast(res.message);
            return true;
          }
          return false;
        }}
      />

      {/* Mobile Bottom Tab Bar */}
      <MobileBottomBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />

      {/* Footer */}
      <Footer
        onExport={exportToJson}
        onNavigate={setCurrentTab}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
