import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  Send,
  Trash2,
  User,
  Bot,
  RefreshCw,
  Lightbulb,
  ShieldCheck,
  ChevronRight,
  Briefcase,
} from 'lucide-react';

export const CareerAssistantPage: React.FC = () => {
  const {
    chatMessages,
    addChatMessage,
    clearChat,
    activeProfile,
    jobs,
    selectedJobId,
  } = useApp();

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  const suggestedQuestions = [
    'Which jobs in the catalog best fit my current skill set?',
    'What are the most critical missing skills for my target role?',
    'How can I structure my portfolio project to impress recruiters?',
    'Give me 3 realistic technical screening questions with answer tips.',
    'How should I explain my skill transitions in a non-traditional background?',
    'Draft a 30-day study strategy for Docker & System Design.',
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageContent = (textToSend || input).trim();
    if (!messageContent || loading) return;

    // Add user message
    addChatMessage({
      sender: 'user',
      content: messageContent,
    });
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('/api/ai/career-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...chatMessages, { sender: 'user', content: messageContent }],
          candidateProfile: activeProfile,
          currentJobContext: selectedJob,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI career advice');
      }

      addChatMessage({
        sender: 'assistant',
        content: data.reply,
        suggestions: data.suggestions,
      });
    } catch (err: unknown) {
      addChatMessage({
        sender: 'assistant',
        content:
          'I apologize, but I encountered a momentary connection hiccup. Please verify your internet connection or check API keys in settings.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800 flex-shrink-0">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Google Gemini-Powered Career Coach</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white">
            AI Career Assistant & Mentor
          </h1>
          <p className="text-xs text-slate-400">
            Contextualized with your active resume ({activeProfile?.fullName || 'Candidate'}) and inspected job ({selectedJob.title}).
          </p>
        </div>

        <button
          onClick={clearChat}
          className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1.5 transition self-start sm:self-center"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear History
        </button>
      </div>

      {/* Chat Messages Scroll Container */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white flex-shrink-0 shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 text-xs leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-none shadow-xl'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Suggestions chips if any */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap gap-1.5 mt-2">
                  {msg.suggestions.map((sug, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendMessage(sug)}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-blue-600 hover:text-white border border-slate-800 text-slate-300 transition text-left"
                    >
                      {sug}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 flex items-center justify-center text-slate-300 flex-shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 animate-spin" />
            </div>
            <div className="px-4 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
              Thinking & consulting career benchmarks...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar (when chat is short) */}
      {chatMessages.length <= 2 && (
        <div className="flex-shrink-0">
          <span className="text-[11px] font-semibold text-slate-400 block mb-2 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            Recommended Prompts:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {suggestedQuestions.slice(0, 3).map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500/50 text-[11px] text-slate-300 hover:text-white text-left transition"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Message Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex-shrink-0 pt-2"
      >
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your skill gaps, interview prep, or resume bullets..."
            className="w-full pl-4 pr-12 py-3 rounded-2xl bg-slate-900 border border-slate-800 text-slate-200 text-xs placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition shadow-lg"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="absolute right-2 p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-slate-500 mt-2 text-center">
          AI Career Assistant provides practical suggestions and guidance. It does not promise guaranteed placement or salary compensation.
        </p>
      </form>
    </div>
  );
};
