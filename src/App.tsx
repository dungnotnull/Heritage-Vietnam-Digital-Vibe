import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Storyteller } from './components/Storyteller';
import { HeritagePlanner } from './components/HeritagePlanner';
import { DailyHabitLoop } from './components/DailyHabitLoop';
import { LocalEconomy } from './components/LocalEconomy';
import { HumanInTheLoop } from './components/HumanInTheLoop';
import { ProofDashboard } from './components/ProofDashboard';
import { ArHeritageExperience } from './components/ArHeritageExperience';
import { HeritageChatWidget } from './components/HeritageChatWidget';
import { BackToTop } from './components/BackToTop';
import { DongSonDrum } from './components/DongSonDrum';
import { Language, HeritageItem, QuizQuestion, CollectibleBadge, ArtisanProfile, KnowledgeProposal, KnowledgeVersion, UserFeedback, ProofMetrics } from './types';
import { INITIAL_HERITAGE_ITEMS, INITIAL_QUIZ_QUESTIONS, INITIAL_COLLECTIBLES, INITIAL_ARTISANS } from './data/heritageKnowledge';
import { INITIAL_METRICS, INITIAL_PROPOSALS, INITIAL_VERSIONS, INITIAL_FEEDBACK } from './data/selfImprovingStore';
import { 
  seedFirestoreIfEmpty, 
  subscribeToHeritages, 
  subscribeToProposals, 
  subscribeToVersions, 
  subscribeToFeedback 
} from './lib/firebase';

export default function App() {
  const [activeTab, setActiveTab] = useState<'story' | 'planner' | 'habit' | 'economy' | 'human-loop' | 'proof' | 'ar'>('story');
  const [language, setLanguage] = useState<Language>('vi');
  const [streakDays, setStreakDays] = useState(4);
  const [selectedArArtifactId, setSelectedArArtifactId] = useState<string>('trong-dong');

  // App Data State (Live sync with Firebase Firestore)
  const [heritages, setHeritages] = useState<HeritageItem[]>(INITIAL_HERITAGE_ITEMS);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(INITIAL_QUIZ_QUESTIONS);
  const [collectibles, setCollectibles] = useState<CollectibleBadge[]>(INITIAL_COLLECTIBLES);
  const [artisans, setArtisans] = useState<ArtisanProfile[]>(INITIAL_ARTISANS);
  const [proposals, setProposals] = useState<KnowledgeProposal[]>(INITIAL_PROPOSALS);
  const [versions, setVersions] = useState<KnowledgeVersion[]>(INITIAL_VERSIONS);
  const [feedback, setFeedback] = useState<UserFeedback[]>(INITIAL_FEEDBACK);
  const [metrics, setMetrics] = useState<ProofMetrics>(INITIAL_METRICS);

  // Fetch live knowledge on mount
  const refreshKnowledge = async () => {
    try {
      const res = await fetch('/api/knowledge');
      const data = await res.json();
      if (data.heritages && data.heritages.length > 0) setHeritages(data.heritages);
      if (data.versions && data.versions.length > 0) setVersions(data.versions);
      if (data.proposals && data.proposals.length > 0) setProposals(data.proposals);
      if (data.feedback && data.feedback.length > 0) setFeedback(data.feedback);
      if (data.artisans && data.artisans.length > 0) setArtisans(data.artisans);
      if (data.collectibles && data.collectibles.length > 0) setCollectibles(data.collectibles);
      if (data.quizQuestions && data.quizQuestions.length > 0) setQuizQuestions(data.quizQuestions);
    } catch (e) {
      console.warn('API knowledge sync notice:', e);
    }
  };

  const refreshMetrics = async () => {
    try {
      const res = await fetch('/api/metrics');
      const data = await res.json();
      if (data.dau !== undefined) {
        setMetrics(data);
      }
    } catch (e) {
      console.warn('API metrics sync notice:', e);
    }
  };

  useEffect(() => {
    // 1. Seed Firestore database on initial load if empty
    seedFirestoreIfEmpty(
      INITIAL_HERITAGE_ITEMS,
      INITIAL_PROPOSALS,
      INITIAL_VERSIONS,
      INITIAL_FEEDBACK
    );

    // 2. Real-time subscriptions to Firestore Collections
    const unsubHeritages = subscribeToHeritages((items) => {
      if (items && items.length > 0) {
        setHeritages(items);
      }
    });

    const unsubProposals = subscribeToProposals((props) => {
      if (props && props.length > 0) {
        setProposals(props);
      }
    });

    const unsubVersions = subscribeToVersions((vers) => {
      if (vers && vers.length > 0) {
        setVersions(vers);
      }
    });

    const unsubFeedback = subscribeToFeedback((fbs) => {
      if (fbs && fbs.length > 0) {
        setFeedback(fbs);
      }
    });

    refreshKnowledge();
    refreshMetrics();

    return () => {
      unsubHeritages();
      unsubProposals();
      unsubVersions();
      unsubFeedback();
    };
  }, []);

  const activeVersion = versions.find(v => v.status === 'active')?.version || 'v1.0.1';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 selection:bg-amber-500/30 relative overflow-x-hidden">
      
      {/* Majestic Dong Son Bronze Drum Watermark in the bottom-right quadrant */}
      <div 
        aria-hidden="true" 
        className="fixed -bottom-28 -right-28 sm:-bottom-48 sm:-right-48 md:-bottom-60 md:-right-60 w-[550px] h-[550px] sm:w-[850px] sm:h-[850px] lg:w-[1100px] lg:h-[1100px] pointer-events-none z-0 overflow-hidden select-none"
      >
        <DongSonDrum size="100%" opacity={0.16} animate={true} />
      </div>

      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        setLanguage={setLanguage}
        streakDays={streakDays}
        activeVersion={activeVersion}
      />

      {/* Main View Router */}
      <main className="flex-1 relative z-10 pt-16">
        {activeTab === 'story' && (
          <Storyteller
            heritages={heritages}
            language={language}
            onStoryCompleted={(id) => {
              setStreakDays(prev => Math.max(prev, 4));
              refreshMetrics();
            }}
            onExploreAr={(heritage) => {
              if (heritage.arArtifactId) {
                setSelectedArArtifactId(heritage.arArtifactId);
              }
              setActiveTab('ar');
            }}
          />
        )}

        {activeTab === 'planner' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <HeritagePlanner
              heritages={heritages}
              language={language}
            />
          </div>
        )}

        {activeTab === 'ar' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <ArHeritageExperience
              language={language}
              initialArtifactId={selectedArArtifactId}
              heritages={heritages}
              onClose={() => setActiveTab('story')}
            />
          </div>
        )}

        {activeTab === 'habit' && (
          <DailyHabitLoop
            quizQuestions={quizQuestions}
            collectibles={collectibles}
            streakDays={streakDays}
            language={language}
            onQuizPassed={() => {
              setStreakDays(prev => prev + 1);
              refreshMetrics();
            }}
          />
        )}

        {activeTab === 'economy' && (
          <LocalEconomy
            artisans={artisans}
            language={language}
            onArtisanSupported={(id) => {
              refreshMetrics();
            }}
          />
        )}

        {activeTab === 'human-loop' && (
          <HumanInTheLoop
            proposals={proposals}
            versions={versions}
            feedback={feedback}
            heritages={heritages}
            language={language}
            onProposalApproved={() => {
              refreshKnowledge();
              refreshMetrics();
            }}
            onRollbackExecuted={() => {
              refreshKnowledge();
              refreshMetrics();
            }}
          />
        )}

        {activeTab === 'proof' && (
          <ProofDashboard
            metrics={metrics}
            language={language}
          />
        )}
      </main>

      {/* Footer: Heritage Cultural Credits & Author Recognition */}
      <footer className="mt-16 border-t border-stone-800 bg-stone-950 text-stone-300 py-12 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-stone-950 font-bold shadow-md shadow-amber-900/40 text-xl">
                🪘
              </div>
              <div>
                <span className="font-heritage font-bold text-xl text-amber-100 block">
                  Heritage<span className="text-amber-400">Vibe</span>
                </span>
                <span className="text-xs text-amber-400/90 font-medium">
                  Tinh hoa Di sản Văn hóa Việt Nam
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-stone-300">
              <button className="hover:text-amber-300 transition-colors cursor-pointer" onClick={() => setActiveTab('story')}>
                {language === 'vi' ? 'Kể chuyện Di sản' : 'Stories'}
              </button>
              <button className="hover:text-amber-300 transition-colors cursor-pointer" onClick={() => setActiveTab('planner')}>
                {language === 'vi' ? 'Lên Lịch Tour' : 'AI Planner'}
              </button>
              <button className="hover:text-amber-300 transition-colors cursor-pointer" onClick={() => setActiveTab('ar')}>
                {language === 'vi' ? 'Cổ vật 3D & Bản đồ' : '3D & Maps'}
              </button>
              <button className="hover:text-amber-300 transition-colors cursor-pointer" onClick={() => setActiveTab('habit')}>
                {language === 'vi' ? 'Thử thách Tri thức' : 'Daily Quests'}
              </button>
              <button className="hover:text-amber-300 transition-colors cursor-pointer" onClick={() => setActiveTab('economy')}>
                {language === 'vi' ? 'Làng nghề Truyền thống' : 'Artisans'}
              </button>
              <button className="hover:text-amber-300 transition-colors cursor-pointer" onClick={() => setActiveTab('human-loop')}>
                {language === 'vi' ? 'Đóng góp Tri thức' : 'Community Verify'}
              </button>
              <button className="text-amber-400 hover:text-amber-300 font-bold cursor-pointer transition-colors" onClick={() => setActiveTab('proof')}>
                {language === 'vi' ? 'Ghi nhận & Lan tỏa' : 'Impact Records'}
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-400">
            <div className="flex items-center gap-2 text-center md:text-left">
              <span className="font-bold text-amber-300 text-sm">
                Tác giả: Hoang Dung - 2026
              </span>
              <span className="text-stone-600 hidden sm:inline">•</span>
              <span className="text-stone-400">
                {language === 'vi' ? 'Nền tảng số bảo tồn & lan tỏa di sản dân tộc' : 'Digital platform preserving and honoring Vietnamese cultural heritage'}
              </span>
            </div>
            
            <div className="text-stone-500 text-[11px] text-center md:text-right">
              {language === 'vi'
                ? 'Nguồn tư liệu: Hồ sơ UNESCO & Cục Di sản Văn hóa - Bộ Văn hóa, Thể thao và Du lịch'
                : 'Knowledge Archive: UNESCO Records & Vietnam Ministry of Culture, Sports and Tourism'}
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Heritage AI Chat Widget (positioned above Back to Top) */}
      <HeritageChatWidget
        heritages={heritages}
        language={language}
      />

      {/* Floating Back to Top Button */}
      <BackToTop language={language} />
    </div>
  );
}

