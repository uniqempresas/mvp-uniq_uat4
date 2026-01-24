import { useState, useEffect } from 'react'
import { financeService, type FinanceStats } from '../../services/financeService'

interface MonthData {
    month: string
    receita: number
    despesa: number
}

interface CategoryBreakdown {
    nome: string
    valor: number
    percentual: number
}

type StatusFilter = 'todos' | 'pago' | 'pendente'

export default function FinanceDashboard() {
    const [statsPayable, setStatsPayable] = useState<FinanceStats | null>(null)
    const [monthlyData, setMonthlyData] = useState<MonthData[]>([])
    const [expenseBreakdown, setExpenseBreakdown] = useState<CategoryBreakdown[]>([])
    const [revenueBreakdown, setRevenueBreakdown] = useState<CategoryBreakdown[]>([])
    const [expenseBreakdownDRE, setExpenseBreakdownDRE] = useState<CategoryBreakdown[]>([])
    const [hoveredBar, setHoveredBar] = useState<{ index: number, type: 'receita' | 'despesa' } | null>(null)
    const [dreFilter, setDreFilter] = useState<StatusFilter>('todos')

    useEffect(() => {
        loadData()
    }, [])

    useEffect(() => {
        loadDREData()
    }, [dreFilter])

    const loadData = async () => {
        try {
            const [payable, evolution, expenseBreak] = await Promise.all([
                financeService.getDashboardStats('despesa'),
                financeService.getMonthlyEvolution(6),
                financeService.getExpenseBreakdown()
            ])
            setStatsPayable(payable)
            setMonthlyData(evolution)
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
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Fluxo de Caixa (DRE)</h1>
                    <p className="text-xs text-gray-500">Demonstrativo de Resultado</p>
                </div>
                <div className="flex items-center gap-3">
                    <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
                        <option>{new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</option>
                    </select>
                    <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
                        <option>Centro de Custo: Geral</option>
                    </select>
                    <select className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm bg-white">
                        <option>Todas as Contas</option>
                    </select>
                    <button className="px-4 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                        <span className="material-symbols-outlined text-[18px]">download</span>
                        Exportar
                    </button>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                <div className="max-w-7xl mx-auto flex flex-col gap-6">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-500 font-medium">Receita Bruta</p>
                                <span className="text-green-600 text-xs font-bold bg-green-50 px-2 py-0.5 rounded">+12%</span>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">
                                R$ {receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-gray-500 font-medium">Despesas Totais</p>
                                <span className="text-red-600 text-xs font-bold bg-red-50 px-2 py-0.5 rounded">+5%</span>
                            </div>
                            <p className="text-3xl font-bold text-gray-900">
                                R$ {despesasTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-blue-900 to-blue-700 p-6 rounded-xl shadow-lg text-white">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm text-white/80 font-medium">Lucro Líquido</p>
                                <span className="text-white text-xs font-bold bg-white/20 px-2 py-0.5 rounded">
                                    {margemLucro >= 0 ? '+' : ''}{margemLucro.toFixed(0)}%
                                </span>
                            </div>
                            <p className="text-3xl font-bold">
                                R$ {lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </p>
                            <p className="text-xs text-white/70 mt-1">Margem de lucro</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {/* Evolução Financeira Chart */}
                        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-bold text-gray-900">Evolução Financeira</h3>
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                        <span className="text-gray-600">Receita</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                        <span className="text-gray-600">Despesa</span>
                                    </div>
                                </div>
                            </div>

                            {/* Chart */}
                            <div className="flex items-end justify-between gap-3 h-64 relative">
                                {monthlyData.length > 0 ? monthlyData.map((data, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-2">
                                        <div className="w-full flex items-end justify-center gap-1 h-52 relative">
                                            <div
                                                className="w-5 bg-blue-600 rounded-t transition-all hover:bg-blue-700 cursor-pointer relative"
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
                                                className="w-5 bg-red-500 rounded-t transition-all hover:bg-red-600 cursor-pointer relative"
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
                                        <span className="text-xs text-gray-500 font-medium capitalize">{data.month}</span>
                                    </div>
                                )) : (
                                    <div className="flex items-center justify-center w-full h-52 text-gray-400">
                                        Sem dados para exibir
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Detalhamento de Despesas (Pie Chart) */}
                        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 mb-6">Detalhamento de Despesas</h3>

                            {/* Total Center */}
                            <div className="flex items-center justify-center mb-6">
                                <div className="text-center">
                                    <p className="text-xs text-gray-500 mb-1">Total</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        R$ {(statsPayable?.total_mes.total || 0 / 1000).toFixed(1)}k
                                    </p>
                                </div>
                            </div>

                            {/* Legend */}
                            <div className="space-y-3">
                                {expenseBreakdown.length > 0 ? expenseBreakdown.map((item, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: pieColors[i % pieColors.length] }}
                                            ></div>
                                            <span className="text-sm text-gray-600 truncate max-w-[120px]">{item.nome}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-900">{item.percentual.toFixed(0)}%</span>
                                    </div>
                                )) : (
                                    <p className="text-sm text-gray-400 text-center">Sem despesas no período</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Demonstrativo Detalhado (DRE Table) */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Demonstrativo Detalhado</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setDreFilter('todos')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dreFilter === 'todos'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Tudo
                                </button>
                                <button
                                    onClick={() => setDreFilter('pago')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dreFilter === 'pago'
                                        ? 'bg-green-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Efetivado
                                </button>
                                <button
                                    onClick={() => setDreFilter('pendente')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${dreFilter === 'pendente'
                                        ? 'bg-amber-600 text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    Pendente
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Descrição</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">%</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Valor (R$)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {/* Receitas */}
                                    <tr className="hover:bg-gray-50 bg-green-50">
                                        <td className="px-6 py-4 text-sm font-bold text-green-900">(+) Receita Operacional Bruta</td>
                                        <td className="px-6 py-4 text-sm text-right text-green-600">100%</td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-green-900">
                                            {receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                    {revenueBreakdown.length > 0 ? revenueBreakdown.map((item, i) => (
                                        <tr key={`rev-${i}`} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-600 pl-12">{item.nome}</td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-500">{item.percentual.toFixed(1)}%</td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-600">
                                                {item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-400 pl-12" colSpan={3}>Sem receitas no período</td>
                                        </tr>
                                    )}

                                    {/* Despesas */}
                                    <tr className="hover:bg-gray-50 bg-red-50">
                                        <td className="px-6 py-4 text-sm font-bold text-red-900">(-) Despesas Operacionais</td>
                                        <td className="px-6 py-4 text-sm text-right text-red-600">
                                            {receitaBruta > 0 ? `${((despesasTotais / receitaBruta) * 100).toFixed(1)}%` : '0%'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-red-900">
                                            ({despesasTotais.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                                        </td>
                                    </tr>
                                    {expenseBreakdownDRE.length > 0 ? expenseBreakdownDRE.map((item, i) => (
                                        <tr key={`exp-${i}`} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-600 pl-12">{item.nome}</td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-500">{item.percentual.toFixed(1)}%</td>
                                            <td className="px-6 py-4 text-sm text-right text-gray-600">
                                                ({item.valor.toLocaleString('pt-BR', { minimumFractionDigits: 2 })})
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-400 pl-12" colSpan={3}>Sem despesas no período</td>
                                        </tr>
                                    )}

                                    {/* Resultado */}
                                    <tr className="hover:bg-gray-50 bg-blue-50 border-t-2 border-blue-200">
                                        <td className="px-6 py-4 text-sm font-bold text-blue-900">(=) Resultado Operacional Líquido</td>
                                        <td className="px-6 py-4 text-sm text-right text-blue-600 font-bold">
                                            {receitaBruta > 0 ? `${margemLucro.toFixed(1)}%` : '0%'}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-right font-bold text-blue-900">
                                            {lucroLiquido.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
