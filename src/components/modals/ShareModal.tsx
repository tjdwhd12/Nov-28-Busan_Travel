import React, { useState } from 'react';
import {
  X,
  Share2,
  Copy,
  Check,
  Shield,
  Eye,
  Lock,
} from 'lucide-react';
import { TripPlan } from '../../types/trip';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip?: TripPlan;
  getShareUrl: (role: 'viewer' | 'host', hashData?: string) => string;
  getEncodedTrip?: () => string;
  onPreviewFriendView: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  getShareUrl,
  onPreviewFriendView,
}) => {
  const [copiedType, setCopiedType] = useState<string | null>(null);

  if (!isOpen) return null;

  const viewerUrl = getShareUrl('viewer');

  const handleCopy = (text: string, typeKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(typeKey);
    setTimeout(() => {
      setCopiedType(null);
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 p-5 sm:p-7 relative my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          title="닫기"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-2xl bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-sky-600">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>권한 분리 보호 모드</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              일정 공유하기
            </h2>
          </div>
        </div>

        {/* Security / Permission Highlight Banner */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-5">
          <div className="flex items-start gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0 mt-0.5">
              <Shield className="w-3.5 h-3.5" />
            </div>
            <div className="text-xs leading-relaxed text-emerald-950">
              <p className="font-bold text-emerald-900 text-[13px] mb-0.5">
                열람만 가능하며, 수정할 수 없습니다!
              </p>
              <p className="text-emerald-800">
                아래 링크로 접속 시 <span className="font-semibold underline underline-offset-2">장소 추가하기 버튼</span> 및 <span className="font-semibold underline underline-offset-2">장소 수정/삭제 버튼</span>이 자동으로 완전히 숨겨진 깨끗한 일정표를 보게 됩니다.
              </p>
            </div>
          </div>
        </div>

        {/* Share Link (View-Only) */}
        <div className="space-y-4">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-sky-600" />
                <span>공유 링크 (보기 전용 · 수정 불가)</span>
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                수정 버튼 숨김
              </span>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={viewerUrl}
                className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 font-mono select-all truncate focus:outline-hidden"
              />
              <button
                onClick={() => handleCopy(viewerUrl, 'viewer-link')}
                className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center gap-1.5 transition-colors shrink-0 shadow-xs active:scale-95 cursor-pointer"
              >
                {copiedType === 'viewer-link' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>복사됨!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>링크 복사</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Admin Controls & Preview */}
          <div className="pt-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-1.5 text-slate-500">
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>관리자 전용 편집 권한 보호 중</span>
            </div>

            <button
              onClick={() => {
                onClose();
                onPreviewFriendView();
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-sky-600" />
              <span>열람 화면 미리보기</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
