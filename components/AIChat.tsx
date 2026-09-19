'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/components/LanguageContext';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

let messageCounter = 0;
function getNextId(prefix: string) {
  messageCounter += 1;
  return `${prefix}_${messageCounter}`;
}

export default function AIChat() {
  const { lang, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      text:
        lang === 'ur'
          ? 'السلام علیکم! دارالعلوم صدیقہ کے علمی و تدریسی معاون میں خوش آمدید۔ آپ داخلہ، نصاب، یا ادارے کے متعلق کوئی بھی سوال پوچھ سکتے ہیں۔'
          : lang === 'ar'
          ? 'السلام عليكم ورحمة الله وبركاته! مرحباً بكم في المساعد الأكاديمي لدار العلوم الصديقية. كيف يمكننا مساعدتكم اليوم؟'
          : lang === 'hi'
          ? 'अस्सलाम वालेकुम! दारुल उलूम सिद्दीकिया के एआई सलाहकार में आपका स्वागत है। आप प्रवेश, पाठ्यक्रम या संस्था के बारे में कोई भी प्रश्न पूछ सकते हैं।'
          : 'Assalamu Alaikum! Welcome to the Darul Uloom Siddiqia AI Advisory Assistant. You may ask complex inquiries regarding classical Islamic jurisprudence, Hifz admissions, curriculum, or campus life.',
      timestamp: 'Online',
    },
  ]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    {
      en: 'What are the Hifz admission requirements?',
      ur: 'حفظ میں داخلے کی شرائط کیا ہیں؟',
      hi: 'हिफ्ज़ में दाखिले की क्या शर्तें ہیں?',
      ar: 'ما هي شروط القبول في قسم تحفيظ القرآن؟',
    },
    {
      en: 'Who is the Nazim and Rector?',
      ur: 'دارالعلوم کے ناظم اور مہتمم کون ہیں؟',
      hi: 'दारुल उलूम के नाजिम कौन हैं?',
      ar: 'من هو ناظم دار العلوم الصديقية؟',
    },
    {
      en: 'How can I donate Zakat / Sadaqah?',
      ur: 'زکوٰۃ یا صدقات کے ذریعے کیسے تعاون کریں؟',
      hi: 'ज़कात और सदक़ात कैसे भेजें?',
      ar: 'كيف يمكنني التبرع بالزكاة والصدقات؟',
    },
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isThinking]);

  const handleSend = async (queryText?: string) => {
    const textToSend = (queryText || input).trim();
    if (!textToSend || isThinking) return;

    const userMsg: ChatMessage = {
      id: getNextId('u'),
      role: 'user',
      text: textToSend,
      timestamp: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryText) setInput('');
    setIsThinking(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: messages.map((m) => ({ role: m.role, text: m.text })),
          userQuery: textToSend,
        }),
      });

      const data = await res.json();
      const aiMsg: ChatMessage = {
        id: getNextId('a'),
        role: 'assistant',
        text: data.reply || 'Thank you for your question. Maulana Abdus Subhan is available at +91 8828290721.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      const fallbackMsg: ChatMessage = {
        id: getNextId('err'),
        role: 'assistant',
        text:
          'Our admissions office in Aurahi East, Simraha, Araria, Bihar is always open for assistance. Feel free to connect directly with Nazim Maulana Abdus Subhan at +91 8828290721.',
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open Darul Uloom Siddiqia AI Scholar"
        className="fixed bottom-6 right-6 z-50 px-4 py-3 bg-[#064e3b] hover:bg-[#022c22] text-white rounded-full shadow-xl flex items-center gap-2.5 transition-all transform hover:scale-105 border-2 border-emerald-400/40 cursor-pointer"
      >
        <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center text-xs font-bold text-emerald-200">
          ✨
        </div>
        <span className="text-xs font-bold font-serif tracking-wide">
          {lang === 'ur'
            ? 'علمی معاون (AI Scholar)'
            : lang === 'ar'
            ? 'المساعد الذكي'
            : lang === 'hi'
            ? 'सिद्दीकिया एआई सलाहकार'
            : 'Ask Siddiqia AI'}
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          dir={isRTL ? 'rtl' : 'ltr'}
          className="fixed bottom-22 right-4 sm:right-6 z-50 w-[92vw] sm:w-[420px] h-[560px] max-h-[85vh] bg-white rounded-2xl shadow-2xl border border-emerald-900/20 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-200"
        >
          {/* Header */}
          <div className="bg-[#064e3b] p-4 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-emerald-800/80 border border-emerald-500/30 flex items-center justify-center text-sm">
                🕌
              </div>
              <div>
                <h3 className="font-serif font-bold text-sm tracking-wide leading-tight">
                  {lang === 'ur'
                    ? 'دارالعلوم صدیقہ علمی معاون'
                    : lang === 'ar'
                    ? 'دار العلوم الصديقية - المساعد الذكي'
                    : 'Siddiqia AI Scholar'}
                </h3>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>High Thinking Reasoning (Gemini 3.1 Pro)</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-white/70 hover:text-white text-base font-bold p-1 cursor-pointer"
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#faf9f5]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-[#064e3b] text-white rounded-br-none shadow-xs'
                      : 'bg-white text-stone-800 border border-stone-200 rounded-bl-none shadow-2xs font-sans'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                <span className="text-[9px] text-stone-400 mt-1 px-1">{m.timestamp}</span>
              </div>
            ))}

            {isThinking && (
              <div className="flex items-start gap-2 text-xs">
                <div className="bg-white border border-stone-200 rounded-2xl p-3 rounded-bl-none shadow-2xs text-emerald-900 flex items-center gap-2">
                  <span className="inline-block animate-spin text-sm">⏳</span>
                  <span className="text-[11px] font-medium animate-pulse">
                    Deeply reasoning scholarly response...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          {messages.length < 3 && (
            <div className="px-3 py-2 bg-white border-t border-stone-100 flex flex-wrap gap-1.5">
              {suggestedQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend((q as any)[lang] || q.en)}
                  className="text-[10px] bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-200 px-2.5 py-1 rounded-full text-left transition-colors cursor-pointer"
                >
                  {(q as any)[lang] || q.en}
                </button>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="p-3 bg-white border-t border-stone-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  lang === 'ur'
                    ? 'یہاں اپنا سوال تحریر فرمائیں...'
                    : lang === 'ar'
                    ? 'اكتب سؤالك هنا...'
                    : lang === 'hi'
                    ? 'अपना सवाल यहाँ लिखें...'
                    : 'Ask about courses, admissions, or Fiqh...'
                }
                className="flex-1 px-3.5 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || isThinking}
                className="px-3.5 py-2 bg-[#064e3b] hover:bg-[#022c22] disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer flex items-center justify-center"
              >
                ➔
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
