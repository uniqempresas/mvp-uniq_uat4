import { useNavigate } from 'react-router-dom'
import { useCart } from '../../../contexts/CartContext'

interface StoreHeaderProps {
    companyName: string
    onCartClick: () => void
    searchTerm?: string
    onSearchChange?: (term: string) => void
}

export default function StoreHeader({
    companyName,
    onCartClick,
    searchTerm = '',
    onSearchChange
}: StoreHeaderProps) {
    const navigate = useNavigate()
    const { itemCount } = useCart()

    return (
        <header className="sticky top-0 z-50 w-full bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="max-w-[1280px] mx-auto px-6 h-20 flex items-center justify-between gap-8">
                {/* Logo */}
                <div
                    className="flex items-center gap-3 shrink-0 cursor-pointer"
                    onClick={() => navigate(0)} // Or to store home if we had the slug here. 
                >
                    <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-white">
                        <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                    </div>
                    <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-[200px] truncate">{companyName}</h1>
                </div>

                {/* Centralized Search Bar */}
                <div className="flex-1 max-w-2xl hidden md:block">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                            className="w-full h-12 pl-12 pr-4 bg-gray-100 dark:bg-gray-800 border-none rounded-full focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all outline-none"
                            placeholder="O que você está procurando hoje?"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => onSearchChange?.(e.target.value)}
                        />
                    </div>
                </div>

                {/* Mobile Search Icon (visible only on small screens) */}
                <div className="md:hidden flex-1 flex justify-end">
                    {/* Placeholder for now / expand search interaction later */}
                </div>


                {/* Actions */}
                <div className="flex items-center gap-4 shrink-0">
                    <button
                        onClick={onCartClick}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative"
                    >
                        <span className="material-symbols-outlined">shopping_cart</span>
                        {itemCount > 0 && (
                            <span className="absolute top-1 right-1 size-4 bg-primary text-[10px] font-bold text-white rounded-full flex items-center justify-center border-2 border-white dark:border-background-dark">
                                {itemCount}
                            </span>
                        )}
                    </button>

                    <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors hidden sm:block">
                        <span className="material-symbols-outlined">favorite</span>
                    </button>

                    <div className="h-8 w-[1px] bg-gray-200 dark:bg-gray-700 mx-2 hidden sm:block"></div>

                    <button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-full font-bold text-sm transition-all shadow-lg shadow-primary/20">
                        <span className="material-symbols-outlined text-lg">person</span>
                        <span>Entrar</span>
                    </button>
                </div>
            </div>
        </header>
    )
}
