import { supabase } from '../lib/supabase'
import { authService } from './authService'

export interface FunnelStage {
    id: number
    empresa_id: string
    nome: string
    posicao: number
    cor: string
    created_at?: string
}

export const crmService = {
    async getStages() {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data, error } = await supabase
            .from('crm_etapas')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('posicao', { ascending: true })

        if (error) console.error('Error getting stages:', error)
        return (data || []) as FunnelStage[]
    },

    async addStage(stage: Omit<FunnelStage, 'id' | 'created_at' | 'empresa_id' | 'posicao'>) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        // Get max position
        const { data: maxPosData } = await supabase
            .from('crm_etapas')
            .select('posicao')
            .eq('empresa_id', empresaId)
            .order('posicao', { ascending: false })
            .limit(1)

        const nextPos = (maxPosData?.[0]?.posicao || 0) + 1

        const { data, error } = await supabase
            .from('crm_etapas')
            .insert([{
                nome: stage.nome,
                cor: stage.cor,
                empresa_id: empresaId,
                posicao: nextPos
            }])
            .select()
            .single()

        if (error) throw error
        return data as FunnelStage
    },

    async updateStage(id: number, updates: Partial<FunnelStage>) {
        const { data, error } = await supabase
            .from('crm_etapas')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as FunnelStage
    },

    async deleteStage(id: number) {
        const { error } = await supabase
            .from('crm_etapas')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    async reorderStages(stages: FunnelStage[]) {
        const updates = stages.map((stage, index) =>
            supabase.from('crm_etapas').update({ posicao: index + 1 }).eq('id', stage.id)
        )
        await Promise.all(updates)
    },

    // Opportunities
    async getOpportunities() {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data, error } = await supabase
            .from('crm_oportunidades')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('created_at', { ascending: false })

        if (error) console.error('Error getting opportunities:', error)
        return (data || []) as Opportunity[]
    },

    async createOpportunity(opp: Omit<Opportunity, 'id' | 'created_at' | 'empresa_id'>) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        const { data, error } = await supabase
            .from('crm_oportunidades')
            .insert([{ ...opp, empresa_id: empresaId }])
            .select()
            .single()

        if (error) throw error
        return data as Opportunity
    },

    async updateOpportunity(id: string, updates: Partial<Opportunity>) {
        const { data, error } = await supabase
            .from('crm_oportunidades')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as Opportunity
    },

    async deleteOpportunity(id: string) {
        const { error } = await supabase
            .from('crm_oportunidades')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    // Origins
    async getOrigins() {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data, error } = await supabase
            .from('crm_origem')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('nome')

        if (error) console.error('Error getting origins:', error)
        return (data || []) as Origin[]
    },

    async addOrigin(nome: string) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        const { data, error } = await supabase
            .from('crm_origem')
            .insert([{ nome, empresa_id: empresaId }])
            .select()
            .single()

        if (error) throw error
        return data as Origin
    },

    async deleteOrigin(id: number) {
        const { error } = await supabase
            .from('crm_origem')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    // Opportunity Products
    async getOpportunityProducts(opportunityId: string) {
        const { data, error } = await supabase
            .from('crm_oportunidade_produtos')
            .select(`
                *,
                produto:me_produto(nome_produto)
            `)
            .eq('oportunidade_id', opportunityId)

        if (error) console.error('Error getting opp products:', error)

        // Calculate total manually since it's not in DB anymore
        const formattedData = (data || []).map((item: any) => ({
            ...item,
            total: (item.quantidade || 0) * (item.preco_unitario || 0)
        }))

        return formattedData as OpportunityProduct[]
    },

    async addOpportunityProduct(item: Omit<OpportunityProduct, 'id' | 'created_at' | 'produto'>) {
        const { data, error } = await supabase
            .from('crm_oportunidade_produtos')
            .insert([{
                oportunidade_id: item.oportunidade_id,
                produto_id: item.produto_id,
                quantidade: item.quantidade,
                preco_unitario: item.preco_unitario
            }])
            .select()
            .single()

        if (error) throw error
        return data as OpportunityProduct
    },


    async saveOpportunityFull(
        opp: Partial<Opportunity>,
        products: Omit<OpportunityProduct, 'id' | 'created_at' | 'produto'>[]
    ) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        // Map products to ensure correct column names for RPC
        const formattedProducts = products.map(p => ({
            oportunidade_id: p.oportunidade_id,
            produto_id: p.produto_id,
            quantidade: p.quantidade,
            preco_unitario: p.preco_unitario
            // Removed total
        }))

        const { data, error } = await supabase.rpc('save_opportunity_full', {
            p_empresa_id: empresaId,
            p_id: opp.id || null, // NULL for new
            p_titulo: opp.titulo,
            p_valor: opp.valor,
            p_estagio: opp.estagio,
            p_lead_id: opp.lead_id || null,
            p_cliente_id: opp.cliente_id || null,
            p_data_fechamento: opp.data_fechamento || null,
            p_produtos: formattedProducts
        })

        if (error) throw error
        return data
    },

    // Activities
    async getActivities(opportunityId: string) {
        const { data, error } = await supabase
            .from('crm_atividades')
            .select('*')
            .eq('oportunidade_id', opportunityId)
            .order('criado_em', { ascending: false })

        if (error) console.error('Error getting activities:', error)
        return (data || []) as Activity[]
    },

    async addActivity(activity: Omit<Activity, 'id' | 'criado_em'>) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        const { data, error } = await supabase
            .from('crm_atividades')
            .insert([{ ...activity, empresa_id: empresaId }])
            .select()
            .single()

        if (error) throw error
        return data as Activity
    },

    async updateActivity(id: string, updates: Partial<Activity>) {
        const { data, error } = await supabase
            .from('crm_atividades')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as Activity
    },

    async deleteActivity(id: string) {
        const { error } = await supabase
            .from('crm_atividades')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    async getAllActivities() {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data, error } = await supabase
            .from('crm_atividades')
            .select(`
                *,
                oportunidade:oportunidade_id (
                    titulo,
                    estagio,
                    cliente:cliente_id ( nome_cliente ),
                    lead:lead_id ( nome )
                )
            `)
            .eq('empresa_id', empresaId)
            .order('criado_em', { ascending: false })

        if (error) {
            console.error('Error getting all activities:', error)
            return []
        }
        return data as (Activity & {
            oportunidade?: {
                titulo: string,
                estagio: string,
                cliente?: { nome_cliente: string },
                lead?: { nome: string }
            }
        })[]
    },

    // Attendances
    async getAttendances() {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data, error } = await supabase
            .from('crm_atendimentos')
            .select(`
                *,
                cliente:cliente_id ( nome )
            `)
            .eq('empresa_id', empresaId)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error getting attendances:', error)
            return []
        }
        return data as Attendance[]
    },

    async createAttendance(attendance: Omit<Attendance, 'id' | 'created_at' | 'empresa_id'>) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        const { data, error } = await supabase
            .from('crm_atendimentos')
            // @ts-ignore - empresa_id is dynamically added
            .insert([{ ...attendance, empresa_id: empresaId }])
            .select()
            .single()

        if (error) throw error
        return data as Attendance
    },

    async updateAttendance(id: string, updates: Partial<Attendance>) {
        const { data, error } = await supabase
            .from('crm_atendimentos')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as Attendance
    },

    async deleteAttendance(id: string) {
        const { error } = await supabase
            .from('crm_atendimentos')
            .delete()
            .eq('id', id)

        if (error) throw error
    }
}

export interface Opportunity {
    id: string
    empresa_id: string
    cliente_id?: string
    lead_id?: string
    titulo: string
    valor: number
    estagio: string
    data_fechamento?: string
    responsavel_id?: string
    created_at?: string
}

export interface Origin {
    id: number
    empresa_id: string
    nome: string
    created_at?: string
}

export interface OpportunityProduct {
    id: string
    oportunidade_id: string
    produto_id: string
    quantidade: number
    preco_unitario: number
    total: number // Keep for UI logic
    created_at?: string
    produto?: {
        nome_produto: string
    }
}

export interface Activity {
    id: string
    empresa_id: string
    oportunidade_id: string
    tipo: 'nota' | 'tarefa' | 'reuniao' | 'ligacao'
    descricao: string
    data_vencimento?: string
    concluido?: boolean
    criado_em: string
}

export interface Attendance {
    id: string
    empresa_id: string
    cliente_id?: string
    titulo: string
    descricao?: string
    status: string
    prioridade: string
    created_at: string
    cliente?: { nome: string }
}
