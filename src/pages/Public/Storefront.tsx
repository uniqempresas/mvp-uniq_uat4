import { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import { publicService, type PublicCompany, type PublicProduct, type Category } from '../../services/publicService'
import { useCart } from '../../contexts/CartContext'
import CartButton from '../../components/Storefront/CartButton'
import CartDrawer from '../../components/Storefront/CartDrawer'
import CategoryTabs from '../../components/Storefront/CategoryTabs'

export default function Storefront() {
    const { slug } = useParams<{ slug: string }>()
    const navigate = useNavigate()
    const [company, setCompany] = useState<PublicCompany | null>(null)
    const [products, setProducts] = useState<PublicProduct[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [isCartOpen, setIsCartOpen] = useState(false)
    const { addItem } = useCart()

    useEffect(() => {
        if (slug) loadData(slug)
    }, [slug])

    const loadData = async (slug: string) => {
        try {
            const companyData = await publicService.getCompanyBySlug(slug)
            if (companyData) {
                setCompany(companyData)
                const [productsData, categoriesData] = await Promise.all([
                    publicService.getPublicProducts(companyData.id),
                    publicService.getCategories(companyData.id)
                ])
                setProducts(productsData)
                setCategories(categoriesData)
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    // Product counts por categoria
    const productCounts = useMemo(() => {
        const counts: Record<string, number> = {}
        products.forEach(p => {
            if (p.categoria_id) {
                const catId = String(p.categoria_id)
                counts[catId] = (counts[catId] || 0) + 1
            }
        })
        return counts
    }, [products])


    const filteredProducts = products.filter(p => {
        const matchesSearch = p.nome_produto.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = !activeCategory || String(p.categoria_id) === activeCategory
        return matchesSearch && matchesCategory
    })



    const handleWhatsAppOrder = (product: PublicProduct) => {
        if (!company?.telefone) return
        const text = `Olá! Gostaria de pedir o produto: *${product.nome_produto}* (R$ ${product.preco}).`
        window.open(publicService.getWhatsAppLink(company.telefone, text), '_blank')
    }

    const handleAddToCart = (product: PublicProduct) => {
        // Se tem variações, adiciona a primeira por padrão (pode melhorar depois)
        const variacao = product.variacoes?.[0]
        addItem(product, variacao)

        // Toast feedback
        toast.success('Produto adicionado!', {
            icon: '🛒',
            style: {
                background: 'linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%)',
                color: '#fff',
                borderRadius: '12px',
            },
            duration: 2000,
        })
    }

    if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Carregando loja...</div>
    if (!company) return <div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-500">Loja não encontrada.</div>

    return (
        <div className="min-h-screen bg-gray-50 font-display text-slate-900 pb-20">
            {/* Toast Notifications */}
            <Toaster position="top-center" />

            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10 px-4 py-3 pb-4">
                <div className="max-w-md mx-auto flex flex-col items-center gap-2">
                    <h1 className="font-bold text-lg text-center">{company.nome_fantasia}</h1>
                    {/* Search */}
                    <div className="relative w-full">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-[20px]">search</span>
                        <input
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar produtos..."
                            className="w-full bg-gray-100 border-none rounded-full py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400"
                        />
                    </div>
                </div>
            </header>

            {/* Category Tabs */}
            {categories.length > 0 && (
                <CategoryTabs
                    categories={categories}
                    activeCategory={activeCategory}
                    onSelectCategory={setActiveCategory}
                    productCounts={productCounts}
                />
            )}

            {/* Product Grid */}
            <div className="p-4 max-w-md mx-auto grid grid-cols-2 gap-3">
                {filteredProducts.map(product => (
                    <div
                        key={product.id}
                        onClick={() => navigate(`/c/${slug}/p/${product.id}`)}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col cursor-pointer hover:shadow-md transition-shadow"
                    >
                        <div className="aspect-square bg-gray-100 relative overflow-hidden">
                            {product.imagens && product.imagens.length > 0 ? (
                                <img src={product.imagens[0].imagem_url} alt={product.nome_produto} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <span className="material-symbols-outlined text-4xl">image</span>
                                </div>
                            )}
                            {product.preco_varejo && product.preco_varejo < product.preco && (
                                <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">OFERTA</span>
                            )}
                        </div>
                        <div className="p-3 flex-1 flex flex-col">
                            <h3 className="text-sm font-medium leading-tight mb-1 line-clamp-2">{product.nome_produto}</h3>
                            <div className="mt-auto pt-2">
                                {(() => {
                                    // Produto com variações: pega o menor preço
                                    if (product.variacoes && product.variacoes.length > 0) {
                                        const precos = product.variacoes
                                            .map((v: any) => Number(v.preco_varejo || 0))
                                            .filter((p: number) => p > 0) // Só preços válidos

                                        if (precos.length === 0) {
                                            // Nenhuma variação com preço válido
                                            return (
                                                <>
                                                    <div className="flex items-baseline gap-1 mb-2">
                                                        <span className="text-sm text-gray-600 font-medium">Consulte-nos</span>
                                                    </div>
                                                    <div className="flex gap-1">
                                                        <button
                                                            onClick={() => handleAddToCart(product)}
                                                            className="flex-1 bg-primary rounded-lg text-white py-2 flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-transform text-xs font-medium"
                                                        >
                                                            <span className="material-symbols-outlined text-base">shopping_cart</span>
                                                            Adicionar
                                                        </button>
                                                        <button
                                                            onClick={() => handleWhatsAppOrder(product)}
                                                            className="size-9 bg-green-500 rounded-lg text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                                                        >
                                                            <span className="text-base">💬</span>
                                                        </button>
                                                    </div>
                                                </>
                                            )
                                        }

                                        const menorPreco = Math.min(...precos)
                                        return (
                                            <>
                                                <div className="flex items-baseline gap-1 mb-2">
                                                    <span className="text-[10px] text-gray-500">A partir de</span>
                                                    <span className="font-bold text-primary text-base">
                                                        R$ {menorPreco.toFixed(2).replace('.', ',')}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        className="flex-1 bg-primary rounded-lg text-white py-2 flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-transform text-xs font-medium"
                                                    >
                                                        <span className="material-symbols-outlined text-base">shopping_cart</span>
                                                        Adicionar
                                                    </button>
                                                    <button
                                                        onClick={() => handleWhatsAppOrder(product)}
                                                        className="size-9 bg-green-500 rounded-lg text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                                                    >
                                                        <span className="text-base">💬</span>
                                                    </button>
                                                </div>
                                            </>
                                        )
                                    }

                                    // Produto simples: preço normal ou promocional
                                    const precoFinal = product.preco_varejo && product.preco_varejo < product.preco ? product.preco_varejo : product.preco
                                    const temPromocao = product.preco_varejo && product.preco_varejo < product.preco

                                    return (
                                        <>
                                            {temPromocao && (
                                                <span className="block text-xs text-gray-400 line-through">
                                                    R$ {product.preco.toFixed(2).replace('.', ',')}
                                                </span>
                                            )}
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-bold text-primary">
                                                    R$ {precoFinal.toFixed(2).replace('.', ',')}
                                                </span>
                                            </div>
                                            <div className="flex gap-1">
                                                <button
                                                    onClick={() => handleAddToCart(product)}
                                                    className="flex-1 bg-primary rounded-lg text-white py-2 flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-transform text-xs font-medium"
                                                >
                                                    <span className="material-symbols-outlined text-base">shopping_cart</span>
                                                    Adicionar
                                                </button>
                                                <button
                                                    onClick={() => handleWhatsAppOrder(product)}
                                                    className="size-9 bg-green-500 rounded-lg text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                                                >
                                                    <span className="text-base">💬</span>
                                                </button>
                                            </div>
                                        </>
                                    )
                                })()}
                            </div>
                        </div>
                    </div>
                ))}

                {filteredProducts.length === 0 && (
                    <div className="col-span-2 text-center py-10 text-gray-400 text-sm">
                        Nenhum produto encontrado.
                    </div>
                )}
            </div>

            {/* Footer / Floating Cart (Future) */}
            {/* For now just a simple footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 text-center text-xs text-gray-400">
                Catálogo Digital via <strong>UNIQ</strong>
            </div>

            {/* Cart Button */}
            <CartButton onClick={() => setIsCartOpen(true)} />

            {/* Cart Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                companyPhone={company.telefone}
                companyName={company.nome_fantasia}
            />
        </div>
    )
}
