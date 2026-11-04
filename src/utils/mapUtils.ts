/**
 * 장소명에서 불필요한 부가 설명, 괄호, 화살표 등을 제거하여
 * 네이버 지도, 카카오맵, 구글 지도에서 정확하게 검색되도록 정제하는 함수
 */
export function extractCleanSearchQuery(name: string, address?: string): string {
  const trimmed = name.trim();

  // 1. 부산 코스 주요 명소별 정확한 공식 명칭 매핑
  if (trimmed.includes('본전돼지국밥')) return '본전돼지국밥';
  if (trimmed.includes('스카이캡슐') || trimmed.includes('블루라인파크')) return '해운대블루라인파크 미포정거장';
  if (trimmed.includes('흰여울')) return '흰여울문화마을';
  if (trimmed.includes('민락더마켓')) return '민락더마켓';
  if (trimmed.includes('광안리')) return '광안리해수욕장';
  if (trimmed.includes('부산역')) return '부산역';
  if (trimmed.includes('감천문화마을')) return '감천문화마을';
  if (trimmed.includes('자갈치')) return '자갈치시장';
  if (trimmed.includes('태종대')) return '태종대';
  if (trimmed.includes('해운대해수욕장')) return '해운대해수욕장';
  if (trimmed.includes('더베이101') || trimmed.includes('더베이')) return '더베이101';
  if (trimmed.includes('용궁사') || trimmed.includes('해동용궁사')) return '해동용궁사';

  // 2. 일반 장소 텍스트 정제: 괄호 내 설명(예: '(점심 식사)', '[KTX 집결]') 및 특수기호 제거
  let cleaned = name
    .replace(/\([^)]*\)/g, '')
    .replace(/\[[^\]]*\]/g, '')
    .replace(/[➔→▶>•]/g, ' ')
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

  // 정제 후 빈 문자열이면 원본에서 괄호만 벗겨 사용
  if (!cleaned) {
    cleaned = name.replace(/\([^)]*\)/g, '').trim() || name.trim();
  }

  return cleaned;
}

/**
 * 등록된 주소 기반으로 지도 앱 검색 쿼리를 생성하는 함수
 * - 등록된 주소(address)가 있을 경우, 주소 내 부가설명 괄호(예: '(부산역사 2층)', '(미포정거장)')를
 *   제거한 정확한 표준 도로명/지번 주소로 검색합니다.
 * - 주소가 비어있을 경우 장소명 정제값을 대체 검색어로 사용합니다.
 */
export function getAddressSearchQuery(name: string, address?: string): string {
  if (address && address.trim()) {
    const cleanAddress = address
      .replace(/\([^)]*\)/g, '')
      .replace(/\[[^\]]*\]/g, '')
      .trim();
    if (cleanAddress) {
      return cleanAddress;
    }
  }

  // 주소가 없을 경우 장소명 정제값 사용
  return extractCleanSearchQuery(name);
}

/**
 * 네이버 지도 검색 URL 생성 (등록된 주소 기반)
 * - 등록된 표준 주소로 네이버 지도 위치를 정확하게 검색하여 엽니다.
 */
export function getNaverMapUrl(name: string, address?: string): string {
  const query = getAddressSearchQuery(name, address);
  return `https://map.naver.com/p/search/${encodeURIComponent(query)}`;
}

/**
 * 카카오맵 검색 URL 생성 (등록된 주소 기반)
 * - 등록된 표준 주소로 카카오맵 위치를 정확하게 검색하여 엽니다.
 */
export function getKakaoMapUrl(name: string, address?: string): string {
  const query = getAddressSearchQuery(name, address);
  return `https://map.kakao.com/link/search/${encodeURIComponent(query)}`;
}

/**
 * 구글 지도 검색 URL 생성 (등록된 주소 기반)
 * - 등록된 표준 주소로 구글 지도 위치를 정확하게 검색하여 엽니다.
 */
export function getGoogleMapUrl(name: string, lat?: number, lng?: number, address?: string): string {
  const query = getAddressSearchQuery(name, address);
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
