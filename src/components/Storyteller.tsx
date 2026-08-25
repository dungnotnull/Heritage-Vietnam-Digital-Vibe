import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Volume2, VolumeX, ShieldCheck, BookOpen, Quote, MapPin, ExternalLink, MessageSquare, Send, RefreshCw, Feather, CheckCircle2, ChevronRight, Play, Pause, Radio, Waves, Gauge, Box, Rotate3d, Compass, Music, Video, Info, Search, X } from 'lucide-react';
import { HeritageItem, DialectStyle, Language } from '../types';
import { DongSonDrum } from './DongSonDrum';
import { VietnamHeritageMap } from './VietnamHeritageMap';
import { CommunityTravelers } from './CommunityTravelers';
import { HeritageDetailModal } from './HeritageDetailModal';
import { MarkdownRenderer } from './MarkdownRenderer';
import { VietnamFlag } from './VietnamFlag';
import { useSEO } from '../hooks/useSEO';

interface StorytellerProps {
  heritages: HeritageItem[];
  language: Language;
  onStoryCompleted: (heritageId: string) => void;
  onExploreAr?: (heritage: HeritageItem) => void;
}

export const Storyteller: React.FC<StorytellerProps> = ({
  heritages,
  language,
  onStoryCompleted,
  onExploreAr,
}) => {
  const [selectedRegion, setSelectedRegion] = useState<'all' | 'north' | 'central' | 'south'>('all');
  const [selectedHeritage, setSelectedHeritage] = useState<HeritageItem>(heritages[0]);

  useSEO({
    title: language === 'vi' ? `${selectedHeritage.titleVi} | HeritageVibe` : `${selectedHeritage.titleEn} | HeritageVibe`,
    description: language === 'vi' ? selectedHeritage.summaryVi : selectedHeritage.summaryEn,
    image: selectedHeritage.heroImage,
    url: `https://heritagevibe.vn/di-san/${selectedHeritage.id}`
  });
  const [dialect, setDialect] = useState<DialectStyle>('bac-bo');
  const [customFocus, setCustomFocus] = useState('');
  const [detailModalHeritage, setDetailModalHeritage] = useState<HeritageItem | null>(null);
  
  // Story Generation State
  const [loading, setLoading] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<{
    title: string;
    story: string;
    keyTakeaway: string;
    citedFacts: string[];
    sources: string[];
    isAiGenerated: boolean;
  } | null>(null);

  // Audio Narration & Multi-Dialect Player State
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [activeVoiceTitle, setActiveVoiceTitle] = useState<string>('Giọng 1: Nữ Bắc Bộ (Hà Nội - Thanh Lịch, Chuẩn Mực)');
  const [audioEngine, setAudioEngine] = useState<'gemini-tts' | 'webspeech'>('gemini-tts');
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio on unmount or story switch
  const stopAllAudio = () => {
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setAudioLoading(false);
    setAudioProgress(0);
  };

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);
  
  // Grounded Chat State & Trust Gemini Option
  const [chatQuery, setChatQuery] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [trustGemini, setTrustGemini] = useState<boolean>(true);
  const [chatHistory, setChatHistory] = useState<Array<{ sender: 'user' | 'assistant'; text: string; sources?: string[]; trustGeminiUsed?: boolean }>>([
    {
      sender: 'assistant',
      text: language === 'vi' 
        ? `Xin kính chào! Tôi là Trợ lý Di sản HeritageVibe. Bạn có thể bật tùy chọn "Trust Gemini" để nhận câu trả lời sâu sắc, phong phú về văn hóa hoặc "Strict RAG" để bám sát hồ sơ lưu trữ UNESCO. Bạn muốn tìm hiểu gì về "${selectedHeritage.titleVi}"?`
        : `Greetings! I am your HeritageVibe AI companion. You can enable "Trust Gemini" for enriched cultural insights or "Strict RAG" for verbatim UNESCO grounding. What would you like to explore regarding "${selectedHeritage.titleEn}"?`,
      sources: selectedHeritage.sources.map(s => `${s.name} (${s.authority})`),
      trustGeminiUsed: true,
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement | null>(null);

  // Debounce search query input (200ms delay for snappy performance)
  useEffect(() => {
    if (!searchQuery.trim()) {
      setDebouncedSearchQuery('');
      setIsSearching(false);
      return;
    }
    setIsSearching(true);
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
      setIsSearching(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizeSearch = (text: string) => {
    return (text || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd');
  };

  // Update selected heritage when list changes or region changes
  const handleSelectRegion = (region: 'all' | 'north' | 'central' | 'south') => {
    setSelectedRegion(region);
    const activeQuery = debouncedSearchQuery || searchQuery.trim();
    const nextFiltered = heritages.filter((h) => {
      const matchesRegion = region === 'all' || h.region === region;
      if (!activeQuery) return matchesRegion;
      const queryNorm = normalizeSearch(activeQuery);
      const matchTitleVi = normalizeSearch(h.titleVi).includes(queryNorm);
      const matchTitleEn = normalizeSearch(h.titleEn).includes(queryNorm);
      const matchProvince = normalizeSearch(h.province).includes(queryNorm);
      const matchTags = h.tags ? h.tags.some(tag => normalizeSearch(tag).includes(queryNorm)) : false;
      return matchesRegion && (matchTitleVi || matchTitleEn || matchProvince || matchTags);
    });
    
    if (nextFiltered.length > 0 && !nextFiltered.some(h => h.id === selectedHeritage.id)) {
      setSelectedHeritage(nextFiltered[0]);
      setGeneratedStory(null);
    }
  };

  useEffect(() => {
    if (heritages.length > 0 && !heritages.some(h => h.id === selectedHeritage.id)) {
      setSelectedHeritage(heritages[0]);
    }
  }, [heritages]);

  const activeSearchTerm = debouncedSearchQuery || searchQuery.trim();

  const filteredHeritages = heritages.filter((h) => {
    const matchesRegion = selectedRegion === 'all' || h.region === selectedRegion;
    if (!activeSearchTerm) return matchesRegion;

    const queryNorm = normalizeSearch(activeSearchTerm);
    const matchTitleVi = normalizeSearch(h.titleVi).includes(queryNorm);
    const matchTitleEn = normalizeSearch(h.titleEn).includes(queryNorm);
    const matchProvince = normalizeSearch(h.province).includes(queryNorm);
    const matchCategory = normalizeSearch(h.category).includes(queryNorm);
    const matchVillage = h.artisanVillage ? normalizeSearch(h.artisanVillage).includes(queryNorm) : false;
    const matchTags = h.tags ? h.tags.some(tag => normalizeSearch(tag).includes(queryNorm)) : false;
    const matchSummary = normalizeSearch(h.summaryVi).includes(queryNorm) || normalizeSearch(h.summaryEn).includes(queryNorm);

    const matchesSearch = matchTitleVi || matchTitleEn || matchProvince || matchCategory || matchVillage || matchTags || matchSummary;

    return selectedRegion === 'all' ? matchesSearch : (matchesRegion && matchesSearch);
  });

  // Generate Story
  const handleGenerateStory = async () => {
    stopAllAudio();
    setLoading(true);
    try {
      const res = await fetch('/api/story/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heritageId: selectedHeritage.id,
          dialect,
          language,
          customFocus: customFocus.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setGeneratedStory({
          title: data.title,
          story: data.story,
          keyTakeaway: data.keyTakeaway,
          citedFacts: data.citedFacts || selectedHeritage.groundedFacts,
          sources: data.sources || selectedHeritage.sources.map(s => s.name),
          isAiGenerated: data.isAiGenerated,
        });
        onStoryCompleted(selectedHeritage.id);
      }
    } catch (err) {
      console.error('Failed to generate story:', err);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced 4-Voice Distinct Synthesis (AI Gemini TTS + Fine-Tuned Web Speech Fallback)
  const toggleSpeech = async () => {
    if (!generatedStory) return;

    if (isPlayingAudio) {
      stopAllAudio();
      return;
    }

    setAudioLoading(true);

    const voiceLabels: Record<DialectStyle, string> = {
      'bac-bo': language === 'vi' ? 'Giọng 1: Nữ Bắc Bộ (Hà Nội - Thanh Lịch, Chuẩn Mực)' : 'Voice 1: Northern Female (Graceful & Articulate)',
      'trung-bo': language === 'vi' ? 'Giọng 2: Nữ Cố Đô Huế (Hương Giang - Trữ Tình, Êm Dịu)' : 'Voice 2: Central Hue Female (Poetic & Melodic)',
      'nam-bo': language === 'vi' ? 'Giọng 3: Nữ Nam Bộ (Cửu Long - Ngọt Ngào, Mộc Mạc)' : 'Voice 3: Southern Female (Warm & Lyrical)',
      'modern-genz': language === 'vi' ? 'Giọng 4: Giọng Nam Hùng Tráng (Trầm Ấm, Uy Nghiêm)' : 'Voice 4: Resonant Male Heroic (Dignified & Epic)',
    };

    setActiveVoiceTitle(voiceLabels[dialect] || voiceLabels['bac-bo']);

    try {
      // 1. Try Gemini High-Fidelity Regional Voice API
      const res = await fetch('/api/tts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: generatedStory.story,
          dialect,
          language,
        }),
      });

      const data = await res.json();

      if (data.success && data.audioDataUrl) {
        if (!audioElementRef.current) {
          audioElementRef.current = new Audio();
        }
        const audio = audioElementRef.current;
        audio.src = data.audioDataUrl;
        audio.playbackRate = playbackRate;

        audio.onloadedmetadata = () => {
          setAudioDuration(audio.duration || 0);
        };

        audio.ontimeupdate = () => {
          if (audio.duration) {
            setAudioCurrentTime(audio.currentTime);
            setAudioProgress((audio.currentTime / audio.duration) * 100);
          }
        };

        audio.onended = () => {
          setIsPlayingAudio(false);
          setAudioProgress(0);
        };

        audio.onerror = () => {
          fallbackToWebSpeech();
        };

        await audio.play();
        setAudioEngine('gemini-tts');
        if (data.voiceTitle) setActiveVoiceTitle(data.voiceTitle);
        setIsPlayingAudio(true);
        setAudioLoading(false);
        return;
      }
    } catch (err) {
      console.warn('Gemini TTS fallback invoked:', err);
    }

    // 2. Intelligent Fallback: 4 Completely Distinct Voice Configurations with Wide Pitch & Tempo Spreads
    fallbackToWebSpeech();
  };

  const fallbackToWebSpeech = () => {
    if (!generatedStory || !('speechSynthesis' in window)) {
      setAudioLoading(false);
      return;
    }

    window.speechSynthesis.cancel();

    // Distinct regional opening salutations & vernacular framing so accents are immediately recognizable
    let spokenText = generatedStory.story;
    if (language === 'vi') {
      if (dialect === 'bac-bo') {
        spokenText = `Dạ kính thưa quý vị, xin kính mời cùng lắng nghe câu chuyện di sản chốn kinh kỳ Thăng Long ngàn năm văn vật. ${generatedStory.story}`;
      } else if (dialect === 'trung-bo') {
        spokenText = `Dạ thưa quý anh chị cùng các mạ, xin gửi gắm khúc ru Cố đô tha thiết êm đềm bên dòng sông Hương xứ Huế. ${generatedStory.story}`;
      } else if (dialect === 'nam-bo') {
        spokenText = `Dạ thưa bà con cô bác mình nghen, mời bà con cùng nghe câu chuyện miệt vườn ngọt ngào nghĩa tình sông nước Cửu Long. ${generatedStory.story}`;
      } else if (dialect === 'modern-genz') {
        spokenText = `Kính thưa đồng bào, cùng bước vào hành trình tự hào khám phá hào khí non sông và báu vật lịch sử ngàn năm của dân tộc ta! ${generatedStory.story}`;
      }
    }

    const utterance = new SpeechSynthesisUtterance(spokenText);
    utterance.lang = language === 'vi' ? 'vi-VN' : 'en-US';

    // Find available browser voices
    const voices = window.speechSynthesis.getVoices();
    const viVoices = voices.filter(v => 
      v.lang.startsWith('vi') || 
      v.lang.includes('VN') || 
      v.name.toLowerCase().includes('vietnam') || 
      v.name.toLowerCase().includes('vietnamese')
    );

    // Assign specific distinct voices if multi-voice system detected
    if (viVoices.length > 0) {
      if (dialect === 'trung-bo' && viVoices.length > 1) {
        // Voice 2: Hue (Female voice)
        utterance.voice = viVoices[1];
      } else if (dialect === 'nam-bo' && viVoices.length > 2) {
        // Voice 3: Southern (Warm female voice)
        utterance.voice = viVoices[2];
      } else if (dialect === 'modern-genz' && viVoices.length > 0) {
        // Voice 4: Resonant Male voice
        utterance.voice = viVoices[0];
      } else {
        utterance.voice = viVoices[0];
      }
    }

    // High-contrast acoustic parameter calibration as requested:
    // Giọng 1 (Nữ Bắc Bộ) và Giọng 3 (Nữ Nam Bộ) phân định hoàn toàn khác biệt âm vực và ngữ điệu
    // Giọng 2 (Nữ Cố Đô Huế) tinh chỉnh tốc độ tự nhiên, êm dịu, không bị chậm
    // Giọng 4: Giọng Nam Hùng Tráng (Trầm Ấm, Uy Nghiêm)
    if (dialect === 'bac-bo') {
      // Giọng 1: Nữ Bắc Bộ - Chuẩn Hà Nội, thanh tao, nhẹ nhàng, đĩnh đạc
      utterance.pitch = 1.18;
      utterance.rate = 0.98 * playbackRate;
    } else if (dialect === 'trung-bo') {
      // Giọng 2: Nữ Cố Đô Huế - Trữ tình Hương Giang, ngọt ngào, êm dịu, tốc độ tự nhiên
      utterance.pitch = 1.25;
      utterance.rate = 0.96 * playbackRate;
    } else if (dialect === 'nam-bo') {
      // Giọng 3: Nữ Nam Bộ - Mộc mạc, ngọt ngào sông nước miền Tây, nhịp điệu tươi tắn
      utterance.pitch = 0.95;
      utterance.rate = 1.05 * playbackRate;
    } else {
      // Giọng 4: Giọng Nam Hùng Tráng (Trầm Ấm, Uy Nghiêm) - Deep male baritone, heroic resonance
      utterance.pitch = 0.70;
      utterance.rate = 0.92 * playbackRate;
    }

    utterance.onstart = () => {
      setAudioEngine('webspeech');
      setIsPlayingAudio(true);
      setAudioLoading(false);
    };

    utterance.onend = () => {
      setIsPlayingAudio(false);
      setAudioProgress(0);
    };

    utterance.onerror = () => {
      setIsPlayingAudio(false);
      setAudioLoading(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  // Toggle playback speed
  const cyclePlaybackRate = () => {
    const nextRate = playbackRate === 1.0 ? 1.2 : playbackRate === 1.2 ? 0.85 : 1.0;
    setPlaybackRate(nextRate);
    if (audioElementRef.current) {
      audioElementRef.current.playbackRate = nextRate;
    }
  };

  // Seek audio bar
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPercent = parseFloat(e.target.value);
    setAudioProgress(newPercent);
    if (audioElementRef.current && audioDuration) {
      audioElementRef.current.currentTime = (newPercent / 100) * audioDuration;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Grounded Chat with Trust Gemini Toggle
  const handleSendChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim() || chatLoading) return;

    const userText = chatQuery.trim();
    setChatQuery('');
    setChatHistory(prev => [...prev, { sender: 'user', text: userText }]);
    setChatLoading(true);

    try {
      const res = await fetch('/api/chat/grounded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: userText,
          language,
          activeHeritageId: selectedHeritage.id,
          trustGemini,
        }),
      });
      const data = await res.json();
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: data.answer || 'Không tìm thấy dữ liệu xác thực.',
          sources: data.groundedSources || [],
          trustGeminiUsed: trustGemini,
        },
      ]);
    } catch (err) {
      setChatHistory(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: language === 'vi' ? 'Lỗi kết nối đến máy chủ tri thức.' : 'Could not connect to the knowledge server.',
        },
      ]);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-14">
      
      {/* Top Banner: Cultural Atmosphere with Authentic Dong Son / Au Lac Bronze Drum */}
      <div className="relative rounded-3xl bg-stone-950 border border-amber-900/60 p-6 sm:p-10 shadow-2xl text-stone-100 min-h-[280px] sm:min-h-[320px] flex items-center z-30">
        
        {/* Background Atmosphere Lights & Bronze Drum (contained in an inner overflow-hidden layer) */}
        <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/15 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-96 h-96 bg-red-900/15 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-lacquer-pattern opacity-15" />
          {/* Trống đồng Đông Sơn / Âu Lạc Background Art */}
          <div className="absolute -right-20 sm:-right-10 md:right-4 lg:right-8 top-1/2 -translate-y-1/2 w-[340px] sm:w-[440px] md:w-[500px] lg:w-[560px] h-[340px] sm:h-[440px] md:h-[500px] lg:h-[560px] opacity-40 sm:opacity-50 lg:opacity-75 transition-opacity">
            <DongSonDrum size="100%" opacity={0.85} animate={true} />
          </div>
        </div>

        <div className="relative z-10 max-w-2xl lg:max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>{language === 'vi' ? 'Trải nghiệm Kể chuyện Đa phương ngữ • Trống Đồng Âu Lạc' : 'Multilingual Storytelling • Au Lac Bronze Heritage'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-heritage tracking-tight text-amber-50 leading-[1.15] drop-shadow-md">
            {language === 'vi' ? 'Hồn Thiêng Di Sản Việt' : 'Living Heritage of Vietnam'}
          </h1>

          <p className="text-stone-200 text-sm sm:text-base leading-relaxed max-w-xl font-normal drop-shadow-xs">
            {language === 'vi'
              ? 'Lắng nghe những câu chuyện văn hóa trầm bổng bằng 4 ngữ điệu bản sắc, ngắm bảo vật 3D AR và khám phá cội nguồn ngàn năm lịch sử.'
              : 'Listen to folklore narratives in authentic regional dialects, explore 3D AR national treasures, and immerse in millennia of living heritage.'}
          </p>

          {/* Hero Heritage Search Bar with Floating Non-Clipped Dropdown */}
          <div ref={searchContainerRef} className="relative w-full max-w-xl pt-1 z-50">
            <div className="relative flex items-center">
              <div className="absolute left-3.5 flex items-center pointer-events-none text-amber-400">
                <Search className={`w-4 h-4 ${isSearching ? 'animate-pulse text-amber-300' : ''}`} />
              </div>
              <input
                id="hero-heritage-search-input"
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchDropdownOpen(true);
                }}
                placeholder={
                  language === 'vi'
                    ? 'Tìm kiếm di sản, tỉnh thành, UNESCO, ca trù, gốm sứ...'
                    : 'Search heritages, provinces, UNESCO, folk arts, crafts...'
                }
                className="w-full pl-10 pr-20 py-3 rounded-2xl bg-stone-900/95 hover:bg-stone-900 focus:bg-stone-950 border-2 border-amber-500/50 focus:border-amber-400 text-stone-100 placeholder-stone-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 shadow-xl backdrop-blur-md transition-all"
              />
              <div className="absolute right-2.5 flex items-center gap-1.5">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setIsSearchDropdownOpen(false);
                    }}
                    className="p-1 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                    title={language === 'vi' ? 'Xóa tìm kiếm' : 'Clear search'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <span className="text-[10px] sm:text-[11px] font-bold text-amber-300 bg-amber-950/90 border border-amber-600/60 px-2 py-0.5 rounded-lg whitespace-nowrap shadow-sm">
                  {filteredHeritages.length} {language === 'vi' ? 'kết quả' : 'matches'}
                </span>
              </div>
            </div>

            {/* Instant Search Autocomplete & Results Dropdown (Floating cleanly over the Hero container) */}
            {isSearchDropdownOpen && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2.5 bg-stone-900/98 border-2 border-amber-500/70 rounded-2xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.95)] backdrop-blur-2xl z-[100] max-h-80 overflow-y-auto p-2 space-y-1.5 ring-2 ring-amber-500/20 scrollbar-thin scrollbar-thumb-amber-700">
                {filteredHeritages.length === 0 ? (
                  <div className="p-4 text-center text-xs text-stone-400">
                    {language === 'vi'
                      ? `Không tìm thấy di sản phù hợp với "${searchQuery}". Hãy thử từ khóa khác!`
                      : `No heritage found matching "${searchQuery}". Please try another keyword!`}
                  </div>
                ) : (
                  filteredHeritages.slice(0, 8).map((item) => (
                    <div
                      key={`search-res-${item.id}`}
                      onClick={() => {
                        setSelectedHeritage(item);
                        setGeneratedStory(null);
                        setIsSearchDropdownOpen(false);
                        const cardEl = document.getElementById(`heritage-card-${item.id}`);
                        if (cardEl) {
                          cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      className="p-2.5 rounded-xl hover:bg-amber-950/80 border border-transparent hover:border-amber-600/50 transition-all cursor-pointer flex items-center gap-3 text-left group bg-stone-950/50"
                    >
                      <img
                        src={item.heroImage}
                        alt={item.titleVi}
                        className="w-11 h-11 rounded-lg object-cover flex-shrink-0 border border-amber-900/80 group-hover:scale-105 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-amber-200 group-hover:text-amber-300 truncate">
                            {language === 'vi' ? item.titleVi : item.titleEn}
                          </span>
                          <span className="text-[9px] font-semibold text-amber-400 bg-amber-950 px-1.5 py-0.5 rounded border border-amber-800/60 shrink-0">
                            {item.province}
                          </span>
                          {item.unescoYear && (
                            <span className="text-[9px] font-bold bg-blue-950/80 text-blue-300 px-1.5 py-0.5 rounded border border-blue-700/50 shrink-0">
                              UNESCO {item.unescoYear}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-300 truncate mt-0.5">
                          {language === 'vi' ? item.summaryVi : item.summaryEn}
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-stone-500 group-hover:text-amber-400 flex-shrink-0 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Region Filters */}
          <div className="pt-2 flex flex-wrap gap-2 items-center">
            {[
              { id: 'all', labelVi: 'Tất cả vùng miền', labelEn: 'All Regions' },
              { id: 'north', labelVi: '🏮 Bắc Bộ (Kinh Bắc - Thăng Long)', labelEn: '🏮 Northern' },
              { id: 'central', labelVi: '👑 Trung Bộ (Cố đô - Phố Hội)', labelEn: '👑 Central' },
              { id: 'south', labelVi: '🚣 Nam Bộ (Sông nước Cửu Long)', labelEn: '🚣 Southern' },
            ].map((reg) => {
              const isActive = selectedRegion === reg.id;
              return (
                <button
                  key={reg.id}
                  onClick={() => handleSelectRegion(reg.id as any)}
                  className={`inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-md border border-amber-400/70'
                      : 'bg-stone-900/90 border border-stone-700/60 text-stone-300 hover:bg-stone-800 hover:text-amber-200'
                  }`}
                >
                  {language === 'vi' ? reg.labelVi : reg.labelEn}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Interactive Vietnam Heritage Geographical Map (Placed directly under Hero) */}
      <div id="vietnam-heritage-map-container" className="w-full">
        <VietnamHeritageMap
          heritages={heritages}
          selectedHeritageId={selectedHeritage.id}
          onSelectHeritage={(item) => {
            setSelectedHeritage(item);
            setGeneratedStory(null);
            stopAllAudio();
          }}
          onExploreAr={onExploreAr}
          language={language}
        />
      </div>

      {/* Main Grid: Heritage Selector & Story Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Heritage Cards List (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold font-heritage text-stone-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-700" />
              {language === 'vi' ? 'Danh mục Di sản' : 'Heritage Archive'}
            </h2>
            <div className="flex items-center gap-2">
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 bg-amber-100 hover:bg-amber-200 px-2 py-0.5 rounded-full transition-colors cursor-pointer"
                  title="Xóa bộ lọc tìm kiếm"
                >
                  <span>"{searchQuery}"</span>
                  <X className="w-3 h-3" />
                </button>
              )}
              <span className="text-xs font-semibold text-stone-500 bg-stone-200/80 px-2.5 py-0.5 rounded-full">
                {filteredHeritages.length} {language === 'vi' ? 'di sản' : 'items'}
              </span>
            </div>
          </div>

          <div className="space-y-3 min-h-[580px] max-h-[660px] overflow-y-auto pr-1.5 scrollbar-thin scrollbar-thumb-stone-300">
            {filteredHeritages.map((item) => {
              const isSelected = selectedHeritage.id === item.id;
              return (
                <div
                  key={item.id}
                  id={`heritage-card-${item.id}`}
                  onClick={() => {
                    setSelectedHeritage(item);
                    setGeneratedStory(null);
                  }}
                  className={`group p-3 sm:p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row gap-3 sm:gap-3.5 relative ${
                    isSelected
                      ? 'bg-amber-50/90 border-amber-500/80 shadow-md ring-1 ring-amber-500/40'
                      : 'bg-white border-stone-200 hover:border-amber-300 hover:bg-stone-50/80'
                  }`}
                >
                  <div className="relative w-full sm:w-20 h-32 sm:h-20 flex-shrink-0 rounded-xl overflow-hidden shadow-xs">
                    <img
                      src={item.heroImage}
                      alt={item.titleVi}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-1.5 right-1.5 sm:hidden flex items-center gap-1">
                      {item.arArtifactId && (
                        <span className="text-[9px] font-bold bg-amber-500/90 text-stone-950 px-1.5 py-0.5 rounded shadow-xs">
                          AR 3D
                        </span>
                      )}
                      {item.unescoYear && (
                        <span className="text-[9px] font-semibold bg-blue-600 text-white px-1.5 py-0.5 rounded shadow-xs">
                          UNESCO
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between gap-1.5 mb-1">
                        <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-800 truncate">
                          {item.province}
                        </span>
                        <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
                          {item.arArtifactId && (
                            <span className="text-[9px] font-bold bg-amber-500/20 text-amber-900 px-1.5 py-0.5 rounded border border-amber-500/30 whitespace-nowrap">
                              AR 3D
                            </span>
                          )}
                          {item.unescoYear && (
                            <span className="text-[9px] font-semibold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded whitespace-nowrap">
                              UNESCO
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-sm font-bold text-stone-900 group-hover:text-amber-700 line-clamp-1">
                        {language === 'vi' ? item.titleVi : item.titleEn}
                      </h3>

                      <p className="text-xs text-stone-600 line-clamp-2 mt-1 leading-relaxed">
                        {language === 'vi' ? item.summaryVi : item.summaryEn}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailModalHeritage(item);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-red-50 text-red-700 hover:bg-red-100 transition-colors"
                        title={language === 'vi' ? 'Xem Video tài liệu & Âm nhạc' : 'Watch Video & Folk Music'}
                      >
                        <Video className="w-2.5 h-2.5" />
                        <Music className="w-2.5 h-2.5" />
                        <span>{language === 'vi' ? 'Video & Nhạc' : 'Video & Music'}</span>
                      </button>

                      {item.arArtifactId && onExploreAr && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onExploreAr(item);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-amber-100 text-amber-900 hover:bg-amber-200 transition-colors"
                          title={language === 'vi' ? 'Mô hình 3D AR' : '3D AR Model'}
                        >
                          <Sparkles className="w-2.5 h-2.5 text-amber-700" />
                          <span>3D</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Story Generator & Cultural Stage (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Active Heritage Spotlight Card */}
          <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm p-6 sm:p-8 space-y-6">
            
            {/* Header of Active Heritage */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-700">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{selectedHeritage.province}</span>
                  <span>•</span>
                  <span>{selectedHeritage.category.toUpperCase()}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold font-heritage text-stone-950 mt-1">
                  {language === 'vi' ? selectedHeritage.titleVi : selectedHeritage.titleEn}
                </h2>
              </div>

              {/* Action badges: Detail Modal (Video & Music), AR, Google Maps & UNESCO Shield */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setDetailModalHeritage(selectedHeritage)}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold px-3.5 py-1.5 rounded-2xl text-xs shadow-md cursor-pointer transition-all hover:scale-105"
                  title="Xem Phim tư liệu 4K & Phát Nhạc Di sản"
                >
                  <Video className="w-3.5 h-3.5" />
                  <Music className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'Xem Video & Nhạc Di sản' : 'Watch Video & Music'}</span>
                </button>

                {selectedHeritage.arArtifactId && onExploreAr && (
                  <button
                    onClick={() => onExploreAr(selectedHeritage)}
                    className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold px-3 py-1.5 rounded-2xl text-xs shadow-sm cursor-pointer transition-all hover:scale-105"
                    title="Mở Không gian Cổ vật 3D AR & Google Maps"
                  >
                    <Rotate3d className="w-3.5 h-3.5" />
                    <span>{language === 'vi' ? 'Cổ vật 3D' : '3D Artifact'}</span>
                  </button>
                )}

                {onExploreAr && (
                  <button
                    onClick={() => onExploreAr(selectedHeritage)}
                    className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold px-3 py-1.5 rounded-2xl text-xs shadow-sm cursor-pointer transition-all hover:scale-105 border border-amber-500/30"
                    title="Khám phá vị trí trên Google Maps trực quan"
                  >
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{language === 'vi' ? 'Google Maps' : 'Google Maps'}</span>
                  </button>
                )}

                <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-2xl text-xs font-semibold shadow-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'vi' ? 'Dữ liệu Thẩm định UNESCO' : 'UNESCO Grounded'}</span>
                </div>
              </div>
            </div>

            {/* 4 Distinct Dialect Voice Selector & Story Configuration */}
            <div className="bg-stone-50 rounded-2xl p-4 sm:p-5 border border-stone-200/80 space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Feather className="w-3.5 h-3.5 text-amber-700" />
                  {language === 'vi' ? '4 Giọng Đọc Độc Bản (Khác Biệt Hoàn Toàn Về Âm Sắc & Ngữ Điệu)' : '4 Distinct Regional Voice Profiles'}
                </label>
                <span className="text-[11px] text-amber-700 font-semibold bg-amber-100/80 px-2 py-0.5 rounded-full">
                  {language === 'vi' ? 'Âm sắc tương phản cao' : 'High Timbre Contrast'}
                </span>
              </div>

              {/* 4 Calibrated Voice Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                {[
                  { 
                    id: 'bac-bo', 
                    labelVi: 'Giọng 1: Nữ Bắc Bộ', 
                    actorVi: 'Thanh Lịch / Chuẩn Mực', 
                    descVi: 'Mực thước Thăng Long, giọng nữ thanh tao, nhẹ nhàng, đĩnh đạc', 
                    labelEn: 'Voice 1: Northern Female', 
                    actorEn: 'Graceful & Articulate', 
                    descEn: 'Articulate Hanoi cadence', 
                    icon: '🏮',
                  },
                  { 
                    id: 'trung-bo', 
                    labelVi: 'Giọng 2: Nữ Cố Đô Huế', 
                    actorVi: 'Nữ Hương Giang', 
                    descVi: 'Trữ tình Hương Giang, ngọt ngào, êm dịu, tốc độ tự nhiên', 
                    labelEn: 'Voice 2: Hue Royal Female', 
                    actorEn: 'Poetic & Melodic', 
                    descEn: 'Smooth & Natural tempo', 
                    icon: '👑',
                  },
                  { 
                    id: 'nam-bo', 
                    labelVi: 'Giọng 3: Nữ Nam Bộ', 
                    actorVi: 'Nữ Miệt Vườn', 
                    descVi: 'Phóng khoáng sông nước, ngọt ngào mộc mạc, nhịp điệu tươi tắn', 
                    labelEn: 'Voice 3: Southern Female', 
                    actorEn: 'Warm & Lyrical', 
                    descEn: 'Lively Mekong cadence', 
                    icon: '🚣',
                  },
                  { 
                    id: 'modern-genz', 
                    labelVi: 'Giọng 4: Nam Hùng Tráng', 
                    actorVi: 'Trầm Ấm, Uy Nghiêm', 
                    descVi: 'Hào khí non sông, âm vang trầm ấm, uy nghiêm và truyền cảm', 
                    labelEn: 'Voice 4: Resonant Male', 
                    actorEn: 'Dignified & Epic', 
                    descEn: 'Deep heroic baritone', 
                    icon: '✨',
                  },
                ].map((d) => {
                  const isSelected = dialect === d.id;
                  return (
                    <button
                      key={d.id}
                      onClick={() => {
                        stopAllAudio();
                        const newDialect = d.id as DialectStyle;
                        setDialect(newDialect);
                        const voiceLabels: Record<DialectStyle, string> = {
                          'bac-bo': language === 'vi' ? 'Giọng 1: Nữ Bắc Bộ (Hà Nội - Thanh Lịch, Chuẩn Mực)' : 'Voice 1: Northern Female (Graceful & Articulate)',
                          'trung-bo': language === 'vi' ? 'Giọng 2: Nữ Cố Đô Huế (Hương Giang - Trữ Tình, Êm Dịu)' : 'Voice 2: Central Hue Female (Poetic & Melodic)',
                          'nam-bo': language === 'vi' ? 'Giọng 3: Nữ Nam Bộ (Cửu Long - Ngọt Ngào, Mộc Mạc)' : 'Voice 3: Southern Female (Warm & Lyrical)',
                          'modern-genz': language === 'vi' ? 'Giọng 4: Giọng Nam Hùng Tráng (Trầm Ấm, Uy Nghiêm)' : 'Voice 4: Resonant Male Heroic (Dignified & Epic)',
                        };
                        setActiveVoiceTitle(voiceLabels[newDialect] || voiceLabels['bac-bo']);
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-stone-950 border-amber-500 shadow-md ring-2 ring-amber-400 font-semibold'
                          : 'bg-white border-stone-200/90 text-stone-700 hover:border-amber-400 hover:bg-amber-50/40'
                      }`}
                    >
                      <div className="space-y-1">
                        {/* Responsive Actor Badge Row with flex-wrap */}
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-sm flex-shrink-0">{d.icon}</span>
                            <span className="text-xs font-bold leading-tight truncate">{language === 'vi' ? d.labelVi : d.labelEn}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ${
                            isSelected ? 'bg-stone-950 text-amber-300' : 'bg-stone-100 text-stone-600'
                          }`}>
                            {language === 'vi' ? d.actorVi : d.actorEn}
                          </span>
                        </div>
                        <div className={`text-[11px] line-clamp-2 leading-relaxed ${
                          isSelected ? 'text-stone-950 font-medium' : 'text-stone-500'
                        }`}>
                          {language === 'vi' ? d.descVi : d.descEn}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Optional Custom Topic Focus */}
              <div>
                <input
                  type="text"
                  value={customFocus}
                  onChange={(e) => setCustomFocus(e.target.value)}
                  placeholder={
                    language === 'vi'
                      ? 'Gợi ý chủ đề chuyên sâu (vd: Tục kết chạ, Bí quyết men rạn, Đêm hát trăng rằm, Kỹ thuật đúc đồng...)'
                      : 'Custom focus (e.g. Secret glazes, Full-moon rituals, Master craftsmen, Bronze metallurgy...)'
                  }
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>

              {/* Generate Button */}
              <button
                id="btn-generate-story"
                onClick={handleGenerateStory}
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-stone-50 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-amber-200" />
                    <span>{language === 'vi' ? 'Đang thẩm định & sáng tác...' : 'Grounding & Composing Story...'}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>
                      {language === 'vi'
                        ? `Sáng tác Câu chuyện "${selectedHeritage.titleVi}"`
                        : `Generate Story for "${selectedHeritage.titleEn}"`}
                    </span>
                  </>
                )}
              </button>
            </div>

            {/* Render Story Area */}
            {generatedStory ? (
              <div className="bg-rice-paper rounded-2xl p-6 sm:p-8 border border-amber-900/20 space-y-6 relative shadow-inner">
                
                {/* Story Title & Audio Player Controller Bar */}
                <div className="space-y-3 border-b border-stone-200 pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h3 className="text-xl sm:text-2xl font-bold font-heritage text-stone-900">
                      {generatedStory.title}
                    </h3>

                    <button
                      onClick={toggleSpeech}
                      disabled={audioLoading}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer whitespace-nowrap ${
                        isPlayingAudio
                          ? 'bg-amber-600 text-stone-950 ring-2 ring-amber-400'
                          : 'bg-stone-950 text-amber-300 hover:bg-stone-900 hover:text-amber-200'
                      }`}
                    >
                      {audioLoading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin text-amber-300" />
                          <span>{language === 'vi' ? 'Đang tạo âm thanh...' : 'Synthesizing voice...'}</span>
                        </>
                      ) : isPlayingAudio ? (
                        <>
                          <Pause className="w-4 h-4" />
                          <span>{language === 'vi' ? 'Tạm dừng đọc' : 'Pause Audio'}</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 fill-amber-300" />
                          <span>{language === 'vi' ? 'Nghe diễn đọc AI' : 'Listen Narration'}</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Dynamic Audio Equalizer & Timbre Bar */}
                  <div className={`p-3 rounded-xl border transition-all ${
                    isPlayingAudio 
                      ? 'bg-stone-950 text-stone-100 border-amber-500/60 shadow-md' 
                      : 'bg-stone-100/80 text-stone-700 border-stone-200'
                  }`}>
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      {/* Left: Active Timbre & Sound Wave */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Radio className={`w-3.5 h-3.5 ${isPlayingAudio ? 'text-emerald-400 animate-pulse' : 'text-stone-400'}`} />
                          <span className="font-bold">{activeVoiceTitle}</span>
                        </div>
                        {audioEngine === 'gemini-tts' && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-black text-amber-300 border border-amber-500/40">
                            Gemini High-Fi
                          </span>
                        )}
                      </div>

                      {/* Right: Audio Waveform Equalizer & Speed Control */}
                      <div className="flex items-center gap-3">
                        {isPlayingAudio && (
                          <div className="flex items-center gap-0.5 h-4">
                            <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s] h-3" />
                            <span className="w-1 bg-amber-300 rounded-full animate-bounce [animation-delay:-0.15s] h-4" />
                            <span className="w-1 bg-amber-500 rounded-full animate-bounce h-2" />
                            <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.25s] h-3.5" />
                          </div>
                        )}

                        <button
                          onClick={cyclePlaybackRate}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold border cursor-pointer ${
                            isPlayingAudio 
                              ? 'bg-stone-800 text-amber-300 border-stone-700 hover:bg-stone-700' 
                              : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                          }`}
                          title="Điều chỉnh tốc độ đọc"
                        >
                          {playbackRate}x
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar (For High-Fidelity Audio Element) */}
                    {audioDuration > 0 && isPlayingAudio && (
                      <div className="mt-2.5 pt-2 border-t border-stone-800/80 flex items-center gap-2">
                        <span className="text-[10px] text-stone-400 font-mono">{formatTime(audioCurrentTime)}</span>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          step="0.1"
                          value={audioProgress}
                          onChange={handleSeek}
                          className="w-full h-1 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                        <span className="text-[10px] text-stone-400 font-mono">{formatTime(audioDuration)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Story Body */}
                <div className="text-stone-800 leading-relaxed text-base sm:text-lg font-serif">
                  <MarkdownRenderer content={generatedStory.story} />
                </div>

                {/* Key Takeaway Pill */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <Quote className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-xs font-bold text-amber-900 uppercase">
                      {language === 'vi' ? 'Thông điệp Di sản' : 'Heritage Essence'}
                    </div>
                    <div className="text-sm font-medium text-stone-800 italic mt-0.5">
                      "{generatedStory.keyTakeaway}"
                    </div>
                  </div>
                </div>

                {/* Citations & Verified Facts */}
                <div className="pt-4 border-t border-stone-200 space-y-3">
                  <div className="text-xs font-bold text-stone-600 uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    {language === 'vi' ? 'Cơ sở Dữ liệu & Nguồn thẩm định' : 'Verified Evidence & Official Sources'}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {generatedStory.sources.map((src, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 text-xs bg-white px-3 py-1 rounded-lg border border-stone-200 text-stone-700 shadow-2xs font-medium"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {src}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Pre-generation Default Overview */
              <div className="bg-stone-50/60 rounded-2xl p-6 border border-stone-200/80 space-y-4">
                <div className="text-sm font-bold text-stone-900 font-heritage flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-700" />
                  {language === 'vi' ? 'Tóm lược Hồ sơ Di sản' : 'Heritage Dossier Overview'}
                </div>
                <p className="text-stone-700 text-sm leading-relaxed">
                  {language === 'vi' ? selectedHeritage.summaryVi : selectedHeritage.summaryEn}
                </p>

                <div className="space-y-2 pt-2">
                  <div className="text-xs font-bold text-stone-600 uppercase">
                    {language === 'vi' ? 'Dữ kiện Lịch sử cốt lõi:' : 'Core Historical Grounding Facts:'}
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-700">
                    {selectedHeritage.groundedFacts.map((fact, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-amber-600 font-bold">•</span>
                        <span>{fact}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Section: Những người sẽ tới địa điểm này (Community & Travel Connect) */}
          <CommunityTravelers heritage={selectedHeritage} language={language} />
        </div>
      </div>

      {/* Heritage Detail & Music / YouTube Modal */}
      <HeritageDetailModal
        heritage={detailModalHeritage}
        isOpen={Boolean(detailModalHeritage)}
        onClose={() => setDetailModalHeritage(null)}
        language={language}
        onExploreAr={onExploreAr}
      />
    </div>
  );
};
