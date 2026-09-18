import React, { useState } from 'react';
import {
  Send,
  CheckCircle2,
  Clock,
  UserCheck,
  AlertCircle,
  FileText,
  MessageSquare,
  Sparkles,
  Search,
  CheckSquare,
  Square,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import { TeamMember, HandoverItem } from '../types';

interface HandoverSectionProps {
  currentUser: TeamMember;
  allMembers: TeamMember[];
  handovers: HandoverItem[];
  onOpenCreateModal: () => void;
  onToggleChecklistItem: (handoverId: string, checkId: string) => void;
  onUpdateProxyMemo: (handoverId: string, memo: string) => void;
  onResolveHandover: (handoverId: string) => void;
}

export const HandoverSection: React.FC<HandoverSectionProps> = ({
  currentUser,
  allMembers,
  handovers,
  onOpenCreateModal,
  onToggleChecklistItem,
  onUpdateProxyMemo,
  onResolveHandover,
}) => {
  const [tab, setTab] = useState<'RECEIVED' | 'SENT' | 'ALL'>('RECEIVED');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMemoId, setEditingMemoId] = useState<string | null>(null);
  const [memoInput, setMemoInput] = useState('');

  const userBuddy = allMembers.find((m) => m.id === currentUser.buddyId);

  const filteredHandovers = handovers.filter((h) => {
    if (tab === 'RECEIVED' && h.receiverId !== currentUser.id) return false;
    if (tab === 'SENT' && h.senderId !== currentUser.id) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = h.title.toLowerCase().includes(q);
      const matchCitizen = h.citizenName?.toLowerCase().includes(q) ?? false;
      const matchLines = h.summary3Lines.some((l) => l.toLowerCase().includes(q));
      return matchTitle || matchCitizen || matchLines;
    }
    return true;
  });

  const handleStartEditingMemo = (id: string, currentMemo?: string) => {
    setEditingMemoId(id);
    setMemoInput(currentMemo || '');
  };

  const handleSaveMemo = (id: string) => {
    onUpdateProxyMemo(id, memoInput.trim());
    setEditingMemoId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: 1:1 Buddy Handover Concept */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                <Send className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-black text-slate-900">
                1:1 짝꿍(Buddy) 인수인계 시스템
              </h2>
              <span className="text-xs bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full">
                퇴근 전 3초 체크리스트
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              "담당자가 안 계셔서 모릅니다"라는 말을 100% 근절합니다. 휴무 전날 퇴근 버튼 누르기 전 3줄 요약만 남기면 짝꿍이 완벽 대응합니다.
            </p>
          </div>

          <button
            onClick={onOpenCreateModal}
            className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-xs transition-all self-start md:self-center"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>퇴근 전 3초 인수인계 작성</span>
          </button>
        </div>

        {/* Current User & Buddy Pair Badge */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-3">
            <span className="text-slate-500 font-medium">현재 로그인 계정:</span>
            <span className="font-bold text-slate-900">
              {currentUser.name} {currentUser.title} ({currentUser.offDay}요 휴무)
            </span>
            <span className="text-slate-400">⟷</span>
            <span className="text-slate-500 font-medium">지정 짝꿍:</span>
            {userBuddy ? (
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                {userBuddy.name} {userBuddy.title} (내선 {userBuddy.extension})
              </span>
            ) : (
              <span className="text-slate-400">지정된 짝꿍 없음</span>
            )}
          </div>

          <div className="text-[11px] text-slate-500 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>퇴근 버튼 누르면 사내 메신저·알림톡으로 짝꿍에게 즉시 자동 통보</span>
          </div>
        </div>
      </div>

      {/* Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
          <button
            onClick={() => setTab('RECEIVED')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
              tab === 'RECEIVED'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>짝꿍에게 온 인수인계 (수신)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800">
              {handovers.filter((h) => h.receiverId === currentUser.id).length}
            </span>
          </button>

          <button
            onClick={() => setTab('SENT')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
              tab === 'SENT'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>내가 보낸 인수인계 (발신)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800">
              {handovers.filter((h) => h.senderId === currentUser.id).length}
            </span>
          </button>

          <button
            onClick={() => setTab('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-1.5 ${
              tab === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span>전체 부서 현황</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 text-slate-800">
              {handovers.length}
            </span>
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="민원명, 민원인, 내용 검색..."
            className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Handover Cards List */}
      <div className="space-y-4">
        {filteredHandovers.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="font-semibold text-slate-700">해당 조건의 인수인계 내역이 없습니다.</p>
            <p className="text-slate-400 mt-1">
              "퇴근 전 3초 인수인계 작성" 버튼을 눌러 새 인수인계를 남겨보세요.
            </p>
          </div>
        ) : (
          filteredHandovers.map((item) => {
            const sender = allMembers.find((m) => m.id === item.senderId);
            const receiver = allMembers.find((m) => m.id === item.receiverId);
            const completedCount = item.checklist.filter((c) => c.completed).length;
            const totalChecklist = item.checklist.length;
            const isAllCompleted = totalChecklist > 0 && completedCount === totalChecklist;
            const isResolved = item.status === 'resolved';

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border shadow-2xs transition-all overflow-hidden ${
                  isResolved
                    ? 'border-emerald-200 bg-emerald-50/20'
                    : item.urgency === 'critical'
                    ? 'border-rose-300 ring-1 ring-rose-200'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                {/* Card Top Header */}
                <div className="p-4 sm:p-5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          item.urgency === 'critical'
                            ? 'bg-rose-100 text-rose-800'
                            : item.urgency === 'urgent'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.urgency === 'critical'
                          ? '즉시대응'
                          : item.urgency === 'urgent'
                          ? '긴급 처리'
                          : '일반 민원'}
                      </span>

                      {item.caseNumber && (
                        <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                          {item.caseNumber}
                        </span>
                      )}

                      <h3 className="text-sm font-bold text-slate-900">
                        {item.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 text-xs text-slate-500">
                      <span>
                        발신: <strong className="text-slate-800">{sender?.name} {sender?.title}</strong> ({sender?.department})
                      </span>
                      <span>➔</span>
                      <span>
                        수신(짝꿍): <strong className="text-blue-700">{receiver?.name} {receiver?.title}</strong> (내선 {receiver?.extension})
                      </span>
                      {item.citizenName && (
                        <>
                          <span>·</span>
                          <span className="flex items-center text-slate-700 font-medium">
                            <Phone className="w-3 h-3 mr-1 text-slate-400" />
                            {item.citizenName} ({item.citizenPhone || '연락처 미등록'})
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-center shrink-0">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {item.createdAt}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                        isResolved
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.status === 'checked'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {isResolved
                        ? '대리 처리 완료'
                        : item.status === 'checked'
                        ? '짝꿍 확인 중'
                        : '전달 완료'}
                    </span>
                  </div>
                </div>

                {/* Card Content: 3-line summary & checklist */}
                <div className="p-4 sm:p-5 space-y-4">
                  {/* The 3-Line Summary Box */}
                  <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5">
                    <div className="flex items-center space-x-1.5 mb-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                        "오늘 처리한 민원 중 이것만 봐주세요" (핵심 3줄 요약)
                      </h4>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-800 font-medium">
                      {item.summary3Lines.map((line, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <span className="w-4 h-4 rounded-full bg-amber-200 text-amber-900 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span className="leading-relaxed">{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Checklist & Progress */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                        <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
                        <span>짝꿍 대리 처리 체크리스트</span>
                      </h5>
                      <span className="text-[11px] font-semibold text-slate-500">
                        {completedCount} / {totalChecklist} 완료 ({totalChecklist > 0 ? Math.round((completedCount / totalChecklist) * 100) : 0}%)
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      {item.checklist.map((chk) => (
                        <div
                          key={chk.id}
                          onClick={() => onToggleChecklistItem(item.id, chk.id)}
                          className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-colors text-xs ${
                            chk.completed
                              ? 'bg-slate-50 border-slate-200 text-slate-400 line-through'
                              : 'bg-white border-slate-200 text-slate-800 hover:bg-blue-50/50'
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            {chk.completed ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            ) : (
                              <Square className="w-4 h-4 text-slate-400 shrink-0" />
                            )}
                            <span className="font-medium">{chk.text}</span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {chk.completed ? '완료' : '클릭하여 완료'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Buddy Proxy Memo Box */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                        <span>짝꿍 대리 처리 결과 메모</span>
                      </div>
                      {editingMemoId !== item.id && (
                        <button
                          onClick={() => handleStartEditingMemo(item.id, item.proxyMemo)}
                          className="text-[11px] font-bold text-blue-600 hover:underline"
                        >
                          {item.proxyMemo ? '수정' : '+ 메모 작성'}
                        </button>
                      )}
                    </div>

                    {editingMemoId === item.id ? (
                      <div className="space-y-2 mt-2">
                        <textarea
                          rows={2}
                          value={memoInput}
                          onChange={(e) => setMemoInput(e.target.value)}
                          placeholder="예: 10:20 세움터 확인 후 민원인께 소방필증 접수 완료 문자 발송했습니다."
                          className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 text-slate-900"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => setEditingMemoId(null)}
                            className="px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-200 rounded-md"
                          >
                            취소
                          </button>
                          <button
                            onClick={() => handleSaveMemo(item.id)}
                            className="px-3 py-1 text-xs font-bold bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          >
                            저장
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-600 italic">
                        {item.proxyMemo || '아직 남겨진 대리 처리 메모가 없습니다. 짝꿍이 업무를 확인한 후 메모를 남깁니다.'}
                      </p>
                    )}
                  </div>
                </div>

                {/* Footer Action */}
                {!isResolved && (
                  <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">
                      체크리스트를 모두 완료하면 '대리 처리 완료'로 마감할 수 있습니다.
                    </span>

                    <button
                      onClick={() => onResolveHandover(item.id)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-2xs transition-colors"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>대리 처리 완료로 마감</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
