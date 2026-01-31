import React, { useState, useEffect } from 'react'
import { crmService, type FunnelStage, type Opportunity, type OpportunityProduct } from '../../services/crmService'
import { productService, type Product } from '../../services/productService'
import { clientService, type Client, type Customer } from '../../services/clientService'

// Helper to extract color name from tailwind class string (e.g. "bg-blue-100" -> "blue")
const getBaseColor = (colorClass: string) => {
    if (!colorClass) return 'gray'
    const match = colorClass.match(/(?:bg|text|border)-(\w+)-/)
    return match ? match[1] : 'gray'
}

export default function CRMOpportunities() {
    const [stages, setStages] = useState<FunnelStage[]>([])
    const [opportunities, setOpportunities] = useState<Opportunity[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null)
    const [activeTab, setActiveTab] = useState('detalhes')

    // New States
    const [leads, setLeads] = useState<Client[]>([]) // crm_leads
    const [customers, setCustomers] = useState<Customer[]>([]) // me_cliente
    const [productsList, setProductsList] = useState<Product[]>([])
    const [oppProducts, setOppProducts] = useState<OpportunityProduct[]>([])
    const [productForm, setProductForm] = useState({
        produto_id: '',
        quantidade: 1,
        preco_unitario: 0
    })

    // Activities State
    const [activities, setActivities] = useState<any[]>([])
    const [activityForm, setActivityForm] = useState({
        tipo: 'nota', // Default to DB value
        descricao: '',
        data_vencimento: ''
    })

    const fetchActivities = async (oppId: string) => {
        console.log('Fetching activities for:', oppId)
        const acts = await crmService.getActivities(oppId)
        console.log('Fetched activities:', acts)
        setActivities(acts)
    }

    // Call this when modal opens if ID exists
    useEffect(() => {
        if (selectedOpp?.id) {
            fetchActivities(selectedOpp.id)
        } else {
            setActivities([])
        }
    }, [selectedOpp?.id])

    const handleAddActivity = async () => {
        if (!selectedOpp?.id || !activityForm.descricao) return
        if (activityForm.tipo !== 'nota' && !activityForm.data_vencimento) {
            alert('Data de vencimento é obrigatória para este tipo de atividade')
            return
        }

        try {
            await crmService.addActivity({
                oportunidade_id: selectedOpp.id,
                tipo: activityForm.tipo as any,
                descricao: activityForm.descricao,
                data_vencimento: activityForm.data_vencimento ? new Date(activityForm.data_vencimento).toISOString() : undefined,

                concluido: false
            })
            setActivityForm({ tipo: 'nota', descricao: '', data_vencimento: '' })
            fetchActivities(selectedOpp.id)
        } catch (error) {
            console.error('Error adding activity:', error)
            alert('Erro ao adicionar atividade')
        }
    }

    const handleToggleActivity = async (id: string, currentStatus: boolean) => {
        try {
            await crmService.updateActivity(id, { concluido: !currentStatus })
            setActivities(prev => prev.map(a => a.id === id ? { ...a, concluido: !currentStatus } : a))
        } catch (error) {
            console.error(error)
        }
    }

    const handleDeleteActivity = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir esta atividade?')) return
        try {
            await crmService.deleteActivity(id)
            setActivities(prev => prev.filter(a => a.id !== id))
        } catch (error) {
            console.error('Error deleting activity:', error)
            alert('Erro ao excluir atividade')
        }
    }

    // Helper to map DB types to Labels
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

    // Value masking state
    const [displayValue, setDisplayValue] = useState('')

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const [stagesData, oppsData, leadsData, customersData, prodsData] = await Promise.all([
                crmService.getStages(),
                crmService.getOpportunities(),
                clientService.getClients(), // Returns crm_leads
                clientService.getCustomers(), // Returns me_cliente
                productService.getProducts()
            ])
            setStages(stagesData)
            setOpportunities(oppsData)
            setLeads(leadsData)
            setCustomers(customersData)
            setProductsList(prodsData)
        } catch (error) {
            console.error(error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    // Auto-update total value based on products
    useEffect(() => {
        if (!selectedOpp || oppProducts.length === 0) return

        const totalProducts = oppProducts.reduce((acc, curr) => acc + (curr.total || 0), 0)

        if (selectedOpp.valor !== totalProducts) {
            setSelectedOpp(prev => prev ? { ...prev, valor: totalProducts } : null)
            setDisplayValue(totalProducts.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
        }
    }, [oppProducts]) // removed selectedOpp from deps to avoid infinite loop, relying on internal check

    const handleOpenModal = async (opp: Opportunity | null = null) => {
        // Default object for new Opportunity
        const newOpp: Partial<Opportunity> = {
            titulo: '',
            valor: 0,
            estagio: stages[0]?.nome || '',
            data_fechamento: new Date().toISOString().split('T')[0] // Today YYYY-MM-DD
        }

        const oppToSet = opp || (newOpp as Opportunity)
        setSelectedOpp(oppToSet)
        setIsModalOpen(true)
        setProductForm({ produto_id: '', quantidade: 1, preco_unitario: 0 })

        // Init value mask
        if (oppToSet.valor) {
            setDisplayValue(oppToSet.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
        } else {
            setDisplayValue(Number(0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
        }

        if (opp?.id) {
            const prods = await crmService.getOpportunityProducts(opp.id)
            setOppProducts(prods)
        } else {
            setOppProducts([])
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setSelectedOpp(prev => prev ? { ...prev, [name]: value } : { [name]: value } as any)
    }

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '')
        const numberVal = Number(raw) / 100

        if (selectedOpp) {
            setSelectedOpp({ ...selectedOpp, valor: numberVal })
        } else {
            setSelectedOpp(prev => prev ? { ...prev, valor: numberVal } : { valor: numberVal } as Opportunity)
        }

        setDisplayValue(numberVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
    }

    const handleAddProduct = () => {
        if (!productForm.produto_id) return

        const prod = productsList.find(p => String(p.id) === productForm.produto_id)
        const qtd = Number(productForm.quantidade) || 1
        const unitPrice = Number(productForm.preco_unitario) || 0

        const newProductItem: OpportunityProduct = {
            id: `temp-${Date.now()}`, // Temporary ID for UI
            oportunidade_id: selectedOpp?.id || '',
            produto_id: productForm.produto_id,
            quantidade: qtd,
            preco_unitario: unitPrice,
            total: qtd * unitPrice,
            produto: {
                nome_produto: prod?.nome_produto || 'Produto'
            }
        }

        setOppProducts(prev => [...prev, newProductItem])
        setProductForm({ produto_id: '', quantidade: 1, preco_unitario: 0 })
    }

    const handleDeleteProduct = (id: string) => {
        if (!confirm('Remover produto da lista?')) return
        setOppProducts(prev => prev.filter(p => p.id !== id))
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedOpp?.titulo || !selectedOpp?.estagio) {
            alert('Preencha os campos obrigatórios')
            return
        }

        try {
            await crmService.saveOpportunityFull(selectedOpp, oppProducts.map(p => ({
                oportunidade_id: p.oportunidade_id, // RPC handles logic, but let's pass it
                produto_id: p.produto_id,
                quantidade: p.quantidade,
                preco_unitario: p.preco_unitario,
                total: p.total
            })))

            setIsModalOpen(false)
            fetchData()
        } catch (error: any) {
            console.error('Save error:', error)
            alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`)
        }
    }

    const handleDeleteOpp = async () => {
        if (!selectedOpp?.id) return
        if (!confirm('Tem certeza que deseja excluir esta oportunidade?')) return

        try {
            await crmService.deleteOpportunity(selectedOpp.id)
            setOpportunities(prev => prev.filter(o => o.id !== selectedOpp.id))
            setIsModalOpen(false)
        } catch (error) {
            console.error('Error deleting opportunity:', error)
            alert('Erro ao excluir oportunidade')
        }
    }

    // Filter opportunities by stage name (case insensitive matching)
    const getOppsByStage = (stageName: string) => {
        return opportunities.filter(op => op.estagio.toLowerCase() === stageName.toLowerCase())
    }

    const handleDragStart = (e: React.DragEvent, oppId: string) => {
        e.dataTransfer.setData('oppId', oppId)
    }

    const handleDrop = async (e: React.DragEvent, newStage: string) => {
        e.preventDefault()
        const oppId = e.dataTransfer.getData('oppId')
        if (!oppId) return

        // 1. Optimistic Update
        const oppToUpdate = opportunities.find(o => o.id === oppId)
        if (!oppToUpdate || oppToUpdate.estagio === newStage) return

        setOpportunities(prev => prev.map(opp =>
            opp.id === oppId ? { ...opp, estagio: newStage } : opp
        ))

        // 2. Persist
        try {
            await crmService.updateOpportunity(oppId, { estagio: newStage })
        } catch (err) {
            console.error('Failed to update stage', err)
            // Revert on failure
            setOpportunities(prev => prev.map(opp =>
                opp.id === oppId ? { ...opp, estagio: oppToUpdate.estagio } : opp
            ))
            alert('Falha ao atualizar estágio')
        }
    }

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden relative bg-[#F3F4F6]">
            {/* Header */}
            <header className="flex-none px-8 py-6 pb-2 bg-white border-b border-gray-200 shrink-0 z-10">
                <nav className="flex items-center gap-2 text-sm text-gray-500">
                    <a className="hover:text-primary transition-colors" href="#">Dashboard</a>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-gray-900 font-medium">Oportunidades</span>
                </nav>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            Oportunidades
                            <span className="bg-gray-100 text-gray-500 text-sm px-2.5 py-0.5 rounded-full font-bold border border-gray-200">v2.1</span>
                        </h1>
                        <p className="text-slate-500 mt-1">Gerencie seu funil de vendas e acompanhe o progresso.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-50">
                            <span className="material-symbols-outlined">search</span>
                        </button>
                        <button className="p-2 text-slate-400 hover:text-primary transition-colors rounded-lg hover:bg-gray-50">
                            <span className="material-symbols-outlined">filter_list</span>
                        </button>
                        <div className="h-8 w-px bg-gray-200 mx-1"></div>
                        <button
                            onClick={() => handleOpenModal()}
                            className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm shadow-primary/30 transition-all active:scale-95"
                        >
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            Nova Oportunidade
                        </button>
                    </div>
                </div>
            </header>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto overflow-y-hidden p-6 kanban-container bg-[#F3F4F6]">
                <div className="flex gap-4 h-full min-w-max pb-2">
                    {isLoading ? (
                        <div className="p-8 text-slate-500">Carregando quadro...</div>
                    ) : (
                        stages.map(stage => {
                            const stageOpps = getOppsByStage(stage.nome)
                            const totalValue = stageOpps.reduce((acc, curr) => acc + Number(curr.valor || 0), 0)
                            const colorName = getBaseColor(stage.cor)

                            // Dynamic styles based on color
                            // Note: Safelist might be needed for dynamic tailwind classes in production build if not present in source.
                            // For this environment, standard colors (blue, green, orange, red, gray, purple) usually work if classes exist elsewhere.
                            // Using style objects for dynamic colors is safer for arbitrary colors.
                            const borderTopColor = {
                                orange: '#F97316',
                                blue: '#3B82F6',
                                emerald: '#10B981',
                                green: '#10B981',
                                purple: '#A855F7',
                                red: '#EF4444',
                                gray: '#6B7280',
                            }[colorName] || '#6B7280'

                            return (
                                <div key={stage.id} className="w-80 flex flex-col h-full bg-gray-50 rounded-xl border border-gray-200 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 z-10" style={{ backgroundColor: borderTopColor }}></div>

                                    <div className="p-4 border-b border-gray-200">
                                        <div className="flex justify-between items-center mb-1">
                                            <h3 className="font-bold text-gray-800 text-base capitalize">{stage.nome}</h3>
                                            <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-0.5 rounded-full">{stageOpps.length}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-xs text-gray-500 font-medium">
                                                {totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                            </p>
                                            <div className="h-1 w-full max-w-[100px] bg-gray-200 rounded-full overflow-hidden ml-2">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{ width: '50%', backgroundColor: borderTopColor }} // Mock progress
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div
                                        className="p-3 flex-1 overflow-y-auto space-y-3 custom-scrollbar"
                                        onDragOver={(e) => e.preventDefault()}
                                        onDrop={(e) => handleDrop(e, stage.nome)}
                                    >
                                        {stageOpps.length === 0 ? (
                                            <div className="text-center p-4 mt-4 opacity-50">
                                                <span className="material-symbols-outlined text-gray-300 text-4xl mb-2">inbox</span>
                                                <p className="text-sm text-gray-400">Vazio</p>
                                            </div>
                                        ) : (
                                            stageOpps.map(opp => {
                                                const clientName = customers.find(c => c.id === opp.cliente_id)?.nome_cliente
                                                    || leads.find(l => l.id === opp.lead_id)?.nome
                                                    || 'Sem cliente'

                                                return (
                                                    <div
                                                        key={opp.id}
                                                        draggable
                                                        onDragStart={(e) => handleDragStart(e, opp.id)}
                                                        onClick={() => handleOpenModal(opp)}
                                                        className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition-shadow group relative active:cursor-grabbing"
                                                    >
                                                        <h4 className="font-semibold text-gray-800 mb-1 leading-snug">{opp.titulo}</h4>
                                                        <div className="flex items-baseline gap-1 mb-2">
                                                            <span className="text-xs text-gray-400">Valor:</span>
                                                            <span className="text-sm font-medium text-gray-600">
                                                                {Number(opp.valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                            </span>
                                                        </div>

                                                        <div className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wide">
                                                            {clientName}
                                                        </div>

                                                        <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-1">
                                                            <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                                                                <span className="material-symbols-outlined text-sm">calendar_today</span>
                                                                <span>{new Date(opp.created_at || '').toLocaleDateString('pt-BR')}</span>
                                                            </div>
                                                            {/* Avatar Placeholder */}
                                                            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-bold border border-white shadow-sm">
                                                                OP
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        )}
                                    </div>

                                    <div className="p-3">
                                        <button
                                            onClick={() => handleOpenModal({ estagio: stage.nome } as any)}
                                            className="w-full py-2 flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium border border-transparent hover:border-gray-200 border-dashed"
                                        >
                                            <span className="material-symbols-outlined text-base">add</span>
                                            Adicionar
                                        </button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
                    <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-[fade-in-up_0.3s_ease-out]">
                        <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
                            <h2 className="text-xl font-bold text-gray-900">
                                {selectedOpp?.id ? 'Detalhes da Oportunidade' : 'Nova Oportunidade'}
                            </h2>
                            <div className="flex items-center gap-2">
                                {selectedOpp?.id && (
                                    <button
                                        onClick={handleDeleteOpp}
                                        className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded-full hover:bg-red-50"
                                        title="Excluir Oportunidade"
                                    >
                                        <span className="material-symbols-outlined">delete</span>
                                    </button>
                                )}
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="px-6 pt-2 bg-white border-b border-gray-200">
                            <div className="flex gap-6 overflow-x-auto no-scrollbar">
                                {['detalhes', 'atividades', 'produtos'].map(tab => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab)}
                                        className={`pb-3 border-b-2 font-medium text-sm transition-colors whitespace-nowrap capitalize ${activeTab === tab
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900/50">
                            {activeTab === 'detalhes' && (
                                <form className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <label className="block">
                                            <span className="text-sm font-semibold text-gray-700 mb-1.5 block">Lead (crm_leads)</span>
                                            <div className="flex gap-2">
                                                <select
                                                    className="w-full h-10 rounded-lg border-gray-300 bg-white text-gray-900 focus:border-primary focus:ring-primary/20 transition-all text-sm px-3 border"
                                                    value={selectedOpp?.lead_id || ''}
                                                    name="lead_id"
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Selecione um Lead...</option>
                                                    {leads.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                                                </select>
                                                <button type="button" className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
                                                    <span className="material-symbols-outlined">add</span>
                                                </button>
                                            </div>
                                        </label>
                                        <label className="block">
                                            <span className="text-sm font-semibold text-gray-700 mb-1.5 block">Cliente (me_cliente)</span>
                                            <div className="flex gap-2">
                                                <select
                                                    className="w-full h-10 rounded-lg border-gray-300 bg-white text-gray-900 focus:border-primary focus:ring-primary/20 transition-all text-sm px-3 border"
                                                    value={selectedOpp?.cliente_id || ''}
                                                    name="cliente_id"
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Selecione um Cliente...</option>
                                                    {customers.map(c => <option key={c.id} value={c.id}>{c.nome_cliente}</option>)}
                                                </select>
                                                <button type="button" className="w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-600 transition-colors">
                                                    <span className="material-symbols-outlined">add</span>
                                                </button>
                                            </div>
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 gap-4">
                                        <label className="block">
                                            <span className="text-sm font-semibold text-gray-700 mb-1.5 block">Título *</span>
                                            <div className="relative">
                                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-lg">shopping_bag</span>
                                                <input
                                                    className="w-full pl-10 h-10 rounded-lg border-gray-300 bg-white text-gray-900 focus:border-primary focus:ring-primary/20 transition-all text-sm px-3 border"
                                                    type="text"
                                                    value={selectedOpp?.titulo || ''}
                                                    onChange={handleChange}
                                                    name="titulo"
                                                />
                                            </div>
                                        </label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <label className="block">
                                                <span className="text-sm font-semibold text-gray-700 mb-1.5 block">Valor (R$)</span>
                                                <input
                                                    className="w-full h-10 rounded-lg border-gray-300 bg-white text-gray-900 focus:border-primary focus:ring-primary/20 transition-all text-sm px-3 border"
                                                    type="text"
                                                    value={displayValue}
                                                    onChange={handleValueChange}
                                                    name="valor"
                                                    placeholder="R$ 0,00"
                                                />
                                            </label>
                                            <label className="block">
                                                <span className="text-sm font-semibold text-gray-700 mb-1.5 block">Data Fechamento</span>
                                                <input
                                                    className="w-full h-10 rounded-lg border-gray-300 bg-white text-gray-900 focus:border-primary focus:ring-primary/20 transition-all text-sm px-3 border"
                                                    type="date"
                                                    value={selectedOpp?.data_fechamento || ''}
                                                    onChange={handleChange}
                                                    name="data_fechamento"
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    <label className="block">
                                        <span className="text-sm font-semibold text-gray-700 mb-1.5 block">Estágio</span>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-lg">label</span>
                                            <select
                                                className="w-full pl-10 h-10 rounded-lg border-gray-300 bg-white text-gray-900 focus:border-primary focus:ring-primary/20 transition-all text-sm px-3 border"
                                                value={selectedOpp?.estagio || ''}
                                                onChange={handleChange}
                                                name="estagio"
                                            >
                                                {stages.map(s => (
                                                    <option key={s.id} value={s.nome}>{s.nome}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </label>

                                    {/* Products Section */}
                                    <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mt-6">
                                        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-4">
                                            <div className="md:col-span-5">
                                                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Produto</label>
                                                <select
                                                    id="product-select"
                                                    name="product-select"
                                                    className="w-full rounded-lg border-gray-300 text-sm py-2"
                                                    value={productForm.produto_id}
                                                    onChange={e => {
                                                        const selectedId = e.target.value
                                                        const prod = productsList.find(p => String(p.id) === selectedId)
                                                        const pPrice = Number(prod?.preco || 0)
                                                        setProductForm(prev => ({
                                                            ...prev,
                                                            produto_id: selectedId,
                                                            preco_unitario: pPrice
                                                        }))
                                                    }}
                                                >
                                                    <option value="">Selecione...</option>
                                                    {productsList.map(p => <option key={p.id} value={p.id}>{p.nome_produto}</option>)}
                                                </select>
                                            </div>
                                            <div className="md:col-span-2">
                                                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Qtd</label>
                                                <input
                                                    id="product-qty"
                                                    name="product-qty"
                                                    className="w-full rounded-lg border-gray-300 text-sm py-2"
                                                    type="number"
                                                    value={productForm.quantidade}
                                                    onChange={e => setProductForm(prev => ({ ...prev, quantidade: Number(e.target.value) }))}
                                                />
                                            </div>
                                            <div className="md:col-span-3">
                                                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Preço Unit.</label>
                                                <input
                                                    id="product-price"
                                                    name="product-price"
                                                    className="w-full rounded-lg border-gray-300 text-sm py-2"
                                                    type="number"
                                                    value={productForm.preco_unitario}
                                                    onChange={e => setProductForm(prev => ({ ...prev, preco_unitario: Number(e.target.value) }))}
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <button
                                                    type="button"
                                                    onClick={handleAddProduct}
                                                    className="w-full bg-emerald-400 hover:bg-emerald-500 text-white font-medium text-sm py-2 rounded-lg shadow-sm transition-colors"
                                                >
                                                    Adicionar
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                            <table className="w-full text-sm text-left">
                                                <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-200">
                                                    <tr>
                                                        <th className="px-6 py-3 font-bold">Produto</th>
                                                        <th className="px-6 py-3 font-bold text-center">Qtd</th>
                                                        <th className="px-6 py-3 font-bold text-right">Unitário</th>
                                                        <th className="px-6 py-3 font-bold text-right">Total</th>
                                                        <th className="px-6 py-3"></th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {oppProducts.map(item => (
                                                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                            <td className="px-6 py-4 font-medium">{item.produto?.nome_produto || 'Produto'}</td>
                                                            <td className="px-6 py-4 text-center">{item.quantidade}</td>
                                                            <td className="px-6 py-4 text-right">
                                                                {item.preco_unitario.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                            </td>
                                                            <td className="px-6 py-4 text-right font-bold">
                                                                {(item.quantidade * item.preco_unitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                            </td>
                                                            <td className="px-6 py-4 text-right">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDeleteProduct(item.id)}
                                                                    className="text-gray-400 hover:text-red-500 transition-colors"
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">delete_outline</span>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                                <tfoot className="bg-gray-50 border-t border-gray-200">
                                                    <tr>
                                                        <td className="px-6 py-4 text-right font-bold" colSpan={3}>Total Geral:</td>
                                                        <td className="px-6 py-4 text-right font-bold text-lg">
                                                            {oppProducts.reduce((acc, curr) => acc + (curr.quantidade * curr.preco_unitario), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                        </td>
                                                        <td></td>
                                                    </tr>
                                                </tfoot>
                                            </table>
                                        </div>

                                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex justify-center mt-4">
                                            <button type="button" className="flex items-center gap-2 text-gray-600 hover:text-primary font-medium transition-colors">
                                                <span className="material-symbols-outlined">description</span> Gerar Proposta PDF
                                            </button>
                                        </div>
                                    </div>


                                    {/* Action Buttons */}
                                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="text-gray-600 hover:text-gray-900 font-medium text-sm px-4 py-2 rounded-lg transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleSave}
                                            className="bg-primary hover:bg-emerald-600 text-white font-medium text-sm px-5 py-2 rounded-lg shadow-sm flex items-center gap-2 transition-all"
                                        >
                                            <span className="material-symbols-outlined text-lg">save</span> Salvar
                                        </button>
                                    </div>
                                </form >
                            )
                            }
                            {activeTab === 'atividades' && (
                                <div className="space-y-6">
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                                            {[
                                                { id: 'nota', label: 'Nota', icon: 'chat_bubble_outline' },
                                                { id: 'tarefa', label: 'Tarefa', icon: 'check_box' },
                                                { id: 'reuniao', label: 'Reunião', icon: 'calendar_today' },
                                                { id: 'ligacao', label: 'Ligação', icon: 'call' }
                                            ].map(item => (
                                                <button
                                                    key={item.id}
                                                    type="button"
                                                    onClick={() => setActivityForm(prev => ({ ...prev, tipo: item.id }))}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors border ${activityForm.tipo === item.id
                                                        ? 'bg-gray-100 border-gray-300 text-gray-900 shadow-sm'
                                                        : 'bg-white border-transparent text-gray-500 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    <span className="material-symbols-outlined text-lg">
                                                        {item.icon}
                                                    </span>
                                                    {item.label}
                                                </button>
                                            ))}
                                        </div>

                                        <textarea
                                            id="activity-desc"
                                            name="activity-desc"
                                            className="w-full rounded-lg border-gray-300 text-sm p-3 focus:border-primary focus:ring-primary/20 min-h-[100px] mb-3"
                                            placeholder="Descreva a atividade..."
                                            value={activityForm.descricao}
                                            onChange={e => setActivityForm(prev => ({ ...prev, descricao: e.target.value }))}
                                        />

                                        <div className="flex items-center justify-between">
                                            {activityForm.tipo !== 'nota' ? (
                                                <div className="relative">
                                                    <input
                                                        id="activity-date"
                                                        name="activity-date"
                                                        type="datetime-local"
                                                        className="pl-3 pr-3 py-2 rounded-lg border border-gray-300 text-sm focus:border-primary focus:ring-primary/20"
                                                        value={activityForm.data_vencimento}
                                                        onChange={e => setActivityForm(prev => ({ ...prev, data_vencimento: e.target.value }))}
                                                    />
                                                </div>
                                            ) : <div></div>}

                                            <button
                                                type="button"
                                                onClick={handleAddActivity}
                                                className="bg-emerald-400 hover:bg-emerald-500 text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors shadow-sm"
                                            >
                                                Adicionar
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-gray-400">schedule</span>
                                            Linha do Tempo
                                        </h3>

                                        <div className="space-y-4">
                                            {activities.length === 0 && (
                                                <p className="text-center text-gray-400 text-sm py-4">Nenhuma atividade registrada.</p>
                                            )}
                                            {activities.map(act => (
                                                <div key={act.id} className="flex gap-4 items-start">
                                                    {/* Icon Circle */}
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${act.tipo === 'nota' ? 'bg-blue-100 text-blue-600' :
                                                        act.concluido ? 'bg-green-100 text-green-600' :
                                                            'bg-gray-100 text-gray-600' // Default gray checking reference image, valid tasks get specific colors if needed but reference shows green for task? 
                                                        // Wait, reference shows Green Check for task. Blue bubble for note. 
                                                        // Let's stick to: Note=Blue, Task/Others=Green(if done) else Gray/Default?
                                                        // Actually reference image shows "Tarefa" (Task) with a Green check icon in a Green circle.
                                                        // "Nota" (Note) with Blue chat bubble in Blue circle.
                                                        // Let's follow that pattern.
                                                        } ${act.tipo !== 'nota' && !act.concluido ? 'bg-emerald-100 text-emerald-600' : ''}`}>
                                                        <span className="material-symbols-outlined">
                                                            {act.tipo === 'nota' ? 'chat' :
                                                                act.tipo === 'tarefa' ? 'check' :
                                                                    act.tipo === 'reuniao' ? 'groups' : 'call'}
                                                        </span>
                                                    </div>

                                                    {/* Content Card */}
                                                    <div className="flex-1 bg-white p-4 rounded-xl border border-gray-200 shadow-sm group">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="font-bold text-gray-900 text-base">{getActivityLabel(act.tipo)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-xs text-gray-400">{formatRelativeTime(act.criado_em)}</span>
                                                                <button
                                                                    onClick={() => handleDeleteActivity(act.id)}
                                                                    className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                                                    title="Excluir atividade"
                                                                >
                                                                    <span className="material-symbols-outlined text-lg">delete</span>
                                                                </button>
                                                            </div>
                                                        </div>

                                                        <p className="text-sm text-gray-600 mb-3 whitespace-pre-wrap">{act.descricao}</p>

                                                        {act.tipo !== 'nota' && (
                                                            <div className="flex items-center gap-6 pt-2 border-t border-gray-100">
                                                                {act.data_vencimento && (
                                                                    <span className={`flex items-center gap-1 text-sm ${new Date(act.data_vencimento) < new Date() && !act.concluido
                                                                        ? 'text-red-500 font-medium'
                                                                        : 'text-gray-500'
                                                                        }`}>
                                                                        <span className="material-symbols-outlined text-lg">event</span>
                                                                        {new Date(act.data_vencimento).toLocaleString('pt-BR')}
                                                                    </span>
                                                                )}

                                                                <label className="flex items-center gap-2 cursor-pointer text-gray-600 hover:text-primary transition-colors select-none">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={act.concluido || false}
                                                                        onChange={() => handleToggleActivity(act.id, act.concluido || false)}
                                                                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                                                                    />
                                                                    <span className="text-sm">Concluído</span>
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div >
                    </div >
                </div >
            )}
        </div >
    )
}
