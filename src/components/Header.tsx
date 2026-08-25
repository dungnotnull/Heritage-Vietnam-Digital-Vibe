import React from 'react';
import { Flame, Globe2, ShieldCheck, BookOpen, Trophy, Store, RefreshCw, BarChart3, Rotate3d, Compass } from 'lucide-react';
import { Language } from '../types';
import { VietnamFlag } from './VietnamFlag';
import { UkFlag } from './UkFlag';

interface HeaderProps {
  activeTab: 'story' | 'planner' | 'habit' | 'economy' | 'human-loop' | 'proof' | 'ar';
  setActiveTab: (tab: 'story' | 'planner' | 'habit' | 'economy' | 'human-loop' | 'proof' | 'ar') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  streakDays: number;
  activeVersion: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  language,
  setLanguage,
  streakDays,
  activeVersion,
}) => {
  const isVi = language === 'vi';

  const navItems: Array<{
    id: 'story' | 'planner' | 'habit' | 'economy' | 'human-loop' | 'proof' | 'ar';
    labelVi: string;
    labelEn: string;
    shortLabelVi: string;
    shortLabelEn: string;
    icon: React.ElementType;
    isProof?: boolean;
    isAr?: boolean;
    isPlanner?: boolean;
  }> = [
    { id: 'story', labelVi: 'Kể chuyện', labelEn: 'Stories', shortLabelVi: 'Truyện', shortLabelEn: 'Story', icon: BookOpen },
    { id: 'planner', labelVi: 'Lên Lịch Tour', labelEn: 'AI Planner', shortLabelVi: 'Lịch Tour', shortLabelEn: 'Planner', icon: Compass, isPlanner: true },
    { id: 'ar', labelVi: 'Cổ vật 3D & Bản đồ', labelEn: '3D & Maps', shortLabelVi: '3D & Maps', shortLabelEn: '3D & Maps', icon: Rotate3d, isAr: true },
    { id: 'habit', labelVi: 'Thử thách', labelEn: 'Quests', shortLabelVi: 'Đố vui', shortLabelEn: 'Quests', icon: Trophy },
    { id: 'economy', labelVi: 'Làng nghề', labelEn: 'Artisans', shortLabelVi: 'Làng nghề', shortLabelEn: 'Crafts', icon: Store },
    { id: 'human-loop', labelVi: 'Tri thức', labelEn: 'Knowledge', shortLabelVi: 'Tri thức', shortLabelEn: 'Knowledge', icon: RefreshCw },
    { id: 'proof', labelVi: 'Ghi nhận & Lan tỏa', labelEn: 'Impact Records', shortLabelVi: 'Ghi nhận', shortLabelEn: 'Impact', icon: BarChart3, isProof: true },
  ];

  return (
    <header 
      id="main-header" 
      className="fixed top-0 left-0 right-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-amber-900/10 shadow-md shadow-amber-950/5 text-stone-900 transition-all"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Left: Brand Identity */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer select-none group flex-shrink-0" 
            onClick={() => setActiveTab('story')}
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-amber-600 via-amber-700 to-amber-900 p-0.5 shadow-md flex items-center justify-center group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#FAF8F5] rounded-[9px] flex items-center justify-center border border-amber-600/40">
                <span className="text-lg select-none">🪘</span>
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-600 rounded-full border-2 border-[#FAF8F5] flex items-center justify-center" title="Tư liệu di sản đã được thẩm định">
                <ShieldCheck className="w-2.5 h-2.5 text-white stroke-[3]" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-bold font-heritage tracking-tight text-stone-950 leading-none">
                Heritage<span className="text-amber-700">Vibe</span>
              </span>
              <span className="text-[10px] text-amber-800 font-semibold hidden sm:inline leading-tight">
                {isVi ? 'Di sản Văn hóa Việt Nam' : 'Vietnam Cultural Heritage'}
              </span>
            </div>
          </div>

          {/* Center: Desktop Navigation Bar (Responsive on lg & xl, with ZERO layout shift) */}
          <nav className="hidden lg:flex items-center gap-1 bg-stone-200/70 p-1 rounded-2xl border border-stone-300/80 shadow-inner max-w-full overflow-hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              
              if (item.isProof) {
                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-semibold border transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-emerald-700 text-white shadow-sm border-emerald-600'
                        : 'text-emerald-800 hover:text-emerald-950 hover:bg-stone-300/50 border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="hidden xl:inline">{isVi ? item.labelVi : item.labelEn}</span>
                    <span className="inline xl:hidden">{isVi ? item.shortLabelVi : item.shortLabelEn}</span>
                  </button>
                );
              }

              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 xl:px-3 py-1.5 rounded-xl text-xs whitespace-nowrap font-semibold border transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-amber-700 text-white shadow-sm border-amber-600'
                      : 'text-stone-700 hover:text-stone-950 hover:bg-stone-300/50 border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span className="hidden xl:inline">{isVi ? item.labelVi : item.labelEn}</span>
                  <span className="inline xl:hidden">{isVi ? item.shortLabelVi : item.shortLabelEn}</span>
                </button>
              );
            })}
          </nav>

          {/* Right: Controls (Compact Fire Streak + Flag-Only Locale Switcher) */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            {/* Streak Counter: Fire icon + days count */}
            <button
              id="streak-pill"
              onClick={() => setActiveTab('habit')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-100 border border-amber-300 text-amber-950 text-xs font-bold cursor-pointer hover:bg-amber-200 transition-all shadow-2xs active:scale-95"
              title={isVi ? `Chuỗi học tập di sản: ${streakDays} ngày` : `Daily streak: ${streakDays} days`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500 animate-pulse" />
              <span>{streakDays}</span>
            </button>

            {/* Language Switcher: Flag icon only to save space */}
            <button
              id="language-toggle-btn"
              onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}
              className="flex items-center justify-center w-8 h-8 rounded-xl bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95 flex-shrink-0"
              title={language === 'vi' ? 'Chuyển sang Tiếng Anh (English)' : 'Switch to Vietnamese (Tiếng Việt)'}
              aria-label="Switch language"
            >
              {language === 'vi' ? (
                <VietnamFlag size="sm" />
              ) : (
                <UkFlag size="sm" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile & Tablet Navigation Strip (Below lg screens) */}
        <div className="flex lg:hidden overflow-x-auto py-2 gap-1.5 border-t border-stone-200/80 scrollbar-none">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            if (item.isProof) {
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-colors border cursor-pointer ${
                    isActive 
                      ? 'bg-emerald-700 text-white shadow-xs border-emerald-600' 
                      : 'text-emerald-800 bg-white border-emerald-200/80 hover:bg-emerald-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{isVi ? item.labelVi : item.labelEn}</span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold flex-shrink-0 transition-colors border cursor-pointer ${
                  isActive 
                    ? 'bg-amber-700 text-white shadow-xs border-amber-600' 
                    : 'text-stone-700 bg-white border-stone-200 hover:bg-stone-50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{isVi ? item.labelVi : item.labelEn}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};


