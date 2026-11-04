import React from 'react';
import {
  Compass,
  Share2,
  PlusCircle,
  RotateCcw,
  Calendar,
  MapPin,
  DollarSign,
  Crown,
  Eye,
  KeyRound,
  Shield,
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  onOpenAddModal: () => void;
  onResetData: () => void;
  onShare: () => void;
  isHost: boolean;
  isPreviewingAsViewer?: boolean;
  onOpenHostLogin?: () => void;
  onTogglePreview?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onTabChange,
  onOpenAddModal,
  onResetData,
  onShare,
  isHost,
  isPreviewingAsViewer = false,
  onOpenHostLogin,
  onTogglePreview,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Brand Wordmark & Role Badge */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <button
              onClick={() => onTabChange('day-1')}
              className="flex items-center gap-2 text-left group transition-transform active:scale-95"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs group-hover:bg-sky-600 transition-colors">
                <Compass className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap">
                  11/28 부산 여행
                </span>
              </div>
            </button>

            {/* Role Chip Badge */}
            {isHost ? (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80 shadow-2xs">
                <Crown className="w-3 h-3 text-amber-600" />
                <span>관리자(편집 권한)</span>
              </span>
            ) : (
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                <Shield className="w-3 h-3 text-emerald-600" />
                <span>열람 전용 모드</span>
              </span>
            )}
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-600">
            <button
              onClick={() => onTabChange('day-1')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                currentTab === 'day-1' ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-sky-600" />
              <span>당일 코스 일정</span>
            </button>
            <button
              onClick={() => onTabChange('map')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                currentTab === 'map' ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>코스 지도</span>
            </button>
            <button
              onClick={() => onTabChange('budget')}
              className={`px-3.5 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                currentTab === 'budget' ? 'bg-sky-50 text-sky-700 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
              <span>예산 & 예매 현황</span>
            </button>
          </nav>

          {/* Action Zone */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Host-only Action: Add Place Button */}
            {isHost && (
              <button
                onClick={onOpenAddModal}
                className="flex items-center gap-1 px-2.5 py-1.5 sm:px-3 sm:py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                title="새 일정 장소 추가"
              >
                <PlusCircle className="w-3.5 h-3.5 text-sky-600" />
                <span className="hidden sm:inline">일정 추가</span>
              </button>
            )}

            {/* Host-only Action: Preview friend view toggle */}
            {isHost && onTogglePreview && (
              <button
                onClick={onTogglePreview}
                className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors whitespace-nowrap shrink-0"
                title="친구들이 보는 화면 미리보기"
              >
                <Eye className="w-3.5 h-3.5 text-sky-600" />
                <span>친구 화면 미리보기</span>
              </button>
            )}

            {/* Viewer Action: Host Login with PIN */}
            {!isHost && onOpenHostLogin && (
              <button
                onClick={onOpenHostLogin}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap shrink-0"
                title="관리자 비밀번호 입력하여 수정 권한 획득"
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                <span className="hidden sm:inline">관리자 로그인</span>
              </button>
            )}

            {/* Share Button (opens ShareModal with view-only friend link) */}
            <button
              onClick={onShare}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 active:scale-95"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span><span className="hidden sm:inline">친구에게 </span>공유</span>
            </button>

            {/* Host-only Action: Reset button */}
            {isHost && (
              <button
                onClick={onResetData}
                title="초기 부산 일정으로 되돌리기"
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-600 rounded-lg transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
