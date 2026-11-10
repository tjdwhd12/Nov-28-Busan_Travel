/**
 * ========================================================
 * [부산 당일치기 7대 코스별 주차장 가이드 데이터]
 * - 각 장소별 인터넷 검증 주차 정보 및 위치
 * - 자체 주차장 유무, 공영/유료 구분, 무료/조건부 무료 혜택
 * - 주차 시간에 따른 상세 요금 체계 및 네비게이션 연동
 * ========================================================
 */

export interface ParkingFacility {
  name: string;
  type: 'dedicated' | 'public' | 'paid'; // 자체/직영, 공영주차장, 민영/사설 유료
  typeLabel: string; // '자체 직영 주차장', '공영주차장', '민영 유료주차장'
  isFree: boolean; // 완전 무료 여부
  hasFreeSupport: boolean; // 이용 시 무료 지원 여부
  freeCondition?: string; // 예: "전망대 관람객 2시간 무료 지원", "열차 탑승권 소지 시 2시간 무료"
  feeRate: string; // "10분당 300원 (1시간 1,800원)" 등
  dailyMax?: string; // "1일 최대 8,000원"
  address: string;
  walkingDistance: string; // "도보 1분", "바로 입구", "건물 지하 1층"
  cautionNotes?: string[]; // 주의사항 (예: 기계식 타워 SUV 불가 등)
  discountNotes?: string; // 경차/친환경차 50% 할인 등
}

export interface PlaceParkingGuide {
  placeId: string;
  placeName: string;
  plannedTime: string;
  area: string;
  destinationAddress: string;
  hasDedicatedParking: boolean;
  dedicatedParkingSummary: string;
  recommendation: string;
  facilities: ParkingFacility[];
}

export const BUSAN_PARKING_DATA: PlaceParkingGuide[] = [
  {
    placeId: 'd1-p1',
    placeName: '부산역',
    plannedTime: '13:00',
    area: '동구 / 초량동',
    destinationAddress: '부산 동구 중앙대로 206',
    hasDedicatedParking: true,
    dedicatedParkingSummary: '역사 선상주차장(동광장) 및 북항방면 주차장 운영 (픽업 10분 무료 회차)',
    recommendation: '일행 픽업 시에는 광장 회차 구역(10분 무료)을 이용하고, 장기 주차 시 선상주차장 이용 권장',
    facilities: [
      {
        name: '부산역 선상주차장 (동광장)',
        type: 'dedicated',
        typeLabel: '역사 직영 주차장',
        isFree: false,
        hasFreeSupport: false,
        freeCondition: '회차 10분 무료',
        feeRate: '기본 30분 1,500원 / 추가 10분당 500원 (1시간 3,000원)',
        dailyMax: '1일 최대 18,000원',
        address: '부산 동구 초량동 1200-24 (부산역 선상)',
        walkingDistance: '부산역 2층 대합실과 직접 연결 (도보 1분)',
        discountNotes: '열차 승차권 소지자 30% 할인 / 경차·친환경차·장애인 50% 할인',
        cautionNotes: ['주말 및 연휴 낮 시간대에는 만차율이 높아 진입 대기가 있을 수 있습니다.'],
      },
      {
        name: '부산역 북항방면 주차장 (서광장)',
        type: 'dedicated',
        typeLabel: '역사 직영 주차장',
        isFree: false,
        hasFreeSupport: false,
        freeCondition: '회차 10분 무료',
        feeRate: '기본 30분 1,500원 / 추가 10분당 500원 (1시간 3,000원)',
        dailyMax: '1일 최대 15,000원',
        address: '부산 동구 초량동 1183-1 (부산역 후면 북항 방향)',
        walkingDistance: '부산역 후문 연결 통로 (도보 3분)',
        discountNotes: '열차 이용객 30% 할인 / 경차·유공자 50% 할인',
      },
    ],
  },
  {
    placeId: 'd1-p2',
    placeName: '디노브런치앤다이닝',
    plannedTime: '14:00',
    area: '부산진구 / 전포',
    destinationAddress: '부산 부산진구 전포대로199번길 12',
    hasDedicatedParking: false,
    dedicatedParkingSummary: '전포 카페거리 골목 특성상 매장 전용 주차장 없음 (인근 공영 및 민영 주차장 이용 필수)',
    recommendation: '디노브런치와 가장 가깝고 주차면이 넓은 전포역 지하 공영주차장 이용을 적극 추천합니다.',
    facilities: [
      {
        name: '전포역 지하 공영주차장 (추천)',
        type: 'public',
        typeLabel: '시영 공영주차장',
        isFree: false,
        hasFreeSupport: false,
        feeRate: '10분당 300원 (1시간 1,800원 / 2시간 3,600원)',
        dailyMax: '1일 주차 8,000원',
        address: '부산 부산진구 전포대로 181 (전포역)',
        walkingDistance: '디노브런치앤다이닝 매장까지 도보 약 3~4분',
        discountNotes: '경차, 친환경(하이브리드/전기), 다자녀 50% 공영 할인',
        cautionNotes: ['전포동에서 가장 넓고 쾌적한 자주식 지하주차장이며 신용카드 전용 결제입니다.'],
      },
      {
        name: '제일민영주차장 (최근접)',
        type: 'paid',
        typeLabel: '민영 유료주차장',
        isFree: false,
        hasFreeSupport: false,
        feeRate: '기본 30분 1,500원 / 1시간 3,000원',
        address: '부산 부산진구 전포대로200번길 19',
        walkingDistance: '디노브런치 매장 도보 2분',
        cautionNotes: ['사설 주차장으로 공영 할인 적용 불가'],
      },
      {
        name: '전포카페거리 노상 공영주차장',
        type: 'public',
        typeLabel: '노상 공영주차장',
        isFree: false,
        hasFreeSupport: false,
        feeRate: '10분당 300원 (1시간 1,800원)',
        dailyMax: '1일 8,000원',
        address: '부산 부산진구 전포동 686-4 일원 (전포대로 골목)',
        walkingDistance: '카페거리 중심부 도보 1~3분',
        discountNotes: '공영 감면 혜택 적용 가능',
        cautionNotes: ['노상 구획이 많지 않아 주말 오후 만차가 잦습니다.'],
      },
    ],
  },
  {
    placeId: 'd1-p3',
    placeName: '러버커피',
    plannedTime: '15:00',
    area: '부산진구 / 전포',
    destinationAddress: '부산 부산진구 전포대로 208, 2층',
    hasDedicatedParking: false,
    dedicatedParkingSummary: '건물 2층 위치로 전용 주차 공간 없음 (인근 유료 및 공영주차장 이용)',
    recommendation: '모찌 픽업 및 빠른 티타임은 도보 2분 거리 두원주차장 또는 전포역 지하 공영 이용 권장',
    facilities: [
      {
        name: '두원민영주차장 (러버커피 인근 최단거리)',
        type: 'paid',
        typeLabel: '민영 유료주차장',
        isFree: false,
        hasFreeSupport: false,
        feeRate: '30분당 1,000원 (1시간 2,000원)',
        address: '부산 부산진구 전포대로200번길 21',
        walkingDistance: '러버커피 매장 도보 2분',
        cautionNotes: ['24시간 무인 유료 운영', '골목 진입 시 보행자 주의'],
      },
      {
        name: '전포역 지하 공영주차장',
        type: 'public',
        typeLabel: '시영 공영주차장',
        isFree: false,
        hasFreeSupport: false,
        feeRate: '10분당 300원 (1시간 1,800원)',
        dailyMax: '1일 주차 8,000원',
        address: '부산 부산진구 전포대로 181 (전포역)',
        walkingDistance: '도보 약 5분',
        discountNotes: '경차/저공해 50% 감면',
      },
      {
        name: '은아민영주차장',
        type: 'paid',
        typeLabel: '민영 유료주차장',
        isFree: false,
        hasFreeSupport: false,
        feeRate: '30분당 1,000원 (1시간 2,000원)',
        address: '부산 부산진구 전포대로 208 인근',
        walkingDistance: '도보 약 2분',
      },
    ],
  },
  {
    placeId: 'd1-p4',
    placeName: '동백섬',
    plannedTime: '16:00',
    area: '해운대구 / 우동',
    destinationAddress: '부산 해운대구 동백로 116',
    hasDedicatedParking: true,
    dedicatedParkingSummary: '동백섬 바로 입구에 해운대구 운영 대형 공영주차장 완비',
    recommendation: '동백공원 공영주차장이 가장 저렴하고 동백섬 산책로 및 APEC하우스 바로 앞이라 최적입니다.',
    facilities: [
      {
        name: '동백공원 공영주차장 (추천)',
        type: 'public',
        typeLabel: '구영 공영주차장',
        isFree: false,
        hasFreeSupport: false,
        feeRate: '비성수기(11월) 10분당 300원 (1시간 1,800원 / 2시간 3,600원)',
        dailyMax: '1일 최대 8,000원',
        address: '부산 해운대구 우동 721 (동백섬 입구 더베이101 맞은편)',
        walkingDistance: '동백공원 산책로 입구 바로 앞 (도보 1분)',
        discountNotes: '경차, 저공해(친환경), 다자녀, 장애인 50% 감면',
        cautionNotes: ['약 127면 규모로 평일 오후에는 비교적 여유롭습니다.'],
      },
      {
        name: '더베이101 주차장',
        type: 'paid',
        typeLabel: '민영 주차장 (식음 이용 시 무료)',
        isFree: false,
        hasFreeSupport: true,
        freeCondition: '더베이101 식음 매장 이용 시 1~4시간 무료 주차',
        feeRate: '일반 이용 시 1시간 약 6,000원 (추가 요금 부담 큼)',
        address: '부산 해운대구 동백로 52',
        walkingDistance: '동백섬 입구 바로 옆',
        cautionNotes: ['단순 산책 목적인 경우 공영주차장보다 요금이 비싸므로 동백공원 공영을 이용하세요.'],
      },
    ],
  },
  {
    placeId: 'd1-p5',
    placeName: '해운대블루라인파크',
    plannedTime: '17:00',
    area: '해운대구 / 중동 (미포)',
    destinationAddress: '부산 해운대구 달맞이길62번길 13 (미포정거장)',
    hasDedicatedParking: true,
    dedicatedParkingSummary: '미포정거장 자체 기계식 주차장 완비 (이용객 2시간 무료 지원, SUV는 공영 이용)',
    recommendation: '일반 승용차는 미포정거장 2시간 무료 주차 이용, SUV/대형차는 문텐로드 공영주차장 이용 필수!',
    facilities: [
      {
        name: '블루라인파크 미포정거장 전용 주차장',
        type: 'dedicated',
        typeLabel: '자체 전용 주차타워',
        isFree: false,
        hasFreeSupport: true,
        freeCondition: '탑승권(해변열차/스카이캡슐) 소지 고객 2시간 무료 지원 (탑승권 바코드로 무인정산)',
        feeRate: '2시간 무료 / 초과 시 10분당 700원 (1시간 4,200원)',
        address: '부산 해운대구 중동 947-1 (달맞이길62번길 11)',
        walkingDistance: '미포정거장 매표소 바로 앞 (도보 1분)',
        cautionNotes: [
          '⚠️ [차량 제한 필독] 기계식 타워 주차장 구조로 일반 승용차만 입차 가능합니다.',
          'SUV, RV, 대형 세단, 전기차, 수소차, 중량 1,750kg 초과 차량은 전면 주차 불가!',
        ],
      },
      {
        name: '문텐로드 공영주차장 (SUV/대형차 추천)',
        type: 'public',
        typeLabel: '구영 공영주차장',
        isFree: false,
        hasFreeSupport: false,
        feeRate: '10분당 300원 (1시간 1,800원 / 2시간 3,600원)',
        dailyMax: '1일 최대 8,000원',
        address: '부산 해운대구 중동 974-1 (달맞이길 초입)',
        walkingDistance: '미포정거장까지 완만한 내리막 도보 4~5분',
        discountNotes: '공영 감면 혜택(경차 50% 등) 적용 가능',
        cautionNotes: ['블루라인 전용 주차장에 못 들어가는 SUV 차량 이용객에게 가장 추천하는 공영주차장입니다.'],
      },
      {
        name: '미포 공영주차장',
        type: 'public',
        typeLabel: '구영 공영주차장',
        isFree: false,
        hasFreeSupport: false,
        feeRate: '10분당 300원 (1시간 1,800원)',
        address: '부산 해운대구 중동 1015-1',
        walkingDistance: '미포정거장 도보 약 3분',
        cautionNotes: ['주차 공간이 협소하여 주말 낮 시간대 만차 잦음'],
      },
    ],
  },
  {
    placeId: 'd1-p6',
    placeName: '부산엑스더스카이',
    plannedTime: '18:00',
    area: '해운대구 / 중동',
    destinationAddress: '부산 해운대구 달맞이길 30 (엘시티 랜드마크타워)',
    hasDedicatedParking: true,
    dedicatedParkingSummary: '초대형 엘시티 지하주차장 완비 (전망대 관람객 2시간 전액 무료 지원)',
    recommendation: '엘시티 지하 1층 상가/전망대 주차 구역에 주차 후 1층 매표소에서 2시간 무료 등록 필수!',
    facilities: [
      {
        name: '엘시티 랜드마크타워 지하주차장 (추천)',
        type: 'dedicated',
        typeLabel: '건물 자체 대형 자주식 주차장',
        isFree: false,
        hasFreeSupport: true,
        freeCondition: '전망대 입장객 2시간 무료 지원 (1층 안내데스크에서 차량 번호 등록 필수)',
        feeRate: '2시간 무료 / 2시간 초과 시 10분당 1,000원 (1시간 6,000원)',
        address: '부산 해운대구 달맞이길 30, 엘시티 지하 1층',
        walkingDistance: '전망대 전용 엘리베이터로 1층 매표소 직결',
        cautionNotes: [
          '지하 1층 상가/전망대 전용 주차구역(F~G라인 등)에 주차하시면 이동이 가장 편리합니다.',
          '자주식 대형 주차장으로 SUV, 대형차, 전기차 모두 편리하게 주차 가능합니다.',
        ],
      },
    ],
  },
  {
    placeId: 'd1-p7',
    placeName: 'STAY gree#171 (숙소)',
    plannedTime: '19:30',
    area: '동구 / 부산역·초량',
    destinationAddress: '부산 동구 중앙대로180번길 16-12 1701호',
    hasDedicatedParking: true,
    dedicatedParkingSummary: '숙소 건물 내 투숙객 전용 주차장 완비 (전액 무료 주차 지원)',
    recommendation: '숙소 건물 내 전용 주차장에 무료 주차가 가능하며, 체크인 안내에 따라 편리하게 주차하실 수 있습니다.',
    facilities: [
      {
        name: 'STAY gree#171 전용 주차장 (무료)',
        type: 'dedicated',
        typeLabel: '숙소 전용 주차장',
        isFree: true,
        hasFreeSupport: true,
        freeCondition: '숙소 투숙객 전액 무료 주차 지원 (입실~퇴실 기간)',
        feeRate: '전액 무료 (0원)',
        address: '부산 동구 중앙대로180번길 16-12 (숙소 건물)',
        walkingDistance: '숙소 건물 내 위치 (엘리베이터 직결, 도보 0분)',
        cautionNotes: [
          '숙소 예약 고객 전용 무료 주차 구역입니다.',
          '지정 주차 구역 및 차단기/입차 방법은 호스트 입실 안내 메시지를 확인해주세요.',
        ],
      },
      {
        name: '초량 민영주차장 (인근 보조 주차)',
        type: 'paid',
        typeLabel: '민영 유료주차장',
        isFree: false,
        hasFreeSupport: false,
        feeRate: '기본 30분 1,500원 / 1일 주차 약 15,000원',
        address: '부산 동구 중앙대로180번길 일대',
        walkingDistance: '숙소 건물 도보 1분',
        cautionNotes: ['추가 차량이 있을 경우 이용 가능한 최단거리 민영 주차장입니다.'],
      },
      {
        name: '부산역 북항방면 주차장 (서광장)',
        type: 'public',
        typeLabel: '역사 직영 주차장',
        isFree: false,
        hasFreeSupport: false,
        feeRate: '1일 최대 15,000원 (열차 이용객 30% 할인)',
        address: '부산 동구 초량동 1183-1 (부산역 후면 북항 방향)',
        walkingDistance: '숙소 도보 3~4분',
        discountNotes: '열차 승차권 소지자 30% 할인 / 경차·친환경차 50% 할인',
      },
    ],
  },
];
