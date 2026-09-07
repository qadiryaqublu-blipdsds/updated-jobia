import React, { useState } from 'react';
import { Vacancy, Application, CVData } from '../../types';
import { MessageSquare, Send, Bot, User, CheckCircle2, Shield, Paperclip, Sparkles } from 'lucide-react';

interface GoogleChatHubProps {
  vacancies: Vacancy[];
  applications: Application[];
  candidateCV?: CVData | null;
  onClose?: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'recruiter' | 'ai-assistant';
  senderName: string;
  text: string;
  timestamp: string;
}

export const GoogleChatHub: React.FC<GoogleChatHubProps> = ({
  vacancies,
  applications,
  candidateCV,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'recruiter',
      senderName: 'Leyla Məmmədova (HR Lead)',
      text: 'Salam! Sizin namizədliyiniz komandamız tərəfindən yüksək qiymətləndirildi. Müsahibə mərhələsi üçün əlaqə saxlayırıq.',
      timestamp: '11:30',
    },
    {
      id: 'msg-2',
      sender: 'ai-assistant',
      senderName: 'Jobia AI Karyera Köməkçisi',
      text: 'Salam! Qarşı tərəflə iş qrafiki, sınaq müddəti və əməkhaqqı şərtlərini buradan birbaşa dəqiqləşdirə bilərsiniz.',
      timestamp: '11:31',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      senderName: candidateCV?.personalInfo?.fullName || 'Mən',
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // AI automated simulation reply
    setTimeout(() => {
      const reply: ChatMessage = {
        id: `reply-${Date.now()}`,
        sender: 'recruiter',
        senderName: 'Leyla Məmmədova (HR Lead)',
        text: 'Mesajınızı qəbul etdik, qısa zamanda təfərrüatları təsdiqləyəcəyik.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, reply]);
    }, 1000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Top bar */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              İşəgötürənlə Birbaşa Çat (Google Chat Workspace)
            </h3>
            <span className="text-[11px] text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Onlayn əlaqə
            </span>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
        {messages.map((m) => {
          const isUser = m.sender === 'user';
          return (
            <div
              key={m.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-center gap-1.5 mb-1 px-1">
                <span className="text-[10px] font-bold text-slate-500">{m.senderName}</span>
                <span className="text-[9px] text-slate-400">{m.timestamp}</span>
              </div>
              <div
                className={`max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  isUser
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : m.sender === 'ai-assistant'
                    ? 'bg-purple-50 border border-purple-200 text-purple-900 rounded-bl-xs'
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-xs shadow-2xs'
                }`}
              >
                {m.text}
              </div>
            </div>
          );
        })}
      </div>

      {/* Input */}
      <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Cavabınızı yazın..."
          className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
        />
        <button
          type="submit"
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
        >
          <Send className="w-3.5 h-3.5" />
          Göndər
        </button>
      </form>
    </div>
  );
};
