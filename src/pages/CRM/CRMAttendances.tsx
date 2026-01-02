import { useState, useEffect } from 'react'
import type { Attendance } from '../../services/crmService'
import { crmService } from '../../services/crmService'
import type { Customer } from '../../services/clientService'
import { clientService } from '../../services/clientService'

export default function CRMAttendances() {
    const [attendances, setAttendances] = useState<Attendance[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])
    // const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingId, setEditingId] = useState<string | null>(null)

    // Form State
    const [formData, setFormData] = useState({
        titulo: '',
        cliente_id: '',
        descricao: '',
        status: 'aberto', // aberto, em_andamento, resolvido, fechado
        prioridade: 'media' // baixa, media, alta, critica
    })

    // Filters
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('todos')
    const [priorityFilter, setPriorityFilter] = useState('todas')

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        // setLoading(true)
        const [attData, customersData] = await Promise.all([
            crmService.getAttendances(),
            clientService.getCustomers()
        ])
        setAttendances(attData)
        setCustomers(customersData)
        // setLoading(false)
    }

    const handleOpenModal = (attendance?: Attendance) => {
        if (attendance) {
            setEditingId(attendance.id)
            setFormData({
                titulo: attendance.titulo,
                cliente_id: attendance.cliente_id || '',
                descricao: attendance.descricao || '',
                status: attendance.status || 'aberto',
                prioridade: attendance.prioridade || 'media'
            })
        } else {
            setEditingId(null)
            setFormData({
                titulo: '',
                cliente_id: '',
                descricao: '',
                status: 'aberto',
                prioridade: 'media'
            })
        }
        setIsModalOpen(true)
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            if (editingId) {
                await crmService.updateAttendance(editingId, formData)
            } else {
                await crmService.createAttendance(formData)
            }
            await loadData()
            setIsModalOpen(false)
        } catch (error) {
            console.error(error)
            alert('Erro ao salvar atendimento')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este atendimento?')) return
        try {
            await crmService.deleteAttendance(id)
            setAttendances(prev => prev.filter(a => a.id !== id))
        } catch (error) {
            console.error(error)
            alert('Erro ao excluir atendimento')
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'aberto': return 'bg-blue-100 text-blue-700'
            case 'em_andamento': return 'bg-yellow-100 text-yellow-700'
            case 'resolvido': return 'bg-green-100 text-green-700'
            case 'fechado': return 'bg-gray-100 text-gray-700'
            default: return 'bg-gray-100 text-gray-600'
        }
    }

    const getPriorityColor = (prioridade: string) => {
        switch (prioridade) {
            case 'alta': return 'text-red-600 bg-red-50'
            case 'critica': return 'text-red-700 bg-red-100 font-bold'
            case 'media': return 'text-yellow-600 bg-yellow-50'
            case 'baixa': return 'text-blue-600 bg-blue-50'
            default: return 'text-gray-600'
        }
    }

    const getStatusLabel = (status: string) => {
        const map: Record<string, string> = {
            'aberto': 'Aberto',
            'em_andamento': 'Em Andamento',
            'resolvido': 'Resolvido',
            'fechado': 'Fechado'
        }
        return map[status] || status
    }

    const filteredAttendances = attendances.filter(att => {
        const matchSearch = att.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            att.cliente?.nome?.toLowerCase().includes(searchTerm.toLowerCase())
        const matchStatus = statusFilter === 'todos' ? true : att.status === statusFilter
        const matchPriority = priorityFilter === 'todas' ? true : att.prioridade === priorityFilter
        return matchSearch && matchStatus && matchPriority
    })

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Atendimentos</h1>
                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-hover transition-colors shadow-sm"
                >
                    <span className="material-symbols-outlined">add</span>
                    Novo Atendimento
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex-1 min-w-[300px] relative">
                    <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400">search</span>
                    <input
                        type="text"
                        placeholder="Buscar por título ou cliente..."
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
                    <option value="todos">Todos os Status</option>
                    <option value="aberto">Aberto</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="resolvido">Resolvido</option>
                    <option value="fechado">Fechado</option>
                </select>

                <select
                    value={priorityFilter}
                    onChange={e => setPriorityFilter(e.target.value)}
                    className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 outline-none focus:border-primary"
                >
                    <option value="todas">Todas Prioridades</option>
                    <option value="baixa">Baixa</option>
                    <option value="media">Média</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Título</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Cliente</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Prioridade</th>
                            <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {filteredAttendances.map(att => (
                            <tr key={att.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => handleOpenModal(att)}>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">{att.titulo}</div>
                                    <div className="text-xs text-gray-500 mt-0.5 truncate max-w-[300px]">{att.descricao}</div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    {att.cliente?.nome || '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(att.status)}`}>
                                        {getStatusLabel(att.status)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-md ${getPriorityColor(att.prioridade)}`}>
                                        {att.prioridade.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-sm font-medium">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(att.id); }}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {filteredAttendances.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Nenhum atendimento encontrado.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-800">
                                {editingId ? 'Editar Atendimento' : 'Novo Atendimento'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.titulo}
                                    onChange={e => setFormData({ ...formData, titulo: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    placeholder="Ex: Problema na emissão de nota"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                                <select
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    value={formData.cliente_id}
                                    onChange={e => setFormData({ ...formData, cliente_id: e.target.value })}
                                >
                                    <option value="">Selecione um cliente (opcional)</option>
                                    {customers.map(c => (
                                        <option key={c.id} value={c.id}>{c.nome_cliente}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        value={formData.status}
                                        onChange={e => setFormData({ ...formData, status: e.target.value })}
                                    >
                                        <option value="aberto">Aberto</option>
                                        <option value="em_andamento">Em Andamento</option>
                                        <option value="resolvido">Resolvido</option>
                                        <option value="fechado">Fechado</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
                                    <select
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        value={formData.prioridade}
                                        onChange={e => setFormData({ ...formData, prioridade: e.target.value })}
                                    >
                                        <option value="baixa">Baixa</option>
                                        <option value="media">Média</option>
                                        <option value="alta">Alta</option>
                                        <option value="critica">Crítica</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                                <textarea
                                    rows={4}
                                    value={formData.descricao}
                                    onChange={e => setFormData({ ...formData, descricao: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none resize-none"
                                    placeholder="Descreva o atendimento..."
                                />
                            </div>

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
