import { TeamMember, HandoverItem, BotCallLog, PreClearTask } from '../types';

export const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'm1',
    name: '김지수',
    title: '주무관 (8급)',
    department: '환경보전과',
    extension: '2841',
    phone: '010-3849-1192',
    email: 'jisu.kim@gangseo.seoul.kr',
    avatarColor: 'bg-emerald-600',
    shiftGroup: 'MON_OFF',
    offDay: '월',
    buddyId: 'm2',
    specialty: '대기배출시설 지도점검 및 미세먼지 저감대책',
  },
  {
    id: 'm2',
    name: '최승희',
    title: '주무관 (8급)',
    department: '환경보전과',
    extension: '2842',
    phone: '010-9281-4471',
    email: 'seunghee.choi@gangseo.seoul.kr',
    avatarColor: 'bg-teal-600',
    shiftGroup: 'FRI_OFF',
    offDay: '금',
    buddyId: 'm1',
    specialty: '탄소중립 녹색성장 계획 수립 및 친환경차 보급',
  },
  {
    id: 'm3',
    name: '박철희',
    title: '주무관 (7급)',
    department: '환경보전과',
    extension: '2843',
    phone: '010-4491-8823',
    email: 'chulhee.park@gangseo.seoul.kr',
    avatarColor: 'bg-sky-600',
    shiftGroup: 'MON_OFF',
    offDay: '월',
    buddyId: 'm4',
    specialty: '수질오염 총량관리 및 비점오염원 저감시설 점검',
  },
  {
    id: 'm4',
    name: '황재환',
    title: '주무관 (8급)',
    department: '환경보전과',
    extension: '2844',
    phone: '010-7731-9012',
    email: 'jaehwan.hwang@gangseo.seoul.kr',
    avatarColor: 'bg-indigo-600',
    shiftGroup: 'FRI_OFF',
    offDay: '금',
    buddyId: 'm3',
    specialty: '사업장 폐기물 적정처리 지도 및 자원순환 촉진',
  },
  {
    id: 'm5',
    name: '김한민',
    title: '주무관 (8급)',
    department: '환경보전과',
    extension: '2845',
    phone: '010-5512-3341',
    email: 'hanmin.kim@gangseo.seoul.kr',
    avatarColor: 'bg-amber-600',
    shiftGroup: 'MON_OFF',
    offDay: '월',
    buddyId: 'm6',
    specialty: '야생생물 보호구역 관리 및 생태계 교란생물 퇴치',
  },
  {
    id: 'm6',
    name: '백민희',
    title: '팀장 (5급)',
    department: '환경보전과',
    extension: '2840',
    phone: '010-2211-9988',
    email: 'minhee.baek@gangseo.seoul.kr',
    avatarColor: 'bg-slate-700',
    shiftGroup: 'FRI_OFF',
    offDay: '금',
    buddyId: 'm5',
    specialty: '환경보전과 총괄 및 주4일제 스마트워크 운영',
  },
];

export const INITIAL_HANDOVERS: HandoverItem[] = [
  {
    id: 'ho-1',
    senderId: 'm1', // 김지수 (월 휴무)
    receiverId: 'm2', // 최승희 (8급 짝꿍)
    title: '동강아스콘 굴뚝원격감시(TMS) 질소산화물 농도 일시상승 현장점검 보완서류 확인',
    citizenName: '이동현 소장 (동강아스콘)',
    citizenPhone: '010-4491-3820',
    caseNumber: '2026-환경-0842',
    urgency: 'urgent',
    summary3Lines: [
      'TMS 자동전송 서버 정상 수신 여부 환경공단 클린시스에서 오전 10시 확인 필요',
      '사업장 버너 교체 완료 소명서 및 시운전 성적서 미비 없으면 접수 완료 처리 요망',
      '사업장 소장님 추가 문의 시 내선 2842로 직접 안내 부탁드립니다 (사전 구두협의 완료)',
    ],
    checklist: [
      { id: 'c1', text: '클린시스 TMS 30분 평균치 정상 범위 회복 확인', completed: true },
      { id: 'c2', text: '방지시설 개선완료 보고서 검토 및 접수증 교부', completed: false },
      { id: 'c3', text: '사업장 환경관리인에게 결과 안내 문자 발송', completed: false },
    ],
    status: 'checked',
    createdAt: '2026-09-17 17:58',
    proxyMemo: '오전 10:20 클린시스 수치 정상(기준치의 45%) 확인했습니다. 성적서 검토 후 승인하겠습니다!',
  },
  {
    id: 'ho-2',
    senderId: 'm3', // 박철희 (월 휴무)
    receiverId: 'm4', // 황재환 (짝꿍)
    title: '안양천 합류구 하천 수질 이상(백색 탁수) 긴급 방제조치 및 시료 분석 의뢰',
    citizenName: '시민 환경감시단 (김정수 단장)',
    citizenPhone: '010-7712-4411',
    caseNumber: '2026-수질-1941',
    urgency: 'critical',
    summary3Lines: [
      '주말 하천 오일펜스 2선 설치 완료 상태이며, 보건환경연구원에 시료 2점 긴급 탁송했습니다',
      '월요일 오전 11시 현장 잔류물질 흡착포 수거 및 관할 배수문 차단 상태 확인 필수',
      '상류 인근 세차장 및 도색공장 우수관로 폐수 무단방류 여부 CCTV 대조 확인 요망',
    ],
    checklist: [
      { id: 'c4', text: '보건환경연구원 접수증 및 긴급 분석의뢰 공문 상신', completed: true },
      { id: 'c5', text: '흡착포 수거 기동반(용역사) 현장 배치 확인', completed: false },
      { id: 'c6', text: '신고인 감시단장님께 안심 조치현황 1차 유선 안내', completed: false },
    ],
    status: 'transferred',
    createdAt: '2026-09-17 18:05',
  },
  {
    id: 'ho-3',
    senderId: 'm5', // 김한민 (월 휴무)
    receiverId: 'm6', // 백민희 팀장 (짝꿍)
    title: '생태경관보전지역 내 가시박 등 생태계 교란식물 2차 제거작업 계획 승인',
    citizenName: '푸른강서가꾸기협의회',
    citizenPhone: '010-8832-1920',
    caseNumber: '2026-생태-0312',
    urgency: 'normal',
    summary3Lines: [
      '작업 인부 안전교육 확인서 및 폐기물 운반계약서 첨부 완료되었습니다',
      '국비 보조금 교부신청서 기안 작성해 두었으니 결재함 상신만 부탁드립니다',
      '협의회 사무국장님께는 작업 승인 공문 월요일 오후 중 전자발송 예정입니다',
    ],
    checklist: [
      { id: 'c7', text: '안전보호구 지급대장 및 보험가입증명서 대조', completed: true },
      { id: 'c8', text: '사업계획 승인 결재안 상신', completed: true },
      { id: 'c9', text: '전자고지 시스템 공문 발송', completed: true },
    ],
    status: 'resolved',
    createdAt: '2026-09-17 17:40',
    proxyMemo: '오전 11:30에 팀장님 전결 결재 완료했고 협의회 유선 통보까지 마무리했습니다.',
    resolvedAt: '2026-09-18 11:30',
  },
];

export const INITIAL_BOT_LOGS: BotCallLog[] = [
  {
    id: 'log-1',
    timestamp: '09:24',
    callerName: '태평금속 박진우 환경담당',
    callerPhone: '010-3321-7788',
    inquiryTitle: '대기배출시설 설치 허가 변경신고서 제출 기한 및 구비서류 문의',
    targetOfficerId: 'm1', // 김지수 (휴무)
    buddyOfficerId: 'm2', // 최승희
    actionTaken: 'transferred',
    details: '자동 부재 안내 송출 후 1:1 짝꿍 최승희 주무관(내선 2842)에게 즉시 호 전환 완료 (통화시간 3분 15초)',
    isUrgent: true,
  },
  {
    id: 'log-2',
    timestamp: '10:45',
    callerName: '환경보전협회 교육팀',
    callerPhone: '010-5591-2311',
    inquiryTitle: '관내 수질환경기술인 법정교육 대상자 명단 공문 수신 확인',
    targetOfficerId: 'm3', // 박철희 (휴무)
    buddyOfficerId: 'm4', // 황재환
    actionTaken: 'memo_saved',
    details: '민원 이관 봇이 접수한 문의 요약이 짝꿍 황재환 주무관 메신저로 자동 전달됨. 공문 수신함 정상 접수 안내 완료.',
    isUrgent: false,
  },
  {
    id: 'log-3',
    timestamp: '13:10',
    callerName: '염창동 주민대표단',
    callerPhone: '010-9941-5523',
    inquiryTitle: '인근 재건축 공사장 비산먼지 살수기 미가동 민원 긴급 신고',
    targetOfficerId: 'm1', // 김지수 (휴무)
    buddyOfficerId: 'm2', // 최승희
    actionTaken: 'transferred',
    details: '대기환경 긴급 민원으로 분류되어 짝꿍 최승희 주무관에게 즉시 호 전환, 현장 단속반 긴급 출동 지시.',
    isUrgent: true,
  },
  {
    id: 'log-4',
    timestamp: '15:20',
    callerName: '현대자동차 강서지점',
    callerPhone: '02-540-1280',
    inquiryTitle: '2026 하반기 전기차 구매보조금 지자체 잔여대수 확인 및 서류 제출 문의',
    targetOfficerId: 'm2', // 최승희 (출근 시 문의)
    buddyOfficerId: 'm1', // 김지수
    actionTaken: 'callback_reserved',
    details: '무공해차 통합누리집 접수 현황 안내 및 필요 서류 알림톡 자동 발송 완료.',
    isUrgent: false,
  },
];

export const INITIAL_PRE_CLEAR_TASKS: PreClearTask[] = [
  {
    id: 'pre-1',
    title: '차주 월요일 대기오염물질 배출사업장 3개소 TMS 굴뚝측정 데이터 사전 조회',
    category: '민원사전검토',
    targetDate: '차주 월요일 (09:00)',
    assigneeId: 'm2', // 최승희
    completed: true,
    estimatedTime: '15분 소요',
    benefit: '월요일 아침 출근 즉시 9시 현장 지도점검 지연 없이 출발 가능',
  },
  {
    id: 'pre-2',
    title: '주말 환경오염신고(128번) 접수 내역 및 안양천 수질 자동측정망 수치 사전 정리',
    category: '단순서류정리',
    targetDate: '차주 월요일 (08:30)',
    assigneeId: 'm4', // 황재환
    completed: true,
    estimatedTime: '10분 소요',
    benefit: '월요일 오전 9시 부서 주간 현안회의 보고자료 즉시 활용',
  },
  {
    id: 'pre-3',
    title: '탄소중립포인트 가입 대상자 에코마일리지 실적 검증 및 일괄 사전 전산 등록',
    category: '정례보고사전결재',
    targetDate: '차주 월요일 (10:00)',
    assigneeId: 'm2', // 최승희
    completed: false,
    estimatedTime: '20분 소요',
    benefit: '월요일 전산 접속 폭주 시 시스템 지연에 따른 지급 처리 지연 원천 차단',
  },
  {
    id: 'pre-4',
    title: '주말 강우 예보 대비 수질오염 방제장비(오일펜스, 유흡착포) 기동 점검',
    category: '예약업무세팅',
    targetDate: '차주 월요일 (09:00)',
    assigneeId: 'm4', // 황재환
    completed: true,
    estimatedTime: '5분 소요',
    benefit: '돌발 오염물질 유입 시 30분 이내 방제 비상대응 가능',
  },
  {
    id: 'pre-5',
    title: '금요일 퇴근 전 대기·수질 민원 안내창구 스탠드 및 ARS 부재 음성멘트 점검',
    category: '단순서류정리',
    targetDate: '금요일 18:00',
    assigneeId: 'm6', // 백민희 팀장
    completed: true,
    estimatedTime: '5분 소요',
    benefit: '방문 민원인의 "환경부서 담당자 부재" 당혹감 방지 및 짝꿍 지정석 안내',
  },
];
