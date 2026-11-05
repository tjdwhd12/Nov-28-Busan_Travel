import React, { useState, useEffect } from 'react';
import { useTripData } from './hooks/useTripData';
import { useTripRole } from './hooks/useTripRole';
import { Place } from './types/trip';

// [Pages] 메인페이지 및 상세페이지
import { MainPage, PlaceDetailPage } from './pages';

// [Components] 공통 네비게이션 및 모달
import { Navbar } from './components/common/Navbar';
import { MobileBottomBar } from './components/common/MobileBottomBar';
import { PlaceEditorModal } from './components/editor/PlaceEditorModal';
import { ShareModal } from './components/modals/ShareModal';
import { HostAuthModal } from './components/auth/HostAuthModal';

import { Sparkles } from 'lucide-react';

export default function App() {
  const {
    trip,
    updatePlace,
    updatePlaceFeeInfo,
    addPlace,
    deletePlace,
    addExtraExpense,
    deleteExtraExpense,
    resetToDefault,
    getEncodedTrip,
    isCloudConnected,
    isSyncing,
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
      showToast('일정 수정은 관리자만 가능합니다.');
      return;
    }
    setEditDayNumber(1);
    setSelectedEditPlace(place);
    setIsEditModalOpen(true);
  };

  const handleOpenAdd = () => {
    if (!isHost) {
      showToast('장소 추가는 관리자만 가능합니다.');
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

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* 1. 상단 네비게이션 헤더 */}
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
        isCloudConnected={isCloudConnected}
        isSyncing={isSyncing}
      />

      {/* 2. [메인페이지] 대시보드 뷰 (src/pages/MainPage.tsx) */}
      <MainPage
        trip={trip}
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        isHost={isHost}
        isPreviewingAsViewer={isPreviewingAsViewer}
        quotaExceeded={quotaExceeded}
        onOpenDetail={handleOpenDetail}
        onOpenEdit={handleOpenEdit}
        onOpenAdd={handleOpenAdd}
        onStopViewerPreview={stopViewerPreview}
        onAddExtraExpense={(item) => {
          addExtraExpense(item);
          showToast('기타 경비 항목이 등록되었습니다! 💰');
        }}
        onDeleteExtraExpense={(id) => {
          deleteExtraExpense(id);
          showToast('기타 경비 항목이 삭제되었습니다.');
        }}
        onUpdatePlaceFeeInfo={(placeId, feeInfo) => {
          updatePlaceFeeInfo(placeId, feeInfo);
          showToast('예약 항목의 금액 및 내용이 수정되었습니다! ✍️');
        }}
      />

      {/* 3. [상세페이지] 장소 세부 정보 모달 (src/pages/PlaceDetailPage.tsx) */}
      <PlaceDetailPage
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

      {/* 4. 장소 편집 및 추가 모달 (관리자 전용) */}
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

      {/* 5. 일정 공유 모달 */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        trip={trip}
        getShareUrl={getShareUrl}
        getEncodedTrip={getEncodedTrip}
        onPreviewFriendView={startViewerPreview}
      />

      {/* 6. 관리자 인증 모달 */}
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

      {/* 7. 모바일 하단 네비게이션 탭 바 */}
      <MobileBottomBar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
      />

      {/* 8. 토스트 알림 팝업 */}
      {toastMessage && (
        <div className="fixed bottom-20 lg:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs sm:text-sm font-semibold animate-in fade-in slide-in-from-bottom-4 duration-200">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
