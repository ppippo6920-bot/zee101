export type DayOfWeek = '월' | '화' | '수' | '목' | '금';

export type ShiftGroup = 'MON_OFF' | 'FRI_OFF' | 'FULL_TIME';

export interface TeamMember {
  id: string;
  name: string;
  title: string; // e.g., '주무관', '팀장'
  department: string;
  extension: string; // e.g., '2841'
  phone: string;
  email: string;
  avatarColor: string;
  shiftGroup: ShiftGroup; // 'MON_OFF' = 월요 휴무(화~금 근무), 'FRI_OFF' = 금요 휴무(월~목 근무)
  offDay: DayOfWeek | null; // '월' or '금'
  buddyId: string; // ID of paired 1:1 buddy
  specialty: string; // 담당 업무 (e.g., '건축인허가', '주민복지', '도로교통')
}

export interface HandoverItem {
  id: string;
  senderId: string;
  receiverId: string; // Buddy
  title: string; // 민원/업무명
  citizenName?: string; // 민원인 성함
  citizenPhone?: string; // 민원인 연락처
  caseNumber?: string; // 접수번호
  urgency: 'normal' | 'urgent' | 'critical'; // 보통, 긴급, 즉시대응
  summary3Lines: [string, string, string]; // "오늘 처리한 민원 중 이것만 봐주세요" 3줄 요약
  checklist: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  status: 'transferred' | 'checked' | 'resolved'; // 전달됨, 짝꿍 확인, 대리처리 완료
  createdAt: string;
  proxyMemo?: string; // 짝꿍이 대리 처리 후 남긴 메모
  resolvedAt?: string;
}

export interface BotCallLog {
  id: string;
  timestamp: string;
  callerName: string;
  callerPhone: string;
  inquiryTitle: string;
  targetOfficerId: string;
  buddyOfficerId: string;
  actionTaken: 'transferred' | 'memo_saved' | 'callback_reserved';
  details: string;
  isUrgent: boolean;
}

export interface PreClearTask {
  id: string;
  title: string;
  category: '민원사전검토' | '단순서류정리' | '예약업무세팅' | '정례보고사전결재';
  targetDate: string; // e.g. '차주 월요일'
  assigneeId: string;
  completed: boolean;
  estimatedTime: string;
  benefit: string; // e.g., '월요일 오전 9시 창구 대기 40분 단축'
}

export interface DayStatus {
  day: DayOfWeek;
  dateStr: string;
  workingCount: number;
  offCount: number;
}
