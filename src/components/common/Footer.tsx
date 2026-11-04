import React from 'react';
import { Compass, Download, Heart, Shield } from 'lucide-react';

interface FooterProps {
  onExport: () => void;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onExport, onNavigate }) => {
  return (
    <footer className="mt-16 bg-slate-900 text-slate-400 border-t border-slate-800 pb-20 lg:pb-8 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800 text-xs">
          
          {/* Col 1: Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <div className="w-6 h-6 rounded-lg bg-sky-500 text-white flex items-center justify-center">
                <Compass className="w-3.5 h-3.5" />
              </div>
              <span>11월 28일 부산 여행</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              11월 28일 부산 여행 플래너 및 장소 정보, 네이버·카카오·구글 지도 연동 안내 시스템입니다.
            </p>
            <div>
              <button
                onClick={onExport}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-sky-400" />
                <span>일정 JSON 백업 다운로드</span>
              </button>
            </div>
          </div>

          {/* Col 2: 빠른 이동 */}
          <div>
            <h4 className="font-bold text-slate-200 mb-3 text-xs tracking-wide">
              일정 빠른 이동
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onNavigate('day-1')}
                  className="hover:text-white transition-colors"
                >
                  부산 당일치기 전체 일정
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('map')}
                  className="hover:text-white transition-colors"
                >
                  당일 여행 코스 지도
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('budget')}
                  className="hover:text-white transition-colors"
                >
                  1인당 예산 & 정산 계산기
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: 유용한 긴급 연락처 */}
          <div>
            <h4 className="font-bold text-slate-200 mb-3 text-xs tracking-wide">
              부산 여행 필수 안내 전화
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <span className="text-slate-200 font-semibold">1330</span> (한국관광공사 24시간 안내/통역)
              </li>
              <li>
                <span className="text-slate-200 font-semibold">051-600-1000</span> (부산 브랜드 콜택시)
              </li>
              <li>
                <span className="text-slate-200 font-semibold">051-444-7788</span> (부산역 유실물센터)
              </li>
              <li>
                <span className="text-slate-200 font-semibold">1544-7788</span> (코레일 고객센터)
              </li>
            </ul>
          </div>

          {/* Col 4: 안내 */}
          <div>
            <h4 className="font-bold text-slate-200 mb-3 text-xs tracking-wide">
              이용 안내
            </h4>
            <p className="text-slate-400 leading-relaxed mb-2">
              본 웹사이트의 모든 일정 및 예매 정보는 브라우저 로컬 저장소에 자동 저장되며 언제든 직접 수정하거나 새 장소를 추가할 수 있습니다.
            </p>
            <div className="flex items-center gap-1.5 text-slate-500">
              <Shield className="w-3.5 h-3.5 text-emerald-500" />
              <span>네이버 지도 & 카카오맵 실시간 연동 지원</span>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} Busan Trip Secret Guide. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            <span>Crafted for an unforgettable trip to Busan</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" />
          </div>
        </div>

      </div>
    </footer>
  );
};
