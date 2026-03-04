import { useState, useEffect, useCallback } from 'react';
import { conversationService } from '../services/conversationService';
import type { Conversation, ConversationFilters } from '../types/attendant';

export function useConversations(empresaId: string | undefined, filters?: ConversationFilters) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadConversations = useCallback(async () => {
    if (!empresaId) return;

    try {
      setLoading(true);
      const data = await conversationService.getConversations(empresaId, filters);
      setConversations(data);
      setError(null);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [empresaId, filters]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  return { conversations, loading, error, refresh: loadConversations };
}
