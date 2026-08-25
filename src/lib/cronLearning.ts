import cron from 'node-cron';
import { GoogleGenAI } from '@google/genai';
import { HeritageItem } from '../types.ts';
import { db } from './firebase.ts';
import { collection, doc, setDoc } from 'firebase/firestore';

const HERITAGES_COLLECTION = 'heritages';

const SYSTEM_INSTRUCTION = `
You are a highly strictly factual Data Agent for a Vietnamese Heritage Knowledge Base.
Your task is to fetch/discover 10 NEW cultural heritages, historical sites, or natural landscapes in Vietnam that are officially recognized.
DO NOT HALLUCINATE. Only provide real, verifiable heritages.
Return the output EXACTLY as a raw JSON array of objects. Do not include markdown \`\`\`json blocks, just the raw array.
Each object must strictly conform to the following TypeScript interface:

interface HeritageItem {
    id: string; // unique URL-friendly slug, e.g. "lang-sen-que-bac"
    titleVi: string;
    titleEn: string;
    category: 'tangible' | 'intangible' | 'mixed' | 'documentary';
    region: 'north' | 'central' | 'south';
    province: string;
    unescoYear?: number;
    nationalYear?: number;
    summaryVi: string;
    summaryEn: string;
    groundedFacts: string[]; // 3-4 verifiable facts
    sources: { name: string; url: string; type: 'government_archive' | 'unesco_registry' | 'academic_journal' | 'trusted_news' }[];
    promptSeedVi: string; // Midjourney/Image gen prompt in Vietnamese
    promptSeedEn: string; // Image gen prompt in English
    heroImage: string; // MUST BE: "https://tse1.mm.bing.net/th?q=Hinh+anh+" + URL_ENCODED_TITLE (e.g. "https://tse1.mm.bing.net/th?q=Hinh+anh+Co+do+Hue")
    tags: string[];
    artisanVillage?: string;
    coordinates?: { lat: number; lng: number };
}

CRITICAL REQUIREMENT FOR IMAGES:
To ensure images always load, you MUST NEVER hallucinate URLs. For the 'heroImage' field, you must construct a Bing Image Search proxy URL by appending the URL-encoded Vietnamese name of the heritage to the base URL.
Format: "https://tse1.mm.bing.net/th?q=Hinh+anh+" + [URL_ENCODED_TITLE]
Example: "https://tse1.mm.bing.net/th?q=Hinh+anh+C%E1%BB%91+%C4%91%C3%B4+Hu%E1%BA%BF"

If you cannot find 10, return as many as you are 100% sure of.
`;

export async function runLearningJob(
  getGenAI: () => GoogleGenAI | null,
  generateGeminiWithFallback: (ai: GoogleGenAI, params: any) => Promise<string | null>,
  getActiveItems: () => HeritageItem[],
  onNewItemsAdded: (items: HeritageItem[]) => void,
  logAudit: (type: any, title: string, detail: string, status: any) => void
) {
  console.log('[Cron] Starting AI learning job...');
  const ai = getGenAI();
  if (!ai) {
    console.warn('[Cron] Gemini API not configured. Skipping learning.');
    return { success: false, message: 'Gemini API not configured' };
  }

  try {
    const activeItems = getActiveItems();
    if (activeItems.length >= 500) {
      console.log('[Cron] Database has reached the maximum capacity of 500 items. Skipping learning.');
      return { success: true, count: 0, message: 'Max capacity reached' };
    }
    const existingNames = activeItems.map(i => i.titleVi).join(', ');

    const prompt = `
Find 10 verifiable Vietnamese cultural/historical/natural heritages.
DO NOT include any of the following existing items:
${existingNames}

Return a raw JSON array matching the HeritageItem schema exactly.
`;

    const responseText = await generateGeminiWithFallback(ai, {
      contents: prompt,
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: 'application/json',
    });

    if (!responseText) {
      console.warn('[Cron] AI returned empty response.');
      return { success: false, message: 'Empty AI response' };
    }

    const parsedItems: HeritageItem[] = JSON.parse(responseText);
    if (!Array.isArray(parsedItems) || parsedItems.length === 0) {
      console.warn('[Cron] Parsed items is empty or not an array.');
      return { success: false, message: 'Parsed items is empty' };
    }

    let newItemsAdded = 0;
    const validNewItems: HeritageItem[] = [];

    for (const item of parsedItems) {
      // Validate basic fields
      if (!item.id || !item.titleVi || !item.heroImage) continue;
      
      // Ensure no duplicate ID
      if (activeItems.some(existing => existing.id === item.id)) continue;

      validNewItems.push(item);

      // Sync to Firestore immediately
      const docRef = doc(db, HERITAGES_COLLECTION, item.id);
      await setDoc(docRef, item, { merge: true });
      newItemsAdded++;
    }

    if (newItemsAdded > 0) {
      onNewItemsAdded(validNewItems);
      logAudit(
        'proposal_created',
        `AI Auto-Learning: Thêm ${newItemsAdded} di sản mới`,
        `Tác vụ tìm kiếm AI đã tự động khám phá và thêm vào cơ sở dữ liệu.`,
        'verified'
      );
      console.log(`[Cron] Successfully learned ${newItemsAdded} new heritages.`);
      return { success: true, count: newItemsAdded, newItems: validNewItems };
    } else {
      console.log('[Cron] No new unique heritages found today.');
      return { success: true, count: 0, message: 'No new unique items found' };
    }
  } catch (error) {
    console.error('[Cron] Error during AI learning job:', error);
    return { success: false, error: String(error) };
  }
}

export function setupDailyLearningCron(
  getGenAI: () => GoogleGenAI | null,
  generateGeminiWithFallback: (ai: GoogleGenAI, params: any) => Promise<string | null>,
  getActiveItems: () => HeritageItem[],
  onNewItemsAdded: (items: HeritageItem[]) => void,
  logAudit: (type: any, title: string, detail: string, status: any) => void
) {
  // Run daily at 23:59
  cron.schedule('59 23 * * *', async () => {
    await runLearningJob(getGenAI, generateGeminiWithFallback, getActiveItems, onNewItemsAdded, logAudit);
  });
}
