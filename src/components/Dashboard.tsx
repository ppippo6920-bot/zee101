import React from 'react';
import {
  Users,
  UserCheck,
  Coffee,
  CheckCircle2,
  Clock,
  Send,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { DayOfWeek, TeamMember, HandoverItem, BotCallLog } from '../types';

interface DashboardProps {
  currentDay: DayOfWeek;
  currentUser: TeamMember;
  allMembers: TeamMember[];
  handovers: HandoverItem[];
  botLogs: BotCallLog[];
  onOpenHandoverModal: () => void;
  onOpenBotSimulator: () => void;
  onNavigateTab: (tab: 'dashboard' | 'calendar' | 'handover' | 'preclear' | 'bot') => void;
  onSelectUser: (user: TeamMember) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  currentDay,
  currentUser,
  allMembers,
  handovers,
  botLogs,
  onOpenHandoverModal,
  onOpenBotSimulator,
  onNavigateTab,
  onSelectUser,
}) => {
  // Members working today vs off today
  const offMembersToday = allMembers.filter((m) => m.offDay === currentDay);
  const workingMembersToday = allMembers.filter((m) => m.offDay !== currentDay);

  // Active user's buddy
  const userBuddy = allMembers.find((m) => m.id === currentUser.buddyId);

  // Is current user off today?
  const isUserOffToday = currentUser.offDay === currentDay;
  // Is buddy off today?
  const isBuddyOffToday = userBuddy ? userBuddy.offDay === currentDay : false;

  // Handovers received by current user (where receiver is current user)
  const receivedHandovers = handovers.filter((h) => h.receiverId === currentUser.id);
  const pendingReceivedHandovers = receivedHandovers.filter((h) => h.status !== 'resolved');

  // Handovers sent by current user
  const sentHandovers = handovers.filter((h) => h.senderId === currentUser.id);

  // Group pairs
  const buddyPairs: { a: TeamMember; b: TeamMember }[] = [];
  const processed = new Set<string>();

  allMembers.forEach((m) => {
    if (m.buddyId && !processed.has(m.id)) {
      const buddy = allMembers.find((b) => b.id === m.buddyId);
      if (buddy) {
        buddyPairs.push({ a: m, b: buddy });
        processed.add(m.id);
        processed.add(buddy.id);
      }
    }
  });

  return (
    <div className="space-y-6">
      {/* 1. Top Announcement: "내 오늘의 짝꿍 알림" (PRD 3. UX 핵심) */}
      <div
        id="buddy-notification-banner"
        className={`rounded-2xl p-5 border shadow-xs transition-all ${
          isUserOffToday
            ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 border-emerald-300'
            : isBuddyOffToday
            ? 'bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-amber-500/10 border-blue-300 ring-1 ring-blue-400/30'
            : 'bg-white border-slate-200'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4">
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                isUserOffToday
                  ? 'bg-emerald-600 text-white'
                  : isBuddyOffToday
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-700 text-white'
              }`}
            >
              {isUserOffToday ? (
                <Coffee className="w-6 h-6" />
              ) : isBuddyOffToday ? (
                <UserCheck className="w-6 h-6" />
              ) : (
                <Users className="w-6 h-6" />
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
                  내 오늘의 짝꿍 알림
                </span>
                <span className="text-xs text-slate-500">
                  {currentDay}요일 현황판 기준
                </span>
              </div>

              {isUserOffToday ? (
                <div className="mt-1">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    오늘은 <span className="text-emerald-700 font-extrabold">{currentUser.name} {currentUser.title}</span>의 즐거운 주4일제 휴무일입니다!
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    든든한 짝꿍 <strong className="text-blue-700 font-bold">{userBuddy?.name} 주무관</strong>(내선 {userBuddy?.extension})이
                    정상 출근하여 민원과 업무 공백을 100% 대리 커버 중입니다. (부재 안내봇 가동 중)
                  </p>
                </div>
              ) : isBuddyOffToday ? (
                <div className="mt-1">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    오늘은 짝꿍 <span className="text-blue-700 font-extrabold">{userBuddy?.name} {userBuddy?.title}</span>의 휴무일입니다.
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    김 주무관의 부재 전화는 박 주무관님(내선 {currentUser.extension})에게 자동 이관됩니다.
                    남겨진 <strong className="text-amber-700 font-bold">인수인계 3줄 요약({pendingReceivedHandovers.length}건)</strong>을 점검해 주세요.
                  </p>
                </div>
              ) : (
                <div className="mt-1">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    오늘은 부서 전원 정상 출근일입니다. (주간 협업 & 회의 일자)
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                    짝꿍 <strong className="text-slate-800">{userBuddy?.name} 주무관</strong>과 함께 대면 협의 및
                    금요일/차주 월요일 분산 휴무 전 민원 인수인계 계획을 점검하세요.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
            {isBuddyOffToday && (
              <button
                onClick={() => onNavigateTab('handover')}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm transition-all"
              >
                <span>짝꿍 인수인계 확인 ({pendingReceivedHandovers.length}건)</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={onOpenHandoverModal}
              className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-2xs transition-colors"
            >
              <Send className="w-3.5 h-3.5 text-blue-600" />
              <span>3초 인수인계 작성</span>
            </button>

            <button
              onClick={onOpenBotSimulator}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>부재 봇 모의 테스트</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row: 오늘 출근한 사람 / 쉬는 사람 현황판 (PRD 3) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">오늘 정상 출근자</span>
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-700">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-slate-900">{workingMembersToday.length}명</span>
            <span className="text-xs text-slate-400">/ 총 {allMembers.length}명</span>
          </div>
          <div className="mt-2 text-[11px] text-emerald-700 font-semibold flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            <span>대민 창구 100% 정상 운영</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">오늘 분산 휴무자</span>
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
              <Coffee className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-700">{offMembersToday.length}명</span>
            <span className="text-xs text-slate-400">
              ({currentDay === '월' ? 'A조 휴무' : currentDay === '금' ? 'B조 휴무' : '정상 주간'})
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 font-medium">
            1:1 짝꿍 매칭으로 완벽 상호보완
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">미결 인수인계</span>
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-700">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-amber-800">
              {handovers.filter((h) => h.status !== 'resolved').length}건
            </span>
            <span className="text-xs text-slate-400">대리 처리 진행 중</span>
          </div>
          <div className="mt-2 text-[11px] text-blue-600 font-semibold">
            3줄 체크리스트로 즉각 파악
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">자동 부재 이관봇</span>
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700">
              <PhoneCall className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-indigo-900">{botLogs.length}건</span>
            <span className="text-xs text-slate-400">오늘 호 전환 & 메모</span>
          </div>
          <div className="mt-2 text-[11px] text-indigo-700 font-semibold">
            "담당자 부재" 응답 0건 달성
          </div>
        </div>
      </div>

      {/* 3. 1:1 짝꿍(Buddy) 매칭 실시간 현황 카드 (PRD 2.② & 3) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-900">
                1:1 짝꿍(Buddy) 팀별 분산 운영 현황
              </h3>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                실시간 대응 매트릭스
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              월요 휴무자와 금요 출근 짝꿍이 1:1로 결합하여 담당자 부재 없는 무중단 행정을 실현합니다.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('calendar')}
            className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center self-start sm:self-center"
          >
            <span>전체 캘린더 보기</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {buddyPairs.map(({ a, b }, idx) => {
            const isAOff = a.offDay === currentDay;
            const isBOff = b.offDay === currentDay;

            // Related handovers between this pair
            const pairHandovers = handovers.filter(
              (h) =>
                (h.senderId === a.id && h.receiverId === b.id) ||
                (h.senderId === b.id && h.receiverId === a.id)
            );
            const pendingCount = pairHandovers.filter((h) => h.status !== 'resolved').length;

            const isUserInThisPair = currentUser.id === a.id || currentUser.id === b.id;

            return (
              <div
                key={idx}
                className={`rounded-xl p-4 border transition-all ${
                  isUserInThisPair
                    ? 'border-blue-300 bg-blue-50/40 ring-1 ring-blue-300/60 shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-slate-800">{a.department}</span>
                    {isUserInThisPair && (
                      <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-sm bg-blue-600 text-white">
                        내 페어
                      </span>
                    )}
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      pendingCount > 0
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {pendingCount > 0 ? `인수인계 ${pendingCount}건 진행` : '공백 제로 안심'}
                  </span>
                </div>

                {/* Member A */}
                <div
                  onClick={() => onSelectUser(a)}
                  className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    isAOff
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                  title="클릭 시 이 사용자로 전환"
                >
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center ${a.avatarColor}`}
                    >
                      {a.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold flex items-center space-x-1">
                        <span>{a.name}</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          {a.title}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        내선 {a.extension} · {a.offDay}요 휴무조
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isAOff
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isAOff ? '휴무' : '출근'}
                  </span>
                </div>

                {/* Arrow Connector */}
                <div className="flex items-center justify-center my-1.5 text-xs text-slate-400 font-bold">
                  <span className="h-2 w-px bg-slate-300"></span>
                  <span className="px-2 text-[10px] text-slate-500 font-semibold bg-white rounded-full border border-slate-200">
                    상호 보완 짝꿍
                  </span>
                  <span className="h-2 w-px bg-slate-300"></span>
                </div>

                {/* Member B */}
                <div
                  onClick={() => onSelectUser(b)}
                  className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors ${
                    isBOff
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-white border-slate-200 text-slate-800'
                  }`}
                  title="클릭 시 이 사용자로 전환"
                >
                  <div className="flex items-center space-x-2.5">
                    <div
                      className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center ${b.avatarColor}`}
                    >
                      {b.name[0]}
                    </div>
                    <div>
                      <div className="text-xs font-bold flex items-center space-x-1">
                        <span>{b.name}</span>
                        <span className="text-[11px] font-normal text-slate-500">
                          {b.title}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500">
                        내선 {b.extension} · {b.offDay}요 휴무조
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                      isBOff
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isBOff ? '휴무' : '출근'}
                  </span>
                </div>

                {/* Bottom Summary */}
                <div className="mt-3 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-600">
                  <span className="truncate">
                    {isAOff
                      ? `➔ ${b.name}님이 ${a.name}님 민원 대리 중`
                      : isBOff
                      ? `➔ ${a.name}님이 ${b.name}님 민원 대리 중`
                      : '➔ 전원 근무 (공동 처리)'}
                  </span>
                  <button
                    onClick={() => onNavigateTab('handover')}
                    className="text-blue-600 font-bold hover:underline shrink-0 ml-2"
                  >
                    인수인계
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Two Column Section: Live Handover Checklist & Auto Bot Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: 짝꿍 인수인계 3줄 요약 미리보기 */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    "오늘 이것만 봐주세요" 3줄 인수인계
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    휴무 전날 퇴근 전 남긴 실시간 대리 대응 안건
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('handover')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                전체보기 ({handovers.length})
              </button>
            </div>

            <div className="space-y-3">
              {handovers.slice(0, 2).map((h) => {
                const sender = allMembers.find((m) => m.id === h.senderId);
                const receiver = allMembers.find((m) => m.id === h.receiverId);
                const completedChecks = h.checklist.filter((c) => c.completed).length;

                return (
                  <div
                    key={h.id}
                    className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm ${
                              h.urgency === 'critical'
                                ? 'bg-rose-100 text-rose-800'
                                : h.urgency === 'urgent'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-slate-200 text-slate-700'
                            }`}
                          >
                            {h.urgency === 'critical' ? '즉시대응' : h.urgency === 'urgent' ? '긴급' : '보통'}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 line-clamp-1">
                            {h.title}
                          </h4>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          전달: {sender?.name} {sender?.title} ➔ 짝꿍: {receiver?.name} {receiver?.title} · {h.citizenName ? `민원인: ${h.citizenName}` : ''}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                          h.status === 'resolved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : h.status === 'checked'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {h.status === 'resolved'
                          ? '처리 완료'
                          : h.status === 'checked'
                          ? '짝꿍 확인 중'
                          : '전달 완료'}
                      </span>
                    </div>

                    {/* 3 lines summary preview */}
                    <div className="mt-2.5 bg-white border border-slate-200/80 rounded-lg p-2.5 space-y-1 text-xs">
                      {h.summary3Lines.map((line, lidx) => (
                        <div key={lidx} className="flex items-start space-x-1.5 text-slate-700">
                          <span className="text-[10px] font-bold text-amber-600 mt-0.5">
                            {lidx + 1}.
                          </span>
                          <span className="line-clamp-1">{line}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                      <span>체크리스트 {completedChecks}/{h.checklist.length} 달성</span>
                      <button
                        onClick={() => onNavigateTab('handover')}
                        className="text-blue-600 font-bold hover:underline"
                      >
                        체크하기 ➔
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onOpenHandoverModal}
              className="w-full py-2.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              <span>퇴근 전 3초 인수인계 작성하기</span>
            </button>
          </div>
        </div>

        {/* Right: 자동 부재 알림 & 민원 이관 봇 현황 (PRD 2.③) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center font-bold">
                  <PhoneCall className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    자동 부재 알림 & 민원 이관 봇 실시간 기록
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    휴무 직원 부재 전화 ➔ 짝꿍 자동 연결 & 메모 이관
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                봇 정상 가동 중
              </span>
            </div>

            {/* Auto Message Quote Card */}
            <div className="bg-slate-900 text-slate-100 rounded-xl p-3.5 mb-3 text-xs">
              <div className="flex items-center space-x-1.5 text-amber-400 text-[11px] font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>표준 자동 응답 멘트</span>
              </div>
              <p className="text-slate-300 leading-relaxed italic">
                "현재 김지수 주무관은 주4일제 휴무일입니다. 급한 용건은 대체 담당자인 짝꿍 박민우 주무관(내선번호 2842)에게 즉시 연결됩니다."
              </p>
            </div>

            <div className="space-y-2.5">
              {botLogs.slice(0, 3).map((log) => {
                const target = allMembers.find((m) => m.id === log.targetOfficerId);
                const buddy = allMembers.find((m) => m.id === log.buddyOfficerId);

                return (
                  <div
                    key={log.id}
                    className="p-3 border border-slate-200 rounded-xl bg-slate-50/50 flex items-start justify-between text-xs gap-2"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-400 font-mono text-[10px]">{log.timestamp}</span>
                        <span className="font-bold text-slate-800">{log.callerName}</span>
                        {log.isUrgent && (
                          <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-sm">
                            긴급
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-1">
                        {log.inquiryTitle}
                      </p>
                      <div className="text-[10px] text-blue-700 font-semibold mt-1">
                        ➔ {target?.name}(휴무) 부재 감지 ➔ 짝꿍 {buddy?.name} 주무관 연결
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        log.actionTaken === 'transferred'
                          ? 'bg-blue-100 text-blue-800'
                          : log.actionTaken === 'memo_saved'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}
                    >
                      {log.actionTaken === 'transferred'
                        ? '호 전환 완료'
                        : log.actionTaken === 'memo_saved'
                        ? '메모 접수'
                        : '콜백 예약'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={onOpenBotSimulator}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-emerald-400" />
              <span>직접 민원인 전화 걸어보기 (봇 시뮬레이터)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
