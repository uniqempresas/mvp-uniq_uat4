import { supabase } from '../lib/supabase'
import { authService } from './authService'

export interface Client {
    id: number
    empresa_id: string
    nome: string
    email?: string
    telefone?: string
    origem_id?: number
    status?: string
    score?: number
    observacoes?: string
    created_at?: string
    // Legacy mapping support if needed by other components, but focusing on CRM leads structure
}

export const clientService = {
    async getClients() {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data, error } = await supabase
            .from('crm_leads')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('nome')

        if (error) throw error
        return data as Client[]
    },

    async getClientById(id: number) {
        const { data, error } = await supabase
            .from('crm_leads')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        return data as Client
    },

    async createClient(client: Omit<Client, 'id' | 'created_at' | 'empresa_id'>) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        const { data, error } = await supabase
            .from('crm_leads')
            .insert([{ ...client, empresa_id: empresaId }])
            .select()
            .single()

        if (error) throw error
        return data as Client
    },

    async updateClient(id: number, updates: Partial<Client>) {
        const { data, error } = await supabase
            .from('crm_leads')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as Client
    },

    async deleteClient(id: number) {
        const { error } = await supabase
            .from('crm_leads')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}
