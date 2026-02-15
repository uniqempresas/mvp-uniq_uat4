import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { publicService, type PublicCompany } from '../../services/publicService'
import { useCart } from '../../contexts/CartContext'
import StoreLayout from './components/StoreLayout'

// Helper: variation display name
function getVariationLabel(variacao: any): string {
    if (variacao.nome_variacao) return variacao.nome_variacao
    if (variacao.atributos && typeof variacao.atributos === 'object') {
        return Object.values(variacao.atributos).join(' / ')
    }
    return variacao.sku || ''
}

// Helper: format price
function fmt(v: number): string {
    return v.toFixed(2).replace('.', ',')
}

// Toast Component
function Toast({ message, visible, onClose }: { message: string; visible: boolean; onClose: () => void }) {
    useEffect(() => {
        if (visible) {
            const t = setTimeout(onClose, 2800)
            return () => clearTimeout(t)
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

export default function CartPage() {
    const { slug } = useParams<{ slug: string }>()
    const navigate = useNavigate()
    const [company, setCompany] = useState<PublicCompany | null>(null)
    const [loading, setLoading] = useState(true)
    const [toastVisible, setToastVisible] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const { items, removeItem, updateQuantity, getCartMessage, total, clearCart, itemCount } = useCart()

    useEffect(() => {
        if (slug) loadCompany(slug)
    }, [slug])

    // SEO: dynamic title
    useEffect(() => {
        if (company) {
            document.title = `Carrinho | ${company.nome_fantasia}`
        }
        return () => { document.title = 'UNIQ' }
    }, [company])

    const loadCompany = async (slug: string) => {
        try {
            const data = await publicService.getCompanyBySlug(slug)
            setCompany(data)
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

    const handleWhatsAppCheckout = () => {
        if (!company?.telefone) return
        const message = getCartMessage()
        if (!message) return
        const link = publicService.getWhatsAppLink(company.telefone, message)
        window.open(link, '_blank')
    }

    const handleClearCart = () => {
        clearCart()
        showToast('Carrinho limpo com sucesso')
    }

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
                <div className="size-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                <span className="text-sm text-gray-400">Carregando...</span>
            </div>
        </div>
    )

    if (!company) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center space-y-4">
                <span className="material-symbols-outlined text-5xl text-gray-300">store</span>
                <p className="text-gray-500 text-lg">Loja não encontrada</p>
            </div>
        </div>
    )

    return (
        <StoreLayout
            companyName={company.nome_fantasia}
            logoUrl={company.logo_url}
            telefone={company.telefone}
            email={company.email}
            onCartClick={() => { }}
            appearance={company.store_config?.appearance}
        >
            <Toast message={toastMessage} visible={toastVisible} onClose={() => setToastVisible(false)} />

            <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">

                {/* ── Page Header ── */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate(`/c/${slug}`)}
                            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors text-sm font-medium"
                        >
                            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                            Continuar comprando
                        </button>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[22px] text-gray-900">shopping_bag</span>
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                            Seu Carrinho
                        </h1>
                        {itemCount > 0 && (
                            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-sm">
                                {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                            </span>
                        )}
                    </div>
                </div>

                {/* ── EMPTY STATE ── */}
                {items.length === 0 ? (
                    <div className="text-center py-20">
                        <div className="inline-flex items-center justify-center size-24 bg-gray-100 rounded-full mb-6">
                            <span className="material-symbols-outlined text-5xl text-gray-300">shopping_cart</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Seu carrinho está vazio</h2>
                        <p className="text-gray-400 text-sm mb-8 max-w-xs mx-auto">
                            Explore nossa loja e adicione os produtos que desejar ao seu carrinho.
                        </p>
                        <button
                            onClick={() => navigate(`/c/${slug}`)}
                            className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white rounded-sm px-8 py-3.5 font-bold text-sm transition-all active:scale-[0.98]"
                        >
                            <span className="material-symbols-outlined text-[18px]">storefront</span>
                            Explorar produtos
                        </button>
                    </div>
                ) : (
                    /* ── CART WITH ITEMS ── */
                    <div className="md:grid md:grid-cols-[1fr_360px] md:gap-8 lg:gap-12">

                        {/* ──────── LEFT: ITEM LIST ──────── */}
                        <section>
                            {/* Desktop table header */}
                            <div className="hidden md:grid grid-cols-[1fr_120px_140px_40px] gap-4 pb-3 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <span>Produto</span>
                                <span className="text-center">Quantidade</span>
                                <span className="text-right">Subtotal</span>
                                <span></span>
                            </div>

                            <div className="divide-y divide-gray-100">
                                {items.map((item, idx) => {
                                    const variacaoId = item.variacao?.id
                                    const preco = item.variacao?.preco_varejo || item.variacao?.preco || item.produto.preco_varejo || item.produto.preco
                                    const subtotal = preco * item.quantidade
                                    const imgUrl = item.variacao?.foto_url || item.produto.imagens?.[0]?.imagem_url || item.produto.foto_url
                                    const varLabel = item.variacao ? getVariationLabel(item.variacao) : null

                                    return (
                                        <div
                                            key={idx}
                                            className="py-5 md:grid md:grid-cols-[1fr_120px_140px_40px] md:gap-4 md:items-center flex gap-4"
                                        >
                                            {/* Product info */}
                                            <div className="flex gap-4 items-center flex-1 min-w-0">
                                                <div className="size-20 md:size-[88px] bg-gray-50 rounded-sm overflow-hidden flex-shrink-0 border border-gray-100">
                                                    {imgUrl ? (
                                                        <img
                                                            src={imgUrl}
                                                            alt={item.produto.nome_produto}
                                                            className="w-full h-full object-cover"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <span className="material-symbols-outlined text-3xl text-gray-200">image</span>
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-gray-900 text-sm md:text-base leading-tight line-clamp-2">
                                                        {item.produto.nome_produto}
                                                    </h3>
                                                    {varLabel && (
                                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                                            <span className="material-symbols-outlined text-[12px]">tune</span>
                                                            {varLabel}
                                                        </p>
                                                    )}
                                                    <p className="text-sm font-bold text-gray-900 mt-1.5 md:hidden">
                                                        R$ {fmt(preco)}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Quantity controls */}
                                            <div className="flex items-center justify-center">
                                                <div className="inline-flex items-center border border-gray-200 rounded-sm">
                                                    <button
                                                        onClick={() => updateQuantity(item.produto.id.toString(), item.quantidade - 1, variacaoId)}
                                                        className="size-9 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                                        aria-label="Diminuir quantidade"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">remove</span>
                                                    </button>
                                                    <span className="w-10 text-center text-sm font-bold text-gray-900 select-none border-x border-gray-200">
                                                        {item.quantidade}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.produto.id.toString(), item.quantidade + 1, variacaoId)}
                                                        className="size-9 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                                                        aria-label="Aumentar quantidade"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Subtotal (desktop) */}
                                            <div className="hidden md:block text-right">
                                                <span className="font-bold text-gray-900">
                                                    R$ {fmt(subtotal)}
                                                </span>
                                                {item.quantidade > 1 && (
                                                    <p className="text-[11px] text-gray-400 mt-0.5">
                                                        R$ {fmt(preco)} un.
                                                    </p>
                                                )}
                                            </div>

                                            {/* Remove button */}
                                            <div className="flex items-center justify-center">
                                                <button
                                                    onClick={() => removeItem(item.produto.id.toString(), variacaoId)}
                                                    className="size-9 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-sm transition-all"
                                                    aria-label="Remover item"
                                                >
                                                    <span className="material-symbols-outlined text-[20px]">close</span>
                                                </button>
                                            </div>

                                            {/* Mobile subtotal */}
                                            <div className="md:hidden flex items-center justify-between w-full pt-2 border-t border-gray-50">
                                                <span className="text-xs text-gray-400">Subtotal</span>
                                                <span className="font-bold text-gray-900 text-sm">R$ {fmt(subtotal)}</span>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Clear cart link */}
                            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                                <button
                                    onClick={() => navigate(`/c/${slug}`)}
                                    className="text-sm text-gray-500 hover:text-primary font-medium flex items-center gap-1 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                                    Continuar comprando
                                </button>
                                <button
                                    onClick={handleClearCart}
                                    className="text-xs text-gray-400 hover:text-red-500 font-medium flex items-center gap-1 transition-colors"
                                >
                                    <span className="material-symbols-outlined text-[14px]">delete_sweep</span>
                                    Limpar carrinho
                                </button>
                            </div>
                        </section>

                        {/* ──────── RIGHT: ORDER SUMMARY ──────── */}
                        <aside className="mt-8 md:mt-0">
                            <div className="bg-gray-50 rounded-sm p-6 md:sticky md:top-24">
                                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-5 flex items-center gap-2">
                                    <span className="material-symbols-outlined text-[18px] text-gray-400">receipt_long</span>
                                    Resumo do Pedido
                                </h2>

                                {/* Breakdown */}
                                <div className="space-y-3 pb-5 border-b border-gray-200">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">
                                            Subtotal ({itemCount} {itemCount === 1 ? 'item' : 'itens'})
                                        </span>
                                        <span className="text-gray-700 font-medium">R$ {fmt(total)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Frete</span>
                                        <span className="text-emerald-600 font-semibold text-xs bg-emerald-50 px-2 py-0.5 rounded-sm">
                                            A combinar
                                        </span>
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="flex justify-between items-baseline pt-5 mb-6">
                                    <span className="text-base font-bold text-gray-900">Total</span>
                                    <div className="text-right">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-sm text-gray-500">R$</span>
                                            <span className="text-3xl font-extrabold text-gray-900 tracking-tight">
                                                {fmt(total).split(',')[0]}
                                            </span>
                                            <span className="text-lg font-bold text-gray-900">
                                                ,{fmt(total).split(',')[1]}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA: WhatsApp */}
                                <button
                                    onClick={handleWhatsAppCheckout}
                                    className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-sm py-4 font-bold text-base transition-all active:scale-[0.98] flex items-center justify-center gap-3 shadow-lg shadow-green-500/15"
                                >
                                    <svg viewBox="0 0 24 24" className="size-6 fill-current">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Finalizar pelo WhatsApp
                                </button>

                                {/* Security badges */}
                                <div className="mt-5 flex items-center justify-center gap-4 text-[11px] text-gray-400">
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">lock</span>
                                        Seguro
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">verified_user</span>
                                        Confiável
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-[14px]">support_agent</span>
                                        Suporte
                                    </span>
                                </div>
                            </div>
                        </aside>
                    </div>
                )}
            </div>
        </StoreLayout>
    )
}
