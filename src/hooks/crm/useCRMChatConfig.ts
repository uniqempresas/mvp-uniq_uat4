import { useState, useEffect, useCallback } from 'react'
import { crmChatConfigService } from '../../services/crmChatConfigService'
import type { CRMChatConfig } from '../../types/crm-chat'

export function useCRMChatConfig() {
  const [config, setConfig] = useState<CRMChatConfig | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConfig = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await crmChatConfigService.getConfig()
      setConfig(data)
    } catch (err) {
      setError('Erro ao carregar configurações')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConfig()
  }, [fetchConfig])

  const updateConfig = useCallback(async (updates: Partial<CRMChatConfig>) => {
    try {
      const updated = await crmChatConfigService.updateConfig(updates)
      setConfig(updated)
      return updated
    } catch (err) {
      setError('Erro ao atualizar configurações')
      console.error(err)
      throw err
    }
  }, [])

  return {
    config,
    isLoading,
    error,
    refetch: fetchConfig,
    updateConfig
  }
}
