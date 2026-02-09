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

        // Busca cargos (manual join para evitar erro de alias/coluna inexistente no Supabase)
        // Isso é mais seguro dado os erros recentes de schema
        const cargoIds = users.map((u: any) => u.cargo_id).filter((id: any) => id)
        let cargosMap: Record<number, string> = {}

        if (cargoIds.length > 0) {
            const { data: cargos } = await supabase
                .from('me_cargo')
                .select('id, nome')
                .in('id', cargoIds)

            if (cargos) {
                cargos.forEach((c: any) => {
                    cargosMap[c.id] = c.nome
                })
            }
        }

        return users.map((user: any) => ({
            ...user,
            cargo_nome: user.cargo_id ? cargosMap[user.cargo_id] : undefined
        })) as Collaborator[]
    },

    async create(colaborador: Partial<Collaborator>) {
        // No MVP, removemos o ID para o DB gerar (UUID)
        const { id, created_at, cargo_nome, ...payload } = colaborador as any

        const { data, error } = await supabase
            .from('me_usuario')
            .insert(payload)
            .select()
            .single()

        if (error) throw error
        return data
    },

    async update(id: string, updates: Partial<Collaborator>) {
        const { cargo_nome, ...payload } = updates as any

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
        // Soft delete preferencialmente
        const { error } = await supabase
            .from('me_usuario')
            .update({ ativo: false })
            .eq('id', id)

        if (error) throw error
        return true
    }
}
