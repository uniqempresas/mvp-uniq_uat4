import { supabase } from '../lib/supabase'
import { authService } from './authService'

export interface Category {
    id: number
    empresa_id: string
    nome: string
    tipo: 'receita' | 'despesa'
}

export interface Account {
    id: string
    empresa_id: string
    nome: string
    tipo: 'caixa' | 'banco' | 'cartao' | 'investimento'
    saldo_inicial: number
    status: 'ativo' | 'inativo'
}

export interface Transaction {
    id: string
    empresa_id: string
    descricao: string
    valor: number
    tipo: 'receita' | 'despesa'
    status: 'pendente' | 'pago' | 'atrasado' | 'cancelado'
    data_vencimento: string
    data_pagamento?: string | null
    categoria_id?: number | null
    categoria?: Category
    conta_id?: string | null
    conta?: Account
    cliente_id?: string | null
    fornecedor_id?: string | null
    observacao?: string | null
    created_at?: string
}

export interface FinanceStats {
    vencendo_hoje: { total: number, count: number }
    total_mes: { total: number, percentual: number } // Percentual vs month before (mocked for now or real)
    pago_mes: { total: number }
}

export const financeService = {
    async getCategories(tipo?: 'receita' | 'despesa') {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        let query = supabase
            .from('fn_categoria')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('nome')

        if (tipo) {
            query = query.eq('tipo', tipo)
        }

        const { data, error } = await query
        if (error) throw error
        return data as Category[]
    },

    async getAccounts() {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data, error } = await supabase
            .from('fn_conta')
            .select('*')
            .eq('empresa_id', empresaId)
            .eq('status', 'ativo')
            .order('nome')

        if (error) throw error
        return data as Account[]
    },

    async getTransactions(filters: {
        tipo?: 'receita' | 'despesa'
        status?: string
        month?: Date
        search?: string
    }) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        // Buscar transações manuais do módulo financeiro
        let query = supabase
            .from('fn_movimento')
            .select(`
                *,
                categoria:fn_categoria(*)
            `)
            .eq('empresa_id', empresaId)
            .order('data_vencimento', { ascending: true })

        if (filters.tipo) {
            query = query.eq('tipo', filters.tipo)
        }
        if (filters.status && filters.status !== 'todos') {
            query = query.eq('status', filters.status)
        }
        if (filters.month) {
            const startStr = new Date(filters.month.getFullYear(), filters.month.getMonth(), 1).toISOString()
            const endStr = new Date(filters.month.getFullYear(), filters.month.getMonth() + 1, 0).toISOString()
            query = query.gte('data_vencimento', startStr).lte('data_vencimento', endStr)
        }
        if (filters.search) {
            query = query.ilike('descricao', `%${filters.search}%`)
        }

        const { data: manualTransactions, error: manualError } = await query
        if (manualError) throw manualError

        // Se estiver buscando receitas, também buscar contas a receber do PDV
        let salesReceivables: Transaction[] = []
        if (filters.tipo === 'receita' || !filters.tipo) {
            let salesQuery = supabase
                .from('me_contas_receber')
                .select('*')
                .eq('empresa_id', empresaId)
                .order('data_vencimento', { ascending: true })

            if (filters.status && filters.status !== 'todos') {
                salesQuery = salesQuery.eq('status', filters.status)
            }
            // Buscar todas as contas a receber, independente do mês
            // (para mostrar contas futuras geradas pelo PDV)
            if (filters.search) {
                salesQuery = salesQuery.ilike('descricao', `%${filters.search}%`)
            }

            const { data: salesData, error: salesError } = await salesQuery
            if (!salesError && salesData) {
                salesReceivables = salesData.map(item => ({
                    id: item.id,
                    empresa_id: item.empresa_id,
                    descricao: item.descricao || 'Conta a receber',
                    valor: Number(item.valor),
                    tipo: 'receita' as const,
                    status: item.status || 'pendente',
                    data_vencimento: item.data_vencimento,
                    data_pagamento: item.data_pagamento,
                    cliente_id: item.cliente_id,
                    categoria: undefined,
                    created_at: item.created_at
                }))
            }
        }

        // Combinar transações manuais e do PDV
        const allTransactions = [...(manualTransactions || []), ...salesReceivables]
        
        // Ordenar por data de vencimento
        return allTransactions.sort((a, b) => 
            new Date(a.data_vencimento).getTime() - new Date(b.data_vencimento).getTime()
        ) as Transaction[]
    },

    async getDashboardStats(tipo: 'receita' | 'despesa'): Promise<FinanceStats> {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return { vencendo_hoje: { total: 0, count: 0 }, total_mes: { total: 0, percentual: 0 }, pago_mes: { total: 0 } }

        const today = new Date().toISOString().split('T')[0]
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()

        // 1. Vencendo Hoje (Pendente) - fn_movimento
        const { data: todayData } = await supabase
            .from('fn_movimento')
            .select('valor')
            .eq('empresa_id', empresaId)
            .eq('tipo', tipo)
            .eq('data_vencimento', today)
            .eq('status', 'pendente')

        let todayTotal = todayData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0
        let todayCount = todayData?.length || 0

        // 2. Total Mês (Vencimento no mês) - fn_movimento
        const { data: monthData } = await supabase
            .from('fn_movimento')
            .select('valor')
            .eq('empresa_id', empresaId)
            .eq('tipo', tipo)
            .gte('data_vencimento', startOfMonth)
            .lte('data_vencimento', endOfMonth)

        let monthTotal = monthData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0

        // 3. Pago Mês - fn_movimento
        const { data: paidData } = await supabase
            .from('fn_movimento')
            .select('valor')
            .eq('empresa_id', empresaId)
            .eq('tipo', tipo)
            .eq('status', 'pago')
            .gte('data_pagamento', startOfMonth)
            .lte('data_pagamento', endOfMonth)

        let paidTotal = paidData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0

        // 4. Se for receita, também buscar em me_contas_receber (vendas do PDV)
        if (tipo === 'receita') {
            const todayStr = today

            // Vencendo hoje - me_contas_receber
            const { data: salesTodayData } = await supabase
                .from('me_contas_receber')
                .select('valor')
                .eq('empresa_id', empresaId)
                .eq('data_vencimento', todayStr)
                .eq('status', 'pendente')

            todayTotal += salesTodayData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0
            todayCount += salesTodayData?.length || 0

            // Total a Receber (todas as contas pendentes, independente do mês)
            const { data: salesPendingData } = await supabase
                .from('me_contas_receber')
                .select('valor')
                .eq('empresa_id', empresaId)
                .eq('status', 'pendente')

            monthTotal += salesPendingData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0

            // Pago - me_contas_receber (todos os pagos, não só do mês)
            const { data: salesPaidData } = await supabase
                .from('me_contas_receber')
                .select('valor')
                .eq('empresa_id', empresaId)
                .eq('status', 'pago')

            paidTotal += salesPaidData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0
        }

        return {
            vencendo_hoje: { total: todayTotal, count: todayCount },
            total_mes: { total: monthTotal, percentual: 0 },
            pago_mes: { total: paidTotal }
        }
    },

    async createTransaction(transaction: Partial<Transaction>) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        const { data, error } = await supabase
            .from('fn_movimento')
            .insert([{ ...transaction, empresa_id: empresaId }])
            .select()
            .single()

        if (error) throw error
        return data as Transaction
    },

    async updateTransaction(id: string, updates: Partial<Transaction>) {
        // Tentar atualizar em fn_movimento primeiro (transações manuais)
        const { data: manualData, error: manualError } = await supabase
            .from('fn_movimento')
            .update(updates)
            .eq('id', id)
            .select()

        if (!manualError && manualData && manualData.length > 0) {
            return manualData[0] as Transaction
        }

        // Se não encontrou em fn_movimento, tentar em me_contas_receber (vendas PDV)
        const { data: salesData, error: salesError } = await supabase
            .from('me_contas_receber')
            .update(updates)
            .eq('id', id)
            .select()

        if (salesError) throw salesError
        if (!salesData || salesData.length === 0) {
            throw new Error('Transação não encontrada')
        }

        // Mapear dados da tabela me_contas_receber para o formato Transaction
        return {
            id: salesData[0].id,
            empresa_id: salesData[0].empresa_id,
            descricao: salesData[0].descricao || 'Conta a receber',
            valor: Number(salesData[0].valor),
            tipo: 'receita' as const,
            status: salesData[0].status || 'pendente',
            data_vencimento: salesData[0].data_vencimento,
            data_pagamento: salesData[0].data_pagamento,
            cliente_id: salesData[0].cliente_id,
            categoria: undefined,
            created_at: salesData[0].created_at
        } as Transaction
    },

    async deleteTransaction(id: string) {
        // Tentar deletar de fn_movimento primeiro
        const { error: manualError } = await supabase
            .from('fn_movimento')
            .delete()
            .eq('id', id)

        if (!manualError) return

        // Se falhou, tentar deletar de me_contas_receber
        const { error: salesError } = await supabase
            .from('me_contas_receber')
            .delete()
            .eq('id', id)

        if (salesError) throw salesError
    },

    async getMonthlyEvolution(months: number = 6) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const result = []
        const now = new Date()

        for (let i = months - 1; i >= 0; i--) {
            const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1).toISOString()
            const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).toISOString()
            const startOfMonthStr = startOfMonth.split('T')[0]
            const endOfMonthStr = endOfMonth.split('T')[0]

            // Receita - fn_movimento
            const { data: receitaData } = await supabase
                .from('fn_movimento')
                .select('valor')
                .eq('empresa_id', empresaId)
                .eq('tipo', 'receita')
                .gte('data_vencimento', startOfMonth)
                .lte('data_vencimento', endOfMonth)

            // Receita - me_contas_receber (vendas PDV)
            const { data: salesReceitaData } = await supabase
                .from('me_contas_receber')
                .select('valor')
                .eq('empresa_id', empresaId)
                .gte('data_vencimento', startOfMonthStr)
                .lte('data_vencimento', endOfMonthStr)

            // Despesa
            const { data: despesaData } = await supabase
                .from('fn_movimento')
                .select('valor')
                .eq('empresa_id', empresaId)
                .eq('tipo', 'despesa')
                .gte('data_vencimento', startOfMonth)
                .lte('data_vencimento', endOfMonth)

            const receitaManual = receitaData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0
            const receitaSales = salesReceitaData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0
            const receita = receitaManual + receitaSales
            const despesa = despesaData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0

            result.push({
                month: targetDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
                receita,
                despesa
            })
        }

        return result
    },

    // Novo método: Vendas realizadas por mês (por data de criação da venda)
    async getMonthlySales(months: number = 6) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const result = []
        const now = new Date()

        for (let i = months - 1; i >= 0; i--) {
            const targetDate = new Date(now.getFullYear(), now.getMonth() - i, 1)
            const startOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth(), 1).toISOString()
            const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0).toISOString()

            // Vendas de produtos - me_venda (por data de criação)
            const { data: productSalesData } = await supabase
                .from('me_venda')
                .select('valor_total')
                .eq('empresa_id', empresaId)
                .gte('criado_em', startOfMonth)
                .lte('criado_em', endOfMonth)

            // Vendas de serviços - me_venda_servicos (por data de criação)
            const { data: serviceSalesData } = await supabase
                .from('me_venda_servicos')
                .select('valor_total')
                .eq('empresa_id', empresaId)
                .gte('created_at', startOfMonth)
                .lte('created_at', endOfMonth)

            const productSales = productSalesData?.reduce((acc, curr) => acc + Number(curr.valor_total), 0) || 0
            const serviceSales = serviceSalesData?.reduce((acc, curr) => acc + Number(curr.valor_total), 0) || 0
            const total = productSales + serviceSales

            result.push({
                month: targetDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
                produtos: productSales,
                servicos: serviceSales,
                total
            })
        }

        return result
    },

    async getExpenseBreakdown() {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()

        const { data, error } = await supabase
            .from('fn_movimento')
            .select(`
                valor,
                categoria:fn_categoria(nome)
            `)
            .eq('empresa_id', empresaId)
            .eq('tipo', 'despesa')
            .gte('data_vencimento', startOfMonth)
            .lte('data_vencimento', endOfMonth)

        if (error) throw error

        // Group by category
        const breakdown: Record<string, number> = {}
        let total = 0

        data?.forEach((item: any) => {
            const categoryName = item.categoria?.nome || 'Outros'
            const value = Number(item.valor)
            breakdown[categoryName] = (breakdown[categoryName] || 0) + value
            total += value
        })

        // Convert to percentage
        return Object.entries(breakdown).map(([nome, valor]) => ({
            nome,
            valor,
            percentual: total > 0 ? (valor / total) * 100 : 0
        })).sort((a, b) => b.valor - a.valor).slice(0, 5) // Top 5
    },

    async getRevenueBreakdown(statusFilter?: 'pago' | 'pendente' | 'todos') {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()
        const startOfMonthStr = startOfMonth.split('T')[0]
        const endOfMonthStr = endOfMonth.split('T')[0]

        // Buscar receitas manuais - fn_movimento
        let query = supabase
            .from('fn_movimento')
            .select(`
                valor,
                categoria:fn_categoria(nome)
            `)
            .eq('empresa_id', empresaId)
            .eq('tipo', 'receita')
            .gte('data_vencimento', startOfMonth)
            .lte('data_vencimento', endOfMonth)

        if (statusFilter === 'pago') {
            query = query.eq('status', 'pago')
        } else if (statusFilter === 'pendente') {
            query = query.eq('status', 'pendente')
        }

        const { data: manualData, error: manualError } = await query
        if (manualError) throw manualError

        // Buscar vendas do PDV - me_contas_receber
        let salesQuery = supabase
            .from('me_contas_receber')
            .select('valor, status')
            .eq('empresa_id', empresaId)
            .gte('data_vencimento', startOfMonthStr)
            .lte('data_vencimento', endOfMonthStr)

        if (statusFilter === 'pago') {
            salesQuery = salesQuery.eq('status', 'pago')
        } else if (statusFilter === 'pendente') {
            salesQuery = salesQuery.eq('status', 'pendente')
        }

        const { data: salesData, error: salesError } = await salesQuery
        if (salesError) throw salesError

        // Group by category
        const breakdown: Record<string, number> = {}
        let total = 0

        // Adicionar receitas manuais
        manualData?.forEach((item: any) => {
            const categoryName = item.categoria?.nome || 'Outros'
            const value = Number(item.valor)
            breakdown[categoryName] = (breakdown[categoryName] || 0) + value
            total += value
        })

        // Adicionar vendas do PDV (categoria específica)
        const salesTotal = salesData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0
        if (salesTotal > 0) {
            breakdown['Vendas PDV'] = (breakdown['Vendas PDV'] || 0) + salesTotal
            total += salesTotal
        }

        // Convert to percentage
        return Object.entries(breakdown).map(([nome, valor]) => ({
            nome,
            valor,
            percentual: total > 0 ? (valor / total) * 100 : 0
        })).sort((a, b) => b.valor - a.valor)
    },

    async getExpenseBreakdownForDRE(statusFilter?: 'pago' | 'pendente' | 'todos') {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()

        let query = supabase
            .from('fn_movimento')
            .select(`
                valor,
                categoria:fn_categoria(nome)
            `)
            .eq('empresa_id', empresaId)
            .eq('tipo', 'despesa')
            .gte('data_vencimento', startOfMonth)
            .lte('data_vencimento', endOfMonth)

        if (statusFilter === 'pago') {
            query = query.eq('status', 'pago')
        } else if (statusFilter === 'pendente') {
            query = query.eq('status', 'pendente')
        }

        const { data, error } = await query

        if (error) throw error

        // Group by category
        const breakdown: Record<string, number> = {}
        let total = 0

        data?.forEach((item: any) => {
            const categoryName = item.categoria?.nome || 'Outros'
            const value = Number(item.valor)
            breakdown[categoryName] = (breakdown[categoryName] || 0) + value
            total += value
        })

        // Convert to percentage
        return Object.entries(breakdown).map(([nome, valor]) => ({
            nome,
            valor,
            percentual: total > 0 ? (valor / total) * 100 : 0
        })).sort((a, b) => b.valor - a.valor)
    },

    // CRUD Contas
    async createAccount(account: Partial<Account>) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        const { data, error } = await supabase
            .from('fn_conta')
            .insert([{ ...account, empresa_id: empresaId }])
            .select()
            .single()

        if (error) throw error
        return data as Account
    },

    async updateAccount(id: string, updates: Partial<Account>) {
        const { data, error } = await supabase
            .from('fn_conta')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as Account
    },

    async deleteAccount(id: string) {
        const { error } = await supabase
            .from('fn_conta')
            .update({ status: 'inativo' })
            .eq('id', id)

        if (error) throw error
    },

    // CRUD Categorias
    async createCategory(category: Partial<Category>) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        const { data, error } = await supabase
            .from('fn_categoria')
            .insert([{ ...category, empresa_id: empresaId }])
            .select()
            .single()

        if (error) throw error
        return data as Category
    },

    async updateCategory(id: number, updates: Partial<Category>) {
        const { data, error } = await supabase
            .from('fn_categoria')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as Category
    },

    async deleteCategory(id: number) {
        const { error } = await supabase
            .from('fn_categoria')
            .delete()
            .eq('id', id)

        if (error) throw error
    },

    // Parcelamento
    async createInstallmentTransaction(params: {
        descricao: string
        valor_total: number
        tipo: 'receita' | 'despesa'
        parcelas: number
        data_primeira_parcela: string
        categoria_id?: number
        conta_id?: string
        cliente_id?: string
        fornecedor_id?: string
        observacao?: string
    }) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        const grupoId = crypto.randomUUID()
        const valorParcela = params.valor_total / params.parcelas

        const movimentos = []
        const dataPrimeira = new Date(params.data_primeira_parcela)

        for (let i = 0; i < params.parcelas; i++) {
            const dataVencimento = new Date(dataPrimeira)
            dataVencimento.setMonth(dataVencimento.getMonth() + i)

            movimentos.push({
                empresa_id: empresaId,
                descricao: `${params.descricao} (${i + 1}/${params.parcelas})`,
                valor: valorParcela,
                tipo: params.tipo,
                status: 'pendente',
                data_vencimento: dataVencimento.toISOString().split('T')[0],
                categoria_id: params.categoria_id,
                conta_id: params.conta_id,
                cliente_id: params.cliente_id,
                fornecedor_id: params.fornecedor_id,
                observacao: params.observacao,
                eh_parcelado: true,
                parcela_numero: i + 1,
                parcela_total: params.parcelas,
                grupo_parcelamento: grupoId
            })
        }

        const { data, error } = await supabase
            .from('fn_movimento')
            .insert(movimentos)
            .select()

        if (error) throw error
        return data as Transaction[]
    },

    // Despesas Recorrentes
    async createRecurringExpense(params: {
        descricao: string
        valor: number
        tipo: 'receita' | 'despesa'
        categoria_id?: number
        conta_id?: string
        dia_vencimento: number
        meses_gerar: number
        observacao?: string
    }) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        // Criar regra de recorrência
        const { data: regra, error: erroRegra } = await supabase
            .from('fn_movimento_recorrencia')
            .insert([{
                empresa_id: empresaId,
                descricao: params.descricao,
                valor: params.valor,
                tipo: params.tipo,
                categoria_id: params.categoria_id,
                conta_id: params.conta_id,
                dia_vencimento: params.dia_vencimento,
                tipo_recorrencia: 'mensal',
                meses_restantes: params.meses_gerar,
                observacao: params.observacao
            }])
            .select()
            .single()

        if (erroRegra) throw erroRegra

        // Gerar movimentos
        const movimentos = []
        const hoje = new Date()

        for (let i = 0; i < params.meses_gerar; i++) {
            const dataVencimento = new Date(hoje.getFullYear(), hoje.getMonth() + i, params.dia_vencimento)

            movimentos.push({
                empresa_id: empresaId,
                descricao: params.descricao,
                valor: params.valor,
                tipo: params.tipo,
                status: 'pendente',
                data_vencimento: dataVencimento.toISOString().split('T')[0],
                categoria_id: params.categoria_id,
                conta_id: params.conta_id,
                observacao: params.observacao,
                eh_recorrente: true,
                recorrencia_id: regra.id
            })
        }

        const { data: lancamentos, error: erroLancamentos } = await supabase
            .from('fn_movimento')
            .insert(movimentos)
            .select()

        if (erroLancamentos) throw erroLancamentos
        return { regra, lancamentos }
    },

    // Despesas Fixas (12 meses)
    async createFixedExpense(params: {
        descricao: string
        valor: number
        tipo: 'receita' | 'despesa'
        categoria_id?: number
        conta_id?: string
        dia_vencimento: number
        observacao?: string
    }) {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) throw new Error('Empresa não identificada')

        // Criar regra de recorrência
        const { data: regra, error: erroRegra } = await supabase
            .from('fn_movimento_recorrencia')
            .insert([{
                empresa_id: empresaId,
                descricao: params.descricao,
                valor: params.valor,
                tipo: params.tipo,
                categoria_id: params.categoria_id,
                conta_id: params.conta_id,
                dia_vencimento: params.dia_vencimento,
                tipo_recorrencia: 'fixa_12_meses',
                meses_restantes: 12,
                observacao: params.observacao
            }])
            .select()
            .single()

        if (erroRegra) throw erroRegra

        // Gerar 12 movimentos
        const movimentos = []
        const hoje = new Date()

        for (let i = 0; i < 12; i++) {
            const dataVencimento = new Date(hoje.getFullYear(), hoje.getMonth() + i, params.dia_vencimento)

            movimentos.push({
                empresa_id: empresaId,
                descricao: `${params.descricao} (${i + 1}/12)`,
                valor: params.valor,
                tipo: params.tipo,
                status: 'pendente',
                data_vencimento: dataVencimento.toISOString().split('T')[0],
                categoria_id: params.categoria_id,
                conta_id: params.conta_id,
                observacao: params.observacao,
                eh_recorrente: true,
                recorrencia_id: regra.id
            })
        }

        const { data: lancamentos, error: erroLancamentos } = await supabase
            .from('fn_movimento')
            .insert(movimentos)
            .select()

        if (erroLancamentos) throw erroLancamentos
        return { regra, lancamentos }
    },

    // Listar regras de recorrência
    async getRecurringRules() {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return []

        const { data, error } = await supabase
            .from('fn_movimento_recorrencia')
            .select('*')
            .eq('empresa_id', empresaId)
            .order('created_at', { ascending: false })

        if (error) throw error
        return data
    },

    // Pausar/Ativar regra de recorrência
    async toggleRecurringRule(id: string, ativo: boolean) {
        const { error } = await supabase
            .from('fn_movimento_recorrencia')
            .update({ ativo })
            .eq('id', id)

        if (error) throw error
    }
}
