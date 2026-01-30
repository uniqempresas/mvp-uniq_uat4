import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
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
    total: number
    itemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])

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
                if (variacaoId) {
                    return !(item.produto.id.toString() === productId && item.variacao?.id === variacaoId)
                }
                return item.produto.id.toString() !== productId
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
    }, [])

    // Calcular total
    const total = items.reduce((sum, item) => {
        const preco = item.variacao?.preco_varejo || item.variacao?.preco || item.produto.preco_varejo || item.produto.preco
        return sum + (preco * item.quantidade)
    }, 0)

    // Contar itens
    const itemCount = items.reduce((sum, item) => sum + item.quantidade, 0)

    return (
        <CartContext.Provider value={{
            items,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
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
