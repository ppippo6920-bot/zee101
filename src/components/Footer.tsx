import React from 'react';
import {
  ShieldCheck,
  Phone,
  Mail,
  Building2,
  Calendar,
  Users,
  Bot,
  FileCheck2,
  ArrowUp,
  Sparkles,
  ExternalLink,
  LogIn,
  LogOut,
  UserCheck,
} from 'lucide-react';
import { TeamMember } from '../types';

interface FooterProps {
  onNavigateTab: (tab: 'dashboard' | 'calendar' | 'handover' | 'preclear' | 'bot') => void;
  isLoggedIn: boolean;
  currentUser: TeamMember;
  onToggleAuth: () => void;
  onOpenLoginModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateTab,
  isLoggedIn,
  currentUser,
  onToggleAuth,
  onOpenLoginModal,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-16 text-xs">
      {/* Top Value Proposition Bar */}
      <div className="border-b border-slate-800 bg-slate-950/70 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/25 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-white text-sm">
                주4일제 스마트 워크 플랫폼
              </span>
              <span className="ml-2 text-[11px] text-blue-400 font-medium">
                업무 공백 제로 · 100% 무중단 대민 행정 보장 체계
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>월·금 분산 휴무 캘린더</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>1:1 짝꿍(Buddy) 3초 인수인계</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>자동 부재 이관 ARS 봇</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>월요일 업무폭탄 미리챙김</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Platform Overview */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-black text-xs shadow-xs">
                ZW
              </div>
              <h3 className="text-sm font-bold text-white tracking-tight">
                주4일제 스마트 행정 협업 포털
              </h3>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px] max-w-sm">
              주4일제 도입 시 우려되는 민원 지연, "담당자 부재"의 불편함, 월요일 업무 폭탄을
              상호 보완 짝꿍 제도와 인공지능 부재 안내 봇을 통해 완벽하게 해결합니다.
            </p>

            <div className="pt-2 flex items-center space-x-3">
              <button
                id="footer-auth-toggle-btn"
                onClick={onToggleAuth}
                className={`px-3.5 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center space-x-1.5 shadow-xs ${
                  isLoggedIn
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                    : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20'
                }`}
              >
                {isLoggedIn ? (
                  <>
                    <LogOut className="w-3.5 h-3.5 text-rose-400" />
                    <span>게스트 모드로 전환</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-3.5 h-3.5" />
                    <span>직원 계정으로 로그인</span>
                  </>
                )}
              </button>

              <button
                onClick={onOpenLoginModal}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
              >
                계정 관리
              </button>

              <button
                onClick={scrollToTop}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                title="맨 위로 이동"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Col 3: 핵심 기능 바로가기 */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              주요 기능 (PRD 1~3)
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li>
                <button
                  onClick={() => onNavigateTab('dashboard')}
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>• 오늘 현황판 & 짝꿍 대시보드</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('calendar')}
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>• 월·금 분산 휴무 캘린더 (조별 색상)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('handover')}
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>• 1:1 짝꿍 3줄 인수인계 시스템</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('bot')}
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>• 자동 부재 알림 & 민원 이관 ARS 봇</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigateTab('preclear')}
                  className="hover:text-white transition-colors flex items-center space-x-1"
                >
                  <span>• 월요일 업무폭탄 '미리 챙김'</span>
                </button>
              </li>
              <li>
                <span className="text-emerald-400 font-bold flex items-center space-x-1">
                  <span>• 월·금 휴무일 랜덤 추첨 게임 🎲</span>
                </span>
              </li>
            </ul>
          </div>

          {/* Col 4: 행정 지원 & 헬프데스크 */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              부서 지원 & 헬프데스크
            </h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>환경보전과 총괄: 내선 2840 (백민희 팀장)</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-blue-400" />
                <span>환경오염 민원 신고 콜센터: 128 / 02-2600-2841</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Mail className="w-3.5 h-3.5 text-blue-400" />
                <span>env.gangseo@gangseo.seoul.kr</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-400" />
                <span>구청 본관 3층 환경보전과 (대기·수질·생태팀)</span>
              </li>
            </ul>
          </div>

          {/* Col 5: 제도 운영 가이드 */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              주4일제 운영 원칙
            </h4>
            <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3 text-[11px] text-slate-300 space-y-1">
              <div className="font-semibold text-amber-300">
                100% 대리 전결권 보장
              </div>
              <p className="text-[10px] text-slate-400 leading-normal">
                짝꿍은 부재 직원의 일상 민원 및 서류 검토에 대한 정당한 전결 권한을 가지며, 책임 소재를 상호 공유합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Policy */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <div>
            © 2026 주4일제 스마트 워크 플랫폼 (업무 공백 제로). All rights reserved.
          </div>

          <div className="flex items-center space-x-4">
            <span className="hover:text-slate-400 cursor-pointer">개인정보처리방침</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">이용약관</span>
            <span>·</span>
            <span className="hover:text-slate-400 cursor-pointer">행정망 보안규정</span>
            <span>·</span>
            <span className="text-emerald-500 font-semibold flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse"></span>
              행정 시스템 정상 가동 중
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
