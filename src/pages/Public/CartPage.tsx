import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { publicService, type PublicCompany } from '../../services/publicService'
import { useCart } from '../../contexts/CartContext'
import StoreLayout from './components/StoreLayout'

export default function CartPage() {
    const { slug } = useParams<{ slug: string }>()
    const navigate = useNavigate()
    const [company, setCompany] = useState<PublicCompany | null>(null)
    const [loading, setLoading] = useState(true)
    const { items, removeItem, updateQuantity, getCartMessage, total, clearCart } = useCart()

    useEffect(() => {
        if (slug) loadCompany(slug)
    }, [slug])

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

    const handleWhatsAppCheckout = () => {
        if (!company?.telefone) return

        const message = getCartMessage()
        if (!message) return

        const link = publicService.getWhatsAppLink(company.telefone, message)
        window.open(link, '_blank')

        // Optional: Clear cart after checkout? 
        // Maybe ask user? For now let's keep it (safer).
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>
    if (!company) return <div className="min-h-screen flex items-center justify-center">Loja não encontrada</div>

    return (
        <StoreLayout
            companyName={company.nome_fantasia}
            onCartClick={() => { }} // Already in cart
            showBackButton={true}
            backPath={`/c/${slug}`}
        >
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Seu Carrinho</h2>

                {items.length === 0 ? (
                    <div className="text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100">
                        <span className="material-symbols-outlined text-4xl text-gray-300 mb-2">shopping_cart_off</span>
                        <p className="text-gray-500">Seu carrinho está vazio</p>
                        <button
                            onClick={() => navigate(`/c/${slug}`)}
                            className="mt-4 text-primary font-medium hover:underline"
                        >
                            Voltar para a loja
                        </button>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item, idx: number) => {
                            const key = item.variacao
                                ? `${item.produto.id}-${item.variacao.id}`
                                : item.produto.id.toString()
                            const variacaoId = item.variacao?.id

                            const preco = item.variacao?.preco_varejo || item.variacao?.preco || item.produto.preco_varejo || item.produto.preco

                            return (
                                <div key={idx} className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 flex gap-3">
                                    <div className="size-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                        {item.produto.imagens?.[0]?.imagem_url ? (
                                            <img src={item.produto.imagens[0].imagem_url} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <span className="material-symbols-outlined text-gray-300">image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="font-medium text-sm line-clamp-1">{item.produto.nome_produto}</h3>
                                            {item.variacao && (
                                                <p className="text-xs text-gray-500">{item.variacao.nome_variacao}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="font-bold text-primary">R$ {preco.toFixed(2).replace('.', ',')}</span>

                                            <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                                                <button
                                                    onClick={() => updateQuantity(item.produto.id.toString(), item.quantidade - 1, variacaoId)}
                                                    className="size-6 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 active:scale-95"
                                                >
                                                    -
                                                </button>
                                                <span className="text-sm font-medium w-4 text-center">{item.quantidade}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.produto.id.toString(), item.quantidade + 1, variacaoId)}
                                                    className="size-6 flex items-center justify-center bg-white rounded shadow-sm text-primary active:scale-95"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeItem(item.produto.id.toString(), variacaoId)}
                                        className="text-gray-400 hover:text-red-500 self-start p-1"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            )
                        })}

                        {/* Summary */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mt-6 sticky bottom-4">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-gray-600">Total</span>
                                <span className="text-xl font-bold text-primary">R$ {total.toFixed(2).replace('.', ',')}</span>
                            </div>

                            <button
                                onClick={handleWhatsAppCheckout}
                                className="w-full bg-green-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-500/20 active:scale-95 transition-transform"
                            >
                                <span className="text-xl">💬</span>
                                Finalizar Pedido no WhatsApp
                            </button>

                            <button
                                onClick={clearCart}
                                className="w-full mt-2 text-xs text-gray-400 py-2 hover:text-red-500"
                            >
                                Limpar carrinho
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </StoreLayout>
    )
}
