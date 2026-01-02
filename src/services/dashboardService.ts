import { supabase } from '../lib/supabase'

export interface DashboardKPIs {
    totalSales: number
    totalSalesCount: number
    averageTicket: number
    financialBalance: number
    criticalStockCount: number
}

export interface RecentSale {
    id: string
    npedido: number
    cliente_nome: string
    valor_total: number
    status_venda: string
    criado_em: string
}

export interface FinancialEvolution {
    date: string
    value: number
}

export const dashboardService = {
    async getKPIs(empresaId: string, startDate: Date, endDate: Date): Promise<DashboardKPIs> {
        const startIso = startDate.toISOString()
        const endIso = endDate.toISOString()

        // 1. Sales Data
        const { data: salesData, error: salesError } = await supabase
            .from('me_venda')
            .select('valor_total')
            .eq('empresa_id', empresaId)
            .gte('criado_em', startIso)
            .lte('criado_em', endIso)
            .neq('status_venda', 'cancelada') // Exclude cancelled

        if (salesError) throw salesError

        const totalSales = salesData?.reduce((sum, sale) => sum + (Number(sale.valor_total) || 0), 0) || 0
        const totalSalesCount = salesData?.length || 0
        const averageTicket = totalSalesCount > 0 ? totalSales / totalSalesCount : 0

        // 2. Financial Balance (Revenue - Expenses)
        // Adjust based on your financial model. Assuming cx_movimentacao_caixa has 'tipo' = 'receita' | 'despesa'
        const { data: financialData, error: finError } = await supabase
            .from('cx_movimentacao_caixa')
            .select('valor, tipo')
            .eq('empresa_id', empresaId)
            .gte('data_competencia', startIso.split('T')[0]) // comparison often by date
            .lte('data_competencia', endIso.split('T')[0])

        if (finError) {
            console.log("Error fetching finance", finError)
            // Not throwing to allow partial dashboard load
        }

        const financialBalance = financialData?.reduce((acc, mov) => {
            const val = Number(mov.valor) || 0
            return mov.tipo === 'receita' ? acc + val : acc - val
        }, 0) || 0

        // 3. Critical Stock
        // Assuming threshold 5 for now as we didn't find stock_min column
        const { count: criticalStockCount, error: stockError } = await supabase
            .from('me_produto')
            .select('*', { count: 'exact', head: true })
            .eq('empresa_id', empresaId)
            .lte('estoque_atual', 5)
            .eq('ativo', true)

        if (stockError) console.log("Error fetching stock", stockError)

        return {
            totalSales,
            totalSalesCount,
            averageTicket,
            financialBalance,
            criticalStockCount: criticalStockCount || 0
        }
    },

    async getRecentSales(empresaId: string, limit = 5): Promise<RecentSale[]> {
        const { data, error } = await supabase
            .from('me_venda')
            .select(`
                id,
                npedido,
                valor_total,
                status_venda,
                criado_em
            `)
            .eq('empresa_id', empresaId)
            .order('criado_em', { ascending: false })
            .limit(limit)

        if (error) throw error

        return data.map((sale: any) => ({
            id: sale.id,
            npedido: sale.npedido,
            cliente_nome: sale.cliente?.nome || 'Consumidor Final',
            valor_total: Number(sale.valor_total),
            status_venda: sale.status_venda,
            criado_em: sale.criado_em
        }))
    },

    // Placeholder for chart data - complex aggregation often better done via RPC or client-side if data small
    async getDailySales(empresaId: string, startDate: Date, endDate: Date): Promise<FinancialEvolution[]> {
        // Simplified: Fetch sales and aggregate client side
        const { data, error } = await supabase
            .from('me_venda')
            .select('criado_em, valor_total')
            .eq('empresa_id', empresaId)
            .gte('criado_em', startDate.toISOString())
            .lte('criado_em', endDate.toISOString())
            .neq('status_venda', 'cancelada')
            .order('criado_em')

        if (error) throw error

        // Group by date
        const grouped: Record<string, number> = {}
        data?.forEach(sale => {
            const date = sale.criado_em.split('T')[0]
            grouped[date] = (grouped[date] || 0) + Number(sale.valor_total)
        })

        return Object.entries(grouped).map(([date, value]) => ({ date, value }))
    }
}
