import { useState, useEffect } from 'react'
import { financeService, type Account } from '../../services/financeService'

export default function AccountsPage() {
    const [accounts, setAccounts] = useState<Account[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingAccount, setEditingAccount] = useState<Account | null>(null)

    useEffect(() => {
        loadAccounts()
    }, [])

    const loadAccounts = async () => {
        try {
            const data = await financeService.getAccounts()
            setAccounts(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (accountData: Partial<Account>) => {
        try {
            if (editingAccount) {
                await financeService.updateAccount(editingAccount.id, accountData)
            } else {
                await financeService.createAccount(accountData)
            }
            loadAccounts()
            setShowModal(false)
            setEditingAccount(null)
        } catch (error) {
            console.error(error)
            alert('Erro ao salvar conta')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Deseja realmente desativar esta conta?')) return

        try {
            await financeService.deleteAccount(id)
            loadAccounts()
        } catch (error) {
            console.error(error)
            alert('Erro ao desativar conta')
        }
    }

    const getTypeIcon = (tipo: string) => {
        switch (tipo) {
            case 'caixa': return 'payments'
            case 'banco': return 'account_balance'
            case 'cartao': return 'credit_card'
            case 'investimento': return 'trending_up'
            default: return 'wallet'
        }
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-hidden">
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Contas</h1>
                    <p className="text-xs text-gray-500">Gerencie suas contas financeiras</p>
                </div>
                <button
                    onClick={() => { setEditingAccount(null); setShowModal(true) }}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Nova Conta
                </button>
            </header>

            <div className="flex-1 overflow-y-auto p-6">
                <div className="max-w-5xl mx-auto">
                    {loading ? (
                        <div className="text-center py-12 text-gray-400">Carregando...</div>
                    ) : accounts.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">Nenhuma conta cadastrada</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {accounts.map(account => (
                                <div key={account.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                                                <span className="material-symbols-outlined text-blue-600 text-[24px]">
                                                    {getTypeIcon(account.tipo)}
                                                </span>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900">{account.nome}</h3>
                                                <p className="text-xs text-gray-500 capitalize">{account.tipo}</p>
                                            </div>
                                        </div>
                                        <span className={`px-2 py-1 text-xs font-medium rounded ${account.status === 'ativo'
                                                ? 'bg-green-50 text-green-600'
                                                : 'bg-gray-100 text-gray-500'
                                            }`}>
                                            {account.status}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-xs text-gray-500 mb-1">Saldo Inicial</p>
                                        <p className="text-2xl font-bold text-gray-900">
                                            R$ {account.saldo_inicial.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => { setEditingAccount(account); setShowModal(true) }}
                                            className="flex-1 px-3 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            Editar
                                        </button>
                                        {account.status === 'ativo' && (
                                            <button
                                                onClick={() => handleDelete(account.id)}
                                                className="px-3 py-2 border border-red-200 text-red-600 text-sm font-medium rounded-lg hover:bg-red-50 transition-colors"
                                            >
                                                Desativar
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {showModal && (
                <AccountModal
                    account={editingAccount}
                    onClose={() => { setShowModal(false); setEditingAccount(null) }}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}

function AccountModal({ account, onClose, onSave }: {
    account: Account | null
    onClose: () => void
    onSave: (data: Partial<Account>) => void
}) {
    const [formData, setFormData] = useState({
        nome: account?.nome || '',
        tipo: account?.tipo || 'caixa',
        saldo_inicial: account?.saldo_inicial || 0,
        status: account?.status || 'ativo'
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {account ? 'Editar Conta' : 'Nova Conta'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Conta</label>
                        <input
                            type="text"
                            value={formData.nome}
                            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                        <select
                            value={formData.tipo}
                            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as any })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="caixa">Caixa</option>
                            <option value="banco">Banco</option>
                            <option value="cartao">Cartão</option>
                            <option value="investimento">Investimento</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Saldo Inicial</label>
                        <input
                            type="number"
                            step="0.01"
                            value={formData.saldo_inicial}
                            onChange={(e) => setFormData({ ...formData, saldo_inicial: parseFloat(e.target.value) })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Salvar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
