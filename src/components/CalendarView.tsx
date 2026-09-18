import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Users,
  Coffee,
  CheckCircle2,
  ArrowLeftRight,
  Filter,
  Info,
  ShieldCheck,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { DayOfWeek, TeamMember, ShiftGroup } from '../types';

interface CalendarViewProps {
  currentDay: DayOfWeek;
  allMembers: TeamMember[];
  currentUser: TeamMember;
  onSelectDay: (day: DayOfWeek) => void;
  onSelectUser: (user: TeamMember) => void;
  onSwapRequest: (member1Id: string, member2Id: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  currentDay,
  allMembers,
  currentUser,
  onSelectDay,
  onSelectUser,
  onSwapRequest,
}) => {
  const [filterGroup, setFilterGroup] = useState<'ALL' | 'MY_PAIR' | 'MON_OFF' | 'FRI_OFF'>('ALL');
  const [isSwapModalOpen, setIsSwapModalOpen] = useState(false);
  const [swapTargetId, setSwapTargetId] = useState(currentUser.buddyId || allMembers[1]?.id || '');
  const [swapSuccessMessage, setSwapSuccessMessage] = useState<string | null>(null);

  const days: { day: DayOfWeek; label: string; date: string }[] = [
    { day: '월', label: '월요일', date: '9.22' },
    { day: '화', label: '화요일', date: '9.23' },
    { day: '수', label: '수요일', date: '9.24' },
    { day: '목', label: '목요일', date: '9.25' },
    { day: '금', label: '금요일', date: '9.26' },
  ];

  const filteredMembers = allMembers.filter((m) => {
    if (filterGroup === 'MY_PAIR') {
      return m.id === currentUser.id || m.id === currentUser.buddyId;
    }
    if (filterGroup === 'MON_OFF') return m.shiftGroup === 'MON_OFF';
    if (filterGroup === 'FRI_OFF') return m.shiftGroup === 'FRI_OFF';
    return true;
  });

  const handleExecuteSwap = () => {
    if (!currentUser.id || !swapTargetId) return;
    onSwapRequest(currentUser.id, swapTargetId);
    const target = allMembers.find((m) => m.id === swapTargetId);
    setSwapSuccessMessage(
      `${currentUser.name} 주무관과 ${target?.name} 주무관의 휴무일이 정상적으로 맞교환되었습니다.`
    );
    setIsSwapModalOpen(false);
    setTimeout(() => setSwapSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Description Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                <CalendarIcon className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-black text-slate-900">
                월·금 분산 휴무 캘린더 (누가 언제 쉬나?)
              </h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                1초 파악 시스템
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              월요일 조(A조)와 금요일 조(B조)가 50%씩 분산 휴무하여 민원 공백 없이 주 5일 행정을 완벽 가동합니다.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Pills */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs">
              <button
                onClick={() => setFilterGroup('ALL')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  filterGroup === 'ALL'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                전체 ({allMembers.length})
              </button>
              <button
                onClick={() => setFilterGroup('MY_PAIR')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  filterGroup === 'MY_PAIR'
                    ? 'bg-white text-blue-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                내 짝꿍 페어
              </button>
              <button
                onClick={() => setFilterGroup('MON_OFF')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  filterGroup === 'MON_OFF'
                    ? 'bg-white text-emerald-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                A조 (월요 휴무)
              </button>
              <button
                onClick={() => setFilterGroup('FRI_OFF')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
                  filterGroup === 'FRI_OFF'
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                B조 (금요 휴무)
              </button>
            </div>

            {/* Swap Request Button */}
            <button
              onClick={() => setIsSwapModalOpen(true)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-colors"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
              <span>휴무일 맞교환 신청</span>
            </button>
          </div>
        </div>

        {/* Swap Success Alert */}
        {swapSuccessMessage && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{swapSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Week Table Calendar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-3.5 text-slate-700 font-bold w-44">
                  직원 / 짝꿍 정보
                </th>
                {days.map(({ day, label, date }) => {
                  const isToday = currentDay === day;
                  const isMon = day === '월';
                  const isFri = day === '금';

                  return (
                    <th
                      key={day}
                      onClick={() => onSelectDay(day)}
                      className={`p-3 text-center cursor-pointer transition-colors ${
                        isToday
                          ? 'bg-blue-100/70 border-x-2 border-blue-500'
                          : 'hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex items-center space-x-1">
                          <span
                            className={`font-black text-xs ${
                              isToday ? 'text-blue-900' : 'text-slate-800'
                            }`}
                          >
                            {label}
                          </span>
                          {isToday && (
                            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                          )}
                        </div>
                        <span className="text-[10px] text-slate-500">{date}</span>
                        {isMon && (
                          <span className="mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-emerald-100 text-emerald-800">
                            A조 분산 휴무
                          </span>
                        )}
                        {isFri && (
                          <span className="mt-1 text-[9px] font-bold px-1.5 py-0.2 rounded-sm bg-indigo-100 text-indigo-800">
                            B조 분산 휴무
                          </span>
                        )}
                        {!isMon && !isFri && (
                          <span className="mt-1 text-[9px] font-medium text-slate-400">
                            전원 정상근무
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => {
                const buddy = allMembers.find((m) => m.id === member.buddyId);
                const isCurrent = member.id === currentUser.id;

                return (
                  <tr
                    key={member.id}
                    className={`hover:bg-slate-50/70 transition-colors ${
                      isCurrent ? 'bg-blue-50/30 font-medium' : ''
                    }`}
                  >
                    {/* Member Column */}
                    <td className="p-3.5 border-r border-slate-100">
                      <div
                        onClick={() => onSelectUser(member)}
                        className="cursor-pointer group flex items-start space-x-2.5"
                        title="클릭 시 해당 계정으로 전환"
                      >
                        <div
                          className={`w-8 h-8 rounded-xl text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs ${member.avatarColor}`}
                        >
                          {member.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center space-x-1.5">
                            <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                              {member.name}
                            </span>
                            <span className="text-[10px] text-slate-500">
                              {member.title}
                            </span>
                            {isCurrent && (
                              <span className="text-[9px] font-bold bg-blue-600 text-white px-1 py-0.2 rounded-sm">
                                나
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            {member.department} · 내선 {member.extension}
                          </div>
                          {buddy && (
                            <div className="text-[10px] text-blue-600 mt-0.5 flex items-center">
                              <span className="text-slate-400 mr-1">짝꿍:</span>
                              <strong>{buddy.name}</strong> ({buddy.offDay}요 휴)
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Day Columns */}
                    {days.map(({ day }) => {
                      const isOff = member.offDay === day;
                      const isToday = currentDay === day;
                      const isBuddyOff = buddy ? buddy.offDay === day : false;

                      return (
                        <td
                          key={day}
                          className={`p-2.5 text-center align-middle ${
                            isToday ? 'bg-blue-50/50 border-x-2 border-blue-400/40' : ''
                          }`}
                        >
                          {isOff ? (
                            <div className="inline-flex flex-col items-center justify-center w-full py-2 px-1.5 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-900 shadow-2xs">
                              <div className="flex items-center space-x-1 font-extrabold text-[11px] text-emerald-800">
                                <Coffee className="w-3.5 h-3.5 text-emerald-600" />
                                <span>주4일제 휴무</span>
                              </div>
                              <span className="text-[10px] text-emerald-700/90 mt-0.5">
                                대리: {buddy ? `${buddy.name} 짝꿍` : '부서공동'}
                              </span>
                            </div>
                          ) : (
                            <div className="inline-flex flex-col items-center justify-center w-full py-2 px-1.5 bg-white border border-slate-200 rounded-xl text-slate-700 shadow-2xs">
                              <div className="flex items-center space-x-1 font-bold text-[11px] text-slate-900">
                                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                                <span>정상 근무</span>
                              </div>
                              <span className="text-[10px] text-slate-500 mt-0.5 truncate max-w-[120px]">
                                {isBuddyOff ? `★ ${buddy?.name} 대리대응` : member.specialty.split(' ')[0]}
                              </span>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Legend Footer */}
        <div className="p-4 bg-slate-50/70 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-md bg-emerald-100 border border-emerald-300"></span>
              <span>주4일제 휴무 (대체 짝꿍 대리 대응)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-md bg-white border border-slate-300"></span>
              <span>정상 근무 (대민 창구 운영)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="text-amber-600 font-bold">★</span>
              <span>짝꿍 휴무일 대리 대응 중</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-500">
            ※ 직급별·업무별 상호 호환성을 고려하여 1:1 결합 배치되었습니다.
          </div>
        </div>
      </div>

      {/* Swap Request Modal */}
      {isSwapModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md p-6">
            <div className="flex items-center space-x-2 text-slate-900 mb-3">
              <ArrowLeftRight className="w-5 h-5 text-blue-600" />
              <h3 className="text-base font-bold">주4일제 휴무일 맞교환 신청</h3>
            </div>
            <p className="text-xs text-slate-600 mb-4">
              급한 일정이나 민원 업무로 인해 특정 주간의 휴무 요일을 짝꿍 또는 동료와 맞바꿀 수 있습니다.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  내 현재 휴무일
                </label>
                <div className="p-2.5 bg-slate-100 rounded-xl text-xs font-semibold text-slate-800">
                  {currentUser.name} {currentUser.title} ({currentUser.offDay ? `${currentUser.offDay}요일 휴무` : '상시근무'})
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  맞교환 대상 직원 선택
                </label>
                <select
                  value={swapTargetId}
                  onChange={(e) => setSwapTargetId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-800"
                >
                  {allMembers
                    .filter((m) => m.id !== currentUser.id && m.offDay !== null)
                    .map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} {m.title} ({m.offDay}요일 휴무) - {m.specialty}
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setIsSwapModalOpen(false)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                취소
              </button>
              <button
                onClick={handleExecuteSwap}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-xs"
              >
                교환 확정
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
