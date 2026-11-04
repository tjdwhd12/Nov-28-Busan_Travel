export function getNaverMapUrl(name: string, address?: string): string {
  const query = encodeURIComponent(`${name} ${address ? address.split(' ')[1] || '' : ''}`);
  return `https://map.naver.com/p/search/${query}`;
}

export function getKakaoMapUrl(name: string): string {
  const query = encodeURIComponent(name);
  return `https://map.kakao.com/link/search/${query}`;
}

export function getGoogleMapUrl(name: string, lat?: number, lng?: number): string {
  if (lat && lng) {
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' 부산')}`;
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
