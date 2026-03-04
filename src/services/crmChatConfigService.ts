import { supabase } from '../lib/supabase'
import { authService } from './authService'
import type { CRMChatConfig, QuickReply } from '../types/crm-chat'

export const crmChatConfigService = {
  // Chat Config
  async getConfig(): Promise<CRMChatConfig | null> {
    const empresaId = await authService.getEmpresaId()
    if (!empresaId) return null

    const { data, error } = await supabase
      .from('crm_chat_config')
      .select('*')
      .eq('empresa_id', empresaId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // No config found, create default
        return this.createDefaultConfig(empresaId)
      }
      console.error('Error getting chat config:', error)
      return null
    }

    return data as CRMChatConfig
  },

  async createDefaultConfig(empresaId: string): Promise<CRMChatConfig> {
    const { data, error } = await supabase
      .from('crm_chat_config')
      .insert([{
        empresa_id: empresaId,
        agente_nome: 'Assistente Virtual',
        mensagem_boas_vindas: 'Olá! Como posso ajudar?',
        mensagem_ausencia: 'Nosso horário de atendimento é de segunda a sexta, das 8h às 18h. Retornaremos em breve!',
        horario_funcionamento: {
          dias: ['seg', 'ter', 'qua', 'qui', 'sex'],
          inicio: '08:00',
          fim: '18:00'
        },
        tempo_resposta_minutos: 5,
        agente_ativo: true,
        ura_ativa: false,
        ura_config: {
          boas_vindas: 'Bem-vindo! Escolha uma opção:',
          opcoes: [
            { id: '1', label: 'Suporte Técnico', acao: 'transferir', destino: 'suporte' },
            { id: '2', label: 'Comercial', acao: 'transferir', destino: 'comercial' },
            { id: '3', label: 'Falar com Atendente', acao: 'transferir', destino: 'humano' }
          ],
          tempo_espera: 30
        }
      }])
      .select()
      .single()

    if (error) throw error
    return data as CRMChatConfig
  },

  async updateConfig(config: Partial<CRMChatConfig>): Promise<CRMChatConfig> {
    const empresaId = await authService.getEmpresaId()
    if (!empresaId) throw new Error('Empresa não identificada')

    const { data, error } = await supabase
      .from('crm_chat_config')
      .update(config)
      .eq('empresa_id', empresaId)
      .select()
      .single()

    if (error) throw error
    return data as CRMChatConfig
  },

  async updateAvatar(avatarUrl: string): Promise<void> {
    await this.updateConfig({ agente_avatar_url: avatarUrl })
  },

  // Quick Replies
  async getQuickReplies(): Promise<QuickReply[]> {
    const empresaId = await authService.getEmpresaId()
    if (!empresaId) return []

    const { data, error } = await supabase
      .from('crm_chat_respostas_rapidas')
      .select('*')
      .eq('empresa_id', empresaId)
      .eq('ativo', true)
      .order('ordem', { ascending: true })

    if (error) {
      console.error('Error getting quick replies:', error)
      return []
    }

    return (data || []) as QuickReply[]
  },

  async createQuickReply(reply: Omit<QuickReply, 'id' | 'created_at' | 'updated_at' | 'empresa_id'>): Promise<QuickReply> {
    const empresaId = await authService.getEmpresaId()
    if (!empresaId) throw new Error('Empresa não identificada')

    const { data: maxOrderData } = await supabase
      .from('crm_chat_respostas_rapidas')
      .select('ordem')
      .eq('empresa_id', empresaId)
      .order('ordem', { ascending: false })
      .limit(1)

    const nextOrder = (maxOrderData?.[0]?.ordem || 0) + 1

    const { data, error } = await supabase
      .from('crm_chat_respostas_rapidas')
      .insert([{
        ...reply,
        empresa_id: empresaId,
        ordem: nextOrder
      }])
      .select()
      .single()

    if (error) throw error
    return data as QuickReply
  },

  async updateQuickReply(id: string, updates: Partial<QuickReply>): Promise<QuickReply> {
    const { data, error } = await supabase
      .from('crm_chat_respostas_rapidas')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data as QuickReply
  },

  async deleteQuickReply(id: string): Promise<void> {
    const { error } = await supabase
      .from('crm_chat_respostas_rapidas')
      .delete()
      .eq('id', id)

    if (error) throw error
  },

  async reorderQuickReplies(replies: QuickReply[]): Promise<void> {
    const updates = replies.map((reply, index) =>
      supabase
        .from('crm_chat_respostas_rapidas')
        .update({ ordem: index })
        .eq('id', reply.id)
    )
    await Promise.all(updates)
  }
}
