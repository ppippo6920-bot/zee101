import React, { useState, useEffect } from 'react';
import {
  Bot,
  PhoneCall,
  PhoneForwarded,
  MessageSquare,
  Sparkles,
  Play,
  Square,
  CheckCircle2,
  Volume2,
  VolumeX,
  Clock,
  Send,
  AlertCircle,
  Smartphone,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { TeamMember, BotCallLog } from '../types';

interface AutoBotSimulatorProps {
  currentUser: TeamMember;
  allMembers: TeamMember[];
  botLogs: BotCallLog[];
  onAddBotLog: (log: Omit<BotCallLog, 'id' | 'timestamp'>) => void;
}

export const AutoBotSimulator: React.FC<AutoBotSimulatorProps> = ({
  currentUser,
  allMembers,
  botLogs,
  onAddBotLog,
}) => {
  const [selectedAbsentOfficerId, setSelectedAbsentOfficerId] = useState('m1'); // 김지수 주무관
  const [callerName, setCallerName] = useState('한국건설 김대표');
  const [callerPhone, setCallerPhone] = useState('010-4491-8812');
  const [inquiryText, setInquiryText] = useState('신축 건물 소방시설 완비필증 보완 확인 요청');
  const [callState, setCallState] = useState<'idle' | 'calling' | 'bot_answering' | 'transferred' | 'memo_taken' | 'ended'>('idle');
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [customBotGreeting, setCustomBotGreeting] = useState(
    '현재 담당 주무관은 주4일제 분산 휴무일입니다. 급한 용건은 대체 담당자인 1:1 짝꿍 주무관에게 연결됩니다.'
  );

  const absentOfficer = allMembers.find((m) => m.id === selectedAbsentOfficerId) || allMembers[0];
  const buddyOfficer = allMembers.find((m) => m.id === absentOfficer.buddyId) || allMembers[1];

  // Call timer simulation
  useEffect(() => {
    let timer: any;
    if (callState === 'bot_answering' || callState === 'transferred' || callState === 'calling') {
      timer = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callState]);

  const startSimulationCall = () => {
    setCallDuration(0);
    setCallState('calling');

    setTimeout(() => {
      setCallState('bot_answering');
    }, 1500);
  };

  const handleTransferToBuddy = () => {
    setCallState('transferred');
    onAddBotLog({
      callerName: callerName || '일반 민원인',
      callerPhone: callerPhone || '010-0000-0000',
      inquiryTitle: inquiryText || '담당 업무 유선 문의',
      targetOfficerId: absentOfficer.id,
      buddyOfficerId: buddyOfficer.id,
      actionTaken: 'transferred',
      details: `ARS 자동 부재 안내 후 짝꿍 ${buddyOfficer.name} 주무관(내선 ${buddyOfficer.extension})으로 즉시 호 전환 완료`,
      isUrgent: true,
    });
  };

  const handleTakeMemo = () => {
    setCallState('memo_taken');
    onAddBotLog({
      callerName: callerName || '일반 민원인',
      callerPhone: callerPhone || '010-0000-0000',
      inquiryTitle: inquiryText || '서류 보완 및 일정 문의',
      targetOfficerId: absentOfficer.id,
      buddyOfficerId: buddyOfficer.id,
      actionTaken: 'memo_saved',
      details: `민원 요약 내용이 짝꿍 ${buddyOfficer.name} 주무관 메신저 및 알림톡으로 자동 저장 및 전달됨`,
      isUrgent: false,
    });
  };

  const handleEndCall = () => {
    setCallState('ended');
    setTimeout(() => {
      setCallState('idle');
      setCallDuration(0);
    }, 1500);
  };

  const applyInquiryPreset = (type: 'doc' | 'urgent' | 'callback') => {
    if (type === 'doc') {
      setCallerName('미래건축 정소장');
      setCallerPhone('010-8812-3341');
      setInquiryText('개발행위허가 설계변경 도면 세움터 접수 확인 건');
    } else if (type === 'urgent') {
      setCallerName('역전상가 번영회');
      setCallerPhone('010-2213-9090');
      setInquiryText('불법 적치물로 인한 소방차 진입로 차단 긴급 민원');
    } else {
      setCallerName('희망복지재단 담당관');
      setCallerPhone('02-384-9911');
      setInquiryText('취약계층 생계급여 지급 기준 변경 관련 방문 상담 예약');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Card: Feature Description */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-700">
                <Bot className="w-5 h-5" />
              </span>
              <h2 className="text-lg font-black text-slate-900">
                자동 부재 알림 & 민원 이관 봇 (PRD 2.③)
              </h2>
              <span className="text-xs bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                부재 공백 제로
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              직원이 휴무일일 때 전화나 메신저가 오면 인공지능 부재 봇이 자동 응대하여 짝꿍에게 즉시 연결하거나 요약 메모를 전달합니다.
            </p>
          </div>

          <div className="text-xs bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl font-medium text-slate-700 flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>"담당자 부재"로 인한 민원인 헛걸음/재통화 100% 방지</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Live Interactive ARS Call Simulator & Call Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Phone / ARS Simulator Interface */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
              <PhoneCall className="w-4 h-4 text-blue-600" />
              <span>실시간 부재 전화 & 호 이관 모의 시뮬레이터</span>
            </h3>
            <span className="text-xs text-slate-400">민원인 시점 체험</span>
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-xs font-bold text-slate-600 mb-1.5">
              모의 민원 상황 원클릭 선택:
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => applyInquiryPreset('doc')}
                className="p-2 text-xs font-semibold bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg text-slate-700 transition-colors text-left"
              >
                📄 세움터 인허가 보완 문의
              </button>
              <button
                onClick={() => applyInquiryPreset('urgent')}
                className="p-2 text-xs font-semibold bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg text-slate-700 transition-colors text-left"
              >
                🚨 도로 적치물 긴급 민원
              </button>
              <button
                onClick={() => applyInquiryPreset('callback')}
                className="p-2 text-xs font-semibold bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-lg text-slate-700 transition-colors text-left"
              >
                🗓️ 방문 상담 일정 예약
              </button>
            </div>
          </div>

          {/* Form Fields: Who are we calling? */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                전화 걸 대상 (휴무 중인 주무관)
              </label>
              <select
                value={selectedAbsentOfficerId}
                onChange={(e) => setSelectedAbsentOfficerId(e.target.value)}
                disabled={callState !== 'idle'}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                {allMembers
                  .filter((m) => m.offDay !== null)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.title} ({m.offDay}요 휴무) - {m.specialty}
                    </option>
                  ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                민원인 성함 / 발신번호
              </label>
              <div className="flex space-x-1.5">
                <input
                  type="text"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  disabled={callState !== 'idle'}
                  placeholder="민원인 성함"
                  className="w-1/2 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
                <input
                  type="text"
                  value={callerPhone}
                  onChange={(e) => setCallerPhone(e.target.value)}
                  disabled={callState !== 'idle'}
                  placeholder="010-0000-0000"
                  className="w-1/2 p-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              민원 요건 / 문의 내용
            </label>
            <input
              type="text"
              value={inquiryText}
              onChange={(e) => setInquiryText(e.target.value)}
              disabled={callState !== 'idle'}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800"
            />
          </div>

          {/* Interactive ARS Call Screen Device */}
          <div className="bg-slate-950 text-white rounded-2xl p-5 border border-slate-800 shadow-xl overflow-hidden relative">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs text-slate-400">
              <span className="flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>스마트워크 지능형 행정교환기 (IVR)</span>
              </span>
              <span className="font-mono">
                {String(Math.floor(callDuration / 60)).padStart(2, '0')}:
                {String(callDuration % 60).padStart(2, '0')}
              </span>
            </div>

            {/* Calling State Visualizer */}
            <div className="py-6 text-center space-y-3">
              {callState === 'idle' && (
                <div className="space-y-2">
                  <div className="w-14 h-14 rounded-full bg-slate-800 text-slate-300 flex items-center justify-center mx-auto">
                    <PhoneCall className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-200">
                    휴무 직원 내선 ({absentOfficer.extension}) 연결 대기
                  </h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">
                    아래 [전화 걸기] 버튼을 누르면 부재 자동 감지 및 짝꿍 이관 봇이 응답합니다.
                  </p>
                </div>
              )}

              {callState === 'calling' && (
                <div className="space-y-2 animate-pulse">
                  <div className="w-14 h-14 rounded-full bg-blue-600/30 text-blue-400 flex items-center justify-center mx-auto">
                    <PhoneCall className="w-6 h-6 animate-bounce" />
                  </div>
                  <h4 className="text-sm font-bold text-blue-300">
                    {absentOfficer.name} 주무관 내선 ({absentOfficer.extension}) 신호 가는 중...
                  </h4>
                  <p className="text-xs text-slate-400">
                    부서 근무 일정 데이터베이스 실시간 조회 중
                  </p>
                </div>
              )}

              {callState === 'bot_answering' && (
                <div className="space-y-3">
                  {/* Waveform Animation */}
                  <div className="flex items-center justify-center space-x-1 py-1">
                    {[16, 28, 44, 20, 36, 48, 24, 40, 18, 32].map((height, i) => (
                      <div
                        key={i}
                        className="w-1.5 bg-gradient-to-t from-blue-500 to-indigo-400 rounded-full animate-pulse"
                        style={{
                          height: `${height}px`,
                          animationDuration: `${0.6 + (i % 5) * 0.15}s`,
                        }}
                      ></div>
                    ))}
                  </div>

                  <div className="bg-slate-900 border border-slate-700/80 rounded-xl p-4 text-left max-w-lg mx-auto">
                    <div className="flex items-center space-x-2 text-amber-400 text-xs font-bold mb-1">
                      <Bot className="w-4 h-4" />
                      <span>스마트워크 음성 봇 자동 응답 중</span>
                    </div>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans">
                      "안녕하세요, {absentOfficer.department} {absentOfficer.name} 주무관 사무실입니다.
                      <strong className="text-amber-300"> 현재 담당자는 주4일제 휴무일입니다.</strong> 급한 용건은 대체 담당자인 짝꿍
                      <strong className="text-blue-300"> {buddyOfficer.name} 주무관(내선번호 {buddyOfficer.extension})</strong>에게
                      즉시 연결해 드리겠습니다."
                    </p>
                  </div>

                  {/* ARS Interactive Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 max-w-lg mx-auto">
                    <button
                      onClick={handleTransferToBuddy}
                      className="p-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md shadow-blue-500/30 transition-all"
                    >
                      <PhoneForwarded className="w-4 h-4" />
                      <span>[1번] 짝꿍 {buddyOfficer.name} 주무관 즉시 연결</span>
                    </button>

                    <button
                      onClick={handleTakeMemo}
                      className="p-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-2 transition-all"
                    >
                      <MessageSquare className="w-4 h-4 text-amber-400" />
                      <span>[2번] 긴급 문의 요약 메모 접수</span>
                    </button>
                  </div>
                </div>
              )}

              {callState === 'transferred' && (
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <PhoneForwarded className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-emerald-300">
                    짝꿍 {buddyOfficer.name} {buddyOfficer.title}(내선 {buddyOfficer.extension}) 통화 연결 성공!
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    대리 담당자가 민원인 통화 중이며, {absentOfficer.name} 주무관이 남긴 3줄 인수인계를 모니터에 띄워 완벽히 대응 중입니다.
                  </p>
                </div>
              )}

              {callState === 'memo_taken' && (
                <div className="space-y-3">
                  <div className="w-14 h-14 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="text-sm font-bold text-amber-300">
                    민원 메모 접수 및 짝꿍 메신저 통보 완료
                  </h4>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    "{inquiryText}" 안건이 짝꿍 {buddyOfficer.name} 주무관과 담당자에게 모바일 푸시로 안전하게 전달되었습니다.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Call Action Bar */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              {callState === 'idle' ? (
                <button
                  onClick={startSimulationCall}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-emerald-600/30 transition-all"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>민원인 시점 모의 전화 걸기 (체험 시작)</span>
                </button>
              ) : (
                <button
                  onClick={handleEndCall}
                  className="w-full py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all"
                >
                  <Square className="w-4 h-4" />
                  <span>통화 종료 (초기화)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Call History & Messenger Notification Card */}
        <div className="lg:col-span-5 space-y-5">
          {/* Mobile AlimTalk Simulated Card */}
          <div className="bg-[#FEE500] text-[#3C1E1E] rounded-2xl p-4 shadow-sm border border-amber-300">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black tracking-tight flex items-center">
                <MessageSquare className="w-3.5 h-3.5 mr-1" />
                카카오 알림톡 (민원인 자동 발송 예시)
              </span>
              <span className="text-[10px] text-amber-900/70 font-semibold">스마트워크 행정망</span>
            </div>

            <div className="bg-white rounded-xl p-3 text-slate-800 text-xs space-y-2 border border-amber-200">
              <div className="font-bold text-slate-900 flex items-center space-x-1">
                <span>[주4일제 스마트워크 업무공백제로 안내]</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                안녕하세요, <strong>{callerName}</strong> 민원인님.<br />
                문의하신 <strong>{absentOfficer.name} 주무관</strong>은 주4일제 휴무일입니다.
              </p>
              <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 text-[11px] space-y-0.5">
                <div>• 대리 담당자: <strong>{buddyOfficer.name} 주무관</strong></div>
                <div>• 직통 내선: <strong>{buddyOfficer.extension}</strong></div>
                <div>• 접수 안건: {inquiryText}</div>
              </div>
              <p className="text-[10px] text-slate-500">
                ※ 담당자가 부재중이어도 짝꿍 주무관이 100% 동일한 권한으로 즉시 대리 처리해 드립니다.
              </p>
            </div>
          </div>

          {/* Call Logs Stream */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>오늘 자동 부재 이관 기록 ({botLogs.length}건)</span>
              </h3>
              <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                이관 성공률 100%
              </span>
            </div>

            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {botLogs.map((log) => {
                const target = allMembers.find((m) => m.id === log.targetOfficerId);
                const buddy = allMembers.find((m) => m.id === log.buddyOfficerId);

                return (
                  <div
                    key={log.id}
                    className="p-3 border border-slate-200 rounded-xl bg-slate-50/70 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1.5">
                        <span className="font-mono text-[10px] text-slate-400">{log.timestamp}</span>
                        <span className="font-bold text-slate-800">{log.callerName}</span>
                        {log.isUrgent && (
                          <span className="text-[9px] font-bold bg-rose-100 text-rose-800 px-1 py-0.2 rounded-sm">
                            긴급
                          </span>
                        )}
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          log.actionTaken === 'transferred'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {log.actionTaken === 'transferred' ? '호 전환' : '메모 접수'}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-700 font-medium line-clamp-1">
                      {log.inquiryTitle}
                    </div>

                    <div className="text-[10px] text-slate-500 bg-white p-2 rounded-lg border border-slate-200">
                      {log.details}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
