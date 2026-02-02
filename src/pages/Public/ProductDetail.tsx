import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { publicService, type PublicProduct, type PublicCompany } from '../../services/publicService'
import { useCart } from '../../contexts/CartContext'

export default function ProductDetail() {
    const { slug, produtoId } = useParams<{ slug: string; produtoId: string }>()
    const navigate = useNavigate()
    const [company, setCompany] = useState<PublicCompany | null>(null)
    const [product, setProduct] = useState<PublicProduct | null>(null)
    const [selectedVariation, setSelectedVariation] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const { addItem } = useCart()

    useEffect(() => {
        if (slug && produtoId) loadData()
    }, [slug, produtoId])

    const loadData = async () => {
        try {
            const companyData = await publicService.getCompanyBySlug(slug!)
            if (companyData) {
                setCompany(companyData)
                const products = await publicService.getPublicProducts(companyData.id)
                const foundProduct = products.find(p => p.id.toString() === produtoId)

                if (foundProduct) {
                    setProduct(foundProduct)
                    // Selecionar first variação se existir
                    if (foundProduct.variacoes && foundProduct.variacoes.length > 0) {
                        setSelectedVariation(foundProduct.variacoes[0])
                    }
                }
            }
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const handleAddToCart = () => {
        if (!product) return
        addItem(product, selectedVariation)

        // Simple alert as fallback for missing toast library
        alert('Produto adicionado ao carrinho!')
    }

    const handleWhatsApp = () => {
        if (!product || !company?.telefone) return

        const variacaoText = selectedVariation ? ` - ${selectedVariation.nome_variacao}` : ''
        const preco = selectedVariation?.preco_varejo || selectedVariation?.preco || product.preco_varejo || product.preco
        const text = `Olá! Gostaria de pedir:\n\n*${product.nome_produto}${variacaoText}*\nR$ ${preco.toFixed(2).replace('.', ',')}`

        window.open(publicService.getWhatsAppLink(company.telefone, text), '_blank')
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-gray-500">Carregando...</div>
        </div>
    )

    if (!product || !company) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
                <p className="text-gray-500 mb-4">Produto não encontrado</p>
                <button
                    onClick={() => navigate(`/c/${slug}`)}
                    className="text-primary font-medium"
                >
                    ← Voltar para loja
                </button>
            </div>
        </div>
    )

    const finalPrice = selectedVariation?.preco_varejo || selectedVariation?.preco || product.preco_varejo || product.preco
    const originalPrice = selectedVariation?.preco || product.preco
    const hasDiscount = finalPrice < originalPrice

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pb-24">
            {/* Back Button */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3">
                <button
                    onClick={() => navigate(`/c/${slug}`)}
                    className="flex items-center gap-2 text-gray-700 font-medium hover:text-primary transition-colors"
                >
                    <span className="material-symbols-outlined text-[20px]">arrow_back</span>
                    {company.nome_fantasia}
                </button>
            </div>

            {/* Image Gallery */}
            {product.imagens && product.imagens.length > 0 ? (
                <div className="relative bg-white group">
                    <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide aspect-square">
                        {product.imagens.map((img, idx) => (
                            <div key={idx} className="min-w-full h-full snap-center bg-gray-100 relative">
                                <img
                                    src={img.imagem_url}
                                    alt={`${product.nome_produto} - ${idx + 1}`}
                                    className="w-full h-full object-cover"
                                    loading={idx === 0 ? 'eager' : 'lazy'}
                                />
                                <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm">
                                    {idx + 1} / {product.imagens?.length}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Badge de Oferta */}
                    {hasDiscount && (
                        <div className="absolute top-4 left-4 z-20 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                            {Math.round(((originalPrice - finalPrice) / originalPrice) * 100)}% OFF
                        </div>
                    )}
                </div>
            ) : (
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-6xl text-gray-300">image</span>
                </div>
            )}

            {/* Product Info */}
            <div className="px-4 py-6 space-y-6">
                {/* Title */}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                        {product.nome_produto}
                    </h1>
                </div>

                {/* Price */}
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        R$ {finalPrice.toFixed(2).replace('.', ',')}
                    </span>
                    {hasDiscount && (
                        <span className="text-lg text-gray-400 line-through">
                            R$ {originalPrice.toFixed(2).replace('.', ',')}
                        </span>
                    )}
                </div>

                {/* Variations */}
                {product.variacoes && product.variacoes.length > 0 && (
                    <div>
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Selecione:</h3>
                        <div className="flex flex-wrap gap-2">
                            {product.variacoes.map((variacao: any) => {
                                const isSelected = selectedVariation?.id === variacao.id
                                return (
                                    <button
                                        key={variacao.id}
                                        onClick={() => setSelectedVariation(variacao)}
                                        className={`
                                            relative px-4 py-2.5 rounded-xl font-medium text-sm transition-all
                                            ${isSelected
                                                ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/30'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }
                                        `}
                                    >
                                        <span className="relative z-10">{variacao.nome_variacao}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>
                )}

                {/* Description */}
                {product.descricao && (
                    <div className="border-t border-gray-100 pt-6">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3">Descrição</h3>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {product.descricao}
                        </p>
                    </div>
                )}
            </div>

            {/* Sticky CTA Footer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-40">
                <div className="max-w-md mx-auto flex gap-3">
                    <button
                        onClick={handleAddToCart}
                        className="flex-1 bg-gradient-to-r from-primary to-accent text-white rounded-xl py-4 font-bold text-base shadow-lg shadow-primary/30 active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[22px]">shopping_cart</span>
                        Adicionar ao Carrinho
                    </button>
                    <button
                        onClick={handleWhatsApp}
                        className="bg-green-500 text-white rounded-xl px-6 py-4 font-bold shadow-lg active:scale-95 transition-transform flex items-center justify-center"
                    >
                        <span className="text-2xl">💬</span>
                    </button>
                </div>
            </div>
        </div>
    )
}
