import React, { useState } from 'react';
import {
  X,
  LogIn,
  LogOut,
  ShieldCheck,
  UserCheck,
  Building,
  KeyRound,
  Sparkles,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { TeamMember } from '../types';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: TeamMember;
  allMembers: TeamMember[];
  isLoggedIn: boolean;
  onLogin: (user: TeamMember) => void;
  onLogout: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  allMembers,
  isLoggedIn,
  onLogin,
  onLogout,
}) => {
  const [selectedUserId, setSelectedUserId] = useState(currentUser.id);
  const [empCode, setEmpCode] = useState('GW-2026-' + currentUser.extension);
  const [password, setPassword] = useState('••••••••');

  if (!isOpen) return null;

  const handleSelectMember = (member: TeamMember) => {
    setSelectedUserId(member.id);
    setEmpCode('GW-2026-' + member.extension);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = allMembers.find((m) => m.id === selectedUserId) || allMembers[0];
    onLogin(user);
    onClose();
  };

  const handleDoLogout = () => {
    onLogout();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <KeyRound className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold">
                  {isLoggedIn ? '행정망 인증 계정 관리' : '행정망 직원 간편 로그인'}
                </h3>
                <span className="text-[10px] bg-amber-400 text-slate-900 font-bold px-1.5 py-0.5 rounded-sm">
                  SSO 연동
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                주4일제 스마트워크 업무공백제로 협업 포털
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-white/15 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {isLoggedIn ? (
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start space-x-3.5">
                <div
                  className={`w-12 h-12 rounded-xl text-white font-bold text-lg flex items-center justify-center shrink-0 shadow-xs ${currentUser.avatarColor}`}
                >
                  {currentUser.name[0]}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-md">
                      현재 접속 중 (직원 모드)
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      사번: GW-2026-{currentUser.extension}
                    </span>
                  </div>
                  <h4 className="text-base font-bold text-slate-900 mt-1">
                    {currentUser.name} {currentUser.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    {currentUser.department} · 내선 {currentUser.extension}
                  </p>
                  <div className="text-[11px] text-emerald-700 font-semibold mt-1.5 flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    <span>
                      {currentUser.offDay ? `${currentUser.offDay}요일 휴무조 (주4일제)` : '상시근무 (총괄)'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security info */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600 space-y-1">
                <div className="font-semibold text-slate-700 flex items-center space-x-1">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  <span>행정 업무망 보안 상태: 안전 (GPKI 인증 완료)</span>
                </div>
                <div className="text-[11px] text-slate-500">
                  • 짝꿍 인수인계 전결 권한: <strong>승인됨</strong><br />
                  • 자동 부재 ARS 및 알림톡 연동: <strong>활성화</strong>
                </div>
              </div>

              {/* Switch User or Logout */}
              <div className="space-y-2 pt-2">
                <label className="block text-xs font-bold text-slate-700">
                  다른 직원 계정으로 바로 전환:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {allMembers.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => handleSelectMember(m)}
                      className={`p-2 rounded-lg border text-left text-xs transition-colors flex items-center space-x-2 ${
                        selectedUserId === m.id
                          ? 'border-blue-500 bg-blue-50/70 text-blue-900 font-bold'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full text-white font-bold text-[10px] flex items-center justify-center ${m.avatarColor}`}
                      >
                        {m.name[0]}
                      </div>
                      <span className="truncate">
                        {m.name} ({m.offDay || '상시'})
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={handleDoLogout}
                  className="px-4 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>게스트로 전환(로그아웃)</span>
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                >
                  선택한 계정으로 유지
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    로그인할 직원 선택 (원클릭 SSO)
                  </label>
                  <select
                    value={selectedUserId}
                    onChange={(e) => {
                      const m = allMembers.find((item) => item.id === e.target.value);
                      if (m) handleSelectMember(m);
                    }}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-blue-500"
                  >
                    {allMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} {m.title} ({m.department}) - {m.offDay ? `${m.offDay}요 휴무` : '상시'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    행정망 사번 / 아이디
                  </label>
                  <input
                    type="text"
                    value={empCode}
                    onChange={(e) => setEmpCode(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    비밀번호 (보안 OTP)
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono text-slate-800"
                  />
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-[11px] text-amber-900 flex items-start space-x-2">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  사내 공무원증(GPKI) 또는 모바일 공무원증과 연동되어 1초 만에 자동 로그인됩니다.
                </span>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-blue-500/20"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>행정망 로그인</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
