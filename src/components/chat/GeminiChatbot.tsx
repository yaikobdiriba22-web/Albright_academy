import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  RotateCcw,
  Maximize2,
  Minimize2,
  Zap,
  GraduationCap,
  Brain,
  Copy,
  Check,
  School,
  ChevronDown,
} from 'lucide-react';
import { api } from '../../lib/api.ts';
import { useTranslation } from '../../i18n/LanguageContext.tsx';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
  modelUsed?: string;
}

type TaskType = 'general' | 'fast' | 'complex';

export const GeminiChatbot: React.FC = () => {
  const { language } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [taskType, setTaskType] = useState<TaskType>('general');
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initial welcome greeting based on language
  const getInitialGreeting = (lang: string): string => {
    if (lang === 'am') {
      return `ሰላም! ወደ ኦልብራይት አካዳሚ (Albright Academy) የትምህርት ረዳት በደህና መጡ። 
ስለ 2026 የትምህርት ዘመን ምዝገባ፣ የKG1 እስከ 8ኛ ክፍል ፕሮግራሞች፣ የSTEM ላቦራቶሪና የትምህርት ቤቱ መገልገያዎች ማንኛውንም ጥያቄ መጠየቅ ይችላሉ።`;
    }
    if (lang === 'om') {
      return `Akkam! Baga gara Gargaaraa Barnootaa AI Akadaamii Olbiraayit (Albright Academy) nagaan dhuftan. 
Waa'ee galmee bara 2026, sagantaalee barnootaa KG1 hanga kutaa 8ffaa, laabii STEM fi tajaajila mana barumsaa keenyaa na gaafachuu dandeessu.`;
    }
    return `Hello! Welcome to Albright Academy's AI Academic Assistant & Admissions Counselor. 
How can I assist you today? You can ask about our 2026 Academic Year admissions, KG1 to Grade 8 programs, STEM facilities, campus location, or schedule a campus visit.`;
  };

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'model',
      content: getInitialGreeting(language),
      timestamp: new Date(),
      modelUsed: 'gemini-3.5-flash',
    },
  ]);

  // Update greeting if language changed and conversation is fresh
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome-1') {
      setMessages([
        {
          id: 'welcome-1',
          role: 'model',
          content: getInitialGreeting(language),
          timestamp: new Date(),
          modelUsed:
            taskType === 'fast'
              ? 'gemini-3.1-flash-lite'
              : taskType === 'complex'
              ? 'gemini-3.1-pro-preview'
              : 'gemini-3.5-flash',
        },
      ]);
    }
  }, [language]);

  // Auto-scroll to bottom of thread
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage.trim();
    if (!textToSend || isLoading) return;

    setError(null);
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date(),
    };

    const newThread = [...messages, userMsg];
    setMessages(newThread);
    if (!customText) {
      setInputMessage('');
    }
    setIsLoading(true);

    try {
      // Format history for multi-turn chat
      const historyPayload = newThread
        .filter((m) => m.id !== 'welcome-1') // omit welcome system-stub if preferred or keep
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      // If thread had only welcome message and this is turn 1
      if (historyPayload.length === 0) {
        historyPayload.push({ role: 'user', content: textToSend });
      }

      const res = await api.sendChatMessage({
        messages: historyPayload,
        taskType,
        language,
      });

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'model',
        content: res.reply,
        timestamp: new Date(),
        modelUsed: res.modelUsed,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setError(err.message || 'Unable to connect to AI Assistant. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'model',
        content: getInitialGreeting(language),
        timestamp: new Date(),
        modelUsed:
          taskType === 'fast'
            ? 'gemini-3.1-flash-lite'
            : taskType === 'complex'
            ? 'gemini-3.1-pro-preview'
            : 'gemini-3.5-flash',
      },
    ]);
    setError(null);
  };

  // Quick prompt suggestions
  const quickSuggestions = [
    {
      en: 'How do I apply for 2026 admissions?',
      am: 'የ2026 የቅበላ ምዝገባ እንዴት ነው?',
      om: 'Galmee bara 2026 akkamitti raawwanna?',
    },
    {
      en: 'What STEM & lab facilities exist?',
      am: 'ምን ዓይነት የSTEM እና የላቦራቶሪ ክፍሎች አሉ?',
      om: 'Laabii fi teeknooloojii akkamiitu jira?',
    },
    {
      en: 'Tell me about KG1 to Grade 8 levels',
      am: 'ስለ KG1 እስከ 8ኛ ክፍል ፕሮግራሞች ንገረኝ',
      om: 'Sagantaa KG1 hanga kutaa 8ffaa natti himaa',
    },
    {
      en: 'Where is the school campus located?',
      am: 'የትምህርት ቤቱ ካምፓስ የት ነው የሚገኘው?',
      om: 'Kaampaasiin eessatti argama?',
    },
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-subtle">
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open Albright Academy AI Assistant"
            className="group relative flex items-center gap-3 bg-[#0f2444] text-white px-4 py-3 rounded-full shadow-2xl border-2 border-amber-400 hover:bg-[#16335d] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-amber-400/20 flex items-center justify-center border border-amber-400/40 text-amber-300">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              {/* Online indicator ping */}
              <span className="absolute top-0 right-0 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white" />
              </span>
            </div>

            <div className="text-left pr-1 hidden sm:block">
              <span className="block text-xs font-black uppercase tracking-wider text-amber-400">
                Albright AI Assistant
              </span>
              <span className="block text-[11px] text-slate-200 font-medium">
                Admissions & Curriculum Help
              </span>
            </div>
          </button>
        </div>
      )}

      {/* Chat Window Modal / Drawer */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Albright Academy Gemini Assistant"
          className={`fixed z-50 transition-all duration-300 flex flex-col bg-white shadow-2xl border border-slate-200 overflow-hidden ${
            isExpanded
              ? 'inset-4 sm:inset-10 rounded-3xl'
              : 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[440px] h-[640px] max-h-[88vh] rounded-3xl'
          }`}
        >
          {/* Header */}
          <div className="bg-[#0f2444] text-white p-4 border-b border-white/10 shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center text-slate-950 font-bold shadow-md">
                  <Bot className="w-5 h-5 text-slate-900" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-sm sm:text-base tracking-tight font-display text-white">
                      Albright AI Assistant
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                      Gemini
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
                    <span>KG1–Grade 8 Academic Counselor</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-slate-300">
                <button
                  type="button"
                  onClick={handleClearHistory}
                  title="Clear conversation history"
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(!isExpanded)}
                  title={isExpanded ? 'Collapse' : 'Expand full screen'}
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Model Role Selector Tabs per User Specifications */}
            <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-1.5 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 mr-1 hidden sm:inline">
                Mode:
              </span>
              <button
                type="button"
                onClick={() => setTaskType('general')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  taskType === 'general'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                title="Uses gemini-3.5-flash for admissions and general inquiries"
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>General (3.5 Flash)</span>
              </button>
              <button
                type="button"
                onClick={() => setTaskType('fast')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  taskType === 'fast'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                title="Uses gemini-3.1-flash-lite for rapid Q&A"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Fast (Flash-Lite)</span>
              </button>
              <button
                type="button"
                onClick={() => setTaskType('complex')}
                className={`flex-1 flex items-center justify-center gap-1.5 py-1 px-2 rounded-xl text-[11px] font-semibold transition-all cursor-pointer ${
                  taskType === 'complex'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
                title="Uses gemini-3.1-pro-preview for deep pedagogical reasoning"
              >
                <Brain className="w-3.5 h-3.5" />
                <span>Advisor (3.1 Pro)</span>
              </button>
            </div>
          </div>

          {/* Scrollable Message Thread */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-slate-50/70">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-8 h-8 rounded-xl bg-[#0f2444] text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30 shadow-xs mt-1">
                      <School className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs relative group ${
                      isUser
                        ? 'bg-[#0f2444] text-white rounded-tr-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-tl-none'
                    }`}
                  >
                    {/* Message Content */}
                    <div className="whitespace-pre-wrap font-sans">{msg.content}</div>

                    {/* Metadata & Copy action */}
                    <div
                      className={`mt-2 flex items-center justify-between text-[10px] gap-2 pt-1 border-t ${
                        isUser
                          ? 'border-white/10 text-slate-300'
                          : 'border-slate-100 text-slate-400'
                      }`}
                    >
                      <span className="font-mono">
                        {msg.timestamp.toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>

                      <div className="flex items-center gap-2">
                        {msg.modelUsed && (
                          <span className="font-mono text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                            {msg.modelUsed.replace('models/', '')}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleCopy(msg.id, msg.content)}
                          title="Copy text"
                          className="hover:text-slate-900 transition-colors p-0.5 cursor-pointer"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {isUser && (
                    <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center shrink-0 shadow-xs mt-1">
                      <User className="w-4 h-4 font-bold" />
                    </div>
                  )}
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-start gap-2.5 justify-start">
                <div className="w-8 h-8 rounded-xl bg-[#0f2444] text-amber-400 flex items-center justify-center shrink-0 border border-amber-400/30 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-none p-3.5 shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="w-2 h-2 rounded-full bg-[#0f2444] animate-pulse delay-100" />
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-200" />
                    <span className="text-[11px] text-slate-400 font-medium ml-2">
                      {taskType === 'complex'
                        ? 'Analyzing pedagogical curriculum...'
                        : 'Thinking...'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error banner */}
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
                <span>{error}</span>
                <button
                  type="button"
                  onClick={() => handleSendMessage()}
                  className="font-bold underline hover:text-rose-950 cursor-pointer ml-2"
                >
                  Retry
                </button>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions Chips (visible when conversation is short) */}
          {messages.length <= 2 && (
            <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
              {quickSuggestions.map((s, idx) => {
                const text =
                  language === 'am' ? s.am : language === 'om' ? s.om : s.en;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSendMessage(text)}
                    className="whitespace-nowrap text-[11px] font-semibold bg-slate-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-300 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-all cursor-pointer"
                  >
                    {text}
                  </button>
                );
              })}
            </div>
          )}

          {/* Input Area */}
          <div className="p-3 sm:p-4 bg-white border-t border-slate-200 shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-end gap-2"
            >
              <div className="relative flex-1">
                <textarea
                  ref={inputRef}
                  rows={2}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    language === 'am'
                      ? 'ስለ ኦልብራይት አካዳሚ ጥያቄዎን እዚህ ይጻፉ... (Enter ይጫኑ)'
                      : language === 'om'
                      ? 'Gaaffii keessan asitti barreessaa... (Enter tuqaa)'
                      : 'Ask about admissions, curriculum, STEM facilities... (Enter to send)'
                  }
                  className="w-full resize-none rounded-2xl border border-slate-300 p-2.5 sm:p-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0f2444] focus:border-[#0f2444] transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                aria-label="Send message"
                className={`p-3 rounded-2xl transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                  !inputMessage.trim() || isLoading
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    : 'bg-[#0f2444] text-amber-400 hover:bg-[#16335d] shadow-md hover:shadow-lg active:scale-95'
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </form>

            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
              <span>Albright Academy • Sheggar city, Gefarsa Gujjee, kella</span>
              <span>Hotline: 0923014132</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
