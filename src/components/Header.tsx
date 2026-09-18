import React from 'react';
import {
  Calendar,
  Users,
  Bot,
  Send,
  Smartphone,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  LogIn,
  LogOut,
  User,
  UserX,
  CheckCircle2,
  Dices,
} from 'lucide-react';
import { DayOfWeek, TeamMember } from '../types';

interface HeaderProps {
  currentDay: DayOfWeek;
  onSelectDay: (day: DayOfWeek) => void;
  currentUser: TeamMember;
  allMembers: TeamMember[];
  onSelectUser: (user: TeamMember) => void;
  onOpenHandoverModal: () => void;
  onOpenBotModal: () => void;
  onOpenAlimtalkModal: () => void;
  onResetData: () => void;
  activeTab: 'dashboard' | 'calendar' | 'handover' | 'preclear' | 'bot';
  onChangeTab: (tab: 'dashboard' | 'calendar' | 'handover' | 'preclear' | 'bot') => void;
  isLoggedIn: boolean;
  onToggleAuth: () => void;
  onOpenLoginModal: () => void;
  onOpenLotteryModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentDay,
  onSelectDay,
  currentUser,
  allMembers,
  onSelectUser,
  onOpenHandoverModal,
  onOpenBotModal,
  onOpenAlimtalkModal,
  onResetData,
  activeTab,
  onChangeTab,
  isLoggedIn,
  onToggleAuth,
  onOpenLoginModal,
  onOpenLotteryModal,
}) => {
  const days: DayOfWeek[] = ['월', '화', '수', '목', '금'];

  // Identify who is off on currentDay
  const offMembersToday = allMembers.filter((m) => m.offDay === currentDay);
  const workingMembersToday = allMembers.filter((m) => m.offDay !== currentDay);
  const buddy = allMembers.find((m) => m.id === currentUser.buddyId);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs">
      {/* Top Bar: Brand, Simulation Controls & Persona Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between py-3 gap-3">
          {/* Logo & Subtitle */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  주4일제 스마트 워크 플랫폼
                </h1>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                  업무 공백 제로 (Zero-Gap)
                </span>
              </div>
              <p className="text-xs text-slate-500 font-medium hidden sm:block">
                월·금 분산 휴무 & 1:1 짝꿍 인수인계로 100% 무중단 대민 행정 보조 툴
              </p>
            </div>
          </div>

          {/* Controls: Day Simulator, Persona Picker, & Modern Login/Logout Button */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Simulated Day Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <span className="text-[11px] font-bold text-slate-500 px-2 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1 text-slate-400" />
                오늘 요일:
              </span>
              <div className="flex space-x-1">
                {days.map((day) => {
                  const isSelected = currentDay === day;
                  const isOffDay = day === '월' || day === '금';
                  return (
                    <button
                      key={day}
                      id={`day-select-${day}-btn`}
                      onClick={() => onSelectDay(day)}
                      className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-white hover:text-slate-900'
                      }`}
                      title={
                        day === '월'
                          ? 'A조 휴무일'
                          : day === '금'
                          ? 'B조 휴무일'
                          : '전원 정상근무'
                      }
                    >
                      {day}요일
                      {isOffDay && (
                        <span
                          className={`ml-1 text-[10px] px-1 rounded-sm ${
                            isSelected
                              ? 'bg-blue-800 text-blue-100'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {day === '월' ? 'A조 휴' : 'B조 휴'}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Persona Switcher */}
            <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-2 py-1">
              <span className="text-[11px] font-bold text-slate-500 mr-1.5 hidden md:inline">
                {isLoggedIn ? '접속 계정:' : '대상 직원:'}
              </span>
              <select
                id="persona-switcher-select"
                value={currentUser.id}
                onChange={(e) => {
                  const found = allMembers.find((m) => m.id === e.target.value);
                  if (found) onSelectUser(found);
                }}
                className="bg-transparent text-xs font-bold text-slate-800 focus:outline-hidden cursor-pointer py-1"
              >
                {allMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.title} ({m.offDay ? `${m.offDay}요 휴무` : '상시근무'})
                  </option>
                ))}
              </select>
            </div>

            {/* Modern Styled Login/Logout Button */}
            <div className="flex items-center">
              {isLoggedIn ? (
                <div className="flex items-center bg-slate-900 text-white rounded-xl p-1 pl-2 border border-slate-800 shadow-xs">
                  <button
                    id="header-user-profile-btn"
                    onClick={onOpenLoginModal}
                    className="flex items-center space-x-2 mr-2 text-left group transition-opacity hover:opacity-90"
                    title="계정 정보 확인 및 전환"
                  >
                    <div className="relative">
                      <div
                        className={`w-6 h-6 rounded-lg text-white font-bold text-[10px] flex items-center justify-center shadow-xs ${currentUser.avatarColor}`}
                      >
                        {currentUser.name[0]}
                      </div>
                      <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-400 rounded-full ring-2 ring-slate-900 animate-pulse"></span>
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-[11px] font-bold leading-tight group-hover:text-blue-300 transition-colors">
                        {currentUser.name} {currentUser.title}
                      </div>
                      <div className="text-[9px] text-slate-400 leading-none">
                        {currentUser.department}
                      </div>
                    </div>
                  </button>

                  <button
                    id="header-auth-toggle-btn"
                    onClick={onToggleAuth}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 text-slate-300 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all border border-slate-700/60"
                    title="클릭 시 게스트(방문자) 모드로 즉시 전환"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span className="hidden md:inline">로그아웃</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center bg-amber-50/90 border border-amber-200/90 rounded-xl p-1 pl-2.5 shadow-2xs">
                  <div className="flex items-center space-x-1.5 mr-2 text-amber-900 text-[11px] font-bold hidden sm:flex">
                    <UserX className="w-3.5 h-3.5 text-amber-600" />
                    <span>게스트 모드</span>
                  </div>
                  <button
                    id="header-auth-toggle-btn"
                    onClick={onToggleAuth}
                    className="px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs hover:shadow-md cursor-pointer active:scale-95"
                    title="클릭 시 직원 계정으로 바로 로그인"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>로그인</span>
                  </button>
                </div>
              )}
            </div>

            {/* Lottery Draw Game Button */}
            <button
              id="open-lottery-modal-btn"
              onClick={onOpenLotteryModal}
              className="px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-black rounded-xl shadow-xs flex items-center space-x-1.5 transition-all hover:shadow-md cursor-pointer animate-pulse duration-1000"
              title="월·금 휴무일 랜덤 추첨 게임 열기"
            >
              <Dices className="w-3.5 h-3.5 text-amber-300" />
              <span>휴무 추첨 🎲</span>
            </button>

            {/* Quick Action Button: 3-second Handover */}
            <button
              id="open-quick-handover-btn"
              onClick={onOpenHandoverModal}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs flex items-center space-x-1.5 transition-all hover:shadow-md"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">3초 인수인계</span>
            </button>

            {/* Alimtalk Preview Button */}
            <button
              id="open-alimtalk-btn"
              onClick={onOpenAlimtalkModal}
              className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-xl text-xs font-semibold flex items-center space-x-1 transition-colors"
              title="모바일 알림톡 / 푸시 미리보기"
            >
              <Smartphone className="w-4 h-4 text-amber-700" />
              <span className="hidden sm:inline">알림톡</span>
            </button>

            {/* Reset Data */}
            <button
              id="reset-demo-data-btn"
              onClick={onResetData}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              title="데모 데이터 새로고침"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Dynamic Auth Greeting Banner */}
        <div
          className={`px-4 py-2 text-xs border-t transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 ${
            isLoggedIn
              ? 'bg-gradient-to-r from-blue-50/80 via-indigo-50/50 to-slate-50 border-blue-100 text-slate-700'
              : 'bg-gradient-to-r from-amber-50 via-orange-50/50 to-slate-50 border-amber-200/80 text-amber-900'
          }`}
        >
          <div className="flex items-center space-x-2 flex-wrap">
            {isLoggedIn ? (
              <>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                  <Sparkles className="w-3 h-3 mr-1 text-blue-600" />
                  직원 접속 중
                </span>
                <span className="font-semibold text-slate-900">
                  반갑습니다, <strong className="text-blue-900">{currentUser.name} {currentUser.title}</strong>님!
                </span>
                <span className="text-slate-500 hidden md:inline">
                  ({currentUser.department} · {currentUser.offDay ? `${currentUser.offDay}요 휴무조` : '상시근무'})
                </span>
                <span className="text-blue-700 font-medium text-[11px] bg-white/80 px-2 py-0.5 rounded-full border border-blue-200/60 hidden lg:inline">
                  오늘의 1:1 짝꿍: {buddy?.name || '파트너'} 주무관
                </span>
              </>
            ) : (
              <>
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-200/70 text-amber-900 border border-amber-300">
                  <UserX className="w-3 h-3 mr-1 text-amber-700" />
                  게스트 모드 열람 중
                </span>
                <span className="font-medium text-amber-950">
                  현재 게스트 모드입니다. 3초 인수인계 작성 및 대리 전결 권한을 체험하려면 [로그인] 버튼을 클릭하세요.
                </span>
              </>
            )}
          </div>

          <div className="flex items-center space-x-2 text-[11px] self-end sm:self-center">
            {isLoggedIn ? (
              <button
                onClick={onToggleAuth}
                className="text-slate-500 hover:text-slate-800 underline font-medium cursor-pointer"
              >
                게스트 모드로 전환
              </button>
            ) : (
              <button
                onClick={onToggleAuth}
                className="font-bold text-blue-700 hover:text-blue-800 underline flex items-center cursor-pointer"
              >
                <span>{currentUser.name} 계정으로 1초 로그인</span>
                <LogIn className="w-3 h-3 ml-1" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center space-x-1 border-t border-slate-100 pt-1 pb-1 overflow-x-auto scrollbar-none">
          <button
            id="nav-tab-dashboard"
            onClick={() => onChangeTab('dashboard')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>오늘 현황판 & 짝꿍 대시보드</span>
          </button>

          <button
            id="nav-tab-calendar"
            onClick={() => onChangeTab('calendar')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'calendar'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>월·금 분산 휴무 캘린더</span>
          </button>

          <button
            id="nav-tab-handover"
            onClick={() => onChangeTab('handover')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'handover'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>1:1 짝꿍 3줄 인수인계</span>
          </button>

          <button
            id="nav-tab-bot"
            onClick={() => onChangeTab('bot')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'bot'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Bot className="w-4 h-4" />
            <span>부재 알림 & 민원 이관 봇</span>
          </button>

          <button
            id="nav-tab-preclear"
            onClick={() => onChangeTab('preclear')}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg transition-all flex items-center space-x-1.5 whitespace-nowrap ${
              activeTab === 'preclear'
                ? 'bg-blue-50 text-blue-700 border border-blue-200/60'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <span>월요일 업무폭탄 '미리 챙김'</span>
          </button>
        </div>
      </div>
    </header>
  );
};
