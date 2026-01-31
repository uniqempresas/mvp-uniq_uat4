import { useEffect, useState } from 'react'
import {
    crmDashboardService,
    type CRMKPIs,
    type FunnelData,
    type RecentActivity,
    type RecentOpportunity
} from '../../services/crmDashboardService'
import { formatCurrency } from '../../utils/format'

export default function CRMDashboard() {
    const [loading, setLoading] = useState(true)
    const [kpis, setKpis] = useState<CRMKPIs>({
        totalOpportunities: 0,
        totalValue: 0,
        wonValue: 0,
        conversionRate: 0
    })
    const [funnelData, setFunnelData] = useState<FunnelData[]>([])
    const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
    const [recentOpps, setRecentOpps] = useState<RecentOpportunity[]>([])

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        try {
            setLoading(true)
            const [kpiData, funnel, activities, opps] = await Promise.all([
                crmDashboardService.getKPIs(),
                crmDashboardService.getFunnelData(),
                crmDashboardService.getRecentActivities(),
                crmDashboardService.getRecentOpportunities()
            ])

            setKpis(kpiData)
            setFunnelData(funnel)
            setRecentActivities(activities)
            setRecentOpps(opps)
        } catch (error) {
            console.error('Error loading CRM dashboard:', error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* Header */}
            <header className="flex-none px-8 py-6 pb-2 bg-white border-b border-gray-200">
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-gray-900 font-medium">CRM</span>
                </nav>

                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard CRM</h1>
                        <p className="text-slate-500 mt-1">Visão geral do seu pipeline de vendas</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={loadDashboardData}
                            className="flex items-center gap-2 bg-white border border-gray-200 hover:bg-gray-50 text-slate-600 px-4 py-2.5 rounded-xl font-medium transition-all shadow-sm"
                            title="Atualizar"
                        >
                            <span className="material-symbols-outlined">refresh</span>
                            Atualizar
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <KpiCard
                            title="Oportunidades em Aberto"
                            value={kpis.totalOpportunities}
                            icon="view_kanban"
                            color="blue"
                        />
                        <KpiCard
                            title="Valor em Pipeline"
                            value={formatCurrency(kpis.totalValue)}
                            icon="attach_money"
                            color="amber"
                        />
                        <KpiCard
                            title="Vendas Ganhas"
                            value={formatCurrency(kpis.wonValue)}
                            icon="trophy"
                            color="emerald"
                        />
                        <KpiCard
                            title="Taxa de Conversão"
                            value={`${kpis.conversionRate.toFixed(1)}%`}
                            icon="donut_large"
                            color="purple"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Funnel Chart */}
                        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
                                <h2 className="font-semibold text-slate-900">Funil de Vendas</h2>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    {funnelData.map((stage) => (
                                        <div key={stage.stageId} className="relative">
                                            <div className="flex items-center justify-between mb-1 text-sm">
                                                <div className="flex items-center gap-2">
                                                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: stage.color }}></span>
                                                    <span className="font-medium text-slate-700">{stage.stageName}</span>
                                                </div>
                                                <div className="flex gap-4 text-slate-600">
                                                    <span>{stage.count} opps</span>
                                                    <span className="font-medium">{formatCurrency(stage.value)}</span>
                                                </div>
                                            </div>
                                            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${(stage.count / (kpis.totalOpportunities || 1)) * 100}%`,
                                                        backgroundColor: stage.color
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                    {funnelData.length === 0 && (
                                        <div className="text-center py-10 text-slate-400">
                                            Nenhum dado no funil
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100">
                                <h2 className="font-semibold text-slate-900">Atividades Recentes</h2>
                            </div>
                            <div className="p-0">
                                <div className="divide-y divide-slate-100">
                                    {recentActivities.map((activity) => (
                                        <div key={activity.id} className="p-4 hover:bg-slate-50 transition-colors">
                                            <div className="flex gap-3">
                                                <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${activity.type === 'tarefa' ? 'bg-blue-100 text-blue-600' :
                                                    activity.type === 'reuniao' ? 'bg-purple-100 text-purple-600' :
                                                        activity.type === 'ligacao' ? 'bg-green-100 text-green-600' :
                                                            'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    <span className="material-symbols-outlined text-sm">
                                                        {activity.type === 'tarefa' ? 'task_alt' :
                                                            activity.type === 'reuniao' ? 'groups' :
                                                                activity.type === 'ligacao' ? 'call' : 'sticky_note_2'}
                                                    </span>
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-medium text-slate-900 truncate">
                                                        {activity.description}
                                                    </p>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        {activity.opportunityTitle} • {new Date(activity.date).toLocaleDateString('pt-BR')}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {recentActivities.length === 0 && (
                                        <div className="text-center py-8 text-slate-400 text-sm">
                                            Nenhuma atividade recente
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Opportunities Table */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100">
                            <h2 className="font-semibold text-slate-900">Novas Oportunidades</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs text-slate-500 bg-slate-50 uppercase font-medium">
                                    <tr>
                                        <th className="px-6 py-3">Oportunidade</th>
                                        <th className="px-6 py-3">Cliente</th>
                                        <th className="px-6 py-3">Estágio</th>
                                        <th className="px-6 py-3">Valor</th>
                                        <th className="px-6 py-3">Criado em</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {recentOpps.map((opp) => (
                                        <tr key={opp.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-3 font-medium text-slate-900">{opp.title}</td>
                                            <td className="px-6 py-3 text-slate-600">{opp.clientName || '-'}</td>
                                            <td className="px-6 py-3">
                                                <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                                                    {opp.stage}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 font-medium text-slate-900">
                                                {formatCurrency(opp.value)}
                                            </td>
                                            <td className="px-6 py-3 text-slate-500">
                                                {new Date(opp.createdAt).toLocaleDateString('pt-BR')}
                                            </td>
                                        </tr>
                                    ))}
                                    {recentOpps.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                                                Nenhuma oportunidade encontrada
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

function KpiCard({ title, value, icon, color }: { title: string, value: string | number, icon: string, color: string }) {
    const colorClasses: Record<string, string> = {
        blue: 'bg-blue-50 text-blue-600',
        amber: 'bg-amber-50 text-amber-600',
        emerald: 'bg-emerald-50 text-emerald-600',
        purple: 'bg-purple-50 text-purple-600',
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <h3 className="text-2xl font-bold text-slate-900 mt-2">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color] || 'bg-slate-50 text-slate-600'}`}>
                    <span className="material-symbols-outlined">{icon}</span>
                </div>
            </div>
        </div>
    )
}
