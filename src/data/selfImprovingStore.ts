import { KnowledgeProposal, KnowledgeVersion, UserFeedback, ProofMetrics, AuditEvent } from '../types';

export const INITIAL_VERSIONS: KnowledgeVersion[] = [
  {
    version: 'v1.0.0',
    timestamp: '2026-08-20T10:00:00Z',
    author: 'HeritageVibe Curation Committee (UNESCO & VICAS grounded)',
    changelog: 'Initial curated release with 6 primary UNESCO & National Intangible/Tangible Heritages.',
    itemsCount: 6,
    status: 'archived'
  },
  {
    version: 'v1.0.1',
    timestamp: '2026-08-22T14:30:00Z',
    author: 'Human Cultural Editor (Nguyen Van Truong)',
    changelog: 'Refined Hue Royal Court Music instrument terminology and Bat Trang 5-glaze taxonomy.',
    itemsCount: 6,
    status: 'active'
  }
];

export const INITIAL_PROPOSALS: KnowledgeProposal[] = [
  {
    id: 'prop-2026-001',
    heritageId: 'gom-su-bat-trang',
    heritageTitle: 'Nghề gốm cổ truyền Bát Tràng',
    author: 'Le Thu Trang (Cultural Heritage Researcher)',
    changeType: 'fact_update',
    description: 'Bổ sung thông tin khảo cổ học về niên đại dòng men rạn tam thái thời Mạc (thế kỷ 16) tại xưởng gốm cổ Bát Tràng.',
    originalText: 'Sở hữu 5 dòng men cổ độc đáo: Men tro (lam), Men nâu, Men trắng ngà, Men ngọc hoàng tộc, và Men rạn tam thái độc nhất vô nhị.',
    proposedText: 'Sở hữu 5 dòng men cổ độc đáo: Men tro (lam), Men nâu, Men trắng ngà, Men ngọc hoàng tộc, và Men rạn tam thái độc bản thế kỷ 16 được xác thực qua các chân đèn gốm thời Mạc (1580-1590).',
    evidenceSource: 'Bảo tàng Lịch sử Quốc gia & Niên giám Khảo cổ học Việt Nam (2024)',
    evalScore: 98.5,
    status: 'approved_applied',
    submittedAt: '2026-08-23T08:15:00Z',
    reviewedAt: '2026-08-23T11:20:00Z',
    reviewedBy: 'Dr. Pham Hoang Nam (Lead Heritage Reviewer)',
    versionTarget: 'v1.0.1'
  },
  {
    id: 'prop-2026-002',
    heritageId: 'don-ca-tai-tu-nam-bo',
    heritageTitle: 'Đờn ca Tài tử Nam Bộ',
    author: 'Tran Van Minh (Southern Folk Musician)',
    changeType: 'dialect_enhancement',
    description: 'Bổ sung phương ngữ Nam Bộ chuẩn xác cho lời thoại khi nghệ nhân so dây đờn kìm (nắn phím, so cung).',
    originalText: 'Kể về buổi đờn ca dưới bóng trăng vườn vú sữa Bến Tre, khi tiếng đờn kìm hòa nhịp bài "Dạ cổ hoài lang".',
    proposedText: 'Kể về buổi đờn ca tri âm dưới bóng trăng rằm vườn vú sữa miệt Bến Tre, khi bác Sáu so dây đờn kìm gảy khúc "Dạ cổ hoài lang" ngọt lịm mộc mạc.',
    evidenceSource: 'Hội Văn nghệ Dân gian Việt Nam - Chi hội Nam Bộ',
    evalScore: 96.0,
    status: 'pending_human_review',
    submittedAt: '2026-08-24T15:40:00Z',
    versionTarget: 'v1.0.2'
  }
];

export const INITIAL_FEEDBACK: UserFeedback[] = [
  {
    id: 'fb-01',
    timestamp: '2026-08-24T17:10:00Z',
    heritageId: 'quan-ho-bac-ninh',
    feedbackType: 'strength',
    rating: 5,
    comment: 'Giọng kể Bắc Bộ rất truyền cảm, câu từ chuẩn xác văn hóa Kinh Bắc. Tôi rất xúc động khi nghe đoạn giải thích tục kết chạ giữa các làng Quan họ.',
    status: 'resolved',
    resolvedAt: '2026-08-24T17:30:00Z',
    resolutionNote: 'Đã lưu lại làm chuẩn mực cho các câu chuyện miền Bắc khác.'
  },
  {
    id: 'fb-02',
    timestamp: '2026-08-24T18:25:00Z',
    heritageId: 'pho-co-hoi-an',
    feedbackType: 'factual_error',
    rating: 4,
    comment: 'Chùa Cầu vừa được trùng tu khánh thành năm 2024, ứng dụng nên lưu ý cập nhật mốc thời gian diện mạo mới nhất cho du khách.',
    status: 'pending',
    proposedChange: 'Bổ sung mốc hoàn thành dự án bảo tồn tu bổ Chùa Cầu vào tháng 8/2024.'
  }
];

export const INITIAL_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'ev-101',
    timestamp: '2026-08-24T19:00:00Z',
    eventType: 'story_read',
    title: 'Grounded Story Completed',
    detail: 'User completed "Bí mật Men Rạn Bát Tràng" (Dialect: Bắc Bộ, Verified Citation: UNESCO #00183)',
    status: 'verified'
  },
  {
    id: 'ev-102',
    timestamp: '2026-08-24T18:50:00Z',
    eventType: 'quiz_passed',
    title: 'Daily Micro-Quiz Aced',
    detail: 'User scored 100% on Hue Court Music Quiz (Streak Day 4 active)',
    status: 'success'
  },
  {
    id: 'ev-103',
    timestamp: '2026-08-24T18:30:00Z',
    eventType: 'proposal_created',
    title: 'New Knowledge Proposal Staged',
    detail: 'Southern Dialect Nuance proposal submitted for Don Ca Tai Tu (AI Eval: 96.0/100)',
    status: 'pending'
  },
  {
    id: 'ev-104',
    timestamp: '2026-08-24T17:30:00Z',
    eventType: 'human_approval',
    title: 'Human Review Approval Executed',
    detail: 'Lead Reviewer approved Knowledge v1.0.1 release (Fact Grounding: 100%)',
    status: 'verified'
  },
  {
    id: 'ev-105',
    timestamp: '2026-08-24T16:15:00Z',
    eventType: 'artisan_inquiry',
    title: 'Artisan Workshop Footfall Logged',
    detail: 'User connected to Master Vu Duc Thang (Bat Trang Pottery Studio) via Heritage Economy module',
    status: 'success'
  }
];

export const INITIAL_METRICS: ProofMetrics = {
  dau: 1248,
  totalUsers: 8960,
  streakRetentionRate: 78.4,
  storiesCompleted: 14520,
  quizzesAnswered: 11200,
  quizAccuracyRate: 86.2,
  totalFeedbackCount: 142,
  feedbackResolvedCount: 134,
  improvementsApplied: 18,
  pendingProposals: 3,
  rolledBackCount: 1,
  groundingAuditScore: 99.8,
  activeArtisansSupported: 24,
  simulatedFootfallImpact: 4850,
  recentAuditEvents: INITIAL_AUDIT_EVENTS
};
