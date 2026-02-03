import { supabase } from '../lib/supabase'
import { authService } from './authService'

export interface SupplierAddress {
    cep?: string
    logradouro?: string
    numero?: string
    complemento?: string
    bairro?: string
    cidade?: string
    uf?: string
}

export interface MeSupplier {
    id: string
    empresa_id: string
    nome_fantasia: string // Mapped from 'nome_fornecedor'
    razao_social?: string
    email?: string
    telefone?: string
    cpf_cnpj?: string
    ie_rg?: string
    contato_nome?: string
    endereco?: SupplierAddress
    ativo: boolean
    observacoes?: string
    created_at?: string
}

export const meSupplierService = {
    async getSuppliers() {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data, error } = await supabase
            .from('me_fornecedor')
            .select('*')
            .eq('empresa_id', empresaId)
            // Changed: nome -> nome_fornecedor
            .order('nome_fornecedor')

        if (error) throw error

        return data?.map(d => ({
            ...d,
            // Changed: nome -> nome_fornecedor
            nome_fantasia: d.nome_fornecedor,
            endereco: {
                logradouro: d.endereco,
                numero: d.numero,
                complemento: d.complemento,
                bairro: d.bairro,
                cidade: d.cidade,
                uf: d.estado,
                cep: d.cep
            }
        })) as MeSupplier[]
    },

    async getSupplierById(id: string) {
        const { data, error } = await supabase
            .from('me_fornecedor')
            .select('*')
            .eq('id', id)
            .single()

        if (error) throw error
        if (!data) return null

        return {
            ...data,
            // Changed: nome -> nome_fornecedor
            nome_fantasia: data.nome_fornecedor,
            endereco: {
                logradouro: data.endereco,
                numero: data.numero,
                complemento: data.complemento,
                bairro: data.bairro,
                cidade: data.cidade,
                uf: data.estado,
                cep: data.cep
            }
        } as MeSupplier
    },

    async createSupplier(supplier: Omit<MeSupplier, 'id' | 'created_at' | 'empresa_id' | 'ativo'>) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        const dbSupplier = {
            empresa_id: empresaId,
            // Changed: nome -> nome_fornecedor
            nome_fornecedor: supplier.nome_fantasia,
            razao_social: supplier.razao_social,
            email: supplier.email,
            telefone: supplier.telefone,
            cpf_cnpj: supplier.cpf_cnpj,
            ie_rg: supplier.ie_rg,
            contato_nome: supplier.contato_nome,
            // Address mapping
            endereco: supplier.endereco?.logradouro,
            numero: supplier.endereco?.numero,
            complemento: supplier.endereco?.complemento,
            bairro: supplier.endereco?.bairro,
            cidade: supplier.endereco?.cidade,
            estado: supplier.endereco?.uf,
            cep: supplier.endereco?.cep,
            // Meta
            observacoes: supplier.observacoes,
            ativo: true
        }

        const { data, error } = await supabase
            .from('me_fornecedor')
            .insert([dbSupplier])
            .select()
            .single()

        if (error) throw error

        return {
            ...data,
            // Changed: nome -> nome_fornecedor
            nome_fantasia: data.nome_fornecedor,
            endereco: {
                logradouro: data.endereco,
                numero: data.numero,
                complemento: data.complemento,
                bairro: data.bairro,
                cidade: data.cidade,
                uf: data.estado,
                cep: data.cep
            }
        } as MeSupplier
    },

    async updateSupplier(id: string, updates: Partial<MeSupplier>) {
        const dbUpdates: any = {}

        // Changed: nome -> nome_fornecedor
        if (updates.nome_fantasia !== undefined) dbUpdates.nome_fornecedor = updates.nome_fantasia
        if (updates.razao_social !== undefined) dbUpdates.razao_social = updates.razao_social
        if (updates.email !== undefined) dbUpdates.email = updates.email
        if (updates.telefone !== undefined) dbUpdates.telefone = updates.telefone
        if (updates.cpf_cnpj !== undefined) dbUpdates.cpf_cnpj = updates.cpf_cnpj
        if (updates.ie_rg !== undefined) dbUpdates.ie_rg = updates.ie_rg
        if (updates.contato_nome !== undefined) dbUpdates.contato_nome = updates.contato_nome
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
            .from('me_fornecedor')
            .update(dbUpdates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error

        return {
            ...data,
            // Changed: nome -> nome_fornecedor
            nome_fantasia: data.nome_fornecedor,
            endereco: {
                logradouro: data.endereco,
                numero: data.numero,
                complemento: data.complemento,
                bairro: data.bairro,
                cidade: data.cidade,
                uf: data.estado,
                cep: data.cep
            }
        } as MeSupplier
    },

    async deleteSupplier(id: string) {
        const { error } = await supabase
            .from('me_fornecedor')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}
