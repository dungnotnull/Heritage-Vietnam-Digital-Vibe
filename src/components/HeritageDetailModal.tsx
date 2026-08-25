import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { 
  X, 
  Play, 
  Pause, 
  Volume2, 
  Music, 
  Video, 
  ShieldCheck, 
  MapPin, 
  Calendar, 
  Rotate3d, 
  Share2, 
  Sparkles, 
  ExternalLink, 
  CheckCircle2, 
  Radio, 
  BookOpen, 
  Info,
  Maximize2
} from 'lucide-react';
import { HeritageItem, Language } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { VietnamFlag } from './VietnamFlag';
import { heritageAudio } from '../utils/heritageAudioSynth';

interface HeritageDetailModalProps {
  heritage: HeritageItem | null;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onExploreAr?: (heritage: HeritageItem) => void;
}

export const HeritageDetailModal: React.FC<HeritageDetailModalProps> = ({
  heritage,
  isOpen,
  onClose,
  language,
  onExploreAr,
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [musicProgress, setMusicProgress] = useState<number>(0);
  const [volume, setVolume] = useState<number>(0.7);
  const [activeMediaTab, setActiveMediaTab] = useState<'video' | 'music'>('video');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  useEffect(() => {
    // Subscribe to heritageAudio engine updates
    const unsubscribe = heritageAudio.subscribe((state) => {
      if (heritage && state.heritageId === heritage.id) {
        setIsPlayingMusic(state.isPlaying);
        setMusicProgress(state.progress);
      } else {
        setIsPlayingMusic(false);
        setMusicProgress(0);
      }
    });

    return () => {
      unsubscribe();
      heritageAudio.stop();
    };
  }, [heritage?.id, isOpen]);

  if (!isOpen || !heritage) return null;

  const isVi = language === 'vi';
  const music = heritage.musicTrack;
  const videoId = heritage.youtubeVideoId || 'Au6LqK1UH8g';
  const melodyInfo = heritageAudio.getMelodyForHeritage(heritage.id);

  const toggleMusic = () => {
    heritageAudio.toggle(heritage.id);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    heritageAudio.setVolume(val);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  const modalContent = (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-950/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100 bg-stone-50/90">
          <div className="flex items-center gap-2.5">
            <VietnamFlag size="sm" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                {heritage.province}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs font-semibold text-stone-600 uppercase">
                {heritage.category}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer text-xs flex items-center gap-1.5 font-medium"
              title="Chia sẻ di sản"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? (isVi ? 'Đã sao chép!' : 'Copied!') : (isVi ? 'Chia sẻ' : 'Share')}</span>
            </button>
            
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/80 transition-colors cursor-pointer"
              title="Đóng (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          
          {/* Header Title & Badges */}
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              {heritage.unescoYear && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>UNESCO {heritage.unescoYear}</span>
                </span>
              )}
              {heritage.nationalYear && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-bold border border-amber-200 shadow-2xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isVi ? `Di tích Quốc gia (${heritage.nationalYear})` : `National Monument (${heritage.nationalYear})`}</span>
                </span>
              )}
              {heritage.arArtifactId && onExploreAr && (
                <button
                  onClick={() => {
                    onClose();
                    onExploreAr(heritage);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-stone-950 text-xs font-bold shadow-xs hover:bg-amber-400 cursor-pointer transition-all hover:scale-105"
                >
                  <Rotate3d className="w-3.5 h-3.5" />
                  <span>{isVi ? 'Khám phá Cổ vật 3D AR' : 'Explore 3D AR'}</span>
                </button>
              )}
            </div>

            <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-stone-950 leading-tight">
              {isVi ? heritage.titleVi : heritage.titleEn}
            </h1>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              {isVi ? heritage.summaryVi : heritage.summaryEn}
            </p>
          </div>

          {/* Media Section: YouTube Embed & Music Player */}
          <div className="bg-stone-950 rounded-3xl overflow-hidden shadow-xl border border-stone-800 text-stone-100 space-y-4 p-4 sm:p-6">
            {/* Media Navigation Tabs */}
            <div className="flex items-center justify-between flex-wrap gap-2 border-b border-stone-800 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveMediaTab('video')}
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMediaTab === 'video'
                      ? 'bg-amber-500 text-stone-950 shadow-md'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Video className="w-4 h-4" />
                  <span>{isVi ? 'Phim Tư liệu 4K (YouTube)' : 'Documentary Video'}</span>
                </button>

                {music && (
                  <button
                    onClick={() => setActiveMediaTab('music')}
                    className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      activeMediaTab === 'music'
                        ? 'bg-amber-500 text-stone-950 shadow-md'
                        : 'bg-stone-900 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Music className="w-4 h-4" />
                    <span>{isVi ? 'Giai điệu Âm nhạc Di sản' : 'Heritage Music Track'}</span>
                    {isPlayingMusic && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-0.5" />
                    )}
                  </button>
                )}
              </div>

              {music && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={toggleMusic}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isPlayingMusic
                        ? 'bg-emerald-500 text-stone-950 ring-2 ring-emerald-400/50'
                        : 'bg-stone-800 text-amber-300 hover:bg-stone-700 hover:text-amber-200'
                    }`}
                  >
                    {isPlayingMusic ? (
                      <>
                        <Pause className="w-3.5 h-3.5" />
                        <span>{isVi ? 'Tạm dừng nhạc' : 'Pause Music'}</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-amber-300" />
                        <span>{isVi ? 'Phát nhạc di sản' : 'Play Music'}</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Tab 1: YouTube Video Embed */}
            {activeMediaTab === 'video' && (
              <div className="space-y-3">
                <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner border border-stone-800">
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                    title={isVi ? heritage.youtubeTitleVi || heritage.titleVi : heritage.youtubeTitleEn || heritage.titleEn}
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-stone-400 px-1">
                  <span className="truncate font-medium text-stone-300">
                    📺 {isVi ? heritage.youtubeTitleVi || `${heritage.titleVi} - Phim tài liệu Di sản` : heritage.youtubeTitleEn || `${heritage.titleEn} - Cultural Documentary`}
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 flex-shrink-0"
                  >
                    <span>{isVi ? 'Mở trên YouTube' : 'Open YouTube'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}

            {/* Tab 2: Contextual Music Player & Folk Melody */}
            {(activeMediaTab === 'music' || isPlayingMusic) && music && (
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-900 border border-amber-900/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                      isPlayingMusic ? 'bg-amber-500 text-stone-950 shadow-lg' : 'bg-stone-800 text-amber-400'
                    }`}>
                      <Music className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                          {isVi ? music.genreVi : music.genreEn}
                        </span>
                        <span className="px-2 py-0.5 rounded-md bg-amber-950/70 text-amber-300 text-[10px] font-semibold border border-amber-800/40">
                          {isVi ? melodyInfo.instrumentNameVi : melodyInfo.instrumentNameEn}
                        </span>
                      </div>
                      <h4 className="text-base font-bold text-stone-100 mt-0.5">
                        {isVi ? music.titleVi : music.titleEn}
                      </h4>
                      <p className="text-xs text-stone-400">
                        {isVi ? music.artistVi : music.artistEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-wrap">
                    {/* Visualizer Equalizer */}
                    {isPlayingMusic && (
                      <div className="flex items-center gap-1 h-5 px-2">
                        <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s] h-4" />
                        <span className="w-1 bg-amber-300 rounded-full animate-bounce [animation-delay:-0.15s] h-5" />
                        <span className="w-1 bg-amber-500 rounded-full animate-bounce h-3" />
                        <span className="w-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.25s] h-4.5" />
                      </div>
                    )}

                    {/* Volume Slider */}
                    <div className="flex items-center gap-1.5 bg-stone-950/60 px-2.5 py-1.5 rounded-xl border border-stone-800">
                      <Volume2 className="w-3.5 h-3.5 text-stone-400" />
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-16 h-1 bg-stone-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        title={isVi ? 'Âm lượng' : 'Volume'}
                      />
                    </div>

                    <button
                      onClick={toggleMusic}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-2 cursor-pointer shadow-md transition-all"
                    >
                      {isPlayingMusic ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-stone-950" />}
                      <span>{isPlayingMusic ? (isVi ? 'Tạm dừng' : 'Pause') : (isVi ? 'Phát Giai Điệu' : 'Play Melody')}</span>
                    </button>
                  </div>
                </div>

                {/* Live Progress Bar */}
                {isPlayingMusic && (
                  <div className="w-full bg-stone-950 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-amber-500 h-full transition-all duration-100 ease-linear rounded-full"
                      style={{ width: `${Math.round(musicProgress * 100)}%` }}
                    />
                  </div>
                )}

                <p className="text-xs text-stone-300 leading-relaxed font-serif bg-stone-950/60 p-3 rounded-xl border border-stone-800">
                  {isVi ? music.descriptionVi : music.descriptionEn}
                </p>

                <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                  <span className="text-[11px] text-amber-300/80 font-medium">
                    🎵 {isVi ? 'Âm thanh tổng hợp nhạc cụ cổ truyền Web Audio (Không lo gián đoạn)' : 'Real-time Web Audio Synthesizer (Instant & Offline-ready)'}
                  </span>
                  <a
                    href={`https://www.youtube.com/watch?v=${music.youtubeId || videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-amber-400 hover:text-amber-300 flex-shrink-0 text-[11px]"
                  >
                    <span>{isVi ? 'Xem biểu diễn trên YouTube' : 'Watch on YouTube'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            )}
          </div>

          {/* Dossier & Grounded Facts */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-stone-900 font-bold font-heritage text-lg border-b border-stone-200 pb-2">
              <BookOpen className="w-5 h-5 text-amber-700" />
              <span>{isVi ? 'Hồ sơ Thẩm định & Dữ kiện Lịch sử' : 'Verified Heritage Dossier & Core Facts'}</span>
            </div>

            <div className="space-y-2">
              {heritage.groundedFacts.map((fact, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs sm:text-sm text-stone-800 leading-relaxed">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span>{fact}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location, Artisan Village & Google Maps Link */}
          {heritage.artisanVillage && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-700" />
                  <span>{isVi ? 'Không gian Thực hành & Làng nghề' : 'Practice Space & Artisan Village'}</span>
                </div>
                <div className="text-sm font-semibold text-stone-900">
                  {heritage.artisanVillage}
                </div>
              </div>

              {heritage.coordinates && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${heritage.coordinates.lat},${heritage.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 text-xs font-bold cursor-pointer transition-all self-start sm:self-center shadow-xs"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{isVi ? 'Xem trên Google Maps' : 'View on Google Maps'}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          {/* Sources & References */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
              {isVi ? 'Nguồn lưu trữ:' : 'Sources:'}
            </span>
            {heritage.sources.map((src, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] bg-stone-100 text-stone-700 px-2.5 py-1 rounded-lg border border-stone-200"
              >
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>{src.name} ({src.authority})</span>
              </span>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <div className="text-xs text-stone-500 font-medium">
            HeritageVibe • {isVi ? 'Dữ liệu di sản chuẩn quốc gia' : 'National Grounded Heritage Data'}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-100 text-xs font-bold cursor-pointer transition-colors"
          >
            {isVi ? 'Đóng cửa sổ' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{isVi ? heritage.titleVi : heritage.titleEn} | HeritageVibe</title>
        <meta name="description" content={isVi ? heritage.summaryVi : heritage.summaryEn} />
        <meta property="og:title" content={isVi ? heritage.titleVi : heritage.titleEn} />
        <meta property="og:description" content={isVi ? heritage.summaryVi : heritage.summaryEn} />
        <meta property="og:image" content={heritage.heroImage} />
      </Helmet>
      {createPortal(modalContent, document.body)}
    </>
  );
};
