import { supabase } from '../lib/supabase'

export interface ChatConversation {
    id: string
    empresa_id: string
    cliente_id?: string
    lead_id?: string
    status: 'aberto' | 'resolvido' | 'arquivado'
    modo: 'bot' | 'humano'
    titulo?: string
    criado_em: string
    updated_at: string
    cliente?: { nome_cliente: string, email: string, telefone: string }
    lead?: { nome: string, email: string, telefone: string }
    lastMessage?: ChatMessage
    unreadCount?: number
}

export interface ChatMessage {
    id: string
    conversa_id: string
    remetente_tipo: 'usuario' | 'sistema' | 'cliente'
    remetente_id?: string
    conteudo: string
    tipo_conteudo: 'texto' | 'imagem' | 'arquivo'
    lido: boolean
    criado_em: string
}

export const crmChatService = {
    async getConversations(empresaId: string): Promise<ChatConversation[]> {
        const { data, error } = await supabase
            .from('crm_chat_conversas')
            .select(`
                *,
                cliente:cliente_id ( nome_cliente, email, telefone ),
                lead:lead_id ( nome, email, telefone )
            `)
            .eq('empresa_id', empresaId)
            .order('updated_at', { ascending: false })

        if (error) throw error

        // Fetch last messages and unread counts in parallel or via RPC would be better, 
        // but for now doing simple fetches or treating client side.
        // For MVP, we will fetch last message for each conversation. 
        // Optimization: Create a VIEW or RPC for this.

        const conversations = await Promise.all(data.map(async (conv) => {
            const { data: lastMsg } = await supabase
                .from('crm_chat_mensagens')
                .select('*')
                .eq('conversa_id', conv.id)
                .order('criado_em', { ascending: false })
                .limit(1)
                .single()

            const { count: unread } = await supabase
                .from('crm_chat_mensagens')
                .select('*', { count: 'exact', head: true })
                .eq('conversa_id', conv.id)
                .eq('lido', false)
                .eq('remetente_tipo', 'cliente') // Count only client messages

            return {
                ...conv,
                lastMessage: lastMsg || null,
                unreadCount: unread || 0
            }
        }))

        return conversations as ChatConversation[]
    },

    async getMessages(conversaId: string): Promise<ChatMessage[]> {
        const { data, error } = await supabase
            .from('crm_chat_mensagens')
            .select('*')
            .eq('conversa_id', conversaId)
            .order('criado_em', { ascending: true })

        if (error) throw error
        return data as ChatMessage[]
    },

    async sendMessage(
        conversaId: string,
        conteudo: string,
        remetenteTipo: 'usuario' | 'sistema' | 'cliente',
        remetenteId?: string
    ): Promise<ChatMessage> {
        const { data, error } = await supabase
            .from('crm_chat_mensagens')
            .insert({
                conversa_id: conversaId,
                conteudo,
                remetente_tipo: remetenteTipo,
                remetente_id: remetenteId,
                lido: remetenteTipo === 'usuario' // If sent by user, it's read
            })
            .select()
            .single()

        if (error) throw error

        // Update conversation updated_at
        await supabase
            .from('crm_chat_conversas')
            .update({ updated_at: new Date().toISOString() })
            .eq('id', conversaId)

        return data as ChatMessage
    },

    async createConversation(
        empresaId: string,
        title: string,
        clienteId?: string,
        leadId?: string
    ): Promise<ChatConversation> {
        const { data, error } = await supabase
            .from('crm_chat_conversas')
            .insert({
                empresa_id: empresaId,
                titulo: title,
                cliente_id: clienteId,
                lead_id: leadId,
                modo: 'bot',
                status: 'aberto'
            })
            .select()
            .single()

        if (error) throw error
        return data as ChatConversation
    },

    async updateStatus(conversaId: string, status: 'aberto' | 'resolvido' | 'arquivado'): Promise<void> {
        const { error } = await supabase
            .from('crm_chat_conversas')
            .update({ status })
            .eq('id', conversaId)

        if (error) throw error
    },

    async toggleMode(conversaId: string, modo: 'bot' | 'humano'): Promise<void> {
        const { error } = await supabase
            .from('crm_chat_conversas')
            .update({ modo })
            .eq('id', conversaId)

        if (error) throw error
    },

    async markAsRead(conversaId: string): Promise<void> {
        await supabase
            .from('crm_chat_mensagens')
            .update({ lido: true })
            .eq('conversa_id', conversaId)
            .eq('remetente_tipo', 'cliente')
            .eq('lido', false)
    }
}
