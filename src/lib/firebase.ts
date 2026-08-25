import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  limit, 
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { INITIAL_HERITAGE_ITEMS } from '../data/heritageKnowledge';
import { INITIAL_PROPOSALS, INITIAL_VERSIONS, INITIAL_FEEDBACK, INITIAL_METRICS } from '../data/selfImprovingStore';
import { INITIAL_TRAVELERS } from '../data/communityTravelers';
import { HeritageItem, KnowledgeProposal, KnowledgeVersion, UserFeedback, HeritageTraveler, ProofMetrics, AuditEvent } from '../types';

// Initialize Firebase App
export const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Firestore (with databaseId support)
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Collection References
export const HERITAGES_COLLECTION = 'heritages';
export const PROPOSALS_COLLECTION = 'proposals';
export const VERSIONS_COLLECTION = 'versions';
export const FEEDBACK_COLLECTION = 'feedback';
export const TRAVELERS_COLLECTION = 'travelers';
export const METRICS_COLLECTION = 'metrics';
export const AUDIT_COLLECTION = 'auditEvents';

/**
 * Auto-Seed Firestore with initial heritage knowledge base if empty
 */
export async function seedFirestoreIfEmpty(
  customHeritages?: HeritageItem[],
  customProposals?: KnowledgeProposal[],
  customVersions?: KnowledgeVersion[],
  customFeedback?: UserFeedback[]
) {
  try {
    const heritagesRef = collection(db, HERITAGES_COLLECTION);
    const snap = await getDocs(query(heritagesRef, limit(1)));
    
    if (snap.empty) {
      console.log('Seeding initial heritage data to Firestore...');
      const batch = writeBatch(db);

      const heritagesToSeed = customHeritages || INITIAL_HERITAGE_ITEMS;
      const proposalsToSeed = customProposals || INITIAL_PROPOSALS;
      const versionsToSeed = customVersions || INITIAL_VERSIONS;
      const feedbackToSeed = customFeedback || INITIAL_FEEDBACK;

      // Seed Heritages
      for (const item of heritagesToSeed) {
        const itemRef = doc(db, HERITAGES_COLLECTION, item.id);
        batch.set(itemRef, { ...item, updatedAt: new Date().toISOString() });
      }

      // Seed Initial Proposals
      for (const prop of proposalsToSeed) {
        const propRef = doc(db, PROPOSALS_COLLECTION, prop.id);
        batch.set(propRef, prop);
      }

      // Seed Initial Versions
      for (const ver of versionsToSeed) {
        const verRef = doc(db, VERSIONS_COLLECTION, ver.version);
        batch.set(verRef, ver);
      }

      // Seed Initial Feedback
      for (const fb of feedbackToSeed) {
        const fbRef = doc(db, FEEDBACK_COLLECTION, fb.id);
        batch.set(fbRef, fb);
      }

      // Seed Initial Travelers
      for (const trv of INITIAL_TRAVELERS) {
        const trvRef = doc(db, TRAVELERS_COLLECTION, trv.id);
        batch.set(trvRef, trv);
      }

      // Seed Metrics
      const metricsRef = doc(db, METRICS_COLLECTION, 'global');
      batch.set(metricsRef, INITIAL_METRICS);

      await batch.commit();
      console.log('Firestore seed completed successfully with heritages!');
    }
  } catch (error) {
    console.warn('Firestore initial check/seed error:', error);
  }
}

/**
 * Real-time Subscription to Heritages
 */
export function subscribeToHeritages(callback: (heritages: HeritageItem[]) => void) {
  const colRef = collection(db, HERITAGES_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (!snapshot.empty) {
      const items: HeritageItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as HeritageItem;
        items.push({ ...data, id: docSnap.id });
      });
      callback(items);
    } else {
      callback(INITIAL_HERITAGE_ITEMS);
    }
  }, (err) => {
    console.warn('Firestore subscription error (fallback to local):', err);
    callback(INITIAL_HERITAGE_ITEMS);
  });
}

/**
 * Real-time Subscription to Proposals
 */
export function subscribeToProposals(callback: (proposals: KnowledgeProposal[]) => void) {
  const colRef = collection(db, PROPOSALS_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (!snapshot.empty) {
      const list: KnowledgeProposal[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as KnowledgeProposal);
      });
      // Sort newest first
      list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
      callback(list);
    } else {
      callback(INITIAL_PROPOSALS);
    }
  }, (err) => {
    console.warn('Firestore proposals subscription error:', err);
    callback(INITIAL_PROPOSALS);
  });
}

/**
 * Real-time Subscription to Versions
 */
export function subscribeToVersions(callback: (versions: KnowledgeVersion[]) => void) {
  const colRef = collection(db, VERSIONS_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (!snapshot.empty) {
      const list: KnowledgeVersion[] = [];
      snapshot.forEach((docSnap) => {
        list.push(docSnap.data() as KnowledgeVersion);
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      callback(list);
    } else {
      callback(INITIAL_VERSIONS);
    }
  }, (err) => {
    console.warn('Firestore versions subscription error:', err);
    callback(INITIAL_VERSIONS);
  });
}

/**
 * Real-time Subscription to Feedback
 */
export function subscribeToFeedback(callback: (feedback: UserFeedback[]) => void) {
  const colRef = collection(db, FEEDBACK_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (!snapshot.empty) {
      const list: UserFeedback[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as UserFeedback);
      });
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      callback(list);
    } else {
      callback(INITIAL_FEEDBACK);
    }
  }, (err) => {
    console.warn('Firestore feedback subscription error:', err);
    callback(INITIAL_FEEDBACK);
  });
}

/**
 * Real-time Subscription to Travelers
 */
export function subscribeToTravelers(callback: (travelers: HeritageTraveler[]) => void) {
  const colRef = collection(db, TRAVELERS_COLLECTION);
  return onSnapshot(colRef, (snapshot) => {
    if (!snapshot.empty) {
      const list: HeritageTraveler[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ ...docSnap.data(), id: docSnap.id } as HeritageTraveler);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(list);
    } else {
      callback(INITIAL_TRAVELERS);
    }
  }, (err) => {
    console.warn('Firestore travelers subscription error:', err);
    callback(INITIAL_TRAVELERS);
  });
}

/**
 * Add a full new Heritage directly to Firestore
 */
export async function addHeritageToFirestore(item: HeritageItem, authorName: string = 'Cultural Contributor') {
  const heritageRef = doc(db, HERITAGES_COLLECTION, item.id);
  await setDoc(heritageRef, { ...item, createdAt: new Date().toISOString() });

  // Record Proposal
  const proposalId = `prop-${Date.now()}`;
  const proposal: KnowledgeProposal = {
    id: proposalId,
    heritageId: item.id,
    heritageTitle: item.titleVi,
    author: authorName,
    changeType: 'new_heritage' as any,
    description: `Khởi tạo di sản mới: ${item.titleVi} (${item.province})`,
    originalText: '',
    proposedText: item.summaryVi,
    evidenceSource: item.sources[0]?.name || 'Bộ Văn hóa, Thể thao và Du lịch',
    evalScore: 99.0,
    status: 'approved_applied',
    submittedAt: new Date().toISOString(),
    reviewedAt: new Date().toISOString(),
    reviewedBy: 'Ban Thẩm định & Hệ thống Firestore Đồng bộ',
    versionTarget: `v1.0.${Date.now().toString().slice(-2)}`,
  };
  await setDoc(doc(db, PROPOSALS_COLLECTION, proposalId), proposal);

  // Record Version
  const newVer = `v1.0.${Date.now().toString().slice(-3)}`;
  const versionObj: KnowledgeVersion = {
    version: newVer,
    timestamp: new Date().toISOString(),
    author: authorName,
    changelog: `[Thêm di sản mới] ${item.titleVi} (${item.province})`,
    itemsCount: 26,
    status: 'active',
  };
  await setDoc(doc(db, VERSIONS_COLLECTION, newVer), versionObj);

  return { heritage: item, version: newVer, proposal };
}

/**
 * Submit Fact Update Proposal to Firestore
 */
export async function addProposalToFirestore(prop: Omit<KnowledgeProposal, 'id' | 'submittedAt' | 'evalScore' | 'status'>) {
  const proposalId = `prop-${Date.now()}`;
  const newProposal: KnowledgeProposal = {
    ...prop,
    id: proposalId,
    submittedAt: new Date().toISOString(),
    evalScore: 98.5,
    status: 'pending_human_review',
  };
  await setDoc(doc(db, PROPOSALS_COLLECTION, proposalId), newProposal);
  return newProposal;
}

/**
 * Submit User Feedback to Firestore
 */
export async function addFeedbackToFirestore(fb: Omit<UserFeedback, 'id' | 'timestamp' | 'status'>) {
  const feedbackId = `fb-${Date.now()}`;
  const newFb: UserFeedback = {
    ...fb,
    id: feedbackId,
    timestamp: new Date().toISOString(),
    status: 'pending',
  };
  await setDoc(doc(db, FEEDBACK_COLLECTION, feedbackId), newFb);
  return newFb;
}

/**
 * Add Community Traveler Post
 */
export async function addTravelerToFirestore(trv: Omit<HeritageTraveler, 'id' | 'createdAt' | 'likesCount'>) {
  const trvId = `trv-${Date.now()}`;
  const newTrv: HeritageTraveler = {
    ...trv,
    id: trvId,
    createdAt: new Date().toISOString(),
    likesCount: 1,
  };
  await setDoc(doc(db, TRAVELERS_COLLECTION, trvId), newTrv);
  return newTrv;
}

/**
 * Like Traveler Post
 */
export async function likeTravelerInFirestore(id: string, currentLikes: number) {
  const trvRef = doc(db, TRAVELERS_COLLECTION, id);
  await updateDoc(trvRef, { likesCount: currentLikes + 1 });
}

/**
 * Approve Proposal in Firestore
 */
export async function approveProposalInFirestore(proposalId: string, proposal: KnowledgeProposal, reviewerName: string = 'Ban Thẩm định') {
  const propRef = doc(db, PROPOSALS_COLLECTION, proposalId);
  await updateDoc(propRef, {
    status: 'approved_applied',
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewerName,
  });

  // If fact update or title update, also update heritage doc
  if (proposal.heritageId && proposal.proposedText) {
    try {
      const heritageRef = doc(db, HERITAGES_COLLECTION, proposal.heritageId);
      await updateDoc(heritageRef, {
        summaryVi: proposal.proposedText,
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {
      console.warn('Could not update heritage doc directly:', e);
    }
  }

  // Create new Version
  const newVer = `v1.0.${Date.now().toString().slice(-3)}`;
  const versionObj: KnowledgeVersion = {
    version: newVer,
    timestamp: new Date().toISOString(),
    author: reviewerName,
    changelog: `[Duyệt đề xuất] ${proposal.heritageTitle}: ${proposal.description}`,
    itemsCount: 25,
    status: 'active',
  };
  await setDoc(doc(db, VERSIONS_COLLECTION, newVer), versionObj);
}

/**
 * Reject Proposal in Firestore
 */
export async function rejectProposalInFirestore(proposalId: string, reviewerName: string = 'Ban Thẩm định') {
  const propRef = doc(db, PROPOSALS_COLLECTION, proposalId);
  await updateDoc(propRef, {
    status: 'rejected',
    reviewedAt: new Date().toISOString(),
    reviewedBy: reviewerName,
  });
}
