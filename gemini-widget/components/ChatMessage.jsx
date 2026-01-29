import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, User } from 'lucide-react';
import { Role } from '../types.js';

const ChatMessage = ({ message }) => {
  const isUser = message.role === Role.USER;

  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start gap-2.5`}>
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm 
          ${isUser ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-200 text-indigo-600'}`}
        >
          {isUser ? <User size={16} /> : <Bot size={16} />}
        </div>

        <div
          className={`flex flex-col p-3 rounded-2xl text-sm shadow-sm
          ${isUser ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-800 rounded-tl-none'} ${message.isError ? 'bg-red-50 border-red-200 text-red-600' : ''}`}
        >
          <div className={`prose prose-sm max-w-none ${isUser ? 'prose-invert' : ''} break-words leading-relaxed`}>
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
          <span className={`text-[10px] mt-1 opacity-70 ${isUser ? 'text-indigo-100' : 'text-gray-400'}`}>
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
