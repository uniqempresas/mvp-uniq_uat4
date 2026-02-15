import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { publicService, type PublicProduct, type PublicCompany, buildWhatsAppMessage, type Category } from '../../services/publicService'
import { useCart } from '../../contexts/CartContext'
import StoreLayout from './components/StoreLayout'

// Helper: get variation display name
function getVariationName(variacao: any): string {
    if (variacao.nome_variacao) return variacao.nome_variacao
    if (variacao.atributos && typeof variacao.atributos === 'object') {
        return Object.values(variacao.atributos).join(' / ')
    }
    return variacao.sku || 'Variação'
}

// Helper: format price
function formatPrice(value: number): string {
    return value.toFixed(2).replace('.', ',')
}

// Toast Component
function Toast({ message, visible, onClose }: { message: string; visible: boolean; onClose: () => void }) {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(onClose, 2800)
            return () => clearTimeout(timer)
        }
    }, [visible, onClose])

    if (!visible) return null

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-slide-down">
            <div className="bg-gray-900 text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 text-sm font-medium">
                <span className="material-symbols-outlined text-[18px] text-emerald-400" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                </span>
                {message}
            </div>
        </div>
    )
}

export default function ProductDetail() {
    const { slug, produtoId } = useParams<{ slug: string; produtoId: string }>()
    const navigate = useNavigate()
    const [company, setCompany] = useState<PublicCompany | null>(null)
    const [product, setProduct] = useState<PublicProduct | null>(null)
    const [selectedVariation, setSelectedVariation] = useState<any>(null)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    const [loading, setLoading] = useState(true)
    const [showFullDescription, setShowFullDescription] = useState(false)
    const [toastVisible, setToastVisible] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const { addItem } = useCart()

    useEffect(() => {
        if (slug && produtoId) loadData()
    }, [slug, produtoId])

    // SEO: Update document title and meta
    useEffect(() => {
        if (product && company) {
            document.title = `${product.nome_produto} | ${company.nome_fantasia}`
            const metaDesc = document.querySelector('meta[name="description"]')
            const desc = product.descricao
                ? product.descricao.substring(0, 155)
                : `${product.nome_produto} - Compre na loja ${company.nome_fantasia}`
            if (metaDesc) {
                metaDesc.setAttribute('content', desc)
            } else {
                const meta = document.createElement('meta')
                meta.name = 'description'
                meta.content = desc
                document.head.appendChild(meta)
            }
        }
        return () => {
            document.title = 'UNIQ'
        }
    }, [product, company])

    const loadData = async () => {
        try {
            const companyData = await publicService.getCompanyBySlug(slug!)
            if (companyData) {
                setCompany(companyData)
                const products = await publicService.getPublicProducts(companyData.id)
                const foundProduct = products.find(p => p.id.toString() === produtoId)

                if (foundProduct) {
                    setProduct(foundProduct)
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

    const showToast = useCallback((msg: string) => {
        setToastMessage(msg)
        setToastVisible(true)
    }, [])

    const handleAddToCart = () => {
        if (!product) return
        addItem(product, selectedVariation)
        showToast('Produto adicionado ao carrinho!')
    }

    const handleWhatsApp = () => {
        if (!product || !company?.telefone) return

        const preco = selectedVariation?.preco_varejo || selectedVariation?.preco || product.preco_varejo || product.preco
        const whatsappConfig = company.store_config?.whatsapp
        const productUrl = `${window.location.origin}/c/${slug}/p/${product.id}`

        const text = buildWhatsAppMessage(
            whatsappConfig?.custom_message,
            {
                productName: product.nome_produto,
                price: whatsappConfig?.include_price !== false ? preco : undefined,
                productUrl: whatsappConfig?.include_link !== false ? productUrl : undefined,
                variation: selectedVariation ? getVariationName(selectedVariation) : undefined,
            }
        )

        window.open(publicService.getWhatsAppLink(company.telefone, text), '_blank')
    }

    const handleVariationSelect = (variacao: any) => {
        setSelectedVariation(variacao)
        // If variation has its own photo, switch to it
        if (variacao.foto_url) {
            setSelectedImageIndex(-1) // -1 = showing variation image
        } else {
            setSelectedImageIndex(0)
        }
    }

    // Compute all displayable images
    const allImages = product?.imagens && product.imagens.length > 0
        ? product.imagens.map(img => img.imagem_url)
        : product?.foto_url
            ? [product.foto_url]
            : []

    // Current display image
    const currentImage = selectedImageIndex === -1 && selectedVariation?.foto_url
        ? selectedVariation.foto_url
        : allImages[selectedImageIndex] || null

    // Price computation
    const finalPrice = selectedVariation?.preco_varejo || selectedVariation?.preco || product?.preco_varejo || product?.preco || 0
    const originalPrice = selectedVariation?.preco || product?.preco || 0
    const hasDiscount = finalPrice < originalPrice && originalPrice > 0
    const discountPercent = hasDiscount ? Math.round(((originalPrice - finalPrice) / originalPrice) * 100) : 0

    // SKU
    const currentSku = selectedVariation?.sku || product?.sku || null

    // Schema.org JSON-LD
    const schemaJsonLd = product && company ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.nome_produto,
        description: product.descricao || '',
        image: allImages.length > 0 ? allImages : undefined,
        sku: currentSku || undefined,
        brand: {
            '@type': 'Brand',
            name: company.nome_fantasia
        },
        offers: {
            '@type': 'Offer',
            price: finalPrice,
            priceCurrency: 'BRL',
            availability: 'https://schema.org/InStock',
            seller: {
                '@type': 'Organization',
                name: company.nome_fantasia
            }
        }
    } : null

    // --- LOADING STATE ---
    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="size-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                <span className="text-sm text-gray-400">Carregando produto...</span>
            </div>
        </div>
    )

    // --- NOT FOUND STATE ---
    if (!product || !company) return (
        <StoreLayout
            companyName={company?.nome_fantasia || 'Loja'}
            onCartClick={() => navigate(`/c/${slug}/cart`)}
            appearance={company?.store_config?.appearance}
        >
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center space-y-4">
                    <span className="material-symbols-outlined text-5xl text-gray-300">search_off</span>
                    <p className="text-gray-500 text-lg">Produto não encontrado</p>
                    <button
                        onClick={() => navigate(`/c/${slug}`)}
                        className="inline-flex items-center gap-1.5 text-primary font-semibold hover:underline"
                    >
                        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                        Voltar para loja
                    </button>
                </div>
            </div>
        </StoreLayout>
    )

    const [flatCategories, setFlatCategories] = useState<Category[]>([])
    useEffect(() => {
        if (company) {
            publicService.getCategories(company.id).then(setFlatCategories)
        }
    }, [company])

    return (
        <StoreLayout
            companyName={company.nome_fantasia}
            logoUrl={company.logo_url}
            telefone={company.telefone}
            email={company.email}
            onCartClick={() => navigate(`/c/${slug}/cart`)}
            flatCategories={flatCategories}
            appearance={company.store_config?.appearance}
        >
            {/* SEO: JSON-LD */}
            {schemaJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
                />
            )}

            {/* Toast */}
            <Toast message={toastMessage} visible={toastVisible} onClose={() => setToastVisible(false)} />

            <div className="bg-white pb-20 md:pb-8">

                {/* ── BREADCRUMB (Desktop) ── */}
                <nav className="hidden md:block max-w-6xl mx-auto px-8 py-3" aria-label="Breadcrumb">
                    <ol className="flex items-center gap-1.5 text-xs text-gray-400">
                        <li>
                            <button onClick={() => navigate(`/c/${slug}`)} className="hover:text-primary transition-colors">
                                {company.nome_fantasia}
                            </button>
                        </li>
                        <li><span className="material-symbols-outlined text-[12px]">chevron_right</span></li>
                        <li><span className="text-gray-600 font-medium">{product.nome_produto}</span></li>
                    </ol>
                </nav>

                {/* ── MAIN CONTENT ── */}
                <main className="max-w-6xl mx-auto px-4 md:px-8 md:py-4">
                    <div className="md:grid md:grid-cols-[55%_45%] md:gap-10 lg:gap-14">

                        {/* ──────── LEFT: IMAGE GALLERY ──────── */}
                        <section className="relative" aria-label="Galeria de imagens">
                            {/* Main Image */}
                            <div className="relative bg-gray-50 aspect-square md:rounded-sm overflow-hidden">
                                {currentImage ? (
                                    <img
                                        key={currentImage}
                                        src={currentImage}
                                        alt={product.nome_produto}
                                        className="w-full h-full object-cover animate-fade-in"
                                        loading="eager"
                                    />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                                        <span className="material-symbols-outlined text-7xl">image</span>
                                        <span className="text-xs text-gray-400">Sem imagem</span>
                                    </div>
                                )}

                                {/* Discount Badge */}
                                {hasDiscount && (
                                    <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-sm shadow-lg tracking-wide">
                                        -{discountPercent}%
                                    </div>
                                )}

                                {/* Image Counter (mobile) */}
                                {allImages.length > 1 && (
                                    <div className="absolute bottom-3 right-3 bg-black/60 text-white text-[11px] font-medium px-2.5 py-1 rounded-sm md:hidden">
                                        {(selectedImageIndex === -1 ? 0 : selectedImageIndex) + 1} / {allImages.length}
                                    </div>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide py-1 px-1">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImageIndex(idx)}
                                            className={`
                                                flex-shrink-0 size-16 md:size-20 rounded-sm overflow-hidden border-2 transition-all
                                                ${selectedImageIndex === idx
                                                    ? 'border-primary ring-1 ring-primary/30 scale-105'
                                                    : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                                                }
                                            `}
                                        >
                                            <img
                                                src={img}
                                                alt={`${product.nome_produto} - ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                                loading="lazy"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* ──────── RIGHT: PRODUCT INFO ──────── */}
                        <section className="py-5 md:py-0 px-1 md:px-0 space-y-5">

                            {/* Title */}
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight tracking-tight">
                                    {product.nome_produto}
                                </h1>
                                {currentSku && (
                                    <p className="text-xs text-gray-400 mt-1.5 font-mono tracking-wide">
                                        SKU: {currentSku}
                                    </p>
                                )}
                            </div>

                            {/* Price Block */}
                            <div className="space-y-1">
                                {hasDiscount && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-400 line-through">
                                            R$ {formatPrice(originalPrice)}
                                        </span>
                                        <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-sm">
                                            -{discountPercent}%
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm text-gray-500 font-medium">R$</span>
                                    <span className="text-4xl font-extrabold text-gray-900 tracking-tight">
                                        {formatPrice(finalPrice).split(',')[0]}
                                    </span>
                                    <span className="text-xl font-bold text-gray-900">
                                        ,{formatPrice(finalPrice).split(',')[1]}
                                    </span>
                                </div>
                                {product.variacoes && product.variacoes.length > 0 && !selectedVariation && (
                                    <p className="text-xs text-gray-400">A partir de</p>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="h-px bg-gray-100" />

                            {/* Variations */}
                            {product.variacoes && product.variacoes.length > 0 && (
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px] text-gray-400">tune</span>
                                        Selecione uma opção
                                    </h2>
                                    <div className="flex flex-wrap gap-2">
                                        {product.variacoes.map((variacao: any) => {
                                            const isSelected = selectedVariation?.id === variacao.id
                                            const name = getVariationName(variacao)
                                            const varPrice = variacao.preco_varejo || variacao.preco || 0

                                            return (
                                                <button
                                                    key={variacao.id}
                                                    onClick={() => handleVariationSelect(variacao)}
                                                    className={`
                                                        group relative px-4 py-2.5 rounded-sm font-medium text-sm transition-all border
                                                        ${isSelected
                                                            ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                                            : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900 hover:text-gray-900'
                                                        }
                                                    `}
                                                >
                                                    <span className="block leading-tight">{name}</span>
                                                    {varPrice > 0 && (
                                                        <span className={`block text-[11px] mt-0.5 ${isSelected ? 'text-gray-300' : 'text-gray-400'}`}>
                                                            R$ {formatPrice(varPrice)}
                                                        </span>
                                                    )}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* Description */}
                            {product.descricao && (
                                <div>
                                    <h2 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                                        <span className="material-symbols-outlined text-[16px] text-gray-400">description</span>
                                        Descrição
                                    </h2>
                                    <div className="relative">
                                        <p className={`text-gray-600 text-sm leading-relaxed whitespace-pre-line ${!showFullDescription && product.descricao.length > 200 ? 'line-clamp-4' : ''}`}>
                                            {product.descricao}
                                        </p>
                                        {product.descricao.length > 200 && (
                                            <button
                                                onClick={() => setShowFullDescription(!showFullDescription)}
                                                className="text-primary text-sm font-semibold mt-1.5 hover:underline flex items-center gap-1"
                                            >
                                                {showFullDescription ? 'Ver menos' : 'Ver mais'}
                                                <span className="material-symbols-outlined text-[16px]">
                                                    {showFullDescription ? 'expand_less' : 'expand_more'}
                                                </span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Product Details */}
                            {(product.codigo_barras || product.tipo) && (
                                <div className="bg-gray-50 rounded-sm p-4 space-y-2">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Detalhes</h3>
                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        {product.tipo && (
                                            <>
                                                <span className="text-gray-400">Tipo</span>
                                                <span className="text-gray-700 font-medium capitalize">{product.tipo === 'variavel' ? 'Com variações' : 'Simples'}</span>
                                            </>
                                        )}
                                        {product.codigo_barras && (
                                            <>
                                                <span className="text-gray-400">Código de barras</span>
                                                <span className="text-gray-700 font-mono text-xs">{product.codigo_barras}</span>
                                            </>
                                        )}
                                        {product.variacoes && product.variacoes.length > 0 && (
                                            <>
                                                <span className="text-gray-400">Opções</span>
                                                <span className="text-gray-700 font-medium">{product.variacoes.length} variações</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* CTA Desktop (inline) */}
                            <div className="hidden md:flex gap-3 pt-2">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-gray-900 hover:bg-gray-800 text-white rounded-sm py-4 font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-2.5 shadow-lg"
                                >
                                    <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                                    Adicionar ao Carrinho
                                </button>
                                <button
                                    onClick={handleWhatsApp}
                                    className="bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-sm px-6 py-4 font-bold transition-all active:scale-[0.98] flex items-center justify-center shadow-lg"
                                    title="Perguntar via WhatsApp"
                                >
                                    <svg viewBox="0 0 24 24" className="size-6 fill-current">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </button>
                            </div>
                        </section>
                    </div>
                </main>

                {/* ── STICKY CTA (Mobile only) ── */}
                <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] z-40 md:hidden">
                    <div className="max-w-md mx-auto flex gap-2.5">
                        <button
                            onClick={handleAddToCart}
                            className="flex-1 bg-gray-900 text-white rounded-sm py-3.5 font-bold text-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                            Adicionar ao Carrinho
                        </button>
                        <button
                            onClick={handleWhatsApp}
                            className="bg-[#25D366] text-white rounded-sm px-5 py-3.5 font-bold active:scale-[0.98] transition-transform flex items-center justify-center"
                        >
                            <svg viewBox="0 0 24 24" className="size-5 fill-current">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </StoreLayout>
    )
}
