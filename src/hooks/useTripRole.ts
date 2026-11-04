/**
 * ========================================================
 * [JS / 권한 및 보안 로직: 관리자 vs 친구(보기 전용)]
 * - 파일 위치: src/hooks/useTripRole.ts
 * - 역할: 
 *   1) 친구 공유 링크 접속 시 읽기 전용 모드로 제한 (수정/추가 버튼 숨김)
 *   2) 관리자 로그인 및 비밀번호 인증
 *   3) 관리자가 친구 열람 화면을 미리 확인해볼 수 있는 '미리보기 모드'
 * ========================================================
 */

import { useState, useEffect, useCallback } from 'react';

const ROLE_STORAGE_KEY = 'busan_trip_role_v1';
const PIN_STORAGE_KEY = 'busan_trip_host_pin_v1';
export const DEFAULT_HOST_PIN = '1128'; // 11/28 여행 날짜 기본 비밀번호
export const DEPLOY_SITE_URL = 'https://lsjbusantrip.ai.studio'; // 배포 대상 공식 홈페이지 URL

export type UserRole = 'host' | 'viewer';

export function useTripRole() {
  const [role, setRole] = useState<UserRole>(() => {
    // 1. URL search parameters check
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const modeParam = params.get('mode');
      const roleParam = params.get('role');
      const viewParam = params.get('view');

      // If user arrived via friend share link (?mode=view or ?role=viewer or ?view=1)
      if (modeParam === 'view' || roleParam === 'viewer' || viewParam === '1') {
        return 'viewer';
      }

      // 2. Local storage check for returning host
      const savedRole = localStorage.getItem(ROLE_STORAGE_KEY) as UserRole | null;
      if (savedRole === 'host') {
        return 'host';
      }
      if (savedRole === 'viewer') {
        return 'viewer';
      }
    }
    // Default to 'host' on creator's initial device if no role param specified
    return 'host';
  });

  // Preview flag: Allows the host to preview the friend view without losing saved host credentials
  const [isPreviewingAsViewer, setIsPreviewingAsViewer] = useState<boolean>(false);

  const [hostPin, setHostPin] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(PIN_STORAGE_KEY) || DEFAULT_HOST_PIN;
    }
    return DEFAULT_HOST_PIN;
  });

  // Effective host status (false if in viewer mode OR host is previewing friend screen)
  const isHost = role === 'host' && !isPreviewingAsViewer;
  const isViewer = !isHost;

  // Persist role change
  useEffect(() => {
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch (e) {
      console.warn('Failed to save role to localStorage', e);
    }
  }, [role]);

  // Host login with PIN
  const loginAsHost = useCallback((enteredPin: string): { success: boolean; message: string } => {
    const cleanPin = enteredPin.trim();
    if (cleanPin === hostPin || cleanPin === DEFAULT_HOST_PIN) {
      setRole('host');
      setIsPreviewingAsViewer(false);
      localStorage.setItem(ROLE_STORAGE_KEY, 'host');
      return { success: true, message: '관리자 권한이 승인되었습니다! 이제 자유롭게 일정을 수정하실 수 있습니다.' };
    }
    return { success: false, message: '비밀번호가 일치하지 않습니다. 다시 확인해 주세요.' };
  }, [hostPin]);

  // Switch to viewer mode
  const switchToViewer = useCallback(() => {
    setRole('viewer');
    setIsPreviewingAsViewer(false);
    localStorage.setItem(ROLE_STORAGE_KEY, 'viewer');
  }, []);

  // Temporary preview toggle for host
  const startViewerPreview = useCallback(() => {
    setIsPreviewingAsViewer(true);
  }, []);

  const stopViewerPreview = useCallback(() => {
    setIsPreviewingAsViewer(false);
  }, []);

  // Update PIN
  const updatePin = useCallback((newPin: string): boolean => {
    if (newPin.length >= 4) {
      setHostPin(newPin);
      try {
        localStorage.setItem(PIN_STORAGE_KEY, newPin);
      } catch (e) {
        console.warn('Failed to save new PIN', e);
      }
      return true;
    }
    return false;
  }, []);

  // Generate share URLs matching official deployment domain (https://lsjbusantrip.ai.studio)
  const getShareUrl = useCallback((targetRole: 'viewer' | 'host', hashData?: string): string => {
    let url: URL;
    try {
      url = new URL(DEPLOY_SITE_URL);
    } catch {
      url = new URL(typeof window !== 'undefined' ? window.location.href : 'https://lsjbusantrip.ai.studio');
    }

    // Set query parameter for role
    if (targetRole === 'viewer') {
      url.searchParams.set('mode', 'view');
    } else {
      url.searchParams.delete('mode');
      url.searchParams.set('mode', 'host');
    }

    if (hashData) {
      url.hash = `data=${hashData}`;
    } else {
      url.hash = '';
    }

    return url.toString();
  }, []);

  return {
    role,
    isHost,
    isViewer,
    isPreviewingAsViewer,
    hostPin,
    loginAsHost,
    switchToViewer,
    startViewerPreview,
    stopViewerPreview,
    updatePin,
    getShareUrl,
  };
}
