import React, { useState } from 'react';
import {
  Car,
  MapPin,
  Clock,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  Sparkles,
  Info,
  CheckCircle2,
  Navigation,
  ShieldCheck,
  Ban,
} from 'lucide-react';
import { BUSAN_PARKING_DATA, PlaceParkingGuide, ParkingFacility } from '../../data/parkingData';
import { getNaverMapUrl, getKakaoMapUrl, getGoogleMapUrl } from '../../utils/mapUtils';

interface ParkingGuideProps {
  onSelectPlace?: (placeName: string) => void;
}

export const ParkingGuide: React.FC<ParkingGuideProps> = () => {
  const [selectedPlaceId, setSelectedPlaceId] = useState<string>('all');
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCopy = (address: string, name: string) => {
    navigator.clipboard.writeText(`${name} (${address})`);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const filteredData =
    selectedPlaceId === 'all'
      ? BUSAN_PARKING_DATA
      : BUSAN_PARKING_DATA.filter((p) => p.placeId === selectedPlaceId);

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 md:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-sky-600 mb-1.5">
              <span className="p-1 rounded-md bg-sky-100 text-sky-700">
                <Car className="w-3.5 h-3.5" />
              </span>
              <span>자차 이동 전용 주차 가이드</span>
              <span className="text-slate-300" aria-hidden="true">·</span>
              <span className="text-slate-600 font-medium">총 7개 코스</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              코스별 주차장 안내
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 sm:mt-2 leading-relaxed max-w-2xl">
              자가용 방문 시 유용한 각 여행지의 <strong>자체 전용 주차장</strong>과 <strong>인근 공영·유료 주차장</strong> 위치, <strong>무료 지원 혜택 및 시간당 주차 요금</strong>을 한눈에 확인하세요.
            </p>
          </div>

          {/* Quick Summary Pill Highlights */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
            <div className="bg-emerald-50 border border-emerald-200/80 rounded-2xl px-3.5 py-2.5 flex items-center gap-2 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-emerald-950">무료 지원 확인</div>
                <div className="text-emerald-800 text-[11px]">블루라인(2h), 엑스더스카이(2h)</div>
              </div>
            </div>
            <div className="bg-amber-50 border border-amber-200/80 rounded-2xl px-3.5 py-2.5 flex items-center gap-2 text-xs">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <div className="font-bold text-amber-950">공영 감면 50%</div>
                <div className="text-amber-800 text-[11px]">경차, 친환경차, 다자녀</div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Filter Bar by Place */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedPlaceId('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
              selectedPlaceId === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            전체 보기 (7곳)
          </button>
          {BUSAN_PARKING_DATA.map((p, idx) => {
            const isSelected = selectedPlaceId === p.placeId;
            return (
              <button
                key={p.placeId}
                onClick={() => setSelectedPlaceId(p.placeId)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-sky-600 text-white font-bold shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white/20 text-[10px] flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                <span>{p.placeName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Place Parking Cards */}
      <div className="space-y-5">
        {filteredData.map((placeGuide, idx) => {
          const globalIdx = BUSAN_PARKING_DATA.findIndex((p) => p.placeId === placeGuide.placeId) + 1;
          return (
            <div
              key={placeGuide.placeId}
              id={`parking-${placeGuide.placeId}`}
              className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-7 border border-slate-200/90 shadow-xs transition-all hover:border-slate-300"
            >
              {/* Place Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-2xl bg-sky-600 text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                    {globalIdx}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                        {placeGuide.placeName}
                      </h3>
                      <span className="text-xs font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                        {placeGuide.plannedTime}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{placeGuide.area}</span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{placeGuide.destinationAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Dedicated Parking Badge */}
                <div className="flex items-center gap-2 shrink-0">
                  {placeGuide.hasDedicatedParking ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/90">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>자체 주차장 이용 가능</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200/90">
                      <Info className="w-3.5 h-3.5 text-amber-600" />
                      <span>전용 주차장 없음 (인근 주차)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Recommendation Callout */}
              <div className="my-3.5 p-3 sm:p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-700">
                  <strong className="text-slate-900 font-bold mr-1">추천 가이드:</strong>
                  {placeGuide.recommendation}
                </div>
              </div>

              {/* Parking Facilities List */}
              <div className="space-y-3 pt-1">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  이용 가능한 주차장 ({placeGuide.facilities.length}곳)
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {placeGuide.facilities.map((fac, fIdx) => {
                    const isCopied = copiedAddress === fac.address;
                    return (
                      <div
                        key={fIdx}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          fac.hasFreeSupport
                            ? 'bg-emerald-50/30 border-emerald-200 hover:border-emerald-300'
                            : fac.type === 'public'
                            ? 'bg-sky-50/20 border-sky-200 hover:border-sky-300'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div>
                          {/* Facility Header */}
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span
                                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                                    fac.type === 'dedicated'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : fac.type === 'public'
                                      ? 'bg-sky-100 text-sky-800'
                                      : 'bg-slate-100 text-slate-700'
                                  }`}
                                >
                                  {fac.typeLabel}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-500">
                                  {fac.walkingDistance}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-900 mt-1">
                                {fac.name}
                              </h4>
                            </div>

                            {/* Free / Paid Chip */}
                            {fac.hasFreeSupport ? (
                              <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white shadow-2xs">
                                무료 지원
                              </span>
                            ) : fac.type === 'public' ? (
                              <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-600 text-white shadow-2xs">
                                공영 유료
                              </span>
                            ) : (
                              <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-600 text-white shadow-2xs">
                                민영 유료
                              </span>
                            )}
                          </div>

                          {/* Free Support Condition */}
                          {fac.freeCondition && (
                            <div className="mb-2 p-2 rounded-lg bg-emerald-100/70 border border-emerald-300 text-emerald-950 text-xs font-semibold flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span>{fac.freeCondition}</span>
                            </div>
                          )}

                          {/* Fee Rate */}
                          <div className="bg-slate-50/80 p-2.5 rounded-xl border border-slate-100 space-y-1 text-xs">
                            <div className="flex items-baseline justify-between gap-2">
                              <span className="font-semibold text-slate-500 text-[11px]">주차 요금</span>
                              <span className="font-bold text-slate-900 text-right">{fac.feeRate}</span>
                            </div>
                            {fac.dailyMax && (
                              <div className="flex items-baseline justify-between gap-2 text-[11px]">
                                <span className="text-slate-400">1일 최대 요금</span>
                                <span className="font-semibold text-slate-700">{fac.dailyMax}</span>
                              </div>
                            )}
                            {fac.discountNotes && (
                              <div className="text-[11px] text-sky-700 font-medium pt-0.5 border-t border-slate-200/60">
                                💡 {fac.discountNotes}
                              </div>
                            )}
                          </div>

                          {/* Caution Notes */}
                          {fac.cautionNotes && fac.cautionNotes.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {fac.cautionNotes.map((note, nIdx) => (
                                <div
                                  key={nIdx}
                                  className="text-[11px] text-rose-800 bg-rose-50/70 border border-rose-200 px-2 py-1 rounded-lg flex items-start gap-1"
                                >
                                  <AlertTriangle className="w-3 h-3 text-rose-600 shrink-0 mt-0.5" />
                                  <span>{note}</span>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Address & Copy */}
                          <div className="mt-2.5 text-xs text-slate-600 flex items-center justify-between gap-1">
                            <span className="truncate text-[11px]">{fac.address}</span>
                            <button
                              type="button"
                              onClick={() => handleCopy(fac.address, fac.name)}
                              className="px-2 py-1 text-[11px] rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold transition-colors shrink-0 flex items-center gap-1 cursor-pointer"
                              title="주소 복사"
                            >
                              {isCopied ? (
                                <>
                                  <Check className="w-3 h-3 text-emerald-600" />
                                  <span className="text-emerald-700 font-bold">복사됨</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>복사</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Navigation Map Links */}
                        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
                          <span className="text-[11px] font-semibold text-slate-500 hidden sm:inline">
                            길찾기:
                          </span>
                          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
                            <a
                              href={getNaverMapUrl(fac.name, fac.address)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 sm:flex-none px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200/80 hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              title="네이버 지도에서 열기"
                            >
                              <span>네이버</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                            <a
                              href={getKakaoMapUrl(fac.name, fac.address)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 sm:flex-none px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200/80 hover:bg-amber-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              title="카카오맵에서 열기"
                            >
                              <span>카카오</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                            <a
                              href={getGoogleMapUrl(fac.name, 0, 0, fac.address)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 sm:flex-none px-2.5 py-1 text-xs font-semibold rounded-lg bg-sky-50 text-sky-700 border border-sky-200/80 hover:bg-sky-100 transition-colors flex items-center justify-center gap-1 cursor-pointer"
                              title="구글 지도에서 열기"
                            >
                              <span>구글</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* 3. Bottom Comprehensive Parking Tips Box */}
      <div className="bg-gradient-to-r from-sky-900 to-indigo-950 text-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-md">
        <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span>부산 자차 여행 핵심 주차 꿀팁 총정리</span>
        </h3>
        <ul className="text-xs sm:text-sm text-sky-100 space-y-2 leading-relaxed">
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-300 shrink-0">1.</span>
            <span>
              <strong>해운대블루라인파크(미포정거장):</strong> 전용 타워 주차장은 승용차 전용(SUV·RV·전기차 불가)이므로, <strong>SUV 이용 시 문텐로드 공영주차장</strong>(도보 4분)으로 바로 이동하는 것이 시간을 절약할 수 있습니다.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-300 shrink-0">2.</span>
            <span>
              <strong>부산엑스더스카이(엘시티):</strong> 100층 전망대 입장객은 <strong>지하주차장 2시간 전액 무료</strong>입니다. 1층 안내데스크/매표소에서 티켓 제시 후 차량 번호 등록을 꼭 받으세요.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-300 shrink-0">3.</span>
            <span>
              <strong>전포 카페거리(브런치 & 러버커피):</strong> 골목 내 불법 주정차 단속이 심하므로 안전하고 넓은 <strong>전포역 지하 공영주차장</strong>(10분 300원)을 이용하시면 편리합니다.
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-amber-300 shrink-0">4.</span>
            <span>
              <strong>도심속바다(연산동):</strong> 마지막 코스에서 식사 및 음주 예정이므로 귀가 시 <strong>대리운전</strong>을 사전에 호출하거나 인근 한창타워 주차장에 안전하게 주차하세요.
            </span>
          </li>
        </ul>
      </div>

    </div>
  );
};

export default ParkingGuide;
