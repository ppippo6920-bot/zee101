import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Dices,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Calendar,
  Users,
  Shuffle,
  ShieldCheck,
  Award,
  Play,
  Flame,
  HelpCircle,
  PartyPopper,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { TeamMember, DayOfWeek, ShiftGroup } from '../types';

interface LotteryDrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  allMembers: TeamMember[];
  currentUser: TeamMember;
  onApplyResults: (updatedMembers: TeamMember[]) => void;
}

type DrawMode = 'team_balance' | 'roulette' | 'card_flip';

export const LotteryDrawModal: React.FC<LotteryDrawModalProps> = ({
  isOpen,
  onClose,
  allMembers,
  currentUser,
  onApplyResults,
}) => {
  const [mode, setMode] = useState<DrawMode>('team_balance');
  const [guaranteeBuddyComplement, setGuaranteeBuddyComplement] = useState(true);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawProgress, setDrawProgress] = useState(0); // 0 to 100
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Draft member states after drawing
  const [draftMembers, setDraftMembers] = useState<TeamMember[]>(allMembers);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Roulette specific state
  const [selectedMemberId, setSelectedMemberId] = useState<string>(currentUser.id);
  const [rouletteAngle, setRouletteAngle] = useState(0);
  const [rouletteResult, setRouletteResult] = useState<DayOfWeek | null>(null);

  // Card Flip specific state
  const [flippedCards, setFlippedCards] = useState<{ [id: string]: boolean }>({});

  const audioCtxRef = useRef<AudioContext | null>(null);

  // Sound generator helper
  const playSound = (type: 'tick' | 'fanfare' | 'click') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const now = ctx.currentTime;

      if (type === 'tick') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'fanfare') {
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
          gain.gain.setValueAtTime(0, now + idx * 0.09);
          gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.09 + 0.03);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.45);
        });
      }
    } catch {
      // Audio might be blocked by browser policy until interaction
    }
  };

  useEffect(() => {
    if (isOpen) {
      setDraftMembers(allMembers);
      setHasDrawn(false);
      setFlippedCards({});
      setRouletteResult(null);
    }
  }, [isOpen, allMembers]);

  if (!isOpen) return null;

  // 1. Team Balance Full Draw Algorithm
  const handleExecuteTeamBalanceDraw = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setDrawProgress(0);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setDrawProgress(progress);
      playSound('tick');

      // Visual shuffling preview
      setDraftMembers((prev) =>
        prev.map((m) => ({
          ...m,
          offDay: Math.random() > 0.5 ? '월' : '금',
          shiftGroup: Math.random() > 0.5 ? 'MON_OFF' : 'FRI_OFF',
        }))
      );

      if (progress >= 100) {
        clearInterval(interval);
        finalizeBalanceDraw();
      }
    }, 60);
  };

  const finalizeBalanceDraw = () => {
    // Determine fair assignment
    let updated: TeamMember[] = [];

    if (guaranteeBuddyComplement) {
      // Pairings: (m1, m2), (m3, m4), (m5, m6)
      // For each pair, randomly decide who takes '월' and who takes '금'
      const pairMap: { [id: string]: boolean } = {};
      const pairs: [TeamMember, TeamMember][] = [];

      allMembers.forEach((member) => {
        if (pairMap[member.id]) return;
        const buddy = allMembers.find((m) => m.id === member.buddyId);
        if (buddy && !pairMap[buddy.id]) {
          pairMap[member.id] = true;
          pairMap[buddy.id] = true;
          pairs.push([member, buddy]);
        } else {
          pairMap[member.id] = true;
        }
      });

      const resultMap: { [id: string]: DayOfWeek } = {};

      pairs.forEach(([p1, p2]) => {
        const coin = Math.random() > 0.5;
        resultMap[p1.id] = coin ? '월' : '금';
        resultMap[p2.id] = coin ? '금' : '월';
      });

      // Any remaining members without buddy
      allMembers.forEach((m) => {
        if (!resultMap[m.id]) {
          resultMap[m.id] = Math.random() > 0.5 ? '월' : '금';
        }
      });

      updated = allMembers.map((m) => ({
        ...m,
        offDay: resultMap[m.id],
        shiftGroup: resultMap[m.id] === '월' ? 'MON_OFF' : 'FRI_OFF',
      }));
    } else {
      // Random shuffle with 50/50 balance (3 Monday, 3 Friday)
      const shuffledIds = [...allMembers].map((m) => m.id).sort(() => Math.random() - 0.5);
      const half = Math.ceil(shuffledIds.length / 2);
      const mondayIds = new Set(shuffledIds.slice(0, half));

      updated = allMembers.map((m) => {
        const isMon = mondayIds.has(m.id);
        return {
          ...m,
          offDay: isMon ? '월' : '금',
          shiftGroup: isMon ? ('MON_OFF' as ShiftGroup) : ('FRI_OFF' as ShiftGroup),
        };
      });
    }

    setDraftMembers(updated);
    setIsDrawing(false);
    setHasDrawn(true);
    playSound('fanfare');
  };

  // 2. Interactive Roulette Spin
  const handleSpinRoulette = () => {
    if (isDrawing) return;
    setIsDrawing(true);
    setRouletteResult(null);

    playSound('click');

    // Random landing: 0 or 1
    const chosenOffDay: DayOfWeek = Math.random() > 0.5 ? '월' : '금';
    // Mon is top/right (approx 90 deg), Fri is bottom/left (approx 270 deg)
    const baseTargetDeg = chosenOffDay === '월' ? 90 : 270;
    const spins = 5 + Math.floor(Math.random() * 3); // 5 to 7 full spins
    const totalRotation = spins * 360 + baseTargetDeg + (Math.random() * 40 - 20);

    setRouletteAngle((prev) => prev + totalRotation);

    // Sound ticker
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      playSound('tick');
      tickCount++;
      if (tickCount >= 18) {
        clearInterval(tickInterval);
      }
    }, 130);

    setTimeout(() => {
      setRouletteResult(chosenOffDay);
      setIsDrawing(false);
      playSound('fanfare');

      // Update that member in draft
      setDraftMembers((prev) =>
        prev.map((m) => {
          if (m.id === selectedMemberId) {
            return {
              ...m,
              offDay: chosenOffDay,
              shiftGroup: chosenOffDay === '월' ? 'MON_OFF' : 'FRI_OFF',
            };
          }
          return m;
        })
      );
      setHasDrawn(true);
    }, 2800);
  };

  // 3. Card Flip Handler
  const handleFlipCard = (memberId: string) => {
    if (flippedCards[memberId]) return;
    playSound('click');

    // Determine card value
    const randomDay: DayOfWeek = Math.random() > 0.5 ? '월' : '금';
    setFlippedCards((prev) => ({ ...prev, [memberId]: true }));

    setDraftMembers((prev) =>
      prev.map((m) => {
        if (m.id === memberId) {
          return {
            ...m,
            offDay: randomDay,
            shiftGroup: randomDay === '월' ? 'MON_OFF' : 'FRI_OFF',
          };
        }
        return m;
      })
    );
    setHasDrawn(true);

    // If all cards flipped, play fanfare
    const allFlippedCount = Object.keys(flippedCards).length + 1;
    if (allFlippedCount >= allMembers.length) {
      setTimeout(() => playSound('fanfare'), 300);
    }
  };

  const handleFlipAllCards = () => {
    handleExecuteTeamBalanceDraw();
    const allIds: { [id: string]: boolean } = {};
    allMembers.forEach((m) => {
      allIds[m.id] = true;
    });
    setFlippedCards(allIds);
  };

  // Apply to live application
  const handleApplyToCalendar = () => {
    onApplyResults(draftMembers);
    onClose();
  };

  const mondayMembers = draftMembers.filter((m) => m.offDay === '월');
  const fridayMembers = draftMembers.filter((m) => m.offDay === '금');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 text-white p-5 sm:p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl -mr-20 -mt-20 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center shadow-inner">
                <Dices className="w-6 h-6 text-amber-300 animate-bounce duration-1000" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-black tracking-tight text-white">
                    월·금 휴무일 랜덤 추첨 게임 🎲
                  </h3>
                  <span className="bg-amber-400 text-slate-900 font-extrabold text-[10px] px-2 py-0.5 rounded-full shadow-xs">
                    공정보장 50:50
                  </span>
                </div>
                <p className="text-xs text-emerald-100 mt-0.5">
                  환경보전과 주4일제 100% 업무공백 제로 분산 휴무 추첨 시스템
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white/90 transition-colors"
                title={soundEnabled ? '효과음 끄기' : '효과음 켜기'}
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-white/50" />}
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white/90 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mode Selector Tabs */}
          <div className="mt-5 flex items-center bg-black/20 p-1 rounded-2xl border border-white/15 relative z-10 text-xs">
            <button
              onClick={() => setMode('team_balance')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 ${
                mode === 'team_balance'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Shuffle className="w-3.5 h-3.5 text-emerald-600" />
              <span>전체 일괄 공정추첨</span>
            </button>
            <button
              onClick={() => setMode('roulette')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 ${
                mode === 'roulette'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>1인 행운 룰렛</span>
            </button>
            <button
              onClick={() => setMode('card_flip')}
              className={`flex-1 py-2 rounded-xl font-bold transition-all flex items-center justify-center space-x-1.5 ${
                mode === 'card_flip'
                  ? 'bg-white text-slate-900 shadow-md'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              <Award className="w-3.5 h-3.5 text-teal-500" />
              <span>황금 제비뽑기</span>
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Mode 1: Team Balance Draw */}
          {mode === 'team_balance' && (
            <div className="space-y-5">
              <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="text-xs font-bold text-emerald-950">
                      짝꿍 상호보완 분산 원칙 적용
                    </span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    내 옆 든든한 짝꿍(김지수 ↔ 최승희, 박철희 ↔ 황재환, 김한민 ↔ 백민희)이 동시에 쉬지 않도록 자동으로 반대 요일을 배정하여 100% 무중단 대민 행정을 보장합니다.
                  </p>
                </div>

                <label className="flex items-center space-x-2 cursor-pointer select-none shrink-0 self-start sm:self-center">
                  <input
                    type="checkbox"
                    checked={guaranteeBuddyComplement}
                    onChange={(e) => setGuaranteeBuddyComplement(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded-md border-slate-300 focus:ring-emerald-500"
                  />
                  <span className="text-xs font-bold text-slate-700">짝꿍 분산 잠금</span>
                </label>
              </div>

              {/* Action Button & Progress */}
              <div className="text-center space-y-3">
                <button
                  id="lottery-balance-draw-btn"
                  onClick={handleExecuteTeamBalanceDraw}
                  disabled={isDrawing}
                  className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm text-white shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer ${
                    isDrawing
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 active:scale-98 shadow-emerald-500/25 hover:shadow-xl'
                  }`}
                >
                  <Dices className={`w-5 h-5 ${isDrawing ? 'animate-spin' : ''}`} />
                  <span>
                    {isDrawing
                      ? `공정 추첨기 가동 중... (${drawProgress}%)`
                      : '환경보전과 전체 팀원 휴무일 일괄 추첨하기 🎲'}
                  </span>
                </button>

                {isDrawing && (
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2.5 rounded-full transition-all duration-75"
                      style={{ width: `${drawProgress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 2: Interactive Roulette */}
          {mode === 'roulette' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-slate-600" />
                  <span className="text-xs font-bold text-slate-800">룰렛 돌릴 팀원 선택:</span>
                </div>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full sm:w-auto p-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-emerald-500"
                >
                  {allMembers.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} {m.title} (현재: {m.offDay ? `${m.offDay}요 휴무` : '상시'})
                    </option>
                  ))}
                </select>
              </div>

              {/* Roulette Visual Wheel */}
              <div className="flex flex-col items-center justify-center py-2 space-y-4">
                <div className="relative w-56 h-56 flex items-center justify-center">
                  {/* Wheel Pointer */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] border-t-amber-500 drop-shadow-md" />

                  {/* Spinning Disc */}
                  <div
                    className="w-52 h-52 rounded-full border-4 border-slate-800 shadow-xl overflow-hidden relative transition-transform duration-[2800ms] cubic-bezier(0.15, 0.85, 0.35, 1)"
                    style={{ transform: `rotate(${rouletteAngle}deg)` }}
                  >
                    {/* Monday Half (Green) */}
                    <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                      <div className="absolute top-7 text-white font-black text-sm tracking-wider drop-shadow-sm flex flex-col items-center">
                        <span>월요일</span>
                        <span className="text-[10px] text-emerald-200 font-normal">A조 휴무</span>
                      </div>
                    </div>

                    {/* Friday Half (Blue) */}
                    <div
                      className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-sky-600 flex items-center justify-center [clip-path:polygon(0_50%,100%_50%,100%_100%,0_100%)]"
                    >
                      <div className="absolute bottom-7 text-white font-black text-sm tracking-wider drop-shadow-sm flex flex-col items-center">
                        <span className="text-[10px] text-indigo-200 font-normal">B조 휴무</span>
                        <span>금요일</span>
                      </div>
                    </div>

                    {/* Center Pin */}
                    <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-slate-900 border-2 border-amber-400 flex items-center justify-center text-white text-xs font-black shadow-inner">
                      🍀
                    </div>
                  </div>
                </div>

                {/* Spin Button */}
                <button
                  id="roulette-spin-btn"
                  onClick={handleSpinRoulette}
                  disabled={isDrawing}
                  className={`px-8 py-3 rounded-2xl font-black text-sm text-white shadow-md transition-all flex items-center space-x-2 ${
                    isDrawing
                      ? 'bg-slate-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-amber-500/20 active:scale-95'
                  }`}
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>
                    {isDrawing
                      ? '룰렛 회전 중...'
                      : `${allMembers.find((m) => m.id === selectedMemberId)?.name} 주무관 룰렛 돌리기!`}
                  </span>
                </button>

                {rouletteResult && (
                  <div className="bg-amber-100 border border-amber-300 rounded-2xl px-5 py-2.5 text-center animate-in zoom-in-90 duration-200">
                    <span className="text-xs text-amber-950 font-bold">
                      🎉 추첨 결과:{' '}
                      <strong className="text-sm font-black text-blue-900 underline">
                        {allMembers.find((m) => m.id === selectedMemberId)?.name}
                      </strong>{' '}
                      주무관님은{' '}
                      <strong
                        className={`text-sm font-black ${
                          rouletteResult === '월' ? 'text-emerald-700' : 'text-indigo-700'
                        }`}
                      >
                        [{rouletteResult}요일 휴무조]
                      </strong>
                      에 당첨되었습니다!
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 3: Card Flip Lucky Draw */}
          {mode === 'card_flip' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">
                  직원 카드를 클릭하여 행운의 휴무 요일을 직접 오픈하세요:
                </span>
                <button
                  onClick={handleFlipAllCards}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 underline"
                >
                  전체 카드 한 번에 뒤집기
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allMembers.map((member) => {
                  const isFlipped = flippedCards[member.id];
                  const assigned = draftMembers.find((m) => m.id === member.id)?.offDay || member.offDay;

                  return (
                    <div
                      key={member.id}
                      onClick={() => handleFlipCard(member.id)}
                      className={`h-32 rounded-2xl p-3 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border text-center select-none shadow-xs ${
                        isFlipped
                          ? assigned === '월'
                            ? 'bg-emerald-50 border-emerald-300 shadow-emerald-100 scale-100'
                            : 'bg-indigo-50 border-indigo-300 shadow-indigo-100 scale-100'
                          : 'bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700 hover:border-amber-400 text-white hover:scale-102'
                      }`}
                    >
                      {isFlipped ? (
                        <div className="animate-in zoom-in-75 duration-200">
                          <div
                            className={`w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center mx-auto mb-1 ${member.avatarColor}`}
                          >
                            {member.name[0]}
                          </div>
                          <div className="font-bold text-xs text-slate-900">
                            {member.name} {member.title.split(' ')[0]}
                          </div>
                          <div
                            className={`mt-1 text-xs font-black px-2.5 py-0.5 rounded-full inline-block ${
                              assigned === '월'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-indigo-600 text-white'
                            }`}
                          >
                            {assigned}요일 휴무
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1.5">
                          <div className="w-8 h-8 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto text-amber-300">
                            <Sparkles className="w-4 h-4" />
                          </div>
                          <div className="font-bold text-xs text-slate-200">
                            {member.name}
                          </div>
                          <span className="text-[10px] text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-md font-medium">
                            터치하여 오픈
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Current Lottery Results Breakdown */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-slate-800 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>추첨 결과 요약 (환경보전과 분산 휴무 현황)</span>
              </h4>
              <span className="text-[11px] text-slate-500 font-medium">
                {hasDrawn ? '새로운 추첨 결과 산출됨' : '현재 설정값'}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Monday Group */}
              <div className="bg-white border border-emerald-200 rounded-xl p-3 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-emerald-800 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5" />
                    월요일 휴무조 (A조) ({mondayMembers.length}명)
                  </span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded font-bold">
                    화~금 근무
                  </span>
                </div>
                <div className="space-y-1.5">
                  {mondayMembers.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-5 h-5 rounded-md text-white font-bold text-[10px] flex items-center justify-center ${m.avatarColor}`}
                        >
                          {m.name[0]}
                        </div>
                        <span className="font-bold text-slate-800">
                          {m.name} {m.title}
                        </span>
                        {m.id === currentUser.id && (
                          <span className="text-[9px] bg-blue-100 text-blue-700 font-bold px-1 rounded">
                            나
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium truncate max-w-[110px]">
                        {m.specialty.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Friday Group */}
              <div className="bg-white border border-indigo-200 rounded-xl p-3 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-black text-indigo-800 flex items-center">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 mr-1.5" />
                    금요일 휴무조 (B조) ({fridayMembers.length}명)
                  </span>
                  <span className="text-[10px] text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded font-bold">
                    월~목 근무
                  </span>
                </div>
                <div className="space-y-1.5">
                  {fridayMembers.map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between text-xs py-1 px-2 rounded-lg bg-slate-50"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-5 h-5 rounded-md text-white font-bold text-[10px] flex items-center justify-center ${m.avatarColor}`}
                        >
                          {m.name[0]}
                        </div>
                        <span className="font-bold text-slate-800">
                          {m.name} {m.title}
                        </span>
                        {m.id === currentUser.id && (
                          <span className="text-[9px] bg-blue-100 text-blue-700 font-bold px-1 rounded">
                            나
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium truncate max-w-[110px]">
                        {m.specialty.split(' ')[0]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Buddy Pair Balance Status */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-2.5 text-[11px] text-blue-900 flex items-center justify-between">
              <span className="font-medium">
                🌱 <strong>내 옆 든든한 짝꿍:</strong> 최승희 주무관(8급)과 김지수 주무관(8급)의 상호 보완 교차 휴무가{' '}
                {draftMembers.find((m) => m.id === 'm1')?.offDay !== draftMembers.find((m) => m.id === 'm2')?.offDay
                  ? '정상 유지되어 대민 행정 공백 0%'
                  : '동일 요일 배정 상태입니다'}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100/90 border-t border-slate-200 px-5 sm:px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => {
              setDraftMembers(allMembers);
              setHasDrawn(false);
              setFlippedCards({});
              setRouletteResult(null);
            }}
            className="w-full sm:w-auto px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors flex items-center justify-center space-x-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>원래대로 초기화</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              닫기
            </button>
            <button
              id="apply-lottery-results-btn"
              type="button"
              onClick={handleApplyToCalendar}
              className="flex-1 sm:flex-initial px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all shadow-md shadow-emerald-600/25 flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <PartyPopper className="w-4 h-4" />
              <span>추첨 결과 캘린더에 즉시 적용</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
