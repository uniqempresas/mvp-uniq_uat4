import { useState, useEffect } from 'react'
import { productService, type Product } from '../../services/productService'

interface Props {
    onNavigate: (view: string) => void
    onEdit?: (id: number) => void
}

export default function ProductList({ onNavigate, onEdit }: Props) {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [filterCategory, setFilterCategory] = useState('Todas Categorias')
    const [filterStatus, setFilterStatus] = useState('Status: Todos')
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        fetchProducts()
    }, [])

    const fetchProducts = async () => {
        try {
            const data = await productService.getProducts()
            setProducts(data)
        } catch (error) {
            console.error('Error fetching products', error)
        } finally {
            setLoading(false)
        }
    }

    // Filter Logic
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.nome_produto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.sku?.toLowerCase().includes(searchTerm.toLowerCase())
        // matchesCategory logic would go here if we had category names mapping
        // matchesStatus logic would go here based on stock
        return matchesSearch
    })

    return (
        <div className="flex-1 overflow-y-auto p-4 lg:p-8 scroll-smooth animate-fadeIn">
            <div className="max-w-[1200px] mx-auto space-y-6">

                {/* Breadcrumb & Header */}
                <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                        <span className="text-slate-500">Minha Empresa</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-slate-500">Catálogo</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-primary font-medium">Produtos</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div className="flex flex-col gap-1">
                            <h1 className="text-3xl font-bold text-slate-900 tracking-tight dark:text-white">Lista de Produtos</h1>
                            <p className="text-slate-500 dark:text-gray-400">Gerencie o inventário da sua loja aqui.</p>
                        </div>
                        <button
                            onClick={() => onNavigate('product-form')}
                            className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-white px-5 py-2.5 rounded-lg shadow-sm hover:shadow-md transition-all font-semibold text-sm cursor-pointer whitespace-nowrap"
                        >
                            <span className="material-symbols-outlined text-xl">add</span>
                            Novo Produto
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white dark:bg-[#1a2e1f] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row items-center gap-4">
                    <div className="relative flex-1 w-full lg:max-w-md group">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary">search</span>
                        </div>
                        <input
                            className="block w-full pl-10 pr-3 py-2.5 border-gray-200 dark:border-gray-600 rounded-lg text-sm placeholder-gray-400 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-gray-50 dark:bg-black/20 focus:bg-white dark:focus:bg-black/40 text-gray-900 dark:text-white"
                            placeholder="Buscar por nome, SKU ou tag..."
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                        <select
                            className="form-select bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-primary focus:border-primary py-2.5 pl-3 pr-10 cursor-pointer min-w-[140px]"
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                        >
                            <option>Todas Categorias</option>
                            <option>Roupas</option>
                            <option>Calçados</option>
                        </select>
                        <select
                            className="form-select bg-gray-50 dark:bg-black/20 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 text-sm rounded-lg focus:ring-primary focus:border-primary py-2.5 pl-3 pr-10 cursor-pointer min-w-[140px]"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option>Status: Todos</option>
                            <option>Em Estoque</option>
                            <option>Baixo Estoque</option>
                            <option>Sem Estoque</option>
                        </select>
                        <button className="p-2.5 text-gray-500 hover:text-primary bg-gray-50 dark:bg-black/20 hover:bg-gray-100 dark:hover:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors" title="Mais Filtros">
                            <span className="material-symbols-outlined">filter_list</span>
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-[#1a2e1f] border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 dark:bg-white/5 border-b border-gray-100 dark:border-gray-700 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                                    <th className="px-6 py-4 w-12 text-center">
                                        <input className="rounded border-gray-300 text-primary focus:ring-primary/20 size-4 bg-transparent" type="checkbox" />
                                    </th>
                                    <th className="px-6 py-4 dark:text-gray-300">Produto</th>
                                    <th className="px-6 py-4 dark:text-gray-300">Categoria</th>
                                    <th className="px-6 py-4 dark:text-gray-300">Estoque</th>
                                    <th className="px-6 py-4 dark:text-gray-300">Preço</th>
                                    <th className="px-6 py-4 text-right dark:text-gray-300">Ações</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            <span className="animate-spin inline-block w-6 h-6 border-2 border-primary border-t-transparent rounded-full mb-2"></span>
                                            <p>Carregando produtos...</p>
                                        </td>
                                    </tr>
                                ) : filteredProducts.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            Nenhum produto encontrado.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredProducts.map(product => {
                                        return (
                                            <tr key={product.id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                                <td className="px-6 py-4 text-center">
                                                    <input className="rounded border-gray-300 text-primary focus:ring-primary/20 size-4 bg-transparent" type="checkbox" />
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="size-12 rounded-lg bg-gray-100 shrink-0 bg-cover bg-center border border-gray-200 relative overflow-hidden">
                                                            {product.foto_url ? (
                                                                <img src={product.foto_url} alt="" className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                    <span className="material-symbols-outlined text-[20px]">image</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                                                                {product.nome_produto}
                                                            </div>
                                                            <div className="text-xs text-gray-500">SKU: {product.sku || 'N/A'}</div>
                                                            {product.tipo === 'variavel' && (
                                                                <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded ml-1">Variável</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-300">
                                                        Geral
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <span className={`size-2 rounded-full ${product.estoque_atual > 0 ? 'bg-emerald-500' : 'bg-red-500'
                                                            }`}></span>
                                                        <span className="text-gray-700 dark:text-gray-300 font-medium">{product.estoque_atual} unid.</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 font-semibold text-gray-900 dark:text-white">
                                                    {product.tipo === 'variavel' && product.variacoes && product.variacoes.length > 0 ? (
                                                        <span className="text-xs text-gray-600 dark:text-gray-400">
                                                            A partir de <span className="text-gray-900 dark:text-white font-semibold text-sm">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Math.min(...product.variacoes.map(v => v.preco_varejo || 0)))}</span>
                                                        </span>
                                                    ) : (
                                                        new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.preco)
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => onEdit?.(product.id)}
                                                            className="p-2 rounded-lg text-action-edit hover:bg-action-edit/10 transition-colors"
                                                            title="Editar"
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">edit</span>
                                                        </button>
                                                        <button
                                                            className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                                                            title="Excluir"
                                                            onClick={async () => {
                                                                if (confirm('Tem certeza?')) {
                                                                    await productService.deleteProduct(product.id)
                                                                    fetchProducts()
                                                                }
                                                            }}
                                                        >
                                                            <span className="material-symbols-outlined text-[20px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination - Mocked for now */}
                    <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-white/5 flex items-center justify-between text-gray-500 dark:text-gray-400">
                        <span className="text-sm">Mostrando {filteredProducts.length} resultados</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
