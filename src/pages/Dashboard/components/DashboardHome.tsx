import { useState, useEffect } from 'react'

export default function DashboardHome() {
    // Insights Data
    const insights = [
        {
            id: 1,
            type: 'warning',
            title: 'Atenção ao Estoque: 1 Produtos',
            message: 'Existem produtos com estoque crítico que precisam de reposição.',
            action: 'Ver Estoque',
            icon: 'warning'
        },
        {
            id: 2,
            type: 'info',
            title: 'Meta Mensal Atingida!',
            message: 'Parabéns! Sua loja atingiu 85% da meta de vendas deste mês.',
            action: 'Ver Relatório',
            icon: 'verified'
        },
        {
            id: 3,
            type: 'alert',
            title: 'Fatura em Aberto',
            message: 'A fatura do seu plano vence em 3 dias. Evite bloqueios.',
            action: 'Pagar Agora',
            icon: 'payments'
        }
    ]

    const [currentInsight, setCurrentInsight] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentInsight((prev) => (prev + 1) % insights.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [])

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
                    <div className="w-full bg-slate-900 rounded-2xl p-6 md:p-8 relative overflow-hidden text-white shadow-lg shrink-0">
                        {/* Background Effects */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/10 rounded-full -ml-10 -mb-10 blur-2xl pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6">
                            <div className="flex items-start gap-5 max-w-3xl">
                                <div className={`p-3.5 rounded-xl shrink-0 backdrop-blur-md border border-white/5 ${insights[currentInsight].type === 'warning' ? 'bg-amber-500/10 text-amber-500' : insights[currentInsight].type === 'alert' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                                    <span className="material-symbols-outlined text-3xl">{insights[currentInsight].icon}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${insights[currentInsight].type === 'warning' ? 'bg-amber-500/20 text-amber-400' : insights[currentInsight].type === 'alert' ? 'bg-red-500/20 text-red-400' : 'bg-primary/20 text-primary'}`}>
                                            {insights[currentInsight].type === 'warning' ? 'Alerta' : insights[currentInsight].type === 'alert' ? 'Financeiro' : 'Novidade'}
                                        </span>
                                        <span className="text-xs text-slate-400 flex items-center gap-1">
                                            Atualizado agora
                                        </span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold leading-tight">{insights[currentInsight].title}</h3>
                                    <p className="text-slate-300 text-sm md:text-base leading-relaxed">{insights[currentInsight].message}</p>
                                </div>
                            </div>

                            <button className="self-start md:self-center px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold rounded-lg transition-all flex items-center gap-2 border border-white/10 backdrop-blur-sm whitespace-nowrap group hover:scale-105 active:scale-95 shadow-lg shadow-black/20">
                                {insights[currentInsight].action}
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-0.5 transition-transform">bolt</span>
                            </button>
                        </div>

                        {/* Indicators */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                            {insights.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentInsight(idx)}
                                    className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentInsight ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'w-1.5 bg-white/20 hover:bg-white/40'}`}
                                    aria-label={`Go to insight ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-2">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Visão Geral</h2>
                            <p className="text-slate-500">Resumo de hoje, 24 de Outubro</p>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 shadow-sm transition-all hover:shadow">
                                <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                                Últimos 30 dias
                            </button>
                            <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark shadow-md shadow-primary/20 transition-all hover:shadow-lg active:scale-95">
                                <span className="material-symbols-outlined text-[20px]">add</span>
                                Nova Venda
                            </button>
                        </div>
                    </div>

                    {/* KPI Grid */}
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        {[
                            { title: 'Vendas (Mês)', value: 'R$ 340,70', sub: '0% da Meta', icon: 'payments', color: 'text-primary', bg: 'bg-primary/10' },
                            { title: 'Financeiro (Mês)', value: 'R$ 0,00', sub: 'Saldo Calculado', icon: 'account_balance', color: 'text-blue-600', bg: 'bg-blue-50' },
                            { title: 'Estoque Crítico', value: '1 Produto', sub: 'Abaixo do mínimo', icon: 'inventory_2', color: 'text-amber-500', bg: 'bg-amber-50' },
                            { title: 'Ticket Médio', value: 'R$ 42,59', sub: '8 Vendas', icon: 'trending_up', color: 'text-purple-600', bg: 'bg-purple-50' },
                        ].map((kpi, i) => (
                            <div key={i} className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] transition-all hover:-translate-y-1 hover:shadow-[0_8px_30px_-4px_rgba(6,81,237,0.1)] border border-slate-100">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{kpi.title}</p>
                                        <h3 className="mt-2 text-2xl font-bold text-slate-900">{kpi.value}</h3>
                                    </div>
                                    <div className={`rounded-xl p-3 ${kpi.bg} ${kpi.color}`}>
                                        <span className="material-symbols-outlined">{kpi.icon}</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                                    <span className={`material-symbols-outlined text-[18px] ${kpi.color}`}>arrow_upward</span>
                                    <span>{kpi.sub}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Charts Area */}
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                        {/* Evolution Chart */}
                        <div className="lg:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-slate-800">Evolução Financeira</h3>
                                <button className="text-sm font-medium text-primary hover:text-primary-dark">Ver Detalhes</button>
                            </div>
                            <div className="h-[300px] w-full bg-slate-50 rounded-xl flex items-center justify-center border-2 border-dashed border-slate-200">
                                <span className="text-slate-400 text-sm font-medium">Gráfico de Evolução (Placeholder)</span>
                            </div>
                        </div>

                        {/* Distribution Chart */}
                        <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                            <h3 className="font-bold text-slate-800 mb-6">Top Despesas</h3>
                            <div className="h-[300px] w-full flex items-center justify-center relative">
                                <div className="h-48 w-48 rounded-full border-[12px] border-slate-100 border-t-primary border-r-blue-400 transform -rotate-45"></div>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-bold text-slate-800">98%</span>
                                    <span className="text-xs font-medium text-slate-500">Aluguel</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders Table */}
                    <div className="rounded-2xl bg-white shadow-sm border border-slate-100 overflow-hidden">
                        <div className="border-b border-slate-100 px-6 py-4 flex items-center justify-between">
                            <h3 className="font-bold text-slate-800">Últimos Pedidos</h3>
                            <button className="text-sm font-medium text-primary hover:text-primary-dark">Ver Todos</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-600">
                                <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">ID</th>
                                        <th className="px-6 py-3 font-semibold">Cliente</th>
                                        <th className="px-6 py-3 font-semibold">Status</th>
                                        <th className="px-6 py-3 font-semibold">Valor</th>
                                        <th className="px-6 py-3 font-semibold text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {[1024, 1023, 1022].map((id) => (
                                        <tr key={id} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-900">#{id}</td>
                                            <td className="px-6 py-4">Cliente Exemplo</td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                                                    Concluído
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">R$ 150,00</td>
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
                    </div>
                </div>
            </div>
        </div>
    )
}
