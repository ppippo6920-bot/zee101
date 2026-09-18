import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CalendarView } from './components/CalendarView';
import { HandoverSection } from './components/HandoverSection';
import { HandoverModal } from './components/HandoverModal';
import { AutoBotSimulator } from './components/AutoBotSimulator';
import { PreClearSection } from './components/PreClearSection';
import { AlimtalkPreviewModal } from './components/AlimtalkPreviewModal';
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
import { CheckCircle2, Send, Sparkles } from 'lucide-react';

export default function App() {
  // 1. Core State
  const [currentDay, setCurrentDay] = useState<DayOfWeek>('월');
  const [allMembers, setAllMembers] = useState<TeamMember[]>(() => {
    const saved = localStorage.getItem('sw_members');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>('m1'); // 김지수 주무관 (월요 휴무)

  const [handovers, setHandovers] = useState<HandoverItem[]>(() => {
    const saved = localStorage.getItem('sw_handovers');
    return saved ? JSON.parse(saved) : INITIAL_HANDOVERS;
  });

  const [botLogs, setBotLogs] = useState<BotCallLog[]>(() => {
    const saved = localStorage.getItem('sw_bot_logs');
    return saved ? JSON.parse(saved) : INITIAL_BOT_LOGS;
  });

  const [preClearTasks, setPreClearTasks] = useState<PreClearTask[]>(() => {
    const saved = localStorage.getItem('sw_pre_clear');
    return saved ? JSON.parse(saved) : INITIAL_PRE_CLEAR_TASKS;
  });

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'calendar' | 'handover' | 'preclear' | 'bot'
  >('dashboard');

  // Modals
  const [isHandoverModalOpen, setIsHandoverModalOpen] = useState(false);
  const [isAlimtalkModalOpen, setIsAlimtalkModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('sw_members', JSON.stringify(allMembers));
  }, [allMembers]);

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

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
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
    showToast(`짝꿍 ${currentBuddy?.name || '담당'} 주무관님께 3줄 인수인계가 전송되었습니다.`);
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
    showToast('인수인계 건 대리 처리가 완료되었습니다.');
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
    showToast('휴무일 맞교환 일정이 캘린더에 즉시 반영되었습니다.');
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

  // Reset to initial demo data
  const handleResetData = () => {
    localStorage.removeItem('sw_members');
    localStorage.removeItem('sw_handovers');
    localStorage.removeItem('sw_bot_logs');
    localStorage.removeItem('sw_pre_clear');
    setAllMembers(INITIAL_MEMBERS);
    setHandovers(INITIAL_HANDOVERS);
    setBotLogs(INITIAL_BOT_LOGS);
    setPreClearTasks(INITIAL_PRE_CLEAR_TASKS);
    setCurrentUserId('m1');
    setCurrentDay('월');
    showToast('데모 데이터가 초기 설정값으로 복원되었습니다.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center space-x-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <Header
        currentDay={currentDay}
        onSelectDay={setCurrentDay}
        currentUser={currentUser}
        allMembers={allMembers}
        onSelectUser={(user) => setCurrentUserId(user.id)}
        onOpenHandoverModal={() => setIsHandoverModalOpen(true)}
        onOpenBotModal={() => setActiveTab('bot')}
        onOpenAlimtalkModal={() => setIsAlimtalkModalOpen(true)}
        onResetData={handleResetData}
        activeTab={activeTab}
        onChangeTab={setActiveTab}
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
            onSelectUser={(u) => setCurrentUserId(u.id)}
          />
        )}

        {activeTab === 'calendar' && (
          <CalendarView
            currentDay={currentDay}
            allMembers={allMembers}
            currentUser={currentUser}
            onSelectDay={setCurrentDay}
            onSelectUser={(u) => setCurrentUserId(u.id)}
            onSwapRequest={handleSwapRequest}
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

      {/* Footer Info */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-700">
              주4일제 스마트 워크 플랫폼 (업무 공백 제로)
            </span>
            <span>·</span>
            <span>월·금 분산 휴무 & 1:1 짝꿍 행정 보조 툴</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px]">
            <span>✓ 민원 지연 0%</span>
            <span>✓ 담당자 부재 안내 0건</span>
            <span>✓ 월요일 업무폭탄 선제 방지</span>
          </div>
        </div>
      </footer>

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
    </div>
  );
}
