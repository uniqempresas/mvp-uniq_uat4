import { useState, useEffect } from 'react'
import { financeService, type Category } from '../../services/financeService'

type TabType = 'receita' | 'despesa'

export default function CategoriesPage() {
    const [activeTab, setActiveTab] = useState<TabType>('despesa')
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

    useEffect(() => {
        loadCategories()
    }, [activeTab])

    const loadCategories = async () => {
        try {
            const data = await financeService.getCategories(activeTab)
            setCategories(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async (categoryData: Partial<Category>) => {
        try {
            if (editingCategory) {
                await financeService.updateCategory(editingCategory.id, categoryData)
            } else {
                await financeService.createCategory({ ...categoryData, tipo: activeTab })
            }
            loadCategories()
            setShowModal(false)
            setEditingCategory(null)
        } catch (error) {
            console.error(error)
            alert('Erro ao salvar categoria')
        }
    }

    const handleDelete = async (id: number) => {
        if (!confirm('Deseja realmente excluir esta categoria?')) return

        try {
            await financeService.deleteCategory(id)
            loadCategories()
        } catch (error) {
            console.error(error)
            alert('Erro ao excluir categoria')
        }
    }

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-50 overflow-hidden">
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">Categorias</h1>
                    <p className="text-xs text-gray-500">Organize suas receitas e despesas</p>
                </div>
                <button
                    onClick={() => { setEditingCategory(null); setShowModal(true) }}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Nova Categoria
                </button>
            </header>

            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Tabs */}
                <div className="bg-white border-b border-gray-200 px-6">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setActiveTab('despesa')}
                            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'despesa'
                                    ? 'border-red-600 text-red-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Despesas
                        </button>
                        <button
                            onClick={() => setActiveTab('receita')}
                            className={`py-3 px-4 font-medium text-sm border-b-2 transition-colors ${activeTab === 'receita'
                                    ? 'border-green-600 text-green-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            Receitas
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-4xl mx-auto">
                        {loading ? (
                            <div className="text-center py-12 text-gray-400">Carregando...</div>
                        ) : categories.length === 0 ? (
                            <div className="text-center py-12 text-gray-400">
                                Nenhuma categoria cadastrada
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Nome</th>
                                            <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tipo</th>
                                            <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {categories.map(category => (
                                            <tr key={category.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 text-sm text-gray-900">{category.nome}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 text-xs font-medium rounded ${category.tipo === 'receita'
                                                            ? 'bg-green-50 text-green-600'
                                                            : 'bg-red-50 text-red-600'
                                                        }`}>
                                                        {category.tipo === 'receita' ? 'Receita' : 'Despesa'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => { setEditingCategory(category); setShowModal(true) }}
                                                            className="px-3 py-1.5 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(category.id)}
                                                            className="px-3 py-1.5 border border-red-200 text-red-600 text-xs font-medium rounded-lg hover:bg-red-50 transition-colors"
                                                        >
                                                            Excluir
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <CategoryModal
                    category={editingCategory}
                    tipo={activeTab}
                    onClose={() => { setShowModal(false); setEditingCategory(null) }}
                    onSave={handleSave}
                />
            )}
        </div>
    )
}

function CategoryModal({ category, tipo, onClose, onSave }: {
    category: Category | null
    tipo: TabType
    onClose: () => void
    onSave: (data: Partial<Category>) => void
}) {
    const [nome, setNome] = useState(category?.nome || '')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave({ nome, tipo })
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-gray-900">
                        {category ? 'Editar Categoria' : 'Nova Categoria'}
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome da Categoria</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            placeholder={tipo === 'receita' ? 'Ex: Vendas, Serviços' : 'Ex: Aluguel, Salários'}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo</label>
                        <div className={`px-3 py-2 border border-gray-200 rounded-lg ${tipo === 'receita' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            } font-medium text-sm`}>
                            {tipo === 'receita' ? 'Receita' : 'Despesa'}
                        </div>
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
