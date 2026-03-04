import { supabase } from '../lib/supabase';
import type { 
  AttendantConfig, 
  AttendantConfigFormData,
  QuickReply,
  UraRule,
  BusinessHours 
} from '../types/attendant';

const DEFAULT_BUSINESS_HOURS: BusinessHours = {
  mon: { open: '09:00', close: '18:00' },
  tue: { open: '09:00', close: '18:00' },
  wed: { open: '09:00', close: '18:00' },
  thu: { open: '09:00', close: '18:00' },
  fri: { open: '09:00', close: '18:00' },
  sat: { open: '09:00', close: '12:00' },
  sun: null,
};

export const attendantService = {
  // Buscar configuração do atendente da empresa
  async getConfig(empresaId: string): Promise<AttendantConfig | null> {
    const { data, error } = await supabase
      .from('atd_config')
      .select('*')
      .eq('id_empresa', empresaId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar configuração:', error);
      throw error;
    }

    return data;
  },

  // Criar ou atualizar configuração
  async saveConfig(
    empresaId: string, 
    config: AttendantConfigFormData
  ): Promise<AttendantConfig> {
    const configData = {
      id_empresa: empresaId,
      agent_name: config.agent_name,
      agent_personality: config.agent_personality,
      mode: config.mode,
      avatar_url: config.avatar_url,
      welcome_message: config.welcome_message,
      away_message: config.away_message,
      business_hours: config.business_hours || DEFAULT_BUSINESS_HOURS,
      phone_number: config.phone_number,
      evolution_instance_id: config.evolution_instance_id,
    };

    const { data, error } = await supabase
      .from('atd_config')
      .upsert(configData, {
        onConflict: 'id_empresa',
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao salvar configuração:', error);
      throw error;
    }

    return data;
  },

  // Atualizar modo (URA ou Agente)
  async updateMode(empresaId: string, mode: 'ura' | 'agent'): Promise<void> {
    const { error } = await supabase
      .from('atd_config')
      .update({ mode })
      .eq('id_empresa', empresaId);

    if (error) {
      console.error('Erro ao atualizar modo:', error);
      throw error;
    }
  },

  // Atualizar status (active, inactive, paused)
  async updateStatus(
    empresaId: string, 
    status: 'active' | 'inactive' | 'paused'
  ): Promise<void> {
    const { error } = await supabase
      .from('atd_config')
      .update({ status })
      .eq('id_empresa', empresaId);

    if (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  },

  // Obter regras URA
  async getUraRules(empresaId: string): Promise<UraRule[]> {
    const { data, error } = await supabase
      .from('atd_config')
      .select('ura_rules')
      .eq('id_empresa', empresaId)
      .single();

    if (error) {
      console.error('Erro ao buscar regras URA:', error);
      throw error;
    }

    return data?.ura_rules || [];
  },

  // Salvar regras URA
  async saveUraRules(empresaId: string, rules: UraRule[]): Promise<void> {
    const { error } = await supabase
      .from('atd_config')
      .update({ ura_rules: rules })
      .eq('id_empresa', empresaId);

    if (error) {
      console.error('Erro ao salvar regras URA:', error);
      throw error;
    }
  },

  // Adicionar regra URA
  async addUraRule(
    empresaId: string, 
    rule: Omit<UraRule, 'id'>
  ): Promise<UraRule> {
    const currentRules = await this.getUraRules(empresaId);
    const newRule: UraRule = {
      ...rule,
      id: crypto.randomUUID(),
    };
    
    await this.saveUraRules(empresaId, [...currentRules, newRule]);
    return newRule;
  },

  // Remover regra URA
  async removeUraRule(empresaId: string, ruleId: string): Promise<void> {
    const currentRules = await this.getUraRules(empresaId);
    const updatedRules = currentRules.filter(rule => rule.id !== ruleId);
    await this.saveUraRules(empresaId, updatedRules);
  },

  // Respostas rápidas
  async getQuickReplies(empresaId: string): Promise<QuickReply[]> {
    const { data, error } = await supabase
      .from('atd_respostas_rapidas')
      .select('*')
      .eq('id_empresa', empresaId)
      .order('shortcut');

    if (error) {
      console.error('Erro ao buscar respostas rápidas:', error);
      throw error;
    }

    return data || [];
  },

  async createQuickReply(
    empresaId: string, 
    shortcut: string, 
    content: string,
    category?: string
  ): Promise<QuickReply> {
    const { data, error } = await supabase
      .from('atd_respostas_rapidas')
      .insert({
        id_empresa: empresaId,
        shortcut,
        content,
        category,
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar resposta rápida:', error);
      throw error;
    }

    return data;
  },

  async updateQuickReply(
    replyId: string, 
    updates: Partial<Omit<QuickReply, 'id' | 'id_empresa'>>
  ): Promise<QuickReply> {
    const { data, error } = await supabase
      .from('atd_respostas_rapidas')
      .update(updates)
      .eq('id', replyId)
      .select()
      .single();

    if (error) {
      console.error('Erro ao atualizar resposta rápida:', error);
      throw error;
    }

    return data;
  },

  async deleteQuickReply(replyId: string): Promise<void> {
    const { error } = await supabase
      .from('atd_respostas_rapidas')
      .delete()
      .eq('id', replyId);

    if (error) {
      console.error('Erro ao deletar resposta rápida:', error);
      throw error;
    }
  },

  // Verificar se está em horário comercial
  isBusinessHours(businessHours: BusinessHours): boolean {
    const now = new Date();
    const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
    const currentDay = dayNames[now.getDay()];
    const dayConfig = businessHours[currentDay];

    if (!dayConfig) return false;

    const currentTime = now.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });

    return currentTime >= dayConfig.open && currentTime <= dayConfig.close;
  },

  // Processar mensagem com regras URA
  processUraMessage(
    message: string, 
    rules: UraRule[],
    isBusinessHours: boolean,
    awayMessage: string
  ): string | null {
    // Se fora de horário comercial, retornar mensagem automática
    if (!isBusinessHours) {
      return awayMessage;
    }

    // Verificar keywords
    const lowerMessage = message.toLowerCase();
    for (const rule of rules) {
      if (rule.active && lowerMessage.includes(rule.keyword.toLowerCase())) {
        return rule.response;
      }
    }

    return null;
  },
};
