export type Region = 'north' | 'central' | 'south' | 'islands' | 'national' | string;

export type DialectStyle = 'bac-bo' | 'trung-bo' | 'nam-bo' | 'modern-genz';

export type Language = 'vi' | 'en';

export type ArArtifactType =
  | 'trong-dong'
  | 'binh-gom'
  | 'den-long'
  | 'kim-bao'
  | 'dan-kim'
  | 'non-la'
  | 'dan-bau'
  | 'khue-van-cac'
  | 'thuyen-rong'
  | 'tuong-cham'
  | string;

export interface ArHotspot {
  id: string;
  position: [number, number, number];
  titleVi: string;
  titleEn: string;
  descVi: string;
  descEn: string;
}

export interface ArArtifact {
  id: ArArtifactType;
  heritageId: string;
  nameVi: string;
  nameEn: string;
  subtitleVi: string;
  subtitleEn: string;
  eraVi: string;
  eraEn: string;
  materialVi: string;
  materialEn: string;
  descriptionVi: string;
  descriptionEn: string;
  icon: string;
  hotspots: ArHotspot[];
}

export interface GroundedSource {
  id: string;
  name: string;
  authority: string; // e.g. 'UNESCO', 'Bộ VHTTDL', 'Viện Văn hóa Nghệ thuật Quốc gia (VICAS)'
  url?: string;
  verifiedYear: number;
}

export interface HeritageMusicTrack {
  titleVi: string;
  titleEn: string;
  artistVi: string;
  artistEn: string;
  genreVi: string;
  genreEn: string;
  youtubeId: string; // YouTube video/music ID
  audioUrl?: string; // Optional direct audio stream URL
  descriptionVi: string;
  descriptionEn: string;
}

export type HeritageCategory =
  | 'intangible'
  | 'tangible'
  | 'craft'
  | 'culinary'
  | 'music-theater'
  | 'festival'
  | 'natural'
  | 'landscape'
  | string;

export interface HeritageItem {
  id: string;
  titleVi: string;
  titleEn: string;
  category: HeritageCategory;
  region: Region;
  province: string;
  unescoYear?: number;
  nationalYear?: number;
  summaryVi: string;
  summaryEn: string;
  groundedFacts: string[];
  sources: GroundedSource[];
  promptSeedVi: string;
  promptSeedEn: string;
  heroImage: string;
  tags: string[];
  artisanVillage?: string;
  coordinates?: { lat: number; lng: number };
  arArtifactId?: ArArtifactType;
  // Media integrations
  youtubeVideoId?: string; // Curated documentary/scenic 4K embed
  youtubeTitleVi?: string;
  youtubeTitleEn?: string;
  musicTrack?: HeritageMusicTrack; // Curated signature folk song / traditional music
}

export interface QuizQuestion {
  id: string;
  heritageId: string;
  questionVi: string;
  questionEn: string;
  optionsVi: string[];
  optionsEn: string[];
  correctIndex: number;
  explanationVi: string;
  explanationEn: string;
  sourceCitation: string;
}

export interface CollectibleBadge {
  id: string;
  nameVi: string;
  nameEn: string;
  descriptionVi: string;
  descriptionEn: string;
  category: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt?: string;
  requirementVi: string;
  requirementEn: string;
}

export interface UserFeedback {
  id: string;
  timestamp: string;
  heritageId?: string;
  feedbackType: 'strength' | 'weakness' | 'factual_error' | 'dialect_inaccuracy' | 'missing_source';
  rating: number; // 1 to 5
  comment: string;
  userEmail?: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'rejected';
  proposedChange?: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export interface KnowledgeProposal {
  id: string;
  heritageId: string;
  heritageTitle: string;
  author: string;
  changeType: 'fact_update' | 'new_source' | 'dialect_enhancement' | 'artisan_addition';
  description: string;
  originalText: string;
  proposedText: string;
  evidenceSource: string;
  evalScore: number; // 0 to 100 benchmark score
  status: 'pending_human_review' | 'approved_applied' | 'rejected' | 'rolled_back';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  versionTarget: string;
  rollbackVersion?: string;
}

export interface KnowledgeVersion {
  version: string;
  timestamp: string;
  author: string;
  changelog: string;
  itemsCount: number;
  status: 'active' | 'archived' | 'rolled_back';
}

export interface HeritageTraveler {
  id: string;
  heritageId: string;
  userName: string;
  avatar: string;
  travelDate: string; // e.g. "2026-09-02" or "Đã đến tháng 08/2026"
  status: 'planning' | 'visited' | 'looking_for_buddies';
  statusTextVi: string;
  statusTextEn: string;
  notesVi: string;
  notesEn: string;
  photos?: string[];
  likesCount: number;
  contactHint?: string;
  createdAt: string;
}

export interface ArtisanProfile {
  id: string;
  name: string;
  craftTypeVi: string;
  craftTypeEn: string;
  villageVi: string;
  villageEn: string;
  provinceVi: string;
  provinceEn: string;
  experienceYears: number;
  storyVi: string;
  storyEn: string;
  heritageId: string;
  contactPhone: string;
  socialOrShopUrl: string;
  footfallCount: number;
  verifiedMaster: boolean;
  avatar: string;
  sampleProducts: {
    nameVi: string;
    nameEn: string;
    priceVnd: number;
    descriptionVi: string;
  }[];
}

export interface ProofMetrics {
  dau: number;
  totalUsers: number;
  streakRetentionRate: number; // percentage
  storiesCompleted: number;
  quizzesAnswered: number;
  quizAccuracyRate: number; // percentage
  totalFeedbackCount: number;
  feedbackResolvedCount: number;
  improvementsApplied: number;
  pendingProposals: number;
  rolledBackCount: number;
  groundingAuditScore: number; // e.g. 99.8%
  activeArtisansSupported: number;
  simulatedFootfallImpact: number;
  recentAuditEvents: AuditEvent[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  eventType: 'story_read' | 'quiz_passed' | 'feedback_logged' | 'proposal_created' | 'human_approval' | 'rollback' | 'artisan_inquiry';
  title: string;
  detail: string;
  status: 'verified' | 'pending' | 'success';
}

export type TripPreference = 'scenic' | 'history_culture' | 'craft_music' | 'all_in_one';
export type TripRegion = 'north' | 'central' | 'south' | 'cross_vietnam';
export type TripBudgetLevel = 'budget' | 'standard' | 'luxury' | 'custom';
export type TripGroupType = 'solo' | 'couple' | 'family' | 'friends';

export interface PlannerTripRequest {
  preference: TripPreference;
  region: TripRegion;
  month: number; // 1 - 12
  durationDays: number; // e.g. 2, 3, 4, 5, 7
  budgetLevel: TripBudgetLevel;
  customBudgetVnd?: number;
  groupType?: TripGroupType;
  customNotes?: string;
  language?: Language;
}

export interface PlannerDestination {
  nameVi: string;
  nameEn: string;
  timeSlot: string; // e.g. "08:00 - 11:30"
  heritageId?: string;
  descriptionVi: string;
  descriptionEn: string;
  travelTipsVi: string;
  travelTipsEn: string;
  isNearbyClustered?: boolean;
  clusterNoteVi?: string;
}

export interface PlannerItineraryDay {
  day: number;
  titleVi: string;
  titleEn: string;
  themeVi: string;
  themeEn: string;
  destinations: PlannerDestination[];
  mealsVi: string[];
  mealsEn: string[];
}

export interface PlannerTripPlan {
  id: string;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  overviewSummaryVi: string;
  overviewSummaryEn: string;
  seasonHighlightsVi: string;
  seasonHighlightsEn: string;
  estimatedBudgetVi: string;
  estimatedBudgetEn: string;
  transportRecommendationVi: string;
  transportRecommendationEn: string;
  packingChecklistVi: string[];
  packingChecklistEn: string[];
  culturalNotesVi: string[];
  culturalNotesEn: string[];
  recommendedSouvenirsVi: string[];
  recommendedSouvenirsEn: string[];
  days: PlannerItineraryDay[];
  rawMarkdownVi?: string;
  rawMarkdownEn?: string;
  createdAt: string;
  requestParams: PlannerTripRequest;
}
