import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  Zap,
  TrendingDown,
  Calendar,
  AlertCircle,
  FileCheck,
  CheckSquare,
  Square,
  User,
} from 'lucide-react';
import { PreClearTask, TeamMember } from '../types';

interface PreClearSectionProps {
  currentUser: TeamMember;
  allMembers: TeamMember[];
  tasks: PreClearTask[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (task: Omit<PreClearTask, 'id' | 'completed'>) => void;
}

export const PreClearSection: React.FC<PreClearSectionProps> = ({
  currentUser,
  allMembers,
  tasks,
  onToggleTask,
  onAddTask,
}) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<PreClearTask['category']>('민원사전검토');
  const [newEstimatedTime, setNewEstimatedTime] = useState('15분 소요');
  const [newBenefit, setNewBenefit] = useState('');
  const [newAssigneeId, setNewAssigneeId] = useState(currentUser.id);
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | PreClearTask['category']>('ALL');

  const completedCount = tasks.filter((t) => t.completed).length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  // Filter tasks
  const filteredTasks = tasks.filter((t) => {
    if (selectedFilter === 'ALL') return true;
    return t.category === selectedFilter;
  });

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      title: newTitle.trim(),
      category: newCategory,
      targetDate: '차주 월요일 (09:00)',
      assigneeId: newAssigneeId,
      estimatedTime: newEstimatedTime || '10분 소요',
      benefit: newBenefit.trim() || '월요일 출근 즉시 지연 없이 업무 착수 가능',
    });

    setNewTitle('');
    setNewBenefit('');
    setIsAddOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Concept */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                <Zap className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-black text-slate-900">
                월요일 업무 폭탄 방지 '미리 챙김' 시스템 (PRD 2.④)
              </h2>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                주말 민원 제로 버퍼
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              월요일 출근 직원들이 주말 동안 쌓인 민원 폭탄을 맞지 않도록, 금요일 오후에 사전 예약 업무 및 서류를 선제적으로 리스트업하고 정리합니다.
            </p>
          </div>

          <button
            onClick={() => setIsAddOpen(!isAddOpen)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-xs transition-all self-start md:self-center"
          >
            <Plus className="w-4 h-4" />
            <span>새 미리챙김 항목 등록</span>
          </button>
        </div>

        {/* Progress & Impact Meter */}
        <div className="mt-5 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-blue-700" />
              <span className="text-xs font-bold text-slate-900">
                금요일 오후 사전 정리 달성률: <strong className="text-blue-700 text-sm">{progressPercent}%</strong>
              </span>
              <span className="text-xs text-slate-500">
                ({completedCount} / {tasks.length}건 선제 처리 완료)
              </span>
            </div>

            <div className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-0.5 rounded-md self-start sm:self-center">
              월요일 아침 출근 업무 부하 약 45% 경감 예상!
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-3 bg-blue-200/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Add Task Form (Collapsible) */}
      {isAddOpen && (
        <form
          onSubmit={handleCreateTask}
          className="bg-white rounded-2xl border border-blue-300 p-5 shadow-sm space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>차주 월요일 대비 선제 업무 등록</span>
            </h3>
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-700"
            >
              닫기
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                사전 처리할 안건명 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="예: 월요일 오전 심의 안건 도면 사전 다운로드 및 세움터 접수 확인"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">업무 분류</label>
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value as any)}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="민원사전검토">민원사전검토</option>
                <option value="단순서류정리">단순서류정리</option>
                <option value="예약업무세팅">예약업무세팅</option>
                <option value="정례보고사전결재">정례보고사전결재</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">담당 주무관</label>
              <select
                value={newAssigneeId}
                onChange={(e) => setNewAssigneeId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
              >
                {allMembers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.title} ({m.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">소요 시간</label>
              <input
                type="text"
                value={newEstimatedTime}
                onChange={(e) => setNewEstimatedTime(e.target.value)}
                placeholder="예: 10분 소요"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">월요일 단축 효과</label>
              <input
                type="text"
                value={newBenefit}
                onChange={(e) => setNewBenefit(e.target.value)}
                placeholder="예: 월요일 9시 창구 대기 30분 단축"
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-600"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-xs"
            >
              목록에 추가
            </button>
          </div>
        </form>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setSelectedFilter('ALL')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
            selectedFilter === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          전체 ({tasks.length})
        </button>

        <button
          onClick={() => setSelectedFilter('민원사전검토')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
            selectedFilter === '민원사전검토'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          🔍 민원 사전 검토
        </button>

        <button
          onClick={() => setSelectedFilter('단순서류정리')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
            selectedFilter === '단순서류정리'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          📁 단순 서류 정리
        </button>

        <button
          onClick={() => setSelectedFilter('예약업무세팅')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
            selectedFilter === '예약업무세팅'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          ⏰ 예약 업무 세팅
        </button>

        <button
          onClick={() => setSelectedFilter('정례보고사전결재')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-colors whitespace-nowrap ${
            selectedFilter === '정례보고사전결재'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
        >
          🖋️ 정례 보고/결재
        </button>
      </div>

      {/* Task List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTasks.map((task) => {
          const assignee = allMembers.find((m) => m.id === task.assigneeId);

          return (
            <div
              key={task.id}
              onClick={() => onToggleTask(task.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-2xs flex flex-col justify-between ${
                task.completed
                  ? 'bg-emerald-50/30 border-emerald-200 hover:border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-blue-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                      task.category === '민원사전검토'
                        ? 'bg-blue-100 text-blue-800'
                        : task.category === '단순서류정리'
                        ? 'bg-amber-100 text-amber-800'
                        : task.category === '예약업무세팅'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-teal-100 text-teal-800'
                    }`}
                  >
                    {task.category}
                  </span>

                  <div className="flex items-center space-x-1.5">
                    {task.completed ? (
                      <span className="flex items-center text-xs font-bold text-emerald-700">
                        <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
                        사전 완료됨
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-semibold text-slate-400">
                        <Square className="w-4 h-4 mr-1" />
                        미완료
                      </span>
                    )}
                  </div>
                </div>

                <h4
                  className={`text-xs font-bold text-slate-900 leading-snug ${
                    task.completed ? 'line-through text-slate-500' : ''
                  }`}
                >
                  {task.title}
                </h4>

                <div className="mt-2.5 text-[11px] text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200/60 flex items-center space-x-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span>{task.benefit}</span>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    담당: <strong className="text-slate-800">{assignee?.name} {assignee?.title}</strong>
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{task.estimatedTime}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
