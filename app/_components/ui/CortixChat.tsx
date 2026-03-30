import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { X } from './WireIcons';
import Orb from './Orb';
import CortixExtensions from './CortixExtensions';
import CortixSidebar from './CortixSidebar';
import CortixProjects from './CortixProjects';
import CortixProviders from './CortixProviders';
import CortixPets from './CortixPets';
import CortixPetWorkspace from './CortixPetWorkspace';
import type { Pet } from './CortixPets';

interface Message { role: 'user' | 'assistant'; content: string; }

const STORAGE_KEY = 'cortix_chat_history';

const CortixChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentView, setCurrentView] = useState<string>('chat');
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [activePet, setActivePet] = useState<Pet | null>(null);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.messages?.length > 0) {
          setMessages(parsed.messages);
          setHasStarted(true);
        }
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
  }, []);

  // Save chat history to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, timestamp: Date.now() }));
      } catch (e) {
        console.error('Failed to save chat history:', e);
      }
    }
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && currentView === 'chat') {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentView]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    const userMessage = input.trim();
    setInput('');
    setHasStarted(true);
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsProcessing(true);
    inputRef.current?.blur();

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, { role: 'user', content: userMessage }] })
      });
      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: response.ok ? data.content : 'Sorry, I encountered an error.' }]);
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Connection error. Please try again.' }]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    inputRef.current?.blur();
    setIsOpen(false);
    setCurrentView('chat');
  };

  const handleNewChat = () => {
    setHasStarted(false);
    setMessages([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const handleNavigate = (view: string) => {
    if (view === 'chat') { handleNewChat(); }
    setCurrentView(view);
  };

  // Loading animation
  const LoadingIndicator = () => (
    <div className="flex gap-3">
      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, repeat: Infinity }}>
          <Orb size={28} enableEasterEgg={false} />
        </motion.div>
      </div>
      <div className="flex-1 py-2">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[13px] font-medium" style={{ color: 'rgba(195,175,155,0.9)' }}>CortixEngine</span>
          <span className="text-[11px]" style={{ color: 'rgba(255,255,255,0.4)' }}>is thinking</span>
        </div>
        <div className="flex gap-1">
          <motion.div className="w-2 h-2 rounded-full" style={{ background: 'rgba(195,175,155,0.6)' }}
            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0 }} />
          <motion.div className="w-2 h-2 rounded-full" style={{ background: 'rgba(195,175,155,0.6)' }}
            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.2 }} />
          <motion.div className="w-2 h-2 rounded-full" style={{ background: 'rgba(195,175,155,0.6)' }}
            animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1, repeat: Infinity, delay: 0.4 }} />
        </div>
      </div>
    </div>
  );

  // Message component
  const MessageBubble = ({ msg }: { msg: Message }) => {
    if (msg.role === 'user') {
      return (
        <div className="flex justify-end gap-3">
          <div className="max-w-[80%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed"
            style={{ background: 'rgba(195,175,155,0.15)', color: 'rgba(255,255,255,0.9)' }}>
            {msg.content}
          </div>
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
            style={{ background: 'rgba(195,175,155,0.2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(195,175,155,0.8)" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>
      );
    }

    return (
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <Orb size={28} enableEasterEgg={false} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium mb-1" style={{ color: 'rgba(195,175,155,0.9)' }}>CortixEngine</div>
          <div className="prose prose-invert prose-sm max-w-none text-[14px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold" style={{ color: 'rgba(195,175,155,1)' }}>{children}</strong>,
                ul: ({ children }) => <ul className="mb-3 space-y-1 list-none pl-0">{children}</ul>,
                li: ({ children }) => <li className="flex gap-2"><span style={{ color: 'rgba(195,175,155,0.7)' }}>•</span><span>{children}</span></li>,
                h1: ({ children }) => <h3 className="text-base font-semibold mb-2" style={{ color: 'rgba(195,175,155,1)' }}>{children}</h3>,
                h2: ({ children }) => <h4 className="text-sm font-semibold mb-2" style={{ color: 'rgba(195,175,155,1)' }}>{children}</h4>,
                h3: ({ children }) => <h5 className="text-sm font-semibold mb-2" style={{ color: 'rgba(195,175,155,1)' }}>{children}</h5>,
                code: ({ children }) => <code className="px-1.5 py-0.5 rounded text-[13px]" style={{ background: 'rgba(255,255,255,0.1)' }}>{children}</code>,
              }}
            >
              {msg.content}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    );
  };

  // Input bar with + and tool buttons
  const renderInput = () => (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(195,175,155,0.25)' }}>
        <button type="button" onClick={handleNewChat}
          className="w-7 h-7 flex-shrink-0 flex items-center justify-center hover:opacity-70 transition-opacity"
          title="New chat">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(195,175,155,0.6)" strokeWidth="1.5">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button type="button" onClick={() => setCurrentView('extensions')}
          className="w-7 h-7 flex-shrink-0 flex items-center justify-center hover:opacity-70 transition-opacity"
          title="Extensions">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(195,175,155,0.5)" strokeWidth="1.5">
            <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
          </svg>
        </button>
        <input ref={inputRef} type="text" inputMode="text" enterKeyHint="send"
          autoComplete="off" autoCorrect="off" autoCapitalize="off"
          value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleSubmit(e))}
          placeholder={hasStarted ? "Ask a follow up..." : "Message..."}
          className="flex-1 bg-transparent outline-none min-w-0"
          style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px' }} />
        <button type="submit" disabled={!input.trim() || isProcessing}
          className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center disabled:opacity-30 transition-opacity">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(195,175,155,0.8)" strokeWidth="2">
            <line x1="12" y1="19" x2="12" y2="5" /><polyline points="5,12 12,5 19,12" />
          </svg>
        </button>
      </div>
    </form>
  );

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)}
        className="fixed z-[115] transition-all duration-300 hover:scale-110 overflow-hidden"
        style={{ right: '8px', top: 'calc(65% - 60px)', width: '40px', height: '40px', borderRadius: '50%' }}
        aria-label="Open CortixEngine">
        <div style={{ transform: 'scale(0.85)', transformOrigin: 'center' }}><Orb size={40} enableEasterEgg={false} /></div>
      </button>
    );
  }

  if (currentView === 'extensions') {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-[#0f0f0f]">
      <CortixExtensions onClose={() => setCurrentView('chat')} />
    </motion.div>;
  }

  if (currentView === 'projects') {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-[#0f0f0f]">
      <CortixProjects onBack={() => setCurrentView('chat')} />
    </motion.div>;
  }

  if (currentView === 'providers') {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-[#0f0f0f]">
      <CortixProviders onClose={() => setCurrentView('chat')} />
    </motion.div>;
  }

  if (currentView === 'pet-workspace' && activePet) {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-[#0f0f0f]">
      <CortixPetWorkspace pet={activePet} onBack={() => { setActivePet(null); setCurrentView('pets'); }}
        onPetUpdate={(updated) => setActivePet(updated)} />
    </motion.div>;
  }

  if (currentView === 'pets') {
    return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] bg-[#0f0f0f]">
      <CortixPets onBack={() => setCurrentView('chat')} onOpenPet={(pet) => { setActivePet(pet); setCurrentView('pet-workspace'); }} />
    </motion.div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[200] flex bg-[#0f0f0f]">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <CortixSidebar isExpanded={sidebarExpanded} onToggle={() => setSidebarExpanded(!sidebarExpanded)} 
          onNavigate={handleNavigate} currentView={currentView} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 flex-shrink-0">
          <button onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div className="flex-1" />
          <button onClick={handleClose}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[rgba(255,255,255,0.05)]">
            <X size={18} strokeWidth={1.5} style={{ color: 'rgba(255,255,255,0.5)' }} />
          </button>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!hasStarted ? (
            <div className="flex-1 flex flex-col items-center justify-end pb-[30vh] px-5">
              <div className="mb-6"><Orb size={80} enableEasterEgg={false} /></div>
              <h1 className="text-xl font-light mb-8 text-center" style={{ color: 'rgba(255,255,255,0.9)' }}>What can I help with?</h1>
              <div className="w-full max-w-[500px]">{renderInput()}</div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col max-w-[700px] w-full mx-auto px-4 min-h-0">
              <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {messages.map((msg, i) => <MessageBubble key={i} msg={msg} />)}
                {isProcessing && <LoadingIndicator />}
                <div ref={messagesEndRef} />
              </div>
              <div className="py-4 flex-shrink-0">{renderInput()}</div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarExpanded && (
          <motion.div className="md:hidden fixed inset-0 z-[250]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="absolute inset-0 bg-black/70" onClick={() => setSidebarExpanded(false)} />
            <motion.div className="absolute left-0 top-0 h-full" initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}>
              <CortixSidebar isExpanded={true} onToggle={() => setSidebarExpanded(false)} 
                onNavigate={(view) => { handleNavigate(view); setSidebarExpanded(false); }} currentView={currentView} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CortixChat;