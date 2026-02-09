import { useState, useEffect } from 'react'
import { meSupplierService, type MeSupplier } from '../../services/meSupplierService'
import { useBreakpoint } from '../../hooks/useBreakpoint'
import MobileCard from '../Mobile/MobileCard'
import SupplierForm from './SupplierForm'

export default function SupplierList() {
    const [suppliers, setSuppliers] = useState<MeSupplier[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingSupplier, setEditingSupplier] = useState<MeSupplier | undefined>(undefined)

    const fetchSuppliers = async () => {
        setIsLoading(true)
        try {
            const data = await meSupplierService.getSuppliers()
            setSuppliers(data)
        } catch (error) {
            console.error('Error fetching suppliers:', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchSuppliers()
    }, [])

    const handleCreate = async (data: any) => {
        await meSupplierService.createSupplier(data)
        fetchSuppliers()
    }

    const handleUpdate = async (data: any) => {
        if (editingSupplier) {
            await meSupplierService.updateSupplier(editingSupplier.id, data)
            fetchSuppliers()
        }
    }

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
            await meSupplierService.deleteSupplier(id)
            fetchSuppliers()
        }
    }

    const openEdit = (supplier: MeSupplier) => {
        setEditingSupplier(supplier)
        setIsFormOpen(true)
    }

    const { isMobile } = useBreakpoint()

    const renderMobileCard = (supplier: MeSupplier) => (
        <MobileCard
            key={supplier.id}
            avatar={
                <div className="text-lg font-bold text-primary">
                    {supplier.nome_fantasia?.charAt(0)}
                </div>
            }
            title={supplier.nome_fantasia}
            subtitle={supplier.razao_social}
            badge={
                supplier.ativo
                    ? { label: 'Ativo', color: 'green' }
                    : { label: 'Inativo', color: 'gray' }
            }
            fields={[
                { label: 'Email', value: supplier.email || '-', icon: 'mail' },
                { label: 'Telefone', value: supplier.telefone || '-', icon: 'call' },
                { label: 'CNPJ', value: supplier.cpf_cnpj || '-' }
            ]}
            actions={[
                {
                    icon: 'edit',
                    onClick: (e) => {
                        e.stopPropagation()
                        openEdit(supplier)
                    },
                    color: 'blue',
                    title: 'Editar'
                },
                {
                    icon: 'delete',
                    onClick: (e) => handleDelete(supplier.id, e),
                    color: 'red',
                    title: 'Excluir'
                }
            ]}
        />
    )

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F3F4F6]">
            {/* Header */}
            <header className="flex-none px-8 py-6 pb-2">
                <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <a className="hover:text-primary transition-colors" href="#">Cadastros</a>
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                    <span className="text-gray-900 font-medium">Fornecedores</span>
                </nav>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Fornecedores</h1>
                        <p className="text-slate-500 mt-1">Gerencie seus parceiros de negócio.</p>
                    </div>
                    <button
                        onClick={() => { setEditingSupplier(undefined); setIsFormOpen(true) }}
                        className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl font-semibold shadow-sm shadow-primary/30 transition-all active:scale-95"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                        Novo Fornecedor
                    </button>
                </div>
            </header>

            {/* List Content */}
            <div className="flex-1 overflow-y-auto px-8 pb-8 pt-4">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
                    {isMobile ? (
                        // Mobile Card Layout
                        <div className="p-4 grid gap-4">
                            {isLoading ? (
                                <div className="py-12 text-center text-slate-500">Carregando...</div>
                            ) : suppliers.length === 0 ? (
                                <div className="py-12 text-center text-slate-500">Nenhum fornecedor encontrado.</div>
                            ) : (
                                suppliers.map(renderMobileCard)
                            )}
                        </div>
                    ) : (
                        // Desktop Table Layout
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/50 border-b border-gray-100">
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Fornecedor</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contato</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Documento</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-center">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {isLoading ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-slate-500">Carregando...</td></tr>
                                    ) : suppliers.length === 0 ? (
                                        <tr><td colSpan={5} className="p-8 text-center text-slate-500">Nenhum fornecedor encontrado.</td></tr>
                                    ) : (
                                        suppliers.map(supplier => (
                                            <tr key={supplier.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="font-medium text-slate-900">{supplier.nome_fantasia}</span>
                                                        <span className="text-xs text-slate-500">{supplier.razao_social}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-slate-700 text-sm">{supplier.email || '-'}</span>
                                                        <span className="text-slate-500 text-xs">{supplier.telefone || '-'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-600 font-mono text-sm">{supplier.cpf_cnpj || '-'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${supplier.ativo ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                                                        {supplier.ativo ? 'Ativo' : 'Inativo'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-center">
                                                    <div className="flex justify-center gap-2">
                                                        <button
                                                            onClick={() => openEdit(supplier)}
                                                            className="text-slate-400 hover:text-primary transition-colors p-1" title="Editar"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={(e) => handleDelete(supplier.id, e)}
                                                            className="text-slate-400 hover:text-red-500 transition-colors p-1" title="Excluir"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            <SupplierForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSubmit={editingSupplier ? handleUpdate : handleCreate}
                initialData={editingSupplier}
            />
        </div>
    )
}
