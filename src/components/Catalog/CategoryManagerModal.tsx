import { useState, useEffect } from 'react'
import { categoryService, type Category, type Subcategory } from '../../services/categoryService'

interface CategoryManagerModalProps {
    isOpen: boolean
    onClose: () => void
    initialCategory?: number // Optional: open with this category selected
}

export default function CategoryManagerModal({ isOpen, onClose, initialCategory }: CategoryManagerModalProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const [subcategories, setSubcategories] = useState<Subcategory[]>([])
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)
    const [loading, setLoading] = useState(false)

    // Form States
    const [newCategoryName, setNewCategoryName] = useState('')
    const [newSubcategoryName, setNewSubcategoryName] = useState('')
    const [editingCategory, setEditingCategory] = useState<{ id_categoria: number, nome_categoria: string } | null>(null)
    const [editingSubcategory, setEditingSubcategory] = useState<{ id_subcategoria: number, nome: string } | null>(null)

    useEffect(() => {
        if (isOpen) {
            fetchCategories()
        }
    }, [isOpen])

    useEffect(() => {
        if (initialCategory && categories.length > 0) {
            const cat = categories.find(c => c.id_categoria === initialCategory)
            if (cat) setSelectedCategory(cat)
        }
    }, [initialCategory, categories])

    useEffect(() => {
        if (selectedCategory) {
            fetchSubcategories(selectedCategory.id_categoria)
        } else {
            setSubcategories([])
        }
    }, [selectedCategory])

    const fetchCategories = async () => {
        setLoading(true)
        try {
            const data = await categoryService.getCategories()
            setCategories(data)
        } catch (error) {
            console.error(error)
            alert('Erro ao carregar categorias')
        } finally {
            setLoading(false)
        }
    }

    const fetchSubcategories = async (categoryId: number) => {
        try {
            const data = await categoryService.getSubcategories(categoryId)
            setSubcategories(data)
        } catch (error) {
            console.error(error)
            alert('Erro ao carregar subcategorias')
        }
    }

    // --- Category Actions ---
    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return
        try {
            await categoryService.createCategory(newCategoryName)
            setNewCategoryName('')
            fetchCategories()
        } catch (error) {
            alert('Erro ao criar categoria')
        }
    }

    const handleUpdateCategory = async () => {
        if (!editingCategory || !editingCategory.nome_categoria.trim()) return
        try {
            await categoryService.updateCategory(editingCategory.id_categoria, editingCategory.nome_categoria)
            setEditingCategory(null)
            fetchCategories()
        } catch (error) {
            alert('Erro ao atualizar categoria')
        }
    }

    const handleDeleteCategory = async (id: number) => {
        if (!confirm('Excluir esta categoria? As subcategorias também podem ser afetadas.')) return
        try {
            await categoryService.deleteCategory(id)
            if (selectedCategory?.id_categoria === id) setSelectedCategory(null)
            fetchCategories()
        } catch (error) {
            alert('Erro ao excluir categoria')
        }
    }

    // --- Subcategory Actions ---
    const handleAddSubcategory = async () => {
        if (!selectedCategory || !newSubcategoryName.trim()) return
        try {
            await categoryService.createSubcategory(selectedCategory.id_categoria, newSubcategoryName)
            setNewSubcategoryName('')
            fetchSubcategories(selectedCategory.id_categoria)
        } catch (error) {
            alert('Erro ao criar subcategoria')
        }
    }

    const handleUpdateSubcategory = async () => {
        if (!editingSubcategory || !editingSubcategory.nome.trim()) return
        try {
            await categoryService.updateSubcategory(editingSubcategory.id_subcategoria, editingSubcategory.nome)
            setEditingSubcategory(null)
            if (selectedCategory) fetchSubcategories(selectedCategory.id_categoria)
        } catch (error) {
            alert('Erro ao atualizar subcategoria')
        }
    }

    const handleDeleteSubcategory = async (id_subcategoria: number) => {
        if (!confirm('Excluir esta subcategoria?')) return
        try {
            await categoryService.deleteSubcategory(id_subcategoria)
            if (selectedCategory) fetchSubcategories(selectedCategory.id_categoria)
        } catch (error) {
            alert('Erro ao excluir subcategoria')
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[600px] flex flex-col overflow-hidden animate-fade-in-up">
                {/* Header */}
                <div className="h-16 px-6 border-b flex items-center justify-between bg-gray-50">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Gerenciar Categorias</h2>
                        <p className="text-xs text-slate-500">Organize seus produtos em categorias e subcategorias</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-slate-500 transition-colors">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content - Dual Pane */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Left Pane: Categories */}
                    <div className="w-1/3 border-r bg-gray-50/50 flex flex-col">
                        <div className="p-4 border-b">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Categorias Principais</h3>
                            <div className="flex gap-2">
                                <input
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Nova Categoria..."
                                    className="flex-1 h-9 rounded text-sm px-3 border-gray-300 focus:border-primary focus:ring-primary/20 outline-none"
                                />
                                <button
                                    onClick={handleAddCategory}
                                    className="size-9 bg-primary text-white rounded flex items-center justify-center hover:bg-primary-dark transition-colors"
                                >
                                    <span className="material-symbols-outlined text-sm">add</span>
                                </button>
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto p-2 space-y-1">
                            {categories.map(cat => (
                                <div
                                    key={cat.id_categoria}
                                    className={`group flex items-center justify-between p-2 rounded-lg cursor-pointer transition-all ${selectedCategory?.id_categoria === cat.id_categoria
                                        ? 'bg-white shadow-sm border-l-4 border-primary'
                                        : 'hover:bg-gray-100 text-slate-600'
                                        }`}
                                    onClick={() => setSelectedCategory(cat)}
                                >
                                    {editingCategory && editingCategory.id_categoria === cat.id_categoria ? (
                                        <div className="flex items-center gap-1 w-full" onClick={e => e.stopPropagation()}>
                                            <input
                                                value={editingCategory.nome_categoria}
                                                onChange={e => setEditingCategory(prev => prev ? { ...prev, nome_categoria: e.target.value } : null)}
                                                className="flex-1 h-7 text-sm rounded border border-gray-300 px-2"
                                                autoFocus
                                            />
                                            <button onClick={handleUpdateCategory} className="text-green-600 hover:bg-green-50 rounded p-1"><span className="material-symbols-outlined text-sm">check</span></button>
                                            <button onClick={() => setEditingCategory(null)} className="text-red-500 hover:bg-red-50 rounded p-1"><span className="material-symbols-outlined text-sm">close</span></button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className={`text-sm font-medium ${selectedCategory?.id_categoria === cat.id_categoria ? 'text-primary' : ''}`}>{cat.nome_categoria}</span>
                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setEditingCategory({ id_categoria: cat.id_categoria, nome_categoria: cat.nome_categoria }) }}
                                                    className="p-1 hover:bg-blue-50 text-blue-500 rounded"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">edit</span>
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); handleDeleteCategory(cat.id_categoria) }}
                                                    className="p-1 hover:bg-red-50 text-red-500 rounded"
                                                >
                                                    <span className="material-symbols-outlined text-[16px]">delete</span>
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                            {categories.length === 0 && !loading && (
                                <div className="text-center py-8 text-xs text-slate-400">Nenhuma categoria</div>
                            )}
                        </div>
                    </div>

                    {/* Right Pane: Subcategories */}
                    <div className="flex-1 flex flex-col bg-white">
                        {selectedCategory ? (
                            <>
                                <div className="p-4 border-b flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-slate-800">
                                        <span className="material-symbols-outlined text-primary">subdirectory_arrow_right</span>
                                        <span className="font-semibold">{selectedCategory.nome_categoria}</span>
                                        <span className="text-slate-400 text-sm">/ Subcategorias</span>
                                    </div>
                                </div>
                                <div className="p-4 border-b bg-gray-50/30">
                                    <div className="flex gap-2 max-w-md">
                                        <input
                                            value={newSubcategoryName}
                                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                                            placeholder={`Nova subcategoria em ${selectedCategory.nome_categoria}...`}
                                            className="flex-1 h-9 rounded text-sm px-3 border-gray-300 focus:border-primary focus:ring-primary/20 outline-none"
                                        />
                                        <button
                                            onClick={handleAddSubcategory}
                                            className="px-4 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-900 transition-colors"
                                        >
                                            Adicionar
                                        </button>
                                    </div>
                                </div>
                                <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 content-start">
                                    {subcategories.map(sub => (
                                        <div key={sub.id_subcategoria} className="group flex items-center justify-between p-3 bg-white border rounded-lg hover:shadow-sm hover:border-primary/30 transition-all">
                                            {editingSubcategory && editingSubcategory.id_subcategoria === sub.id_subcategoria ? (
                                                <div className="flex items-center gap-1 w-full">
                                                    <input
                                                        value={editingSubcategory.nome}
                                                        onChange={e => setEditingSubcategory(prev => prev ? { ...prev, nome: e.target.value } : null)}
                                                        className="flex-1 h-7 text-sm rounded border border-gray-300 px-2"
                                                        autoFocus
                                                    />
                                                    <button onClick={handleUpdateSubcategory} className="text-green-600 hover:bg-green-50 rounded p-1"><span className="material-symbols-outlined text-sm">check</span></button>
                                                    <button onClick={() => setEditingSubcategory(null)} className="text-red-500 hover:bg-red-50 rounded p-1"><span className="material-symbols-outlined text-sm">close</span></button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="flex items-center gap-2">
                                                        <span className="size-2 rounded-full bg-slate-300 group-hover:bg-primary"></span>
                                                        <span className="text-sm font-medium text-slate-700">{sub.nome_subcategoria}</span>
                                                    </div>
                                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button
                                                            onClick={() => setEditingSubcategory({ id_subcategoria: sub.id_subcategoria, nome: sub.nome_subcategoria })}
                                                            className="p-1 hover:bg-blue-50 text-blue-500 rounded"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteSubcategory(sub.id_subcategoria)}
                                                            className="p-1 hover:bg-red-50 text-red-500 rounded"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">delete</span>
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                    {subcategories.length === 0 && (
                                        <div className="col-span-2 text-center py-12 text-slate-400 text-sm">
                                            <span className="material-symbols-outlined text-4xl mb-2 opacity-50">folder_open</span>
                                            <p>Nenhuma subcategoria cadastrada ainda.</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined text-6xl mb-4 text-slate-200">category</span>
                                <p className="text-lg font-medium text-slate-500">Selecione uma categoria</p>
                                <p className="text-sm">Para gerenciar suas subcategorias</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
