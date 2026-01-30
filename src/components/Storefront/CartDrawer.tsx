import { useCart } from '../../contexts/CartContext'
import { publicService } from '../../services/publicService'
import { useState } from 'react'

interface CartDrawerProps {
    isOpen: boolean
    onClose: () => void
    companyPhone?: string
    companyName?: string
}

export default function CartDrawer({ isOpen, onClose, companyPhone, companyName }: CartDrawerProps) {
    const { items, removeItem, updateQuantity, total, clearCart } = useCart()
    const [isCheckingOut, setIsCheckingOut] = useState(false)

    const handleCheckout = () => {
        if (!companyPhone || items.length === 0) return

        // Gerar mensagem WhatsApp
        let message = `🛒 *Novo Pedido - ${companyName || 'Loja'}*\n\n`
        message += `*Itens:*\n`

        items.forEach((item, index) => {
            const variacaoTexto = item.variacao ? ` - ${item.variacao.nome_variacao}` : ''
            const preco = item.variacao?.preco_varejo || item.variacao?.preco || item.produto.preco_varejo || item.produto.preco
            message += `${index + 1}. ${item.quantidade}x ${item.produto.nome_produto}${variacaoTexto} (R$ ${preco.toFixed(2)})\n`
        })

        message += `\n*Total:* R$ ${total.toFixed(2).replace('.', ',')}`

        // Abrir WhatsApp
        window.open(publicService.getWhatsAppLink(companyPhone, message), '_blank')

        // Limpar carrinho após enviar
        setIsCheckingOut(true)
        setTimeout(() => {
            clearCart()
            setIsCheckingOut(false)
            onClose()
        }, 500)
    }

    if (!isOpen) return null

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[80vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex items-center justify-between rounded-t-2xl">
                    <h2 className="font-bold text-lg">Carrinho</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Fechar carrinho"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4">
                    {items.length === 0 ? (
                        <div className="text-center py-12 text-gray-400">
                            <span className="material-symbols-outlined text-5xl mb-2 block">shopping_cart</span>
                            <p>Seu carrinho está vazio</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {items.map((item, index) => {
                                const preco = item.variacao?.preco_varejo || item.variacao?.preco || item.produto.preco_varejo || item.produto.preco
                                const imagem = item.produto.imagens?.[0]?.imagem_url

                                return (
                                    <div key={`${item.produto.id}-${item.variacao?.id || 'no-var'}-${index}`} className="bg-gray-50 rounded-lg p-3 flex gap-3">
                                        {/* Imagem */}
                                        <div className="size-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                            {imagem ? (
                                                <img src={imagem} alt={item.produto.nome_produto} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                    <span className="material-symbols-outlined">image</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-sm leading-tight line-clamp-1">
                                                {item.produto.nome_produto}
                                            </h3>
                                            {item.variacao && (
                                                <p className="text-xs text-gray-500 mt-0.5">{item.variacao.nome_variacao}</p>
                                            )}
                                            <p className="text-sm font-bold text-primary mt-1">
                                                R$ {preco.toFixed(2).replace('.', ',')}
                                            </p>
                                        </div>

                                        {/* Quantidade */}
                                        <div className="flex flex-col items-end justify-between">
                                            <button
                                                onClick={() => removeItem(item.produto.id.toString(), item.variacao?.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                aria-label="Remover item"
                                            >
                                                <span className="material-symbols-outlined text-lg">delete</span>
                                            </button>

                                            <div className="flex items-center gap-2 bg-white rounded-full px-2 py-1 shadow-sm">
                                                <button
                                                    onClick={() => updateQuantity(item.produto.id.toString(), item.quantidade - 1, item.variacao?.id)}
                                                    className="size-5 flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
                                                    aria-label="Diminuir quantidade"
                                                >
                                                    <span className="material-symbols-outlined text-sm">remove</span>
                                                </button>
                                                <span className="text-sm font-medium min-w-[1.5rem] text-center">{item.quantidade}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.produto.id.toString(), item.quantidade + 1, item.variacao?.id)}
                                                    className="size-5 flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
                                                    aria-label="Aumentar quantidade"
                                                >
                                                    <span className="material-symbols-outlined text-sm">add</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {items.length > 0 && (
                    <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-600">Total:</span>
                            <span className="text-2xl font-bold text-primary">
                                R$ {total.toFixed(2).replace('.', ',')}
                            </span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut}
                            className="w-full bg-green-500 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-transform disabled:opacity-50 disabled:scale-100"
                        >
                            {isCheckingOut ? (
                                <span className="text-sm">Enviando...</span>
                            ) : (
                                <>
                                    <span className="text-xl">💬</span>
                                    <span>Finalizar Pedido</span>
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => clearCart()}
                            className="w-full text-red-500 text-sm py-2 hover:underline"
                        >
                            Limpar carrinho
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}
