import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, MapPin, Clock, Ticket, AlertCircle } from 'lucide-react';
import { Place, Category } from '../../types/trip';

interface PlaceEditorModalProps {
  place: Place | null;
  dayNumber: number;
  isOpen: boolean;
  onClose: () => void;
  onSave: (dayNumber: number, place: Place) => void;
  onDelete?: (dayNumber: number, placeId: string) => void;
}

export const PlaceEditorModal: React.FC<PlaceEditorModalProps> = ({
  place,
  dayNumber,
  isOpen,
  onClose,
  onSave,
  onDelete,
}) => {
  const isEditing = Boolean(place);

  const [formData, setFormData] = useState<Place>({
    id: 'p_' + Date.now(),
    name: '',
    category: 'sightseeing',
    startTime: '10:00',
    endTime: '11:30',
    duration: '1시간 30분',
    area: '해운대구',
    address: '부산광역시 해운대구',
    coords: { lat: 35.1587, lng: 129.1604, mapX: 75, mapY: 50 },
    summary: '',
    description: '',
    feeInfo: {
      hasFee: false,
      costPerPerson: 0,
      isPreBookRequired: false,
      bookingStatus: 'free',
      notes: '',
    },
    recommendedMenu: [],
    photoSpots: [],
    tips: [],
  });

  const [recommendedMenuInput, setRecommendedMenuInput] = useState('');
  const [photoSpotsInput, setPhotoSpotsInput] = useState('');
  const [tipsInput, setTipsInput] = useState('');

  useEffect(() => {
    if (place) {
      setFormData(place);
      setRecommendedMenuInput(place.recommendedMenu?.join(', ') || '');
      setPhotoSpotsInput(place.photoSpots?.join(', ') || '');
      setTipsInput(place.tips?.join(', ') || '');
    } else {
      setFormData({
        id: 'p_' + Date.now(),
        name: '',
        category: 'sightseeing',
        startTime: '12:00',
        endTime: '13:30',
        duration: '1시간 30분',
        area: '부산진구 / 서면',
        address: '부산광역시',
        coords: { lat: 35.1587, lng: 129.1604, mapX: 60, mapY: 50 },
        summary: '',
        description: '',
        feeInfo: {
          hasFee: false,
          costPerPerson: 0,
          isPreBookRequired: false,
          bookingStatus: 'free',
          notes: '',
        },
      });
      setRecommendedMenuInput('');
      setPhotoSpotsInput('');
      setTipsInput('');
    }
  }, [place, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    const updated: Place = {
      ...formData,
      recommendedMenu: recommendedMenuInput
        ? recommendedMenuInput.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined,
      photoSpots: photoSpotsInput
        ? photoSpotsInput.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined,
      tips: tipsInput
        ? tipsInput.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined,
    };

    onSave(dayNumber, updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 text-slate-900 relative my-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <span className="text-xs font-bold text-sky-600 uppercase">Day {dayNumber}</span>
            <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
              {isEditing ? '장소 정보 수정' : '새로운 일정 장소 추가'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
          
          {/* 장소명 & 카테고리 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                장소 이름 *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="예: 해운대 블루라인파크"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                카테고리
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 font-medium bg-white"
              >
                <option value="sightseeing">관광명소</option>
                <option value="food">맛집/식사</option>
                <option value="cafe">카페/디저트</option>
                <option value="activity">액티비티/체험</option>
                <option value="transport">교통/집결</option>
                <option value="stay">숙소/휴식</option>
              </select>
            </div>
          </div>

          {/* 시간대 & 체류시간 */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                시작 시간
              </label>
              <input
                type="text"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                placeholder="11:30"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                종료 시간
              </label>
              <input
                type="text"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                placeholder="13:00"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                소요 시간
              </label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="1시간 30분"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 font-medium"
              />
            </div>
          </div>

          {/* 지역 & 주소 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                지역 구분
              </label>
              <input
                type="text"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                placeholder="예: 수영구 / 광안리"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 font-medium"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                상세 도로명 주소
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="부산 수영구 광안해변로 219"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 font-medium"
              />
            </div>
          </div>

          {/* 위도 & 경도 */}
          <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                위도 (Latitude)
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.coords.lat}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coords: { ...formData.coords, lat: parseFloat(e.target.value) || 35.15 },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                경도 (Longitude)
              </label>
              <input
                type="number"
                step="0.0001"
                value={formData.coords.lng}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    coords: { ...formData.coords, lng: parseFloat(e.target.value) || 129.1 },
                  })
                }
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>
          </div>

          {/* 입장료 & 예매 정보 섹션 */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200 space-y-3">
            <h4 className="font-bold text-sky-950 flex items-center gap-1.5 text-xs uppercase">
              <Ticket className="w-4 h-4 text-sky-600" />
              <span>입장료 & 예매 설정</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="hasFee"
                  checked={formData.feeInfo.hasFee}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      feeInfo: { ...formData.feeInfo, hasFee: e.target.checked },
                    })
                  }
                  className="w-4 h-4 text-sky-600 rounded"
                />
                <label htmlFor="hasFee" className="text-xs font-bold text-slate-700">
                  유료 입장/비용 발생
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  1인당 비용 (원)
                </label>
                <input
                  type="number"
                  value={formData.feeInfo.costPerPerson}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      feeInfo: {
                        ...formData.feeInfo,
                        costPerPerson: parseInt(e.target.value) || 0,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  예약 상태
                </label>
                <select
                  value={formData.feeInfo.bookingStatus}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      feeInfo: {
                        ...formData.feeInfo,
                        bookingStatus: e.target.value as any,
                      },
                    })
                  }
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                >
                  <option value="free">무료 입장</option>
                  <option value="booked">사전예매 완료</option>
                  <option value="need_booking">사전예약 필요</option>
                  <option value="on_site">현장 결제/발권</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  공식 예매 URL (선택)
                </label>
                <input
                  type="url"
                  value={formData.feeInfo.bookingUrl || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      feeInfo: { ...formData.feeInfo, bookingUrl: e.target.value },
                    })
                  }
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  예매 기한/오픈일정 (선택)
                </label>
                <input
                  type="text"
                  value={formData.feeInfo.bookingDeadline || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      feeInfo: { ...formData.feeInfo, bookingDeadline: e.target.value },
                    })
                  }
                  placeholder="예: 2주 전 화요일 09:00 오픈"
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                예매 및 할인 팁 (선택)
              </label>
              <input
                type="text"
                value={formData.feeInfo.notes || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    feeInfo: { ...formData.feeInfo, notes: e.target.value },
                  })
                }
                placeholder="예: 현장 발권은 대기가 기니 온라인 사전예매 필수"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 bg-white"
              />
            </div>
          </div>

          {/* 한줄 요약 & 상세 설명 */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              한줄 요약
            </label>
            <input
              type="text"
              value={formData.summary}
              onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
              placeholder="친구들에게 소개할 간단한 한줄 요약"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              상세 소개 설명
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="장소에 대한 상세한 매력과 설명"
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-hidden focus:border-sky-500 font-medium leading-relaxed"
            />
          </div>

          {/* 메뉴 / 포토스팟 / 꿀팁 (쉼표 구분) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                추천 메뉴 (쉼표 구분)
              </label>
              <input
                type="text"
                value={recommendedMenuInput}
                onChange={(e) => setRecommendedMenuInput(e.target.value)}
                placeholder="물밀면, 비빔밀면, 만두"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                포토존 (쉼표 구분)
              </label>
              <input
                type="text"
                value={photoSpotsInput}
                onChange={(e) => setPhotoSpotsInput(e.target.value)}
                placeholder="해안터널 앞, 바다 벤치"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                꿀팁 (쉼표 구분)
              </label>
              <input
                type="text"
                value={tipsInput}
                onChange={(e) => setTipsInput(e.target.value)}
                placeholder="편한 신발 착용, 겉옷 지참"
                className="w-full px-3 py-2 rounded-xl border border-slate-200"
              />
            </div>
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('이 장소를 일정에서 삭제하시겠습니까?')) {
                    onDelete(dayNumber, formData.id);
                    onClose();
                  }
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>장소 삭제</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>{isEditing ? '변경사항 저장' : '새 장소 추가하기'}</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
