import { useState, useEffect } from 'react'
import { financeService, type Category, type Account, type Transaction } from '../../services/financeService'
import { clientService, type Client } from '../../services/clientService'

interface TransactionModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess: () => void
    type: 'receita' | 'despesa'
    transaction?: Transaction | null
}

export default function TransactionModal({ isOpen, onClose, onSuccess, type, transaction }: TransactionModalProps) {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    const [accounts, setAccounts] = useState<Account[]>([])
    const [customers, setCustomers] = useState<Client[]>([]) // For receivables mainly
    // Suppliers? We don't have table yet. Text input for now? Or use customers list as "Contacts"?

    const [form, setForm] = useState({
        descricao: '',
        valor: '',
        data_vencimento: '',
        status: 'pendente',
        categoria_id: '',
        conta_id: '',
        cliente_id: '', // Optional
        fornecedor_id: '', // Used for payable text
        observacao: ''
    })

    useEffect(() => {
        if (isOpen) {
            loadData()
            if (transaction) {
                setForm({
                    descricao: transaction.descricao,
                    valor: transaction.valor.toString(),
                    data_vencimento: transaction.data_vencimento,
                    status: transaction.status,
                    categoria_id: transaction.categoria_id?.toString() || '',
                    conta_id: transaction.conta_id?.toString() || '',
                    cliente_id: transaction.cliente_id?.toString() || '',
                    fornecedor_id: transaction.fornecedor_id || '',
                    observacao: transaction.observacao || ''
                })
            } else {
                setForm({
                    descricao: '',
                    valor: '',
                    data_vencimento: new Date().toISOString().split('T')[0],
                    status: 'pendente',
                    categoria_id: '',
                    conta_id: '',
                    cliente_id: '',
                    fornecedor_id: '',
                    observacao: ''
                })
            }
        }
    }, [isOpen, transaction])

    const formatCurrency = (value: string) => {
        value = value.replace(/\D/g, "")
        value = (Number(value) / 100).toFixed(2) + ""
        value = value.replace(".", ",")
        value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
        return `R$ ${value}`
    }

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let value = e.target.value
        if (!value) {
            setForm({ ...form, valor: '' })
            return
        }
        // Remove R$, dots and verify if it's a number
        const numericValue = value.replace(/[^0-9]/g, '')
        const formatted = formatCurrency(numericValue)
        setForm({ ...form, valor: formatted })
    }



    // Inside loadData
    const loadData = async () => {
        try {
            console.log('Fetching finance data for:', type)
            const cats = await financeService.getCategories(type)
            console.log('Categories:', cats)
            setCategories(cats)

            const accs = await financeService.getAccounts()
            console.log('Accounts:', accs)
            setAccounts(accs)

            if (!transaction && accs.length > 0) {
                setForm(prev => ({ ...prev, conta_id: accs[0].id }))
            }

            if (type === 'receita') {
                const custs = await clientService.getClients()
                setCustomers(custs)
            }
        } catch (error) {
            console.error('Error loading finance data:', error)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const commonData = {
                tipo: type,
                descricao: form.descricao,
                valor: Number(form.valor.replace(/[^0-9,]/g, '').replace(',', '.')),
                data_vencimento: form.data_vencimento,
                status: form.status as any,
                categoria_id: form.categoria_id ? Number(form.categoria_id) : null,
                conta_id: form.conta_id || null,
                observacao: form.observacao
            }

            // Add specific fields
            const dataToSave = {
                ...commonData,
                ...(type === 'receita' ? { cliente_id: form.cliente_id || null } : {}),
                ...(type === 'despesa' ? { fornecedor_id: form.fornecedor_id } : {})
            }

            if (transaction) {
                await financeService.updateTransaction(transaction.id, dataToSave)
            } else {
                await financeService.createTransaction(dataToSave)
            }
            onSuccess()
            onClose()
        } catch (error) {
            console.error(error)
            alert('Erro ao salvar')
        } finally {
            setLoading(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-fadeIn">
                <div className={`p-4 border-b ${type === 'receita' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'}`}>
                    <h2 className={`text-lg font-bold ${type === 'receita' ? 'text-green-800' : 'text-red-800'}`}>
                        {transaction ? 'Editar' : 'Nova'} {type === 'receita' ? 'Receita' : 'Despesa'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descrição</label>
                        <input
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            value={form.descricao}
                            onChange={e => setForm({ ...form, descricao: e.target.value })}
                            placeholder={type === 'receita' ? 'Ex: Venda de Produto' : 'Ex: Conta de Luz'}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Valor (R$)</label>
                            <input
                                required
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                                value={form.valor}
                                onChange={handleCurrencyChange}
                                placeholder="R$ 0,00"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Vencimento</label>
                            <input
                                required
                                type="date"
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                value={form.data_vencimento}
                                onChange={e => setForm({ ...form, data_vencimento: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Categoria</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                value={form.categoria_id}
                                onChange={e => setForm({ ...form, categoria_id: e.target.value })}
                            >
                                <option value="">Selecione</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.nome}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Status</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                value={form.status}
                                onChange={e => setForm({ ...form, status: e.target.value })}
                            >
                                <option value="pendente">Pendente</option>
                                <option value="pago">Pago</option>
                                <option value="atrasado">Atrasado</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Conta de Vencimento</label>
                        <select
                            required
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                            value={form.conta_id}
                            onChange={e => setForm({ ...form, conta_id: e.target.value })}
                        >
                            <option value="">Selecione a Conta</option>
                            {accounts.map(a => (
                                <option key={a.id} value={a.id}>{a.nome}</option>
                            ))}
                        </select>
                    </div>

                    {type === 'receita' ? (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cliente (Opcional)</label>
                            <select
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                value={form.cliente_id}
                                onChange={e => setForm({ ...form, cliente_id: e.target.value })}
                            >
                                <option value="">Sem cliente</option>
                                {customers.map(c => (
                                    <option key={c.id} value={c.id}>{c.nome}</option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Fornecedor (Opcional)</label>
                            <input
                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 outline-none"
                                value={form.fornecedor_id}
                                onChange={e => setForm({ ...form, fornecedor_id: e.target.value })}
                                placeholder="Nome do fornecedor"
                            />
                        </div>
                    )}

                    <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 py-2.5 text-white font-bold rounded-xl transition-colors shadow-sm ${type === 'receita' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
                                }`}
                        >
                            {loading ? 'Salvando...' : 'Salvar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
