import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export const BackgroundMusic: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  // Track whether we've received first user interaction to unlock autoplay
  const autoplayUnlockedRef = useRef(false);
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load YouTube API script
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    // Listen for the first user interaction to unlock autoplay
    const unlockAutoplay = () => {
      if (autoplayUnlockedRef.current) return;
      autoplayUnlockedRef.current = true;
      // If the player is ready but not yet playing, start it now
      if (playerRef.current && playerRef.current.playVideo) {
        try {
          playerRef.current.playVideo();
        } catch (_) {
          // ignore
        }
      }
      document.removeEventListener('click', unlockAutoplay);
      document.removeEventListener('keydown', unlockAutoplay);
      document.removeEventListener('touchstart', unlockAutoplay);
    };

    document.addEventListener('click', unlockAutoplay, { once: true });
    document.addEventListener('keydown', unlockAutoplay, { once: true });
    document.addEventListener('touchstart', unlockAutoplay, { once: true });

    return () => {
      document.removeEventListener('click', unlockAutoplay);
      document.removeEventListener('keydown', unlockAutoplay);
      document.removeEventListener('touchstart', unlockAutoplay);
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      // Clean up the container
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, []);

  const initPlayer = () => {
    if (!containerRef.current) return;
    
    // Ensure clean state before initializing
    containerRef.current.innerHTML = '';
    const div = document.createElement('div');
    div.id = 'youtube-audio-player';
    containerRef.current.appendChild(div);

    playerRef.current = new window.YT.Player('youtube-audio-player', {
      height: '0',
      width: '0',
      videoId: 'NCPCoAtCqfc',
      playerVars: {
        autoplay: 1,
        loop: 1,
        playlist: 'NCPCoAtCqfc',
        controls: 0,
        showinfo: 0,
        autohide: 1,
        modestbranding: 1,
        mute: 0,
      },
      events: {
        onReady: (event: any) => {
          setIsReady(true);
          event.target.setVolume(50);
          // Try to play immediately; if autoplay is blocked, the
          // unlockAutoplay listener above will start it on first interaction.
          try {
            event.target.playVideo();
          } catch (_) {
            // Autoplay blocked — will be unlocked on first user interaction
          }
          
          // Check if it's actually playing after a short delay
          setTimeout(() => {
            const state = event.target.getPlayerState();
            if (state === 1) { // 1 = playing
              setIsPlaying(true);
            }
          }, 1200);
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true);
          } else if (
            event.data === window.YT.PlayerState.PAUSED ||
            event.data === window.YT.PlayerState.ENDED
          ) {
            setIsPlaying(false);
          }
        }
      }
    });
  };

  const togglePlay = () => {
    if (!isReady || !playerRef.current || !playerRef.current.playVideo) return;
    autoplayUnlockedRef.current = true;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  return (
    <>
      <div ref={containerRef} className="hidden"></div>
      
      {/* z-[60] keeps it below the chat modal (z-50 for button, z-[110] for open drawer) */}
      <button
        onClick={togglePlay}
        className={`fixed bottom-6 right-20 z-[60] w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all ${
          isPlaying 
            ? 'bg-amber-500/90 text-stone-950 hover:bg-amber-500 hover:scale-110' 
            : 'bg-stone-800/90 text-stone-400 hover:text-stone-200 border border-stone-700 hover:scale-110'
        }`}
        title={isPlaying ? "Tắt nhạc nền" : "Bật nhạc nền"}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 animate-pulse" />
        ) : (
          <VolumeX className="w-5 h-5" />
        )}
      </button>
    </>
  );
};
