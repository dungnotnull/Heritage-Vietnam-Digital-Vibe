import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  RefreshCw, 
  X, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  ChevronDown, 
  Bot, 
  User, 
  Compass, 
  ExternalLink 
} from 'lucide-react';
import { HeritageItem, Language, DialectStyle } from '../types';
import { MarkdownRenderer } from './MarkdownRenderer';
import { VietnamFlag } from './VietnamFlag';

interface HeritageChatWidgetProps {
  heritages: HeritageItem[];
  selectedHeritage?: HeritageItem;
  language: Language;
}

interface ChatMessage {
  sender: 'user' | 'assistant';
  text: string;
  sources?: string[];
  trustGeminiUsed?: boolean;
}

export const HeritageChatWidget: React.FC<HeritageChatWidgetProps> = ({
  heritages,
  selectedHeritage: initialSelectedHeritage,
  language,
}) => {
  const isVi = language === 'vi';
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeHeritageId, setActiveHeritageId] = useState<string>(initialSelectedHeritage?.id || heritages[0]?.id || '');
  const [trustGemini, setTrustGemini] = useState<boolean>(true);
  const [dialect, setDialect] = useState<DialectStyle>('bac-bo');
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'assistant',
      text: isVi
        ? 'Xin chào! Tôi là Trợ lý Di sản Văn hóa Việt Nam (Heritage AI). Bạn có thể hỏi tôi về nguồn gốc, câu chuyện lịch sử, trang phục, nghệ nhân hoặc kinh nghiệm du lịch các di sản văn hóa.'
        : 'Hello! I am your Vietnamese Cultural Heritage AI Assistant. Ask me about histories, origins, rituals, artisans, or travel guides for any heritage site.',
      sources: ['UNESCO Heritage Records', 'Cục Di sản Văn hóa Việt Nam'],
      trustGeminiUsed: true,
    }
  ]);
  
  const [inputQuery, setInputQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);

  const activeHeritage = heritages.find(h => h.id === activeHeritageId) || heritages[0];
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialSelectedHeritage) {
      setActiveHeritageId(initialSelectedHeritage.id);
    }
  }, [initialSelectedHeritage]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  // Handle Speech synthesis (TTS)
  const handleSpeak = (text: string, index: number) => {
    if ('speechSynthesis' in window) {
      if (speakingIndex === index) {
        window.speechSynthesis.cancel();
        setSpeakingIndex(null);
        return;
      }

      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*#_`]/g, '').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = language === 'vi' ? 'vi-VN' : 'en-US';
      utterance.rate = 0.95;
      utterance.onend = () => setSpeakingIndex(null);
      utterance.onerror = () => setSpeakingIndex(null);

      setSpeakingIndex(index);
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat/grounded', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: textToSend,
          dialect,
          language,
          trustGemini,
        }),
      });

      const data = await res.json();
      if (data.answer) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'assistant',
            text: data.answer,
            sources: data.sources || (data.strictGrounding ? ['Hồ sơ UNESCO thẩm định', 'Cục Di sản Văn hóa'] : ['Gemini AI Cultural Knowledge', 'UNESCO Records']),
            trustGeminiUsed: data.trustGeminiUsed !== undefined ? data.trustGeminiUsed : trustGemini,
          }
        ]);
      } else {
        throw new Error('No answer received');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: isVi
            ? `Xin lỗi, có lỗi kết nối tạm thời. Về ${activeHeritage?.titleVi || 'di sản'}, bạn có thể tham khảo tóm tắt chính thức: ${activeHeritage?.summaryVi || ''}`
            : `Sorry, there was a temporary connection error. For ${activeHeritage?.titleEn || 'heritage'}, official overview: ${activeHeritage?.summaryEn || ''}`,
          sources: ['Offline Archive'],
          trustGeminiUsed: false,
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = isVi ? [
    `Nguồn gốc lịch sử của ${activeHeritage?.titleVi || 'di sản'}?`,
    `Những nét đặc sắc và ý nghĩa văn hóa là gì?`,
    `Kinh nghiệm tham quan và ứng xử văn hóa cần lưu ý?`,
    `Có món ăn hay làng nghề truyền thống nào gắn liền?`,
  ] : [
    `What is the origin of ${activeHeritage?.titleEn || 'this heritage'}?`,
    `What makes this cultural heritage unique?`,
    `What are the etiquette tips for visiting?`,
    `Are there local crafts or traditional foods connected?`,
  ];

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-20 sm:bottom-22 right-6 z-40 flex flex-col items-end">
        {!isOpen && (
          <button
            id="btn-chat-agent"
            onClick={() => setIsOpen(true)}
            aria-label="Chat với trợ lý di sản"
            className="group relative flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 hover:from-amber-500 hover:to-amber-700 text-white shadow-xl shadow-amber-900/30 border border-amber-400/40 backdrop-blur-md transition-all duration-300 hover:scale-105 cursor-pointer"
          >
            <div className="relative">
              <Bot className="w-5 h-5 transition-transform group-hover:rotate-12 text-amber-200" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-stone-900 animate-pulse" />
            </div>
            
            <div className="flex flex-col items-start pr-1">
              <span className="text-xs font-bold text-white leading-tight">
                {isVi ? 'Chat AI Di Sản' : 'Heritage AI Chat'}
              </span>
              <span className="text-[10px] text-amber-200 font-medium">
                {trustGemini ? '✨ Trust Gemini' : '🛡️ Strict UNESCO'}
              </span>
            </div>
          </button>
        )}
      </div>

      {/* Floating Chat Drawer / Dialog */}
      {isOpen && (
        <div 
          id="chat-agent-modal"
          className="fixed bottom-6 right-4 sm:right-6 z-[110] w-[94vw] sm:w-[440px] h-[580px] max-h-[85vh] bg-[#FAF8F5] rounded-3xl shadow-2xl border border-stone-300/80 flex flex-col overflow-hidden animate-fade-in text-stone-900"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white flex items-center justify-between gap-3 shadow-md flex-shrink-0">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Bot className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-xs sm:text-sm font-heritage truncate text-white">
                    {isVi ? 'Trợ lý Di sản AI' : 'Heritage AI Assistant'}
                  </h3>
                  <VietnamFlag size="xs" />
                </div>
                <div className="text-[10px] text-amber-300/90 truncate">
                  {isVi ? 'Hỏi đáp tri thức & tư vấn di sản' : 'Grounded Q&A and Cultural Advisory'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isVi ? 'Thu nhỏ' : 'Minimize'}
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title={isVi ? 'Đóng' : 'Close'}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subheader: Trust Mode Toggle only */}
          <div className="p-2.5 bg-stone-100 border-b border-stone-200 flex items-center justify-end gap-2 text-xs flex-shrink-0">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 bg-stone-200/80 p-0.5 rounded-xl border border-stone-300/80 text-[10px]">
              <button
                type="button"
                onClick={() => setTrustGemini(true)}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  trustGemini
                    ? 'bg-amber-600 text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Trust Gemini: Tư vấn sinh động & mở rộng"
              >
                ✨ Gemini
              </button>
              <button
                type="button"
                onClick={() => setTrustGemini(false)}
                className={`px-2 py-0.5 rounded-lg font-bold transition-all cursor-pointer ${
                  !trustGemini
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
                title="Strict: Chỉ dữ liệu UNESCO chính xác 100%"
              >
                🛡️ UNESCO
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 p-3.5 overflow-y-auto space-y-3 text-xs scrollbar-thin scrollbar-thumb-stone-300">
            {messages.map((msg, idx) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={idx}
                  className={`p-3 rounded-2xl ${
                    isUser
                      ? 'bg-amber-100/90 text-stone-900 ml-6 border border-amber-200 shadow-2xs'
                      : 'bg-white text-stone-800 mr-6 border border-stone-200 shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between font-semibold text-[10px] text-stone-500 uppercase mb-1">
                    <div className="flex items-center gap-1">
                      {isUser ? <User className="w-3 h-3 text-amber-700" /> : <Bot className="w-3 h-3 text-amber-600" />}
                      <span>{isUser ? (isVi ? 'Bạn' : 'You') : 'HeritageVibe AI'}</span>
                    </div>

                    {!isUser && (
                      <div className="flex items-center gap-1.5">
                        {msg.trustGeminiUsed !== undefined && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${msg.trustGeminiUsed ? 'text-amber-800 bg-amber-50' : 'text-emerald-700 bg-emerald-50'}`}>
                            {msg.trustGeminiUsed ? '✨ Gemini' : '🛡️ Strict'}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleSpeak(msg.text, idx)}
                          className="p-1 rounded text-stone-400 hover:text-amber-700 transition-colors cursor-pointer"
                          title={isVi ? 'Đọc câu trả lời' : 'Read aloud'}
                        >
                          {speakingIndex === idx ? (
                            <VolumeX className="w-3 h-3 text-amber-600 animate-pulse" />
                          ) : (
                            <Volume2 className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="leading-relaxed">
                    <MarkdownRenderer content={msg.text} />
                  </div>

                  {msg.sources && msg.sources.length > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-stone-100 text-[10px] text-stone-500">
                      <span className="font-semibold text-emerald-700">{isVi ? 'Nguồn thẩm định:' : 'Verified Sources:'} </span>
                      {msg.sources.join(' | ')}
                    </div>
                  )}
                </div>
              );
            })}

            {loading && (
              <div className="p-3 bg-white rounded-2xl border border-stone-200 text-stone-500 text-xs animate-pulse flex items-center gap-2 mr-6">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                <span>{isVi ? 'Đang truy vấn hồ sơ di sản...' : 'Querying heritage database...'}</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Suggestions */}
          <div className="px-3 py-1.5 bg-stone-50 border-t border-stone-200/80 overflow-x-auto flex gap-1.5 scrollbar-none flex-shrink-0">
            {quickPrompts.map((prompt, pIdx) => (
              <button
                key={pIdx}
                type="button"
                onClick={() => handleSendMessage(prompt)}
                className="whitespace-nowrap px-2.5 py-1 rounded-full text-[10px] font-medium bg-white hover:bg-amber-50 text-stone-700 hover:text-amber-900 border border-stone-200 transition-colors cursor-pointer flex-shrink-0"
              >
                💡 {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-stone-200 flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder={
                  isVi
                    ? `Hỏi bất kỳ điều gì về ${activeHeritage?.titleVi || 'di sản'}...`
                    : `Ask anything about ${activeHeritage?.titleEn || 'heritage'}...`
                }
                className="flex-1 text-xs px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              />
              <button
                type="submit"
                disabled={loading || !inputQuery.trim()}
                className="px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-white font-bold text-xs disabled:opacity-50 transition-all flex items-center justify-center cursor-pointer shadow-xs"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
