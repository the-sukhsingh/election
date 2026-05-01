'use client';

import React, { useState, useRef, useCallback, memo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Bot, User } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const SUGGESTED_QUESTIONS = [
  "What is an EVM?",
  "What is majority in Lok Sabha?",
  "Difference between MLA and MP?",
  "What is NOTA?",
  "Who is the Sarpanch?",
];

const AaravChat = memo(function AaravChat() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', text: "Namaste! I'm Aarav, your Democracy Navigator 🇮🇳. Ask me anything about Indian elections!" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  const sendMessage = useCallback(async (query: string) => {
    const trimmed = query.trim();
    if (!trimmed || loading) return;

    setError(null);
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.');
        setMessages(prev => prev.slice(0, -1)); // Remove the user message on error
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: data.answer }]);
      }
    } catch {
      setError('Network error. Please check your connection.');
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  }, [loading]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  }, [input, sendMessage]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  }, [input, sendMessage]);

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Close Aarav assistant' : 'Ask Aarav about Indian elections'}
        aria-expanded={open}
        aria-haspopup="dialog"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-4 focus:ring-orange-500/50"
        style={{ background: 'linear-gradient(135deg, #FF6B35, #e65c00)' }}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }}>
              <X className="w-6 h-6 text-white" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Ask Aarav — Election AI Assistant"
            aria-modal="true"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 z-50 w-[min(380px,calc(100vw-24px))] h-[520px] flex flex-col rounded-2xl overflow-hidden shadow-2xl border"
            style={{ background: '#0d1117', borderColor: 'rgba(255,107,53,0.3)' }}
          >
            {/* Header */}
            <div className="shrink-0 px-4 py-3 flex items-center gap-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,107,53,0.08)' }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg shrink-0" style={{ background: 'rgba(255,107,53,0.2)' }}>
                🧭
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white">Aarav the Navigator</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" aria-hidden="true" />
                  <p className="text-xs text-gray-400">Powered by Google Gemini AI</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3" role="log" aria-live="polite" aria-label="Conversation with Aarav">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5" 
                    style={{ background: msg.role === 'user' ? '#3b82f620' : 'rgba(255,107,53,0.15)' }}
                    aria-hidden="true"
                  >
                    {msg.role === 'user' ? <User className="w-3.5 h-3.5 text-blue-400" /> : <Bot className="w-3.5 h-3.5 text-orange-400" />}
                  </div>
                  <div
                    className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
                    style={{
                      background: msg.role === 'user' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
                      color: msg.role === 'user' ? '#93c5fd' : '#e2e8f0',
                      borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                    }}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex items-start gap-2">
                  <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center" style={{ background: 'rgba(255,107,53,0.15)' }} aria-hidden="true">
                    <Bot className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <Loader2 className="w-4 h-4 text-orange-400 animate-spin" aria-label="Aarav is thinking..." />
                  </div>
                </div>
              )}

              {error && (
                <p className="text-xs text-red-400 text-center px-4 py-2 rounded-xl bg-red-500/10" role="alert">
                  {error}
                </p>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Suggested questions (shown only at start) */}
            {messages.length === 1 && (
              <div className="shrink-0 px-4 pb-2 flex flex-wrap gap-1.5" aria-label="Suggested questions">
                {SUGGESTED_QUESTIONS.map(q => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="text-xs px-3 py-1.5 rounded-full border transition-colors hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    style={{ borderColor: 'rgba(255,107,53,0.3)', color: 'rgba(255,255,255,0.6)' }}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <form onSubmit={handleSubmit} className="shrink-0 p-3 border-t flex items-center gap-2" style={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about elections…"
                disabled={loading}
                maxLength={200}
                aria-label="Ask Aarav a question about Indian elections"
                className="flex-1 bg-white/5 border rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50 disabled:opacity-50 transition-all"
                style={{ borderColor: 'rgba(255,255,255,0.1)' }}
              />
              <button
                type="submit"
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all disabled:opacity-40 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-500 shrink-0"
                style={{ background: 'linear-gradient(135deg, #FF6B35, #e65c00)' }}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
});

export default AaravChat;
