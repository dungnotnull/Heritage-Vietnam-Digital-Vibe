import React, { useState } from 'react';
import { Flame, Trophy, Award, CheckCircle2, XCircle, Sparkles, ChevronRight, HelpCircle, Shield, ArrowRight, Sun, Crown, Music, Flame as FireIcon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { QuizQuestion, CollectibleBadge, Language } from '../types';
import { DongSonDrum } from './DongSonDrum';

interface DailyHabitLoopProps {
  quizQuestions: QuizQuestion[];
  collectibles: CollectibleBadge[];
  streakDays: number;
  language: Language;
  onQuizPassed: () => void;
}

export const DailyHabitLoop: React.FC<DailyHabitLoopProps> = ({
  quizQuestions,
  collectibles,
  streakDays,
  language,
  onQuizPassed,
}) => {
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedBadge, setSelectedBadge] = useState<CollectibleBadge | null>(null);

  const currentQuiz = quizQuestions[currentQuizIndex] || quizQuestions[0];
  const isCorrect = selectedOption === currentQuiz.correctIndex;

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQuiz.correctIndex) {
      setScore(prev => prev + 1);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#D97706', '#991B1B', '#047857', '#F59E0B'],
      });
      onQuizPassed();
      
      // Log event
      fetch('/api/metrics/event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: 'quiz_passed',
          details: `Answered quiz on ${currentQuiz.heritageId} correctly.`,
        }),
      }).catch(console.error);
    }
  };

  const handleNextQuiz = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    if (currentQuizIndex < quizQuestions.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    } else {
      setCurrentQuizIndex(0);
    }
  };

  const daysOfWeek = [
    { day: 'T2', name: 'Mon', completed: true },
    { day: 'T3', name: 'Tue', completed: true },
    { day: 'T4', name: 'Wed', completed: true },
    { day: 'T5', name: 'Thu', completed: true }, // Today
    { day: 'T6', name: 'Fri', completed: false },
    { day: 'T7', name: 'Sat', completed: false },
    { day: 'CN', name: 'Sun', completed: false },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Header Banner: Habit Loop Motivation */}
      <div className="relative overflow-hidden rounded-3xl bg-stone-950 border border-amber-900/60 p-6 sm:p-8 text-stone-100 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-1/4 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Subtle Drum Watermark */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 pointer-events-none opacity-30">
          <DongSonDrum size="100%" opacity={0.6} animate={true} />
        </div>

        <div className="relative z-10 space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500 animate-pulse" />
            {language === 'vi' ? 'Chuỗi Ngày Khám Phá (Habit Loop)' : 'Daily Heritage Streak'}
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-amber-50">
            {language === 'vi' ? 'Mỗi Ngày Một Nét Văn Hóa' : 'Daily Cultural Discovery'}
          </h1>
          <p className="text-stone-300 text-sm">
            {language === 'vi'
              ? 'Duy trì thói quen tìm hiểu di sản chỉ 3 phút mỗi ngày để mở khóa các bảo vật văn hóa và nâng tầm hiểu biết cội nguồn.'
              : 'Nurture a 3-minute daily cultural habit to collect iconic heritage badges and master Vietnamese history.'}
          </p>
        </div>

        {/* 7-Day Streak Tracker */}
        <div className="bg-stone-950/80 p-4 rounded-2xl border border-stone-800 flex flex-col items-center">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-3">
            {language === 'vi' ? 'Chuỗi 7 Ngày Tuần Này' : '7-Day Weekly Streak'}
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            {daysOfWeek.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                    d.completed
                      ? 'bg-gradient-to-br from-amber-500 to-orange-600 text-stone-950 shadow-md shadow-amber-950/40 scale-105'
                      : 'bg-stone-800 text-stone-500 border border-stone-700/60'
                  }`}
                >
                  {d.completed ? '🔥' : d.day}
                </div>
                <span className="text-[10px] text-stone-400 font-medium">
                  {language === 'vi' ? d.day : d.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Grid: Daily Micro-Quiz & Heritage Collectibles */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Interactive Micro-Quiz (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-amber-700" />
                <h2 className="text-lg font-bold font-heritage text-stone-900">
                  {language === 'vi' ? 'Thử Thách Di Sản Hôm Nay' : 'Today\'s Cultural Micro-Quiz'}
                </h2>
              </div>
              <span className="text-xs font-bold bg-amber-100 text-amber-900 px-3 py-1 rounded-full">
                Câu {currentQuizIndex + 1}/{quizQuestions.length}
              </span>
            </div>

            {/* Question Box */}
            <div className="space-y-4">
              <h3 className="text-base sm:text-lg font-bold text-stone-900 leading-snug">
                {language === 'vi' ? currentQuiz.questionVi : currentQuiz.questionEn}
              </h3>

              {/* Options */}
              <div className="space-y-2.5">
                {(language === 'vi' ? currentQuiz.optionsVi : currentQuiz.optionsEn).map((option, idx) => {
                  let buttonStyle = 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-amber-50 hover:border-amber-300';
                  
                  if (isAnswered) {
                    if (idx === currentQuiz.correctIndex) {
                      buttonStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-500/20';
                    } else if (idx === selectedOption) {
                      buttonStyle = 'bg-rose-50 border-rose-500 text-rose-950';
                    } else {
                      buttonStyle = 'bg-stone-50 border-stone-200 opacity-50';
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      disabled={isAnswered}
                      className={`w-full p-4 rounded-2xl border text-left text-sm font-medium transition-all flex items-center justify-between cursor-pointer ${buttonStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-white border border-stone-300 flex items-center justify-center text-xs font-bold text-stone-600 shadow-2xs">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{option}</span>
                      </div>
                      
                      {isAnswered && idx === currentQuiz.correctIndex && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      )}
                      {isAnswered && idx === selectedOption && idx !== currentQuiz.correctIndex && (
                        <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Answer Explanation */}
            {isAnswered && (
              <div className={`p-4 rounded-2xl border ${isCorrect ? 'bg-emerald-50/80 border-emerald-200' : 'bg-amber-50 border-amber-200'} space-y-2`}>
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                  {isCorrect ? (
                    <span className="text-emerald-800 flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      {language === 'vi' ? 'Chính xác! +20 Điểm Tri thức' : 'Correct! +20 Cultural EXP'}
                    </span>
                  ) : (
                    <span className="text-amber-900 flex items-center gap-1">
                      <HelpCircle className="w-4 h-4" />
                      {language === 'vi' ? 'Lời giải chi tiết' : 'Explanation'}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                  {language === 'vi' ? currentQuiz.explanationVi : currentQuiz.explanationEn}
                </p>

                <div className="pt-2 border-t border-stone-200/60 text-[11px] text-stone-500 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-emerald-600" />
                  <span>Trích dẫn: {currentQuiz.sourceCitation}</span>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {isAnswered && (
              <div className="flex justify-end">
                <button
                  onClick={handleNextQuiz}
                  className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{language === 'vi' ? 'Câu tiếp theo' : 'Next Question'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Digital Heritage Collectibles (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-600" />
                <h2 className="text-lg font-bold font-heritage text-stone-900">
                  {language === 'vi' ? 'Bộ Sưu Tập Huy Hiệu' : 'Heritage Collectibles'}
                </h2>
              </div>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                {collectibles.filter(c => Boolean(c.unlockedAt)).length}/{collectibles.length} {language === 'vi' ? 'đã mở' : 'unlocked'}
              </span>
            </div>

            {/* Badge Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {collectibles.map((badge) => {
                const isUnlocked = Boolean(badge.unlockedAt);
                return (
                  <div
                    key={badge.id}
                    onClick={() => setSelectedBadge(badge)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-amber-50 to-stone-50 border-amber-300/80 shadow-xs hover:scale-[1.02]'
                        : 'bg-stone-50/70 border-stone-200 opacity-60 hover:opacity-90'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${
                        isUnlocked ? 'bg-amber-600 text-white shadow-sm' : 'bg-stone-200 text-stone-400'
                      }`}>
                        {badge.rarity === 'legendary' ? '🪙' : badge.rarity === 'epic' ? '👘' : '🏺'}
                      </div>
                      <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                        badge.rarity === 'legendary'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : badge.rarity === 'epic'
                          ? 'bg-purple-100 text-purple-900 border border-purple-200'
                          : 'bg-stone-100 text-stone-700'
                      }`}>
                        {badge.rarity}
                      </span>
                    </div>

                    <div className="mt-3">
                      <h4 className="text-xs font-bold text-stone-900 truncate">
                        {language === 'vi' ? badge.nameVi : badge.nameEn}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
                        {language === 'vi' ? badge.descriptionVi : badge.descriptionEn}
                      </p>
                    </div>

                    <div className="mt-2 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[10px]">
                      <span className={isUnlocked ? 'text-emerald-700 font-bold' : 'text-stone-400'}>
                        {isUnlocked ? (language === 'vi' ? '✓ Đã sở hữu' : '✓ Unlocked') : (language === 'vi' ? '🔒 Chưa mở' : '🔒 Locked')}
                      </span>
                      <span className="text-stone-400 font-medium">Chi tiết</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Badge Detail Modal/Callout */}
            {selectedBadge && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-900 uppercase">
                    {language === 'vi' ? 'Điều kiện mở khóa' : 'Unlock Requirement'}
                  </span>
                  <button
                    onClick={() => setSelectedBadge(null)}
                    className="text-stone-400 hover:text-stone-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-stone-800">
                  {language === 'vi' ? selectedBadge.requirementVi : selectedBadge.requirementEn}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
