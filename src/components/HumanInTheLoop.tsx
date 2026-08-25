import React, { useState, useEffect } from 'react';
import { RefreshCw, CheckCircle2, XCircle, ShieldCheck, History, ArrowRight, AlertTriangle, Send, UserCheck, Sparkles, MessageSquare, Award, PlusCircle, Landmark, MapPin, Tag, FileText, Image as ImageIcon, BookOpen, LogOut, User as UserIcon, Lock } from 'lucide-react';
import { KnowledgeProposal, KnowledgeVersion, UserFeedback, HeritageItem, Language } from '../types';
import { auth, addHeritageToFirestore, addProposalToFirestore, addFeedbackToFirestore, approveProposalInFirestore, rejectProposalInFirestore } from '../lib/firebase';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { AuthGate } from './AuthGate';

interface HumanInTheLoopProps {
  proposals: KnowledgeProposal[];
  versions: KnowledgeVersion[];
  feedback: UserFeedback[];
  heritages: HeritageItem[];
  language: Language;
  onProposalApproved: () => void;
  onRollbackExecuted: () => void;
}

export const HumanInTheLoop: React.FC<HumanInTheLoopProps> = ({
  proposals,
  versions,
  feedback,
  heritages,
  language,
  onProposalApproved,
  onRollbackExecuted,
}) => {
  // Firebase Auth State for Page Tri Thức
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authChecking, setAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecking(false);
      if (user) {
        const name = user.displayName || user.email?.split('@')[0] || 'Cộng tác viên Di sản';
        setAuthorName(name);
        setNewAuthor(name);
      }
    });
    return () => unsubscribe();
  }, []);

  // Contribution Active Mode Tab: 'update' | 'create_heritage' | 'feedback'
  const [contributionMode, setContributionMode] = useState<'update' | 'create_heritage' | 'feedback'>('create_heritage');

  // Proposal Form State (Update)
  const [selectedHeritageId, setSelectedHeritageId] = useState(heritages[0]?.id || '');
  const [changeType, setChangeType] = useState<KnowledgeProposal['changeType']>('fact_update');
  const [authorName, setAuthorName] = useState('');
  const [description, setDescription] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [proposedText, setProposedText] = useState('');
  const [evidenceSource, setEvidenceSource] = useState('');
  const [isSubmittingProposal, setIsSubmittingProposal] = useState(false);
  const [proposalSuccessMsg, setProposalSuccessMsg] = useState('');

  // Complete Create New Heritage Form State
  const [newTitleVi, setNewTitleVi] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newCategory, setNewCategory] = useState<HeritageItem['category']>('tangible');
  const [newRegion, setNewRegion] = useState<HeritageItem['region']>('north');
  const [newProvince, setNewProvince] = useState('');
  const [newRecognitionType, setNewRecognitionType] = useState<'unesco' | 'national'>('unesco');
  const [newRecognitionYear, setNewRecognitionYear] = useState<string>(new Date().getFullYear().toString());
  const [newSummaryVi, setNewSummaryVi] = useState('');
  const [newSummaryEn, setNewSummaryEn] = useState('');
  const [newFact1, setNewFact1] = useState('');
  const [newFact2, setNewFact2] = useState('');
  const [newFact3, setNewFact3] = useState('');
  const [newSourceName, setNewSourceName] = useState('Cục Di sản Văn hóa - Bộ VHTTDL');
  const [newSourceAuthority, setNewSourceAuthority] = useState('Bộ Văn hóa, Thể thao và Du lịch');
  const [newHeroImage, setNewHeroImage] = useState('https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80');
  const [newTags, setNewTags] = useState('Di sản, Văn hóa, Việt Nam');
  const [newArtisanVillage, setNewArtisanVillage] = useState('');
  const [newLatitude, setNewLatitude] = useState('21.0285');
  const [newLongitude, setNewLongitude] = useState('105.8542');
  const [newAuthor, setNewAuthor] = useState('');
  const [isSubmittingNewHeritage, setIsSubmittingNewHeritage] = useState(false);
  const [newHeritageSuccessMsg, setNewHeritageSuccessMsg] = useState('');

  // Feedback Form State
  const [feedbackHeritageId, setFeedbackHeritageId] = useState(heritages[0]?.id || '');
  const [feedbackType, setFeedbackType] = useState<UserFeedback['feedbackType']>('factual_error');
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComment, setFeedbackComment] = useState('');
  const [proposedCorrection, setProposedCorrection] = useState('');
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackSuccessMsg, setFeedbackSuccessMsg] = useState('');

  // Review Action State
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const pendingProposals = proposals.filter(p => p.status === 'pending_human_review');
  const approvedProposals = proposals.filter(p => p.status === 'approved_applied');
  const activeVersion = versions.find(v => v.status === 'active')?.version || 'v1.0.1';

  // Handle Complete New Heritage Creation (With Firebase Firestore Persistence)
  const handleCreateNewHeritage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitleVi.trim() || !newProvince.trim() || !newSummaryVi.trim()) {
      alert(language === 'vi' ? 'Vui lòng nhập Tên di sản, Tỉnh/Thành phố và Tóm tắt tổng quan!' : 'Please provide Title, Province, and Summary!');
      return;
    }

    setIsSubmittingNewHeritage(true);
    setNewHeritageSuccessMsg('');

    try {
      const groundedFacts = [newFact1, newFact2, newFact3].map(f => f.trim()).filter(Boolean);
      if (groundedFacts.length === 0) {
        groundedFacts.push(newSummaryVi.trim());
      }

      const sources = [
        {
          id: `src-new-${Date.now()}`,
          name: newSourceName.trim() || 'Hồ sơ Di sản Văn hóa Việt Nam',
          authority: newSourceAuthority.trim() || 'Bộ Văn hóa, Thể thao và Du lịch',
          verifiedYear: Number(newRecognitionYear) || new Date().getFullYear(),
        }
      ];

      const tags = newTags.split(',').map(t => t.trim()).filter(Boolean);
      const effectiveAuthor = newAuthor.trim() || currentUser?.displayName || currentUser?.email || 'Cộng tác viên Di sản';

      const slug = newTitleVi
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '') || `heritage-${Date.now()}`;

      const newHeritageId = `${slug}-${Date.now().toString().slice(-4)}`;

      const newItem: HeritageItem = {
        id: newHeritageId,
        titleVi: newTitleVi.trim(),
        titleEn: newTitleEn.trim() || newTitleVi.trim(),
        category: newCategory,
        region: newRegion,
        province: newProvince.trim(),
        unescoYear: newRecognitionType === 'unesco' && newRecognitionYear ? Number(newRecognitionYear) : undefined,
        nationalYear: newRecognitionType === 'national' && newRecognitionYear ? Number(newRecognitionYear) : undefined,
        summaryVi: newSummaryVi.trim(),
        summaryEn: newSummaryEn.trim() || newSummaryVi.trim(),
        groundedFacts,
        sources,
        promptSeedVi: `Kể câu chuyện giàu cảm xúc về di sản ${newTitleVi.trim()} tại ${newProvince.trim()}.`,
        promptSeedEn: `Tell an inspiring cultural story of ${newTitleEn.trim() || newTitleVi.trim()}.`,
        heroImage: newHeroImage.trim() || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
        tags,
        artisanVillage: newArtisanVillage.trim() || newProvince.trim(),
        coordinates: {
          lat: parseFloat(newLatitude) || 21.0285,
          lng: parseFloat(newLongitude) || 105.8542
        },
        arArtifactId: 'trong-dong',
        youtubeVideoId: 'djIopaZOGB8',
        youtubeTitleVi: `Tư liệu Di sản: ${newTitleVi.trim()}`,
        youtubeTitleEn: `Heritage Documentary: ${newTitleEn.trim() || newTitleVi.trim()}`,
      };

      // 1. Direct Save to Firestore
      try {
        await addHeritageToFirestore(newItem, effectiveAuthor);
      } catch (fErr) {
        console.warn('Firestore direct write notice:', fErr);
      }

      // 2. Dual Save via Server Endpoint
      const res = await fetch('/api/heritage/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newItem,
          authorName: effectiveAuthor,
        }),
      });

      const data = await res.json();
      setNewHeritageSuccessMsg(language === 'vi' 
        ? `Đã tạo thành công di sản "${newTitleVi}" và lưu trữ an toàn vào Firestore Database!`
        : `Successfully created heritage "${newTitleVi}" and stored to Firestore Database!`);
      
      // Reset form
      setNewTitleVi('');
      setNewTitleEn('');
      setNewProvince('');
      setNewSummaryVi('');
      setNewSummaryEn('');
      setNewFact1('');
      setNewFact2('');
      setNewFact3('');
      setNewArtisanVillage('');

      onProposalApproved(); // Refresh App state & heritage list
    } catch (err: any) {
      console.error(err);
      alert('Không thể kết nối để tạo di sản');
    } finally {
      setIsSubmittingNewHeritage(false);
    }
  };

  // Handle Proposal Submission (With Firestore Persistence)
  const handleSubmitProposal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !proposedText.trim() || !evidenceSource.trim()) return;

    setIsSubmittingProposal(true);
    setProposalSuccessMsg('');
    const effectiveAuthor = authorName.trim() || currentUser?.displayName || currentUser?.email || 'Nhà Nghiên cứu Di sản';
    const targetHeritage = heritages.find(h => h.id === selectedHeritageId);

    try {
      // 1. Save to Firestore
      try {
        await addProposalToFirestore({
          heritageId: selectedHeritageId,
          heritageTitle: targetHeritage?.titleVi || selectedHeritageId,
          author: effectiveAuthor,
          changeType,
          description: description.trim(),
          originalText: originalText.trim(),
          proposedText: proposedText.trim(),
          evidenceSource: evidenceSource.trim(),
          versionTarget: activeVersion,
        });
      } catch (fErr) {
        console.warn('Firestore proposal notice:', fErr);
      }

      // 2. Dual Save to Server Endpoint
      const res = await fetch('/api/improvement/propose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heritageId: selectedHeritageId,
          author: effectiveAuthor,
          changeType,
          description: description.trim(),
          originalText: originalText.trim(),
          proposedText: proposedText.trim(),
          evidenceSource: evidenceSource.trim(),
        }),
      });
      const data = await res.json();
      setProposalSuccessMsg(language === 'vi' 
        ? 'Đề xuất đã được đưa vào Firestore & hàng đợi thẩm định của chuyên gia nhân văn!'
        : 'Proposal recorded in Firestore & staged for Human-in-the-Loop review!');
      setDescription('');
      setOriginalText('');
      setProposedText('');
      setEvidenceSource('');
      onProposalApproved(); // Refresh
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingProposal(false);
    }
  };

  // Handle Feedback Submission
  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackComment.trim()) return;

    setIsSubmittingFeedback(true);
    setFeedbackSuccessMsg('');

    try {
      // Save to Firestore
      try {
        await addFeedbackToFirestore({
          heritageId: feedbackHeritageId,
          feedbackType,
          rating: feedbackRating,
          comment: feedbackComment.trim(),
          proposedChange: proposedCorrection.trim() || undefined,
        });
      } catch (fErr) {
        console.warn('Firestore feedback notice:', fErr);
      }

      const res = await fetch('/api/feedback/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heritageId: feedbackHeritageId,
          feedbackType,
          rating: feedbackRating,
          comment: feedbackComment.trim(),
          proposedChange: proposedCorrection.trim() || undefined,
        }),
      });
      setFeedbackSuccessMsg(language === 'vi' ? 'Cảm ơn bạn đã gửi đóng góp nâng cao chất lượng tri thức vào Firestore!' : 'Thank you for contributing to our Firestore knowledge base!');
      setFeedbackComment('');
      setProposedCorrection('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  // Handle Human Review Decision
  const handleReviewAction = async (proposalId: string, action: 'approve' | 'reject') => {
    setActionLoading(proposalId);
    const targetProp = proposals.find(p => p.id === proposalId);
    const reviewerName = currentUser?.displayName || currentUser?.email || 'Ban Thẩm định Di sản';

    try {
      // Direct Firestore update
      if (targetProp) {
        if (action === 'approve') {
          await approveProposalInFirestore(proposalId, targetProp, reviewerName);
        } else {
          await rejectProposalInFirestore(proposalId, reviewerName);
        }
      }

      const res = await fetch('/api/improvement/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          proposalId,
          action,
          reviewerName,
          note: action === 'approve' ? 'Đã kiểm tra chéo với hồ sơ UNESCO gốc.' : 'Nguồn chưa đủ căn cứ pháp lý.',
        }),
      });
      onProposalApproved();
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(null);
    }
  };

  // Handle Rollback
  const handleRollback = async () => {
    if (!confirm('Bạn có chắc chắn muốn kích hoạt cơ chế Rollback để quay lại phiên bản v1.0.0 an toàn?')) return;
    try {
      const res = await fetch('/api/improvement/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'rollback',
          rollbackVersion: 'v1.0.0',
        }),
      });
      const data = await res.json();
      if (data.success) {
        onRollbackExecuted();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // If Auth is checking
  if (authChecking) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-3 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-semibold text-stone-600">
          {language === 'vi' ? 'Đang kết nối phiên xác thực Firebase...' : 'Connecting to Firebase Authentication...'}
        </p>
      </div>
    );
  }

  // If user is not logged in, show the Auth Gate for Tri Thức page
  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="rounded-3xl bg-stone-900 border border-amber-900/40 p-6 sm:p-8 text-stone-100 shadow-xl space-y-2 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase">
            <Lock className="w-3.5 h-3.5" />
            <span>{language === 'vi' ? 'Cổng Đăng nhập Cộng tác viên' : 'Contributor Access Gate'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-heritage text-amber-50">
            {language === 'vi' ? 'Hệ Thống Đóng Góp Tri Thức Di Sản' : 'Heritage Knowledge Hub'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-300">
            {language === 'vi'
              ? 'Để bảo vệ tính chính xác của dữ liệu lịch sử và văn hóa, vui lòng đăng nhập hoặc đăng ký tài khoản cộng tác viên để tham gia đóng góp và thẩm định di sản.'
              : 'To preserve the academic rigor of cultural records, please sign in or register to contribute new heritage data.'}
          </p>
        </div>

        <AuthGate language={language} onSuccess={() => {}} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Banner: Self-Improving Status with Authenticated User Profile */}
      <div className="rounded-3xl bg-stone-900 border border-amber-900/40 p-6 sm:p-8 text-stone-100 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold uppercase">
              <UserCheck className="w-3.5 h-3.5" />
              {language === 'vi' ? 'Quy Trình Tự Hoàn Thiện Có Giám Sát (HITL) • Firebase Firestore' : 'Human-in-the-Loop Self-Improving Engine • Firestore Database'}
            </div>
            <h1 className="text-2xl sm:text-4xl font-bold font-heritage text-amber-50">
              {language === 'vi' ? 'Hệ Thống Đóng Góp Tri Thức & Thẩm Định' : 'Heritage Knowledge & Verification'}
            </h1>
          </div>

          {/* User Profile and Log out */}
          <div className="flex flex-wrap items-center gap-3 bg-stone-950 p-2.5 rounded-2xl border border-stone-800 text-xs">
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-stone-900 border border-stone-700">
              <div className="w-6 h-6 rounded-full bg-amber-600 flex items-center justify-center text-white text-[11px] font-bold">
                {currentUser.displayName ? currentUser.displayName[0].toUpperCase() : (currentUser.email ? currentUser.email[0].toUpperCase() : 'U')}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-bold text-stone-200 text-xs truncate max-w-[140px]">
                  {currentUser.displayName || currentUser.email?.split('@')[0] || (language === 'vi' ? 'Cộng tác viên' : 'Guest Contributor')}
                </span>
                <span className="text-[10px] text-amber-400 font-medium">
                  {language === 'vi' ? 'Đã xác thực' : 'Authenticated'}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => signOut(auth)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-950/70 hover:bg-rose-900 border border-rose-800/60 text-rose-200 font-semibold transition-all cursor-pointer"
              title={language === 'vi' ? 'Đăng xuất khỏi Cổng Tri thức' : 'Sign out'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'vi' ? 'Đăng xuất' : 'Sign Out'}</span>
            </button>
          </div>
        </div>

        {/* Log metrics banner */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <div className="px-3 py-1 rounded-xl bg-emerald-950/80 text-emerald-300 font-bold border border-emerald-800/60">
            {language === 'vi' ? `Tổng di sản: ${heritages.length}` : `Heritages: ${heritages.length}`}
          </div>
          <div className="px-3 py-1 rounded-xl bg-amber-950/80 text-amber-300 font-bold border border-amber-800/60">
            {language === 'vi' ? `Chờ duyệt: ${pendingProposals.length}` : `Pending: ${pendingProposals.length}`}
          </div>
          <div className="px-3 py-1 rounded-xl bg-blue-950/80 text-blue-300 font-bold border border-blue-800/60">
            {language === 'vi' ? `Phiên bản: ${activeVersion}` : `Version: ${activeVersion}`}
          </div>
          <div className="px-3 py-1 rounded-xl bg-purple-950/80 text-purple-300 font-bold border border-purple-800/60">
            ⚡ Firebase Firestore Online
          </div>
        </div>

        <p className="text-stone-300 text-sm max-w-3xl leading-relaxed">
          {language === 'vi'
            ? 'HeritageVibe cho phép cộng đồng cùng kiến tạo và bổ sung di sản mới, đồng thời áp dụng quy trình kiểm tra chéo nghiêm ngặt: "Đề xuất → Kiểm tra chéo AI → Thẩm định bởi Chuyên gia Nhân văn → Phát hành Phiên bản & Lưu trữ Firestore".'
            : 'HeritageVibe empowers the community to curate and propose full new heritage items and updates, guarded by a strict Human-in-the-Loop review, Firestore synchronization, and release mechanism.'}
        </p>
      </div>

      {/* Main Grid: Pending Approval Queue & Contribution Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Human Review Approval Queue & Version Log (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Pending Reviews Card */}
          <div className="bg-white rounded-3xl border border-stone-200 p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-stone-100 pb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-bold font-heritage text-stone-900">
                  {language === 'vi' ? 'Hàng Đợi Chờ Chuyên Gia Duyệt' : 'Human Review Queue'}
                </h2>
              </div>
              <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full">
                {pendingProposals.length} {language === 'vi' ? 'đề xuất' : 'pending'}
              </span>
            </div>

            {pendingProposals.length === 0 ? (
              <div className="p-6 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                {language === 'vi' ? 'Hiện không có đề xuất nào đang chờ duyệt. Mọi dữ liệu đang ở trạng thái chuẩn mực!' : 'No pending proposals. All knowledge is currently in verified state.'}
              </div>
            ) : (
              <div className="space-y-4 max-h-[460px] overflow-y-auto pr-1">
                {pendingProposals.map((prop) => (
                  <div
                    key={prop.id}
                    id={`proposal-${prop.id}`}
                    className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-3 shadow-xs"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
                            {prop.heritageTitle}
                          </span>
                          <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            {prop.changeType}
                          </span>
                        </div>
                        <p className="text-xs font-medium text-stone-700 mt-1">
                          {prop.description}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                          AI: {prop.evalScore}%
                        </div>
                      </div>
                    </div>

                    {/* Diff comparison */}
                    <div className="space-y-2 text-xs">
                      {prop.originalText && (
                        <div className="p-2.5 bg-rose-50/70 border border-rose-200 rounded-xl">
                          <div className="font-bold text-rose-900 text-[10px] mb-0.5">
                            {language === 'vi' ? 'Dữ liệu Hiện tại:' : 'Original Fact:'}
                          </div>
                          <p className="text-rose-800 text-[11px] leading-relaxed line-clamp-3">{prop.originalText}</p>
                        </div>
                      )}
                      <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-xl">
                        <div className="font-bold text-emerald-900 text-[10px] mb-0.5">
                          {language === 'vi' ? 'Đề xuất Mới (Cần Duyệt):' : 'Proposed Update:'}
                        </div>
                        <p className="text-emerald-800 text-[11px] leading-relaxed line-clamp-3">{prop.proposedText}</p>
                      </div>
                    </div>

                    {/* Evidence & Action Buttons */}
                    <div className="pt-2 border-t border-amber-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                      <div className="text-stone-500 text-[10px] truncate max-w-[200px]">
                        Căn cứ: {prop.evidenceSource}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleReviewAction(prop.id, 'reject')}
                          disabled={actionLoading === prop.id}
                          className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 text-[11px] font-bold transition-all cursor-pointer"
                        >
                          {language === 'vi' ? 'Từ chối' : 'Reject'}
                        </button>
                        <button
                          onClick={() => handleReviewAction(prop.id, 'approve')}
                          disabled={actionLoading === prop.id}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>{language === 'vi' ? 'Duyệt' : 'Approve'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Version History & Emergency Rollback */}
            <div className="pt-5 border-t border-stone-100 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-amber-700" />
                  <h3 className="text-xs font-bold font-heritage text-stone-900">
                    {language === 'vi' ? 'Lịch Sử Phiên Bản Tri Thức' : 'Knowledge Versions'}
                  </h3>
                </div>

                <button
                  onClick={handleRollback}
                  className="px-2.5 py-0.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-800 text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <AlertTriangle className="w-3 h-3 text-rose-600" />
                  <span>{language === 'vi' ? 'Rollback v1.0.0' : 'Safety Rollback'}</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1">
                {versions.map((ver) => (
                  <div
                    key={ver.version}
                    className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                      ver.status === 'active'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-950 font-medium'
                        : 'bg-stone-50 border-stone-200 text-stone-600'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-2">
                        <span>{ver.version}</span>
                        {ver.status === 'active' && (
                          <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded-full font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-stone-500 truncate max-w-[220px]">{ver.changelog}</div>
                    </div>
                    <div className="text-[10px] text-stone-400 shrink-0">
                      {new Date(ver.timestamp).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Contribution Forms with Mode Switcher (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Switcher Navigation */}
          <div className="flex p-1.5 rounded-2xl bg-stone-100 border border-stone-200/80 gap-1.5">
            <button
              onClick={() => setContributionMode('create_heritage')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                contributionMode === 'create_heritage'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{language === 'vi' ? 'Tạo Mới 1 Di Sản Đầy Đủ' : 'Create Full Heritage'}</span>
            </button>

            <button
              onClick={() => setContributionMode('update')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                contributionMode === 'update'
                  ? 'bg-stone-900 text-amber-300 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>{language === 'vi' ? 'Đề Xuất Cập Nhật Dữ Kiện' : 'Propose Update'}</span>
            </button>

            <button
              onClick={() => setContributionMode('feedback')}
              className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                contributionMode === 'feedback'
                  ? 'bg-stone-900 text-amber-300 shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{language === 'vi' ? 'Góp Ý / Báo Lỗi' : 'Feedback'}</span>
            </button>
          </div>

          {/* MODE 1: CREATE FULL HERITAGE FORM */}
          {contributionMode === 'create_heritage' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-amber-700" />
                  <h2 className="text-base font-bold font-heritage text-stone-900">
                    {language === 'vi' ? 'Biểu Mẫu Khởi Tạo Di Sản Văn Hóa Toàn Diện' : 'Create Comprehensive Heritage Item'}
                  </h2>
                </div>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/60">
                  {language === 'vi' ? 'Đồng bộ tức thì' : 'Live Sync'}
                </span>
              </div>

              {newHeritageSuccessMsg && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-semibold flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{newHeritageSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleCreateNewHeritage} className="space-y-4 text-xs">
                
                {/* Basic Names */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Tên Di Sản (Tiếng Việt) *' : 'Heritage Title (Vietnamese) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newTitleVi}
                      onChange={(e) => setNewTitleVi(e.target.value)}
                      placeholder="VD: Nghệ thuật Thêu ren Cổ truyền Văn Lâm"
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Tên Di Sản (Tiếng Anh)' : 'Heritage Title (English)'}
                    </label>
                    <input
                      type="text"
                      value={newTitleEn}
                      onChange={(e) => setNewTitleEn(e.target.value)}
                      placeholder="VD: Van Lam Traditional Lace Embroidery Art"
                      className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Classification & Location */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Thể loại' : 'Category'}
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                    >
                      <option value="tangible">Vật thể (Tangible)</option>
                      <option value="intangible">Phi vật thể (Intangible)</option>
                      <option value="music-theater">Âm nhạc - Sân khấu</option>
                      <option value="craft">Làng nghề truyền thống</option>
                      <option value="culinary">Văn hóa Ẩm thực</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Vùng miền' : 'Region'}
                    </label>
                    <select
                      value={newRegion}
                      onChange={(e) => setNewRegion(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                    >
                      <option value="north">Miền Bắc</option>
                      <option value="central">Miền Trung</option>
                      <option value="south">Miền Nam</option>
                      <option value="islands">Biển Đảo</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Tỉnh / Thành phố *' : 'Province *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newProvince}
                      onChange={(e) => setNewProvince(e.target.value)}
                      placeholder="VD: Ninh Bình"
                      className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Công nhận' : 'Status'}
                    </label>
                    <div className="flex gap-1">
                      <select
                        value={newRecognitionType}
                        onChange={(e) => setNewRecognitionType(e.target.value as any)}
                        className="w-1/2 p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white text-[11px]"
                      >
                        <option value="unesco">UNESCO</option>
                        <option value="national">Quốc gia</option>
                      </select>
                      <input
                        type="number"
                        value={newRecognitionYear}
                        onChange={(e) => setNewRecognitionYear(e.target.value)}
                        placeholder="Năm"
                        className="w-1/2 p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white text-[11px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Summaries */}
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {language === 'vi' ? 'Tóm tắt tổng quan giá trị di sản (Tiếng Việt) *' : 'Overview Summary (Vietnamese) *'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newSummaryVi}
                    onChange={(e) => setNewSummaryVi(e.target.value)}
                    placeholder="Mô tả súc tích lịch sử, ý nghĩa văn hóa và giá trị đặc trưng của di sản..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {language === 'vi' ? 'Tóm tắt (Tiếng Anh)' : 'Overview Summary (English)'}
                  </label>
                  <textarea
                    rows={2}
                    value={newSummaryEn}
                    onChange={(e) => setNewSummaryEn(e.target.value)}
                    placeholder="Concise overview of historical background and cultural significance..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>

                {/* Grounded Facts */}
                <div className="space-y-2">
                  <label className="block font-bold text-stone-700">
                    {language === 'vi' ? 'Các Dữ Kiện Văn Hóa / Lịch Sử Xác Thực (Grounded Facts)' : 'Verified Historical Grounded Facts'}
                  </label>
                  <input
                    type="text"
                    value={newFact1}
                    onChange={(e) => setNewFact1(e.target.value)}
                    placeholder="Dữ kiện 1: Nguồn gốc hình thành và các mốc thời gian quan trọng..."
                    className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                  <input
                    type="text"
                    value={newFact2}
                    onChange={(e) => setNewFact2(e.target.value)}
                    placeholder="Dữ kiện 2: Kỹ thuật chế tác, nghi thức trình diễn hoặc dấu ấn kiến trúc..."
                    className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                  <input
                    type="text"
                    value={newFact3}
                    onChange={(e) => setNewFact3(e.target.value)}
                    placeholder="Dữ kiện 3: Giá trị bảo tồn và sinh hoạt cộng đồng đương đại..."
                    className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>

                {/* Sources & Image */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Nguồn thẩm định / Hồ sơ di sản' : 'Verification Source'}
                    </label>
                    <input
                      type="text"
                      value={newSourceName}
                      onChange={(e) => setNewSourceName(e.target.value)}
                      placeholder="VD: Cục Di sản Văn hóa - Bộ VHTTDL"
                      className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Link Ảnh Thumbnail (Unsplash/Tư liệu)' : 'Hero Image URL'}
                    </label>
                    <input
                      type="url"
                      value={newHeroImage}
                      onChange={(e) => setNewHeroImage(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Extra Details: Tags, Artisan Village, Coordinates & Author */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Làng nghề / Nghệ nhân tiêu biểu' : 'Artisan Village'}
                    </label>
                    <input
                      type="text"
                      value={newArtisanVillage}
                      onChange={(e) => setNewArtisanVillage(e.target.value)}
                      placeholder="VD: Làng nghề Văn Lâm, Hoa Lư"
                      className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Thẻ phân loại (ngăn cách bằng dấu phẩy)' : 'Tags'}
                    </label>
                    <input
                      type="text"
                      value={newTags}
                      onChange={(e) => setNewTags(e.target.value)}
                      placeholder="VD: Làng nghề, Thêu ren, Ninh Bình"
                      className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Người khởi tạo / Đóng góp' : 'Contributor Name'}
                    </label>
                    <input
                      type="text"
                      value={newAuthor}
                      onChange={(e) => setNewAuthor(e.target.value)}
                      placeholder="VD: Nhà nghiên cứu Nguyễn Văn An"
                      className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmittingNewHeritage}
                  className="w-full py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>
                    {isSubmittingNewHeritage
                      ? (language === 'vi' ? 'Đang thẩm định & lưu trữ...' : 'Verifying & Saving...')
                      : (language === 'vi' ? 'Tạo & Đưa Di Sản Vào Kho Tri Thức' : 'Create & Release Heritage')}
                  </span>
                </button>
              </form>
            </div>
          )}

          {/* MODE 2: PROPOSE FACT UPDATE FORM */}
          {contributionMode === 'update' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <Sparkles className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-bold font-heritage text-stone-900">
                  {language === 'vi' ? 'Đề Xuất Cập Nhật Tri Thức Di Sản Đã Có' : 'Propose Knowledge Update'}
                </h2>
              </div>

              {proposalSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{proposalSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmitProposal} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {language === 'vi' ? 'Di sản mục tiêu' : 'Target Heritage'}
                  </label>
                  <select
                    value={selectedHeritageId}
                    onChange={(e) => setSelectedHeritageId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  >
                    {heritages.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.titleVi} ({h.province})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Loại thay đổi' : 'Change Type'}
                    </label>
                    <select
                      value={changeType}
                      onChange={(e) => setChangeType(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                    >
                      <option value="fact_update">Cập nhật dữ kiện</option>
                      <option value="new_source">Bổ sung nguồn</option>
                      <option value="dialect_enhancement">Phương ngữ</option>
                      <option value="artisan_addition">Thêm nghệ nhân</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      {language === 'vi' ? 'Họ tên người đề xuất' : 'Author'}
                    </label>
                    <input
                      type="text"
                      value={authorName}
                      onChange={(e) => setAuthorName(e.target.value)}
                      placeholder="VD: TS. Nguyễn Văn A"
                      className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {language === 'vi' ? 'Mô tả lý do thay đổi' : 'Description'}
                  </label>
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="VD: Bổ sung niên đại lớp men rạn thời Mạc"
                    className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {language === 'vi' ? 'Nội dung đề xuất mới (Grounded Fact)' : 'Proposed Text'}
                  </label>
                  <textarea
                    rows={2}
                    value={proposedText}
                    onChange={(e) => setProposedText(e.target.value)}
                    placeholder="Nhập dữ kiện văn hóa lịch sử cần bổ sung..."
                    className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {language === 'vi' ? 'Căn cứ tài liệu / Nguồn thẩm định' : 'Evidence Source'}
                  </label>
                  <input
                    type="text"
                    value={evidenceSource}
                    onChange={(e) => setEvidenceSource(e.target.value)}
                    placeholder="VD: Hồ sơ UNESCO số #00183 / Viện Âm nhạc Quốc gia"
                    className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingProposal}
                  className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-300 font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'vi' ? 'Gửi Đề Xuất vào Hàng Đợi' : 'Stage Proposal for Human Review'}</span>
                </button>
              </form>
            </div>
          )}

          {/* MODE 3: COMMUNITY FEEDBACK & RATING */}
          {contributionMode === 'feedback' && (
            <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                <MessageSquare className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-bold font-heritage text-stone-900">
                  {language === 'vi' ? 'Góp Ý & Báo Cáo Sai Sót Di Sản' : 'Community Feedback & Correction'}
                </h2>
              </div>

              {feedbackSuccessMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold">
                  {feedbackSuccessMsg}
                </div>
              )}

              <form onSubmit={handleSubmitFeedback} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    {language === 'vi' ? 'Di sản cần góp ý' : 'Heritage'}
                  </label>
                  <select
                    value={feedbackHeritageId}
                    onChange={(e) => setFeedbackHeritageId(e.target.value)}
                    className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  >
                    {heritages.map((h) => (
                      <option key={h.id} value={h.id}>
                        {h.titleVi} ({h.province})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Loại phản hồi</label>
                    <select
                      value={feedbackType}
                      onChange={(e) => setFeedbackType(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                    >
                      <option value="strength">Khen ngợi / Điểm mạnh</option>
                      <option value="factual_error">Báo cáo sai sót lịch sử</option>
                      <option value="dialect_inaccuracy">Ngữ điệu chưa chuẩn</option>
                      <option value="missing_source">Thiếu nguồn thẩm định</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Đánh giá sao</label>
                    <select
                      value={feedbackRating}
                      onChange={(e) => setFeedbackRating(Number(e.target.value))}
                      className="w-full p-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                      <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                      <option value={3}>⭐⭐⭐ (3/5)</option>
                      <option value={2}>⭐⭐ (2/5)</option>
                      <option value={1}>⭐ (1/5)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">Ý kiến đóng góp</label>
                  <textarea
                    rows={3}
                    value={feedbackComment}
                    onChange={(e) => setFeedbackComment(e.target.value)}
                    placeholder="Ghi nhận điểm hay hoặc chi tiết cần cải thiện..."
                    className="w-full p-2.5 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmittingFeedback}
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-stone-950 font-bold transition-all cursor-pointer"
                >
                  {language === 'vi' ? 'Gửi Đóng Góp Ý Kiến' : 'Submit Feedback'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

