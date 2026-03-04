import { useEffect, useRef } from 'react';
import type { Message } from '../../../types/attendant';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  messages: Message[];
}

export function ChatWindow({ messages }: ChatWindowProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Agrupar mensagens por data
  const groupedMessages = messages.reduce((groups, message) => {
    const date = new Date(message.created_at).toLocaleDateString('pt-BR');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {} as Record<string, Message[]>);

  return (
    <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <span className="material-symbols-rounded text-6xl mb-4">chat_bubble_outline</span>
          <p>Nenhuma mensagem ainda</p>
          <p className="text-sm">Envie uma mensagem para iniciar a conversa</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedMessages).map(([date, dateMessages]) => (
            <div key={date}>
              <div className="flex items-center justify-center my-4">
                <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                  {date}
                </span>
              </div>
              <div className="space-y-3">
                {dateMessages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}
