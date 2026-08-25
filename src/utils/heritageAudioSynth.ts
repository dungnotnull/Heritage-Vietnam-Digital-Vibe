/**
 * Web Audio Synthesizer for Authentic Vietnamese Traditional Musical Instruments
 * Provides 100% reliable, offline-capable, latency-free traditional music playback
 * for all UNESCO and National Heritages in HeritageVibe.
 */

type InstrumentType = 'dan-bau' | 'dan-tranh' | 'dan-nguyet' | 'cong-chieng' | 'trong-dong' | 'sao-truc' | 'khen-mong' | 'phach-ca-tru';

interface NoteEvent {
  note: number; // MIDI note number (e.g. 60 = C4, 69 = A4) or frequency in Hz if string
  duration: number; // in seconds
  instrument: InstrumentType;
  volume?: number;
  bend?: number; // microtonal bend for Dan Bau
  timeOffset: number; // in seconds from start
}

interface HeritageMelody {
  id: string;
  nameVi: string;
  nameEn: string;
  bpm: number;
  instrumentNameVi: string;
  instrumentNameEn: string;
  loopDuration: number;
  notes: NoteEvent[];
}

// Convert MIDI note number to Frequency
const midiToFreq = (midi: number): number => {
  return 440 * Math.pow(2, (midi - 69) / 12);
};

// Traditional Vietnamese Pentatonic Scale Frequencies (Hò, Xự, Xang, Xê, Cống)
// North: C, D, F, G, A (Điệu Bắc)
// South: C, Eb, F, G, Bb (Điệu Nam / Oán)
// Hue: C, D, F, G, Bb (Điệu Cung đình)

const MELODIES: Record<string, HeritageMelody> = {
  // Quan họ Bắc Ninh - "Người ơi người ở đừng về" (Điệu Bắc / Dân ca)
  'quan-ho-bac-ninh': {
    id: 'quan-ho-bac-ninh',
    nameVi: 'Người Ơi Người Ở Đừng Về',
    nameEn: 'Please Stay With Us',
    bpm: 78,
    instrumentNameVi: 'Đàn Tranh & Đàn Bầu Kinh Bắc',
    instrumentNameEn: 'Vietnamese Zither & Monochord',
    loopDuration: 14,
    notes: [
      // Dan Bau lyrical lead + Dan Tranh arpeggios
      { note: 62, duration: 1.2, instrument: 'dan-bau', timeOffset: 0.0, volume: 0.8, bend: 0.1 },
      { note: 65, duration: 1.0, instrument: 'dan-bau', timeOffset: 1.2, volume: 0.85, bend: -0.1 },
      { note: 67, duration: 1.8, instrument: 'dan-bau', timeOffset: 2.2, volume: 0.9, bend: 0.15 },
      { note: 69, duration: 1.2, instrument: 'dan-bau', timeOffset: 4.0, volume: 0.85, bend: 0 },
      { note: 67, duration: 0.8, instrument: 'dan-bau', timeOffset: 5.2, volume: 0.8, bend: -0.1 },
      { note: 65, duration: 1.5, instrument: 'dan-bau', timeOffset: 6.0, volume: 0.85, bend: 0.2 },
      { note: 62, duration: 2.0, instrument: 'dan-bau', timeOffset: 7.5, volume: 0.9, bend: 0 },
      { note: 60, duration: 1.0, instrument: 'dan-bau', timeOffset: 9.5, volume: 0.75, bend: -0.1 },
      { note: 62, duration: 3.0, instrument: 'dan-bau', timeOffset: 10.5, volume: 0.85, bend: 0 },

      // Backing Dan Tranh plucks
      { note: 50, duration: 0.6, instrument: 'dan-tranh', timeOffset: 0.0, volume: 0.5 },
      { note: 57, duration: 0.6, instrument: 'dan-tranh', timeOffset: 0.4, volume: 0.4 },
      { note: 62, duration: 0.8, instrument: 'dan-tranh', timeOffset: 0.8, volume: 0.5 },
      { note: 65, duration: 0.8, instrument: 'dan-tranh', timeOffset: 2.2, volume: 0.5 },
      { note: 69, duration: 1.0, instrument: 'dan-tranh', timeOffset: 2.6, volume: 0.45 },
      { note: 55, duration: 0.8, instrument: 'dan-tranh', timeOffset: 4.0, volume: 0.5 },
      { note: 62, duration: 0.8, instrument: 'dan-tranh', timeOffset: 6.0, volume: 0.45 },
      { note: 65, duration: 0.8, instrument: 'dan-tranh', timeOffset: 7.5, volume: 0.5 },
      { note: 50, duration: 1.5, instrument: 'dan-tranh', timeOffset: 10.5, volume: 0.55 },
    ],
  },

  // Nhã nhạc Cung đình Huế - "Đăng Đàn Cung & Lưu Thủy"
  'nha-nhac-cung-dinh-hue': {
    id: 'nha-nhac-cung-dinh-hue',
    nameVi: 'Đăng Đàn Cung & Lưu Thủy',
    nameEn: 'Ascending the Throne & Flowing Streams',
    bpm: 88,
    instrumentNameVi: 'Đại Nhạc Triều Nguyễn & Đàn Nguyệt',
    instrumentNameEn: 'Imperial Court Moon Lute & Bronze Percussion',
    loopDuration: 12,
    notes: [
      // Bronze ceremonial drum hits
      { note: 36, duration: 0.8, instrument: 'trong-dong', timeOffset: 0.0, volume: 0.9 },
      { note: 36, duration: 0.6, instrument: 'trong-dong', timeOffset: 3.0, volume: 0.85 },
      { note: 36, duration: 0.8, instrument: 'trong-dong', timeOffset: 6.0, volume: 0.9 },
      { note: 36, duration: 0.6, instrument: 'trong-dong', timeOffset: 9.0, volume: 0.85 },

      // Dan Nguyet royal melodic phrase
      { note: 60, duration: 0.7, instrument: 'dan-nguyet', timeOffset: 0.0, volume: 0.85 },
      { note: 62, duration: 0.7, instrument: 'dan-nguyet', timeOffset: 0.7, volume: 0.85 },
      { note: 65, duration: 1.4, instrument: 'dan-nguyet', timeOffset: 1.4, volume: 0.9 },
      { note: 67, duration: 0.7, instrument: 'dan-nguyet', timeOffset: 2.8, volume: 0.8 },
      { note: 65, duration: 0.7, instrument: 'dan-nguyet', timeOffset: 3.5, volume: 0.8 },
      { note: 62, duration: 1.4, instrument: 'dan-nguyet', timeOffset: 4.2, volume: 0.85 },
      { note: 67, duration: 0.7, instrument: 'dan-nguyet', timeOffset: 5.6, volume: 0.85 },
      { note: 70, duration: 0.7, instrument: 'dan-nguyet', timeOffset: 6.3, volume: 0.9 },
      { note: 72, duration: 1.8, instrument: 'dan-nguyet', timeOffset: 7.0, volume: 0.95 },
      { note: 67, duration: 0.8, instrument: 'dan-nguyet', timeOffset: 8.8, volume: 0.8 },
      { note: 65, duration: 0.8, instrument: 'dan-nguyet', timeOffset: 9.6, volume: 0.8 },
      { note: 60, duration: 1.6, instrument: 'dan-nguyet', timeOffset: 10.4, volume: 0.85 },
    ],
  },

  // Đờn ca tài tử Nam Bộ - "Dạ Cổ Hoài Lang" (Điệu Oán)
  'don-ca-tai-tu-nam-bo': {
    id: 'don-ca-tai-tu-nam-bo',
    nameVi: 'Dạ Cổ Hoài Lang (Điệu Oán)',
    nameEn: 'Night Drum Yearning (Oan Modal Suite)',
    bpm: 72,
    instrumentNameVi: 'Đàn Kìm & Đàn Tranh Nam Bộ',
    instrumentNameEn: 'Southern Dan Kim & Zither',
    loopDuration: 13,
    notes: [
      // Dan Kim (Moon Lute) melancholic motif
      { note: 58, duration: 1.2, instrument: 'dan-nguyet', timeOffset: 0.0, volume: 0.85 },
      { note: 61, duration: 1.0, instrument: 'dan-nguyet', timeOffset: 1.2, volume: 0.8 },
      { note: 63, duration: 1.6, instrument: 'dan-nguyet', timeOffset: 2.2, volume: 0.9 },
      { note: 65, duration: 0.8, instrument: 'dan-nguyet', timeOffset: 3.8, volume: 0.75 },
      { note: 63, duration: 1.0, instrument: 'dan-nguyet', timeOffset: 4.6, volume: 0.8 },
      { note: 61, duration: 1.4, instrument: 'dan-nguyet', timeOffset: 5.6, volume: 0.85 },
      { note: 58, duration: 2.0, instrument: 'dan-nguyet', timeOffset: 7.0, volume: 0.9 },
      { note: 56, duration: 1.0, instrument: 'dan-nguyet', timeOffset: 9.0, volume: 0.75 },
      { note: 58, duration: 2.5, instrument: 'dan-nguyet', timeOffset: 10.0, volume: 0.85 },

      // Dan Tranh ornamentation
      { note: 70, duration: 0.5, instrument: 'dan-tranh', timeOffset: 0.4, volume: 0.45 },
      { note: 73, duration: 0.5, instrument: 'dan-tranh', timeOffset: 2.4, volume: 0.5 },
      { note: 75, duration: 0.7, instrument: 'dan-tranh', timeOffset: 4.0, volume: 0.45 },
      { note: 70, duration: 0.8, instrument: 'dan-tranh', timeOffset: 7.2, volume: 0.5 },
      { note: 66, duration: 1.2, instrument: 'dan-tranh', timeOffset: 10.2, volume: 0.55 },
    ],
  },

  // Cồng chiêng Tây Nguyên - "Âm vang Đại ngàn"
  'cong-chieng-tay-nguyen': {
    id: 'cong-chieng-tay-nguyen',
    nameVi: 'Âm Vang Cồng Chiêng Tây Nguyên',
    nameEn: 'Echoes of the Sacred Highland Gongs',
    bpm: 96,
    instrumentNameVi: 'Dàn Cồng Chiêng Đua & Chiêng Núm',
    instrumentNameEn: 'Sacred Bronze Gong Ensemble',
    loopDuration: 10,
    notes: [
      // Deep bass gong (Chiêng Mẹ - Mother Gong)
      { note: 48, duration: 2.5, instrument: 'cong-chieng', timeOffset: 0.0, volume: 1.0 },
      { note: 48, duration: 2.5, instrument: 'cong-chieng', timeOffset: 2.5, volume: 0.95 },
      { note: 48, duration: 2.5, instrument: 'cong-chieng', timeOffset: 5.0, volume: 1.0 },
      { note: 48, duration: 2.5, instrument: 'cong-chieng', timeOffset: 7.5, volume: 0.95 },

      // Medium gongs (Chiêng Con)
      { note: 55, duration: 1.8, instrument: 'cong-chieng', timeOffset: 0.6, volume: 0.85 },
      { note: 60, duration: 1.8, instrument: 'cong-chieng', timeOffset: 1.2, volume: 0.9 },
      { note: 62, duration: 1.8, instrument: 'cong-chieng', timeOffset: 1.8, volume: 0.85 },
      { note: 55, duration: 1.8, instrument: 'cong-chieng', timeOffset: 3.1, volume: 0.85 },
      { note: 60, duration: 1.8, instrument: 'cong-chieng', timeOffset: 3.7, volume: 0.9 },
      { note: 65, duration: 2.0, instrument: 'cong-chieng', timeOffset: 4.3, volume: 0.9 },
      { note: 62, duration: 1.8, instrument: 'cong-chieng', timeOffset: 5.6, volume: 0.85 },
      { note: 60, duration: 1.8, instrument: 'cong-chieng', timeOffset: 6.2, volume: 0.85 },
      { note: 55, duration: 1.8, instrument: 'cong-chieng', timeOffset: 6.8, volume: 0.85 },
      { note: 67, duration: 2.2, instrument: 'cong-chieng', timeOffset: 8.1, volume: 0.95 },
    ],
  },

  // Ca Trù Thăng Long - "Hồng Hồng Tuyết Tuyết"
  'ca-tru-thang-long': {
    id: 'ca-tru-thang-long',
    nameVi: 'Hồng Hồng Tuyết Tuyết (Ca Trù)',
    nameEn: 'Hong Hong Tuyet Tuyet (Ca Tru Poetry)',
    bpm: 65,
    instrumentNameVi: 'Phách Tre & Đàn Đáy Thăng Long',
    instrumentNameEn: 'Dan Day Lute & Bamboo Clappers',
    loopDuration: 12,
    notes: [
      // Phach (Crisp bamboo clapper patterns)
      { note: 80, duration: 0.15, instrument: 'phach-ca-tru', timeOffset: 0.0, volume: 0.9 },
      { note: 80, duration: 0.15, instrument: 'phach-ca-tru', timeOffset: 0.3, volume: 0.7 },
      { note: 80, duration: 0.15, instrument: 'phach-ca-tru', timeOffset: 0.6, volume: 0.9 },
      { note: 80, duration: 0.15, instrument: 'phach-ca-tru', timeOffset: 1.2, volume: 0.85 },
      { note: 80, duration: 0.15, instrument: 'phach-ca-tru', timeOffset: 1.8, volume: 0.7 },
      { note: 80, duration: 0.15, instrument: 'phach-ca-tru', timeOffset: 2.4, volume: 0.9 },
      { note: 80, duration: 0.15, instrument: 'phach-ca-tru', timeOffset: 3.6, volume: 0.85 },
      { note: 80, duration: 0.15, instrument: 'phach-ca-tru', timeOffset: 4.8, volume: 0.9 },
      { note: 80, duration: 0.15, instrument: 'phach-ca-tru', timeOffset: 6.0, volume: 0.85 },
      { note: 80, duration: 0.15, instrument: 'phach-ca-tru', timeOffset: 7.2, volume: 0.9 },
      { note: 80, duration: 0.15, instrument: 'phach-ca-tru', timeOffset: 8.4, volume: 0.85 },
      { note: 80, duration: 0.15, instrument: 'phach-ca-tru', timeOffset: 9.6, volume: 0.9 },

      // Dan Day (Deep resonant bottom end)
      { note: 43, duration: 2.0, instrument: 'dan-nguyet', timeOffset: 0.0, volume: 0.9 },
      { note: 46, duration: 1.5, instrument: 'dan-nguyet', timeOffset: 2.4, volume: 0.85 },
      { note: 48, duration: 2.5, instrument: 'dan-nguyet', timeOffset: 4.0, volume: 0.9 },
      { note: 46, duration: 1.5, instrument: 'dan-nguyet', timeOffset: 6.5, volume: 0.85 },
      { note: 43, duration: 3.0, instrument: 'dan-nguyet', timeOffset: 8.0, volume: 0.9 },
    ],
  },

  // Tràng An / Ninh Bình - "Sáo Trúc & Non Nước Ninh Bình"
  'trang-an-ninh-binh': {
    id: 'trang-an-ninh-binh',
    nameVi: 'Sóng Nước Tràng An & Huyền Tích Hoa Lư',
    nameEn: 'Trang An Emerald Waters & Hoa Lu Legends',
    bpm: 80,
    instrumentNameVi: 'Sáo Trúc & Đàn Tranh Cố Đô',
    instrumentNameEn: 'Vietnamese Bamboo Flute & Zither',
    loopDuration: 12,
    notes: [
      // Flute lyrical soaring melody
      { note: 72, duration: 1.5, instrument: 'sao-truc', timeOffset: 0.0, volume: 0.85 },
      { note: 74, duration: 1.0, instrument: 'sao-truc', timeOffset: 1.5, volume: 0.85 },
      { note: 77, duration: 1.8, instrument: 'sao-truc', timeOffset: 2.5, volume: 0.9 },
      { note: 79, duration: 1.2, instrument: 'sao-truc', timeOffset: 4.3, volume: 0.9 },
      { note: 77, duration: 0.8, instrument: 'sao-truc', timeOffset: 5.5, volume: 0.8 },
      { note: 74, duration: 1.2, instrument: 'sao-truc', timeOffset: 6.3, volume: 0.85 },
      { note: 72, duration: 2.0, instrument: 'sao-truc', timeOffset: 7.5, volume: 0.9 },
      { note: 69, duration: 1.0, instrument: 'sao-truc', timeOffset: 9.5, volume: 0.75 },
      { note: 72, duration: 1.5, instrument: 'sao-truc', timeOffset: 10.5, volume: 0.85 },

      // Dan Tranh water ripples
      { note: 60, duration: 0.6, instrument: 'dan-tranh', timeOffset: 0.2, volume: 0.45 },
      { note: 65, duration: 0.6, instrument: 'dan-tranh', timeOffset: 0.6, volume: 0.45 },
      { note: 69, duration: 0.8, instrument: 'dan-tranh', timeOffset: 2.6, volume: 0.5 },
      { note: 65, duration: 0.8, instrument: 'dan-tranh', timeOffset: 4.4, volume: 0.45 },
      { note: 60, duration: 1.2, instrument: 'dan-tranh', timeOffset: 7.6, volume: 0.5 },
    ],
  },

  // Mù Cang Chải - "Tiếng Khèn Mông Tây Bắc"
  'ruong-bac-thang-mu-cang-chai': {
    id: 'ruong-bac-thang-mu-cang-chai',
    nameVi: 'Tiếng Khèn Mông Mùa Lúa Chín',
    nameEn: 'Hmong Khen Reed Pipe Across Terraces',
    bpm: 100,
    instrumentNameVi: 'Khèn Mông & Sáo Mèo Tây Bắc',
    instrumentNameEn: 'Northwestern Hmong Khen Pipes',
    loopDuration: 10,
    notes: [
      // Khen polyphonic drone + melody
      { note: 58, duration: 9.5, instrument: 'khen-mong', timeOffset: 0.0, volume: 0.4 }, // continuous drone
      { note: 70, duration: 0.6, instrument: 'khen-mong', timeOffset: 0.0, volume: 0.85 },
      { note: 73, duration: 0.6, instrument: 'khen-mong', timeOffset: 0.6, volume: 0.85 },
      { note: 75, duration: 1.2, instrument: 'khen-mong', timeOffset: 1.2, volume: 0.9 },
      { note: 73, duration: 0.6, instrument: 'khen-mong', timeOffset: 2.4, volume: 0.8 },
      { note: 70, duration: 1.0, instrument: 'khen-mong', timeOffset: 3.0, volume: 0.85 },
      { note: 66, duration: 0.8, instrument: 'khen-mong', timeOffset: 4.0, volume: 0.8 },
      { note: 70, duration: 1.2, instrument: 'khen-mong', timeOffset: 4.8, volume: 0.85 },
      { note: 75, duration: 0.8, instrument: 'khen-mong', timeOffset: 6.0, volume: 0.9 },
      { note: 78, duration: 1.4, instrument: 'khen-mong', timeOffset: 6.8, volume: 0.95 },
      { note: 75, duration: 0.8, instrument: 'khen-mong', timeOffset: 8.2, volume: 0.85 },
      { note: 70, duration: 1.0, instrument: 'khen-mong', timeOffset: 9.0, volume: 0.85 },
    ],
  },
};

// Fallback universal melody for heritages without dedicated composition (Hòa tấu Đàn Bầu & Tranh)
const DEFAULT_HERITAGE_MELODY: HeritageMelody = {
  id: 'default',
  nameVi: 'Âm Hưởng Di Sản Việt Nam (Hòa Tấu Đàn Bầu & Tranh)',
  nameEn: 'Vietnamese Heritage Melody (Dan Bau & Dan Tranh)',
  bpm: 80,
  instrumentNameVi: 'Đàn Bầu & Đàn Tranh Dân Tộc',
  instrumentNameEn: 'Monochord & Traditional Zither',
  loopDuration: 12,
  notes: [
    { note: 60, duration: 1.2, instrument: 'dan-bau', timeOffset: 0.0, volume: 0.85, bend: 0.1 },
    { note: 64, duration: 1.0, instrument: 'dan-bau', timeOffset: 1.2, volume: 0.85, bend: -0.1 },
    { note: 67, duration: 1.6, instrument: 'dan-bau', timeOffset: 2.2, volume: 0.9, bend: 0.15 },
    { note: 69, duration: 1.2, instrument: 'dan-bau', timeOffset: 3.8, volume: 0.85, bend: 0 },
    { note: 67, duration: 0.8, instrument: 'dan-bau', timeOffset: 5.0, volume: 0.8, bend: -0.1 },
    { note: 64, duration: 1.2, instrument: 'dan-bau', timeOffset: 5.8, volume: 0.85, bend: 0.1 },
    { note: 60, duration: 2.0, instrument: 'dan-bau', timeOffset: 7.0, volume: 0.9, bend: 0 },
    { note: 57, duration: 1.0, instrument: 'dan-bau', timeOffset: 9.0, volume: 0.75, bend: -0.1 },
    { note: 60, duration: 2.0, instrument: 'dan-bau', timeOffset: 10.0, volume: 0.85, bend: 0 },

    { note: 48, duration: 0.6, instrument: 'dan-tranh', timeOffset: 0.0, volume: 0.5 },
    { note: 55, duration: 0.6, instrument: 'dan-tranh', timeOffset: 0.4, volume: 0.45 },
    { note: 60, duration: 0.8, instrument: 'dan-tranh', timeOffset: 0.8, volume: 0.5 },
    { note: 64, duration: 0.8, instrument: 'dan-tranh', timeOffset: 2.2, volume: 0.5 },
    { note: 67, duration: 1.0, instrument: 'dan-tranh', timeOffset: 2.6, volume: 0.45 },
    { note: 52, duration: 0.8, instrument: 'dan-tranh', timeOffset: 4.0, volume: 0.5 },
    { note: 60, duration: 0.8, instrument: 'dan-tranh', timeOffset: 7.0, volume: 0.5 },
    { note: 48, duration: 1.5, instrument: 'dan-tranh', timeOffset: 10.0, volume: 0.55 },
  ],
};

class HeritageAudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private analyser: AnalyserNode | null = null;
  private isPlaying = false;
  private currentHeritageId: string | null = null;
  private timerId: number | null = null;
  private listeners: Set<(state: { isPlaying: boolean; heritageId: string | null; progress: number }) => void> = new Set();
  private loopStartTime = 0;
  private progressInterval: number | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;
      this.analyser.smoothingTimeConstant = 0.8;

      this.masterGain.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMelodyForHeritage(heritageId: string): HeritageMelody {
    return MELODIES[heritageId] || DEFAULT_HERITAGE_MELODY;
  }

  public playHeritage(heritageId: string) {
    this.stop();
    this.initContext();

    if (!this.ctx || !this.masterGain) return;

    this.isPlaying = true;
    this.currentHeritageId = heritageId;
    const melody = this.getMelodyForHeritage(heritageId);

    const scheduleLoop = () => {
      if (!this.isPlaying || !this.ctx || !this.masterGain) return;
      const now = this.ctx.currentTime;
      this.loopStartTime = Date.now();

      melody.notes.forEach(note => {
        this.synthesizeNote(note, now + note.timeOffset);
      });

      this.timerId = window.setTimeout(() => {
        if (this.isPlaying) {
          scheduleLoop();
        }
      }, melody.loopDuration * 1000);
    };

    scheduleLoop();

    // Notify progress
    this.progressInterval = window.setInterval(() => {
      if (this.isPlaying) {
        const elapsed = (Date.now() - this.loopStartTime) / 1000;
        const progress = Math.min(1, (elapsed % melody.loopDuration) / melody.loopDuration);
        this.notifyListeners(progress);
      }
    }, 100);

    this.notifyListeners(0);
  }

  public stop() {
    if (this.timerId) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
    this.isPlaying = false;
    this.currentHeritageId = null;
    this.notifyListeners(0);
  }

  public toggle(heritageId: string) {
    if (this.isPlaying && this.currentHeritageId === heritageId) {
      this.stop();
    } else {
      this.playHeritage(heritageId);
    }
  }

  public getState() {
    return {
      isPlaying: this.isPlaying,
      currentHeritageId: this.currentHeritageId,
    };
  }

  public setVolume(vol: number) {
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), this.ctx.currentTime);
    }
  }

  public subscribe(cb: (state: { isPlaying: boolean; heritageId: string | null; progress: number }) => void) {
    this.listeners.add(cb);
    return () => {
      this.listeners.delete(cb);
    };
  }

  private notifyListeners(progress: number) {
    const state = {
      isPlaying: this.isPlaying,
      heritageId: this.currentHeritageId,
      progress,
    };
    this.listeners.forEach(cb => cb(state));
  }

  // --- Physical & Modal Synthesis of Traditional Instruments ---
  private synthesizeNote(note: NoteEvent, startTime: number) {
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const freq = midiToFreq(note.note);
    const vol = (note.volume || 0.8) * 0.45;

    switch (note.instrument) {
      case 'dan-bau': {
        // Monochord (Dan Bau): Warm fundamental + 2nd/3rd harmonics + subtle vibrato + pitch glissando
        const osc = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        subOsc.type = 'triangle';

        const bendAmount = (note.bend || 0) * 40;
        osc.frequency.setValueAtTime(freq, startTime);
        osc.frequency.linearRampToValueAtTime(freq + bendAmount, startTime + note.duration * 0.4);
        subOsc.frequency.setValueAtTime(freq * 2, startTime);

        // Gentle vocal vibrato (typical of Dan Bau)
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(4.5, startTime);
        lfoGain.gain.setValueAtTime(2.5, startTime);
        lfo.connect(osc.frequency);
        lfo.start(startTime);
        lfo.stop(startTime + note.duration);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(1400, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(vol, startTime + 0.08); // soft bowing/plucking attack
        gain.gain.exponentialRampToValueAtTime(vol * 0.7, startTime + note.duration * 0.6);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.duration);

        osc.connect(gain);
        subOsc.connect(gain);
        gain.connect(filter);
        filter.connect(this.masterGain);

        osc.start(startTime);
        subOsc.start(startTime);
        osc.stop(startTime + note.duration);
        subOsc.stop(startTime + note.duration);
        break;
      }

      case 'dan-tranh': {
        // Vietnamese 16-string Zither (Dan Tranh): Crisp metallic-silk pluck + rich harmonics + fast decay
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'triangle';
        osc2.type = 'sine';

        osc1.frequency.setValueAtTime(freq, startTime);
        osc2.frequency.setValueAtTime(freq * 3, startTime); // 3rd harmonic metallic sheen

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(Math.min(3500, freq * 2.5), startTime);
        filter.Q.setValueAtTime(1.5, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(vol * 1.2, startTime + 0.012); // instant crisp plectrum strike
        gain.gain.exponentialRampToValueAtTime(vol * 0.3, startTime + 0.25);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.duration);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(filter);
        filter.connect(this.masterGain);

        osc1.start(startTime);
        osc2.start(startTime);
        osc1.stop(startTime + note.duration);
        osc2.stop(startTime + note.duration);
        break;
      }

      case 'dan-nguyet': {
        // Moon Lute / Dan Day (Dan Nguyet): Deep woody pluck + round hollow timbre
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(900, startTime);
        filter.Q.setValueAtTime(3.0, startTime); // wooden resonance body

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(vol, startTime + 0.015);
        gain.gain.exponentialRampToValueAtTime(vol * 0.4, startTime + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.duration);

        osc.connect(gain);
        gain.connect(filter);
        filter.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + note.duration);
        break;
      }

      case 'cong-chieng': {
        // Highland Gongs: Inharmonic metallic spectrum with long shimmering tail
        const harmonics = [1, 1.48, 2.09, 2.76, 3.45];
        const weights = [1.0, 0.6, 0.4, 0.25, 0.15];

        harmonics.forEach((h, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq * h, startTime);

          const hVol = vol * weights[idx];
          gain.gain.setValueAtTime(0.0001, startTime);
          gain.gain.exponentialRampToValueAtTime(hVol, startTime + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.duration);

          osc.connect(gain);
          gain.connect(this.masterGain!);

          osc.start(startTime);
          osc.stop(startTime + note.duration);
        });
        break;
      }

      case 'trong-dong': {
        // Bronze Drum & Imperial Festival Drum: Low membrane thump + metal click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq * 1.5, startTime);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.6, startTime + 0.12);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(vol * 1.3, startTime + 0.008);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.duration);

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + note.duration);
        break;
      }

      case 'sao-truc': {
        // Bamboo Flute (Sao Truc): Soft breathy sine + subtle overtone
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, startTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(vol * 0.85, startTime + 0.1);
        gain.gain.exponentialRampToValueAtTime(vol * 0.7, startTime + note.duration * 0.7);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.duration);

        osc.connect(gain);
        gain.connect(filter);
        filter.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + note.duration);
        break;
      }

      case 'khen-mong': {
        // Hmong Reed Pipe (Khen): Buzzy free-reed harmonic rich sound
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, startTime);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1800, startTime);
        filter.Q.setValueAtTime(2.2, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(vol * 0.75, startTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + note.duration);

        osc.connect(gain);
        gain.connect(filter);
        filter.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + note.duration);
        break;
      }

      case 'phach-ca-tru': {
        // Bamboo castanet (Phach): High crisp wooden transient
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'square';
        osc.frequency.setValueAtTime(1200, startTime);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(800, startTime);

        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.exponentialRampToValueAtTime(vol * 0.9, startTime + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.08);

        osc.connect(gain);
        gain.connect(filter);
        filter.connect(this.masterGain);

        osc.start(startTime);
        osc.stop(startTime + 0.09);
        break;
      }
    }
  }
}

export const heritageAudio = new HeritageAudioEngine();
