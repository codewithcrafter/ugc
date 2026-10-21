'use client';

import React, { useState, useEffect, useRef } from 'react';
import { productConfig } from '../config/product';
import { MessageCircle, Phone, MessageSquare, X, Send, Bot, Check, Sparkles } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export function ContactControls() {
  const { contactWidget, contact } = productConfig;
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcomePopup, setShowWelcomePopup] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const cleanWaNumber = String(contactWidget.whatsapp.number).replace(/[^0-9]/g, '');
  const encodedWaText = encodeURIComponent(contactWidget.whatsapp.prefilledMessage);
  const waUrl = `https://wa.me/${cleanWaNumber}?text=${encodedWaText}`;
  const phoneUrl = `tel:${contactWidget.phone.number}`;

  // Initialize welcome popup timer (4 seconds delay)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const dismissed = sessionStorage.getItem(contactWidget.welcomePopup.sessionStorageKey);
    if (!dismissed && contactWidget.welcomePopup.enabled) {
      const timer = setTimeout(() => {
        setShowWelcomePopup(true);
      }, contactWidget.welcomePopup.delayMs || 4000);
      return () => clearTimeout(timer);
    }
  }, [contactWidget.welcomePopup]);

  // Initialize bot welcome message once when chat is opened
  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'bot',
          text: contactWidget.chatbot.welcomeMessage,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
      setHasUnread(false);
    }
  }, [isChatOpen, messages.length, contactWidget.chatbot.welcomeMessage]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const toggleChat = () => {
    const nextState = !isChatOpen;
    setIsChatOpen(nextState);
    if (nextState) {
      setHasUnread(false);
      setShowWelcomePopup(false);
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  };

  const handleDismissWelcome = () => {
    setShowWelcomePopup(false);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(contactWidget.welcomePopup.sessionStorageKey, 'true');
    }
  };

  const handleAcceptWelcome = () => {
    handleDismissWelcome();
    setIsChatOpen(true);
  };

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Look for matching quick reply or generate intelligent concierge response
    setTimeout(() => {
      const lowerQuery = query.toLowerCase();
      let botResponse = contactWidget.chatbot.fallbackReply;

      // Find keyword match in quickReplies
      for (const qr of contactWidget.chatbot.quickReplies) {
        if (
          lowerQuery.includes(qr.label.toLowerCase()) ||
          (qr.id === 'product-info' && (lowerQuery.includes('spec') || lowerQuery.includes('material') || lowerQuery.includes('driver'))) ||
          (qr.id === 'pricing-availability' && (lowerQuery.includes('price') || lowerQuery.includes('cost') || lowerQuery.includes('order'))) ||
          (qr.id === 'talk-team' && (lowerQuery.includes('whatsapp') || lowerQuery.includes('phone') || lowerQuery.includes('human')))
        ) {
          botResponse = qr.reply;
          break;
        }
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, contactWidget.chatbot.typingDelayMs || 650);
  };

  return (
    <>
      {/* 4-SECOND WELCOME POPUP TOAST */}
      {showWelcomePopup && !isChatOpen && (
        <div 
          className="fixed bottom-24 right-5 sm:right-6 z-40 max-w-sm w-full bg-white rounded-3xl p-5 shadow-2xl border border-[#7545F5]/20 animate-slide-up"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7545F5]/10 text-[#7545F5] text-[11px] font-bold">
              <Sparkles className="w-3 h-3" />
              <span>{contactWidget.welcomePopup.badge}</span>
            </div>
            <button
              type="button"
              onClick={handleDismissWelcome}
              aria-label="Dismiss welcome popup"
              className="text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-sm font-semibold text-[#1A1918] mb-4">
            {contactWidget.welcomePopup.message}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleAcceptWelcome}
              className="flex-1 py-2 px-3 rounded-xl bg-[#7545F5] text-white text-xs font-semibold hover:bg-[#6232e0] transition-colors"
            >
              {contactWidget.welcomePopup.acceptText}
            </button>
            <button
              type="button"
              onClick={handleDismissWelcome}
              className="py-2 px-3 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors"
            >
              {contactWidget.welcomePopup.dismissText}
            </button>
          </div>
        </div>
      )}

      {/* FLOATING VERTICAL TOOLBAR (RIGHT-SIDE) */}
      <nav 
        className="fixed bottom-6 right-5 sm:right-6 z-40 flex flex-col items-center gap-3"
        aria-label="Quick Contact and Concierge Toolbar"
      >
        {/* WhatsApp Button */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-12 h-12 rounded-full bg-[#25D366] text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200"
          aria-label={contactWidget.whatsapp.ariaLabel}
          title={contactWidget.whatsapp.tooltip}
        >
          <MessageCircle className="w-6 h-6 fill-current" />
          <span className="absolute right-14 px-2.5 py-1 rounded-lg bg-black/80 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            {contactWidget.whatsapp.tooltip}
          </span>
        </a>

        {/* Phone Call Button */}
        <a
          href={phoneUrl}
          className="group relative w-12 h-12 rounded-full bg-white text-[#7545F5] border border-[#7545F5]/25 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200"
          aria-label={contactWidget.phone.ariaLabel}
          title={contactWidget.phone.tooltip}
        >
          <Phone className="w-5 h-5" />
          <span className="absolute right-14 px-2.5 py-1 rounded-lg bg-black/80 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            {contactWidget.phone.tooltip}
          </span>
        </a>

        {/* Chatbot Toggle Button */}
        <button
          type="button"
          onClick={toggleChat}
          className="group relative w-13 h-13 rounded-full bg-[#7545F5] text-white shadow-xl hover:bg-[#6232e0] hover:scale-105 active:scale-95 flex items-center justify-center transition-all duration-200"
          aria-label={contactWidget.chatbot.ariaLabel}
          aria-expanded={isChatOpen}
        >
          {isChatOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageSquare className="w-6 h-6" />
          )}

          {/* Unread indicator dot */}
          {hasUnread && !isChatOpen && (
            <span className="absolute top-0 right-0 w-3.5 h-3.5 rounded-full bg-[#E4FF83] border-2 border-[#7545F5] animate-ping" />
          )}
          
          <span className="absolute right-16 px-2.5 py-1 rounded-lg bg-black/80 text-white text-xs font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md">
            {contactWidget.chatbot.tooltip}
          </span>
        </button>
      </nav>

      {/* GUIDED FAQ CONCIERGE CHAT DRAWER */}
      {isChatOpen && (
        <aside 
          className="fixed bottom-24 right-4 sm:right-6 z-50 w-[92vw] sm:w-[400px] h-[540px] max-h-[80vh] bg-white rounded-3xl shadow-2xl border border-[#7545F5]/20 flex flex-col overflow-hidden animate-scale-up"
          role="dialog"
          aria-modal="true"
          aria-label="AURA Concierge Chatbot"
        >
          {/* Chat Header */}
          <div className="p-4 bg-gradient-to-r from-[#7545F5] to-[#9165ff] text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                <Bot className="w-5 h-5 text-[#E4FF83]" />
              </div>
              <div>
                <h3 className="text-sm font-bold leading-tight">
                  {contactWidget.chatbot.headerTitle}
                </h3>
                <p className="text-[11px] text-white/80">
                  {contactWidget.chatbot.headerSubtitle}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleChat}
              aria-label="Close concierge chat"
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-[#7545F5] text-white rounded-br-xs'
                      : 'bg-white text-[#1A1918] border border-slate-100 rounded-bl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-white border border-slate-100 w-fit">
                <span className="w-2 h-2 rounded-full bg-[#7545F5] animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-[#7545F5] animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-[#7545F5] animate-bounce delay-200" />
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Action Chips */}
          <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto no-scrollbar">
            {contactWidget.chatbot.quickReplies.map((qr) => (
              <button
                key={qr.id}
                type="button"
                onClick={() => handleSendMessage(qr.label)}
                className="shrink-0 px-3 py-1.5 rounded-full bg-[#7545F5]/10 hover:bg-[#7545F5] hover:text-white text-[#7545F5] text-xs font-medium transition-colors"
              >
                {qr.label}
              </button>
            ))}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-slate-100 flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about acoustics, finishes, delivery..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-100 text-xs sm:text-sm text-[#1A1918] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7545F5] transition-all"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              aria-label="Send message"
              className="w-10 h-10 rounded-xl bg-[#7545F5] text-white flex items-center justify-center hover:bg-[#6232e0] disabled:opacity-30 disabled:hover:bg-[#7545F5] transition-colors shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </aside>
      )}
    </>
  );
}
