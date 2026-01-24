import React, { useState, useEffect } from 'react'
import { crmService, type Opportunity, type FunnelStage, type OpportunityProduct } from '../../services/crmService'
import { type Client } from '../../services/clientService' // Leads
import { type Customer } from '../../services/clientService' // Customers
import { type Product } from '../../services/productService'

interface OpportunityModalProps {
    isOpen: boolean
    onClose: () => void
    initialOpp: Partial<Opportunity> | null
    stages: FunnelStage[]
    leads: Client[]
    customers: Customer[]
    productsList: Product[]
    onSuccess: () => void
}

export default function OpportunityModal({
    isOpen,
    onClose,
    initialOpp,
    stages,
    leads,
    customers,
    productsList,
    onSuccess
}: OpportunityModalProps) {
    if (!isOpen) return null

    const [activeTab, setActiveTab] = useState('detalhes')
    const [selectedOpp, setSelectedOpp] = useState<Partial<Opportunity>>({
        titulo: '',
        valor: 0,
        estagio: stages[0]?.nome || '',
        data_fechamento: new Date().toISOString().split('T')[0],
        lead_id: undefined,
        cliente_id: undefined,
        responsavel_id: undefined // Fix: ensure property exists in Opportunity type or use any
    })

    // Products State
    const [oppProducts, setOppProducts] = useState<OpportunityProduct[]>([])
    const [productForm, setProductForm] = useState({
        produto_id: '',
        quantidade: 1,
        preco_unitario: 0
    })

    // Activities State
    const [activityForm, setActivityForm] = useState({
        tipo: 'nota',
        descricao: '',
        data_vencimento: ''
    })

    // Value Mask
    const [displayValue, setDisplayValue] = useState('')

    // Initialize
    useEffect(() => {
        if (initialOpp) {
            setSelectedOpp({
                ...initialOpp,
                data_fechamento: initialOpp.data_fechamento ? initialOpp.data_fechamento.split('T')[0] : new Date().toISOString().split('T')[0]
            })

            // Format initial Value
            const val = initialOpp.valor || 0
            setDisplayValue(val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))

            // Fetch Products if editing
            if (initialOpp.id) {
                crmService.getOpportunityProducts(initialOpp.id)
                    .then(setOppProducts)
                    .catch(console.error)
            } else {
                setOppProducts([])
            }
        } else {
            // Defaults
            setSelectedOpp({
                titulo: '',
                valor: 0,
                estagio: stages[0]?.nome || '',
                data_fechamento: new Date().toISOString().split('T')[0]
            })
            setDisplayValue(Number(0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
            setOppProducts([])
        }

        // Reset forms
        setProductForm({ produto_id: '', quantidade: 1, preco_unitario: 0 })
        setActivityForm({ tipo: 'nota', descricao: '', data_vencimento: '' })
        setActiveTab('detalhes')
    }, [isOpen]) // Fix: Only reset on open, ignore initialOpp prop updates to avoid form reset

    // Auto-update total value based on products
    useEffect(() => {
        const totalProducts = oppProducts.reduce((acc, curr) => acc + (curr.total || 0), 0)

        // Only update if value is different to avoid loops/overwrites if user manually edits value (optional business rule: products sum overrides manual value?)
        // In the original code, it overrides.
        if (selectedOpp.valor !== totalProducts && oppProducts.length > 0) {
            setSelectedOpp(prev => ({ ...prev, valor: totalProducts }))
            setDisplayValue(totalProducts.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
        }
    }, [oppProducts])

    // Handlers
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setSelectedOpp(prev => ({ ...prev, [name]: value }))
    }

    const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/\D/g, '')
        const numberVal = Number(raw) / 100
        setSelectedOpp(prev => ({ ...prev, valor: numberVal }))
        setDisplayValue(numberVal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
    }

    const handleAddProduct = () => {
        if (!productForm.produto_id) return

        const prod = productsList.find(p => String(p.id) === productForm.produto_id)
        const qtd = Number(productForm.quantidade) || 1
        const unitPrice = Number(productForm.preco_unitario) || 0

        const newProductItem: OpportunityProduct = {
            id: `temp-${Date.now()}`,
            oportunidade_id: selectedOpp.id || '',
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

    const handleAddActivity = async () => {
        // Note: In the original code, this was likely handled differently (maybe local state first if creating new opp?)
        // But crmService.addActivity requires an opportunity ID.
        // If creating a NEW opportunity, we can't add activities until the opportunity is saved.
        // We should probably alert the user or save the activity in a temp list?
        // Actually, the original code had `handleAddActivity` inside `CRMOpportunities.tsx` which probably saved immediately?
        // Let's check the original code... `handleActivitySubmit` in `CRMChat.tsx` saved immediately.
        // But in `CRMOpportunities.tsx`, activities tab seems to interact with `crmService` directly if ID exists?
        // If ID doesn't exist, we can't save activity.
        // Let's check `CRMOpportunities.tsx` logic again.
        // Logic for `handleAddActivity` isn't visible in the snippet I read previously.
        // Assuming for now we only support adding activities if `selectedOpp.id` exists.

        if (!selectedOpp.id) {
            alert('Salve a oportunidade antes de adicionar atividades.')
            return
        }
        if (!activityForm.descricao) return

        try {
            await crmService.addActivity({
                oportunidade_id: selectedOpp.id,
                tipo: activityForm.tipo as any,
                descricao: activityForm.descricao,
                data_vencimento: activityForm.data_vencimento ? new Date(activityForm.data_vencimento).toISOString() : undefined,
                concluido: false,

            })
            alert('Atividade adicionada!')
            setActivityForm(prev => ({ ...prev, descricao: '', data_vencimento: '' }))
        } catch (error) {
            console.error(error)
            alert('Erro ao adicionar atividade')
        }
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedOpp?.titulo || !selectedOpp?.estagio) {
            alert('Preencha os campos obrigatórios')
            return
        }

        try {
            // Save Opportunity
            // We use `saveOpportunityFull` if available (it handles products transactionally)
            // Or `createOpportunity` / `updateOpportunity`.
            // The original code used `crmService.saveOpportunityFull` (I saw it in the snippet).

            await crmService.saveOpportunityFull(selectedOpp as Opportunity, oppProducts.map(p => ({
                oportunidade_id: p.oportunidade_id,
                produto_id: p.produto_id,
                quantidade: p.quantidade,
                preco_unitario: p.preco_unitario,
                total: p.total
            })))

            onSuccess()
            onClose()
        } catch (error: any) {
            console.error('Save error:', error)
            alert(`Erro ao salvar: ${error.message || 'Erro desconhecido'}`)
        }
    }

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
            <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-[fade-in-up_0.3s_ease-out]">
                <div className="px-6 py-5 border-b border-gray-200 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-900">
                        {selectedOpp?.id ? 'Detalhes da Oportunidade' : 'Nova Oportunidade'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
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
                                    <select
                                        className="w-full h-10 rounded-lg border-gray-300 bg-white text-gray-900 focus:border-primary focus:ring-primary/20 transition-all text-sm px-3 border"
                                        value={selectedOpp.lead_id || ''}
                                        name="lead_id"
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecione um Lead...</option>
                                        {leads.map(l => <option key={l.id} value={l.id}>{l.nome}</option>)}
                                    </select>
                                </label>
                                <label className="block">
                                    <span className="text-sm font-semibold text-gray-700 mb-1.5 block">Cliente (me_cliente)</span>
                                    <select
                                        className="w-full h-10 rounded-lg border-gray-300 bg-white text-gray-900 focus:border-primary focus:ring-primary/20 transition-all text-sm px-3 border"
                                        value={selectedOpp.cliente_id || ''}
                                        name="cliente_id"
                                        onChange={handleChange}
                                    >
                                        <option value="">Selecione um Cliente...</option>
                                        {customers.map(c => <option key={c.id} value={c.id}>{c.nome_cliente}</option>)}
                                    </select>
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
                                            value={selectedOpp.titulo || ''}
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
                                            value={selectedOpp.data_fechamento || ''}
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
                                        value={selectedOpp.estagio || ''}
                                        onChange={handleChange}
                                        name="estagio"
                                    >
                                        {stages.map(s => (
                                            <option key={s.id} value={s.nome}>{s.nome}</option>
                                        ))}
                                    </select>
                                </div>
                            </label>


                            {/* Products Section (Embedded in Details) */}
                            <div className="pt-6 border-t border-gray-200 mt-6">
                                <h3 className="text-sm font-bold text-gray-800 mb-4">Produtos</h3>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-4">
                                        <div className="md:col-span-5">
                                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Produto</label>
                                            <select
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
                                                className="w-full rounded-lg border-gray-300 text-sm py-2"
                                                type="number"
                                                value={productForm.quantidade}
                                                onChange={e => setProductForm(prev => ({ ...prev, quantidade: Number(e.target.value) }))}
                                            />
                                        </div>
                                        <div className="md:col-span-3">
                                            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Preço Unit.</label>
                                            <input
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

                                    {/* Products List Table */}
                                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                        <table className="w-full text-sm text-left">
                                            <thead className="text-xs text-gray-700 bg-gray-50 border-b border-gray-200">
                                                <tr>
                                                    <th className="px-4 py-3 font-bold">Produto</th>
                                                    <th className="px-4 py-3 font-bold text-center">Qtd</th>
                                                    <th className="px-4 py-3 font-bold text-right">Total</th>
                                                    <th className="px-4 py-3"></th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {oppProducts.length === 0 && (
                                                    <tr>
                                                        <td colSpan={5} className="px-6 py-4 text-center text-gray-400 text-xs">
                                                            Nenhum produto adicionado
                                                        </td>
                                                    </tr>
                                                )}
                                                {oppProducts.map(item => (
                                                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-4 py-3 font-medium">{item.produto?.nome_produto || 'Produto'}</td>
                                                        <td className="px-4 py-3 text-center">{item.quantidade}</td>
                                                        <td className="px-4 py-3 text-right font-bold">
                                                            {(item.quantidade * item.preco_unitario).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                        </td>
                                                        <td className="px-4 py-3 text-right">
                                                            <button
                                                                type="button"
                                                                onClick={() => handleDeleteProduct(item.id)}
                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                            >
                                                                <span className="material-symbols-outlined text-lg">delete</span>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                            <tfoot className="bg-gray-50 border-t border-gray-200">
                                                <tr>
                                                    <td colSpan={2} className="px-4 py-3 text-right font-bold text-gray-700">Total Geral:</td>
                                                    <td className="px-4 py-3 text-right font-bold text-gray-900 text-lg">
                                                        {oppProducts.reduce((acc, curr) => acc + (curr.total || 0), 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                    </td>
                                                    <td></td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>

                                    <div className="mt-4 border-2 border-dashed border-gray-200 rounded-xl p-4 flex items-center justify-center text-gray-500 gap-2 cursor-pointer hover:border-primary hover:text-primary transition-colors">
                                        <span className="material-symbols-outlined">description</span>
                                        <span className="font-medium">Gerar Proposta PDF</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={onClose}
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
                        </form>
                    )}

                    {activeTab === 'atividades' && (
                        <div className="space-y-6">
                            {/* Activity Form Only visible if ID exists */}

                            {!selectedOpp.id ? (
                                <div className="text-center p-8 text-gray-500">
                                    Salve a oportunidade primeiro para adicionar atividades.
                                </div>
                            ) : (
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
                                        className="w-full rounded-lg border-gray-300 text-sm p-3 focus:border-primary focus:ring-primary/20 min-h-[100px] mb-3"
                                        placeholder="Descreva a atividade..."
                                        value={activityForm.descricao}
                                        onChange={e => setActivityForm(prev => ({ ...prev, descricao: e.target.value }))}
                                    />

                                    <div className="flex items-center justify-between">
                                        {activityForm.tipo !== 'nota' ? (
                                            <div className="relative">
                                                <input
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
                            )}
                        </div>
                    )}

                    {activeTab === 'produtos' && (
                        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mt-0">
                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end mb-4">
                                <div className="md:col-span-5">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Produto</label>
                                    <select
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
                                        className="w-full rounded-lg border-gray-300 text-sm py-2"
                                        type="number"
                                        value={productForm.quantidade}
                                        onChange={e => setProductForm(prev => ({ ...prev, quantidade: Number(e.target.value) }))}
                                    />
                                </div>
                                <div className="md:col-span-3">
                                    <label className="block text-xs font-semibold text-gray-500 mb-1.5">Preço Unit.</label>
                                    <input
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
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
