import { useState, useEffect } from 'react'
import type { Activity, Opportunity } from '../../services/crmService'
import { crmService } from '../../services/crmService'

export default function CRMActivities() {
    const [activities, setActivities] = useState<(Activity & {
        oportunidade?: {
            titulo: string,
            estagio: string,
            cliente?: { nome_cliente: string },
            lead?: { nome: string }
        }
    })[]>([])
    const [opportunities, setOpportunities] = useState<Opportunity[]>([])

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [newActivity, setNewActivity] = useState<{
        oportunidade_id: string
        tipo: 'nota' | 'tarefa' | 'reuniao' | 'ligacao'
        descricao: string
        data_vencimento: string
        hora_vencimento: string
    }>({
        oportunidade_id: '',
        tipo: 'nota',
        descricao: '',
        data_vencimento: '',
        hora_vencimento: ''
    })
    const [searchTerm, setSearchTerm] = useState('')
    const [typeFilter, setTypeFilter] = useState('')
    const [statusFilter, setStatusFilter] = useState('pendentes') // 'pendentes', 'concluidas', 'todas'
    const [dateFilter, setDateFilter] = useState('qualquer_data') // 'qualquer_data', 'hoje', 'vencidas', 'a_vencer'
    const [sortOrder, setSortOrder] = useState('recentes') // 'recentes', 'antigas'

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        const [activitiesData, opportunitiesData] = await Promise.all([
            crmService.getAllActivities(),
            crmService.getOpportunities()
        ])
        console.log('Activities Data:', activitiesData)
        setActivities(activitiesData)
        setOpportunities(opportunitiesData)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (!newActivity.oportunidade_id) {
                alert('Selecione uma oportunidade')
                return
            }

            const payload: any = {
                oportunidade_id: newActivity.oportunidade_id,
                tipo: newActivity.tipo,
                descricao: newActivity.descricao,
                concluido: false
            }

            if (newActivity.data_vencimento) {
                const dateTime = new Date(`${newActivity.data_vencimento}T${newActivity.hora_vencimento || '12:00'}:00`)
                payload.data_vencimento = dateTime.toISOString()
            }

            await crmService.addActivity(payload)
            await loadData()
            setIsModalOpen(false)
            setNewActivity({
                oportunidade_id: '',
                tipo: 'nota',
                descricao: '',
                data_vencimento: '',
                hora_vencimento: ''
            })
        } catch (error) {
            console.error(error)
            alert('Erro ao criar atividade')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta atividade?')) return
        try {
            await crmService.deleteActivity(id)
            setActivities(prev => prev.filter(a => a.id !== id))
        } catch (error) {
            console.error(error)
            alert('Erro ao excluir atividade')
        }
    }

    // Filters
    const filteredActivities = activities.filter(act => {
        // Search
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch =
            act.descricao.toLowerCase().includes(searchLower) ||
            act.oportunidade?.titulo.toLowerCase().includes(searchLower) ||
            act.oportunidade?.cliente?.nome_cliente.toLowerCase().includes(searchLower) ||
            false

        // Type
        const matchesType = typeFilter ? act.tipo === typeFilter : true

        // Status
        let matchesStatus = true
        if (statusFilter === 'pendentes') matchesStatus = !act.concluido
        if (statusFilter === 'concluidas') matchesStatus = !!act.concluido

        // Date
        let matchesDate = true
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        if (act.data_vencimento) {
            const dueDate = new Date(act.data_vencimento)
            dueDate.setHours(0, 0, 0, 0)

            if (dateFilter === 'hoje') matchesDate = dueDate.getTime() === today.getTime()
            if (dateFilter === 'vencidas') matchesDate = dueDate < today && !act.concluido
            if (dateFilter === 'a_vencer') matchesDate = dueDate > today && !act.concluido
        } else {
            // If no due date, only match 'qualquer_data'
            if (dateFilter !== 'qualquer_data') matchesDate = false
        }

        return matchesSearch && matchesType && matchesStatus && matchesDate
    }).sort((a, b) => {
        const dateA = new Date(a.criado_em).getTime()
        const dateB = new Date(b.criado_em).getTime()
        return sortOrder === 'recentes' ? dateB - dateA : dateA - dateB
    })

    const getActivityLabel = (type: string) => {
        const map: Record<string, string> = {
            'nota': 'Nota',
            'tarefa': 'Tarefa',
            'reuniao': 'Reunião',
            'ligacao': 'Ligação'
        }
        return map[type] || type
    }

    // Relative Time Helper
    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

        if (diffInSeconds < 60) return 'agora'
        if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} min`
        if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} h`
        if (diffInSeconds < 604800) return `há ${Math.floor(diffInSeconds / 86400)} dias`
        return date.toLocaleDateString('pt-BR')
    }

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Atividades</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined">add</span>
                    Nova Atividade
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-1 min-w-[300px] relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar por descrição, oportunidade ou cliente..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    />
                </div>

                <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 outline-none focus:border-primary"
                >
                    <option value="pendentes">Pendentes</option>
                    <option value="concluidas">Concluídas</option>
                    <option value="todas">Todos os Status</option>
                </select>

                <select
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 outline-none focus:border-primary"
                >
                    <option value="">Todos os Tipos</option>
                    <option value="nota">Notas</option>
                    <option value="tarefa">Tarefas</option>
                    <option value="reuniao">Reuniões</option>
                    <option value="ligacao">Ligações</option>
                </select>

                <select
                    value={dateFilter}
                    onChange={e => setDateFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 outline-none focus:border-primary"
                >
                    <option value="qualquer_data">Qualquer Data</option>
                    <option value="hoje">Para Hoje</option>
                    <option value="vencidas">Vencidas</option>
                    <option value="a_vencer">A Vencer</option>
                </select>

                <button
                    onClick={() => setSortOrder(prev => prev === 'recentes' ? 'antigas' : 'recentes')}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                    <span className="material-symbols-outlined text-lg">schedule</span>
                    {sortOrder === 'recentes' ? 'Mais Recentes' : 'Mais Antigas'}
                </button>
            </div>

            {/* List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {activities.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        Nenhuma atividade encontrada.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {/* Header */}
                        <div className="bg-gray-50 px-6 py-3 grid grid-cols-12 gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            <div className="col-span-5">Atividade</div>
                            <div className="col-span-3">Oportunidade & Cliente</div>
                            <div className="col-span-2">Vencimento</div>
                            <div className="col-span-2 text-right">Criado em / Ações</div>
                        </div>

                        {/* Items */}
                        {filteredActivities.map(act => (
                            <div key={act.id} className="px-6 py-4 grid grid-cols-12 gap-4 items-start hover:bg-gray-50 transition-colors group">
                                <div className="col-span-5 flex gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${act.tipo === 'nota' ? 'bg-blue-100 text-blue-600' :
                                        act.concluido ? 'bg-green-100 text-green-600' :
                                            'bg-gray-100 text-gray-600'
                                        } ${act.tipo !== 'nota' && !act.concluido ? 'bg-emerald-100 text-emerald-600' : ''}`}>
                                        <span className="material-symbols-outlined text-sm">
                                            {act.tipo === 'nota' ? 'chat' :
                                                act.tipo === 'tarefa' ? 'check' :
                                                    act.tipo === 'reuniao' ? 'groups' : 'call'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-gray-900 text-sm whitespace-pre-wrap">{act.descricao}</p>
                                        <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded-full font-medium">
                                            {getActivityLabel(act.tipo)}
                                        </span>
                                    </div>
                                </div>
                                <div className="col-span-3">
                                    {act.oportunidade && (
                                        <div className="text-sm">
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-gray-900">{act.oportunidade.titulo}</p>
                                                <span className="bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wide font-bold">
                                                    {act.oportunidade.estagio}
                                                </span>
                                            </div>
                                            <p className="text-gray-500 text-xs">
                                                {act.oportunidade.cliente?.nome_cliente || act.oportunidade.lead?.nome || 'Sem cliente vinculado'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <div className="col-span-2">
                                    {act.data_vencimento ? (
                                        <span className={`text-sm flex items-center gap-1 ${new Date(act.data_vencimento) < new Date() && !act.concluido
                                            ? 'text-red-600 font-medium'
                                            : 'text-gray-600'
                                            }`}>
                                            <span className="material-symbols-outlined text-base">event</span>
                                            {new Date(act.data_vencimento).toLocaleDateString('pt-BR')}
                                        </span>
                                    ) : (
                                        <span className="text-gray-400 text-xs">-</span>
                                    )}
                                </div>
                                <div className="col-span-2 flex flex-col items-end gap-2">
                                    <span className="text-xs text-gray-400">{formatRelativeTime(act.criado_em)}</span>
                                    <button
                                        onClick={() => handleDelete(act.id)}
                                        className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        title="Excluir atividade"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">Nova Atividade</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Oportunidade</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    value={newActivity.oportunidade_id}
                                    onChange={e => setNewActivity({ ...newActivity, oportunidade_id: e.target.value })}
                                    required
                                >
                                    <option value="">Selecione a oportunidade...</option>
                                    {opportunities.map(opp => (
                                        <option key={opp.id} value={opp.id}>{opp.titulo}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                                <div className="flex gap-2">
                                    {[
                                        { id: 'nota', label: 'Nota' },
                                        { id: 'tarefa', label: 'Tarefa' },
                                        { id: 'reuniao', label: 'Reunião' },
                                        { id: 'ligacao', label: 'Ligação' }
                                    ].map((type) => (
                                        <button
                                            key={type.id}
                                            type="button"
                                            onClick={() => setNewActivity({ ...newActivity, tipo: type.id as any })}
                                            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium border transition-colors ${newActivity.tipo === type.id
                                                ? 'bg-primary text-white border-primary'
                                                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            {type.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea
                                    rows={3}
                                    value={newActivity.descricao}
                                    onChange={e => setNewActivity({ ...newActivity, descricao: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                    placeholder="Detalhes da atividade..."
                                    required
                                />
                            </div>

                            {newActivity.tipo !== 'nota' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Data</label>
                                        <input
                                            type="date"
                                            value={newActivity.data_vencimento}
                                            onChange={e => setNewActivity({ ...newActivity, data_vencimento: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Hora</label>
                                        <input
                                            type="time"
                                            value={newActivity.hora_vencimento}
                                            onChange={e => setNewActivity({ ...newActivity, hora_vencimento: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-hover shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}
