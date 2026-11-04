/**
 * ========================================================
 * [Images / 사진 이미지 모듈]
 * - 11/28 부산 여행지 대표 사진 파일 목록
 * ========================================================
 */

import stationImg from './busan_station.jpg';
import gukbapImg from './busan_gukbap.jpg';
import huinnyeoulImg from './busan_huinnyeoul_village_1793758243637.jpg';
import capsuleImg from './busan_blueline_skycapsule_1793758242836.jpg';
import gwanganImg from './busan_gwangan_bridge_night_1793758242245.jpg';
import gamcheonImg from './busan_gamcheon_village_1793758244599.jpg';

export const TRIP_IMAGES = {
  /** 부산역 KTX 역사 및 대합실 */
  busanStation: stationImg,
  /** 본전돼지국밥 뚝배기 수육 한상 */
  gukbap: gukbapImg,
  /** 영도 흰여울문화마을 */
  huinnyeoulVillage: huinnyeoulImg,
  /** 해운대 블루라인파크 스카이캡슐 */
  skyCapsule: capsuleImg,
  /** 광안리 해변 & 광안대교 야경 */
  gwanganBridge: gwanganImg,
  /** 감천문화마을 */
  gamcheonVillage: gamcheonImg,
};

/**
 * 공유 링크 또는 브라우저 로컬스토리지에서 오래된 /src/assets/images/... 문자열이 들어오더라도
 * 번들된 정상 이미지 URL로 안전하게 매핑해주는 해석 함수
 */
export function resolvePlaceImage(url?: string, placeId?: string, placeName?: string): string {
  if (url && (url.startsWith('data:') || url.startsWith('http://') || url.startsWith('https://'))) {
    return url;
  }
  const str = `${url || ''} ${placeId || ''} ${placeName || ''}`.toLowerCase();

  if (str.includes('d1-p1') || str.includes('d1-p6') || str.includes('부산역') || str.includes('busan_station')) {
    return TRIP_IMAGES.busanStation;
  }
  if (str.includes('d1-p2') || str.includes('돼지국밥') || str.includes('gukbap')) {
    return TRIP_IMAGES.gukbap;
  }
  if (str.includes('d1-p3') || str.includes('흰여울') || str.includes('huinnyeoul')) {
    return TRIP_IMAGES.huinnyeoulVillage;
  }
  if (str.includes('d1-p4') || str.includes('스카이캡슐') || str.includes('블루라인') || str.includes('skycapsule') || str.includes('blueline')) {
    return TRIP_IMAGES.skyCapsule;
  }
  if (str.includes('d1-p5') || str.includes('광안') || str.includes('gwangan') || str.includes('민락')) {
    return TRIP_IMAGES.gwanganBridge;
  }
  if (str.includes('감천') || str.includes('gamcheon')) {
    return TRIP_IMAGES.gamcheonVillage;
  }

  return url || TRIP_IMAGES.busanStation;
}

export default TRIP_IMAGES;
