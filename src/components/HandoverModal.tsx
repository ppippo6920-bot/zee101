import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Sparkles, AlertCircle, CheckCircle2, UserCheck, Shield } from 'lucide-react';
import { TeamMember, HandoverItem } from '../types';

interface HandoverModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: TeamMember;
  buddy: TeamMember | undefined;
  onSendHandover: (handover: Omit<HandoverItem, 'id' | 'createdAt' | 'status'>) => void;
}

export const HandoverModal: React.FC<HandoverModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  buddy,
  onSendHandover,
}) => {
  const [title, setTitle] = useState('');
  const [citizenName, setCitizenName] = useState('');
  const [citizenPhone, setCitizenPhone] = useState('');
  const [caseNumber, setCaseNumber] = useState('');
  const [urgency, setUrgency] = useState<'normal' | 'urgent' | 'critical'>('urgent');
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [line3, setLine3] = useState('');
  const [check1, setCheck1] = useState('');
  const [check2, setCheck2] = useState('');
  const [check3, setCheck3] = useState('');

  // Presets for quick 3-second handover demo
  const applyPreset = (presetType: 'construction' | 'welfare' | 'traffic') => {
    if (presetType === 'construction') {
      setTitle('푸른마을 상가 2층 용도변경 소방필증 확인 요청');
      setCitizenName('정대현 건축사');
      setCitizenPhone('010-9942-8811');
      setCaseNumber('2026-건축-1029');
      setUrgency('urgent');
      setLine1('세움터에 보완 소방 완비증명서 오전 10시 등록 예정');
      setLine2('서류 확인 후 결재 상신 및 허가증 교부 처리 부탁드립니다');
      setLine3('추가 문의 올 경우 내선 번호로 안내해 두었습니다');
      setCheck1('세움터 첨부파일(소방필증) 정상 수신 확인');
      setCheck2('건축법 제19조 적합여부 최종 전결 처리');
      setCheck3('민원인께 인허가 완료 알림톡 자동 발송');
    } else if (presetType === 'welfare') {
      setTitle('행복아파트 독거어르신 난방비 긴급지원 신청 건');
      setCitizenName('김순자 어르신');
      setCitizenPhone('010-3341-9920');
      setCaseNumber('2026-복지-0581');
      setUrgency('critical');
      setLine1('행복e음 전산시스템 소득인정액 산정표 출력 완료');
      setLine2('월요일 복지과장님 구두 결재 득한 후 지급 계좌 등록 필요');
      setLine3('보호자분 오전에 전화 시 심의 통과 예정이라고 안심 안내');
      setCheck1('지급 계좌 유효성 사전 검증');
      setCheck2('팀장/과장님 전결 결재선 등록');
      setCheck3('보호자에게 처리 예정 안내 통화 1회');
    } else {
      setTitle('도산대로 횡단보도 조명탑 고장 긴급 보수 요청');
      setCitizenName('시민 박준영');
      setCitizenPhone('010-5521-1200');
      setCaseNumber('2026-교통-1422');
      setUrgency('normal');
      setLine1('야간 점멸 신호기 고장 민원 현장 접수 완료');
      setLine2('도로유지보수업체에 긴급 점검 요청 공문 발송 대기');
      setLine3('오후 2시 전 현장 수리 확인 보고서 수령 필요');
      setCheck1('보수업체 현장 출동 여부 유선 확인');
      setCheck2('도로 점용 작업 신고서 접수');
      setCheck3('수리 완료 사진 대장에 첨부');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !buddy) return;

    const checklistItems = [
      check1.trim() ? { id: `c-${Date.now()}-1`, text: check1.trim(), completed: false } : null,
      check2.trim() ? { id: `c-${Date.now()}-2`, text: check2.trim(), completed: false } : null,
      check3.trim() ? { id: `c-${Date.now()}-3`, text: check3.trim(), completed: false } : null,
    ].filter(Boolean) as { id: string; text: string; completed: boolean }[];

    onSendHandover({
      senderId: currentUser.id,
      receiverId: buddy.id,
      title: title.trim(),
      citizenName: citizenName.trim() || undefined,
      citizenPhone: citizenPhone.trim() || undefined,
      caseNumber: caseNumber.trim() || undefined,
      urgency,
      summary3Lines: [
        line1.trim() || '담당자 휴무 중 긴급 처리 필요 사항',
        line2.trim() || '특이사항 발생 시 짝꿍 전결 권한 활용 요망',
        line3.trim() || '민원인에게 신속 친절 안내 부탁드립니다',
      ],
      checklist: checklistItems.length > 0 ? checklistItems : [
        { id: `c-${Date.now()}-1`, text: '민원 서류 상태 최종 점검', completed: false },
        { id: `c-${Date.now()}-2`, text: '민원인 전화 또는 문자 회신', completed: false },
      ],
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div id="handover-modal-backdrop" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
        <motion.div
          id="handover-modal-card"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden my-6"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white px-6 py-5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-bold">퇴근 전 3초 인수인계 창</h3>
                  <span className="text-xs bg-amber-400 text-slate-900 font-semibold px-2 py-0.5 rounded-full">
                    업무 공백 제로
                  </span>
                </div>
                <p className="text-xs text-blue-100 mt-0.5">
                  휴무 전날 3줄 요약 체크리스트를 남기면 내 1:1 짝꿍에게 즉시 자동 전달됩니다.
                </p>
              </div>
            </div>
            <button
              id="close-handover-modal-btn"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/15 transition-colors text-white/80 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
            {/* Buddy Matching Banner */}
            <div className="bg-blue-50 border border-blue-200/70 rounded-xl p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  {currentUser.name[0]}
                </div>
                <div>
                  <div className="text-xs text-slate-500 font-medium">인수인계 작성자 (나)</div>
                  <div className="text-sm font-semibold text-slate-900">
                    {currentUser.name} {currentUser.title} ({currentUser.offDay}요일 휴무조)
                  </div>
                </div>
              </div>

              <div className="flex items-center text-blue-400 font-bold px-2">
                ➔
              </div>

              <div className="flex items-center space-x-3 text-right">
                <div>
                  <div className="text-xs text-slate-500 font-medium">받는 1:1 짝꿍 (대체 담당)</div>
                  <div className="text-sm font-semibold text-blue-700">
                    {buddy ? `${buddy.name} ${buddy.title}` : '지정된 짝꿍 없음'}
                  </div>
                </div>
                {buddy && (
                  <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                    {buddy.name[0]}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Demo Preset Buttons */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider flex items-center">
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                  실무 프리셋으로 1초 자동완성:
                </label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  id="preset-construction-btn"
                  onClick={() => applyPreset('construction')}
                  className="px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg text-slate-700 transition-colors text-left"
                >
                  🏢 [건축] 용도변경 보완
                </button>
                <button
                  type="button"
                  id="preset-welfare-btn"
                  onClick={() => applyPreset('welfare')}
                  className="px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg text-slate-700 transition-colors text-left"
                >
                  🤝 [복지] 긴급생계비 심의
                </button>
                <button
                  type="button"
                  id="preset-traffic-btn"
                  onClick={() => applyPreset('traffic')}
                  className="px-3 py-2 text-xs font-medium bg-slate-100 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg text-slate-700 transition-colors text-left"
                >
                  🚦 [교통] 신호기 긴급보수
                </button>
              </div>
            </div>

            {/* Task Title & Urgency */}
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  미결 민원 / 업무 제목 <span className="text-rose-500">*</span>
                </label>
                <input
                  id="handover-title-input"
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="예: 성원빌딩 3층 근린생활시설 용도변경 보완서류 확인"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">민원인 성함</label>
                  <input
                    id="handover-citizen-name-input"
                    type="text"
                    value={citizenName}
                    onChange={(e) => setCitizenName(e.target.value)}
                    placeholder="최성원 민원인"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">연락처</label>
                  <input
                    id="handover-citizen-phone-input"
                    type="text"
                    value={citizenPhone}
                    onChange={(e) => setCitizenPhone(e.target.value)}
                    placeholder="010-0000-0000"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">접수/관리번호</label>
                  <input
                    id="handover-case-num-input"
                    type="text"
                    value={caseNumber}
                    onChange={(e) => setCaseNumber(e.target.value)}
                    placeholder="2026-건축-0842"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">대응 긴급도</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setUrgency('normal')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center space-x-1.5 transition-all ${
                      urgency === 'normal'
                        ? 'bg-slate-100 border-slate-400 text-slate-800'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <span>일반 민원 (당일 내)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('urgent')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center space-x-1.5 transition-all ${
                      urgency === 'urgent'
                        ? 'bg-amber-50 border-amber-400 text-amber-800 ring-1 ring-amber-300'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>긴급 (오전 확인)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setUrgency('critical')}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border flex items-center justify-center space-x-1.5 transition-all ${
                      urgency === 'critical'
                        ? 'bg-rose-50 border-rose-400 text-rose-800 ring-1 ring-rose-300'
                        : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                    <span>즉시 대응 (출근 즉시)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Core 3-line summary: "오늘 처리한 민원 중 이것만 봐주세요" */}
            <div className="bg-amber-50/70 border border-amber-200/90 rounded-xl p-4">
              <div className="flex items-center space-x-1.5 mb-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                  ⭐ "오늘 처리한 민원 중 이것만 봐주세요" 3줄 요약
                </h4>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <input
                    id="handover-line1-input"
                    type="text"
                    required
                    value={line1}
                    onChange={(e) => setLine1(e.target.value)}
                    placeholder="1줄: 진행 현황 (예: 세움터에서 소방필증 오전 10시 등록 여부 확인 필요)"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <input
                    id="handover-line2-input"
                    type="text"
                    required
                    value={line2}
                    onChange={(e) => setLine2(e.target.value)}
                    placeholder="2줄: 짝꿍 조치 사항 (예: 서류 이상 없으면 필증 승인 및 통보)"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <input
                    id="handover-line3-input"
                    type="text"
                    required
                    value={line3}
                    onChange={(e) => setLine3(e.target.value)}
                    placeholder="3줄: 민원인 응대 포인트 (예: 내선 2842로 연결되어 친절 안내 요청)"
                    className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">
                짝꿍 실행 체크리스트 (확인용)
              </label>
              <div className="space-y-1.5">
                <input
                  id="handover-check1-input"
                  type="text"
                  value={check1}
                  onChange={(e) => setCheck1(e.target.value)}
                  placeholder="체크항목 1: 세움터 첨부파일(소방필증) 정상 수신 확인"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <input
                  id="handover-check2-input"
                  type="text"
                  value={check2}
                  onChange={(e) => setCheck2(e.target.value)}
                  placeholder="체크항목 2: 건축사 협의 완료 체크"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <input
                  id="handover-check3-input"
                  type="text"
                  value={check3}
                  onChange={(e) => setCheck3(e.target.value)}
                  placeholder="체크항목 3: 민원인께 처리결과 SMS 발송"
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            {/* Footer buttons */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center text-xs text-slate-500 space-x-1.5">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>퇴근 버튼 연동: 전송 완료 시 자동 부재 모드로 전환</span>
              </div>

              <div className="flex space-x-2">
                <button
                  type="button"
                  id="cancel-handover-btn"
                  onClick={onClose}
                  className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  id="submit-handover-btn"
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow-md shadow-blue-500/20 transition-all hover:shadow-lg"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>짝꿍에게 즉시 전송 (퇴근 완료)</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
