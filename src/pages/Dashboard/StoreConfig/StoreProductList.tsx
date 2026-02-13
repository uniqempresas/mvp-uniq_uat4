import React, { useState, useEffect } from 'react'
import { productService, type Product } from '../../../services/productService'
import { storeService } from '../../../services/storeService'

export const StoreProductList: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')

    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = async () => {
        try {
            const data = await productService.getProducts()
            setProducts(data)
        } catch (error) {
            console.error('Error loading products', error)
        } finally {
            setLoading(false)
        }
    }

    const handleToggle = async (product: Product) => {
        const newStatus = !product.exibir_vitrine
        // Optimistic update
        setProducts(prev => prev.map(p =>
            p.id === product.id ? { ...p, exibir_vitrine: newStatus } : p
        ))

        try {
            await storeService.toggleProductVisibility(product.id, newStatus)
        } catch (error) {
            console.error('Error updating visibility', error)
            // Revert on error
            setProducts(prev => prev.map(p =>
                p.id === product.id ? { ...p, exibir_vitrine: !newStatus } : p
            ))
            // Minimal feedback
            // toast.error('Erro ao atualizar') if toast available
        }
    }

    const filteredProducts = products.filter(p =>
        p.nome_produto.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) return <div className="p-4 text-center text-gray-500">Carregando produtos...</div>

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Seleção de Produtos</h3>
                <div className="relative w-64">
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Produto</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Preço</th>
                                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Exibir na Vitrine</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredProducts.map(product => (
                                <tr key={product.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="h-10 w-10 flex-shrink-0">
                                                {product.foto_url ? (
                                                    <img className="h-10 w-10 rounded-full object-cover" src={product.foto_url} alt="" />
                                                ) : (
                                                    <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{product.nome_produto}</div>
                                                {product.sku && <div className="text-xs text-gray-500">SKU: {product.sku}</div>}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        R$ {product.preco.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleToggle(product)}
                                            className={`${product.exibir_vitrine ? 'bg-indigo-600' : 'bg-gray-200'} relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
                                        >
                                            <span className="sr-only">Toggle visibility</span>
                                            <span
                                                aria-hidden="true"
                                                className={`${product.exibir_vitrine ? 'translate-x-5' : 'translate-x-0'} pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                                            />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-4 text-center text-gray-500">
                                        Nenhum produto encontrado.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
