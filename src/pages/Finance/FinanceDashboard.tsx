import { useState, useEffect } from 'react'
import { financeService, type FinanceStats } from '../../services/financeService'
import { KPICard } from '../../components/Finance/KPICard'
import { DemonstrativeTable } from '../../components/Finance/DemonstrativeTable'
import { ContasReceberWidget } from './components/ContasReceberWidget'

interface MonthData {
    month: string
    receita: number
    despesa: number
}

interface SalesMonthData {
    month: string
    produtos: number
    servicos: number
    total: number
}

export interface CategoryBreakdown {
    nome: string
    valor: number
    percentual: number
}

type StatusFilter = 'todos' | 'pago' | 'pendente'

export default function FinanceDashboard() {
    const [statsPayable, setStatsPayable] = useState<FinanceStats | null>(null)
    const [statsReceivable, setStatsReceivable] = useState<FinanceStats | null>(null)
    const [monthlyData, setMonthlyData] = useState<MonthData[]>([])
    const [monthlySales, setMonthlySales] = useState<SalesMonthData[]>([])
    const [expenseBreakdown, setExpenseBreakdown] = useState<CategoryBreakdown[]>([])
    const [revenueBreakdown, setRevenueBreakdown] = useState<CategoryBreakdown[]>([])
    const [expenseBreakdownDRE, setExpenseBreakdownDRE] = useState<CategoryBreakdown[]>([])
    const [hoveredBar, setHoveredBar] = useState<{ index: number, type: 'receita' | 'despesa' } | null>(null)
    const [hoveredSalesBar, setHoveredSalesBar] = useState<{ index: number, type: 'produtos' | 'servicos' } | null>(null)
    const [dreFilter, setDreFilter] = useState<StatusFilter>('todos')

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        loadDREData()
    }, [dreFilter])

    const loadData = async () => {
        try {
            const [payable, receivable, evolution, sales, expenseBreak] = await Promise.all([
                financeService.getDashboardStats('despesa'),
                financeService.getDashboardStats('receita'),
                financeService.getMonthlyEvolution(6),
                financeService.getMonthlySales(6),
                financeService.getExpenseBreakdown()
            ])
            setStatsPayable(payable)
            setStatsReceivable(receivable)
            setMonthlyData(evolution)
            setMonthlySales(sales)
            setExpenseBreakdown(expenseBreak)
        } catch (error) {
            console.error(error)
        }
    }

    const loadDREData = async () => {
        try {
            const filterParam = dreFilter === 'todos' ? undefined : dreFilter
            const [revenueBreak, expenseBreak] = await Promise.all([
                financeService.getRevenueBreakdown(filterParam),
                financeService.getExpenseBreakdownForDRE(filterParam)
            ])
            setRevenueBreakdown(revenueBreak)
            setExpenseBreakdownDRE(expenseBreak)
        } catch (error) {
            console.error(error)
        }
    }

    const receitaBruta = revenueBreakdown.reduce((acc, item) => acc + item.valor, 0)
    const despesasTotais = expenseBreakdownDRE.reduce((acc, item) => acc + item.valor, 0)
    const lucroLiquido = receitaBruta - despesasTotais
    const margemLucro = receitaBruta > 0 ? ((lucroLiquido / receitaBruta) * 100) : 0

    const maxValue = monthlyData.length > 0
        ? Math.max(...monthlyData.map(d => Math.max(d.receita, d.despesa)))
        : 1

    // Pie chart colors
    const pieColors = ['#ef4444', '#f97316', '#eab308', '#84cc16', '#06b6d4']

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-hidden">
            {/* Header */}
            <header className="h-auto min-h-16 bg-white border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 md:px-6 py-3 sm:py-0 gap-3 shrink-0 z-10">
                <div className="w-full sm:w-auto">
                    <h1 className="text-lg md:text-xl font-bold text-gray-900 truncate">Fluxo de Caixa (DRE)</h1>
                    <p className="text-xs text-gray-500">Demonstrativo de Resultado</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <select className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs md:text-sm bg-white flex-1 sm:flex-none min-w-[120px]">
                        <option>{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</option>
                    </select>
                    <select className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs md:text-sm bg-white flex-1 sm:flex-none min-w-[140px]">
                        <option>Centro de Custo: Geral</option>
                    </select>
                    <select className="px-2 py-1.5 border border-gray-200 rounded-lg text-xs md:text-sm bg-white flex-1 sm:flex-none min-w-[120px]">
                        <option>Todas as Contas</option>
                    </select>
                    <button className="px-3 md:px-4 py-1.5 bg-blue-600 text-white text-xs md:text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1 md:gap-2 whitespace-nowrap">
                        <span className="material-symbols-outlined text-[16px] md:text-[18px]">download</span>
                        <span className="hidden sm:inline">Exportar</span>
                    </button>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
                <div className="max-w-7xl mx-auto flex flex-col gap-4 md:gap-6">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        <KPICard
                            title="Receita Bruta"
                            value={`R$ ${receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            icon="trending_up"
                            trend={{ value: 12, isPositive: true }}
                            color="green"
                        />

                        <KPICard
                            title="Despesas Totais"
                            value={`R$ ${despesasTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            icon="trending_down"
                            trend={{ value: 5, isPositive: false }}
                            color="red"
                        />

                        <KPICard
                            title="Lucro Líquido"
                            value={`R$ ${lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            icon="account_balance"
                            trend={{ value: Math.abs(margemLucro), isPositive: margemLucro >= 0 }}
                            color="blue"
                            subtitle={`Margem de ${margemLucro.toFixed(1)}%`}
                        />
                    </div>

                    {/* KPI Cards de Contas a Receber */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                        <KPICard
                            title="A Receber Hoje"
                            value={`R$ ${(statsReceivable?.vencendo_hoje?.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            icon="event_available"
                            color="yellow"
                            subtitle={`${statsReceivable?.vencendo_hoje?.count || 0} recebimentos`}
                        />

                        <KPICard
                            title="Total a Receber"
                            value={`R$ ${(statsReceivable?.total_mes?.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            icon="account_balance_wallet"
                            color="green"
                        />

                        <KPICard
                            title="Recebido"
                            value={`R$ ${(statsReceivable?.pago_mes?.total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                            icon="check_circle"
                            color="blue"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
                        {/* Evolução Financeira Chart */}
                        <div className="lg:col-span-2 bg-white p-3 md:p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            <div className="flex items-center justify-between mb-4 md:mb-6">
                                <h3 className="text-base md:text-lg font-bold text-gray-900">Evolução Financeira</h3>
                                <div className="flex items-center gap-3 md:gap-4 text-xs">
                                    <div className="flex items-center gap-1 md:gap-2">
                                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-blue-600"></div>
                                        <span className="text-gray-600">Receita</span>
                                    </div>
                                    <div className="flex items-center gap-1 md:gap-2">
                                        <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500"></div>
                                        <span className="text-gray-600">Despesa</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chart com scroll horizontal em mobile */}
                            <div className="overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0">
                                <div className="flex items-end justify-between gap-2 md:gap-3 min-w-[300px] md:min-w-0 h-48 md:h-64 relative">
                                    {monthlyData.length > 0 ? monthlyData.map((data, i) => (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1 md:gap-2 min-w-[40px] md:min-w-0">
                                            <div className="w-full flex items-end justify-center gap-0.5 md:gap-1 h-36 md:h-52 relative">
                                                <div
                                                    className="w-3 md:w-5 min-h-[4px] bg-blue-600 rounded-t transition-all hover:bg-blue-700 cursor-pointer relative touch-manipulation"
                                                    style={{ height: `${(data.receita / maxValue) * 100}%` }}
                                                    onMouseEnter={() => setHoveredBar({ index: i, type: 'receita' })}
                                                    onMouseLeave={() => setHoveredBar(null)}
                                                >
                                                    {hoveredBar?.index === i && hoveredBar.type === 'receita' && (
                                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                                            R$ {data.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div
                                                    className="w-3 md:w-5 min-h-[4px] bg-red-500 rounded-t transition-all hover:bg-red-600 cursor-pointer relative touch-manipulation"
                                                    style={{ height: `${(data.despesa / maxValue) * 100}%` }}
                                                    onMouseEnter={() => setHoveredBar({ index: i, type: 'despesa' })}
                                                    onMouseLeave={() => setHoveredBar(null)}
                                                >
                                                    {hoveredBar?.index === i && hoveredBar.type === 'despesa' && (
                                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                                            R$ {data.despesa.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-[10px] md:text-xs text-gray-500 font-medium capitalize truncate max-w-full">{data.month}</span>
                                        </div>
                                    )) : (
                                        <div className="flex items-center justify-center w-full h-36 md:h-52 text-gray-400">
                                            Sem dados para exibir
                                        </div>
                                    )}
                                </div>
                            </div>
                    </div>

                    {/* Vendas Realizadas por Mês */}
                    <div className="lg:col-span-2 bg-white p-3 md:p-6 rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="flex items-center justify-between mb-4 md:mb-6">
                            <h3 className="text-base md:text-lg font-bold text-gray-900">Vendas Realizadas por Mês</h3>
                            <div className="flex items-center gap-3 md:gap-4 text-xs">
                                <div className="flex items-center gap-1 md:gap-2">
                                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-emerald-500"></div>
                                    <span className="text-gray-600">Produtos</span>
                                </div>
                                <div className="flex items-center gap-1 md:gap-2">
                                    <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-blue-400"></div>
                                    <span className="text-gray-600">Serviços</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart com scroll horizontal em mobile */}
                        <div className="overflow-x-auto pb-2 -mx-3 px-3 md:mx-0 md:px-0">
                            <div className="flex items-end justify-between gap-2 md:gap-3 min-w-[300px] md:min-w-0 h-48 md:h-64 relative">
                                {monthlySales.length > 0 ? monthlySales.map((data, i) => {
                                    const maxSalesValue = Math.max(...monthlySales.map(d => d.total), 1)
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center gap-1 md:gap-2 min-w-[40px] md:min-w-0">
                                            <div className="w-full flex items-end justify-center gap-0.5 md:gap-1 h-36 md:h-52 relative">
                                                <div
                                                    className="w-3 md:w-5 min-h-[4px] bg-emerald-500 rounded-t transition-all hover:bg-emerald-600 cursor-pointer relative touch-manipulation"
                                                    style={{ height: `${(data.produtos / maxSalesValue) * 100}%` }}
                                                    onMouseEnter={() => setHoveredSalesBar({ index: i, type: 'produtos' })}
                                                    onMouseLeave={() => setHoveredSalesBar(null)}
                                                >
                                                    {hoveredSalesBar?.index === i && hoveredSalesBar.type === 'produtos' && (
                                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                                            Produtos: R$ {data.produtos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                                        </div>
                                                    )}
                                                </div>
                                                <div
                                                    className="w-3 md:w-5 min-h-[4px] bg-blue-400 rounded-t transition-all hover:bg-blue-500 cursor-pointer relative touch-manipulation"
                                                    style={{ height: `${(data.servicos / maxSalesValue) * 100}%` }}
                                                    onMouseEnter={() => setHoveredSalesBar({ index: i, type: 'servicos' })}
                                                    onMouseLeave={() => setHoveredSalesBar(null)}
                                                >
                                                    {hoveredSalesBar?.index === i && hoveredSalesBar.type === 'servicos' && (
                                                        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                                                            Serviços: R$ {data.servicos.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                                            <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-[10px] md:text-xs text-gray-500 font-medium capitalize truncate max-w-full">{data.month}</span>
                                        </div>
                                    )
                                }) : (
                                    <div className="flex items-center justify-center w-full h-36 md:h-52 text-gray-400">
                                        Sem vendas para exibir
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Detalhamento de Despesas (Pie Chart) */}
                    <div className="bg-white p-4 md:p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6">Detalhamento de Despesas</h3>

                            {/* Total Center */}
                            <div className="flex items-center justify-center mb-4 md:mb-6">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-1">Total</p>
                                    <p className="text-xl md:text-2xl font-bold text-gray-900">
                                        R$ {(statsPayable?.total_mes.total || 0 / 1000).toFixed(1)}k
                                    </p>
                                </div>
                            </div>

                            {/* Legend com scroll se necessário */}
                            <div className="space-y-2 md:space-y-3 max-h-[180px] md:max-h-[200px] overflow-y-auto">
                                {expenseBreakdown.length > 0 ? expenseBreakdown.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0 flex-1">
                                            <div
                                                className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full shrink-0"
                                                style={{ backgroundColor: pieColors[i % pieColors.length] }}
                                            ></div>
                                            <span className="text-xs md:text-sm text-gray-600 truncate" title={item.nome}>
                                                {item.nome}
                                            </span>
                                        </div>
                                        <span className="text-xs md:text-sm font-bold text-gray-900 shrink-0">
                                            {item.percentual.toFixed(0)}%
                                        </span>
                                    </div>
                                )) : (
                                    <p className="text-xs md:text-sm text-gray-400 text-center">Sem despesas no período</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Contas a Receber - Integração com Vendas */}
                    <ContasReceberWidget />

                    {/* Demonstrativo Detalhado (DRE Table) */}
                    <DemonstrativeTable
                        revenueBreakdown={revenueBreakdown}
                        expenseBreakdownDRE={expenseBreakdownDRE}
                        receitaBruta={receitaBruta}
                        despesasTotais={despesasTotais}
                        lucroLiquido={lucroLiquido}
                        margemLucro={margemLucro}
                        filter={dreFilter}
                        onFilterChange={setDreFilter}
                    />
                </div>
            </div>
        </div>
    )
}
