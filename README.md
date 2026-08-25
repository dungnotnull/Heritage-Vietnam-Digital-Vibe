# HeritageVibe 🏛️ 📜

**HeritageVibe** is an intelligent, human-in-the-loop self-improving digital companion that helps people deeply connect with Vietnam’s cultural heritage through daily interactive storytelling, personalized learning journeys, continuous knowledge growth under human supervision, and real economic support for local artisans.

Built for **AI Riser Vietnam 2026** (#BuildwithGoogleAI / #VibeCoding).

## Vision

HeritageVibe turns cultural heritage from a one-time visit into a daily habit.  
It combines emotionally engaging AI storytelling with strict factual grounding, measurable engagement loops, and a transparent self-improvement system that always keeps humans in control.

## Key Features

### Must-have (Core Demo)
- **Interactive Heritage Storytelling**  
  Immersive stories in Vietnamese (Northern / Central / Southern styles) and English. Grounded answers only. Multimodal support (text + images).
- **Daily Habit Loop**  
  Short daily stories, mini-quizzes, streaks, and simple digital collectibles (“heritage fragments”). Personalized learning paths.
- **Human-in-the-loop Self-Improving System**  
  - Knowledge Base stored in Firestore  
  - Structured user feedback (strengths / weaknesses / factual errors)  
  - Proposed updates require explicit human approval  
  - Full versioning + one-click rollback  
  - Clear status log: “Improved X times | Pending Y | Rolled back Z”
- **Strong Anti-Hallucination**  
  Strict RAG, source citations, official sources only.
- **Metrics & Proof Dashboard**  
  Real-time logging of DAU, streak retention, stories completed, quiz accuracy, feedback resolved, and improvement counts. Public `/proof` page for judges.
- **Beautiful mobile-first UI** with emotional animations.

### Nice-to-have (Bonus)
- Two-sided local economy (merchant/artisan profiles, AI-suggested nearby experiences, footfall tracking)
- Advanced self-improvement (source discovery simulation + golden Q&A evaluation gate)
- Google Maps Places, Calendar, and Gmail integrations
- Advanced voice interaction and richer collectibles

## Tech Stack

| Layer              | Technology                                      |
|--------------------|-------------------------------------------------|
| Frontend           | Next.js 15 (App Router) + TypeScript            |
| UI                 | Tailwind CSS + shadcn/ui + Framer Motion        |
| AI                 | Google Gemini Flash / Flash-Lite (free tier)    |
| Backend / AI Logic | Next.js API Routes or Cloud Run (Node.js)       |
| Database & Auth    | Firebase (Firestore, Authentication, Hosting)   |
| Deployment         | Cloud Run (backend) + Firebase Hosting (frontend) |
| Metrics            | Firestore event logging + public `/proof` page   |

> **Important**: Only free-tier Gemini Flash / Flash-Lite models are used (e.g. Gemini 3.5 Flash-Lite or Gemini 2.5 Flash). No Pro models required.

## Agent Skills

The project defines a focused set of reusable Agent Skills:

1. **heritage-storyteller** – Emotionally engaging, culturally accurate storytelling with regional styles  
2. **anti-hallucination-rag** – Strict RAG + source citation enforcement  
3. **habit-loop-designer** – Daily/weekly engagement mechanics  
4. **human-in-the-loop-improver** – Feedback → proposal → human approval → versioning/rollback  
5. **metric-instrumenter** – Full event logging and public proof dashboard from day 1  
6. **demo-first-builder** – Always prioritize stable live demo over feature completeness  
7. **local-economy-connector** (Nice-to-have) – Connect heritage content to local artisans

## Getting Started

### Prerequisites
- Node.js 20+
- Firebase project
- Google AI Studio API key (free tier)
- Google Cloud project (for Cloud Run)

### Installation

```bash
git clone <your-repo-url>
cd heritagevibe
npm install
```

### Environment Variables

Create a `.env.local` file:

```env
GOOGLE_GENERATIVE_AI_API_KEY=your_free_tier_key
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
# ... other Firebase config
```

### Development

```bash
npm run dev
```

### Deployment

- Frontend → Firebase Hosting  
- Backend / AI logic → Cloud Run  

Follow the detailed deployment guide in `/docs/deployment.md` (to be added).

## Project Structure (Planned)

```
heritagevibe/
├── app/                    # Next.js App Router
├── components/             # UI components (shadcn/ui)
├── lib/
│   ├── ai/                 # Gemini client & skills
│   ├── firebase/           # Firestore helpers
│   └── metrics/            # Event logging
├── skills/                 # Agent Skills definitions
├── public/
└── ...
```

## Metrics Tracked (from Day 1)

- Daily Active Users (DAU)
- Streak retention (Day-1 / Day-7 / Day-30)
- Stories completed
- Quiz accuracy rate
- Feedback received & resolved
- Knowledge / prompt improvements applied

All events are logged to Firestore and visible on the public `/proof` dashboard.

## Safety & Content Principles

- Never invent historical facts
- Only use verified official sources (gov.vn, museums, textbooks, etc.)
- Always show source citations
- Every knowledge or prompt change requires human approval
- Full versioning and rollback support

## Roadmap (Demo-first)

1. **Days 1–2**: Project scaffold + basic storytelling + metric logging  
2. **Days 3–4**: Habit loop (streak, quiz, collectibles)  
3. **Days 5–6**: Human-in-the-loop feedback & approval flow + `/proof` page  
4. **Day 7**: Polish UI, prepare live demo script, deploy to Cloud Run + Firebase Hosting  
5. **Days 8–10**: Nice-to-have features (local economy, advanced self-improvement, etc.)

## Demo Script (Recommended 3–5 minutes)

1. Live storytelling experience (emotional + grounded)  
2. Daily habit loop (streak + quiz)  
3. Human-in-the-loop improvement flow (feedback → propose → approve)  
4. Public `/proof` metrics dashboard  
5. Closing impact statement

## License

This project was created for AI Riser Vietnam 2026.  
Feel free to use and adapt with attribution.

---

**Built with ❤️ for Vietnamese cultural heritage and the #BuildwithGoogleAI community.**
```
