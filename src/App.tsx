import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { HandoverSection } from './components/HandoverSection';
import { HandoverModal } from './components/HandoverModal';
import { AutoBotSimulator } from './components/AutoBotSimulator';
import { PreClearSection } from './components/PreClearSection';
import { AlimtalkPreviewModal } from './components/AlimtalkPreviewModal';
import { LoginModal } from './components/LoginModal';
import { LotteryDrawModal } from './components/LotteryDrawModal';
import { Footer } from './components/Footer';
import {
  INITIAL_MEMBERS,
  INITIAL_HANDOVERS,
  INITIAL_BOT_LOGS,
  INITIAL_PRE_CLEAR_TASKS,
} from './data/mockData';
import {
  DayOfWeek,
  TeamMember,
  HandoverItem,
  BotCallLog,
  PreClearTask,
} from './types';
import { CheckCircle2, Send, Sparkles, LogIn, LogOut, User, Bell, Dices } from 'lucide-react';

export default function App() {
  // 1. Core State
  const [currentDay, setCurrentDay] = useState<DayOfWeek>('월');
  const [allMembers, setAllMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('sw_members');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].department === '환경보전과') {
          return parsed;
        }
      } catch {}
    }
    return INITIAL_MEMBERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>('m1'); // 김지수 주무관 (월요 휴무)

  // Auth State: simulated user (true) or guest (false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem('sw_is_logged_in');
    return saved !== null ? JSON.parse(saved) : true;
  });

  const [handovers, setHandovers] = useState<HandoverItem[]>(() => {
    const saved = localStorage.getItem('sw_handovers');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].caseNumber?.includes('환경')) {
          return parsed;
        }
      } catch {}
    }
    return INITIAL_HANDOVERS;
  });

  const [botLogs, setBotLogs] = useState<BotCallLog[]>(() => {
    const saved = localStorage.getItem('sw_bot_logs');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].details?.includes('환경')) {
          return parsed;
        }
      } catch {}
    }
    return INITIAL_BOT_LOGS;
  });

  const [preClearTasks, setPreClearTasks] = useState<PreClearTask[]>(() => {
    const saved = localStorage.getItem('sw_pre_clear');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && parsed[0].title?.includes('환경')) {
          return parsed;
        }
      } catch {}
    }
    return INITIAL_PRE_CLEAR_TASKS;
  });

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'calendar' | 'handover' | 'preclear' | 'bot'
  >('dashboard');

  // Modals & Notifications
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAlimtalkModalOpen, setIsAlimtalkModalOpen] = useState(false);
  const [isLotteryModalOpen, setIsLotteryModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'greeting' | 'info';
    title?: string;
    text: string;
  } | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('sw_members', JSON.stringify(allMembers));
  }, [allMembers]);

  useEffect(() => {
    localStorage.setItem('sw_is_logged_in', JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('sw_handovers', JSON.stringify(handovers));
  }, [handovers]);

  useEffect(() => {
    localStorage.setItem('sw_bot_logs', JSON.stringify(botLogs));
  }, [botLogs]);

  useEffect(() => {
    localStorage.setItem('sw_pre_clear', JSON.stringify(preClearTasks));
  }, [preClearTasks]);

  // Current active user & buddy
  const currentUser =
    allMembers.find((m) => m.id === currentUserId) || allMembers[0];
  const currentBuddy = allMembers.find((m) => m.id === currentUser.buddyId);

  const showToast = (text: string, title?: string, type: 'success' | 'greeting' | 'info' = 'success') => {
    setToastMessage({ text, title, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Toggle Auth: Switches between User Mode & Guest Mode with distinct greeting message
  const handleToggleAuth = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      showToast(
        '게스트 모드로 전환되었습니다. 대민 열람 및 시뮬레이션 상태로 작동합니다. 상단 로그인 버튼으로 언제든 복귀할 수 있습니다.',
        '🔒 게스트 모드 전환 완료',
        'info'
      );
    } else {
      setIsLoggedIn(true);
      showToast(
        `반갑습니다, ${currentUser.name} ${currentUser.title}님! (${currentUser.department} · ${
          currentUser.offDay ? `${currentUser.offDay}요일 휴무조` : '상시근무'
        }) 오늘의 1:1 짝꿍은 ${currentBuddy?.name || '파트너'} 주무관입니다.`,
        `👋 ${currentUser.name} 주무관님 환영합니다!`,
        'greeting'
      );
    }
  };

  // Handover Operations
  const handleSendHandover = (
    newHandoverData: Omit<HandoverItem, 'id' | 'createdAt' | 'status'>
  ) => {
    const newHandover: HandoverItem = {
      ...newHandoverData,
      id: `ho-${Date.now()}`,
      status: 'transferred',
      createdAt: '오늘 18:00 (퇴근 전 자동전송)',
    };

    setHandovers((prev) => [newHandover, ...prev]);
    showToast(`짝꿍 ${currentBuddy?.name || '담당'} 주무관님께 3줄 인수인계가 전송되었습니다.`, '인수인계 완료');
  };

  const handleToggleChecklistItem = (handoverId: string, checkId: string) => {
    setHandovers((prev) =>
      prev.map((h) => {
        if (h.id !== handoverId) return h;
        const updatedChecklist = h.checklist.map((c) =>
          c.id === checkId ? { ...c, completed: !c.completed } : c
        );
        const hasUncompleted = updatedChecklist.some((c) => !c.completed);
        return {
          ...h,
          checklist: updatedChecklist,
          status: hasUncompleted ? 'checked' : 'checked',
        };
      })
    );
  };

  const handleUpdateProxyMemo = (handoverId: string, memo: string) => {
    setHandovers((prev) =>
      prev.map((h) => (h.id === handoverId ? { ...h, proxyMemo: memo } : h))
    );
    showToast('대리 처리 메모가 저장되었습니다.');
  };

  const handleResolveHandover = (handoverId: string) => {
    setHandovers((prev) =>
      prev.map((h) =>
        h.id === handoverId
          ? {
              ...h,
              status: 'resolved',
              resolvedAt: '방금 전',
              checklist: h.checklist.map((c) => ({ ...c, completed: true })),
            }
          : h
      )
    );
    showToast('인수인계 건 대리 처리가 완료되었습니다.', '대리 처리 종결');
  };

  // Calendar Swap Request
  const handleSwapRequest = (member1Id: string, member2Id: string) => {
    setAllMembers((prev) =>
      prev.map((m) => {
        if (m.id === member1Id) {
          const target = prev.find((t) => t.id === member2Id);
          return {
            ...m,
            offDay: target?.offDay || null,
            shiftGroup: target?.shiftGroup || 'MON_OFF',
          };
        }
        if (m.id === member2Id) {
          const target = prev.find((t) => t.id === member1Id);
          return {
            ...m,
            offDay: target?.offDay || null,
            shiftGroup: target?.shiftGroup || 'FRI_OFF',
          };
        }
        return m;
      })
    );
    showToast('휴무일 맞교환 일정이 캘린더에 즉시 반영되었습니다.', '일정 맞교환 승인');
  };

  // Bot Log Add
  const handleAddBotLog = (logData: Omit<BotCallLog, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;

    const newLog: BotCallLog = {
      ...logData,
      id: `log-${Date.now()}`,
      timestamp: timeStr,
    };

    setBotLogs((prev) => [newLog, ...prev]);
    showToast('부재 봇 처리 기록이 저장되었습니다.');
  };

  // Pre-Clear Task Handlers
  const handleTogglePreClearTask = (taskId: string) => {
    setPreClearTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddPreClearTask = (
    taskData: Omit<PreClearTask, 'id' | 'completed'>
  ) => {
    const newTask: PreClearTask = {
      ...taskData,
      id: `pre-${Date.now()}`,
      completed: false,
    };
    setPreClearTasks((prev) => [newTask, ...prev]);
    showToast('월요일 대비 미리 챙김 항목이 추가되었습니다.');
  };

  // Lottery Draw Results Application Handler
  const handleApplyLotteryResults = (updatedMembers: TeamMember[]) => {
    setAllMembers(updatedMembers);
    showToast(
      '환경보전과 월·금 휴무일 추첨 결과가 캘린더 및 부서 운영표에 즉시 반영되었습니다!',
      '추첨 결과 적용 완료',
      'greeting'
    );
  };

  // Reset to initial demo data
  const handleResetData = () => {
    localStorage.removeItem('sw_members');
    localStorage.removeItem('sw_handovers');
    localStorage.removeItem('sw_bot_logs');
    localStorage.removeItem('sw_pre_clear');
    localStorage.removeItem('sw_is_logged_in');
    setAllMembers(INITIAL_MEMBERS);
    setHandovers(INITIAL_HANDOVERS);
    setBotLogs(INITIAL_BOT_LOGS);
    setPreClearTasks(INITIAL_PRE_CLEAR_TASKS);
    setCurrentUserId('m1');
    setCurrentDay('월');
    setIsLoggedIn(true);
    showToast('데모 데이터가 초기 설정값으로 복원되었습니다.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast / Greeting Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-5 right-5 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-start space-x-3 text-xs animate-in fade-in slide-in-from-bottom-3 duration-300 max-w-sm ${
            toastMessage.type === 'greeting'
              ? 'bg-slate-900 text-white border-blue-500/40'
              : toastMessage.type === 'info'
              ? 'bg-slate-900 text-amber-100 border-amber-500/40'
              : 'bg-slate-900 text-white border-slate-700'
          }`}
        >
          <div className="mt-0.5 shrink-0">
            {toastMessage.type === 'greeting' ? (
              <Sparkles className="w-4 h-4 text-amber-400" />
            ) : toastMessage.type === 'info' ? (
              <User className="w-4 h-4 text-amber-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            )}
          </div>
          <div>
            {toastMessage.title && (
              <div className="font-bold text-white text-xs mb-0.5">
                {toastMessage.title}
              </div>
            )}
            <div className="text-slate-300 font-medium leading-relaxed">
              {toastMessage.text}
            </div>
          </div>
        </div>
      )}

      {/* Header with modern login/logout toggle */}
      <Header
        currentDay={currentDay}
        onSelectDay={setCurrentDay}
        currentUser={currentUser}
        allMembers={allMembers}
        onSelectUser={(user) => {
          setCurrentUserId(user.id);
          if (isLoggedIn) {
            showToast(
              `${user.name} ${user.title} (${user.department}) 계정으로 활성화되었습니다.`,
              '계정 변경 완료',
              'greeting'
            );
          }
        }}
        onOpenHandoverModal={() => setIsHandoverModalOpen(true)}
        onOpenBotModal={() => setActiveTab('bot')}
        onOpenAlimtalkModal={() => setIsAlimtalkModalOpen(true)}
        onResetData={handleResetData}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        onToggleAuth={handleToggleAuth}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenLotteryModal={() => setIsLotteryModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <Dashboard
            currentDay={currentDay}
            currentUser={currentUser}
            allMembers={allMembers}
            handovers={handovers}
            botLogs={botLogs}
            onOpenHandoverModal={() => setIsHandoverModalOpen(true)}
            onOpenBotSimulator={() => setActiveTab('bot')}
            onNavigateTab={setActiveTab}
            onOpenLotteryModal={() => setIsLotteryModalOpen(true)}
            onSelectUser={(u) => {
              setCurrentUserId(u.id);
              if (isLoggedIn) {
                showToast(`${u.name} ${u.title} 계정으로 선택되었습니다.`, '접속 계정 전환');
              }
            }}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            currentDay={currentDay}
            allMembers={allMembers}
            currentUser={currentUser}
            onSelectDay={setCurrentDay}
            onSelectUser={(u) => {
              setCurrentUserId(u.id);
            }}
            onSwapRequest={handleSwapRequest}
            onOpenLotteryModal={() => setIsLotteryModalOpen(true)}
          />
        )}

        {activeTab === 'handover' && (
          <HandoverSection
            currentUser={currentUser}
            allMembers={allMembers}
            handovers={handovers}
            onOpenCreateModal={() => setIsHandoverModalOpen(true)}
            onToggleChecklistItem={handleToggleChecklistItem}
            onUpdateProxyMemo={handleUpdateProxyMemo}
            onResolveHandover={handleResolveHandover}
          />
        )}

        {activeTab === 'bot' && (
          <AutoBotSimulator
            currentUser={currentUser}
            allMembers={allMembers}
            botLogs={botLogs}
            onAddBotLog={handleAddBotLog}
          />
        )}

        {activeTab === 'preclear' && (
          <PreClearSection
            currentUser={currentUser}
            allMembers={allMembers}
            tasks={preClearTasks}
            onToggleTask={handleTogglePreClearTask}
            onAddTask={handleAddPreClearTask}
          />
        )}
      </main>

      {/* Modern Comprehensive Footer */}
      <Footer
        onNavigateTab={setActiveTab}
        isLoggedIn={isLoggedIn}
        currentUser={currentUser}
        onToggleAuth={handleToggleAuth}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Handover Creation Modal */}
      <HandoverModal
        isOpen={isHandoverModalOpen}
        onClose={() => setIsHandoverModalOpen(false)}
        currentUser={currentUser}
        buddy={currentBuddy}
        onSendHandover={handleSendHandover}
      />

      {/* Kakao Alimtalk & Mobile Preview Modal */}
      <AlimtalkPreviewModal
        isOpen={isAlimtalkModalOpen}
        onClose={() => setIsAlimtalkModalOpen(false)}
        currentUser={currentUser}
        buddy={currentBuddy}
        latestHandover={handovers[0]}
      />

      {/* Login & Persona Management Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        currentUser={currentUser}
        allMembers={allMembers}
        isLoggedIn={isLoggedIn}
        onLogin={(user) => {
          setCurrentUserId(user.id);
          setIsLoggedIn(true);
          showToast(
            `환영합니다, ${user.name} ${user.title}님! (${user.department}) 성공적으로 로그인되었습니다.`,
            'SSO 인증 성공',
            'greeting'
          );
        }}
        onLogout={() => {
          setIsLoggedIn(false);
          showToast(
            '로그아웃되었습니다. 게스트 모드로 둘러보실 수 있습니다.',
            '로그아웃 완료',
            'info'
          );
        }}
      />

      {/* Lottery Draw Modal (월·금 휴무일 랜덤 추첨 게임) */}
      <LotteryDrawModal
        isOpen={isLotteryModalOpen}
        onClose={() => setIsLotteryModalOpen(false)}
        allMembers={allMembers}
        currentUser={currentUser}
        onApplyResults={handleApplyLotteryResults}
      />
    </div>
  );
}

