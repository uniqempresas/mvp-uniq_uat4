import { useCart } from '../../contexts/CartContext'

interface CartButtonProps {
    onClick: () => void
}

export default function CartButton({ onClick }: CartButtonProps) {
    const { itemCount } = useCart()

    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 size-14 bg-primary rounded-full shadow-lg flex items-center justify-center z-50 active:scale-95 transition-transform"
            aria-label="Abrir carrinho"
        >
            <span className="material-symbols-outlined text-white text-2xl">shopping_cart</span>
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold size-6 rounded-full flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                </span>
            )}
        </button>
    )
}
