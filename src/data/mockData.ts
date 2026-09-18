import { TeamMember, HandoverItem, BotCallLog, PreClearTask } from '../types';

export const INITIAL_MEMBERS: TeamMember[] = [
  {
    id: 'm1',
    name: '김지수',
    title: '주무관 (7급)',
    department: '도시건축과',
    extension: '2841',
    phone: '010-3849-1192',
    email: 'jisu.kim@smartwork.gov.kr',
    avatarColor: 'bg-emerald-600',
    shiftGroup: 'MON_OFF',
    offDay: '월',
    buddyId: 'm2',
    specialty: '건축허가 접수 및 개발행위 심의',
  },
  {
    id: 'm2',
    name: '박민우',
    title: '주무관 (8급)',
    department: '도시건축과',
    extension: '2842',
    phone: '010-9281-4471',
    email: 'minwoo.park@smartwork.gov.kr',
    avatarColor: 'bg-sky-600',
    shiftGroup: 'FRI_OFF',
    offDay: '금',
    buddyId: 'm1',
    specialty: '건축물대장 관리 및 용도변경',
  },
  {
    id: 'm3',
    name: '이수진',
    title: '주무관 (7급)',
    department: '주민복지과',
    extension: '3104',
    phone: '010-4491-8823',
    email: 'sujin.lee@smartwork.gov.kr',
    avatarColor: 'bg-amber-600',
    shiftGroup: 'MON_OFF',
    offDay: '월',
    buddyId: 'm4',
    specialty: '기초생활수급 및 긴급복지 생계지원',
  },
  {
    id: 'm4',
    name: '최강현',
    title: '주무관 (8급)',
    department: '주민복지과',
    extension: '3105',
    phone: '010-7731-9012',
    email: 'ganghyun.choi@smartwork.gov.kr',
    avatarColor: 'bg-indigo-600',
    shiftGroup: 'FRI_OFF',
    offDay: '금',
    buddyId: 'm3',
    specialty: '노인맞춤돌봄 및 복지시설 지도점검',
  },
  {
    id: 'm5',
    name: '정하윤',
    title: '주무관 (8급)',
    department: '교통행정과',
    extension: '4218',
    phone: '010-5512-3341',
    email: 'hayun.jung@smartwork.gov.kr',
    avatarColor: 'bg-rose-600',
    shiftGroup: 'MON_OFF',
    offDay: '월',
    buddyId: 'm6',
    specialty: '불법주정차 단속 및 과태료 이의신청',
  },
  {
    id: 'm6',
    name: '윤태석',
    title: '주무관 (7급)',
    department: '교통행정과',
    extension: '4219',
    phone: '010-8821-6549',
    email: 'taeseok.yoon@smartwork.gov.kr',
    avatarColor: 'bg-teal-600',
    shiftGroup: 'FRI_OFF',
    offDay: '금',
    buddyId: 'm5',
    specialty: '도로점용 허가 및 교통시설물 유지보수',
  },
  {
    id: 'm7',
    name: '이영호',
    title: '팀장 (5급)',
    department: '행정지원과 (총괄)',
    extension: '2001',
    phone: '010-2211-9988',
    email: 'youngho.lee@smartwork.gov.kr',
    avatarColor: 'bg-slate-700',
    shiftGroup: 'FULL_TIME',
    offDay: null,
    buddyId: '',
    specialty: '주4일제 부서 통합운영 및 민원총괄',
  },
];

export const INITIAL_HANDOVERS: HandoverItem[] = [
  {
    id: 'ho-1',
    senderId: 'm1', // 김지수 (월 휴무)
    receiverId: 'm2', // 박민우 (짝꿍)
    title: '성원빌딩 3층 근린생활시설 용도변경 보완서류 확인',
    citizenName: '최성원',
    citizenPhone: '010-4491-3820',
    caseNumber: '2026-건축-0842',
    urgency: 'urgent',
    summary3Lines: [
      '소방시설 완비증명서 보완 제출 여부 세움터에서 오전 10시 확인 필요',
      '서류 미비 없으면 필증 출력 후 민원인에게 SMS 통보해 주세요',
      '특이사항 발생 시 내선 2842로 직접 안내 부탁드립니다',
    ],
    checklist: [
      { id: 'c1', text: '세움터 보완서류(소방완비필증) 접수 확인', completed: true },
      { id: 'c2', text: '건축사 협의 완료 체크', completed: false },
      { id: 'c3', text: '민원인 최성원님께 처리결과 SMS 발송', completed: false },
    ],
    status: 'checked',
    createdAt: '2026-09-17 17:58',
    proxyMemo: '오전 10:15 소방필증 확인 완료했습니다. 건축사 날인 서류만 점검 후 발송하겠습니다.',
  },
  {
    id: 'ho-2',
    senderId: 'm3', // 이수진 (월 휴무)
    receiverId: 'm4', // 최강현 (짝꿍)
    title: '달빛마을 독거어르신 긴급 생계지원금 지급 대상 심의',
    citizenName: '박옥자 어르신 (대리인: 따님)',
    citizenPhone: '010-7712-4411',
    caseNumber: '2026-복지-1941',
    urgency: 'critical',
    summary3Lines: [
      '수급 자격 조회 행복e음 전산 결재선 등록 완료 상태입니다',
      '월요일 오후 2시 복지위 심의 전 결재 도장 여부 확인 필수',
      '따님께서 오전에 전화 주시면 심의 일정 정상 진행 안내 요망',
    ],
    checklist: [
      { id: 'c4', text: '행복e음 소득재산 소명자료 첨부여부 재확인', completed: true },
      { id: 'c5', text: '팀장님 사전 구두보고 및 결재 확인', completed: false },
      { id: 'c6', text: '민원인 대리인 안심 안내 전화 1회', completed: false },
    ],
    status: 'transferred',
    createdAt: '2026-09-17 18:05',
  },
  {
    id: 'ho-3',
    senderId: 'm5', // 정하윤 (월 휴무)
    receiverId: 'm6', // 윤태석 (짝꿍)
    title: '중앙로 45번길 소방도로 불법주정차 단속 이의신청 건',
    citizenName: '정동진',
    citizenPhone: '010-8832-1920',
    caseNumber: '2026-교통-0312',
    urgency: 'normal',
    summary3Lines: [
      '응급환자 수송 확인서 소방서 직인 대조 완료되었습니다',
      '과태료 면제 승인 조서 작성해 두었으니 결재함 상신만 부탁드립니다',
      '민원인에게는 면제 결정 공문 월요일 중 전자문서 발송 예정입니다',
    ],
    checklist: [
      { id: 'c7', text: '응급실 진료 확인서 원본 대조', completed: true },
      { id: 'c8', text: '면제 승인 결재안 상신', completed: true },
      { id: 'c9', text: '전자고지 시스템 승인처리', completed: true },
    ],
    status: 'resolved',
    createdAt: '2026-09-17 17:40',
    proxyMemo: '오전 11:20에 팀장님 전결 처리 완료했고, 민원인께 문자 발송까지 마쳤습니다!',
    resolvedAt: '2026-09-18 11:30',
  },
];

export const INITIAL_BOT_LOGS: BotCallLog[] = [
  {
    id: 'log-1',
    timestamp: '09:24',
    callerName: '한국건설 송정민 소장',
    callerPhone: '010-3321-7788',
    inquiryTitle: '푸른마을 2단지 지하터파기 안전관리계획서 승인 여부 문의',
    targetOfficerId: 'm1', // 김지수 (휴무)
    buddyOfficerId: 'm2', // 박민우
    actionTaken: 'transferred',
    details: '자동 부재 안내 송출 후 짝꿍 박민우 주무관(내선 2842)에게 즉시 호 전환 완료 (통화시간 3분 40초)',
    isUrgent: true,
  },
  {
    id: 'log-2',
    timestamp: '10:45',
    callerName: '주민자치회 간사',
    callerPhone: '010-5591-2311',
    inquiryTitle: '동 주민복지협의체 정기회의 안건 자료 제출처 문의',
    targetOfficerId: 'm3', // 이수진 (휴무)
    buddyOfficerId: 'm4', // 최강현
    actionTaken: 'memo_saved',
    details: '민원 이관 봇이 접수한 문의 요약이 짝꿍 최강현 주무관 메신저로 자동 전달됨. 자료 이메일 수신함 안내 완료.',
    isUrgent: false,
  },
  {
    id: 'log-3',
    timestamp: '13:10',
    callerName: '시민 김태훈님',
    callerPhone: '010-9941-5523',
    inquiryTitle: '상가 앞 볼라드 파손 및 보행 위험 긴급 보수 신고',
    targetOfficerId: 'm5', // 정하윤 (휴무)
    buddyOfficerId: 'm6', // 윤태석
    actionTaken: 'transferred',
    details: '도로시설 긴급 건으로 판단되어 짝꿍 윤태석 주무관에게 즉시 연결되어 현장 보수 기동반 출동 조치.',
    isUrgent: true,
  },
  {
    id: 'log-4',
    timestamp: '15:20',
    callerName: '건축사사무소 다온',
    callerPhone: '02-540-1280',
    inquiryTitle: '신축허가 심의위원회 보완 의견서 제출 관련 방문 예약 문의',
    targetOfficerId: 'm1', // 김지수 (휴무)
    buddyOfficerId: 'm2', // 박민우
    actionTaken: 'callback_reserved',
    details: '화요일(담당자 출근일) 오전 10:30 민원인 방문 상담 자동 예약 등록 및 알림톡 발송 완료.',
    isUrgent: false,
  },
];

export const INITIAL_PRE_CLEAR_TASKS: PreClearTask[] = [
  {
    id: 'pre-1',
    title: '차주 월요일 건축허가 사전심의 안건 3건 도면 사전 다운로드 및 검토',
    category: '민원사전검토',
    targetDate: '차주 월요일 (09:00)',
    assigneeId: 'm2', // 박민우
    completed: true,
    estimatedTime: '15분 소요',
    benefit: '월요일 아침 출근 즉시 9시 심의회의 지연 없이 시작 가능',
  },
  {
    id: 'pre-2',
    title: '주말 무인민원발급기 및 온라인 발급 예약 증명서 일괄 사전 승인',
    category: '단순서류정리',
    targetDate: '차주 월요일 (08:30)',
    assigneeId: 'm4', // 최강현
    completed: true,
    estimatedTime: '10분 소요',
    benefit: '월요일 오전 9시 대민 창구 민원 대기시간 35% 단축',
  },
  {
    id: 'pre-3',
    title: '월요일 복지위 상정 대상자 행복e음 전산 데이터 사전 추출 및 백업',
    category: '정례보고사전결재',
    targetDate: '차주 월요일 (10:00)',
    assigneeId: 'm4', // 최강현
    completed: false,
    estimatedTime: '20분 소요',
    benefit: '월요일 전산 트래픽 폭주 시 시스템 지연에 따른 결재 지연 원천 차단',
  },
  {
    id: 'pre-4',
    title: '주말 접수 예상 도로 파손/포트홀 긴급복구팀 당직조 직통 연락망 사전 배포',
    category: '예약업무세팅',
    targetDate: '차주 월요일 (09:00)',
    assigneeId: 'm6', // 윤태석
    completed: true,
    estimatedTime: '5분 소요',
    benefit: '주말 접수된 민원 현장 확인 1시간 이내 신속 대응 가능',
  },
  {
    id: 'pre-5',
    title: '금요일 퇴근 전 대민 창구 안내 스탠드 및 ARS 부재 음성멘트 점검',
    category: '단순서류정리',
    targetDate: '금요일 18:00',
    assigneeId: 'm7', // 이영호 팀장
    completed: true,
    estimatedTime: '5분 소요',
    benefit: '방문 민원인의 "담당자 부재" 당혹감 방지 및 짝꿍 지정석 안내',
  },
];
