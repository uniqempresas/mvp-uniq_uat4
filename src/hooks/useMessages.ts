import { useState, useEffect, useCallback } from 'react';
import { conversationService } from '../services/conversationService';
import type { Message } from '../types/attendant';

export function useMessages(conversationId: string | undefined) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadMessages = useCallback(async () => {
    if (!conversationId) return;

    try {
      setLoading(true);
      const data = await conversationService.getMessages(conversationId);
      setMessages(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const sendMessage = useCallback(async (content: string, senderId: string) => {
    if (!conversationId) return;

    try {
      const message = await conversationService.sendMessage(conversationId, content, senderId);
      setMessages((prev) => [...prev, message]);
      return message;
    } catch (err) {
      throw err;
    }
  }, [conversationId]);

  return { messages, loading, error, refresh: loadMessages, sendMessage };
}
