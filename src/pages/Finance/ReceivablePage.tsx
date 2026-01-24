import { useState, useEffect } from 'react'
import { financeService, type Transaction, type FinanceStats } from '../../services/financeService'
import { clientService } from '../../services/clientService'
import TransactionModal from './TransactionModal'

export default function ReceivablePage() {
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [stats, setStats] = useState<FinanceStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null)
    const [customers, setCustomers] = useState<Record<string, string>>({})

    const loadData = async () => {
        setLoading(true)
        try {
            const [list, statistics, custs] = await Promise.all([
                financeService.getTransactions({ tipo: 'receita', month: new Date() }),
                financeService.getDashboardStats('receita'),
                clientService.getCustomers()
            ])
            setTransactions(list)
            setStats(statistics)

            const custMap: Record<string, string> = {}
            custs.forEach(c => custMap[c.id] = c.nome_cliente)
            setCustomers(custMap)

        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleEdit = (t: Transaction) => {
        setSelectedTransaction(t)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir?')) return
        await financeService.deleteTransaction(id)
        loadData()
    }

    const handleReceive = async (t: Transaction) => {
        await financeService.updateTransaction(t.id, {
            status: 'pago', // In receivable context, 'pago' means 'received'
            data_pagamento: new Date().toISOString().split('T')[0]
        })
        loadData()
    }

    const handleNew = () => {
        setSelectedTransaction(null)
        setIsModalOpen(true)
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-hidden">
            {/* Header */}
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0 z-10">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-400">Financeiro</span>
                    <span className="material-symbols-outlined text-[14px] text-gray-300">chevron_right</span>
                    <span className="font-medium text-green-600">Contas a Receber</span>
                </div>
                {/* Actions */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={handleNew}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-all shadow-sm shadow-green-200"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        <span>Nova Receita</span>
                    </button>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-10 scroll-smooth">
                <div className="max-w-7xl mx-auto flex flex-col gap-8">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="size-2 rounded-full bg-green-500 animate-pulse"></div>
                                    <p className="text-gray-500 text-sm font-medium">A Receber Hoje</p>
                                </div>
                                <p className="text-3xl font-bold text-gray-900 tracking-tight">
                                    R$ {stats?.vencendo_hoje.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                                <p className="text-xs text-green-500 mt-1 font-medium">{stats?.vencendo_hoje.count} recebimentos</p>
                            </div>
                            <div className="absolute right-4 top-4 p-3 bg-green-50 rounded-lg text-green-500 opacity-50 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined">calendar_today</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-gray-500 text-sm font-medium mb-2">Total a Receber (Mês)</p>
                                <p className="text-3xl font-bold text-gray-900 tracking-tight">
                                    R$ {stats?.total_mes.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="absolute right-4 top-4 p-3 bg-blue-50 rounded-lg text-blue-500 opacity-50 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined">account_balance</span>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between h-32 relative overflow-hidden group">
                            <div className="relative z-10">
                                <p className="text-gray-500 text-sm font-medium mb-2">Recebido (Mês)</p>
                                <p className="text-3xl font-bold text-gray-900 tracking-tight">
                                    R$ {stats?.pago_mes.total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                </p>
                            </div>
                            <div className="absolute right-4 top-4 p-3 bg-green-50 rounded-lg text-green-500 opacity-50 group-hover:opacity-100 transition-opacity">
                                <span className="material-symbols-outlined">check_circle</span>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b border-gray-100">
                                    <tr>
                                        <th className="p-4">Descrição / Cliente</th>
                                        <th className="p-4">Categoria</th>
                                        <th className="p-4">Vencimento</th>
                                        <th className="p-4 text-right">Valor</th>
                                        <th className="p-4 text-center">Status</th>
                                        <th className="p-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-sm">
                                    {loading ? (
                                        <tr><td colSpan={6} className="p-8 text-center text-gray-500">Carregando...</td></tr>
                                    ) : transactions.length === 0 ? (
                                        <tr><td colSpan={6} className="p-8 text-center text-gray-500">Nenhuma receita encontrada.</td></tr>
                                    ) : transactions.map(t => (
                                        <tr key={t.id} className="group hover:bg-gray-50 transition-colors">
                                            <td className="p-4">
                                                <p className="font-bold text-gray-900">{t.descricao}</p>
                                                <p className="text-xs text-gray-500">
                                                    {t.cliente_id ? (customers[t.cliente_id] || 'Cliente não encontrado') : '-'}
                                                </p>
                                            </td>
                                            <td className="p-4">
                                                <span className="inline-block px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
                                                    {t.categoria?.nome || 'Geral'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-gray-600">
                                                {new Date(t.data_vencimento).toLocaleDateString()}
                                            </td>
                                            <td className="p-4 text-right font-bold text-gray-900">
                                                R$ {Number(t.valor).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                                            </td>
                                            <td className="p-4 text-center">
                                                <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium border ${t.status === 'pago' ? 'bg-green-100 text-green-800 border-green-200' :
                                                    t.status === 'atrasado' ? 'bg-red-100 text-red-800 border-red-200' :
                                                        'bg-yellow-100 text-yellow-800 border-yellow-200'
                                                    }`}>
                                                    {t.status === 'pago' ? 'Recebido' : t.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {t.status !== 'pago' && (
                                                        <button
                                                            onClick={() => handleReceive(t)}
                                                            className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-xs font-bold rounded-lg hover:bg-green-700 transition-colors"
                                                            title="Marcar como Recebido"
                                                        >
                                                            <span className="material-symbols-outlined text-[14px]">check</span>
                                                            Receber
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleEdit(t)}
                                                        className="p-1.5 text-gray-400 hover:text-gray-900 hover:bg-gray-200 rounded-lg transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(t.id)}
                                                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={loadData}
                type="receita"
                transaction={selectedTransaction}
            />
        </div>
    )
}
