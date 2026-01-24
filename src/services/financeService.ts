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

        const { data, error } = await query
        if (error) throw error
        return data as Transaction[]
    },

    async getDashboardStats(tipo: 'receita' | 'despesa'): Promise<FinanceStats> {
        const empresaId = await authService.getEmpresaId()
        if (!empresaId) return { vencendo_hoje: { total: 0, count: 0 }, total_mes: { total: 0, percentual: 0 }, pago_mes: { total: 0 } }

        const today = new Date().toISOString().split('T')[0]
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString()
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).toISOString()

        // 1. Vencendo Hoje (Pendente)
        const { data: todayData } = await supabase
            .from('fn_movimento')
            .select('valor')
            .eq('empresa_id', empresaId)
            .eq('tipo', tipo)
            .eq('data_vencimento', today)
            .eq('status', 'pendente')

        const todayTotal = todayData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0

        // 2. Total Mês (Vencimento no mês)
        const { data: monthData } = await supabase
            .from('fn_movimento')
            .select('valor')
            .eq('empresa_id', empresaId)
            .eq('tipo', tipo)
            .gte('data_vencimento', startOfMonth)
            .lte('data_vencimento', endOfMonth)

        const monthTotal = monthData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0

        // 3. Pago Mês (Pago e Data Pagamento no mês, OU Vencimento no mês e status pago? Usually Cash Flow vs Competence. 
        // Request said "Simples" (Simple). Usually users want "How much I paid this month" (Cash flow).
        // Let's go with "Status = Pago" AND "Data Pagamento" in month.
        const { data: paidData } = await supabase
            .from('fn_movimento')
            .select('valor')
            .eq('empresa_id', empresaId)
            .eq('tipo', tipo)
            .eq('status', 'pago')
            .gte('data_pagamento', startOfMonth)
            .lte('data_pagamento', endOfMonth)

        const paidTotal = paidData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0

        return {
            vencendo_hoje: { total: todayTotal, count: todayData?.length || 0 },
            total_mes: { total: monthTotal, percentual: 0 }, // TODO: Calc breakdown later
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
        const { data, error } = await supabase
            .from('fn_movimento')
            .update(updates)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data as Transaction
    },

    async deleteTransaction(id: string) {
        const { error } = await supabase
            .from('fn_movimento')
            .delete()
            .eq('id', id)

        if (error) throw error
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

            // Receita
            const { data: receitaData } = await supabase
                .from('fn_movimento')
                .select('valor')
                .eq('empresa_id', empresaId)
                .eq('tipo', 'receita')
                .gte('data_vencimento', startOfMonth)
                .lte('data_vencimento', endOfMonth)

            // Despesa
            const { data: despesaData } = await supabase
                .from('fn_movimento')
                .select('valor')
                .eq('empresa_id', empresaId)
                .eq('tipo', 'despesa')
                .gte('data_vencimento', startOfMonth)
                .lte('data_vencimento', endOfMonth)

            const receita = receitaData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0
            const despesa = despesaData?.reduce((acc, curr) => acc + Number(curr.valor), 0) || 0

            result.push({
                month: targetDate.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
                receita,
                despesa
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
