import React, { useState } from 'react';
import {
  X,
  Smartphone,
  MessageSquare,
  Bell,
  CheckCircle2,
  Share2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import { TeamMember, HandoverItem } from '../types';

interface AlimtalkPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: TeamMember;
  buddy: TeamMember | undefined;
  latestHandover?: HandoverItem;
}

export const AlimtalkPreviewModal: React.FC<AlimtalkPreviewModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  buddy,
  latestHandover,
}) => {
  const [viewType, setViewType] = useState<'BUDDY_HANDOVER' | 'CITIZEN_NOTICE' | 'FRIDAY_REMINDER'>('BUDDY_HANDOVER');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Top */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Smartphone className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-xs font-bold">모바일 연동 미리보기 (PRD 3)</h3>
              <p className="text-[10px] text-slate-400">카카오 알림톡 / 사내 모바일 앱 연동</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher Tabs */}
        <div className="grid grid-cols-3 bg-slate-100 p-1 text-[11px] font-bold border-b border-slate-200">
          <button
            onClick={() => setViewType('BUDDY_HANDOVER')}
            className={`py-1.5 rounded-lg transition-colors ${
              viewType === 'BUDDY_HANDOVER'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            짝꿍 인수인계
          </button>
          <button
            onClick={() => setViewType('CITIZEN_NOTICE')}
            className={`py-1.5 rounded-lg transition-colors ${
              viewType === 'CITIZEN_NOTICE'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            민원인 안내
          </button>
          <button
            onClick={() => setViewType('FRIDAY_REMINDER')}
            className={`py-1.5 rounded-lg transition-colors ${
              viewType === 'FRIDAY_REMINDER'
                ? 'bg-white text-blue-700 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            금요 미리챙김
          </button>
        </div>

        {/* Smartphone Screen Mockup Body */}
        <div className="bg-[#B2C7DA] p-4 flex-1 overflow-y-auto space-y-3">
          {/* Header Date Stamp */}
          <div className="text-center">
            <span className="text-[10px] bg-black/20 text-white px-2 py-0.5 rounded-full font-medium">
              2026년 9월 18일 금요일
            </span>
          </div>

          {/* 1. 짝꿍 인수인계 도착 알림톡 */}
          {viewType === 'BUDDY_HANDOVER' && (
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center shrink-0">
                  알
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-800">
                    스마트워크 알림톡
                  </div>

                  {/* Card Bubble */}
                  <div className="bg-white rounded-2xl p-3.5 shadow-sm space-y-2.5 max-w-[280px] border border-black/5 mt-1">
                    <div className="border-b border-slate-100 pb-2">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">
                        [1:1 짝꿍 인수인계 도착]
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                        {latestHandover?.title || '성원빌딩 용도변경 보완서류 확인'}
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      <strong>{currentUser.name} 주무관</strong>님의 휴무 전 3초 인수인계가 짝꿍 <strong>{buddy?.name || '박민우'} 주무관</strong>님께 전달되었습니다.
                    </p>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[10px] space-y-1 text-slate-700">
                      <div className="font-bold text-slate-800">📋 "이것만 봐주세요" 3줄 요약:</div>
                      {latestHandover ? (
                        latestHandover.summary3Lines.map((l, i) => (
                          <div key={i} className="line-clamp-1">
                            {i + 1}. {l}
                          </div>
                        ))
                      ) : (
                        <>
                          <div>1. 세움터 소방필증 오전 10시 확인</div>
                          <div>2. 서류 이상 없으면 결재 상신</div>
                          <div>3. 민원인 SMS 처리결과 통보</div>
                        </>
                      )}
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full py-2 bg-amber-300 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-xl transition-colors text-center block"
                    >
                      앱에서 체크리스트 확인하기 ➔
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. 민원인 부재 안내 알림톡 */}
          {viewType === 'CITIZEN_NOTICE' && (
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-900 font-black text-xs flex items-center justify-center shrink-0">
                  알
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-800">
                    스마트워크 민원안내
                  </div>

                  <div className="bg-white rounded-2xl p-3.5 shadow-sm space-y-2.5 max-w-[280px] border border-black/5 mt-1">
                    <div className="border-b border-slate-100 pb-2">
                      <span className="text-[10px] font-bold text-emerald-600">
                        [담당자 부재 및 대체 안내]
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                        주4일제 스마트워크 대체안내
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      귀하께서 문의하신 <strong>{currentUser.name} 주무관</strong>은 주4일제 분산 휴무일입니다.
                    </p>

                    <div className="bg-blue-50 p-2.5 rounded-lg border border-blue-200 text-[10px] space-y-1 text-slate-800">
                      <div>• 대체 담당자: <strong>{buddy?.name || '박민우'} 주무관</strong></div>
                      <div>• 대체 직통내선: <strong>{buddy?.extension || '2842'}</strong></div>
                      <div>• 권한 범위: <strong>100% 대리 전결 권한 보유</strong></div>
                    </div>

                    <p className="text-[10px] text-slate-500">
                      담당자가 부재중이어도 짝꿍 주무관이 동일한 권한으로 즉시 민원을 처리해 드립니다.
                    </p>

                    <button
                      onClick={onClose}
                      className="w-full py-2 bg-amber-300 hover:bg-amber-400 text-amber-950 font-bold text-xs rounded-xl transition-colors text-center block"
                    >
                      대체 담당자에게 연결 ➔
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. 금요 미리챙김 알림톡 */}
          {viewType === 'FRIDAY_REMINDER' && (
            <div className="space-y-2">
              <div className="flex items-start space-x-2">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                  앱
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-800">
                    스마트워크 푸시
                  </div>

                  <div className="bg-white rounded-2xl p-3.5 shadow-sm space-y-2.5 max-w-[280px] border border-black/5 mt-1">
                    <div className="border-b border-slate-100 pb-2">
                      <span className="text-[10px] font-bold text-indigo-600">
                        [금요일 16:00 미리 챙김]
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 mt-0.5">
                        월요일 업무 폭탄 사전 방지
                      </h4>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      퇴근 전 15분! 월요일에 출근하는 동료와 나를 위해 <strong>'미리 챙김 리스트'</strong>를 확인해 주세요.
                    </p>

                    <div className="bg-indigo-50 p-2 rounded-lg border border-indigo-200 text-[10px] space-y-1 text-indigo-900 font-medium">
                      <div>✓ 월요일 아침 심의 안건 서류 사전 출력</div>
                      <div>✓ 주말 무인기 예약 발급 사전 승인</div>
                    </div>

                    <button
                      onClick={onClose}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors text-center block"
                    >
                      미리 챙김 리스트 체크하기 ➔
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
          >
            확인 및 닫기
          </button>
        </div>
      </div>
    </div>
  );
};
