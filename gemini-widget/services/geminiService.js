import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const createChatSession = () => {
  return ai.chats.create({
    model: 'gemini-2.5-flash-lite',
    config: {
      systemInstruction:
        'You are the MUSIFYBEATS AI Assistant. Your primary goal is to recommend music based on the user\'s mood (e.g., Happy, Sad, Relaxed, Party) or specific occasions and festivals (e.g., Christmas, Holi, Halloween). Provide concise suggestions for songs, artists, or genres that match the user\'s request within the MUSIFYBEATS ecosystem. Be friendly, helpful, and music-focused.',
    },
  });
};

export const sendMessageStream = async (chat, message) => {
  return await chat.sendMessageStream({ message });
};
