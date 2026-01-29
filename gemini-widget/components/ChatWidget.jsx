import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Loader2, Minimize2, Sparkles } from 'lucide-react';
import { createChatSession, sendMessageStream } from '../services/geminiService.js';
import { Role } from '../types.js';
import ChatMessage from './ChatMessage.jsx';

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: Role.MODEL,
      text: "Hi there! I'm your AI assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);

  const chatSessionRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    try {
      chatSessionRef.current = createChatSession();
    } catch (error) {
      console.error('Failed to initialize chat session', error);
    }
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const toggleChat = () => setIsOpen(!isOpen);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading || !chatSessionRef.current) return;

    const userText = inputValue.trim();
    setInputValue('');
    if (inputRef.current) inputRef.current.style.height = 'auto';

    const userMessage = {
      id: Date.now().toString(),
      role: Role.USER,
      text: userText,
      timestamp: new Date(),
    };

    const botMessageId = (Date.now() + 1).toString();
    const botMessagePlaceholder = {
      id: botMessageId,
      role: Role.MODEL,
      text: '',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage, botMessagePlaceholder]);
    setIsLoading(true);

    try {
      const streamResult = await sendMessageStream(chatSessionRef.current, userText);

      let fullText = '';

      for await (const chunk of streamResult) {
        const chunkText = chunk?.text || '';
        fullText += chunkText;

        setMessages((prev) =>
          prev.map((msg) => (msg.id === botMessageId ? { ...msg, text: fullText } : msg))
        );
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === botMessageId
            ? { ...msg, text: "I'm sorry, I encountered an error. Please try again.", isError: true }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
      <div
        className={`
          pointer-events-auto
          bg-gray-50
          w-[360px] sm:w-[400px] h-[550px] max-h-[80vh]
          rounded-2xl shadow-2xl flex flex-col overflow-hidden
          transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom-right
          border border-gray-200
          ${isOpen ? 'opacity-100 scale-100 translate-y-0 mb-4' : 'opacity-0 scale-90 translate-y-10 mb-0 pointer-events-none h-0'}
        `}
      >
        <div className="bg-white p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-md">
              <Sparkles size={18} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm">Gemini Assistant</h3>
              <p className="text-xs text-green-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                Online
              </p>
            </div>
          </div>
          <button
            onClick={toggleChat}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
          >
            <Minimize2 size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 bg-white border-t border-gray-100">
          <div className="relative flex items-end gap-2 bg-gray-50 rounded-xl border border-gray-200 p-2 focus-within:ring-2 focus-within:ring-indigo-100 focus-within:border-indigo-400 transition-all">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              rows={1}
              className="w-full bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none focus:outline-none py-2 px-2 max-h-32 min-h-[24px]"
              style={{ minHeight: '24px' }}
            />
            <button
              onClick={handleSubmit}
              disabled={isLoading || !inputValue.trim()}
              className={`
                p-2 rounded-lg flex-shrink-0 transition-all duration-200
                ${isLoading || !inputValue.trim() ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm active:scale-95'}
              `}
            >
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
          <div className="text-center mt-2">
            <p className="text-[10px] text-gray-400">Powered by Google Gemini</p>
          </div>
        </div>
      </div>

      <button
        onClick={toggleChat}
        className={`
          pointer-events-auto
          w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-105 active:scale-95
          ${isOpen ? 'bg-white text-gray-800 rotate-90 border border-gray-200' : 'bg-indigo-600 text-white hover:bg-indigo-700 rotate-0'}
        `}
        aria-label="Toggle Chat"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={28} />}
      </button>
    </div>
  );
};

export default ChatWidget;
