import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { 
  Camera, 
  Rotate3d, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Download, 
  Sparkles, 
  Info, 
  Volume2, 
  VolumeX, 
  Layers, 
  Eye, 
  RefreshCw, 
  ShieldCheck, 
  Compass, 
  ChevronRight,
  ChevronLeft,
  Sun,
  Crown,
  Flame,
  Music,
  Share2,
  MapPin,
  Map,
  Navigation,
  ExternalLink,
  Search,
  CheckCircle2
} from 'lucide-react';
import { AR_ARTIFACTS, INITIAL_HERITAGE_ITEMS } from '../data/heritageKnowledge';
import { ArArtifact, ArHotspot, Language, HeritageItem } from '../types';
import { buildArtifactGeometry } from '../utils/artifact3dModels';

interface ArHeritageExperienceProps {
  language: Language;
  initialArtifactId?: string;
  onClose?: () => void;
  heritages?: HeritageItem[];
}

export const ArHeritageExperience: React.FC<ArHeritageExperienceProps> = ({
  language,
  initialArtifactId = 'trong-dong',
  onClose,
  heritages = INITIAL_HERITAGE_ITEMS,
}) => {
  const [experienceMode, setExperienceMode] = useState<'3d' | 'map'>('3d');
  const [selectedArtifactId, setSelectedArtifactId] = useState<string>(initialArtifactId);
  const [selectedMapHeritage, setSelectedMapHeritage] = useState<HeritageItem>(
    heritages.find(h => h.arArtifactId === initialArtifactId) || heritages[0] || INITIAL_HERITAGE_ITEMS[0]
  );
  const [mapRegionFilter, setMapRegionFilter] = useState<'all' | 'north' | 'central' | 'south'>('all');
  const [mapSearchQuery, setMapSearchQuery] = useState<string>('');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  const [isCameraActive, setIsCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [activeHotspot, setActiveHotspot] = useState<ArHotspot | null>(null);
  const [scale, setScale] = useState<number>(1.0);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [isHologramMode, setIsHologramMode] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [snapshotTaken, setSnapshotTaken] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const artifactScrollRef = useRef<HTMLDivElement>(null);
  
  // Three.js internal references
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const modelGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);
  const previousMousePositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const currentArtifact = AR_ARTIFACTS.find((a) => a.id === selectedArtifactId) || AR_ARTIFACTS[0];

  const scrollArtifacts = (direction: 'left' | 'right') => {
    if (artifactScrollRef.current) {
      const scrollAmount = direction === 'left' ? -240 : 240;
      artifactScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Initialize Three.js Scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0.4, 4.0);
    camera.lookAt(0, 0.35, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.3);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xfff5e6, 2.6);
    mainLight.position.set(5, 9, 5);
    mainLight.castShadow = true;
    scene.add(mainLight);

    const goldAccentLight = new THREE.PointLight(0xf59e0b, 3.2, 12);
    goldAccentLight.position.set(-3, 3, -2);
    scene.add(goldAccentLight);

    const bottomGlowLight = new THREE.PointLight(0xd97706, 1.8, 8);
    bottomGlowLight.position.set(0, -2, 2);
    scene.add(bottomGlowLight);

    // Root Group for artifact - Elevated higher into the upper-center visual focal zone
    const modelGroup = new THREE.Group();
    modelGroup.position.set(0, 0.38, 0);
    scene.add(modelGroup);
    modelGroupRef.current = modelGroup;

    // Load initial 3D geometry
    buildArtifactGeometry(selectedArtifactId, modelGroup, isHologramMode);

    // Render loop
    const animate = () => {
      animationFrameId.current = requestAnimationFrame(animate);

      if (modelGroupRef.current && autoRotate && !isDraggingRef.current) {
        modelGroupRef.current.rotation.y += 0.008;
      }

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!containerRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  // Update geometry when artifact or hologram mode changes
  useEffect(() => {
    if (modelGroupRef.current) {
      buildArtifactGeometry(selectedArtifactId, modelGroupRef.current, isHologramMode);
      setActiveHotspot(null);
    }
  }, [selectedArtifactId, isHologramMode]);

  // Update scale
  useEffect(() => {
    if (modelGroupRef.current) {
      modelGroupRef.current.scale.set(scale, scale, scale);
    }
  }, [scale]);

  // Camera video stream management
  const toggleCamera = async () => {
    if (isCameraActive) {
      // Stop Camera
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraActive(false);
      setCameraError(null);
    } else {
      // Start Camera
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        setIsCameraActive(true);
      } catch (err: any) {
        console.warn('Camera access issue:', err);
        setCameraError(
          language === 'vi'
            ? 'Không thể mở camera. Vui lòng cấp quyền truy cập Camera trên trình duyệt để trải nghiệm AR thực tế.'
            : 'Unable to access device camera. Please grant camera permission to use Augmented Reality view.'
        );
      }
    }
  };

  // Cleanup camera stream on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // Mouse & Touch Drag Controls for 360 rotation
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || !modelGroupRef.current) return;
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;

    modelGroupRef.current.rotation.y += deltaX * 0.008;
    modelGroupRef.current.rotation.x += deltaY * 0.008;

    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      isDraggingRef.current = true;
      previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDraggingRef.current || !modelGroupRef.current || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - previousMousePositionRef.current.x;
    const deltaY = e.touches[0].clientY - previousMousePositionRef.current.y;

    modelGroupRef.current.rotation.y += deltaX * 0.01;
    modelGroupRef.current.rotation.x += deltaY * 0.01;

    previousMousePositionRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = () => {
    isDraggingRef.current = false;
  };

  // Capture AR Snapshot
  const captureSnapshot = () => {
    if (!canvasRef.current) return;

    // Create a temporary high-res canvas
    const tempCanvas = document.createElement('canvas');
    const width = canvasRef.current.width;
    const height = canvasRef.current.height;
    tempCanvas.width = width;
    tempCanvas.height = height;
    const ctx = tempCanvas.getContext('2d');
    if (!ctx) return;

    // If camera is active, draw camera frame first
    if (isCameraActive && videoRef.current) {
      ctx.drawImage(videoRef.current, 0, 0, width, height);
    } else {
      // Dark museum gradient background
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, '#0c0a09');
      grad.addColorStop(1, '#1c1917');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    }

    // Overlay 3D WebGL canvas
    ctx.drawImage(canvasRef.current, 0, 0, width, height);

    // Add HeritageVibe AR Watermark Stamp
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.roundRect(20, height - 70, 320, 50, 12);
    ctx.fill();

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('HeritageVibe AR • Di sản Việt Nam', 35, height - 42);

    ctx.font = '12px sans-serif';
    ctx.fillStyle = '#f4f4f5';
    ctx.fillText(currentArtifact.nameVi, 35, height - 26);

    const dataUrl = tempCanvas.toDataURL('image/png');
    setSnapshotTaken(dataUrl);
  };

  return (
    <div className="w-full bg-stone-950 text-stone-100 rounded-3xl border border-amber-900/40 shadow-2xl overflow-hidden flex flex-col min-h-[640px]">
      
      {/* Top Bar: Title, Mode Tabs & Controls */}
      <div className="bg-stone-900/90 backdrop-blur-md px-4 sm:px-6 py-3.5 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 p-0.5 flex items-center justify-center shadow-md">
            <div className="w-full h-full bg-stone-950 rounded-[10px] flex items-center justify-center">
              {experienceMode === '3d' ? (
                <Rotate3d className="w-5 h-5 text-amber-400 animate-spin-slow" />
              ) : (
                <MapPin className="w-5 h-5 text-amber-400 animate-bounce" />
              )}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold font-heritage text-amber-100">
                {experienceMode === '3d'
                  ? (language === 'vi' ? 'Bảo Tàng Cổ Vật 3D & Thực Tế Ảo' : 'Heritage 3D & AR Museum')
                  : (language === 'vi' ? 'Khám Phá Danh Lam & Làng Nghề (Google Maps)' : 'Heritage & Artisan Google Maps Explorer')}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {experienceMode === '3d'
                  ? (language === 'vi' ? 'Tương Tác 360°' : 'Interactive 3D')
                  : (language === 'vi' ? 'Google Maps Trực Quan' : 'Live Google Maps')}
              </span>
            </div>
            <p className="text-xs text-stone-400">
              {experienceMode === '3d'
                ? (language === 'vi' ? currentArtifact.subtitleVi : currentArtifact.subtitleEn)
                : (language === 'vi' ? 'Quan sát vị trí địa lý thực tế 25 di sản & làng nghề truyền thống cả 3 miền' : 'Explore exact geographic locations of 25 UNESCO heritages & artisan villages')}
            </p>
          </div>
        </div>

        {/* Action Controls & Mode Switcher */}
        <div className="flex items-center gap-2">
          {/* Mode Switcher Tabs */}
          <div className="flex items-center bg-stone-950 p-1 rounded-xl border border-stone-800">
            <button
              onClick={() => setExperienceMode('3d')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                experienceMode === '3d'
                  ? 'bg-amber-500 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Rotate3d className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Cổ vật 3D / AR' : '3D / AR'}</span>
            </button>
            <button
              onClick={() => setExperienceMode('map')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                experienceMode === 'map'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-stone-950 shadow-md'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Google Maps' : 'Google Maps'}</span>
            </button>
          </div>

          {experienceMode === '3d' && (
            <>
              {/* Camera AR Toggle Button */}
              <button
                onClick={toggleCamera}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md ${
                  isCameraActive
                    ? 'bg-red-600 hover:bg-red-700 text-white'
                    : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{isCameraActive ? (language === 'vi' ? 'Tắt Camera AR' : 'Stop Camera') : (language === 'vi' ? 'Bật Camera AR' : 'Live Camera AR')}</span>
              </button>

              {/* Gold Effect Toggle */}
              <button
                onClick={() => setIsHologramMode(!isHologramMode)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                  isHologramMode
                    ? 'bg-amber-500/20 border-amber-400 text-amber-200'
                    : 'bg-stone-800 border-stone-700 text-stone-300 hover:text-stone-100'
                }`}
                title="Toggle Gold Effect"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">{language === 'vi' ? 'Ánh Kim' : 'Gold Luster'}</span>
              </button>
            </>
          )}

          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
            >
              {language === 'vi' ? 'Đóng' : 'Close'}
            </button>
          )}
        </div>
      </div>

      {/* VIEW MODE 1: 3D AR Artifact Experience */}
      {experienceMode === '3d' && (
        <>
          {/* Artifact Selection Strip with Left/Right Scroll Controls */}
          <div className="bg-stone-900/80 px-2 sm:px-4 py-2 border-b border-stone-800 flex items-center gap-1.5 relative group">
            {/* Scroll Left Button */}
            <button
              onClick={() => scrollArtifacts('left')}
              className="p-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer flex-shrink-0 shadow-sm"
              title="Cuộn sang trái"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Scrollable Strip */}
            <div
              ref={artifactScrollRef}
              className="flex-1 flex items-center gap-2 overflow-x-auto scroll-smooth py-1 px-1 touch-pan-x scrollbar-thin scrollbar-thumb-stone-700"
              style={{ scrollbarWidth: 'thin' }}
            >
              {AR_ARTIFACTS.map((artifact) => {
                const isSelected = artifact.id === selectedArtifactId;
                const emoji =
                  artifact.id === 'trong-dong' ? '🪘' :
                  artifact.id === 'binh-gom' ? '🏺' :
                  artifact.id === 'den-long' ? '🏮' :
                  artifact.id === 'kim-bao' ? '👑' :
                  artifact.id === 'dan-kim' ? '🎸' :
                  artifact.id === 'non-la' ? '👒' :
                  artifact.id === 'dan-bau' ? '🎻' :
                  artifact.id === 'khue-van-cac' ? '🏛️' :
                  artifact.id === 'thuyen-rong' ? '🛶' : '🗿';

                return (
                  <button
                    key={artifact.id}
                    onClick={() => setSelectedArtifactId(artifact.id)}
                    className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                      isSelected
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-bold shadow-md shadow-amber-500/25 scale-[1.02]'
                        : 'bg-stone-800/80 text-stone-200 hover:bg-stone-800 hover:text-amber-300 border border-stone-700/60'
                    }`}
                  >
                    <span className="text-sm">{emoji}</span>
                    <span>{language === 'vi' ? artifact.nameVi.split('(')[0].trim() : artifact.nameEn.split('(')[0].trim()}</span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Right Button */}
            <button
              onClick={() => scrollArtifacts('right')}
              className="p-1.5 rounded-xl bg-stone-800/90 hover:bg-stone-700 text-stone-300 hover:text-white transition-colors cursor-pointer flex-shrink-0 shadow-sm"
              title="Cuộn sang phải"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Camera Access Error Alert */}
          {cameraError && (
            <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-200 flex items-center justify-between">
              <span>{cameraError}</span>
              <button onClick={() => setCameraError(null)} className="text-amber-400 font-bold ml-2">✕</button>
            </div>
          )}

          {/* Main 3D / AR Viewport */}
          <div
            ref={containerRef}
            className="relative flex-1 w-full h-[520px] sm:h-[600px] lg:h-[640px] bg-gradient-to-b from-stone-950 via-stone-900 to-stone-950 overflow-hidden cursor-grab active:cursor-grabbing select-none"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {/* Background Live Camera Video (when AR active) */}
            <video
              ref={videoRef}
              playsInline
              autoPlay
              muted
              className={`absolute inset-0 w-full h-full object-cover z-0 pointer-events-none transition-opacity duration-500 ${
                isCameraActive ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* 3D Three.js Canvas */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full z-10" />

            {/* AR Reticle & Scanning overlay */}
            {isCameraActive && (
              <div className="absolute inset-0 z-15 pointer-events-none flex items-center justify-center -translate-y-12">
                <div className="w-48 h-48 rounded-full border border-amber-400/40 border-dashed animate-spin-slow flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full border border-emerald-400/50 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  </div>
                </div>
                <div className="absolute bottom-16 w-80 h-32 border border-amber-500/20 rounded-[50%] transform rotate-x-60 opacity-60" />
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-stone-950/80 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-semibold text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 shadow-lg">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{language === 'vi' ? 'Đang nhận diện không gian thực tế để đặt cổ vật' : 'Scanning real environment surface for AR placement'}</span>
                </div>
              </div>
            )}

            {/* Top Left: 3D HUD & Rotation Instructions */}
            <div className="absolute top-4 left-4 z-20 flex flex-col gap-1.5 text-xs text-stone-300 bg-stone-900/80 backdrop-blur-md p-3 rounded-2xl border border-stone-800 pointer-events-none shadow-lg">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Rotate3d className="w-4 h-4" />
                <span>{language === 'vi' ? 'Xoay 360° & Phóng to thu nhỏ' : '360° Orbit & Pinch Zoom'}</span>
              </div>
              <p className="text-[11px] text-stone-400">
                {language === 'vi' ? 'Chạm & Kéo chuột để tương tác đa chiều' : 'Drag or swipe to rotate artifact in 3D'}
              </p>
            </div>

            {/* Floating Hotspots on Screen Overlay */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 max-w-xs">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider bg-stone-900/80 backdrop-blur-md px-2.5 py-1 rounded-xl border border-stone-800 self-end">
                {language === 'vi' ? 'Điểm Khảo Cổ Nổi Bật:' : 'Historical Highlights:'}
              </span>
              {currentArtifact.hotspots.map((hs, idx) => (
                <button
                  key={hs.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(activeHotspot?.id === hs.id ? null : hs);
                  }}
                  className={`text-left p-2.5 rounded-xl border text-xs backdrop-blur-md transition-all cursor-pointer ${
                    activeHotspot?.id === hs.id
                      ? 'bg-amber-500 text-stone-950 border-amber-400 font-bold shadow-lg'
                      : 'bg-stone-900/85 hover:bg-stone-850 text-stone-200 border-stone-700/80'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-amber-500/30 text-amber-300 text-[10px] flex items-center justify-center font-bold">
                      {idx + 1}
                    </span>
                    <span className="font-semibold truncate">{language === 'vi' ? hs.titleVi : hs.titleEn}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Hotspot Detailed Callout Popover */}
            {activeHotspot && (
              <div className="absolute bottom-20 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-md z-30 bg-stone-900/95 backdrop-blur-lg rounded-2xl p-4 border border-amber-500/50 shadow-2xl animate-fade-in">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1 rounded-lg bg-amber-500 text-stone-950">
                      <Sparkles className="w-3.5 h-3.5" />
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-amber-200">
                      {language === 'vi' ? activeHotspot.titleVi : activeHotspot.titleEn}
                    </h4>
                  </div>
                  <button
                    onClick={() => setActiveHotspot(null)}
                    className="text-stone-400 hover:text-stone-100 text-xs p-1"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                  {language === 'vi' ? activeHotspot.descVi : activeHotspot.descEn}
                </p>
              </div>
            )}

            {/* Bottom Floating Control Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-stone-900/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-stone-800 shadow-xl">
              {/* Zoom Out */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setScale((prev) => Math.max(0.5, prev - 0.15));
                }}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              {/* Scale Indicator */}
              <span className="text-xs font-bold text-amber-300 w-12 text-center select-none">
                {Math.round(scale * 100)}%
              </span>

              {/* Zoom In */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setScale((prev) => Math.min(2.5, prev + 0.15));
                }}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="w-px h-5 bg-stone-700 mx-1" />

              {/* Auto Rotation Toggle */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAutoRotate(!autoRotate);
                }}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  autoRotate ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-stone-800 text-stone-400'
                }`}
                title="Auto Rotate"
              >
                <Rotate3d className="w-4 h-4" />
              </button>

              {/* AR Photo Capture Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  captureSnapshot();
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 text-xs font-bold shadow-md shadow-amber-500/30 hover:brightness-110 transition-all cursor-pointer"
                title="Take AR Photo"
              >
                <Camera className="w-4 h-4 fill-stone-950" />
                <span>{language === 'vi' ? 'Chụp Ảnh AR' : 'Capture AR'}</span>
              </button>
            </div>
          </div>

          {/* Artifact Metadata Details Card */}
          <div className="bg-stone-900/90 p-4 sm:p-6 border-t border-stone-800 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                {language === 'vi' ? 'Thời kỳ & Niên đại' : 'Historical Era'}
              </span>
              <p className="text-xs font-semibold text-stone-100 mt-0.5">
                {language === 'vi' ? currentArtifact.eraVi : currentArtifact.eraEn}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                {language === 'vi' ? 'Chất liệu & Kỹ thuật' : 'Material & Craftsmanship'}
              </span>
              <p className="text-xs font-semibold text-stone-100 mt-0.5">
                {language === 'vi' ? currentArtifact.materialVi : currentArtifact.materialEn}
              </p>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                {language === 'vi' ? 'Bảo chứng & Ý nghĩa' : 'Cultural Signatures'}
              </span>
              <p className="text-xs font-semibold text-stone-100 mt-0.5 line-clamp-2">
                {language === 'vi' ? currentArtifact.descriptionVi : currentArtifact.descriptionEn}
              </p>
            </div>
          </div>
        </>
      )}

      {/* VIEW MODE 2: Google Maps Visual Explorer for 25 Heritages & Artisan Villages */}
      {experienceMode === 'map' && (
        <div className="flex-1 flex flex-col bg-stone-950">
          
          {/* Region Filter & Search Header */}
          <div className="bg-stone-900/80 px-4 sm:px-6 py-3 border-b border-stone-800 flex flex-wrap items-center justify-between gap-3">
            {/* Region Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              {[
                { id: 'all', labelVi: 'Toàn quốc (25 Di sản)', labelEn: 'All Vietnam (25)' },
                { id: 'north', labelVi: '🏮 Bắc Bộ (10)', labelEn: '🏮 Northern' },
                { id: 'central', labelVi: '👑 Trung Bộ (9)', labelEn: '👑 Central' },
                { id: 'south', labelVi: '🚣 Nam Bộ (6)', labelEn: '🚣 Southern' },
              ].map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => setMapRegionFilter(reg.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    mapRegionFilter === reg.id
                      ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                      : 'bg-stone-800/80 text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  {language === 'vi' ? reg.labelVi : reg.labelEn}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={mapSearchQuery}
                onChange={(e) => setMapSearchQuery(e.target.value)}
                placeholder={language === 'vi' ? 'Tìm di sản, tỉnh thành, làng nghề...' : 'Search heritage, province, craft...'}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-stone-900 text-xs text-stone-100 border border-stone-700/80 focus:border-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Map & Detail Split View */}
          <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 min-h-[560px]">
            
            {/* Left: Interactive Google Maps Iframe Frame (7 Cols) */}
            <div className="lg:col-span-7 relative h-[380px] sm:h-[450px] lg:h-full bg-stone-900 border-b lg:border-b-0 lg:border-r border-stone-800 flex flex-col">
              
              {/* Google Maps Direct Iframe Embed */}
              <iframe
                title={`Google Maps ${selectedMapHeritage.titleVi}`}
                src={`https://maps.google.com/maps?q=${selectedMapHeritage.coordinates.lat},${selectedMapHeritage.coordinates.lng}&hl=${language}&z=14&output=embed`}
                className="w-full h-full border-0 filter brightness-95 contrast-105"
                loading="lazy"
                allowFullScreen
              />

              {/* Floating Map Overlay Badge */}
              <div className="absolute top-3 left-3 z-10 bg-stone-950/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-amber-500/40 shadow-xl flex items-center gap-2.5 max-w-[85%] sm:max-w-md">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-bold text-sm flex-shrink-0">
                  📍
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-bold text-amber-200 truncate">
                    {language === 'vi' ? selectedMapHeritage.titleVi : selectedMapHeritage.titleEn}
                  </div>
                  <div className="text-[11px] text-stone-300 truncate">
                    {selectedMapHeritage.province} • {selectedMapHeritage.coordinates.lat.toFixed(4)}°N, {selectedMapHeritage.coordinates.lng.toFixed(4)}°E
                  </div>
                </div>
              </div>

              {/* Direct Open in Google Maps App Button */}
              <div className="absolute bottom-3 right-3 z-10">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((language === 'vi' ? selectedMapHeritage.titleVi : selectedMapHeritage.titleEn) + ' ' + selectedMapHeritage.province)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-stone-900/95 hover:bg-stone-850 text-amber-300 border border-amber-500/40 text-xs font-bold shadow-xl transition-all cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-amber-400" />
                  <span>{language === 'vi' ? 'Chỉ đường trên Google Maps' : 'Open in Google Maps'}</span>
                  <ExternalLink className="w-3 h-3 text-stone-400" />
                </a>
              </div>
            </div>

            {/* Right: Selected Heritage Details & 25 Heritage Directory (5 Cols) */}
            <div className="lg:col-span-5 p-4 sm:p-6 bg-stone-950 flex flex-col gap-4 max-h-[580px] overflow-y-auto pr-2">
              
              {/* Selected Heritage Information Card */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-amber-500/30 space-y-3 shadow-lg">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/15 px-2 py-0.5 rounded border border-amber-500/20">
                      {selectedMapHeritage.category === 'tangible' ? (language === 'vi' ? 'Di sản Vật thể' : 'Tangible') : (language === 'vi' ? 'Di sản Phi vật thể' : 'Intangible')} • {selectedMapHeritage.unescoYear ? `UNESCO ${selectedMapHeritage.unescoYear}` : (language === 'vi' ? 'Di sản Quốc gia' : 'National Heritage')}
                    </span>
                    <h3 className="text-base font-bold font-heritage text-stone-50 mt-1.5">
                      {language === 'vi' ? selectedMapHeritage.titleVi : selectedMapHeritage.titleEn}
                    </h3>
                  </div>
                  <span className="text-xl">
                    {selectedMapHeritage.region === 'north' ? '🏮' : selectedMapHeritage.region === 'central' ? '👑' : '🚣'}
                  </span>
                </div>

                <p className="text-xs text-stone-300 leading-relaxed">
                  {language === 'vi' ? selectedMapHeritage.summaryVi : selectedMapHeritage.summaryEn}
                </p>

                {/* Artisan & Village Highlight */}
                {selectedMapHeritage.artisanVillage && (
                  <div className="p-2.5 rounded-xl bg-stone-950/80 border border-amber-900/40 text-xs space-y-1">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <span>🏡</span>
                      <span>{language === 'vi' ? 'Làng nghề & Nghệ nhân truyền thống:' : 'Artisan Village & Masters:'}</span>
                    </div>
                    <p className="text-stone-300 text-[11px]">
                      {selectedMapHeritage.artisanVillage}
                    </p>
                  </div>
                )}

                {/* Switch to 3D if artifact available */}
                {selectedMapHeritage.arArtifactId && (
                  <button
                    onClick={() => {
                      if (selectedMapHeritage.arArtifactId) {
                        setSelectedArtifactId(selectedMapHeritage.arArtifactId);
                        setExperienceMode('3d');
                      }
                    }}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-all"
                  >
                    <Rotate3d className="w-3.5 h-3.5" />
                    <span>{language === 'vi' ? 'Xem Cổ vật 3D của Di sản này' : 'View 3D Artifact of this Heritage'}</span>
                  </button>
                )}
              </div>

              {/* List of 25 Heritages & Craft Sites */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-stone-400 px-1">
                  <span>{language === 'vi' ? 'Tọa độ Danh lam & Làng nghề:' : 'Heritage Site Coordinates:'}</span>
                  <span className="text-amber-400">
                    {heritages
                      .filter(h => mapRegionFilter === 'all' || h.region === mapRegionFilter)
                      .filter(h => !mapSearchQuery.trim() || h.titleVi.toLowerCase().includes(mapSearchQuery.toLowerCase()) || h.province.toLowerCase().includes(mapSearchQuery.toLowerCase()))
                      .length} {language === 'vi' ? 'địa điểm' : 'sites'}
                  </span>
                </div>

                {/* Fixed height scrollable coordinate list */}
                <div className="space-y-1.5 max-h-[260px] sm:max-h-[280px] overflow-y-auto pr-1.5 border border-stone-800/80 rounded-2xl p-2 bg-stone-950/90 shadow-inner">
                  {heritages
                    .filter(h => mapRegionFilter === 'all' || h.region === mapRegionFilter)
                    .filter(h => !mapSearchQuery.trim() || h.titleVi.toLowerCase().includes(mapSearchQuery.toLowerCase()) || h.province.toLowerCase().includes(mapSearchQuery.toLowerCase()))
                    .map((item) => {
                      const isSelected = item.id === selectedMapHeritage.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setSelectedMapHeritage(item)}
                          className={`p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-2 ${
                            isSelected
                              ? 'bg-amber-500/20 border-amber-400 text-amber-100 shadow-md ring-1 ring-amber-400/40'
                              : 'bg-stone-900/70 hover:bg-stone-900 border-stone-800 text-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="text-base flex-shrink-0">
                              {item.region === 'north' ? '🏮' : item.region === 'central' ? '👑' : '🚣'}
                            </span>
                            <div className="min-w-0">
                              <div className="font-semibold truncate text-stone-100">
                                {language === 'vi' ? item.titleVi : item.titleEn}
                              </div>
                              <div className="text-[10px] text-stone-400 truncate">
                                {item.province} {item.unescoYear ? `• UNESCO ${item.unescoYear}` : ''}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {item.arArtifactId && (
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                3D
                              </span>
                            )}
                            <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-stone-500'}`} />
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* Snapshot Download / Share Modal */}
      {snapshotTaken && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-stone-900 rounded-3xl p-5 border border-amber-500/40 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-amber-200 flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                {language === 'vi' ? 'Ảnh Chụp Di Sản Thực Tế Ảo' : 'Heritage Snapshot'}
              </h3>
              <button onClick={() => setSnapshotTaken(null)} className="text-stone-400 hover:text-stone-100 text-sm cursor-pointer">✕</button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-stone-800 shadow-inner">
              <img src={snapshotTaken} alt="AR Snapshot" className="w-full h-auto object-cover" />
            </div>

            <div className="flex items-center gap-2">
              <a
                href={snapshotTaken}
                download={`HeritageVibe-3D-${currentArtifact.id}.png`}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>{language === 'vi' ? 'Tải Ảnh Về Máy' : 'Download Photo'}</span>
              </a>
              <button
                onClick={() => setSnapshotTaken(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold cursor-pointer"
              >
                {language === 'vi' ? 'Đóng' : 'Close'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
