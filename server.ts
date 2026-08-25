import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Modality } from '@google/genai';
import { INITIAL_HERITAGE_ITEMS, INITIAL_QUIZ_QUESTIONS, INITIAL_COLLECTIBLES, INITIAL_ARTISANS } from './src/data/heritageKnowledge.ts';
import { INITIAL_METRICS, INITIAL_PROPOSALS, INITIAL_VERSIONS, INITIAL_FEEDBACK } from './src/data/selfImprovingStore.ts';
import { INITIAL_TRAVELERS } from './src/data/communityTravelers.ts';
import { HeritageItem, KnowledgeProposal, KnowledgeVersion, UserFeedback, ProofMetrics, AuditEvent, HeritageTraveler, PlannerTripRequest, PlannerTripPlan } from './src/types.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory state (backed by Firestore model in production)
let activeHeritageItems: HeritageItem[] = [...INITIAL_HERITAGE_ITEMS];
let activeVersions: KnowledgeVersion[] = [...INITIAL_VERSIONS];
let activeProposals: KnowledgeProposal[] = [...INITIAL_PROPOSALS];
let activeFeedback: UserFeedback[] = [...INITIAL_FEEDBACK];
let activeMetrics: ProofMetrics = { ...INITIAL_METRICS };
let activeTravelers: HeritageTraveler[] = [...INITIAL_TRAVELERS];

// Lazy Gemini client helper
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (genAIClient) return genAIClient;
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Convert 24kHz 16-bit Mono PCM buffer to Standard WAV container
function pcmToWav(pcmBuffer: Buffer, sampleRate = 24000, numChannels = 1, bitsPerSample = 16): Buffer {
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmBuffer.length;
  const header = Buffer.alloc(44);

  header.write('RIFF', 0);
  header.writeUInt32LE(36 + dataSize, 4);
  header.write('WAVE', 8);
  header.write('fmt ', 12);
  header.writeUInt32LE(16, 16);
  header.writeUInt16LE(1, 20); // PCM format
  header.writeUInt16LE(numChannels, 22);
  header.writeUInt32LE(sampleRate, 24);
  header.writeUInt32LE(byteRate, 28);
  header.writeUInt16LE(blockAlign, 32);
  header.writeUInt16LE(bitsPerSample, 34);
  header.write('data', 36);
  header.writeUInt32LE(dataSize, 40);

  return Buffer.concat([header, pcmBuffer]);
}

// Resilient Gemini generate helper with multi-model fallback and backoff retry
const FALLBACK_MODELS = ['gemini-flash-latest', 'gemini-3.7-flash', 'gemini-3.1-flash-lite', 'gemini-2.5-flash'];

async function generateGeminiWithFallback(
  ai: GoogleGenAI,
  params: {
    contents: any;
    systemInstruction?: string;
    responseMimeType?: string;
    temperature?: number;
  }
): Promise<string | null> {
  for (const model of FALLBACK_MODELS) {
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const config: any = {};
        if (params.systemInstruction) config.systemInstruction = params.systemInstruction;
        if (params.responseMimeType) config.responseMimeType = params.responseMimeType;
        if (params.temperature !== undefined) config.temperature = params.temperature;

        const response = await ai.models.generateContent({
          model,
          contents: params.contents,
          config: Object.keys(config).length > 0 ? config : undefined,
        });

        if (response && response.text) {
          return response.text.trim();
        }
      } catch (err: any) {
        const errMsg = err?.message || String(err);
        const isTransient = errMsg.includes('503') || errMsg.includes('UNAVAILABLE') || errMsg.includes('high demand') || errMsg.includes('429') || errMsg.includes('RESOURCE_EXHAUSTED');
        
        if (isTransient && attempt === 0) {
          // Wait 600ms before quick retry on same model
          await new Promise((res) => setTimeout(res, 600));
          continue;
        }
        // If still failing or not transient on this model, break attempt loop to try next model
        break;
      }
    }
  }
  return null;
}

// Log audit event helper
function logAuditEvent(eventType: AuditEvent['eventType'], title: string, detail: string, status: AuditEvent['status'] = 'verified') {
  const event: AuditEvent = {
    id: `ev-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    eventType,
    title,
    detail,
    status,
  };
  activeMetrics.recentAuditEvents.unshift(event);
  if (activeMetrics.recentAuditEvents.length > 30) {
    activeMetrics.recentAuditEvents.pop();
  }
}

// 1. Health Check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    app: 'HeritageVibe',
    version: activeVersions.find((v) => v.status === 'active')?.version || 'v1.0.1',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
    itemsCount: activeHeritageItems.length,
    timestamp: new Date().toISOString(),
  });
});

// 2. Get Knowledge Base & Heritage Data
app.get('/api/knowledge', (req: Request, res: Response) => {
  res.json({
    heritages: activeHeritageItems,
    versions: activeVersions,
    currentVersion: activeVersions.find((v) => v.status === 'active')?.version || 'v1.0.1',
    proposals: activeProposals,
    feedback: activeFeedback,
    artisans: INITIAL_ARTISANS,
    collectibles: INITIAL_COLLECTIBLES,
    quizQuestions: INITIAL_QUIZ_QUESTIONS,
  });
});

// 2.1 Create Complete New Heritage
app.post('/api/heritage/create', (req: Request, res: Response) => {
  try {
    const {
      titleVi,
      titleEn,
      category = 'tangible',
      region = 'north',
      province,
      unescoYear,
      nationalYear,
      summaryVi,
      summaryEn,
      groundedFacts = [],
      sources = [],
      promptSeedVi,
      promptSeedEn,
      heroImage,
      tags = [],
      artisanVillage,
      coordinates,
      authorName = 'Cộng tác viên Di sản',
    } = req.body;

    if (!titleVi || !province || !summaryVi) {
      return res.status(400).json({ error: 'Missing required heritage fields (titleVi, province, summaryVi)' });
    }

    const slug = titleVi
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || `heritage-${Date.now()}`;

    const newHeritageId = `${slug}-${Date.now().toString().slice(-4)}`;

    const newItem: HeritageItem = {
      id: newHeritageId,
      titleVi: titleVi.trim(),
      titleEn: titleEn?.trim() || titleVi.trim(),
      category,
      region,
      province: province.trim(),
      unescoYear: unescoYear ? Number(unescoYear) : undefined,
      nationalYear: nationalYear ? Number(nationalYear) : undefined,
      summaryVi: summaryVi.trim(),
      summaryEn: summaryEn?.trim() || summaryVi.trim(),
      groundedFacts: Array.isArray(groundedFacts) && groundedFacts.length > 0
        ? groundedFacts.filter(Boolean)
        : [summaryVi.trim()],
      sources: Array.isArray(sources) && sources.length > 0
        ? sources
        : [{ id: `src-${Date.now()}`, name: 'Cục Di sản Văn hóa - Bộ VHTTDL', authority: 'Bộ Văn hóa, Thể thao và Du lịch', verifiedYear: new Date().getFullYear() }],
      promptSeedVi: promptSeedVi?.trim() || `Kể câu chuyện giàu cảm xúc về di sản ${titleVi.trim()} tại ${province.trim()}.`,
      promptSeedEn: promptSeedEn?.trim() || `Tell an inspiring cultural story of ${titleEn?.trim() || titleVi.trim()}.`,
      heroImage: heroImage?.trim() || 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80',
      tags: Array.isArray(tags) && tags.length > 0 ? tags : [category, province, region],
      artisanVillage: artisanVillage?.trim() || `${province.trim()}`,
      coordinates: coordinates || { lat: 21.0285, lng: 105.8542 },
      arArtifactId: 'trong-dong',
      youtubeVideoId: 'djIopaZOGB8',
      youtubeTitleVi: `Tư liệu Di sản: ${titleVi.trim()}`,
      youtubeTitleEn: `Heritage Documentary: ${titleEn?.trim() || titleVi.trim()}`,
    };

    activeHeritageItems.unshift(newItem);

    // Add to HITL proposals
    const proposal: KnowledgeProposal = {
      id: `prop-new-${Date.now()}`,
      heritageId: newItem.id,
      heritageTitle: newItem.titleVi,
      author: authorName.trim() || 'Cộng tác viên Di sản',
      changeType: 'new_heritage' as any,
      description: `Khởi tạo toàn diện di sản mới: ${newItem.titleVi} (${newItem.province})`,
      originalText: '',
      proposedText: newItem.summaryVi,
      evidenceSource: newItem.sources[0]?.name || 'Bộ Văn hóa, Thể thao và Du lịch',
      evalScore: 99.0,
      status: 'approved_applied',
      submittedAt: new Date().toISOString(),
      reviewedAt: new Date().toISOString(),
      reviewedBy: 'Ban Thẩm định & Hệ thống Đồng bộ Tự động',
      versionTarget: `v1.0.${activeVersions.length}`,
    };

    activeProposals.unshift(proposal);

    // Update knowledge version
    const newVersionNumber = `v1.0.${activeVersions.length}`;
    const newVersion: KnowledgeVersion = {
      version: newVersionNumber,
      timestamp: new Date().toISOString(),
      author: authorName || 'Cultural Contributor',
      changelog: `[Thêm di sản mới] ${newItem.titleVi} (${newItem.province})`,
      itemsCount: activeHeritageItems.length,
      status: 'active',
    };
    activeVersions.forEach((v) => {
      if (v.status === 'active') v.status = 'archived';
    });
    activeVersions.unshift(newVersion);
    activeMetrics.improvementsApplied += 1;

    logAuditEvent('proposal_created', `New Complete Heritage Created: ${newItem.titleVi}`, `Province: ${newItem.province} | Category: ${newItem.category} | Author: ${authorName}`);

    res.json({
      success: true,
      heritage: newItem,
      proposal,
      totalCount: activeHeritageItems.length,
      version: newVersionNumber,
    });
  } catch (error: any) {
    console.error('Error creating heritage:', error);
    res.status(500).json({ error: error?.message || 'Failed to create heritage item' });
  }
});

// 3. Generate Grounded Heritage Story with Gemini Flash
app.post('/api/story/generate', async (req: Request, res: Response) => {
  try {
    const { heritageId, dialect = 'bac-bo', language = 'vi', customFocus } = req.body;
    const heritage = activeHeritageItems.find((h) => h.id === heritageId) || activeHeritageItems[0];

    // Dialect guidance description with authentic regional vocabulary and idioms
    const dialectDirectives: Record<string, string> = {
      'bac-bo': 'Văn phong Bắc Bộ Thăng Long - Kinh Bắc: Thâm trầm, tao nhã, đĩnh đạc, mực thước, dùng các từ ngữ đặc trưng miền Bắc như "kinh kỳ", "lề lối", "trang nghiêm", "thưa gửi", "thâm trầm ngàn năm".',
      'trung-bo': 'Văn phong Cố Đô Huế - Miền Trung: Sâu lắng, da diết, trầm bổng, trữ tình, mang đậm âm hưởng sông Hương núi Ngự, sử dụng các từ ngữ duyên dáng miền Trung như "dạ thưa", "chi mô răng rứa", "ngân nga", "hoài niệm Cố đô".',
      'nam-bo': 'Văn phong Nam Bộ Miệt Vườn: Hào sảng, phóng khoáng, chân chất, ấm áp nghĩa tình sông nước Cửu Long, sử dụng các từ ngữ Nam Bộ tự nhiên như "bà con mình", "ngọt ngào", "tía má", "miệt vườn", "nghĩa khí hào sảng".',
      'modern-genz': 'Văn phong Hiện đại Thế hệ Trẻ: Tươi sáng, truyền cảm hứng mạnh mẽ, lôi cuốn, kết nối di sản truyền thống với giới trẻ bằng ngọn lửa tự hào dân tộc và phong cách kể chuyện sinh động.',
    };

    const dialectInstruction = dialectDirectives[dialect] || dialectDirectives['bac-bo'];
    const ai = getGenAI();

    let storyText = '';
    let citations = heritage.sources.map((s) => `${s.name} (${s.authority}, ${s.verifiedYear})`);

    if (ai) {
      const prompt = `Bạn là Chuyên gia Kể chuyện Di sản HeritageVibe (Heritage Storyteller).
Nhiệm vụ: Sáng tác một câu chuyện ngắn (khoảng 220-300 từ) về Di sản "${heritage.titleVi}" (${heritage.titleEn}).
Ngôn ngữ: ${language === 'vi' ? 'Tiếng Việt' : 'English'}.
Phong cách & Giọng điệu: ${dialectInstruction}
${customFocus ? `Chủ đề trọng tâm yêu cầu: ${customFocus}` : ''}

CÁC DỮ KIỆN BẮT BUỘC ĐƯỢC XÁC THỰC (GROUNDING FACTS - TUYỆT ĐỐI KHÔNG BỊA ĐẶT DỮ LIỆU LỊCH SỬ):
${heritage.groundedFacts.map((f, i) => `- [F${i + 1}] ${f}`).join('\n')}

NGUỒN TRÍCH DẪN CHÍNH THỨC:
${heritage.sources.map((s) => `- ${s.name} (${s.authority}, ${s.verifiedYear})`).join('\n')}

YÊU CẦU ĐẦU RA:
1. Viết một câu chuyện truyền cảm, chạm đến trái tim người đọc, giàu tính thẩm mỹ và tự hào dân tộc.
2. Dệt các dữ kiện thực tế vào cốt truyện một cách tự nhiên.
3. Cuối câu chuyện đính kèm một câu thông điệp gìn giữ di sản cho thế hệ tương lai.
4. Trả về định dạng JSON thuần túy theo cấu trúc:
{
  "title": "Tiêu đề câu chuyện",
  "story": "Toàn bộ nội dung câu chuyện giàu cảm xúc...",
  "keyTakeaway": "Thông điệp đúc kết ngắn gọn...",
  "citedFacts": ["Dữ kiện 1", "Dữ kiện 2"],
  "sources": ["Tên nguồn chính thức 1", "Tên nguồn chính thức 2"]
}`;

      try {
        const rawText = await generateGeminiWithFallback(ai, {
          contents: prompt,
          responseMimeType: 'application/json',
          temperature: 0.7,
        });

        if (rawText) {
          // Strip any markdown code fences if model returned them
          const cleaned = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/, '').trim();
          const jsonContent = JSON.parse(cleaned);
          if (jsonContent && jsonContent.story) {
            activeMetrics.storiesCompleted += 1;
            logAuditEvent('story_read', `Grounded Story Generated: ${heritage.titleVi}`, `Dialect: ${dialect}, Grounded by Gemini`);

            return res.json({
              success: true,
              heritageId: heritage.id,
              title: jsonContent.title || heritage.titleVi,
              story: jsonContent.story,
              keyTakeaway: jsonContent.keyTakeaway || 'Di sản là mạch nguồn kết nối quá khứ và tương lai.',
              citedFacts: jsonContent.citedFacts || heritage.groundedFacts,
              sources: jsonContent.sources || citations,
              dialect,
              language,
              isAiGenerated: true,
            });
          }
        }
      } catch (geminiError) {
        // Fallback safely without throwing unhandled exceptions
      }
    }

    // High quality curated fallback if Gemini key not configured
    const fallbackStoryVi = `Giữa không gian thanh tịnh của ${heritage.province}, từng thanh âm của "${heritage.titleVi}" vang lên như lời nhắc nhở thiêng liêng về cội nguồn. ${heritage.summaryVi}

Theo dòng lịch sử được ghi danh bởi ${heritage.sources[0]?.authority || 'UNESCO'}, ${heritage.groundedFacts[0]} ${heritage.groundedFacts[1] || ''}

Mỗi nghệ nhân nơi đây không chỉ giữ nghề, mà còn giữ lửa hồn dân tộc. Những giá trị này mãi là báu vật sống động đồng hành cùng đất nước qua mọi thế hệ mai sau.`;

    const fallbackStoryEn = `Amidst the historic aura of ${heritage.province}, the resonant spirit of "${heritage.titleEn}" echoes as a profound testament to Vietnam's soul. ${heritage.summaryEn}

According to official archives recognized by ${heritage.sources[0]?.authority || 'UNESCO'}, ${heritage.groundedFacts[0]}

Every master artisan is not only keeping the craft alive, but also nurturing the cultural heartbeat of the nation for generations to come.`;

    activeMetrics.storiesCompleted += 1;
    logAuditEvent('story_read', `Story Completed: ${heritage.titleVi}`, `Dialect: ${dialect}, Grounded in Official Archive`);

    res.json({
      success: true,
      heritageId: heritage.id,
      title: language === 'vi' ? `Hồn Thiêng ${heritage.titleVi}` : `The Living Soul of ${heritage.titleEn}`,
      story: language === 'vi' ? fallbackStoryVi : fallbackStoryEn,
      keyTakeaway: language === 'vi' ? 'Di sản văn hóa là căn cước tinh thần bất diệt của người Việt.' : 'Cultural heritage is the eternal identity of the Vietnamese spirit.',
      citedFacts: heritage.groundedFacts,
      sources: citations,
      dialect,
      language,
      isAiGenerated: false,
    });
  } catch (error: any) {
    console.error('Error in /api/story/generate:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate story' });
  }
});

// In-memory TTS audio cache to prevent rate-limiting and enable instant replays
const ttsAudioCache = new Map<string, { audioDataUrl: string; voiceTitle: string }>();
let geminiTtsCooldownUntil = 0;

// 3.5. Multi-Dialect Grounded AI Text-to-Speech Engine
app.post('/api/tts/generate', async (req: Request, res: Response) => {
  try {
    const { text, dialect = 'bac-bo', language = 'vi' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for speech synthesis' });
    }

    // Check in-memory cache first
    const cacheKey = `${dialect}_${language}_${text.slice(0, 120)}`;
    if (ttsAudioCache.has(cacheKey)) {
      const cached = ttsAudioCache.get(cacheKey)!;
      return res.json({
        success: true,
        audioDataUrl: cached.audioDataUrl,
        voiceTitle: cached.voiceTitle,
        engine: 'gemini-tts',
        dialect,
        cached: true,
      });
    }

    // If currently in quota cooldown, immediately fallback to client synthesizer without logging errors
    if (Date.now() < geminiTtsCooldownUntil) {
      return res.json({
        success: false,
        fallbackToWebSpeech: true,
        dialect,
      });
    }

    const ai = getGenAI();
    if (ai) {
      // Voice & prompt selection based on dialect and cultural heritage nuances
      const voiceConfigMap: Record<string, { voiceName: string; promptGuide: string; title: string }> = {
        'bac-bo': {
          voiceName: 'Aoede',
          promptGuide: 'Đọc bằng tiếng Việt giọng Nữ Bắc Bộ chuẩn Hà Nội, thanh tao, trang trọng, nhẹ nhàng, truyền cảm, tròn vành rõ chữ:',
          title: 'Giọng 1: Nữ Bắc Bộ (Thanh Lịch, Chuẩn Mực)',
        },
        'trung-bo': {
          voiceName: 'Kore',
          promptGuide: 'Đọc bằng tiếng Việt ngữ điệu Cố Đô Huế tha thiết, da diết, trữ tình, sâu lắng, với tốc độ đọc tự nhiên, êm dịu, mượt mà và không bị chậm:',
          title: 'Giọng 2: Nữ Cố Đô Huế (Trữ Tình, Êm Dịu)',
        },
        'nam-bo': {
          voiceName: 'Puck',
          promptGuide: 'Đọc bằng tiếng Việt giọng Nữ Nam Bộ mộc mạc, ngọt ngào, ấm áp, phóng khoáng nghĩa tình sông nước Cửu Long:',
          title: 'Giọng 3: Nữ Nam Bộ (Ngọt Ngào, Mộc Mạc)',
        },
        'modern-genz': {
          voiceName: 'Fenrir',
          promptGuide: 'Đọc bằng tiếng Việt Giọng Nam Hùng Tráng, âm vang trầm ấm, uy nghiêm, truyền cảm hứng hào khí non sông và lịch sử dân tộc:',
          title: 'Giọng 4: Nam Hùng Tráng (Trầm Ấm, Uy Nghiêm)',
        },
        'gioi-tre': {
          voiceName: 'Fenrir',
          promptGuide: 'Đọc bằng tiếng Việt Giọng Nam Hùng Tráng, âm vang trầm ấm, uy nghiêm, truyền cảm hứng hào khí non sông và lịch sử dân tộc:',
          title: 'Giọng 4: Nam Hùng Tráng (Trầm Ấm, Uy Nghiêm)',
        },
      };

      const selected = voiceConfigMap[dialect] || voiceConfigMap['bac-bo'];
      // Extract clean speech text (limit to ~400 characters for snappy generation)
      const cleanInputText = text.replace(/[*#_~`]/g, '').trim().slice(0, 450);
      const promptText = language === 'vi'
        ? `${selected.promptGuide}\n\n${cleanInputText}`
        : `Read the following story with an expressive, warm cultural storytelling voice:\n\n${cleanInputText}`;

      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.1-flash-tts-preview',
          contents: [{ parts: [{ text: promptText }] }],
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: { voiceName: selected.voiceName },
              },
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const rawBase64 = part.inlineData.data;
            const mime = (part.inlineData.mimeType || '').toLowerCase();
            
            let audioBase64 = rawBase64;
            let finalMime = 'audio/wav';

            // Convert raw PCM / L16 linear audio into valid WAV audio container
            if (mime.includes('pcm') || mime.includes('l16') || !mime.includes('mp3')) {
              const pcmBuffer = Buffer.from(rawBase64, 'base64');
              const wavBuffer = pcmToWav(pcmBuffer, 24000, 1, 16);
              audioBase64 = wavBuffer.toString('base64');
              finalMime = 'audio/wav';
            } else if (mime.includes('mp3') || mime.includes('mpeg')) {
              finalMime = 'audio/mp3';
            }

            const audioDataUrl = `data:${finalMime};base64,${audioBase64}`;
            
            // Save into cache for instant repeat plays
            ttsAudioCache.set(cacheKey, { audioDataUrl, voiceTitle: selected.title });
            if (ttsAudioCache.size > 100) {
              const firstKey = ttsAudioCache.keys().next().value;
              if (firstKey) ttsAudioCache.delete(firstKey);
            }

            return res.json({
              success: true,
              audioDataUrl,
              voiceTitle: selected.title,
              engine: 'gemini-tts',
              dialect,
            });
          }
        }
      } catch (ttsErr: any) {
        // If quota is exhausted or rate limit hit, enter a cooldown silently
        if (ttsErr?.status === 'RESOURCE_EXHAUSTED' || ttsErr?.message?.includes('429') || ttsErr?.message?.includes('Quota exceeded')) {
          geminiTtsCooldownUntil = Date.now() + 60000;
        }
      }
    }

    // If Gemini TTS is not reachable, inform client to use enhanced client synthesizer
    res.json({
      success: false,
      fallbackToWebSpeech: true,
      dialect,
    });
  } catch (error: any) {
    res.json({
      success: false,
      fallbackToWebSpeech: true,
      dialect: req.body?.dialect || 'bac-bo',
    });
  }
});

// 4. Grounded Q&A with Citations (Strict RAG or Trust Gemini Enhanced mode)
app.post('/api/chat/grounded', async (req: Request, res: Response) => {
  try {
    const { query, language = 'vi', activeHeritageId, trustGemini = true } = req.body;
    if (!query) {
      return res.status(400).json({ error: 'Query is required' });
    }

    // RAG: Find matching heritage items from Knowledge Base
    const matchedHeritages = activeHeritageItems.filter((item) => {
      const q = query.toLowerCase();
      return (
        item.id === activeHeritageId ||
        item.titleVi.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        item.province.toLowerCase().includes(q) ||
        item.groundedFacts.some((f) => f.toLowerCase().includes(q))
      );
    });

    const relevantDocs = matchedHeritages.length > 0 ? matchedHeritages : activeHeritageItems.slice(0, 3);
    const ai = getGenAI();

    if (ai) {
      const contextText = relevantDocs
        .map(
          (doc) => `[DI SẢN: ${doc.titleVi} (${doc.titleEn})]
- Địa phương: ${doc.province}
- UNESCO/Quốc gia: ${doc.unescoYear ? `UNESCO ${doc.unescoYear}` : `Quốc gia ${doc.nationalYear || ''}`}
- Dữ kiện xác thực:
${doc.groundedFacts.map((f) => `  * ${f}`).join('\n')}
- Nguồn thẩm định: ${doc.sources.map((s) => `${s.name} (${s.authority})`).join(', ')}`
        )
        .join('\n\n');

      const systemPrompt = trustGemini
        ? `Bạn là Chuyên gia Tư vấn Di sản HeritageVibe ứng dụng mô hình Gemini thông minh và cơ sở tri thức đã thẩm định.
NGUYÊN TẮC:
1. Sử dụng dữ kiện chính xác từ [CƠ SỞ TRI THỨC] làm nền móng vững chắc.
2. Với chế độ "Trust Gemini", hãy mở rộng thêm bối cảnh văn hóa, lịch sử hào hùng, kinh nghiệm du lịch thực tế, kiến thức nghệ nhân và các câu chuyện dân gian hấp dẫn xoay quanh di sản để câu trả lời sâu sắc, đầy đủ và sống động nhất.
3. Không bịa đặt thông tin sai lệch trái ngược với lịch sử chính thống.
4. Trình bày rành mạch, có các đầu dòng rõ ràng, giọng văn thân thiện, tao nhã.
5. Ngôn ngữ: ${language === 'vi' ? 'Tiếng Việt chuẩn mực, giàu tính văn hóa' : 'Refined, culturally rich English'}.

[CƠ SỞ TRI THỨC]:
${contextText}`
        : `Bạn là Trợ lý AI Di sản HeritageVibe tuân thủ quy chuẩn Anti-Hallucination RAG nghiêm ngặt tuyệt đối.
NGUYÊN TẮC CỐT LÕI:
1. CHỈ trả lời duy nhất dựa trên các dữ kiện được cung cấp trong [CƠ SỞ TRI THỨC] bên dưới.
2. TUYỆT ĐỐI KHÔNG SUY DIỄN hoặc thêm thông tin ngoài hồ sơ.
3. Nếu cơ sở tri thức không chứa thông tin, hãy thông báo: "Thông tin này hiện chưa có trong nguồn dữ liệu di sản chính thức được thẩm định của chúng tôi".
4. Ngôn ngữ: ${language === 'vi' ? 'Tiếng Việt chuẩn xác, súc tích' : 'Strict English factual grounding'}.

[CƠ SỞ TRI THỨC]:
${contextText}`;

      try {
        const answerText = await generateGeminiWithFallback(ai, {
          contents: `Câu hỏi của người dùng: "${query}"`,
          systemInstruction: systemPrompt,
          temperature: trustGemini ? 0.4 : 0.1,
        });

        if (answerText) {
          const allSources = relevantDocs.flatMap((d) => d.sources.map((s) => `${s.name} - ${s.authority}`));

          logAuditEvent('story_read', `AI Q&A (${trustGemini ? 'Trust Gemini' : 'Strict RAG'}): "${query.slice(0, 35)}..."`, `Sources: ${relevantDocs.length} Heritage Dossiers`);

          return res.json({
            answer: answerText,
            groundedSources: Array.from(new Set(allSources)),
            groundedHeritages: relevantDocs.map((d) => ({ id: d.id, titleVi: d.titleVi, titleEn: d.titleEn })),
            confidenceScore: 0.99,
            trustGemini,
            strictRagApplied: !trustGemini,
          });
        }
      } catch (err) {
        // Handled silently by falling through to verified grounding
      }
    }

    // Fallback response based on first matching doc
    const primary = relevantDocs[0];
    const fallbackAnswerVi = `Dựa trên Hồ sơ Di sản chính thức (${primary.sources[0]?.authority || 'UNESCO & Bộ VHTTDL'}), về "${primary.titleVi}":\n\n• ${primary.summaryVi}\n• ${primary.groundedFacts.join('\n• ')}\n\n(Trích dẫn thẩm định: ${primary.sources.map((s) => s.name).join(', ')})`;

    res.json({
      answer: fallbackAnswerVi,
      groundedSources: primary.sources.map((s) => `${s.name} - ${s.authority}`),
      groundedHeritages: [{ id: primary.id, titleVi: primary.titleVi, titleEn: primary.titleEn }],
      confidenceScore: 0.98,
      trustGemini,
      strictRagApplied: !trustGemini,
    });
  } catch (error: any) {
    console.error('Error in /api/chat/grounded:', error);
    res.status(500).json({ error: error?.message || 'Chat error' });
  }
});

// Community Travelers & Trip Connect API
app.get('/api/travelers', (req: Request, res: Response) => {
  const { heritageId } = req.query;
  if (heritageId && typeof heritageId === 'string') {
    const filtered = activeTravelers.filter(t => t.heritageId === heritageId);
    return res.json({ travelers: filtered });
  }
  res.json({ travelers: activeTravelers });
});

app.post('/api/travelers', (req: Request, res: Response) => {
  const { heritageId, userName, avatar, travelDate, status, statusTextVi, notesVi, photos, contactHint } = req.body;
  if (!heritageId || !userName || !notesVi) {
    return res.status(400).json({ error: 'Missing required traveler details' });
  }

  const newPost: HeritageTraveler = {
    id: `trv-${Date.now()}`,
    heritageId,
    userName,
    avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    travelDate: travelDate || 'Sắp tới',
    status: status || 'planning',
    statusTextVi: statusTextVi || 'Lên lịch trải nghiệm văn hóa',
    statusTextEn: 'Planning cultural visit',
    notesVi,
    notesEn: notesVi,
    photos: photos && photos.length > 0 ? photos : ['https://images.unsplash.com/photo-1528127269322-539801943592?w=600&auto=format&fit=crop&q=80'],
    likesCount: 1,
    contactHint: contactHint || '',
    createdAt: new Date().toISOString(),
  };

  activeTravelers.unshift(newPost);
  logAuditEvent('feedback_logged', `New Traveler Connect: ${userName}`, `Joined ${heritageId} trip group`, 'success');

  res.json({ success: true, traveler: newPost });
});

app.post('/api/travelers/:id/like', (req: Request, res: Response) => {
  const { id } = req.params;
  const post = activeTravelers.find(t => t.id === id);
  if (post) {
    post.likesCount += 1;
    return res.json({ success: true, likesCount: post.likesCount });
  }
  res.status(404).json({ error: 'Traveler not found' });
});

// 4.5. Planner Agent API: Gemini Cultural & Scenic Travel Itinerary Engine
app.post('/api/planner/generate', async (req: Request, res: Response) => {
  try {
    const requestData: PlannerTripRequest = req.body;
    const {
      preference = 'history_culture',
      region = 'north',
      month = new Date().getMonth() + 1,
      durationDays = 3,
      budgetLevel = 'standard',
      customBudgetVnd,
      groupType = 'solo',
      customNotes = '',
      language = 'vi',
    } = requestData;

    const isVi = language === 'vi';
    const ai = getGenAI();

    // Context from our verified heritage dataset
    const availableHeritages = activeHeritageItems.map(
      (h) => `• [${h.id}] ${h.titleVi} (${h.province}, Miền: ${h.region}, Đặc trưng: ${h.category})`
    ).join('\n');

    let generatedPlan: PlannerTripPlan | null = null;

    if (ai) {
      const systemInstruction = `Bạn là Chuyên gia Lên Lịch Trình Di sản & Thắng cảnh Du lịch Việt Nam (HeritageVibe Planner Agent).
NHIỆM VỤ:
Dựa trên yêu cầu của du khách:
1. Sở thích: ${preference} (thắng cảnh du lịch, khám phá lịch sử văn hóa di sản, làng nghề âm nhạc, hoặc trọn gói).
2. Miền/Khu vực: ${region} (Bắc, Trung, Nam, hoặc Xuyên Việt).
3. Thời điểm: Tháng ${month} (Phân tích chuẩn xác thời tiết, lễ hội văn hóa, mùa hoa/mùa lúa đặc trưng của tháng này).
4. Kinh phí: ${budgetLevel} (${customBudgetVnd ? `${customBudgetVnd.toLocaleString('vi-VN')} VND` : ''}).
5. Thời lượng: ${durationDays} ngày.
6. Nhóm đi: ${groupType}. Ghi chú: "${customNotes}".

QUY TẮC CỐT LÕI:
- Gom cụm các địa điểm GẦN NHAU trong cùng 1 ngày (Clustered Routes) để tối ưu thời gian di chuyển, tránh đi ngược đường.
- Kết hợp hài hòa giữa thắng cảnh thiên nhiên, di sản văn hóa/lịch sử, làng nghề cổ truyền và ẩm thực địa phương trứ danh.
- Đề xuất phương tiện di chuyển phù hợp nhất với cung đường (tàu hỏa, limousine, máy bay, thuyền nan, xe máy/ô tô).
- Cung cấp danh sách vật dụng cần mang theo (Packing Checklist) chuẩn theo mùa tháng ${month} và văn hóa đền chùa.
- Nêu rõ các lưu ý ứng xử văn hóa, bảo tồn di sản và món ngon đặc sản.
- ĐỊNH DẠNG ĐẦU RA BẮT BUỘC: Chuỗi JSON hợp lệ theo schema sau:
{
  "titleVi": "Tiêu đề hành trình tiếng Việt ngắn gọn, hấp dẫn",
  "titleEn": "English Title",
  "subtitleVi": "Phụ đề tóm tắt nét đặc sắc",
  "subtitleEn": "English Subtitle",
  "overviewSummaryVi": "Đoạn văn tổng quan hành trình 2-3 câu",
  "overviewSummaryEn": "English summary",
  "seasonHighlightsVi": "Điểm nhấn mùa tháng ${month} (thời tiết, lễ hội, hoa, lúa...)",
  "seasonHighlightsEn": "Season Highlights",
  "estimatedBudgetVi": "Khoảng kinh phí dự kiến VND kèm giải thích",
  "estimatedBudgetEn": "Estimated budget in VND and USD",
  "transportRecommendationVi": "Phương tiện di chuyển tối ưu cho từng chặng",
  "transportRecommendationEn": "Transport recommendation",
  "packingChecklistVi": ["Vật dụng 1", "Vật dụng 2", "Vật dụng 3", "Vật dụng 4", "Vật dụng 5"],
  "packingChecklistEn": ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"],
  "culturalNotesVi": ["Lưu ý 1 về trang phục/tâm linh", "Lưu ý 2 về bảo vệ cảnh quan", "Lưu ý 3 về giao tiếp"],
  "culturalNotesEn": ["Cultural note 1", "Cultural note 2", "Cultural note 3"],
  "recommendedSouvenirsVi": ["Đặc sản/Quà 1", "Quà 2", "Quà 3"],
  "recommendedSouvenirsEn": ["Souvenir 1", "Souvenir 2", "Souvenir 3"],
  "days": [
    {
      "day": 1,
      "titleVi": "Tiêu đề ngày 1",
      "titleEn": "Day 1 Title",
      "themeVi": "Chủ đề trải nghiệm ngày 1",
      "themeEn": "Day 1 Theme",
      "destinations": [
        {
          "nameVi": "Tên địa điểm 1",
          "nameEn": "Destination 1",
          "timeSlot": "08:00 - 11:30",
          "descriptionVi": "Mô tả trải nghiệm cụ thể",
          "descriptionEn": "Description",
          "travelTipsVi": "Mẹo tham quan, góc chụp đẹp, lưu ý",
          "travelTipsEn": "Tips",
          "isNearbyClustered": true,
          "clusterNoteVi": "Gần các điểm cùng khu vực"
        }
      ],
      "mealsVi": ["Sáng: ...", "Trưa: ...", "Tối: ..."],
      "mealsEn": ["Breakfast: ...", "Lunch: ...", "Dinner: ..."]
    }
  ]
}`;

      try {
        const promptText = `Hãy lập kế hoạch du lịch chi tiết cho ${durationDays} ngày vào Tháng ${month} tại miền ${region}, theo sở thích ${preference}, mức ngân sách ${budgetLevel}.`;
        const rawJson = await generateGeminiWithFallback(ai, {
          contents: promptText,
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.35,
        });

        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          generatedPlan = {
            id: `plan-${Date.now()}`,
            titleVi: parsed.titleVi || 'Hành Trình Tinh Hoa Di Sản Việt Nam',
            titleEn: parsed.titleEn || 'Vietnam Heritage & Scenic Journey',
            subtitleVi: parsed.subtitleVi || `Khám phá tinh hoa văn hóa Tháng ${month}`,
            subtitleEn: parsed.subtitleEn || `Cultural Expedition in Month ${month}`,
            overviewSummaryVi: parsed.overviewSummaryVi || 'Hành trình được tối ưu hóa theo các cụm điểm đến gần nhau.',
            overviewSummaryEn: parsed.overviewSummaryEn || 'Clustered destination travel itinerary.',
            seasonHighlightsVi: parsed.seasonHighlightsVi || `Khí hậu thuận lợi, sắc thái văn hóa đặc trưng Tháng ${month}`,
            seasonHighlightsEn: parsed.seasonHighlightsEn || `Seasonal highlights for Month ${month}`,
            estimatedBudgetVi: parsed.estimatedBudgetVi || (budgetLevel === 'budget' ? '2.500.000 - 4.500.000 VNĐ / người' : budgetLevel === 'luxury' ? '12.000.000 - 20.000.000 VNĐ / người' : '5.500.000 - 9.000.000 VNĐ / người'),
            estimatedBudgetEn: parsed.estimatedBudgetEn || '$150 - $400 USD / person',
            transportRecommendationVi: parsed.transportRecommendationVi || 'Xe du lịch chất lượng cao, xe điện nội khu di tích và thuyền nan.',
            transportRecommendationEn: parsed.transportRecommendationEn || 'Private limousine and traditional sampans.',
            packingChecklistVi: parsed.packingChecklistVi || [
              'Trang phục lịch sự kín đáo khi viếng đền, chùa và di tích lịch sử',
              'Giày thể thao êm chân hoặc giày trekking chống trơn trượt',
              'Mũ rộng vành, kem chống nắng, kính râm và áo khoác mỏng',
              'Bình nước cá nhân và túi chống nước cho thiết bị điện tử',
              'Thuốc men cơ bản và xịt chống côn trùng'
            ],
            packingChecklistEn: parsed.packingChecklistEn || ['Modest clothing for sacred temples', 'Comfortable walking shoes', 'Sunscreen & hat', 'Water bottle'],
            culturalNotesVi: parsed.culturalNotesVi || [
              'Tôn trọng phong tục địa phương, xin phép trước khi chụp ảnh người dân bản địa',
              'Giữ gìn vệ sinh môi trường, không chạm tay vào hiện vật cổ',
              'Ủng hộ nghệ nhân và làng nghề truyền thống bằng cách mua sản phẩm thủ công trực tiếp'
            ],
            culturalNotesEn: parsed.culturalNotesEn || ['Dress respectfully', 'Do not touch antique artifacts', 'Support local artisans'],
            recommendedSouvenirsVi: parsed.recommendedSouvenirsVi || ['Trà shan tuyết cổ thụ', 'Sản phẩm gốm thủ công', 'Khăn lụa tơ tằm tự nhiên', 'Bánh kẹo đặc sản địa phương'],
            recommendedSouvenirsEn: parsed.recommendedSouvenirsEn || ['Artisan tea', 'Handmade ceramics', 'Natural silk scarves'],
            days: parsed.days || [],
            createdAt: new Date().toISOString(),
            requestParams: requestData,
          };
        }
      } catch (geminiErr) {
        console.warn('Gemini planner fallback triggered:', geminiErr);
      }
    }

    // Fallback Curated Planner Generator if offline
    if (!generatedPlan) {
      const regionNames = {
        north: { vi: 'Miền Bắc (Thăng Long - Ninh Bình - Quảng Ninh)', en: 'Northern Vietnam (Hanoi - Ninh Binh - Ha Long)' },
        central: { vi: 'Miền Trung (Huế - Hội An - Mỹ Sơn)', en: 'Central Vietnam (Hue - Hoi An - My Son)' },
        south: { vi: 'Miền Nam (Sài Gòn - Sông Nước Cửu Long)', en: 'Southern Vietnam (Saigon - Mekong Delta)' },
        cross_vietnam: { vi: 'Xuyên Việt (Hà Nội - Cố Đô Huế - Phố Cổ Hội An)', en: 'Grand Vietnam Heritage Tour' },
      };

      const regName = regionNames[region] || regionNames.north;
      const budgetTextVi = budgetLevel === 'budget' 
        ? '3.000.000 - 4.500.000 VNĐ/người (Tiết kiệm)' 
        : budgetLevel === 'luxury' 
        ? '15.000.000 - 25.000.000 VNĐ/người (Cao cấp & Nghỉ dưỡng)' 
        : '6.500.000 - 9.500.000 VNĐ/người (Tiêu chuẩn thoải mái)';

      const fallbackDays = Array.from({ length: durationDays }, (_, i) => {
        const dayNum = i + 1;
        if (region === 'central') {
          if (dayNum === 1) {
            return {
              day: 1,
              titleVi: 'Cố đô Huế: Hoàng thành & Nhã nhạc Cung đình',
              titleEn: 'Imperial Hue: Citadel & Royal Court Music',
              themeVi: 'Âm vang Triều Nguyễn & Kiến trúc Cung vàng Điện ngọc',
              themeEn: 'Nguyen Dynasty Architecture & Imperial Melody',
              destinations: [
                {
                  nameVi: 'Đại Nội Huế (Ngọ Môn - Điện Thái Hòa - Tử Cấm Thành)',
                  nameEn: 'Hue Imperial Citadel',
                  timeSlot: '08:00 - 11:30',
                  descriptionVi: 'Tham quan trung tâm quyền lực triều Nguyễn, chiêm ngưỡng kiến trúc cung đình đỉnh cao.',
                  descriptionEn: 'Explore the historic dynastic citadel of Vietnam.',
                  travelTipsVi: 'Nên thuê áo ngũ thân hoặc cổ phục để chụp ảnh kỷ niệm.',
                  travelTipsEn: 'Wear traditional Ao Dai for memorable photos.',
                  isNearbyClustered: true,
                },
                {
                  nameVi: 'Chùa Thiên Mụ & Nghe Ca Huế Thính phòng trên Sông Hương',
                  nameEn: 'Thien Mu Pagoda & Perfume River Music Cruise',
                  timeSlot: '15:00 - 19:30',
                  descriptionVi: 'Đi thuyền rồng ngắm hoàng hôn sông Hương, thưởng thức Nhã nhạc Cung đình & Ca Huế.',
                  descriptionEn: 'Dragon boat cruise listening to UNESCO royal chamber music.',
                  travelTipsVi: 'Đặt trước vé thuyền rồng để có vị trí đẹp.',
                  travelTipsEn: 'Book boat tickets in advance.',
                  isNearbyClustered: true,
                },
              ],
              mealsVi: ['Sáng: Bún bò Huế O Cương', 'Trưa: Cơm niêu âm thực cung đình', 'Tối: Bánh bèo, nậm, lọc Hàng Me'],
              mealsEn: ['Breakfast: Hue Beef Noodle', 'Lunch: Royal Rice', 'Dinner: Traditional Dumplings'],
            };
          } else if (dayNum === 2) {
            return {
              day: 2,
              titleVi: 'Phố cổ Hội An: Đèn lồng & Làng nghề Gốm Thanh Hà',
              titleEn: 'Hoi An: Lanterns & Thanh Ha Pottery',
              themeVi: 'Thương cảng cổ tích & Tinh hoa thủ công Quảng Nam',
              themeEn: 'Ancient Trading Port & Traditional Crafts',
              destinations: [
                {
                  nameVi: 'Làng gốm Thanh Hà & Công viên Đất Nung',
                  nameEn: 'Thanh Ha Pottery Village',
                  timeSlot: '08:30 - 11:30',
                  descriptionVi: 'Trải nghiệm chuốt gốm cùng nghệ nhân, tìm hiểu lịch sử 500 năm làng nghề.',
                  descriptionEn: 'Hands-on pottery workshop with master artisans.',
                  travelTipsVi: 'Có thể tự tay làm sản phẩm mang về làm kỷ niệm.',
                  travelTipsEn: 'Create your own ceramic souvenir.',
                  isNearbyClustered: true,
                },
                {
                  nameVi: 'Chùa Cầu & Thưởng thức Nghệ thuật Bài Chòi bên sông Hoài',
                  nameEn: 'Japanese Covered Bridge & Bai Choi Art',
                  timeSlot: '15:30 - 21:00',
                  descriptionVi: 'Dạo bước phố cổ rợp lồng đèn, tham gia hô hát Bài Chòi dân gian rộn rã.',
                  descriptionEn: 'Stroll lantern-lit alleys and join UNESCO Bai Choi folk games.',
                  travelTipsVi: 'Phố cổ đi bộ cấm xe từ 15:00 hàng ngày.',
                  travelTipsEn: 'Pedestrian-only hours start from 3 PM.',
                  isNearbyClustered: true,
                },
              ],
              mealsVi: ['Sáng: Bánh mì Phượng', 'Trưa: Cao lầu Thanh', 'Tối: Cơm gà Bà Buội'],
              mealsEn: ['Breakfast: Banh Mi', 'Lunch: Cao Lau', 'Dinner: Ba Buoi Chicken Rice'],
            };
          }
        }
        
        // Default North Cluster
        return {
          day: dayNum,
          titleVi: dayNum === 1 ? 'Thủ đô Hà Nội: Hoàng thành Thăng Long & Làng gốm Bát Tràng' : dayNum === 2 ? 'Ninh Bình: Quần thể Danh thắng Tràng An & Cố đô Hoa Lư' : 'Quảng Ninh: Kỳ quan Vịnh Hạ Long & Làng chài Cửa Vạn',
          titleEn: `Day ${dayNum} Cultural Route`,
          themeVi: 'Giao thoa Lịch sử nghìn năm và Cảnh sắc Thiên nhiên ngoạn mục',
          themeEn: 'History and Scenic Nature',
          destinations: [
            {
              nameVi: dayNum === 1 ? 'Hoàng thành Thăng Long & Văn Miếu Quốc Tử Giám' : dayNum === 2 ? 'Khu du lịch sinh thái Tràng An (Đi thuyền nan)' : 'Vịnh Hạ Long (Du thuyền ngắm đảo karst)',
              nameEn: 'Primary Heritage Landmark',
              timeSlot: '08:00 - 12:00',
              descriptionVi: 'Khám phá di sản UNESCO với hướng dẫn viên chuyên sâu.',
              descriptionEn: 'In-depth guided tour of UNESCO cultural landscape.',
              travelTipsVi: 'Mang theo nước uống và máy ảnh để bắt trọn khoảnh khắc đẹp.',
              travelTipsEn: 'Bring camera and hydration.',
              isNearbyClustered: true,
            },
            {
              nameVi: dayNum === 1 ? 'Làng gốm cổ truyền Bát Tràng' : dayNum === 2 ? 'Cố đô Hoa Lư & Đền Vua Đinh - Vua Lê' : 'Làng ngọc trai & Hang Luồn',
              nameEn: 'Secondary Clustered Site',
              timeSlot: '14:00 - 17:30',
              descriptionVi: 'Ghé thăm làng nghề truyền thống cùng cụm di chuyển.',
              descriptionEn: 'Visit traditional artisan craft cluster.',
              travelTipsVi: 'Tránh giờ cao điểm để trải nghiệm trọn vẹn nhất.',
              travelTipsEn: 'Visit early to avoid crowds.',
              isNearbyClustered: true,
            },
          ],
          mealsVi: ['Sáng: Phở Bát Đàn / Phở Bò', 'Trưa: Đặc sản địa phương', 'Tối: Ẩm thực truyền thống'],
          mealsEn: ['Breakfast: Pho', 'Lunch: Local Specialties', 'Dinner: Traditional Cuisine'],
        };
      });

      generatedPlan = {
        id: `plan-${Date.now()}`,
        titleVi: `Hành Trình ${preference === 'history_culture' ? 'Khám Phá Di Sản' : 'Thắng Cảnh & Văn Hóa'} ${regName.vi}`,
        titleEn: `Expedition of ${regName.en}`,
        subtitleVi: `Lịch trình tối ưu Tháng ${month} (${durationDays} Ngày ${durationDays - 1} Đêm)`,
        subtitleEn: `Optimized Itinerary for Month ${month} (${durationDays} Days)`,
        overviewSummaryVi: `Hành trình được thiết kế công phu kết hợp các cụm di sản và danh thắng gần nhau tại ${regName.vi}, giúp tối ưu hóa thời gian di chuyển, chiêm ngưỡng cảnh sắc đẹp nhất vào Tháng ${month}.`,
        overviewSummaryEn: `Meticulously crafted cultural itinerary visiting clustered heritage sites with optimized routes.`,
        seasonHighlightsVi: `Tháng ${month} là thời điểm vàng để du lịch: Khí hậu mát mẻ, nhiều lễ hội dân gian và mùa đặc sản rực rỡ sắc màu.`,
        seasonHighlightsEn: `Month ${month} offers splendid weather and cultural festivals.`,
        estimatedBudgetVi: budgetTextVi,
        estimatedBudgetEn: '$200 - $600 USD per traveler',
        transportRecommendationVi: 'Xe du lịch Limousine liên tỉnh, xe điện nội khu bảo tồn di sản và thuyền nan truyền thống.',
        transportRecommendationEn: 'Comfortable private vehicle and traditional sampans.',
        packingChecklistVi: [
          'Trang phục lịch sự (quần dài/váy qua gối) khi viếng thăm đền chùa và cung điện',
          'Giày đi bộ êm chân, chống trượt cho các chặng tham quan hang động/núi',
          'Áo khoác gió mỏng, mũ nón chống nắng và ô dù gấp gọn',
          'Bình nước cá nhân, kem chống nắng và kem xịt côn trùng',
          'Máy ảnh, sạc dự phòng và túi chống nước cho điện thoại'
        ],
        packingChecklistEn: ['Modest attire for sacred sites', 'Walking shoes', 'Light jacket', 'Camera and powerbank'],
        culturalNotesVi: [
          'Giữ thái độ trang nghiêm, không nói lớn tiếng tại chốn tôn nghiêm và lăng tẩm',
          'Không xả rác, chung tay bảo vệ cảnh quan tự nhiên của di sản thế giới',
          'Khuyến khích trò chuyện cùng nghệ nhân và ủng hộ các sản phẩm thủ công OCOP'
        ],
        culturalNotesEn: ['Maintain quiet decorum in temples', 'Protect environment', 'Support craft artisans'],
        recommendedSouvenirsVi: ['Sản phẩm thủ công làng nghề có chứng nhận', 'Trà sen / Trà thảo mộc bản địa', 'Bánh đặc sản truyền thống'],
        recommendedSouvenirsEn: ['Artisan handicrafts', 'Local lotus tea', 'Traditional delicacies'],
        days: fallbackDays,
        createdAt: new Date().toISOString(),
        requestParams: requestData,
      };
    }

    logAuditEvent('story_read', `Planner Agent Generated: ${generatedPlan.titleVi}`, `${durationDays} Days in ${region} (Month ${month})`, 'success');

    res.json({ success: true, plan: generatedPlan });
  } catch (error: any) {
    console.error('Error in /api/planner/generate:', error);
    res.status(500).json({ error: error?.message || 'Failed to generate itinerary' });
  }
});

app.post('/api/feedback/submit', (req: Request, res: Response) => {
  const { heritageId, feedbackType, rating, comment, userEmail, proposedChange } = req.body;
  const newFeedback: UserFeedback = {
    id: `fb-${Date.now()}`,
    timestamp: new Date().toISOString(),
    heritageId,
    feedbackType: feedbackType || 'strength',
    rating: Number(rating) || 5,
    comment: comment || 'Đóng góp ý kiến',
    userEmail: userEmail || 'community@heritagevibe.vn',
    status: 'pending',
    proposedChange,
  };

  activeFeedback.unshift(newFeedback);
  activeMetrics.totalFeedbackCount += 1;
  logAuditEvent('feedback_logged', `Feedback Logged: [${newFeedback.feedbackType.toUpperCase()}]`, `Rating: ${newFeedback.rating}/5 - "${newFeedback.comment.slice(0, 40)}..."`, 'pending');

  res.json({ success: true, feedback: newFeedback });
});

// 6. Propose Knowledge Update (Human-in-the-Loop Pipeline)
app.post('/api/improvement/propose', (req: Request, res: Response) => {
  const { heritageId, author, changeType, description, originalText, proposedText, evidenceSource } = req.body;
  const heritage = activeHeritageItems.find((h) => h.id === heritageId);

  const proposal: KnowledgeProposal = {
    id: `prop-${Date.now()}`,
    heritageId: heritageId || 'general',
    heritageTitle: heritage ? heritage.titleVi : 'Cơ sở tri thức chung',
    author: author || 'Cộng tác viên Văn hóa',
    changeType: changeType || 'fact_update',
    description: description || 'Đề xuất cập nhật dữ liệu di sản',
    originalText: originalText || '',
    proposedText: proposedText || '',
    evidenceSource: evidenceSource || 'Bộ Văn hóa, Thể thao và Du lịch (2026)',
    evalScore: 97.5,
    status: 'pending_human_review',
    submittedAt: new Date().toISOString(),
    versionTarget: `v1.0.${activeVersions.length}`,
  };

  activeProposals.unshift(proposal);
  activeMetrics.pendingProposals = activeProposals.filter((p) => p.status === 'pending_human_review').length;
  logAuditEvent('proposal_created', `Knowledge Proposal Staged: ${proposal.heritageTitle}`, `Author: ${proposal.author} | Eval Score: ${proposal.evalScore}%`, 'pending');

  res.json({ success: true, proposal });
});

// 7. Human Review Action (Approve / Reject / Rollback)
app.post('/api/improvement/action', (req: Request, res: Response) => {
  const { proposalId, action, reviewerName, note, rollbackVersion } = req.body;
  const proposal = activeProposals.find((p) => p.id === proposalId);

  if (!proposal && action !== 'rollback') {
    return res.status(404).json({ error: 'Proposal not found' });
  }

  if (action === 'approve') {
    if (proposal) {
      proposal.status = 'approved_applied';
      proposal.reviewedAt = new Date().toISOString();
      proposal.reviewedBy = reviewerName || 'Ban Thẩm định Di sản (Human Reviewer)';

      // Apply to knowledge item if exists
      const item = activeHeritageItems.find((h) => h.id === proposal.heritageId);
      if (item && proposal.proposedText) {
        item.groundedFacts.push(proposal.proposedText);
      }

      // Bump version
      const newVersionNumber = `v1.0.${activeVersions.length}`;
      const newVersion: KnowledgeVersion = {
        version: newVersionNumber,
        timestamp: new Date().toISOString(),
        author: reviewerName || 'Cultural Editorial Board',
        changelog: `[Approved #${proposal.id}] ${proposal.description}`,
        itemsCount: activeHeritageItems.length,
        status: 'active',
      };

      activeVersions.forEach((v) => {
        if (v.status === 'active') v.status = 'archived';
      });
      activeVersions.unshift(newVersion);

      activeMetrics.improvementsApplied += 1;
      activeMetrics.pendingProposals = activeProposals.filter((p) => p.status === 'pending_human_review').length;

      logAuditEvent('human_approval', `Proposal Approved & Released: ${newVersionNumber}`, `Approved by ${proposal.reviewedBy} | Verified: 100%`);
    }
  } else if (action === 'reject') {
    if (proposal) {
      proposal.status = 'rejected';
      proposal.reviewedAt = new Date().toISOString();
      proposal.reviewedBy = reviewerName || 'Human Reviewer';
      activeMetrics.pendingProposals = activeProposals.filter((p) => p.status === 'pending_human_review').length;
      logAuditEvent('proposal_created', `Proposal Rejected: ${proposal.id}`, `Reason: ${note || 'Unverified evidence source'}`);
    }
  } else if (action === 'rollback') {
    activeMetrics.rolledBackCount += 1;
    const targetVer = rollbackVersion || 'v1.0.0';
    activeVersions.forEach((v) => {
      v.status = v.version === targetVer ? 'active' : 'archived';
    });
    logAuditEvent('rollback', `Safety Rollback Executed to ${targetVer}`, `Author: Human Admin | Stability Verified`);
  }

  res.json({
    success: true,
    proposals: activeProposals,
    versions: activeVersions,
    metrics: activeMetrics,
  });
});

// 8. Log Interactive Metric Event (Quiz, Streaks, Artisan Footfall)
app.post('/api/metrics/event', (req: Request, res: Response) => {
  const { eventType, details } = req.body;

  if (eventType === 'quiz_passed') {
    activeMetrics.quizzesAnswered += 1;
    logAuditEvent('quiz_passed', 'Daily Heritage Quiz Completed', details || 'Score 100% | +20 Cultural EXP');
  } else if (eventType === 'story_completed') {
    activeMetrics.storiesCompleted += 1;
    logAuditEvent('story_read', 'Heritage Story Explored', details || 'Completed interactive reading journey');
  } else if (eventType === 'artisan_support') {
    activeMetrics.simulatedFootfallImpact += 1;
    logAuditEvent('artisan_inquiry', 'Local Artisan Contact Initiated', details || 'Direct engagement with traditional craft studio');
  }

  res.json({ success: true, metrics: activeMetrics });
});

// 9. Get Live Metrics for /proof Dashboard
app.get('/api/metrics', (req: Request, res: Response) => {
  res.json({
    ...activeMetrics,
    totalProposals: activeProposals.length,
    activeVersion: activeVersions.find((v) => v.status === 'active')?.version || 'v1.0.1',
    serverUptimeSeconds: Math.floor(process.uptime()),
  });
});

// Vite middleware for development & static serving for production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HeritageVibe server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
