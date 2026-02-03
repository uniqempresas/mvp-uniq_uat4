import { supabase } from '../lib/supabase'
import { authService } from './authService'

export interface ClientAddress {
    cep?: string
    logradouro?: string
    numero?: string
    complemento?: string
    bairro?: string
    cidade?: string
    uf?: string
}

export interface MeClient {
    id: string // UUID
    empresa_id: string
    nome_cliente: string
    email?: string
    telefone?: string
    cpf_cnpj?: string
    rg_ie?: string
    endereco?: ClientAddress
    ativo: boolean
    origem?: string
    foto_url?: string
    observacoes?: string
    created_at?: string
}

export const meClientService = {
    async getClients() {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data, error } = await supabase
            .from('me_cliente')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('nome_cliente')

        if (error) throw error

        return data?.map(d => ({
            ...d,
            // nome_cliente já vem do banco, não precisa mapear de 'nome'
            endereco: {
                logradouro: d.endereco,
                numero: d.numero,
                complemento: d.complemento,
                bairro: d.bairro,
                cidade: d.cidade,
                uf: d.estado,
                cep: d.cep
            }
        })) as MeClient[]
    },

    async getClientById(id: string) {
        const { data, error } = await supabase
            .from('me_cliente')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        if (!data) return null

        return {
            ...data,
            // nome_cliente já vem do banco
            endereco: {
                logradouro: data.endereco,
                numero: data.numero,
                complemento: data.complemento,
                bairro: data.bairro,
                cidade: data.cidade,
                uf: data.estado,
                cep: data.cep
            }
        } as MeClient
    },

    async createClient(client: Omit<MeClient, 'id' | 'created_at' | 'empresa_id' | 'ativo'>) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        const dbClient = {
            empresa_id: empresaId,
            nome_cliente: client.nome_cliente, // Corrigido
            email: client.email,
            telefone: client.telefone,
            cpf_cnpj: client.cpf_cnpj,
            rg_ie: client.rg_ie,
            // Address mapping
            endereco: client.endereco?.logradouro,
            numero: client.endereco?.numero,
            complemento: client.endereco?.complemento,
            bairro: client.endereco?.bairro,
            cidade: client.endereco?.cidade,
            estado: client.endereco?.uf,
            cep: client.endereco?.cep,
            // Meta
            origem: client.origem,
            foto_url: client.foto_url,
            observacoes: client.observacoes,
            ativo: true
        }

        const { data, error } = await supabase
            .from('me_cliente')
            .insert([dbClient])
            .select()
            .single()

        if (error) throw error

        return {
            ...data,
            // nome_cliente já vem do banco
            endereco: {
                logradouro: data.endereco,
                numero: data.numero,
                complemento: data.complemento,
                bairro: data.bairro,
                cidade: data.cidade,
                uf: data.estado,
                cep: data.cep
            }
        } as MeClient
    },

    async updateClient(id: string, updates: Partial<MeClient>) {
        const dbUpdates: any = {}

        if (updates.nome_cliente !== undefined) dbUpdates.nome_cliente = updates.nome_cliente // Corrigido
        if (updates.email !== undefined) dbUpdates.email = updates.email
        if (updates.telefone !== undefined) dbUpdates.telefone = updates.telefone
        if (updates.cpf_cnpj !== undefined) dbUpdates.cpf_cnpj = updates.cpf_cnpj
        if (updates.rg_ie !== undefined) dbUpdates.rg_ie = updates.rg_ie
        if (updates.origem !== undefined) dbUpdates.origem = updates.origem
        if (updates.foto_url !== undefined) dbUpdates.foto_url = updates.foto_url
        if (updates.observacoes !== undefined) dbUpdates.observacoes = updates.observacoes
        if (updates.ativo !== undefined) dbUpdates.ativo = updates.ativo

        if (updates.endereco) {
            if (updates.endereco.logradouro !== undefined) dbUpdates.endereco = updates.endereco.logradouro
            if (updates.endereco.numero !== undefined) dbUpdates.numero = updates.endereco.numero
            if (updates.endereco.complemento !== undefined) dbUpdates.complemento = updates.endereco.complemento
            if (updates.endereco.bairro !== undefined) dbUpdates.bairro = updates.endereco.bairro
            if (updates.endereco.cidade !== undefined) dbUpdates.cidade = updates.endereco.cidade
            if (updates.endereco.uf !== undefined) dbUpdates.estado = updates.endereco.uf
            if (updates.endereco.cep !== undefined) dbUpdates.cep = updates.endereco.cep
        }

        const { data, error } = await supabase
            .from('me_cliente')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return {
            ...data,
            // nome_cliente já vem do banco
            endereco: {
                logradouro: data.endereco,
                numero: data.numero,
                complemento: data.complemento,
                bairro: data.bairro,
                cidade: data.cidade,
                uf: data.estado,
                cep: data.cep
            }
        } as MeClient
    },

    async deleteClient(id: string) {
        const { error } = await supabase
            .from('me_cliente')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}
