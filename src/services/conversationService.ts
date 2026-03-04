import { supabase } from '../lib/supabase';
import type { Conversation, Message, ConversationFilters } from '../types/attendant';

export const conversationService = {
  // Buscar conversas da empresa
  async getConversations(
    empresaId: string,
    filters?: ConversationFilters
  ): Promise<Conversation[]> {
    let query = supabase
      .from('atd_conversas')
      .select(`
        *,
        cliente:me_cliente(id, nome_cliente)
      `)
      .eq('id_empresa', empresaId)
      .order('last_message_at', { ascending: false });

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.assignedTo) {
      query = query.eq('assigned_to', filters.assignedTo);
    }

    if (filters?.search) {
      query = query.or(
        `remote_name.ilike.%${filters.search}%,remote_phone.ilike.%${filters.search}%`
      );
    }

    const { data, error } = await query;

    if (error) {
      console.error('Erro ao buscar conversas:', error);
      throw error;
    }

    return data || [];
  },

  // Buscar uma conversa específica
  async getConversation(conversationId: string): Promise<Conversation | null> {
    const { data, error } = await supabase
      .from('atd_conversas')
      .select(`
        *,
        cliente:me_cliente(id, nome_cliente)
      `)
      .eq('id', conversationId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar conversa:', error);
      throw error;
    }

    return data;
  },

  // Buscar ou criar conversa por telefone
  async getOrCreateConversation(
    empresaId: string,
    phone: string,
    name?: string
  ): Promise<Conversation> {
    // Verificar se já existe conversa
    const { data: existing } = await supabase
      .from('atd_conversas')
      .select('*')
      .eq('id_empresa', empresaId)
      .eq('remote_phone', phone)
      .eq('status', 'open')
      .single();

    if (existing) {
      return existing;
    }

    // Criar nova conversa
    const { data, error } = await supabase
      .from('atd_conversas')
      .insert({
        id_empresa: empresaId,
        remote_phone: phone,
        remote_name: name || phone,
        status: 'open',
      })
      .select()
      .single();

    if (error) {
      console.error('Erro ao criar conversa:', error);
      throw error;
    }

    return data;
  },

  // Buscar mensagens de uma conversa
  async getMessages(conversationId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('atd_mensagens')
      .select(`
        *,
        sender:me_usuario(id, nome)
      `)
      .eq('id_conversa', conversationId)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erro ao buscar mensagens:', error);
      throw error;
    }

    return data || [];
  },

  // Buscar mensagens recentes (para polling)
  async getRecentMessages(
    conversationId: string,
    since: string
  ): Promise<Message[]> {
    const { data, error } = await supabase
      .from('atd_mensagens')
      .select(`
        *,
        sender:me_usuario(id, nome)
      `)
      .eq('id_conversa', conversationId)
      .gt('created_at', since)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Erro ao buscar mensagens recentes:', error);
      throw error;
    }

    return data || [];
  },

  // Enviar mensagem
  async sendMessage(
    conversationId: string,
    content: string,
    senderId: string,
    messageType: 'text' | 'image' | 'audio' = 'text'
  ): Promise<Message> {
    const { data, error } = await supabase
      .from('atd_mensagens')
      .insert({
        id_conversa: conversationId,
        direction: 'out',
        sender_type: 'agent',
        sender_id: senderId,
        content,
        message_type: messageType,
      })
      .select(`
        *,
        sender:me_usuario(id, nome)
      `)
      .single();

    if (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }

    return data;
  },

  // Marcar mensagens como lidas
  async markAsRead(conversationId: string): Promise<void> {
    const { error } = await supabase
      .rpc('mark_messages_as_read', {
        p_conversa_id: conversationId,
        p_user_id: null, // Será preenchido pelo contexto de auth
      });

    if (error) {
      console.error('Erro ao marcar como lida:', error);
      throw error;
    }
  },

  // Atualizar status da conversa
  async updateStatus(
    conversationId: string,
    status: Conversation['status']
  ): Promise<void> {
    const { error } = await supabase
      .from('atd_conversas')
      .update({ status })
      .eq('id', conversationId);

    if (error) {
      console.error('Erro ao atualizar status:', error);
      throw error;
    }
  },

  // Atribuir conversa a um usuário
  async assignTo(
    conversationId: string,
    userId: string | null
  ): Promise<void> {
    const { error } = await supabase
      .from('atd_conversas')
      .update({ assigned_to: userId })
      .eq('id', conversationId);

    if (error) {
      console.error('Erro ao atribuir conversa:', error);
      throw error;
    }
  },

  // Associar conversa a um cliente do CRM
  async associateClient(
    conversationId: string,
    clientId: string
  ): Promise<void> {
    const { error } = await supabase
      .from('atd_conversas')
      .update({ id_cliente: clientId })
      .eq('id', conversationId);

    if (error) {
      console.error('Erro ao associar cliente:', error);
      throw error;
    }
  },

  // Buscar conversas não lidas
  async getUnreadConversations(empresaId: string): Promise<Conversation[]> {
    const { data, error } = await supabase
      .from('atd_conversas')
      .select(`
        *,
        cliente:me_cliente(id, nome_cliente)
      `)
      .eq('id_empresa', empresaId)
      .gt('unread_count', 0)
      .order('last_message_at', { ascending: false });

    if (error) {
      console.error('Erro ao buscar conversas não lidas:', error);
      throw error;
    }

    return data || [];
  },

  // Contar total de conversas não lidas
  async getTotalUnreadCount(empresaId: string): Promise<number> {
    const { data, error } = await supabase
      .from('atd_conversas')
      .select('unread_count', { count: 'exact' })
      .eq('id_empresa', empresaId)
      .gt('unread_count', 0);

    if (error) {
      console.error('Erro ao contar não lidas:', error);
      throw error;
    }

    return data?.reduce((sum, conv) => sum + (conv.unread_count || 0), 0) || 0;
  },

  // Arquivar conversa
  async archiveConversation(conversationId: string): Promise<void> {
    await this.updateStatus(conversationId, 'archived');
  },

  // Reabrir conversa arquivada
  async reopenConversation(conversationId: string): Promise<void> {
    await this.updateStatus(conversationId, 'open');
  },

  // Buscar cliente por telefone
  async findClientByPhone(
    empresaId: string,
    phone: string
  ): Promise<{ id: string; nome_cliente: string } | null> {
    const { data, error } = await supabase
      .from('me_cliente')
      .select('id, nome_cliente')
      .eq('id_empresa', empresaId)
      .or(`telefone.ilike.%${phone}%,celular.ilike.%${phone}%`)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Erro ao buscar cliente:', error);
      return null;
    }

    return data;
  },

  // Buscar clientes para associar
  async searchClients(
    empresaId: string,
    searchTerm: string
  ): Promise<{ data: { id: string; nome_cliente: string; telefone?: string; email?: string }[] | null }> {
    let query = supabase
      .from('me_cliente')
      .select('id, nome_cliente, telefone, email')
      .eq('id_empresa', empresaId)
      .order('nome_cliente');

    if (searchTerm) {
      query = query.or(`nome_cliente.ilike.%${searchTerm}%,telefone.ilike.%${searchTerm}%`);
    }

    const { data, error } = await query.limit(20);

    if (error) {
      console.error('Erro ao buscar clientes:', error);
      throw error;
    }

    return { data };
  },
};
