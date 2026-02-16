import { supabase } from '../lib/supabase'

export interface Collaborator {
    id: string
    empresa_id: string
    nome_usuario: string
    email: string
    telefone: string
    cargo_id: number | null
    cargo_nome?: string // Join
    role: 'dono' | 'admin' | 'colaborador' | 'vendedor'
    ativo: boolean
    aceita_agendamento: boolean
    avatar_url?: string
    created_at: string
}

export const meCollaboratorService = {

    async list(empresaId: string) {
        // Busca usuários
        const { data: users, error: userError } = await supabase
            .from('me_usuario')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('nome_usuario', { ascending: true })

        if (userError) throw userError

        // Busca cargos
        const cargoIds = users.filter((u: any) => u.cargo).map((u: any) => u.cargo)
        let cargosMap: Record<number, string> = {}

        if (cargoIds.length > 0) {
            const { data: cargos } = await supabase
                .from('me_cargo')
                .select('id, nome_cargo')
                .in('id', cargoIds)

            if (cargos) {
                cargos.forEach((c: any) => {
                    cargosMap[c.id] = c.nome_cargo
                })
            }
        }

        return users.map((user: any) => ({
            ...user,
            cargo_id: user.cargo, // Map back to frontend expectation
            cargo_nome: user.cargo ? cargosMap[user.cargo] : undefined,
            // ativo agora vem do banco
        })) as Collaborator[]
    },

    async create(colaborador: Partial<Collaborator>) {
        // Mapear cargo_id -> cargo
        const { id, created_at, cargo_nome, cargo_id, ativo, ...rest } = colaborador as any

        const payload = {
            ...rest,
            cargo: cargo_id,
            ativo: ativo !== undefined ? ativo : true // Usa valor do form ou default true
        }

        const { data, error } = await supabase
            .from('me_usuario')
            .insert(payload)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async update(id: string, updates: Partial<Collaborator>) {
        // Mapear cargo_id -> cargo
        const { cargo_nome, cargo_id, ...rest } = updates as any

        const payload: any = { ...rest }
        if (cargo_id !== undefined) payload.cargo = cargo_id

        const { data, error } = await supabase
            .from('me_usuario')
            .update(payload)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async delete(id: string) {
        // Soft delete agora que temos a coluna ativo
        const { error } = await supabase
            .from('me_usuario')
            .update({ ativo: false })
            .eq('id', id)

        if (error) throw error
        return true
    },

    async toggleStatus(id: string, ativo: boolean) {
        const { error } = await supabase
            .from('me_usuario')
            .update({ ativo })
            .eq('id', id)

        if (error) throw error
        return true
    }
}
