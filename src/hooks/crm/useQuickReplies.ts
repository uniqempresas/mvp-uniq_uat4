import { useState, useEffect, useCallback } from 'react'
import { crmChatConfigService } from '../../services/crmChatConfigService'
import type { QuickReply } from '../../types/crm-chat'

export function useQuickReplies() {
  const [replies, setReplies] = useState<QuickReply[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReplies = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await crmChatConfigService.getQuickReplies()
      setReplies(data)
    } catch (err) {
      setError('Erro ao carregar respostas rápidas')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReplies()
  }, [fetchReplies])

  const createReply = useCallback(async (reply: Omit<QuickReply, 'id' | 'created_at' | 'updated_at' | 'empresa_id'>) => {
    try {
      const newReply = await crmChatConfigService.createQuickReply(reply)
      setReplies(prev => [...prev, newReply])
      return newReply
    } catch (err) {
      setError('Erro ao criar resposta')
      console.error(err)
      throw err
    }
  }, [])

  const updateReply = useCallback(async (id: string, updates: Partial<QuickReply>) => {
    try {
      const updated = await crmChatConfigService.updateQuickReply(id, updates)
      setReplies(prev => prev.map(r => r.id === id ? updated : r))
      return updated
    } catch (err) {
      setError('Erro ao atualizar resposta')
      console.error(err)
      throw err
    }
  }, [])

  const deleteReply = useCallback(async (id: string) => {
    try {
      await crmChatConfigService.deleteQuickReply(id)
      setReplies(prev => prev.filter(r => r.id !== id))
    } catch (err) {
      setError('Erro ao excluir resposta')
      console.error(err)
      throw err
    }
  }, [])

  const reorderReplies = useCallback(async (newOrder: QuickReply[]) => {
    try {
      await crmChatConfigService.reorderQuickReplies(newOrder)
      setReplies(newOrder)
    } catch (err) {
      setError('Erro ao reordenar respostas')
      console.error(err)
      throw err
    }
  }, [])

  return {
    replies,
    isLoading,
    error,
    refetch: fetchReplies,
    createReply,
    updateReply,
    deleteReply,
    reorderReplies
  }
}
