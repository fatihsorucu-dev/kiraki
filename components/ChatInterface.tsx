
import React, { useState, useRef, useEffect } from 'react';
import { chatWithKuraki } from '../services/gemini';
import { Icons } from '../constants';

const ChatInterface: React.FC<{ context: any, t: any }> = ({ context, t }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([
    { role: 'bot', text: 'Merhaba! Ben KURAKİ. Finansal verilerinize dayanarak size nasıl yardımcı olabilirim?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsLoading(true);

    try {
      const response = await chatWithKuraki(userMsg, context);
      setMessages(prev => [...prev, { role: 'bot', text: response || 'Üzgünüm, bir hata oluştu.' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'bot', text: 'Teknik bir aksaklık yaşandı.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white dark:bg-cardDark rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden">
      <div className="p-6 border-b border-slate-50 dark:border-slate-800 flex items-center gap-4 bg-blue-900 text-white">
        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
          <Icons.MessageSquare />
        </div>
        <div>
          <h3 className="font-black text-sm uppercase tracking-widest">{t.askKuraki}</h3>
          <p className="text-[10px] opacity-70 font-bold uppercase tracking-tighter">AI Finansal Danışman</p>
        </div>
      </div>

      <div ref={scrollRef} className="flex-grow p-6 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-midnight/30">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-4 rounded-[1.5rem] text-sm font-medium shadow-sm leading-relaxed ${m.role === 'user' ? 'bg-blue-900 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-[1.5rem] rounded-bl-none flex gap-1">
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="p-4 bg-white dark:bg-cardDark border-t border-slate-50 dark:border-slate-800">
        <div className="relative">
          <input 
            className="w-full pl-6 pr-16 py-4 rounded-2xl bg-slate-100 dark:bg-slate-900/50 dark:text-white outline-none focus:border-blue-500 border-2 border-transparent transition-all font-bold text-sm" 
            placeholder={t.chatPlaceholder}
            value={input}
            onChange={e => setInput(e.target.value)}
          />
          <button type="submit" className="absolute right-2 top-2 bottom-2 px-6 bg-blue-900 text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-950 transition-all active:scale-95">
            GÖNDER
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
