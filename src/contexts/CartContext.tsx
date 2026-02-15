import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react'
import type { PublicProduct } from '../services/publicService'

// Tipos para o carrinho
export interface CartItem {
    produto: PublicProduct
    quantidade: number
    variacao?: any // Tipo flexível para aceitar qualquer estrutura de variação
}

interface CartContextType {
    items: CartItem[]
    addItem: (product: PublicProduct, variacao?: any) => void
    removeItem: (productId: string, variacaoId?: string) => void
    updateQuantity: (productId: string, quantidade: number, variacaoId?: string) => void
    clearCart: () => void
    getCartMessage: () => string
    total: number
    itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'uniq_cart_items'

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>(() => {
        try {
            const saved = localStorage.getItem(CART_STORAGE_KEY)
            return saved ? JSON.parse(saved) : []
        } catch (error) {
            console.error('Erro ao carregar carrinho:', error)
            return []
        }
    })

    // Persistir carrinho
    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
        } catch (error) {
            console.error('Erro ao salvar carrinho:', error)
        }
    }, [items])

    // Adicionar item ao carrinho
    const addItem = useCallback((product: PublicProduct, variacao?: any) => {
        setItems(prevItems => {
            // Verificar se o item já existe no carrinho
            const itemKey = variacao ? `${product.id}-${variacao.id}` : product.id
            const existingIndex = prevItems.findIndex(item => {
                const existingKey = item.variacao ? `${item.produto.id}-${item.variacao.id}` : item.produto.id
                return existingKey === itemKey
            })

            if (existingIndex >= 0) {
                // Atualizar quantidade se já existe
                const updated = [...prevItems]
                updated[existingIndex] = {
                    ...updated[existingIndex],
                    quantidade: updated[existingIndex].quantidade + 1
                }
                return updated
            }

            // Adicionar novo item
            return [...prevItems, { produto: product, quantidade: 1, variacao }]
        })
    }, [])

    // Remover item do carrinho
    const removeItem = useCallback((productId: string, variacaoId?: string) => {
        setItems(prevItems =>
            prevItems.filter(item => {
                const isTargetProduct = item.produto.id.toString() === productId
                const itemVariacaoId = item.variacao?.id

                // Se não for o produto alvo, mantém
                if (!isTargetProduct) return true

                // Se for o produto, remove APENAS se a variação coincidir (incluindo undefined)
                return itemVariacaoId !== variacaoId
            })
        )
    }, [])

    // Atualizar quantidade
    const updateQuantity = useCallback((productId: string, quantidade: number, variacaoId?: string) => {
        if (quantidade <= 0) {
            removeItem(productId, variacaoId)
            return
        }

        setItems(prevItems =>
            prevItems.map(item => {
                const matches = variacaoId
                    ? item.produto.id.toString() === productId && item.variacao?.id === variacaoId
                    : item.produto.id.toString() === productId && !item.variacao

                if (matches) {
                    return { ...item, quantidade }
                }
                return item
            })
        )
    }, [removeItem])

    // Limpar carrinho
    const clearCart = useCallback(() => {
        setItems([])
        localStorage.removeItem(CART_STORAGE_KEY)
    }, [])

    // Calcular total
    const total = items.reduce((sum, item) => {
        const preco = item.variacao?.preco_varejo || item.variacao?.preco || item.produto.preco_varejo || item.produto.preco
        return sum + (preco * item.quantidade)
    }, 0)

    // Contar itens
    const itemCount = items.reduce((sum, item) => sum + item.quantidade, 0)

    const getCartMessage = useCallback(() => {
        if (items.length === 0) return ''

        const hour = new Date().getHours()
        const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'

        let text = `${greeting}! *🛒 Novo Pedido*\n\n`

        items.forEach((item) => {
            const variacaoDecl = item.variacao ? ` [${item.variacao.nome_variacao}]` : ''
            const precoUnitario = item.variacao?.preco_varejo || item.variacao?.preco || item.produto.preco_varejo || item.produto.preco
            const totalItem = precoUnitario * item.quantidade

            text += `${item.quantidade}x *${item.produto.nome_produto}*${variacaoDecl}\n`
            text += `   R$ ${totalItem.toFixed(2).replace('.', ',')}\n`
        })

        text += `\n*💰 Total: R$ ${total.toFixed(2).replace('.', ',')}*`

        return text
    }, [items, total])

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            getCartMessage,
            total,
            itemCount
        }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within CartProvider')
    }
    return context
}
