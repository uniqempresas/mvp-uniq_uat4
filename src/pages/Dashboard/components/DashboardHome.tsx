import { useState, useEffect } from 'react'
import { dashboardService, type DashboardKPIs, type RecentSale } from '../../../services/dashboardService'
import { moduleService } from '../../../services/moduleService'
import { useBreakpoint } from '../../../hooks/useBreakpoint'
import MobileCard from '../../../components/Mobile/MobileCard'

export default function DashboardHome() {
    // State
    const [loading, setLoading] = useState(true)
    const [kpis, setKpis] = useState<DashboardKPIs>({
        totalSales: 0,
        totalSalesCount: 0,
        averageTicket: 0,
        financialBalance: 0,
        criticalStockCount: 0
    })
    const [recentSales, setRecentSales] = useState<RecentSale[]>([])

    // Insights Data (Static for now, can be dynamic later)
    const insights = [
        {
            id: 1,
            type: 'warning',
            title: `Atenção ao Estoque: ${kpis.criticalStockCount} Produtos`,
            message: 'Existem produtos com estoque crítico que precisam de reposição.',
            action: 'Ver Estoque',
            icon: 'warning'
        },
        {
            id: 2,
            type: 'info',
            title: 'Meta Mensal',
            message: `Você já vendeu ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(kpis.totalSales)} este mês!`,
            action: 'Ver Relatório',
            icon: 'verified'
        }
    ]

    const [currentInsight, setCurrentInsight] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentInsight((prev) => (prev + 1) % insights.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [insights.length])

    // Fetch Real Data
    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            try {
                const empresaId = await moduleService.getCurrentCompanyId()
                if (empresaId) {
                    // Date Range: Start of month to now
                    const now = new Date()
                    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

                    const kpiData = await dashboardService.getKPIs(empresaId, startOfMonth, now)
                    setKpis(kpiData)

                    const salesData = await dashboardService.getRecentSales(empresaId)
                    setRecentSales(salesData)
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const formatCurrency = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val)

    // Breakpoint detection (must be at component level, not inside IIFE)
    const { isMobile } = useBreakpoint()

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center h-full bg-background-light">
                <div className="flex flex-col items-center gap-4">
                    <span className="material-symbols-outlined text-4xl text-primary animate-spin">progress_activity</span>
                    <p className="text-slate-500 font-medium">Carregando painel...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-background-light">
            {/* Header with Search and Actions */}
            <header className="flex h-16 shrink-0 items-center justify-between bg-white px-6 shadow-sm z-10">
                <div className="flex w-full max-w-md items-center gap-3 rounded-lg bg-slate-50 px-3 py-2 text-slate-500 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/50 transition-all">
                    <span className="material-symbols-outlined text-[20px]">search</span>
                    <input className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 text-slate-700" placeholder="Buscar produtos, pedidos ou clientes..." type="text" />
                    <div className="flex gap-1 text-[10px] font-bold text-slate-400 border border-slate-200 rounded px-1.5 py-0.5">
                        <span>CTRL</span><span>K</span>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">notifications</span>
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                    </button>
                    <button className="relative rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors">
                        <span className="material-symbols-outlined text-[22px]">help</span>
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
                <div className="mx-auto max-w-7xl flex flex-col gap-6">

                    {/* Insights Section */}
                    {/* Kept dynamic insights using kpis state */}
                    <div className="w-full bg-slate-900 rounded-lg p-4 md:p-5 relative overflow-hidden text-white shadow-lg shrink-0">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full -ml-10 -mb-10 blur-2xl pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                            <div className="flex items-start gap-3 max-w-3xl">
                                <div className={`p-2 rounded-lg shrink-0 backdrop-blur-md border border-white/5 ${insights[currentInsight].type === 'warning' ? 'bg-amber-500/10 text-amber-500' : insights[currentInsight].type === 'alert' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                    <span className="material-symbols-outlined text-xl">{insights[currentInsight].icon}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${insights[currentInsight].type === 'warning' ? 'bg-amber-500/20 text-amber-400' : insights[currentInsight].type === 'alert' ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'}`}>
                                            {insights[currentInsight].type === 'warning' ? 'Alerta' : 'Novidade'}
                                        </span>
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            Atualizado agora
                                        </span>
                                    </div>
                                    <h3 className="text-base md:text-lg font-bold leading-tight">{insights[currentInsight].title}</h3>
                                    <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{insights[currentInsight].message}</p>
                                </div>
                            </div>

                            <button className="self-start md:self-center px-3 py-1.5 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold rounded-lg transition-all flex items-center gap-2 border border-white/10 backdrop-blur-sm whitespace-nowrap group hover:scale-105 active:scale-95 shadow-lg shadow-black/20">
                                {insights[currentInsight].action}
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">bolt</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Visão Geral</h2>
                            <p className="text-slate-500">Resumo deste mês</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all hover:shadow">
                                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                Este Mês
                            </button>
                            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark shadow-md shadow-primary/20 transition-all hover:shadow-lg active:scale-95">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                Nova Venda
                            </button>
                        </div>
                    </div>

                    {/* KPI Carousel Mobile / Grid Desktop */}
                    <div className="flex md:grid overflow-x-auto md:overflow-visible gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0 pb-4 md:pb-0">
                        <div className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg border border-slate-100 min-w-[280px] md:min-w-0 snap-center">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Vendas (Mês)</p>
                                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(kpis.totalSales)}</h3>
                                </div>
                                <div className="rounded-xl p-3 bg-primary/10 text-primary">
                                    <span className="material-symbols-outlined">payments</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                                <span className="material-symbols-outlined text-[18px] text-primary">numbers</span>
                                <span>{kpis.totalSalesCount} Vendas</span>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg border border-slate-100 min-w-[280px] md:min-w-0 snap-center">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Financeiro (Mês)</p>
                                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(kpis.financialBalance)}</h3>
                                </div>
                                <div className="rounded-xl p-3 bg-blue-50 text-blue-600">
                                    <span className="material-symbols-outlined">account_balance</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                                <span>Saldo Operacional</span>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg border border-slate-100 min-w-[280px] md:min-w-0 snap-center">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Estoque Crítico</p>
                                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{kpis.criticalStockCount} Produtos</h3>
                                </div>
                                <div className="rounded-xl p-3 bg-amber-50 text-amber-500">
                                    <span className="material-symbols-outlined">inventory_2</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                                <span className="material-symbols-outlined text-[18px] text-amber-500">warning</span>
                                <span>Baixo estoque</span>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-lg bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg border border-slate-100 min-w-[280px] md:min-w-0 snap-center">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Ticket Médio</p>
                                    <h3 className="mt-2 text-2xl font-bold text-slate-900">{formatCurrency(kpis.averageTicket)}</h3>
                                </div>
                                <div className="rounded-xl p-3 bg-purple-50 text-purple-600">
                                    <span className="material-symbols-outlined">trending_up</span>
                                </div>
                            </div>
                            <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                                <span>Por venda</span>
                            </div>
                        </div>
                    </div>

                    {/* Charts Area */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Evolution Chart */}
                        <div className="lg:col-span-2 rounded-lg bg-white p-6 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-800">Evolução de Vendas</h3>
                                <button className="text-sm font-medium text-primary hover:text-primary-dark">Ver Detalhes</button>
                            </div>
                            <div className="h-[300px] w-full bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                <p className="text-slate-400 text-sm font-medium">Visualização de Gráfico (Em Breve)</p>
                            </div>
                        </div>

                        {/* Distribution Chart */}
                        <div className="rounded-lg bg-white p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-6">Status dos Pedidos</h3>
                            <div className="h-[300px] w-full flex items-center justify-center relative">
                                <div className="h-48 w-48 rounded-full border-[12px] border-slate-100 border-t-primary border-r-blue-400 transform -rotate-45"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-slate-800">100%</span>
                                    <span className="text-xs font-medium text-slate-500">Operacional</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders Table */}
                    <div className="rounded-lg bg-white shadow-sm border border-slate-100 overflow-hidden">
                        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800">Últimos Pedidos</h3>
                            <button className="text-sm font-medium text-primary hover:text-primary-dark">Ver Todos</button>
                        </div>

                        {(() => {
                            if (recentSales.length === 0) {
                                return (
                                    <div className="px-6 py-12 text-center text-slate-400">
                                        <span className="material-symbols-outlined text-4xl mb-2 opacity-50">receipt_long</span>
                                        <p>Nenhuma venda registrada recentemente.</p>
                                    </div>
                                )
                            }

                            return isMobile ? (
                                // Mobile: Cards
                                <div className="p-4 space-y-3">
                                    {recentSales.map((sale) => (
                                        <MobileCard
                                            key={sale.id}
                                            title={`Pedido #${sale.npedido || '---'}`}
                                            subtitle={sale.cliente_nome}
                                            fields={[
                                                { label: 'Valor', value: formatCurrency(sale.valor_total) }
                                            ]}
                                            badge={{
                                                label: sale.status_venda || 'Pendente',
                                                color: sale.status_venda === 'concluida' ? 'green' : 'yellow'
                                            }}
                                            actions={[
                                                {
                                                    icon: 'visibility',
                                                    title: 'Ver detalhes',
                                                    onClick: () => console.log('Ver detalhes', sale.id)
                                                }
                                            ]}
                                        />
                                    ))}
                                </div>
                            ) : (
                                // Desktop: Table
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm text-slate-600">
                                        <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                            <tr>
                                                <th className="px-6 py-3 font-semibold">Nº Pedido</th>
                                                <th className="px-6 py-3 font-semibold">Cliente</th>
                                                <th className="px-6 py-3 font-semibold">Status</th>
                                                <th className="px-6 py-3 font-semibold">Valor</th>
                                                <th className="px-6 py-3 font-semibold text-right">Ações</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-100">
                                            {recentSales.map((sale) => (
                                                <tr key={sale.id} className="hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-6 py-4 font-medium text-slate-900">#{sale.npedido || '---'}</td>
                                                    <td className="px-6 py-4">{sale.cliente_nome}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${sale.status_venda === 'concluida' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                                            'bg-yellow-50 text-yellow-700 ring-yellow-600/20'
                                                            }`}>
                                                            {sale.status_venda || 'Pendente'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-slate-900">{formatCurrency(sale.valor_total)}</td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button className="text-slate-400 hover:text-primary transition-colors">
                                                            <span className="material-symbols-outlined text-[20px]">more_vert</span>
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )
                        })()}
                    </div>
                </div>
            </div>
        </div>
    )
}
