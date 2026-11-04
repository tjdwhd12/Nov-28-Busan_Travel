import React, { useState } from 'react';
import { X, Lock, ShieldCheck, KeyRound, AlertCircle, ArrowRight } from 'lucide-react';
import { DEFAULT_HOST_PIN } from '../../hooks/useTripRole';

interface HostAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (pin: string) => boolean;
}

export const HostAuthModal: React.FC<HostAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [pin, setPin] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setErrorMessage('비밀번호(PIN)를 입력해 주세요.');
      return;
    }

    const isAuthorized = onSuccess(pin.trim());
    if (isAuthorized) {
      setErrorMessage(null);
      setPin('');
      onClose();
    } else {
      setErrorMessage(`비밀번호가 일치하지 않습니다. (초기 설정 비밀번호: ${DEFAULT_HOST_PIN})`);
    }
  };

  const handleQuickFill = () => {
    setPin(DEFAULT_HOST_PIN);
    setErrorMessage(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 text-slate-900 p-6 sm:p-7 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
          title="닫기"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>총무 / 주최자 인증</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
              일정 편집 권한 활성화
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
          친구들이 접속했을 때는 수정 및 장소 추가 버튼이 보이지 않습니다. 일정을 직접 수정하고 장소를 추가하려면 총무 비밀번호를 입력해 주세요.
        </p>

        {/* PIN Input Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              총무 비밀번호 (4자리)
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                inputMode="numeric"
                maxLength={8}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (errorMessage) setErrorMessage(null);
                }}
                placeholder="4자리 숫자 입력"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-center text-lg font-bold tracking-widest text-slate-900 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all placeholder:text-slate-400 placeholder:text-sm placeholder:tracking-normal"
                autoFocus
              />
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick hint badge */}
          <div className="bg-sky-50 rounded-xl p-3 border border-sky-100 flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium">
              기본 비밀번호는 여행일인 <span className="font-bold text-sky-700">{DEFAULT_HOST_PIN}</span> 입니다.
            </span>
            <button
              type="button"
              onClick={handleQuickFill}
              className="text-xs font-bold text-sky-600 hover:text-sky-800 underline ml-2 shrink-0"
            >
              자동 입력
            </button>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 active:scale-95"
            >
              <span>인증하고 수정하기</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
