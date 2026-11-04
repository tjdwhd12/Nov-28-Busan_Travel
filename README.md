# 🌊 부산 여행 시크릿 가이드 (Busan Trip Guide)

> 친구들과 함께 떠나는 부산 여행의 시간별 동선, 상세 위치, 입장료 및 예매 정보를 한눈에 볼 수 있는 깔끔하고 모던한 반응형 웹 애플리케이션입니다.  
> 아직 계획을 모르는 친구들을 위한 **'서프라이즈 미스터리 모드'**와 각 장소별 **'상세 정보 모달(원클릭 주소 복사, 예매 안내)'**을 제공합니다. (별도의 복잡한 외부 지도 API 키 등록 없이 브라우저에서 즉시 동작합니다.)

---

## ✨ 주요 기능 (Key Features)

### 1. ⏱️ 부산 당일치기 시간별 타임라인 및 동선 브리핑
- 아침 KTX 부산역 도착부터 저녁 귀환 열차까지 최적화된 당일치기 코스 브리핑
- 방문 장소 간 **이동 수단(도보, 지하철, 버스, 택시)** 및 **예상 이동 시간 / 요금 안내**
- 체류 시간, 추천 메뉴, 사진 명소(인생샷 포토존), 여행 꿀팁 제공

### 2. 📍 장소별 상세 정보 모달 (API 키 불필요)
- 각 장소 카드를 클릭하면 나타나는 깔끔한 반응형 모달 창
- **장소명, 운영/방문 시간, 상세 도로명 주소 (원클릭 주소 복사 지원)**
- **입장료 및 예매 정보**: 1인당 비용, 단체 총비용, 사전예약 필수 여부, 공식 예매 사이트 바로가기 버튼, 티켓팅 팁 안내

### 3. 🗺️ 당일 코스 인터랙티브 구글 지도
- 부산역, 영도, 해운대, 광안리 등 당일 방문지의 위치를 공식 구글 지도 위에 핀으로 표시
- 순서대로 이어지는 경로 선(Polyline) 시각화 및 마커 클릭 시 인포윈도우 제공

### 4. 💰 총무를 위한 자동 예산 & 예매 현황
- 티켓/입장료, 식비/카페, 교통비 실시간 집계
- 여행 인원수(2인~6인) 변경에 따른 **1인당 예상 회비 및 정산 금액 자동 계산**
- 사전예약이 필요한 명소(스카이캡슐 등) 티켓팅 현황 관리

### 7. 💾 브라우저 로컬 저장 & JSON 백업 / 일정 커스텀
- 웹사이트 내에서 직접 일정 장소를 추가/수정/삭제 가능
- 브라우저 LocalStorage에 자동 저장되며, JSON 파일로 내보내기/불러오기 지원

---

## 🛠️ 기술 스택 (Tech Stack)

| 구분 | 기술 |
| :--- | :--- |
| **Frontend** | React 19, TypeScript |
| **Build Tool** | Vite 6 |
| **Styling** | Tailwind CSS v4 |
| **Map Integration** | Google Maps Platform (@vis.gl/react-google-maps) |
| **Icons** | Lucide React |

---

## 📁 프로젝트 폴더 구조 (Project Architecture)

유지보수와 모듈화된 확장을 위해 체계적으로 분리된 구조입니다.

```text
busan-trip-guide/
├── index.html                   # HTML 진입점 및 폰트, 메타 태그
├── package.json                 # 의존성 및 실행 스크립트
├── tsconfig.json                # TypeScript 컴파일러 설정
├── vite.config.ts               # Vite 빌드 설정
├── README.md                    # 프로젝트 안내서
│
└── src/
    ├── main.tsx                 # React 루트 렌더러
    ├── App.tsx                  # 최상위 레이아웃 및 뷰/모달 오케스트레이션
    ├── index.css                # Tailwind CSS v4 글로벌 스타일
    │
    ├── assets/                  # 정적 이미지 및 미디어 에셋
    │   └── images/              # 부산 현지 생성 이미지 (광안대교, 스카이캡슐 등)
    │
    ├── types/                   # TypeScript 타입 정의
    │   └── trip.ts              # Place, DaySchedule, TripPlan, FeeInfo 등
    │
    ├── data/                    # 여행 데이터 소스
    │   └── initialTripData.ts   # 2박 3일 부산 대표 코스 데이터
    │
    ├── hooks/                   # 커스텀 훅
    │   └── useTripData.ts       # 여행 상태 관리, 로컬 저장소 동기화, 커스텀/백업
    │
    ├── utils/                   # 유틸리티 함수
    │   └── mapUtils.ts          # 네이버/카카오/구글 지도 링크 생성기 및 통화 포맷
    │
    └── components/              # 재사용 가능한 UI 컴포넌트
        ├── common/              # 공통 레이아웃 컴포넌트
        │   ├── Navbar.tsx       # 상단 내비게이션 바 & 미스터리 모드 토글
        │   ├── MobileBottomBar.tsx # 모바일 하단 탭 바 (엄지존 최적화)
        │   ├── Badge.tsx        # 카테고리 & 예매 상태 배지
        │   └── Footer.tsx       # 긴급 연락처, 코레일 안내, 백업 다운로드
        │
        ├── hero/                # 히어로 섹션
        │   └── HeroSection.tsx  # D-Day 카운터, 핵심 지표 스트립, 사진 배경
        │
        ├── itinerary/           # 여행 일정 관련 컴포넌트
        │   ├── DayTimeline.tsx  # 일자별 타임라인 컨테이너
        │   ├── PlaceCard.tsx    # 장소 카드 & 이동 수단 커넥터
        │   └── PlaceDetailModal.tsx # [핵심] 상세 정보 모달 & 하단 지도
        │
        ├── map/                 # 지도 연동 컴포넌트
        │   ├── NaverLocationMap.tsx # [핵심] 네이버 지도 스타일 핀 마커 & 조작기
        │   └── BusanCourseMap.tsx   # 부산 전체 3일간 코스 경로 시각화
        │
        ├── info/                # 정산 및 정보 컴포넌트
        │   ├── BudgetSummary.tsx    # 회비 계산기 & 티켓팅 현황
        │   ├── PackingChecklist.tsx # 준비물 체크리스트
        │   └── BusanTravelTips.tsx  # 부산 현지 꿀팁 및 비상연락망
        │
        └── editor/              # 일정 편집기
            └── PlaceEditorModal.tsx # 장소 추가/수정 모달 폼
```

---

## 🚀 로컬 실행 방법 (Getting Started)

### 1. 저장소 복제 (Clone)
```bash
git clone https://github.com/your-username/busan-trip-guide.git
cd busan-trip-guide
```

### 2. 패키지 설치 (Install Dependencies)
```bash
npm install
```

### 3. 개발 서버 실행 (Run Dev Server)
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`으로 접속합니다.

### 4. 프로덕션 빌드 (Build for Production)
```bash
npm run build
```
`dist/` 디렉터리에 배포용 정적 파일이 생성됩니다.

---

## 📝 일정 데이터 수정 및 커스텀 가이드

### 방법 1: 웹 화면에서 직접 수정
- 우측 상단의 **'일정 추가'** 버튼 또는 장소 카드의 **'수정'** 버튼을 누르면 브라우저 화면에서 즉시 장소명, 시간, 주소, 입장료, 예약 링크를 변경할 수 있습니다.
- 변경된 내용은 브라우저의 `localStorage`에 즉시 보존됩니다.

### 방법 2: 소스코드에서 기본 일정 변경
- `src/data/initialTripData.ts` 파일을 열어 `INITIAL_TRIP_DATA` 객체를 원하는 장소 목록으로 수정하면 초기 데이터로 적용됩니다.

```typescript
// 예시 장소 구조 (Place)
{
  id: 'd1-p1',
  name: '해운대 블루라인파크',
  category: 'activity',
  startTime: '11:30',
  endTime: '12:40',
  duration: '1시간 10분',
  area: '해운대구 / 미포',
  address: '부산 해운대구 달맞이길62번길 13',
  coords: { lat: 35.1587, lng: 129.1728, mapX: 82, mapY: 46 },
  feeInfo: {
    hasFee: true,
    costPerPerson: 11250,
    isPreBookRequired: true,
    bookingStatus: 'booked',
    bookingUrl: 'https://www.bluelinepark.com/',
  },
  // ...
}
```

---

## 🌐 배포 안내 (Deployment)

본 프로젝트는 순수 정적 SPA(Single Page Application)이므로 어디서든 간편하게 배포할 수 있습니다:
- **Vercel**: GitHub 저장소를 연결하여 빌드 명령 `npm run build`, 출력 디렉터리 `dist`로 설정
- **GitHub Pages**: `gh-pages` 패키지 또는 GitHub Actions 워크플로를 통해 배포
- **Cloud Run / Netlify**: 정적 웹 호스팅 환경에서 즉시 구동

---

## 📄 라이선스 (License)

Apache-2.0 License
