/**
 * 장소명 기반으로 지도 앱(네이버 지도, 카카오맵, 구글 지도) 검색 쿼리를 생성하는 함수
 * - 주소(지번/도로명) 대신 실제 상호명/장소명으로 검색하여
 *   지도 앱에서 매장 플레이스 상세 정보(영업시간, 사진, 리뷰, 메뉴)가 바로 열리도록 합니다.
 */
export function getPlaceSearchQuery(name: string, address?: string): string {
  if (!name || !name.trim()) {
    if (address && address.trim()) {
      return address.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').trim();
    }
    return '부산';
  }

  const trimmed = name.trim();

  // 1. 부산 코스 주요 명소별 가장 정확한 공식 상호명/장소명 매핑
  if (trimmed.includes('디노브런치') || trimmed.includes('디노')) return '디노브런치';
  if (trimmed.includes('마란트') || trimmed.includes('STAY') || trimmed.includes('stay') || trimmed.includes('gree') || trimmed.includes('숙소')) {
    return '마란트 호텔';
  }
  if (trimmed.includes('도심속바다')) return '도심속바다';
  if (trimmed.includes('초량온당')) return '초량온당';
  if (trimmed.includes('러버커피') || trimmed.includes('러버')) return '러버커피';
  if (trimmed.includes('동백섬') || (trimmed.includes('동백') && !trimmed.includes('주차장'))) return '해운대 동백섬';
  if (trimmed.includes('엑스더스카이') || trimmed.includes('x the sky') || trimmed.includes('엘시티')) return '부산엑스더스카이';
  if (trimmed.includes('블루라인파크') || trimmed.includes('스카이캡슐') || trimmed.includes('미포정거장')) return '해운대블루라인파크 미포정거장';
  if (trimmed.includes('흰여울')) return '흰여울문화마을';
  if (trimmed.includes('본전돼지국밥')) return '본전돼지국밥';
  if (trimmed.includes('민락더마켓')) return '민락더마켓';
  if (trimmed.includes('광안리')) return '광안리해수욕장';
  if (trimmed.includes('해운대해수욕장')) return '해운대해수욕장';
  if (trimmed.includes('감천문화마을')) return '감천문화마을';
  if (trimmed.includes('더베이101') || trimmed.includes('더베이')) return '더베이101';
  if (trimmed.includes('용궁사') || trimmed.includes('해동용궁사')) return '해동용궁사';
  if (trimmed.includes('태종대')) return '태종대';
  if (trimmed.includes('자갈치')) return '자갈치시장';
  if (trimmed.includes('부산역')) return '부산역';

  // 2. 일반 장소 텍스트 정제: 괄호 내 설명(예: '(점심 식사)', '[KTX 집결]') 및 기호 제거
  let cleaned = trimmed
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/[➔→▶>•·]/g, ' ')
    .trim();

  // & 나 / 로 연결된 복수 장소의 경우 첫 번째 주요 장소명 추출
  if (cleaned.includes('&')) {
    cleaned = cleaned.split('&')[0].trim();
  }
  if (cleaned.includes('/')) {
    cleaned = cleaned.split('/')[0].trim();
  }

  // 중복 공백 제거
  cleaned = cleaned.replace(/\s+/g, ' ').trim();

  // 일반 명사 대체 및 보완
  if (cleaned === '브런치카페' || cleaned === '브런치') {
    return '부산 전포 브런치카페';
  }
  if (cleaned === '방어' || cleaned === '방어횟집' || cleaned === '횟집') {
    return '도심속바다';
  }

  return cleaned || trimmed;
}

// 하위 호환성을 위한 헬퍼 유지
export const extractCleanSearchQuery = getPlaceSearchQuery;
export const getAddressSearchQuery = getPlaceSearchQuery;

/**
 * 네이버 지도 검색 URL 생성 (장소명 기반)
 * - 장소명으로 네이버 지도 검색을 실행하여 해당 장소 플레이스 카드를 바로 엽니다.
 */
export function getNaverMapUrl(name: string, address?: string): string {
  const query = getPlaceSearchQuery(name, address);
  return `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
}

/**
 * 카카오맵 검색 URL 생성 (장소명 기반)
 * - 장소명으로 카카오맵 검색을 실행하여 해당 장소 정보를 바로 엽니다.
 */
export function getKakaoMapUrl(name: string, address?: string): string {
  const query = getPlaceSearchQuery(name, address);
  return `https://map.kakao.com/link/search/${encodeURIComponent(query)}`;
}

/**
 * 구글 지도 검색 URL 생성 (장소명 기반)
 * - 장소명으로 구글 지도 검색을 실행합니다.
 */
export function getGoogleMapUrl(name: string, lat?: number, lng?: number, address?: string): string {
  const query = getPlaceSearchQuery(name, address);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
    maximumFractionDigits: 0,
  }).format(amount).replace('₩', '') + '원';
}

export function getDDayText(targetDateStr: string): { label: string; daysLeft: number } {
  try {
    const target = new Date(targetDateStr);
    const now = new Date();
    // Reset hours
    target.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = target.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return { label: 'D-Day 바로 오늘!', daysLeft: 0 };
    } else if (diffDays > 0) {
      return { label: `D-${diffDays}`, daysLeft: diffDays };
    } else {
      return { label: `D+${Math.abs(diffDays)}`, daysLeft: diffDays };
    }
  } catch {
    return { label: 'D-Day', daysLeft: 0 };
  }
}
