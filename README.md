# 🌊 11/28 부산 여행 플래너 (Busan Trip Planner)

> 🌐 **공식 배포 URL**: [https://lsjbusantrip.ai.studio](https://lsjbusantrip.ai.studio)  
> 👥 **친구 공유용 열람 링크**: [https://lsjbusantrip.ai.studio?mode=view](https://lsjbusantrip.ai.studio?mode=view)  
> 친구들과 함께 떠나는 **11/28 부산 당일치기 여행**의 시간별 동선, 상세 위치, 입장료 및 예매 정보를 한눈에 볼 수 있는 깔끔한 모바일 최적화 웹 애플리케이션입니다.  
> 관리자(주최자)만을 위한 **'편집/추가 권한 분리'**와 친구들에게 공유할 수 있는 **'열람 전용 모드'**, 5인 기준 회비 자동 정산 시스템을 제공합니다.

---

## 📂 GitHub 직접 수정을 위한 폴더 구조 가이드

GitHub 웹 화면이나 에디터에서 원하는 코드를 쉽게 찾고 직접 수정할 수 있도록 역할별로 명확히 분리되어 있습니다:

```text
busan-trip-guide/
├── 📁 src/
│   │
│   ├── 🎨 styles/                     # [CSS / 디자인 스타일]
│   │   └── index.css                 # 폰트, 배경색, 스크롤바, 반응형 미디어쿼리 등 디자인 수정
│   │
│   ├── 📸 assets/images/              # [Images / 사진 및 이미지 에셋]
│   │   ├── busan_blueline_skycapsule_... # 해운대 스카이캡슐 사진
│   │   ├── busan_gamcheon_village_...    # 감천문화마을 사진
│   │   ├── busan_gwangan_bridge_night... # 광안대교 야경 사진
│   │   ├── busan_huinnyeoul_village_...  # 영도 흰여울마을 사진
│   │   └── index.ts                  # 이미지 불러오기 및 내보내기 인덱스
│   │
│   ├── 🖥️ pages/                      # [Pages / 주요 화면 페이지]
│   │   ├── MainPage.tsx              # ⭐️ [메인페이지] 상단 타이틀, 코스 탭, 지도, 예산 대시보드
│   │   ├── PlaceDetailPage.tsx       # ⭐️ [상세페이지] 장소 클릭 시 열리는 상세 정보 화면 (5인 비용, 팁, 예약링크)
│   │   └── index.ts                  # 페이지 모듈 인덱스
│   │
│   ├── 📍 data/                       # [Data / 여행 코스 & 5인 데이터]
│   │   └── initialTripData.ts        # ⭐️ 11/28 부산 코스 장소, 방문 시간표, 5인 명단, 비용 직접 수정
│   │
│   ├── ⚙️ hooks/                      # [JS / 상태 관리 및 권한 로직]
│   │   ├── useTripRole.ts            # 총무(host) vs 친구(viewer) 권한 분리 및 비밀번호(1128)
│   │   └── useTripData.ts            # 일정 추가/수정/삭제 및 로컬 브라우저 저장 로직
│   │
│   ├── 🧩 components/                 # [Components / UI 모듈 컴포넌트]
│   │   ├── itinerary/                # DayTimeline (타임라인 코스), PlaceCard (장소 카드)
│   │   ├── map/                      # BusanCourseMap (구글 지도 및 코스 마커)
│   │   ├── info/                     # BudgetSummary (5인 예산 & 회비 정산표)
│   │   ├── editor/                   # PlaceEditorModal (총무 전용 장소 편집기)
│   │   ├── auth/                     # HostAuthModal (총무 비밀번호 인증 모달)
│   │   ├── modals/                   # ShareModal (카톡/링크 공유 모달)
│   │   └── common/                   # Navbar, Footer, MobileBottomBar, Badge
│   │
│   ├── 🛠️ utils/                      # [Utils / 유틸리티]
│   │   └── mapUtils.ts               # 네이버/카카오/구글 지도 링크 및 금액 표기 포맷
│   │
│   └── 📑 types/                      # [Types / 타입 정의]
│       └── trip.ts                   # 장소(Place), 일정(DaySchedule), 여행계획(TripPlan) 타입
│
├── App.tsx                           # 루트 상태 연결 및 모달 관리
├── main.tsx                          # React 마운트 진입점
└── index.html                        # HTML 진입점 및 메타 태그
```

---

## 🎯 무엇을 수정하고 싶으신가요? (빠른 수정 가이드)

| 수정하고 싶은 내용 | 열어볼 파일 경로 | 설명 |
| :--- | :--- | :--- |
| **🎨 색상, 폰트, 스타일, CSS** | `src/styles/index.css` | 폰트 체계, 스크롤바, 모바일 디자인 스타일을 직접 수정할 수 있습니다. |
| **📸 여행지 사진 교체 및 추가** | `src/assets/images/` | 원하는 새 사진을 넣고 `index.ts`에 등록하여 사용할 수 있습니다. |
| **📍 11/28 일정, 장소, 시간, 비용** | `src/data/initialTripData.ts` | 장소 이름, 순서, 도착 시간, 1인당 비용, 팁 등을 자유롭게 바꿀 수 있습니다. |
| **🖥️ 메인 화면 레이아웃 & 탭** | `src/pages/MainPage.tsx` | 메인 대시보드 화면의 제목, 탭 버튼 순서 및 배치를 변경할 수 있습니다. |
| **🔍 장소 상세 보기(모달) 내용** | `src/pages/PlaceDetailPage.tsx` | 장소를 눌렀을 때 뜨는 상세 화면(5인 요금, 포토존, 꿀팁 안내)을 수정합니다. |
| **🔐 총무 비밀번호 / 권한 변경** | `src/hooks/useTripRole.ts` | 총무 인증 비밀번호(`1128` 등)나 권한 확인 방식을 변경할 수 있습니다. |
| **🗺️ 지도 마커 & 코스 선** | `src/components/map/BusanCourseMap.tsx` | 구글 지도 줌 레벨, 중심 좌표, 코스 연결선을 설정합니다. |
| **💰 5인 회비 정산표 & 계산식** | `src/components/info/BudgetSummary.tsx` | 5명 분할 계산, 계좌번호 안내 문구 등을 수정할 수 있습니다. |

---

## ✨ 핵심 기능

1. **⏱️ 11/28 부산 당일치기 최적 동선 브리핑**:
   - KTX 부산역 ➔ 본전돼지국밥 ➔ 영도 흰여울문화마을 ➔ 해운대 블루라인파크 스카이캡슐 ➔ 광안리 해변 & 드론쇼/광안대교 ➔ 부산역 귀환
2. **👥 총 5인 기준 예산 및 회비 자동 정산**:
   - 4인에서 5인 동행 기준으로 최적화
   - 1인당 회비, 단체 총비용, 사전 예약 필수 항목(스카이캡슐) 일괄 집계
3. **🔒 친구 공유 및 권한 분리**:
   - 친구들에게 링크 공유 시 **열람 전용 모드**로 열려 수정/추가 버튼이 완전히 숨겨집니다.
   - 주최자(총무)는 비밀번호 인증을 통해 언제든지 편집할 수 있습니다.
4. **📱 모바일 반응형 최적화**:
   - 스마트폰 화면에서도 한 손으로 조작하기 편리한 하단 탭 바 및 가로 스크롤 방지 레이아웃

---

## 🚀 로컬 실행 방법

```bash
# 1. 의존성 패키지 설치
npm install

# 2. 로컬 개발 서버 시작 (포트 3000)
npm run dev

# 3. 배포용 빌드 테스트
npm run build
```
