import { supabase } from '../lib/supabase'
import { authService } from './authService'

export interface CRMKPIs {
    totalOpportunities: number
    totalValue: number
    wonValue: number
    conversionRate: number
}

export interface FunnelData {
    stageId: number
    stageName: string
    count: number
    value: number
    color: string
}

export interface RecentActivity {
    id: string
    type: 'nota' | 'tarefa' | 'reuniao' | 'ligacao'
    description: string
    date: string
    opportunityTitle?: string
}

export interface RecentOpportunity {
    id: string
    title: string
    value: number
    stage: string
    createdAt: string
    clientName?: string
}

export const crmDashboardService = {
    async getKPIs(): Promise<CRMKPIs> {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return { totalOpportunities: 0, totalValue: 0, wonValue: 0, conversionRate: 0 }

        // Fetch all opportunities
        const { data: opps, error } = await supabase
            .from('crm_oportunidades')
            .select('valor, estagio')
            .eq('empresa_id', empresaId)

        if (error) {
            console.error('Error fetching KPI data:', error)
            return { totalOpportunities: 0, totalValue: 0, wonValue: 0, conversionRate: 0 }
        }

        const totalOpportunities = opps.length
        const totalValue = opps.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0)
        
        const wonOpps = opps.filter(o => o.estagio === 'ganho' || o.estagio === 'Ganho' || o.estagio === 'fechado' || o.estagio === 'won') // Adjust based on actual stage names in DB (often 'ganho')
        const wonValue = wonOpps.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0)
        
        const conversionRate = totalOpportunities > 0 ? (wonOpps.length / totalOpportunities) * 100 : 0

        return {
            totalOpportunities,
            totalValue,
            wonValue,
            conversionRate
        }
    },

    async getFunnelData(): Promise<FunnelData[]> {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        // Get stages
        const { data: stages, error: stagesError } = await supabase
            .from('crm_etapas')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('posicao', { ascending: true })

        if (stagesError || !stages) return []

        // Get opportunities
        const { data: opps, error: oppsError } = await supabase
            .from('crm_oportunidades')
            .select('id, estagio, valor')
            .eq('empresa_id', empresaId)

        if (oppsError || !opps) return []

        // Aggregate
        const funnel = stages.map(stage => {
            const stageOpps = opps.filter(o => o.estagio === stage.nome)
            return {
                stageId: stage.id,
                stageName: stage.nome,
                count: stageOpps.length,
                value: stageOpps.reduce((acc, curr) => acc + (Number(curr.valor) || 0), 0),
                color: stage.cor
            }
        })

        return funnel
    },

    async getRecentActivities(limit = 5): Promise<RecentActivity[]> {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data, error } = await supabase
            .from('crm_atividades')
            .select(`
                id,
                tipo,
                descricao,
                criado_em,
                oportunidade:oportunidade_id ( titulo )
            `)
            .eq('empresa_id', empresaId)
            .order('criado_em', { ascending: false })
            .limit(limit)

        if (error) {
            console.error('Error fetching recent activities:', error)
            return []
        }

        return data.map((item: any) => ({
            id: item.id,
            type: item.tipo,
            description: item.descricao,
            date: item.criado_em,
            opportunityTitle: item.oportunidade?.titulo
        }))
    },

    async getRecentOpportunities(limit = 5): Promise<RecentOpportunity[]> {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data, error } = await supabase
            .from('crm_oportunidades')
            .select(`
                id,
                titulo,
                valor,
                estagio,
                created_at,
                cliente:cliente_id ( nome_cliente )
            `)
            .eq('empresa_id', empresaId)
            .order('created_at', { ascending: false })
            .limit(limit)

        if (error) {
            console.error('Error fetching recent opportunities:', error)
            return []
        }

        return data.map((item: any) => ({
            id: item.id,
            title: item.titulo,
            value: Number(item.valor) || 0,
            stage: item.estagio,
            createdAt: item.created_at,
            clientName: item.cliente?.nome_cliente
        }))
    }
}
