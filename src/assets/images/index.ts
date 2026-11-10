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
import brunchImg from './brunch_cafe.jpg';
import ruverImg from './ruver_mochi.jpg';
import dongbaekImg from './dongbaekseom.jpg';
import xtheskyImg from './busan_xthesky.jpg';
import sashimiImg from './sashimi_winter.jpg';
import stayImg from './stay_gree_airbnb_1794293682503.jpg';

export const TRIP_IMAGES = {
  /** 부산역 KTX 역사 및 대합실 */
  busanStation: stationImg,
  /** 브런치카페 (디노브런치앤다이닝) */
  brunchCafe: brunchImg,
  /** 러버커피 (수제 생초코모찌 & 디저트 카페) */
  ruverCoffee: ruverImg,
  /** 동백섬 (해운대 해안 절경 및 동백공원) */
  dongbaekseom: dongbaekImg,
  /** 해운대 블루라인파크 스카이캡슐 */
  skyCapsule: capsuleImg,
  /** 부산엑스더스카이 (해운대 LCT 100층 전망대) */
  busanXTheSky: xtheskyImg,
  /** 에어비앤비 숙소 (STAY gree#171씨티뷰 1701호) */
  stayGree: stayImg,
  /** 방어횟집 (겨울철 대방어회 & 제철 해산물) */
  sashimi: sashimiImg,
  /** 본전돼지국밥 */
  gukbap: gukbapImg,
  /** 영도 흰여울문화마을 */
  huinnyeoulVillage: huinnyeoulImg,
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

  if (str.includes('d1-p1') || str.includes('부산역') || str.includes('busan_station')) {
    return TRIP_IMAGES.busanStation;
  }
  if (str.includes('d1-p2') || str.includes('브런치') || str.includes('brunch')) {
    return TRIP_IMAGES.brunchCafe;
  }
  if (str.includes('d1-p3') || str.includes('러버') || str.includes('모찌') || str.includes('ruver') || str.includes('커피')) {
    return TRIP_IMAGES.ruverCoffee;
  }
  if (str.includes('d1-p4') || str.includes('동백섬') || str.includes('동백') || str.includes('dongbaek')) {
    return TRIP_IMAGES.dongbaekseom;
  }
  if (str.includes('d1-p5') || str.includes('스카이캡슐') || str.includes('블루라인') || str.includes('skycapsule') || str.includes('blueline')) {
    return TRIP_IMAGES.skyCapsule;
  }
  if (str.includes('d1-p6') || str.includes('엑스더스카이') || str.includes('x the sky') || str.includes('xthesky') || str.includes('엘시티')) {
    return TRIP_IMAGES.busanXTheSky;
  }
  if (str.includes('d1-p7') || str.includes('stay') || str.includes('에어비앤비') || str.includes('숙소') || str.includes('gree') || str.includes('스테이')) {
    return TRIP_IMAGES.stayGree;
  }
  if (str.includes('방어') || str.includes('횟집') || str.includes('회') || str.includes('sashimi') || str.includes('도심속바다')) {
    return TRIP_IMAGES.sashimi;
  }
  if (str.includes('돼지국밥') || str.includes('gukbap')) {
    return TRIP_IMAGES.gukbap;
  }
  if (str.includes('흰여울') || str.includes('huinnyeoul')) {
    return TRIP_IMAGES.huinnyeoulVillage;
  }
  if (str.includes('광안') || str.includes('gwangan') || str.includes('민락')) {
    return TRIP_IMAGES.gwanganBridge;
  }
  if (str.includes('감천') || str.includes('gamcheon')) {
    return TRIP_IMAGES.gamcheonVillage;
  }

  return url || TRIP_IMAGES.busanStation;
}

export default TRIP_IMAGES;
