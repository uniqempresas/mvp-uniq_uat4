import { supabase } from '../lib/supabase'
import { authService } from './authService'

export interface Client {
    id: string
    empresa_id: string
    nome: string
    email?: string
    telefone?: string
    status: 'Ativo' | 'Inativo' | 'Negociação' | 'Churn' | 'Novo'
    origem?: string
    cargo?: string
    empresa_nome?: string
    foto_url?: string
    ltv?: number
    ultima_interacao?: string
    created_at?: string
}

export const clientService = {
    async getClients() {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data, error } = await supabase
            .from('crm_leads')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data as Client[]
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

    async updateClient(id: string, updates: Partial<Client>) {
        const { data, error } = await supabase
            .from('crm_leads')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as Client
    },

    async deleteClient(id: string) {
        const { error } = await supabase
            .from('crm_leads')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    // Customers (me_cliente)
    async getCustomers() {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data, error } = await supabase
            .from('me_cliente')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('nome_cliente')

        if (error) throw error
        return data as Customer[]
    }
}

export interface Customer {
    id: string
    empresa_id: string
    nome_cliente: string
    email?: string
    telefone?: string
    documento?: string
    created_at?: string
}
